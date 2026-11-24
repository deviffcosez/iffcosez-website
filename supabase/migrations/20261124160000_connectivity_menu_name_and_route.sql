/*
  The Connectivity menu item is just "Connectivity" (Eco Systems is its own
  item): menu name Connectivity, route /connectivity/. The old
  /connectivity-eco-system/ URL redirects (next.config.ts).
*/
UPDATE public.website_nav_items
SET slug = 'connectivity',
    title = 'Connectivity',
    href = CASE WHEN kind = 'link' THEN '/connectivity/' ELSE href END,
    updated_at = now()
WHERE is_active
  AND parent_id IS NULL
  AND slug = 'connectivity-eco-system';

INSERT INTO public.website_nav_item_translations (item_id, locale, title, tenant_id, created_by)
SELECT ni.id, 'te', 'కనెక్టివిటీ', ni.tenant_id, ni.created_by
FROM public.website_nav_items ni
WHERE ni.is_active AND ni.parent_id IS NULL AND ni.slug = 'connectivity'
ON CONFLICT (item_id, locale) DO UPDATE
SET title = EXCLUDED.title, published = true, is_active = true, updated_at = now();
