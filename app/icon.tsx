import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** The site mark: the initials, set heavy, on the canvas colour. */
export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f0f11",
        borderRadius: 12,
        color: "#f3f1ea",
        fontSize: 34,
        fontWeight: 800,
        letterSpacing: -3,
      }}
    >
      hh
    </div>,
    size,
  );
}
