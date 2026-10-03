import Image from "next/image";
import { Guide, type GuideStop } from "./components/guide/Guide";
import { CopyButton } from "./components/CopyButton";
import { Magnetic } from "./components/motion/Magnetic";
import { KineticName } from "./components/KineticName";
import { Odometer } from "./components/motion/Odometer";
import { PinnedWork } from "./components/motion/PinnedWork";
import { SiteHeader } from "./components/motion/SiteHeader";
import { ScrubText } from "./components/ScrubText";
import { TypeCommand } from "./components/motion/TypeCommand";
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

const heroChips = [
  "Flutter",
  "Next.js",
  "TypeScript",
  "FastAPI",
  "Laravel",
  "RAG Pipelines",
];

const guideStops: GuideStop[] = [
  {
    id: "top",
    pose: "wave",
    line: "Hi! I'm Commit, Hemal's guide bot. Scroll and I'll show you around.",
  },
  {
    id: "releases",
    pose: "point",
    line: `These ${releases.length} products are live. Open any of them.`,
  },
  {
    id: "work",
    pose: "point",
    line: "Move over a project to X-ray the code underneath.",
  },
  {
    id: "experience",
    pose: "think",
    line: `Writing production code since ${experience[experience.length - 1].start.slice(0, 4)}.`,
  },
  { id: "stack", pose: "idle", line: "The toolchain behind everything above." },
  {
    id: "side-branches",
    pose: "idle",
    line: "Experiments and side projects live here.",
  },
  {
    id: "contact",
    pose: "cheer",
    line: "Ready to merge? Hemal's inbox is open.",
  },
];

export default function Home() {
  const featured = selectedProjects.filter((project) => project.featured);
  const more = selectedProjects.filter((project) => !project.featured);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <SiteHeader links={navLinks} email={email.href} />
      <Guide stops={guideStops} />

      <main id="main">
        {/* HEAD */}
        <section id="top" className="hero" aria-labelledby="hero-title">
          <div className="shell hero-grid">
            <div className="hero-copy">
              <p className="hero-kicker">
                <span className="tag tag-open">open to roles</span>
                <span>Software engineer · Colombo, Sri Lanka</span>
              </p>

              <h1 id="hero-title">
                <span className="sr-only">Hemal Herath, software engineer</span>
                <KineticName lines={["Hemal", "Herath"]} />
              </h1>

              <p className="hero-message">
                I build mobile, web and AI products end to end — and{" "}
                <mark>ship them to real users</mark>:{" "}
                {`${formatDownloads(totalDownloads)} Play Store downloads`}{" "}
                across three apps, and systems running at Sri Lanka&apos;s
                Ministry of Education.
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
            </div>

            <div className="hero-stage" aria-hidden="true">
              <span className="stage-platform" />
              <ul className="stage-chips">
                {heroChips.map((chip, index) => (
                  <li
                    key={chip}
                    style={{ "--i": index } as React.CSSProperties}
                  >
                    {chip}
                  </li>
                ))}
              </ul>
              <Image
                className="stage-poster"
                src="/guide-poster.webp"
                alt=""
                width={520}
                height={520}
                sizes="(max-width: 900px) 320px, 560px"
                loading="eager"
              />
            </div>
          </div>

          <div className="shell hero-strip">
            <dl className="hero-facts">
              <div>
                <dt>Live products</dt>
                <dd>
                  <Odometer value={releases.length} />
                </dd>
              </div>
              <div>
                <dt>Play Store downloads</dt>
                <dd>
                  <Odometer
                    value={parseInt(formatDownloads(totalDownloads), 10)}
                    suffix={formatDownloads(totalDownloads).replace(/^\d+/, "")}
                  />
                </dd>
              </div>
              <div>
                <dt>Store & web releases</dt>
                <dd>
                  <Odometer value={productionDeployments.length} />
                </dd>
              </div>
              <div>
                <dt>First commit</dt>
                <dd>
                  <Odometer
                    value={Number(
                      experience[experience.length - 1].start.slice(0, 4),
                    )}
                  />
                </dd>
              </div>
            </dl>
            <a className="scroll-cue" href="#releases">
              <span>Scroll — the bot will show you around</span>
              <i aria-hidden="true" />
            </a>
          </div>
        </section>

        {/* README */}
        <section className="readme" aria-labelledby="readme-title">
          <div className="shell">
            <h2 id="readme-title" className="sr-only">
              About
            </h2>
            <TypeCommand text="cat README.md" />
            <ScrubText text="I build the whole thing — the interface, the API, the database and the server it runs on — and I own it from the first design to the deployment. Flutter and Next.js up front; CodeIgniter, Laravel, Django and FastAPI behind them. Shipped to Google Play, the App Store, and Sri Lanka's Ministry of Education." />
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
            <PinnedWork titles={featured.map((project) => project.title)}>
              {featured.map((project, index) => (
                <FeaturedCase
                  key={project.slug}
                  project={project}
                  index={index}
                />
              ))}
            </PinnedWork>
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
                  <TypeCommand text="cat education.md" />
                  <h3 id="education-title">{education.degree}</h3>
                  <p>{education.school}</p>
                  <p className="credential-period">{education.period}</p>
                </section>
                <section
                  className="credential reveal"
                  aria-labelledby="recognition-title"
                >
                  <TypeCommand text="git tag --list 'award/*'" />
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
            <TypeCommand text="gh pr create --base hemal/main" />
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
