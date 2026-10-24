import "./novice-monk-registry.css";
import type { CSSProperties, ReactNode } from "react";
import { Browser, Mock } from "../kit";

const d = (n: number) => ({ "--d": n }) as CSSProperties;

/** A 24px line icon in the lucide style the live admin uses. */
function Ico({ children }: { children: ReactNode }) {
  return (
    <svg
      className="nm-ico"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

const icons = {
  overview: (
    <Ico>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </Ico>
  ),
  clipboard: (
    <Ico>
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4M12 16h4M8 11h.01M8 16h.01" />
    </Ico>
  ),
  building: (
    <Ico>
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4M10 10h4M10 14h4M10 18h4" />
    </Ico>
  ),
  book: (
    <Ico>
      <path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2Z" />
      <path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7Z" />
    </Ico>
  ),
  users: (
    <Ico>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </Ico>
  ),
  gear: (
    <Ico>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2Z" />
      <circle cx="12" cy="12" r="3" />
    </Ico>
  ),
  profile: (
    <Ico>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="10" r="3" />
      <path d="M7 20.66V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.66" />
    </Ico>
  ),
  file: (
    <Ico>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4M10 9H8M16 13H8M16 17H8" />
    </Ico>
  ),
  shield: (
    <Ico>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1Z" />
      <path d="m9 12 2 2 4-4" />
    </Ico>
  ),
  plus: (
    <Ico>
      <path d="M12 5v14M5 12h14" />
    </Ico>
  ),
  chevron: (
    <Ico>
      <path d="m6 9 6 6 6-6" />
    </Ico>
  ),
  search: (
    <Ico>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </Ico>
  ),
  download: (
    <Ico>
      <path d="M12 3v12M7 10l5 5 5-5M4 21h16" />
    </Ico>
  ),
};

/** Rounded badge striped in the Buddhist flag colours with a serif N. */
function Logo() {
  return (
    <span className="nm-logo">
      <span>N</span>
    </span>
  );
}

const workspace = [
  { label: "Overview", icon: icons.overview, active: true },
  { label: "Applications", icon: icons.clipboard },
  { label: "Districts", icon: icons.building },
  { label: "Piriven accounts", icon: icons.book },
];
const administration = [
  { label: "User access", icon: icons.users },
  { label: "System status", icon: icons.gear },
  { label: "My profile", icon: icons.profile },
];

const kpis = [
  {
    label: "Total applications",
    value: "552",
    note: "Live records in your scope",
    icon: icons.clipboard,
    tone: "blue",
  },
  {
    label: "Awaiting review",
    value: "40",
    flag: "Needs attention",
    note: "in your assigned scope",
    icon: icons.file,
    tone: "amber",
  },
  {
    label: "Active pirivens",
    value: "824",
    note: "Live connected accounts",
    icon: icons.building,
    tone: "blue",
  },
  {
    label: "Approval rate",
    value: "92.8%",
    note: "Based on submitted applications",
    icon: icons.shield,
    tone: "rose",
  },
];

/** Submitted / approved per month; heights are a share of the plot. */
const months = [
  { m: "May", s: 0, a: 0 },
  { m: "Jun", s: 0, a: 0 },
  { m: "Jul", s: 0, a: 0 },
  { m: "Aug", s: 0, a: 0 },
  { m: "Sep", s: 552, a: 512 },
  { m: "Oct", s: 0, a: 0 },
];
const PLOT_MAX = 552 / 0.8;

const review = [
  { label: "Approved", value: 512, color: "#2b438f" },
  { label: "Under review", value: 40, color: "#c68d00" },
  { label: "Returned", value: 0, color: "#ca3432" },
  { label: "Draft", value: 0, color: "#c7d4cb" },
];
const REVIEW_TOTAL = 552;

function NavItem({
  label,
  icon,
  active,
}: {
  label: string;
  icon: ReactNode;
  active?: boolean;
}) {
  return (
    <div className={`nm-nav${active ? " is-on" : ""}`}>
      {icon}
      <span>{label}</span>
    </div>
  );
}

export function NoviceMonkScreen() {
  return (
    <Mock
      name="nm"
      palette={{
        "--m-bg": "#f6f8fa",
        "--m-fg": "#1b1f30",
        "--m-dim": "#62687b",
        "--m-acc": "#2b438f",
        "--m-panel": "#ffffff",
        "--m-line": "#e6e9ef",
      }}
    >
      <Browser url="novice-monk-admin.vercel.app/admin">
        <div className="nm-app">
          <aside className="nm-side">
            <div className="nm-flag">
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
            <div className="nm-brand">
              <Logo />
              <div className="nm-brand-t">
                <span className="nm-brand-name">Novice Monk</span>
                <span className="nm-brand-sub">Registry</span>
              </div>
            </div>
            <div className="nm-sect">
              <span>Workspace</span>
            </div>
            {workspace.map((n) => (
              <NavItem key={n.label} {...n} />
            ))}
            <div className="nm-sect">
              <span>Administration</span>
            </div>
            {administration.map((n) => (
              <NavItem key={n.label} {...n} />
            ))}
            <div className="nm-side-foot">
              <span className="nm-av">
                <span>DO</span>
              </span>
              <span className="nm-who-t">
                <span className="nm-who-name">DIVISION OF PIRIVEN</span>
                <span className="nm-who-role">Central administration</span>
              </span>
            </div>
          </aside>

          <div className="nm-main">
            <div className="nm-top">
              <span className="nm-crumb">
                Registry / <strong>Overview</strong>
              </span>
              <div className="nm-who">
                <span className="nm-av">
                  <span>DO</span>
                </span>
                <span className="nm-who-t">
                  <span className="nm-who-name">DIVISION OF PIRIVEN</span>
                  <span className="nm-who-role">Super administrator</span>
                </span>
              </div>
              <span className="nm-btn nm-signout">
                <span>Sign out</span>
              </span>
            </div>

            <div className="nm-content">
              <div className="nm-head rise">
                <div>
                  <span className="nm-kicker">Registry overview</span>
                  <div className="nm-h1">Good afternoon, DIVISION.</div>
                  <span className="nm-lead">
                    Here is the current state of the novice monk registry.
                  </span>
                </div>
                <span className="nm-add">
                  {icons.plus}
                  <span>Add district</span>
                </span>
              </div>

              <div className="nm-kpis">
                {kpis.map((k, i) => (
                  <div key={k.label} className="nm-card nm-kpi rise" style={d(i + 1)}>
                    <span className={`nm-tile nm-${k.tone}`}>{k.icon}</span>
                    <span className="nm-kpi-label">{k.label}</span>
                    <span className="nm-kpi-val">{k.value}</span>
                    <span className="nm-kpi-note">
                      {k.flag ? <strong>{k.flag}</strong> : null}
                      {k.note}
                    </span>
                  </div>
                ))}
              </div>

              <div className="nm-row">
                <div className="nm-card nm-panel rise" style={d(5)}>
                  <div className="nm-ph">
                    <div>
                      <span className="nm-pt">Application activity</span>
                      <span className="nm-ps">
                        Actual submissions and approvals recorded in MongoDB
                      </span>
                    </div>
                    <span className="nm-select">
                      <span>Last 6 months</span>
                      {icons.chevron}
                    </span>
                  </div>
                  <div className="nm-plot">
                    {months.map((m, i) => (
                      <div key={m.m} className="nm-col">
                        <div className="nm-bars">
                          {m.s > 0 ? (
                            <>
                              <i
                                className="grow-y nm-sub"
                                style={{
                                  height: `${(m.s / PLOT_MAX) * 100}%`,
                                  ...d(i + 2),
                                }}
                              />
                              <i
                                className="grow-y nm-apr"
                                style={{
                                  height: `${(m.a / PLOT_MAX) * 100}%`,
                                  ...d(i + 3),
                                }}
                              />
                            </>
                          ) : null}
                        </div>
                        <span className="nm-col-v">
                          {m.s} / {m.a}
                        </span>
                        <span className="nm-col-m">{m.m}</span>
                      </div>
                    ))}
                  </div>
                  <div className="nm-legend">
                    <span>
                      <i className="nm-sub" />
                      Submitted
                    </span>
                    <span>
                      <i className="nm-apr" />
                      Approved
                    </span>
                  </div>
                </div>

                <div className="nm-card nm-panel rise" style={d(6)}>
                  <span className="nm-pt">Review status</span>
                  <span className="nm-ps">Across all applications in your scope</span>
                  <div className="nm-rs">
                    {review.map((r) => (
                      <div key={r.label} className="nm-rs-row">
                        <div className="nm-rs-top">
                          <i className="nm-dot" style={{ background: r.color }} />
                          <span className="nm-rs-label">{r.label}</span>
                          <span className="nm-rs-val">{r.value}</span>
                        </div>
                        <div className="nm-track">
                          {r.value > 0 ? (
                            <i
                              className="grow-x"
                              style={{
                                width: `${(r.value / REVIEW_TOTAL) * 100}%`,
                                background: r.color,
                              }}
                            />
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="nm-card nm-recent rise" style={d(7)}>
                <div className="nm-recent-h">
                  <div>
                    <span className="nm-pt">Recent applications</span>
                    <span className="nm-ps">
                      Latest submissions from MongoDB in your assigned scope
                    </span>
                  </div>
                  <span className="nm-search">
                    {icons.search}
                    <span>Search applications</span>
                  </span>
                  <span className="nm-btn nm-export">
                    {icons.download}
                    <span>Export summary</span>
                  </span>
                </div>
                <div className="nm-thead">
                  <span>Piriven</span>
                  <span>Applicant</span>
                  <span>District / Zone</span>
                  <span>Submitted</span>
                  <span>Status</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Browser>
    </Mock>
  );
}
