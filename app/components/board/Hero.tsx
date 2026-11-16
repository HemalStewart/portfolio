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

type Point = { x: number; y: number };

declare global {
  interface Window {
    __hero?: boolean;
  }
}

const WHO = Object.keys(CRAFT_CURSORS) as Who[];
const EASE = "cubic-bezier(0.3, 0.7, 0.1, 1)";
const sleep = (ms: number) => new Promise((done) => setTimeout(done, ms));
const rand = (min: number, max: number) => min + Math.random() * (max - min);

/** Thrown inside the build when it is skipped or the component unmounts. */
class Stop extends Error {}

const TERMINAL = [
  "$ git push origin main",
  "✓ build   next · flutter",
  "✓ api     200 OK",
  "✓ deploy  web · stores",
  "● live",
];

/**
 * The hero is built in front of the visitor. Four cursors, one per craft,
 * fly in and do the work: Design marks out the space and pins the tagline,
 * Web types the name and drags a browser in, Flutter brings the phone, the
 * backend cursor drops a terminal; then arrows draw between the pieces and a
 * stamp lands. Cursors aim at the real elements (measured, not hard-coded),
 * so the same choreography holds at any size. Afterwards they keep working:
 * the browser flips through sites, the phone changes screen, the terminal
 * prints.
 *
 * Markup renders complete on the server. While `html[data-build="pending"]`
 * (set before first paint, once per session, never with reduced motion) the
 * pieces wait hidden for their `data-on`; scrolling away finishes the build
 * at once.
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
    const motion = "motion" in html.dataset;
    // One object per run; helpers hold on to the run they started in, so a
    // skipped or replayed build stops at its next step.
    let run = { alive: true };
    const anims = new Set<Animation>();
    const pos = {} as Record<Who, Point>;
    let onStage = true;
    let building = false;

    const q = (key: string) =>
      stage.querySelector<HTMLElement>(`[data-b="${key}"]`);
    const cursor = (who: Who) =>
      stage.querySelector<HTMLElement>(`.cur[data-who="${who}"]`)!;
    /** A point on an element, in stage coordinates. */
    const at = (el: Element | null, ax = 0.5, ay = 0.5): Point => {
      const s = stage.getBoundingClientRect();
      if (!el) return { x: s.width / 2, y: s.height / 2 };
      const r = el.getBoundingClientRect();
      return { x: r.left - s.left + r.width * ax, y: r.top - s.top + r.height * ay };
    };
    const place = (who: Who, p: Point) => {
      pos[who] = p;
      cursor(who).style.transform = `translate(${p.x}px, ${p.y}px)`;
    };
    const wait = async (ms: number) => {
      const mine = run;
      await sleep(ms);
      if (!mine.alive) throw new Stop();
    };
    /** Plays to the end; a `forwards` fill is committed to inline style. */
    const play = async (
      el: HTMLElement,
      frames: Keyframe[],
      options: KeyframeAnimationOptions,
    ) => {
      const anim = el.animate(frames, { easing: EASE, ...options });
      anims.add(anim);
      try {
        await anim.finished;
        if (options.fill === "forwards") {
          anim.commitStyles();
          anim.cancel();
        }
      } catch {
        // cancelled, or not rendered
      }
      anims.delete(anim);
    };
    const fly = async (who: Who, to: Point, ms = 520) => {
      const mine = run;
      const from = pos[who];
      await play(
        cursor(who),
        [
          { transform: `translate(${from.x}px, ${from.y}px)` },
          { transform: `translate(${to.x}px, ${to.y}px)` },
        ],
        { duration: ms, fill: "forwards" },
      );
      if (!mine.alive) throw new Stop();
      place(who, to);
    };
    const click = (who: Who) => {
      const el = cursor(who);
      el.dataset.click = "";
      setTimeout(() => delete el.dataset.click, 450);
    };
    const on = (key: string) => q(key)?.setAttribute("data-on", "");
    const tool = (name: string) => (html.dataset.tool = name);

    /** A cursor fetches a piece from off the board and sets it down. */
    const drag = async (who: Who, key: string, dx: number, dy: number, ms: number) => {
      const mine = run;
      const el = q(key);
      if (!el) return;
      const rest = at(el, 0.5, 0.08);
      await fly(who, { x: rest.x + dx, y: rest.y + dy }, 380);
      el.setAttribute("data-on", "");
      el.dataset.held = "";
      await Promise.all([
        play(el, [{ translate: `${dx}px ${dy}px` }, { translate: "0px 0px" }], {
          duration: ms,
        }),
        fly(who, rest, ms),
      ]);
      if (!mine.alive) throw new Stop();
      delete el.dataset.held;
      click(who);
    };

    const homes: Record<Who, () => Point> = {
      design: () => at(q("tagline"), 0.9, 0.85),
      web: () => at(q("browser"), 0.55, 0.55),
      flutter: () => at(q("phone"), 0.25, 0.42),
      ai: () => at(q("term"), 0.78, 0.5),
    };

    const typeName = async () => {
      const name = q("name");
      const chars = Array.from(stage.querySelectorAll<HTMLElement>(".hc"));
      for (const char of chars) {
        char.dataset.on = "";
        const r = at(char, 1, 0.62);
        place("web", { x: r.x + 6, y: r.y });
        await wait(char.dataset.gap ? 130 : 52);
      }
      name?.setAttribute("data-on", "");
    };

    const settle = () => {
      stage.querySelectorAll("[data-b], .hc").forEach((el) => el.setAttribute("data-on", ""));
      stage.querySelectorAll<HTMLElement>("[data-held]").forEach((el) => delete el.dataset.held);
      html.dataset.build = "done";
      html.dataset.tool = "move";
      stage.dataset.cursors = "";
      const marquee = stage.querySelector<HTMLElement>(".hero-marquee");
      if (marquee) marquee.style.opacity = "0";
      try {
        sessionStorage.setItem("hh:built", "1");
      } catch {
        // private mode
      }
      WHO.forEach((who) => place(who, homes[who]()));
    };

    const build = async () => {
      building = true;
      const s = stage.getBoundingClientRect();
      const wide = s.width;
      place("design", { x: -60, y: s.height * 0.2 });
      place("web", { x: wide * 0.35, y: -70 });
      place("flutter", { x: wide + 60, y: s.height * 0.7 });
      place("ai", { x: wide * 0.5, y: s.height + 60 });
      stage.dataset.cursors = "";
      await wait(250);

      // Design marks out the space for the headline.
      tool("frame");
      const kicker = q("kicker");
      const name = q("name");
      const a = at(kicker, 0, -0.6);
      const b = at(name, 1, 1.02);
      await fly("design", a, 520);
      const marquee = stage.querySelector<HTMLElement>(".hero-marquee");
      if (marquee) {
        marquee.style.left = `${a.x}px`;
        marquee.style.top = `${a.y}px`;
        marquee.style.opacity = "1";
        void play(
          marquee,
          [
            { width: "0px", height: "0px" },
            { width: `${b.x - a.x}px`, height: `${b.y - a.y}px` },
          ],
          { duration: 480, fill: "forwards" },
        );
      }
      await fly("design", b, 480);
      click("design");
      on("kicker");
      await wait(160);
      if (marquee) marquee.style.opacity = "0";

      // Web types the name.
      tool("text");
      const first = stage.querySelector(".hc");
      await fly("web", at(first, 0, 0.6), 480);
      click("web");
      await wait(120);
      await typeName();
      // The copy does not wait for the rest of the build.
      on("lede");
      void wait(220).then(() => on("cta"), () => {});

      // Design underlines it and pins the tagline.
      tool("pen");
      const scribble = q("scribble");
      await fly("design", at(scribble, 0, 0.5), 320);
      on("scribble");
      await fly("design", at(scribble, 1, 0.4), 460);
      tool("note");
      await fly("design", at(q("tagline"), 0.5, 0.3), 340);
      on("tagline");
      click("design");

      // The pieces arrive: browser, phone, terminal.
      tool("move");
      const far = wide * 0.55;
      await Promise.all([
        drag("web", "browser", far, -s.height * 0.12, 760),
        wait(420).then(() => drag("flutter", "phone", far * 0.7, s.height * 0.3, 700)),
        wait(760).then(() => drag("ai", "term", -far * 0.5, s.height * 0.45, 680)),
      ]);

      // Arrows connect them, the stamp lands, the copy follows.
      tool("arrow");
      on("arrow1");
      on("note1");
      await wait(300);
      on("arrow2");
      on("note2");
      await wait(300);
      on("arrow3");
      on("note3");
      await wait(380);
      tool("move");
      await fly("design", at(q("stamp"), 0.5, 0.5), 300);
      on("stamp");
      click("design");
      stage.dataset.thump = "";
      setTimeout(() => delete stage.dataset.thump, 500);
      await wait(220);
      on("fact1");
      await wait(140);
      on("fact2");
      await wait(900);
    };

    /** After the build the cursors keep working, each on its own piece. */
    const acts: Record<Who, () => void> = {
      design: () => {
        const note = q("tagline");
        if (note) note.dataset.tilt = note.dataset.tilt ? "" : "1";
      },
      web: () => {
        const browser = q("browser");
        if (browser)
          browser.dataset.site = String((Number(browser.dataset.site ?? 0) + 1) % sites.length);
      },
      flutter: () => {
        const phone = q("phone");
        if (phone) phone.dataset.alt = phone.dataset.alt ? "" : "1";
      },
      ai: () => {
        const term = q("term");
        if (term) {
          const next = Number(term.dataset.line ?? TERMINAL.length) + 1;
          term.dataset.line = String(next > TERMINAL.length ? 1 : next);
        }
      },
    };
    const idle = async (who: Who) => {
      const mine = run;
      try {
        await wait(rand(600, 2600));
        while (mine.alive) {
          if (onStage && !document.hidden) {
            const home = homes[who]();
            await fly(who, { x: home.x + rand(-34, 34), y: home.y + rand(-26, 26) }, rand(900, 1500));
            if (Math.random() < 0.6) {
              click(who);
              acts[who]();
            }
          }
          await wait(rand(1800, 4200));
        }
      } catch {
        // stopped
      }
    };

    const stop = () => {
      run.alive = false;
      run = { alive: true };
      anims.forEach((anim) => anim.cancel());
      anims.clear();
    };
    const finish = () => {
      stop();
      building = false;
      settle();
      if (motion) WHO.forEach((who) => void idle(who));
    };

    const start = async () => {
      const mine = run;
      window.__hero = true;
      // Positions are measured, so wait for the display font before aiming.
      await Promise.race([document.fonts.ready, sleep(1200)]);
      if (!mine.alive) return;
      if (html.dataset.build === "pending" && window.scrollY < 40) {
        try {
          await build();
        } catch {
          return; // skipped or unmounted: finish() or cleanup took over
        }
        finish();
      } else {
        finish();
      }
    };
    void start();

    const onScroll = () => {
      if (building && window.scrollY > window.innerHeight * 0.3) finish();
    };
    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (building) finish();
        else WHO.forEach((who) => place(who, homes[who]()));
      }, 150);
    };
    const onReplay = () => {
      if (!motion) return;
      stop();
      stage.querySelectorAll("[data-on]").forEach((el) => el.removeAttribute("data-on"));
      delete stage.dataset.cursors;
      html.dataset.build = "pending";
      window.scrollTo({ top: 0 });
      void (async () => {
        try {
          await wait(450);
          await build();
        } catch {
          return;
        }
        finish();
      })();
    };
    const observer = new IntersectionObserver(([entry]) => {
      onStage = entry.isIntersecting;
    });
    observer.observe(stage);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("hh:replay", onReplay);
    return () => {
      run.alive = false;
      anims.forEach((anim) => anim.cancel());
      observer.disconnect();
      window.clearTimeout(resizeTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
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
              {lines.map((line, lineIndex) => (
                <span key={line} className="hero-line">
                  {line.split("").map((char, charIndex) => {
                    const i = index++;
                    return (
                      <span
                        key={i}
                        className="hc"
                        data-gap={lineIndex > 0 && charIndex === 0 ? "" : undefined}
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

        <span className="hero-marquee" aria-hidden="true" />
        {WHO.map((who) => (
          <CursorMark key={who} who={who} className="hero-cur" />
        ))}
      </div>
    </section>
  );
}
