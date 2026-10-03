"use client";

import { useId, useState } from "react";

/**
 * Expands a project's highlights as a `+` diff. Height animates with a CSS
 * grid-rows transition; collapsed lines stay in the DOM (inert) for search.
 */
export function DiffToggle({ lines }: { lines: string[] }) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <div className="diff-toggle" data-open={open || undefined}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="diff-caret" aria-hidden="true">
          ▸
        </span>
        <span>{open ? "Hide diff" : "View diff"}</span>
        <span className="summary-count" aria-hidden="true">
          +{lines.length}
        </span>
      </button>
      <div id={id} className="diff-panel" inert={!open}>
        <div>
          <ul className="diff">
            {lines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
