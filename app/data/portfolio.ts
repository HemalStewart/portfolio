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
  label: "GitHub" | "LinkedIn" | "Email" | "Phone" | "CV";
  href: string;
  /** Human-readable form of the link, e.g. the address or handle. */
  display: string;
  external?: boolean;
};

export type ProductionDeployment = {
  name: string;
  platform: string;
  href?: string;
  note?: string;
  /** Store download count as shown on the listing (a lower bound, e.g. 100K+). */
  downloads?: number;
  /** Slug of the matching case study in `selectedProjects`. */
  project: string;
};

export type SkillGroup = {
  title: string;
  detail: string;
  skills: string[];
};

export type ShowcaseSite = {
  slug: string;
  name: string;
  kind: string;
  line: string;
  stack: string[];
  /** Concept sites live under /showcase; the live builds link out. */
  href: string;
  status: "concept" | "live";
};

export const navLinks = [
  { label: "Releases", href: "#releases" },
  { label: "Work", href: "#work" },
  { label: "Showcase", href: "#showcase" },
  { label: "Experience", href: "#experience" },
  { label: "Stack", href: "#stack" },
  { label: "Side branches", href: "#side-branches" },
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
    display: "github.com/HemalStewart",
    external: true,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/hemal-herath-24a896131/",
    display: "in/hemal-herath",
    external: true,
  },
  {
    label: "Email",
    href: "mailto:nuwanhemal@gmail.com",
    display: "nuwanhemal@gmail.com",
  },
  {
    label: "Phone",
    href: "tel:+94718850419",
    display: "+94 71 885 0419",
  },
  {
    label: "CV",
    href: "/resume.pdf",
    display: "resume.pdf",
    external: true,
  },
];

export const productionDeployments: ProductionDeployment[] = [
  {
    name: "VibeChat AI",
    platform: "Android",
    href: "https://play.google.com/store/apps/details?id=com.appmixer.vibechatai",
    downloads: 100_000,
    project: "chatsoul-ai",
  },
  {
    name: "VibeChat AI",
    platform: "iOS",
    href: "https://apps.apple.com/us/app/vibechat-ai-vibe-your-chat/id6782503745",
    project: "chatsoul-ai",
  },
  {
    name: "WriteScan",
    platform: "Android",
    href: "https://play.google.com/store/apps/details?id=com.appmixer.writescan",
    downloads: 100_000,
    project: "writescan",
  },
  {
    name: "ChatSoul AI",
    platform: "Web",
    href: "https://chatsoulai.com/",
    project: "chatsoul-ai",
  },
  {
    name: "ChatSoul AI",
    platform: "iOS",
    href: "https://apps.apple.com/us/app/chatsoul-ai/id6756913536",
    project: "chatsoul-ai",
  },
  {
    name: "PDMS",
    platform: "Ministry of Education, Sri Lanka",
    href: "https://pdms.moe.gov.lk/",
    project: "pdms",
  },
  {
    name: "Smart Guardian Pro",
    platform: "Android",
    href: "https://play.google.com/store/apps/details?id=com.bytehub.textrecovery",
    downloads: 100_000,
    project: "smart-guardian-pro",
  },
  {
    name: "Smart Guardian Pro",
    platform: "iOS",
    href: "https://apps.apple.com/us/app/smart-guardian-family-safety/id6769642500",
    project: "smart-guardian-pro",
  },
  {
    name: "LinkForex",
    platform: "Web admin",
    href: "https://linkforex.vercel.app/admin/dashboard",
    project: "linkforex",
  },
  {
    name: "Novice Monk Registry",
    platform: "Web admin",
    href: "https://novice-monk-admin.vercel.app/admin",
    project: "novice-monk-registry",
  },
  {
    name: "Sea Cloud, Dalawella",
    platform: "Web",
    href: "https://hotel-kohl-ten.vercel.app/",
    project: "sea-cloud-dalawella",
  },
];

export const skillGroups: SkillGroup[] = [
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
        label: "Live admin",
        href: "https://linkforex.vercel.app/admin/dashboard",
      },
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
      "Live now on Google Play, the App Store, and the web — VibeChat AI alone has passed 100K+ downloads on Google Play.",
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
      "Passed 100K+ downloads on Google Play.",
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
      "Serves the Division of Piriven Education with records for 7,000+ students, 5,600+ teachers, 5,600+ guardians and 1,300+ employees.",
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
      "Shipped and live on Google Play and the App Store, with 100K+ downloads on Google Play.",
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
    slug: "novice-monk-registry",
    initials: "NM",
    title: "Novice Monk Registry",
    tagline:
      "Application registry and review workflow for Sri Lanka's Division of Piriven Education.",
    platforms: ["Web admin"],
    techStack: ["MongoDB"],
    highlights: [
      "Built the review pipeline — draft, under review, returned, approved — scoped by district and zone.",
      "Role-based access for central administration, districts, and piriven accounts, with user-access and system-status screens.",
      "Overview dashboard with live application activity and review status, plus search and summary export.",
    ],
    references: [
      {
        label: "Live admin",
        href: "https://novice-monk-admin.vercel.app/admin",
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
    references: [
      { label: "Live site", href: "https://hotel-kohl-ten.vercel.app/" },
      { label: "Source", note: "Code available on request" },
    ],
  },
];

export const additionalProjects: LightProject[] = [
  {
    title: "Piriven Education CMS",
    tagline:
      "Content management system for the Division of Piriven Education website: admin dashboard, REST APIs, and end-to-end deployment.",
    techStack: "Next.js, Django, SQLite, Nginx, AlmaLinux",
    reference: {
      label: "Details on request",
      note: "Code available on request",
    },
  },
  {
    title: "Energy Forecasting",
    tagline:
      "Regression-based electricity-consumption forecasting — the research behind an IEEE I2CT 2019 paper.",
    techStack: "Python, Django, machine learning",
    reference: {
      label: "Details on request",
      note: "Code available on request",
    },
  },
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

/** The 3D website showcase, static pages in public/showcase (see next.config.ts). */
export const showcaseUrl = "/showcase";

export const showcaseWhatsApp =
  "https://wa.me/94718850419?text=Hi%20Hemal%2C%20I%20saw%20your%203D%20showcase%20and%20I%27d%20like%20a%20website.";

export const showcaseSites: ShowcaseSite[] = [
  {
    slug: "tea",
    name: "Mistline",
    kind: "Ceylon tea",
    line: "A liquid-glass 3D hero that refracts drifting highland mist.",
    stack: ["Three.js", "GLSL", "GSAP"],
    href: "/showcase/tea",
    status: "concept",
  },
  {
    slug: "villa",
    name: "Saffron Reef",
    kind: "Tangalle villa",
    line: "An AI drone film that plays frame by frame as you scroll.",
    stack: ["Canvas", "GSAP", "AI video"],
    href: "/showcase/villa",
    status: "concept",
  },
  {
    slug: "sapphire",
    name: "Nīla Atelier",
    kind: "Ceylon sapphires",
    line: "A real-time faceted sapphire with light dispersion and bloom.",
    stack: ["Three.js", "PBR glass", "Bloom"],
    href: "/showcase/sapphire",
    status: "concept",
  },
  {
    slug: "coffee",
    name: "Ninth Lane",
    kind: "Colombo coffee",
    line: "140 3D coffee beans that scatter away from your cursor.",
    stack: ["Three.js", "Instancing", "Kinetic type"],
    href: "/showcase/coffee",
    status: "concept",
  },
  {
    slug: "surf",
    name: "Swellhouse",
    kind: "Weligama surf camp",
    line: "A GPU ocean at sunrise, built from Gerstner waves.",
    stack: ["GLSL", "ScrollTrigger"],
    href: "/showcase/surf",
    status: "concept",
  },
  {
    slug: "shifenmei",
    name: "Shifenmei",
    kind: "Software studio",
    line: "A studio site with floating 3D glyphs and a ten-chapter scroll story.",
    stack: ["Next.js", "Three.js"],
    href: "https://shifenmei.vercel.app/",
    status: "live",
  },
  {
    slug: "guetta",
    name: "David Guetta",
    kind: "Unofficial redesign",
    line: "An editorial concept for a global DJ: tours, releases, store and awards.",
    stack: ["Next.js", "Motion"],
    href: "https://david-guetta-redesign.vercel.app/",
    status: "concept",
  },
];

export type Release = {
  name: string;
  project: string;
  deployments: ProductionDeployment[];
};

/** Production deployments grouped per product, in first-seen order. */
export const releases: Release[] = productionDeployments.reduce<Release[]>(
  (groups, deployment) => {
    const existing = groups.find((group) => group.name === deployment.name);
    if (existing) existing.deployments.push(deployment);
    else
      groups.push({
        name: deployment.name,
        project: deployment.project,
        deployments: [deployment],
      });
    return groups;
  },
  [],
);

// Experience, education and recognition below are taken from public/resume.pdf.

export type Experience = {
  role: string;
  org: string;
  period: string;
  start: string;
  current?: boolean;
  points: string[];
};

export const experience: Experience[] = [
  {
    role: "Freelance Software Engineer",
    org: "Independent",
    period: "Jun 2025 – Present",
    start: "2025-06",
    current: true,
    points: [
      "Develop and deploy full-stack web apps with CodeIgniter, Django and Next.js.",
      "Built PDMS for the Ministry of Education and a CMS-style website, hosted on AlmaLinux + Nginx with a focus on scalability and clean architecture.",
      "Own the complete project lifecycle, from design to deployment.",
    ],
  },
  {
    role: "Freelance & E-commerce Work",
    org: "Independent",
    period: "Jan 2022 – May 2025",
    start: "2022-01",
    points: [
      "Managed an online business end to end — ownership, planning and client-facing work.",
      "Balanced multiple projects while keeping the focus on quality and delivery.",
    ],
  },
  {
    role: "Instructor",
    org: "Cortex International (Pvt) Ltd",
    period: "Aug 2020 – Jan 2021",
    start: "2020-08",
    points: [
      "Delivered e-commerce and web-technology training and guided learners through project workflows.",
    ],
  },
  {
    role: "Software Engineering Intern",
    org: "Crowderia (Pvt) Ltd",
    period: "Jul 2017 – Jul 2018",
    start: "2017-07",
    points: [
      "Contributed to web and mobile apps including Catchingo and KarmaMirror with Laravel, ReactJS and Firebase.",
      "Assisted in development, testing and documentation within agile processes.",
    ],
  },
];

export const education = {
  degree: "BEng (Hons) in Software Engineering",
  school:
    "University of Westminster (UK), through Informatics Institute of Technology, Sri Lanka",
  period: "2015 – 2019",
};

export const recognition: { title: string; detail: string; year?: string }[] = [
  {
    title: "IEEE research publication",
    detail:
      "“Review on Electricity Consumption Forecasting Approaches” — IEEE 5th I2CT, India",
    year: "2019",
  },
  {
    title: "2nd place — Cutting Edge “Dhuthaya”",
    detail: "Competition",
  },
  {
    title: "Top 12 — IIT Hackathon",
    detail:
      "Elektra, a smart multi-plug IoT system (Python, Android, Firebase, Raspberry Pi)",
  },
];

/** Formats a store download count the way listings do: 100000 -> "100K+". */
export function formatDownloads(count: number) {
  return count >= 1_000_000
    ? `${count / 1_000_000}M+`
    : `${Math.floor(count / 1_000)}K+`;
}

/** Sum of the lower-bound Play Store download counts across all releases. */
export const totalDownloads = productionDeployments.reduce(
  (sum, deployment) => sum + (deployment.downloads ?? 0),
  0,
);
