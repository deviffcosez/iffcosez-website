/*
  Connectivity is a coded page again (road/rail/port/airport facts, shared
  with Infrastructure through components/ConnectivityLocation), so its row is a
  link to /connectivity/. Switch it back to "Page" in Admin > Navigation to
  edit its content as HTML instead (and delete the coded route).
*/
UPDATE public.website_nav_items
SET kind = 'link',
    href = '/connectivity/',
    updated_at = now()
WHERE is_active AND parent_id IS NULL AND slug = 'connectivity' AND kind = 'page';
