---
name: MediaWave Israel
description: Hebrew RTL site for a one-developer web studio - "one shot" (shot): one camera move over Nati's desk, a cream desk, white paper, black ink, the end credits on black; the site's sheets land on the table one by one, a closed laptop opens and builds this very site, and the camera pulls back until the whole site is one phone on the desk. Mobile first.
colors:
  table: "#EDE7DA"
  paper: "#FFFFFF"
  ink: "#1A1917"
  ink-2: "#4D4942"
  line: "rgba(26, 25, 23, 0.14)"
  line-ui: "rgba(26, 25, 23, 0.62)"
  logo-a: "#1A1917"
  logo-b: "#225079"
  logo-tag: "#4D4942"
  logo-b-on-ink: "#79A0C5"
  face: "#FFFFFF"
typography:
  display:
    fontFamily: "MW Noto = Noto Sans Hebrew variable (Hebrew + Latin), MW Noto Fallback (Arial, metric-matched)"
    fontWeight: 800
    fontStretch: "75%"
    lineHeight: 1.02-1.2
  body:
    fontFamily: "MW Noto"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  ui:
    fontFamily: "MW Noto"
    fontWeight: 700
components:
  key-button:
    backgroundColor: "{colors.ink}"
    textColor: "#FFFFFF"
    rounded: "2px"
  key-button-paper:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.ink}"
    rounded: "2px"
---

# Design System: MediaWave Israel (October 2026, "one shot")

Source of truth for tokens: `src/look/looks.css` (the `html[data-look="shot"]` block). Decisions: `DECISIONS.rtl.md` D81-D89. Spec and story: `design/shot/SPEC.md`, `design/shot/storyboard.rtl.md`. Production is **shot** (`npm run build`); K, M and KM stay buildable for comparison (`build:k`, `build:m`, `build:km`); the previous production (KM, "launch night") is the tag `prod-before-shot`.

## 1. Overview

One camera move over Nati's desk (D83). The page is one grey table from top to bottom; every surface is a white sheet of paper lying on it; text and buttons are ink. Chapters, top to bottom: the hero sheet with the lens (the dive), why us (screens that light one at a time), services (the old site's tools on the desk), the build (the closed laptop opens and builds this site, then the four steps on an ink line), the FAQ notepad, the big word, the contact letter with the Rive companion, the pull-back into one phone, the footer sign-off.

Mobile first (D84): every rule is written for 390px, then widened. Sacred: the hero video (inside the lens), the 13 Lotties, the URLs and anchors (#top #why-us #services #process #faq #contact), one H1, every `track()` call.

## 2. Colour (D109, D86; D81 was the grey version)

Black, white and cream (Nati, 17.10.2026), each a material, laid out in four bands with a hard cut between them (D110): black at the top (the header and the opening: a white sheet lit on a black desk; objects there carry a thin cream rim), cream in the middle (why us, services, the build, the steps), white for the ask (questions, the big word, the letter, the pull-back; the paper turns cream there), black at the end (the credits). Inner pages: a black opening band (the path, the hero sheet and its object), then cream, then the black footer. In words: cream is the desk, white is what carries content (paper, screens), black is the ink, the keys, the objects and the end credits (the footer is black: the shot ends, the credits roll).

| Token | Value | Where |
|---|---|---|
| `--table` / `--cream` | `#EDE7DA` | the desk: the ground of every page |
| `--paper` | `#FFFFFF` | every sheet, card, field, the menu, the cookie strip |
| `--ink` | `#1A1917` | text, keys, the objects' bodies, the footer ground; 14.1:1 on cream |
| `--ink-2` | `#4D4942` | secondary text; 7.2:1 on cream, 9.0:1 on paper |
| `--cream-2` | `#B8B0A0` | secondary text on the black footer; 8.1:1 |
| `--line` / `--line-ui` | ink at 14% / 62% | hairlines / field borders (4.8:1 on paper); never a new grey |
| `--logo-a` / `--logo-b` | `#1A1917` / `#225079` (on black: `#F4EFE4` / `#79A0C5`) | the Horizon logo in Cyanotype (D117): ink above the wave, Prussian blue below; on the black bands cream and the same blue at a lighter strength. The page's only colour lives in the logo |

Shadows are ink at an alpha (`--paper-shadow`). No gradients, glow or glass. Errors are never colour-only.

## 3. Typography (D81)

One family, Noto Sans Hebrew (variable, self-hosted in `public/fonts/noto/`), with a metric-matched Arial fallback (`src/look/shot/shot-fonts.css`). Headings 800 at 75% width; text 400; UI 700. Hebrew rules: no letter-spacing, no italics, no en or em dash or maqaf in copy, no hyphen where words can carry the meaning ("2 עד 3 שבועות", "בחיפושי AI").

## 4. Motion (D83, SPEC 1.4-1.7)

Engine: `src/motion/` (GSAP ScrollTrigger, Lenis on desktop). Camera helpers: `src/look/shot/camera.ts` (`dive`, `land`, `docTop`, `landRange`, `exitRange`), moves: `moves.ts` (`setDown`, `openLaptop`, `orbit`, `inkLine`, `pullBackMatched`). Every move is a transform on one layer, scrubbed by scroll, with a CALM version (OS reduced motion: small angles) and nothing under REDUCE (the accessibility stop switch, `?reduce=1`, the prerender), where the last frame is the layout itself.

| Moment | Where | Move |
|---|---|---|
| The dive | hero, 200svh hold (230 from 1100px) | the camera comes down onto the hero sheet; the desk objects (closed laptop with the logo lid, cassette, loupe) leave the frame as it lands; the lens's iris opens over the last 30% |
| Landings | every sheet | a sheet comes in lying on the desk, flat before its first text line reaches the reading band; tips away only after its bottom passed the top 18% |
| The build | process, 300svh hold (350) | the closed laptop turns frontal and opens; this site builds itself on its screen (Rive, scrubbed); an ink line leaves for the steps |
| The pull-back | after contact, 200svh (240) | from the phone's screen, as close as the real letter, back to one phone on the desk with the props |
| Lotties | screens and tools | one at a time, the one in the eye band (36-62%); a poster of its fullest frame until it plays and after (`scripts/lottie-posters.mjs`) |

Holds are sticky stages, never pins. Chapters below the first view build their scenes within 1.5 viewports (`near.ts`). The lens's Rive loads on the first interaction (D88).

## 5. Components

- **Buttons, "the key" (D87):** `src/look/buttons/KeyButton.tsx` on the StateButton engine: a keycap over a skirt, the Hebrew label printed on the cap, an `Enter ↵` legend; seven states (idle, hover, pressed, focus, loading, sent, error). Ink on paper and table, a paper key in the header. No line under any label.
- **Header:** the top edge of the black band on every page (D110): the compact Horizon logo in its dark-ground tones (cream and light Prussian blue #79A0C5), four chapter links from 1100px, the key "ספרו לנו", the accessibility button; on phones and tablets a burger.
- **Menu sheet (D89):** a white sheet: the five chapters as a ruled index, the chapter in view marked with an ink dot, then "בואו נדבר", WhatsApp, phone, email. Escape closes, focus returns to the burger.
- **Dock (SPEC 1.12):** two floating controls at the near edge, no bar across the bands (jury D7): WhatsApp at the inline start (thumb reach), the chat trigger at the inline end. WhatsApp is there on every first visit, above the cookie strip (D101); its message is the page's own (`data-wa`). It steps aside only over the key it would cover, #contact, the end card, the footer and any dialog. `--safe-b` reserves its band.
- **Cookie strip:** a paper strip in the same band, one row on phones; `--strip-h` matches its measured height (76px on phones, 104px under 360px, where it stacks), and the first paint already reserves it (`consent-pending`), so nothing moves when it arrives or leaves. Inner pages show it on the first scroll or after 8 seconds (D102).
- **Lead dialog:** a bottom sheet of paper (70svh, scrolls inside), opened by intent only (`src/utils/lead-intent.js`), never over another dialog.
- **Desk objects:** `src/look/parts/Things.tsx` and `Laptop.tsx` in ink with white faces; the laptop's lid carries the Horizon mark in its dark-ground tones. The props' faces are drawn in ink lines (`src/look/shot/Faces.tsx`, D98).
- **Where a control goes (critique round 2):** a key that opens WhatsApp carries the WhatsApp mark before its label and a WhatsApp glyph in its legend; a key or text link that moves down the page carries a down chevron; a link to another page a forward chevron (left, in RTL). One name per chapter: the menu label is the heading (D107).

## 5b. Inner pages (D90, D91, D92)

Every inner page is the same desk, quieter: `src/look/shot/pages/` (kit.tsx, shot-pages.css), registered by the look (`registry.shot.ts` `pages`); K, M and KM keep the legacy pages.

| Surface | Object | Where |
|---|---|---|
| The path | printed on the table, 44px links | every inner page |
| Hero sheet | the service name, an outcome line, three facts, the WhatsApp key; the service's Thing on its top edge | service pages |
| Prose | printed on the table, start-aligned (D92) | service pages |
| Checklist | a ruled sheet with ink ticks | what you get |
| Quote slip | a narrow slip with perforated ends (mask) and a drop shadow | what it costs |
| Ink line | the home process line, drawing as you scroll | how it goes |
| Notepad | punched holes, numbered ruled rows, details/summary | questions |
| Film print | a paper frame around the video | memory videos, the sample |
| Legal sheet | one plain sheet, 68ch measure, the legal text unchanged | /terms /privacy /accessibility |
| Empty spot | a dashed outline where the page should lie, the loupe searching | 404 |

Motion: sheets land at half strength (`camera.land`), the hero sheet tips away late, the ink line draws; REDUCE and no JS show the last frame.

**The sheet becomes the page (D91):** cross-document View Transitions. The home service label and the service hero sheet share `view-transition-name: svc-<id>`, the desk object and the hero object `svc-obj-<id>`, the sample's film print `film-<slug>` (`src/look/shot/vt.ts`, rules at the end of `shot-base.css`). A plain link morphs one paper into the other; unsupported browsers and reduced motion get an ordinary page load.

## 6. Rules that do not move

- Nothing steps on anything: `scripts/overlap-audit.mjs` reports 0 (zones text / art / ui) at 320, 390, 768, 1024 and 1440.
- AA contrast, a 3px ink focus ring, keyboard paths, focus never hidden under the dock (`scroll-padding-bottom: var(--safe-b)`); accessibility settings never persist.
- Tap targets 44px at rest (the overview pose shrinks them while the camera is far, by design).
- Copy: Hebrew, direct, no invented proof; new lines are marked `[קופי: נתי]` until approved.
- A rule meant for chapters selects chapters (`main > :is(section, .shot-bw)`), never every child of main: main also holds fixed layers.

## 7. How to extend

- A new chapter: a `<section>` straight into `<main>` from `ShotHome.tsx`, lazy, with its fallback height in `shot-base.css`; mark text `data-zone="text"`, art `data-zone="art"`; land its sheet with `land()`; build its scene with `useSceneNear`.
- A new colour is a decision (D81 locks grey, white and ink); the logo palette lives in `scripts/brand-palette.mjs`.
- Verify: `npm run build`, the overlap audit, pattern-breaker `gates.mjs`, `motion-audit.mjs --budget-cls 0.05`, the mobile audit (`design/audit/impeccable/`), Lighthouse mobile.
