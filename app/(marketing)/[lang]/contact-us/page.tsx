import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import ContactForm from "@/components/ContactForm";
import { MAP_EMBED_SRC } from "@/lib/siteMap";

export const metadata: Metadata = {
  title: "Contact us | IFFCO Kisan SEZ",
  description:
    "Contact IFFCO Kisan SEZ Limited — Project Office at Racharlapadu, adjacent to NH-16, Kodavaluru Mandalam, SPSR Nellore, Andhra Pradesh.",
};

export default function ContactUs() {
  return (
    <>
      <PageHero
        title="Contact us"
        subtitle="Talk to the IKSEZ team about setting up your unit."
        banner="/images/contact-banner.webp"
      />

      <section className="section">
        <div className="container">
          <div className="contact-layout">
            {/* ---------- FORM (primary) ---------- */}
            <div className="contact-card contact-form-card" data-reveal="">
              <ContactForm />
            </div>

            {/* ---------- DETAILS (stays in view beside the form) ---------- */}
            <aside className="contact-card contact-details" data-reveal="" aria-label="Contact details">
              <h2 className="contact-card__title">Get in touch</h2>
              <ul className="contact-list">
                <li>
                  <span className="contact-list__icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
                    </svg>
                  </span>
                  <span>
                    <small>Phone</small>
                    <a href="tel:+919652993599">+91-9652993599</a>
                  </span>
                </li>
                <li>
                  <span className="contact-list__icon">
                    <svg viewBox="0 0 24 24">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m2 7 10 6 10-6" />
                    </svg>
                  </span>
                  <span>
                    <small>Email</small>
                    <a href="mailto:ceooffice@iffcosez.in">ceooffice@iffcosez.in</a>
                  </span>
                </li>
              </ul>

              <hr className="contact-details__rule" />

              <ul className="contact-list">
                <li>
                  <span className="contact-list__icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z" />
                      <circle cx="12" cy="10" r="2.6" />
                    </svg>
                  </span>
                  <span>
                    <small>Project Office</small>
                    <address>
                      IFFCO Kisan SEZ Limited, Village &amp; Post: Racharlapadu, Adjacent to NH-16,
                      Kodavaluru Mandalam, District: SPSR Nellore, Pin Code: 524319 (A.P)
                    </address>
                  </span>
                </li>
                <li>
                  <span className="contact-list__icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M3 21h18M5 21V7l7-4 7 4v14" />
                      <path d="M9 21v-5h6v5M9 11h.01M15 11h.01" />
                    </svg>
                  </span>
                  <span>
                    <small>Registered Office</small>
                    <address>IFFCO Sadan, C-1, District Centre, Saket Place, Saket, New Delhi-110017</address>
                  </span>
                </li>
              </ul>
            </aside>
          </div>

          <div className="map-embed" data-reveal="">
            <iframe
              src={MAP_EMBED_SRC}
              title="IFFCO Kisan SEZ location map"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
