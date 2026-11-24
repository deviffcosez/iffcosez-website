/*
  The Customers menu item is renamed Tenants: menu name Tenants, route
  /tenants/. The old /customers/ and /existing-units/ URLs redirect
  (next.config.ts).
*/
UPDATE public.website_nav_items
SET slug = 'tenants',
    title = 'Tenants',
    href = CASE WHEN kind = 'link' THEN '/tenants/' ELSE href END,
    updated_at = now()
WHERE is_active
  AND parent_id IS NULL
  AND slug = 'customers';

INSERT INTO public.website_nav_item_translations (item_id, locale, title, tenant_id, created_by)
SELECT ni.id, 'te', 'అద్దెదారులు', ni.tenant_id, ni.created_by
FROM public.website_nav_items ni
WHERE ni.is_active AND ni.parent_id IS NULL AND ni.slug = 'tenants'
ON CONFLICT (item_id, locale) DO UPDATE
SET title = EXCLUDED.title, published = true, is_active = true, updated_at = now();
