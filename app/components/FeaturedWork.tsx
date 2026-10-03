"use client";

import { useState, type ReactNode } from "react";
import { ProductStudio } from "./ProductStudio";

type FeaturedItem = {
  slug: string;
  title: string;
  platforms: string[];
  techStack: string[];
  summary: string;
};

export function FeaturedWork({
  projects,
  rows,
}: {
  projects: FeaturedItem[];
  rows: ReactNode[];
}) {
  const [active, setActive] = useState(0);
  return (
    <div className="case-browser">
      <aside className="case-index" aria-label="Featured project index">
        <div className="case-index-heading">
          <span className="eyebrow">Explore the work</span>
          <span className="eyebrow">
            {String(projects.length).padStart(2, "0")} systems
          </span>
        </div>
        <div role="group" aria-label="Choose a featured project">
          {projects.map((item, index) => (
            <button
              type="button"
              key={item.slug}
              className="case-option"
              aria-label={"View " + item.title + " case study"}
              aria-pressed={active === index}
              aria-controls={"case-" + item.slug}
              onClick={() => setActive(index)}
            >
              <span className="case-option-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="case-option-body">
                <strong>{item.title}</strong>
                <span>{item.summary}</span>
                <small>{item.techStack.slice(0, 2).join(" / ")}</small>
              </span>
              <span className="case-option-arrow" aria-hidden="true">
                ↗
              </span>
            </button>
          ))}
        </div>
        <p className="case-index-note">
          Select a system to explore its architecture and delivery.
        </p>
      </aside>
      <div className="case-panels">
        <p className="sr-only" role="status">
          {projects[active].title} case study selected.
        </p>
        {projects.map((item, index) => (
          <div
            key={item.slug}
            id={"case-" + item.slug}
            className={"case-panel" + (active === index ? " is-active" : "")}
            hidden={active !== index}
            role="region"
            aria-label={"Case study: " + item.title}
          >
            <div className="case-panel-meta">
              <span>
                {String(index + 1).padStart(2, "0")} / Engineering case study
              </span>
              <span>{item.platforms.join(" · ")}</span>
            </div>
            <div className="case-product-visual">
              <ProductStudio slug={item.slug} />
            </div>
            <div className="case-panel-copy">{rows[index]}</div>
          </div>
        ))}
      </div>
      <noscript>
        <style>
          {
            ".case-index{display:none}.case-browser{display:block}.case-panel[hidden]{display:block!important}.case-panel+.case-panel{margin-top:70px}"
          }
        </style>
        <p>
          All featured projects are shown below. Enable JavaScript to switch
          between the interactive product studies.
        </p>
      </noscript>
    </div>
  );
}
