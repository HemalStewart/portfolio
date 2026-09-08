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
          <stop offset="0%" stopColor="#eaf7f4" />
          <stop offset="100%" stopColor="#eaf7f4" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="hillFront" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#5cc2b3" />
          <stop offset="100%" stopColor="#3fb3a5" />
        </linearGradient>
      </defs>

      <rect width="1200" height="520" fill="url(#sky)" />

      {/* scattered whimsy dots */}
      <circle cx="130" cy="90" r="5" fill="#a7e3da" opacity="0.8" />
      <circle cx="1080" cy="60" r="4" fill="#f8c99a" opacity="0.7" />
      <circle cx="960" cy="140" r="6" fill="#a7e3da" opacity="0.6" />
      <circle cx="220" cy="180" r="3.5" fill="#f8c99a" opacity="0.6" />
      <circle cx="700" cy="70" r="4.5" fill="#a7e3da" opacity="0.7" />

      {/* back hill */}
      <path
        d="M0,300 C150,230 300,230 450,270 C600,310 750,200 900,240 C1000,265 1100,220 1200,250 L1200,520 L0,520 Z"
        fill="#d3f1ec"
      />
      {/* mid hill */}
      <path
        d="M0,360 C180,300 350,420 520,360 C680,305 820,400 1000,340 C1080,315 1150,350 1200,330 L1200,520 L0,520 Z"
        fill="#a7e3da"
      />
      {/* front hill */}
      <path
        d="M0,420 C200,380 400,450 600,410 C780,375 950,440 1200,400 L1200,520 L0,520 Z"
        fill="url(#hillFront)"
      />
    </svg>
  );
}
