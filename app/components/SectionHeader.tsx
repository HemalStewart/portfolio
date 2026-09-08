import type { ReactNode } from "react";

export function SectionHeader({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-brand-400">
      {children}
    </h2>
  );
}
