import {
  BookOpen,
  HeartPulse,
  Landmark,
  TreePalm,
  type LucideIcon,
} from "lucide-react";

const PILLARS: {
  number: string;
  title: string;
  icon: LucideIcon;
  paragraphs: string[];
  places?: string[];
}[] = [
  {
    number: "01",
    title: "Health — A Strong Healthcare Ecosystem",
    icon: HeartPulse,
    paragraphs: [
      "Nellore has an established healthcare ecosystem serving the city and surrounding districts. Institutions such as Apollo Hospital, Medicover Hospital, Narayana Medical College and Hospital, and A.C.S.R. Government Medical College and General Hospital provide medical education, general healthcare and specialised treatment services.",
      "The district also has government healthcare facilities, area hospitals, community health centres and primary health centres supporting healthcare access across urban and rural areas.",
      "For IKSEZ, healthcare facilities in the wider Nellore region are an important consideration for industries, professionals and their families.",
    ],
  },
  {
    number: "02",
    title: "Education — Developing Knowledge and Talent",
    icon: BookOpen,
    paragraphs: [
      "Nellore has a growing educational ecosystem comprising universities, engineering colleges, medical colleges, professional institutions and schools. Vikrama Simhapuri University, established in 2008, serves as an important higher education institution in the district, with undergraduate, postgraduate and research programmes. Narayana Medical and Engineering Colleges and A.C.S.R. Government Medical College further strengthen the region's medical education infrastructure.",
      "The availability of educational institutions provides a foundation for developing skilled human resources. Technical education, vocational training and industry-oriented skill development can help meet the requirements of manufacturing, logistics, food processing and other industrial sectors.",
    ],
  },
  {
    number: "03",
    title: "Culture — Preserving Heritage, Celebrating Tradition",
    icon: Landmark,
    paragraphs: [
      "Nellore has a rich cultural and historical identity shaped by its temples, traditional festivals, architecture, literature, cuisine and community traditions. The district's traditional arts, festivals, local cuisine and handicrafts add to its distinctive identity.",
      "The region's cultural attractions include:",
    ],
    places: [
      "Sri Ranganathaswamy Temple, Nellore — an important historic temple and religious landmark.",
      "Udayagiri Fort — a historic fort reflecting the region's architectural and historical heritage.",
      "Pinakini Satyagraha Ashram, Pallipadu — a place associated with India's freedom movement.",
      "Archaeological Museum, Nellore — preserving and showcasing historical artefacts and heritage.",
    ],
  },
  {
    number: "04",
    title: "Recreation — Enhancing Lifestyle and Well-being",
    icon: TreePalm,
    paragraphs: [
      "Nellore's coastal landscape, natural surroundings and tourism destinations provide opportunities for recreation, leisure and relaxation. Notable destinations in the district include:",
    ],
    places: [
      "Mypadu Beach — a popular coastal destination known for its scenic shoreline.",
      "Krishnapatnam Beach and Lighthouse — a coastal attraction associated with the region's maritime identity.",
      "Kothakoduru Beach — a destination offering natural coastal scenery.",
      "Somasila Reservoir — a scenic water destination surrounded by the Eastern Ghats.",
      "Sangam and Penna Barrage — important water-related landmarks in the region.",
    ],
  },
];

export default function RegionalDevelopmentSection() {
  return (
    <section className="section section--alt regional-development" id="regional-development">
      <div className="container">
        <div className="section-head regional-development__intro">
          <span className="eyebrow">Social: Best Quality of Lives</span>
          <h2>Nellore — Where Tradition Meets Transformation</h2>
          <p>
            Located in the southeastern part of Andhra Pradesh, Nellore is a region blessed with
            rich agricultural heritage, natural resources, cultural diversity and growing
            industrial potential. Strategically positioned along the Chennai–Kolkata economic
            corridor, Nellore offers a promising environment for industrial investment, business
            development and an enhanced quality of life.
          </p>
          <p>
            With its agricultural strengths, educational institutions, healthcare facilities,
            cultural heritage, natural attractions and expanding industrial ecosystem, Nellore is
            emerging as an attractive destination for businesses, professionals, entrepreneurs
            and families.
          </p>
          <p>
            For IFFCO KISAN SEZ LIMITED (IKSEZ), Nellore represents more than an industrial
            location. It offers an opportunity to create an integrated industrial ecosystem where
            economic development goes hand in hand with social well-being, environmental
            responsibility and community prosperity.
          </p>
        </div>

        <div className="regional-development__pillars">
          <div className="regional-development__pillar-heading">
            <span className="eyebrow">Pillars of Regional Development</span>
            <p>Health <span>•</span> Education <span>•</span> Culture <span>•</span> Recreation</p>
            <p>
              The long-term growth of an industrial destination depends not only on factories and
              infrastructure, but also on the quality of its surrounding social and economic
              ecosystem.
            </p>
            <p>
              Nellore&apos;s healthcare, education, cultural, coastal and recreational strengths
              complement the development vision of IKSEZ.
            </p>
          </div>

          <div className="regional-development__grid">
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <article className="card regional-development__card" key={pillar.number}>
                  <div className="regional-development__card-heading">
                    <span className="regional-development__number">{pillar.number}</span>
                    <span className="card__icon" aria-hidden="true"><Icon /></span>
                    <h3>{pillar.title}</h3>
                  </div>
                  {pillar.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {pillar.places && (
                    <ul>
                      {pillar.places.map((place) => <li key={place}>{place}</li>)}
                    </ul>
                  )}
                  {pillar.number === "04" && (
                    <p>
                      These destinations, together with local parks, sports facilities,
                      hospitality establishments and recreational spaces, contribute to the
                      region&apos;s lifestyle potential. For industries at IKSEZ, regional recreation
                      can add to the quality of life of employees, visiting professionals and
                      their families.
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
