"use client";

import { m } from "motion/react";
import { useId, useState } from "react";

/**
 * Expands a project's highlights as an animated `+` diff. The lines stay in the
 * DOM while collapsed (inert), so search engines still read them.
 */
export function DiffToggle({ lines }: { lines: string[] }) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <div className="diff-toggle">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((value) => !value)}
      >
        <m.span
          aria-hidden="true"
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
        >
          ▸
        </m.span>
        <span>{open ? "Hide diff" : "View diff"}</span>
        <span className="summary-count" aria-hidden="true">
          +{lines.length}
        </span>
      </button>
      <m.div
        id={id}
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.32, ease: [0.2, 0.7, 0.1, 1] }}
        style={{ overflow: "hidden" }}
        inert={!open}
      >
        <ul className="diff">
          {lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </m.div>
    </div>
  );
}
