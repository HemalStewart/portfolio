import type { AnchorHTMLAttributes } from "react";

type CtaVariant = "primary" | "secondary" | "ghost";

const lightVariants: Record<CtaVariant, string> = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] shadow-[0_4px_14px_-4px_rgba(13,122,113,0.45)]",
  secondary:
    "border border-slate-300 bg-white text-slate-800 hover:border-brand-400 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97]",
  ghost: "text-slate-600 hover:text-brand-700",
};

const darkVariants: Record<CtaVariant, string> = {
  primary:
    "bg-brand-400 text-[#06131a] hover:bg-brand-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] shadow-[0_6px_20px_-6px_rgba(63,179,165,0.6)]",
  secondary:
    "border border-white/25 bg-white/5 text-white hover:bg-white/10 hover:border-white/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97]",
  ghost: "text-slate-300 hover:text-white",
};

export function CtaLink({
  href,
  variant = "secondary",
  external,
  onDark,
  children,
  ...rest
}: {
  href: string;
  variant?: CtaVariant;
  external?: boolean;
  onDark?: boolean;
  children: React.ReactNode;
} & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const variants = onDark ? darkVariants : lightVariants;

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full px-5 text-sm font-medium transition ${variants[variant]}`}
      {...rest}
    >
      {children}
    </a>
  );
}
