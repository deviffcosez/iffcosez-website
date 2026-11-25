import { Building2, MapPin, Plane, Route, Ship, TrainFront, Trees } from "lucide-react";

// Distances and land areas for the Industrial Park, grouped by mode (road,
// rail, port, airport) and land area. Shared by /infrastructure/ and
// /connectivity/; render it inside a section container.
const CONNECTIVITY_AND_AREA = [
  {
    title: "Road",
    icon: Route,
    facts: [
      { value: "8 km", label: "National Highway 16 frontage", icon: Route },
      { value: "260 km", label: "From Vijayawada", icon: MapPin },
      { value: "160 km", label: "From Tirupati", icon: MapPin },
      { value: "200 km", label: "From Chennai", icon: MapPin },
    ],
  },
  {
    title: "Rail",
    icon: TrainFront,
    facts: [{ value: "20 km", label: "From Nellore Railway Station", icon: TrainFront }],
  },
  {
    title: "Port",
    icon: Ship,
    facts: [
      { value: "50 km", label: "From Krishnapatnam Port", icon: Ship },
      { value: "50 km", label: "From Ramayapatnam Port", icon: Ship },
    ],
  },
  {
    title: "Airport",
    icon: Plane,
    facts: [
      { value: "8 km", label: "From Dagadarthi (proposed Nellore Airport)", icon: Plane },
      { value: "150 km", label: "From Tirupati Airport", icon: Plane },
      { value: "210 km", label: "From Chennai International Airport", icon: Plane },
    ],
  },
  {
    title: "Land area",
    icon: Building2,
    facts: [
      { value: "1,899 acres", label: "Special Economic Zone (SEZ)", icon: Building2 },
      { value: "877 acres", label: "Domestic Tariff Zone (DTZ)", icon: Building2 },
      { value: "393 acres", label: "Green belt", icon: Trees },
    ],
  },
];

export default function ConnectivityLocation() {
  return (
    <>
      <div className="section-head section-head--center infrastructure-facts-head">
        <span className="eyebrow">Connectivity &amp; Location</span>
        <h2>IKSEZ logistical convenience</h2>
        <p>Distances and planned land areas for the Industrial Park.</p>
      </div>
      {CONNECTIVITY_AND_AREA.map((group) => (
        <div className="infrastructure-fact-group" key={group.title}>
          <h3 className="infrastructure-fact-group__title">
            <group.icon aria-hidden="true" />
            {group.title}
          </h3>
          <div className="infrastructure-facts" aria-label={`${group.title} facts`}>
            {group.facts.map((item) => (
              <article className="infrastructure-fact" key={item.label}>
                <div className="infrastructure-fact__value">
                  <item.icon aria-hidden="true" />
                  <strong>{item.value}</strong>
                </div>
                <span>{item.label}</span>
              </article>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
