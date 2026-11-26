"use client";

import { useEffect, useRef, useState } from "react";
import { MAP_EMBED_SRC } from "@/lib/siteMap";

// Google Maps embed that only loads when it is about to scroll into view.
// The embed pulls ~400 KB of Maps scripts; native loading="lazy" on an
// iframe starts that download 1,250–2,500px before it is visible, so it was
// still counted against the home page's first load. Until then the box shows
// a light placeholder of the same size, so nothing shifts.
export default function MapEmbed({ className }: { className?: string }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    if (!("IntersectionObserver" in window)) {
      setShow(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShow(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={boxRef} className={`map-lazy ${className ?? ""}`}>
      {show ? (
        <iframe
          src={MAP_EMBED_SRC}
          title="IFFCO Kisan SEZ location map"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <span className="map-lazy__placeholder" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z" />
            <circle cx="12" cy="10" r="2.6" />
          </svg>
        </span>
      )}
    </div>
  );
}
