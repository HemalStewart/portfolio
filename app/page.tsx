import Image from "next/image";
import { TopNav } from "./components/TopNav";
import {
  ProjectCard,
  ReferenceLink,
  SectionHeading,
} from "./components/Portfolio";
import {
  additionalProjects,
  productionDeployments,
  profileLinks,
  selectedProjects,
} from "./data/portfolio";

const navigation = [
  { label: "About", href: "#about" },
  { label: "Production", href: "#production" },
  { label: "Work", href: "#work" },
  { label: "Skills", href: "#skills" },
  { label: "Archive", href: "#extras" },
  { label: "Contact", href: "#contact" },
];
const skillGroups = [
  {
    title: "Frontend",
    detail: "Interfaces that feel considered.",
    skills: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  },
  {
    title: "Backend",
    detail: "The systems behind the experience.",
    skills: ["PHP", "CodeIgniter / HMVC", "Laravel APIs", "FastAPI"],
  },
  {
    title: "Data & AI",
    detail: "Useful intelligence, not decoration.",
    skills: [
      "Prisma",
      "MySQL",
      "SQLite",
      "OpenAI / Gemini",
      "RAG",
      "Whisper",
      "ML Kit",
    ],
  },
  {
    title: "Mobile & Platform",
    detail: "One product, across platforms.",
    skills: [
      "Flutter",
      "Dart",
      "Riverpod",
      "GoRouter",
      "Electron",
      "Stream Video SDK",
    ],
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
      <TopNav links={navigation} profileLinks={profileLinks} />
      <main id="main">
        <section id="about" className="hero shell">
          <div className="hero-topline">
            <span className="eyebrow">Software engineering · Sri Lanka</span>
            <span className="eyebrow hero-edition">
              Web / Mobile / Applied AI
            </span>
          </div>
          <div className="hero-grid">
            <div className="hero-copy">
              <div className="intro-person">
                <Image
                  src="/avatar.png"
                  width={52}
                  height={52}
                  alt="Hemal Herath"
                />
                <span>
                  Hello, I’m Hemal.
                  <br />
                  <small>Full-Stack Software Engineer</small>
                </span>
              </div>
              <h1>
                Hemal Herath
                <span>
                  Thoughtfully built.
                  <br />
                  <em>Ready for the real world.</em>
                </span>
              </h1>
              <p className="hero-description">
                I build web and mobile systems end to end. From the first
                interface to the backend behind it—and the release that puts it
                in people’s hands.
              </p>
              <div className="hero-actions">
                <a className="button primary" href="#work">
                  Explore my work <span aria-hidden="true">↘</span>
                </a>
                <a
                  className="button secondary"
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download CV <span aria-hidden="true">↗</span>
                </a>
                <a className="hero-contact" href="#contact">
                  Contact me ↗
                </a>
              </div>
              <div className="hero-proof">
                <span className="status-dot" />
                <span>
                  Deployed on Google Play, the App Store,
                  <br /> and Sri Lanka’s Ministry of Education platform.
                </span>
              </div>
            </div>
            <a
              className="hero-showcase"
              href="#project-linkforex"
              aria-label="Explore LinkForex, my featured fintech project"
            >
              <div className="showcase-heading">
                <span className="eyebrow">Featured system / 01</span>
                <span aria-hidden="true">↗</span>
              </div>
              <div className="showcase-title">
                From interface
                <br />
                to infrastructure.
              </div>
              <div className="hero-screen">
                <Image
                  src="/projects/linkforex.png"
                  alt="Illustrative preview of the LinkForex administration interface"
                  fill
                  sizes="(max-width: 650px) 90vw, 48vw"
                  preload
                />
              </div>
              <div className="system-path" aria-hidden="true">
                <span>Web console</span>
                <i>→</i>
                <span>Backend</span>
                <i>→</i>
                <span>Mobile app</span>
              </div>
              <div className="showcase-foot">
                <div>
                  <strong>LinkForex</strong>
                  <span>Fintech remittance ecosystem</span>
                </div>
                <span className="circle-arrow" aria-hidden="true">
                  ↗
                </span>
              </div>
            </a>
          </div>
          <div className="hero-bottom">
            <span className="eyebrow">Selected work, real delivery</span>
            <a href="#work">
              Scroll to explore <span aria-hidden="true">↓</span>
            </a>
            <span className="eyebrow">
              Built with care. Shipped with intent.
            </span>
          </div>
        </section>
        <section id="production" className="production-section">
          <div className="shell">
            <SectionHeading
              number="01"
              label="In production"
              title="Not just a repository."
              description="Products you can open, download, and use. These are the live deployments behind the work."
            />
            <div className="deployment-grid">
              {productionDeployments.map((item) => (
                <a
                  key={`${item.name}-${item.platform}`}
                  className="deployment"
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="deployment-platform">{item.platform}</span>
                  <strong>{item.name}</strong>
                  <span className="deployment-bottom">
                    <span>
                      <i className="status-dot" />
                      Live deployment
                    </span>
                    <span aria-hidden="true">↗</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
        <section id="work" className="work-section shell">
          <SectionHeading
            number="02"
            label="Selected work"
            title="Different products. Same care."
            description="Fintech, mobile AI, document workflows, and education systems. A closer look at what I delivered and how it was built."
          />
          <p className="preview-note">
            Project imagery is illustrative. Live links and source references
            are provided with each project.
          </p>
          <div className="featured-list">
            {featured.map((project, index) => (
              <ProjectCard key={project.slug} project={project} index={index} />
            ))}
          </div>
          <div className="more-work-heading">
            <h3>More systems, more surfaces.</h3>
            <span className="eyebrow">
              {String(more.length).padStart(2, "0")} further builds
            </span>
          </div>
          <div className="secondary-grid">
            {more.map((project, index) => (
              <ProjectCard
                key={project.slug}
                project={project}
                index={index + featured.length}
                compact
              />
            ))}
          </div>
        </section>
        <section id="skills" className="skills-section">
          <div className="shell">
            <SectionHeading
              number="03"
              label="How I build"
              title="Across the entire stack."
              description="Flutter and Next.js on the front. CodeIgniter, Laravel API integrations, and FastAPI behind them. Applied AI where it earns its place."
            />
            <div className="skills-grid">
              {skillGroups.map((group, index) => (
                <article key={group.title}>
                  <span className="eyebrow">0{index + 1} /</span>
                  <h3>{group.title}</h3>
                  <p>{group.detail}</p>
                  <div className="tags">
                    {group.skills.map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section id="extras" className="archive-section shell">
          <SectionHeading
            number="04"
            label="Project archive"
            title="A little further down the rabbit hole."
            description="Research tools, learning experiments, and focused builds. Every one explores a different engineering problem."
          />
          <div className="archive-list">
            {additionalProjects.map((project, index) => (
              <article key={project.title} className="archive-row">
                <span className="archive-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{project.title}</h3>
                  <p>{project.tagline}</p>
                  <span className="archive-stack">{project.techStack}</span>
                </div>
                <ReferenceLink reference={project.reference} />
              </article>
            ))}
          </div>
        </section>
        <section id="contact" className="contact-section">
          <div className="shell contact-grid">
            <div>
              <span className="eyebrow">05 / Start a conversation</span>
              <h2>
                Good work starts
                <br />
                with a <em>hello.</em>
              </h2>
              <p>
                Hiring a software engineer or building a product?
                <br />
                Let’s talk about what you have in mind.
              </p>
              <a className="contact-email" href="mailto:nuwanhemal@gmail.com">
                nuwanhemal@gmail.com <span aria-hidden="true">↗</span>
              </a>
            </div>
            <div className="contact-details">
              <Image
                src="/avatar.png"
                alt="Hemal Herath"
                width={110}
                height={110}
              />
              <strong>Hemal Herath</strong>
              <span>Full-Stack Software Engineer</span>
              <span>Polgasowita, Kottawa · Sri Lanka</span>
              <a href="tel:+94718850419">+94 71 885 0419</a>
              <div className="social-links">
                {profileLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    aria-label={link.label}
                    title={link.label}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                  >
                    <Image src={link.iconSrc} width={23} height={23} alt="" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="shell footer">
        <span>© {new Date().getFullYear()} Hemal Herath</span>
        <span>Designed with intention. Engineered end to end.</span>
        <a href="#about">Back to top ↑</a>
      </footer>
    </>
  );
}
