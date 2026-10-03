import Image from "next/image";
import type { ExternalReference, ProjectExperience } from "../data/portfolio";
import { ArrowIcon } from "./icons";

export function SectionHead({
  id,
  command,
  title,
  description,
}: {
  id: string;
  command: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="section-head reveal">
      <code className="command">
        <span aria-hidden="true">$ </span>
        {command}
      </code>
      <h2 id={id}>{title}</h2>
      {description ? <p>{description}</p> : null}
    </header>
  );
}

export function ReferenceLink({
  reference,
  context,
}: {
  reference: ExternalReference;
  context: string;
}) {
  if (!reference.href)
    return (
      <span className="ref ref-muted">
        {reference.label}
        {reference.note ? <small>{reference.note}</small> : null}
      </span>
    );
  return (
    <a
      className="ref"
      href={reference.href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {reference.label}
      <span className="sr-only"> for {context} (opens in a new tab)</span>
      <ArrowIcon />
    </a>
  );
}

function Screenshot({
  project,
  sizes,
}: {
  project: ProjectExperience;
  sizes: string;
}) {
  return (
    <div className="shot">
      <Image
        src={`/projects/${project.slug}.png`}
        alt={`${project.title} interface preview`}
        width={1586}
        height={1003}
        sizes={sizes}
      />
    </div>
  );
}

function Chips({ items }: { items: string[] }) {
  return (
    <ul className="chips" aria-label="Platforms">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function Diff({ lines }: { lines: string[] }) {
  return (
    <ul className="diff">
      {lines.map((line) => (
        <li key={line}>{line}</li>
      ))}
    </ul>
  );
}

export function FeaturedCase({
  project,
  index,
}: {
  project: ProjectExperience;
  index: number;
}) {
  return (
    <article
      id={project.slug}
      className="case reveal"
      aria-labelledby={`${project.slug}-title`}
    >
      <Screenshot
        project={project}
        sizes="(max-width: 900px) calc(100vw - 32px), 680px"
      />
      <div className="case-body">
        <code className="branch-label">
          <span className="branch-dot" aria-hidden="true" />
          feature/{project.slug}
          <span className="merged">merged</span>
          <span className="case-index">
            {String(index + 1).padStart(2, "0")}
          </span>
        </code>
        <h3 id={`${project.slug}-title`}>{project.title}</h3>
        <p className="case-tagline">{project.tagline}</p>
        <Chips items={project.platforms} />
        <Diff lines={project.highlights} />
        <p className="stack-line">
          <span className="sr-only">Stack: </span>
          {project.techStack.join(" / ")}
        </p>
        <div className="refs">
          {project.references.map((reference) => (
            <ReferenceLink
              key={reference.label}
              reference={reference}
              context={project.title}
            />
          ))}
        </div>
      </div>
    </article>
  );
}

export function ProjectCard({ project }: { project: ProjectExperience }) {
  return (
    <article
      id={project.slug}
      className="card reveal"
      aria-labelledby={`${project.slug}-title`}
    >
      <Screenshot
        project={project}
        sizes="(max-width: 640px) calc(100vw - 32px), (max-width: 1080px) 46vw, 380px"
      />
      <code className="branch-label">
        <span className="branch-dot" aria-hidden="true" />
        feature/{project.slug}
      </code>
      <h3 id={`${project.slug}-title`}>{project.title}</h3>
      <p className="card-tagline">{project.tagline}</p>
      <Chips items={project.platforms} />
      <details className="card-details">
        <summary>
          <span>View diff</span>
          <span className="summary-count" aria-hidden="true">
            +{project.highlights.length}
          </span>
        </summary>
        <Diff lines={project.highlights} />
      </details>
      <p className="stack-line">
        <span className="sr-only">Stack: </span>
        {project.techStack.join(" / ")}
      </p>
      <div className="refs">
        {project.references.map((reference) => (
          <ReferenceLink
            key={reference.label}
            reference={reference}
            context={project.title}
          />
        ))}
      </div>
    </article>
  );
}
