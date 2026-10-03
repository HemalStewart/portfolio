"use client";

import { useEffect } from "react";

/**
 * One delegated listener drives the pointer spotlight on every `.case` and
 * `.card`: it writes the pointer position as CSS variables on the hovered
 * element, and CSS paints the glow. Mouse only.
 */
export function SpotlightTracker() {
  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches) return;
    let raf = 0;
    let last: PointerEvent | null = null;
    const paint = () => {
      raf = 0;
      const event = last;
      const target = (event?.target as Element | null)?.closest<HTMLElement>(
        ".case, .card",
      );
      if (!event || !target) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--sx", `${event.clientX - rect.left}px`);
      target.style.setProperty("--sy", `${event.clientY - rect.top}px`);
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      last = event;
      if (!raf) raf = requestAnimationFrame(paint);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);
  return null;
}
