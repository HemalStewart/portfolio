import { Boot } from "./components/chrome/Boot";
import { ChapterRail } from "./components/chrome/ChapterRail";
import { CopyButton } from "./components/CopyButton";
import { VoxelField, type FieldStop } from "./components/field/VoxelField";
import { Magnetic } from "./components/motion/Magnetic";
import { KineticName } from "./components/KineticName";
import { Odometer } from "./components/motion/Odometer";
import { PinnedWork } from "./components/motion/PinnedWork";
import { SiteHeader } from "./components/motion/SiteHeader";
import { ScrubText } from "./components/ScrubText";
import {
  NextSiteCard,
  ShowcaseFeature,
  SiteCard,
} from "./components/Showcase";
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
  showcaseSites,
  skillGroups,
  totalDownloads,
  formatDownloads,
} from "./data/portfolio";

const email = profileLinks.find((link) => link.label === "Email")!;
const phone = profileLinks.find((link) => link.label === "Phone")!;

/**
 * The voxel field's mood per section: the git-branch glyph in the hero,
 * particles behind long copy, a planet beside the websites, a rolling wave
 * under experience and stack, and the glyph again at the end — merged.
 */
const fieldStops: FieldStop[] = [
  {
    id: "top",
    mood: {
      form: "branch",
      x: 0.5,
      y: -0.02,
      scale: 0.8,
      opacity: 1,
      narrow: { x: 0, y: 0.5, scale: 0.66 },
    },
  },
  { id: "about", mood: { form: "scatter", x: 0, y: 0, scale: 1, opacity: 0.7 } },
  {
    id: "releases",
    mood: { form: "scatter", x: 0, y: 0, scale: 1, opacity: 0.45 },
  },
  { id: "work", mood: { form: "scatter", x: 0, y: 0, scale: 1, opacity: 0.3 } },
  {
    id: "showcase",
    mood: {
      form: "sphere",
      x: 0.68,
      y: -0.22,
      scale: 0.85,
      opacity: 0.55,
      narrow: { x: 0.35, y: 0.45, opacity: 0.35 },
    },
  },
  // The planet steps back once the site cards fill the screen.
  {
    id: "showcase-sites",
    mood: { form: "scatter", x: 0, y: 0, scale: 1, opacity: 0.3 },
  },
  {
    id: "experience",
    mood: { form: "wave", x: 0, y: -1, scale: 1, opacity: 0.35, tilt: 0.7 },
  },
  {
    id: "stack",
    mood: { form: "wave", x: 0, y: -1.05, scale: 1, opacity: 0.45, tilt: 0.85 },
  },
  {
    id: "side-branches",
    mood: { form: "scatter", x: 0, y: 0, scale: 1, opacity: 0.35 },
  },
  {
    id: "contact",
    mood: {
      form: "branch",
      x: 0.66,
      y: 0.12,
      scale: 0.62,
      opacity: 0.85,
      narrow: { x: 0, y: 0.5, scale: 0.6, opacity: 0.45 },
    },
  },
];

const chapters = [
  { id: "top", label: "Intro" },
  { id: "about", label: "About" },
  ...navLinks.map((link) => ({ id: link.href.slice(1), label: link.label })),
];

export default function Home() {
  const featured = selectedProjects.filter((project) => project.featured);
  const more = selectedProjects.filter((project) => !project.featured);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Boot />
      <div className="backdrop" aria-hidden="true">
        <div className="shell backdrop-cols">
          {[0, 1, 2, 3, 4, 5].map((col) => (
            <i key={col} />
          ))}
        </div>
      </div>
      <VoxelField stops={fieldStops} />
      <SiteHeader links={navLinks} email={email.href} />
      <ChapterRail chapters={chapters} />

      <main id="main">
        {/* HEAD */}
        <section id="top" className="hero" aria-labelledby="hero-title">
          <div className="shell hero-inner">
            <p className="hero-kicker">
              <span className="kicker-square" aria-hidden="true" />
              Software engineer · Mobile, web &amp; AI · Since{" "}
              {experience[experience.length - 1].start.slice(0, 4)}
            </p>

            <h1 id="hero-title" className="hero-title">
              <span className="sr-only">
                Hemal Herath, software engineer — from idea to production
              </span>
              <KineticName lines={["Hemal", "Herath"]} />
              <span className="hero-italic" aria-hidden="true">
                <span>from idea to production.</span>
              </span>
            </h1>

            <div className="hero-foot">
              <p className="hero-message">
                I build mobile, web and AI products end to end — and ship them
                to real users:{" "}
                <strong>
                  {`${formatDownloads(totalDownloads)} Play Store downloads`}
                </strong>{" "}
                across three apps, and systems running at Sri Lanka&apos;s
                Ministry of Education.
              </p>

              <div className="hero-actions">
                <Magnetic>
                  <a className="button button-accent" href={email.href}>
                    Hire me
                    <span className="button-arrow" aria-hidden="true">
                      <ArrowIcon direction="right" />
                    </span>
                  </a>
                </Magnetic>
                <a className="text-link" href="#work">
                  See the work <ArrowIcon direction="down" />
                </a>
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
          </div>

          <div className="hero-strip">
            <div className="shell hero-strip-row">
              <span>Colombo, Sri Lanka</span>
              <span className="hero-coords">6.9271° N — 79.8612° E</span>
              <a className="scroll-cue" href="#about">
                <i aria-hidden="true" />
                Scroll to explore
              </a>
              <span className="hero-open">
                <span className="pulse" aria-hidden="true" />
                Open to roles &amp; contracts
              </span>
            </div>
          </div>
        </section>

        {/* README */}
        <section id="about" className="readme" aria-labelledby="readme-title">
          <div className="shell">
            <p className="eyebrow">
              <span className="eyebrow-index">(01)</span>
              <span className="eyebrow-label">About</span>
              <TypeCommand text="cat README.md" />
            </p>
            <h2 id="readme-title" className="sr-only">
              About
            </h2>
            <ScrubText text="I build the *whole* thing — the interface, the API, the database and the server it runs on — and I *own* it from the first design to the deployment. Flutter and Next.js up front; CodeIgniter, Laravel, Django and FastAPI behind them. Shipped to Google Play, the App Store, and Sri Lanka's Ministry of Education." />
            <dl className="facts">
              <div className="reveal">
                <dt>Live products</dt>
                <dd>
                  <Odometer value={releases.length} />
                </dd>
              </div>
              <div className="reveal">
                <dt>Play Store downloads</dt>
                <dd>
                  <Odometer
                    value={parseInt(formatDownloads(totalDownloads), 10)}
                    suffix={formatDownloads(totalDownloads).replace(/^\d+/, "")}
                  />
                </dd>
              </div>
              <div className="reveal">
                <dt>Store &amp; web releases</dt>
                <dd>
                  <Odometer value={productionDeployments.length} />
                </dd>
              </div>
              <div className="reveal">
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
              index={2}
              label="Releases"
              command="git tag --list 'live/*'"
              title={
                <>
                  Shipped &amp; <em>live.</em>
                </>
              }
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
              index={3}
              label="Selected work"
              command="git log --merges --first-parent"
              title={
                <>
                  Merged <em>branches.</em>
                </>
              }
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
              <code>+{more.length}</code> more engineering <em>work</em>
            </h3>
            <div className="card-grid">
              {more.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </div>
        </section>

        {/* Web showcase */}
        <section
          id="showcase"
          className="section"
          aria-labelledby="showcase-title"
        >
          <div className="shell">
            <SectionHead
              id="showcase-title"
              index={4}
              label="Websites"
              command="git checkout web/showcase"
              title={
                <>
                  Websites worth <em>exploring.</em>
                </>
              }
              description="Explore the Nilaveli Beach Resort project, Lakmini International’s live website, the Ceylon Select storefront preview, cinematic concepts and interactive scroll stories. Open a project below, or fly through the collection in 3D."
            />
            <ShowcaseFeature />
            <div id="showcase-sites" className="site-grid">
              {showcaseSites.map((site) => (
                <SiteCard key={site.slug} site={site} />
              ))}
              <NextSiteCard />
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
              index={5}
              label="Experience"
              command='git log --author="Hemal Herath"'
              title={
                <>
                  The commit <em>log.</em>
                </>
              }
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
          className="section"
          aria-labelledby="stack-title"
        >
          <div className="shell">
            <SectionHead
              id="stack-title"
              index={6}
              label="Stack"
              command="cat package.json | jq .dependencies"
              title={
                <>
                  The <em>toolchain.</em>
                </>
              }
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
                  {marqueeItems.map((item, index) => (
                    <li
                      key={item}
                      className={index % 2 ? "marquee-outline" : undefined}
                    >
                      {item}
                    </li>
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
              index={7}
              label="Side projects"
              command="git branch --list 'side/*'"
              title={
                <>
                  Side <em>branches.</em>
                </>
              }
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
            <p className="eyebrow">
              <span className="eyebrow-index">(08)</span>
              <span className="eyebrow-label">Contact</span>
              <TypeCommand text="gh pr create --base hemal/main" />
            </p>
            <h2 id="contact-title" className="contact-title">
              Open a <em>pull request.</em>
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
          <footer className="footer">
            <div className="shell footer-row">
              <span>© {new Date().getFullYear()} Hemal Herath</span>
              <span>Software engineer · Colombo, Sri Lanka</span>
              <a href={phone.href}>{phone.display}</a>
              <a href="#top">Back to HEAD ↑</a>
            </div>
            <p className="footer-mark" aria-hidden="true">
              Hemal Herath
            </p>
          </footer>
        </section>
      </main>
    </>
  );
}
