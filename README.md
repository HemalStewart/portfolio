# hemal/main — portfolio of Hemal Herath

Personal portfolio of Hemal Herath, software engineer in Colombo, Sri Lanka
(mobile, web & AI). The concept, palette, type and motion rules live in
[`docs/DESIGN.md`](docs/DESIGN.md).

Next.js 16 (App Router, fully static) · React 19 · Tailwind CSS 4 · Motion ·
Lenis · three.js (a code-modelled guide bot that walks visitors through the
page). Project visuals are code-built mockups (no images); effects include an
X-ray code lens, a pinned project showcase and CSS scroll-driven animations,
all respecting `prefers-reduced-motion`.

## Editing content

All content (releases, case studies, side projects, skills, links) is in
[`app/data/portfolio.ts`](app/data/portfolio.ts). Project mockups live in
`app/components/mockups`, lens code samples in `app/data/code.ts`; the CV is
`public/resume.pdf`.

## Commands

```bash
npm run dev     # local dev server
npm run lint    # eslint
npm run build   # production build
npm start       # serve the production build
```

Set `NEXT_PUBLIC_SITE_URL` (e.g. `https://hemal.dev`) to pin canonical/OG URLs
to a custom domain; otherwise Vercel's production URL is used.
