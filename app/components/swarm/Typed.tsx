import {
  Children,
  cloneElement,
  isValidElement,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";

type WithChildren = ReactElement<{ children?: ReactNode }>;

/** The plain text of a node: the screen-reader copy of a typed heading. */
export function textOf(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement(node)) return textOf((node as WithChildren).props.children);
  return "";
}

/**
 * Splits text into numbered letters (`.tc`) or words (`.tw`) so a cursor can
 * type it: swarm.css shows a unit once the step's `--n` passes its `--i`.
 * Inline elements such as <em> and <strong> are kept, and words never break.
 */
export function Typed({
  children,
  by = "char",
}: {
  children: ReactNode;
  by?: "char" | "word";
}) {
  let i = 0;
  const unit = (n: number) => ({ "--i": n }) as CSSProperties;

  const walk = (node: ReactNode): ReactNode =>
    Children.map(node, (child) => {
      if (typeof child === "string" || typeof child === "number")
        return String(child)
          .split(/(\s+)/)
          .map((part, k) => {
            if (!part) return null;
            if (/^\s+$/.test(part)) return " ";
            if (by === "word")
              return (
                <span key={k} className="tw" style={unit(i++)}>
                  {part}
                </span>
              );
            return (
              <span key={k} className="tw">
                {Array.from(part).map((char, j) => (
                  <span key={j} className="tc" style={unit(i++)}>
                    {char}
                  </span>
                ))}
              </span>
            );
          });
      if (isValidElement(child)) {
        const element = child as WithChildren;
        return cloneElement(element, undefined, walk(element.props.children));
      }
      return child;
    });

  return <>{walk(children)}</>;
}
