import "./linkforex.css";
import type { CSSProperties, ReactNode } from "react";
import { Browser, Mock } from "../kit";

/*
 * LinkForex admin dashboard, rebuilt from the live app at
 * linkforex.vercel.app/admin/dashboard (30-day view). Labels, figures and
 * chart shape follow the real screen; the remitter name is fictional.
 */

const d = (i: number) => ({ "--d": i }) as CSSProperties;

/** A 24×24 line icon in the style the app uses (lucide). */
function Ico({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <svg
      className={`lf-i ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

const icons = {
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </>
  ),
  layers: (
    <>
      <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" />
      <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" />
      <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14a9 3 0 0 0 18 0V5" />
      <path d="M3 12a9 3 0 0 0 18 0" />
    </>
  ),
  chart: (
    <>
      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </>
  ),
  phone: (
    <>
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M12 18h.01" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  gear: (
    <>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  chevR: <path d="m9 18 6-6-6-6" />,
  chevL: <path d="m15 18-6-6 6-6" />,
  search: (
    <>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </>
  ),
  plus: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h8" />
      <path d="M12 8v8" />
    </>
  ),
  moon: <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />,
  bell: (
    <>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </>
  ),
  logout: (
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </>
  ),
  swap: (
    <>
      <path d="m16 3 4 4-4 4" />
      <path d="M20 7H4" />
      <path d="m8 21-4-4 4-4" />
      <path d="M4 17h16" />
    </>
  ),
  wallet: (
    <>
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    </>
  ),
  pulse: (
    <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
  ),
  shield: (
    <>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  earth: (
    <>
      <path d="M21.54 15H17a2 2 0 0 0-2 2v4.54" />
      <path d="M7 3.34V5a3 3 0 0 0 3 3 2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17" />
      <path d="M11 21.95V18a2 2 0 0 0-2-2 2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05" />
      <circle cx="12" cy="12" r="10" />
    </>
  ),
};

const NAV: { label: string; icon: ReactNode; group?: boolean }[] = [
  { label: "Dashboard", icon: icons.grid },
  { label: "Operations", icon: icons.layers, group: true },
  { label: "Master Data", icon: icons.database, group: true },
  { label: "Reports", icon: icons.chart },
  { label: "Mobile Controls", icon: icons.phone, group: true },
  { label: "Application Basic Data", icon: icons.globe, group: true },
  { label: "System Users", icon: icons.users, group: true },
  { label: "Configuration", icon: icons.gear },
];

const KPIS: { label: string; value: string; note: string; icon: ReactNode }[] = [
  { label: "Transfers", value: "2", note: "0 in previous range", icon: icons.swap },
  {
    label: "Transfer Volume",
    value: "£250.00",
    note: "£0.00 previous range",
    icon: icons.wallet,
  },
  {
    label: "Pending Transfers",
    value: "0",
    note: "Pending, in review, or processing",
    icon: icons.pulse,
  },
  {
    label: "Active Users",
    value: "11",
    note: "Current active remitter accounts",
    icon: icons.users,
  },
  {
    label: "Pending KYC",
    value: "2",
    note: "Profiles awaiting review",
    icon: icons.shield,
  },
  {
    label: "New Customers",
    value: "10",
    note: "0 in previous range",
    icon: icons.earth,
  },
];

/* Flow chart geometry, in 0.1em units: 30 daily points, 23 Jul – 21 Aug. */
const X0 = 24;
const X1 = 236;
const Y0 = 6;
const Y1 = 116;
const step = (X1 - X0) / 29;
const x = (i: number) => X0 + i * step;
const yL = (v: number) => Y1 - (v / 12) * (Y1 - Y0);
const yR = (v: number) => Y1 - (v / 260) * (Y1 - Y0);
const f = (n: number) => n.toFixed(2);

// Monotone-cubic segments, as the app's chart library draws them.
const h3 = step / 3;
const customersPath =
  `M${X0} ${Y1}H${f(x(27))}` +
  `C${f(x(27) + h3)} ${Y1} ${f(x(28) - h3)} ${f(yL(10))} ${f(x(28))} ${f(yL(10))}` +
  `C${f(x(28) + h3)} ${f(yL(10))} ${f(x(29) - h3)} ${f(Y1 - (Y1 - yL(10)) / 2)} ${f(x(29))} ${Y1}`;
const volumePath =
  `M${X0} ${Y1}H${f(x(28))}` +
  `C${f(x(28) + h3)} ${Y1} ${f(x(29) - h3)} ${f(yR(250) + (Y1 - yR(250)) / 2)} ${f(x(29))} ${f(yR(250))}`;

const X_LABELS: [number, string][] = [
  [1, "24 Jul"],
  [3, "26 Jul"],
  [5, "28 Jul"],
  [7, "30 Jul"],
  [9, "1 Aug"],
  [11, "3 Aug"],
  [13, "5 Aug"],
  [15, "7 Aug"],
  [17, "9 Aug"],
  [20, "12 Aug"],
  [23, "15 Aug"],
  [26, "18 Aug"],
  [29, "21 Aug"],
];

function FlowChart() {
  return (
    <svg className="lf-plot" viewBox="0 0 268 129">
      <line className="lf-gridline" x1={X0} x2={X1} y1={Y0} y2={Y0} />
      <g fontSize={4.5} fill="#7f9096">
      {[0, 3, 6, 9, 12].map((v) => (
        <text key={v} x={18} y={yL(v) + 1.6} textAnchor="end">
          {v}
        </text>
      ))}
      {[0, 65, 130, 195, 260].map((v) => (
        <text key={v} x={241} y={yR(v) + 1.6}>
          £{v}.00
        </text>
      ))}
      {X_LABELS.map(([i, label]) => (
        <text key={label} fontSize={3.9} x={x(i)} y={Y1 + 8.6} textAnchor="middle">
          {label}
        </text>
      ))}
      </g>
      <rect
        className="lf-bar grow-y"
        x={x(29) - 2.3}
        y={yL(2)}
        width={4.6}
        height={Y1 - yL(2)}
        rx={0.5}
        style={d(6)}
      />
      <path className="lf-ln lf-ln-v draw" d={volumePath} pathLength={1} />
      <path className="lf-ln lf-ln-c draw" d={customersPath} pathLength={1} />
    </svg>
  );
}

/** The boxed "LINK FOREX" wordmark: the O is a network globe, the X two arrows. */
function Logo() {
  return (
    <span className="lf-logo">
      <span className="lf-logo-box">LINK</span>
      <span className="lf-logo-word">
        F
        <svg className="lf-logo-o" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="8.6" fill="#eef1f2" />
          <path
            d="M5 5.6 10.4 3.2 15.3 6.6 16.4 12 12.6 16.4 6.9 16.2 3.6 11.6 5 5.6M10.4 3.2 9.2 9.4 15.3 6.6M9.2 9.4 16.4 12M9.2 9.4 12.6 16.4M9.2 9.4 6.9 16.2M9.2 9.4 3.6 11.6M9.2 9.4 5 5.6M12.6 16.4 16.4 12"
            fill="none"
            stroke="#24373a"
            strokeWidth={0.55}
            strokeLinejoin="round"
          />
        </svg>
        RE
        <svg className="lf-logo-x" viewBox="0 0 18 20">
          <path d="M2.2 3 9 10 14.6 4.2" stroke="#19b2c0" />
          <path d="m12.4 3 3.6-1.2-.9 3.8z" fill="#19b2c0" stroke="#19b2c0" strokeWidth={0.8} />
          <path d="M3.4 16.8 9 10 15.8 17.4" stroke="#eef1f2" />
          <path d="m1.7 18.6 1.1-3.8 2.6 2.4z" fill="#eef1f2" stroke="#eef1f2" strokeWidth={0.8} />
        </svg>
      </span>
    </span>
  );
}

/** Illustrated admin avatar (an explorer in an orange hood), flat shapes only. */
function Avatar() {
  return (
    <span className="lf-avatar">
      <svg viewBox="0 0 40 40">
        <path d="M26 9h3v14h-3zM31 14h2v10h-2z" fill="#3b5560" />
        <circle cx="30.5" cy="12" r="1.6" fill="#f3c96b" />
        <path d="M7 40c0-9 5-14 12-14s12 5 12 14z" fill="#e0662a" />
        <path d="M11 20c0-7 3.5-11 8.5-11S28 13 28 20c0 4-2 7-8.5 7S11 24 11 20z" fill="#e57a33" />
        <ellipse cx="19.6" cy="20" rx="5.2" ry="5.6" fill="#f2c6a0" />
        <path d="M14.6 17.6c1.5-2.6 3.4-3.6 5-3.6s3.6 1 5 3.6c-1.6-.9-3.2-1.3-5-1.3s-3.4.4-5 1.3z" fill="#7a3b1c" />
        <path d="M26 28l6-6 2 1.5-5 7z" fill="#e9eef0" />
      </svg>
    </span>
  );
}

export function LinkForexScreen() {
  return (
    <Mock
      name="lf"
      palette={{
        "--m-bg": "#091717",
        "--m-fg": "#e6f2f1",
        "--m-dim": "#8d9ba9",
        "--m-acc": "#16c2ad",
        "--m-panel": "#10201f",
        "--m-line": "#1f3233",
      }}
    >
      <Browser url="linkforex.vercel.app/admin/dashboard">
        <div className="lf-app">
          <div className="lf-top">
            <div className="lf-brand">
              <Logo />
              <Ico className="lf-collapse">{icons.chevL}</Ico>
            </div>
            <div className="lf-search">
              <Ico>{icons.search}</Ico>
              <span>Search remitters and transfers...</span>
            </div>
            <div className="lf-actions">
              <span className="lf-new">
                <Ico>{icons.plus}</Ico>
                New Transfer
              </span>
              <span className="lf-round">
                <Ico>{icons.moon}</Ico>
              </span>
              <span className="lf-round">
                <Ico>{icons.bell}</Ico>
              </span>
              <span className="lf-user">
                <Avatar />
                <span>
                  <b>Admin</b>
                  <span>LONDON</span>
                </span>
              </span>
              <span className="lf-logout">
                <Ico>{icons.logout}</Ico>
              </span>
            </div>
          </div>

          <div className="lf-side">
            {NAV.map((item, i) => (
              <span
                key={item.label}
                className={`lf-nav${i === 0 ? " is-on" : ""}${item.group ? " is-group" : ""}`}
              >
                <Ico>{item.icon}</Ico>
                <span className="lf-nav-label">{item.label}</span>
                {item.group ? <Ico className="lf-chev">{icons.chevR}</Ico> : null}
              </span>
            ))}
          </div>

          <div className="lf-main">
            <div className="lf-head">
              <div>
                <div className="lf-h1">Dashboard</div>
                <div className="lf-lede">
                  Operational summary, live performance trends, queue health, and
                  customer distribution.
                </div>
              </div>
              <div className="lf-seg">
                <span>Last 7 Days</span>
                <span className="is-on">Last 30 Days</span>
                <span>Last 90 Days</span>
              </div>
            </div>

            <div className="lf-kpis">
              {KPIS.map((k, i) => (
                <div key={k.label} className="lf-card lf-kpi rise" style={d(i)}>
                  <span className="lf-kpi-label">{k.label}</span>
                  <span className="lf-kpi-ico">
                    <Ico>{k.icon}</Ico>
                  </span>
                  <b className="lf-kpi-value">{k.value}</b>
                  <span className="lf-kpi-note">{k.note}</span>
                </div>
              ))}
            </div>

            <div className="lf-row">
              <div className="lf-card lf-flow rise" style={d(3)}>
                <b className="lf-title">Flow Overview (30 Days - Latest Data)</b>
                <span className="lf-desc">
                  Transfer count, approved volume, and new customers.
                </span>
                <FlowChart />
                <div className="lf-legend">
                  <span className="lf-lg-c">
                    <svg viewBox="0 0 14 8">
                      <path d="M0 4h14" />
                      <circle cx="7" cy="4" r="2.4" />
                    </svg>
                    New Customers
                  </span>
                  <span className="lf-lg-t">
                    <i />
                    Transfers
                  </span>
                  <span className="lf-lg-v">
                    <svg viewBox="0 0 14 8">
                      <path d="M0 4h14" />
                      <circle cx="7" cy="4" r="2.4" />
                    </svg>
                    Volume
                  </span>
                </div>
              </div>

              <div className="lf-card lf-recent rise" style={d(4)}>
                <div className="lf-recent-head">
                  <b className="lf-title">Recent Activity</b>
                  <span className="lf-desc">Latest transactions in the selected window.</span>
                </div>
                {[
                  { amount: "£1,200.00", status: "Verify Pof Documents" },
                  { amount: "£250.00", status: "Approved" },
                ].map((row, i) => (
                  <div key={row.amount} className="lf-tx rise" style={d(5 + i)}>
                    <span className="lf-initials">SM</span>
                    <span className="lf-tx-who">
                      <b>Sara Malik</b>
                      <span>{row.amount}</span>
                    </span>
                    <span className="lf-pill">{row.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lf-row lf-row-next">
              <div className="lf-card lf-next">
                <b className="lf-title">Status Breakdown</b>
                <svg className="lf-donut" viewBox="0 0 100 50">
                  <circle cx="50" cy="28.3" r="13.75" />
                </svg>
              </div>
              <div className="lf-card lf-next">
                <b className="lf-title">Pipeline Trend</b>
                <span className="lf-desc">Approved versus queued transfers.</span>
                <svg className="lf-mini" viewBox="0 0 268 30" fontSize={4.5} fill="#7f9096">
                  <text x="12" y="9.6" textAnchor="end">
                    4
                  </text>
                  <line className="lf-gridline" x1="18" x2="262" y1="8" y2="8" />
                  <text x="12" y="27.6" textAnchor="end">
                    3
                  </text>
                  <line className="lf-gridline" x1="18" x2="262" y1="26" y2="26" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Browser>
    </Mock>
  );
}
