"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Avatar } from "./Avatar";

type NavLink = { label: string; href: string };
type ProfileLink = {
  label: string;
  href: string;
  iconSrc: string;
  invertOnDark?: boolean;
  external?: boolean;
};

export function TopNav({
  links,
  profileLinks,
}: {
  links: NavLink[];
  profileLinks: ProfileLink[];
}) {
  const [active, setActive] = useState("");

  useEffect(() => {
    const ids = links.map((link) => link.href.slice(1));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;
        const topMost = visible.reduce((a, b) =>
          a.boundingClientRect.top <= b.boundingClientRect.top ? a : b
        );
        setActive(topMost.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: [0, 1] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [links]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[1440px] items-center gap-4 px-6 py-3 md:px-10 xl:px-16">
        <a
          href="#top"
          className="flex shrink-0 items-center gap-2.5 text-sm font-bold tracking-tight text-white"
        >
          <Avatar src="/avatar.png" alt="" fallbackInitials="HH" size={34} />
          <span className="hidden sm:inline">Hemal Herath</span>
        </a>

        <nav
          aria-label="Section navigation"
          className="ml-2 hidden min-w-0 flex-1 md:block"
        >
          <ul className="flex items-center gap-1">
            {links.map((link) => {
              const id = link.href.slice(1);
              const isActive = active === id;
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={isActive ? "true" : undefined}
                    className={`inline-flex min-h-[40px] items-center rounded-full px-3 text-sm font-medium transition ${
                      isActive
                        ? "text-brand-300"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-0.5">
          {profileLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              aria-label={link.label}
              title={link.label}
              className="group flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-white/10"
            >
              <Image
                src={link.iconSrc}
                alt=""
                width={18}
                height={18}
                className={`h-[18px] w-[18px] object-contain opacity-80 transition group-hover:opacity-100 ${
                  link.invertOnDark ? "invert" : ""
                }`}
              />
            </a>
          ))}
        </div>
      </div>

      <nav
        aria-label="Section navigation"
        className="overflow-x-auto border-t border-border px-6 md:hidden"
      >
        <ul className="flex w-max items-center gap-1 py-1">
          {links.map((link) => {
            const id = link.href.slice(1);
            const isActive = active === id;
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={isActive ? "true" : undefined}
                  className={`inline-flex min-h-[40px] items-center rounded-full px-3 text-xs font-medium transition ${
                    isActive ? "text-brand-300" : "text-slate-400"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
