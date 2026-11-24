import type { Metadata } from "next";
import {
  Building2,
  CloudRain,
  Droplets,
  GraduationCap,
  Leaf,
  Route,
  ShieldCheck,
  Trees,
  Zap,
} from "lucide-react";
import ConnectivityLocation from "@/components/ConnectivityLocation";
import CtaBand from "@/components/CtaBand";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Infrastructure | IFFCO Kisan SEZ",
  description:
    "Explore IFFCO Kisan SEZ infrastructure, including water supply, power, internal roads, drainage, security, investor office spaces, skilled manpower and green belt development.",
};

const ITEMS = [
  { src: "/images/water-1.webp", caption: "Water Storage Pond (79 Acres)" },
  {
    src: "/images/pump-house.webp",
    caption: "Pump House with 13 km pipe line to draw water from approved Reservoir",
  },
  { src: "/images/power-station.jpg", caption: "220 kV Power Station for Power Supply" },
  { src: "/images/security.webp", caption: "Security with 27 km Boundary Wall" },
  { src: "/images/internal-road.webp", caption: "Internal Roads" },
  { src: "/images/Peripheral-Roads.jpg", caption: "Peripheral Roads" },
  { src: "/images/ready-space.webp", caption: "Ready to Use Office Space" },
  { src: "/images/hall.jpg", caption: "Conference Hall and Amenities" },
];

const INFRASTRUCTURE = [
  {
    title: "Water Supply & Management",
    icon: Droplets,
    paragraphs: [
      "Water infrastructure is designed to serve the varied requirements of industries, including processes that need different water quality specifications.",
      "The Government of Andhra Pradesh has approved drawing 10 Million Gallons per Day (MGD) from the nearby Kanigiri Reservoir in the Pennar River System. Twin pipelines extend approximately 13 kilometres and are designed to convey 45 Million Litres per Day (MLD). An internal water pond covers approximately 79 acres (31 hectares).",
      "A desalination plant and Common Effluent Treatment Plant (CETP) are also envisaged to support long-term water security, treatment and reuse.",
    ],
  },
  {
    title: "Power Supply & Electrical Infrastructure",
    icon: Zap,
    paragraphs: [
      "The Industrial Park features a 220/132/33 kV substation, with provision for approximately 100 MW of dedicated power supply. Distribution at 132 kV and 33 kV is planned to serve industrial manufacturing and operational requirements.",
      "The Government of Andhra Pradesh is working towards additional power infrastructure to strengthen the regional electricity network and support future industrial growth.",
    ],
  },
  {
    title: "Roads & Internal Connectivity",
    icon: Route,
    paragraphs: [
      "A hierarchical internal road network is designed for smooth movement of goods, vehicles and people throughout the Park.",
      "Road right-of-way widths include 40 metres for trunk roads, 30 metres for arterial roads, and 20 metres and 12 metres for sub-arterial roads, supporting efficient traffic flow and logistics operations.",
    ],
  },
  {
    title: "Stormwater Drainage",
    icon: CloudRain,
    paragraphs: [
      "The stormwater network collects and channels runoff from internal roads and industrial plots towards designated reservoirs.",
      "This integrated approach is designed to help minimise waterlogging, flooding and soil erosion while supporting resilient infrastructure and sustainable water management.",
    ],
  },
  {
    title: "Secure, Defined Perimeter",
    icon: ShieldCheck,
    paragraphs: [
      "A reinforced cement concrete (RCC) boundary wall, approximately 4 metres high and extending 27 kilometres, secures the Industrial Park.",
      "The defined perimeter helps safeguard industrial establishments, infrastructure and facilities, creating a controlled environment for businesses and investors.",
    ],
  },
  {
    title: "Ready-to-Use Office Spaces",
    icon: Building2,
    paragraphs: [
      "Office spaces beneath the Main Gate Complex provide investors and businesses with convenient workspaces while they establish operations or develop permanent premises.",
      "Their location at the Park entrance offers convenient access during initial setup and operational phases.",
    ],
  },
  {
    title: "Skilled & Qualified Manpower",
    icon: GraduationCap,
    paragraphs: [
      "The surrounding region has educational institutions, technical colleges and vocational training centres that contribute to a growing pool of skilled manpower.",
      "This ecosystem offers opportunities for industry-oriented training, industry-academia collaboration, customised workforce development and local employment generation.",
    ],
  },
  {
    title: "Green Belt & Environmental Sustainability",
    icon: Trees,
    paragraphs: [
      "Approximately 393 acres have been earmarked for green belt development within the Industrial Park.",
      "Plantation, green spaces and biodiversity conservation are intended to improve air quality, mitigate dust and noise, support local ecosystems and create a healthier environment for industries and communities.",
    ],
  },
];

export default function Industrial() {
  return (
    <>
      <PageHero
        title="Infrastructure"
        subtitle="An Industrial Destination That's Shaping the Future of Industry."
      />

      <section className="section section--alt infrastructure-overview">
        <div className="container">
          <div className="section-head section-head--center">
            <span className="eyebrow">Built for Business</span>
            <h2>Infrastructure designed for industrial operations</h2>
            <p>
              IFFCO Kisan SEZ is developing the essential utilities, connectivity and shared
              facilities that help industries establish, operate and grow.
            </p>
          </div>

          <div className="stats infrastructure-stats" data-reveal="">
            <div className="stat">
              <Droplets className="infrastructure-stat__icon" aria-hidden="true" />
              <div className="stat__value">45 MLD</div>
              <p className="stat__label">Designed water conveyance capacity</p>
            </div>
            <div className="stat">
              <Zap className="infrastructure-stat__icon" aria-hidden="true" />
              <div className="stat__value">~100 MW</div>
              <p className="stat__label">Power supply provision</p>
            </div>
            <div className="stat">
              <ShieldCheck className="infrastructure-stat__icon" aria-hidden="true" />
              <div className="stat__value">27 km</div>
              <p className="stat__label">RCC boundary wall</p>
            </div>
            <div className="stat">
              <Leaf className="infrastructure-stat__icon" aria-hidden="true" />
              <div className="stat__value">393 acres</div>
              <p className="stat__label">Earmarked for green belt</p>
            </div>
          </div>

          <ConnectivityLocation />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid--2 infrastructure-details">
            {INFRASTRUCTURE.map((item) => {
              const Icon = item.icon;
              return (
                <article className="card" data-reveal="" key={item.title}>
                  <div className="card__icon" aria-hidden="true">
                    <Icon />
                  </div>
                  <h3>{item.title}</h3>
                  {item.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">On the Ground</span>
            <h2>Infrastructure gallery</h2>
          </div>
          <div className="grid grid--3">
            {ITEMS.map((item) => (
              <article className="media-card" data-reveal="" key={item.src}>
                <a className="media-card__figure" href={item.src} data-lightbox="" data-caption={item.caption}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.src} alt={item.caption} loading="lazy" />
                </a>
                <div className="media-card__body">
                  <h3 className="industrial-card__title">{item.caption}</h3>
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
