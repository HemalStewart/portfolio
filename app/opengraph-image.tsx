import { ImageResponse } from "next/og";

export const alt = "Hemal Herath — Full-Stack Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#f4f3ed",
          color: "#172b2b",
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
          <div style={{ fontSize: 44, color: "#246052", marginTop: 15 }}>
            Thoughtfully built. Ready for the real world.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            borderTop: "1px solid #bfcbb9",
            paddingTop: 25,
            fontSize: 24,
          }}
        >
          Web / Mobile / Applied AI
        </div>
      </div>
    ),
    size,
  );
}
