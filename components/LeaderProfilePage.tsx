import CtaBand from "@/components/CtaBand";
import LeaderGallery from "@/components/LeaderGallery";
import XSocialCorner from "@/components/XSocialCorner";
import { LEADER_LEAF, type LeaderProfileContent } from "@/lib/leaderProfiles";

const X_ICON = "M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-6.4L6.4 22H3.3l7.3-8.3L2.9 2h6.4l4.4 5.9L18.9 2Zm-1.1 18.1h1.7L7.3 3.8H5.5l12.3 16.3Z";

/* eslint-disable @next/next/no-img-element */

// A leader's profile page, laid out like the leadership profiles on iffco.in:
// hero, highlights band, feature blocks, photo gallery and Social Corner.
export default function LeaderProfilePage({ profile }: { profile: LeaderProfileContent }) {
  const { hero, highlights, features, gallery, social } = profile;

  return (
    <div className="leader-page">
      {/* ================= HERO ================= */}
      <section className="leader-hero">
        <div className="container leader-hero__grid">
          <h1 className="leader-hero__title">{hero.title}</h1>
          <div className="leader-hero__intro">
            <p>{hero.intro}</p>
            <h2>{hero.name}</h2>
            <a className="leader-hero__follow" href={`https://x.com/${social.handle}`} target="_blank" rel="noopener noreferrer">
              <span>Follow on</span>
              <svg viewBox="0 0 24 24" aria-label="X" role="img">
                <path d={X_ICON} />
              </svg>
            </a>
          </div>
          <img className="leader-hero__photo" src={hero.image} alt={hero.name} />
        </div>
      </section>

      {/* ================= HIGHLIGHTS ================= */}
      <section className="leader-torch">
        <div className="container">
          <h2 className="leader-heading">{highlights.heading}</h2>
          <div className="leader-torch__grid">
            {highlights.rows.map((row, i) => (
              <div className={`leader-torch__row${i % 2 ? " leader-torch__row--flip" : ""}`} key={row.image}>
                <img src={row.image} alt="" loading="lazy" />
                <div className="leader-torch__text">
                  <div>
                    {row.title && <p className="leader-torch__title">{row.title}</p>}
                    {row.lines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURE BLOCKS ================= */}
      {features.map((feature) =>
        feature.layout === "overlap" ? (
          <section className="leader-overlap" key={feature.title}>
            <div className="container">
              <div className="leader-overlap__wrap">
                <img className="leader-leaf leader-overlap__leaf" src={LEADER_LEAF} alt="" aria-hidden="true" />
                <img className="leader-overlap__photo" src={feature.image} alt="" loading="lazy" />
                <div className="leader-overlap__box">
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                  <img src={feature.smallImage} alt="" loading="lazy" />
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="leader-split" key={feature.title}>
            <div className="container">
              <div className="leader-split__wrap">
                <img className="leader-leaf leader-split__leaf" src={LEADER_LEAF} alt="" aria-hidden="true" />
                <div className="leader-split__box">
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                </div>
                <img className="leader-split__photo" src={feature.image} alt="" loading="lazy" />
              </div>
            </div>
          </section>
        ),
      )}

      {/* ================= GALLERY ================= */}
      <section className="leader-gallery-section">
        <LeaderGallery tabs={gallery} />
      </section>

      {/* ================= SOCIAL CORNER ================= */}
      <XSocialCorner social={social} />

      <CtaBand />
    </div>
  );
}
