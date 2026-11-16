import type { CSSProperties, ReactNode, SVGProps } from "react";

/** The four collaborators on the board: one cursor and one colour per craft. */
export const CRAFT_CURSORS = {
  design: "Design",
  web: "Web",
  flutter: "Flutter",
  ai: "Backend & AI",
} as const;
export type Who = keyof typeof CRAFT_CURSORS;

/** A collaborator's cursor: an arrow in their colour with a name tag. */
export function CursorMark({
  who,
  label,
  className = "",
  style,
}: {
  who: Who | "you";
  label?: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      className={`cur ${className}`}
      data-who={who}
      style={style}
      aria-hidden="true"
    >
      <svg viewBox="0 0 20 20" focusable="false">
        <path d="M2.2 2.2 17.6 8.4l-6.7 2.5-2.5 6.7Z" />
      </svg>
      <i>{label ?? (who === "you" ? "You" : CRAFT_CURSORS[who])}</i>
    </span>
  );
}

/*
 * Hand-drawn strokes, each in its own viewBox. `line` is the stroke that
 * draws itself; `head` (when there is one) flicks on after it.
 */
const SHAPES = {
  swoop: {
    box: "0 0 220 110",
    line: "M6 86C44 20 132 2 206 46",
    head: "M180 44l26 2-13-23",
  },
  hook: {
    box: "0 0 140 150",
    line: "M12 10c72 0 114 48 86 126",
    head: "M83 114l15 22 21-16",
  },
  loop: {
    box: "0 0 260 120",
    line: "M8 72C40 24 96 14 108 48c10 30-30 40-28 10 2-36 96-40 166 6",
    head: "M219 60l27 4-10-25",
  },
  down: {
    box: "0 0 90 170",
    line: "M46 6C20 52 70 96 42 160",
    head: "M25 139l17 21 21-15",
  },
  under: {
    box: "0 0 300 30",
    line: "M4 19C60 6 110 27 160 14s90-6 136 3",
    head: "",
  },
  circle: {
    box: "0 0 220 90",
    line: "M112 8C36 4 6 32 12 50c8 26 86 34 138 28 54-6 66-40 36-58C158 4 96 6 72 12",
    head: "",
  },
} as const;
export type Stroke = keyof typeof SHAPES;

/** A hand-drawn arrow or scribble that draws itself when it is revealed. */
export function Arrow({
  shape = "swoop",
  className = "",
  ...rest
}: { shape?: Stroke; className?: string } & SVGProps<SVGSVGElement>) {
  const stroke = SHAPES[shape];
  return (
    <svg
      className={`arrow arrow-${shape} ${className}`}
      viewBox={stroke.box}
      fill="none"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <path className="ar-line" d={stroke.line} pathLength={1} />
      {stroke.head ? (
        <path className="ar-head" d={stroke.head} pathLength={1} />
      ) : null}
    </svg>
  );
}

/** The name above a frame, the way a design tool labels its frames. */
export function FrameLabel({
  who,
  children,
}: {
  who?: Who;
  children: ReactNode;
}) {
  return (
    <span className="flabel" data-who={who}>
      <b aria-hidden="true">#</b>
      {children}
    </span>
  );
}

/** A rubber stamp, slightly off square. */
export function Stamp({
  children,
  className = "",
  ...rest
}: {
  children: ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={`stamp ${className}`} {...rest}>
      <span>{children}</span>
    </span>
  );
}
