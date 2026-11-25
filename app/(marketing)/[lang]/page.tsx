import Link from "next/link";
import type { Metadata } from "next";
import { Building2 } from "lucide-react";
import PanelBanner from "@/components/PanelBanner";
import StrategicLocation from "@/components/StrategicLocation";
import ConnectivityLocation from "@/components/ConnectivityLocation";
import CtaBand from "@/components/CtaBand";
import { chairman, directors, managingDirector } from "@/lib/leadership";
import { getPublicMediaList } from "@/lib/publicMedia";
import { COMPANY_LOGO_TAG } from "@/lib/mediaTypes";

export const metadata: Metadata = {
  title: "IFFCO Kisan SEZ | Agribusiness Special Economic Zone & Integrated Agropark",
  description:
    "IFFCO Kisan SEZ is being setup as an Agribusiness Special Economic Zone based on the concept of Integrated Agropark, with customs duty, income tax and sales tax concessions provided by the Government of India.",
};

export const revalidate = 300;

const FIRST_PARTY_API_KEY = process.env.NEXT_PUBLIC_IKSEZ_PUBLISHABLE_KEY;

const HERO_IMAGE = "/images/home_bg.png";

export default async function Home() {
  const { data: customerLogos } = await getPublicMediaList({
    apiKey: FIRST_PARTY_API_KEY,
    tag: COMPANY_LOGO_TAG,
    pageSize: 100,
  });

  return (
    <>
      {/* Preloaded as the likely LCP element — React 19 hoists this into
          <head>, so the browser fetches it before it even parses the CSS
          that references it as a background-image. */}
      <link rel="preload" as="image" href={HERO_IMAGE} fetchPriority="high" />

      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="container">
          <div className="hero__grid">
            <div className="hero__content">
              <span className="hero__eyebrow">
                <span className="dot"></span> Notified Multi Product SEZ
              </span>
              <h1>Your Gateway to Industrial Excellence</h1>
              <p className="hero__text">
                A Strategic Industrial Destination Backed by IFFCO&apos;s Cooperative Legacy
              </p>
              <div className="hero__actions">
                <Link className="btn btn--green btn--lg" href="/business-opportunities/">
                  Business Opportunities
                </Link>
                <Link className="btn btn--outline btn--lg" href="/about-us/">
                  About IKSEZ
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      <PanelBanner />

      {/* ================= ABOUT + STATS ================= */}
      <section id="about" className="home-about">
        <div className="container">
          <div className="home-about__grid">
            <div className="home-about__copy">
              <h2>About IFFCO Kisan SEZ</h2>
              <p>
                IFFCO Kisan SEZ Limited (IKSEZ) is a wholly owned subsidiary of the Indian Farmers
                Fertiliser Cooperative Limited (IFFCO), one of the world’s leading cooperative
                institutions. Established to develop a world-class industrial ecosystem, IKSEZ aims
                to accelerate industrialisation, attract domestic and international investment,
                generate employment and drive sustainable socio-economic development.
              </p>
              <Link className="btn btn--green" href="/about-us/">Read More →</Link>
            </div>
            <div className="home-stats">
              <div><span className="home-stat__icon">♧</span><strong>1,900</strong><small>Acres of Multiproduct<br />Special Economic Zone</small></div>
              <div><span className="home-stat__icon">⌁</span><strong>877</strong><small>Acres of Domestic Tariff<br />Area (DTA)</small></div>
              <div><span className="home-stat__icon">▥</span><strong>8 km</strong><small>Frontage on National<br />Highway 16</small></div>
              <div><span className="home-stat__icon">⌂</span><strong>220 kV</strong><small>Power Station for<br />power supply</small></div>
            </div>
          </div>
        </div>
      </section>

      <StrategicLocation />

      <section className="section section--alt infrastructure-overview">
        <div className="container">
          <ConnectivityLocation />
        </div>
      </section>

      {customerLogos.length > 0 && (
        <section className="home-reference-section home-customers" aria-labelledby="home-customers-title">
          <div className="container">
            <div className="home-section-head">
              <div>
                <div className="home-reference__kicker">Our Customers</div>
                <h2 id="home-customers-title">Companies operating at IKSEZ</h2>
              </div>
            </div>
            <ul className="home-customers__grid">
              {customerLogos.map((logo) => {
                const name = logo.alt_text ?? logo.file_name.replace(/\.[^.]+$/, "");
                const isGenericLogo = logo.tags?.includes("generic-logo") ?? false;
                // crossOrigin is required because the public Supabase Storage
                // bucket does not send a CORP header for these images.
                // eslint-disable-next-line @next/next/no-img-element
                const image = <img src={logo.url} alt={name} title={name} loading="lazy" crossOrigin="anonymous" />;
                const content = isGenericLogo ? (
                  <span className="home-customers__generic">
                    <Building2 aria-hidden="true" />
                    <strong>{name}</strong>
                  </span>
                ) : image;

                return (
                  <li
                    className={`home-customers__item${isGenericLogo ? " home-customers__item--generic" : ""}`}
                    key={logo.id}
                  >
                    {logo.link_url ? (
                      <a href={logo.link_url} target="_blank" rel="noopener noreferrer" aria-label={`${name} (opens in a new tab)`}>
                        {content}
                      </a>
                    ) : (
                      content
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      <section className="home-reference-section home-reference-section--alt home-features">
        <div className="container">
          <div className="home-investment__intro">
            <div className="home-reference__kicker">Investment Advantages</div>
            <h2>Why Choose IFFCO KISAN SEZ</h2>
            <h3>A Strategic Industrial Destination Backed by IFFCO&apos;s Cooperative Legacy</h3>
            <p>
              IFFCO KISAN SEZ LIMITED (IKSEZ) offers an integrated industrial development
              opportunity supported by the institutional strength of IFFCO, strategic geographical
              location and planned industrial infrastructure. Located in SPSR Nellore District,
              Andhra Pradesh, the project aims to provide an enabling environment for manufacturing,
              agro-based industries, food processing, logistics and other industrial sectors.
            </p>
            <p>
              With its large land bank, connectivity to major transportation networks and focus on
              investor-friendly infrastructure, IKSEZ aims to become a preferred destination for
              domestic and international investors.
            </p>
          </div>
          <div className="home-investment-grid">
            {[
              {
                title: "Strong Institutional Support",
                text: "A 100% wholly owned subsidiary of IFFCO, providing institutional credibility and a strong cooperative foundation.",
                image: "reason-1.webp",
              },
              {
                title: "Large Industrial Land Bank",
                text: "A large planned industrial land bank, providing opportunities for large-scale and diversified industrial investments.",
                image: "reason-2.webp",
              },
              {
                title: "Strategic Location",
                text: "Located in Nellore District with connectivity to NH-16 and the Chennai–Kolkata transportation corridor.",
                image: "reason-3.webp",
              },
              {
                title: "Industrial Infrastructure",
                text: "Planned facilities include internal roads, power, water supply, street lighting, security and other common infrastructure.",
                image: "reason-4.webp",
              },
              {
                title: "Logistics and Connectivity",
                text: "Access to road, rail, port and air transportation networks, supporting domestic distribution and international trade.",
                image: "reason-5.webp",
              },
              {
                title: "Diverse Industrial Opportunities",
                text: "Suitable for agro-processing, food processing, manufacturing, engineering, logistics and allied industries.",
                image: "reason-6.webp",
              },
              {
                title: "Sustainable Industrial Development",
                text: "Encouraging resource-efficient industrial operations, responsible environmental practices and sustainable regional growth.",
                image: "reason-7.webp",
              },
              {
                title: "Skilled Manpower",
                text: "Access to a skilled, trainable local workforce, supported by skill-development initiatives for industrial operations.",
                image: "reason-8.webp",
              },
            ].map((item, index) => (
              <article className="home-investment-card" key={item.title}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/images/investment-advantages/${item.image}`}
                  alt=""
                  loading="lazy"
                />
                <div className="home-investment-card__body">
                  <span className="home-investment-card__number">{String(index + 1).padStart(2, "0")}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
