"use client";

import { m, useMotionTemplate, useMotionValue } from "motion/react";
import { useEffect, useRef } from "react";

/**
 * A soft light that follows the pointer across its parent card. It listens on
 * the parent and ignores pointer events itself, so links stay clickable.
 */
export function Spotlight({ size = 360 }: { size?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);
  const background = useMotionTemplate`radial-gradient(${size}px circle at ${x}px ${y}px, var(--spotlight), transparent 70%)`;

  useEffect(() => {
    const parent = ref.current?.parentElement;
    if (!parent) return;
    function move(event: PointerEvent) {
      if (event.pointerType !== "mouse" || !parent) return;
      const rect = parent.getBoundingClientRect();
      x.set(event.clientX - rect.left);
      y.set(event.clientY - rect.top);
    }
    function leave() {
      x.set(-1000);
      y.set(-1000);
    }
    parent.addEventListener("pointermove", move);
    parent.addEventListener("pointerleave", leave);
    return () => {
      parent.removeEventListener("pointermove", move);
      parent.removeEventListener("pointerleave", leave);
    };
  }, [x, y]);

  return (
    <m.span
      ref={ref}
      className="spotlight"
      aria-hidden="true"
      style={{ background }}
    />
  );
}
