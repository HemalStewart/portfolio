import { ImageResponse } from "next/og";
import { formatDownloads, releases, totalDownloads } from "./data/portfolio";

export const alt = "Hemal Herath — Software Engineer · Web, Flutter & AI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PAPER = "#0f0f11";
const INK = "#f3f1ea";
const DARK = "#161513";
const MUTED = "#a9a79f";
const MARKER = "#ffd84a";

/** A collaborator's cursor with its name tag, as on the board. */
function Cursor({
  left,
  top,
  color,
  label,
}: {
  left: number;
  top: number;
  color: string;
  label: string;
}) {
  return (
    <div style={{ position: "absolute", left, top, display: "flex" }}>
      <svg width="34" height="34" viewBox="0 0 20 20">
        <path
          d="M2.2 2.2 17.6 8.4l-6.7 2.5-2.5 6.7Z"
          fill={color}
          stroke="#fff"
          strokeWidth="1.4"
        />
      </svg>
      <div
        style={{
          display: "flex",
          marginTop: 24,
          marginLeft: -4,
          padding: "5px 14px 6px",
          borderRadius: "4px 16px 16px 16px",
          background: color,
          color: "#fff",
          fontSize: 20,
          fontWeight: 700,
        }}
      >
        {label}
      </div>
    </div>
  );
}

/** A sticky note holding one figure. */
function Sticky({
  left,
  top,
  color,
  tilt,
  value,
  label,
}: {
  left: number;
  top: number;
  color: string;
  tilt: number;
  value: string;
  label: string;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: 210,
        height: 180,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "20px 22px 22px",
        background: color,
        color: DARK,
        transform: `rotate(${tilt}deg)`,
        boxShadow: "0 22px 26px -14px rgba(0,0,0,0.7)",
      }}
    >
      <div style={{ fontSize: 64, fontWeight: 800, letterSpacing: -3 }}>
        {value}
      </div>
      <div style={{ fontSize: 22, color: DARK }}>{label}</div>
    </div>
  );
}

/** The share image: a still of the file, mid-build. */
export default function OpenGraphImage() {
  const dots = [];
  for (let x = 0; x < 30; x++)
    for (let y = 0; y < 16; y++)
      dots.push(
        <div
          key={`${x}-${y}`}
          style={{
            position: "absolute",
            left: 20 + x * 40,
            top: 15 + y * 40,
            width: 3,
            height: 3,
            borderRadius: 3,
            background: "rgba(255,255,255,0.13)",
          }}
        />,
      );

  return new ImageResponse(
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        background: PAPER,
        color: INK,
        padding: "64px 72px",
      }}
    >
      {dots}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 3,
            color: MUTED,
          }}
        >
          DESIGNER &amp; DEVELOPER · WEB, FLUTTER &amp; AI
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 150,
              fontWeight: 800,
              letterSpacing: -7,
              lineHeight: 0.86,
            }}
          >
            Hemal
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 150,
              fontWeight: 800,
              letterSpacing: -7,
              lineHeight: 0.86,
            }}
          >
            Herath
          </div>
          <div style={{ display: "flex", marginTop: 34 }}>
            <div
              style={{
                display: "flex",
                padding: "4px 16px 8px",
                background: MARKER,
                color: DARK,
                fontSize: 44,
                fontStyle: "italic",
              }}
            >
              from idea to production.
            </div>
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 24, color: MUTED }}>
          Software engineer · Colombo, Sri Lanka
        </div>
      </div>

      <Sticky
        left={760}
        top={70}
        color={MARKER}
        tilt={-5}
        value={formatDownloads(totalDownloads)}
        label="Play Store downloads"
      />
      <Sticky
        left={930}
        top={300}
        color="#ffb9cf"
        tilt={6}
        value={String(releases.length)}
        label="products live"
      />
      <Cursor left={690} top={318} color="#ff6a3d" label="Design" />
      <Cursor left={1010} top={236} color="#4f83ff" label="Web" />
      <Cursor left={820} top={470} color="#16b877" label="Flutter" />
      <Cursor left={980} top={530} color="#a678ff" label="Backend" />
      <Cursor left={610} top={120} color="#e0559b" label="UX" />
      <Cursor left={1090} top={96} color="#1aa7d6" label="API" />
      <Cursor left={700} top={556} color="#ff5d5d" label="QA" />
    </div>,
    size,
  );
}
