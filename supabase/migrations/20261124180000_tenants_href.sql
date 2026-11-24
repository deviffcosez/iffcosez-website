-- The Tenants link still pointed at /customers/ (it redirects, but the
-- menu should link straight to the route).
UPDATE public.website_nav_items
SET href = '/tenants/', updated_at = now()
WHERE is_active AND parent_id IS NULL AND slug = 'tenants' AND kind = 'link' AND href = '/customers/';
