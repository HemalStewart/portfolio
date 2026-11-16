import Image from "next/image";
import {
  showcaseSites,
  showcaseUrl,
  showcaseWhatsApp,
  type ShowcaseSite,
} from "../data/portfolio";
import { ArrowIcon } from "./icons";

const isExternal = (href: string) => /^https?:/.test(href);

const countWords = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
];
/** Small counts spelled out, the way the copy reads: 7 → "seven". */
export const countWord = (n: number) => countWords[n] ?? String(n);

/** How far each print sits off square, so the row reads as pinned by hand. */
const TILT = [-2.2, 1.6, -1.1, 2.4, -1.8, 0.9, -2.6, 1.9];

const STATUS: Record<ShowcaseSite["status"], string> = {
  live: "live",
  preview: "design preview",
  concept: "concept",
};

/** A website pinned to the board: a taped print with its name underneath. */
export function SitePrint({
  site,
  index,
}: {
  site: ShowcaseSite;
  index: number;
}) {
  const external = isExternal(site.href);
  return (
    <article
      className="print"
      style={{ "--r": `${TILT[index % TILT.length]}deg` } as React.CSSProperties}
      aria-labelledby={`site-${site.slug}-title`}
      data-b="frame"
      data-name={site.name}
    >
      <span className="tape" aria-hidden="true" />
      <div className="print-shot">
        <Image
          src={`/showcase/thumbs/${site.slug}.jpg`}
          alt=""
          width={1280}
          height={800}
          sizes="(max-width: 900px) 74vw, 320px"
        />
      </div>
      <p className="print-kind">
        <span className={site.status === "live" ? "tag tag-live" : "tag"}>
          {STATUS[site.status]}
        </span>
        {site.kind}
      </p>
      <h3 id={`site-${site.slug}-title`}>{site.name}</h3>
      <p className="print-line">{site.line}</p>
      <a
        className="ref"
        href={site.href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {site.status === "preview"
          ? "View preview"
          : external
            ? "Visit site"
            : "Open site"}
        <span className="sr-only">
          : {site.name}
          {external ? " (opens in a new tab)" : ""}
        </span>
        <ArrowIcon />
      </a>
    </article>
  );
}

/** Closes the row: the 3D fly-through, and an invitation. */
export function ShowcaseEnd() {
  return (
    <article
      className="print print-end"
      aria-labelledby="showcase-end-title"
      data-b="frame"
      data-name="3D showcase"
    >
      <h3 id="showcase-end-title">
        Fly through all {countWord(showcaseSites.length)} in 3D.
      </h3>
      <p className="print-line">
        Scroll, and a camera glides past each site in turn. Click any screen to
        open the real thing.
      </p>
      <a className="btn btn-ink" href={showcaseUrl}>
        Open the 3D showcase <ArrowIcon direction="right" />
      </a>
      <p className="print-next">
        Your brand, next? 3D, motion and scroll-driven websites for hotels, food
        and lifestyle brands.
      </p>
      <a
        className="ref"
        href={showcaseWhatsApp}
        target="_blank"
        rel="noopener noreferrer"
      >
        Start on WhatsApp
        <span className="sr-only"> (opens in a new tab)</span>
        <ArrowIcon />
      </a>
    </article>
  );
}
