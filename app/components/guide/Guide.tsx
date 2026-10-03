"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { GuideController, Pose } from "./scene";

export type GuideStop = {
  /** Section id the stop belongs to. */
  id: string;
  pose: Pose;
  line: string;
};

const CANVAS = 520;
const DOCK_DESKTOP = 150;
const DOCK_MOBILE = 92;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => t * t * (3 - 2 * t);

/**
 * The guide bot. It stands large in the hero's `.hero-stage`, then shrinks
 * and docks in the bottom-right corner as you scroll, changing pose and
 * speech bubble per section. Clicking it jumps to the next section.
 *
 * three.js is only fetched after the first interaction (pointer, scroll,
 * touch or key), so it never competes with first paint; until then the hero
 * shows a static poster of the same bot.
 */
export function Guide({ stops }: { stops: GuideStop[] }) {
  const reduced = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const hitRef = useRef<HTMLButtonElement>(null);
  const controller = useRef<GuideController | null>(null);
  const [ready, setReady] = useState(false);
  const [stop, setStop] = useState(0);
  const [talking, setTalking] = useState(true);

  // Load three.js and build the bot after the first interaction.
  useEffect(() => {
    let disposed = false;
    const events = ["pointermove", "scroll", "touchstart", "keydown"] as const;
    const start = () => {
      events.forEach((e) => window.removeEventListener(e, start));
      import("./scene").then(({ createGuide }) => {
        const canvas = canvasRef.current;
        if (disposed || !canvas) return;
        try {
          controller.current = createGuide(canvas, {
            reducedMotion: !!reduced,
          });
          setReady(true);
          document.documentElement.dataset.guide = "ready";
        } catch {
          // No WebGL: the poster stays.
        }
      });
    };
    events.forEach((e) =>
      window.addEventListener(e, start, { passive: true, once: true }),
    );
    return () => {
      disposed = true;
      events.forEach((e) => window.removeEventListener(e, start));
      controller.current?.dispose();
      controller.current = null;
      delete document.documentElement.dataset.guide;
    };
  }, [reduced]);

  // Place the canvas: hero stage → docked corner, driven by scroll.
  useEffect(() => {
    const canvas = canvasRef.current;
    const bubble = bubbleRef.current;
    const hit = hitRef.current;
    if (!canvas || !bubble || !hit) return;
    let raf = 0;
    const place = () => {
      raf = 0;
      const stage = document.querySelector<HTMLElement>(".hero-stage");
      const vw = document.documentElement.clientWidth;
      const vh = window.innerHeight;
      const dockSize = vw < 900 ? DOCK_MOBILE : DOCK_DESKTOP;
      const dock = { x: vw - dockSize - 12, y: vh - dockSize - 8, s: dockSize };
      let target = dock;
      let t = 1;
      if (stage) {
        const r = stage.getBoundingClientRect();
        const s = Math.min(r.width, r.height);
        const hero = {
          x: r.left + (r.width - s) / 2,
          y: r.top + (r.height - s) / 2,
          s,
        };
        t = ease(clamp01(-r.top / (r.height * 0.85)));
        target = {
          x: hero.x + (dock.x - hero.x) * t,
          y: hero.y + (dock.y - hero.y) * t,
          s: hero.s + (dock.s - hero.s) * t,
        };
      }
      canvas.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) scale(${target.s / CANVAS})`;
      hit.style.transform = `translate3d(${target.x + target.s * 0.2}px, ${target.y + target.s * 0.1}px, 0)`;
      hit.style.width = hit.style.height = `${target.s * 0.6}px`;
      // Bubble sits above-left of the bot.
      const bubbleRight = vw - (target.x + target.s * 0.72);
      const bubbleBottom = vh - (target.y + target.s * 0.12);
      bubble.style.transform = `translate3d(${-bubbleRight}px, ${-bubbleBottom}px, 0)`;
      if (t > 0.95) bubble.dataset.docked = "";
      else delete bubble.dataset.docked;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(place);
    };
    place();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Pointer → where the bot looks.
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const canvas = canvasRef.current;
      if (!canvas || !controller.current) return;
      const r = canvas.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height * 0.42;
      controller.current.setPointer(
        (event.clientX - cx) / (window.innerWidth * 0.5),
        -(event.clientY - cy) / (window.innerHeight * 0.5),
      );
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // Section in view → pose + line.
  useEffect(() => {
    const elements = stops
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = stops.findIndex((s) => s.id === entry.target.id);
          if (index >= 0) {
            setStop(index);
            setTalking(true);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [stops]);

  // Apply the pose; hide the bubble a few seconds after it changes.
  useEffect(() => {
    const pose = stops[stop]?.pose ?? "idle";
    controller.current?.setPose(
      reduced && (pose === "wave" || pose === "cheer") ? "idle" : pose,
    );
    if (!talking) return;
    const timer = window.setTimeout(() => setTalking(false), 5200);
    return () => window.clearTimeout(timer);
  }, [stop, talking, ready, reduced, stops]);

  // Pause rendering when the tab is hidden.
  useEffect(() => {
    const onVisibility = () => controller.current?.setActive(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const next = stops[stop + 1];

  function goNext() {
    const target = next
      ? document.getElementById(next.id)
      : document.getElementById("top");
    target?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    controller.current?.setPose("cheer");
    setTalking(true);
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        className="guide-canvas"
        width={CANVAS}
        height={CANVAS}
        data-ready={ready || undefined}
        aria-hidden="true"
      />
      <div
        ref={bubbleRef}
        className="guide-bubble"
        data-visible={(ready && talking) || undefined}
        role="status"
      >
        <span key={stop}>{stops[stop]?.line}</span>
      </div>
      <button
        ref={hitRef}
        type="button"
        className="guide-hit"
        onClick={goNext}
        aria-label={
          next
            ? `Guide bot: go to the next section`
            : "Guide bot: back to the top"
        }
      />
    </>
  );
}
