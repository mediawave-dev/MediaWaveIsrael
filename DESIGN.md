---
name: MediaWave Israel
description: Hebrew RTL site for a one-developer web studio - "launch night": a Klein-blue night stage and a paper void that alternate as you scroll, the hero laptop playing the real video, two held scenes, the Horizon logo, a Rive companion on the contact form
colors:
  klein: "#002FA7"
  klein-night: "#00113D"
  paper: "#FAFAF7"
  paper-2: "#ECECE6"
  stage-ink: "#FFFFFF"
  stage-ink-2: "#A3AFD6"
  stage-line: "#1D2A5A"
  void-ink: "#0E1016"
  void-ink-2: "#4E5468"
  void-line: "#DCDCD4"
  logo-b-on-dark: "#6E8CFF"
  logo-tag-on-dark: "#8E9CC8"
  lens-on-dark: "#D5DEFF"
  lens-on-light: "#2457E6"
  err-on-dark: "#FF6961"
  err-on-light: "#B3261E"
  face: "#FFFFFF"
typography:
  display:
    fontFamily: "MW Display = EFT Betaamango (Hebrew) + Outfit 500 (Latin, digits), Arial metric fallback"
    fontWeight: 400
    lineHeight: 1.02-1.15
  body:
    fontFamily: "MW Text = IBM Plex Sans Hebrew 400 (Hebrew + Plex Latin), Arial metric fallback"
    fontSize: "1rem-1.3rem"
    fontWeight: 400
    lineHeight: 1.6
  ui:
    fontFamily: "MW Text"
    fontWeight: 600
components:
  button-on-stage:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.klein}"
    rounded: "12px"
  button-in-void:
    backgroundColor: "{colors.klein}"
    textColor: "#FFFFFF"
    rounded: "12px"
---

# Design System: MediaWave Israel (October 2026, "launch night")

Source of truth for tokens: `src/look/looks.css`. Decisions: `DECISIONS.rtl.md` #47-#59. Concept and scroll score: `design/CONCEPT.md`, `design/SCROLL-SCORE.md`.

## 1. Overview

The site is a product launch for the visitor's business. A deep Klein-blue night stage (the keynote) alternates with a paper void where the tools of the trade float (the workshop). One codebase builds three looks (`npm run build:k | build:m | build:km`); production is **KM** (`npm run build`), the other two stay for comparison.

Sacred: the hero video (laptops and coffee), the 13 Lotties, the URLs, one H1 "העסק שלכם / המומחיות שלנו", the H2 order, every conversion path and `track()` call. No invented proof: testimonials stay hidden while the list is empty.

## 2. Colour: "Klein" (DECISIONS #58)

| Token | Value | Where |
|---|---|---|
| `--stage` | `#00113D` | Klein night: the hero, why us, the launch hold, contact, footer |
| `--void` | `#FAFAF7` | paper: the flight hold, FAQ, inner pages |
| `--klein` | `#002FA7` | the one colour: logo lower half on light, buttons in the void, floating objects' bodies, links on inner pages |
| ink / ink-2 | `#FFFFFF` / `#A3AFD6` on the stage, `#0E1016` / `#4E5468` in the void | text |
| `--lens` | `#D5DEFF` stage, `#2457E6` void | the lens button's disc (a lighter tone under the label) |

Every text and control pair is AA or better: `design/audit/klein-contrast.md` (0 failures). The logo's palette and files: `scripts/brand-palette.mjs` rewrites every SVG in `logos/horizon` and re-renders the PNG icons from vector; `logos/horizon/README.md` has the brand rules.

Named rules: one colour, used for action and for the brand only. No gradients, glow or glass (no `backdrop-filter` anywhere). Shadows only under floating objects, tinted Klein (`--obj-shadow`).

## 3. Typography (DECISIONS #59)

- **Display:** EFT Betaamango (the live site's face, licensed) for every heading, with Outfit 500 for Latin and digits, and Plex 600 for the geresh and gershayim (Betaamango's free edition has neither). One weight, so the family declares 100-900: no synthetic bold.
- **Text and UI:** IBM Plex Sans Hebrew 400 / 600, with Plex's own Latin.
- All self-hosted in `public/fonts`; the display face is preloaded (the H1 is the LCP). Metric-matched fallbacks (`design/fonts/mw-*-fallback.css`): no rewrap at 340 and 680 px.
- Hebrew rules: no letter-spacing, no italics, no em/en dash or maqaf, motion enters from the right, splits by words or lines.

## 4. Motion

Engine: `src/motion/` (GSAP ScrollTrigger + Lenis on desktop only). Policy: REDUCE (the accessibility widget's stop switch, prerender) shows every scene's last frame; CALM (the OS reduced-motion flag) keeps scroll-driven scenes and drops autonomous loops; `?motion=full` overrides for QA.

| Moment | Where | Move |
|---|---|---|
| Hero | stage | the laptop plays the hero video; a scrubbed lean as you scroll |
| Theme flips | KM | fixed layers crossfade stage and void; text follows the body class |
| Flight | services, void | sticky stage: you fly into six floating tools, one service each |
| Launch | process, stage | sticky stage: the laptop opens and turns, one step per announcement |
| Giant word | before contact | ink fill |
| Rive companion | contact form | the hero's laptop writes the message, folds it into the horizon while sending, fills into the mark when sent (`design/rive/companion/CONTRACT.md`) |
| Logo ident | header once per visit, footer scrubbed | drop, disc, slosh, name rise, droplet onto the i (`src/components/ui/logo-motion.ts`) |

Holds are sticky stages, never GSAP pins. Only transform and opacity per frame. Only the Lottie on stage plays (`LottieIcon active/load`), and Lotties render at their own frame rate. The hero video pauses out of view and does not play under the OS flag.

## 5. Components

- **Buttons:** KM and M use the lens (`src/look/buttons/LensButton.tsx`): solid button, a lighter disc follows the pointer and fills on press; seven states (idle, hover, pressed, focus, loading, sent, error) at `/states?look=` in dev. K uses the product button (tilt and press). No line under any label.
- **Header:** compact Horizon logo 26 px (24 on phones), nav, the look's button; on phones the button lives in the menu sheet.
- **Footer:** columns, then the Horizon sign-off scrubbed by scroll.
- **Floating objects** (`src/look/parts/Things.tsx`): laptop, phone, loupe, chat bubble, cassette, frame; Klein bodies with white faces where the Lotties live.
- **Contact:** labelled fields, errors on the field, the Rive companion; LeadModal on the look's tokens (it never opens while the visitor is typing or navigating by keyboard).

## 6. Rules that do not move

- Nothing steps on anything: `scripts/overlap-audit.mjs` must report 0 (zones text / art / ui, five widths).
- AA contrast, visible focus, keyboard paths; a11y settings never persist.
- Copy: Hebrew, direct, no invented proof; new lines are marked `[קופי: נתי]` until approved.

## 7. How to extend

- New colour: change `--klein` and the stage/void tokens in `looks.css`, then `PALETTE` in `scripts/brand-palette.mjs` and `COL` in `design/rive/companion/build-scene.mjs`; run `node scripts/brand-palette.mjs`, `npm run generate:favicons`, `npm run generate:og`, `npm run rive:companion`; re-run the contrast script and the overlap audit.
- New section: give it `data-theme="dark|light"` (KM), mark text `data-zone="text"` and art `data-zone="art"`, and let the engine's `reveal()` handle routine entrances.
- Verify: `npm run build`, the overlap audit, pattern-breaker `gates.mjs`, `motion-audit.mjs --budget-cls 0.05`, Lighthouse mobile.
