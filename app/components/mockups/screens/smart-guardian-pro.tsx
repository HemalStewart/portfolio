import "./smart-guardian-pro.css";
import type { CSSProperties, ReactNode } from "react";
import { Mock } from "../kit";

/* Smart Guardian: three of its Google Play promo panels, rebuilt in code.
   1. Stay Connected (circle onboarding), 2. Live Location Updates (map),
   3. Live Battery Status (Nexus group card). */

type Sky = "sun" | "rain";
type Member = {
  name: string;
  place: string;
  pct: number;
  temp: number;
  sky: Sky;
  hue: string;
  tone: string;
};

const GREEN = "#35e06f";
const AMBER = "#f5a524";
const RED = "#f2525c";

const MEMBERS: Member[] = [
  { name: "Me", place: "Work", pct: 83, temp: 29, sky: "sun", hue: "#2f7cf0", tone: GREEN },
  { name: "Wife", place: "Home", pct: 48, temp: 25, sky: "rain", hue: "#d23b9b", tone: AMBER },
  { name: "Daughter", place: "School", pct: 25, temp: 26, sky: "rain", hue: "#8a4ee6", tone: AMBER },
  { name: "Son", place: "Home", pct: 18, temp: 27, sky: "sun", hue: "#12a7a0", tone: RED },
];

const vars = (v: Record<string, string | number>) => v as CSSProperties;
const r1 = (n: number) => Math.round(n * 10) / 10;

/* A jittered street grid, rotated in the SVG so it reads as a city map. */
const GRID = (() => {
  let d = "";
  for (let i = 0; i < 24; i++) {
    const y = -40 + i * 11.5;
    const a = Math.sin(i * 1.7) * 2.6;
    const b = Math.cos(i * 2.9) * 2.6;
    d += `M-50 ${r1(y + a)}L5 ${r1(y - b)}L48 ${r1(y + b * 0.6)}L95 ${r1(y - a * 0.8)}L150 ${r1(y + b)}`;
  }
  for (let i = 0; i < 19; i++) {
    const x = -50 + i * 11;
    const a = Math.sin(i * 2.3) * 2.4;
    const b = Math.cos(i * 1.3) * 2.4;
    d += `M${r1(x + a)} -60L${r1(x - b)} 20L${r1(x + b)} 90L${r1(x - a)} 160L${r1(x + a * 0.5)} 250`;
  }
  return d;
})();
const ARTERIALS =
  "M-20 30C25 62 62 104 130 146M126 6C88 56 54 128 14 240M-30 150C20 140 70 160 140 118";

function Streets({ tone }: { tone: "blue" | "green" }) {
  return (
    <svg
      className={`sg-bg is-${tone}`}
      viewBox="0 0 100 190"
      preserveAspectRatio="xMidYMid slice"
    >
      <g transform="rotate(-12 50 95)">
        <path className="g" d={GRID} />
        <path className="a" d={ARTERIALS} />
      </g>
    </svg>
  );
}

/* Bright glowing route segments and location rings at the panel edges. */
function Trails() {
  const blue = "M-3 44C6 50 13 60 11 72S4 89 8 95C11 101 17 106 15 118";
  const green = "M106 108C98 110 90 117 92 127S99 141 92 151 84 165 90 176";
  return (
    <svg
      className="sg-bg sg-trail"
      viewBox="0 0 100 190"
      preserveAspectRatio="xMidYMid slice"
    >
      <path className="halo b" d={blue} />
      <path className="core b" d={blue} />
      <path className="halo gr" d={green} />
      <path className="core gr" d={green} />
      <circle cx="8" cy="95" r="6.8" className="ring b" />
      <circle cx="8" cy="95" r="3.6" className="disc b" />
      <circle cx="8" cy="95" r="1.5" className="dot b" />
      <circle cx="92" cy="127" r="7.4" className="ring gr" />
      <circle cx="92" cy="127" r="3.8" className="disc gr" />
      <circle cx="92" cy="127" r="1.6" className="dot gr" />
    </svg>
  );
}

function Panel({
  lead,
  accent,
  sub,
  foot,
  className = "",
  children,
}: {
  lead: string;
  accent: string;
  sub: string;
  foot?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`sg-panel ${className}`}>
      <Streets tone="blue" />
      <Streets tone="green" />
      <Trails />
      <div className="sg-head">
        <span className="sg-title">
          {lead} <span>{accent}</span>
        </span>
        <span className="sg-sub">{sub}</span>
      </div>
      {children}
      {foot ? <span className="sg-foot">{foot}</span> : null}
    </div>
  );
}

function Device({ children, d }: { children: ReactNode; d: number }) {
  return (
    <div className="sg-device rise" style={vars({ "--d": d })}>
      <div className="sg-screen">{children}</div>
    </div>
  );
}

function StatusBar({ time }: { time: string }) {
  return (
    <div className="sg-status">
      <span>{time}</span>
      <i className="sg-cam" />
      <svg viewBox="0 0 42 12" className="sg-sys">
        <path
          d="M1 11h2V8H1zM5 11h2V6H5zM9 11h2V3.5H9zM13 11h2V1h-2z"
          fill="currentColor"
        />
        <path
          d="M18.6 5a6.6 6.6 0 0 1 8.8 0M20.4 7.3a3.9 3.9 0 0 1 5.2 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <circle cx="23" cy="9.8" r="1.2" fill="currentColor" />
        <rect
          x="30.7"
          y="2.2"
          width="9"
          height="7.6"
          rx="2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <rect x="40.4" y="4.6" width="1.3" height="2.8" rx="0.6" fill="currentColor" />
        <rect x="32.2" y="3.7" width="5.6" height="4.6" rx="0.8" fill="currentColor" />
      </svg>
    </div>
  );
}

function Avatar({ m, className = "" }: { m: Member; className?: string }) {
  return (
    <span className={`sg-av ${className}`} style={vars({ "--c": m.hue })}>
      {m.name[0]}
    </span>
  );
}

function PinGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="sg-pin"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinejoin="round"
    >
      <path d="M12 21s-6.5-5.7-6.5-11a6.5 6.5 0 0 1 13 0c0 5.3-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.3" />
    </svg>
  );
}

function Battery({ pct }: { pct: number }) {
  return (
    <svg viewBox="0 0 26 12" className="sg-batt">
      <rect
        x="0.9"
        y="0.9"
        width="21"
        height="10.2"
        rx="2.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <rect x="23" y="3.8" width="2.2" height="4.4" rx="1" fill="currentColor" />
      <rect
        x="3"
        y="3"
        width={r1(Math.max(1.8, (16.8 * pct) / 100))}
        height="6"
        rx="1.2"
        fill="currentColor"
      />
    </svg>
  );
}

function Weather({ sky }: { sky: Sky }) {
  return sky === "sun" ? (
    <svg viewBox="0 0 24 20" className="sg-sky">
      <circle cx="9" cy="7.5" r="4.6" fill="#fbbf24" />
      <path
        d="M8 18.5h10a3.6 3.6 0 0 0 .3-7.2 5.2 5.2 0 0 0-9.9 1.4A2.9 2.9 0 0 0 8 18.5z"
        fill="#eef2f8"
      />
    </svg>
  ) : (
    <svg viewBox="0 0 24 20" className="sg-sky">
      <path
        d="M6.5 13h11a3.8 3.8 0 0 0 .3-7.6A5.6 5.6 0 0 0 7.1 7 3 3 0 0 0 6.5 13z"
        fill="#dbe4f0"
      />
      <path
        d="M8 15.6l-1 2.6M12 15.6l-1 2.6M16 15.6l-1 2.6"
        stroke="#60a5fa"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MemberRow({ m }: { m: Member }) {
  return (
    <div className="sg-row">
      <Avatar m={m} />
      <span className="sg-who">
        <b>{m.name}</b>
        <span>
          <PinGlyph />
          {m.place}
        </span>
      </span>
      <span className="sg-stat">
        <span className="sg-pct" style={{ color: m.tone }}>
          {m.pct}%
          <Battery pct={m.pct} />
        </span>
        <span className="sg-temp">
          {m.temp}°C
          <Weather sky={m.sky} />
        </span>
      </span>
    </div>
  );
}

const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function Icon({ d, className = "" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...STROKE}>
      <path d={d} />
    </svg>
  );
}

function Bell({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M5.6 16.6V11a6.4 6.4 0 0 1 12.8 0v5.6l1.7 2.1H3.9z" />
      <path d="M9.7 20.2a2.4 2.4 0 0 0 4.6 0z" />
    </svg>
  );
}

/* ---------- panel 1: Stay Connected ---------- */

function CircleScreen() {
  const [me, wife, daughter, son] = MEMBERS;
  return (
    <Device d={0}>
      <StatusBar time="11:17" />
      <span className="sg-skip">Skip</span>
      <div className="sg-orbit">
        <i className="sg-ring r1" />
        <i className="sg-ring r2" />
        <i className="sg-ring r3" />
        <span className="sg-self">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="8.6" r="4.3" />
            <path d="M3.6 22.5a8.4 8.4 0 0 1 16.8 0z" />
          </svg>
        </span>
        <Avatar m={wife} className="sg-o1 rise" />
        <Avatar m={daughter} className="sg-o2 rise" />
        <Avatar m={son} className="sg-o3 rise" />
      </div>
      <div className="sg-stack">
        <div className="sg-tab t1">Friends</div>
        <div className="sg-tab t2">Work</div>
        <div className="sg-fam">
          <div className="sg-fam-h">
            <b>Family</b>
            <span className="sg-check">
              <Icon d="M5 12.5l4.2 4L19 7" />
            </span>
            <span className="sg-chip">3 live</span>
          </div>
          {[me, wife, daughter].map((m) => (
            <MemberRow key={m.name} m={m} />
          ))}
        </div>
        <i className="sg-live" />
      </div>
      <span className="sg-pitch">
        Keep in touch with your loved ones anytime, anywhere
      </span>
      <span className="sg-dots">
        <i className="on" />
        <i />
        <i />
        <i />
      </span>
      <span className="sg-cta">Continue</span>
    </Device>
  );
}

/* ---------- panel 2: Live Location Updates ---------- */

const ROUTE = "M24 95C34 96.6 47 98.8 58 100.4L61.7 128";
const TRAIL = "M16.5 14C17.4 40 20 62 24 95";

function Poi({
  x,
  y,
  label,
  kind,
}: {
  x: number;
  y: number;
  label?: string;
  kind: "h" | "food" | "bus" | "shop" | "dot";
}) {
  const glyph = {
    h: "M8 6v12M16 6v12M8 12h8",
    food: "M8 4v16M6 4v4.5a2 2 0 0 0 4 0V4M16.5 20V4c-2 1.6-2.6 5.4-.5 8.2",
    bus: "M6.5 5h11v11h-11zM6.5 11h11M8.5 16v2.5M15.5 16v2.5",
    shop: "M6 8.5h12l-1 11H7zM9.5 8.5a2.5 2.5 0 0 1 5 0",
    dot: "M12 12h.01",
  }[kind];
  return (
    <span className={`sg-poi is-${kind}`} style={vars({ "--x": `${x}%`, "--y": `${y}%` })}>
      <i>
        <Icon d={glyph} />
      </i>
      {label ? <span>{label}</span> : null}
    </span>
  );
}

function MemberPin({ m, x, y, d }: { m: Member; x: number; y: number; d: number }) {
  return (
    <span
      className="sg-mpin rise"
      style={vars({ "--x": `${x}%`, "--y": `${y}%`, "--d": d })}
    >
      <Avatar m={m} />
    </span>
  );
}

function MapScreen() {
  const [me, wife, daughter] = MEMBERS;
  return (
    <Device d={1}>
      <div className="sg-map">
        <svg viewBox="0 0 100 222" preserveAspectRatio="xMidYMid slice">
          <path className="sg-park" d="M60 66L80 63L86 80L63 84Z" />
          <path className="sg-park" d="M4 168L22 165L20 186L2 188Z" />
          <path
            className="sg-rd3"
            d="M-5 66L45 70M58 64L105 60M30 120L60 124M84 98L90 150M0 182L40 176M70 172L105 168M34 0L36 40M88 0L86 30M8 120L4 160M44 140L40 200"
          />
          <path
            className="sg-rd2"
            d="M-5 40C30 44 60 40 105 34M45 -5C48 30 54 60 58 100M70 -5C72 30 78 60 96 90M-5 140C25 136 55 140 105 150M58 100L66 160M24 95L18 160"
          />
          <path
            className="sg-rd1"
            d="M-5 92C25 96 55 100 105 110M16 -5C17 30 20 60 24 95M84 98C70 125 50 150 28 190"
          />
          <path className="sg-trail-b" d={TRAIL} />
          <path className="sg-route-halo" d={ROUTE} />
          <path className="sg-route draw" d={ROUTE} pathLength={1} />
        </svg>
        <span className="sg-street" style={vars({ "--x": "41%", "--y": "41.4%", "--r": "8deg" })}>
          Lake Rd
        </span>
        <span className="sg-street" style={vars({ "--x": "76%", "--y": "50.5%", "--r": "-58deg" })}>
          Station Rd
        </span>
        <span className="sg-street is-park" style={vars({ "--x": "73%", "--y": "33.4%", "--r": "0deg" })}>
          City Park
        </span>
        <Poi x={28} y={13} kind="bus" label="Bus Stand" />
        <Poi x={36} y={27} kind="h" label="Central Hospital" />
        <Poi x={30} y={52} kind="food" label="Food Court" />
        <Poi x={10} y={61} kind="shop" label="Mini Mart" />
        <Poi x={86} y={58} kind="dot" />
        <Poi x={52} y={17} kind="dot" />
        <span className="sg-lbs">
          <b>LBS</b>
        </span>
        <span className="sg-ctrl">
          <Icon d="M12 5v14M5 12h14" />
          <Icon d="M5 12h14" />
          <Icon d="M4 11.5 20 4l-7.5 16-1.8-6.7z" />
          <Icon d="M12 3.5 21 8.5l-9 5-9-5zM3 13l9 5 9-5" />
        </span>
        <span className="sg-sos">
          <Bell />
        </span>
        <i
          className="sg-pulse"
          style={vars({ "--x": "61.7%", "--y": "57.7%" })}
        />
        <MemberPin m={wife} x={77} y={26.1} d={2} />
        <MemberPin m={me} x={24} y={42.8} d={3} />
        <MemberPin m={daughter} x={61.7} y={57.7} d={4} />
      </div>
      <StatusBar time="11:20" />
      <div className="sg-sheet">
        <i className="sg-handle" />
        <div className="sg-sheet-h">
          <b>Nexus</b>
          <span className="sg-fab">
            <Icon d="M12 6v12M6 12h12" />
          </span>
        </div>
        {[
          { m: daughter, note: "Near Central School · 2 min ago" },
          { m: wife, note: "Home · Updated just now" },
        ].map(({ m, note }) => (
          <div className="sg-mcard" key={m.name}>
            <Avatar m={m} />
            <span className="sg-who">
              <b>{m.name}</b>
              <span>{note}</span>
            </span>
            <span className="sg-pct" style={{ color: m.tone }}>
              {m.pct}%
              <Battery pct={m.pct} />
            </span>
          </div>
        ))}
        <div className="sg-nav">
          <span className="on">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4">
              <circle cx="12" cy="12" r="6.2" />
            </svg>
            Nexus
          </span>
          <span>
            <Icon d="M12 21s-6.5-5.7-6.5-11a6.5 6.5 0 0 1 13 0c0 5.3-6.5 11-6.5 11zM12 12.3a2.3 2.3 0 1 0 0-4.6 2.3 2.3 0 0 0 0 4.6z" />
            Places
          </span>
          <span>
            <Icon d="M4 5.5h16V16H9.5L5 20v-4H4z" />
            Chat
          </span>
          <span>
            <Icon d="M12 18.2a6.2 6.2 0 1 0 0-12.4 6.2 6.2 0 0 0 0 12.4zM12 14.4a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8zM12 2.8v3M12 18.2v3M2.8 12h3M18.2 12h3M5.5 5.5l2.1 2.1M16.4 16.4l2.1 2.1M5.5 18.5l2.1-2.1M16.4 7.6l2.1-2.1" />
            Settings
          </span>
        </div>
      </div>
    </Device>
  );
}

/* ---------- panel 3: Live Battery Status ---------- */

function BatteryCard() {
  return (
    <div className="sg-p3 rise" style={vars({ "--d": 2 })}>
      <div className="sg-card">
        <div className="sg-brand">
          <svg viewBox="0 0 24 24" className="sg-shield">
            <path
              d="M12 2.4 4.2 5.4v6.1c0 4.9 3.3 8.6 7.8 10.1 4.5-1.5 7.8-5.2 7.8-10.1V5.4z"
              fill={GREEN}
              fillOpacity="0.14"
              stroke={GREEN}
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path d="M12 16s-3.1-2.7-3.1-5.2a3.1 3.1 0 0 1 6.2 0C15.1 13.3 12 16 12 16z" fill="#fff" />
            <circle cx="12" cy="10.8" r="1.1" fill="#123222" />
          </svg>
          <b>
            Smart <span>Guardian</span>
          </b>
          <span className="sg-round">
            <Icon d="M9.5 11.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 20a6.5 6.5 0 0 1 13 0M15.6 4.6a3.5 3.5 0 0 1 0 6.8M18 14.5a6.5 6.5 0 0 1 3 5.5" />
          </span>
        </div>
        <div className="sg-nexus">
          <b>Nexus</b>
          <span>
            <i />4 members connected
          </span>
        </div>
        <div className="sg-list">
          {MEMBERS.map((m) => (
            <MemberRow key={m.name} m={m} />
          ))}
        </div>
      </div>
      <div className="sg-alert">
        <span className="sg-bell">
          <Bell />
        </span>
        <span className="sg-who">
          <b>Low Battery Alert</b>
          <span>Notify trusted members</span>
        </span>
        <span className="sg-chev">
          <Icon d="M9.5 6l6 6-6 6" />
        </span>
      </div>
    </div>
  );
}

export function SmartGuardianScreen() {
  return (
    <Mock
      name="sg"
      palette={{
        "--m-bg": "#03060b",
        "--m-fg": "#f4f7fb",
        "--m-dim": "#8b95a5",
        "--m-acc": GREEN,
        "--m-panel": "#11161e",
        "--m-line": "rgb(255 255 255 / 0.08)",
      }}
    >
      <div className="sg-strip">
        <Panel
          className="p1"
          lead="Stay"
          accent="Connected"
          sub="Keep in touch with trusted members anytime"
          foot="Permission-based sharing for trusted groups"
        >
          <CircleScreen />
        </Panel>
        <Panel
          className="p2"
          lead="Live"
          accent="Location Updates"
          sub="GPS and LBS tools for trusted member sharing"
          foot="Location sharing works with member permission"
        >
          <MapScreen />
        </Panel>
        <Panel
          className="p3 is-calm"
          lead="Live Battery"
          accent="Status"
          sub="Know when connected devices need charging"
        >
          <BatteryCard />
        </Panel>
      </div>
    </Mock>
  );
}
