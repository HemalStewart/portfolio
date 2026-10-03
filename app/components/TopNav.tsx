"use client";
import { useEffect, useRef, useState } from "react";
import type { ProfileLink } from "../data/portfolio";
import { ContactIcon } from "./ContactIcon";

export function TopNav({
  links,
  profileLinks,
}: {
  links: { label: string; href: string }[];
  profileLinks: ProfileLink[];
}) {
  const [active, setActive] = useState("about");
  const progress = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-15% 0px -65% 0px" },
    );
    links.forEach((link) => {
      const section = document.getElementById(link.href.slice(1));
      if (section) observer.observe(section);
    });
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - innerHeight;
      if (progress.current)
        progress.current.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [links]);
  const activeIndex = Math.max(
    0,
    links.findIndex((link) => link.href.slice(1) === active),
  );
  return (
    <>
      <header className="site-header">
        <div className="shell header-inner">
          <a
            className="wordmark"
            href="#about"
            aria-label="Hemal Herath — home"
          >
            Hemal Herath<span>.</span>
          </a>
          <nav aria-label="Main navigation">
            <ul>
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={
                      active === link.href.slice(1) ? "location" : undefined
                    }
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="header-social">
            {profileLinks
              .filter((link) => ["GitHub", "LinkedIn"].includes(link.label))
              .map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={link.label}
                  aria-label={link.label}
                >
                  <ContactIcon name={link.label} size={20} />
                </a>
              ))}
          </div>
          <a className="nav-contact" href="#contact">
            Let’s talk <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div ref={progress} className="page-progress" aria-hidden="true" />
      </header>
      <nav className="chapter-nav" aria-label="Portfolio chapters">
        <span aria-hidden="true">
          0{activeIndex + 1} / 0{links.length}
        </span>
        {links.map((link, i) => (
          <a
            key={link.href}
            href={link.href}
            aria-label={`Go to ${link.label}`}
            title={link.label}
            aria-current={
              active === link.href.slice(1) ? "location" : undefined
            }
          >
            <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
          </a>
        ))}
      </nav>
    </>
  );
}
