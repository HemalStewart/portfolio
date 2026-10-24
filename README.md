# hemal/main — portfolio of Hemal Herath

Personal portfolio of Hemal Herath, software engineer in Colombo, Sri Lanka
(mobile, web & AI). The concept, palette, type and motion rules live in
[`docs/DESIGN.md`](docs/DESIGN.md).

Next.js 16 (App Router, fully static) · React 19 · Tailwind CSS 4 · Motion ·
Lenis · three.js (a voxel field behind the page that morphs between a
git-branch glyph, particles, a planet and a wave as you scroll). Visuals are
drawn in code — web project screens rebuilt from the live interfaces, favicon
and share image — while the mobile apps and websites show real screenshots.
Effects include a boot screen, an Interface / Code switch on the featured
projects, a pinned project showcase and CSS scroll-driven animations, all
respecting `prefers-reduced-motion`.

## Editing content

All content (releases, case studies, side projects, skills, links) is in
[`app/data/portfolio.ts`](app/data/portfolio.ts). Project screens live in
`app/components/mockups/screens` (store screenshots in `public/work`),
website screenshots in `public/showcase/thumbs`, featured code samples in
`app/data/code.ts`; the CV is `public/resume.pdf`.

## Commands

```bash
npm run dev     # local dev server
npm run lint    # eslint
npm run build   # production build
npm start       # serve the production build
```

Set `NEXT_PUBLIC_SITE_URL` (e.g. `https://hemal.dev`) to pin canonical/OG URLs
to a custom domain; otherwise Vercel's production URL is used.
