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
];

const coreSkills = [
  {
    group: "Frontend",
    skills: "Flutter, Next.js, React, TypeScript, JavaScript, Tailwind CSS",
  },
  {
    group: "Backend",
    skills:
      "PHP (CodeIgniter), FastAPI, REST API design, authentication and authorization",
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
    techStack: "Flutter, GetX, Stream Video SDK, permission_handler",
    responsibilities: [
      "Built meeting flows for login, home dashboard, personal room, upcoming meetings, previous meetings, recordings, and meeting room navigation.",
      "Implemented controller logic for create, join, leave, schedule, and recording retrieval.",
      "Added camera/microphone permission workflow and meeting lobby handoff into active call room.",
      "Structured project into controllers, models, screens, widgets, and utility layers.",
    ],
    impact: [
      "Delivered a production-style conferencing app architecture in Flutter with concrete meeting operations and call-state handling.",
    ],
    references: [{ label: "Source Project", note: "Code available on request" }],
  },
  {
    title: "WriteScan App",
    techStack: "Flutter, Riverpod, GoRouter, ML Kit, SQLite",
    responsibilities: [
      "Built multi-mode document scan workflows including text extraction, handwriting scan, CSV scan, and review screens.",
      "Implemented auth and onboarding flows, shell navigation, notifications, and document/folder views.",
      "Added bot and chat modules with structured feature, state, and data layers.",
      "Integrated local storage and persistence for app continuity.",
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
        label: "Local Project Path",
        path: "/Applications/MAMP/htdocs/pdms",
      },
    ],
  },
  {
    title: "Smart Guardian Pro",
    techStack: "Flutter, Dart",
    responsibilities: [
      "Built safety-oriented mobile workflows for SOS, location, and group-based tracking modules.",
      "Implemented service-driven architecture for auth, location, notifications, and session handling.",
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
    techStack: "Flutter, Dart",
    responsibilities: [
      "Built and maintained a full cross-platform application targeting Android, iOS, and Web from a single Flutter codebase.",
      "Implemented core product flows including authentication, chat, discover, match, wallet/subscription, referrals, and creation workflows.",
      "Structured the app into reusable feature, core, and data layers for maintainability and scale.",
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
];

const additionalProjects: ExternalReference[] = [
  {
    label: "Chat platform web app",
    href: "https://github.com/HemalStewart/chat-bot",
  },
  {
    label: "PDF retrieval platform",
    path: "/Users/lakminiinternational/rag-system",
  },
  { label: "Flicky (Flutter)", href: "https://github.com/HemalStewart/flicky" },
];

function renderReference(reference: ExternalReference) {
  if (reference.href) {
    return (
      <a
        className="text-sm text-brand-700 transition hover:text-brand-900 hover:underline"
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
      <p className="text-sm text-slate-700">
        {reference.label}:{" "}
        <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-800">
          {reference.path}
        </code>
      </p>
    );
  }

  return <p className="text-sm text-slate-700">{`${reference.label}: ${reference.note}`}</p>;
}

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-5 py-8 md:px-8 md:py-12">
      <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-[0_20px_70px_-40px_rgba(13,36,61,0.6)]">
        <div className="relative border-b border-slate-200/80 bg-[radial-gradient(circle_at_top_left,_#e0efff_0,_transparent_45%),radial-gradient(circle_at_top_right,_#fcf0dc_0,_transparent_40%)] p-8 md:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Last updated: 2026-03-30
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold text-slate-900 md:text-5xl">
            Hemal Herath
          </h1>
          <p className="mt-2 text-lg font-semibold text-brand-700">
            Full-Stack Software Engineer
          </p>
          <p className="mt-5 max-w-3xl text-[15px] leading-7 text-slate-700 md:text-base">
            Full-stack software engineer with hands-on delivery experience across
            Flutter, Next.js, TypeScript, PHP (CodeIgniter), and FastAPI. Built
            and maintained production-style web and mobile platforms with complex
            operational workflows, secure authentication, role-based access
            controls, and multi-module architectures.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="mailto:nuwanhemal@gmail.com"
              className="rounded-full bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-800"
            >
              Contact via Email
            </a>
            <a
              href="/resume.pdf"
              className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              target="_blank"
              rel="noreferrer"
            >
              View Resume
            </a>
          </div>
        </div>

        <div className="grid gap-3 px-8 py-6 text-sm text-slate-700 md:grid-cols-3 md:px-12">
          <p>
            <span className="font-semibold text-slate-900">Email:</span>{" "}
            nuwanhemal@gmail.com
          </p>
          <p>
            <span className="font-semibold text-slate-900">Phone:</span> +94 71
            88 50 419
          </p>
          <p>
            <span className="font-semibold text-slate-900">Location:</span>{" "}
            Polgasowita, Kottawa
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200/80 bg-white/90 p-7 md:p-9">
        <h2 className="font-display text-2xl font-semibold text-slate-900">
          Delivery Snapshot
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Active Project Timeline
            </p>
            <p className="mt-2 text-base font-semibold text-slate-900">
              2025-08-22 to 2026-03-25
            </p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Repositories Reviewed
            </p>
            <p className="mt-2 text-base font-semibold text-slate-900">
              13 repositories + 1 local MAMP project
            </p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Combined Commits
            </p>
            <p className="mt-2 text-base font-semibold text-slate-900">605</p>
          </article>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200/80 bg-white/90 p-7 md:p-9">
        <h2 className="font-display text-2xl font-semibold text-slate-900">
          Production Deployments
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {productionDeployments.map((deployment) => (
            <a
              key={`${deployment.name}-${deployment.platform}`}
              className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-brand-200 hover:bg-brand-50/50"
              href={deployment.href}
              target="_blank"
              rel="noreferrer noopener"
            >
              <p className="text-base font-semibold text-slate-900">
                {deployment.name}
              </p>
              <p className="mt-1 text-sm text-slate-600">{deployment.platform}</p>
              <p className="mt-3 text-sm text-brand-700">Open deployment</p>
            </a>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200/80 bg-white/90 p-7 md:p-9">
        <h2 className="font-display text-2xl font-semibold text-slate-900">
          Core Skills
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {coreSkills.map((skill) => (
            <article
              key={skill.group}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {skill.group}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                {skill.skills}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200/80 bg-white/90 p-7 md:p-9">
        <h2 className="font-display text-2xl font-semibold text-slate-900">
          Selected Project Experience
        </h2>
        <div className="mt-6 grid gap-5">
          {selectedProjects.map((project) => (
            <article
              key={project.title}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <h3 className="text-lg font-semibold text-slate-900">
                {project.title}
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Tech stack: {project.techStack}
              </p>

              <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
                Responsibilities
              </p>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-6 text-slate-700">
                {project.responsibilities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
                Impact
              </p>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-6 text-slate-700">
                {project.impact.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
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

      <section className="rounded-3xl border border-slate-200/80 bg-white/90 p-7 md:p-9">
        <h2 className="font-display text-2xl font-semibold text-slate-900">
          Additional Projects
        </h2>
        <div className="mt-4 flex flex-col gap-2">
          {additionalProjects.map((project) => (
            <div key={project.label}>{renderReference(project)}</div>
          ))}
        </div>
      </section>
    </main>
  );
}
