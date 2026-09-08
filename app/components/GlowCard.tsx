"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export function GlowCard({
  children,
  image,
  className = "",
}: {
  children: ReactNode;
  image?: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      initial={reduceMotion ? undefined : { opacity: 0, y: 18 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
      whileHover={reduceMotion ? undefined : { y: -3 }}
      className="group overflow-hidden rounded-[28px] border border-border bg-card transition-colors duration-300 hover:border-white/20"
    >
      {image}
      <div className={className}>{children}</div>
    </motion.article>
  );
}
