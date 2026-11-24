import Link from "next/link";

// Location map (India > Andhra Pradesh > Nellore). The whole image links to
// the contact page.
export default function StrategicLocation() {
  return (
    <section className="section strategic-location" aria-labelledby="strategic-location-title">
      <div className="container">
        <div className="section-head section-head--center">
          <span className="eyebrow">Where we are</span>
          <h2 id="strategic-location-title">Strategic Location</h2>
          <p>IFFCO Kisan SEZ is in Nellore district, Andhra Pradesh, on the Chennai–Kolkata economic corridor.</p>
        </div>
        <Link
          className="strategic-location__map"
          href="/contact-us/"
          aria-label="Strategic location map of India, Andhra Pradesh and Nellore. Contact us"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/strategic-location.webp"
            alt="Map showing Nellore in Andhra Pradesh, India"
            width={1412}
            height={1114}
            loading="lazy"
          />
        </Link>
      </div>
    </section>
  );
}
