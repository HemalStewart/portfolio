"use client";

import { useEffect, useRef } from "react";
import { CursorMark } from "./marks";

/**
 * The visitor's own cursor, drawn like everyone else's on the board with a
 * "You" tag; the tag names what is under it (Open, Drag). Mouse only, and
 * the native cursor stays in charge with reduced motion.
 */
export function YouCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches || !document.documentElement.dataset.motion) return;
    const tag = el.querySelector("i");
    let label = "You";

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      document.documentElement.dataset.you = "";
      el.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
      const target = event.target as Element | null;
      const next = target?.closest("[data-drag]")
        ? "Drag"
        : target?.closest("a, button, summary")
          ? "Open"
          : "You";
      if (next !== label && tag) {
        label = next;
        tag.textContent = next;
        el.dataset.state = next === "You" ? "" : "act";
      }
    };
    const onLeave = () => delete document.documentElement.dataset.you;
    const onDown = () => (el.dataset.down = "");
    const onUp = () => delete el.dataset.down;

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      delete document.documentElement.dataset.you;
    };
  }, []);

  return (
    <div ref={ref} className="you" aria-hidden="true">
      <CursorMark who="you" />
    </div>
  );
}
