import type { CSSProperties, ReactNode } from "react";

/** A skeleton text bar; `w` is a percentage of the line. */
export function Sk({
  w = 60,
  className = "",
}: {
  w?: number;
  className?: string;
}) {
  return <i className={`sk ${className}`} style={{ width: `${w}%` }} />;
}

/** Root of every mockup: a 16:10 stage whose type scales with its width. */
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

export function Phone({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={`m-phone ${className}`} style={style}>
      <span className="m-notch" />
      <div className="m-screen">{children}</div>
    </div>
  );
}

/** A smooth SVG line chart that draws itself in when scrolled into view. */
export function LineChart({
  series,
  className = "",
}: {
  series: { points: number[]; color: string; fill?: boolean }[];
  className?: string;
}) {
  const path = (points: number[]) =>
    points
      .map((y, i) => {
        const x = (i / (points.length - 1)) * 100;
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${(40 - y * 36).toFixed(1)}`;
      })
      .join(" ");
  return (
    <svg
      className={`m-chart ${className}`}
      viewBox="0 0 100 42"
      preserveAspectRatio="none"
    >
      {[10, 20, 30].map((y) => (
        <line key={y} x1="0" x2="100" y1={y} y2={y} className="m-grid" />
      ))}
      {series.map((s, i) =>
        s.fill ? (
          <path
            key={`f${i}`}
            d={`${path(s.points)} L100 42 L0 42 Z`}
            fill={s.color}
            className="m-area"
          />
        ) : null,
      )}
      {series.map((s, i) => (
        <path
          key={i}
          d={path(s.points)}
          stroke={s.color}
          className="m-line draw"
          pathLength={1}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

export function Bars({
  values,
  color,
  className = "",
}: {
  values: number[];
  color: string;
  className?: string;
}) {
  return (
    <div className={`m-bars ${className}`}>
      {values.map((v, i) => (
        <i
          key={i}
          className="grow-y"
          style={
            {
              height: `${Math.max(v * 100, 3)}%`,
              background: color,
              "--d": i,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
