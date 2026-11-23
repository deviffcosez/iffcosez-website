import type { Metadata } from "next";
import { Building2, Factory } from "lucide-react";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Customers | IFFCO Kisan SEZ",
  description:
    "Meet the companies operating at IKSEZ and those under construction, upcoming or grounded, and learn about emerging investment opportunities.",
};

const EXISTING_UNITS = [
  "M/s. A D J & Brothers",
  "M/s. Vayona Energy Private Limited",
];

const UPCOMING_UNITS = [
  "M/s. Hindustan Coca-Cola Beverages Pvt Ltd",
  "M/s. Gayathri Renewable Fuels and Allied Industries Private Limited",
  "M/s. Ramshy Bio Private Limited",
  "M/s. PMK Distillations",
  "M/s. Marine Bio-Polymers LLP",
  "M/s. R V Associates",
];

const OPPORTUNITY_PARAGRAPHS = [
  "IFFCO KISAN SEZ Limited is actively engaging with leading Indian and multinational corporations to attract strategic industrial investments and establish a diverse manufacturing ecosystem within the Industrial Park.",
  "The organisation is currently engaged in advanced discussions with several reputed national and international companies across potential industrial sectors for setting up their manufacturing and processing facilities at IKSEZ. These engagements reflect the growing interest in the Industrial Park and its emerging potential as a preferred destination for industrial investment, manufacturing and export-oriented activities.",
  "The proposed investments are expected to create significant opportunities for employment generation, technology transfer, skill development, ancillary and supporting industries, and the overall strengthening of the regional industrial ecosystem, subject to the successful conclusion of discussions and receipt of requisite statutory and regulatory approvals.",
  "With its strategic location, planned infrastructure, connectivity and institutional support, IKSEZ is committed to creating a conducive business environment for domestic and international investors.",
  "IFFCO KISAN SEZ Limited continues to adopt a proactive, investor-centric approach by facilitating investment proposals through coordinated engagement, infrastructure development, institutional coordination and end-to-end support, with the objective of accelerating industrial establishment and fostering long-term business growth.",
];

function UnitList({ units }: { units: string[] }) {
  return (
    <ol className="customer-unit-list">
      {units.map((unit, index) => (
        <li className="customer-unit" key={unit}>
          <span className="customer-unit__number">{String(index + 1).padStart(2, "0")}</span>
          <Building2 aria-hidden="true" />
          <span>{unit}</span>
        </li>
      ))}
    </ol>
  );
}

export default function ExistingUnits() {
  return (
    <>
      <PageHero
        title="Customers"
        subtitle="Attracting Global Ambitions. Creating Industrial Opportunities."
        banner="/images/infrastructur-banner.webp"
      />

      <section className="section">
        <div className="container">
          <div className="grid grid--2 customer-unit-groups">
            <article className="card customer-unit-group">
              <div className="customer-unit-group__heading">
                <span className="card__icon" aria-hidden="true"><Factory /></span>
                <div>
                  <span className="eyebrow">Operating at IKSEZ</span>
                  <h2>Existing Units</h2>
                </div>
              </div>
              <UnitList units={EXISTING_UNITS} />
            </article>

            <article className="card customer-unit-group">
              <div className="customer-unit-group__heading">
                <span className="card__icon" aria-hidden="true"><Building2 /></span>
                <div>
                  <span className="eyebrow">Growing at IKSEZ</span>
                  <h2>Units Under Construction / Upcoming / Grounded</h2>
                </div>
              </div>
              <UnitList units={UPCOMING_UNITS} />
            </article>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="section-head customer-opportunities__heading">
            <span className="eyebrow">Investment pipeline</span>
            <h2>Emerging Investment Opportunities at IKSEZ</h2>
          </div>
          <div className="customer-opportunities__copy">
            {OPPORTUNITY_PARAGRAPHS.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
