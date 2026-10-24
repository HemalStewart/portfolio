import "./scholar-desktop.css";
import type { CSSProperties, ReactNode } from "react";
import { Mock } from "../kit";

const d = (n: number) => ({ "--d": n }) as CSSProperties;

/** The renderer's own stroke icons (24-unit grid, 1.8 stroke). */
const ICONS: Record<string, ReactNode> = {
  back: (
    <>
      <path d="M10.5 19.5 3 12l7.5-7.5" />
      <path d="M3 12h18" />
    </>
  ),
  forward: (
    <>
      <path d="M13.5 4.5 21 12l-7.5 7.5" />
      <path d="M3 12h18" />
    </>
  ),
  refresh: (
    <>
      <path d="M21 12a9 9 0 1 1-3.4-7" />
      <path d="M21 5v5h-5" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  x: (
    <>
      <path d="M18 6 6 18" />
      <path d="M6 6 18 18" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16.5 16.5 21 21" />
    </>
  ),
  bookmark: <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />,
  send: <path d="M5 12H19M19 12L12 5M19 12L12 19" />,
};

function Icon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <svg
      className={`sd-i ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {ICONS[name]}
    </svg>
  );
}

/**
 * Scholar Desktop (edu-ai-browser): the Electron window with the tab strip,
 * Study Session command bar and Reader Mode on the left, and the AI Tutor
 * chat on the right — iOS "liquid glass" whites with the renderer's blue.
 */
export function ScholarScreen() {
  return (
    <Mock
      name="sd"
      palette={{
        "--m-bg": "#dce3ef",
        "--m-fg": "#1d1d1f",
        "--m-dim": "#6e6e73",
        "--m-acc": "#2b7fff",
        "--m-panel": "#ffffff",
        "--m-line": "#e6e8ec",
      }}
    >
      <div className="sd-desk">
        <div className="sd-win">
          <div className="sd-titlebar">
            <span className="sd-lights">
              <i />
              <i />
              <i />
            </span>
            <b>Scholar Desktop</b>
          </div>

          <div className="sd-app">
            <div className="sd-main">
              <div className="sd-command">
                <div className="sd-tabs">
                  <span className="sd-tab is-active">
                    <i className="sd-dot" />
                    <span className="sd-tab-t">Chapter 4 · Photosynthesis</span>
                    <Icon name="x" className="sd-close" />
                  </span>
                  <span className="sd-tab">
                    <i className="sd-dot" />
                    <span className="sd-tab-t">en.wikipedia.org</span>
                  </span>
                  <span className="sd-tab">
                    <i className="sd-dot" />
                    <span className="sd-tab-t">khanacademy.org</span>
                  </span>
                  <span className="sd-newtab">
                    <Icon name="plus" />
                  </span>
                </div>

                <div className="sd-controls">
                  <span className="sd-eyebrow">Study Session</span>
                  <span className="sd-ctl">
                    <span className="sd-ib">
                      <Icon name="back" />
                    </span>
                    <span className="sd-ib">
                      <Icon name="forward" />
                    </span>
                    <span className="sd-ib">
                      <Icon name="refresh" />
                    </span>
                    <span className="sd-status">
                      <i />
                      Synced
                    </span>
                    <span className="sd-btn is-off">Show Library</span>
                    <span className="sd-btn">Hide AI Tutor</span>
                    <span className="sd-btn is-on">Close Reader</span>
                  </span>
                </div>

                <div className="sd-urlrow">
                  <span className="sd-field">
                    <Icon name="search" />
                    <span>
                      file:///Study/Biology/chapter-4-photosynthesis.pdf
                    </span>
                    <Icon name="bookmark" className="sd-mark" />
                  </span>
                  <span className="sd-go">Go</span>
                </div>
              </div>

              <div className="sd-view">
                <div className="sd-reader">
                  <div className="sd-rhead">
                    <span className="sd-rtitle">
                      <span className="sd-eyebrow">Reader Mode</span>
                      <b>Chapter 4 · Photosynthesis</b>
                      <span className="sd-synced">Synced 9:41 AM</span>
                    </span>
                    <span className="sd-rbtns">
                      <span className="sd-btn is-blue">Resync</span>
                      <span className="sd-btn is-quiet">Close</span>
                    </span>
                  </div>

                  <div className="sd-doc">
                    <p className="sd-h1">Chapter 4 · Photosynthesis</p>
                    <p>
                      Photosynthesis is the process plants, algae and some
                      bacteria use to turn light energy into chemical energy.
                      It takes place in the chloroplast, where carbon dioxide
                      and water are converted into glucose and oxygen.
                    </p>
                    <p className="sd-h2">4.1 Capturing light</p>
                    <p>
                      Each chloroplast holds stacks of thylakoid membranes
                      packed with pigments.{" "}
                      <span className="sd-sel">
                        Chlorophyll absorbs mostly red and blue light and
                        reflects green, which is why leaves look green.
                      </span>{" "}
                      Carotenoids absorb other wavelengths and pass that
                      energy on to chlorophyll.
                    </p>
                    <p className="sd-h2">4.2 Two linked stages</p>
                    <p>
                      The light-dependent reactions split water, release
                      oxygen and store energy in ATP and NADPH. The Calvin
                      cycle, in the stroma, spends that ATP and NADPH to fix
                      carbon dioxide into sugar.
                    </p>
                    <p className="sd-quote">
                      6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂
                    </p>
                  </div>

                  <div className="sd-pop">
                    <span className="sd-kicker">Selected Text</span>
                    <p className="sd-picked">
                      “Chlorophyll absorbs mostly red and blue light and
                      reflects green, which is why leaves look green.”
                    </p>
                    <div className="sd-explain">
                      <span className="sd-kicker">Explanation</span>
                      <p>
                        Sunlight mixes every colour. Chlorophyll soaks up the
                        red and blue parts to power the reaction and bounces
                        green back, so green is what reaches your eyes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="sd-tutor">
              <div className="sd-thead">
                <b>AI Tutor</b>
                <span className="sd-pills">
                  <span className="sd-pill is-model">Gemini (2.5 Flash)</span>
                  <span className="sd-pill is-read">Read Page</span>
                  <span className="sd-pill">Switch Model</span>
                </span>
              </div>

              <div className="sd-chat">
                <div className="sd-msg is-you rise" style={d(0)}>
                  <p className="sd-bubble">
                    Summarize: Chapter 4 · Photosynthesis
                  </p>
                  <span className="sd-who">You</span>
                </div>
                <div className="sd-msg rise" style={d(1)}>
                  <div className="sd-bubble">
                    <ul>
                      <li>Chlorophyll captures red and blue light.</li>
                      <li>Light reactions make ATP, NADPH and O₂.</li>
                      <li>The Calvin cycle fixes CO₂ into glucose.</li>
                    </ul>
                  </div>
                  <span className="sd-who">AI Tutor</span>
                </div>
                <div className="sd-msg is-you rise" style={d(2)}>
                  <p className="sd-bubble">
                    Create flashcards for: Chapter 4 · Photosynthesis
                  </p>
                  <span className="sd-who">You</span>
                </div>
                <div className="sd-msg rise" style={d(3)}>
                  <div className="sd-bubble">
                    <ol>
                      <li>
                        <b>Front:</b> What does chlorophyll absorb?{" "}
                        <i>|</i> <b>Back:</b> Mostly red and blue light.
                      </li>
                      <li>
                        <b>Front:</b> Where does the Calvin cycle run?{" "}
                        <i>|</i> <b>Back:</b> In the stroma.
                      </li>
                      <li>
                        <b>Front:</b> Which gas is released?{" "}
                        <i>|</i> <b>Back:</b> Oxygen, from split water.
                      </li>
                    </ol>
                  </div>
                  <span className="sd-who">AI Tutor</span>
                </div>
              </div>

              <div className="sd-ask">
                <span className="sd-input">Ask a question...</span>
                <span className="sd-send">
                  <Icon name="send" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Mock>
  );
}
