/*
  Align the IFFCO Kisan SEZ header with the navigation in the opening-page
  reference while preserving the existing admin-managed menu items.
*/
DO $migration$
DECLARE
    v_tenant integer;
    v_admin integer;
    v_id integer;
    r record;
BEGIN
    SELECT t.id
    INTO v_tenant
    FROM public.tenants t
    WHERE t.name = 'IFFCO SEZ' AND t.is_active
    LIMIT 1;

    IF v_tenant IS NULL THEN
        RAISE NOTICE 'Tenant "IFFCO SEZ" not found; skipping header navigation update';
        RETURN;
    END IF;

    SELECT p.id
    INTO v_admin
    FROM public.profiles p
    WHERE p.tenant_id = v_tenant
      AND p.is_active
      AND (p.access_control->>'is_admin')::boolean IS TRUE
    ORDER BY p.id
    LIMIT 1;

    IF v_admin IS NULL THEN
        SELECT ni.created_by
        INTO v_admin
        FROM public.website_nav_items ni
        WHERE ni.tenant_id = v_tenant AND ni.is_active
        ORDER BY ni.id
        LIMIT 1;
    END IF;

    IF v_admin IS NULL THEN
        RAISE NOTICE 'No profile available to create header links; skipping header navigation update';
        RETURN;
    END IF;

    UPDATE public.website_nav_items
    SET show_in_menu = false,
        updated_by = v_admin,
        updated_at = now()
    WHERE tenant_id = v_tenant
      AND parent_id IS NULL
      AND slug IN ('reports-policies', 'news-and-events', 'blog');

    UPDATE public.website_nav_items
    SET show_in_menu = true,
        sort_order = CASE slug
            WHEN 'about-us' THEN 1
            WHEN 'leadership' THEN 2
            WHEN 'zones' THEN 4
            WHEN 'contact-us' THEN 10
        END,
        updated_by = v_admin,
        updated_at = now()
    WHERE tenant_id = v_tenant
      AND parent_id IS NULL
      AND slug IN ('about-us', 'leadership', 'zones', 'contact-us');

    FOR r IN
        SELECT * FROM (VALUES
            ('connectivity-ecosystem-menu', 'Connectivity / Eco System', 'కనెక్టివిటీ / పర్యావరణ వ్యవస్థ', '/strategic/', 3),
            ('infrastructure-menu', 'Infrastructure', 'మౌలిక సదుపాయాలు', '/industrial/', 5),
            ('customers-menu', 'Customers', 'కస్టమర్లు', '/existing-units/', 6),
            ('ecosystems-menu', 'Eco Systems', 'ఎకో సిస్టమ్స్', '/agropark/', 7),
            ('master-plan-menu', 'Master Plan', 'మాస్టర్ ప్లాన్', '/master-plan/', 8),
            ('media-menu', 'Media', 'మీడియా', '/gallery/', 9),
            ('investors-useful-links', 'Investors / Useful Links', 'పెట్టుబడిదారులు / ఉపయోగకరమైన లింకులు', '/invitation-for-investors/', 11),
            ('client-visits-menu', 'Client Visits', 'క్లయింట్ సందర్శనలు', '/gallery/', 12)
        ) AS menu(slug, title_en, title_te, href, sort_order)
    LOOP
        SELECT ni.id
        INTO v_id
        FROM public.website_nav_items ni
        WHERE ni.tenant_id = v_tenant
          AND ni.parent_id IS NULL
          AND ni.slug = r.slug
          AND ni.is_active
        LIMIT 1;

        IF v_id IS NULL THEN
            INSERT INTO public.website_nav_items (
                slug, kind, title, href, sort_order, tenant_id, created_by
            ) VALUES (
                r.slug, 'link', r.title_en, r.href, r.sort_order, v_tenant, v_admin
            )
            RETURNING id INTO v_id;
        ELSE
            UPDATE public.website_nav_items
            SET kind = 'link',
                title = r.title_en,
                href = r.href,
                show_in_menu = true,
                sort_order = r.sort_order,
                updated_by = v_admin,
                updated_at = now()
            WHERE id = v_id;
        END IF;

        INSERT INTO public.website_nav_item_translations (item_id, locale, title, tenant_id, created_by)
        VALUES (v_id, 'te', r.title_te, v_tenant, v_admin)
        ON CONFLICT (item_id, locale) DO UPDATE
        SET title = EXCLUDED.title,
            published = true,
            is_active = true,
            updated_by = v_admin,
            updated_at = now();

        v_id := NULL;
    END LOOP;
END;
$migration$;
