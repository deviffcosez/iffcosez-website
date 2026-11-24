/*
  Footer location in the admin Navigation editor, and a fix to the public read.

  - fn_get_website_nav is recreated from its latest definition (with
    description, from 20260925100300) plus footer_group / footer_sort. The copy
    in 20261124090000 predates description, so this restores it.
  - fn_get_website_nav_items returns footer_group / footer_sort.
  - fn_save_website_nav_item gains p_footer_group / p_footer_sort (dropped and
    recreated: a new parameter changes the function's identity). A NULL group
    removes the item from the footer.
*/

CREATE OR REPLACE FUNCTION public.fn_get_website_nav(
    p_locale text DEFAULT NULL::text
)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    v_ctx    t_request_context;
    v_result jsonb;
    -- NULL = English: no translation join.
    v_locale text := NULLIF(NULLIF(lower(trim(COALESCE(p_locale, ''))), ''), 'en');
BEGIN
    BEGIN
        v_ctx := fn_get_request_context('published.fn_get_website_nav');

        WITH RECURSIVE tree AS (
            SELECT ni.*, ni.slug::text AS path, 0 AS depth
            FROM   public.website_nav_items ni
            WHERE  ni.tenant_id = v_ctx.tenant_id
              AND  ni.parent_id IS NULL
              AND  ni.is_active AND ni.published
            UNION ALL
            SELECT ni.*, tree.path || '/' || ni.slug, tree.depth + 1
            FROM   public.website_nav_items ni
            JOIN   tree ON ni.parent_id = tree.id
            WHERE  ni.is_active AND ni.published
        )
        SELECT COALESCE(jsonb_agg(to_jsonb(r) ORDER BY r.depth, r.sort_order, r.id), '[]'::jsonb)
        INTO   v_result
        FROM (
            SELECT
                t.id,
                t.parent_id,
                t.slug,
                t.path,
                t.depth,
                t.kind,
                COALESCE(tr.title, t.title)                         AS title,
                COALESCE(tr.description, t.description)             AS description,
                t.href,
                COALESCE(tr.body_html, t.body_html)                 AS body_html,
                COALESCE(tr.file_path, t.file_path)                 AS file_path,
                CASE WHEN tr.file_path IS NOT NULL THEN tr.file_name
                     ELSE t.file_name END                           AS file_name,
                t.open_in_new_tab,
                t.show_in_menu,
                t.footer_group,
                t.footer_sort,
                t.sort_order,
                t.updated_at,
                CASE WHEN tr.id IS NOT NULL THEN v_locale ELSE 'en' END AS locale,
                (v_locale IS NOT NULL AND tr.id IS NULL)            AS is_fallback,
                -- The PDF is the English one although the text is translated
                -- (or the whole item is untranslated).
                (v_locale IS NOT NULL AND t.kind = 'document'
                    AND tr.file_path IS NULL)                       AS file_is_fallback
            FROM tree t
            LEFT JOIN public.website_nav_item_translations tr
                   ON  v_locale IS NOT NULL
                   AND tr.item_id   = t.id
                   AND tr.locale    = v_locale
                   AND tr.is_active
                   AND tr.published
        ) r;

        RETURN fn_response_success(
            p_data          := v_result,
            p_message       := 'Website navigation retrieved successfully',
            p_total_records := jsonb_array_length(v_result),
            p_page_size     := jsonb_array_length(v_result),
            p_page_index    := 1
        );

    EXCEPTION WHEN OTHERS THEN
        RETURN fn_response_error(
            'fn_get_website_nav',
            SQLERRM,
            '[]'::jsonb,
            v_ctx.tenant_id,
            v_ctx.user_id
        );
    END;
END;
$function$;

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
              AND fn_can_access_row(ni, v_ctx)
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

-- Drop every existing overload (whatever its parameters), so no ambiguous
-- PostgREST overload is left behind; it is recreated in full just below.
DO $drop$
DECLARE f record;
BEGIN
    FOR f IN
        SELECT p.oid::regprocedure AS sig
        FROM pg_proc p
        WHERE p.pronamespace = 'public'::regnamespace AND p.proname = 'fn_save_website_nav_item'
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

            IF NOT FOUND OR NOT fn_can_access_row(v_item, v_ctx) THEN
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

REVOKE ALL ON FUNCTION public.fn_save_website_nav_item(integer, integer, text, text, text, text, text, text, text, boolean, boolean, boolean, text, text, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.fn_save_website_nav_item(integer, integer, text, text, text, text, text, text, text, boolean, boolean, boolean, text, text, integer) TO authenticated, service_role;
REVOKE ALL ON FUNCTION public.fn_get_website_nav(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.fn_get_website_nav(text) TO anon, authenticated, service_role;

-- ── Pages with no coded route are admin-edited ───────────────────────────
-- Business Opportunities and Client Visits had no page of their own (they
-- pointed at other pages), so they become CMS pages: editable as HTML from
-- Admin > Navigation, served at /business-opportunities/ and /client-visits/.
-- Switch an item back to "link" there to point it at a coded page instead.
UPDATE public.website_nav_items
SET kind = 'page',
    href = NULL,
    body_html = COALESCE(body_html, '<p>Content coming soon.</p>'),
    updated_at = now()
WHERE is_active
  AND parent_id IS NULL
  AND slug IN ('business-opportunities', 'client-visits')
  AND kind = 'link';
