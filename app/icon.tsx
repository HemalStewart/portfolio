import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** The site mark, drawn in code: a git-branch glyph of three square commits. */
export default function Icon() {
  const commit = (left: number, top: number, fill: string) => (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: 14,
        height: 14,
        background: fill,
      }}
    />
  );
  return new ImageResponse(
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#0a0b0a",
        borderRadius: 14,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 19,
          top: 18,
          width: 5,
          height: 28,
          background: "#f0efe9",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 19,
          top: 22,
          width: 26,
          height: 20,
          borderRight: "5px solid #b6f36a",
          borderBottom: "5px solid #b6f36a",
          borderBottomRightRadius: 14,
        }}
      />
      {commit(14, 8, "#f0efe9")}
      {commit(14, 42, "#f0efe9")}
      {commit(36, 12, "#b6f36a")}
    </div>,
    size,
  );
}
