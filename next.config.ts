import type { NextConfig } from "next";

/**
 * Runs as a normal Next.js server on Vercel (not a static export) so the
 * admin console (Server Actions, Supabase session cookies, dynamic route
 * handlers under app/api/) can work — none of those run under
 * `output: 'export'`. The public marketing pages are unaffected: they were
 * already plain Server Components with no dynamic behavior, so they render
 * identically either way.
 *
 * trailingSlash: true keeps the clean canonical URLs (/about-us/) the site
 * already shipped with under the old static export.
 */
const nextConfig: NextConfig = {
  trailingSlash: true,

  images: {
    // Admin-only: blog cover images and media library thumbnails are stored
    // in this Supabase project's Storage buckets and rendered via next/image.
    remotePatterns: [
      { protocol: "https", hostname: "llpdkkjlbdsoqwqmbpcb.supabase.co", pathname: "/storage/v1/object/**" },
    ],
  },

  async redirects() {
    // The previous static site's *.html URLs may still be bookmarked,
    // backlinked, or indexed by search engines. Previously handled by
    // scripts/generate-legacy-redirects.mjs writing meta-refresh stubs into
    // out/ after build (required under static export, no server to redirect
    // with); now a real 308 redirect since we have one.
    // Routes were renamed to match their menu names. Old URLs (and the old
    // static site's *.html ones) 308 to the new page, English and /te/, with
    // anything beneath them (leadership profiles, zone pages) following.
    const RENAMED_ROUTES: Record<string, string> = {
      "board-of-directors": "leadership",
      benefits: "connectivity",
      tax: "connectivity",
      strategic: "connectivity",
      "connectivity-eco-system": "connectivity",
      industrial: "infrastructure",
      "existing-units": "tenants",
      customers: "tenants",
      agropark: "eco-systems",
      gallery: "media",
      "invitation-for-investors": "investors-useful-links",
      zone: "zones",
    };
    const LEGACY_ROUTES: Record<string, string> = {
      "/about-us.html": "/about-us/",
      "/master-plan.html": "/master-plan/",
      "/news-and-events.html": "/news-and-events/",
      "/contact-us.html": "/contact-us/",
    };
    for (const [from, to] of Object.entries(RENAMED_ROUTES)) {
      LEGACY_ROUTES[`/${from}.html`] = `/${to}/`;
      for (const prefix of ["", "/te"]) {
        LEGACY_ROUTES[`${prefix}/${from}/`] = `${prefix}/${to}/`;
        LEGACY_ROUTES[`${prefix}/${from}/:path+/`] = `${prefix}/${to}/:path+/`;
      }
    }

    // Compliances moved from a coded page (and PDFs in public/images) into
    // the admin-managed Reports & Policies section (website_nav_items).
    // The two PDFs' paths below are their document items there, which
    // redirect on to the uploaded file.
    const COMPLIANCE_ROUTES: Record<string, string> = {
      "/compliances/ec-compliance-report-2025/": "/reports-policies/compliance-documents/ec-compliance-report/",
      "/compliances/environment-clearance/": "/reports-policies/compliance-documents/environment-clearance/",
      "/compliances/": "/reports-policies/compliance-documents/",
      "/reports-policies/compliances/": "/reports-policies/compliance-documents/",
      "/reports-policies/compliances/:path+/": "/reports-policies/compliance-documents/:path+/",
      "/te/reports-policies/compliances/": "/te/reports-policies/compliance-documents/",
      "/te/reports-policies/compliances/:path+/": "/te/reports-policies/compliance-documents/:path+/",
      "/te/compliances/ec-compliance-report-2025/": "/te/reports-policies/compliance-documents/ec-compliance-report/",
      "/te/compliances/environment-clearance/": "/te/reports-policies/compliance-documents/environment-clearance/",
      "/te/compliances/": "/te/reports-policies/compliance-documents/",
      "/images/EC-Compliance-Report-2025.pdf": "/reports-policies/compliance-documents/ec-compliance-report/",
      "/images/iksez-EC-complains-enviroment.pdf": "/reports-policies/compliance-documents/environment-clearance/",
    };

    return Object.entries({ ...LEGACY_ROUTES, ...COMPLIANCE_ROUTES }).map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
  },
};

export default nextConfig;
