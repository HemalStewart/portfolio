import "./englishmind-ai.css";
import type { CSSProperties, ReactNode } from "react";
import { Browser, Mock } from "../kit";

const d = (n: number) => ({ "--d": n }) as CSSProperties;

/** Stroke icon on a 24-unit grid (Lucide-style, as a Next.js app ships). */
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

const MicIcon = () => (
  <Icon>
    <rect x="9" y="2" width="6" height="12" rx="3" />
    <path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4M8 22h8" />
  </Icon>
);
const CloudIcon = () => (
  <Icon>
    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
  </Icon>
);
const ServerIcon = () => (
  <Icon>
    <rect x="3" y="3" width="18" height="7" rx="2" />
    <rect x="3" y="14" width="18" height="7" rx="2" />
    <path d="M7 6.5h.01M7 17.5h.01" />
  </Icon>
);
const ClockIcon = () => (
  <Icon>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Icon>
);
const PauseIcon = () => (
  <Icon>
    <path d="M9 5v14M15 5v14" />
  </Icon>
);
const RedoIcon = () => (
  <Icon>
    <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
    <path d="M3 3v5h5" />
  </Icon>
);
const LinkIcon = () => (
  <Icon>
    <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" />
    <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
  </Icon>
);
const AlertIcon = () => (
  <Icon>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v4M12 16h.01" />
  </Icon>
);
const LockIcon = () => (
  <Icon>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </Icon>
);
const SparkIcon = () => (
  <Icon>
    <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
    <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" />
  </Icon>
);

/** Last ~6 s of mic amplitude: syllable bursts with a breath pause. */
const WAVE = [
  0.18, 0.34, 0.62, 0.88, 0.7, 0.46, 0.74, 0.96, 0.58, 0.3, 0.42, 0.68, 0.84,
  0.52, 0.26, 0.14, 0.08, 0.1, 0.22, 0.48, 0.8, 1, 0.72, 0.5, 0.66, 0.9, 0.62,
  0.36, 0.54, 0.78, 0.6, 0.32, 0.2, 0.38, 0.7, 0.92, 0.76, 0.44, 0.58, 0.82,
  0.64, 0.4, 0.24, 0.12, 0.08, 0.16, 0.42, 0.72, 0.56, 0.3,
];

/** Violet (#8b7bff) to pink (#f472b6) across the waveform. */
const mix = (t: number) => {
  const a = [139, 123, 255];
  const b = [244, 114, 182];
  const c = a.map((v, i) => Math.round(v + (b[i] - v) * t));
  return `rgb(${c[0]} ${c[1]} ${c[2]})`;
};

const SCORES: [string, number][] = [
  ["Fluency", 78],
  ["Grammar", 71],
  ["Vocabulary", 82],
  ["Pronunciation", 74],
];

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

/**
 * EnglishMind AI speaking test, mid-answer: the prompt, the live Whisper
 * recording and transcript, and the LLM's running CEFR assessment, in the
 * app's dark navy and violet-to-pink theme (self-hosted offline mode).
 */
export function EnglishMindScreen() {
  return (
    <Mock
      name="em"
      palette={{
        "--m-bg": "#0b1029",
        "--m-fg": "#eef0ff",
        "--m-dim": "#959cc9",
        "--m-acc": "#8b7bff",
        "--m-panel": "#141a3d",
        "--m-line": "rgb(139 150 255 / 0.16)",
      }}
    >
      <Browser url="localhost:3000/practice/speaking">
        <div className="em-app">
          <header className="em-top">
            <span className="em-logo">
              <span className="em-mark">
                <MicIcon />
              </span>
              <b>EnglishMind</b>
              <em>AI</em>
            </span>
            <nav className="em-nav">
              <span className="is-on">Practice</span>
              <span>Mock test</span>
              <span>Progress</span>
              <span>History</span>
            </nav>
            <span className="em-mode">
              <span>
                <CloudIcon />
                Cloud
              </span>
              <span className="is-on">
                <ServerIcon />
                Offline
              </span>
            </span>
            <span className="em-avatar">NP</span>
          </header>

          <div className="em-main">
            <div className="em-col">
              <section className="em-card em-prompt rise" style={d(0)}>
                <div className="em-row">
                  <span className="em-tag">Speaking · Part 2</span>
                  <small className="em-push">Question 3 of 5</small>
                </div>
                <p className="em-q">
                  Describe your favourite place in Sri Lanka and why you like
                  it.
                </p>
                <div className="em-hints">
                  <span>Where it is</span>
                  <span>What you do there</span>
                  <span>Why it’s special</span>
                  <small className="em-push em-meta">
                    <ClockIcon />
                    Speak 1–2 min
                  </small>
                </div>
              </section>

              <section className="em-card em-rec rise" style={d(1)}>
                <div className="em-row">
                  <span className="em-pill">
                    <i />
                    Recording · Whisper ASR
                  </span>
                  <small>16 kHz · Built-in microphone</small>
                  <span className="em-timer em-push">
                    00:42<small>/ 02:00</small>
                  </span>
                </div>
                <div className="em-wave">
                  {WAVE.map((h, i) => (
                    <i
                      key={i}
                      className="grow-y"
                      style={
                        {
                          height: `${Math.round(h * 100)}%`,
                          background: mix(i / (WAVE.length - 1)),
                          "--d": (i * 0.06).toFixed(2),
                        } as CSSProperties
                      }
                    />
                  ))}
                </div>
                <div className="em-ctrl">
                  <span className="em-btn">
                    <RedoIcon />
                    Re-record
                  </span>
                  <span className="em-prog">
                    <i className="grow-x" />
                    <b />
                  </span>
                  <span className="em-btn">
                    <PauseIcon />
                    Pause
                  </span>
                  <span className="em-stop">
                    <i />
                  </span>
                </div>
              </section>

              <section className="em-card em-tx rise" style={d(2)}>
                <div className="em-row">
                  <b>Live transcript</b>
                  <small className="em-push">en · 57 words · 81 wpm</small>
                </div>
                <p>
                  My favourite place is Ella <u>because</u> the mountains are
                  so green and the air is cool. Last year I <mark>visit</mark>{" "}
                  there with my family and we climbed Little Adam’s Peak early
                  in the morning. The view from the top was amazing,{" "}
                  <span className="em-filler">um,</span> you can see the whole
                  valley and the Nine Arch Bridge.{" "}
                  <span className="em-interim">I also like the</span>
                  <i className="em-caret" />
                </p>
              </section>
            </div>

            <aside className="em-card em-res rise" style={d(1)}>
              <div className="em-row">
                <span className="em-title">
                  <SparkIcon />
                  <b>CEFR assessment</b>
                </span>
                <span className="em-live em-push">
                  <i />
                  Live
                </span>
              </div>

              <div className="em-level">
                <span className="em-badge">B2</span>
                <span>
                  <b>Upper-Intermediate</b>
                  <small>Overall 76 / 100</small>
                  <small className="em-up">▲ 4 since last attempt</small>
                </span>
                <q>Can interact with a degree of fluency and spontaneity.</q>
              </div>

              <div className="em-scale">
                {LEVELS.map((l, i) => (
                  <span
                    key={l}
                    className={i === 3 ? "is-cur" : i < 3 ? "is-on" : ""}
                  >
                    {l}
                  </span>
                ))}
              </div>

              <div className="em-scores">
                {SCORES.map(([k, v], i) => (
                  <div key={k} className="em-score">
                    <span>{k}</span>
                    <b>{v}</b>
                    <span className="em-track">
                      <i className="grow-x" style={{ width: `${v}%`, ...d(i) }} />
                    </span>
                  </div>
                ))}
              </div>

              <div className="em-tips">
                <small className="em-h">Feedback · 2 tips</small>
                <div className="em-tip">
                  <LinkIcon />
                  <span>
                    Link ideas with ‘however’ or ‘although’.
                    <small>Coherence</small>
                  </span>
                </div>
                <div className="em-tip is-warn">
                  <AlertIcon />
                  <span>
                    Watch past-tense endings: ‘visited’, not ‘visit’.
                    <small>Grammar · 1 in transcript</small>
                  </span>
                </div>
              </div>

              <div className="em-foot">
                <LockIcon />
                Graded on this device
                <span className="em-push">FastAPI :8000 · 1.2 s</span>
              </div>
            </aside>
          </div>
        </div>
      </Browser>
    </Mock>
  );
}
