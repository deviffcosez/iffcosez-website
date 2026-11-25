import Link from "next/link";

const MAP_QUERY =
  "IFFCO Kisan SEZ, Racharlapadu, Kodavaluru Mandalam, SPSR Nellore, Andhra Pradesh";
const MAP_ZOOM = 6; // zoomed out to show southern India around Nellore
const MAP_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&z=${MAP_ZOOM}&output=embed`;
const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`;

// Live location map (same Google Maps embed as the contact page), with a
// directions link and a route to the contact page.
export default function StrategicLocation() {
  return (
    <section className="section strategic-location" aria-labelledby="strategic-location-title">
      <div className="container">
        <div className="section-head section-head--center">
          <span className="eyebrow">Where we are</span>
          <h2 id="strategic-location-title">Strategic Location</h2>
          <p>IFFCO Kisan SEZ is in Nellore district, Andhra Pradesh, on the Chennai–Kolkata economic corridor.</p>
        </div>
        <div className="strategic-location__frame">
          <iframe
            className="strategic-location__iframe"
            src={MAP_EMBED_SRC}
            title="IFFCO Kisan SEZ location map"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
        <div className="strategic-location__actions">
          <a className="btn btn--green" href={MAP_LINK} target="_blank" rel="noopener noreferrer">
            Get directions →
          </a>
          <Link className="btn btn--outline" href="/contact-us/">
            Contact us
          </Link>
        </div>
      </div>
    </section>
  );
}
