"use client";

import { useEffect, useRef } from "react";
import { CREW } from "./crew";
import { startSwarm } from "./engine";
import "./swarm.css";

/** How long the opening stays up after the first paint, in ms. */
const OPENING = 760;

declare global {
  interface Window {
    __board?: boolean;
  }
}

/**
 * The crew of cursors that builds the page (see engine.ts). They are drawn
 * here and driven from there; without `html[data-motion]` (reduced motion, or
 * no script) the layer stays hidden and the page is simply complete.
 */
export function Swarm() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = ref.current;
    if (!layer || !("motion" in document.documentElement.dataset)) return;
    // Tells the inline script in layout.tsx that the build is in hand.
    window.__board = true;
    // The opening (Boot.tsx) gets a beat on screen, counted from the first
    // paint, then the crew bursts out of its ring and starts building.
    const painted =
      performance.getEntriesByName("first-contentful-paint")[0]?.startTime ??
      performance.now() - 200;
    let stop: (() => void) | undefined;
    const timer = window.setTimeout(
      () => {
        document.documentElement.dataset.booted = "";
        stop = startSwarm(layer, CREW);
      },
      Math.max(0, painted + OPENING - performance.now()),
    );
    return () => {
      window.clearTimeout(timer);
      stop?.();
    };
  }, []);

  return (
    <div ref={ref} className="swarm" aria-hidden="true">
      {CREW.map((member, index) => (
        <span
          key={member.id}
          className="cur sw-cur"
          data-dark={member.dark || undefined}
          style={{ "--who": member.color, "--k": index } as React.CSSProperties}
        >
          <svg className="sw-arrow" viewBox="0 0 20 20" focusable="false">
            <path d="M2.2 2.2 17.6 8.4l-6.7 2.5-2.5 6.7Z" />
          </svg>
          <svg className="sw-cross" viewBox="0 0 20 20" focusable="false">
            <path d="M10 1.5v17M1.5 10h17" />
          </svg>
          <svg className="sw-beam" viewBox="0 0 20 20" focusable="false">
            <path d="M6.5 2.5h7M6.5 17.5h7M10 2.5v15" />
          </svg>
          <i>{member.name}</i>
        </span>
      ))}
    </div>
  );
}
