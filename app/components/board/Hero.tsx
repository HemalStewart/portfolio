"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { Drag } from "./Drag";
import {
  Arrow,
  CRAFT_CURSORS,
  CursorMark,
  FrameLabel,
  Stamp,
  type Who,
} from "./marks";

const WHO = Object.keys(CRAFT_CURSORS) as Who[];
const rand = (min: number, max: number) => min + Math.random() * (max - min);

const TERMINAL = [
  "$ git push origin main",
  "✓ build   next · flutter",
  "✓ api     200 OK",
  "✓ deploy  web · stores",
  "● live",
];

/** The dock lights each tool in turn while the intro plays: [name, at ms]. */
const TOOLS: [string, number][] = [
  ["text", 0],
  ["note", 300],
  ["frame", 500],
  ["arrow", 850],
  ["move", 1350],
];

/**
 * The hero assembles itself in about a second: the name rises letter by
 * letter while a browser, a phone and a terminal are carried in by the
 * cursors that own them, then arrows draw between the pieces and a stamp
 * lands. All of that is CSS (see "the intro" in hero.css), so it starts with
 * the first paint and does not wait for this script; nothing is ever hidden
 * from a visitor without motion or without JavaScript.
 *
 * What the script adds is life afterwards: each cursor sits on its own piece
 * and keeps working there — the browser flips through sites, the phone
 * changes screen, the terminal prints, the tagline note is straightened.
 */
export function Hero({
  kicker,
  lines,
  srTitle,
  tagline,
  message,
  actions,
  downloads,
  liveCount,
  sites,
}: {
  kicker: string;
  lines: string[];
  srTitle: string;
  tagline: string[];
  message: React.ReactNode;
  actions: React.ReactNode;
  downloads: string;
  liveCount: number;
  /** Websites the browser flips through; the first is on show at rest. */
  sites: { host: string; image: string }[];
}) {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const html = document.documentElement;
    if (!("motion" in html.dataset)) return;
    const timers = new Set<number>();
    let onStage = true;

    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        timers.delete(id);
        fn();
      }, ms);
      timers.add(id);
    };
    const q = (key: string) =>
      stage.querySelector<HTMLElement>(`[data-b="${key}"]`);
    const cursor = (who: Who) =>
      stage.querySelector<HTMLElement>(`.hero-cur[data-who="${who}"]`);

    const acts: Record<Who, () => void> = {
      design: () => {
        const note = q("tagline");
        if (note) note.dataset.tilt = note.dataset.tilt ? "" : "1";
      },
      web: () => {
        const browser = q("browser");
        if (browser)
          browser.dataset.site = String(
            (Number(browser.dataset.site ?? 0) + 1) % sites.length,
          );
      },
      flutter: () => {
        const phone = q("phone");
        if (phone) phone.dataset.alt = phone.dataset.alt ? "" : "1";
      },
      ai: () => {
        const term = q("term");
        if (!term) return;
        const next = Number(term.dataset.line ?? TERMINAL.length) + 1;
        term.dataset.line = String(next > TERMINAL.length ? 1 : next);
      },
    };

    /** A cursor drifts a little way over its piece, and sometimes clicks. */
    const work = (who: Who) => {
      const el = cursor(who);
      if (el && onStage && !document.hidden) {
        el.style.translate = `${rand(-30, 30).toFixed(0)}px ${rand(-22, 22).toFixed(0)}px`;
        if (Math.random() < 0.75)
          later(() => {
            el.dataset.click = "";
            later(() => delete el.dataset.click, 450);
            acts[who]();
          }, 900);
      }
      later(() => work(who), rand(1900, 3600));
    };

    const tools = () =>
      TOOLS.forEach(([name, at]) => later(() => (html.dataset.tool = name), at));

    const start = () => {
      tools();
      WHO.forEach((who, i) => later(() => work(who), 1500 + i * 350));
    };
    start();

    const onReplay = () => {
      timers.forEach((id) => window.clearTimeout(id));
      timers.clear();
      window.scrollTo({ top: 0 });
      // Restart the CSS intro: drop its animations for a frame, then restore.
      stage.dataset.still = "";
      void stage.offsetWidth;
      delete stage.dataset.still;
      start();
    };
    const observer = new IntersectionObserver(([entry]) => {
      onStage = entry.isIntersecting;
    });
    observer.observe(stage);
    window.addEventListener("hh:replay", onReplay);
    return () => {
      timers.forEach((id) => window.clearTimeout(id));
      observer.disconnect();
      window.removeEventListener("hh:replay", onReplay);
    };
  }, [sites.length]);

  let index = 0;

  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <div ref={stageRef} className="shell hero-stage">
        <div className="hero-copy">
          <p className="hero-kicker" data-b="kicker">
            <FrameLabel who="design">Hello</FrameLabel>
            <span>{kicker}</span>
          </p>

          <h1 id="hero-title" className="hero-title">
            <span className="sr-only">{srTitle}</span>
            <span aria-hidden="true" className="hero-name" data-b="name">
              {lines.map((line) => (
                <span key={line} className="hero-line">
                  {line.split("").map((char) => {
                    const i = index++;
                    return (
                      <span
                        key={i}
                        className="hc"
                        style={{ "--i": i } as React.CSSProperties}
                      >
                        {char}
                      </span>
                    );
                  })}
                </span>
              ))}
              <Arrow shape="under" className="hero-scribble" data-b="scribble" />
            </span>
          </h1>

          <Drag className="hero-tag-slot">
            <p className="sticky sticky-yellow hero-tag" data-b="tagline">
              {tagline.map((part) => (
                <span key={part}>{part}</span>
              ))}
            </p>
            <CursorMark who="design" className="hero-cur" />
          </Drag>

          <p className="hero-message" data-b="lede">
            {message}
          </p>
          <div className="hero-actions" data-b="cta">
            {actions}
          </div>
        </div>

        <div className="hero-scene" aria-hidden="true">
          <Arrow shape="swoop" className="hs-arrow hs-arrow-1" data-b="arrow1" />
          <span className="note hs-note hs-note-1" data-b="note1" data-who="design">
            designed
          </span>

          <div className="hs-browser" data-b="browser" data-site="0">
            <FrameLabel who="web">Website</FrameLabel>
            <div className="hs-chrome">
              <span className="hs-dots">
                <i />
                <i />
                <i />
              </span>
              <span className="hs-urls">
                {sites.map((site, i) => (
                  <span key={site.host} data-n={i}>
                    {site.host}
                  </span>
                ))}
              </span>
            </div>
            <div className="hs-screen">
              {sites.map((site, i) => (
                <Image
                  key={site.host}
                  src={site.image}
                  alt=""
                  width={1280}
                  height={800}
                  sizes="(max-width: 900px) 88vw, 520px"
                  priority={i === 0}
                  data-n={i}
                />
              ))}
            </div>
            <CursorMark who="web" className="hero-cur" />
          </div>

          <Arrow shape="hook" className="hs-arrow hs-arrow-2" data-b="arrow2" />
          <span className="note hs-note hs-note-2" data-b="note2" data-who="web">
            built
          </span>

          <div className="hs-phone" data-b="phone">
            <FrameLabel who="flutter">Flutter app</FrameLabel>
            <div className="hs-phone-screen">
              <Image
                src="/crafts/writescan-home.webp"
                alt=""
                width={330}
                height={742}
                sizes="(max-width: 900px) 28vw, 170px"
              />
              <Image
                src="/crafts/vibechat-chat.webp"
                alt=""
                width={418}
                height={940}
                sizes="(max-width: 900px) 28vw, 170px"
              />
            </div>
            <CursorMark who="flutter" className="hero-cur" />
          </div>

          <div className="hs-term" data-b="term">
            <FrameLabel who="ai">Backend</FrameLabel>
            <div className="hs-term-body">
              {TERMINAL.map((line, i) => (
                <span key={line} data-n={i + 1}>
                  {line}
                </span>
              ))}
            </div>
            <CursorMark who="ai" className="hero-cur" />
          </div>

          <Arrow shape="loop" className="hs-arrow hs-arrow-3" data-b="arrow3" />
          <span className="note hs-note hs-note-3" data-b="note3" data-who="flutter">
            shipped!
          </span>

          <Stamp className="hs-stamp" data-b="stamp">
            Live
          </Stamp>

          <Drag className="hs-fact-slot hs-fact-slot-1">
            <p className="sticky sticky-pink hs-fact" data-b="fact1">
              <b>{downloads}</b>
              <span>Play Store downloads</span>
            </p>
          </Drag>
          <Drag className="hs-fact-slot hs-fact-slot-2">
            <p className="sticky sticky-mint hs-fact" data-b="fact2">
              <b>{liveCount}</b>
              <span>products live</span>
            </p>
          </Drag>
        </div>

      </div>
    </section>
  );
}
