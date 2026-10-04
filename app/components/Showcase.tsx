import Image from "next/image";
import {
  showcaseSites,
  showcaseUrl,
  showcaseWhatsApp,
  type ShowcaseSite,
} from "../data/portfolio";
import { ArrowIcon } from "./icons";

const isExternal = (href: string) => /^https?:/.test(href);

/** Back to front: the three screens fanned out in depth on the lead panel. */
const fan = ["sapphire", "coffee", "tea"];

/** Dark lead panel that sends people into the 3D fly-through at /showcase. */
export function ShowcaseFeature() {
  return (
    <div className="showcase-feature reveal">
      <div>
        <p className="showcase-kicker">
          <span className="tag">new</span>
          <span>{showcaseSites.length} sites · one 3D scene</span>
        </p>
        <h3>Fly through all seven in 3D.</h3>
        <p>
          Scroll, and a camera glides past each site in turn. Click any screen
          to open the real thing.
        </p>
        <a className="button showcase-cta" href={showcaseUrl}>
          Open the 3D showcase <ArrowIcon direction="right" />
        </a>
      </div>
      <a
        className="showcase-fan"
        href={showcaseUrl}
        tabIndex={-1}
        aria-hidden="true"
      >
        {fan.map((slug, index) => (
          <Image
            key={slug}
            src={`/showcase/thumbs/${slug}.jpg`}
            alt=""
            width={1280}
            height={800}
            sizes="(max-width: 900px) 70vw, 460px"
            style={{ "--i": index } as React.CSSProperties}
          />
        ))}
      </a>
    </div>
  );
}

export function SiteCard({ site }: { site: ShowcaseSite }) {
  const external = isExternal(site.href);
  return (
    <article className="site-card" aria-labelledby={`site-${site.slug}-title`}>
      <div className="site-shot">
        <Image
          src={`/showcase/thumbs/${site.slug}.jpg`}
          alt=""
          width={1280}
          height={800}
          sizes="(max-width: 640px) 78vw, (max-width: 1080px) 46vw, 280px"
        />
      </div>
      <code className="branch-label">
        <span className="branch-dot" aria-hidden="true" />
        web/{site.slug}
        <span className={site.status === "live" ? "tag" : "site-status"}>
          {site.status}
        </span>
      </code>
      <h3 id={`site-${site.slug}-title`}>{site.name}</h3>
      <p className="site-kind">{site.kind}</p>
      <p className="site-line">{site.line}</p>
      <p className="stack-line">
        <span className="sr-only">Stack: </span>
        {site.stack.join(" / ")}
      </p>
      <a
        className="ref site-open"
        href={site.href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {external ? "Visit site" : "Open site"}
        <span className="sr-only">
          : {site.name}
          {external ? " (opens in a new tab)" : ""}
        </span>
        <ArrowIcon />
      </a>
    </article>
  );
}

/** Closing card of the grid: the next site could be yours. */
export function NextSiteCard() {
  return (
    <article className="site-card site-next" aria-labelledby="site-next-title">
      <code className="branch-label">
        <span className="branch-dot" aria-hidden="true" />
        web/your-brand
      </code>
      <h3 id="site-next-title">Your brand, next.</h3>
      <p className="site-line">
        3D, motion and scroll-driven websites for hotels, food and lifestyle
        brands, designed and built in Sri Lanka.
      </p>
      <a
        className="ref site-open"
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
