import type { AnchorHTMLAttributes } from "react";

type CtaVariant = "primary" | "secondary" | "ghost";

const variantClasses: Record<CtaVariant, string> = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] shadow-[0_4px_14px_-4px_rgba(13,122,113,0.45)]",
  secondary:
    "border border-slate-300 text-slate-800 hover:border-brand-400 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] bg-white",
  ghost: "text-slate-600 hover:text-brand-700",
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
