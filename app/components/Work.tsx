import "./code-view.css";
import type { ExternalReference, ProjectExperience } from "../data/portfolio";
import { codeSamples } from "../data/code";
import { FrameLabel, type Who } from "./board/marks";
import { CodeView } from "./CodeView";
import { ArrowIcon } from "./icons";
import { ProjectMockup } from "./mockups/Mockups";
import { CodeSwitch } from "./motion/CodeSwitch";

/** Which collaborator's colour a project wears, from its platforms and stack. */
export function craftOf(project: ProjectExperience): Who {
  if (project.platforms.some((platform) => /android|ios/i.test(platform)))
    return "flutter";
  if (project.techStack.some((tech) => /fastapi|openai|whisper|gemini/i.test(tech)))
    return "ai";
  return "web";
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

/** A frame on the board holding a project's screen. */
function Frame({
  project,
  children,
}: {
  project: ProjectExperience;
  children: React.ReactNode;
}) {
  const who = craftOf(project);
  return (
    <div className="frame" data-who={who}>
      <FrameLabel who={who}>{project.slug}</FrameLabel>
      <div className="shot">{children}</div>
      <i className="frame-handle" aria-hidden="true" />
      <i className="frame-handle" aria-hidden="true" />
      <i className="frame-handle" aria-hidden="true" />
      <i className="frame-handle" aria-hidden="true" />
    </div>
  );
}

function Visual({ project }: { project: ProjectExperience }) {
  const sample = codeSamples[project.slug];
  return (
    <Frame project={project}>
      {sample && project.featured ? (
        <CodeSwitch
          title={project.title}
          interfaceLayer={<ProjectMockup slug={project.slug} />}
          codeLayer={
            <CodeView file={sample.file} code={sample.code} theme={sample.theme} />
          }
        />
      ) : (
        <div role="img" aria-label={`Interface sketch of ${project.title}`}>
          <ProjectMockup slug={project.slug} />
        </div>
      )}
    </Frame>
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

function Ticks({ lines }: { lines: string[] }) {
  return (
    <ul className="ticks">
      {lines.map((line) => (
        <li key={line}>{line}</li>
      ))}
    </ul>
  );
}

function Refs({ project }: { project: ProjectExperience }) {
  return (
    <div className="refs">
      {project.references.map((reference) => (
        <ReferenceLink
          key={reference.label}
          reference={reference}
          context={project.title}
        />
      ))}
    </div>
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
      className="case rv"
      aria-labelledby={`${project.slug}-title`}
    >
      <Visual project={project} />
      <div className="case-body">
        <p className="case-meta">
          <span className="case-index">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="tag tag-live">Live</span>
        </p>
        <h3 id={`${project.slug}-title`}>{project.title}</h3>
        <p className="case-tagline">{project.tagline}</p>
        <Chips items={project.platforms} />
        <Ticks lines={project.highlights} />
        <p className="stack-line">
          <span className="sr-only">Stack: </span>
          {project.techStack.join(" / ")}
        </p>
        <Refs project={project} />
      </div>
    </article>
  );
}

export function ProjectCard({ project }: { project: ProjectExperience }) {
  return (
    <article
      id={project.slug}
      className="card rv"
      aria-labelledby={`${project.slug}-title`}
    >
      <Visual project={project} />
      <h3 id={`${project.slug}-title`}>{project.title}</h3>
      <p className="card-tagline">{project.tagline}</p>
      <Chips items={project.platforms} />
      <details className="notes">
        <summary>
          <span className="notes-caret" aria-hidden="true" />
          {project.highlights.length} notes
        </summary>
        <Ticks lines={project.highlights} />
      </details>
      <p className="stack-line">
        <span className="sr-only">Stack: </span>
        {project.techStack.join(" / ")}
      </p>
      <Refs project={project} />
    </article>
  );
}
