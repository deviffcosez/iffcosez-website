import type { Metadata } from "next";
import CtaBand from "@/components/CtaBand";
import FeatureCard from "@/components/FeatureCard";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "About us | IFFCO Kisan SEZ",
  description:
    "Learn about IFFCO Kisan SEZ Limited, its vision, mission and plans for a world-class industrial ecosystem in SPSR Nellore, Andhra Pradesh.",
};

export default function AboutUs() {
  return (
    <>
      <PageHero
        title="About Us"
        subtitle="A wholly owned subsidiary of IFFCO, building a world-class industrial ecosystem in SPSR Nellore."
      />

      {/* ================= ABOUT + STATS ================= */}
      <section className="home-about about-page-about">
        <div className="container">
          <div className="home-about__grid">
            <div className="home-about__copy">
              <div className="home-reference__kicker">About Us</div>
              <h2>IFFCO Kisan SEZ Limited</h2>
              <p>
                IFFCO Kisan SEZ Limited (IKSEZ) is a wholly owned subsidiary of the Indian Farmers
                Fertiliser Cooperative Limited (IFFCO), one of the world’s leading cooperative
                institutions. Established to develop a world-class industrial ecosystem, IKSEZ aims
                to accelerate industrialisation, attract domestic and international investment,
                generate employment and drive sustainable socio-economic development.
              </p>
              <p>
                Strategically located in SPSR Nellore District, Andhra Pradesh, IKSEZ is being
                developed as a multi-product industrial park across approximately 2,776.23 acres.
                It offers development-ready industrial land, modern infrastructure and an
                investor-friendly ecosystem designed to meet the evolving needs of businesses
                across diverse sectors.
              </p>
              <p>
                With multimodal connectivity by road, rail, air and sea, IKSEZ offers access to key
                industrial centres, commercial markets and international trade routes. Its location
                and infrastructure create opportunities in general manufacturing, agro-based
                industries, food processing, engineering, renewable energy, logistics and other
                emerging sectors.
              </p>
              <p>
                Leveraging IFFCO’s institutional strength, credibility and cooperative legacy,
                IKSEZ is committed to facilitating ease of doing business through investor support,
                transparent governance and sustainable industrial development. It seeks to foster
                technology transfer, ancillary industries, skill development and local employment.
              </p>
              <p>
                IKSEZ aspires to become a preferred industrial investment destination in Andhra
                Pradesh and South India, creating lasting value for investors, industries, farmers
                and local communities while contributing to India’s vision of sustainable and
                inclusive economic growth.
              </p>
            </div>
            <div className="home-stats">
              <div><span className="home-stat__icon">▧</span><strong>2,776.23</strong><small>Acres under<br />development</small></div>
              <div><span className="home-stat__icon">♧</span><strong>1,900</strong><small>Acres of Multiproduct<br />SEZ</small></div>
              <div><span className="home-stat__icon">⌂</span><strong>877</strong><small>Acres of Domestic<br />Tariff Area</small></div>
              <div><span className="home-stat__icon">⌁</span><strong>8 km</strong><small>NH-16<br />frontage</small></div>
          </div>
        </div>
        </div>
      </section>

      {/* ================= VISION & MISSION ================= */}
      <section className="home-reference-section home-reference-section--alt">
        <div className="container">
          <div className="home-section-head">
            <div>
              <div className="home-reference__kicker">Our Purpose</div>
              <h2>Vision and mission</h2>
            </div>
          </div>
          <div className="grid grid--2 home-purpose-grid">
            <FeatureCard
              title="Vision"
              icon={<svg viewBox="0 0 24 24"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" /><circle cx="12" cy="12" r="3" /></svg>}
            >
              To setup industrial infrastructure to foster industry, economic growth, sustainable
              economic development and create employment opportunities.
            </FeatureCard>
            <FeatureCard
              title="Mission"
              icon={<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.4" /></svg>}
            >
              To develop state of the art Industrial Park through a unique “Farmer Owned – Farmer
              Managed – Farmer Focused” industrial park with world class infrastructure for setting
              up multiproduct units and attract domestic and global manufacturing entrepreneurs
              with a focus on agro-based industries.
            </FeatureCard>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
