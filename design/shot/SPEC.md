# Shot home: build spec (v1, 2026-10-15)

The home page of mediawave.co.il as one continuous camera move over Nati's desk (DECISIONS D83), designed at 390x844 first (D84), palette and face locked (D81). This file is the implementer's contract. The story, the beats and every number's reasoning live in `design/shot/storyboard.rtl.md` (Hebrew); the full inventory of reused parts (files, APIs, costs) is `design/shot/inventory.json`. Read the storyboard's "seven reading rules" before touching any section: they are acceptance criteria, not style notes.

Conventions in this file:
- "390" means a 390x844 viewport, `--head` 56px, root font-size 18px. "900" means 1440x900, "700" means 1440x700.
- vp positions are scroll positions (scrollY / viewport height) at 390 unless stated.
- `t` is the motion engine passed to `useScene((t, root) => ...)` (`src/motion/ScrollEngineProvider.tsx`).
- Copy in Hebrew is quoted verbatim with its source file. Any string marked `[קופי: נתי]` is new and lives only in `src/look/shot/copy.ts`.
- Only the plain hyphen as a dash, in code comments and copy alike.

---

## 0. Non-negotiables (every section, every PR)

1. One ground `#ECEEF1`, paper `#FFFFFF`, ink `#1B1D21`, ink-2 `#4A4F57`. No other colour except the Horizon logo tones (`--logo-a/b/tag`) and the Lotties' own colours. Hairlines, field borders and shadows are ink at an alpha. No `[data-theme]` selector anywhere in shot CSS. ThemeLayers stays `null`.
2. One face: Noto Sans Hebrew ("MW Noto", already declared in `src/look/shot/shot-fonts.css`). Headings 800 at `font-stretch: 75%`; text 400/600. No italic. Text line-height 1.6 or more (body 1.7, answers 1.75). All sizes in rem (the a11y text scale multiplies the root). No rendered text under 16px (0.9rem) anywhere, including footer, cookie strip, chat, kickers.
3. The H1 is the LCP and paints at first paint. Never split it, fade it, mask it or `text-wrap: balance` it. Never rotate it on Z.
4. Sticky stages only (`.hold` / `.hold__stage`, `top: var(--head)`); never `pin`. Camera transforms only on sheet-sized layers, never on `main`, `#root` or a page wrapper.
5. Text read flat: inside the reading band (below the header, above `--safe-b`) every text line is at `rotateZ(0)` and at most `rotateX(3deg)`. Paper carrying text rests at `rotateZ(0)`. The only exception is the hero's first-frame overview pose (rotateX 16deg about the H1's own line).
6. One video (HeroMedia, LENS_FILM), one Rive renderer at a time, one playing Lottie (the one in the eye band). Lotties never mount in the overview or in the pull-back miniature.
7. Overlap audit 0 at 320/390/768/1024/1440 with zones present; floating chrome never covers text.
8. Contained hovers, fine pointer only; no static underline on UI links; no line under or inside a button label.
9. Honest proof only. No invented numbers or clients. The speed receipt renders only after re-measuring the shot build (see S2).
10. Every `track()` call that exists today survives. Every anchor (`#top`, `#why-us`, `#services`, `#process`, `#faq`, `#contact`) exists. `data-intent` hooks as listed per section.
11. REDUCE (widget stop switch, `?reduce=1`, prerender, no JS) renders every beat's last frame as a flat readable flow; CALM (OS reduced motion) keeps scroll-driven moves with small angles and `scrub: true`, no video, no Lenis.
12. Accessibility settings never persist. Framer only via `m` (LazyMotion strict).

---

## 1. Shared foundation

### 1.1 File map

New files (all under `src/look/shot/` unless a path is given):

| File | Role | Loaded |
|---|---|---|
| `ShotHome.tsx` | composes the page (1.2) | eager (registry.shot.ts already imports it) |
| `shot-base.css` | table, sheet, line and type primitives; shot chrome overrides (header, footer, dock, strip, panels, lead sheet, laptop and Things skins) | eager, imported by ShotHome |
| `ShotHero.tsx` + `shot-hero.css` | S1 | eager (CSS must land in the render-blocking entry stylesheet) |
| `ShotMeet.tsx` + `shot-meet.css` | S2 `#why-us` | lazy |
| `ShotChoose.tsx` + `shot-choose.css` | S3 `#services` | lazy |
| `ShotBuild.tsx` + `shot-build.css` | S4 build hold, renders `section#process` and mounts S5 inside it | lazy |
| `ShotProcess.tsx` + `shot-process.css` | S5 process heading and steps | imported by ShotBuild |
| `ShotStart.tsx` + `shot-start.css` | S6 FAQ, S7 BigWord, S8 Contact, plus their motion | lazy |
| `ShotDeliver.tsx` + `shot-deliver.css` + `Mini.tsx` | S9 pull-back and its miniature | lazy |
| `ShotDock.tsx` + `shot-dock.css` | bottom dock (1.12) | mounted by Layout when `LOOK === 'shot'` |
| `moves.ts` | new motion helpers (1.7) | with the chapters |
| `eye-line.ts` | `useEyeLine` Lottie gating hook (1.8) | with the chapters |
| `rive-slot.ts` | one Rive renderer at a time (1.9) | with Lens, HeroBuild, Companion |
| `policy.ts` | `useShotPolicy` (short viewport, text scale) | eager |
| `copy.ts` | every new `[קופי: נתי]` string, `SPEED_PROOF`, `SERVICE_ORDER` | with the chapters |
| `src/components/ui/chat-event.ts` | `openChat(placement)` event + pending flag | eager (tiny) |

Changed files (each change is additive and default-off, so build:k, build:m and build:km render exactly as today):

| File | Change |
|---|---|
| `src/look/shot/camera.ts` | `divePose`, `dive` (origin from CSS, `onProgress`, removes the pre-paint class), `land` options (1.7) |
| `src/look/parts/Lens.tsx` | optional props `range`, `startAfterIdle`, `filmSizes`, `src`; claims the Rive slot (S1) |
| `src/look/parts/HeroBuild.tsx` | optional `mode: 'scrub'`, `src`, `poster`; `forwardRef` handle `setProgress(p)` (S4) |
| `src/look/parts/Companion.tsx` | optional `src` (riv + rest SVG); claims the Rive slot (S8) |
| `src/look/sections/WhyUs.tsx` | `export const WHY_ITEMS` (the existing ITEMS array, renamed export only) |
| `src/look/sections/Faq.tsx` | optional props `chapter`, `dossier`, `decor` (S6) |
| `src/look/sections/BigWord.tsx` | optional props `end`, `endTrigger` (S7) |
| `src/look/sections/Contact.tsx` | optional `chapter`, `dossier`; `data-zone` on ways, time, status; a `.ct__card` wrapper around face + ways only when `LOOK === 'shot'` (S8) |
| `src/components/layout/Footer.tsx` | when `LOOK === 'shot'`, the sign-off block renders first in DOM order (S10) |
| `src/components/layout/Layout.tsx` | when `LOOK === 'shot'`: mount `ShotDock` in the aside instead of the floating WhatsApp FAB; mount the idle widgets early if a chat open is requested (1.12) |
| `src/components/ui/ChatWidget.tsx` | optional `triggerSlot` (portal target for the trigger); listens to `mw:chat-open`; tracks `placement` (1.12) |
| `src/components/ui/CookieConsent.tsx` | on choice, remove `html.consent-pending` (1 line) |
| `src/hooks/useAccessibility.ts` | toggle `html.text-scaled` when the text scale is above 1 (1 line, never persisted) |
| `src/look/looks.css` | shot token corrections (1.3) |
| `index.html` | shot pre-paint gates (1.5) |
| `design/rive/lens/build-lens.mjs`, `design/rive/hero/build-hero.mjs`, `design/rive/companion/build-scene.mjs` | a `--palette shot` output next to the existing files (section 3) |
| `scripts/overlap-audit.mjs` | add `shot` to the default `--looks` list |

Do not import any K/M/KM scene file (`src/look/scenes/*.tsx` other than `idle-warm.ts`, `src/look/sections/ServicesFlight|ServicesLaunch|ProcessLaunch|ProcessLine|ThemeLayers.tsx`) from `src/look/shot/*`. Parts (`src/look/parts/*`) and shared sections listed above are fine.

Already in place (verify, do not redo): `vite.config.ts` look `shot` with `LOOK_GROUND.shot = '#ECEEF1'` and `LOOK_LOGO.shot = ['#0E1016','#002FA7']`; `src/look/look.ts` accepts `shot`; `registry.shot.ts` with `Home: ShotHome`, `ThemeLayers: null`; `App.tsx` renders `look.Home`; `scripts/prerender.mjs` per-look `DISPLAY_FONTS` with the Noto Hebrew subset for shot; `button.shot.ts` exports IrisButton as LookButton; `.env.look-shot`; `npm run build:shot`.

### 1.2 ShotHome.tsx

```tsx
import { lazy, Suspense } from 'react'
import ShotHero from './ShotHero'          // eager: the H1 (LCP) and its CSS
import './shot-base.css'
const ShotMeet = lazy(() => import('./ShotMeet'))
const ShotChoose = lazy(() => import('./ShotChoose'))
const ShotBuild = lazy(() => import('./ShotBuild'))     // section#process (hold + steps)
const ShotStart = lazy(() => import('./ShotStart'))     // #faq, BigWord, #contact
const ShotDeliver = lazy(() => import('./ShotDeliver')) // pull-back

export default function ShotHome() {
  return (
    <>
      <ShotHero />
      <Suspense fallback={<i className="shot-fb shot-fb--meet" aria-hidden="true" />}><ShotMeet /></Suspense>
      <Suspense fallback={<i className="shot-fb shot-fb--choose" aria-hidden="true" />}><ShotChoose /></Suspense>
      <Suspense fallback={<i className="shot-fb shot-fb--build" aria-hidden="true" />}><ShotBuild /></Suspense>
      <Suspense fallback={<i className="shot-fb shot-fb--start" aria-hidden="true" />}><ShotStart /></Suspense>
      <Suspense fallback={<i className="shot-fb shot-fb--deliver" aria-hidden="true" />}><ShotDeliver /></Suspense>
    </>
  )
}
```

- Every section returned by these components is a direct child of `<main id="main-content">` (Layout) and carries `data-chapter` and `data-dossier` (values per section below). The footer stays in Layout.
- Fallback min-heights (block display, from the storyboard's px model; keep them within 10% of the measured section height after the first build, at 390 and 1440): meet 1454px / 1375px, choose 3185 / 2260, build `calc(300svh + 2032px)` / `calc(350svh + 1840px)` (hold + heading + steps), start 3018 / 2707, deliver `200svh` / `240svh`. Use a `@media (min-width: 1100px)` switch.
- No `document.title` effects: SEO comes from App's `HOME_SEO`.
- `html[data-look="shot"] body { overflow-x: clip }` (clip, not hidden, so sticky keeps working). A probe element `<i class="shot-probe" aria-hidden="true">` (fixed, width 0, `height: var(--safe-b)`) is rendered once by ShotHome so JS can read the resolved `--safe-b` in px (`probe.offsetHeight`) on refresh.

### 1.3 Tokens (`src/look/looks.css`, the existing `html[data-look="shot"]` block)

Change or add exactly these (everything else in the block stays):

```css
html[data-look="shot"] {
  --line: rgba(27, 29, 33, .14);        /* was #d3d7dc: hairlines are ink at an alpha (D81) */
  --line-ui: rgba(27, 29, 33, .62);     /* field borders: 4.8:1 on paper, 4.0:1 on the table (WCAG 1.4.11) */
  --err: var(--ink);                    /* [לבירור: נתי] red #b3261e only if Nati rules for it; the error is never colour-only */
  --obj: #1b1d21; --obj-2: #4a4f57; --obj-shadow: rgba(27, 29, 33, .35); --face: #ffffff; --void-2: #eceef1; /* Things */
  --gut: 12px;
  --dock-h: 64px;
  --strip-h: 104px;                     /* cookie strip at < 640px; 88px from 640px */
  --safe-b: calc(var(--dock-h) + env(safe-area-inset-bottom, 0px) + var(--browser-chrome-bottom, 0px));
  --eye-top: .36; --eye-bottom: .62;    /* the Lottie eye band, read by eye-line.ts */
}
@media (min-width: 640px) { html[data-look="shot"] { --strip-h: 88px; } }
@media (min-width: 768px) { html[data-look="shot"] { --gut: 32px; } }
html[data-look="shot"].consent-pending,
html[data-look="shot"] body.mw-consent-open { --safe-b: calc(var(--strip-h) + env(safe-area-inset-bottom, 0px) + var(--browser-chrome-bottom, 0px)); }
```

Notes: the shot `--safe-b` rules must come after the generic `html[data-look]` `--safe-b` rules (looks.css around line 220) so they win. `body.mw-consent-open` sets the variable on body; components reading `--safe-b` live inside body, so that is enough. `--safe-b` does not change when the dock hides (no layout shift).

Type scale (put in `shot-base.css`, rem against the 18px root):

| Role | 390 | from 1100px | weight / stretch / lh |
|---|---|---|---|
| H1 | `clamp(2.2rem, 13.8vw, 3.4rem)`; at `max-width: 359px` 12.8vw; at `max-height: 700px` max 2.67rem | `clamp(3.6rem, 6.4vw, 6.2rem)` | 800 / 75% / 1.02 |
| chapter h2 (printed on the table) | `clamp(2.2rem, 10vw, 3rem)` | 3.4rem | 800 / 75% / 1.05, `text-wrap: balance` allowed |
| big lines (process) | `clamp(2rem, 9vw, 2.6rem)` | 3.2rem | 800 / 75% / 1.1 |
| h3 on labels and meet | 1.35rem | 1.5rem | 800 / 75% / 1.15 |
| h3 on steps | 1.45rem | 1.6rem | 800 / 75% / 1.15 |
| body | 1rem (18px) | 1.05rem | 400 / 100% / 1.7 |
| small (receipt, kicker, card label, strip, footer base) | 0.9rem minimum | 0.9rem | 400-600 / 100% / 1.6 |
| button label | 1.1rem | 1.1rem | 700 (IrisButton `--ui-w`) |

ink-2 (`#4A4F57`) only at 16px or more (7.1:1 on the table, 8.2:1 on paper). Digits are already tabular in the Noto subset (no `tnum` needed). Numbers, phone, email and the URL sit in `dir="ltr"` islands.

### 1.4 Layout primitives (`shot-base.css`)

- `.shot-table-head`: chapter headings printed on the table. Centred (#61), `padding-inline: var(--gut)`, `margin-block: 0 24px` (390) / `0 40px` (1100+). Never transformed.
- `.shot-sheet`: `background: var(--paper); box-shadow: var(--paper-shadow); border-radius: 2px; width: min(100% - 2 * var(--gut), 1160px); margin-inline: auto;` At 390 that is 366px.
- `.shot-label`: a small paper card (same skin), `padding: 20px`, max-width 366px (390) / 420px (1100+).
- `.shot-line` (+ `.shot-line__fill`): the ink line, `width: 2px; background: var(--ink); transform-origin: 50% 0;` positioned `inset-inline-start: 14px` inside a 28px start gutter at 390. `will-change: transform` only while `.is-scrubbing`.
- `.is-scrubbing { will-change: transform }`: helpers toggle it from their ScrollTrigger `onToggle`, so at most 2-3 layers carry `will-change` at any scroll position on a phone.
- Breakpoints: 768px (tablet: `--gut` 32px, sheets max 720px), 1100px (desktop arrangements). Height queries: `max-height: 615px` (short-viewport fallback, 1.6) and `max-height: 700px` (compact hero).
- Hold heights (only under `html.motion-ready`): dive 200svh / 230svh (1100+), build 300svh / 350svh, pullback 200svh / 240svh. These numbers are what the storyboard's held-share maths uses; change them only together with the storyboard table.

### 1.5 Pre-paint gates (`index.html`, the inline script at lines 42-57)

Rewrite the script so the order is exactly:

```js
(function () { try {
  if (window.__PRERENDER__) return;                       // the snapshot never carries runtime classes
  var d = document.documentElement, shot = d.getAttribute('data-look') === 'shot';
  var full = /[?&]motion=full(&|$)/.test(location.search);
  var calm = !full && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (shot) { try { if (!localStorage.getItem('mw_cookie_consent')) d.classList.add('consent-pending'); } catch (e) {} }
  if (/[?&]reduce=1(&|$)/.test(location.search)) return;  // ?reduce=1 stays flat
  if (shot && location.pathname === '/') {
    d.classList.add('shot-dive'); if (calm) d.classList.add('shot-dive-calm');
    setTimeout(function () { d.classList.remove('shot-dive', 'shot-dive-calm'); }, 10000);
  }
  if (calm) return;                                       // CALM: no iris intro, no logo intro (unchanged rule)
  if (location.pathname === '/' && !sessionStorage.getItem('mw-hero-iris')) {
    d.classList.add('hero-iris');
    setTimeout(function () { d.classList.remove('hero-iris'); }, 10000);
  }
  if (sessionStorage.getItem('mw-logo-ident')) return;
  d.classList.add('logo-intro');
  setTimeout(function () { d.classList.remove('logo-intro'); }, 4000);
} catch (e) {} })();
```

- `shot-dive` / `shot-dive-calm` paint the overview pose from the same values GSAP starts from (S1). ShotHero removes both classes right after GSAP's first render. The 10 s timeout is the safety net if the app never boots.
- `consent-pending` makes `--safe-b` reserve the cookie strip from frame 0, so nothing moves when the strip appears. CookieConsent removes it on a choice.
- `hero-iris` keeps its #64 meaning (first visit: paint the closed iris). For shot it no longer means "start Rive on the first frame" (S1).

### 1.6 Engine conventions

- One `useScene` per chapter component, `root` = its section. Write the REDUCE branch first (static states only, then `return`), then CALM values, then full values.
- Hold ids for `?at=`: `dive`, `build`, `pullback` (`engine.holdTimeline(wrapper, { id, scrub: t.CALM ? true : 0.6 })`).
- State is derived from scroll position on every update (active Lottie, lit screens, reached steps, HeroBuild progress), never accumulated or "spent".
- `useShotPolicy()` (`policy.ts`) returns `{ short, textScaled }` as React state: `short = matchMedia('(max-height: 615px)').matches` (stage under 560px), `textScaled = html.classList.contains('text-scaled')` (watch with a MutationObserver on `<html>` class). Put both in the `useScene` deps of S1 and S9 so the scenes rebuild. CSS mirrors them:
  - `@media (max-height: 615px) { html.motion-ready .shot-hero .hold, html.motion-ready .shot-deliver .hold { height: auto } .shot-hero .hold__stage, .shot-deliver .hold__stage { position: static; height: auto } }`
  - `html.text-scaled .shot-hero .hold { height: auto } html.text-scaled .shot-hero .hold__stage { position: static; height: auto }` (the build and pull-back stages carry no text and keep their holds).
- After the FAQ changes height, the provider's body ResizeObserver refreshes every trigger. No trigger may cache a pixel position outside `invalidateOnRefresh` / function-based values.
- No `reveal()` on sheets or objects (a fade reads as a cut).

### 1.7 Motion helpers

`camera.ts` (existing file; keep `DEPTH = 1100`, keep `pullBack` for compatibility, change the rest):

```ts
export const DIVE_POSES = {
  phone:  { rotateX: 16, scale: 0.88 },   // < 768px
  tablet: { rotateX: 18, scale: 0.76 },   // 768-1099px
  desk:   { rotateX: 20, scale: 0.64 },   // >= 1100px
  calm:   { rotateX: 8,  scale: 0.94 },   // OS reduced motion, any width
} as const   // rotateZ is always 0: the H1 is never rotated on Z (the desk props carry the angles)
export function divePose(t: MotionEngine): { rotateX: number; scale: number }
export function dive(t, o: { hold: Element; layer: HTMLElement; id: string; onProgress?: (p: number) => void }): gsap.core.Timeline
export function land(t, sheet: HTMLElement, o?: { strength?: number; art?: number; enter?: boolean; exit?: boolean }): void
```

- `dive`: `const origin = getComputedStyle(o.layer).transformOrigin` (the CSS origin the pre-paint pose used, so pre-paint and GSAP are identical); timeline from `holdTimeline(o.hold, { id, scrub: t.CALM ? true : 0.6, onUpdate: self => o.onProgress?.(self.progress) })`; `tl.fromTo(o.layer, { ...divePose(t), rotateZ: 0, transformPerspective: DEPTH, transformOrigin: origin }, { rotateX: 0, scale: 1, ease: 'power1.inOut', immediateRender: true })`; then `document.documentElement.classList.remove('shot-dive', 'shot-dive-calm')`. Returns the timeline.
- `land`: if `t.REDUCE || strength === 0` return. `tilt = (t.CALM ? 6 : 22) * strength`. Landing (skipped when `enter: false`): `fromTo(sheet, { rotateX: tilt, scale: 1 - .1 * strength, y: 28 * strength, transformPerspective: DEPTH, transformOrigin: '50% 0%' }, { rotateX: 0, scale: 1, y: 0, ease: 'none', scrollTrigger: { trigger: sheet, start: 'top bottom', end: () => 'top ' + Math.max(innerHeight * 0.3, innerHeight - safeB() - art - 8) + 'px', scrub: true, invalidateOnRefresh: true, onToggle: s => sheet.classList.toggle('is-scrubbing', s.isActive) } })`. The landing therefore finishes before the sheet's first text line enters the reading band. `art` (px) is the height of the sheet's art band above its first text line; callers that land must pass it (measure on refresh: `firstText.offsetTop`); a text-first element never lands (call with `enter: false` or not at all). Exit (default on, `exit: false` turns it off): `fromTo(sheet, { rotateX: 0, scale: 1 }, { rotateX: -tilt * 0.6, scale: 1 - .06 * strength, transformOrigin: '50% 100%', immediateRender: false, ease: 'none', scrollTrigger: { trigger: sheet, start: 'bottom 18%', end: 'bottom top', scrub: true } })`.
- `safeB()` reads the `.shot-probe` height (1.2), cached per refresh.

`moves.ts` (new):

| Helper | Signature | Behaviour (full / CALM / REDUCE) |
|---|---|---|
| `setDown` | `(t, el, { tilt = 22, fromZ = -4, toZ = 0, y = 20, art = 0 })` | Object or card put down on the table: `rotateX tilt→0`, `rotateZ fromZ→toZ`, `y→0`, origin `50% 100%`, scrub true, start `top bottom`, end like `land` (uses `art`). For text-bearing paper `toZ` must be 0. CALM: tilt 6, `fromZ/3`, `y/3`. REDUCE: nothing (rest pose in CSS). |
| `standUp` | `(t, el, { from = 72 })` | A thing lying flat stands up to face the camera: `rotateX from→0`, origin `50% 100%`, perspective DEPTH, start `top bottom`, end `top 55%`, scrub true. CALM from 30. |
| `slideIn` | `(t, el, { dx = 40, fromZ = 14, toZ = 6 })` | Slides in from the inline-start side: `x: (t.RTL ? dx : -dx) → 0`, `rotateZ fromZ→toZ`, start `top 85%`, end `top 45%`, scrub true. CALM dx 16, no rotate. |
| `reels` | `(t, reels: Element[], trigger)` | Each reel `rotate 0→-540deg`, start `top bottom`, end `bottom top`, scrub true (the visitor drives it, so CALM keeps it). REDUCE: still. |
| `develop` | `(t, wash, trigger)` | A table-coloured wash over a picture: `opacity 1→0`, start `top 80%`, end `top 45%`, scrub true. REDUCE: wash `display: none` in CSS. |
| `openLaptop` | `(tl, lap, lid, { from = 55, at = 0, span = 0.3 })` | Adds to a hold timeline: `.lap rotateX from→0` (`power2.out`) and `.lap__lid rotateX -86→-6` (`power3.out`, the LaunchHold OPEN maths), both over `[at, at + span]`. CALM: from 20. |
| `orbit` | `(tl, cam, amp)` | Adds `rotateY 0→amp` (`sine.inOut`, 0-0.5) then `amp→0` (0.5-1) to a hold timeline, so the release pose is frontal. amp 4 (<1100), 8 (1100+), skipped under CALM. |
| `inkLine` | `(t, { track, fill, nodes, start = 'top 70%', end = 'bottom 70%', onReach })` | `fill scaleY 0→1`, scrub 0.5 (CALM true). Node fractions measured on refresh (`(node.offsetTop + node.offsetHeight / 2) / track.offsetHeight`). On update: `reached = count(frac <= progress) - 1`; call `onReach(reached)` only when it changes (back and forth). REDUCE: fill full in CSS, `onReach(nodes.length - 1)` once. |
| `pullBackMatched` | `(t, { hold, layer, real, mini, id })` | S9. On refresh (layer untransformed): `S0 = real.offsetWidth / mini.offsetWidth`; origin = stage centre in layer coordinates `(ox, oy)`; `miniBottom` = the mini letter's bottom in layer coordinates; `ty0 = -(oy + (miniBottom - oy) * S0)` so the mini letter's bottom sits on the stage's top edge at progress 0 (exactly where the real letter left). `tl.fromTo(layer, { scale: S0, y: ty0, transformPerspective: DEPTH, transformOrigin: ox + 'px ' + oy + 'px' }, { scale: 1, y: 0, ease: 'power1.inOut' })` with function-based values and `invalidateOnRefresh`; plus `rotateX 0→10` (0-0.5) and `10→0` (0.5-1), `sine.inOut`. CALM: scale and y only. No opacity anywhere (no fade). |

All helpers write only transform or opacity (and `clip-path` in BigWord, `scaleY` on lines), read layout only on refresh, and toggle `.is-scrubbing`.

### 1.8 Lottie gating (`eye-line.ts`)

```ts
export function useEyeLine(): { active: number; setup: (t: MotionEngine, root: HTMLElement, items: HTMLElement[]) => void }
```

- In the chapter's scene, `setup` creates one ScrollTrigger per item: enter band when the item's centre is inside `[--eye-top, --eye-bottom]` of the viewport (`start: 'center 62%', end: 'center 36%'`); leave only once the centre is 4% outside (`'center 66%'` / `'center 32%'`) and no other item is inside: that is the hysteresis. It sets `active` to the item in the band (closest to 50% when two are).
- A chapter-level trigger on `root` (`start: 'top bottom', end: 'bottom top'`) sets `active = -1` on `onLeave` and `onLeaveBack` (fixes the ProtoC leak: LottieIcon disables its off-screen pause when `active` is defined).
- `load` for item i: `Math.abs(active - i) <= 1 || warm.has(i)`, with `const [warm, setWarm] = useState(new Set([0])); useIdleWarm(sectionRef, n, setWarm)` (`src/look/scenes/idle-warm.ts`, rootMargin 150%).
- Render every Lottie through `Art` (`src/look/parts/Art.tsx`): `<Art item={...} size={px} active={active === i} load={...} />`. Art passes `renderer` from data (`canvas` for Lottie 10).
- Size Lotties at their real box size (never scale a Lottie's box with a transform: canvas blurs). Wells use the file's own aspect ratio.
- The dock's chat button plays Lottie 7 once when the dock appears (`loop={false}`, `active` true on show), then rests on its last frame. Inside the open chat panel it loops (the panel covers the page).
- Dev only: LottieIcon increments `window.__mwLottiePlaying` while playing (guarded by `import.meta.env.DEV`) so QA can assert "at most 1" while scrolling.

### 1.9 Rive gating (`rive-slot.ts`)

```ts
let holder: { id: string; stop: () => void } | null = null
export function claimRive(id: string, stop: () => void) { if (holder && holder.id !== id) holder.stop(); holder = { id, stop } }
export function releaseRive(id: string) { if (holder?.id === id) holder = null }
```

- Lens, HeroBuild and Companion call `claimRive(id, () => r.stopRendering())` whenever they start rendering and `releaseRive(id)` when they stop (off screen, settled, unmount). Only one canvas draws at any moment.
- All three share the one `@rive-app/canvas-lite` 2.43.1 chunk (`rive` manualChunk). The wasm (about 365 KB gzipped) is requested only after `load` plus an idle slot, never at the first frame.
- Load triggers: Lens after load + idle; HeroBuild when the build hold is within 150% of a viewport (IntersectionObserver `rootMargin: '150% 0px'`) and after load + idle; Companion as today (after load + idle and within 600px).
- DPR capped at 2. Each piece has a static SVG twin for REDUCE, prerender, no JS and failure, identical to its first drawn frame, so the swap is invisible.

### 1.10 Video gating

- The only video element on the page is the one HeroMedia mounts inside the Lens (`film={LENS_FILM}`): after `load` + idle, never with Data Saver, never under CALM, REDUCE or the widget's stop switch, `src` only at 25% visibility, paused off screen (`engine.playInView`). Phone file `lens-m.mp4` (396 KB) below 768px, `lens.mp4` (740 KB) from 768px (useHeroVideo's existing breakpoint; all shot CSS uses 768 as its first breakpoint so the film and the layout switch together).
- Everywhere else the film appears as `lens-m-poster.webp` (34 KB): the slot of the site that builds itself (S4) and the miniature's hero (S9). Both `<img loading="lazy" decoding="async" alt="" aria-hidden="true">`.
- `DESK_FILM` (`hero-bg*.mp4`) never ships in the shot page.

### 1.11 Header and footer under `html[data-look="shot"]`

Header (`src/components/layout/Header.tsx`, no code change; CSS in `shot-base.css`):
- The desk's far edge: `background: var(--table)`, height `var(--head)` (56px at every width), bottom hairline `box-shadow: inset 0 -1px 0 var(--line)`.
- Logo: AnimatedLogo compact, 24px tall below 860px (21px at 359px and below), 26px above; colours from `--logo-*` (light palette). The ident gate (`html.logo-intro`, once per visit) is unchanged.
- The a11y icon (`.mw-head__a11y`) is visible at every width in shot (override the desktop hide rule). The desktop side tab (`.mw-a11y-tab` and its absolute wrapper's tab) is `display: none` in shot.
- 'בואו נדבר' (sm LookButton) shows from 431px only (#52, #63).
- Mobile menu (`.mw-menu`): a white paper sheet on the table (`background: var(--paper)`), links in Noto 800 at `clamp(2.2rem, 9vw, 3rem)`, tel and mail at 1rem ink at its foot; framer opacity (200ms) as today, plus `y: -8 → 0`. Focus trap, scroll lock and `track()` unchanged.

Footer (`src/components/layout/Footer.tsx`): see S10.

### 1.12 Floating chrome (phone rules first)

| Element | Where at 390 | Size | z | Visible when | Zone |
|---|---|---|---|---|---|
| Header | sticky top | 56px | 50 | always | `ui` |
| Dock (`ShotDock`) | fixed bottom, full width, the table's near edge | `--dock-h` 64px + safe area + `--browser-chrome-bottom` | 40 | not while `[data-dock-hide]` (hero CTA group), `#contact` or the footer intersects the viewport; not while the cookie strip is open; not while the chat panel or a dialog is open | `ui` |
| WhatsApp pill (in the dock) | inline-start side, thumb reach | 48px tall, padding 0 18px, ink fill, white icon + 'דברו איתנו' 1rem 700 | - | with the dock | `ui` |
| Chat button (in the dock, ChatWidget trigger via `triggerSlot`) | inline-end side | 44px paper disc, ink hairline, Lottie 7 at 36px | - | with the dock | `ui` |
| Cookie strip (CookieConsent) | fixed bottom, inset-inline 12px, replaces the dock | `--strip-h` (about 104px), text 0.9rem, buttons 44px | 50 | first visit until a choice | `ui` |
| A11y trigger | header only | 40x44 | 50 | always | `ui` |
| Chat panel | full screen sheet of paper | `visualViewport.height` | 60 | on open | - |
| Lead sheet (LeadModal) | bottom sheet of paper | max 70svh, top corners 2px | 60 | on intent only (D79) | - |
| Menu | full screen paper | - | 60 | on open | - |

- `ShotDock` (`src/look/shot/ShotDock.tsx`): `<div class="shot-dock" data-zone="ui" data-hidden={hidden}>` containing an `<a>` with the existing FloatingWhatsApp contract (`href={WHATSAPP_URLS.general}`, `target="_blank"`, `rel="noopener"`, `aria-label="דברו איתנו בוואטסאפ"`, `onClick={() => track('whatsapp_click', { placement: 'floating' })}`) and `<span class="shot-dock__chat" ref={slotRef} />` passed to ChatWidget as `triggerSlot`. Visibility: one IntersectionObserver on `[data-dock-hide], #contact, footer.mw-foot` (threshold 0); `hidden = anyIntersecting || body.mw-consent-open || an aria-modal dialog is open`. Motion: `translateY(100%) → 0` in 180ms, exit 140ms; instant under the stop switch. No breathing glow. `--safe-b` never changes with `hidden`.
- Layout.tsx: when `LOOK === 'shot'`, render `ShotDock` in the aside instead of `FloatingWhatsApp`; keep the idle mount for AccessibilityWidget, ChatWidget and CookieConsent, but listen to `mw:chat-open` and mount the widgets immediately if it fires first.
- `chat-event.ts`: `export const CHAT_EVENT = 'mw:chat-open'; export function openChat(placement: string) { (window as any).__mwChatPending = placement; window.dispatchEvent(new CustomEvent(CHAT_EVENT, { detail: { placement } })) }`. ChatWidget on mount checks `__mwChatPending`, opens, clears it, and calls `track('chat_open', { placement })`.
- CookieConsent in shot: a receipt-like paper strip, square corners, `box-shadow: var(--paper-shadow)`, text `0.9rem/1.6` (the approved wording and link unchanged; the in-text link keeps its WCAG underline), 'אישור' as an ink button, 'דחייה' as an ink-2 text button, both 44px. `body.mw-consent-open` behaviour unchanged (lead-intent's `isBusy` relies on it).
- AccessibilityWidget panel in shot: paper card dropping from the header (`top: calc(var(--head) + 8px)`), text 1rem, toggles 44px, ink on paper.
- ChatWidget panel in shot: paper sheet, header ink with Lottie 7 at 52px, messages 0.95rem (17px), input 1rem (no iOS zoom).
- LeadModal in shot (`src/look/lead-modal.css`, shot block): `.lm { align-items: flex-end; padding: 0 }`, backdrop `rgba(27, 29, 33, .25)` (no black), `.lm__card { border-radius: 2px 2px 0 0; background: var(--paper); max-height: 70svh }`, Lottie 13 at 96px, fields 52px with `--line-ui` borders, privacy label 0.9rem. Every lead-intent rule unchanged. `data-intent="end"` lives on the footer only (never on the pull-back hold).

### 1.13 Overlap-audit conventions

- `data-zone="text"` on every heading, paragraph, label, link and CTA (LookButton `zone="text"`); `data-zone="art"` on objects, Lottie wells, the Lens, the Laptop, the line, the miniature, BigWord's wrapper; `data-zone="ui"` on header, dock, strip, chat trigger, a11y trigger.
- Holds: `<div class="hold" data-hold="dive|build|pullback"><div class="hold__stage">`. The audit treats text inside a stuck `.hold__stage` as strict against `ui`; only the dive stage contains text, and that text ends above `--safe-b`.
- Tilted sheets give projected boxes: confirm every counted hit in the saved jpg before "fixing" it, and check that the report's zone counts are above 0 (an empty page passes vacuously).

### 1.14 Performance budget (390 is the gate)

| Metric | Budget | How |
|---|---|---|
| LCP | 2.39 s or better, element = H1 | `scripts/qa/rum.mjs` (3 runs, 390 DPR2, 4x CPU, 1.6 Mbps) must print `H1` |
| CLS | 0.006 or better | rum.mjs + Lighthouse |
| TBT | 50 ms or better | Lighthouse mobile median of 3 (`scripts/qa/lh3.sh`), after an example.com control run |
| Lighthouse mobile | 96 or better (median) | lh3.sh |
| First-paint bytes | entry CSS (base + hero + fonts), Noto Hebrew subset 17 KB preloaded, no Betaamango request | network log at 390 |
| Video | 1 element, 396 KB on phones, 0 bytes before load + idle, 0 under CALM / Data Saver | network log |
| Rive | wasm 365 KB gz + rive.js 50 KB gz after load + idle; riv files 19 / 10 / 7 KB; 1 renderer at a time | network log, `layers.mjs`, Performance panel |
| Lottie | at most 1 playing, at most 3 built near the viewport, Lottie 10 on canvas | `__mwLottiePlaying`, profile |
| Long tasks while scrolling at 4x CPU | choose (3.3-7.1 vp) and build+steps (7.0-12.5 vp) at or below KM's services+process count | `scripts/qa/profile-scroll.mjs`, `trace-section.mjs` |
| Compositor layers with will-change | at most 3 at any scroll position on a phone | `scripts/qa/layers.mjs` |
| Per-frame work | transform / opacity / clip-path / scaleY writes only; no layout reads in `onUpdate` | code review |
| ScrollTriggers | about 50 | `ScrollTrigger.getAll().length` |
| Horizontal overflow | 0 at every scroll step, 320-1440 | `scripts/design-verify.mjs` |

### 1.15 Accessibility conventions

- Objects, Lotties, the Lens, the Laptop, the line, BigWord and the miniature are `aria-hidden`. The chatbots bubble is the one interactive object: a real `<button>` whose accessible name is its visible text (S3).
- Focus order equals visual order. Focusing a link inside a section never lands on off-screen copy (no hidden copy in stages in this design).
- Every interactive target is 44px or more. Focus ring `outline: 3px solid var(--ink); outline-offset: 3px` (4px on IrisButton as today).
- High contrast mode: the table and paper keep AA, no underlines appear.

---

## 2. Sections, in page order

Positions are the storyboard's (390 / 900 / 700). Each section lists: files, reuse, DOM, data attributes, zones, motion, widths, REDUCE and CALM, gating, copy, acceptance.

### S1. Hero, the dive (`ShotHero.tsx`, `shot-hero.css`)

- **Chapter:** `data-chapter="hero"`, `data-dossier="W19 W20 W09"`. 390: 0-1.57 vp, hold 0-1.07. 900: hold 0-1.36. 700: hold 0-1.38.
- **Reused:**
  - `src/look/parts/Lens.tsx`, adapted (all new props optional, KM unchanged): `range?: { trigger: () => Element | null; start: string; end: string; from?: number }` replaces `el.closest('section')` as the scroll source (openness target = rest 0.72 → 1 over the range progress mapped from `from` (0.7) to 1); `startAfterIdle?: boolean` (shot passes `true`: start Rive after load + idle even with `html.hero-iris`); `filmSizes?: string` (shot: `'(max-width: 767px) 42vw, 330px'`, the film circle is 71% of the lens); `src?: { riv: string; rest: string; closed: string }` (shot passes the `lens-shot.*` assets, section 3); `claimRive('lens', ...)` / `releaseRive('lens')`. Keep the first-visit intro unchanged in shape (closed 0.28 s, open until 0.95 s, rest, `remember()`), with one new condition: it plays only if the dive progress is below 0.1 when Rive becomes live and no later than 5 s after first paint; otherwise skip to the scroll-derived openness and still call `remember()`. Pointer turn (fine pointer only) and the 150 ms tap shutter unchanged. Import the iris constants as `import { LENS as IRIS } from '../parts/lens-geometry'` if needed (camera.ts exports `DEPTH`, keep it that way).
  - `HeroMedia` (through Lens) as is, `film={LENS_FILM}`.
  - `HERO` from `src/look/data.ts`; `LookButton` from `@look/button` (IrisButton); `track` from `src/utils/analytics.ts`.
  - Desk props: `Laptop` (`src/look/parts/Laptop.tsx`, closed pose via class `shot-lap--closed`: `.lap { transform: rotateX(55deg) rotateZ(-8deg) }`, `.lap__lid { transform: rotateX(-86deg) }`), `Thing` (`src/look/parts/Things.tsx`) for loupe and cassette at 390, all six kinds at 1100+.
  - HeroLens's markup contract only (not the file).
- **DOM:**

```html
<section class="shot-hero" data-chapter="hero" data-dossier="W19 W20 W09" aria-labelledby="hero-title">
  <div class="hold" data-hold="dive">
    <div class="hold__stage shot-hero__stage">
      <div class="shot-hero__model">                      <!-- the camera layer: the only transform -->
        <div class="shot-desk" aria-hidden="true" data-zone="art">
          <i class="shot-desk__sheet shot-desk__sheet--a"></i><i class="shot-desk__sheet shot-desk__sheet--b"></i>
          <span class="shot-desk__laptop"><Laptop className="shot-lap shot-lap--closed" /></span>
          <span class="shot-desk__loupe"><Thing kind="loupe" /></span>
          <span class="shot-desk__cassette"><Thing kind="cassette" /></span>
          <!-- 1100+: also phone, bubble, frame, each with data-depth -->
        </div>
        <article class="shot-sheet shot-hero__sheet">
          <div class="shot-hero__lens" data-zone="art"><Lens engine range startAfterIdle filmSizes src /></div>
          <div class="shot-hero__copy">
            <h1 id="hero-title" class="shot-hero__title" data-zone="text"><span>העסק שלכם</span><span>המומחיות שלנו</span></h1>
            <p class="shot-hero__sub" data-zone="text">בונים לכם אתר שמביא פניות. מדברים ישירות עם המפתח, בלי מתווכים.</p>
            <div class="shot-hero__ctas" data-dock-hide>
              <LookButton href="#contact" block zone="text" onClick={() => track('cta_click', { placement: 'hero_contact' })}>בואו נדבר על הפרויקט שלכם</LookButton>
              <a class="shot-link" href="#services" data-zone="text" onClick={() => track('cta_click', { placement: 'hero_services' })}>לשירותים שלנו</a>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</section>
```

- **Layout at 390 (the binding layout):**
  - `--lens-d: clamp(140px, calc(100svh - var(--head) - var(--hero-reserve) - 380px), 248px)` with `--hero-reserve: 0px`, and `var(--strip-h)` under `html.consent-pending`. At 844: 248px. At 664 with the strip: 140px.
  - Stage padding `12px var(--gut) 0`. `.shot-hero__model { padding-top: calc(var(--lens-d) * .35); transform-origin: 50% var(--h1-line) }` with `--h1-fs: clamp(2.2rem, 13.8vw, 3.4rem)` and `--h1-line: calc(var(--lens-d) + 12px + 1.02 * var(--h1-fs))` (the H1's centre line, computable before paint).
  - Lens: centred, `width: var(--lens-d)`, `margin-top: calc(var(--lens-d) * -.35)` so 35% of it lies on the desk above the sheet; a soft contact shadow under it (`::before`, radial ink at 18%, static).
  - Copy: H1 `var(--h1-fs)` (about 54px, two lines, y about 320-440), 14px gap, sub 1rem/1.65 ink-2 (3 lines), 18px gap, CTA `block` 52px (y about 566-618), 8px gap, secondary link 44px (y about 626-670), sheet padding-bottom 16px. The CTA's bottom must be at or above `100svh - var(--safe-b)`.
  - `@media (max-height: 700px)`: H1 max 2.67rem (48px), gaps -4px each.
  - Desk props (outside the sheet's rectangle at every dive step; they share the model's transform so they never cross it): sheet A `rotate(-3deg) translate(-6px, 10px)`, sheet B `rotate(2deg) translate(8px, 16px)` behind the hero sheet; closed laptop 180px wide below the sheet's bottom edge at the inline-end side, about 40% visible in the overview; loupe at font-size 2.6px past the top inline-start corner; cassette at 2.6px past the bottom inline-start corner. At scale 1 all of them are outside the stage (clipped).
- **Widths:** 768-1099: sheet max 720px, same stacking, pose `tablet`. 1100+ (900 and 700): sheet max 1160px, two columns: copy on the inline-start side (right), lens on the inline-end side at `--lens-d: min(36vw, calc(100svh - var(--head) - 180px), 460px)` overhanging the sheet's top inline-end corner by 35%; H1 `clamp(3.6rem, 6.4vw, 6.2rem)`; CTAs in one row (CTA not block). Overview pose `desk` (rotateX 20, scale 0.64): the whole sheet plus all six objects and the closed laptop around it on the table (font-size 3.4px), each object with `data-depth` (0.4-1) lagging the model by `depth * 0.04 * innerHeight` px on the dive (one transform each, fine pointer not required; CALM 0.35x; none below 1100 and under REDUCE). At 700 the H1 and the CTA row sit above the fold (check).
- **Motion (scene in ShotHero, `useScene`):**
  - REDUCE: remove `shot-dive*` classes; return (sheet flat, no hold height, desk props hidden by CSS: `html:not(.motion-ready) .shot-desk { display: none }`).
  - `short` or `textScaled` policy: no `dive()` and no hold; remove the pre-paint classes; only the late exit tilt: `land(t, sheet, { enter: false })`.
  - Otherwise: `dive(t, { hold, layer: model, id: 'dive' })`, with the Lens `range` set to `{ trigger: () => hold, start: 'top top', end: 'bottom bottom', from: 0.7 }` (the iris opens 0.72 → 1 over the last 30% of the hold). After the release, the sheet's late exit tilt: `land(t, sheet, { enter: false })` (the hero sheet never lands; it starts in the overview pose).
  - CALM: pose `calm`, `scrub: true`, no depth drift, no iris intro (no `hero-iris` under CALM), iris scroll-open stays (visitor-driven).
- **Gating:** no Lottie. Rive: Lens only (after load + idle). Video: the one HeroMedia.
- **Copy (verbatim):** `src/look/data.ts` HERO: 'העסק שלכם', 'המומחיות שלנו', 'בונים לכם אתר שמביא פניות. מדברים ישירות עם המפתח, בלי מתווכים.', 'בואו נדבר על הפרויקט שלכם', 'לשירותים שלנו'. No other text (ProtoC's cue line is dropped).
- **Acceptance:**
  - rum.mjs at 390 prints `H1` as the LCP element in 3 of 3 runs; LCP 2.39 s or better. Run it twice, Rive wasm after idle (this spec) and at the first frame (KM's way), and record both numbers in `design/LEDGER.md` for Nati.
  - No jump at boot: a 390 screenshot before hydration (pre-paint pose) and right after the scene runs differ by under 1px around the H1 (`?at=dive:0`).
  - The H1 is never rotated on Z (computed transform of the model has no Z rotation); `shot-dive` is gone after boot; `?reduce=1`, prerender and no-JS show a flat sheet with no desk props.
  - First visit with `?motion=full` and the lens in view: closed → open → rest once; second load in the session: rest. CALM: no intro, poster only.
  - One `<video>` in the DOM, created only after load + idle, never under CALM / Data Saver / stop switch.
  - At 390x664 with `consent-pending`: the CTA bottom is above the strip. At 320x568: no hold, everything readable, no overflow.
  - Dock hidden while `.shot-hero__ctas` is visible; appears when it leaves.
  - Overlap 0 at 320 and 390 including the overview frame (props never touch text).

### S2. Meet, why us (`ShotMeet.tsx`, `shot-meet.css`)

- **Chapter:** `id="why-us"`, `data-chapter="meet"`, `data-dossier="W05 W23 W19"`, `aria-labelledby="why-title"`. 390: 1.57-3.29. 900: 1.86-3.39. 700: 1.88-3.84.
- **Reused:** `WHY_ITEMS` exported from `src/look/sections/WhyUs.tsx` (copy and Lottie paths single-sourced); `Art`; `useIdleWarm`; `useEyeLine`; `land` (camera.ts). WhyUs.tsx's own timeline, bezel and `data-theme` are not used.
- **DOM:**

```html
<section id="why-us" class="shot-meet" data-chapter="meet" data-dossier="W05 W23 W19" aria-labelledby="why-title">
  <header class="shot-table-head">
    <h2 id="why-title" data-zone="text">למה לעבוד איתנו?</h2>
    <p data-zone="text">שלושה דברים שמבדילים אותנו</p>
  </header>
  <ul class="shot-sheet shot-meet__sheet">
    <li class="shot-meet__item" data-on>           <!-- data-on present when lit -->
      <div class="shot-screen" aria-hidden="true" data-zone="art">
        <span class="shot-screen__well"><Art item size active load /></span>
        <i class="shot-screen__dot"></i>
      </div>
      <h3 data-zone="text">אתר מהיר שלא נתקע</h3>
      <p data-zone="text">נטען כמעט מיד ועובד חלק בכל טלפון ומחשב.</p>
      <p class="shot-receipt" data-zone="text">…</p>   <!-- item 0 only, only when SPEED_PROOF is set -->
    </li>
    <!-- items 1 and 2 -->
  </ul>
</section>
```

- **Layout at 390:** section padding 72px top, 48px bottom. Sheet 366px, padding 24px 20px 28px. Screen: width `min(100%, 300px)`, `aspect-ratio: 4 / 3`, centred, `border: 2px solid var(--ink)`, radius 6px, well inset 8px; off: well `var(--table)`, dot 10px ink at the bottom inline-end corner; on: well white, dot scaled to 0. Lottie box sized to the well (225px height; Lottie 2 and AI are square, 6 is 1459x1080). h3 1.35rem, p 1rem ink-2 line-height 1.7. Items separated by a hairline (`box-shadow: inset 0 -1px 0 var(--line)`), 40px apart. Receipt 0.9rem ink-2, number and date in `<bdi dir="ltr">`.
- **Widths:** 1100+: sheet 1160px; each item is a row: screen 360x270 at the inline-start, text beside it (max 46ch, vertically centred); row i has `padding-inline-start: calc(i * 72px)` (a descending staircase). 700: screen 320x240, step 48px. 768-1099: one column, screen 360x270.
- **Motion:**
  - Land: `land(t, sheet, { strength: 1, art: firstScreen.offsetTop + firstScreen.offsetHeight })`, exit on.
  - Switch on, per item: ScrollTrigger `trigger: screen, start: 'top 62%'`; `onEnter` → set `data-on`; `onLeaveBack` → remove it (derived from scroll). Transitions (CSS, in this order): dot `scale 1 → 0` 0-180ms; well background table → paper 120-240ms; h3 `color: var(--ink-2) → var(--ink)` from 200ms (colour only). Under the stop switch all instant.
  - Lotties: `useEyeLine` over the three screens; an item's Art is `active` only if it is lit and in the band.
  - CALM: land tilt 6, transitions 120ms. REDUCE: all items `data-on`, no landing, Lotties frozen on their last frame by LottieIcon (stop switch) or not built (prerender).
- **Gating:** Lotties 2, AI, 6 via Art (svg). `load` = active ±1 ∪ warm. No Rive, no video.
- **Copy:** `WHY_ITEMS` from `src/look/sections/WhyUs.tsx` (titles and lines verbatim), h2 'למה לעבוד איתנו?' and lead 'שלושה דברים שמבדילים אותנו' (WhyUs.tsx). New: the receipt `[קופי: נתי]` from `copy.ts`:

```ts
// [קופי: נתי] Shown only after the shot build is re-measured (lh3.sh median + rum.mjs, 390). Never ship the 13.10 KM number on this page.
export const SPEED_PROOF: { score: number; date: string } | null = null
export const speedLine = (p: { score: number; date: string }) => `האתר הזה בטלפון: ציון מהירות ${p.score}. נמדד ב-${p.date}`
```

- **Acceptance:** each screen switches on at the 62% line and off again when scrolled back; never more than one Lottie playing; no three-card grid at any width; overlap 0; the receipt is absent from the DOM while `SPEED_PROOF` is null; contrast of ink-2 lines 7:1 or more.

### S3. Choose, the tool row (`ShotChoose.tsx`, `shot-choose.css`)

- **Chapter:** `id="services"`, `data-chapter="choose"`, `data-dossier="W04 W13 W14"`, `aria-labelledby="services-title"`. 390: 3.29-7.06. 900: 3.39-5.90. 700: 3.84-7.07.
- **Reused:** `SERVICES` (`src/look/data.ts`, titles from `src/data/services.ts`, lines from `LINES`), `Thing` and `things.css` as is (tokens from 1.3), `Art`, `useIdleWarm`, `useEyeLine`, `LookButton`, `track`, `openChat` (chat-event.ts). FlightHold's data contract (pairing, captions, 'services' placement), not its file.
- **Order:** `SERVICE_ORDER` in `copy.ts`: `['landing', 'seo', 'chatbots', 'video-editing', 'memory-videos', 'websites']` (websites last, so its laptop opens right after it, S4). `[לבירור: נתי]`. If Nati keeps the approved order, set `SERVICE_ORDER = SERVICES.map(s => s.id)`: websites then renders first with its Lottie well only, and the laptop appears only in S4. Nothing else changes.
- **Object map (390 font-size, rest angle, move):**

| Service id | Object | 390 size | Rest | Face content | Move |
|---|---|---|---|---|---|
| landing | `Thing kind="phone"` lying on its side (`rotateZ(-90deg)` on the Thing, the Art inside counter-rotated 90deg) | 5.4px (footprint 270x146) | -4deg | Lottie 3 at 220x124 (landscape, svg) | `standUp(t, obj, { from: 72 })` |
| seo | `Thing kind="loupe"` | 5.6px (224x258) | 6deg | Lottie 4 in the glass (square, svg) | `slideIn(t, obj, { dx: 40, fromZ: 14, toZ: 6 })` |
| chatbots | `Thing kind="bubble"` inside a `<button>` | 5.6px (269x213) | -3deg | Lottie 14 (svg) | `setDown(t, obj, { fromZ: -9, toZ: -3 })`; tap opens the real chat |
| video-editing | `Thing kind="cassette"` | 6px (312x198) | 4deg | Lottie 10 in the label window (canvas) | `reels(t, [...obj.querySelectorAll('.thing__reel')], obj)` |
| memory-videos | `Thing kind="frame"` | 5.6px (246x246) | -5deg | `photo edit.svg` (img via Art) under a `.shot-wash` | `develop(t, wash, obj)` |
| websites | no object: a Lottie well on its label | well height 180px, file aspect (500x500) | - | Lottie 1 (svg) | the label lands on its well: `land(t, label, { strength: .5, art: well height + 20 })` |

- **DOM (per item, websites differs as noted):**

```html
<section id="services" class="shot-choose" data-chapter="choose" data-dossier="W04 W13 W14" aria-labelledby="services-title">
  <header class="shot-table-head"><h2 id="services-title" data-zone="text">מה אנחנו עושים</h2></header>
  <ul class="shot-tools">
    <li class="shot-tool shot-tool--landing">
      <div class="shot-tool__obj" aria-hidden="true" data-zone="art"><Thing kind="phone"><span class="thing__art"><Art …/></span></Thing></div>
      <div class="shot-label">
        <h3 data-zone="text">דפי נחיתה</h3>
        <p data-zone="text">דף אחד שהופך גולש לפנייה בוואטסאפ.</p>
        <p class="shot-label__links"><a href="/services/landing-pages" aria-label="לפרטים על דפי נחיתה" data-zone="text">לפרטים</a></p>
      </div>
    </li>
    <li class="shot-tool shot-tool--chatbots">
      <button type="button" class="shot-tool__obj shot-bubble" data-zone="art" onClick={() => openChat('services_bubble')}>
        <span aria-hidden="true"><Thing kind="bubble"><span class="thing__art"><Art …/></span></Thing></span>
        <span class="shot-bubble__hint" data-zone="text">נסו את הבוט</span>
      </button>
      <div class="shot-label">…</div>
    </li>
    <li class="shot-tool shot-tool--memory-videos">… links: 'לפרטים' and <a href="/portfolio/memory-videos" aria-label="ראו דוגמה לפרויקט: סרטוני זיכרונות">ראו דוגמה</a></li>
    <li class="shot-tool shot-tool--websites"><div class="shot-label"><div class="shot-label__well" aria-hidden="true" data-zone="art"><Art …/></div><h3 …>בניית אתרים</h3>…</div></li>
  </ul>
  <div class="shot-choose__cta"><LookButton href="#contact" block zone="text" onClick={() => track('cta_click', { placement: 'services' })}>מתחילים פרויקט</LookButton></div>
</section>
```

  The bubble button's accessible name is its visible text 'נסו את הבוט' (no `aria-label`, so label-in-name holds). The links use `SERVICES[i].href`, `hrefLabel` (aria-label) and `portfolio` from data; the visible link texts are 'לפרטים' and 'ראו דוגמה' (FlightHold/LaunchHold).
- **Layout at 390:** section padding 64px top, 48px bottom; each `.shot-tool` is a column: object band (its footprint plus 20px, centred, the rest angle as a static `rotate()` on an inner wrapper so the move helpers own the outer element's transform), then the label card (padding 20px, h3 1.35rem, line 1rem ink-2, links 44px min-height, text centred per #61), 40px between tools. The bubble button: the whole bubble plus hint is the hit area (well over 44px), hint 1rem 700 under the bubble. The CTA after the list: block 52px, 32px above. Thing face content uses the existing `.thing__art > div { position: absolute; inset: 0; width: auto !important; height: auto !important }` pattern; pass `size` = the face's px (measured on refresh) so canvas is drawn at real size.
- **Widths:** 1100+: a two-column grid, rows `[landing | seo]`, `[chatbots | video-editing]`, `[memory-videos | websites]`, the inline-end column offset 120px down (a stagger, not a grid of cards); objects at 7.4px (900) / 6.6px (700); labels 420px. The bubble gets a contained hover on fine pointers (`.thing__body` translateY -2px inside the button's padding). 768-1099: one column, objects at 6.4px.
- **Motion:** per the table above. Labels are text-first, so they never land or tilt: they scroll flat under their object. Only the websites label lands, because it opens with its Lottie well. Objects carry no text, so their resting angles are allowed. CALM: smaller values per helper. REDUCE: objects at rest angles, the phone upright, the wash hidden, the reels still.
- **Gating:** `useEyeLine` over the six `.shot-tool` items (index in render order); Art `active` only for the item in the band; `load` = active ±1 ∪ warm (`useIdleWarm(sectionRef, 6, setWarm)`); Lottie 10 canvas (data). No Rive, no video, the portfolio page's video is never preloaded.
- **Copy (verbatim):** 'מה אנחנו עושים' and 'מתחילים פרויקט' (`src/look/sections/ServicesFlight.tsx`); titles from `src/data/services.ts` ('בניית אתרים', 'דפי נחיתה', 'קידום אורגני SEO', 'צ׳אטבוטים חכמים', 'עריכת וידאו', 'סרטוני זיכרונות'); lines from `src/look/data.ts` LINES; 'לפרטים', 'ראו דוגמה' (FlightHold.tsx); aria-labels from data and 'ראו דוגמה לפרויקט: סרטוני זיכרונות'. New: `BOT_HINT = 'נסו את הבוט'` `[קופי: נתי]` in copy.ts.
- **Acceptance:** six distinct moves fire in order, one per 0.5-0.6 vp at 390; at most one Lottie playing; tapping the bubble opens ChatWidget (also within the first 3 s, before the idle mount) and tracks `chat_open` with placement `services_bubble`; 'ראו דוגמה' present with its aria-label; 4x CPU long tasks in 3.3-7.1 vp at or below KM's services hold; overlap 0 (objects never over label text); every link 44px.

### S4. Build, the laptop hold (`ShotBuild.tsx`, `shot-build.css`)

- **Chapter:** `id="process"`, `data-chapter="build"`, `data-dossier="W01 W12 W19 W21"`, `data-intent="interest"`, `aria-labelledby="how-we-work-title"` (the h2 is in S5, same section). 390: hold 7.50-9.56 (stage visible from 7.06). 900: 6.34-8.90. 700: 7.49-10.07. Main peak (the cursor's click in the built site) at 9.04 vp = 47.8% of the scroll at 390 (900: 48.0%, 700: 47.1%).
- **Reused:**
  - `Laptop` (`src/look/parts/Laptop.tsx`) as is; shot skin in shot-base.css: `.shot-lap .lap__lid { background: var(--ink) }`, screen `var(--paper)`, base `var(--paper)` with `box-shadow: inset 0 0 0 1px var(--line), var(--paper-shadow)`, deck hint ink at 8%, camera dot ink-2. (Aluminium gradient removed per D81, `[לבירור: נתי]`.) Transforms only on `.lap` and `.lap__lid`; perspective on the stage (`perspective: 1100px`), never on a transformed ancestor.
  - `HeroBuild` (`src/look/parts/HeroBuild.tsx`), adapted with `mode="scrub"` (new, KM/K keep `play`): `forwardRef` handle `{ setProgress(p: number): void }`; props `src={{ riv: heroShotRiv, built: heroBuiltShotSvg }}`, `poster="/images/lens-m-poster.webp"`. In scrub mode: no `html.hero-build` gate, no sessionStorage, no `reveal` listener, no HeroMedia; the slot (`hero-slot.json` rect) holds `<img class="kh__slot-still" src={poster} alt="" aria-hidden="true">` cropped to a centred circle (`border-radius: 50%`, `object-fit: cover`, diameter = slot height), shown (`data-on`) when `p >= REVEAL` (190/264). Rive instance: created after load + idle when the stage is within 150% (IO), `autoplay: false`, scrubbed with `r.scrub('Build', p * 264 / 60)` against a named linear timeline `Build` (option A), or by writing a VM number `progress` 0-100 (option B); rive-studio picks one and logs it in `design/rive/hero/CONTRACT.md` (section 3). Draw only on a progress change; `claimRive('hero', ...)` while the stage is in view. Until Rive is live (or on failure): the opening frame below `p < .92`, `hero-built-shot.svg` plus the still from `p >= .92`.
  - LaunchHold's lid maths and opening frame (Horizon mark on the white screen), ported via `openLaptop`; its turntable becomes `orbit`. LaunchHold.tsx and launch.css are not imported.
- **DOM:**

```html
<section id="process" class="shot-build" data-chapter="build" data-dossier="W01 W12 W19 W21" data-intent="interest" aria-labelledby="how-we-work-title">
  <div class="hold" data-hold="build">
    <div class="hold__stage shot-build__stage" aria-hidden="true" data-zone="art">
      <div class="shot-build__cam">
        <Laptop ref={lap} className="shot-lap">
          <span class="shot-lap__opening"><Logo variant="mark" /></span>
          <HeroBuild ref={build} engine mode="scrub" src poster />
        </Laptop>
      </div>
      <i class="shot-line shot-line--stub"><i class="shot-line__fill"></i></i>
    </div>
  </div>
  <ShotProcess />            <!-- S5 -->
</section>
```

- **Layout at 390:** the stage (`100svh - var(--head)`) holds only the laptop, centred in `[stage top, stage bottom - var(--safe-b)]`; width `max(150px, min(88vw, 343px, (100svh - var(--head) - var(--safe-b) - 120px) * 1.55))`, i.e. 343x221. The line stub runs from the laptop base's inline-start corner straight down to the stage bottom at the same x as S5's line (`--line-x`).
- **Widths:** 1100+: width `min(56vw, (100svh - var(--head) - var(--safe-b) - 120px) * 1.55, 860px)`: 806x520 at 900 and 700 (it fits both). 768-1099: `min(72vw, 560px)`.
- **Motion (one `holdTimeline`, id `build`, `scrub: t.CALM ? true : 0.6`):**
  - 0 → 0.30: `openLaptop(tl, lap, lid, { from: 55, at: 0, span: .30 })`. The opening frame (mark on paper) is visible from the start (it is the screen's base layer).
  - 0.30 → 0.92: `tl.to(proxy, { p: 1, ease: 'none', duration: .62, onUpdate: () => build.current.setProgress(proxy.p) }, .30)`; the opening mark's opacity 1 → 0 over 0.31-0.34 (decorative, under the rising window).
  - `orbit(tl, cam, innerWidth >= 1100 ? 8 : 4)` across 0-1 (skipped under CALM).
  - 0.90 → 1.0: the line stub `scaleY 0 → 1`.
  - Scrolling back runs every step backwards (the build unbuilds). An anchor jump from the hero CTA to `#contact` passes through without side effects (nothing is "played once").
  - CALM: `from: 20`, no orbit, HeroBuild still scrubs (scroll-driven).
  - REDUCE: no hold (CSS), laptop frontal and open (default pose), `hero-built-shot.svg` and the still visible, opening mark hidden, stub full.
  - `short` policy: keep the hold (art only); `textScaled`: keep it.
- **Gating:** no Lottie on the screen. Rive: HeroBuild only, after load + idle and within 150%; renders only while stuck or in view. Video: none (poster still only).
- **Copy:** none inside the stage (by construction). The section heading is in S5.
- **Acceptance:** no `data-zone="text"` element inside `.shot-build__stage`; `?at=build:0`, `:0.3`, `:0.746`, `:1` render the closed pose, the opening frame, the click with the still, and the rest frame deterministically, and scrolling back from `:1` to `:0.3` unbuilds; held distance 1744px at 390x844 (300svh); CSS laptop and `companion-shot-rest.svg` side by side in one 390 screenshot share aspect 1.55, the lid, screen and base colours, and the frontal rest pose; Rive draws nothing while the stage is off screen (no rAF in the Performance panel); 4x CPU: no long task over 50 ms while scrubbing.

### S5. Process heading and steps (`ShotProcess.tsx`, `shot-process.css`, inside `section#process`)

- **Chapter:** part of `build`. 390: heading 10.06-10.34, steps 10.34-12.47. 900: 9.40-11.45. 700: 10.57-13.20. The rest beat after the peak.
- **Reused:** `STEPS` (`src/look/data.ts`), `Art`, `useIdleWarm`, `useEyeLine`, `inkLine` (ProcessLine's single-transform technique, ported), `land`, `LookButton`, `track`. ProcessLine.tsx is not imported; its load-everything behaviour is replaced by gating.
- **DOM:**

```html
<div class="shot-process">
  <header class="shot-table-head shot-process__head">
    <h2 id="how-we-work-title" data-zone="text">איך אנחנו עובדים</h2>
    <p class="shot-process__big" data-zone="text"><span>ארבעה צעדים</span><span>מהשיחה ועד ההשקה</span></p>
  </header>
  <div class="shot-process__track">
    <i class="shot-line" aria-hidden="true" data-zone="art"><i class="shot-line__fill"></i></i>
    <ol class="shot-steps">
      <li class="shot-sheet shot-step" data-on>       <!-- data-on when the line reached it -->
        <i class="shot-step__dot" aria-hidden="true"></i>
        <div class="shot-step__well" aria-hidden="true" data-zone="art" style="--ar: 680 / 500"><Art …/></div>
        <p class="shot-step__kicker" data-zone="text"><bdi dir="ltr">1 / 4</bdi></p>
        <h3 data-zone="text">שיחת היכרות</h3>
        <p data-zone="text">מבינים את העסק, היעדים והקהל שלכם</p>
      </li>
      <!-- design 1200/800 (canvas), build 1920/1080, launch 1200/800 -->
    </ol>
    <div class="shot-process__cta"><LookButton href="#contact" block zone="text" onClick={() => track('cta_click', { placement: 'process' })}>דברו איתנו</LookButton></div>
  </div>
</div>
```

- **Layout at 390:** the track has a 28px inline-start gutter; the line at 14px; sheets 338px, padding 22px 20px 26px, 24px apart; dot 12px ink ring on the line at each sheet's well centre; well height 190px, width `min(100%, 190px * var(--ar))` (258, 285, 314x177, 285); kicker 0.9rem 600 ink-2 (LTR digits); h3 1.45rem; line 1rem ink-2. CTA block 52px, 40px above.
- **Widths:** 1100+: the line at the track's centre; sheets 520px alternating sides (odd on the inline-start side), each offset so about two show per viewport; well height 240 (900) / 200 (700); dots on the line. 768-1099: as 390 with 560px sheets.
- **Motion:** `inkLine(t, { track, fill, nodes: dots, onReach: i => setReached(i) })`; a sheet is `data-on` when `i <= reached`; polish: dot fill 120-240ms, h3 ink-2 → ink from 200ms. Each sheet `land(t, sheet, { strength: 1, art: kicker.offsetTop })` (kicker below the well, so the well is the art band; move the kicker under the well as in the DOM above). Lotties: `useEyeLine` over the sheets, Art `active` only if `data-on` and in the band. CALM: scrub true, tilt 6. REDUCE: line full, all `data-on`, sheets flat, Lotties frozen or not built.
- **Gating:** Lotties 8 (svg), 10 (canvas), 9 (svg), 11 (svg; switch its `renderer` to `canvas` in `STEPS` only if a measured long task over 50 ms appears when it builds at 4x CPU, logged in LEDGER). `load` = active ±1 ∪ warm.
- **Copy:** 'איך אנחנו עובדים', 'ארבעה צעדים', 'מהשיחה ועד ההשקה', 'דברו איתנו' (`src/look/sections/ProcessLaunch.tsx`); STEPS titles and lines (`src/look/data.ts`). The kicker is numerals only.
- **Acceptance:** dots fill exactly when the line reaches them, both directions; one Lottie playing; kicker at least 16px; wells show each Lottie uncropped (`scripts/qa/why-measure.mjs`-style check of box vs frame); `data-intent="interest"` present on `#process`; overlap 0.

### S6. FAQ, the notepad (`ShotStart.tsx` mounts `src/look/sections/Faq.tsx`; `shot-start.css`)

- **Chapter:** `id="faq"`, `data-chapter="start"`, `data-dossier="W01"`. 390: 12.47-14.14. 900: 11.45-12.93. 700: 13.20-15.11.
- **Reused:** `Faq.tsx` as is (one open row, always-mounted answers, `aria-expanded`/`aria-controls`, `data-intent="interest"`, `data-intent-signal`, FAQPage JSON-LD, LookButton 'צרו קשר'), plus three optional props: `chapter` and `dossier` (written to `data-chapter` / `data-dossier` on the section) and `decor?: ReactNode` (rendered first inside `.faq__in`). Shot passes `decor={<i class="shot-line shot-line--margin" aria-hidden="true" data-zone="art"><i class="shot-line__fill"/></i>}`. Its `data-theme="light"` is inert.
- **Shot CSS (all under `html[data-look="shot"] .faq`):** `.faq__head` printed on the table (h2 + line, `.shot-table-head` metrics). `.faq__list` is the notepad: paper sheet 366px (760px from 1100), a 64px binding band at its top (`::before`: ink at 14% strip with a row of punched holes drawn by a radial-gradient in ink at 18%), rows separated by `box-shadow: inset 0 -1px 0 var(--line)` (the ruled lines), the margin column 28px at the inline-start with the line at 14px. Row numbers 1-13 via `counter-increment` and `.faq__row::before { content: counter(faq) / "" }` (alt text empty, so screen readers skip them), 0.9rem ink-2, in the margin. `.faq__q`: min-height 64px, padding 16px 40px 16px 12px (logical), 1rem 600 ink, alignment `var(--faq-align, center)` (#61; `[לבירור: נתי]` start). `.faq__a-in`: 1rem ink-2 line-height 1.75. `.faq__sign` (plus/minus) at inline-end. `.faq__more`: the slip, a paper strip under the pad, half on the table (`margin-top: -18px; margin-inline-start: 24px`), no rotation, 'עדיין יש שאלות?' 1rem + 'צרו קשר' LookButton 52px.
- **Motion (in ShotStart's scene):** the pad lands once, `land(t, list, { strength: .5, art: 64, exit: false })`, so it is flat before the first row enters the reading band and never tilts on exit; rows never move. The margin line: `inkLine(t, { track: list, fill, nodes: [] , start: 'top 70%', end: 'bottom 70%' })` (no nodes). Row open polish: height 0-220ms (framer, existing), sign rotation 120ms, the row's hairline darkens to ink, the answer appears from 120ms; exit faster. CALM: tilt 3 (strength .5 of 6). REDUCE: flat, line full.
- **Gating:** no Lottie, Rive or video.
- **Copy:** 'שאלות נפוצות', 'כל מה שרציתם לדעת על תהליך בניית האתר', 'עדיין יש שאלות?', 'צרו קשר' (Faq.tsx); 13 Q&A from `src/data/faqs.ts`, verbatim.
- **Acceptance:** the 13 answers and one FAQPage JSON-LD are in `dist-shot/index.html`; rows 64px or more; no transform on any row; the pad's computed transform is `none` by the time its first row's top crosses `100svh - safe-b` (check at `?at=` points); after opening the longest answer at 390, scroll into S7, S8 and the pull-back: BigWord's fill end, the dock-hide observer and `?at=pullback:0.5` are all still correct (ResizeObserver refresh).

### S7. 'מתחילים?' on the table (`ShotStart.tsx` mounts `src/look/sections/BigWord.tsx`)

- **Chapter:** part of `start`; BigWord's root is a `div` (not a section). 390: 14.14-14.37. 900: 12.93-13.38. 700: 15.11-15.66.
- **Reused:** `BigWord.tsx` with two optional props, `end?: string | (() => string)` and `endTrigger?: string | Element` (defaults unchanged). The approved word is the default prop.
- **DOM:** `<div class="shot-bw" data-zone="art"><i class="shot-line shot-line--to-word" aria-hidden="true"><i class="shot-line__fill"/></i><BigWord end={…} endTrigger="#contact .ct__card" /></div>`.
- **Shot CSS:** `.bw` on the table, centred: font Noto 800, `font-stretch: 75%`, `clamp(4.4rem, 22vw, 8rem)` at 390 (about 86px, about 330px wide, fits 366 without clipping; check at 320), up to 13rem from 1100 (11rem at `max-height: 760px`); outline `-webkit-text-stroke: 1.5px var(--ink-2)`, fill `var(--ink)`, no `data-theme` styling. The short line segment `--to-word` comes down the inline-start side from the pad's margin and ends at the word's first letter (the inline-start end of the word).
- **Motion:** line segment `scaleY 0 → 1` from `top 85%` to `top 55%` of the wrapper, then BigWord's own fill: start `top 80%` of the word, end when the card's top reaches the dock line: `end: () => 'top ' + (innerHeight - safeB()) + 'px'` with `endTrigger` the card. CALM: `scrub: true`. REDUCE: filled.
- **Copy:** 'מתחילים?' (`BigWord.tsx`, approved in #54).
- **Acceptance:** no clipping of the word at 320 and 390; the fill completes as the card's top reaches the dock line; paint cost of the clip-path scrub on a mid Android phone under 4 ms per frame; if `-webkit-text-stroke` shimmers on Android, fall back to a fill-only outline (ink-2 at 35% as the base word) and log it.

### S8. Contact, the card and the letter (`ShotStart.tsx` mounts `src/look/sections/Contact.tsx`)

- **Chapter:** `id="contact"`, `data-chapter="start"`, `data-dossier="W16"`, `data-intent="contact"`. 390: 14.37-16.05 (card 14.58-15.10, letter 15.20-16.05). 900: 13.38-14.45. 700: 15.66-17.03.
- **Reused:** `Contact.tsx` logic verbatim (validation, WhatsApp prefill and fallback, every `track()`, `role="status"` / `role="alert"`, `data-intent="contact"`, LookButton states). Changes: optional `chapter`/`dossier` props; `data-zone="text"` on the four way links, `.ct__time`, `.ct__status`, `.ct__failure`, the labels; when `LOOK === 'shot'`, a `<div class="ct__card">` wraps `.ct__face` and `ul.ct__ways` (a Fragment otherwise, so K/M/KM DOM is unchanged). `Companion.tsx` (`src/look/parts/Companion.tsx`) as is, plus optional `src={{ riv: companionShotRiv, rest: companionShotRestSvg }}` and the Rive slot claim.
- **Layout at 390 (DOM order is already right):** 'דברו איתנו' + lead on the table (`.shot-table-head` metrics); `.ct__card`: paper 366px, padding 20px, Lottie 12 at 104px centred at its top (the art band; override the inline 180px with the `> div { position: absolute; inset: 0; width: auto !important; height: auto !important }` pattern inside a 104px box), four rows 64px each (label 0.9rem ink-2 above or beside the value 1rem ink, values in their existing `dir="ltr"`), 24px margin below; `.ct__time` on the table, 0.9rem ink-2, centred; `form.ct__form` is the letter: paper 366px, padding-top `calc(var(--pal-w) * .6545 * 2 / 3 + 16px)`, inputs 52px with `border: 1px solid var(--line-ui)`, text 1rem (no iOS zoom), labels on the inline-start, textarea min 140px, submit block 52px; `.ct__pal` (the Companion) width `--pal-w: clamp(240px, 64vw, 300px)`, centred, `margin-top: calc(var(--pal-w) * .6545 / -3)` so one third of it sits above the letter's top edge. The section has no bottom padding: the letter is its last element (S9's match cut depends on it).
- **Widths:** 1100+: a two-column grid inside 1160px: inline-start column (head, card, time), inline-end column (the letter, 640px, Companion 320px). 700: same.
- **Motion (a `ShotContactMotion` component in ShotStart, `useScene` on `document.getElementById('contact')`):** card `setDown(t, card, { tilt: 11, fromZ: -4, toZ: 0, art: faceBox.offsetHeight + 20 })`; Companion `fromTo(pal, { y: -16 }, { y: 0, scrub: true, trigger: pal, start: 'top bottom', end: 'top 70%' })` plus its shadow element `opacity .4 → 1` (no scale on the canvas's parent). The letter (`form`) is never transformed. CALM: card tilt 6, pal y -6. REDUCE: static.
- **Gating:** Lottie 12 (no `active`: it plays while visible, and it is the only Lottie on screen in this stretch). Rive: Companion after load + idle within 600px, `prefersReducedMotion = engine.CALM`, renders only on screen, claims the slot. Video: none. Dock hidden while `#contact` intersects.
- **Copy (verbatim, `Contact.tsx` and `src/data/site.ts`):** 'דברו איתנו', 'מעוניינים באתר חדש? נשמח לשמוע על הפרויקט שלכם', 'טלפון' 052-8731808, 'אימייל' mediawaveisrael@gmail.com, 'וואטסאפ' 'דברו איתנו', 'אינסטגרם' @mediawaveisrael, 'אנחנו מגיבים לפניות תוך 24 שעות בימי עסקים', 'שם מלא', 'אימייל', 'הודעה', 'שליחת הודעה', the status, failure and validation strings as in code. `[לבירור: נתי]` the sent line: #54 'נשלח. נחזור אליכם היום' (StateButton) vs code 'ההודעה נשלחה בהצלחה! נחזור אליכם בהקדם'. Error state: ink ring + '!' mark + `role="alert"` (no red until Nati rules).
- **Acceptance:** `getComputedStyle(form).transform === 'none'` whenever an input is in view; every track() fires (tel, mailto, whatsapp, instagram, form_submit with mode); WhatsApp fallback opens with the prefill; status and alert are announced; Companion: idle, typing (lines follow the character count), loading, sent, error all render with the shot palette; the Companion canvas never sits inside a scaled parent; overlap 0; the lead popup never opens while `#contact` is 30% in view.

### S9. Deliver, the pull-back into one phone (`ShotDeliver.tsx`, `Mini.tsx`, `shot-deliver.css`)

- **Chapter:** `data-chapter="deliver"`, `data-dossier="W20 W04 W19"`, `aria-hidden="true"` (all art; no heading). 390: stage from 16.05, hold 16.48-17.55, release 17.55-18.05. 900: 14.89-16.35. 700: 17.45-18.93.
- **Reused:** `Thing kind="phone"` (the same object as S3's landing phone, now upright) as the phone body; `Laptop` at miniature size, static, open, frontal, with `hero-built-shot.svg` on its screen; `Thing` loupe, cassette, bubble and frame as the desk props around the phone; `lens-m-poster.webp`; `pullBackMatched` (moves.ts). camera.ts `pullBack` and ProtoC's `.pc-phone-frame` fade are not used.
- **DOM:**

```html
<section class="shot-deliver" data-chapter="deliver" data-dossier="W20 W04 W19" aria-hidden="true">
  <div class="hold" data-hold="pullback">
    <div class="hold__stage shot-deliver__stage" data-zone="art">
      <div class="shot-deliver__layer">                    <!-- the camera layer -->
        <div class="shot-desk shot-desk--end"> loupe, cassette, bubble, frame (Things at 2.4px / 3.4px from 1100) </div>
        <div class="shot-phone"><Thing kind="phone">
          <span class="shot-phone__url"><bdi dir="ltr">mediawave.co.il</bdi></span>
          <Mini />                                           <!-- the condensed site, see below -->
        </Thing></div>
      </div>
    </div>
  </div>
</section>
```

- **Mini.tsx:** a static, condensed column with the phone screen's aspect (about 1:1.87), no text other than the URL above it, no Lottie, no Rive, no video: hero block (the poster as a circle at 40% width, two ink bars for the H1, one ink bar for the CTA), three 4:3 ink frames, five small ink silhouettes (rounded rects), a tiny open laptop with `hero-built-shot.svg`, a short line with four small paper blocks, a pad of hairlines, an ink bar for 'מתחילים?', a small card and the letter with a tiny laptop at its head (`.shot-mini__letter`, the match target). All `aria-hidden`.
- **Layout at 390:** the phone at font-size 6.6px (178x330) centred in `[stage top, stage bottom - safe-b]`; the URL bar at the top of its face, 0.9rem ink-2 on paper (it is the only visible text in the stage and is art, `aria-hidden`); props in the side margins partially off the edges. 1100+: phone height 420px (900) / 360px (700), font-size accordingly; props at 3.4px around it, the desk echoing the hero's overview.
- **Motion:** `pullBackMatched(t, { hold, layer, real: document.querySelector('#contact .ct__form'), mini: miniLetter, id: 'pullback' })`: at progress 0 the mini letter sits exactly where the real letter left the screen, at its width; the camera pulls back to scale 1 with a 0 → 10 → 0 rotateX bump; the phone body and the props enter the frame from outside, never by opacity. CALM: scale and y only. REDUCE: no hold, the phone and the mini at their final scale, props visible around it. `short` policy: no hold, the final frame in flow.
- **Gating:** nothing to gate (static art). Lead-intent: this section carries no `data-intent`.
- **Copy:** `PHONE_URL = 'mediawave.co.il'` `[קופי: נתי]` (copy.ts). Nothing else (ProtoC's finale h2 and draft line are dropped; no '390 × 844' label, no counter).
- **Acceptance:** `?at=pullback:0`: the mini letter is above the stage's top edge with width equal to the real letter's (±2px); `?at=pullback:1`: the phone centred and fully above `--safe-b`; no opacity tween in this timeline; the held distance is 900px at 390x844 (200svh); no Lottie, Rive or video request originates here.

### S10. Footer, the sign-off (`src/components/layout/Footer.tsx`, shot CSS in `shot-base.css`)

- **Chapter:** outside `main` (Layout), so no `data-chapter`; keeps `data-intent="end"` (lead-intent's "read the end, then scroll back" strong signal). 390: 18.05-18.89. 900: 16.85-17.19. 700: 19.43-20.0.
- **Reused:** Footer.tsx and AnimatedLogo `mode="scroll"` (stacked below 640px, horizontal above) as is; one change: when `LOOK === 'shot'`, the `.mw-foot__sign` link renders first in DOM order (so it is stamped right under the phone and focus order still equals visual order). Its own ScrollTrigger and the `maxScroll - 12` clamp are kept; it starts after the pull-back releases because it sits after it.
- **Shot CSS:** the footer lies on the table (`background: var(--table)`; `data-theme="dark"` inert). Sign-off `min(300px, 72vw)` at 390 with 64px / 56px padding; tagline in the display face; column h2 1rem (was 0.85rem), base 0.9rem (was 0.85rem), links 44px tall, centred (#61). Bottom padding `calc(24px + env(safe-area-inset-bottom, 0px) + var(--browser-chrome-bottom, 0px))` (the dock is hidden over the footer).
- **Motion:** the sign-off ident scrubbed one to one by scroll, also under CALM (#53); REDUCE: static logo.
- **Copy (verbatim, Footer.tsx):** 'עיצוב ופיתוח אתרים מקצועיים לעסקים', 'קישורים מהירים' (דף הבית / שירותים / שאלות נפוצות / צור קשר), 'יצירת קשר', 'תקנון שימוש', 'מדיניות פרטיות', 'הצהרת נגישות', '© {year} MediaWave Israel', aria-labels unchanged.
- **Acceptance:** the ident finishes exactly at the page end at 390 and 1440 (`?at=` near maxScroll); no text under 16px; logo rules (#52): no shadow, gradient or geometry change, clear space of half the disc; every track() fires.

---

## 3. Rive asset regeneration (generators only, never hand-edit `.rml`, `.riv` or generated SVGs)

KM production keeps its files untouched. Each generator gets a `--palette shot` flag that writes new files next to the old ones, and each CONTRACT.md gets a change-log line.

| Piece | Command | New outputs | Palette (shot) | Contract change |
|---|---|---|---|---|
| Lens | `node design/rive/lens/build-lens.mjs --riv --palette shot` | `src/look/parts/lens-shot.riv`, `lens-shot-rest.svg`, `lens-shot-closed.svg` | barrel ink `#1B1D21`, focus ring and knurling ink-2 `#4A4F57`, blades ink with ink-2 highlight (default; Klein `#002FA7` only if Nati rules), outer ring = a short desk contact shadow in ink alpha instead of the navy `#00061E/#00113D` stops; glass highlight paper at an alpha | colours only; artboard `Lens`, machine `Main`, the 10 VM numbers unchanged; run the probe |
| Hero build | `node design/rive/hero/build-hero.mjs --riv --palette shot` | `hero-shot.riv`, `hero-built-shot.svg` (same `hero-slot.json`) | browser chrome ink, page paper, wireframe blocks ink at 20% and ink-2, painted blocks table and ink, text bars ink, mark Horizon light palette `#0E1016` / `#002FA7`, cursor ink, toast paper with an ink hairline; slot region painted table grey (the poster still sits on it) | add the named linear timeline `Build` (option A, runtime `scrub`) or a VM number `progress` 0-100 (option B); the `reveal` event stays for K; log which option shipped |
| Companion | `node design/rive/companion/build-scene.mjs --riv --palette shot` | `companion-shot.riv`, `companion-shot-rest.svg` | COL: `lid 1B1D21`, `edge 4A4F57`, `screen FFFFFF`, `ink 1B1D21`, `words 4A4F57`, `logoA 0E1016`, `logoB 002FA7`, `ui ECEEF1`, `hair 1B1D21` at 14%, `cam 4A4F57`, `notch ECEEF1`, base `FFFFFF` flat with an ink-alpha edge (no aluminium gradient), `err 1B1D21` | colours only; artboard `Companion`, machine `Main`, VM `status/progress/keystroke/prefersReducedMotion` unchanged; probe `rive-probe.mjs --contract` |

After regeneration: the CSS laptop skin (S4) and `companion-shot-rest.svg` must match side by side at 390 (aspect 1.55, lid, screen, base, edge), within a few colour levels, as #56 measured for KM.

---

## 4. QA run (Git Bash, cwd `G:/Web-Dev/mw-redesign`, `export TEMP='G:\tmp\temp' TMP='G:\tmp\temp'` first)

1. `npx tsc -b`
2. `npm run lint` (3 old Sanity warnings are known noise)
3. `npm run build:shot` (and `npm run build:km` to prove KM is unchanged)
4. `npx vite preview --outDir dist-shot --port 4178 --strictPort` (keep 4173 free for prerender)
5. `node scripts/overlap-audit.mjs --looks shot=http://localhost:4178/ --vp 320,390,768,1024,1440 --out G:/tmp/mw-qa/shot-overlap` → counted 0, zone counts above 0, every counted frame checked in the jpgs. Repeat with `MSYS_NO_PATHCONV=1 … --path "/?reduce=1"`.
6. `node scripts/design-verify.mjs http://localhost:4178 G:/tmp/mw-qa/shot-verify` → PASS (no console or page errors, no failed requests, overflow 0).
7. Contrast: serve on 4173, `node .gsd/temp/contrast-audit.mjs` → 0 unique violations; add a 390 pass over '/'. Full axe (wcag2a/aa, 21a/aa, 22aa) at 390 and 1440, including the open menu, a11y panel, chat panel and `?lead=now`, plus a `?reduce=1` pass → 0 critical or serious.
8. No-JS: one `<h1` in `dist-shot/index.html`, one FAQPage JSON-LD, the phone number, a word from each of the 13 answers; a 390 JS-disabled screenshot reads as a flat stack of sheets.
9. `node scripts/qa/rum.mjs http://localhost:4178/ 3` → LCP element `H1`, LCP 2.39 s or better, CLS 0.006 or better.
10. `bash scripts/qa/lh3.sh http://localhost:4178/ shot-local` after an example.com control → median 96 or better, TBT 50 ms or better.
11. `node scripts/qa/page-shots.mjs http://localhost:4178/ G:/tmp/mw-qa/shot-frames` and `scripts/qa/lens-film.mjs` mode `s` (390x664) under motion, CALM (OS reduce emulation) and REDUCE (`?reduce=1`); fix the scripts' consent key to `mw_cookie_consent` first. Look at the frames as a flipbook of the camera move.
12. `scripts/qa/layers.mjs` at the dive, the build hold and the pull-back (3 or fewer will-change layers); `scripts/qa/profile-scroll.mjs` at 4x CPU over choose and build (long tasks at or below KM).
13. Measure the page: hold held distances, held share at 390x844, 1440x900, 1440x700 (and 390x664), peak position; update the storyboard's model table with the measured section heights if they differ by more than 10%.
14. Only after step 10: set `SPEED_PROOF` in copy.ts to the measured median score and date, with Nati's approval of the line.

---

## 5. Open for Nati (each blocks shipping its default, not building it)

1. Services order: websites last (`SERVICE_ORDER` default) or the approved order.
2. Lens blades: ink (default) or Klein.
3. WhatsApp pill: ink (default) or green.
4. Error colour: ink + mark (default) or red.
5. FAQ alignment: centred per #61 (default) or start-aligned (`--faq-align`).
6. Sent line: #54 'נשלח. נחזור אליכם היום' or the code's 'ההודעה נשלחה בהצלחה! נחזור אליכם בהקדם'.
7. New copy: 'נסו את הבוט', the speed receipt line (after re-measuring), 'mediawave.co.il' in the phone's address bar.
8. Laptop base and Companion base: paper instead of aluminium (D81).
9. Thing bodies: ink instead of Klein (#58 vs D81).
10. Lottie 5 (performance): stays unused?
11. Lead popup on phones: strong signal only, or keep the 2-point score path.
12. The film in the built site's slot on desktop only (#60 re-approval); default poster everywhere.
13. The lens intro now starts after load + idle (about 1-2 s later on a phone) to keep the wasm off the LCP path; the A/B numbers from S1's acceptance go to Nati.
14. Making `shot` the default of `npm run build` changes production on the next push to main: explicit go-ahead needed; `build:km` and `scripts/rollback-prod.cmd` remain the rollback.
