import type { AnchorHTMLAttributes } from "react";

type CtaVariant = "primary" | "secondary" | "ghost";

const variantClasses: Record<CtaVariant, string> = {
  primary:
    "bg-brand-400 text-white hover:bg-brand-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] shadow-[0_6px_20px_-6px_rgba(244,63,111,0.55)]",
  secondary:
    "border border-white/25 bg-white/5 text-white hover:bg-white/10 hover:border-white/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97]",
  ghost: "text-slate-300 hover:text-white",
};

export function CtaLink({
  href,
  variant = "secondary",
  external,
  children,
  ...rest
}: {
  href: string;
  variant?: CtaVariant;
  external?: boolean;
  children: React.ReactNode;
} & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full px-5 text-sm font-medium transition ${variantClasses[variant]}`}
      {...rest}
    >
      {children}
    </a>
  );
}
