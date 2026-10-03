"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";

const R_BASE = 130;
const R_SMALL = 96;
const R_PRESSED = 175;
const KEY_STEP = 24;
const MASK =
  "radial-gradient(circle var(--r) at var(--mx) var(--my), transparent 0 calc(100% - 1px), black 100%)";

/**
 * X-ray lens: the interface sits on top, masked by a crisp circular hole that
 * follows the pointer (eased), springs larger on press, moves on tap for touch
 * and with arrow keys when focused, and reveals the code layer underneath.
 * The animation loop only runs while the lens is still settling.
 */
export function XRayLens({
  title,
  interfaceLayer,
  codeLayer,
}: {
  title: string;
  interfaceLayer: React.ReactNode;
  codeLayer: React.ReactNode;
}) {
  const reduced = useReducedMotion();
  const [full, setFull] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const hintId = useId();

  useEffect(() => {
    const frame = frameRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!frame || !ring || !label) return;

    const small = () => frame.clientWidth < 520;
    const st = { x: 0, y: 0, tx: 0, ty: 0, r: R_BASE, rv: 0, down: false };
    let raf = 0;

    const place = () => {
      frame.style.setProperty("--mx", `${st.x.toFixed(1)}px`);
      frame.style.setProperty("--my", `${st.y.toFixed(1)}px`);
      frame.style.setProperty("--r", `${st.r.toFixed(1)}px`);
      ring.style.transform = `translate3d(${st.x}px, ${st.y}px, 0) translate(-50%, -50%) scale(${(st.r * 2) / 200})`;
      const o = st.r * Math.SQRT1_2;
      label.style.transform = `translate3d(${st.x + o + 6}px, ${st.y + o}px, 0)`;
    };

    const tick = () => {
      const target = st.down ? R_PRESSED : small() ? R_SMALL : R_BASE;
      if (reduced) {
        st.x = st.tx;
        st.y = st.ty;
        st.r = target;
      } else {
        st.x += (st.tx - st.x) * 0.18;
        st.y += (st.ty - st.y) * 0.18;
        st.rv = (st.rv + (target - st.r) * 0.16) * 0.72;
        st.r += st.rv;
      }
      place();
      const settled =
        Math.abs(st.tx - st.x) < 0.1 &&
        Math.abs(st.ty - st.y) < 0.1 &&
        Math.abs(target - st.r) < 0.1 &&
        Math.abs(st.rv) < 0.05;
      raf = settled ? 0 : requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const reset = () => {
      st.x = st.tx = frame.clientWidth * 0.42;
      st.y = st.ty = frame.clientHeight * 0.5;
      st.r = small() ? R_SMALL : R_BASE;
      place();
    };
    reset();
    frame.dataset.lens = "ready";
    const ro = new ResizeObserver(reset);
    ro.observe(frame);

    const local = (event: PointerEvent) => {
      const rect = frame.getBoundingClientRect();
      return {
        x: Math.min(Math.max(event.clientX - rect.left, 0), rect.width),
        y: Math.min(Math.max(event.clientY - rect.top, 0), rect.height),
      };
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      Object.assign(st, { tx: local(event).x, ty: local(event).y });
      kick();
    };
    const onDown = (event: PointerEvent) => {
      st.down = true;
      if (event.pointerType !== "mouse") {
        const point = local(event);
        st.tx = point.x;
        st.ty = point.y;
      }
      kick();
    };
    const onUp = () => {
      st.down = false;
      kick();
    };
    const onKey = (event: KeyboardEvent) => {
      const step = {
        ArrowLeft: [-1, 0],
        ArrowRight: [1, 0],
        ArrowUp: [0, -1],
        ArrowDown: [0, 1],
      }[event.key];
      if (!step) return;
      event.preventDefault();
      st.tx = Math.min(
        Math.max(st.tx + step[0] * KEY_STEP, 0),
        frame.clientWidth,
      );
      st.ty = Math.min(
        Math.max(st.ty + step[1] * KEY_STEP, 0),
        frame.clientHeight,
      );
      kick();
    };

    frame.addEventListener("pointermove", onMove);
    frame.addEventListener("pointerdown", onDown);
    frame.addEventListener("pointerup", onUp);
    frame.addEventListener("pointercancel", onUp);
    frame.addEventListener("pointerleave", onUp);
    frame.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      frame.removeEventListener("pointermove", onMove);
      frame.removeEventListener("pointerdown", onDown);
      frame.removeEventListener("pointerup", onUp);
      frame.removeEventListener("pointercancel", onUp);
      frame.removeEventListener("pointerleave", onUp);
      frame.removeEventListener("keydown", onKey);
    };
  }, [reduced]);

  return (
    <div className="lens">
      <div
        ref={frameRef}
        className="lens-frame"
        role="group"
        tabIndex={0}
        aria-label={`${title}: interface with an X-ray lens revealing illustrative code`}
        aria-describedby={hintId}
        data-cursor="lens"
        data-full={full || undefined}
      >
        <div className="lens-layer lens-code" aria-hidden={!full}>
          {codeLayer}
        </div>
        <div
          className="lens-layer lens-ui"
          style={full ? undefined : { maskImage: MASK, WebkitMaskImage: MASK }}
          aria-hidden={full}
        >
          {interfaceLayer}
        </div>
        <span ref={ringRef} className="lens-ring" aria-hidden="true" />
        <span ref={labelRef} className="lens-label" aria-hidden="true">
          CODE
        </span>
      </div>
      <p id={hintId} className="sr-only">
        Move the pointer, tap, or use the arrow keys to move the lens.
      </p>
      <button
        type="button"
        className="lens-toggle"
        aria-pressed={full}
        onClick={() => setFull((value) => !value)}
      >
        <span className="lens-toggle-dot" aria-hidden="true" />
        {full ? "Show interface" : "Show code"}
      </button>
    </div>
  );
}
