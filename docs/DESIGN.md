# Design concept — the live board

## The idea

The portfolio is a designer's working board: dotted paper, black ink,
hand-drawn arrows, handwriting, sticky notes, rubber stamps, frames with small
coloured labels, and four collaborator cursors — one per craft — that fly
around doing the work. It should feel made by a person, in front of you.

| Cursor       | Colour               | Token       |
| ------------ | -------------------- | ----------- |
| Design       | vermilion `#FF5A36`  | `--design`  |
| Web          | cobalt `#2D5BFF`     | `--web`     |
| Flutter      | jade `#00A56E`       | `--flutter` |
| Backend & AI | violet `#8B4DFF`     | `--ai`      |

`data-who="design|web|flutter|ai"` on any element sets `--who` to that colour.

## Palette and type

Paper `#F4F1EA` (with a darker `--paper-2` for the websites wall), cards
`#FFFDF8`, ink `#161513`, muted `#5E5B54`. Highlighter `--marker #FFD84A`, and
note stock in pink, mint and sky. Devices (browser, phone, terminal, the code
editor) stay dark on purpose: they are objects lying on the paper.

- **Archivo** (variable, `wdth` axis): display at `wdth` 112–125, body at
  normal width.
- **Instrument Serif** italic: the one phrase per headline, run over with the
  marker.
- **Caveat**: handwriting — notes, arrow labels, sticky notes.
- **JetBrains Mono**: frame labels and small metadata.

## Where things live

- `app/globals.css` — tokens and the shared pieces: reveal system, cursors,
  hand strokes, notes, stamps, frames, buttons, the toolbar and the dock.
- `app/styles/sections.css` — section spacing and openings (`BoardHead`).
- `app/styles/hero.css` — the hero collage.
- `app/styles/board.css` — every other section, top to bottom.
- `app/components/board/*` — `Hero` (the build), `TopBar`, `Dock`, `HPan`,
  `Drag`, `YouCursor`, `BoardMotion`, and the marks (`CursorMark`, `Arrow`,
  `FrameLabel`, `Stamp`).
- `app/components/crafts/*` — the pinned crafts sequence.

## Motion

- **The hero builds itself** (`board/Hero.tsx`). An inline script sets
  `html[data-build="pending"]` before first paint (once per session, never
  with reduced motion); the pieces wait hidden for `data-on`. Design drags a
  selection and pins the tagline, Web types the name and carries the browser
  in, Flutter brings the phone, the backend cursor drops a terminal, then
  arrows draw and the stamp lands. Cursors aim at measured element positions,
  so the choreography holds at any size. Afterwards they keep working: the
  browser flips through sites, the phone changes screen, the terminal prints.
  Scrolling away finishes the build at once; the dock's Replay runs it again.
- **Reveals** (`board/BoardMotion.tsx`): anything with `.rv` gets `data-in`
  the first time it is on screen. Hidden states only apply under
  `html[data-motion]`, so reduced-motion and no-script visitors see everything.
  Notes pop, stamps thump, arrows draw, cursors fly in and park.
- **Crafts** (`crafts/Crafts.tsx`): a pinned stage where one frame morphs
  from a wireframe artboard to the built site, a Flutter app and a terminal.
  Scroll position is written to custom properties and the stylesheet
  interpolates every size in `cqw`.
- **Featured cases** are pinned and swapped by scroll (`PinnedWork`), each
  with an Interface / Code switch.
- **The websites wall** (`board/HPan.tsx`): the stage is pinned and the row of
  taped prints pans sideways; on small screens it is a swipeable strip.
- **Notes are draggable** (`board/Drag.tsx`, mouse only), and the visitor's
  own cursor joins the board with a "You" tag (`board/YouCursor.tsx`).
- The **tool dock** shows the tool in use during the build, then the current
  section and progress. The marquee leans and speeds up with scroll velocity.

## Performance and accessibility

Static prerender, self-hosted fonts via `next/font`, images through
`next/image`. Lenis and Motion's features load after first paint. Text
contrast AA; visible focus rings; skip link; decorative layers are
`aria-hidden`; touch targets at least 44px. Responsive from 320px to 1920px
with no horizontal scroll.
