import { ImageResponse } from "next/og";

export const alt = "Hemal Herath — Full-Stack Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#f2f1ec",
        color: "#181c22",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "70px",
      }}
    >
      <div style={{ display: "flex", fontSize: 23 }}>
        Full-Stack Software Engineer · Sri Lanka
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 82, fontWeight: 700, letterSpacing: -4 }}>
          Hemal Herath
        </div>
        <div style={{ fontSize: 44, color: "#2852b6", marginTop: 15 }}>
          Web & mobile. Built end to end.
        </div>
      </div>
      <div
        style={{
          display: "flex",
          borderTop: "1px solid #d6d7d1",
          paddingTop: 25,
          fontSize: 24,
        }}
      >
        Web / Mobile / Applied AI
      </div>
    </div>,
    size,
  );
}
