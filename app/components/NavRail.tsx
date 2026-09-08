"use client";

import { useEffect, useState } from "react";

type NavLink = { label: string; href: string };

export function NavRail({ links }: { links: NavLink[] }) {
  const [active, setActive] = useState(links[0]?.href.slice(1) ?? "");

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
      { rootMargin: "-15% 0px -70% 0px", threshold: [0, 1] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [links]);

  return (
    <>
      <nav aria-label="Section navigation" className="mt-10 hidden lg:block">
        <ul className="space-y-3">
          {links.map((link) => {
            const id = link.href.slice(1);
            const isActive = active === id;
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={isActive ? "true" : undefined}
                  className={`group flex items-center gap-3 text-xs font-medium uppercase tracking-[0.15em] transition ${
                    isActive
                      ? "text-slate-900"
                      : "text-slate-400 hover:text-slate-900"
                  }`}
                >
                  <span
                    className={`h-px transition-all ${
                      isActive
                        ? "w-10 bg-brand-500"
                        : "w-6 bg-slate-300 group-hover:w-10 group-hover:bg-brand-500"
                    }`}
                  />
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <nav
        aria-label="Section navigation"
        className="-mx-6 mt-6 overflow-x-auto px-6 lg:hidden"
      >
        <ul className="flex w-max gap-2 pb-1">
          {links.map((link) => {
            const id = link.href.slice(1);
            const isActive = active === id;
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={isActive ? "true" : undefined}
                  className={`inline-flex min-h-[38px] items-center rounded-full px-3.5 text-xs font-medium transition ${
                    isActive
                      ? "bg-brand-50 text-brand-700"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
