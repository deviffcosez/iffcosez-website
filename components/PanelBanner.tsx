import PanelBannerSlider from "@/components/PanelBannerSlider";
import { PANEL_BANNERS } from "@/lib/panelBanners";

type PanelBannerProps = {
  /** Show only these panels (ids from lib/panelBanners.ts), in this order. Default: all. */
  only?: string[];
  /** Company heading above the banner. Pass false when the page has its own. */
  showHeading?: boolean;
  /** Distinguishes the heading id when a page has more than one banner. */
  id?: string;
};

// Auto-sliding infographic of the exhibition-panel messages (home page,
// Business Opportunities). The company identity appears once above the
// banner, not on every slide.
export default function PanelBanner({ only, showHeading = true, id = "panel-banner" }: PanelBannerProps) {
  const ids = (only ?? PANEL_BANNERS.map((panel) => panel.id)).filter((panelId) =>
    PANEL_BANNERS.some((panel) => panel.id === panelId),
  );
  if (ids.length === 0) return null;

  return (
    <section className="panel-banner" aria-labelledby={showHeading ? `${id}-title` : undefined} aria-label={showHeading ? undefined : "IKSEZ highlights"}>
      <div className="container">
        {showHeading && (
          <div className="panel-banner__head">
            <span className="eyebrow">IFFCO Kisan SEZ Limited</span>
            <h2 id={`${id}-title`}>A Unique Industrial Park Promoted by Indian Farmers through Co-operative Societies</h2>
            <p>A Fully Owned Subsidiary of IFFCO</p>
          </div>
        )}
        <PanelBannerSlider ids={ids} />
      </div>
    </section>
  );
}
