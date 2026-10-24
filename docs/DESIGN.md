# Design concept — "Merged to main", after dark

## The idea

The portfolio reads as a **git history of one engineer**. Every product Hemal has
shipped is a branch that eventually merged into `main` and got a `live` tag. The
site borrows the vocabulary every engineer already knows — commits, branches,
tags, releases, pull requests — and uses it as a structural device:

- the hero puts the name beside a **voxel git-branch glyph** (three commits, a
  trunk and a merge) that bursts into particles as you scroll and reassembles
  at the end — merged;
- live deployments are **releases**; case studies are **merged branches**;
  experiments are **side branches**; websites live on a **`web/` branch**,
  with a 3D fly-through at `/showcase`;
- the contact section asks you to **open a pull request** (send an email).

The look follows the studio sites Hemal has built (Shifenmei, Calcify,
Lakmini International): near-black, one electric accent, very large
expanded type with one italic serif phrase, mono metadata, and a living 3D
layer behind everything.

## Visuals

- the **voxel field** is generated geometry (three.js instanced cubes);
- **project screens** live one per file in `app/components/mockups/screens`.
  Web products (LinkForex, PDMS, Novice Monk Registry, Huddle, Scholar
  Desktop, PaperMind, EnglishMind, Smart Guardian's store panels) are rebuilt
  in code from the live interface: real labels, figures, layout and colours,
  sized in em off the frame width (`--mw`), with invented names wherever the
  real screen shows people. Mobile apps whose screens are artwork and
  photography — VibeChat AI and WriteScan — show their real store
  screenshots (`public/work/*`) in a coverflow (`StoreShots`), and the Sea
  Cloud website shows its real homepage;
- the **favicon** (`app/icon.tsx`) and **share image**
  (`app/opengraph-image.tsx`) are rendered with `next/og`.

The websites section shows real screenshots (`public/showcase/thumbs/*.jpg`,
lazy-loaded through `next/image`); the same thumbnails are the textures of
the 3D fly-through at `/showcase`. `public/resume.pdf` is the CV download.

## Palette

| Token      | Value     | Use                                        |
| ---------- | --------- | ------------------------------------------ |
| `bg`       | `#0A0B0A` | page                                       |
| `bg-2/3`   | `#101210` / `#161916` | panels, hovers                 |
| `line`     | `#1F231F` / `#2D322D` | hairlines, grid               |
| `ink`      | `#F0EFE9` | text                                       |
| `muted`    | `#A3A79F` | secondary text (AA on bg)                  |
| `subtle`   | `#7A7F77` | mono labels                                |
| `accent`   | `#B6F36A` | the one accent: CTAs, emphasis, live state |
| `merge`    | `#B9A3FF` | the `merged` tag only                      |

Change `--accent` and `--accent-rgb` in `:root`; the voxel palette lives at
the top of `app/components/field/scene.ts`.

## Type

- **Archivo** (variable, `wdth` axis) — display at `wdth` 112–125 (expanded),
  body at normal width.
- **Instrument Serif** — the italic phrase in each headline (`<em>`).
- **JetBrains Mono** — the git layer: eyebrows, commands, tags, stacks.

## Layout

12-column fluid shell, max 1240px, 16–40px gutters. A faint six-column grid
sits behind the page; `+` crosshairs mark where each section rule meets the
shell. Sections open with an eyebrow — `(02) ■ RELEASES — $ git tag …` — then
an oversized title with one italic serif word.

## Chrome

- **Boot screen** (`chrome/Boot.tsx`): a short clone log and a 00→100
  counter, then the panel wipes up. Pure CSS; once per session (an inline
  script in the layout skips it on repeat visits); never with reduced motion.
- **Header**: full-width bar, branch mark + wordmark, centred nav with a
  sliding accent square, Colombo local time, CV and an accent "Hire me" pill.
  Small screens get a full-screen menu.
- **Chapter rail** (`chrome/ChapterRail.tsx`): fixed right-edge ticks with a
  `03 / 10` count; wide screens only.

## The voxel field

`app/components/field/scene.ts`: one `InstancedMesh` of rounded cubes
(2,000 on desktop, 1,100 on phones), lit by a room environment, fog for
depth. Four formations, each voxelised from a signed distance field or laid
out on a grid:

- `branch` — the git-branch glyph; the head commit is lit in the accent;
- `scatter` — sparse particles across the viewport, mostly fine dust;
- `sphere` — a hollow voxel planet;
- `wave` — a field of columns that rolls at runtime.

`VoxelField.tsx` maps scroll to a mood per section (shape, placement, scale,
opacity) and blends to the next as that section's top reaches mid-screen;
voxels fly with a per-instance stagger and a slight outward bow. The pointer
tilts the whole field and pushes nearby voxels aside. three.js loads when the
browser is idle after first paint; rendering stops in hidden tabs; reduced
motion draws still frames; without WebGL the page simply has no field.

## Motion

- Hero letters rise out of line masks after the boot screen; the kicker,
  copy and strip fade up.
- **Interface / Code switch** (`CodeSwitch`) on the four featured cases: a
  pill switch wipes the code-built interface into an editor window (file tab,
  line numbers, status bar) behind an accent scan line, and the lines settle
  in one by one. The editor sizes its font from the sample's line count and
  longest line so every line fits, from a phone to the pinned stage; samples
  in `app/data/code.ts` are illustrative sketches, and the status bar says so.
  The smaller project cards show the interface only.
- **Pinned showcase**, **typed commands**,
  **rolling digits**, **magnetic CTAs**, a **cursor** ring with an accent dot.
- **Lenis smooth scrolling**, loaded after hydration.
- CSS scroll-driven animations: the README paragraph inks word by word,
  headings clip up, the experience rail draws, card visuals drift, the footer
  wordmark rises, the header progress line fills.

Everything honours `prefers-reduced-motion`.

## Performance & accessibility budget

- Static prerender, self-hosted fonts via `next/font`; raster images (store
  and website screenshots) are WebP/JPEG, lazy-loaded through `next/image`.
- three.js, Motion features and Lenis all load lazily after first paint.
- Contrast AA for all text; visible focus rings; skip link; semantic
  landmarks; decorative layers are `aria-hidden`.
- Responsive 320–1920px with no horizontal overflow.
