# Design concept — "Merged to main"

## The idea

The portfolio reads as a **git history of one engineer**. Every product Hemal has
shipped is a branch that eventually merged into `main` and got a `live` tag. The
site borrows the vocabulary every engineer already knows — commits, branches,
tags, releases, pull requests — and uses it as a structural device, not as a
gimmick terminal theme:

- the hero is a **commit header** (author, location, message) next to a drawn
  **branch graph** where the real production products fork off and merge back;
- live deployments are **releases**;
- case studies are **merged branches**;
- smaller experiments are **side branches**;
- the contact section asks you to **open a pull request** (send an email).

It is personal, not agency: one author, one history, real artifacts only.

## Palette — "tea estate paper"

Light, warm, and green — a nod to Sri Lankan tea country rather than a dark
studio look.

| Token     | Value     | Use                                         |
| --------- | --------- | ------------------------------------------- |
| `paper`   | `#F4F2EA` | page background                             |
| `paper-2` | `#EBE8DC` | raised panels, image mats                   |
| `ink`     | `#0F2219` | text, dark contact section                  |
| `muted`   | `#4F5E55` | secondary text (AA on paper)                |
| `line`    | `#D3D3C4` | hairlines, graph rails                      |
| `tea`     | `#0E5A43` | primary accent: links, branch `main`        |
| `leaf`    | `#2F8A5F` | secondary branch colour                     |
| `signal`  | `#D9F99D` | highlighter behind text, `HEAD`/`live` tags |
| `clay`    | `#B4532A` | one warm branch colour (sparingly)          |

`signal` is only ever a background behind `ink` text, never text on paper.

## Type

- **Bricolage Grotesque** (variable, `opsz` + `wdth`) — display and body. Big,
  slightly quirky optical sizes for headings, calm at text size.
- **JetBrains Mono** — the "git" layer: labels, hashes, tags, stack lists.

## Layout

12-column fluid shell, max 1240px, 16–40px gutters. Generous vertical rhythm,
hairline rules between rows, oversized section titles with a mono `git`
command as the eyebrow (e.g. `$ git tag --list`).

## Sections

1. **Header** — wordmark `hemal/main`, anchors, CV button. Mobile: the anchors
   become a horizontally scrollable row under the bar (no JS).
2. **Hero / HEAD** — commit header with avatar as author, H1 name, statement,
   CTAs; branch graph SVG of the five production products.
3. **Releases** — production deployments grouped per product with store/web links.
4. **Merged branches** — four featured case studies (screenshot, highlights,
   stack, references) then six more projects in a compact grid.
5. **Stack** — skill groups + the tech marquee.
6. **Side branches** — additional projects as a log list.
7. **Open a PR** — contact: email, phone, LinkedIn, GitHub, CV. Footer.

## Motion

All CSS, no animation library, no WebGL:

- branch graph strokes draw in on load (`stroke-dashoffset`), and a single
  "commit" dot travels along `main` via `offset-path`;
- section rows reveal with scroll-driven animations (`animation-timeline: view()`)
  inside `@supports`, so unsupported browsers just show content;
- marquee is a transform-only CSS loop;
- everything is disabled under `prefers-reduced-motion: reduce`.

No JavaScript runs for the visuals: there are no client components and the
page is fully static.

## Performance & accessibility budget

- Static prerender, self-hosted fonts via `next/font`, `next/image` for all
  screenshots (lazy-loaded; only the 72px avatar is preloaded).
- No `three`, no `framer-motion`.
- Contrast AA for all text; visible focus rings; skip link; semantic landmarks.
- Responsive 320–1920px with no horizontal overflow.
- Metadata: title, description, canonical, Open Graph image, Twitter card,
  `robots.txt`, `sitemap.xml`, JSON-LD `Person`.
