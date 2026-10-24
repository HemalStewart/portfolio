"use client";

import { useEffect, useState } from "react";

type Chapter = { id: string; label: string };

/**
 * A fixed rail on the right edge: one tick per section, the current one lit
 * and counted ("03 / 09"). Ticks jump to their section. Wide screens only.
 */
export function ChapterRail({ chapters }: { chapters: Chapter[] }) {
  const [active, setActive] = useState(0);

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

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <nav className="chapter-rail" aria-label="Chapters">
      <p className="chapter-count" aria-hidden="true">
        <span key={active} className="chapter-now">
          {pad(active + 1)}
        </span>
        <span> / {pad(chapters.length)}</span>
      </p>
      <ol>
        {chapters.map((chapter, index) => (
          <li key={chapter.id}>
            <a
              href={`#${chapter.id}`}
              aria-current={index === active ? "true" : undefined}
            >
              <span className="chapter-label">{chapter.label}</span>
              <i aria-hidden="true" />
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
