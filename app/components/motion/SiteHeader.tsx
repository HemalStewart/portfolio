"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowIcon } from "../icons";

type Link = { label: string; href: string };

/**
 * Floating pill header that stays reachable at all times: it compacts once
 * you scroll, tracks the section in view with a sliding highlight, and opens a
 * full-screen menu on small screens (Escape closes it, focus returns).
 */
export function SiteHeader({ links, email }: { links: Link[]; email: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLUListElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Compact once past the top.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setScrolled(window.scrollY > 24);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Section in view drives the active link.
  useEffect(() => {
    const sections = links
      .map((link) => document.querySelector<HTMLElement>(link.href))
      .filter((section): section is HTMLElement => Boolean(section));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [links]);

  // Slide the highlight under the active link.
  useEffect(() => {
    const pill = pillRef.current;
    const nav = navRef.current;
    if (!pill || !nav) return;
    const link = active
      ? nav.querySelector<HTMLElement>(`a[href="${active}"]`)
      : null;
    if (!link) {
      pill.style.opacity = "0";
      return;
    }
    pill.style.opacity = "1";
    pill.style.width = `${link.offsetWidth}px`;
    pill.style.transform = `translateX(${link.offsetLeft}px)`;
  }, [active]);

  // Mobile menu: lock scroll, close on Escape, restore focus.
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
      className="site-header"
      data-scrolled={scrolled || undefined}
      data-open={open || undefined}
    >
      <div className="header-pill">
        <a className="wordmark" href="#top" onClick={() => setOpen(false)}>
          <span className="wordmark-node" aria-hidden="true" />
          hemal<span className="wordmark-slash">/</span>main
          <span className="sr-only"> — Hemal Herath, back to top</span>
        </a>
        <nav aria-label="Sections" className="nav">
          <span ref={pillRef} className="nav-pill" aria-hidden="true" />
          <ul ref={navRef}>
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
        <div className="header-actions">
          <a
            className="header-cv"
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            CV
          </a>
          <a className="button button-small" href={email}>
            Hire me <ArrowIcon direction="right" />
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
      <div className="scroll-progress" aria-hidden="true" />

      <div id="mobile-menu" className="mobile-menu" inert={!open}>
        <nav aria-label="Menu">
          <ol>
            {links.map((link, index) => (
              <li
                key={link.href}
                style={{ "--i": index } as React.CSSProperties}
              >
                <a href={link.href} onClick={() => setOpen(false)}>
                  <span className="mobile-index" aria-hidden="true">
                    0{index + 1}
                  </span>
                  {link.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="mobile-actions">
          <a className="button" href={email}>
            Hire me <ArrowIcon direction="right" />
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
