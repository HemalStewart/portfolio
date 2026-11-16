"use client";

import { useEffect, useRef, useState } from "react";
import "./rulers.css";

const STEP = 100;
const ACROSS = Array.from({ length: 41 }, (_, i) => i * STEP);

/**
 * The rulers along the top and left edge of the canvas, the way a design
 * tool shows them. The top one counts across the canvas; the left one counts
 * down the page and scrolls with it. Pointing at any layer marks its extent
 * on both rulers, as a selection does.
 */
export function Rulers() {
  const [down, setDown] = useState(40);
  const top = useRef<HTMLDivElement>(null);
  const left = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const markX = useRef<HTMLSpanElement>(null);
  const markY = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const doc = document.documentElement;
    let raf = 0;
    let target: Element | null = null;

    const mark = () => {
      const x = markX.current;
      const y = markY.current;
      if (!x || !y || !top.current || !left.current) return;
      if (!target) {
        x.style.opacity = "0";
        y.style.opacity = "0";
        return;
      }
      const r = target.getBoundingClientRect();
      const t = top.current.getBoundingClientRect();
      const l = left.current.getBoundingClientRect();
      x.style.transform = `translateX(${r.left - t.left}px)`;
      x.style.width = `${r.width}px`;
      y.style.transform = `translateY(${r.top - l.top}px)`;
      y.style.height = `${r.height}px`;
      x.style.opacity = "1";
      y.style.opacity = "1";
    };

    const frame = () => {
      raf = 0;
      if (strip.current)
        strip.current.style.transform = `translate3d(0, ${-window.scrollY}px, 0)`;
      mark();
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const measure = () => {
      setDown(Math.ceil(doc.scrollHeight / STEP) + 1);
      queue();
    };

    const over = (event: PointerEvent) => {
      const next =
        event.target instanceof Element
          ? event.target.closest("[data-name], .frame, .contact-frame")
          : null;
      if (next !== target) {
        target = next;
        queue();
      }
    };

    const size = new ResizeObserver(measure);
    size.observe(document.body);
    window.addEventListener("scroll", queue, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    measure();

    return () => {
      cancelAnimationFrame(raf);
      size.disconnect();
      window.removeEventListener("scroll", queue);
      document.removeEventListener("pointerover", over);
    };
  }, []);

  return (
    <div className="rulers" aria-hidden="true">
      <div ref={top} className="ruler ruler-x">
        {ACROSS.map((n) => (
          <span key={n} style={{ left: n }}>
            {n}
          </span>
        ))}
        <span ref={markX} className="ruler-mark" />
      </div>
      <div ref={left} className="ruler ruler-y">
        <div ref={strip} className="ruler-strip" style={{ height: down * STEP }}>
          {Array.from({ length: down }, (_, i) => (
            <span key={i} style={{ top: i * STEP }}>
              {i * STEP}
            </span>
          ))}
        </div>
        <span ref={markY} className="ruler-mark" />
      </div>
      <div className="ruler-corner" />
    </div>
  );
}
