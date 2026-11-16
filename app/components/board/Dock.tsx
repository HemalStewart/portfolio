"use client";

import { useEffect, useRef, useState } from "react";

type Chapter = { id: string; label: string };

const TOOLS: { name: string; path: string }[] = [
  { name: "move", path: "M4 3.4 16.6 8.5l-5.5 2-2 5.5Z" },
  { name: "frame", path: "M6 2.5v15M14 2.5v15M2.5 6h15M2.5 14h15" },
  { name: "text", path: "M4.5 5V4h11v1M10 4v12M7.5 16h5" },
  { name: "pen", path: "M3 16c3-6 5 3 8-3s4-7 6-6" },
  { name: "note", path: "M4 4h12v8l-4 4H4ZM12 16v-4h4" },
  { name: "arrow", path: "M4 16 16 4M8 4h8v8" },
];

/**
 * The tool dock at the foot of the board: the tool in use lights up while
 * the hero is being built (`html[data-tool]`, styled in CSS), then it shows
 * where you are, how far down the board, and replays the build.
 */
export function Dock({ chapters }: { chapters: Chapter[] }) {
  const [active, setActive] = useState(0);
  const zoomRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = chapters.findIndex((c) => c.id === entry.target.id);
          if (index >= 0) setActive(index);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    chapters.forEach((chapter) => {
      const el = document.getElementById(chapter.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [chapters]);

  // How far down the board, written straight to the DOM.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const span = document.documentElement.scrollHeight - window.innerHeight;
      const done = span > 0 ? Math.round((window.scrollY / span) * 100) : 0;
      if (zoomRef.current) zoomRef.current.textContent = `${done}%`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");
  const next = chapters[Math.min(chapters.length - 1, active + 1)];

  return (
    <div className="dock">
      <ul className="dock-tools" aria-hidden="true">
        {TOOLS.map((tool) => (
          <li key={tool.name} data-tool={tool.name}>
            <svg viewBox="0 0 20 20" focusable="false">
              <path d={tool.path} />
            </svg>
          </li>
        ))}
      </ul>
      <a className="dock-where" href={`#${next.id}`}>
        <span className="dock-index" aria-hidden="true">
          {pad(active + 1)} / {pad(chapters.length)}
        </span>
        <span key={active} className="dock-label">
          {chapters[active].label}
        </span>
        <span className="sr-only"> — go to {next.label}</span>
      </a>
      <span ref={zoomRef} className="dock-zoom" aria-hidden="true">
        0%
      </span>
      <button
        type="button"
        className="dock-replay"
        onClick={() => window.dispatchEvent(new Event("hh:replay"))}
      >
        <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
          <path d="M4.5 10a5.5 5.5 0 1 0 1.7-4M4 3v3.4h3.4" />
        </svg>
        <span>Replay</span>
        <span className="sr-only"> the opening build</span>
      </button>
    </div>
  );
}
