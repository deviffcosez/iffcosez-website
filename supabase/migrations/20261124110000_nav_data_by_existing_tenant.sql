/*
  Re-runs the navigation data step of 20261124090000 (and the pages-without-code
  step of 20261124100000), which exited silently because it looked the tenant up
  by name. Idempotent: rows are matched by slug (or their old slug) and updated
  in place. Fails loudly instead of skipping.
*/

DO $migration$
DECLARE
    v_tenant integer;
    v_admin  integer;
    v_id     integer;
    v_parent integer;
    r record;
BEGIN
    -- The tenant that owns the site's navigation rows (not looked up by name:
    -- the name lookup in 20261124090000 found no tenant and skipped everything).
    SELECT ni.tenant_id INTO v_tenant
    FROM public.website_nav_items ni
    WHERE ni.is_active
    GROUP BY ni.tenant_id
    ORDER BY count(*) DESC, ni.tenant_id
    LIMIT 1;

    IF v_tenant IS NULL THEN
        RAISE EXCEPTION 'No website_nav_items rows found; nothing to update';
        RETURN;
    END IF;

    SELECT ni.created_by INTO v_admin
    FROM public.website_nav_items ni
    WHERE ni.tenant_id = v_tenant AND ni.is_active
    ORDER BY ni.id LIMIT 1;

    IF v_admin IS NULL THEN
        RAISE EXCEPTION 'No existing nav item to take an author from';
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

-- Pages with no coded route are admin-edited (see 20261124100000).
UPDATE public.website_nav_items
SET kind = 'page',
    href = NULL,
    body_html = COALESCE(body_html, '<p>Content coming soon.</p>'),
    updated_at = now()
WHERE is_active
  AND parent_id IS NULL
  AND slug IN ('business-opportunities', 'client-visits')
  AND kind = 'link';
