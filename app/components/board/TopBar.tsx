"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowIcon } from "../icons";
import { CRAFT_CURSORS, type Who } from "./marks";

type Link = { label: string; href: string };

/**
 * The board's toolbar: file name, the sections as tabs (the one in view is
 * marked), who is on the board, and a way to get in touch. Small screens get
 * a full-screen menu; Escape closes it and focus returns to the toggle.
 */
export function TopBar({ links, email }: { links: Link[]; email: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

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
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 20 20" focusable="false">
              <path d="M4 3.4 16.6 8.5l-5.5 2-2 5.5Z" />
            </svg>
          </span>
          <span className="brand-text">
            <strong>Hemal Herath</strong>
            <small>Portfolio · live board</small>
          </span>
          <span className="sr-only"> — back to top</span>
        </a>

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
          <ul className="crew" aria-hidden="true">
            {(Object.keys(CRAFT_CURSORS) as Who[]).map((who) => (
              <li key={who} data-who={who} title={CRAFT_CURSORS[who]}>
                {CRAFT_CURSORS[who][0]}
              </li>
            ))}
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
