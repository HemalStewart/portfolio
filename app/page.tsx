import Image from "next/image";

type ExternalReference = {
  label: string;
  href?: string;
  note?: string;
};

type ProjectExperience = {
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
  { label: "Extras", href: "#extras" },
  { label: "Contact", href: "#contact" },
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

const selectedProjects: ProjectExperience[] = [
  {
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
      { label: "Web", href: "https://chatsoulai.com/" },
      { label: "Android", href: "https://play.google.com/store/apps/details?id=com.appmixer.vibechatai" },
      { label: "iOS", href: "https://apps.apple.com/us/app/chatsoul-ai/id6756913536" },
    ],
    featured: true,
  },
  {
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
    title: "Smart Guardian Pro",
    tagline:
      "Personal-safety app with SOS, live location, and group tracking — on Google Play.",
    platforms: ["Android"],
    techStack: ["Flutter", "Dart", "CodeIgniter/Laravel APIs"],
    highlights: [
      "Built SOS, live-location sharing, and group/\"circle\" safety-network features end to end.",
      "Designed a service-driven architecture separating auth, location, notifications, and session handling.",
      "Shipped and live on Google Play.",
    ],
    references: [
      { label: "Source repo", href: "https://github.com/shehan-077/Smart-Guardian-Pro" },
      { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.bytehub.textrecovery" },
    ],
  },
  {
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
  { label: "Active building window", value: "Aug 2025 – present" },
  { label: "Shipped repositories", value: "25+" },
  { label: "Commit volume", value: "700+" },
];

function TechChip({ label }: { label: string }) {
  return (
    <span className="rounded-md bg-white/[0.04] px-2 py-1 font-mono text-[11px] text-slate-400">
      {label}
    </span>
  );
}

function renderReference(reference: ExternalReference) {
  if (reference.href) {
    return (
      <a
        className="inline-flex items-center gap-1 font-mono text-xs text-slate-400 transition hover:text-brand-300"
        href={reference.href}
        target="_blank"
        rel="noreferrer noopener"
      >
        {reference.label}
        <span className="transition group-hover:translate-x-0.5">→</span>
      </a>
    );
  }

  return (
    <span className="font-mono text-xs text-slate-600">
      {reference.label}
      {reference.note ? ` — ${reference.note}` : ""}
    </span>
  );
}

export default function Home() {
  return (
    <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 md:px-10">
      <div className="lg:grid lg:grid-cols-[300px_1fr] lg:gap-16">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-between lg:py-20">
          <div className="pt-16 lg:pt-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand-500/30 bg-brand-500/10 font-mono text-sm font-medium text-brand-300">
              HH
            </div>
            <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-100">
              Hemal Herath
            </h1>
            <p className="mt-2 text-base text-brand-300">
              Full-Stack Software Engineer
            </p>
            <p className="mt-5 max-w-xs text-sm leading-6 text-slate-400">
              I build production-style web and mobile platforms end to end —
              what I&apos;ve actually shipped, not a tech-stack word cloud.
            </p>

            <nav className="mt-10 hidden lg:block">
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="group flex items-center gap-3 text-xs font-medium uppercase tracking-[0.15em] text-slate-500 transition hover:text-slate-100"
                    >
                      <span className="h-px w-6 bg-slate-700 transition group-hover:w-10 group-hover:bg-brand-400" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="mt-10 lg:mt-0">
            <div className="flex flex-wrap items-center gap-4">
              {profileLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noreferrer noopener" : undefined}
                  aria-label={link.label}
                  title={link.label}
                  className="group"
                >
                  <Image
                    src={link.iconSrc}
                    alt=""
                    width={20}
                    height={20}
                    className={`h-5 w-5 object-contain opacity-60 transition group-hover:-translate-y-0.5 group-hover:opacity-100 ${
                      link.invertOnDark ? "invert" : ""
                    }`}
                  />
                </a>
              ))}
            </div>
            <p className="mt-4 font-mono text-[11px] text-slate-600">
              Polgasowita, Kottawa
              <br />
              nuwanhemal@gmail.com
            </p>
          </div>
        </aside>

        {/* Content */}
        <div className="min-w-0 py-16 lg:py-20">
          <section id="about" className="scroll-mt-10">
            <p className="max-w-xl text-[15px] leading-7 text-slate-300">
              Flutter and Next.js on the front, PHP (CodeIgniter/Laravel) and
              FastAPI on the back, with applied AI — RAG, LLM routing, voice —
              layered in where it earns its place. I ship complete systems:
              admin consoles, mobile clients, and the backends underneath
              them.
            </p>

            <dl className="mt-10 grid grid-cols-3 gap-6 border-y border-border py-6">
              {deliverySnapshot.map((item) => (
                <div key={item.label}>
                  <dt className="text-2xl font-semibold text-slate-100 md:text-3xl">
                    {item.value}
                  </dt>
                  <dd className="mt-1 text-xs text-slate-500">{item.label}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section id="production" className="mt-20 scroll-mt-10">
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">
              In production
            </h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {productionDeployments.map((deployment) => {
                const content = (
                  <>
                    <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400 shadow-[0_0_8px_rgba(14,159,150,0.8)]" />
                    <span>
                      <span className="block text-sm font-medium text-slate-200">
                        {deployment.name}
                      </span>
                      <span className="block text-xs text-slate-500">
                        {deployment.platform}
                      </span>
                    </span>
                  </>
                );
                return deployment.href ? (
                  <a
                    key={`${deployment.name}-${deployment.platform}`}
                    href={deployment.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-start gap-3 rounded-xl border border-border bg-white/[0.015] px-4 py-3 transition hover:border-brand-500/40 hover:bg-white/[0.03]"
                  >
                    {content}
                  </a>
                ) : (
                  <div
                    key={`${deployment.name}-${deployment.platform}`}
                    className="flex items-start gap-3 rounded-xl border border-border bg-white/[0.015] px-4 py-3"
                  >
                    {content}
                  </div>
                );
              })}
            </div>
          </section>

          <section id="skills" className="mt-20 scroll-mt-10">
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">
              Core skills
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {coreSkills.map((skill) => (
                <div key={skill.group}>
                  <p className="text-sm font-medium text-slate-200">{skill.group}</p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {skill.skills.map((s) => (
                      <TechChip key={s} label={s} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="work" className="mt-20 scroll-mt-10">
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">
              Featured work
            </h2>
            <div className="mt-6 grid gap-5">
              {selectedProjects.map((project, index) => (
                <article
                  key={project.title}
                  className={`card-glow group relative rounded-2xl border p-6 transition duration-300 hover:-translate-y-0.5 hover:bg-white/[0.03] md:p-7 ${
                    project.featured
                      ? "border-brand-500/20 bg-brand-500/[0.03]"
                      : "border-border bg-white/[0.015]"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-xs text-slate-600">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-xl font-semibold text-slate-100 transition group-hover:text-brand-200">
                        {project.title}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {project.platforms.map((platform) => (
                        <span
                          key={platform}
                          className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-slate-500"
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                    {project.tagline}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.techStack.map((tech) => (
                      <TechChip key={tech} label={tech} />
                    ))}
                  </div>

                  <ul className="mt-5 space-y-2 text-sm leading-6 text-slate-300">
                    {project.highlights.map((item) => (
                      <li key={item} className="flex gap-2.5">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1.5 border-t border-border pt-4">
                    {project.references.map((reference) => (
                      <div key={`${project.title}-${reference.label}`}>
                        {renderReference(reference)}
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="extras" className="mt-20 scroll-mt-10">
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">
              Additional builds
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Smaller or in-progress projects exploring specific problems —
              RAG pipelines, OCR, gamified learning, and media.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {additionalProjects.map((project) => (
                <div
                  key={project.title}
                  className="rounded-xl border border-border bg-white/[0.015] px-4 py-3.5 transition hover:border-brand-500/30 hover:bg-white/[0.03]"
                >
                  <p className="text-sm font-medium text-slate-200">{project.title}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{project.tagline}</p>
                  <p className="mt-2 font-mono text-[10px] text-slate-600">
                    {project.techStack}
                  </p>
                  <div className="mt-1.5">{renderReference(project.reference)}</div>
                </div>
              ))}
            </div>
          </section>

          <section id="contact" className="mt-20 scroll-mt-10 border-t border-border pt-16 pb-24">
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">
              Contact
            </h2>
            <p className="mt-4 max-w-md text-2xl font-semibold leading-tight text-slate-100">
              Building something that needs a full-stack engineer?
            </p>
            <a
              href="mailto:nuwanhemal@gmail.com"
              className="mt-5 inline-flex items-center gap-2 text-base text-brand-300 transition hover:text-brand-200"
            >
              nuwanhemal@gmail.com <span>→</span>
            </a>
          </section>
        </div>
      </div>
    </main>
  );
}
