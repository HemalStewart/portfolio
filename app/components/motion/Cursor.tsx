"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

const INTERACTIVE = 'a[href], button, [role="button"], summary, label';

/**
 * A trailing ring that follows the pointer, swells over links and buttons,
 * labels outbound links and hides over the X-ray lens (which draws its own).
 * Mouse-only; the native cursor is kept.
 */
export function Cursor() {
  const reduced = useReducedMotion();
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!ring || !label || reduced || !matchMedia("(pointer: fine)").matches)
      return;

    const st = { x: -100, y: -100, tx: -100, ty: -100 };
    let raf = 0;
    const tick = () => {
      st.x += (st.tx - st.x) * 0.2;
      st.y += (st.ty - st.y) * 0.2;
      ring.style.transform = `translate3d(${st.x}px, ${st.y}px, 0)`;
      raf =
        Math.abs(st.tx - st.x) + Math.abs(st.ty - st.y) > 0.2
          ? requestAnimationFrame(tick)
          : 0;
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      st.tx = event.clientX;
      st.ty = event.clientY;
      ring.dataset.visible = "";
      if (!raf) raf = requestAnimationFrame(tick);

      const target = event.target as Element | null;
      if (target?.closest('[data-cursor="lens"]')) {
        ring.dataset.state = "hidden";
        return;
      }
      const link = target?.closest(INTERACTIVE) as HTMLElement | null;
      if (!link) {
        delete ring.dataset.state;
        return;
      }
      const external =
        link instanceof HTMLAnchorElement && link.target === "_blank";
      ring.dataset.state = external ? "label" : "hover";
      label.textContent = external ? "Open ↗" : "";
    };
    const onLeave = () => delete ring.dataset.visible;

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced]);

  return (
    <div ref={ringRef} className="cursor" aria-hidden="true">
      <span ref={labelRef} className="cursor-label" />
    </div>
  );
}
