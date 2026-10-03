# Project Design Context (21st)

Machine-readable context lives in `.21st/design.json`; the full concept is in
[`docs/DESIGN.md`](../docs/DESIGN.md).

- **Concept:** "Merged to main" — Hemal Herath's portfolio as a git history.
- **Stack:** Next.js 16 (static), React 19, Tailwind CSS 4, Motion (`motion/react`).
- **Tokens:** `app/globals.css` (`--paper`, `--ink`, `--tea`, `--leaf`, `--signal`, …) with a
  `prefers-color-scheme: dark` override.
- **Type:** Bricolage Grotesque (display/body), JetBrains Mono (git layer).
- **Motion components:** `app/components/motion/*` — use `m.*` inside the `LazyMotion`
  provider in `app/layout.tsx`; everything honours reduced motion.
- **Content rules:** only real data from `app/data/portfolio.ts` and the CV; no avatar.
