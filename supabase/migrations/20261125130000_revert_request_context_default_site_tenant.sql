/*
  Reverts 20261125120000_request_context_default_site_tenant.sql: the website keeps
  using its tenant publishable key (NEXT_PUBLIC_IKSEZ_PUBLISHABLE_KEY), so an
  anonymous call with no key and no session is rejected again, exactly as before.
*/
CREATE OR REPLACE FUNCTION public.fn_get_request_context(p_caller_function text DEFAULT NULL::text)
 RETURNS TABLE(tenant_id integer, user_id integer, caller_id integer, allowed_schema text, role_ids integer[], is_admin boolean)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_caller_id  integer := NULL;
  v_tenant_id  integer;
  v_user_id  integer;
  v_api_key  text;
  v_is_publishable  boolean := false;
  v_auth_uid  uuid;
  v_schema  text;
  v_role_ids  integer[];
  v_is_admin  boolean;
  v_lookup_function text;
  v_is_published  boolean := false;
BEGIN
  -- ── Resolve API key from headers first — needed for permission checks below ──
  BEGIN
    v_api_key := current_setting('request.headers', true)::json->>'x-api-key';
  EXCEPTION
    WHEN OTHERS THEN v_api_key := NULL;
  END;

  v_is_publishable := v_api_key LIKE 'sk_publishable_%';

  -- ── Normalize caller_function and enforce publishable-key scoping ──
  IF p_caller_function IS NOT NULL THEN
    v_is_published := p_caller_function LIKE 'published.%';
    IF v_is_published THEN
      v_lookup_function := substring(p_caller_function FROM length('published.') + 1);
    ELSE
      v_lookup_function := p_caller_function;
    END IF;

    -- sk_publishable_ keys may ONLY call functions tagged "published."
    -- Plain sk_ (secret) keys and JWT sessions are unrestricted.
    IF v_is_publishable AND NOT v_is_published THEN
      RAISE EXCEPTION 'Publishable API key is not permitted to call %', p_caller_function
        USING ERRCODE = '28000';
    END IF;

    SELECT id INTO v_caller_id
    FROM pages
    WHERE v_lookup_function IN (
      binding_name_get,
      binding_name_post,
      binding_name_delete
    )
    LIMIT 1;
  ELSIF v_is_publishable THEN
    -- publishable key with no caller_function to check against — deny by default
    RAISE EXCEPTION 'Publishable API key requires a caller function'
      USING ERRCODE = '28000';
  END IF;

  -- ── Resolve identity ────────────────────────────────────────
  IF v_api_key IS NOT NULL AND v_api_key != '' THEN
    IF v_is_publishable THEN
      SELECT p.tenant_id, p.id, t.access_control->>'schema'
      INTO v_tenant_id, v_user_id, v_schema
      FROM profiles p
      INNER JOIN tenants t ON p.tenant_id = t.id
      WHERE p.access_control->>'x_publishable_api_key' = v_api_key
        AND p.is_active = true
        AND t.is_active = true;
    ELSE
      SELECT p.tenant_id, p.id, t.access_control->>'schema'
      INTO v_tenant_id, v_user_id, v_schema
      FROM profiles p
      INNER JOIN tenants t ON p.tenant_id = t.id
      WHERE p.access_control->>'x_api_key' = v_api_key
        AND p.is_active = true
        AND t.is_active = true;
    END IF;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Invalid or inactive API key'
        USING ERRCODE = '28000';
    END IF;
  ELSE
    v_auth_uid := auth.uid();

    IF v_auth_uid IS NULL THEN
      RAISE EXCEPTION 'No valid authentication found (neither JWT nor API key)'
        USING ERRCODE = '28000';
    END IF;

    SELECT p.tenant_id, p.id, t.access_control->>'schema'
    INTO v_tenant_id, v_user_id, v_schema
    FROM profiles p
    INNER JOIN tenants t ON p.tenant_id = t.id
    WHERE p.user_id  = v_auth_uid
      AND t.is_active = true
      AND p.is_active = true;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Authenticated user not found or inactive in profiles table'
        USING ERRCODE = '28000';
    END IF;
  END IF;

  -- ── Resolve roles and admin from profiles ONCE ──────────────
  SELECT
    ARRAY(
      SELECT jsonb_array_elements_text(p.access_control->'roles')::integer
      FROM profiles p
      WHERE p.id = v_user_id
    ),
    COALESCE(
      (
        SELECT (p.access_control->>'is_admin')::boolean
        FROM profiles p
        WHERE p.id = v_user_id
      ),
      false
    )
  INTO v_role_ids, v_is_admin;

  IF v_schema IS NULL THEN
    v_schema := 'public';
  END IF;

  RETURN QUERY
  SELECT
    v_tenant_id,
    v_user_id,
    v_caller_id,
    v_schema,
    v_role_ids,
    v_is_admin;
END;
$function$;
