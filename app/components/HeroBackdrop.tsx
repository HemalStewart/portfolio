const ARCS = [
  "M760,260 Q980,80 1250,190",
  "M735,208 Q968,28 1255,138",
  "M712,156 Q956,-24 1255,86",
  "M690,104 Q944,-76 1255,34",
];

const STARS = [
  { cx: 90, cy: 70, r: 1.8, o: 0.7 },
  { cx: 210, cy: 140, r: 1.3, o: 0.5 },
  { cx: 330, cy: 60, r: 2.1, o: 0.8 },
  { cx: 150, cy: 220, r: 1.5, o: 0.45 },
  { cx: 430, cy: 170, r: 1.4, o: 0.55 },
  { cx: 520, cy: 90, r: 1.9, o: 0.65 },
  { cx: 700, cy: 400, r: 1.6, o: 0.5 },
  { cx: 1120, cy: 330, r: 1.7, o: 0.55 },
  { cx: 990, cy: 430, r: 1.3, o: 0.4 },
  { cx: 260, cy: 320, r: 1.5, o: 0.4 },
];

export function HeroBackdrop() {
  return (
    <svg
      viewBox="0 0 1200 560"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <defs>
        <linearGradient id="nightSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d2233" />
          <stop offset="55%" stopColor="#0c1c2a" />
          <stop offset="100%" stopColor="#0a1720" />
        </linearGradient>
        <linearGradient id="hillA" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#16394a" />
          <stop offset="100%" stopColor="#123143" />
        </linearGradient>
        <linearGradient id="hillB" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#102b39" />
          <stop offset="100%" stopColor="#0e2532" />
        </linearGradient>
        <linearGradient id="hillC" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0b1d27" />
          <stop offset="100%" stopColor="#091820" />
        </linearGradient>
        <linearGradient id="hillD" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#07131a" />
          <stop offset="100%" stopColor="#050f15" />
        </linearGradient>
        <linearGradient id="rainbow" x1="0" y1="0" x2="1" y2="0.35">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="26%" stopColor="#60a5fa" />
          <stop offset="50%" stopColor="#34d399" />
          <stop offset="74%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#fb7185" />
        </linearGradient>
        <radialGradient id="glow" cx="0.72" cy="0.34" r="0.5">
          <stop offset="0%" stopColor="#1d5c72" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#0c1c2a" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1200" height="560" fill="url(#nightSky)" />
      <rect width="1200" height="560" fill="url(#glow)" />

      {STARS.map((s) => (
        <circle
          key={`${s.cx}-${s.cy}`}
          className="hero-dot"
          cx={s.cx}
          cy={s.cy}
          r={s.r}
          fill="#e2f2ff"
          opacity={s.o}
          style={{ animationDelay: `${(s.cx % 5) * 0.6}s` }}
        />
      ))}

      {/* rainbow dash-arc fan */}
      <g>
        {ARCS.map((d, i) => (
          <path
            key={d}
            className="hero-arc"
            style={{ animationDelay: `${i * 100}ms` }}
            d={d}
            fill="none"
            stroke="url(#rainbow)"
            strokeWidth="13"
            strokeLinecap="round"
            strokeDasharray="17 16"
          />
        ))}
      </g>

      {/* layered night hills */}
      <path
        d="M0,318 C170,246 320,250 470,288 C620,326 760,220 910,258 C1010,283 1110,238 1200,268 L1200,560 L0,560 Z"
        fill="url(#hillA)"
      />
      <path
        d="M0,372 C190,312 360,432 530,372 C690,318 830,412 1010,352 C1090,327 1155,362 1200,342 L1200,560 L0,560 Z"
        fill="url(#hillB)"
      />
      <path
        d="M0,432 C210,392 410,462 610,422 C790,387 960,452 1200,412 L1200,560 L0,560 Z"
        fill="url(#hillC)"
      />
      <path
        d="M0,492 C240,462 420,516 640,486 C840,459 1010,506 1200,478 L1200,560 L0,560 Z"
        fill="url(#hillD)"
      />
    </svg>
  );
}
