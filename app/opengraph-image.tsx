import { ImageResponse } from "next/og";
import { formatDownloads, releases, totalDownloads } from "./data/portfolio";

export const alt = "Hemal Herath — Software Engineer · Mobile, Web & AI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#0a0b0a";
const INK = "#f0efe9";
const MUTED = "#a3a79f";
const ACCENT = "#b6f36a";

/**
 * The hero's voxel git-branch glyph, flattened to squares on a grid: three
 * commit rings, the trunk and the merging curve.
 */
function voxels() {
  const cell = 15;
  const A = [90, 400];
  const B = [90, 80];
  const C = [280, 160];
  const R = 50;
  const ring = 19;
  const line = 17;
  const curve: number[][] = [];
  for (let i = 0; i <= 20; i++) {
    const t = i / 20;
    const u = 1 - t;
    const p = [
      [C[0], C[1] + R],
      [C[0], 270],
      [200, 300],
      [A[0], 315],
    ];
    curve.push([
      u * u * u * p[0][0] + 3 * u * u * t * p[1][0] + 3 * u * t * t * p[2][0] + t * t * t * p[3][0],
      u * u * u * p[0][1] + 3 * u * u * t * p[1][1] + 3 * u * t * t * p[2][1] + t * t * t * p[3][1],
    ]);
  }
  const nearSegment = (x: number, y: number, a: number[], b: number[]) => {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const h = Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / (dx * dx + dy * dy)));
    return Math.hypot(x - a[0] - dx * h, y - a[1] - dy * h);
  };
  const cells: { x: number; y: number; fill: string }[] = [];
  let seed = 11;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let x = 0; x < 380; x += cell)
    for (let y = 0; y < 480; y += cell) {
      const cx = x + cell / 2;
      const cy = y + cell / 2;
      const head = Math.abs(Math.hypot(cx - C[0], cy - C[1]) - R) < ring;
      let on =
        head ||
        Math.abs(Math.hypot(cx - A[0], cy - A[1]) - R) < ring ||
        Math.abs(Math.hypot(cx - B[0], cy - B[1]) - R) < ring ||
        nearSegment(cx, cy, [B[0], B[1] + R], [A[0], A[1] - R]) < line;
      for (let i = 0; !on && i < curve.length - 1; i++)
        on = nearSegment(cx, cy, curve[i], curve[i + 1]) < line;
      if (!on) continue;
      const shade = random();
      cells.push({
        x,
        y,
        fill: head ? ACCENT : shade < 0.15 ? "#8d918a" : shade < 0.4 ? "#d9d8d1" : INK,
      });
    }
  return cells;
}

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        background: BG,
        color: INK,
        padding: "60px 72px",
      }}
    >
      {[1, 2, 3, 4, 5].map((col) => (
        <div
          key={col}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: col * 200,
            width: 1,
            background: "rgba(240,239,233,0.05)",
          }}
        />
      ))}
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
            alignItems: "center",
            gap: 14,
            fontSize: 22,
            letterSpacing: 3,
            color: MUTED,
          }}
        >
          <div style={{ width: 12, height: 12, background: ACCENT }} />
          SOFTWARE ENGINEER · COLOMBO, SRI LANKA
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 138,
              fontWeight: 800,
              letterSpacing: -6,
              lineHeight: 0.88,
            }}
          >
            Hemal
          </div>
          <div
            style={{
              fontSize: 138,
              fontWeight: 800,
              letterSpacing: -6,
              lineHeight: 0.88,
            }}
          >
            Herath
          </div>
          <div
            style={{
              fontSize: 44,
              marginTop: 22,
              color: ACCENT,
              fontStyle: "italic",
            }}
          >
            from idea to production.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 40,
            fontSize: 24,
            color: MUTED,
            borderTop: "1px solid #2d322d",
            paddingTop: 22,
          }}
        >
          <span style={{ color: INK }}>
            {formatDownloads(totalDownloads)} Play Store downloads
          </span>
          <span>{releases.length} live products</span>
          <span>hemal/main</span>
        </div>
      </div>
      <div
        style={{
          position: "relative",
          display: "flex",
          width: 380,
          height: 480,
          marginTop: 10,
        }}
      >
        {voxels().map((v) => (
          <div
            key={`${v.x}-${v.y}`}
            style={{
              position: "absolute",
              left: v.x,
              top: v.y,
              width: 13,
              height: 13,
              borderRadius: 2,
              background: v.fill,
            }}
          />
        ))}
      </div>
    </div>,
    size,
  );
}
