"use client";

import { motion } from "framer-motion";
import { useRef, type ReactNode } from "react";

export function GlowCard({
  children,
  accent = "#0e9f96",
  className = "",
}: {
  children: ReactNode;
  accent?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
      whileHover={{ y: -3 }}
      style={{ "--accent": accent } as React.CSSProperties}
      className={`group relative overflow-hidden rounded-2xl border border-border bg-white/[0.015] transition-colors duration-300 hover:border-[var(--accent)]/40 ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(500px circle at var(--mx, 50%) var(--my, 50%), color-mix(in srgb, var(--accent) 14%, transparent), transparent 65%)",
        }}
      />
      <span
        className="absolute inset-x-0 top-0 h-[2px] opacity-70"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--accent), transparent)",
        }}
      />
      <div className="relative">{children}</div>
    </motion.div>
  );
}
