import type { CSSProperties, ReactNode } from "react";

/** Root of every screen: a 16:10 stage whose type scales with its width. */
export function Mock({
  name,
  palette,
  children,
  className = "",
}: {
  name: string;
  palette: Record<string, string>;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mock mock-${name} ${className}`}
      style={palette as CSSProperties}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}

export function Browser({
  url,
  children,
  className = "",
}: {
  url: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`m-browser ${className}`}>
      <div className="m-bar">
        <span className="m-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="m-url">{url}</span>
      </div>
      <div className="m-body">{children}</div>
    </div>
  );
}
