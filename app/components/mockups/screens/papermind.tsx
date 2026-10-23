import "./papermind.css";
import type { CSSProperties, ReactNode } from "react";
import { Browser, Mock } from "../kit";

const d = (n: number) => ({ "--d": n }) as CSSProperties;

/** Stroke icon on a 24-unit grid (the app uses Feather-style glyphs). */
function Icon({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <svg
      className={`pm-ico ${className}`}
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

const FileIcon = () => (
  <Icon>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <path d="M14 2v6h6" />
  </Icon>
);

const Check = () => (
  <Icon className="pm-check">
    <path d="M20 6 9 17l-5-5" />
  </Icon>
);

/** Background art for each topic card (the app uses illustrated thumbnails). */
const ART: Record<string, ReactNode> = {
  quantum: (
    <>
      <path d="M2 24c4-14 6-14 9 0s5 14 9 0 5-14 9 0 5 14 9 0" />
      <path d="M2 30c4-6 6-6 9 0s5 6 9 0 5-6 9 0 5 6 9 0" opacity=".5" />
    </>
  ),
  electrons: (
    <>
      <ellipse cx="20" cy="20" rx="17" ry="6.5" />
      <ellipse cx="20" cy="20" rx="17" ry="6.5" transform="rotate(60 20 20)" />
      <ellipse cx="20" cy="20" rx="17" ry="6.5" transform="rotate(-60 20 20)" />
    </>
  ),
  nuclear: (
    <>
      <circle cx="20" cy="20" r="15" strokeDasharray="3 4" />
      <circle cx="17" cy="18" r="3.4" />
      <circle cx="23" cy="18" r="3.4" />
      <circle cx="20" cy="23" r="3.4" />
    </>
  ),
  mechanics: (
    <>
      <path d="M3 34h34L3 14z" />
      <path d="m12 17.5 7 4-3 5.2-7-4z" />
      <circle cx="31" cy="9" r="4" />
    </>
  ),
  optics: (
    <>
      <path d="M20 5c5 8 5 22 0 30-5-8-5-22 0-30z" />
      <path d="M1 12h19l17 8M1 28h19l17-8M1 20h36" opacity=".7" />
    </>
  ),
  thermal: (
    <>
      <path d="M11 34c-4-5 4-8 0-13s4-8 0-13" />
      <path d="M20 34c-4-5 4-8 0-13s4-8 0-13" />
      <path d="M29 34c-4-5 4-8 0-13s4-8 0-13" />
    </>
  ),
};

/** The topic carousel from the app's home screen (first six in view). */
const TOPICS = [
  { title: "Quantum", art: "quantum", color: "#615fff" },
  { title: "Electrons", art: "electrons", color: "#2b7fff" },
  { title: "Nuclear", art: "nuclear", color: "#ff2056" },
  { title: "Mechanics", art: "mechanics", color: "#00bc7d" },
  { title: "Optics", art: "optics", color: "#ff6900" },
  { title: "Thermal", art: "thermal", color: "#ad46ff" },
];

const TUTOR = [
  { title: "Teacher Mode", body: "Lesson plans, worksheets, marking schemes." },
  { title: "Student Mode", body: "Step-by-step tutoring and weak-area focus.", on: true },
  { title: "Exam Mode", body: "Timed practice with grading and analytics." },
  { title: "Revision Mode", body: "Flashcards, quizzes, spaced repetition." },
];

/**
 * PaperMind (repo: chat-bot) — the "AI Agent Browser" tutor for Sri Lankan
 * A/L Physics: glass sidebar with documents, past papers and tutor modes;
 * topic carousel; and a document-grounded chat with cited sources.
 */
export function PaperMindScreen() {
  return (
    <Mock
      name="pm"
      palette={{
        "--m-bg": "#f5f7fa",
        "--m-fg": "#1d1d1f",
        "--m-dim": "#77787c",
        "--m-acc": "#2b7fff",
        "--m-panel": "#ffffff",
        "--m-line": "#e4e7ec",
      }}
    >
      <Browser url="papermind · chat">
        <div className="pm-app">
          {/* ---------------- sidebar ---------------- */}
          <aside className="pm-side pm-glass">
            <div className="pm-row">
              <span className="pm-row pm-tight">
                <b className="pm-h2">Controls</b>
                <span className="pm-theme">
                  <Icon>
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </Icon>
                </span>
              </span>
              <span className="pm-link">Reset</span>
            </div>

            <div className="pm-sec">
              <div className="pm-row">
                <b className="pm-h3">Documents</b>
                <span className="pm-faint">Clear</span>
              </div>
              <div className="pm-doc">
                <FileIcon />
                <span>wave-optics-notes.pdf</span>
              </div>
              <div className="pm-doc">
                <FileIcon />
                <span>A/L Physics · 2023 · Paper 1 Structured · Q01</span>
              </div>

              <div className="pm-papers pm-glass">
                <b className="pm-h3">Past Papers</b>
                <p className="pm-note">Search papers and open marking schemes.</p>
                <span className="pm-input">
                  <Icon>
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.5-3.5" />
                  </Icon>
                  Search by year, topic, or title
                </span>
                <div className="pm-card">
                  <span className="pm-label">Active paper</span>
                  <b className="pm-meta">A/L Physics · 2023 · Paper 1 Structured</b>
                  <span className="pm-select">
                    2023 · Paper 1 Structured
                    <i>▼</i>
                  </span>
                </div>
                <div className="pm-q pm-on">
                  <b>Q01</b>
                  <span>
                    A ball is projected vertically upward with speed 18 m s⁻¹.
                    Calculate the maximum height reached.
                  </span>
                </div>
                <div className="pm-q">
                  <b>Q02</b>
                  <span>
                    A 4 Ω resistor and a 6 Ω resistor are connected in parallel
                    to a 12 V source.
                  </span>
                </div>
              </div>
            </div>

            <div className="pm-sec">
              <b className="pm-h3">Tutor</b>
              {TUTOR.map((m) => (
                <div key={m.title} className={`pm-mode${m.on ? " pm-on" : ""}`}>
                  <b>{m.title}</b>
                  <span>{m.body}</span>
                </div>
              ))}
            </div>
          </aside>

          {/* ---------------- main ---------------- */}
          <div className="pm-main">
            <div className="pm-carousel">
              <div className="pm-topics">
                {TOPICS.map((t, i) => (
                  <span
                    key={t.title}
                    className="pm-topic rise"
                    style={{ "--c": t.color, ...d(i) } as CSSProperties}
                  >
                    <svg
                      className="pm-art"
                      viewBox="0 0 40 40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      preserveAspectRatio="xMidYMid slice"
                    >
                      {ART[t.art]}
                    </svg>
                    <span className="pm-spark">
                      <svg viewBox="0 0 24 24">
                        <path d="M10 2.5c.6 4.6 2.4 6.6 7 7.3-4.6.7-6.4 2.7-7 7.3-.6-4.6-2.4-6.6-7-7.3 4.6-.7 6.4-2.7 7-7.3z" />
                        <path d="M18.5 13.5c.3 2.2 1.1 3.1 3.2 3.4-2.1.3-2.9 1.2-3.2 3.4-.3-2.2-1.1-3.1-3.2-3.4 2.1-.3 2.9-1.2 3.2-3.4z" />
                        <path d="M18 1.8c.2 1.4.7 2 2 2.2-1.3.2-1.8.8-2 2.2-.2-1.4-.7-2-2-2.2 1.3-.2 1.8-.8 2-2.2z" />
                      </svg>
                    </span>
                    <b>{t.title}</b>
                  </span>
                ))}
              </div>
              <div className="pm-dots">
                <Icon className="pm-chev">
                  <path d="M15 18 9 12l6-6" />
                </Icon>
                <span>
                  {Array.from({ length: 12 }, (_, i) => (
                    <i key={i} className={i === 0 ? "pm-on" : ""} />
                  ))}
                </span>
                <Icon className="pm-chev">
                  <path d="m9 18 6-6-6-6" />
                </Icon>
              </div>
            </div>

            <div className="pm-head">
              <div>
                <h1>AI Agent Browser</h1>
                <p>The educational assistant for Sri Lankan A/L Physics.</p>
              </div>
              <div className="pm-lang">
                <span className="pm-label">Response Language</span>
                <span className="pm-seg">
                  <i className="pm-on">English</i>
                  <i>සිංහල</i>
                  <i>தமிழ்</i>
                </span>
              </div>
            </div>

            <section className="pm-thread pm-glass">
              <div className="pm-row">
                <span className="pm-row pm-tight">
                  <span className="pm-ready">
                    <i />
                    Ready
                  </span>
                  <span className="pm-seg pm-prov">
                    <i className="pm-on">OpenAI</i>
                    <i>Gemini</i>
                  </span>
                  <span className="pm-model">gpt-4o-mini</span>
                  <span className="pm-ms">842ms</span>
                </span>
                <span className="pm-turns">2 turns</span>
              </div>

              <div className="pm-msgs">
                <span className="pm-attach rise" style={d(0)}>
                  <FileIcon />
                  <b>wave-optics-notes.pdf</b>
                  <span className="pm-ocr">
                    OCR
                    <Check />
                  </span>
                  <span>12 pages</span>
                </span>

                <p className="pm-me rise" style={d(1)}>
                  Summarise section 2 of my notes
                </p>

                <div className="pm-ai rise" style={d(3)}>
                  <p>
                    <strong>Section 2 · Interference of light</strong>
                  </p>
                  <ul>
                    <li>
                      <strong>Coherent sources</strong> keep a constant phase
                      difference, so the fringes stay steady.
                    </li>
                    <li>
                      Bright fringes where path difference = nλ; dark where it
                      is (n + ½)λ.
                    </li>
                    <li>
                      Fringe width <code>β = λD / d</code> — wider for longer λ
                      or a larger screen distance D.
                    </li>
                  </ul>
                  <div className="pm-sources">
                    <span className="pm-label">Sources</span>
                    <div className="pm-src">
                      <FileIcon />
                      <b>wave-optics-notes.pdf</b>
                      <span className="pm-page">p. 4</span>
                    </div>
                    <span className="pm-snip">
                      “Young’s double-slit: light from S₁ and S₂ superposes on the
                      screen to give equally spaced fringes…”
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <div className="pm-composer pm-glass">
              <span className="pm-clip">
                <Icon>
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </Icon>
              </span>
              <span className="pm-ph">Type your message...</span>
              <span className="pm-send">Send</span>
            </div>
          </div>
        </div>
      </Browser>
    </Mock>
  );
}
