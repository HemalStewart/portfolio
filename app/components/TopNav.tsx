"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { ProfileLink } from "../data/portfolio";

export function TopNav({
  links,
  profileLinks,
}: {
  links: { label: string; href: string }[];
  profileLinks: ProfileLink[];
}) {
  const [active, setActive] = useState("about");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );
    links.forEach((link) => {
      const section = document.getElementById(link.href.slice(1));
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, [links]);
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <a className="wordmark" href="#about">
          <Image src="/avatar.png" width={35} height={35} alt="" />
          <span>
            Hemal Herath<span className="wordmark-dot">.</span>
          </span>
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
        <a className="nav-contact" href="#contact">
          Let’s talk <span aria-hidden="true">↗</span>
        </a>
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
                <Image src={link.iconSrc} width={20} height={20} alt="" />
              </a>
            ))}
        </div>
      </div>
    </header>
  );
}
