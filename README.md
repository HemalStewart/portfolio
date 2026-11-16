# Hemal Herath — portfolio

Personal portfolio of Hemal Herath, software engineer in Colombo, Sri Lanka
(web design, web development, Flutter and AI). The concept, palette, type and
motion rules live in [`docs/DESIGN.md`](docs/DESIGN.md).

Next.js 16 (App Router, fully static) · React 19 · Tailwind CSS 4 (preflight
only; the styles are plain CSS) · Motion · Lenis. The site is a design file
that builds itself: a crew of twelve named cursors drags the frames open,
types the headings, carries the notes in and traces the arrows, section after
section, with a live layers panel and inspector beside the canvas. The crafts
sequence morphs one frame from wireframe to website to Flutter app to
terminal, and the websites pan sideways along a wall. Everything respects
`prefers-reduced-motion`.

## Editing content

All content (crafts, releases, case studies, side projects, skills, links) is in
[`app/data/portfolio.ts`](app/data/portfolio.ts). Project screens live in
`app/components/mockups/screens` (store screenshots in `public/work`, the
phone screens cropped from them in `public/crafts`),
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
