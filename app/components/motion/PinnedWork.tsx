"use client";

import { useEffect, useRef, useState } from "react";

const QUERY =
  "(min-width: 1024px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)";

/**
 * Pins the featured case studies in a full-height stage and swaps them as the
 * page scrolls (one viewport of scroll per project). On small or short
 * screens, or with reduced motion, the cases simply stack — the same markup
 * without the `data-enabled` attribute.
 */
export function PinnedWork({
  titles,
  children,
}: {
  titles: string[];
  children: React.ReactNode;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(0);
  const count = titles.length;

  useEffect(() => {
    const mq = matchMedia(QUERY);
    const apply = () => setEnabled(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Active slide follows the track's scroll progress (one viewport each).
  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const track = trackRef.current;
      if (!track) return;
      const span = track.offsetHeight - window.innerHeight;
      const progress = span > 0 ? -track.getBoundingClientRect().top / span : 0;
      const next = Math.min(
        count - 1,
        Math.max(0, Math.floor(progress * count)),
      );
      setActive((current) => (current === next ? current : next));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [enabled, count]);

  // Mark slides before/active/after; inactive slides leave the tab order.
  useEffect(() => {
    const slides = slidesRef.current?.children;
    if (!slides) return;
    Array.from(slides).forEach((slide, index) => {
      const element = slide as HTMLElement;
      if (!enabled) {
        delete element.dataset.state;
        element.inert = false;
        return;
      }
      element.dataset.state =
        index < active ? "before" : index === active ? "active" : "after";
      element.inert = index !== active;
    });
  }, [active, enabled]);

  function go(index: number) {
    const track = trackRef.current;
    if (!track) return;
    const top = track.getBoundingClientRect().top + window.scrollY;
    const span = track.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: top + (span * (index + 0.5)) / count,
      behavior: "smooth",
    });
  }

  return (
    <div
      ref={trackRef}
      className="pinned-track"
      data-enabled={enabled || undefined}
      style={{ "--count": count } as React.CSSProperties}
    >
      <div className="pinned-stage">
        <div ref={slidesRef} className="pinned-slides">
          {children}
        </div>
        {enabled ? (
          <div className="pinned-indicator" role="group" aria-label="Projects">
            <span className="pinned-count" aria-hidden="true">
              <span key={active} className="pinned-count-now">
                {String(active + 1).padStart(2, "0")}
              </span>
              <span> / {String(count).padStart(2, "0")}</span>
            </span>
            {titles.map((title, index) => (
              <button
                key={title}
                type="button"
                onClick={() => go(index)}
                aria-label={`Show ${title}`}
                aria-current={index === active ? "step" : undefined}
              >
                <span aria-hidden="true" />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
