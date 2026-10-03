"use client";
import { useState } from "react";

const transfers = [
  {
    label: "Admin",
    heading: "Every part of the operation.",
    items: [
      "Remitters & receivers",
      "Branch permissions",
      "Transfers & reporting",
    ],
    stack: "Next.js / TypeScript",
  },
  {
    label: "Mobile",
    heading: "From onboarding to payment.",
    items: ["KYC & OTP", "Beneficiary management", "Payment flows"],
    stack: "Flutter / Dart",
  },
  {
    label: "Backend",
    heading: "The shared business logic.",
    items: [
      "Controllers & services",
      "Models & persistence",
      "Client integrations",
    ],
    stack: "PHP / CodeIgniter",
  },
];
const modules = [
  { label: "Academics", items: ["Attendance", "Examinations", "Library"] },
  { label: "People", items: ["HR", "Payroll", "Attendance"] },
  { label: "Finance", items: ["Accounting", "Payroll"] },
];
function StudyTabs({
  labels,
  value,
  onChange,
  label,
}: {
  labels: string[];
  value: number;
  onChange: (value: number) => void;
  label: string;
}) {
  return (
    <div className="study-tabs" role="group" aria-label={label}>
      {labels.map((name, i) => (
        <button
          type="button"
          key={name}
          aria-pressed={value === i}
          onClick={() => onChange(i)}
        >
          {name}
        </button>
      ))}
    </div>
  );
}
export function ProductStudio({ slug }: { slug: string }) {
  const [view, setView] = useState(0);
  const [scanned, setScanned] = useState(false);
  if (slug === "linkforex")
    return (
      <div className="product-study transfer-study">
        <div className="study-label">
          <span>LinkForex</span>
          <span>Fintech / 3 surfaces</span>
        </div>
        <div className="transfer-composition">
          <div className="system-spine" aria-hidden="true">
            <span>WEB</span>
            <i />
            <span>API</span>
            <i />
            <span>APP</span>
          </div>
          <div className="transfer-window">
            <div className="window-bar">
              <span className="window-dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span>LinkForex / {transfers[view].label}</span>
              <span aria-hidden="true">↗</span>
            </div>
            <div className="transfer-content">
              <span className="eyebrow">End-to-end remittance system</span>
              <p className="study-title">{transfers[view].heading}</p>
              <div className="transfer-rows">
                {transfers[view].items.map((item, i) => (
                  <div key={item}>
                    <span>0{i + 1}</span>
                    <strong>{item}</strong>
                    <span aria-hidden="true">↗</span>
                  </div>
                ))}
              </div>
              <div className="window-foot">
                <span>{transfers[view].stack}</span>
                <span>Admin ↔ Backend ↔ Mobile</span>
              </div>
            </div>
          </div>
          <span className="system-badge">
            Shared backend.
            <br />
            Connected clients.
          </span>
        </div>
        <StudyTabs
          labels={transfers.map((item) => item.label)}
          value={view}
          onChange={setView}
          label="Explore LinkForex surfaces"
        />
        <p className="study-caption">
          Interactive architecture study · not live application UI
        </p>
      </div>
    );
  if (slug === "chatsoul-ai")
    return (
      <div className="product-study chat-study">
        <div className="study-label">
          <span>ChatSoul / VibeChat</span>
          <span>Android · iOS · Web</span>
        </div>
        <div className="chat-composition">
          <div className="platform-column" aria-hidden="true">
            <span>
              One Flutter
              <br />
              codebase.
            </span>
            <strong>3</strong>
            <span>platforms</span>
            <div>
              Android
              <br />
              iOS
              <br />
              Web
            </div>
          </div>
          <div className="phone-device">
            <div className="phone-notch" aria-hidden="true" />
            <div className="phone-header">
              <span className="chat-orb" aria-hidden="true">
                AI
              </span>
              <span>
                ChatSoul<span>Feature overview</span>
              </span>
            </div>
            {view === 0 ? (
              <div className="phone-messages">
                <span className="phone-section-label">
                  Conversation & discovery
                </span>
                <p className="chat-message mine">A fresh perspective?</p>
                <p className="chat-message">Let’s make room for one.</p>
                <div className="chat-suggestions">
                  <span>Discover</span>
                  <span>Connect</span>
                </div>
                <div className="message-input">
                  Example conversation<span aria-hidden="true">↑</span>
                </div>
              </div>
            ) : (
              <div className="wallet-study">
                <span className="phone-section-label">
                  Wallet & subscriptions
                </span>
                <p>
                  A connected
                  <br />
                  experience.
                </p>
                {["Wallet", "Subscriptions", "Referrals"].map((item, i) => (
                  <div key={item}>
                    <span aria-hidden="true">0{i + 1}</span>
                    {item}
                    <span aria-hidden="true">↗</span>
                  </div>
                ))}
              </div>
            )}
            <span className="phone-demo-label">Illustrative feature study</span>
          </div>
        </div>
        <StudyTabs
          labels={["Conversation", "Wallet"]}
          value={view}
          onChange={setView}
          label="Explore ChatSoul features"
        />
        <p className="study-caption">
          Interactive product study · not live application UI
        </p>
      </div>
    );
  if (slug === "writescan")
    return (
      <div className="product-study scan-study">
        <div className="study-label">
          <span>WriteScan</span>
          <span>Documents / Mobile AI</span>
        </div>
        <div className={`scanner-composition ${scanned ? "is-scanned" : ""}`}>
          <div className="scan-paper">
            <span className="paper-kicker">SAMPLE DOCUMENT / 01</span>
            <p className="study-title">
              Scan.
              <br />
              Extract.
              <br />
              Use the text.
            </p>
            <p>
              Capture the thought.
              <br />
              Extract the text.
              <br />
              Keep it close.
            </p>
            <div className="scan-lines" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
            <span className="paper-signature">Text / Handwriting / CSV</span>
          </div>
          <div className="scan-brackets" aria-hidden="true">
            <span>Document boundary</span>
          </div>
          <div className="extracted-paper" aria-hidden={!scanned}>
            <span>Extracted text</span>
            <p>
              Capture the thought.
              <br />
              Extract the text.
              <br />
              Keep it close.
            </p>
            <small>Illustrative extraction result</small>
          </div>
        </div>
        <div className="scanner-toolbar">
          <span>
            ML Kit / SQLite
            <br />
            Offline-first storage
          </span>
          <button
            type="button"
            aria-pressed={scanned}
            onClick={() => setScanned(!scanned)}
          >
            {scanned ? "Reset study" : "Try extraction"}
            <span aria-hidden="true">{scanned ? "↶" : "↗"}</span>
          </button>
        </div>
        <p className="study-caption">
          Illustrative workflow · no upload or AI request
        </p>
      </div>
    );
  if (slug === "pdms")
    return (
      <div className="product-study school-study">
        <div className="study-label">
          <span>PDMS</span>
          <span>Education / Operations</span>
        </div>
        <div className="school-window">
          <div className="window-bar">
            <span className="window-dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span>School operations</span>
            <span aria-hidden="true">↗</span>
          </div>
          <div className="school-content">
            <span className="eyebrow">A modular HMVC platform</span>
            <p className="study-title">
              Many departments.
              <br />
              One connected system.
            </p>
            <StudyTabs
              labels={modules.map((item) => item.label)}
              value={view}
              onChange={setView}
              label="Explore PDMS modules"
            />
            <div className="module-tiles">
              {modules[view].items.map((item, i) => (
                <div key={item}>
                  <span aria-hidden="true">0{i + 1}</span>
                  <strong>{item}</strong>
                  <small>HMVC module</small>
                </div>
              ))}
            </div>
            <div className="window-foot">
              <span>CodeIgniter / HMVC</span>
              <span>Ministry of Education, Sri Lanka</span>
            </div>
          </div>
        </div>
        <p className="study-caption">
          Interactive module study · not live application UI
        </p>
      </div>
    );
  return null;
}
