import type { ExternalReference, ProjectExperience } from "../data/portfolio";

export function SectionHeading({
  number,
  label,
  title,
  description,
}: {
  number: string;
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">
          {number} / {label}
        </span>
        <h2>{title}</h2>
      </div>
      <p>{description}</p>
    </div>
  );
}
export function ReferenceLink({
  reference,
  projectTitle,
}: {
  reference: ExternalReference;
  projectTitle?: string;
}) {
  return reference.href ? (
    <a
      className="reference-link"
      href={reference.href}
      aria-label={
        projectTitle ? `${reference.label} — ${projectTitle}` : undefined
      }
      target="_blank"
      rel="noopener noreferrer"
    >
      {reference.label}
      <span aria-hidden="true">↗</span>
    </a>
  ) : (
    <span className="reference-note">
      {reference.note?.includes("request")
        ? "Code available on request"
        : reference.note || reference.label}
    </span>
  );
}
const categories: Record<string, string> = {
  linkforex: "Fintech / Full-stack system",
  "chatsoul-ai": "Applied AI / Multi-platform",
  writescan: "Documents / Mobile AI",
  pdms: "Education / Enterprise platform",
};
export function ProjectCard({
  project,
  index,
  compact = false,
}: {
  project: ProjectExperience;
  index: number;
  compact?: boolean;
}) {
  return (
    <article
      id={`project-${project.slug}`}
      className={`project project-${project.slug} ${compact ? "project-compact" : "project-featured"}`}
    >
      {compact && (
        <span className="project-number">
          {String(index + 1).padStart(2, "0")}
        </span>
      )}
      <div className="project-copy">
        <span className="eyebrow">
          {categories[project.slug] || project.platforms.join(" / ")}
        </span>
        <h3>{project.title}</h3>
        <p className="project-tagline">{project.tagline}</p>
        <div className="tags">
          {project.techStack.map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
        {compact ? (
          <details className="project-details">
            <summary>
              Delivery details <span aria-hidden="true">+</span>
            </summary>
            <ul>
              {project.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </details>
        ) : (
          <ul className="project-highlights">
            {project.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
        <div className="project-links">
          {project.references.map((reference, i) => (
            <ReferenceLink
              key={`${reference.label}-${i}`}
              reference={reference}
              projectTitle={project.title}
            />
          ))}
        </div>
      </div>
    </article>
  );
}
