type ExternalReference = {
  label: string;
  href?: string;
  path?: string;
  note?: string;
};

type ProjectExperience = {
  title: string;
  techStack: string;
  responsibilities: string[];
  impact: string[];
  references: ExternalReference[];
};

type ProfileLink = {
  label: string;
  href: string;
  icon: "github" | "linkedin" | "email" | "phone" | "cv";
  external?: boolean;
};

const profileLinks: ProfileLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/HemalStewart",
    icon: "github",
    external: true,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/hemal-herath-24a896131/",
    icon: "linkedin",
    external: true,
  },
  {
    label: "Email",
    href: "mailto:nuwanhemal@gmail.com",
    icon: "email",
  },
  {
    label: "Phone",
    href: "tel:+94718850419",
    icon: "phone",
  },
  {
    label: "CV",
    href: "/resume.pdf",
    icon: "cv",
    external: true,
  },
];

const productionDeployments = [
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
    platform: "Web",
    href: "https://pdms.moe.gov.lk/",
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
    group: "Data and Storage",
    skills: "SQL schema design, Prisma, sqflite, shared preferences",
  },
  {
    group: "Mobile and Platform",
    skills:
      "Android/iOS Flutter delivery, go_router, Riverpod state management",
  },
  {
    group: "Product Areas",
    skills:
      "Fintech operations, communication platforms, document processing, education management systems",
  },
];

const selectedProjects: ProjectExperience[] = [
  {
    title: "LinkForex Platform (Admin + Mobile + Backend)",
    techStack: "Next.js, TypeScript, Flutter, PHP (CodeIgniter)",
    responsibilities: [
      "Built admin modules for remitters, receivers, transfers, branches, user roles, permissions, and reporting.",
      "Implemented multi-step transfer and verification workflows with operational controls.",
      "Developed and integrated mobile app flows for onboarding, OTP, beneficiary handling, profile management, and payments.",
      "Maintained backend-ready service/controller/model structures for operational data handling.",
    ],
    impact: [
      "Delivered end-to-end fintech operations coverage across admin, backend, and mobile channels.",
      "Enabled centralized control of branch and transfer workflows for operations teams.",
    ],
    references: [
      { label: "Admin Repository", href: "https://github.com/HemalStewart/linkforex" },
      {
        label: "Backend Repository",
        href: "https://github.com/HemalStewart/linforex_backend",
      },
      {
        label: "Mobile Repository",
        href: "https://github.com/Dilmith-Ranasinghe518/LinkForexApp",
      },
    ],
  },
  {
    title: "WriteScan App",
    techStack:
      "Flutter, Riverpod, GoRouter, ML Kit, SQLite, CodeIgniter/Laravel backend APIs",
    responsibilities: [
      "Built multi-mode document scan workflows including text extraction, handwriting scan, CSV scan, and review screens.",
      "Implemented auth and onboarding flows, shell navigation, notifications, and document/folder views.",
      "Added bot and chat modules with structured feature, state, and data layers.",
      "Integrated local storage and persistence for app continuity.",
      "Integrated Flutter mobile flows with CodeIgniter/Laravel REST endpoints for production data exchange.",
    ],
    impact: [
      "Delivered a complete document-focused mobile workflow from capture to review and management.",
    ],
    references: [
      {
        label: "Source Repository",
        href: "https://github.com/shehan-077/Write-Scan---Flutter",
      },
      {
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=com.appmixer.writescan",
      },
    ],
  },
  {
    title: "Education Browser Desktop App",
    techStack: "Electron, Next.js, React, TypeScript, JavaScript",
    responsibilities: [
      "Built a desktop browser workspace layout with coordinated reader and side panel experiences.",
      "Implemented integrated study and analysis utilities with structured interaction flows.",
      "Added desktop managers for bookmarks, history, and settings persistence.",
    ],
    impact: [
      "Delivered a desktop learning workflow with integrated browsing and productivity features.",
    ],
    references: [
      {
        label: "Source Repository",
        href: "https://github.com/HemalStewart/edu-ai-browser",
      },
    ],
  },
  {
    title: "PDMS (Global Multi School Management System Express)",
    techStack: "PHP, CodeIgniter (HMVC), MySQL",
    responsibilities: [
      "Worked within a modular HMVC system structure spanning academic, attendance, exam, HRM, accounting, payroll, library, and reporting modules.",
      "Maintained controller, model, routing, and config layers in a multi-module education management codebase.",
      "Reviewed and supported schema/update scripts and module-level configuration controls.",
    ],
    impact: [
      "Supported a broad school operations platform with centralized modular architecture.",
    ],
    references: [
      {
        label: "Repository",
        note: "Link available on request",
      },
    ],
  },
  {
    title: "Smart Guardian Pro",
    techStack: "Flutter, Dart, CodeIgniter/Laravel backend APIs",
    responsibilities: [
      "Built safety-oriented mobile workflows for SOS, location, and group-based tracking modules.",
      "Implemented service-driven architecture for auth, location, notifications, and session handling.",
      "Connected mobile modules to CodeIgniter/Laravel backend services for authentication and operational data.",
    ],
    impact: [
      "Delivered a structured mobile safety product with clear module separation and reusable services.",
    ],
    references: [
      {
        label: "Source Repository",
        href: "https://github.com/shehan-077/Smart-Guardian-Pro",
      },
    ],
  },
  {
    title: "ChatSoul AI / VibeChat AI (Primary Cross-Platform Project)",
    techStack: "Flutter, Dart, CodeIgniter/Laravel backend APIs",
    responsibilities: [
      "Built and maintained a full cross-platform application targeting Android, iOS, and Web from a single Flutter codebase.",
      "Implemented core product flows including authentication, chat, discover, match, wallet/subscription, referrals, and creation workflows.",
      "Structured the app into reusable feature, core, and data layers for maintainability and scale.",
      "Integrated mobile and web clients with CodeIgniter/Laravel backend APIs for core product operations.",
    ],
    impact: [
      "Delivered one product across Android, iOS, and Web with shared architecture and feature parity.",
    ],
    references: [
      {
        label: "Source Repository",
        href: "https://github.com/shehan-077/ChatSoulAi---Flutter",
      },
      { label: "Production Web", href: "https://chatsoulai.com/" },
      {
        label: "Production Android",
        href: "https://play.google.com/store/apps/details?id=com.appmixer.vibechatai",
      },
      {
        label: "Production iOS",
        href: "https://apps.apple.com/us/app/chatsoul-ai/id6756913536",
      },
    ],
  },
  {
    title: "Real-Time Meetings Platform (Web)",
    techStack: "Next.js, TypeScript, Clerk, Stream Video SDK, Tailwind CSS",
    responsibilities: [
      "Implemented meeting lifecycle features: instant meetings, scheduled meetings, personal room, recordings, and history views.",
      "Built meeting room and setup components with participant-facing controls.",
      "Integrated authentication and route protection for signed-in meeting experiences.",
    ],
    impact: [
      "Delivered a full video conferencing workflow with scheduling and session management.",
    ],
    references: [{ label: "Repository", note: "Link available on request" }],
  },
  {
    title: "Real-Time Meetings App (Flutter)",
    techStack:
      "Flutter, GetX, Stream Video SDK, permission_handler, CodeIgniter/Laravel backend APIs",
    responsibilities: [
      "Built meeting flows for login, home dashboard, personal room, upcoming meetings, previous meetings, recordings, and meeting room navigation.",
      "Implemented controller logic for create, join, leave, schedule, and recording retrieval.",
      "Added camera/microphone permission workflow and meeting lobby handoff into active call room.",
      "Structured project into controllers, models, screens, widgets, and utility layers.",
      "Integrated app-level business flows with CodeIgniter/Laravel backend endpoints.",
    ],
    impact: [
      "Delivered a production-style conferencing app architecture in Flutter with concrete meeting operations and call-state handling.",
    ],
    references: [{ label: "Source Project", note: "Code available on request" }],
  },
];

const additionalProjects: ExternalReference[] = [
  {
    label: "Chat platform web app",
    href: "https://github.com/HemalStewart/chat-bot",
  },
  {
    label: "PDF retrieval platform",
    note: "Repository: Link available on request",
  },
  { label: "Flicky (Flutter)", href: "https://github.com/HemalStewart/flicky" },
];

function renderReference(reference: ExternalReference) {
  if (reference.href) {
    return (
      <a
        className="text-sm text-brand-300 transition hover:text-brand-200 hover:underline"
        href={reference.href}
        target="_blank"
        rel="noreferrer noopener"
      >
        {reference.label}
      </a>
    );
  }

  if (reference.path) {
    return (
      <p className="text-sm text-slate-300">
        {reference.label}:{" "}
        <code className="rounded bg-slate-800 px-1.5 py-0.5 text-xs text-slate-200">
          {reference.path}
        </code>
      </p>
    );
  }

  return <p className="text-sm text-slate-300">{`${reference.label}: ${reference.note}`}</p>;
}

function ContactIcon({ icon }: { icon: ProfileLink["icon"] }) {
  if (icon === "github") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-5">
        <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6V21c-3.3.7-4-1.4-4-1.4-.6-1.3-1.3-1.7-1.3-1.7-1.1-.8.1-.8.1-.8 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.9 1.3 3.6 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6A4.7 4.7 0 0 1 6.4 8c-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.3 11.3 0 0 1 6 0C18 4.5 19 4.8 19 4.8c.6 1.7.2 2.9.1 3.2a4.7 4.7 0 0 1 1.3 3.2c0 4.7-2.9 5.7-5.6 6 .4.3.8 1 .8 2v3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" />
      </svg>
    );
  }

  if (icon === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-5">
        <path d="M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9v5.7H9.2V9h3.4v1.6h.1A3.7 3.7 0 0 1 16 8.8c3.6 0 4.3 2.4 4.3 5.4v6.3ZM5.1 7.5a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2ZM6.9 20.5H3.3V9h3.6v11.5ZM22.2.8H1.8C.8.8 0 1.6 0 2.6v18.8c0 1 .8 1.8 1.8 1.8h20.4c1 0 1.8-.8 1.8-1.8V2.6c0-1-.8-1.8-1.8-1.8Z" />
      </svg>
    );
  }

  if (icon === "email") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-5">
        <path
          d="M3 6.5h18v11H3z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="m3.6 7 8.4 6 8.4-6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (icon === "phone") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-5">
        <path
          d="M7.5 3.5h3L12 7l-2 1.8c.7 1.4 1.8 2.5 3.2 3.2L15 10l3.5 1.5v3c0 .6-.4 1-1 1A13.5 13.5 0 0 1 4 6.5c0-.6.4-1 1-1h2.5Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-5">
      <rect
        x="4"
        y="3.5"
        width="16"
        height="17"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M8 8h8M8 12h8M8 16h5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Home() {
  return (
    <main className="flex w-full min-h-screen flex-1 flex-col gap-6 px-4 py-6 md:px-10 md:py-10">
      <section className="overflow-hidden rounded-3xl border border-slate-800/90 bg-slate-950/80 shadow-[0_30px_80px_-45px_rgba(0,0,0,0.95)]">
        <div className="relative border-b border-slate-800/80 bg-[radial-gradient(circle_at_top_left,_rgba(19,104,213,0.28)_0,_transparent_50%),radial-gradient(circle_at_top_right,_rgba(15,23,42,0.8)_0,_transparent_45%)] p-8 md:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
            Last updated: 2026-03-30
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold text-slate-100 md:text-5xl">
            Hemal Herath
          </h1>
          <p className="mt-2 text-lg font-semibold text-brand-300">
            Full-Stack Software Engineer
          </p>
          <p className="mt-5 max-w-3xl text-[15px] leading-7 text-slate-300 md:text-base">
            Full-stack software engineer with hands-on delivery experience across
            Flutter, Next.js, TypeScript, PHP (CodeIgniter), and FastAPI. Built
            and maintained production-style web and mobile platforms with complex
            operational workflows, secure authentication, role-based access
            controls, and multi-module architectures, including Flutter
            applications integrated with CodeIgniter and Laravel backends.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            {profileLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                aria-label={link.label}
                title={link.label}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noreferrer noopener" : undefined}
                className="group flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900/80 text-slate-200 transition hover:-translate-y-0.5 hover:border-brand-400 hover:bg-brand-950/50 hover:text-brand-200"
              >
                <ContactIcon icon={link.icon} />
              </a>
            ))}
          </div>
          <p className="mt-4 text-sm text-slate-400">
            Polgasowita, Kottawa | +94 71 88 50 419 | nuwanhemal@gmail.com
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-800/90 bg-slate-950/70 p-7 md:p-9">
        <h2 className="font-display text-2xl font-semibold text-slate-100">
          Production Deployments
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {productionDeployments.map((deployment) => (
            <a
              key={`${deployment.name}-${deployment.platform}`}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-4 transition hover:border-brand-500 hover:bg-brand-950/40"
              href={deployment.href}
              target="_blank"
              rel="noreferrer noopener"
            >
              <p className="text-base font-semibold text-slate-100">
                {deployment.name}
              </p>
              <p className="mt-1 text-sm text-slate-400">{deployment.platform}</p>
              <p className="mt-3 text-sm text-brand-300">Open deployment</p>
            </a>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-800/90 bg-slate-950/70 p-7 md:p-9">
        <h2 className="font-display text-2xl font-semibold text-slate-100">
          Core Skills
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {coreSkills.map((skill) => (
            <article
              key={skill.group}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {skill.group}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {skill.skills}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-800/90 bg-slate-950/70 p-7 md:p-9">
        <h2 className="font-display text-2xl font-semibold text-slate-100">
          Selected Project Experience
        </h2>
        <div className="mt-6 grid gap-5">
          {selectedProjects.map((project) => (
            <article
              key={project.title}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
            >
              <h3 className="text-lg font-semibold text-slate-100">
                {project.title}
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                Tech stack: {project.techStack}
              </p>

              <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
                Responsibilities
              </p>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-6 text-slate-300">
                {project.responsibilities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
                Impact
              </p>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-6 text-slate-300">
                {project.impact.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
                References
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
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

      <section className="rounded-3xl border border-slate-800/90 bg-slate-950/70 p-7 md:p-9">
        <h2 className="font-display text-2xl font-semibold text-slate-100">
          Additional Projects
        </h2>
        <div className="mt-4 flex flex-col gap-2">
          {additionalProjects.map((project) => (
            <div key={project.label}>{renderReference(project)}</div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-800/90 bg-slate-950/70 p-7 md:p-9">
        <h2 className="font-display text-2xl font-semibold text-slate-100">
          Delivery Snapshot
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Active Project Timeline
            </p>
            <p className="mt-2 text-base font-semibold text-slate-100">
              2025-08-22 to 2026-03-25
            </p>
          </article>
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Repositories Reviewed
            </p>
            <p className="mt-2 text-base font-semibold text-slate-100">
              13 repositories + 1 local MAMP project
            </p>
          </article>
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Combined Commits
            </p>
            <p className="mt-2 text-base font-semibold text-slate-100">605</p>
          </article>
        </div>
      </section>
    </main>
  );
}
