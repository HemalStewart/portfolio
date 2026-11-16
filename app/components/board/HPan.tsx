"use client";

import { useEffect, useRef, useState } from "react";

/** Pixels of pan per pixel of scroll: a long wall should not feel long. */
const SPEED = 1.6;

const QUERY =
  "(min-width: 901px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)";

/**
 * Pans across a wide row as the page scrolls: the stage is pinned and the
 * row slides sideways, like dragging the canvas of a board; the track's
 * height sets how much scrolling the pan takes (see SPEED). On
 * small screens, or with reduced motion, the row is a swipeable strip.
 */
export function HPan({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = matchMedia(QUERY);
    const apply = () => setEnabled(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    const row = rowRef.current;
    if (!track || !row || !enabled) return;
    let raf = 0;
    let distance = 0;

    const layout = () => {
      // From the row's start to the far edge of its last print, plus the
      // same margin on the right as the row has on the left.
      const last = row.lastElementChild as HTMLElement | null;
      const side = parseFloat(getComputedStyle(row).paddingLeft) || 0;
      const end = last ? last.offsetLeft + last.offsetWidth : row.scrollWidth;
      distance = Math.max(0, end + side - row.clientWidth);
      track.style.height = `calc(100svh + ${Math.round(distance / SPEED)}px)`;
      move();
    };
    const move = () => {
      raf = 0;
      const rect = track.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      const progress = span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 0;
      row.style.transform = `translate3d(${-progress * distance}px, 0, 0)`;
      track.style.setProperty("--pan", progress.toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(move);
    };
    layout();
    const resize = new ResizeObserver(layout);
    resize.observe(row);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", layout);
    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", layout);
      track.style.height = "";
      track.style.removeProperty("--pan");
      row.style.transform = "";
    };
  }, [enabled]);

  return (
    <div ref={trackRef} className="hpan" data-enabled={enabled || undefined}>
      <div className="hpan-stage">
        <div
          ref={rowRef}
          className="hpan-row"
          role="group"
          aria-label={label}
          tabIndex={enabled ? undefined : 0}
        >
          {children}
        </div>
        <div className="hpan-bar" aria-hidden="true">
          <i />
        </div>
      </div>
    </div>
  );
}
