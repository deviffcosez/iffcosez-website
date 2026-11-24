/*
  Business Opportunities is a coded page (PageHero + the sliding panel banner),
  so its row is a link to /business-opportunities/. Switch it back to "Page" in
  Admin > Navigation to edit its content as HTML instead (and delete the coded
  route).
*/
UPDATE public.website_nav_items
SET kind = 'link',
    href = '/business-opportunities/',
    updated_at = now()
WHERE is_active AND parent_id IS NULL AND slug = 'business-opportunities' AND kind = 'page';
