import Image from "next/image";
import { BranchGraph } from "./components/BranchGraph";
import { ArrowIcon, LinkIcon } from "./components/icons";
import {
  FeaturedCase,
  ProjectCard,
  ReferenceLink,
  SectionHead,
} from "./components/Work";
import {
  additionalProjects,
  marqueeItems,
  navLinks,
  productionDeployments,
  profileLinks,
  releases,
  selectedProjects,
  skillGroups,
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
          <a
            className="button button-small"
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            CV <ArrowIcon />
          </a>
        </div>
      </header>

      <main id="main">
        {/* HEAD */}
        <section id="top" className="hero" aria-labelledby="hero-title">
          <div className="shell hero-grid">
            <div className="hero-copy">
              <div className="commit-head">
                <Image
                  className="avatar"
                  src="/avatar.png"
                  alt="Portrait of Hemal Herath"
                  width={72}
                  height={72}
                  sizes="72px"
                  preload
                />
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
                <a className="button" href={email.href}>
                  Hire me <ArrowIcon direction="right" />
                </a>
                <a className="button button-ghost" href="#work">
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

              <dl className="hero-facts">
                <div>
                  <dt>Live products</dt>
                  <dd>{releases.length}</dd>
                </div>
                <div>
                  <dt>Store & web releases</dt>
                  <dd>{productionDeployments.length}</dd>
                </div>
                <div>
                  <dt>Case studies</dt>
                  <dd>{selectedProjects.length}</dd>
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
            <a className="contact-email" href={email.href}>
              {email.display}
              <ArrowIcon />
            </a>
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
