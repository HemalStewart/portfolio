"use client";

import { useEffect, useState } from "react";

/** Copies a value to the clipboard; announces the result to screen readers. */
export function CopyButton({ value, label }: { value: string; label: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (state === "idle") return;
    const timer = window.setTimeout(() => setState("idle"), 2000);
    return () => window.clearTimeout(timer);
  }, [state]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setState("copied");
    } catch {
      setState("failed");
    }
  }

  return (
    <button type="button" className="copy-button" onClick={copy}>
      <span aria-hidden="true">{state === "copied" ? "✓" : "⧉"}</span>
      {state === "copied"
        ? "Copied"
        : state === "failed"
          ? "Copy failed"
          : label}
      <span className="sr-only" role="status">
        {state === "copied" ? `${value} copied to clipboard` : ""}
      </span>
    </button>
  );
}
