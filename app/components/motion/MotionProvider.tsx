"use client";

import { LazyMotion, MotionConfig, domAnimation } from "motion/react";

/**
 * Loads only Motion's DOM animation features (via `m` components) and makes
 * every animation honour the visitor's reduced-motion setting.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
