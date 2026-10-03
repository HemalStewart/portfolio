/**
 * A paragraph whose words fill with ink one by one as it scrolls through the
 * viewport. Pure CSS scroll-driven animation (see `.scrub` in globals.css):
 * no JavaScript, and browsers without support simply show the inked text.
 */
export function ScrubText({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <p className="scrub">
      {words.map((word, index) => (
        <span
          key={index}
          className="scrub-word"
          style={{ "--p": (index / words.length) * 100 } as React.CSSProperties}
        >
          {word}{" "}
        </span>
      ))}
    </p>
  );
}
