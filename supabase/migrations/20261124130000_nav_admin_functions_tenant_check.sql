/*
  Admin navigation functions, in this database's access model.

  iffcosez_db has no fn_can_access_row (its other functions check
  tenant_id IS NOT DISTINCT FROM the caller's tenant), and was missing
  fn_reorder_website_nav_items and the nav translation functions entirely.
  20261124100000 had replaced the working read/save with versions calling the
  missing helper, so Admin > Navigation failed. This recreates the admin set:
  read, save (with footer location), reorder, translation save/delete.
*/

CREATE OR REPLACE FUNCTION public.fn_get_website_nav_items()
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    v_ctx    t_request_context;
    v_result jsonb;
BEGIN
    BEGIN
        v_ctx := fn_get_request_context('fn_get_website_nav_items');

        SELECT COALESCE(jsonb_agg(to_jsonb(r) ORDER BY r.parent_id NULLS FIRST, r.sort_order, r.id), '[]'::jsonb)
        INTO   v_result
        FROM (
            SELECT
                ni.id, ni.parent_id, ni.slug, ni.kind, ni.title, ni.description, ni.href, ni.body_html,
                ni.file_path, ni.file_name, ni.open_in_new_tab, ni.show_in_menu, ni.footer_group, ni.footer_sort,
                ni.sort_order, ni.published, ni.created_at, ni.updated_at,
                COALESCE((
                    SELECT jsonb_agg(jsonb_build_object(
                               'locale',      tr.locale,
                               'title',       tr.title,
                               'description', tr.description,
                               'body_html',   tr.body_html,
                               'file_path',   tr.file_path,
                               'file_name',   tr.file_name,
                               'published',   tr.published,
                               'updated_at',  tr.updated_at
                           ) ORDER BY tr.locale)
                    FROM public.website_nav_item_translations tr
                    WHERE tr.item_id = ni.id AND tr.is_active
                ), '[]'::jsonb) AS translations
            FROM public.website_nav_items ni
            WHERE ni.tenant_id = v_ctx.tenant_id
              AND ni.is_active
              AND (ni.tenant_id IS NOT DISTINCT FROM v_ctx.tenant_id)
        ) r;

        RETURN fn_response_success(
            p_data          := v_result,
            p_message       := 'Website navigation items retrieved successfully',
            p_total_records := jsonb_array_length(v_result),
            p_page_size     := jsonb_array_length(v_result),
            p_page_index    := 1
        );

    EXCEPTION WHEN OTHERS THEN
        RETURN fn_response_error(
            'fn_get_website_nav_items',
            SQLERRM,
            '[]'::jsonb,
            v_ctx.tenant_id,
            v_ctx.user_id
        );
    END;
END;
$function$;


DO $drop$
DECLARE f record;
BEGIN
    FOR f IN SELECT p.oid::regprocedure AS sig FROM pg_proc p
             WHERE p.pronamespace = 'public'::regnamespace
               AND p.proname IN ('fn_save_website_nav_item', 'fn_save_website_nav_item_translation')
    LOOP
        EXECUTE 'DROP FUNCTION ' || f.sig;
    END LOOP;
END;
$drop$;

CREATE FUNCTION public.fn_save_website_nav_item(
    p_id              integer DEFAULT NULL::integer,
    p_parent_id       integer DEFAULT NULL::integer,
    p_slug            text    DEFAULT NULL::text,
    p_kind            text    DEFAULT NULL::text,
    p_title           text    DEFAULT NULL::text,
    p_href            text    DEFAULT NULL::text,
    p_body_html       text    DEFAULT NULL::text,
    p_file_path       text    DEFAULT NULL::text,
    p_file_name       text    DEFAULT NULL::text,
    p_open_in_new_tab boolean DEFAULT false,
    p_show_in_menu    boolean DEFAULT true,
    p_published       boolean DEFAULT true,
    p_description     text    DEFAULT NULL::text,
    p_footer_group    text    DEFAULT NULL::text,
    p_footer_sort     integer DEFAULT NULL::integer
)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    v_ctx      t_request_context;
    v_item     public.website_nav_items;
    v_parent   public.website_nav_items;
    v_slug     text := lower(trim(COALESCE(p_slug, '')));
    v_kind     text := lower(trim(COALESCE(p_kind, '')));
    v_href     text := NULLIF(trim(COALESCE(p_href, '')), '');
    v_body     text := NULLIF(trim(COALESCE(p_body_html, '')), '');
    v_file     text := NULLIF(trim(COALESCE(p_file_path, '')), '');
    v_fname    text := NULLIF(trim(COALESCE(p_file_name, '')), '');
    v_desc     text := NULLIF(trim(COALESCE(p_description, '')), '');
    v_tenant   integer;
    v_order    integer;
    v_id       integer;
    v_row      jsonb;
    v_footer   text := NULLIF(lower(trim(COALESCE(p_footer_group, ''))), '');
BEGIN
    BEGIN
        v_ctx := fn_get_request_context('fn_save_website_nav_item');
        v_tenant := v_ctx.tenant_id;

        -- ── Input guards ────────────────────────────────────────────
        IF v_footer IS NOT NULL AND v_footer NOT IN ('explore', 'information') THEN
            RAISE EXCEPTION 'footer location must be explore or information';
        END IF;
        IF v_kind NOT IN ('link', 'page', 'document') THEN
            RAISE EXCEPTION 'kind must be link, page or document';
        END IF;
        IF p_title IS NULL OR length(trim(p_title)) = 0 THEN
            RAISE EXCEPTION 'title is required';
        END IF;
        IF v_slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$' THEN
            RAISE EXCEPTION 'slug must be lowercase letters, numbers and single hyphens (got "%")', p_slug;
        END IF;
        IF v_kind = 'link' AND v_href IS NULL THEN
            RAISE EXCEPTION 'A link needs a route or URL';
        END IF;
        IF v_kind = 'document' AND v_file IS NULL THEN
            RAISE EXCEPTION 'A document needs an uploaded PDF';
        END IF;

        -- ── Existing row: same tenant + row access ──────────────────
        IF p_id IS NOT NULL THEN
            SELECT * INTO v_item
            FROM public.website_nav_items ni
            WHERE ni.id = p_id AND ni.tenant_id = v_tenant AND ni.is_active;

            IF NOT FOUND OR NOT (v_item.tenant_id IS NOT DISTINCT FROM v_ctx.tenant_id) THEN
                RAISE EXCEPTION 'Navigation item with ID % not found or access denied', p_id;
            END IF;

            IF v_kind = 'document' AND EXISTS (
                SELECT 1 FROM public.website_nav_items c
                WHERE c.parent_id = p_id AND c.is_active
            ) THEN
                RAISE EXCEPTION 'An item with children can''t become a document';
            END IF;
        END IF;

        -- ── Parent: same tenant, not a document, no cycle ───────────
        IF p_parent_id IS NOT NULL THEN
            SELECT * INTO v_parent
            FROM public.website_nav_items ni
            WHERE ni.id = p_parent_id AND ni.tenant_id = v_tenant AND ni.is_active;

            IF NOT FOUND THEN
                RAISE EXCEPTION 'Parent item with ID % not found', p_parent_id;
            END IF;
            IF v_parent.kind = 'document' THEN
                RAISE EXCEPTION 'A document can''t have child items';
            END IF;

            IF p_id IS NOT NULL AND EXISTS (
                WITH RECURSIVE sub AS (
                    SELECT p_id AS id
                    UNION ALL
                    SELECT c.id FROM public.website_nav_items c JOIN sub ON c.parent_id = sub.id
                )
                SELECT 1 FROM sub WHERE sub.id = p_parent_id
            ) THEN
                RAISE EXCEPTION 'An item can''t be moved under itself or one of its children';
            END IF;
        END IF;

        -- ── Sibling slug uniqueness (friendly message before the index) ──
        IF EXISTS (
            SELECT 1 FROM public.website_nav_items s
            WHERE s.tenant_id = v_tenant
              AND s.is_active
              AND COALESCE(s.parent_id, 0) = COALESCE(p_parent_id, 0)
              AND s.slug = v_slug
              AND s.id IS DISTINCT FROM p_id
        ) THEN
            RAISE EXCEPTION 'Another item at this level already uses the slug "%"', v_slug;
        END IF;

        -- New items, and items moved to a new parent, go to the end.
        IF p_id IS NULL OR v_item.parent_id IS DISTINCT FROM p_parent_id THEN
            SELECT COALESCE(max(s.sort_order), 0) + 1 INTO v_order
            FROM public.website_nav_items s
            WHERE s.tenant_id = v_tenant
              AND s.is_active
              AND COALESCE(s.parent_id, 0) = COALESCE(p_parent_id, 0);
        ELSE
            v_order := v_item.sort_order;
        END IF;

        IF p_id IS NULL THEN
            INSERT INTO public.website_nav_items (
                parent_id, slug, kind, title, description, href, body_html, file_path, file_name,
                open_in_new_tab, show_in_menu, sort_order, published, footer_group, footer_sort,
                tenant_id, is_active, created_by, created_at
            ) VALUES (
                p_parent_id, v_slug, v_kind, trim(p_title), v_desc, v_href, v_body, v_file, v_fname,
                COALESCE(p_open_in_new_tab, false), COALESCE(p_show_in_menu, true),
                v_order, COALESCE(p_published, true), v_footer, COALESCE(p_footer_sort, 0),
                v_tenant, true, v_ctx.user_id, now()
            )
            RETURNING id INTO v_id;
        ELSE
            UPDATE public.website_nav_items ni
            SET    parent_id       = p_parent_id,
                   slug            = v_slug,
                   kind            = v_kind,
                   title           = trim(p_title),
                   description     = v_desc,
                   href            = v_href,
                   body_html       = v_body,
                   file_path       = v_file,
                   file_name       = v_fname,
                   open_in_new_tab = COALESCE(p_open_in_new_tab, false),
                   show_in_menu    = COALESCE(p_show_in_menu, true),
                   footer_group    = v_footer,
                   footer_sort     = COALESCE(p_footer_sort, ni.footer_sort),
                   sort_order      = v_order,
                   published       = COALESCE(p_published, true),
                   updated_at      = now(),
                   updated_by      = v_ctx.user_id
            WHERE  ni.id = p_id;
            v_id := p_id;
        END IF;

        SELECT to_jsonb(t) INTO v_row
        FROM (
            SELECT ni.id, ni.parent_id, ni.slug, ni.kind, ni.title, ni.description, ni.href, ni.body_html,
                   ni.file_path, ni.file_name, ni.open_in_new_tab, ni.show_in_menu, ni.footer_group, ni.footer_sort,
                   ni.sort_order, ni.published, ni.created_at, ni.updated_at
            FROM public.website_nav_items ni
            WHERE ni.id = v_id
        ) t;

        RETURN fn_response_success(
            p_data          := jsonb_build_array(v_row),
            p_message       := 'Navigation item saved successfully',
            p_total_records := 1,
            p_page_size     := 1,
            p_page_index    := 1
        );

    EXCEPTION WHEN OTHERS THEN
        RETURN fn_response_error(
            'fn_save_website_nav_item',
            SQLERRM,
            '[]'::jsonb,
            v_ctx.tenant_id,
            v_ctx.user_id
        );
    END;
END;
$function$;


CREATE OR REPLACE FUNCTION public.fn_reorder_website_nav_items(
    p_ids integer[] DEFAULT NULL::integer[]
)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    v_ctx     t_request_context;
    v_count   integer;
    v_parents integer;
BEGIN
    BEGIN
        v_ctx := fn_get_request_context('fn_reorder_website_nav_items');

        IF p_ids IS NULL OR cardinality(p_ids) = 0 THEN
            RAISE EXCEPTION 'ids are required';
        END IF;

        SELECT count(*), count(DISTINCT COALESCE(ni.parent_id, 0))
        INTO   v_count, v_parents
        FROM   public.website_nav_items ni
        WHERE  ni.id = ANY(p_ids)
          AND  ni.tenant_id = v_ctx.tenant_id
          AND  ni.is_active
          AND  (ni.tenant_id IS NOT DISTINCT FROM v_ctx.tenant_id);

        IF v_count <> cardinality(p_ids) THEN
            RAISE EXCEPTION 'One or more navigation items not found or access denied';
        END IF;
        IF v_parents <> 1 THEN
            RAISE EXCEPTION 'Only items under the same parent can be reordered together';
        END IF;

        UPDATE public.website_nav_items ni
        SET    sort_order = o.pos,
               updated_at = now(),
               updated_by = v_ctx.user_id
        FROM   unnest(p_ids) WITH ORDINALITY AS o(id, pos)
        WHERE  ni.id = o.id
          AND  ni.sort_order IS DISTINCT FROM o.pos::integer;

        RETURN fn_response_success(
            p_data          := '[]'::jsonb,
            p_message       := 'Navigation items reordered successfully',
            p_total_records := 0,
            p_page_size     := 0,
            p_page_index    := 1
        );

    EXCEPTION WHEN OTHERS THEN
        RETURN fn_response_error(
            'fn_reorder_website_nav_items',
            SQLERRM,
            '[]'::jsonb,
            v_ctx.tenant_id,
            v_ctx.user_id
        );
    END;
END;
$function$;


CREATE FUNCTION public.fn_save_website_nav_item_translation(
    p_item_id     integer DEFAULT NULL::integer,
    p_locale      text    DEFAULT NULL::text,
    p_title       text    DEFAULT NULL::text,
    p_body_html   text    DEFAULT NULL::text,
    p_file_path   text    DEFAULT NULL::text,
    p_file_name   text    DEFAULT NULL::text,
    p_published   boolean DEFAULT true,
    p_description text    DEFAULT NULL::text
)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    v_ctx    t_request_context;
    v_item   public.website_nav_items;
    v_locale text := lower(trim(COALESCE(p_locale, '')));
    v_file   text := NULLIF(trim(COALESCE(p_file_path, '')), '');
BEGIN
    BEGIN
        v_ctx := fn_get_request_context('fn_save_website_nav_item_translation');

        IF v_locale !~ '^[a-z]{2,3}$' THEN
            RAISE EXCEPTION 'Invalid locale "%"', p_locale;
        END IF;
        IF v_locale = 'en' THEN
            RAISE EXCEPTION 'English content is saved on the navigation item itself, not as a translation';
        END IF;
        IF p_title IS NULL OR length(trim(p_title)) = 0 THEN
            RAISE EXCEPTION 'title is required';
        END IF;

        SELECT * INTO v_item
        FROM public.website_nav_items ni
        WHERE ni.id = p_item_id AND ni.tenant_id = v_ctx.tenant_id AND ni.is_active;

        IF NOT FOUND OR NOT (v_item.tenant_id IS NOT DISTINCT FROM v_ctx.tenant_id) THEN
            RAISE EXCEPTION 'Navigation item with ID % not found or access denied', p_item_id;
        END IF;

        INSERT INTO public.website_nav_item_translations AS tr (
            item_id, locale, title, description, body_html, file_path, file_name, published,
            tenant_id, is_active, created_by, created_at
        ) VALUES (
            p_item_id,
            v_locale,
            trim(p_title),
            NULLIF(trim(COALESCE(p_description, '')), ''),
            NULLIF(trim(COALESCE(p_body_html, '')), ''),
            v_file,
            CASE WHEN v_file IS NULL THEN NULL ELSE NULLIF(trim(COALESCE(p_file_name, '')), '') END,
            COALESCE(p_published, true),
            v_item.tenant_id, true, v_ctx.user_id, now()
        )
        ON CONFLICT (item_id, locale) DO UPDATE SET
            title       = EXCLUDED.title,
            description = EXCLUDED.description,
            body_html   = EXCLUDED.body_html,
            file_path   = EXCLUDED.file_path,
            file_name   = EXCLUDED.file_name,
            published   = EXCLUDED.published,
            is_active   = true,
            updated_at  = now(),
            updated_by  = v_ctx.user_id;

        RETURN fn_response_success(
            p_data          := '[]'::jsonb,
            p_message       := 'Navigation item translation saved successfully',
            p_total_records := 1,
            p_page_size     := 1,
            p_page_index    := 1
        );

    EXCEPTION WHEN OTHERS THEN
        RETURN fn_response_error(
            'fn_save_website_nav_item_translation',
            SQLERRM,
            '[]'::jsonb,
            v_ctx.tenant_id,
            v_ctx.user_id
        );
    END;
END;
$function$;

CREATE OR REPLACE FUNCTION public.fn_delete_website_nav_item_translation(
    p_item_id integer DEFAULT NULL::integer,
    p_locale  text    DEFAULT NULL::text
)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    v_ctx    t_request_context;
    v_item   public.website_nav_items;
    v_locale text := lower(trim(COALESCE(p_locale, '')));
BEGIN
    BEGIN
        v_ctx := fn_get_request_context('fn_delete_website_nav_item_translation');

        SELECT * INTO v_item
        FROM public.website_nav_items ni
        WHERE ni.id = p_item_id AND ni.tenant_id = v_ctx.tenant_id AND ni.is_active;

        IF NOT FOUND OR NOT (v_item.tenant_id IS NOT DISTINCT FROM v_ctx.tenant_id) THEN
            RAISE EXCEPTION 'Navigation item with ID % not found or access denied', p_item_id;
        END IF;

        UPDATE public.website_nav_item_translations tr
        SET    is_active  = false,
               updated_at = now(),
               updated_by = v_ctx.user_id
        WHERE  tr.item_id = p_item_id
          AND  tr.locale  = v_locale
          AND  tr.is_active;

        RETURN fn_response_success(
            p_data          := '[]'::jsonb,
            p_message       := 'Navigation item translation deleted successfully',
            p_total_records := 0,
            p_page_size     := 0,
            p_page_index    := 1
        );

    EXCEPTION WHEN OTHERS THEN
        RETURN fn_response_error(
            'fn_delete_website_nav_item_translation',
            SQLERRM,
            '[]'::jsonb,
            v_ctx.tenant_id,
            v_ctx.user_id
        );
    END;
END;
$function$;


REVOKE ALL ON FUNCTION public.fn_get_website_nav_items() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.fn_save_website_nav_item(integer, integer, text, text, text, text, text, text, text, boolean, boolean, boolean, text, text, integer) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.fn_reorder_website_nav_items(integer[]) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.fn_save_website_nav_item_translation(integer, text, text, text, text, text, boolean, text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.fn_delete_website_nav_item_translation(integer, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.fn_get_website_nav_items() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.fn_save_website_nav_item(integer, integer, text, text, text, text, text, text, text, boolean, boolean, boolean, text, text, integer) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.fn_reorder_website_nav_items(integer[]) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.fn_save_website_nav_item_translation(integer, text, text, text, text, text, boolean, text) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.fn_delete_website_nav_item_translation(integer, text) TO authenticated, service_role;
