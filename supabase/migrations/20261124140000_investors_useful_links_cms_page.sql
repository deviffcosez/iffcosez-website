/*
  Investors/Useful links has no coded page any more (its content wasn't
  approved by the client), so it is an admin-edited CMS page served at
  /investors-useful-links/ with a "coming soon" body until real content is
  entered in Admin > Navigation.
*/
UPDATE public.website_nav_items
SET kind = 'page',
    href = NULL,
    body_html = COALESCE(body_html, '<p>Content coming soon.</p>'),
    updated_at = now()
WHERE is_active
  AND parent_id IS NULL
  AND slug = 'investors-useful-links'
  AND kind = 'link';
