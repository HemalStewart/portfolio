const ARCS = [
  "M650,260 Q900,60 1210,180",
  "M620,210 Q890,10 1220,130",
  "M600,160 Q880,-40 1220,80",
];

export function HeroBackdrop() {
  return (
    <svg
      viewBox="0 0 1200 520"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dcf3ee" />
          <stop offset="100%" stopColor="#dcf3ee" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="hillBack" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#bfeae1" />
          <stop offset="100%" stopColor="#a7e3da" />
        </linearGradient>
        <linearGradient id="hillMid" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#71cec1" />
          <stop offset="100%" stopColor="#4fbdae" />
        </linearGradient>
        <linearGradient id="hillFront" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2f9d8f" />
          <stop offset="100%" stopColor="#177f74" />
        </linearGradient>
        <linearGradient id="rainbow" x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0%" stopColor="#b794f6" />
          <stop offset="28%" stopColor="#63b3ed" />
          <stop offset="52%" stopColor="#4fd1a5" />
          <stop offset="75%" stopColor="#f6c453" />
          <stop offset="100%" stopColor="#f2836b" />
        </linearGradient>
      </defs>

      <rect width="1200" height="520" fill="url(#sky)" />

      {/* rainbow dash-arc fan */}
      <g>
        {ARCS.map((d, i) => (
          <path
            key={d}
            className="hero-arc"
            style={{ animationDelay: `${i * 90}ms` }}
            d={d}
            fill="none"
            stroke="url(#rainbow)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray="15 15"
          />
        ))}
      </g>

      {/* whimsy dots */}
      <circle className="hero-dot" cx="1080" cy="60" r="6" fill="#f6c453" opacity="0.8" style={{ animationDelay: "1.1s" }} />
      <circle className="hero-dot" cx="950" cy="150" r="5" fill="#63b3ed" opacity="0.7" style={{ animationDelay: "2s" }} />
      <circle className="hero-dot" cx="1160" cy="220" r="5.5" fill="#b794f6" opacity="0.7" style={{ animationDelay: "0.6s" }} />

      {/* back hill */}
      <path
        d="M0,300 C150,230 300,230 450,270 C600,310 750,200 900,240 C1000,265 1100,220 1200,250 L1200,520 L0,520 Z"
        fill="url(#hillBack)"
      />
      {/* mid hill */}
      <path
        d="M0,360 C180,300 350,420 520,360 C680,305 820,400 1000,340 C1080,315 1150,350 1200,330 L1200,520 L0,520 Z"
        fill="url(#hillMid)"
      />
      {/* front hill */}
      <path
        d="M0,420 C200,380 400,450 600,410 C780,375 950,440 1200,400 L1200,520 L0,520 Z"
        fill="url(#hillFront)"
      />
    </svg>
  );
}
