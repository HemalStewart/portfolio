"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

/**
 * Counts up to `value` the first time it scrolls into view. The server renders
 * the final number, so crawlers and no-JS visitors always see the real value.
 */
export function NumberTicker({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduced = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!inView || reduced || !node) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.2, 0.7, 0.1, 1],
      onUpdate: (latest) => {
        node.textContent = `${Math.round(latest)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, reduced, value, suffix]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
      {suffix}
    </span>
  );
}
