import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** The site mark, drawn in code: a cursor arrow on an ink tile. */
export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#161513",
        borderRadius: 16,
      }}
    >
      <svg width="40" height="40" viewBox="0 0 20 20">
        <path d="M4 3.4 16.6 8.5l-5.5 2-2 5.5Z" fill="#ffd84a" />
      </svg>
    </div>,
    size,
  );
}
