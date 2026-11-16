"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

/**
 * The technology marquee. It drifts on a CSS animation; while it is on
 * screen, scrolling speeds it up and leans the words into the direction of
 * travel, then both ease back. With reduced motion it is a static list (see
 * the media query in globals.css).
 */
export function Marquee({ items }: { items: string[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const track = trackRef.current;
    if (!track || reduced) return;
    let raf = 0;
    let visible = false;
    let last = window.scrollY;
    let velocity = 0;

    const tick = () => {
      raf = 0;
      const y = window.scrollY;
      // Pixels scrolled this frame, smoothed and capped.
      velocity += (y - last - velocity) * 0.1;
      last = y;
      const v = Math.max(-48, Math.min(48, velocity));
      const drift = track.getAnimations()[0];
      if (drift) drift.playbackRate = 1 + Math.abs(v) * 0.12;
      track.style.setProperty("--lean", `${(-v * 0.16).toFixed(2)}deg`);
      if (visible) raf = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) {
        last = window.scrollY;
        raf = requestAnimationFrame(tick);
      }
    });
    observer.observe(track);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      track.style.removeProperty("--lean");
    };
  }, [reduced]);

  return (
    <div className="marquee" aria-label="Technologies">
      <div ref={trackRef} className="marquee-track">
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1 ? true : undefined}>
            {items.map((item, index) => (
              <li
                key={item}
                className={index % 2 ? "marquee-outline" : undefined}
              >
                {item}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
