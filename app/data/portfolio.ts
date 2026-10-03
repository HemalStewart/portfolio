export type ExternalReference = {
  label: string;
  href?: string;
  note?: string;
};

export type ProjectExperience = {
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

export type LightProject = {
  title: string;
  tagline: string;
  techStack: string;
  reference: ExternalReference;
};

export type ProfileLink = {
  label: string;
  href: string;
  iconSrc: string;
  /** Dark-on-transparent logos (e.g. GitHub) need inverting on the dark theme. */
  invertOnDark?: boolean;
  external?: boolean;
};

export type ProductionDeployment = {
  name: string;
  platform: string;
  href?: string;
  note?: string;
};

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Production", href: "#production" },
  { label: "Work", href: "#work" },
  { label: "Projects", href: "#extras" },
  { label: "Contact", href: "#contact" },
];

export const marqueeItems = [
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

export const profileLinks: ProfileLink[] = [
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

export const productionDeployments: ProductionDeployment[] = [
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

// Ordered so LinkForex, ChatSoul/VibeChat, WriteScan, and PDMS (the four
// featured, production-proven builds) lead the section; Huddle stays lower
// in the list as a personal infrastructure build rather than a client product.
export const selectedProjects: ProjectExperience[] = [
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
      {
        label: "Admin repo",
        href: "https://github.com/HemalStewart/linkforex",
      },
      {
        label: "Backend repo",
        href: "https://github.com/HemalStewart/linforex_backend",
      },
      {
        label: "Mobile repo",
        href: "https://github.com/Dilmith-Ranasinghe518/LinkForexApp",
      },
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
      {
        label: "Source repo",
        href: "https://github.com/shehan-077/ChatSoulAi---Flutter",
      },
      { label: "ChatSoul AI (Web)", href: "https://chatsoulai.com/" },
      {
        label: "ChatSoul AI (iOS)",
        href: "https://apps.apple.com/us/app/chatsoul-ai/id6756913536",
      },
      {
        label: "VibeChat AI (Android)",
        href: "https://play.google.com/store/apps/details?id=com.appmixer.vibechatai",
      },
      {
        label: "VibeChat AI (iOS)",
        href: "https://apps.apple.com/us/app/vibechat-ai-vibe-your-chat/id6782503745",
      },
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
      {
        label: "Source repo",
        href: "https://github.com/shehan-077/Write-Scan---Flutter",
      },
      {
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=com.appmixer.writescan",
      },
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
      'Built SOS, live-location sharing, and group/"circle" safety-network features end to end.',
      "Designed a service-driven architecture separating auth, location, notifications, and session handling.",
      "Shipped and live on Google Play and the App Store.",
    ],
    references: [
      {
        label: "Source repo",
        href: "https://github.com/shehan-077/Smart-Guardian-Pro",
      },
      {
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=com.bytehub.textrecovery",
      },
      {
        label: "App Store",
        href: "https://apps.apple.com/us/app/smart-guardian-family-safety/id6769642500",
      },
    ],
  },
  {
    slug: "huddle",
    initials: "HU",
    title: "Huddle",
    tagline:
      "Real-time video conferencing platform, built to prove out call infrastructure end to end.",
    platforms: ["Web", "Mobile"],
    techStack: [
      "Next.js",
      "TypeScript",
      "Flutter",
      "Clerk",
      "Stream Video SDK",
    ],
    highlights: [
      "Implemented the full meeting lifecycle — instant/scheduled meetings, personal room, recordings, history — on a Next.js web client and a separate Flutter mobile client.",
      "Integrated the Stream Video SDK for real-time call state, plus Clerk auth and route protection on web.",
      "Handled camera/microphone permission flows and lobby-to-call handoff on mobile.",
    ],
    references: [
      {
        label: "Web repo",
        href: "https://github.com/HemalStewart/zoom-clone-main",
      },
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
      {
        label: "Source repo",
        href: "https://github.com/HemalStewart/edu-ai-browser",
      },
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
      {
        label: "Source repo",
        href: "https://github.com/HemalStewart/chat-bot",
      },
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

export const additionalProjects: LightProject[] = [
  {
    title: "Recall",
    tagline:
      "NotebookLM-style research workspace with source-grounded chat and audio overviews.",
    techStack: "Next.js, PDF chunking, embeddings",
    reference: {
      label: "Details on request",
      note: "Code available on request",
    },
  },
  {
    title: "Questly",
    tagline:
      "Gamified AI learning platform with Phaser-based quiz games and an admin dashboard.",
    techStack: "Next.js, MongoDB, Phaser, OpenAI",
    reference: {
      label: "Details on request",
      note: "Code available on request",
    },
  },
  {
    title: "Retriever",
    tagline:
      "PDF RAG engine: chunking, embeddings, vector store, retriever/reranker, and chat.",
    techStack: "FastAPI, Next.js",
    reference: {
      label: "Details on request",
      note: "Code available on request",
    },
  },
  {
    title: "ExamVault",
    tagline:
      "OCR pipeline for extracting and organizing content from scanned exam papers.",
    techStack: "Next.js, Tesseract.js",
    reference: {
      label: "Details on request",
      note: "Code available on request",
    },
  },
  {
    title: "Flicky",
    tagline:
      "Flutter video-streaming app with a custom player and smooth transitions.",
    techStack: "Flutter, video_player",
    reference: {
      label: "Source repo",
      href: "https://github.com/HemalStewart/flicky",
    },
  },
  {
    title: "Lecturely",
    tagline:
      "Turns a PDF into a narrated teaching video: script, slides, TTS, and compile.",
    techStack: "FastAPI, React, ffmpeg",
    reference: {
      label: "Details on request",
      note: "Code available on request",
    },
  },
  {
    title: "Backtest Lab",
    tagline:
      "Small-account crypto strategy research, deliberately kept to paper trading.",
    techStack: "Python",
    reference: {
      label: "Details on request",
      note: "Code available on request",
    },
  },
];
