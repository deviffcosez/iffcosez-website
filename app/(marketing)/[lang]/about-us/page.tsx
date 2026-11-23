import type { Metadata } from "next";
import CtaBand from "@/components/CtaBand";
import FeatureCard from "@/components/FeatureCard";

export const metadata: Metadata = {
  title: "About us | IFFCO Kisan SEZ",
  description:
    "Learn about IFFCO Kisan SEZ Limited, its vision, mission and plans for a world-class industrial ecosystem in SPSR Nellore, Andhra Pradesh.",
};

export default function AboutUs() {
  return (
    <>
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
              To develop a world-class industrial ecosystem that accelerates industrialisation,
              sustainable economic growth and employment generation, while contributing directly
              to the prosperity of farmers and local communities.
            </FeatureCard>
            <FeatureCard
              title="Mission"
              icon={<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.4" /></svg>}
            >
              <span className="about-mission-item"><strong>World-class infrastructure:</strong> Develop an integrated industrial park supported by modern utilities and reliable infrastructure.</span>
              <span className="about-mission-item"><strong>Global and domestic investment:</strong> Attract leading investors across diverse industrial sectors.</span>
              <span className="about-mission-item"><strong>Sectoral focus:</strong> Promote agro-based industries, food processing, logistics and diversified manufacturing.</span>
              <span className="about-mission-item"><strong>Socio-economic impact:</strong> Generate sustainable employment and catalyse regional economic growth.</span>
              <span className="about-mission-item"><strong>Ease of doing business:</strong> Provide a transparent, investor-friendly environment with streamlined approvals and professional facility management.</span>
              <span className="about-mission-item"><strong>Cooperative ethos:</strong> Uphold IFFCO’s cooperative values through an inclusive, farmer-centric approach to industrial development.</span>
            </FeatureCard>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
