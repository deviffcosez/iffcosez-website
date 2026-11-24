/*
  Media Library / Supabase Storage for the gallery and news images.

  - Adds the 25 Image Gallery photos to the Media Library (website_media) with
    the "gallery" tag; caption = alt_text, order = sort_order. Files live in the
    website-media bucket under gallery/ (uploaded with supabase storage cp).
  - Points the 5 news and events rows at their photos under news/<event id>/.
  The files must be in the bucket before this runs.
*/

DO $migration$
DECLARE
    v_tenant integer;
    v_user   integer;
BEGIN
    SELECT m.tenant_id, m.created_by INTO v_tenant, v_user
    FROM public.website_media m
    WHERE m.is_active AND m.created_by IS NOT NULL
    ORDER BY m.id LIMIT 1;

    IF v_tenant IS NULL THEN
        RAISE EXCEPTION 'No existing website_media row to take the tenant from';
    END IF;

    INSERT INTO public.website_media
        (tenant_id, file_name, storage_path, url, mime_type, size_bytes, alt_text, is_public, tags, sort_order, is_active, created_by)
    SELECT v_tenant, g.file_name, g.storage_path, g.url, g.mime_type, g.size_bytes, g.alt_text, true, ARRAY['gallery'], g.sort_order, true, v_user
    FROM (VALUES
    ('01-purnakumbha-swagatham-given-to-the-hon-ble-board.jpg', 'gallery/01-purnakumbha-swagatham-given-to-the-hon-ble-board.jpg', 'https://llpdkkjlbdsoqwqmbpcb.supabase.co/storage/v1/object/public/website-media/gallery/01-purnakumbha-swagatham-given-to-the-hon-ble-board.jpg', 'image/jpeg', 124648, 'Purnakumbha Swagatham given to the Hon''ble Board of Directors on 03.01.17', 10),
    ('02-project-office-building.jpg', 'gallery/02-project-office-building.jpg', 'https://llpdkkjlbdsoqwqmbpcb.supabase.co/storage/v1/object/public/website-media/gallery/02-project-office-building.jpg', 'image/jpeg', 107555, 'Project office building', 20),
    ('03-canteen-in-the-project-office-building.jpg', 'gallery/03-canteen-in-the-project-office-building.jpg', 'https://llpdkkjlbdsoqwqmbpcb.supabase.co/storage/v1/object/public/website-media/gallery/03-canteen-in-the-project-office-building.jpg', 'image/jpeg', 69750, 'Canteen in the project office building', 30),
    ('04-33-kv-receiving-yard-at-project-site.jpg', 'gallery/04-33-kv-receiving-yard-at-project-site.jpg', 'https://llpdkkjlbdsoqwqmbpcb.supabase.co/storage/v1/object/public/website-media/gallery/04-33-kv-receiving-yard-at-project-site.jpg', 'image/jpeg', 187433, '33 KV receiving yard at project site', 40),
    ('05-jack-well-at-kanigiri-reservoir.jpg', 'gallery/05-jack-well-at-kanigiri-reservoir.jpg', 'https://llpdkkjlbdsoqwqmbpcb.supabase.co/storage/v1/object/public/website-media/gallery/05-jack-well-at-kanigiri-reservoir.jpg', 'image/jpeg', 50495, 'Jack well at Kanigiri Reservoir', 50),
    ('06-laying-of-water-pipelines-from-kanigiri-reservoi.jpg', 'gallery/06-laying-of-water-pipelines-from-kanigiri-reservoi.jpg', 'https://llpdkkjlbdsoqwqmbpcb.supabase.co/storage/v1/object/public/website-media/gallery/06-laying-of-water-pipelines-from-kanigiri-reservoi.jpg', 'image/jpeg', 240176, 'Laying of water pipelines from Kanigiri Reservoir to project site completed.', 60),
    ('07-sluice-valves-installed-in-the-water-pipelines.jpg', 'gallery/07-sluice-valves-installed-in-the-water-pipelines.jpg', 'https://llpdkkjlbdsoqwqmbpcb.supabase.co/storage/v1/object/public/website-media/gallery/07-sluice-valves-installed-in-the-water-pipelines.jpg', 'image/jpeg', 253645, 'Sluice valves installed in the water pipelines', 70),
    ('08-weigh-bridge-commissioned-at-the-site.jpg', 'gallery/08-weigh-bridge-commissioned-at-the-site.jpg', 'https://llpdkkjlbdsoqwqmbpcb.supabase.co/storage/v1/object/public/website-media/gallery/08-weigh-bridge-commissioned-at-the-site.jpg', 'image/jpeg', 156587, 'Weigh Bridge Commissioned at the site', 80),
    ('09-cm-inauguration-of-gamesh-unit-on-3rd-feb-2017.jpg', 'gallery/09-cm-inauguration-of-gamesh-unit-on-3rd-feb-2017.jpg', 'https://llpdkkjlbdsoqwqmbpcb.supabase.co/storage/v1/object/public/website-media/gallery/09-cm-inauguration-of-gamesh-unit-on-3rd-feb-2017.jpg', 'image/jpeg', 108943, 'CM Inauguration of Gamesh Unit on 3rd Feb, 2017', 90),
    ('10-aerial-view.jpg', 'gallery/10-aerial-view.jpg', 'https://llpdkkjlbdsoqwqmbpcb.supabase.co/storage/v1/object/public/website-media/gallery/10-aerial-view.jpg', 'image/jpeg', 134728, 'Aerial View', 100),
    ('11-desptach-of-first-blade-from-gamesa.jpg', 'gallery/11-desptach-of-first-blade-from-gamesa.jpg', 'https://llpdkkjlbdsoqwqmbpcb.supabase.co/storage/v1/object/public/website-media/gallery/11-desptach-of-first-blade-from-gamesa.jpg', 'image/jpeg', 81295, 'Desptach of first blade from Gamesa', 110),
    ('12-aerial-view.jpg', 'gallery/12-aerial-view.jpg', 'https://llpdkkjlbdsoqwqmbpcb.supabase.co/storage/v1/object/public/website-media/gallery/12-aerial-view.jpg', 'image/jpeg', 108574, 'Aerial View', 120),
    ('13-board-of-directors-on-iffco-golden-jubilee-celeb.jpg', 'gallery/13-board-of-directors-on-iffco-golden-jubilee-celeb.jpg', 'https://llpdkkjlbdsoqwqmbpcb.supabase.co/storage/v1/object/public/website-media/gallery/13-board-of-directors-on-iffco-golden-jubilee-celeb.jpg', 'image/jpeg', 144302, 'Board of Directors on IFFCO Golden Jubilee Celebrations', 130),
    ('14-office-building.jpg', 'gallery/14-office-building.jpg', 'https://llpdkkjlbdsoqwqmbpcb.supabase.co/storage/v1/object/public/website-media/gallery/14-office-building.jpg', 'image/jpeg', 80231, 'Office Building', 140),
    ('15-free-medical-camp-in-racharlapadu-village.jpg', 'gallery/15-free-medical-camp-in-racharlapadu-village.jpg', 'https://llpdkkjlbdsoqwqmbpcb.supabase.co/storage/v1/object/public/website-media/gallery/15-free-medical-camp-in-racharlapadu-village.jpg', 'image/jpeg', 65101, 'Free Medical Camp in Racharlapadu Village', 150),
    ('16-free-medical-camp-in-regadichilaka-village.png', 'gallery/16-free-medical-camp-in-regadichilaka-village.png', 'https://llpdkkjlbdsoqwqmbpcb.supabase.co/storage/v1/object/public/website-media/gallery/16-free-medical-camp-in-regadichilaka-village.png', 'image/png', 135547, 'Free Medical Camp in Regadichilaka Village', 160),
    ('17-district-collector-s-visit-to-iksez.jpg', 'gallery/17-district-collector-s-visit-to-iksez.jpg', 'https://llpdkkjlbdsoqwqmbpcb.supabase.co/storage/v1/object/public/website-media/gallery/17-district-collector-s-visit-to-iksez.jpg', 'image/jpeg', 64390, 'District Collector''s Visit to IKSEZ', 170),
    ('18-iksez-celebrates-150-th-birth-anniversary-of-the.jpg', 'gallery/18-iksez-celebrates-150-th-birth-anniversary-of-the.jpg', 'https://llpdkkjlbdsoqwqmbpcb.supabase.co/storage/v1/object/public/website-media/gallery/18-iksez-celebrates-150-th-birth-anniversary-of-the.jpg', 'image/jpeg', 88598, 'IKSEZ celebrates 150 th Birth Anniversary of the Father of the Nation', 180),
    ('19-water-gushing-out-from-the-scour-valves-during-c.jpg', 'gallery/19-water-gushing-out-from-the-scour-valves-during-c.jpg', 'https://llpdkkjlbdsoqwqmbpcb.supabase.co/storage/v1/object/public/website-media/gallery/19-water-gushing-out-from-the-scour-valves-during-c.jpg', 'image/jpeg', 151024, 'Water gushing out from the scour valves during commissioning of the Pumps on 17.03.16.', 190),
    ('20-managing-director-inaugurated-weigh-bridge-on-29.jpg', 'gallery/20-managing-director-inaugurated-weigh-bridge-on-29.jpg', 'https://llpdkkjlbdsoqwqmbpcb.supabase.co/storage/v1/object/public/website-media/gallery/20-managing-director-inaugurated-weigh-bridge-on-29.jpg', 'image/jpeg', 83674, 'Managing Director inaugurated Weigh Bridge on 29.06.16', 200),
    ('21-managing-director-inaugurated-water-pipeline-on.jpg', 'gallery/21-managing-director-inaugurated-water-pipeline-on.jpg', 'https://llpdkkjlbdsoqwqmbpcb.supabase.co/storage/v1/object/public/website-media/gallery/21-managing-director-inaugurated-water-pipeline-on.jpg', 'image/jpeg', 83674, 'Managing Director inaugurated Water Pipeline on 30.06.16', 210),
    ('22-on-the-eve-of-iffco-golden-jubilee-celebrations.jpg', 'gallery/22-on-the-eve-of-iffco-golden-jubilee-celebrations.jpg', 'https://llpdkkjlbdsoqwqmbpcb.supabase.co/storage/v1/object/public/website-media/gallery/22-on-the-eve-of-iffco-golden-jubilee-celebrations.jpg', 'image/jpeg', 96084, 'On the eve of IFFCO Golden Jubilee celebrations Havan was performed at IKSEZ office on 03-11-2016.', 220),
    ('23-demo-polyhouses.jpg', 'gallery/23-demo-polyhouses.jpg', 'https://llpdkkjlbdsoqwqmbpcb.supabase.co/storage/v1/object/public/website-media/gallery/23-demo-polyhouses.jpg', 'image/jpeg', 105774, 'Demo Polyhouses', 230),
    ('24-puja-in-the-project-office-building.jpg', 'gallery/24-puja-in-the-project-office-building.jpg', 'https://llpdkkjlbdsoqwqmbpcb.supabase.co/storage/v1/object/public/website-media/gallery/24-puja-in-the-project-office-building.jpg', 'image/jpeg', 110907, 'Puja in the Project Office building', 240),
    ('25-iffco-golden-jubilee-plaques-inaugurated-on-03-0.jpg', 'gallery/25-iffco-golden-jubilee-plaques-inaugurated-on-03-0.jpg', 'https://llpdkkjlbdsoqwqmbpcb.supabase.co/storage/v1/object/public/website-media/gallery/25-iffco-golden-jubilee-plaques-inaugurated-on-03-0.jpg', 'image/jpeg', 138969, 'IFFCO Golden Jubilee plaques inaugurated on 03.01.2017', 250)
    ) AS g(file_name, storage_path, url, mime_type, size_bytes, alt_text, sort_order)
    WHERE NOT EXISTS (SELECT 1 FROM public.website_media x WHERE x.storage_path = g.storage_path);
END;
$migration$;

UPDATE public.website_news_events SET gallery = replace(gallery::text, '"/images/medical-1.jpg"', '"https://llpdkkjlbdsoqwqmbpcb.supabase.co/storage/v1/object/public/website-media/news/1/01.jpg"')::jsonb WHERE gallery::text LIKE '%"/images/medical-1.jpg"%';
UPDATE public.website_news_events SET gallery = replace(gallery::text, '"/images/medical-2.jpg"', '"https://llpdkkjlbdsoqwqmbpcb.supabase.co/storage/v1/object/public/website-media/news/1/02.jpg"')::jsonb WHERE gallery::text LIKE '%"/images/medical-2.jpg"%';
UPDATE public.website_news_events SET gallery = replace(gallery::text, '"/images/medical-3.jpg"', '"https://llpdkkjlbdsoqwqmbpcb.supabase.co/storage/v1/object/public/website-media/news/1/03.jpg"')::jsonb WHERE gallery::text LIKE '%"/images/medical-3.jpg"%';
UPDATE public.website_news_events SET gallery = replace(gallery::text, '"/images/medical-4.jpg"', '"https://llpdkkjlbdsoqwqmbpcb.supabase.co/storage/v1/object/public/website-media/news/1/04.jpg"')::jsonb WHERE gallery::text LIKE '%"/images/medical-4.jpg"%';
UPDATE public.website_news_events SET gallery = replace(gallery::text, '"/images/camp-1.jpg"', '"https://llpdkkjlbdsoqwqmbpcb.supabase.co/storage/v1/object/public/website-media/news/2/01.jpg"')::jsonb WHERE gallery::text LIKE '%"/images/camp-1.jpg"%';
UPDATE public.website_news_events SET gallery = replace(gallery::text, '"/images/camp-2.jpg"', '"https://llpdkkjlbdsoqwqmbpcb.supabase.co/storage/v1/object/public/website-media/news/2/02.jpg"')::jsonb WHERE gallery::text LIKE '%"/images/camp-2.jpg"%';
UPDATE public.website_news_events SET gallery = replace(gallery::text, '"/images/camp-3.jpg"', '"https://llpdkkjlbdsoqwqmbpcb.supabase.co/storage/v1/object/public/website-media/news/2/03.jpg"')::jsonb WHERE gallery::text LIKE '%"/images/camp-3.jpg"%';
UPDATE public.website_news_events SET gallery = replace(gallery::text, '"/images/camp-4.jpg"', '"https://llpdkkjlbdsoqwqmbpcb.supabase.co/storage/v1/object/public/website-media/news/2/04.jpg"')::jsonb WHERE gallery::text LIKE '%"/images/camp-4.jpg"%';
UPDATE public.website_news_events SET gallery = replace(gallery::text, '"/images/new-1.jpg"', '"https://llpdkkjlbdsoqwqmbpcb.supabase.co/storage/v1/object/public/website-media/news/3/01.jpg"')::jsonb WHERE gallery::text LIKE '%"/images/new-1.jpg"%';
UPDATE public.website_news_events SET gallery = replace(gallery::text, '"/images/new-2.jpg"', '"https://llpdkkjlbdsoqwqmbpcb.supabase.co/storage/v1/object/public/website-media/news/3/02.jpg"')::jsonb WHERE gallery::text LIKE '%"/images/new-2.jpg"%';
UPDATE public.website_news_events SET gallery = replace(gallery::text, '"/images/new-3.jpg"', '"https://llpdkkjlbdsoqwqmbpcb.supabase.co/storage/v1/object/public/website-media/news/3/03.jpg"')::jsonb WHERE gallery::text LIKE '%"/images/new-3.jpg"%';
UPDATE public.website_news_events SET gallery = replace(gallery::text, '"/images/new-4.jpg"', '"https://llpdkkjlbdsoqwqmbpcb.supabase.co/storage/v1/object/public/website-media/news/3/04.jpg"')::jsonb WHERE gallery::text LIKE '%"/images/new-4.jpg"%';
UPDATE public.website_news_events SET gallery = replace(gallery::text, '"/images/district-1.jpg"', '"https://llpdkkjlbdsoqwqmbpcb.supabase.co/storage/v1/object/public/website-media/news/4/01.jpg"')::jsonb WHERE gallery::text LIKE '%"/images/district-1.jpg"%';
UPDATE public.website_news_events SET gallery = replace(gallery::text, '"/images/district-2.jpg"', '"https://llpdkkjlbdsoqwqmbpcb.supabase.co/storage/v1/object/public/website-media/news/4/02.jpg"')::jsonb WHERE gallery::text LIKE '%"/images/district-2.jpg"%';
UPDATE public.website_news_events SET gallery = replace(gallery::text, '"/images/district-3.jpg"', '"https://llpdkkjlbdsoqwqmbpcb.supabase.co/storage/v1/object/public/website-media/news/4/03.jpg"')::jsonb WHERE gallery::text LIKE '%"/images/district-3.jpg"%';
UPDATE public.website_news_events SET gallery = replace(gallery::text, '"/images/Layer%201.png"', '"https://llpdkkjlbdsoqwqmbpcb.supabase.co/storage/v1/object/public/website-media/news/5/01.png"')::jsonb WHERE gallery::text LIKE '%"/images/Layer%201.png"%';
UPDATE public.website_news_events SET gallery = replace(gallery::text, '"/images/Layer%202.png"', '"https://llpdkkjlbdsoqwqmbpcb.supabase.co/storage/v1/object/public/website-media/news/5/02.png"')::jsonb WHERE gallery::text LIKE '%"/images/Layer%202.png"%';
UPDATE public.website_news_events SET gallery = replace(gallery::text, '"/images/Layer%203.png"', '"https://llpdkkjlbdsoqwqmbpcb.supabase.co/storage/v1/object/public/website-media/news/5/03.png"')::jsonb WHERE gallery::text LIKE '%"/images/Layer%203.png"%';
UPDATE public.website_news_events SET gallery = replace(gallery::text, '"/images/Layer%204.png"', '"https://llpdkkjlbdsoqwqmbpcb.supabase.co/storage/v1/object/public/website-media/news/5/04.png"')::jsonb WHERE gallery::text LIKE '%"/images/Layer%204.png"%';
UPDATE public.website_news_events SET gallery = replace(gallery::text, '"/images/Layer%205.png"', '"https://llpdkkjlbdsoqwqmbpcb.supabase.co/storage/v1/object/public/website-media/news/5/05.png"')::jsonb WHERE gallery::text LIKE '%"/images/Layer%205.png"%';
UPDATE public.website_news_events SET gallery = replace(gallery::text, '"/images/Layer%206.png"', '"https://llpdkkjlbdsoqwqmbpcb.supabase.co/storage/v1/object/public/website-media/news/5/06.png"')::jsonb WHERE gallery::text LIKE '%"/images/Layer%206.png"%';
UPDATE public.website_news_events SET gallery = replace(gallery::text, '"/images/Layer%207.png"', '"https://llpdkkjlbdsoqwqmbpcb.supabase.co/storage/v1/object/public/website-media/news/5/07.png"')::jsonb WHERE gallery::text LIKE '%"/images/Layer%207.png"%';
UPDATE public.website_news_events SET gallery = replace(gallery::text, '"/images/Layer%208.png"', '"https://llpdkkjlbdsoqwqmbpcb.supabase.co/storage/v1/object/public/website-media/news/5/08.png"')::jsonb WHERE gallery::text LIKE '%"/images/Layer%208.png"%';
