import { textOf, Typed } from "../swarm/Typed";
import { Arrow, FrameLabel, type Who } from "./marks";

/**
 * Opens a section of the file: its frame label, an oversized title with one
 * phrase in the serif, a short lede, and optionally a handwritten aside. The
 * swarm builds it: the label is placed, the title typed, the lede written,
 * the aside's arrow traced.
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
    <header className="bhead" data-scene="">
      <p className="bhead-label" data-b="pop" data-name="Label" data-by={who}>
        <FrameLabel who={who}>
          {String(index).padStart(2, "0")} — {label}
        </FrameLabel>
      </p>
      <h2 id={id} data-b="type" data-name="Title" data-by={who}>
        <span className="sr-only">{textOf(title)}</span>
        <span aria-hidden="true">
          <Typed>{title}</Typed>
        </span>
      </h2>
      {description ? (
        <p className="blede" data-b="words" data-name="Lede" data-w="1">
          <Typed by="word">{description}</Typed>
        </p>
      ) : null}
      {note ? (
        <p className="note bhead-note" data-who={who} aria-hidden="true">
          <span data-b="pop" data-name="Note" data-w="1">
            {note}
          </span>
          <Arrow shape="hook" data-b="draw" data-name="Arrow" data-w="2" />
        </p>
      ) : null}
    </header>
  );
}
