import { Arrow, CursorMark, FrameLabel, type Who } from "./marks";

/**
 * Opens a section of the board: its frame label, an oversized title with one
 * highlighted phrase, a short lede, and optionally a handwritten aside. The
 * section's cursor flies in to park beside the title.
 */
export function BoardHead({
  id,
  index,
  label,
  who,
  title,
  description,
  note,
}: {
  id: string;
  index: number;
  label: string;
  who: Who;
  title: React.ReactNode;
  description?: string;
  note?: string;
}) {
  return (
    <header className="bhead">
      <p className="bhead-label rv">
        <FrameLabel who={who}>
          {String(index).padStart(2, "0")} — {label}
        </FrameLabel>
      </p>
      <h2 id={id} className="rv">
        {title}
      </h2>
      {description ? <p className="blede rv">{description}</p> : null}
      {note ? (
        <p className="note bhead-note rv" data-who={who} aria-hidden="true">
          <span>{note}</span>
          <Arrow shape="hook" />
        </p>
      ) : null}
      <CursorMark who={who} className="park rv" />
    </header>
  );
}
