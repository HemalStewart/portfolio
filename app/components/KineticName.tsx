/**
 * The hero name as individual letters: a staggered spring-like rise on load
 * (transform only, so the text still paints immediately) and a hop on hover.
 * Pure CSS — see `.kinetic` in globals.css.
 */
export function KineticName({ lines }: { lines: string[] }) {
  let index = 0;
  return (
    <span aria-hidden="true" className="kinetic">
      {lines.map((line) => (
        <span key={line} className="kinetic-line">
          {line.split("").map((char) => {
            const i = index++;
            return (
              <span
                key={i}
                className="kinetic-char"
                style={{ "--i": i } as React.CSSProperties}
              >
                {char}
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
}
