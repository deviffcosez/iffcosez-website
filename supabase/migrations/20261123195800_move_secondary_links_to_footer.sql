UPDATE public.website_nav_items
SET show_in_menu = false,
    updated_at = now()
WHERE tenant_id = (
    SELECT t.id
    FROM public.tenants t
    WHERE t.name = 'IFFCO SEZ'
      AND t.is_active
    ORDER BY t.id
    LIMIT 1
)
  AND parent_id IS NULL
  AND slug IN (
      'master-plan-menu',
      'media-menu',
      'client-visits-menu',
      'investors-useful-links'
  );
