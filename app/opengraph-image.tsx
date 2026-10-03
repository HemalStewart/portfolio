import { ImageResponse } from "next/og";
import { formatDownloads, releases, totalDownloads } from "./data/portfolio";

export const alt = "Hemal Herath — Software Engineer · Mobile, Web & AI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#f4f2ea",
        color: "#0f2219",
        display: "flex",
        padding: "64px 72px",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{ display: "flex", gap: 12, fontSize: 24, color: "#0e5a43" }}
        >
          <span
            style={{
              background: "#0f2219",
              color: "#d9f99d",
              padding: "6px 14px",
              borderRadius: 999,
            }}
          >
            HEAD → main
          </span>
          <span
            style={{
              background: "#d9f99d",
              padding: "6px 14px",
              borderRadius: 999,
              color: "#0f2219",
            }}
          >
            open to roles
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 120,
              fontWeight: 700,
              letterSpacing: -6,
              lineHeight: 0.9,
            }}
          >
            Hemal
          </div>
          <div
            style={{
              fontSize: 120,
              fontWeight: 700,
              letterSpacing: -6,
              lineHeight: 0.9,
            }}
          >
            Herath
          </div>
          <div style={{ fontSize: 34, marginTop: 28, color: "#4f5e55" }}>
            Software engineer · mobile, web & AI · Colombo
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              marginTop: 14,
              color: "#0e5a43",
            }}
          >
            {formatDownloads(totalDownloads)} Play Store downloads ·{" "}
            {releases.length} live products
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 18,
        }}
      >
        {releases.map((release, index) => (
          <div
            key={release.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              fontSize: 28,
            }}
          >
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: 999,
                border: "4px solid #0f2219",
                background: index === 0 ? "#0f2219" : "#d9f99d",
              }}
            />
            <span>{release.name}</span>
          </div>
        ))}
      </div>
    </div>,
    size,
  );
}
