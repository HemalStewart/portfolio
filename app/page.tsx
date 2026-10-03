import { BranchGraph } from "./components/BranchGraph";
import { CopyButton } from "./components/CopyButton";
import { Magnetic } from "./components/motion/Magnetic";
import { NumberTicker } from "./components/motion/NumberTicker";
import { ScrollProgress } from "./components/motion/ScrollProgress";
import { ArrowIcon, LinkIcon } from "./components/icons";
import {
  FeaturedCase,
  ProjectCard,
  ReferenceLink,
  SectionHead,
} from "./components/Work";
import {
  additionalProjects,
  education,
  experience,
  recognition,
  marqueeItems,
  navLinks,
  productionDeployments,
  profileLinks,
  releases,
  selectedProjects,
  skillGroups,
  totalDownloads,
  formatDownloads,
} from "./data/portfolio";

const email = profileLinks.find((link) => link.label === "Email")!;
const phone = profileLinks.find((link) => link.label === "Phone")!;

export default function Home() {
  const featured = selectedProjects.filter((project) => project.featured);
  const more = selectedProjects.filter((project) => !project.featured);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="site-header">
        <div className="shell header-inner">
          <a className="wordmark" href="#top">
            <span className="wordmark-node" aria-hidden="true" />
            hemal<span className="wordmark-slash">/</span>main
            <span className="sr-only"> — Hemal Herath, back to top</span>
          </a>
          <nav aria-label="Sections" className="nav">
            <ul>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <Magnetic strength={0.25}>
            <a
              className="button button-small"
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              CV <ArrowIcon />
            </a>
          </Magnetic>
        </div>
        <ScrollProgress />
      </header>

      <main id="main">
        {/* HEAD */}
        <section id="top" className="hero" aria-labelledby="hero-title">
          <div className="shell hero-grid">
            <div className="hero-copy">
              <div className="commit-head">
                <span className="monogram" aria-hidden="true">
                  <svg viewBox="0 0 72 72" focusable="false">
                    <path className="monogram-rail" d="M24 8v56" />
                    <path
                      className="monogram-branch"
                      d="M24 52c0-12 24-10 24-22V22"
                    />
                    <circle className="monogram-node" cx="24" cy="12" r="5" />
                    <circle className="monogram-tip" cx="48" cy="20" r="5" />
                    <circle className="monogram-node" cx="24" cy="60" r="5" />
                  </svg>
                </span>
                <dl>
                  <div>
                    <dt>commit</dt>
                    <dd>
                      <span className="tag tag-head">HEAD → main</span>
                      <span className="tag tag-open">open to roles</span>
                    </dd>
                  </div>
                  <div>
                    <dt>Author:</dt>
                    <dd>
                      <span>Hemal Herath</span>
                      <span className="hero-email">
                        &lt;<a href={email.href}>{email.display}</a>&gt;
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt>Where:</dt>
                    <dd>Colombo, Sri Lanka</dd>
                  </div>
                </dl>
              </div>

              <h1 id="hero-title">
                Hemal
                <br />
                Herath
                <span className="h1-cursor" aria-hidden="true" />
              </h1>

              <p className="hero-message">
                Software engineer who <mark>ships to production</mark> — mobile,
                web and applied AI, built end to end from the first screen to
                the store release.
              </p>

              <div className="hero-actions">
                <Magnetic>
                  <a className="button" href={email.href}>
                    Hire me <ArrowIcon direction="right" />
                  </a>
                </Magnetic>
                <Magnetic>
                  <a className="button button-ghost" href="#work">
                    See the work <ArrowIcon direction="down" />
                  </a>
                </Magnetic>
                <a
                  className="text-link"
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download CV <ArrowIcon />
                </a>
              </div>

              <dl className="hero-facts">
                <div>
                  <dt>Live products</dt>
                  <dd>
                    <NumberTicker value={releases.length} />
                  </dd>
                </div>
                <div>
                  <dt>Play Store downloads</dt>
                  <dd>
                    <NumberTicker
                      value={parseInt(formatDownloads(totalDownloads), 10)}
                      suffix={formatDownloads(totalDownloads).replace(
                        /^\d+/,
                        "",
                      )}
                    />
                  </dd>
                </div>
                <div>
                  <dt>Store & web releases</dt>
                  <dd>
                    <NumberTicker value={productionDeployments.length} />
                  </dd>
                </div>
                <div>
                  <dt>First commit</dt>
                  <dd>{experience[experience.length - 1].start.slice(0, 4)}</dd>
                </div>
              </dl>
            </div>

            <BranchGraph />
          </div>
        </section>

        {/* Releases */}
        <section
          id="releases"
          className="section"
          aria-labelledby="releases-title"
        >
          <div className="shell">
            <SectionHead
              id="releases-title"
              command="git tag --list 'live/*'"
              title="Releases."
              description="Products in production right now — on Google Play, the App Store, the web, and Sri Lanka's Ministry of Education. Open the real thing."
            />
            <ol className="release-list">
              {releases.map((release, index) => (
                <li key={release.name} className="release reveal">
                  <span className="release-index" aria-hidden="true">
                    v{String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="release-name">
                    <span className="tag">live</span>
                    <h3>{release.name}</h3>
                    {release.deployments.some((d) => d.downloads) ? (
                      <span className="release-stat">
                        {formatDownloads(
                          release.deployments.reduce(
                            (sum, d) => sum + (d.downloads ?? 0),
                            0,
                          ),
                        )}{" "}
                        downloads
                      </span>
                    ) : null}
                  </div>
                  <ul
                    className="release-links"
                    aria-label={`${release.name} links`}
                  >
                    {release.deployments.map((deployment) => (
                      <li key={deployment.platform}>
                        <a
                          href={deployment.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {deployment.platform}
                          <span className="sr-only">
                            {" "}
                            — open {release.name} (new tab)
                          </span>
                          <ArrowIcon />
                        </a>
                      </li>
                    ))}
                  </ul>
                  <a className="release-case" href={`#${release.project}`}>
                    Case study
                    <span className="sr-only"> for {release.name}</span>
                    <ArrowIcon direction="down" />
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Work */}
        <section id="work" className="section" aria-labelledby="work-title">
          <div className="shell">
            <SectionHead
              id="work-title"
              command="git log --merges --first-parent"
              title="Merged branches."
              description="Four larger builds, from fintech operations to multi-platform AI and school administration — then six more."
            />
            <div className="cases">
              {featured.map((project, index) => (
                <FeaturedCase
                  key={project.slug}
                  project={project}
                  index={index}
                />
              ))}
            </div>
            <h3 className="subhead reveal">
              <code>+{more.length}</code> more engineering work
            </h3>
            <div className="card-grid">
              {more.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </div>
        </section>

        {/* Experience */}
        <section
          id="experience"
          className="section"
          aria-labelledby="experience-title"
        >
          <div className="shell">
            <SectionHead
              id="experience-title"
              command='git log --author="Hemal Herath"'
              title="Experience."
              description="From a Laravel and React internship in 2017 to owning full-stack delivery for government and product clients."
            />
            <div className="experience-grid">
              <ol className="timeline">
                {experience.map((item) => (
                  <li key={item.start} className="timeline-item reveal">
                    <span className="timeline-node" aria-hidden="true" />
                    <p className="timeline-meta">
                      <time dateTime={item.start}>{item.period}</time>
                      {item.current ? (
                        <span className="tag tag-head">HEAD</span>
                      ) : null}
                    </p>
                    <h3>{item.role}</h3>
                    <p className="timeline-org">{item.org}</p>
                    <ul className="timeline-points">
                      {item.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
              <aside
                className="credentials"
                aria-label="Education and recognition"
              >
                <section
                  className="credential reveal"
                  aria-labelledby="education-title"
                >
                  <code className="command">
                    <span aria-hidden="true">$ </span>cat education.md
                  </code>
                  <h3 id="education-title">{education.degree}</h3>
                  <p>{education.school}</p>
                  <p className="credential-period">{education.period}</p>
                </section>
                <section
                  className="credential reveal"
                  aria-labelledby="recognition-title"
                >
                  <code className="command">
                    <span aria-hidden="true">$ </span>git tag --list
                    &apos;award/*&apos;
                  </code>
                  <h3 id="recognition-title">Recognition</h3>
                  <ul className="recognition">
                    {recognition.map((item) => (
                      <li key={item.title}>
                        <strong>{item.title}</strong>
                        <span>
                          {item.detail}
                          {item.year ? ` · ${item.year}` : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              </aside>
            </div>
          </div>
        </section>

        {/* Stack */}
        <section
          id="stack"
          className="section section-tint"
          aria-labelledby="stack-title"
        >
          <div className="shell">
            <SectionHead
              id="stack-title"
              command="cat package.json | jq .dependencies"
              title="The toolchain."
              description="The technologies behind the work above, grouped by responsibility."
            />
            <div className="skill-grid">
              {skillGroups.map((group) => (
                <section
                  key={group.title}
                  className="skill reveal"
                  aria-labelledby={`skill-${group.title}`}
                >
                  <h3 id={`skill-${group.title}`}>{group.title}</h3>
                  <p>{group.detail}</p>
                  <ul>
                    {group.skills.map((skill) => (
                      <li key={skill}>{skill}</li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
          <div className="marquee" aria-label="Technologies">
            <div className="marquee-track">
              {[0, 1].map((copy) => (
                <ul key={copy} aria-hidden={copy === 1 ? true : undefined}>
                  {marqueeItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </section>

        {/* Side branches */}
        <section
          id="side-branches"
          className="section"
          aria-labelledby="side-title"
        >
          <div className="shell">
            <SectionHead
              id="side-title"
              command="git branch --list 'side/*'"
              title="Side branches."
              description="Focused builds and research tools — different problems, same hands-on engineering."
            />
            <ul className="log">
              {additionalProjects.map((project) => (
                <li key={project.title} className="log-row reveal">
                  <code className="log-branch" aria-hidden="true">
                    side/{project.title.toLowerCase().replace(/\s+/g, "-")}
                  </code>
                  <div className="log-main">
                    <h3>{project.title}</h3>
                    <p>{project.tagline}</p>
                  </div>
                  <code className="log-stack">{project.techStack}</code>
                  <ReferenceLink
                    reference={project.reference}
                    context={project.title}
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Contact */}
        <section
          id="contact"
          className="contact"
          aria-labelledby="contact-title"
        >
          <div className="shell">
            <code className="command">
              <span aria-hidden="true">$ </span>gh pr create --base hemal/main
            </code>
            <h2 id="contact-title" className="reveal">
              Open a pull request.
            </h2>
            <p className="contact-lede">
              Hiring a software engineer or building a product? I&apos;m open to
              full-time roles and contract work — let&apos;s talk about what
              you&apos;re shipping.
            </p>
            <div className="contact-email-row">
              <a className="contact-email" href={email.href}>
                {email.display}
                <ArrowIcon />
              </a>
              <CopyButton value={email.display} label="Copy email" />
            </div>
            <ul className="contact-links">
              {profileLinks
                .filter((link) => link.label !== "Email")
                .map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                    >
                      <LinkIcon name={link.label} />
                      <span>
                        <strong>{link.label}</strong>
                        <small>{link.display}</small>
                      </span>
                      <ArrowIcon />
                    </a>
                  </li>
                ))}
            </ul>
          </div>
          <footer className="shell footer">
            <span>© {new Date().getFullYear()} Hemal Herath</span>
            <span>Software engineer · Colombo, Sri Lanka</span>
            <a href={phone.href}>{phone.display}</a>
            <a href="#top">Back to HEAD ↑</a>
          </footer>
        </section>
      </main>
    </>
  );
}
