import "./huddle.css";
import type { CSSProperties, ReactNode } from "react";
import { Browser, Mock } from "../kit";

/** Lucide glyphs the real app uses (24px grid, 2px round strokes). */
function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

const video = (
  <Icon>
    <path d="m16 13 5.22 3.48a.5.5 0 0 0 .78-.42V7.87a.5.5 0 0 0-.75-.43L16 10.5" />
    <rect x="2" y="6" width="14" height="12" rx="2" />
  </Icon>
);
const home = (
  <Icon>
    <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
    <path d="M3 10a2 2 0 0 1 .71-1.53l7-6a2 2 0 0 1 2.58 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </Icon>
);
const calendar = (
  <Icon>
    <path d="M8 2v4M16 2v4" />
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M3 10h18" />
  </Icon>
);
const clock = (
  <Icon>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </Icon>
);
const play = (
  <Icon>
    <path d="M6 3 20 12 6 21Z" />
  </Icon>
);
const users = (
  <Icon>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </Icon>
);
const plus = (
  <Icon>
    <path d="M5 12h14M12 5v14" />
  </Icon>
);
const logIn = (
  <Icon>
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <path d="m10 17 5-5-5-5M15 12H3" />
  </Icon>
);
const moon = (
  <Icon>
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </Icon>
);

/** constants/index.ts sidebarLinks, with Sidebar.tsx's icon mapping. */
const links: [string, ReactNode][] = [
  ["Home", home],
  ["Upcoming", calendar],
  ["Previous", clock],
  ["Recordings", play],
  ["Personal Room", users],
];

/** MeetingTypeList.tsx: one orange card, then the app's #0E71EB blue. */
const cards: [string, string, ReactNode, string][] = [
  ["New Meeting", "Start an instant meeting", plus, "#ff742e"],
  ["Join Meeting", "via invitation link", logIn, "#0e71eb"],
  ["Schedule Meeting", "Plan your meeting", calendar, "#0e71eb"],
  ["View Recordings", "Meeting Recordings", play, "#0e71eb"],
];

/**
 * hero-background.png redrawn: a dark desk shot from above with a kraft
 * folder, a black notebook with its elastic band and a pencil, and a
 * succulent cropped by the top edge. Same 1080x303 frame, cover-cropped;
 * solid fills only, so no SVG ids repeat when the mockup renders twice.
 */
function HeroArt() {
  return (
    <svg
      className="hu-art"
      viewBox="0 0 1080 303"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* kraft folder, tabbed, sliding under the notebook */}
      <path
        d="M628 232 L626 214 L652 206 L866 66 L880 60 L898 76 L916 108 L906 303 L648 303 Z"
        fill="#c4a68e"
      />
      <path d="M652 206 L866 66" stroke="#dac6b8" strokeWidth="2" />
      {/* black notebook and the shadow it drops on the folder */}
      <path d="M714 226 L744 303 L728 303 L700 232 Z" fill="#8a6f62" />
      <path
        d="M714 226 Q714 208 730 200 L1026 60 Q1040 56 1048 70 L1080 128 L1080 303 L744 303 Z"
        fill="#3b4755"
      />
      <path
        d="M714 226 Q714 208 730 200 L1026 60"
        fill="none"
        stroke="#56626f"
        strokeWidth="3"
      />
      <path d="M1022 64 L1032 60 L1036 76 L1026 80 Z" fill="#8a2a2a" />
      {/* elastic band */}
      <path d="M752 186 L784 171 L826 303 L792 303 Z" fill="#0a1420" />
      {/* pencil: graphite, sharpened wood, black body */}
      <path d="M842 192 L851 196 L846 201 Z" fill="#2b2b2b" />
      <path d="M851 196 L872 210 L860 222 L846 201 Z" fill="#dccfc2" />
      <path d="M872 210 L972 303 L948 303 L860 222 Z" fill="#16212b" />
      {/* succulent in a white pot, cut by the top edge */}
      <path d="M800 0 L950 0 L940 34 Q920 48 880 46 Q830 42 812 26 Z" fill="#d3dfeb" />
      <path d="M812 26 Q830 42 880 46 Q920 48 940 34" fill="none" stroke="#aab7c6" strokeWidth="3" />
      <ellipse cx="868" cy="10" rx="22" ry="16" fill="#3a5530" />
      <ellipse cx="900" cy="20" rx="20" ry="15" fill="#2a4226" />
      <ellipse cx="928" cy="12" rx="22" ry="16" fill="#47663a" />
      <ellipse cx="954" cy="4" rx="18" ry="13" fill="#52713f" />
      <ellipse cx="894" cy="2" rx="18" ry="12" fill="#5c7d45" />
      <ellipse cx="846" cy="2" rx="16" ry="11" fill="#36502c" />
    </svg>
  );
}

/** Huddle's home screen: navbar, sidebar, clock hero and meeting cards. */
export function HuddleScreen() {
  return (
    <Mock
      name="hu"
      palette={{
        "--m-bg": "#1c1f2e",
        "--m-fg": "#ffffff",
        "--m-dim": "#9ca3af",
        "--m-acc": "#0e78f9",
        "--m-panel": "#161925",
        "--m-line": "#1e2757",
      }}
    >
      <Browser url="huddle · home">
        <div className="hu-app">
          <div className="hu-nav">
            <span className="hu-brand">
              <i className="hu-logo">{video}</i>
              <b>Huddle</b>
            </span>
            <span className="hu-nav-end">
              <i className="hu-theme">{moon}</i>
              <i className="hu-avatar">MR</i>
            </span>
          </div>

          <div className="hu-shell">
            <div className="hu-side">
              {links.map(([label, icon], i) => (
                <span
                  key={label}
                  className={`hu-link${i === 0 ? " hu-active" : ""}`}
                >
                  {icon}
                  {label}
                </span>
              ))}
            </div>

            <div className="hu-main">
              <div className="hu-hero rise">
                <HeroArt />
                <div className="hu-hero-in">
                  <span className="hu-pill">Upcoming Meeting at: 12:30 PM</span>
                  <div>
                    <b className="hu-time">11:28 AM</b>
                    <span className="hu-date">Friday, October 23, 2026</span>
                  </div>
                </div>
              </div>

              <div className="hu-cards">
                {cards.map(([title, desc, icon, color], i) => (
                  <div
                    key={title}
                    className="hu-card rise"
                    style={{ background: color, "--d": i + 1 } as CSSProperties}
                  >
                    <i className="hu-glass">{icon}</i>
                    <b>{title}</b>
                    <small>{desc}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Browser>
    </Mock>
  );
}
