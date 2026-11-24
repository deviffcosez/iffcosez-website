/*
  Contact is the last item in the header menu, named "Contact". It sorts after
  every other root item (others are 1-8 and 100+), so items added later in
  the admin land before it.
*/
UPDATE public.website_nav_items
SET title = 'Contact',
    sort_order = 1000,
    updated_at = now()
WHERE is_active AND parent_id IS NULL AND slug = 'contact-us';
