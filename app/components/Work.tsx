import type { ExternalReference, ProjectExperience } from "../data/portfolio";
import { codeSamples } from "../data/code";
import { CodeView } from "./CodeView";
import { ArrowIcon } from "./icons";
import { ProjectMockup } from "./mockups/Mockups";
import { TypeCommand } from "./motion/TypeCommand";
import { XRayLens } from "./motion/XRayLens";
import { DiffToggle } from "./motion/DiffToggle";

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
      <TypeCommand text={command} />
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

function Visual({ project }: { project: ProjectExperience }) {
  return (
    <div
      className="shot"
      role="img"
      aria-label={`Interface sketch of ${project.title}`}
    >
      <ProjectMockup slug={project.slug} />
    </div>
  );
}

function LensVisual({ project }: { project: ProjectExperience }) {
  const sample = codeSamples[project.slug];
  if (!sample) return <Visual project={project} />;
  return (
    <div className="shot shot-lens">
      <XRayLens
        title={project.title}
        interfaceLayer={<ProjectMockup slug={project.slug} />}
        codeLayer={<CodeView file={sample.file} code={sample.code} />}
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
      <LensVisual project={project} />
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
      <Visual project={project} />
      <code className="branch-label">
        <span className="branch-dot" aria-hidden="true" />
        feature/{project.slug}
      </code>
      <h3 id={`${project.slug}-title`}>{project.title}</h3>
      <p className="card-tagline">{project.tagline}</p>
      <Chips items={project.platforms} />
      <DiffToggle lines={project.highlights} />
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
