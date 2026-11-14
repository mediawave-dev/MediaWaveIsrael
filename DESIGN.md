---
name: MediaWave Israel
description: Hebrew RTL site of a small web studio, the statement site (look sun, D237 to D266). A happy, audience-led page that says what we build (landing pages, image sites, sites for courses and mentoring programmes) and asks the visitor to write to us. Mint field, green-black ink, a turquoise logo, the sites we built turning on a wheel of phones. Mobile first.
colors:
  field: "#C9E8E2"
  field-light: "#D3EDE8"
  field-deep: "#C2E4DD"
  paper: "#FFFFFF"
  cream: "#F5F7F3"
  ink: "#13241F"
  ink-2: "#3F4D48"
  line: "#D6DFDB"
  contact-circle: "#BFE0F5"
  logo-media: "#2F5249 to #13241F"
  logo-wave: "#22BBA8 to #0F8478"
  mark-upper: "#13241F"
  mark-lower: "#14A390"
typography:
  display:
    fontFamily: "MW Head: EFT Artzisraeli for Hebrew, digits and punctuation; Saira Semi Condensed SemiBold for Latin; Arial metric fallback"
    use: "headings, buttons, labels, menus"
  text:
    fontFamily: "MW Text: David Libre 400 and 700 for Hebrew, digits and punctuation; Saira Semi Condensed 400 and 600 for Latin; Arial metric fallback"
    fontSize: "1rem to 1.125rem"
    lineHeight: 1.7
components:
  button:
    minHeight: "56px"
    rounded: "5px"
    ink: "ink ground, white label"
    line: "2px ink border"
---

# Design System: MediaWave Israel (14 November 2026, the statement site, look `sun`)

Code: `src/sun/` (entry.tsx, SunApp.tsx, Shell.tsx, Home.tsx, Wheel.tsx, Tide.tsx, Proof.tsx, pages.tsx, Brand.tsx, Emblem.tsx,
content.ts with every line of copy; sun.css with the tokens at the top; fonts.css, lead.css, proof.css, tide.css).
Decisions D237 to D269 in `DECISIONS.rtl.md`. `npm run build` builds this look.

## The idea
The site stopped showing off and started saying something (Nati, 12.11.2026): what we build, for whom, how it goes, what it
costs, and one easy way to write to us. The proof is the work itself: the sites we built turn on a wheel of phones right
under the promise, each a real recording of the live site. Everything else is calm.

## Tokens
| Token | Value | Use |
|---|---|---|
| field | `#C9E8E2` | the mint ground of the bands (Yael Levy's mint one step deeper, D251) |
| paper | `#FFFFFF` | the white bands, the pinned corner, the footer |
| ink | `#13241F` | type, buttons, the dark cards |
| ink-2 | `#3F4D48` | secondary type (AA on the field) |
| contact circle | `#BFE0F5` | the one break from the green: the circle that holds the form (D262) |
| logo | `#2F5249` to `#13241F` across Media, `#22BBA8` to `#0F8478` across Wave | the drawn wordmark (D266) |
| mark | `#13241F` over `#14A390` | the disc; its two halves walk slowly through six colours (D262) |

Type: headings and everything a hand presses in EFT Artzisraeli (D249, "present everywhere"), one cut declared 100 to 900
so no browser fakes a bold; running text in David Libre (D269, OFL), Regular and Bold, so emphasis inside text stays in the
text face; every Latin letter in Saira Semi Condensed (D269, OFL), narrow and square like Artzisraeli. Sizes are matched by
size-adjust (fonts.css). **Artzisraeli is now the only EFT face, and its web licence is not confirmed yet: it blocks production.**

## The parts
- **The pinned corner** (Shell.tsx, Brand.tsx): a white corner wave holds the logo, the disc and the drawn name. As the
  page scrolls the name fades and the corner folds to the disc alone beside the menu button (after Libra, D249). The disc
  keeps its size.
- **The wheel** (Wheel.tsx, D255 to D261): 16 slots, seven sites and the "next site is yours" card, each twice on opposite
  sides, never two of one site on screen. Every card is a looping 60 fps recording of the real site in a phone frame
  (`scripts/record-work.mjs`, `src/data/work.json`); only phones on screen play. A tap holds it six seconds.
- **The living mark** (Tide.tsx, D263): the disc as a buoy button on the waves between sections, and as water rising in the
  step rings.
- **The contact circle** (Home.tsx, D256, D262): the form in a sky-blue circle with an envelope; WhatsApp is the default
  path, mail through `/api/lead` once the Cloudflare keys exist.
- **The footer mark** (Emblem.tsx, D266): the MW mark, M and W between code brackets, the disc on its horizon line, WEB
  DEVELOPMENT. The first time it comes into view the full name folds into it (about two seconds, once). The logo kit is in
  `logos/mediawave-v2`.
- **Service pages** (pages.tsx, `src/data/services.ts`): the customer's questions as headings, one price slip, steps.

## Motion
Full motion on every regular visit, even when the OS asks for reduced motion (D160). It stops with the accessibility
panel's "ללא אנימציות", with `?calm=1` and in the prerender. The wheel's drift, its videos, the mark's colour walk, the
buoys and the footer fold all obey that. One staged moment at the top (the wheel rises, D241) and one at the bottom (the
footer fold); nothing else plays on its own.

## Rules that do not move
Overlap audit 0; axe 0 on every page; AA contrast; 44 px targets; logical CSS properties; no static underlines, contained
hovers only under a hovering pointer; accessibility choices never persist; Hebrew without italics or letter-spacing; no
colons, no lists of three and no long dashes in the copy; no invented proof, no client names or links to client sites,
never the owners' faces; content visible without JavaScript and the H1 is the LCP.

---

# History: "the wave" (19 October 2026), production until the statement site


Production since D124. Code: `src/look/wave/` (WaveHome, WaveLine, WaveLaptop, WaveTape, WaveServices, clock.ts, wave.css); the look id stays `shot` (registry.shot.ts renders WaveHome as the home page; inner pages keep their shot components in the wave's material). Decisions D118-D128. The sketches Nati picked from: `design/eye/` (bike-translations.html, details-lab.html).

## The idea
A gallery on cream. One thin Prussian line, the wave of the Horizon logo, runs from the laptop at the top of the home page to the "back to the start" key at the end, drawn by the scroll: its pen is always at the reader's eye (60% of the screen), so the line is as long as what has been read. On the way it draws the laptop that opens as you scroll (the hero film plays on its screen), a cassette whose reels turn with you (the smaller pack turns faster), and the process timeline. Nothing else moves on its own.

## Tokens
| Token | Value | Use |
|---|---|---|
| ground | `#F2EEE6` | every page, the header included |
| ink | `#1A1917` | type, keys, the screen |
| ink-2 | `#4D4942` | secondary type (7.9:1 on the ground) |
| wave | `#225079` | the one colour, one meaning: the line, its pen, its drawings, chapter numbers |
| rule | ink at 16% | hairlines between rows |
| credits | ink ground, cream type | the footer only |

Type: headings in mediawave-font1 Regular, landing in Bold on the payoff line (D218, D231; H1 12.4vw on phones, 60-96px from 1100px; H2 10.5vw to 96px); text in Noto Sans Hebrew 400, 17px, 1.7; chapter numbers in a mono face, Latin digits.

## Motion (D125)
One clock (`clock.ts`): native scroll, eased once for the page, each part eased again toward its own target, fixed ratios. One requestAnimationFrame loop, only while something moves. Still mode (OS reduced motion, the widget's stop switch, `?reduce=1`, the prerender, no JS): every part at its last frame. The pre-paint class `html.shot-dive` (index.html) shows the shut laptop until the first geared frame.

## Details (D120-D122)
- Pointer trail T3: thin tracking lines (red and teal offsets), length = speed, 450ms; ink on the cream, cream on the black footer (`src/look/shot/TrackingTrail.tsx`, mounted by Layout).
- Keys H2: a second face spreads from the point the pointer came in, carrying where the key goes ("פותח וואטסאפ"); keyboard focus spreads it from the centre (`KeyButton.tsx`, `key-button.css`).
- Surprises: a mini site builds (בניית אתרים), a memory develops like a cyanotype (סרטוני זיכרונות), a cassette spins (עריכת וידאו); fine pointer on hover or focus, phones once as the row crosses the middle. Back to the start rewinds the page like a tape (REW overlay, the line draws itself back).
- Restraint: at most one trail, three surprises, one key style and one scroll mechanic per page; every still frame must look calm.

## Rules that do not move
Overlap audit 0 at 320, 390, 768, 1024, 1440; axe 0 on every page; AA contrast; 44px targets; Hebrew typography rules (no letter-spacing on Hebrew, no italics, no long dashes); no invented facts; content visible without JS; the H1 is the LCP.

---

# History: "one shot" (16-19 October 2026)

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

Two families (`src/look/shot/shot-fonts.css`), each with a metric-matched Arial fallback. Headings: mediawave-font1, the studio's own face (D218, source in `fonts/mediawave-font1`): Regular, with Bold on the second line of a two-line heading and on scanned names (D231); Thin only on the closing line. Text 400 and UI 700: Noto Sans Hebrew (variable, self-hosted in `public/fonts/noto/`). Hebrew rules: no letter-spacing, no italics, no en or em dash or maqaf in copy, no hyphen where words can carry the meaning ("2 עד 3 שבועות", "בחיפושי AI").

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
