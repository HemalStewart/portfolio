/**
 * A paragraph whose words fill with ink one by one as it scrolls through the
 * viewport. Pure CSS scroll-driven animation (see `.scrub` in globals.css):
 * no JavaScript, and browsers without support simply show the inked text.
 * Words wrapped in asterisks (`*own*`) are set in the italic serif.
 */
export function ScrubText({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <p className="scrub">
      {words.map((word, index) => {
        const emphasis = /^\*(.+)\*([.,;:]?)$/.exec(word);
        return (
          <span
            key={index}
            className="scrub-word"
            style={{ "--p": (index / words.length) * 100 } as React.CSSProperties}
          >
            {emphasis ? (
              <>
                <em>{emphasis[1]}</em>
                {emphasis[2]}
              </>
            ) : (
              word
            )}{" "}
          </span>
        );
      })}
    </p>
  );
}
