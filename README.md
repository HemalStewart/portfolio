# hemal/main — portfolio of Hemal Herath

Personal portfolio of Hemal Herath, software engineer in Colombo, Sri Lanka
(mobile, web & AI). The concept, palette, type and motion rules live in
[`docs/DESIGN.md`](docs/DESIGN.md).

Next.js 16 (App Router, fully static) · React 19 · Tailwind CSS 4. No client
JavaScript is used for visuals; motion is CSS only and respects
`prefers-reduced-motion`.

## Editing content

All content (releases, case studies, side projects, skills, links) is in
[`app/data/portfolio.ts`](app/data/portfolio.ts). Project screenshots are
`public/projects/<slug>.png`; the CV is `public/resume.pdf`.

## Commands

```bash
npm run dev     # local dev server
npm run lint    # eslint
npm run build   # production build
npm start       # serve the production build
```

Set `NEXT_PUBLIC_SITE_URL` (e.g. `https://hemal.dev`) to pin canonical/OG URLs
to a custom domain; otherwise Vercel's production URL is used.
