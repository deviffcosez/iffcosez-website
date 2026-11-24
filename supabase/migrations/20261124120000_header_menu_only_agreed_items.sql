/*
  The header shows only the agreed top menu: About Us, Leadership,
  Connectivity / Eco System, Zones, Infrastructure, Customers, Eco Systems,
  Contact Us. Every other root item (Reports & Policies, ...) stays in the table
  and reachable (footer, parent pages) but is out of the header.
*/
UPDATE public.website_nav_items
SET show_in_menu = false,
    updated_at = now()
WHERE is_active
  AND parent_id IS NULL
  AND show_in_menu
  AND slug NOT IN ('about-us', 'leadership', 'connectivity-eco-system', 'zones',
                   'infrastructure', 'customers', 'eco-systems', 'contact-us');
