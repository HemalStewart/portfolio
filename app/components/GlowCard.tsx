"use client";

import { motion } from "framer-motion";
import { useRef, type ReactNode } from "react";

export function GlowCard({
  children,
  image,
  accent = "#14958a",
  className = "",
}: {
  children: ReactNode;
  image?: ReactNode;
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
      whileHover={{ y: -4 }}
      style={{ "--accent": accent } as React.CSSProperties}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_28px_-16px_rgba(15,23,42,0.12)] transition-shadow duration-300 hover:shadow-[0_1px_2px_rgba(15,23,42,0.04),0_24px_48px_-20px_var(--accent-shadow,rgba(15,23,42,0.18))]"
    >
      {image}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(500px circle at var(--mx, 50%) var(--my, 50%), color-mix(in srgb, var(--accent) 7%, transparent), transparent 65%)",
        }}
      />
      <span
        className="absolute inset-x-0 top-0 z-10 h-[3px]"
        style={{ background: "var(--accent)" }}
      />
      <div className={`relative ${className}`}>{children}</div>
    </motion.div>
  );
}
