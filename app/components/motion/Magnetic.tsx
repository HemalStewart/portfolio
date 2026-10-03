"use client";

import { m, useMotionValue, useReducedMotion, useSpring } from "motion/react";

/** Pulls its child gently toward the pointer (fine pointers only). */
export function Magnetic({
  children,
  strength = 0.3,
}: {
  children: React.ReactNode;
  strength?: number;
}) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });

  function onPointerMove(event: React.PointerEvent<HTMLSpanElement>) {
    if (reduced || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * strength);
    y.set((event.clientY - rect.top - rect.height / 2) * strength);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <m.span
      className="magnetic"
      style={{ x: springX, y: springY }}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
    >
      {children}
    </m.span>
  );
}
