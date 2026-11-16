"use client";

import { useRef } from "react";

/**
 * Lets the visitor pick a note up and move it, like anything else on a
 * board. Mouse only, so touch scrolling is never hijacked; the offset is
 * kept in the `translate` property, leaving the note's own tilt alone.
 */
export function Drag({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const offset = useRef({ x: 0, y: 0 });
  const grab = useRef<{ x: number; y: number } | null>(null);

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    const el = ref.current;
    if (!el) return;
    el.setPointerCapture(event.pointerId);
    grab.current = {
      x: event.clientX - offset.current.x,
      y: event.clientY - offset.current.y,
    };
    el.dataset.held = "";
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el || !grab.current) return;
    offset.current = {
      x: event.clientX - grab.current.x,
      y: event.clientY - grab.current.y,
    };
    el.style.translate = `${offset.current.x}px ${offset.current.y}px`;
  }

  function release() {
    grab.current = null;
    if (ref.current) delete ref.current.dataset.held;
  }

  return (
    <div
      ref={ref}
      className={`drag ${className}`}
      data-drag=""
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={release}
      onPointerCancel={release}
    >
      {children}
    </div>
  );
}
