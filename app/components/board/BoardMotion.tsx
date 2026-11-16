"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __board?: boolean;
  }
}

/**
 * Builds the board as it scrolls into view: anything marked `.rv` gets
 * `data-in` the first time it is on screen, and board.css plays its entrance
 * (frames settle, notes pop, arrows draw). One observer for the whole page;
 * the hidden states only apply while `html[data-motion]` is set, so reduced
 * motion and no-script visitors see everything.
 */
export function BoardMotion() {
  useEffect(() => {
    window.__board = true;
    const targets = document.querySelectorAll<HTMLElement>(".rv");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // Also reveal what has already been scrolled past.
          if (!entry.isIntersecting && entry.boundingClientRect.top > 0)
            continue;
          (entry.target as HTMLElement).dataset.in = "";
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return null;
}
