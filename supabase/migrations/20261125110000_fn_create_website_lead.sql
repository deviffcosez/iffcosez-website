/*
  Public lead intake used by POST /api/leads (the website contact form and any
  third-party site holding the tenant's publishable API key). The function was
  never created in this database, so every contact-form submission failed with
  "Could not find the function public.fn_create_website_lead".

  Same contract as fn_save_website_lead's insert branch, but:
    - the tenant comes from the caller's x-api-key, via fn_get_request_context
      with the "published." tag a publishable key requires;
    - only first_name is required, status is always 'new';
    - p_data (free-form enquiry details such as the investor requirements) is
      stored as given, capped in size because this is a public endpoint.
*/
CREATE OR REPLACE FUNCTION public.fn_create_website_lead(
    p_first_name      text,
    p_last_name       text    DEFAULT NULL,
    p_company         text    DEFAULT NULL,
    p_email           text    DEFAULT NULL,
    p_phone           text    DEFAULT NULL,
    p_mobile          text    DEFAULT NULL,
    p_job_title       text    DEFAULT NULL,
    p_website         text    DEFAULT NULL,
    p_address         jsonb   DEFAULT NULL,
    p_lead_source     text    DEFAULT NULL,
    p_estimated_value numeric DEFAULT NULL,
    p_description     text    DEFAULT NULL,
    p_data            jsonb   DEFAULT '{}'::jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_ctx t_request_context;
  v_id  bigint;
  v_row jsonb;
BEGIN
  BEGIN
    v_ctx := fn_get_request_context('published.fn_create_website_lead');

    IF p_first_name IS NULL OR length(trim(p_first_name)) = 0 THEN
      RAISE EXCEPTION 'first_name is required';
    END IF;
    IF length(p_first_name) > 200 OR length(COALESCE(p_description, '')) > 5000 THEN
      RAISE EXCEPTION 'first_name or description is too long';
    END IF;
    IF p_data IS NOT NULL AND (jsonb_typeof(p_data) <> 'object' OR length(p_data::text) > 8000) THEN
      RAISE EXCEPTION 'data must be a JSON object of at most 8000 characters';
    END IF;

    INSERT INTO public.website_leads (
      tenant_id, first_name, last_name, company, email, phone, mobile,
      job_title, website, address, lead_source, status, estimated_value,
      description, data, is_active, created_by, created_at
    ) VALUES (
      v_ctx.tenant_id,
      trim(p_first_name),
      NULLIF(trim(COALESCE(p_last_name, '')), ''),
      NULLIF(trim(COALESCE(p_company, '')), ''),
      NULLIF(trim(COALESCE(p_email, '')), ''),
      NULLIF(trim(COALESCE(p_phone, '')), ''),
      NULLIF(trim(COALESCE(p_mobile, '')), ''),
      NULLIF(trim(COALESCE(p_job_title, '')), ''),
      NULLIF(trim(COALESCE(p_website, '')), ''),
      p_address,
      NULLIF(trim(COALESCE(p_lead_source, '')), ''),
      'new',
      p_estimated_value,
      NULLIF(trim(COALESCE(p_description, '')), ''),
      COALESCE(p_data, '{}'::jsonb),
      true,
      v_ctx.user_id,
      now()
    )
    RETURNING id INTO v_id;

    SELECT to_jsonb(t) INTO v_row
    FROM (
      SELECT
        wl.id, wl.tenant_id, wl.first_name, wl.last_name, wl.company, wl.email,
        wl.phone, wl.mobile, wl.job_title, wl.website, wl.address, wl.lead_source,
        wl.status, wl.rating, wl.estimated_value, wl.owner_id, wl.description,
        wl.tags, wl.converted_at, COALESCE(wl.data, '{}'::jsonb) AS data,
        wl.is_active, wl.created_at, wl.updated_at
      FROM public.website_leads wl
      WHERE wl.id = v_id
    ) t;

    RETURN fn_response_success(
      p_data          := jsonb_build_array(v_row),
      p_message       := 'Lead created successfully',
      p_total_records := 1,
      p_page_size     := 1,
      p_page_index    := 1
    );
  EXCEPTION WHEN OTHERS THEN
    RETURN fn_response_error(
      'fn_create_website_lead',
      SQLERRM,
      '[]'::jsonb,
      v_ctx.tenant_id,
      v_ctx.user_id
    );
  END;
END;
$function$;

REVOKE ALL ON FUNCTION public.fn_create_website_lead(text, text, text, text, text, text, text, text, jsonb, text, numeric, text, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.fn_create_website_lead(text, text, text, text, text, text, text, text, jsonb, text, numeric, text, jsonb) TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
