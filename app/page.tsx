import { Counter } from "./components/Counter";
import { CtaLink } from "./components/CtaLink";
import { GlowCard } from "./components/GlowCard";
import { HeroBackdrop } from "./components/HeroBackdrop";
import { HeroMascot } from "./components/HeroMascot";
import { ExternalArrowIcon } from "./components/icons";
import { ProjectImage } from "./components/ProjectImage";
import { Reveal, RevealGroup, RevealItem } from "./components/Reveal";
import { SectionHeader } from "./components/SectionHeader";
import { TopNav } from "./components/TopNav";

type ExternalReference = {
  label: string;
  href?: string;
  note?: string;
};

type ProjectExperience = {
  slug: string;
  initials: string;
  title: string;
  tagline: string;
  platforms: string[];
  techStack: string[];
  highlights: string[];
  references: ExternalReference[];
  featured?: boolean;
};

type LightProject = {
  title: string;
  tagline: string;
  techStack: string;
  reference: ExternalReference;
};

type ProfileLink = {
  label: string;
  href: string;
  iconSrc: string;
  /** Dark-on-transparent logos (e.g. GitHub) need inverting on the dark theme. */
  invertOnDark?: boolean;
  external?: boolean;
};

type ProductionDeployment = {
  name: string;
  platform: string;
  href?: string;
  note?: string;
};

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Production", href: "#production" },
  { label: "Skills", href: "#skills" },
  { label: "Work", href: "#work" },
  { label: "Projects", href: "#extras" },
  { label: "Contact", href: "#contact" },
];

const marqueeItems = [
  "Flutter",
  "Next.js",
  "TypeScript",
  "FastAPI",
  "CodeIgniter",
  "Laravel",
  "RAG Pipelines",
  "Riverpod",
  "Prisma",
  "Stream Video SDK",
  "Whisper ASR",
  "ML Kit",
];

const profileLinks: ProfileLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/HemalStewart",
    iconSrc: "/icons/github.png",
    invertOnDark: true,
    external: true,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/hemal-herath-24a896131/",
    iconSrc: "/icons/linkedin.png",
    external: true,
  },
  {
    label: "Email",
    href: "mailto:nuwanhemal@gmail.com",
    iconSrc: "/icons/email.png",
  },
  {
    label: "Phone",
    href: "tel:+94718850419",
    iconSrc: "/icons/phone.png",
  },
  {
    label: "CV",
    href: "/resume.pdf",
    iconSrc: "/icons/cv.png",
    external: true,
  },
];

const productionDeployments: ProductionDeployment[] = [
  {
    name: "VibeChat AI",
    platform: "Android",
    href: "https://play.google.com/store/apps/details?id=com.appmixer.vibechatai",
  },
  {
    name: "VibeChat AI",
    platform: "iOS",
    href: "https://apps.apple.com/us/app/vibechat-ai-vibe-your-chat/id6782503745",
  },
  {
    name: "WriteScan",
    platform: "Android",
    href: "https://play.google.com/store/apps/details?id=com.appmixer.writescan",
  },
  {
    name: "ChatSoul AI",
    platform: "Web",
    href: "https://chatsoulai.com/",
  },
  {
    name: "ChatSoul AI",
    platform: "iOS",
    href: "https://apps.apple.com/us/app/chatsoul-ai/id6756913536",
  },
  {
    name: "PDMS",
    platform: "Ministry of Education, Sri Lanka",
    href: "https://pdms.moe.gov.lk/",
  },
  {
    name: "Smart Guardian Pro",
    platform: "Android",
    href: "https://play.google.com/store/apps/details?id=com.bytehub.textrecovery",
  },
  {
    name: "Smart Guardian Pro",
    platform: "iOS",
    href: "https://apps.apple.com/us/app/smart-guardian-family-safety/id6769642500",
  },
];

const coreSkills = [
  {
    group: "Frontend",
    skills: ["Flutter", "Next.js", "React", "TypeScript", "Tailwind CSS"],
  },
  {
    group: "Backend",
    skills: ["PHP · CodeIgniter", "Laravel", "FastAPI", "REST API design", "Auth & RBAC"],
  },
  {
    group: "Data & AI",
    skills: ["SQL schema design", "Prisma", "RAG pipelines", "Embeddings", "OpenAI · Gemini"],
  },
  {
    group: "Mobile & Platform",
    skills: ["Android/iOS via Flutter", "go_router", "Riverpod", "GetX"],
  },
];

// Ordered so LinkForex, ChatSoul/VibeChat, WriteScan, and PDMS (the four
// featured, production-proven builds) lead the section; Huddle stays lower
// in the list as a personal infrastructure build rather than a client product.
const selectedProjects: ProjectExperience[] = [
  {
    slug: "linkforex",
    initials: "LF",
    title: "LinkForex",
    tagline:
      "Admin console, mobile app, and backend for a live fintech remittance operation.",
    platforms: ["Admin", "Mobile", "Backend"],
    techStack: ["Next.js", "TypeScript", "Flutter", "PHP · CodeIgniter"],
    highlights: [
      "Built the admin console end to end: remitters, receivers, transfers, branch access, permissions, and reporting.",
      "Shipped the Flutter mobile app's onboarding, KYC, OTP, beneficiary management, and payment flows.",
      "Maintained the backend service/controller/model structure powering both clients — the largest codebase in this portfolio at 500+ commits.",
    ],
    references: [
      { label: "Admin repo", href: "https://github.com/HemalStewart/linkforex" },
      { label: "Backend repo", href: "https://github.com/HemalStewart/linforex_backend" },
      { label: "Mobile repo", href: "https://github.com/Dilmith-Ranasinghe518/LinkForexApp" },
    ],
    featured: true,
  },
  {
    slug: "chatsoul-ai",
    initials: "CS",
    title: "ChatSoul AI / VibeChat AI",
    tagline:
      "One Flutter codebase shipped to Android, iOS, and Web as an AI companion app.",
    platforms: ["Android", "iOS", "Web"],
    techStack: ["Flutter", "Dart", "CodeIgniter/Laravel APIs"],
    highlights: [
      "Delivered auth, chat, discovery/matching, wallet & subscriptions, and referral flows across all three platforms from a single codebase.",
      "Structured the app into reusable feature, core, and data layers to keep parity across clients.",
      "Live now on Google Play, the App Store, and the web.",
    ],
    references: [
      { label: "Source repo", href: "https://github.com/shehan-077/ChatSoulAi---Flutter" },
      { label: "ChatSoul AI (Web)", href: "https://chatsoulai.com/" },
      { label: "ChatSoul AI (iOS)", href: "https://apps.apple.com/us/app/chatsoul-ai/id6756913536" },
      { label: "VibeChat AI (Android)", href: "https://play.google.com/store/apps/details?id=com.appmixer.vibechatai" },
      { label: "VibeChat AI (iOS)", href: "https://apps.apple.com/us/app/vibechat-ai-vibe-your-chat/id6782503745" },
    ],
    featured: true,
  },
  {
    slug: "writescan",
    initials: "WS",
    title: "WriteScan",
    tagline:
      "AI-powered document scanner and writing assistant, live on Google Play.",
    platforms: ["Android", "iOS"],
    techStack: ["Flutter", "Riverpod", "GoRouter", "ML Kit", "SQLite"],
    highlights: [
      "Built multi-mode scanning — text extraction, handwriting, CSV — with ML Kit and offline-first local storage.",
      "Added AI chat and bot-creation features on top of the scanning workflow.",
      "65 commits of iteration, the most mature Flutter codebase in this portfolio after LinkForex.",
    ],
    references: [
      { label: "Source repo", href: "https://github.com/shehan-077/Write-Scan---Flutter" },
      { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.appmixer.writescan" },
    ],
    featured: true,
  },
  {
    slug: "pdms",
    initials: "PD",
    title: "PDMS",
    tagline:
      "Modular school-operations platform, live at Sri Lanka's Ministry of Education.",
    platforms: ["Web"],
    techStack: ["PHP", "CodeIgniter · HMVC", "MySQL"],
    highlights: [
      "Worked across academic, attendance, exam, HR, accounting, payroll, and library modules in a large HMVC codebase.",
      "Maintained controller, model, routing, and config layers spanning a multi-module system.",
      "In production at pdms.moe.gov.lk.",
    ],
    references: [
      { label: "Live site", href: "https://pdms.moe.gov.lk/" },
      { label: "Repository", note: "Link available on request" },
    ],
    featured: true,
  },
  {
    slug: "smart-guardian-pro",
    initials: "SG",
    title: "Smart Guardian Pro",
    tagline:
      "Personal-safety app with SOS, live location, and group tracking — on Google Play and the App Store.",
    platforms: ["Android", "iOS"],
    techStack: ["Flutter", "Dart", "CodeIgniter/Laravel APIs"],
    highlights: [
      "Built SOS, live-location sharing, and group/\"circle\" safety-network features end to end.",
      "Designed a service-driven architecture separating auth, location, notifications, and session handling.",
      "Shipped and live on Google Play and the App Store.",
    ],
    references: [
      { label: "Source repo", href: "https://github.com/shehan-077/Smart-Guardian-Pro" },
      { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.bytehub.textrecovery" },
      { label: "App Store", href: "https://apps.apple.com/us/app/smart-guardian-family-safety/id6769642500" },
    ],
  },
  {
    slug: "huddle",
    initials: "HU",
    title: "Huddle",
    tagline:
      "Real-time video conferencing platform, built to prove out call infrastructure end to end.",
    platforms: ["Web", "Mobile"],
    techStack: ["Next.js", "TypeScript", "Flutter", "Clerk", "Stream Video SDK"],
    highlights: [
      "Implemented the full meeting lifecycle — instant/scheduled meetings, personal room, recordings, history — on a Next.js web client and a separate Flutter mobile client.",
      "Integrated the Stream Video SDK for real-time call state, plus Clerk auth and route protection on web.",
      "Handled camera/microphone permission flows and lobby-to-call handoff on mobile.",
    ],
    references: [
      { label: "Web repo", href: "https://github.com/HemalStewart/zoom-clone-main" },
      { label: "Mobile", note: "Code available on request" },
    ],
  },
  {
    slug: "scholar-desktop",
    initials: "SD",
    title: "Scholar Desktop",
    tagline:
      "Electron desktop app pairing a reading pane with an AI tutor panel.",
    platforms: ["Desktop"],
    techStack: ["Electron", "Next.js", "React", "TypeScript"],
    highlights: [
      "Built a side-by-side workspace: reader/browser view plus an AI panel for summarize, explain, flashcards, and quiz generation.",
      "Added desktop-native bookmark, history, and settings persistence.",
      "Wired up provider switching between Gemini and OpenAI in the tutor workflow.",
    ],
    references: [
      { label: "Source repo", href: "https://github.com/HemalStewart/edu-ai-browser" },
    ],
  },
  {
    slug: "papermind",
    initials: "PM",
    title: "PaperMind",
    tagline:
      "Multi-provider AI chat app with OCR ingestion and document-grounded context.",
    platforms: ["Web"],
    techStack: ["Next.js", "TypeScript", "Prisma", "OpenAI", "Gemini"],
    highlights: [
      "Built model routing across OpenAI and Gemini behind a single chat interface.",
      "Added OCR ingestion so uploaded documents become live chat context.",
      "Persisted conversations and document context with Prisma.",
    ],
    references: [
      { label: "Source repo", href: "https://github.com/HemalStewart/chat-bot" },
    ],
  },
  {
    slug: "englishmind-ai",
    initials: "EM",
    title: "EnglishMind AI",
    tagline:
      "Spoken-English coach that scores fluency and grammar directly from voice.",
    platforms: ["Web"],
    techStack: ["Next.js", "TypeScript", "FastAPI", "Whisper"],
    highlights: [
      "Built a Whisper ASR to LLM feedback pipeline that grades spoken English against CEFR levels.",
      "Supports both a cloud-API mode and a fully offline, self-hosted mode.",
      "Architected for either lightweight cloud use or on-prem privacy requirements.",
    ],
    references: [{ label: "Source", note: "Code available on request" }],
  },
  {
    slug: "sea-cloud-dalawella",
    initials: "SC",
    title: "Sea Cloud, Dalawella",
    tagline:
      "Marketing site and reservation flow for a boutique hotel in Sri Lanka.",
    platforms: ["Web"],
    techStack: ["Next.js", "TypeScript", "Prisma", "NextAuth", "Leaflet"],
    highlights: [
      "Shipped the public marketing site and a reservation-request flow with map integration.",
      "Scoped the build deliberately: public site first, admin panel and persistence staged for a later phase.",
      "A real client engagement, not a template.",
    ],
    references: [{ label: "Source", note: "Code available on request" }],
  },
];

const additionalProjects: LightProject[] = [
  {
    title: "Recall",
    tagline: "NotebookLM-style research workspace with source-grounded chat and audio overviews.",
    techStack: "Next.js, PDF chunking, embeddings",
    reference: { label: "Details on request", note: "Code available on request" },
  },
  {
    title: "Questly",
    tagline: "Gamified AI learning platform with Phaser-based quiz games and an admin dashboard.",
    techStack: "Next.js, MongoDB, Phaser, OpenAI",
    reference: { label: "Details on request", note: "Code available on request" },
  },
  {
    title: "Retriever",
    tagline: "PDF RAG engine: chunking, embeddings, vector store, retriever/reranker, and chat.",
    techStack: "FastAPI, Next.js",
    reference: { label: "Details on request", note: "Code available on request" },
  },
  {
    title: "ExamVault",
    tagline: "OCR pipeline for extracting and organizing content from scanned exam papers.",
    techStack: "Next.js, Tesseract.js",
    reference: { label: "Details on request", note: "Code available on request" },
  },
  {
    title: "Flicky",
    tagline: "Flutter video-streaming app with a custom player and smooth transitions.",
    techStack: "Flutter, video_player",
    reference: { label: "Source repo", href: "https://github.com/HemalStewart/flicky" },
  },
  {
    title: "Lecturely",
    tagline: "Turns a PDF into a narrated teaching video: script, slides, TTS, and compile.",
    techStack: "FastAPI, React, ffmpeg",
    reference: { label: "Details on request", note: "Code available on request" },
  },
  {
    title: "Backtest Lab",
    tagline: "Small-account crypto strategy research, deliberately kept to paper trading.",
    techStack: "Python",
    reference: { label: "Details on request", note: "Code available on request" },
  },
];

const deliverySnapshot = [
  { value: 25, suffix: "+", label: "Shipped repositories" },
  { value: 700, suffix: "+", label: "Commits logged" },
  { value: 8, suffix: "", label: "Live production apps" },
];

function TechChip({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-border bg-white/5 px-2.5 py-1 font-mono text-[11px] text-slate-300">
      {label}
    </span>
  );
}

function ReferenceLink({ reference }: { reference: ExternalReference }) {
  if (reference.href) {
    return (
      <a
        className="group/ref inline-flex items-center gap-1 font-mono text-xs text-slate-400 underline decoration-white/25 underline-offset-4 transition hover:text-brand-200 hover:decoration-brand-500"
        href={reference.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {reference.label}
        <ExternalArrowIcon className="h-3 w-3 transition group-hover/ref:translate-x-0.5 group-hover/ref:-translate-y-0.5" />
      </a>
    );
  }

  return (
    <span className="font-mono text-xs text-slate-400">
      {reference.label}
      {reference.note ? ` — ${reference.note}` : ""}
    </span>
  );
}

export default function Home() {
  return (
    <>
      <TopNav links={navLinks} profileLinks={profileLinks} />

      <main id="top" className="relative z-10 flex w-full flex-1 flex-col">
        {/* Empty illustrated first screen — content begins below it. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[78svh] overflow-hidden">
          <HeroBackdrop />
        </div>
        <div className="relative h-[62svh] w-full sm:h-[70svh]">
          <HeroMascot />
        </div>

        <div className="mx-auto w-full max-w-[1240px] px-6 md:px-10 xl:px-16">
          <section id="about" className="scroll-mt-24 pt-4">
            <SectionHeader>Full-Stack Software Engineer</SectionHeader>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl">
              Hemal Herath
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-slate-300">
              I build production-style web and mobile platforms end to end —
              Flutter and Next.js on the front, PHP (CodeIgniter/Laravel) and
              FastAPI on the back, with applied AI layered in where it earns
              its place.
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Live on Google Play, the App Store, and Sri Lanka&apos;s Ministry
              of Education — what follows is what I&apos;ve actually shipped,
              not a tech-stack word cloud.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <CtaLink href="#work" variant="primary">
                View work
              </CtaLink>
              <CtaLink href="/resume.pdf" variant="secondary" external>
                Download CV
              </CtaLink>
              <CtaLink href="#contact" variant="ghost">
                Contact →
              </CtaLink>
            </div>

            {/* Marquee */}
            <div className="marquee-fade mt-12 overflow-hidden border-y border-border py-4">
              <div className="marquee-track flex w-max gap-8">
                {[...marqueeItems, ...marqueeItems].map((item, i) => (
                  <span
                    key={`${item}-${i}`}
                    className="flex items-center gap-8 font-mono text-sm text-slate-400"
                  >
                    {item}
                    <span className="text-brand-500" aria-hidden="true">
                      /
                    </span>
                  </span>
                ))}
              </div>
            </div>

            <Reveal>
              <dl className="mt-10 grid grid-cols-3 gap-6">
                {deliverySnapshot.map((item) => (
                  <div key={item.label}>
                    <dt className="text-3xl font-semibold text-white">
                      <Counter value={item.value} suffix={item.suffix} />
                    </dt>
                    <dd className="mt-1 text-xs text-slate-400">{item.label}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </section>

          {/* Production */}
          <section id="production" className="scroll-mt-20 border-t border-border py-16 lg:py-20">
            <Reveal>
              <SectionHeader>In production</SectionHeader>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                Shipped and live — the clearest evidence of delivery.
              </p>
            </Reveal>
            <RevealGroup className="mt-6 grid gap-3 sm:grid-cols-2">
              {productionDeployments.map((deployment) => {
                const content = (
                  <>
                    <span className="flex items-center gap-1.5">
                      <span
                        className="block h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"
                        aria-hidden="true"
                      />
                      <span className="font-mono text-[10px] uppercase tracking-wide text-brand-300">
                        Live
                      </span>
                    </span>
                    <span className="mt-1.5 block text-sm font-medium text-slate-100">
                      {deployment.name}
                    </span>
                    <span className="block text-xs text-slate-400">
                      {deployment.platform}
                    </span>
                  </>
                );
                return (
                  <RevealItem key={`${deployment.name}-${deployment.platform}`}>
                    {deployment.href ? (
                      <a
                        href={deployment.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex min-h-[44px] items-start justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3.5 transition hover:border-brand-400/50 hover:bg-white/[0.04]"
                      >
                        <span>{content}</span>
                        <ExternalArrowIcon className="mt-1 h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-brand-300" />
                      </a>
                    ) : (
                      <div className="flex min-h-[44px] items-start gap-3 rounded-2xl border border-border bg-card px-4 py-3.5 ">
                        {content}
                      </div>
                    )}
                  </RevealItem>
                );
              })}
            </RevealGroup>
          </section>

          {/* Skills */}
          <section id="skills" className="scroll-mt-20 border-t border-border py-16 lg:py-20">
            <Reveal>
              <SectionHeader>Core skills</SectionHeader>
            </Reveal>
            <RevealGroup className="mt-6 grid gap-6 sm:grid-cols-2">
              {coreSkills.map((skill) => (
                <RevealItem key={skill.group}>
                  <p className="text-sm font-medium text-slate-100">{skill.group}</p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {skill.skills.map((s) => (
                      <TechChip key={s} label={s} />
                    ))}
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </section>

          {/* Featured work */}
          <section id="work" className="scroll-mt-20 border-t border-border py-16 lg:py-20">
            <Reveal>
              <SectionHeader>Featured work</SectionHeader>
            </Reveal>
            <div className="mt-6 grid gap-6">
              {selectedProjects.map((project, index) => (
                <GlowCard
                  key={project.title}
                  className="p-6 md:p-7"
                  image={
                    <ProjectImage
                      src={`/projects/${project.slug}.png`}
                      alt={`${project.title} product screenshot`}
                      initials={project.initials}
                    />
                  }
                >
                  <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                    <div>
                      {project.featured && (
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-300">
                          Featured
                        </p>
                      )}
                      <div className="mt-1 flex items-baseline gap-3">
                        <span className="font-mono text-xs text-slate-400">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h3 className="text-xl font-semibold text-white">
                          {project.title}
                        </h3>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {project.platforms.map((platform) => (
                        <span
                          key={platform}
                          className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-slate-400"
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                    {project.tagline}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.techStack.map((tech) => (
                      <TechChip key={tech} label={tech} />
                    ))}
                  </div>

                  <ul className="mt-5 max-w-2xl space-y-2 text-sm leading-6 text-slate-300">
                    {project.highlights.map((item) => (
                      <li key={item} className="flex gap-2.5">
                        <span
                          className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-500"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1.5 border-t border-border pt-4">
                    {project.references.map((reference) => (
                      <ReferenceLink
                        key={`${project.title}-${reference.label}`}
                        reference={reference}
                      />
                    ))}
                  </div>
                </GlowCard>
              ))}
            </div>
          </section>

          {/* Additional projects */}
          <section id="extras" className="scroll-mt-20 border-t border-border py-16 lg:py-20">
            <Reveal>
              <SectionHeader>Additional projects</SectionHeader>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                Smaller or in-progress builds exploring specific problems —
                RAG pipelines, OCR, gamified learning, and media.
              </p>
            </Reveal>
            <RevealGroup className="mt-6 grid gap-3 sm:grid-cols-2">
              {additionalProjects.map((project) => (
                <RevealItem key={project.title}>
                  <div className="rounded-2xl border border-border bg-card px-4 py-3.5 transition hover:border-brand-400/50 hover:bg-white/[0.04]">
                    <p className="text-sm font-medium text-slate-100">{project.title}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-400">{project.tagline}</p>
                    <p className="mt-2 font-mono text-[10px] text-slate-400">
                      {project.techStack}
                    </p>
                    <div className="mt-1.5">
                      <ReferenceLink reference={project.reference} />
                    </div>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </section>

          {/* Contact */}
          <section id="contact" className="scroll-mt-20 border-t border-border py-16 pb-24 lg:py-20">
            <Reveal>
              <SectionHeader>Contact</SectionHeader>
              <p className="mt-4 max-w-md text-3xl font-semibold leading-tight tracking-tight text-white">
                Building something that needs a{" "}
                <span className="text-gradient">full-stack engineer</span>?
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <CtaLink href="mailto:nuwanhemal@gmail.com" variant="primary">
                  nuwanhemal@gmail.com
                </CtaLink>
                <CtaLink href="tel:+94718850419" variant="secondary">
                  +94 71 88 50 419
                </CtaLink>
              </div>
            </Reveal>
          </section>

          <footer className="border-t border-border py-10">
            <p className="font-mono text-[11px] text-slate-400">
              Polgasowita, Kottawa · nuwanhemal@gmail.com
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}
