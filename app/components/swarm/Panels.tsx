"use client";

import { useEffect, useRef, useState } from "react";
import { CREW } from "./crew";
import type { SwarmEvent, SwarmRect } from "./engine";
import "./panels.css";

type Chapter = { id: string; label: string };
type Layer = { key: number; name: string; kind: string };
type Group = Chapter & { layers: Layer[] };
type Entry = { key: number; who: string; color: string; text: string };

const VERB: Record<string, string> = {
  frame: "drew",
  type: "typed",
  words: "wrote",
  pop: "placed",
  drop: "dropped",
  draw: "connected",
  rows: "listed",
};
const DOING: Record<string, string> = {
  frame: "drawing",
  type: "typing",
  words: "writing",
  pop: "placing",
  drop: "moving",
  draw: "connecting",
  rows: "listing",
};
/** One glyph per kind of layer, the way a layers panel marks them. */
const ICON: Record<string, string> = {
  frame: "M3 5.5h10M3 10.5h10M5.5 3v10M10.5 3v10",
  type: "M4 5V4h8v1M8 4v8M6.5 12h3",
  words: "M3.5 5h9M3.5 8h9M3.5 11h6",
  pop: "M8 3l5 5-5 5-5-5Z",
  drop: "M4 4h8v5l-3 3H4ZM9 12V9h3",
  draw: "M4 12 12 4M7 4h5v5",
  rows: "M3.5 5h9M3.5 8h9M3.5 11h9",
};

/**
 * The file's side panels. On the left, the sections as frames with the
 * layers inside the current one: each lights up in its maker's colour as the
 * swarm builds it, above a running log of who did what. On the right (wide
 * screens), the selection being drawn with its live position and size, and
 * what every member of the crew is doing. Both listen to engine.ts.
 */
export function Panels({
  chapters,
  email,
  emailLabel,
}: {
  chapters: Chapter[];
  email: string;
  emailLabel: string;
}) {
  const [groups, setGroups] = useState<Group[]>(() =>
    chapters.map((chapter) => ({ ...chapter, layers: [] })),
  );
  const [built, setBuilt] = useState<Record<number, string>>({});
  const [doing, setDoing] = useState<Record<string, string>>({});
  const [log, setLog] = useState<Entry[]>([]);
  const [active, setActive] = useState(0);
  const [pick, setPick] = useState({ name: "Nothing selected", who: "", color: "" });
  const treeRef = useRef<HTMLElement>(null);
  const fields = useRef<Record<string, HTMLElement | null>>({});

  // Read the layers out of the page: every build step, grouped by section.
  useEffect(() => {
    const keys = new WeakMap<Element, number>();
    let next = 0;
    const done: Record<number, string> = {};
    const scanned = chapters.map((chapter) => {
      const section = document.getElementById(chapter.id);
      const layers: Layer[] = [];
      section?.querySelectorAll<HTMLElement>("[data-b]").forEach((el) => {
        const key = next++;
        keys.set(el, key);
        if ("built" in el.dataset) done[key] = "var(--subtle)";
        layers.push({
          key,
          name: el.dataset.name || el.dataset.b || "Layer",
          kind: el.dataset.b || "pop",
        });
      });
      return { ...chapter, layers };
    });
    setGroups(scanned);
    setBuilt(done);

    // Events arrive in bursts while a screen is built: apply them together.
    let pending: SwarmEvent[] = [];
    let timer = 0;
    let entry = 0;
    const flush = () => {
      timer = 0;
      const batch = pending;
      pending = [];
      const builtNow: Record<number, string> = {};
      const doingNow: Record<string, string> = {};
      const entries: Entry[] = [];
      let last: SwarmEvent | undefined;
      for (const event of batch) {
        const key = keys.get(event.el);
        if (event.type === "start" && event.who) {
          doingNow[event.who.id] = `${DOING[event.kind]} ${event.name}`;
          last = event;
        } else if (event.type === "done") {
          if (key !== undefined)
            builtNow[key] = event.who?.color ?? "var(--subtle)";
          if (event.who) {
            doingNow[event.who.id] = "";
            entries.push({
              key: entry++,
              who: event.who.name,
              color: event.who.color,
              text: `${VERB[event.kind]} ${event.name}`,
            });
          }
        }
      }
      setBuilt((value) => ({ ...value, ...builtNow }));
      setDoing((value) => ({ ...value, ...doingNow }));
      if (entries.length)
        setLog((value) => [...entries.reverse(), ...value].slice(0, 7));
      if (last?.who)
        setPick({ name: last.name, who: last.who.name, color: last.who.color });
    };
    const onSwarm = (event: Event) => {
      pending.push((event as CustomEvent<SwarmEvent>).detail);
      if (!timer) timer = window.setTimeout(flush, 110);
    };
    const onRect = (event: Event) => {
      const rect = (event as CustomEvent<SwarmRect>).detail;
      for (const name of ["x", "y", "w", "h"] as const) {
        const field = fields.current[name];
        if (field) field.textContent = String(rect[name]);
      }
    };
    window.addEventListener("swarm", onSwarm);
    window.addEventListener("swarm:rect", onRect);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("swarm", onSwarm);
      window.removeEventListener("swarm:rect", onRect);
    };
  }, [chapters]);

  // Which section is on screen.
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

  // Keep the open section in view inside the panel.
  useEffect(() => {
    const tree = treeRef.current;
    const row = tree?.querySelector<HTMLElement>("[data-current]");
    if (tree && row) tree.scrollTo({ top: Math.max(0, row.offsetTop - 8) });
  }, [active]);

  const total = groups.reduce((sum, group) => sum + group.layers.length, 0);
  const done = Object.keys(built).length;
  const working = Object.values(doing).filter(Boolean).length;

  return (
    <>
      <aside className="panel lp" aria-label="Layers">
        <p className="panel-tabs" aria-hidden="true">
          <span data-on="">Layers</span>
          <span>Assets</span>
        </p>
        <p className="panel-title">
          Portfolio
          <span aria-hidden="true">
            {done} / {total || "…"} built
          </span>
        </p>
        <nav ref={treeRef} className="lp-tree" aria-label="Sections">
          <ol>
            {groups.map((group, index) => {
              const made = group.layers.filter((l) => l.key in built).length;
              return (
                <li key={group.id} data-current={index === active || undefined}>
                  <a href={`#${group.id}`}>
                    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                      <path d={ICON.frame} />
                    </svg>
                    <span>{group.label}</span>
                    <small aria-hidden="true">
                      {group.layers.length ? `${made}/${group.layers.length}` : ""}
                    </small>
                  </a>
                  {index === active && group.layers.length ? (
                    <ul aria-hidden="true">
                      {group.layers.map((layer) => (
                        <li
                          key={layer.key}
                          data-built={layer.key in built || undefined}
                          style={
                            { "--who": built[layer.key] } as React.CSSProperties
                          }
                        >
                          <svg viewBox="0 0 16 16" focusable="false">
                            <path d={ICON[layer.kind] ?? ICON.pop} />
                          </svg>
                          <span>{layer.name}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </nav>
        <div className="lp-log" aria-hidden="true">
          <p className="panel-title">
            Activity
            <span>{working ? `${working} working` : "idle"}</span>
          </p>
          <ol>
            {log.map((entry) => (
              <li
                key={entry.key}
                style={{ "--who": entry.color } as React.CSSProperties}
              >
                <b>{entry.who}</b> {entry.text}
              </li>
            ))}
          </ol>
        </div>
      </aside>

      <aside className="panel rp" aria-label="Inspector">
        <p className="panel-tabs" aria-hidden="true">
          <span data-on="">Design</span>
          <span>Prototype</span>
          <span className="rp-zoom">100%</span>
        </p>
        <div className="rp-block" aria-hidden="true">
          <p className="panel-title">Selection</p>
          <p
            className="rp-pick"
            style={{ "--who": pick.color || undefined } as React.CSSProperties}
          >
            <i />
            <b>{pick.name}</b>
            <span>{pick.who}</span>
          </p>
          <dl className="rp-fields">
            {(["x", "y", "w", "h"] as const).map((name) => (
              <div key={name}>
                <dt>{name}</dt>
                <dd
                  ref={(el) => {
                    fields.current[name] = el;
                  }}
                >
                  0
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="rp-block" aria-hidden="true">
          <p className="panel-title">
            Crew
            <span>{CREW.length} cursors · 1 person</span>
          </p>
          <ul className="rp-crew">
            {CREW.map((member) => (
              <li
                key={member.id}
                data-on={doing[member.id] ? "" : undefined}
                style={{ "--who": member.color } as React.CSSProperties}
              >
                <i />
                <b>{member.name}</b>
                <span>{doing[member.id] || "ready"}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rp-block rp-export">
          <p className="panel-title">Export</p>
          <a
            className="rp-btn"
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download CV
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <a className="rp-mail" href={email}>
            {emailLabel}
          </a>
        </div>
      </aside>
    </>
  );
}
