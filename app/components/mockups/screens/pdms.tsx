import "./pdms.css";
import type { CSSProperties, ReactNode } from "react";
import { Browser, Mock } from "../kit";

/*
 * PDMS (Piriven Education Management System) admin dashboard, rebuilt from
 * the live pdms.moe.gov.lk dashboard: navy sidebar with the national crest,
 * gradient header, filter row, login alert, four count cards, the Highcharts
 * "Piriven Statistics" and "Message" panels and the FullCalendar month view.
 */

const d = (n: number) => ({ "--d": n }) as CSSProperties;

/* ------------------------------------------------------------------ icons */
/* Font Awesome 4 glyphs redrawn on a 16-unit grid. `pd-cut` / `pd-cutl`
   punch holes in the surface colour (set per context with --pd-cut). */

function Ico({ children, line = false }: { children: ReactNode; line?: boolean }) {
  return (
    <svg
      className="pd-ico"
      viewBox="0 0 16 16"
      fill={line ? "none" : "currentColor"}
      stroke={line ? "currentColor" : "none"}
      strokeWidth={line ? 1.5 : undefined}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

const burst = Array.from({ length: 24 }, (_, i) => {
  const a = (i / 24) * Math.PI * 2;
  const r = i % 2 ? 5.5 : 7.3;
  return `${(8 + r * Math.sin(a)).toFixed(2)},${(8 - r * Math.cos(a)).toFixed(2)}`;
}).join(" ");

const DOC = (
  <>
    <path d="M3 1.2h6.6L13 4.6v10.2H3z" />
    <path d="M9.4 1.4v3.4H13" />
  </>
);

const ICON = {
  dashboard: (
    <Ico>
      <path d="M8 2.2a7 7 0 0 0-7 7c0 1.7.6 3.2 1.6 4.4h10.8A6.9 6.9 0 0 0 15 9.2a7 7 0 0 0-7-7z" />
      <circle className="pd-cut" cx="3.9" cy="9.6" r="1" />
      <circle className="pd-cut" cx="5.1" cy="6" r="1" />
      <circle className="pd-cut" cx="8.6" cy="4.6" r="1" />
      <circle className="pd-cut" cx="12.1" cy="9.6" r="1" />
      <path className="pd-cutl" d="M8 11.3 10.8 6.6" strokeWidth="1.5" />
      <circle className="pd-cut" cx="8" cy="11.3" r="1.5" />
    </Ico>
  ),
  user: (
    <Ico>
      <circle cx="8" cy="4.4" r="3.2" />
      <path d="M2 15c0-3.6 2.4-5.8 6-5.8s6 2.2 6 5.8z" />
    </Ico>
  ),
  tags: (
    <Ico>
      <path d="M1 1.8h5.4l6.8 6.8-5 5L1.4 6.8z" />
      <circle className="pd-cut" cx="3.7" cy="4.5" r="1.1" />
      <path d="M8.6 1.8h1.3l5.6 6.2-4.6 5" fill="none" stroke="currentColor" strokeWidth="1.3" />
    </Ico>
  ),
  file: (
    <Ico line>
      {DOC}
      <path d="M5.4 7.6h5.2M5.4 9.8h5.2M5.4 12h5.2" strokeWidth="1.1" />
    </Ico>
  ),
  tty: (
    <Ico>
      <path d="M.6 6.8C.6 3.7 3.9 2.4 8 2.4s7.4 1.3 7.4 4.4v1h-3.6V6H4.2v1.8H.6z" />
      {[9.4, 11.6].flatMap((y) =>
        [1.5, 4.3, 7.1, 9.9, 12.7].map((x) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="1.8" height="1.4" />
        )),
      )}
      <rect x="1.5" y="13.8" width="1.8" height="1.4" />
      <rect x="4.3" y="13.8" width="7.4" height="1.4" />
      <rect x="12.7" y="13.8" width="1.8" height="1.4" />
    </Ico>
  ),
  userMd: (
    <Ico>
      <circle cx="8" cy="4.2" r="3" />
      <path d="M2.2 15c0-3.4 2.2-5.6 5.8-5.6s5.8 2.2 5.8 5.6z" />
      <path className="pd-cutl" d="M5.5 9.9v2.6M10.5 9.9v1.7" strokeWidth="1" />
      <circle className="pd-cut" cx="10.5" cy="12.5" r="0.9" />
    </Ico>
  ),
  bell: (
    <Ico line>
      <path d="M8 1.8A4.2 4.2 0 0 0 3.8 6v3.6l-1.6 2.6h11.6l-1.6-2.6V6A4.2 4.2 0 0 0 8 1.8z" />
      <path d="M6.4 13.9a1.7 1.7 0 0 0 3.2 0" />
    </Ico>
  ),
  sort: (
    <Ico>
      <path d="M4 1.5v11" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M1.4 10.4 4 14.4l2.6-4z" />
      <text x="11.6" y="6.6" fontSize="6.8" fontWeight="700" textAnchor="middle">
        1
      </text>
      <text x="11.6" y="14.8" fontSize="6.8" fontWeight="700" textAnchor="middle">
        9
      </text>
    </Ico>
  ),
  users: (
    <Ico>
      <circle cx="8" cy="4.6" r="2.5" />
      <circle cx="3.5" cy="5.3" r="1.9" />
      <circle cx="12.5" cy="5.3" r="1.9" />
      <path d="M3.9 13.8c0-2.8 1.8-4.6 4.1-4.6s4.1 1.8 4.1 4.6z" />
      <path d="M.4 12c0-2.1 1.3-3.5 3.1-3.5.6 0 1.1.2 1.6.4-1 .9-1.6 1.9-1.8 3.1z" />
      <path d="M15.6 12c0-2.1-1.3-3.5-3.1-3.5-.6 0-1.1.2-1.6.4 1 .9 1.6 1.9 1.8 3.1z" />
    </Ico>
  ),
  bank: (
    <Ico>
      <path d="M8 1 1 4.4v1.3h14V4.4z" />
      <path d="M2.4 6.8h1.7v5.4H2.4zm3.2 0h1.7v5.4H5.6zm3.1 0h1.7v5.4H8.7zm3.2 0h1.7v5.4h-1.7z" />
      <path d="M1.5 12.8h13v1.2h-13zm-.7 1.7h14.4v1.1H.8z" />
    </Ico>
  ),
  male: (
    <Ico>
      <circle cx="8" cy="2.4" r="1.8" />
      <path d="M5.8 5h4.4c.7 0 1.2.5 1.2 1.2v4H10v4.2H8.6v-4H7.4v4H6v-4.2H4.6v-4C4.6 5.5 5.1 5 5.8 5z" />
      <path d="M4.4 13.6c-1.3.3-2 .7-2 1.1 0 .6 2.5 1 5.6 1s5.6-.4 5.6-1c0-.4-.7-.8-2-1.1" fill="none" stroke="currentColor" strokeWidth="1" />
    </Ico>
  ),
  check: (
    <Ico line>
      <circle cx="8" cy="8" r="6.3" strokeWidth="1.7" />
      <path d="m5.1 8.2 2 2 3.9-4.1" strokeWidth="1.7" />
    </Ico>
  ),
  word: (
    <Ico line>
      {DOC}
      <path d="m5 7.6 1.1 4.8L8 8.6l1.9 3.8L11 7.6" strokeWidth="1.1" />
    </Ico>
  ),
  cap: (
    <Ico>
      <path d="M8 2.6.4 6 8 9.4 15.6 6z" />
      <path d="M3.6 8.2v3.2c0 1.3 2 2.4 4.4 2.4s4.4-1.1 4.4-2.4V8.2L8 10.2z" />
      <path d="M14.3 6.4v4.8" fill="none" stroke="currentColor" strokeWidth="0.9" />
    </Ico>
  ),
  book: (
    <Ico>
      <path d="M4.6 1.4H14l-2.4 11.2H2.2z" />
      <path d="M2.2 12.6l-.4 2h9.4l.5-2" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path className="pd-cutl" d="M6.6 4.4h4.6M6.1 6.6h4.6" strokeWidth="0.9" />
    </Ico>
  ),
  barcode: (
    <Ico>
      {[
        [0.8, 1],
        [2.4, 0.6],
        [3.6, 1.2],
        [5.4, 0.6],
        [6.6, 0.6],
        [7.8, 1.3],
        [9.8, 0.6],
        [11, 1],
        [12.6, 0.6],
        [13.8, 1.1],
      ].map(([x, w]) => (
        <rect key={x} x={x} y="2" width={w} height="12" />
      ))}
    </Ico>
  ),
  cert: (
    <Ico>
      <polygon points={burst} />
    </Ico>
  ),
  horn: (
    <Ico>
      <path d="M13.4 1.8v12.4L7.2 11H2.6A1.4 1.4 0 0 1 1.2 9.6V6.4A1.4 1.4 0 0 1 2.6 5h4.6z" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M1.4 5.4h5.6v5.2H1.4z" />
      <path d="M3.2 11h2.6l1 3.8H4.3z" />
    </Ico>
  ),
  event: (
    <Ico line>
      <rect x="1.8" y="2.8" width="12.4" height="11.8" rx="1" />
      <path d="M1.8 6h12.4M5 1.2v3M11 1.2v3" />
      <path d="m5.4 10.2 1.8 1.8 3.4-3.6" />
    </Ico>
  ),
  calc: (
    <Ico>
      <path d="M2 1.2h12v3.2H2z" />
      {[5.4, 7.9, 10.4, 12.9].flatMap((y) =>
        [2, 5.1, 8.2, 11.3].map((x) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="2.7" height="2" />
        )),
      )}
    </Ico>
  ),
  report: (
    <Ico>
      <path d="M1.4 1.4v13.2h13.4" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3.6 8h1.8v5.6H3.6zm2.8-2.6h1.8v8.2H6.4zm2.8-1.8H11v10H9.2zm2.8 3.2h1.8v6.8H12z" />
    </Ico>
  ),
  picture: (
    <Ico>
      <rect x="1" y="2.4" width="14" height="11.2" rx="0.9" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2.8 12 6.4 7.6 9 10.2l1.6-1.6 2.6 3.4z" />
      <circle cx="5" cy="5.4" r="1.3" />
    </Ico>
  ),
  comment: (
    <Ico>
      <path d="M8 1.8C4 1.8.8 4.3.8 7.4c0 1.7 1 3.2 2.5 4.2l-.8 3 3.6-1.9c.6.1 1.3.2 1.9.2 4 0 7.2-2.5 7.2-5.5S12 1.8 8 1.8z" />
      <circle className="pd-cut" cx="4.8" cy="7.4" r="1" />
      <circle className="pd-cut" cx="8" cy="7.4" r="1" />
      <circle className="pd-cut" cx="11.2" cy="7.4" r="1" />
    </Ico>
  ),
  lock: (
    <Ico>
      <path d="M4.6 7.2V5a3.4 3.4 0 0 1 6.8 0v2.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <rect x="2.6" y="7" width="10.8" height="8" rx="1.2" />
    </Ico>
  ),
};

type IconKey = keyof typeof ICON;

function Chev({ dir = "down", className = "" }: { dir?: "down" | "up" | "left" | "right"; className?: string }) {
  const path = {
    down: "m3.5 5.8 4.5 4.5 4.5-4.5",
    up: "m3.5 10.2 4.5-4.5 4.5 4.5",
    left: "m10.2 3.5-4.5 4.5 4.5 4.5",
    right: "m5.8 3.5 4.5 4.5-4.5 4.5",
  }[dir];
  return (
    <svg
      className={`pd-chev ${className}`}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={path} />
    </svg>
  );
}

/* Sri Lanka national crest, simplified: dharma wheel, petal ring, maroon
   disc with the lion, and the punkalasa pot with sun and moon. */
function Crest() {
  return (
    <svg className="pd-crest" viewBox="0 0 40 50">
      <circle cx="20" cy="4" r="2.9" fill="none" stroke="#e3c53a" strokeWidth="1.3" />
      <path d="M20 1.1v5.8M17.1 4h5.8" stroke="#e3c53a" strokeWidth="0.7" />
      <circle cx="20" cy="21.5" r="15.6" fill="#c9a42a" />
      <circle cx="20" cy="21.5" r="13.6" fill="none" stroke="#6d5a12" strokeWidth="2.6" strokeDasharray="1.9 1.1" />
      <circle cx="20" cy="21.5" r="11.6" fill="#efd34a" />
      <circle cx="20" cy="21.5" r="9.4" fill="#9c1d24" />
      <path
        fill="#efcb3c"
        d="M13.6 27v-4.4c0-1.6 1-2.9 2.5-3.3l.8-2.8 1.8 1.5h2.4l1.5-2.2.5 2.9c1.6.6 2.6 2.1 2.6 3.8V27h-1.7v-2.7h-1.3V27h-1.5v-2.5h-3.4V27h-1.5v-2.7h-1.3V27z"
      />
      <path d="M24.6 18.4l3-3.4" stroke="#efcb3c" strokeWidth="0.9" strokeLinecap="round" />
      <path fill="#d8b52c" d="M11.5 37.4h17l-1.8 2.8H13.3z" />
      <rect x="9.2" y="40.2" width="21.6" height="3.4" rx="1" fill="#c9a42a" />
      <path fill="#a8861c" d="M12.2 43.6h15.6l1.8 3.6H10.4z" />
      <circle cx="11.6" cy="38.6" r="1.6" fill="#efd34a" />
      <circle cx="28.4" cy="38.6" r="1.6" fill="#efd34a" />
      <rect x="10" y="47.2" width="20" height="1.6" rx="0.6" fill="#2b54b8" />
    </svg>
  );
}

function Avatar() {
  return (
    <svg className="pd-avatar" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="9.6" fill="#cfe2f6" />
      <circle cx="10" cy="7.4" r="3.7" fill="#3489c7" />
      <path d="M3.3 16.7c1-3.3 3.7-5 6.7-5s5.7 1.7 6.7 5a9.6 9.6 0 0 1-13.4 0z" fill="#3489c7" />
      <circle cx="10" cy="10" r="9.6" fill="none" stroke="#5b9bd5" strokeWidth="0.8" />
    </svg>
  );
}

/* ------------------------------------------------------------------- data */

const MENU: [string, IconKey, boolean][] = [
  ["Dashboard", "dashboard", false],
  ["Administrator", "user", true],
  ["SMS/Email", "tags", true],
  ["Post Office", "file", true],
  ["Front Office", "tty", true],
  ["Human Resource", "userMd", true],
  ["Manage Leave", "bell", true],
  ["Salary Grade", "sort", false],
  ["Teacher", "users", true],
  ["Academic", "bank", true],
  ["Guardian", "male", false],
  ["Manage Student", "users", true],
  ["Attendance", "check", true],
  ["Assignment", "word", true],
  ["Manage Exam", "cap", true],
  ["Library", "book", true],
  ["Generate Card", "barcode", true],
  ["Certificate", "cert", true],
  ["Announcement", "horn", true],
  ["Event", "event", false],
  ["Manage Accounts", "calc", true],
  ["Report", "report", true],
  ["Forms", "file", true],
  ["Media Gallery", "picture", true],
  ["Complain", "comment", true],
  ["Main Progress", "file", true],
  ["Plan Progress", "file", true],
  ["Profile", "lock", true],
];

const STATS: [string, IconKey, string][] = [
  ["Student", "users", "7056"],
  ["Guardian", "male", "5632"],
  ["Teacher", "users", "5686"],
  ["Employee", "userMd", "1359"],
];

/* Illustrative piriven counts per province for the (light) overview chart. */
const PROVINCES: [string, number][] = [
  ["Western", 148],
  ["Central", 112],
  ["Southern", 164],
  ["Northern", 38],
  ["Eastern", 52],
  ["North Western", 104],
  ["North Central", 76],
  ["Uva", 58],
  ["Sabaragamuwa", 110],
];

const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
/* October 2026 starts on a Thursday; the grid opens on Sun 27 September. */
const DAYS = Array.from({ length: 35 }, (_, i) =>
  i < 4 ? { n: 27 + i, prev: true } : { n: i - 3, prev: false },
);
const TODAY = 23;

/* ----------------------------------------------------------------- charts */

function PirivenChart() {
  // viewBox units are 0.1em: the chart is 50.4em x 6.2em.
  const left = 24;
  const right = 495;
  const top = 16;
  const base = 52;
  const step = (right - left) / PROVINCES.length;
  const y = (v: number) => base - (v / 200) * (base - top);
  return (
    <svg className="pd-pchart" viewBox="0 0 504 62">
      <text x="252" y="9" className="pd-ct" fontSize="6.6" textAnchor="middle">
        PDMS
      </text>
      <path d="M488 4.5h11M488 7.5h11M488 10.5h11" className="pd-menu-ico" />
      {[0, 50, 100, 150, 200].map((v) => (
        <g key={v}>
          <line x1={left} x2={right} y1={y(v)} y2={y(v)} className="pd-grid" vectorEffect="non-scaling-stroke" />
          <text x={left - 4} y={y(v) + 1.5} className="pd-tick" fontSize="4.6" textAnchor="end">
            {v}
          </text>
        </g>
      ))}
      {PROVINCES.map(([name, v], i) => {
        const cx = left + step * (i + 0.5);
        return (
          <g key={name}>
            <rect
              x={cx - 12}
              y={y(v)}
              width="24"
              height={base - y(v)}
              fill="#7cb5ec"
              className="pd-bar grow-y"
              style={d(i)}
            />
            <text x={cx} y="58.6" className="pd-tick" fontSize="4.6" textAnchor="middle">
              {name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function MessageChart() {
  // viewBox units are 0.1em: the chart is 15.5em x 9.4em.
  const left = 31;
  const right = 150;
  const top = 8;
  const base = 80;
  const step = (right - left) / 5;
  const y = (v: number) => base - (v / 1.25) * (base - top);
  const cats: [string, number, string][] = [
    ["New", 0, ""],
    ["Inbox", 1, "#434348"],
    ["send", 1, "#90ed7d"],
    ["Draft", 0, ""],
    ["Trash", 0, ""],
  ];
  return (
    <svg className="pd-mchart" viewBox="0 0 155 94">
      <text
        className="pd-tick"
        fontSize="4.6"
        textAnchor="middle"
        transform={`translate(7 ${(top + base) / 2}) rotate(-90)`}
      >
        Private Messaging
      </text>
      {[0, 0.25, 0.5, 0.75, 1, 1.25].map((v) => (
        <g key={v}>
          {v > 0 ? (
            <line x1={left} x2={right} y1={y(v)} y2={y(v)} className="pd-grid" vectorEffect="non-scaling-stroke" />
          ) : null}
          <text x={left - 4} y={y(v) + 1.6} className="pd-tick" fontSize="4.6" textAnchor="end">
            {v}
          </text>
        </g>
      ))}
      <path d="M140.5 11h8M140.5 13.8h8M140.5 16.6h8" className="pd-menu-ico" />
      {cats.map(([name, v, color], i) => {
        const cx = left + step * (i + 0.5);
        return (
          <g key={name}>
            {v ? (
              <rect
                x={cx - 5.8}
                y={y(v)}
                width="11.6"
                height={base - y(v)}
                fill={color}
                className="pd-bar grow-y"
                style={d(i)}
              />
            ) : null}
            <text x={cx} y={y(v) - 1.8} className="pd-dl" fontSize="4.6" textAnchor="middle">
              {v ? "1.0%" : "0.0%"}
            </text>
            <text x={cx} y="89" className="pd-tick" fontSize="4.6" textAnchor="middle">
              {name}
            </text>
          </g>
        );
      })}
      <path
        d={`M${left} ${base}H${right}${[0, 1, 2, 3, 4, 5].map((i) => `M${left + step * i} ${base}v3`).join("")}`}
        className="pd-axis"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/* ----------------------------------------------------------------- screen */

function Select({ label, className = "" }: { label: string; className?: string }) {
  return (
    <span className={`pd-sel ${className}`}>
      <span>{label}</span>
      <Chev className="thin" />
    </span>
  );
}

function PanelHead({ title, big = false }: { title: string; big?: boolean }) {
  return (
    <div className={big ? "pd-ph big" : "pd-ph"}>
      <span className="pd-h">{title}</span>
      <Chev dir="up" className="pd-up" />
    </div>
  );
}

export function PdmsScreen() {
  return (
    <Mock
      name="pd"
      palette={{
        "--m-bg": "#e4e9f2",
        "--m-fg": "#1f2a44",
        "--m-dim": "#6f7f94",
        "--m-acc": "#002067",
        "--m-panel": "#ffffff",
        "--m-line": "#dfe3ea",
      }}
    >
      <Browser url="pdms.moe.gov.lk/dashboard">
        <div className="pd-app">
          <aside className="pd-side">
            <div className="pd-brand">
              <Crest />
              <span>PDMS</span>
            </div>
            <div className="pd-menu">
              {MENU.map(([label, icon, sub]) => (
                <div key={label} className="pd-item">
                  {ICON[icon]}
                  <span>{label}</span>
                  {sub ? <Chev /> : null}
                </div>
              ))}
            </div>
          </aside>

          <div className="pd-main">
            <div className="pd-top">
              <span className="pd-burger">
                <i />
                <i />
                <i />
              </span>
              <span className="pd-title">
                Ministry of Education | Division of Piriven Education
              </span>
              <span className="pd-user">
                <Avatar />
                <span>DEVELOPER</span>
                <Chev />
              </span>
            </div>

            <div className="pd-filters">
              <Select label="--Select Piriven--" />
              <span className="pd-sel pd-input">
                <span>Search</span>
              </span>
              <span className="pd-gap" />
              <Select label="--Select Piriven--" />
              <Select label="--Session Year--" />
              <span className="pd-btn">
                <span>Update</span>
              </span>
            </div>

            <div className="pd-alert">
              <span>You have successfully logged In.</span>
              <b>x</b>
            </div>

            <div className="pd-stats">
              {STATS.map(([label, icon, value], i) => (
                <div key={label} className="pd-stat rise" style={d(i)}>
                  <span className="pd-stat-k">
                    {ICON[icon]}
                    <span>{label}</span>
                  </span>
                  <b>{value}</b>
                </div>
              ))}
            </div>

            <div className="pd-panel pd-piriven rise" style={d(4)}>
              <PanelHead title="Piriven Statistics" />
              <PirivenChart />
              <div className="pd-zones">
                <Select label="--Select Provincial--" className="sm w1" />
                <Select label="--Select--" className="sm w2" />
                <Select label="--Select--" className="sm w2" />
                <Select label="--Select Education Zonal--" className="sm w3" />
              </div>
            </div>

            <div className="pd-row">
              <div className="pd-panel pd-cal rise" style={d(5)}>
                <PanelHead title="Calendar" big />
                <div className="pd-fc-bar">
                  <span className="pd-fc-left">
                    <span className="pd-fc-grp">
                      <span className="pd-fc-btn pd-nav">
                        <Chev dir="left" />
                      </span>
                      <span className="pd-fc-btn pd-nav">
                        <Chev dir="right" />
                      </span>
                    </span>
                    <span className="pd-fc-btn off">
                      <span>today</span>
                    </span>
                  </span>
                  <span className="pd-fc-title">October 2026</span>
                  <span className="pd-fc-grp pd-fc-right">
                    <span className="pd-fc-btn on">
                      <span>month</span>
                    </span>
                    <span className="pd-fc-btn">
                      <span>week</span>
                    </span>
                    <span className="pd-fc-btn">
                      <span>day</span>
                    </span>
                  </span>
                </div>
                <div className="pd-fc-grid">
                  {DOW.map((day) => (
                    <span key={day} className="pd-fc-dow">
                      <span>{day}</span>
                    </span>
                  ))}
                  {DAYS.map(({ n, prev }, i) => (
                    <span
                      key={i}
                      className={
                        prev
                          ? "pd-fc-day prev"
                          : n === TODAY
                            ? "pd-fc-day today"
                            : "pd-fc-day"
                      }
                    >
                      <span>{n}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="pd-col">
                <div className="pd-panel pd-msg rise" style={d(6)}>
                  <PanelHead title="Message" />
                  <MessageChart />
                </div>
                <div className="pd-panel pd-utype">
                  <PanelHead title="User Type" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Browser>
    </Mock>
  );
}
