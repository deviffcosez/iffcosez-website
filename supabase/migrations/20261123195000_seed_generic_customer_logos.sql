UPDATE public.website_media
SET sort_order = 1,
    updated_at = now()
WHERE tenant_id = 1
  AND is_active
  AND 'company-logo' = ANY(COALESCE(tags, ARRAY[]::text[]))
  AND lower(trim(COALESCE(alt_text, ''))) = 'iffco';

WITH customers (slug, name, sort_order) AS (
    VALUES
        ('adj-brothers', 'M/s. A D J & Brothers', 2),
        ('vayona-energy', 'M/s. Vayona Energy Private Limited', 3),
        ('hindustan-coca-cola', 'M/s. Hindustan Coca-Cola Beverages Pvt Ltd', 4),
        ('gayathri-renewable-fuels', 'M/s. Gayathri Renewable Fuels and Allied Industries Private Limited', 5),
        ('ramshy-bio', 'M/s. Ramshy Bio Private Limited', 6),
        ('pmk-distillations', 'M/s. PMK Distillations', 7),
        ('marine-bio-polymers', 'M/s. Marine Bio-Polymers LLP', 8),
        ('rv-associates', 'M/s. R V Associates', 9)
),
missing_customers AS (
    SELECT customer.slug, customer.name, customer.sort_order
    FROM customers customer
    WHERE NOT EXISTS (
        SELECT 1
        FROM public.website_media media
        WHERE media.tenant_id = 1
          AND media.is_active
          AND 'company-logo' = ANY(COALESCE(media.tags, ARRAY[]::text[]))
          AND lower(trim(COALESCE(media.alt_text, ''))) = lower(customer.name)
    )
)
INSERT INTO public.website_media (
    tenant_id,
    file_name,
    storage_path,
    url,
    mime_type,
    alt_text,
    is_public,
    tags,
    data,
    is_active,
    sort_order
)
SELECT
    1,
    'generic-company-logo.svg',
    'generic-company-logos/' || customer.slug || '.svg',
    '/images/company-generic.svg',
    'image/svg+xml',
    customer.name,
    true,
    ARRAY['company-logo', 'generic-logo'],
    jsonb_build_object('logo_type', 'generic-placeholder'),
    true,
    customer.sort_order
FROM missing_customers customer
ON CONFLICT (storage_path) DO UPDATE
SET file_name = EXCLUDED.file_name,
    url = EXCLUDED.url,
    mime_type = EXCLUDED.mime_type,
    alt_text = EXCLUDED.alt_text,
    is_public = true,
    tags = EXCLUDED.tags,
    data = EXCLUDED.data,
    is_active = true,
    sort_order = EXCLUDED.sort_order,
    updated_at = now();
