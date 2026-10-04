"use client";

import { useReducedMotion } from "motion/react";
import { useEffect } from "react";

/** Lenis smooth scrolling with eased anchor jumps; off for reduced motion. */
export function SmoothScroll() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let cancelled = false;
    let destroy = () => {};
    // Lenis is fetched after hydration so it never delays first paint.
    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      const lenis = new Lenis({
        lerp: 0.12,
        smoothWheel: true,
        anchors: {
          offset: -84,
          // Lazily rendered blocks (content-visibility) can change height
          // while the jump passes them, so re-aim once it lands.
          onComplete: (instance) => {
            const target = location.hash
              ? document.getElementById(location.hash.slice(1))
              : null;
            if (target) instance.scrollTo(target, { offset: -84 });
          },
        },
      });
      const loop = (time: number) => {
        lenis.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      destroy = () => lenis.destroy();
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      destroy();
    };
  }, [reduced]);

  return null;
}
