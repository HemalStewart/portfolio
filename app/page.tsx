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
  techStack: string;
  highlights: string[];
  references: ExternalReference[];
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
    platform: "Web · Ministry of Education, Sri Lanka",
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
    skills: "Flutter, Next.js, React, TypeScript, JavaScript, Tailwind CSS",
  },
  {
    group: "Backend",
    skills:
      "PHP (CodeIgniter, Laravel), FastAPI, REST API design, authentication and authorization",
  },
  {
    group: "Data & AI",
    skills:
      "SQL schema design, Prisma, RAG pipelines, embeddings, OpenAI / Gemini integration",
  },
  {
    group: "Mobile & Platform",
    skills:
      "Android/iOS Flutter delivery, go_router, Riverpod state management",
  },
  {
    group: "Product Areas",
    skills:
      "Fintech operations, AI companions, safety & location, applied AI tooling, education",
  },
];

const selectedProjects: ProjectExperience[] = [
  {
    title: "LinkForex",
    tagline:
      "Admin console, mobile app, and backend for a live fintech remittance operation.",
    platforms: ["Admin", "Mobile", "Backend"],
    techStack: "Next.js, TypeScript, Flutter, PHP (CodeIgniter)",
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
  },
  {
    title: "ChatSoul AI / VibeChat AI",
    tagline:
      "One Flutter codebase shipped to Android, iOS, and Web as an AI companion app.",
    platforms: ["Android", "iOS", "Web"],
    techStack: "Flutter, Dart, CodeIgniter/Laravel APIs",
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
  },
  {
    title: "WriteScan",
    tagline:
      "AI-powered document scanner and writing assistant, live on Google Play.",
    platforms: ["Android", "iOS"],
    techStack: "Flutter, Riverpod, GoRouter, ML Kit, SQLite",
    highlights: [
      "Built multi-mode scanning — text extraction, handwriting, CSV — with ML Kit and offline-first local storage.",
      "Added AI chat and bot-creation features on top of the scanning workflow.",
      "65 commits of iteration, the most mature Flutter codebase in this portfolio after LinkForex.",
    ],
    references: [
      { label: "Source repo", href: "https://github.com/shehan-077/Write-Scan---Flutter" },
      { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.appmixer.writescan" },
    ],
  },
  {
    title: "Huddle",
    tagline:
      "Real-time video conferencing platform, built to prove out call infrastructure end to end.",
    platforms: ["Web", "Mobile"],
    techStack: "Next.js, TypeScript, Flutter, Clerk, Stream Video SDK",
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
    techStack: "Flutter, Dart, CodeIgniter/Laravel APIs",
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
    techStack: "PHP, CodeIgniter (HMVC), MySQL",
    highlights: [
      "Worked across academic, attendance, exam, HR, accounting, payroll, and library modules in a large HMVC codebase.",
      "Maintained controller, model, routing, and config layers spanning a multi-module system.",
      "In production at pdms.moe.gov.lk.",
    ],
    references: [
      { label: "Live site", href: "https://pdms.moe.gov.lk/" },
      { label: "Repository", note: "Link available on request" },
    ],
  },
  {
    title: "Scholar Desktop",
    tagline:
      "Electron desktop app pairing a reading pane with an AI tutor panel.",
    platforms: ["Desktop"],
    techStack: "Electron, Next.js, React, TypeScript",
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
    techStack: "Next.js, TypeScript, Prisma, OpenAI, Gemini",
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
    techStack: "Next.js, TypeScript, FastAPI, Whisper",
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
    techStack: "Next.js, TypeScript, Prisma, NextAuth, Leaflet",
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
  { label: "Shipped repositories", value: "25+ across web, mobile & AI" },
  { label: "Commit volume", value: "700+ commits logged" },
];

function renderReference(reference: ExternalReference) {
  if (reference.href) {
    return (
      <a
        className="font-mono text-xs text-slate-400 underline decoration-slate-700 underline-offset-4 transition hover:text-brand-300 hover:decoration-brand-400"
        href={reference.href}
        target="_blank"
        rel="noreferrer noopener"
      >
        {reference.label} →
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
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-6 py-16 md:px-8 md:py-24">
      {/* Hero */}
      <section>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-400">
          Last updated 2026-09-07
        </p>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-100 md:text-5xl">
          Hemal Herath
        </h1>
        <p className="mt-2 text-lg text-slate-400">Full-Stack Software Engineer</p>
        <p className="mt-6 max-w-2xl text-[15px] leading-7 text-slate-300">
          I build production-style web and mobile platforms end to end — Flutter
          and Next.js on the front, PHP (CodeIgniter/Laravel) and FastAPI on the
          back, with applied AI (RAG, LLM routing, voice) layered in where it
          earns its place. Below is what I&apos;ve actually shipped, not a tech-stack
          word cloud.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
          {profileLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer noopener" : undefined}
              className="group flex items-center gap-2 text-sm text-slate-300 transition hover:text-brand-300"
            >
              <Image
                src={link.iconSrc}
                alt=""
                width={18}
                height={18}
                className={`h-[18px] w-[18px] object-contain opacity-70 transition group-hover:opacity-100 ${
                  link.invertOnDark ? "invert" : ""
                }`}
              />
              {link.label}
            </a>
          ))}
        </div>
        <p className="mt-5 font-mono text-xs text-slate-600">
          Polgasowita, Kottawa · +94 71 88 50 419 · nuwanhemal@gmail.com
        </p>
      </section>

      {/* Snapshot */}
      <section className="mt-14 grid grid-cols-1 gap-6 border-t border-border pt-8 sm:grid-cols-3">
        {deliverySnapshot.map((item) => (
          <div key={item.label}>
            <p className="text-xl font-semibold text-slate-100">{item.value}</p>
            <p className="mt-1 text-xs text-slate-500">{item.label}</p>
          </div>
        ))}
      </section>

      {/* Production deployments */}
      <section className="mt-14 border-t border-border pt-10">
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">
          In production
        </h2>
        <div className="mt-5 flex flex-wrap gap-3">
          {productionDeployments.map((deployment) =>
            deployment.href ? (
              <a
                key={`${deployment.name}-${deployment.platform}`}
                href={deployment.href}
                target="_blank"
                rel="noreferrer noopener"
                className="rounded-full border border-border px-3.5 py-1.5 text-sm text-slate-300 transition hover:border-brand-500/60 hover:text-brand-200"
              >
                {deployment.name}{" "}
                <span className="text-slate-500">· {deployment.platform}</span>
              </a>
            ) : (
              <span
                key={`${deployment.name}-${deployment.platform}`}
                className="rounded-full border border-border px-3.5 py-1.5 text-sm text-slate-400"
              >
                {deployment.name} <span className="text-slate-500">· {deployment.platform}</span>
              </span>
            )
          )}
        </div>
      </section>

      {/* Core skills */}
      <section className="mt-14 border-t border-border pt-10">
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">
          Core skills
        </h2>
        <dl className="mt-5 grid gap-4 md:grid-cols-2">
          {coreSkills.map((skill) => (
            <div key={skill.group}>
              <dt className="text-sm font-medium text-slate-200">{skill.group}</dt>
              <dd className="mt-1 text-sm leading-6 text-slate-400">{skill.skills}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Featured projects */}
      <section className="mt-14 border-t border-border pt-10">
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">
          Featured projects
        </h2>
        <div className="mt-2 divide-y divide-border">
          {selectedProjects.map((project, index) => (
            <article key={project.title} className="py-8 first:pt-6">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-xl font-semibold text-slate-100">
                  <span className="mr-2 font-mono text-sm font-normal text-slate-600">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {project.title}
                </h3>
                <div className="flex gap-1.5">
                  {project.platforms.map((platform) => (
                    <span
                      key={platform}
                      className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[11px] text-slate-500"
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              </div>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                {project.tagline}
              </p>
              <p className="mt-2 font-mono text-xs text-slate-600">{project.techStack}</p>

              <ul className="mt-4 space-y-1.5 text-sm leading-6 text-slate-300">
                {project.highlights.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5">
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

      {/* Additional builds */}
      <section className="mt-6 border-t border-border pt-10">
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">
          Additional builds
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Smaller or in-progress projects exploring specific problems — RAG
          pipelines, OCR, gamified learning, and media.
        </p>
        <div className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {additionalProjects.map((project) => (
            <div key={project.title}>
              <p className="text-sm font-medium text-slate-200">{project.title}</p>
              <p className="mt-1 text-sm leading-6 text-slate-500">{project.tagline}</p>
              <p className="mt-1.5 font-mono text-[11px] text-slate-600">
                {project.techStack}
              </p>
              <div className="mt-1.5">{renderReference(project.reference)}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
