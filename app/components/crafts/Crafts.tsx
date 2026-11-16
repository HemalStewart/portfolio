"use client";

import "./crafts.css";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Craft } from "../../data/portfolio";
import { FrameLabel, type Who } from "../board/marks";
import { ArrowIcon } from "../icons";

/** Which collaborator each craft belongs to. */
const WHO: Record<string, Who> = {
  design: "design",
  web: "web",
  mobile: "flutter",
  api: "ai",
};

/** Same condition as the pinned layout in crafts.css. */
const QUERY = "(prefers-reduced-motion: no-preference) and (min-height: 540px)";

/*
 * The sequence is measured in steps: 0 design, 1 web, 2 mobile, 3 api. Each
 * state holds for the first part of its step, then morphs into the next one;
 * the last state dwells for TAIL before the pin releases.
 */
const HOLD = 0.45;
const TAIL = 0.5;
const SPAN = 3 + TAIL;
/** Where a pipeline button lands: comfortably inside each state's hold. */
const STOPS = [0.15, 1.2, 2.2, 3.3];

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const segment = (u: number, from: number, to: number) =>
  clamp01((u - from) / (to - from));
const ease = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** Splits "Web *design.*" into plain text and the italic serif word. */
function Title({ text }: { text: string }) {
  const match = /^(.*)\*(.+)\*(.*)$/.exec(text);
  if (!match) return <>{text}</>;
  return (
    <>
      {match[1]}
      <em>{match[2]}</em>
      {match[3]}
    </>
  );
}

/**
 * One frame, four crafts. The stage is pinned while the page scrolls and a
 * single frame morphs from a wireframe on an artboard, to the built website
 * in a browser, to a Flutter app on a phone, to the terminal that ships it.
 * Scroll position is written to CSS custom properties on the track (`--t1`
 * to `--t3`, one per morph) and crafts.css does the rest, so nothing
 * re-renders while scrolling. With reduced motion, or on very short screens,
 * the crafts are simply listed.
 */
export function Crafts({
  crafts,
  site,
}: {
  crafts: Craft[];
  /** The website the frame builds: its screenshot and address. */
  site: { name: string; host: string; image: string };
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const mq = matchMedia(QUERY);
    const apply = () => setPinned(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !pinned) return;
    let raf = 0;
    let near = true;
    const set = (name: string, value: number) =>
      track.style.setProperty(name, value.toFixed(4));

    const measure = () => {
      raf = 0;
      const viewport = window.innerHeight;
      const rect = track.getBoundingClientRect();
      const span = rect.height - viewport;
      const u = span > 0 ? clamp01(-rect.top / span) * SPAN : 0;
      // 0 as the stage enters from below, 1 once it is pinned.
      set("--in", clamp01((viewport - rect.top) / viewport));
      set("--t0", segment(u, 0, HOLD));
      set("--t1", ease(segment(u, HOLD, 1)));
      set("--t2", ease(segment(u, 1 + HOLD, 2)));
      set("--t3", ease(segment(u, 2 + HOLD, 3)));
      set("--log", segment(u, 2.75, 3 + TAIL * 0.7));
      const next = u < 0.75 ? 0 : u < 1.75 ? 1 : u < 2.75 ? 2 : 3;
      setActive((current) => (current === next ? current : next));
    };
    const onScroll = () => {
      if (near && !raf) raf = requestAnimationFrame(measure);
    };
    // Only track scroll while the sequence is on or near the screen.
    const observer = new IntersectionObserver(
      ([entry]) => {
        near = entry.isIntersecting;
        onScroll();
      },
      { rootMargin: "50% 0px" },
    );
    observer.observe(track);
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      for (const name of ["--in", "--t0", "--t1", "--t2", "--t3", "--log"])
        track.style.removeProperty(name);
    };
  }, [pinned]);

  // Only the current craft stays in the tab order while the stage is pinned.
  useEffect(() => {
    const steps = stepsRef.current?.children;
    if (!steps) return;
    Array.from(steps).forEach((step, index) => {
      (step as HTMLElement).inert = pinned && index !== active;
    });
  }, [active, pinned]);

  function go(index: number) {
    const track = trackRef.current;
    if (!track) return;
    const top = track.getBoundingClientRect().top + window.scrollY;
    const span = track.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: top + (span * STOPS[index]) / SPAN,
      behavior: "smooth",
    });
  }

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div ref={trackRef} className="crafts-track">
      <div className="crafts-pin">
        <div className="crafts-copy">
          <div ref={stepsRef} className="crafts-steps">
            {crafts.map((craft, index) => (
              <article
                key={craft.branch}
                className="craft"
                data-state={
                  index === active
                    ? "active"
                    : index < active
                      ? "before"
                      : "after"
                }
                aria-labelledby={`craft-${craft.branch}`}
              >
                <p className="craft-label">
                  <FrameLabel who={WHO[craft.branch]}>{craft.branch}</FrameLabel>
                  <span className="craft-count" aria-hidden="true">
                    {pad(index + 1)} / {pad(crafts.length)}
                  </span>
                </p>
                <h3 id={`craft-${craft.branch}`}>
                  <Title text={craft.title} />
                </h3>
                <p className="craft-line">{craft.line}</p>
                <p className="craft-proof">{craft.proof}</p>
                <p className="stack-line">
                  <span className="sr-only">Stack: </span>
                  {craft.stack.join(" / ")}
                </p>
                <a className="ref" href={craft.href}>
                  {craft.cta}
                  <ArrowIcon direction="down" />
                </a>
              </article>
            ))}
          </div>

          <div className="crafts-pipe" role="group" aria-label="Crafts">
            {crafts.map((craft, index) => (
              <button
                key={craft.branch}
                type="button"
                onClick={() => go(index)}
                aria-label={`Show ${craft.title.replace(/\*/g, "")}`}
                aria-current={index === active ? "step" : undefined}
                data-done={index < active || undefined}
                style={{ "--n": index } as React.CSSProperties}
              >
                <i aria-hidden="true" />
                <span aria-hidden="true">{craft.branch}/</span>
              </button>
            ))}
          </div>
        </div>

        {/* Decorative: the copy beside it carries the meaning. */}
        <div className="crafts-stage" aria-hidden="true">
          <div className="cs-canvas">
            <figure className="cs-phone cs-phone-l">
              <Image
                src="/crafts/vibechat-chat.webp"
                alt=""
                width={418}
                height={940}
                sizes="(max-width: 900px) 26vw, 180px"
              />
            </figure>
            <figure className="cs-phone cs-phone-r">
              <Image
                src="/crafts/vibechat-foryou.webp"
                alt=""
                width={416}
                height={936}
                sizes="(max-width: 900px) 26vw, 180px"
              />
            </figure>

            <div className="cs-frame" data-pick="" data-name="Artboard">
              <span className="cs-artlabel">
                <b>#</b> Home — Desktop
              </span>
              <span className="cs-size">1440 × 900</span>
              {[0, 1, 2, 3].map((corner) => (
                <i key={corner} className="cs-handle" />
              ))}

              <div className="cs-bar">
                <span className="cs-dots">
                  <i />
                  <i />
                  <i />
                </span>
                <span className="cs-bar-label cs-url">{site.host}</span>
                <span className="cs-bar-label cs-term-title">
                  hemal@main — zsh
                </span>
              </div>

              <div className="cs-body">
                <div className="cs-layer cs-wire">
                  <i className="w-logo" />
                  <i className="w-nav">
                    <b />
                    <b />
                    <b />
                    <b />
                    <b />
                  </i>
                  <i className="w-cta" />
                  <i className="w-kicker" />
                  <i className="w-h1" />
                  <i className="w-h2" />
                  <i className="w-book">
                    <b />
                    <b />
                    <b />
                    <b />
                    <b />
                  </i>
                  <i className="w-play" />
                  <i className="w-cap" />
                  <i className="w-foot" />
                </div>

                <div className="cs-layer cs-site">
                  <Image
                    src={site.image}
                    alt=""
                    width={1280}
                    height={800}
                    sizes="(max-width: 900px) 92vw, 640px"
                  />
                </div>

                <div className="cs-layer cs-app">
                  <Image
                    src="/crafts/writescan-home.webp"
                    alt=""
                    width={330}
                    height={742}
                    sizes="(max-width: 900px) 30vw, 210px"
                  />
                </div>

                <div className="cs-layer cs-term">
                  <p style={{ "--d": 0 } as React.CSSProperties}>
                    <b>$</b> git push origin main
                  </p>
                  <p style={{ "--d": 1 } as React.CSSProperties}>
                    <u>✓</u> <s>api</s> Laravel · CodeIgniter · FastAPI
                  </p>
                  <p style={{ "--d": 2 } as React.CSSProperties}>
                    <u>✓</u> <s>data</s> MySQL · Prisma · SQLite
                  </p>
                  <p style={{ "--d": 3 } as React.CSSProperties}>
                    <u>✓</u> <s>ai</s> OpenAI · Gemini · RAG · Whisper
                  </p>
                  <p style={{ "--d": 4 } as React.CSSProperties}>
                    <u>✓</u> <s>deploy</s> Vercel · Nginx · Play Store · App
                    Store
                  </p>
                  <p
                    className="cs-live"
                    style={{ "--d": 5 } as React.CSSProperties}
                  >
                    <i /> live — merged to main
                  </p>
                </div>

                <i className="cs-scan" />
              </div>
            </div>

            <div className="cs-float cs-tokens">
              <span className="cs-float-title">Styles</span>
              <span className="cs-swatches">
                <i />
                <i />
                <i />
                <i />
              </span>
              <span className="cs-type">
                <b>Aa</b>
                <span>
                  Display · Serif
                  <br />
                  Interface · Sans
                </span>
              </span>
            </div>

            <div className="cs-cursor">
              <svg viewBox="0 0 16 16" fill="currentColor">
                <path d="M1.5 1 14 6.6 8.4 8.4 6.6 14Z" />
              </svg>
              <span>Design</span>
            </div>

            <div className="cs-float cs-code">
              <span className="cs-float-title">
                <i /> app/page.tsx
              </span>
              <pre>
                <span>
                  <s>&lt;</s>
                  <b>Hero</b> <u>film</u>
                  <s>=</s>
                  <em>&quot;/beach.mp4&quot;</em>
                  <s>&gt;</s>
                </span>
                <span>
                  {"  "}
                  <s>&lt;</s>
                  <b>h1</b>
                  <s>&gt;</s>Step out of your cabana,
                </span>
                <span>
                  {"    "}
                  <s>&lt;</s>
                  <b>em</b>
                  <s>&gt;</s>onto the sand.<s>&lt;/</s>
                  <b>em</b>
                  <s>&gt;</s>
                </span>
                <span>
                  {"  "}
                  <s>&lt;/</s>
                  <b>h1</b>
                  <s>&gt;</s>
                </span>
                <span>
                  {"  "}
                  <s>&lt;</s>
                  <b>BookingBar</b> <s>/&gt;</s>
                </span>
                <span>
                  <s>&lt;/</s>
                  <b>Hero</b>
                  <s>&gt;</s>
                </span>
              </pre>
            </div>

            <span className="cs-chip cs-chip-a">
              <i /> Google Play
            </span>
            <span className="cs-chip cs-chip-b">
              <i /> App Store
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
