import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import { GALLERY_TAG } from "@/lib/mediaTypes";
import { getPublicMediaList } from "@/lib/publicMedia";

const FIRST_PARTY_API_KEY = process.env.NEXT_PUBLIC_IKSEZ_PUBLISHABLE_KEY;

export const metadata: Metadata = {
  title: "Image Gallery | IFFCO Kisan SEZ",
  description:
    "Image gallery of IFFCO Kisan SEZ — project office, water pipelines, receiving yard, unit inaugurations and community events.",
};

// Photos come from the admin Media Library (Supabase Storage): upload them
// there with the type "Gallery photo". The alt text is the caption and a lower
// order number shows first.
export default async function Gallery() {
  const { data } = await getPublicMediaList({ apiKey: FIRST_PARTY_API_KEY, tag: GALLERY_TAG, pageSize: 200 });
  const photos = [...data]
    .filter((photo) => photo.mime_type?.startsWith("image/") ?? true)
    .sort(
      (a, b) =>
        (a.sort_order ?? Number.POSITIVE_INFINITY) - (b.sort_order ?? Number.POSITIVE_INFINITY) ||
        b.created_at.localeCompare(a.created_at),
    );

  return (
    <>
      <PageHero title="Image Gallery" subtitle="Images from the IFFCO Kisan SEZ project and community initiatives" banner="/images/media-banner.webp" />

      <section className="section">
        <div className="container">
          {photos.length > 0 ? (
            <div className="gallery" data-reveal="">
              {photos.map((photo) => {
                const caption = photo.alt_text || photo.file_name;
                return (
                  <a className="gallery__item" key={photo.id} href={photo.url} data-lightbox="" data-caption={caption}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo.url} alt={caption} loading="lazy" />
                    <span className="gallery__cap">{caption}</span>
                  </a>
                );
              })}
            </div>
          ) : (
            <p className="lead">Photos will be added here soon.</p>
          )}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
