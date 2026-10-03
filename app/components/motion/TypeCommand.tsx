"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useLayoutEffect, useRef } from "react";

/**
 * Types a shell command out when it scrolls into view. The server renders the
 * full text; lines that start below the fold are blanked before first paint
 * and typed once visible. Updates go straight to the DOM — no re-renders.
 */
export function TypeCommand({
  text,
  className = "command",
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const typedRef = useRef<HTMLSpanElement>(null);
  const ghostRef = useRef<HTMLSpanElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);
  const pending = useRef(false);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });

  useLayoutEffect(() => {
    const rect = ref.current?.getBoundingClientRect();
    if (reduced || !rect || rect.top < window.innerHeight) return;
    pending.current = true;
    if (typedRef.current) typedRef.current.textContent = "";
    if (ghostRef.current) ghostRef.current.textContent = text;
  }, [reduced, text]);

  useLayoutEffect(() => {
    if (!inView || !pending.current) return;
    pending.current = false;
    const typed = typedRef.current;
    const ghost = ghostRef.current;
    const caret = caretRef.current;
    if (!typed || !ghost) return;
    caret?.setAttribute("data-typing", "");
    let i = 0;
    const timer = window.setInterval(() => {
      i += 1;
      typed.textContent = text.slice(0, i);
      ghost.textContent = text.slice(i);
      if (i >= text.length) {
        window.clearInterval(timer);
        caret?.removeAttribute("data-typing");
      }
    }, 22);
    return () => window.clearInterval(timer);
  }, [inView, text]);

  return (
    <code ref={ref} className={className}>
      <span className="sr-only">$ {text}</span>
      <span aria-hidden="true">$ </span>
      <span ref={typedRef} aria-hidden="true">
        {text}
      </span>
      <span ref={caretRef} className="type-caret" aria-hidden="true" />
      <span ref={ghostRef} className="type-ghost" aria-hidden="true" />
    </code>
  );
}
