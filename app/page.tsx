import { ContactIcon } from "./components/ContactIcon";
import { EngineerScene } from "./components/EngineerScene";
import { FeaturedWork } from "./components/FeaturedWork";
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
    detail: "Web interfaces & application architecture",
    skills: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  },
  {
    title: "Backend",
    detail: "Business logic & API integrations",
    skills: ["PHP", "CodeIgniter / HMVC", "Laravel APIs", "FastAPI"],
  },
  {
    title: "Data & AI",
    detail: "Documents, retrieval & applied AI",
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
    detail: "Cross-platform apps & desktop products",
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
        <section id="about" className="hero">
          <div className="hero-grid-background" aria-hidden="true" />
          <div className="shell hero-inner">
            <div className="hero-profile">
              <span className="eyebrow">
                Hemal Herath / Full-Stack Software Engineer
              </span>
              <span className="hero-location">
                <i className="status-dot" aria-hidden="true" /> Based in Sri
                Lanka
              </span>
            </div>
            <div className="hero-visual">
              <EngineerScene />
            </div>
            <div className="hero-copy">
              <h1>
                Web & mobile.
                <br />
                <em>Built end to end.</em>
              </h1>
              <p className="hero-description">
                I build production web and mobile systems—from the interface and
                backend integrations to the release.
              </p>
              <div className="hero-actions">
                <a className="button primary" href="#work">
                  View my work <span aria-hidden="true">↘</span>
                </a>
                <a
                  className="button secondary"
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download CV <span aria-hidden="true">↗</span>
                </a>
                <a className="text-link" href="#contact">
                  Contact <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
            <div className="hero-bottom">
              <a href="#work">
                <span className="eyebrow">01 / Scroll to explore</span>
                <span aria-hidden="true">↓</span>
              </a>
              <span className="hero-model-note">
                Real-time 3D · Drag to rotate
              </span>
              <span className="hero-platforms">
                Google Play · App Store · Web
              </span>
            </div>
          </div>
        </section>
        <section className="intro-section shell" aria-labelledby="intro-title">
          <span className="eyebrow">The work, in context</span>
          <h2 id="intro-title">
            Interfaces. Integrations.
            <br />
            <span>Production releases.</span>
          </h2>
          <p>
            Flutter and Next.js on the front. CodeIgniter and Laravel API
            integrations behind them. Document workflows, applied AI, and real
            deployments—not only source repositories.
          </p>
          <div className="intro-proof">
            <span>Fintech & business systems</span>
            <span>Cross-platform mobile</span>
            <span>Applied AI & documents</span>
          </div>
        </section>
        <section id="production" className="production-section section">
          <div className="shell">
            <SectionHeading
              number="02"
              label="In production"
              title="Live deployments."
              description="Published apps and operational systems. Open the product, not a mockup."
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
                  <i className="status-dot" aria-hidden="true" />
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.platform}</span>
                  </div>
                  <span className="deployment-live">Live</span>
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </div>
        </section>
        <section id="work" className="work-section section shell">
          <SectionHeading
            number="03"
            label="Selected work"
            title="The systems I’ve shipped."
            description="Four larger builds, from financial operations to multi-platform AI and school administration."
          />
          <FeaturedWork
            projects={featured.map(
              ({ slug, title, platforms, tagline, techStack }) => ({
                slug,
                title,
                platforms,
                summary: tagline,
                techStack,
              }),
            )}
            rows={featured.map((project, index) => (
              <ProjectCard key={project.slug} project={project} index={index} />
            ))}
          />
          <div className="more-work-heading">
            <h3>More engineering work.</h3>
            <span className="eyebrow">
              {String(more.length).padStart(2, "0")} projects
            </span>
          </div>
          <div className="secondary-list">
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
        <section id="skills" className="skills-section section">
          <div className="shell">
            <SectionHeading
              number="04"
              label="Technical toolkit"
              title="From client to backend."
              description="The technologies behind the work above, grouped by responsibility."
            />
            <div className="skills-grid">
              {skillGroups.map((group, index) => (
                <article key={group.title}>
                  <span className="eyebrow">0{index + 1} /</span>
                  <h3>{group.title}</h3>
                  <p>{group.detail}</p>
                  <ul>
                    {group.skills.map((skill) => (
                      <li key={skill}>{skill}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section id="extras" className="archive-section section shell">
          <SectionHeading
            number="05"
            label="Additional projects"
            title="The wider collection."
            description="Focused builds and research tools. Different problems, with the same hands-on engineering."
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
                <ReferenceLink
                  reference={project.reference}
                  projectTitle={project.title}
                />
              </article>
            ))}
          </div>
        </section>
        <section id="contact" className="contact-section section">
          <div className="shell">
            <div className="contact-grid">
              <div>
                <span className="eyebrow">06 / Contact</span>
                <h2>
                  Let’s build
                  <br />
                  what’s next.
                </h2>
                <p>
                  Hiring a full-stack engineer or building a product?
                  <br />
                  Let’s talk about the work.
                </p>
                <a className="contact-email" href="mailto:nuwanhemal@gmail.com">
                  nuwanhemal@gmail.com <span aria-hidden="true">↗</span>
                </a>
              </div>
              <div className="contact-details">
                <span className="eyebrow">Get in touch</span>
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
                      <ContactIcon name={link.label} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="footer-wordmark" aria-hidden="true">
              Hemal Herath<span>.</span>
            </div>
            <footer className="footer">
              <span>© {new Date().getFullYear()} Hemal Herath</span>
              <span>Full-Stack Software Engineer · Sri Lanka</span>
              <a href="#about">Back to top ↑</a>
            </footer>
          </div>
        </section>
      </main>
    </>
  );
}
