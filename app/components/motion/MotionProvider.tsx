"use client";

import { LazyMotion, MotionConfig } from "motion/react";

// Motion's animation features load in their own chunk after first paint.
const loadFeatures = () => import("./features").then((mod) => mod.default);

/**
 * Lazily loads Motion's DOM animation features (used via `m` components) and
 * makes every animation honour the visitor's reduced-motion setting.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
