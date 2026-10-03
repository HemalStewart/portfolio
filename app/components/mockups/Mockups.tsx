import "./mockups.css";
import type { CSSProperties, ReactNode } from "react";
import { Bars, Browser, LineChart, Mock, Phone, Sk } from "./kit";

/*
 * Code-built interface mockups — no raster assets. Each one sketches the real
 * product's layout and vocabulary (from its live app or store listing); values
 * are skeletons except where the case study states them.
 */

const d = (i: number) => ({ "--d": i }) as CSSProperties;

function SideNav({
  brand,
  items,
  active = 0,
}: {
  brand: ReactNode;
  items: string[];
  active?: number;
}) {
  return (
    <aside className="m-side">
      <div className="m-brand">{brand}</div>
      {items.map((item, i) => (
        <span key={item} className={i === active ? "m-nav is-active" : "m-nav"}>
          <i className="m-ico" />
          {item}
        </span>
      ))}
    </aside>
  );
}

function LinkForex() {
  const kpis = [
    "Transfers",
    "Transfer volume",
    "Pending transfers",
    "Active users",
    "Pending KYC",
    "New customers",
  ];
  return (
    <Mock
      name="linkforex"
      palette={{
        "--m-bg": "#0d1a1c",
        "--m-panel": "#132427",
        "--m-line": "#1f3538",
        "--m-fg": "#e3f1ee",
        "--m-dim": "#7f9b97",
        "--m-acc": "#19b8a6",
      }}
    >
      <Browser url="linkforex.vercel.app/admin/dashboard">
        <div className="m-app">
          <SideNav
            brand={
              <b>
                LINK<span style={{ color: "var(--m-acc)" }}>FOREX</span>
              </b>
            }
            items={[
              "Dashboard",
              "Operations",
              "Master data",
              "Reports",
              "Mobile controls",
              "Configuration",
            ]}
          />
          <div className="m-main">
            <div className="m-top">
              <span className="m-search">Search remitters and transfers…</span>
              <span className="m-btn">+ New transfer</span>
            </div>
            <b className="m-h">Dashboard</b>
            <div className="m-kpis six">
              {kpis.map((k, i) => (
                <div key={k} className="m-card rise" style={d(i)}>
                  <small>{k}</small>
                  <Sk w={45} className="tall" />
                </div>
              ))}
            </div>
            <div className="m-split">
              <div className="m-card">
                <small>Flow overview · 30 days</small>
                <LineChart
                  series={[
                    {
                      points: [
                        0.05, 0.08, 0.06, 0.1, 0.12, 0.1, 0.2, 0.18, 0.35, 0.3,
                        0.62, 0.95,
                      ],
                      color: "var(--m-acc)",
                      fill: true,
                    },
                    {
                      points: [
                        0.02, 0.04, 0.05, 0.04, 0.08, 0.12, 0.1, 0.16, 0.22,
                        0.5, 0.78, 0.4,
                      ],
                      color: "#f2b33d",
                    },
                  ]}
                />
              </div>
              <div className="m-card m-list">
                <small>Recent activity</small>
                {["Approved", "Verify docs", "Approved"].map((s, i) => (
                  <div key={i} className="m-row rise" style={d(i + 4)}>
                    <i className="m-avatar">{["AR", "SK", "NP"][i]}</i>
                    <span>
                      <Sk w={70} />
                      <Sk w={40} />
                    </span>
                    <em className={s === "Approved" ? "m-pill ok" : "m-pill"}>
                      {s}
                    </em>
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

function ChatSoul() {
  return (
    <Mock
      name="chatsoul"
      palette={{
        "--m-bg": "#140f0a",
        "--m-fg": "#fff4e6",
        "--m-dim": "#b79c7d",
        "--m-acc": "#f6a31b",
        "--m-panel": "#221a12",
      }}
    >
      <div className="m-glow" />
      <Phone className="tilt-l">
        <div className="m-appbar">
          <b>For You</b>
          <i className="m-coin">◆ 120</i>
        </div>
        <div className="m-hero-card">
          <div className="m-portrait" />
          <div className="m-hero-meta">
            <b>Talia</b>
            <small>Romantic companion</small>
            <span className="m-chip">Companion</span>
          </div>
        </div>
        <div className="m-tabs">
          {["♥", "◎", "✉", "+"].map((t, i) => (
            <i key={t} className={i === 0 ? "is-active" : ""}>
              {t}
            </i>
          ))}
        </div>
      </Phone>
      <Phone className="tilt-r">
        <div className="m-appbar">
          <i className="m-avatar">Mi</i>
          <span>
            <b>Mimi</b>
            <small>Gamer girl</small>
          </span>
        </div>
        <div className="m-chat">
          <p className="me rise" style={d(0)}>
            what are you doing?
          </p>
          <p className="them rise" style={d(2)}>
            Just winding down after a long day — tell me about yours ✨
          </p>
          <p className="me rise" style={d(4)}>
            ask me a photo
          </p>
          <p className="them typing rise" style={d(6)}>
            <i />
            <i />
            <i />
          </p>
        </div>
        <div className="m-composer">
          <span>Tell me how your day feels…</span>
          <i>➤</i>
        </div>
      </Phone>
    </Mock>
  );
}

function WriteScan() {
  return (
    <Mock
      name="writescan"
      palette={{
        "--m-bg": "#e7f2fb",
        "--m-fg": "#0d2a45",
        "--m-dim": "#5b7690",
        "--m-acc": "#1479c9",
        "--m-panel": "#ffffff",
      }}
    >
      <Phone className="tilt-l">
        <div className="m-appbar">
          <b>WriteScan</b>
          <small>AI Doc Scanner</small>
        </div>
        <div className="m-viewfinder">
          <div className="m-doc">
            <Sk w={80} />
            <Sk w={95} />
            <Sk w={60} />
            <Sk w={88} />
            <Sk w={72} />
          </div>
          <span className="m-corner tl" />
          <span className="m-corner tr" />
          <span className="m-corner bl" />
          <span className="m-corner br" />
          <span className="m-scanline" />
        </div>
        <div className="m-modes">
          {["Text", "Handwriting", "CSV", "PDF"].map((m, i) => (
            <span key={m} className={i === 1 ? "is-active" : ""}>
              {m}
            </span>
          ))}
        </div>
      </Phone>
      <Phone className="tilt-r">
        <div className="m-appbar">
          <b>All documents</b>
        </div>
        {["Project plan", "Class notes", "Invoice.csv", "Meeting notes"].map(
          (t, i) => (
            <div key={t} className="m-docrow rise" style={d(i)}>
              <i className="m-docico">{["T", "H", "C", "T"][i]}</i>
              <span>
                <b>{t}</b>
                <Sk w={55} />
              </span>
            </div>
          ),
        )}
        <div className="m-bot rise" style={d(5)}>
          <i>✦</i>
          <span>Ask the AI document bot…</span>
        </div>
      </Phone>
    </Mock>
  );
}

function Pdms() {
  const stats = [
    ["Student", "7056"],
    ["Guardian", "5632"],
    ["Teacher", "5686"],
    ["Employee", "1359"],
  ];
  return (
    <Mock
      name="pdms"
      palette={{
        "--m-bg": "#eef1f7",
        "--m-fg": "#0d1f4d",
        "--m-dim": "#5d6a88",
        "--m-acc": "#0b2a6b",
        "--m-panel": "#ffffff",
        "--m-line": "#d9deea",
      }}
    >
      <Browser url="pdms.moe.gov.lk/dashboard">
        <div className="m-app">
          <SideNav
            brand={<b>PDMS</b>}
            items={[
              "Dashboard",
              "Administrator",
              "Human resource",
              "Teacher",
              "Academic",
              "Manage student",
              "Attendance",
              "Manage exam",
              "Library",
              "Report",
            ]}
          />
          <div className="m-main">
            <div className="m-banner">
              Ministry of Education | Division of Piriven Education
            </div>
            <div className="m-kpis four">
              {stats.map(([k, v], i) => (
                <div key={k} className="m-card m-stat rise" style={d(i)}>
                  <small>{k}</small>
                  <b>{v}</b>
                </div>
              ))}
            </div>
            <div className="m-split">
              <div className="m-card">
                <small>Calendar · October</small>
                <div className="m-cal">
                  {Array.from({ length: 28 }, (_, i) => (
                    <i key={i} className={i === 5 ? "is-today" : ""} />
                  ))}
                </div>
              </div>
              <div className="m-card">
                <small>Messages</small>
                <Bars
                  values={[0.05, 0.9, 0.9, 0.05, 0.05]}
                  color="var(--m-acc)"
                />
              </div>
            </div>
          </div>
        </div>
      </Browser>
    </Mock>
  );
}

function SmartGuardian() {
  return (
    <Mock
      name="guardian"
      palette={{
        "--m-bg": "#07131f",
        "--m-fg": "#e8f4ff",
        "--m-dim": "#86a0b8",
        "--m-acc": "#22c55e",
        "--m-panel": "#0f2133",
      }}
    >
      <div className="m-glow" />
      <Phone className="tilt-l">
        <div className="m-map">
          <svg viewBox="0 0 100 160" preserveAspectRatio="none">
            <path
              d="M-5 40 C30 50 50 20 105 35 M10 165 C20 110 60 90 70 -5 M-5 120 C40 100 70 130 105 110"
              className="m-road"
            />
            <path
              d="M18 128 C30 100 52 96 62 60 S80 30 84 24"
              className="m-route draw"
              pathLength={1}
            />
          </svg>
          {[
            ["Me", 18, 78],
            ["Wi", 60, 36],
            ["Da", 84, 15],
          ].map(([t, x, y], i) => (
            <i
              key={t}
              className="m-pin rise"
              style={{ left: `${x}%`, top: `${y}%`, ...d(i) }}
            >
              {t}
            </i>
          ))}
        </div>
        <div className="m-sheet">
          <b>Family circle</b>
          {["Me · 83%", "Wife · 48%", "Daughter · 25%"].map((t) => (
            <span key={t}>
              <i />
              {t}
            </span>
          ))}
        </div>
      </Phone>
      <Phone className="tilt-r">
        <div className="m-sos-screen">
          <small>Hold for 3 seconds</small>
          <span className="m-sos">SOS</span>
          <small>Alerts go to your trusted circle with live location</small>
        </div>
      </Phone>
    </Mock>
  );
}

function NoviceMonk() {
  const kpis = [
    ["Total applications", "552"],
    ["Awaiting review", "40"],
    ["Active pirivens", "824"],
    ["Approval rate", "92.8%"],
  ];
  return (
    <Mock
      name="novice"
      palette={{
        "--m-bg": "#f3f5f9",
        "--m-fg": "#16224a",
        "--m-dim": "#66708c",
        "--m-acc": "#24398c",
        "--m-panel": "#ffffff",
        "--m-line": "#e0e4ee",
      }}
    >
      <Browser url="novice-monk-admin.vercel.app/admin">
        <div className="m-app">
          <SideNav
            brand={
              <b>
                Novice Monk <small>Registry</small>
              </b>
            }
            items={[
              "Overview",
              "Applications",
              "Districts",
              "Piriven accounts",
              "User access",
              "System status",
            ]}
          />
          <div className="m-main">
            <small className="m-eyebrow">Registry overview</small>
            <b className="m-h serif">Good afternoon, Division.</b>
            <div className="m-kpis four">
              {kpis.map(([k, v], i) => (
                <div key={k} className="m-card m-stat rise" style={d(i)}>
                  <small>{k}</small>
                  <b>{v}</b>
                </div>
              ))}
            </div>
            <div className="m-split">
              <div className="m-card">
                <small>Application activity</small>
                <Bars
                  values={[0.02, 0.02, 0.02, 0.02, 1, 0.02]}
                  color="var(--m-acc)"
                />
              </div>
              <div className="m-card m-status">
                <small>Review status</small>
                {[
                  ["Approved", 93, "var(--m-acc)"],
                  ["Under review", 7, "#d39b16"],
                  ["Returned", 0, "#d24b4b"],
                ].map(([k, w, c], i) => (
                  <span key={k as string}>
                    {k}
                    <i>
                      <i
                        className="grow-x"
                        style={{
                          width: `${w}%`,
                          background: c as string,
                          ...d(i),
                        }}
                      />
                    </i>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Browser>
    </Mock>
  );
}

function Huddle() {
  const tiles = [
    ["△", "#3b82f6"],
    ["□", "#8b5cf6"],
    ["◇", "#f59e0b"],
    ["○", "#14b8a6"],
  ];
  return (
    <Mock
      name="huddle"
      palette={{
        "--m-bg": "#0b0f17",
        "--m-fg": "#e8edf7",
        "--m-dim": "#8a94a8",
        "--m-acc": "#3b82f6",
        "--m-panel": "#151b27",
      }}
    >
      <Browser url="huddle · meeting room">
        <div className="m-video">
          {tiles.map(([s, c], i) => (
            <div key={s} className="m-tile rise" style={d(i)}>
              <i style={{ background: c }}>{s}</i>
              <small>
                <span className="m-live" />
                <Sk w={40} />
              </small>
            </div>
          ))}
        </div>
        <div className="m-controls">
          {["🎙", "📷", "▣", "☺"].map((c) => (
            <i key={c}>{c}</i>
          ))}
          <i className="end">✕</i>
        </div>
      </Browser>
    </Mock>
  );
}

function Scholar() {
  return (
    <Mock
      name="scholar"
      palette={{
        "--m-bg": "#f4f2fb",
        "--m-fg": "#1e1b3a",
        "--m-dim": "#6b6890",
        "--m-acc": "#6d5ce8",
        "--m-panel": "#ffffff",
        "--m-line": "#e3e0f1",
      }}
    >
      <Browser url="Scholar Desktop">
        <div className="m-reader">
          <div className="m-page">
            <b>Chapter 4 · Photosynthesis</b>
            {[92, 98, 85, 96, 60, 94, 88, 97, 70].map((w, i) => (
              <Sk key={i} w={w} className={i === 2 || i === 3 ? "hl" : ""} />
            ))}
          </div>
          <div className="m-ai">
            <div className="m-seg">
              {["Summarize", "Explain", "Flashcards", "Quiz"].map((t, i) => (
                <span key={t} className={i === 0 ? "is-active" : ""}>
                  {t}
                </span>
              ))}
            </div>
            {[0, 1, 2].map((i) => (
              <div key={i} className="m-bubble rise" style={d(i)}>
                <Sk w={90} />
                <Sk w={70} />
              </div>
            ))}
            <small className="m-provider">Gemini ⇄ OpenAI</small>
          </div>
        </div>
      </Browser>
    </Mock>
  );
}

function PaperMind() {
  return (
    <Mock
      name="papermind"
      palette={{
        "--m-bg": "#f2f5f3",
        "--m-fg": "#14231b",
        "--m-dim": "#5f7268",
        "--m-acc": "#15803d",
        "--m-panel": "#ffffff",
        "--m-line": "#dfe7e2",
      }}
    >
      <Browser url="papermind · chat">
        <div className="m-pm">
          <div className="m-top">
            <span className="m-seg">
              <span className="is-active">OpenAI</span>
              <span>Gemini</span>
            </span>
            <span className="m-file">▤ notes.pdf · OCR ✓</span>
          </div>
          <div className="m-chat light">
            <p className="me rise" style={d(0)}>
              Summarize section 2 of my notes
            </p>
            <p className="them rise" style={d(2)}>
              <Sk w={95} />
              <Sk w={88} />
              <Sk w={60} />
            </p>
            <p className="me rise" style={d(4)}>
              Cite the page
            </p>
          </div>
          <div className="m-composer light">
            <span>Ask about your documents…</span>
            <i>➤</i>
          </div>
        </div>
      </Browser>
    </Mock>
  );
}

function EnglishMind() {
  const wave = [
    0.3, 0.6, 0.9, 0.5, 0.7, 1, 0.6, 0.4, 0.8, 0.55, 0.3, 0.7, 0.9, 0.45, 0.6,
    0.35, 0.75, 0.5, 0.25, 0.6,
  ];
  return (
    <Mock
      name="english"
      palette={{
        "--m-bg": "#0f1530",
        "--m-fg": "#eef0ff",
        "--m-dim": "#9aa3d0",
        "--m-acc": "#8b9bff",
        "--m-panel": "#18204a",
      }}
    >
      <Browser url="englishmind · speaking test">
        <div className="m-em">
          <div className="m-mic">
            <span className="m-rec">● Recording · Whisper ASR</span>
            <div className="m-wave">
              {wave.map((h, i) => (
                <i key={i} style={{ height: `${h * 100}%`, ...d(i) }} />
              ))}
            </div>
          </div>
          <div className="m-score">
            <span className="m-cefr">B2</span>
            {[
              ["Fluency", 78],
              ["Grammar", 71],
              ["Vocabulary", 84],
            ].map(([k, v], i) => (
              <span key={k} className="m-meter">
                <small>{k}</small>
                <i>
                  <i className="grow-x" style={{ width: `${v}%`, ...d(i) }} />
                </i>
              </span>
            ))}
          </div>
        </div>
      </Browser>
    </Mock>
  );
}

function SeaCloud() {
  return (
    <Mock
      name="seacloud"
      palette={{
        "--m-bg": "#f6eee4",
        "--m-fg": "#2b1d12",
        "--m-dim": "#7d6654",
        "--m-acc": "#d9741c",
        "--m-panel": "#fffaf3",
      }}
    >
      <Browser url="hotel-kohl-ten.vercel.app">
        <div className="m-sc">
          <div className="m-sky">
            <span className="m-sun" />
            <svg
              viewBox="0 0 100 30"
              preserveAspectRatio="none"
              className="m-sea"
            >
              <path d="M0 14 C20 10 30 18 50 14 S80 10 100 14 V30 H0Z" />
            </svg>
            <nav>
              <b>☁ Sea Cloud</b>
              <span>
                <Sk w={100} />
                <Sk w={100} />
                <Sk w={100} />
              </span>
            </nav>
            <div className="m-headline">
              <b>Dalawella, Sri Lanka</b>
              <Sk w={60} />
            </div>
          </div>
          <div className="m-book rise" style={d(2)}>
            <span>
              <small>Check-in</small>
              <Sk w={70} />
            </span>
            <span>
              <small>Check-out</small>
              <Sk w={70} />
            </span>
            <span>
              <small>Guests</small>
              <Sk w={50} />
            </span>
            <i>Request</i>
          </div>
        </div>
      </Browser>
    </Mock>
  );
}

const MOCKUPS: Record<string, () => React.JSX.Element> = {
  linkforex: LinkForex,
  "chatsoul-ai": ChatSoul,
  writescan: WriteScan,
  pdms: Pdms,
  "smart-guardian-pro": SmartGuardian,
  "novice-monk-registry": NoviceMonk,
  huddle: Huddle,
  "scholar-desktop": Scholar,
  papermind: PaperMind,
  "englishmind-ai": EnglishMind,
  "sea-cloud-dalawella": SeaCloud,
};

export function ProjectMockup({ slug }: { slug: string }) {
  const Component = MOCKUPS[slug];
  return Component ? <Component /> : null;
}
