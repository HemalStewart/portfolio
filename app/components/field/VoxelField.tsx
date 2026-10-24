"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import type { FieldController, Mood } from "./scene";

export type FieldStop = { id: string; mood: Mood };

/**
 * Mounts the voxel field behind the page and drives it from scroll: each
 * section has a mood, and the field blends to the next one as that section's
 * top climbs to the middle of the viewport. three.js loads once the browser
 * is idle after first paint; without WebGL the page simply has no field.
 */
export function VoxelField({ stops }: { stops: FieldStop[] }) {
  const reduced = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let field: FieldController | null = null;
    let disposed = false;
    let raf = 0;

    const progress = () => {
      raf = 0;
      if (!field) return;
      const middle = window.innerHeight * 0.5;
      const span = window.innerHeight * 0.5;
      let k = 0;
      for (let i = 1; i < stops.length; i++) {
        const el = document.getElementById(stops[i].id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        // 0 when the section's top is a half-screen below the middle, 1 at it.
        const t = (middle + span - top) / span;
        if (t <= 0) break;
        k = i - 1 + Math.min(1, t);
      }
      field.setProgress(k);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(progress);
    };
    const onResize = () => {
      field?.resize();
      onScroll();
    };
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      field?.setPointer(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
      );
    };
    const onVisibility = () => field?.setActive(!document.hidden);

    const start = () => {
      import("./scene").then(({ createField }) => {
        if (disposed) return;
        try {
          const narrow = window.innerWidth < 900;
          // Assemble as the hero reveals: after the boot screen, if it shows.
          const intro = parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue(
              "--intro",
            ),
          );
          field = createField(
            canvas,
            stops.map((stop) => stop.mood),
            {
              reducedMotion: !!reduced,
              count: narrow ? 1100 : 2000,
              introDelay: Math.max(0, (intro || 0) - performance.now() / 1000),
            },
          );
          canvas.dataset.ready = "";
          progress();
        } catch {
          // No WebGL: the page reads fine without the field.
        }
      });
    };
    // Safari has no requestIdleCallback; fall back to a short timeout.
    const whenIdle = window.requestIdleCallback as
      | typeof window.requestIdleCallback
      | undefined;
    const idle = whenIdle
      ? whenIdle(start, { timeout: 1200 })
      : window.setTimeout(start, 300);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      disposed = true;
      if (whenIdle) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      field?.dispose();
    };
  }, [reduced, stops]);

  return <canvas ref={canvasRef} className="field" aria-hidden="true" />;
}
