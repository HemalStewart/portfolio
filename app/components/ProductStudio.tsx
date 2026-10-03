"use client";

import { useState } from "react";

const transfers = [
  {
    label: "Admin",
    heading: "One operation. Every moving part.",
    items: [
      "Remitters & receivers",
      "Branch permissions",
      "Transfers & reporting",
    ],
  },
  {
    label: "Mobile",
    heading: "From onboarding to payment.",
    items: ["KYC & OTP", "Beneficiary management", "Payment flows"],
  },
  {
    label: "Backend",
    heading: "A shared system beneath both.",
    items: ["Controllers", "Service layer", "Models & persistence"],
  },
];
const modules: Record<string, string[]> = {
  Academics: ["Attendance", "Examinations", "Library"],
  People: ["HR", "Payroll", "Staff records"],
  Finance: ["Accounting", "Payroll", "Operations"],
};
const blueprints: Record<
  string,
  { label: string; nodes: string[]; caption: string }
> = {
  "smart-guardian-pro": {
    label: "Connected safety",
    nodes: ["SOS", "Live location", "Safety circle"],
    caption: "Location · Notifications · Sessions",
  },
  huddle: {
    label: "A room, without the walls.",
    nodes: ["Lobby", "Live call", "Recordings"],
    caption: "Clerk + Stream Video SDK",
  },
  "scholar-desktop": {
    label: "Read. Ask. Understand.",
    nodes: ["Reader", "AI tutor", "Flashcards"],
    caption: "Electron · Gemini / OpenAI",
  },
  papermind: {
    label: "Give your documents a voice.",
    nodes: ["OCR", "Context", "AI conversation"],
    caption: "Multi-provider routing · Prisma",
  },
  "englishmind-ai": {
    label: "Find your voice.",
    nodes: ["Speech", "Whisper", "CEFR feedback"],
    caption: "Cloud API / Offline self-hosted",
  },
  "sea-cloud-dalawella": {
    label: "A place worth discovering.",
    nodes: ["Discover", "Explore map", "Request a stay"],
    caption: "Hotel marketing · Reservation flow",
  },
};

export function ProductStudio({ slug }: { slug: string }) {
  const [tab, setTab] = useState(0);
  const [scanned, setScanned] = useState(false);
  if (slug === "linkforex")
    return (
      <div className="product-study transfer-study">
        <span className="study-brand">
          LinkForex<span>Fintech ecosystem</span>
        </span>
        <div
          className="study-tabs"
          role="group"
          aria-label="Explore LinkForex surfaces"
        >
          {transfers.map((item, i) => (
            <button
              key={item.label}
              type="button"
              aria-pressed={tab === i}
              onClick={() => setTab(i)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="transfer-paper">
          <div className="paper-top">
            <span className="tiny-mark">LF</span>
            <span>System overview / {transfers[tab].label}</span>
            <i aria-hidden="true">↗</i>
          </div>
          <p className="study-title">{transfers[tab].heading}</p>
          <div className="transfer-rows">
            {transfers[tab].items.map((item, i) => (
              <div key={item}>
                <span className="node-number">0{i + 1}</span>
                <span>{item}</span>
                <span aria-hidden="true">↗</span>
              </div>
            ))}
          </div>
          <div className="paper-foot">
            Next.js <span>↔</span> CodeIgniter <span>↔</span> Flutter
          </div>
        </div>
        <span className="study-sticker">
          Designed to
          <br />
          work together.
        </span>
        <span className="study-caption">
          Interactive system study · not live application UI
        </span>
      </div>
    );
  if (slug === "chatsoul-ai")
    return (
      <div className="product-study chat-study">
        <span className="study-brand">
          ChatSoul <em>/</em> VibeChat
          <span>One codebase. Three platforms.</span>
        </span>
        <div className="phone-composition">
          <div className="phone-device">
            <div className="phone-notch" />
            <div className="phone-title">
              <span className="chat-orb" />
              {tab === 0 ? "A little conversation." : "Your wallet."}
            </div>
            {tab === 0 ? (
              <div className="phone-messages">
                <p className="chat-message mine">A fresh perspective?</p>
                <p className="chat-message">Let’s make room for one.</p>
                <div className="chat-suggestions">
                  <span>Discover</span>
                  <span>Connect</span>
                </div>
                <div className="message-input">
                  Start a conversation <span>↑</span>
                </div>
              </div>
            ) : (
              <div className="wallet-study">
                <span>Wallet & subscriptions</span>
                <strong>
                  A connected
                  <br />
                  experience.
                </strong>
                <div>Wallet</div>
                <div>Subscriptions</div>
                <div>Referrals</div>
              </div>
            )}
            <span className="phone-demo-label">Illustrative product study</span>
          </div>
          <div className="platform-ticket">
            <span>Built once.</span>
            <strong>
              Android
              <br />
              iOS
              <br />
              Web
            </strong>
            <span>Flutter + backend APIs</span>
          </div>
        </div>
        <div
          className="study-tabs chat-switch"
          role="group"
          aria-label="Explore ChatSoul features"
        >
          {["Conversation", "Wallet"].map((label, i) => (
            <button
              key={label}
              type="button"
              aria-pressed={tab === i}
              onClick={() => setTab(i)}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="study-caption">
          Interactive product study · not live application UI
        </span>
      </div>
    );
  if (slug === "writescan")
    return (
      <div className="product-study scan-study">
        <span className="study-brand">
          WriteScan<span>From paper to possibility.</span>
        </span>
        <div className={`scanner-composition ${scanned ? "is-scanned" : ""}`}>
          <div className="scan-paper">
            <span className="paper-kicker">SAMPLE DOCUMENT / 01</span>
            <p className="study-title">
              Ideas don’t
              <br />
              belong on paper.
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
            <span className="paper-signature">Notes, made useful.</span>
          </div>
          <div className="scan-brackets" aria-hidden="true" />
          <div className="extracted-paper" aria-hidden={!scanned}>
            <span>Extracted text</span>
            <p>
              Capture the thought.
              <br />
              Extract the text.
              <br />
              Keep it close.
            </p>
            <small>Illustrative OCR result</small>
          </div>
        </div>
        <div className="scanner-toolbar">
          <span>ML Kit / SQLite</span>
          <button
            type="button"
            onClick={() => setScanned(!scanned)}
            aria-pressed={scanned}
          >
            {scanned ? "Reset study ↶" : "Try the scan study ↗"}
          </button>
        </div>
        <span className="study-caption">
          Illustrative workflow · no document upload or AI request
        </span>
      </div>
    );
  if (slug === "pdms")
    return (
      <div className="product-study school-study">
        <span className="study-brand">
          PDMS<span>The school behind the school.</span>
        </span>
        <div className="school-window">
          <div className="school-window-bar">
            <span>School operations</span>
            <span aria-hidden="true">•••</span>
          </div>
          <p className="study-title">
            Many departments.
            <br />
            One connected platform.
          </p>
          <div
            className="study-tabs"
            role="group"
            aria-label="Explore PDMS modules"
          >
            {Object.keys(modules).map((label, i) => (
              <button
                key={label}
                type="button"
                aria-pressed={tab === i}
                onClick={() => setTab(i)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="module-tiles">
            {modules[Object.keys(modules)[tab]].map((item, i) => (
              <div key={item}>
                <span aria-hidden="true">{["▥", "◷", "▤"][i]}</span>
                <strong>{item}</strong>
                <small>HMVC module</small>
              </div>
            ))}
          </div>
          <div className="school-window-foot">
            CodeIgniter / HMVC <span>Ministry of Education, Sri Lanka</span>
          </div>
        </div>
        <span className="study-caption">
          Interactive module study · not live application UI
        </span>
      </div>
    );
  const item = blueprints[slug];
  if (!item) return null;
  return (
    <div className={`product-study blueprint-study blueprint-${slug}`}>
      <span className="blueprint-kicker">
        Product architecture / illustrative
      </span>
      <p className="study-title">{item.label}</p>
      <div className="blueprint-path">
        {item.nodes.map((node, i) => (
          <div key={node}>
            <span className="blueprint-node">
              <i aria-hidden="true">{["◌", "◇", "↗"][i]}</i>
              {node}
            </span>
            {i < 2 && (
              <span className="blueprint-connector" aria-hidden="true">
                →
              </span>
            )}
          </div>
        ))}
      </div>
      <span className="blueprint-caption">{item.caption}</span>
    </div>
  );
}
