/*
  Footer navigation now comes from website_nav_items like the header.

  - footer_group ('explore' | 'information') puts an item in that footer
    column, footer_sort orders it there; NULL = not in the footer. The
    header keeps using show_in_menu / sort_order, so one item can be in the
    header, the footer or both.
  - fn_get_website_nav returns both columns.
  - Every page is a row: its slug is its route name and its title its menu
    name (agreed page/route table). The header shows root items with
    show_in_menu, the footer those with footer_group: both menus come from
    this table, nothing is listed in code.
*/

ALTER TABLE public.website_nav_items
    ADD COLUMN IF NOT EXISTS footer_group text
        CHECK (footer_group IN ('explore', 'information')),
    ADD COLUMN IF NOT EXISTS footer_sort integer NOT NULL DEFAULT 0;

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

GRANT EXECUTE ON FUNCTION public.fn_get_website_nav(text) TO anon, authenticated, service_role;

DO $migration$
DECLARE
    v_tenant integer;
    v_admin  integer;
    v_id     integer;
    v_parent integer;
    r record;
BEGIN
    SELECT t.id INTO v_tenant
    FROM public.tenants t
    WHERE t.name = 'IFFCO SEZ' AND t.is_active
    ORDER BY t.id LIMIT 1;

    IF v_tenant IS NULL THEN
        RAISE NOTICE 'Tenant "IFFCO SEZ" not found; skipping navigation seed';
        RETURN;
    END IF;

    SELECT ni.created_by INTO v_admin
    FROM public.website_nav_items ni
    WHERE ni.tenant_id = v_tenant AND ni.is_active
    ORDER BY ni.id LIMIT 1;

    IF v_admin IS NULL THEN
        RAISE NOTICE 'No existing nav item to take an author from; skipping navigation seed';
        RETURN;
    END IF;

    -- Root pages. slug = route name, title = menu name, href = '/' || slug || '/'.
    -- old_slug is the slug an existing row has today (found and renamed in
    -- place, so its translations and sort history stay); missing rows are created.
    -- menu_sort NULL = not in the header; footer_group NULL = not in the footer.
    FOR r IN
        SELECT * FROM (VALUES
            ('home',                    NULL::text,                     'IFFCO Kisan SEZ',          'IFFCO కిసాన్ SEZ',                         '/',                         NULL::int, NULL::text,   0),
            ('about-us',                NULL,                           'About Us',                 NULL,                                        '/about-us/',                1,    'explore',     1),
            ('leadership',              NULL,                           'Leadership',               NULL,                                        '/leadership/',              2,    NULL,          0),
            ('connectivity-eco-system', 'connectivity-ecosystem-menu',  'Connectivity / Eco System','కనెక్టివిటీ / పర్యావరణ వ్యవస్థ',              '/connectivity-eco-system/', 3,    'explore',     3),
            ('infrastructure',          'infrastructure-menu',          'Infrastructure',           'మౌలిక సదుపాయాలు',                           '/infrastructure/',          5,    'explore',     5),
            ('customers',               'customers-menu',               'Customers',                'కస్టమర్లు',                                 '/customers/',               6,    'information', 2),
            ('eco-systems',             'ecosystems-menu',              'Eco Systems',              'ఎకో సిస్టమ్స్',                              '/eco-systems/',             7,    'explore',     2),
            ('master-plan',             'master-plan-menu',             'Master Plan',              'మాస్టర్ ప్లాన్',                             '/master-plan/',             NULL, 'information', 1),
            ('media',                   'media-menu',                   'Media',                    'మీడియా',                                    '/media/',                   NULL, 'information', 4),
            ('contact-us',              NULL,                           'Contact Us',               NULL,                                        '/contact-us/',              8,    NULL,          0),
            ('investors-useful-links',  'investors-useful-links',       'Investors/Useful links',   'పెట్టుబడిదారులు / ఉపయోగకరమైన లింకులు',       '/investors-useful-links/',  NULL, 'information', 6),
            ('client-visits',           'client-visits-menu',           'Client Visits',            'క్లయింట్ సందర్శనలు',                         '/client-visits/',           NULL, 'information', 5),
            ('business-opportunities',  'business-opportunities-menu',  'Business Opportunities',   'వ్యాపార అవకాశాలు',                           '/business-opportunities/',  NULL, 'explore',     4),
            ('news-and-events',         NULL,                           'News And Events',          'వార్తలు మరియు ఈవెంట్లు',                    '/news-and-events/',         NULL, 'information', 3),
            ('blog',                    NULL,                           'Blog',                     'బ్లాగ్',                                    '/blog/',                    NULL, 'information', 7),
            ('privacy-policy',          NULL,                           'Privacy Policy',           'గోప్యతా విధానం',                            '/privacy-policy/',          NULL, NULL,          0)
        ) AS f(slug, old_slug, title_en, title_te, href, menu_sort, grp, footer_sort)
    LOOP
        SELECT ni.id INTO v_id
        FROM public.website_nav_items ni
        WHERE ni.tenant_id = v_tenant AND ni.is_active AND ni.parent_id IS NULL
          AND ni.slug IN (r.slug, COALESCE(r.old_slug, r.slug))
        ORDER BY (ni.slug = r.slug) DESC, ni.id
        LIMIT 1;

        IF v_id IS NULL THEN
            INSERT INTO public.website_nav_items (
                slug, kind, title, href, show_in_menu, sort_order,
                footer_group, footer_sort, tenant_id, created_by
            ) VALUES (
                r.slug, 'link', r.title_en, r.href, r.menu_sort IS NOT NULL, COALESCE(r.menu_sort, 100),
                r.grp, r.footer_sort, v_tenant, v_admin
            )
            RETURNING id INTO v_id;
        ELSE
            UPDATE public.website_nav_items
            SET slug         = r.slug,
                kind         = 'link',
                title        = r.title_en,
                href         = r.href,
                show_in_menu = r.menu_sort IS NOT NULL,
                sort_order   = COALESCE(r.menu_sort, GREATEST(sort_order, 100)),
                footer_group = r.grp,
                footer_sort  = r.footer_sort,
                updated_by   = v_admin,
                updated_at   = now()
            WHERE id = v_id;
        END IF;

        IF r.title_te IS NOT NULL THEN
            INSERT INTO public.website_nav_item_translations (item_id, locale, title, tenant_id, created_by)
            VALUES (v_id, 'te', r.title_te, v_tenant, v_admin)
            ON CONFLICT (item_id, locale) DO UPDATE
            SET title = EXCLUDED.title, published = true, is_active = true,
                updated_by = v_admin, updated_at = now();
        END IF;

        v_id := NULL;
    END LOOP;

    -- Zones: top-level link whose route is /zones/sez/, with SEZ and DTZ beneath.
    UPDATE public.website_nav_items
    SET href = '/zones/sez/', show_in_menu = true, sort_order = 4, updated_by = v_admin, updated_at = now()
    WHERE tenant_id = v_tenant AND is_active AND parent_id IS NULL AND slug = 'zones';

    UPDATE public.website_nav_items c
    SET href = '/zones/' || c.slug || '/', updated_by = v_admin, updated_at = now()
    FROM public.website_nav_items p
    WHERE c.parent_id = p.id AND p.slug = 'zones' AND p.parent_id IS NULL
      AND c.tenant_id = v_tenant AND c.is_active AND c.slug IN ('sez', 'dtz');

    -- Compliance Documents: /reports-policies/compliance-documents/ (CMS tree
    -- path, so renaming the slug renames the route and its PDF children).
    SELECT p.id INTO v_parent
    FROM public.website_nav_items p
    WHERE p.tenant_id = v_tenant AND p.is_active AND p.parent_id IS NULL AND p.slug = 'reports-policies';

    UPDATE public.website_nav_items
    SET slug = 'compliance-documents',
        title = 'Compliance Documents',
        href = '/reports-policies/compliance-documents/',
        footer_group = 'information',
        footer_sort = 8,
        updated_by = v_admin,
        updated_at = now()
    WHERE tenant_id = v_tenant AND is_active AND parent_id = v_parent AND slug = 'compliances';
END;
$migration$;
