import { Dock } from "./components/board/Dock";
import { Drag } from "./components/board/Drag";
import { Hero } from "./components/board/Hero";
import { HPan } from "./components/board/HPan";
import { Rulers } from "./components/board/Rulers";
import { Arrow, FrameLabel, Stamp, type Who } from "./components/board/marks";
import { BoardHead } from "./components/board/Section";
import { TopBar } from "./components/board/TopBar";
import { Panels } from "./components/swarm/Panels";
import { Typed } from "./components/swarm/Typed";
import { CopyButton } from "./components/CopyButton";
import { Crafts } from "./components/crafts/Crafts";
import { ArrowIcon, LinkIcon } from "./components/icons";
import { Magnetic } from "./components/motion/Magnetic";
import { Marquee } from "./components/motion/Marquee";
import { Odometer } from "./components/motion/Odometer";
import { PinnedWork } from "./components/motion/PinnedWork";
import { ScrubText } from "./components/ScrubText";
import { countWord, ShowcaseEnd, SitePrint } from "./components/Showcase";
import {
  FeaturedCase,
  ProjectCard,
  ReferenceLink,
} from "./components/Work";
import {
  additionalProjects,
  crafts,
  education,
  experience,
  formatDownloads,
  marqueeItems,
  navLinks,
  productionDeployments,
  profileLinks,
  recognition,
  releases,
  selectedProjects,
  showcaseSites,
  skillGroups,
  totalDownloads,
} from "./data/portfolio";

const email = profileLinks.find((link) => link.label === "Email")!;
const phone = profileLinks.find((link) => link.label === "Phone")!;
const since = experience[experience.length - 1].start.slice(0, 4);
const downloads = formatDownloads(totalDownloads);

const siteBySlug = (slug: string) =>
  showcaseSites.find((site) => site.slug === slug)!;
const host = (href: string) => new URL(href).host.replace(/^www\./, "");

/** The website the Crafts frame builds: a real client homepage. */
const nilaveli = siteBySlug("nilaveli");
const craftSite = {
  name: nilaveli.name,
  host: host(nilaveli.href),
  image: `/showcase/thumbs/${nilaveli.slug}.jpg`,
};

/** Live sites the hero's browser flips through. */
const heroSites = ["nilaveli", "lakmini", "seacloud"].map((slug) => ({
  host: host(siteBySlug(slug).href),
  image: `/showcase/thumbs/${slug}.jpg`,
}));

const chapters = [
  { id: "top", label: "Hello" },
  { id: "about", label: "About" },
  { id: "crafts", label: "Crafts" },
  { id: "work", label: "Work" },
  { id: "showcase", label: "Websites" },
  { id: "experience", label: "Experience" },
  { id: "stack", label: "Stack" },
  { id: "side-projects", label: "Side projects" },
  { id: "contact", label: "Contact" },
];

/** One sticky-note colour and tilt per fact, so the row looks hand-placed. */
const facts: { tone: string; tilt: string; label: string; value: React.ReactNode }[] = [
  {
    tone: "yellow",
    tilt: "-3deg",
    label: "Live products",
    value: <Odometer value={releases.length} />,
  },
  {
    tone: "pink",
    tilt: "2.5deg",
    label: "Play Store downloads",
    value: (
      <Odometer
        value={parseInt(downloads, 10)}
        suffix={downloads.replace(/^\d+/, "")}
      />
    ),
  },
  {
    tone: "mint",
    tilt: "-1.5deg",
    label: "Store & web releases",
    value: <Odometer value={productionDeployments.length} />,
  },
  {
    tone: "blue",
    tilt: "3deg",
    label: "First commit",
    value: <Odometer value={Number(since)} />,
  },
];

const skillWho: Who[] = ["web", "ai", "design", "flutter"];

export default function Home() {
  const featured = selectedProjects.filter((project) => project.featured);
  const more = selectedProjects.filter((project) => !project.featured);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="paper" aria-hidden="true" />
      <TopBar links={navLinks} email={email.href} />
      <Rulers />
      <Dock chapters={chapters} />
      <Panels chapters={chapters} email={email.href} emailLabel={email.display} />

      <main id="main">
        <Hero
          kicker="Designer & developer · Web, Flutter & AI"
          lines={["Hemal", "Herath"]}
          srTitle="Hemal Herath, software engineer — from idea to production"
          tagline={["from idea", "to production."]}
          liveCount={releases.length}
          sites={heroSites}
          message={
            <Typed by="word">
              I design and build websites, web apps and Flutter apps end to end
              — and ship them to real users:{" "}
              <strong>{`${downloads} Play Store downloads`}</strong>
              {" "}across three apps, and systems running at Sri Lanka&apos;s
              Ministry of Education.
            </Typed>
          }
          actions={
            <>
              <Magnetic>
                <a className="btn btn-ink" href={email.href}>
                  Hire me
                </a>
              </Magnetic>
              <a className="text-link" href="#work">
                See the work
              </a>
              <a
                className="text-link"
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download CV <span className="file-tag">PDF</span>
              </a>
            </>
          }
        />

        {/* About */}
        <section id="about" className="bsec about" aria-labelledby="about-title">
          <div className="shell">
            <p className="bhead-label" data-b="pop" data-name="Label" data-by="design">
              <FrameLabel who="design">01 — About</FrameLabel>
            </p>
            <h2 id="about-title" className="sr-only">
              About
            </h2>
            <ScrubText text="I build the *whole* thing — the interface, the API, the database and the server it runs on — and I *own* it from the first design to the deployment. Flutter and Next.js up front; CodeIgniter, Laravel, Django and FastAPI behind them. Shipped to Google Play, the App Store, and Sri Lanka's Ministry of Education." />
            <p className="note about-note" data-who="design" aria-hidden="true">
              <span data-b="pop" data-name="Note">
                go on, move them
              </span>
              <Arrow shape="down" data-b="draw" data-name="Arrow" />
            </p>
            <ul className="facts">
              {facts.map((fact, index) => (
                <li key={fact.label}>
                  <Drag>
                    <div
                      className={`sticky sticky-${fact.tone} fact`}
                      style={{ "--r": fact.tilt } as React.CSSProperties}
                      data-b="drop"
                      data-name={`${fact.label} note`}
                      data-by={skillWho[index % skillWho.length]}
                    >
                      <p className="fact-value">{fact.value}</p>
                      <p className="fact-label">{fact.label}</p>
                    </div>
                  </Drag>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Crafts */}
        <section id="crafts" className="bsec" aria-labelledby="crafts-title">
          <div className="shell">
            <BoardHead
              id="crafts-title"
              index={2}
              label="Crafts"
              who="flutter"
              title={
                <>
                  Design it, build it, <em>ship it.</em>
                </>
              }
              description="Web design, web development, Flutter apps and the backend behind them — one pair of hands, start to finish. Keep scrolling to watch one idea travel from wireframe to production."
              note="one frame, four jobs"
            />
            <Crafts crafts={crafts} site={craftSite} />
          </div>
        </section>

        {/* Work */}
        <section id="work" className="bsec" aria-labelledby="work-title">
          <div className="shell">
            <BoardHead
              id="work-title"
              index={3}
              label="Work"
              who="web"
              title={
                <>
                  Shipped &amp; <em>live.</em>
                </>
              }
              description="Products in production right now — on Google Play, the App Store, the web, and Sri Lanka's Ministry of Education. Open the real thing."
              note="every one is a real link"
            />

            <ol id="releases" className="ships" data-b="rows" data-name="Shipped list">
              {releases.map((release, index) => (
                <li key={release.name} className="ship" data-row="">
                  <span className="ship-index" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="ship-name">
                    <h3>{release.name}</h3>
                    {release.deployments.some((d) => d.downloads) ? (
                      <span className="ship-stat">
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
                  <ul className="ship-links" aria-label={`${release.name} links`}>
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
                  {release.project ? (
                    <a className="ship-case" href={`#${release.project}`}>
                      Case study
                      <span className="sr-only"> for {release.name}</span>
                      <ArrowIcon direction="down" />
                    </a>
                  ) : (
                    <a className="ship-case" href="#showcase">
                      On the wall
                      <span className="sr-only">: {release.name} in Websites</span>
                      <ArrowIcon direction="down" />
                    </a>
                  )}
                </li>
              ))}
            </ol>

            <h3 className="subhead" data-b="type" data-name="Subhead">
              <span className="sr-only">Four builds, up close.</span>
              <span aria-hidden="true">
                <Typed>
                  Four builds, <em>up close.</em>
                </Typed>
              </span>
            </h3>
            <PinnedWork titles={featured.map((project) => project.title)}>
              {featured.map((project, index) => (
                <FeaturedCase key={project.slug} project={project} index={index} />
              ))}
            </PinnedWork>

            <h3 className="subhead" data-b="type" data-name="Subhead">
              <span className="sr-only">{`And ${countWord(more.length)} more.`}</span>
              <span aria-hidden="true">
                <Typed>
                  And {countWord(more.length)} <em>more.</em>
                </Typed>
              </span>
            </h3>
            <div className="card-grid">
              {more.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </div>
        </section>

        {/* Websites */}
        <section id="showcase" className="bsec" aria-labelledby="showcase-title">
          <div className="shell">
            <BoardHead
              id="showcase-title"
              index={4}
              label="Websites"
              who="design"
              title={
                <>
                  Websites worth <em>exploring.</em>
                </>
              }
              description="Client builds, live sites, storefront previews, cinematic concepts and interactive scroll stories. Keep scrolling to pan along the wall, then open any of them."
              note={`${showcaseSites.length} pinned up`}
            />
          </div>
          <HPan label="Websites">
            {showcaseSites.map((site, index) => (
              <SitePrint key={site.slug} site={site} index={index} />
            ))}
            <ShowcaseEnd />
          </HPan>
        </section>

        {/* Experience */}
        <section
          id="experience"
          className="bsec"
          aria-labelledby="experience-title"
        >
          <div className="shell">
            <BoardHead
              id="experience-title"
              index={5}
              label="Experience"
              who="ai"
              title={
                <>
                  Since <em>{since}.</em>
                </>
              }
              description="From a Laravel and React internship to owning full-stack delivery for government and product clients."
            />
            <div className="experience-grid">
              <ol className="timeline" data-b="rows" data-name="Timeline">
                {experience.map((item) => (
                  <li key={item.start} className="timeline-item" data-row="">
                    <span className="timeline-node" aria-hidden="true" />
                    <p className="timeline-meta">
                      <time dateTime={item.start}>{item.period}</time>
                      {item.current ? <span className="tag tag-live">Now</span> : null}
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
              <aside className="credentials" aria-label="Education and recognition">
                <section
                  className="index-card"
                  style={{ "--r": "1.2deg" } as React.CSSProperties}
                  aria-labelledby="education-title"
                  data-b="drop"
                  data-name="Education card"
                >
                  <p className="index-card-kicker">Education</p>
                  <h3 id="education-title">{education.degree}</h3>
                  <p>{education.school}</p>
                  <p className="index-card-meta">{education.period}</p>
                </section>
                <section
                  className="index-card"
                  style={{ "--r": "-1deg" } as React.CSSProperties}
                  aria-labelledby="recognition-title"
                  data-b="drop"
                  data-name="Recognition card"
                >
                  <p className="index-card-kicker">Recognition</p>
                  <h3 id="recognition-title" className="sr-only">
                    Recognition
                  </h3>
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
        <section id="stack" className="bsec" aria-labelledby="stack-title">
          <div className="shell">
            <BoardHead
              id="stack-title"
              index={6}
              label="Stack"
              who="flutter"
              title={
                <>
                  The <em>toolkit.</em>
                </>
              }
              description="The technologies behind the work above, grouped by what they are for."
            />
            <div className="skill-grid">
              {skillGroups.map((group, index) => (
                <section
                  key={group.title}
                  className="cset"
                  data-who={skillWho[index % skillWho.length]}
                  aria-labelledby={`skill-${index}`}
                  data-b="frame"
                  data-name={group.title}
                  data-by={skillWho[index % skillWho.length]}
                >
                  <h3 id={`skill-${index}`}>
                    <i aria-hidden="true" />
                    {group.title}
                  </h3>
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
          <Marquee items={marqueeItems} />
        </section>

        {/* Side projects */}
        <section
          id="side-projects"
          className="bsec"
          aria-labelledby="side-title"
        >
          <div className="shell">
            <BoardHead
              id="side-title"
              index={7}
              label="Side projects"
              who="ai"
              title={
                <>
                  On the <em>side.</em>
                </>
              }
              description="Focused builds and research tools — different problems, same hands-on engineering."
            />
            <ul className="layers" data-b="rows" data-name="Side projects">
              {additionalProjects.map((project) => (
                <li key={project.title} className="layer" data-row="">
                  <span className="layer-icon" aria-hidden="true" />
                  <div className="layer-main">
                    <h3>{project.title}</h3>
                    <p>{project.tagline}</p>
                  </div>
                  <code className="layer-stack">{project.techStack}</code>
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
        <section id="contact" className="contact" aria-labelledby="contact-title">
          <div className="shell">
            <div className="contact-frame" data-scene="" data-gather="">
              <p className="bhead-label" data-b="pop" data-name="Label" data-by="web">
                <FrameLabel who="web">08 — Contact</FrameLabel>
              </p>
              <h2
                id="contact-title"
                className="contact-title"
                data-b="type"
                data-name="Title"
                data-by="web"
              >
                <span className="sr-only">Let&apos;s build yours.</span>
                <span aria-hidden="true">
                  <Typed>
                    Let&apos;s build <em>yours.</em>
                  </Typed>
                </span>
              </h2>
              <p className="contact-lede" data-b="words" data-name="Lede" data-w="1">
                <Typed by="word">
                  Hiring a software engineer or building a product? I&apos;m open
                  to full-time roles and contract work — let&apos;s talk about
                  what you&apos;re shipping.
                </Typed>
              </p>
              <div className="contact-email-row" data-b="pop" data-name="Email" data-w="2">
                <a className="contact-email" href={email.href}>
                  {email.display}
                  <ArrowIcon />
                </a>
                <CopyButton value={email.display} label="Copy email" />
              </div>
              <Stamp className="contact-stamp" data-b="pop" data-name="Stamp" data-w="3">
                Open to work
              </Stamp>
            </div>
            <ul className="contact-links" data-b="rows" data-name="Links">
              {profileLinks
                .filter((link) => link.label !== "Email")
                .map((link) => (
                  <li key={link.label} data-row="">
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
              <a href="#top">Back to the top ↑</a>
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
