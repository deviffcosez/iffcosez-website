-- Reports & Policies sits directly before Contact, which is last (1000).
UPDATE public.website_nav_items
SET sort_order = 999, updated_at = now()
WHERE is_active AND parent_id IS NULL AND slug = 'reports-policies';
