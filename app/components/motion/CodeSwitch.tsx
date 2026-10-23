"use client";

import { useId, useState } from "react";

type View = "interface" | "code";

/**
 * Interface / Code switch for a project visual. The code-built interface and
 * an editor window share one frame; the pill switch underneath wipes between
 * them behind an accent scan line, and the code lines settle in one by one.
 * The hidden layer is inert, so focus and screen readers only meet the one
 * on show.
 */
export function CodeSwitch({
  title,
  interfaceLayer,
  codeLayer,
}: {
  title: string;
  interfaceLayer: React.ReactNode;
  codeLayer: React.ReactNode;
}) {
  const [view, setView] = useState<View>("interface");
  // The scan line only plays after a real switch, not on first paint.
  const [switched, setSwitched] = useState(false);
  const id = useId();

  function show(next: View) {
    if (next === view) return;
    setView(next);
    setSwitched(true);
  }

  return (
    <div className="view" data-view={view} data-switched={switched || undefined}>
      <div
        className="view-frame"
        role="group"
        aria-label={`${title}: ${view === "code" ? "illustrative code" : "interface"}`}
      >
        <div
          id={`${id}-interface`}
          className="view-layer view-ui"
          inert={view !== "interface"}
        >
          {interfaceLayer}
        </div>
        <div
          id={`${id}-code`}
          className="view-layer view-code"
          inert={view !== "code"}
        >
          {codeLayer}
        </div>
        <span className="view-scan" aria-hidden="true" />
      </div>
      <div className="view-switch" role="group" aria-label={`${title} view`}>
        <span className="view-thumb" aria-hidden="true" />
        <button
          type="button"
          aria-pressed={view === "interface"}
          aria-controls={`${id}-interface`}
          onClick={() => show("interface")}
        >
          Interface
        </button>
        <button
          type="button"
          aria-pressed={view === "code"}
          aria-controls={`${id}-code`}
          onClick={() => show("code")}
        >
          <span className="view-code-glyph" aria-hidden="true">
            {"</>"}
          </span>
          Code
        </button>
      </div>
    </div>
  );
}
