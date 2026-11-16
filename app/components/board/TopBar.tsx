"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowIcon } from "../icons";
import { CRAFT_CURSORS, type Who } from "./marks";

type Link = { label: string; href: string };
type Side = "lp" | "rp";

const PANELS: Record<Side, { label: string; bar: string }> = {
  lp: { label: "Layers panel", bar: "M3 4h5v12H3Z" },
  rp: { label: "Inspector panel", bar: "M12 4h5v12h-5Z" },
};

/**
 * The file's toolbar: its name, the sections as tabs (the one in view is
 * marked), who is in the file, and a way to get in touch. The two panel
 * buttons open the layers and the inspector, which start closed; the choice
 * is kept for the next visit. Small screens get a full-screen menu; Escape
 * closes it and focus returns to the toggle.
 */
export function TopBar({ links, email }: { links: Link[]; email: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [panels, setPanels] = useState<Record<Side, boolean>>({
    lp: false,
    rp: false,
  });
  const toggleRef = useRef<HTMLButtonElement>(null);

  // The inline script in layout.tsx has already restored a stored choice.
  useEffect(() => {
    const data = document.documentElement.dataset;
    const frame = requestAnimationFrame(() =>
      setPanels({ lp: "lp" in data, rp: "rp" in data }),
    );
    return () => cancelAnimationFrame(frame);
  }, []);

  function togglePanel(side: Side) {
    // The page's own attributes are the source of truth, so quick clicks on
    // both toggles never act on a stale copy of the state.
    const root = document.documentElement;
    root.toggleAttribute(`data-${side}`, !root.hasAttribute(`data-${side}`));
    const next = { lp: root.hasAttribute("data-lp"), rp: root.hasAttribute("data-rp") };
    setPanels(next);
    try {
      localStorage.setItem(
        "hh-panels",
        `${next.lp ? "l" : ""}${next.rp ? "r" : ""}`,
      );
    } catch {
      /* private mode: the choice just lasts for this visit */
    }
    // Pinned sections measure themselves on resize; the canvas just changed.
    window.setTimeout(() => window.dispatchEvent(new Event("resize")), 340);
  }

  const panelButton = (side: Side) => (
    <button
      type="button"
      className="panel-toggle"
      aria-pressed={panels[side]}
      aria-label={PANELS[side].label}
      title={PANELS[side].label}
      onClick={() => togglePanel(side)}
    >
      <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
        <path d="M3 4h14v12H3Z" />
        <path d={PANELS[side].bar} />
      </svg>
    </button>
  );

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setScrolled(window.scrollY > 24);
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

  // Every section is watched, so the mark clears in ones without a tab.
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("main > section[id]"),
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.documentElement.dataset.menu = "open";
    window.addEventListener("keydown", onKey);
    const toggle = toggleRef.current;
    return () => {
      delete document.documentElement.dataset.menu;
      window.removeEventListener("keydown", onKey);
      toggle?.focus();
    };
  }, [open]);

  return (
    <header
      className="topbar"
      data-scrolled={scrolled || undefined}
      data-open={open || undefined}
    >
      <div className="topbar-row">
        <a className="brand" href="#top" onClick={() => setOpen(false)}>
          <span className="brand-text">
            <strong>Hemal Herath</strong>
            <small>Portfolio · live file</small>
          </span>
          <span className="sr-only"> — back to top</span>
        </a>
        {panelButton("lp")}

        <nav aria-label="Sections" className="tabs">
          <ul>
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={active === link.href ? "true" : undefined}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="topbar-actions">
          {panelButton("rp")}
          <ul className="crew" aria-hidden="true">
            {(Object.keys(CRAFT_CURSORS) as Who[]).map((who) => (
              <li key={who} data-who={who} title={CRAFT_CURSORS[who]}>
                {CRAFT_CURSORS[who][0]}
              </li>
            ))}
            <li className="crew-more">+8</li>
          </ul>
          <a
            className="topbar-cv"
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            CV
          </a>
          <a className="btn btn-ink btn-small" href={email}>
            Hire me
            <ArrowIcon direction="right" />
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <i aria-hidden="true" />
            <i aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="topbar-progress" aria-hidden="true" />

      <div id="mobile-menu" className="mobile-menu" inert={!open}>
        <nav aria-label="Menu">
          <ol>
            {links.map((link, index) => (
              <li key={link.href} style={{ "--i": index } as React.CSSProperties}>
                <a href={link.href} onClick={() => setOpen(false)}>
                  <span className="mobile-index" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {link.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="mobile-actions">
          <a className="btn btn-ink" href={email}>
            Hire me
            <ArrowIcon direction="right" />
          </a>
          <a
            className="text-link"
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download CV <ArrowIcon />
          </a>
        </div>
      </div>
    </header>
  );
}
