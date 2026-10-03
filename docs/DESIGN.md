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
2. **Hero / HEAD** — commit header with a branch monogram, kinetic H1 name,
   statement, CTAs, rolling facts; branch graph of every production release.
   Then a scroll-inked `README.md` statement.
3. **Releases** — production deployments grouped per product with store/web links.
4. **Merged branches** — four featured case studies in a pinned stage (X-ray lens, highlights,
   stack, references) then six more projects in a compact grid.
5. **Experience** — roles from the CV as a `git log` timeline, with education and
   recognition (IEEE paper, competitions) in a side panel.
6. **Stack** — skill groups + the tech marquee.
7. **Side branches** — additional projects as a log list.
8. **Open a PR** — contact: email, phone, LinkedIn, GitHub, CV. Footer.

## Motion

The site should feel alive, but the effects come from CSS wherever possible
and JavaScript only where the interaction needs it:

- **X-ray lens** (`XRayLens`) on each featured case: the code-built interface is
  masked by a soft circle that follows the pointer (eased, springs larger on
  press, tap to move on touch, arrow keys when focused) and reveals an
  illustrative code layer for that stack. A "Show code" toggle swaps layers.
- **Pinned showcase** (`PinnedWork`): on desktop the four featured cases share a
  sticky full-height stage, one viewport of scroll each; text lines slide and
  the visual wipes between projects. Small/short screens and reduced motion get
  the same cases stacked.
- **Typed commands** (`TypeCommand`): each section's `$ git …` line types itself
  out when it scrolls into view.
- **Rolling digits** (`Odometer`, Motion) on the hero facts; **magnetic CTAs**
  (`Magnetic`, Motion); a trailing **cursor ring** that labels outbound links.
- **Lenis smooth scrolling**, loaded after hydration.
- CSS scroll-driven animations (`animation-timeline: view()/scroll()`): the
  README paragraph inks word by word, headings clip up, the experience rail
  draws, mockup parts build in (charts draw, KPIs rise, bars grow), card
  visuals drift, the top progress bar fills.
- CSS-only: kinetic hero letters (rise + hover hop), branch graph draw-in,
  marquee, pointer spotlight on cards (one delegated listener).

Everything honours `prefers-reduced-motion`. Looping animations use only
transform/opacity so they stay on the compositor.

## Visuals: no raster assets

Every project visual is a code-built mockup (`app/components/mockups`): HTML,
CSS and SVG sketches of the real product's layout and vocabulary (taken from
the live app or store listing). Text sizes derive from the mockup's computed
width (`--mw`), not container queries, which measured ~2× slower to lay out.
The only binary asset left is `public/resume.pdf`.

## Performance & accessibility budget

- Static prerender, self-hosted fonts via `next/font`; no images at all.
- No `three`. Motion features and Lenis load lazily after first paint.
- Contrast AA for all text; visible focus rings; skip link; semantic landmarks.
- Responsive 320–1920px with no horizontal overflow.
- Metadata: title, description, canonical, Open Graph image, Twitter card,
  `robots.txt`, `sitemap.xml`, JSON-LD `Person`.
