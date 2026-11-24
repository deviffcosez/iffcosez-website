import Link from "next/link";
import { PANEL_BANNERS } from "@/lib/panelBanners";

type PanelShowcaseProps = {
  /** Show only these panels (ids from lib/panelBanners.ts), in this order. Default: all. */
  only?: string[];
};

// The exhibition-panel messages as a light, zig-zag list: every panel in
// turn, text on one side and its points on the other, alternating left and
// right. Same content as PanelBanner, without the slider or the dark colours.
export default function PanelShowcase({ only }: PanelShowcaseProps) {
  const panels = (only ?? PANEL_BANNERS.map((panel) => panel.id))
    .map((id) => PANEL_BANNERS.find((panel) => panel.id === id))
    .filter((panel) => panel !== undefined);
  if (panels.length === 0) return null;

  return (
    <section className="panel-showcase" aria-label="IKSEZ highlights">
      {panels.map((panel, index) => (
        <article
          className={`panel-showcase__row${index % 2 ? " panel-showcase__row--reverse" : ""}`}
          key={panel.id}
        >
          <div className="container panel-showcase__inner">
            <div className="panel-showcase__copy" data-reveal="">
              <span className="panel-showcase__number">{String(index + 1).padStart(2, "0")}</span>
              <h2>{panel.headline}</h2>
              {panel.subline && <p className="panel-showcase__subline">{panel.subline}</p>}
              <p className="panel-showcase__tagline">{panel.footer}</p>
              {panel.cta && (
                <Link className="btn btn--green" href={panel.cta.href}>
                  {panel.cta.label}
                </Link>
              )}
            </div>
            <ul className={`panel-showcase__points panel-showcase__points--${panel.points.length}`} data-reveal="">
              {panel.points.map((point, k) => (
                <li key={point.label} style={{ ["--i" as string]: k }}>
                  <span className="panel-showcase__icon" aria-hidden="true">
                    <point.icon />
                  </span>
                  <span>{point.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>
      ))}
    </section>
  );
}
