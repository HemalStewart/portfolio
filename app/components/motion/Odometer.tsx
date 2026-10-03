"use client";

import { AnimatePresence, m, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

function Digit({ value, delay }: { value: string; delay: number }) {
  return (
    <span className="odo-digit">
      <span className="odo-sizer">0</span>
      <AnimatePresence initial={false}>
        <m.span
          key={value}
          className="odo-value"
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.55, delay, ease: [0.2, 0.7, 0.1, 1] }}
        >
          {value}
        </m.span>
      </AnimatePresence>
    </span>
  );
}

/**
 * Rolling digits: rolls from zeros to the real value the first time it is
 * seen. Assistive tech and the server render get the plain value.
 */
export function Odometer({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduced = useReducedMotion();
  const target = String(value);
  const [shown, setShown] = useState(target);

  useEffect(() => {
    if (!inView || reduced) return;
    const zero = window.setTimeout(
      () => setShown("0".repeat(target.length)),
      0,
    );
    const roll = window.setTimeout(() => setShown(target), 140);
    return () => {
      window.clearTimeout(zero);
      window.clearTimeout(roll);
    };
  }, [inView, reduced, target]);

  return (
    <span ref={ref} className="odo">
      <span className="sr-only">
        {target}
        {suffix}
      </span>
      <span aria-hidden="true" className="odo-digits">
        {shown.split("").map((digit, i) => (
          <Digit key={shown.length - i} value={digit} delay={i * 0.07} />
        ))}
        {suffix}
      </span>
    </span>
  );
}
