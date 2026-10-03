# Interactive engineering studio

The portfolio now uses an original mesh-based character rather than a generated avatar image. All project descriptions, technologies, production URLs, repository references, contact details, and the CV are unchanged. Earlier image assets and the user's `.claude` directory are preserved.

## Character

- Source: `scripts/build-character.mjs`; rebuild with `npm run model:build`.
- Output: `public/models/studio-engineer.glb` (approximately 2 MB).
- Renderer: `app/components/EngineerScene.tsx`, dynamically importing Three.js and GLTFLoader only on the client.
- Original stylized seated engineer with glasses, headphones, cream jacket, laptop, articulated head, studio stool, and mesh-based web/mobile/backend surfaces. Not a portrait of Hemal and not a copied/licensed third-party character.
- Mouse drag rotates the model; pointer movement gently turns the head. Rotation/reset buttons support keyboard and touch without blocking page scrolling.
- Solid/Mesh controls expose the actual geometry. Mesh mode disables ground shadows.
- Rendering is demand-driven, suspended offscreen and in hidden tabs, and respects reduced motion. Resize observers maintain correct proportions; resources are disposed on unmount.
- A text fallback preserves usability when JavaScript, WebGL, or the asset is unavailable. No raster image is substituted for the model.

## Product studies

`ProductStudio.tsx` builds distinct illustrations with HTML/CSS, not generic mockup images:

- LinkForex: admin, mobile, and backend views of the factual system architecture.
- ChatSoul/VibeChat: illustrative conversation and wallet views, with platform coverage.
- WriteScan: sample document/extraction transition; no document upload or AI request.
- PDMS: academic, people, and finance module views.
- Six secondary projects: compact editorial rows with native expandable delivery details.

These are explicitly labeled illustrative studies, not screenshots of deployed applications. They do not fabricate transactions, user counts, account balances, product outcomes, or AI results. Actual production and source links remain separate from the studies. Core portfolio content is server-rendered and remains readable without these interactions.

## Design decisions

Light-only warm paper, charcoal, and restrained blue. Mona Sans headlines and IBM Plex Mono metadata. A full-screen hero integrates the real-time character directly into the composition, without an avatar image, decorative asterisk logo, or vague human-touch slogan. Navigation uses a text wordmark, sticky header, progress line, and quiet numbered chapter rail.

Four featured projects use a compact numbered index beside one complete case-study panel. Selecting a project changes its large interactive visual, platform metadata, server-rendered delivery details, stack, and source/production links. The index is sticky only when the viewport is tall enough to show all four choices; shorter screens keep it static. Tablet/mobile use a two-column project selector above the active study. A no-JavaScript stylesheet displays every case rather than hiding unselected content. Secondary work, grouped skills, and the archive use restrained editorial lists rather than repetitive cards.

At the user's request, a consistent set of borderless monochrome SVG contact marks replaces the mixed-color PNG presentation in the header and footer. The original PNG files and profile data remain untouched. Link labels, tooltips, and destinations are preserved, with charcoal icons and blue hover/focus treatments.

The user-supplied company site was inspected for its full-screen composition, chapter navigation, and work-viewer principles only. It was not added as a project. None of its identity, code, assets, slogans, statistics, or claims was copied. UI/UX Pro Max, 21st catalog inspiration, and Motion guidance informed responsive layouts, readable contrast, focus states, and reduced-motion/demand-driven behavior. Existing project primitives were adapted; no catalog component or paid hosted generation was used.

## Verification

- `npm run lint` and `npm run build` pass on Next.js 16.2.1.
- Production preview visually inspected at 375, 768, 1280, and 1440px; document width matches viewport width at all four sizes.
- GLB header/version validated: 51 meshes, 10 materials, the articulated `Head` node, and `WebSurface`, `MobileSurface`, and `DataStack` groups.
- Mouse-drag and keyboard rotation verified; visible keyboard focus and 44px interaction targets checked.
- All four featured study interactions verified, including extraction visibility and module changes.
- Monochrome contact icons render correctly, external links include safe `rel` values, and one h1 with an ordered heading hierarchy is present.
- Original portfolio data is byte-for-byte unchanged. All 36 URL definitions in that data appear in the server-rendered HTML, and no-JavaScript instructions are present. No local filesystem paths or the retired slogan appear in rendered HTML. The resume and model return HTTP 200.
- Reduced-motion and unavailable-WebGL handling were checked in source, not emulated in the browser.
- `21st review` returned informational local-color notices only, with no error/warning findings. Semantic interface colors and deliberately local illustration/lighting colors are documented in `.21st`.

## Dependency limitation

The repository retains the requested Next.js 16.2.1 and React 19 versions. `npm audit` reports 15 vulnerabilities across existing dependencies, including a critical Next.js advisory. Every reported vulnerable package was already present in the prior lockfile; Three.js is not flagged. Framework/security upgrades should be handled as a separate tested change, not silently mixed into this redesign.

## Changed files

- Page, typography, styling, and share metadata: `app/page.tsx`, `app/layout.tsx`, `app/globals.css`, `app/opengraph-image.tsx`.
- Updated components: `EngineerScene.tsx`, `Portfolio.tsx`, `ProductStudio.tsx`, `TopNav.tsx`.
- New focused components: `FeaturedWork.tsx`, `ContactIcon.tsx`.
- Original model source/output: `scripts/build-character.mjs`, `public/models/studio-engineer.glb`.
- Design/verification notes: `.21st/design.json`, `.21st/DESIGN.md`, this document.

`app/data/portfolio.ts`, existing public screenshots/icons/avatar/resume, and the user's `.claude` directory are unchanged.
