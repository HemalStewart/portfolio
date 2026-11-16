"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { Drag } from "./Drag";
import { Arrow, FrameLabel, Stamp } from "./marks";

const TERMINAL = [
  "$ git push origin main",
  "✓ build   next · flutter",
  "✓ api     200 OK",
  "✓ deploy  web · stores",
  "● live",
];

/**
 * The hero is built in front of the visitor by the swarm (engine.ts): the
 * name is typed, a browser, a phone and a terminal are dragged open as
 * frames, notes are carried in, and arrows are traced between the pieces.
 * Every piece here is a build step (`data-b`); with reduced motion or
 * without JavaScript none of them is hidden and the hero is simply complete.
 *
 * Afterwards the pieces stay alive: a resting cursor that clicks one fires
 * `swarm:act`, and the browser flips to another site, the phone changes
 * screen, the terminal prints again, the tagline note is straightened.
 */
export function Hero({
  kicker,
  lines,
  srTitle,
  tagline,
  message,
  actions,
  liveCount,
  sites,
}: {
  kicker: string;
  lines: string[];
  srTitle: string;
  tagline: string[];
  message: React.ReactNode;
  actions: React.ReactNode;
  liveCount: number;
  /** Websites the browser flips through; the first is on show at rest. */
  sites: { host: string; image: string }[];
}) {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const onAct = (event: Event) => {
      const piece = event.target as HTMLElement;
      switch (piece.dataset.act) {
        case "browser":
          piece.dataset.site = String(
            (Number(piece.dataset.site ?? 0) + 1) % sites.length,
          );
          break;
        case "phone":
          piece.dataset.alt = piece.dataset.alt ? "" : "1";
          break;
        case "term": {
          const next = Number(piece.dataset.line ?? TERMINAL.length) + 1;
          piece.dataset.line = String(next > TERMINAL.length ? 1 : next);
          break;
        }
        case "tagline":
          piece.dataset.tilt = piece.dataset.tilt ? "" : "1";
          break;
      }
    };
    stage.addEventListener("swarm:act", onAct);
    return () => stage.removeEventListener("swarm:act", onAct);
  }, [sites.length]);

  let index = 0;

  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <div ref={stageRef} className="shell hero-stage" data-scene="">
        <div className="hero-copy">
          <p className="hero-kicker">
            <FrameLabel who="design">Hello</FrameLabel>
            <span>{kicker}</span>
          </p>

          <h1 id="hero-title" className="hero-title">
            <span className="sr-only">{srTitle}</span>
            <span
              aria-hidden="true"
              className="hero-name"
              data-b="type"
              data-name="Name"
              data-by="design"
            >
              {lines.map((line) => (
                <span key={line} className="hero-line">
                  {line.split("").map((char) => {
                    const i = index++;
                    return (
                      <span
                        key={i}
                        className="tc"
                        style={{ "--i": i } as React.CSSProperties}
                      >
                        {char}
                      </span>
                    );
                  })}
                </span>
              ))}
              <Arrow
                shape="under"
                className="hero-scribble"
                data-b="draw"
                data-name="Underline"
                data-w="1"
              />
            </span>
          </h1>

          <Drag className="hero-tag-slot">
            <p
              className="sticky sticky-yellow hero-tag"
              data-b="drop"
              data-name="Tagline note"
              data-w="1"
              data-act="tagline"
            >
              {tagline.map((part) => (
                <span key={part}>{part}</span>
              ))}
            </p>
          </Drag>

          <p className="hero-message" data-b="words" data-name="Intro" data-w="1">
            {message}
          </p>
          <div className="hero-actions" data-b="pop" data-name="Buttons" data-w="2">
            {actions}
          </div>
        </div>

        <div className="hero-scene" aria-hidden="true">
          <Arrow
            shape="swoop"
            className="hs-arrow hs-arrow-1"
            data-b="draw"
            data-name="Arrow · designed"
            data-by="design"
            data-w="2"
          />
          <span
            className="note hs-note hs-note-1"
            data-who="design"
            data-b="pop"
            data-name="designed"
            data-w="3"
          >
            designed
          </span>

          <div
            className="hs-browser"
            data-site="0"
            data-b="frame"
            data-name="Website"
            data-by="web"
            data-w="1"
            data-act="browser"
          >
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
          </div>

          <Arrow
            shape="hook"
            className="hs-arrow hs-arrow-2"
            data-b="draw"
            data-name="Arrow · built"
            data-by="web"
            data-w="2"
          />
          <span
            className="note hs-note hs-note-2"
            data-who="web"
            data-b="pop"
            data-name="built"
            data-w="3"
          >
            built
          </span>

          <div
            className="hs-phone"
            data-b="frame"
            data-name="Flutter app"
            data-by="flutter"
            data-w="1"
            data-act="phone"
          >
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
          </div>

          <div
            className="hs-term"
            data-b="frame"
            data-name="Backend"
            data-by="ai"
            data-w="1"
            data-act="term"
          >
            <FrameLabel who="ai">Backend</FrameLabel>
            <div className="hs-term-body">
              {TERMINAL.map((line, i) => (
                <span key={line} data-n={i + 1}>
                  {line}
                </span>
              ))}
            </div>
          </div>

          <Arrow
            shape="loop"
            className="hs-arrow hs-arrow-3"
            data-b="draw"
            data-name="Arrow · shipped"
            data-by="flutter"
            data-w="2"
          />
          <span
            className="note hs-note hs-note-3"
            data-who="flutter"
            data-b="pop"
            data-name="shipped!"
            data-w="3"
          >
            shipped!
          </span>

          <Stamp className="hs-stamp" data-b="pop" data-name="Live stamp" data-w="3">
            Live
          </Stamp>

          <Drag className="hs-fact-slot hs-fact-slot-2">
            <p
              className="sticky sticky-mint hs-fact"
              data-b="drop"
              data-name="Live note"
              data-w="2"
            >
              <b>{liveCount}</b>
              <span>products live</span>
            </p>
          </Drag>
        </div>
      </div>
    </section>
  );
}
