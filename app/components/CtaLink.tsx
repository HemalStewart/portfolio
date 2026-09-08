import type { AnchorHTMLAttributes } from "react";

type CtaVariant = "primary" | "secondary" | "ghost";

const variantClasses: Record<CtaVariant, string> = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 shadow-[0_1px_2px_rgba(15,23,42,0.06)]",
  secondary:
    "border border-slate-300 text-slate-800 hover:border-slate-400 hover:bg-slate-50",
  ghost: "text-slate-600 hover:text-slate-900",
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
