"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { PANEL_BANNERS } from "@/lib/panelBanners";

const DELAY = 6500;
// The frame cycles through this many solid brand colours, one per slide
// (see the .panel-banner__frame[data-tone] rules in components.css).
const TONES = 5;

// Auto-sliding banner of the exhibition-panel messages. Slides stack in one
// grid cell (so the height is the tallest slide, no fixed height) and cross-
// slide with a fade; the points pop in one after another. Pauses on hover /
// focus / hidden tab or via the button; all motion is off under
// prefers-reduced-motion (see components.css).
// Takes panel ids (not the panels): the panels hold icon components, which
// can't be passed from a server component to this client one.
export default function PanelBannerSlider({ ids }: { ids: string[] }) {
  const slides = ids
    .map((id) => PANEL_BANNERS.find((panel) => panel.id === id))
    .filter((panel) => panel !== undefined);
  const total = slides.length;
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovering, setHovering] = useState(false);
  const [hidden, setHidden] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const go = useCallback((i: number) => setIndex(((i % total) + total) % total), [total]);
  const running = playing && !hovering && !hidden;

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // Restarting on every index change also restarts the progress-bar animation.
  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(() => setIndex((cur) => (cur + 1) % total), DELAY);
    return () => clearTimeout(timer);
  }, [running, index, total]);

  return (
    <div
      className="panel-banner__frame"
      data-tone={index % TONES}
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="IKSEZ highlights"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={(e) => {
        if (!rootRef.current?.contains(e.relatedTarget as Node)) setHovering(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(index + 1);
        if (e.key === "ArrowLeft") go(index - 1);
      }}
    >
      <div className="panel-banner__track" aria-live={running ? "off" : "polite"}>
        {slides.map((slide, i) => {
          const active = i === index;
          return (
            <article
              key={slide.id}
              className={`panel-banner__slide${active ? " is-active" : ""}`}
              aria-hidden={!active}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${total}`}
              // inert keeps links/buttons in hidden slides out of the tab order
              {...(active ? {} : { inert: true })}
            >
              <div className="panel-banner__copy">
                <span className="panel-banner__number">{String(i + 1).padStart(2, "0")}</span>
                <h3>{slide.headline}</h3>
                {slide.subline && <p className="panel-banner__subline">{slide.subline}</p>}
                {slide.cta && (
                  <Link className="btn btn--green" href={slide.cta.href}>
                    {slide.cta.label}
                  </Link>
                )}
              </div>
              <ul className={`panel-banner__points panel-banner__points--${slide.points.length}`}>
                {slide.points.map((point, k) => (
                  <li key={point.label} style={{ ["--i" as string]: k }}>
                    <span className="panel-banner__icon" aria-hidden="true">
                      <point.icon />
                    </span>
                    <span>{point.label}</span>
                  </li>
                ))}
              </ul>
              <p className="panel-banner__footer">{slide.footer}</p>
            </article>
          );
        })}
      </div>

      <div className="panel-banner__controls">
        <button type="button" onClick={() => go(index - 1)} aria-label="Previous slide">
          <ChevronLeft />
        </button>
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause slideshow" : "Play slideshow"}
        >
          {playing ? <Pause /> : <Play />}
        </button>
        <button type="button" onClick={() => go(index + 1)} aria-label="Next slide">
          <ChevronRight />
        </button>
        <div className="panel-banner__dots" role="tablist" aria-label="Choose slide">
          {slides.map((slide, i) => (
            <button
              type="button"
              key={slide.id}
              role="tab"
              aria-selected={i === index}
              aria-label={`Slide ${i + 1}: ${slide.headline}`}
              className={i === index ? "is-active" : undefined}
              onClick={() => go(i)}
            />
          ))}
        </div>
        <span className="panel-banner__count">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>

      <div className="panel-banner__progress" aria-hidden="true">
        <span key={`${index}-${running}`} className={running ? "is-running" : undefined} style={{ animationDuration: `${DELAY}ms` }} />
      </div>
    </div>
  );
}
