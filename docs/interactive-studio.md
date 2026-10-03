# Interactive engineering studio

The portfolio now uses an original mesh-based character rather than a generated avatar image. All project descriptions, technologies, production URLs, repository references, contact details, and the CV are unchanged. Earlier image assets and the user's `.claude` directory are preserved.

## Character

- Source: `scripts/build-character.mjs`; rebuild with `npm run model:build`.
- Output: `public/models/studio-engineer.glb` (approximately 1.2 MB).
- Renderer: `app/components/EngineerScene.tsx`, dynamically importing Three.js and GLTFLoader only on the client.
- Original stylized seated engineer with glasses, headphones, jacket, laptop, articulated head, and studio stool. Not a portrait of Hemal and not a copied/licensed third-party character.
- Mouse drag rotates the model; pointer movement gently turns the head. Rotation/reset buttons support keyboard and touch without blocking page scrolling.
- Rendering is demand-driven, suspended offscreen and in hidden tabs, and respects reduced motion. Resize observers maintain correct proportions; resources are disposed on unmount.
- A text fallback preserves usability when JavaScript, WebGL, or the asset is unavailable. No raster image is substituted for the model.

## Product studies

`ProductStudio.tsx` builds distinct illustrations with HTML/CSS, not generic mockup images:

- LinkForex: admin, mobile, and backend views of the factual system architecture.
- ChatSoul/VibeChat: illustrative conversation and wallet views, with platform coverage.
- WriteScan: sample document/extraction transition; no document upload or AI request.
- PDMS: academic, people, and finance module views.
- Six secondary projects: compact, project-specific architecture diagrams.

These are explicitly labeled illustrative studies, not screenshots of deployed applications. They do not fabricate transactions, user counts, account balances, product outcomes, or AI results. Actual production and source links remain separate from the studies. Core portfolio content is server-rendered and remains readable without these interactions.

## Design decisions

Warm ivory, charcoal, plum, and restrained orange; generous editorial typography; a real-time character integrated directly into the hero; alternating featured case studies followed by compact project diagrams and an archive. The direction is original rather than a clone of another portfolio. UI/UX Pro Max, 21st inspiration, and Motion guidance informed responsiveness, contrast, focus states, and demand-driven interaction.

## Verification

- `npm run lint` and `npm run build` pass on Next.js 16.2.1.
- Production preview visually inspected at 375, 768, 1280, and 1440px; document width matches viewport width at all four sizes.
- GLB header/version validated: 34 meshes, 10 materials, and the articulated `Head` node.
- Mouse-drag and keyboard rotation verified; visible keyboard focus and 44px interaction targets checked.
- All four featured study interactions verified, including extraction visibility and module changes.
- Contact icons load correctly, external links include safe `rel` values, and one h1 with an ordered heading hierarchy is present.
- Original portfolio data is byte-for-byte unchanged. All original URL definitions appear in the server-rendered HTML, and no-JavaScript instructions are present.
- Reduced-motion and unavailable-WebGL handling were checked in source, not emulated in the browser.

## Dependency limitation

The repository retains the requested Next.js 16.2.1 and React 19 versions. `npm audit` reports 15 vulnerabilities across existing dependencies, including a critical Next.js advisory. Every reported vulnerable package was already present in the prior lockfile; Three.js is not flagged. Framework/security upgrades should be handled as a separate tested change, not silently mixed into this redesign.
