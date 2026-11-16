# Design concept — the live file

## The idea

The portfolio is a design file that builds itself in front of you. The canvas
is dark and runs edge to edge (no centred column), with rulers along its top
and left edge, a layers panel and an inspector that open from the toolbar,
and a tool dock, and a crew of twelve cursors — one per skill, all the same person — does
the work: they drag frames open while the piece fills in inside the
selection, type the headings behind a caret, carry sticky notes in, trace the
hand-drawn arrows and tick lists in row by row. Every section is built this
way as it scrolls into view.

The first four of the crew are the crafts the rest of the site is coloured by:

| Cursor  | Colour              | Token       |
| ------- | ------------------- | ----------- |
| Design  | vermilion `#FF6A3D` | `--design`  |
| Web     | cobalt `#4F83FF`    | `--web`     |
| Flutter | jade `#22D38A`      | `--flutter` |
| Backend | violet `#A678FF`    | `--ai`      |

`data-who="design|web|flutter|ai"` on any element sets `--who` to that colour.
The whole crew (Motion, API, UX, AI, SEO, Deploy, QA and Copy as well) is
listed in `app/components/swarm/crew.ts`.

## Palette and type

Canvas `#0F0F11`, cards `#1A1A1E`, tool chrome `--panel #17171A`, ink
`#F3F1EA`, muted `#A9A79F`. Highlighter `--marker #FFD84A`, and note stock in
pink, mint and sky; things that stay light (notes, markers) use `--ink-d` for
their text.

- **Archivo** (variable, `wdth` axis): display at `wdth` 112–125, body at
  normal width.
- One phrase per headline is shown as the selected text layer: a blue
  selection box with corner handles, drawn once the title is typed. No
  second display face.
- **Caveat**: handwriting — notes, arrow labels, sticky notes.
- **JetBrains Mono**: code, ruler numbers, size read-outs and small metadata.
  Frame labels use the UI face, as the tool sets them.

Kept out on purpose, because they read as template or generated design: a
dotted background grid, pill buttons and pill nav, a logo tile with a cursor
in it, rainbow gradient bars, offset "brutalist" shadows, and uppercase mono
eyebrows. Corners stay at 2–6px; the primary button is the tool's own blue.

## Where things live

- `app/globals.css` — tokens and the shared pieces: cursors, hand strokes,
  notes, stamps, frames, buttons, the toolbar and the dock.
- `app/styles/sections.css` — section spacing and openings (`BoardHead`).
- `app/styles/hero.css` — the hero collage.
- `app/styles/board.css` — every other section, top to bottom.
- `app/components/swarm/*` — the build: `engine.ts` (queue, cursors and
  actions), `Swarm` (the cursor layer), `Panels` (layers and inspector),
  `Typed` (splits text into letters or words), `crew.ts`.
- `app/components/board/*` — `Hero`, `TopBar`, `Dock`, `HPan`, `Drag`,
  `YouCursor`, `BoardMotion`, and the marks (`Arrow`, `FrameLabel`, `Stamp`).
- `app/components/crafts/*` — the pinned crafts sequence.

## The build

Any element marked `data-b` is a build step:

| `data-b` | What a cursor does                                             |
| -------- | -------------------------------------------------------------- |
| `frame`  | drags a selection from the top-left corner; the piece fills in |
| `type`   | types the letters (`.tc`, from `Typed`) behind a caret         |
| `words`  | writes a paragraph word by word (`.tw`)                        |
| `pop`    | clicks, and the piece pops in                                  |
| `drop`   | carries the piece in from one side and lets go                 |
| `draw`   | traces an SVG stroke; the line follows the cursor's tip        |
| `rows`   | runs down a list, ticking in each `data-row`                   |

`data-name` names the layer in the panels, `data-by` asks for a crew member,
and `data-w` orders steps inside one `data-scene` (lower waves first). A step
joins the queue when it scrolls into view and the nearest free cursor takes
it. Positions are read from the live layout every frame, so pinned and
panning sections stay under their cursors. When there is more work than hands
everyone speeds up, and a step that has waited too long is simply shown.
Escape finishes everything at once; the dock's Replay rebuilds what is on
screen.

Between jobs the cursors rest as bare arrows, follow the reader down the
page, select finished pieces (`data-pick`), click things that respond
(`data-act`: the hero's browser flips site, the phone changes screen, the
terminal prints) and gather round the contact frame (`data-gather`).

Hidden states only apply under `html[data-motion]`, which is set before first
paint, never with reduced motion, and withdrawn if the script never arrives —
nobody is left with hidden content.

## Other motion

- **Reveals** (`board/BoardMotion.tsx`): the few things not built by a cursor
  carry `.rv` and get `data-in` the first time they are on screen.
- **Crafts** (`crafts/Crafts.tsx`): a pinned stage where one frame morphs
  from a wireframe artboard to the built site, a Flutter app and a terminal.
- **Featured cases** are pinned and swapped by scroll (`PinnedWork`), each
  with an Interface / Code switch.
- **The websites wall** (`board/HPan.tsx`): the stage is pinned and the row of
  taped prints pans sideways; each print is drawn as it comes into view. On
  small screens it is a swipeable strip.
- **Notes are draggable** (`board/Drag.tsx`, mouse only), and the visitor's
  own cursor joins the file with a "You" tag (`board/YouCursor.tsx`).
- The **tool dock** lights the tool in use, and shows the current section and
  progress. The marquee leans and speeds up with scroll velocity.

## Layout

The layers panel appears from 1440px and the inspector from 1680px; the page
makes room through `--pl` / `--pr`, and `--cw` is the canvas width between
them (use it instead of `vw` for anything sized to the page). Phones get six
cursors and no panels.

## Performance and accessibility

Static prerender, self-hosted fonts via `next/font`, images through
`next/image`. The swarm animates transforms only, from one
`requestAnimationFrame` loop. Typed headings keep a screen-reader copy of
their text; the cursor layer and the decorative panels are `aria-hidden`;
visible focus rings; skip link; touch targets at least 44px. Responsive from
320px to 1920px with no horizontal scroll.
