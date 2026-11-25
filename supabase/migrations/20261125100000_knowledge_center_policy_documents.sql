/*
  Knowledge Center: two policy PDFs listed in the page's "Documents" block, just
  above the call-to-action band. The files are in the website-documents bucket
  (random folder + original name, like admin uploads). Documents are not in the
  header menu; they only appear on their parent page. Safe to re-run.
*/
INSERT INTO public.website_nav_items
    (parent_id, slug, kind, title, description, file_path, file_name,
     open_in_new_tab, show_in_menu, sort_order, tenant_id, created_by)
SELECT p.id, d.slug, 'document', d.title, d.description, d.file_path, d.file_name,
       true, false, d.sort_order, p.tenant_id, p.created_by
FROM public.website_nav_items p
CROSS JOIN (VALUES
    ('ap-new-industrial-development-policy',
     'AP New Industrial Development Policy',
     'Andhra Pradesh Government policy framework for industrial development and investment incentives.',
     '64ff0658-a58d-4116-b22f-b34922d9eaf3/AP-New-Industrial-Development-Policy.pdf',
     'AP New Industrial Development Policy.pdf', 10),
    ('policy-for-establishment-of-pvt-industrial-parks',
     'Policy for Establishment of Private Industrial Parks with Plug and Play',
     'Andhra Pradesh policy for establishing private industrial parks with plug-and-play infrastructure.',
     '15ca910a-a77f-4607-a276-a32d5a514b26/Policy-or-establishment-of-Pvt-Industrial-Parks-with-Plug-and-Play_0001.pdf',
     'Policy-or-establishment-of-Pvt-Industrial-Parks-with-Plug-and-Play_0001.pdf', 20)
) AS d(slug, title, description, file_path, file_name, sort_order)
WHERE p.is_active AND p.parent_id IS NULL AND p.slug = 'knowledge-center' AND p.kind = 'page'
  AND NOT EXISTS (
      SELECT 1 FROM public.website_nav_items c
      WHERE c.is_active AND c.parent_id = p.id AND c.slug = d.slug
  );
