# MediaWave redesign - brief for a new session (written 2026-10-12)

Use the skills `pattern-breaker` (upgrade mode, depth: rebuild in place) and `rive-studio`. Read this whole file first.

## 1. The ask

Nati wants a **significant, visible change** to mediawave.co.il. He was disappointed by the previous round: three direction demos were built, but all of them kept the same sky-blue palette and the same sea-wave idea. In his words: "לא חייבים לשחק על הרעיון של גל של ים, ולא חייבים תכלת... אני ממש רציתי לראות שינוי משמעותי באתר!"

What he wants:
- a site that looks clearly different,
- unique buttons,
- a scroll that feels like an experience,
- perfect smoothness and performance,
- never generic AI. Everyone should want a site like this.

**Work style (explicit request):** practical, straight to quality work. No agent fleets, no workflows, no research rounds: the research is done, see section 6. Build in the main thread. Use at most one fresh critic agent, at the very end. Ask questions only at the two gates below.

## 2. Rules: what changed, what stays

This section overrides CLAUDE.md, DESIGN.md, PRODUCT.md and memory wherever they say "sky is the only accent" or "living waves".

**Released (may change completely):**
- The sky/cyan palette and the One-Accent rule.
- The sea-wave motif and the wave dividers.
- Section layouts.
- Copy. Every new Hebrew line is marked `[קופי: נתי]` for his approval.

**Sacred:**
- **The hero video stays in the hero:**
  - `/videos/hero-bg.mp4` plus the poster `/images/hero-poster.webp`
  - the video plays on desktop only, mounted after idle
  - never under reduced motion, and never when the widget's "stop animations" is on (see `src/components/sections/Hero.tsx`)
  - its framing, crop, overlay and treatment may change
- **All 13 existing Lotties stay, unchanged.** Nati loves them. They come in mixed colours, so the new palette must give them calm surfaces or frames where they look intentional.
- URLs, H1 and H2 semantics, conversion paths (WhatsApp, tel, form) and analytics `track()` calls.

**Still locked (Nati's taste rules):**
- Hovers stay contained inside their element: no magnetic pull, nothing drifts toward a neighbour.
- No static underlines on UI links; hover-only underlines are fine.
- **New:** no static line inside or under a button label. He rejected the "line crest" button that had a resting line under "שליחת הודעה".
- Accessibility-widget settings never persist between visits.
- WCAG AA contrast is a build gate.
- Hebrew:
  - no letter-spacing, no italic, no em or en dashes in visible text
  - split headline text by words or by engine lines, never by letters
  - motion enters from the right
- Copy voice: outcome-only, dugri Hebrew, zero tech jargon, never AI-sounding. Benchmark: "ליווי אישי / מדברים ישירות עם המפתח, בלי מתווכים".
- Honesty: never invent proof. Testimonials stay hidden until real ones exist.

## 3. State of the repo (do this first)

- **Branch:** `design/pattern-break-20261012`, from main 6a0aabf (= production).
- **Uncommitted W0 foundation.** Keep it; it is direction-independent. Commit it first (see the commit step below). It contains:
  - `src/motion/motion-engine.js` + `.d.ts`: the pattern-breaker scroll engine (GSAP 3.15, ScrollTrigger, SplitText, Lenis 1.3). It is patched for MediaWave:
    - **REDUCE** = the a11y widget (`html.disable-animations`) or prerender. Only final frames.
    - **CALM** = the OS reduced-motion flag. No Lenis, no velocity effects, small travel; scenes still follow scroll.
    - `?motion=full` overrides CALM.
    - The `?at=` hook retries before stamping "missing".
  - `src/motion/ScrollEngineProvider.tsx`: `useScene()` and `useMotionEngine()`. It replaced `ScrollToTop.tsx` (deleted), handles route changes and deep-link re-landing, and rebuilds the engine when the widget toggles.
  - `scripts/prerender.mjs` sets `window.__PRERENDER__` (the engine writes no inline styles into snapshots).
  - `vite.config.ts`: `motion-engine` manual chunk.
  - **App and section cleanup:**
    - Marquee removed: component and CSS.
    - Testimonials not mounted while `testimonials.length === 0`.
    - Services passes `renderer={service.lottieRenderer}`: the 356-path Lottie on SVG measured 25-54 s TBT.
  - `DECISIONS.rtl.md` #47-49, `design/LEDGER.md`, `design/upgrade/baseline/` (slop-scan 96/100 and `preservation.json` of the live site, 11 URLs).
- **Rejected lab round.** It used the sky palette, so delete it:
  - `src/lab/`
  - the `/lab/*` route block plus the four `Lab*` lazy imports in `src/App.tsx`
  - `design/lab/`

  Lab C is half-written and has 2 TS errors, so `npm run build` fails until this is deleted.
- **Commit:** after the delete, `npm run build` must pass. Then commit W0 with explicit paths (never `git add .`: there are pre-existing unrelated `.gsd/*` changes and untracked junk in the root). Message: `feat(motion): scroll engine foundation (W0)`.
- **Baseline for A/B:** git worktree `../mw-baseline` at 6a0aabf, with a `node_modules` junction. Lighthouse the same routes on both, on a quiet machine.
- **Rive CLI 1.5.1** is installed at `C:\Users\User\.rive\bin\rive.exe` (`rive doctor` OK; not logged in, which is not needed).

## 4. Measured facts that must shape the build

- Nati's own Windows has animation effects off (`ClientAreaAnimation=False`), so Chrome reports `prefers-reduced-motion: reduce` on his machine. With the CALM policy the site stays alive for him. Test both default and `?motion=full`.
- **Mobile Lighthouse baseline** (July preview, median of 3): home perf 81, LCP 4.17 s, TBT 116 ms, CLS 0.010. Desktop was 97 on a quiet machine.
- **Earlier motion findings:** p95 frame 50 ms; mobile long tasks 4,034 ms; FAQ 100% fades; zero held moments.
- **Paint-first prerender:** `scripts/prerender.mjs` mounts React 150 ms after load. The H1 is the LCP element: never hide it or animate it from opacity 0.
- **Lazy page fallbacks** must be 120vh or taller, or the result is CLS 0.50.
- **Holds** are CSS sticky stages read by ScrollTrigger, never GSAP `pin`: default pins emit CLS of 1 to 3.4. `overflow-x: hidden` on an ancestor kills sticky; use `clip`.
- **Lottie:**
  - `lottie-react` drops the `renderer` prop. `LottieIcon` drives `lottie-web` directly for canvas.
  - Pin sub-dependencies together with their wrapper in `manualChunks`. Do the same for `@rive-app/react-canvas` + `@rive-app/canvas`.
- **Headless capture:** Chrome defaults to reduced motion; emulate `no-preference`. Use `captureBeyondViewport: false`.
- **Fonts:** Outfit is self-hosted via @fontsource. EFT Betaamango / EFT OffSet are preloaded, but their licence is unresolved. A new Hebrew display or text face is welcome:
  - web-licensed and self-hosted
  - chosen from rendered specimens (skill `anthropic-skills:nati-design-prefs`)
  - Heebo, Assistant, Rubik and Outfit are the reflex choices to avoid as the brand voice

## 5. Rive (Nati wants it in the buttons, and wherever it earns its bytes)

- **Build:** unsigned `rive <dir> --once` with no Luau scripts, so no `--publish`, no login and no watermark. Confirm "no splash" in `rive-probe --shots`.
  - The pointer, press and state come from the page's JS writing view-model properties, not from scripts.
  - Use `BlendState1DViewModel` (axis 0-100) for pointer-following poses.
  - Use an enum for idle, loading, sent and error.
  - Run `rive docs state-machines`, `rive docs easing` and `rive docs data` before writing RML.
- **Runtime:** `@rive-app/react-canvas`. Canvas2D supports data binding, layouts and text (verified in Rive's docs on 2026-10-12). Use `Fit.Layout` for variable button widths. Self-host the matching wasm in `public/rive/`.
- **Load and semantics:**
  - The runtime loads after load plus idle.
  - The CSS rest pose is identical to the Rive rest pose, so the swap is invisible and first paint and LCP never wait for Rive.
  - The label stays real HTML; the canvas is `aria-hidden`; keyboard focus drives the same states as the pointer.
  - Touch gets the press response only.
- **Required states:** idle, hover, pressed, focus, loading, sent, error. All of them interruptible.
- **Mobile fallback:** if mobile TBT breaks the gate, mobile falls back to the CSS button. Record that as a decision.

## 6. Research already done (do not repeat it)

- **Awwwards Site of the Year 2025, Lando Norris (OFF+BRAND, GSAP + WebGL):** the brand's own graphic language becomes the interactive surface over the hero. Fast, expressive transitions. Its weak spots are WPO and responsive scores; beat them.
- **Ocean School (Akufen):** buttons built from the brand's own material.
- **liavmatzri.co.il** (pattern-breaker's masterpiece): real material, type used as image, one move per section.
- The method to apply: the motif comes from the business, not from its name. MediaWave builds websites, edits video, converts old tapes and turns family photos into memory videos. One developer, spoken to directly.

## 7. Step 1: a style board (one sitting, then Gate 1)

Build one dev-only page (route `/board` behind `import.meta.env.DEV`, never prerendered). It shows **three directions** for real:
- the real hero with the video kept, the H1 "העסק שלכם / המומחיות שלנו" and the CTA,
- the primary button with all its states clickable (a CSS/JS stand-in for the Rive file),
- one services strip with the real Lotties,
- each at desktop and mobile.

**Every direction must:**
- **Colour:** be led by a different colour family. None led by sky, cyan or teal.
- **Motif:** not be built on sea waves.
- **Typeface:** use a different Hebrew display face, from rendered specimens.
- **Layout and motion:** have a different layout idea, plus a one-line signature scroll moment.
- **Button:** have a different button idea, with no static line under the label.
- **Recognisability:** pass the stranger test. Put each hero next to a screenshot of today's hero; it must read as a different site.
- **Reflexes:** check the palette and type against pattern-breaker's `references/reflexes.md`. A match needs a written concept reason.

Seeds (starting points; replace any with something better):
1. **חדר העריכה (the edit suite), cinematic and dark.** MediaWave edits video, so the page behaves like an editing timeline. A thin timecode ruler with a playhead tracks the scroll. Sections are clips with in and out marks. The services hold scrubs through six clips, and the Lotties play inside monitor frames. The button press is a "cut" that splices through the pill, and hover scrubs a playhead across it. Palette: graphite with warm off-white panels and one record-light signal colour (the concept reason). Type: a condensed bold Hebrew display plus mono timecode.
2. **פוסטר עברי (the Hebrew poster), bold colour fields.** Type used as image: giant Hebrew words fill the screen. Each act is a flat, full-bleed colour field that flips at the act boundary. A strict grid with no cards. The Lotties sit on white discs or plates. The button is a solid block with a tactile press that sinks into the field, and hover floods the fill from the pointer's side. Palette: 2-3 saturated non-blue colours plus ink.
3. **גלריה (the gallery), light, calm and premium.** White walls, generous margins. Services are hung like exhibits, with museum-style labels and the Lotties as the works. The scroll is slow and elegant, with one held "walk along the wall" moment. The button is a label-plate whose fill slides in from the reading side. Palette: gallery white plus one deep, non-blue accent. Type: a Hebrew serif display (the concept reason) with a clean text face.

Capture each one at 1440 and 390 with motion on and show them. Then ask **one** AskUserQuestion: which direction (mixing is allowed). **Stop until Nati answers.**

## 8. Step 2: build the chosen direction on the real site

Rebuild in place, section by section, in this order:
1. tokens and fonts
2. the hero (video kept)
3. the button family in Rive, replacing every CTA (header "בואו נדבר", hero, services, FAQ, contact submit, LeadModal)
4. the services signature hold
5. the other sections, with one move per section and never the same move in neighbouring sections; the intensity is bold (about 3 peaks, 2 holds that never touch)
6. the contact form companion (Rive, driven by the real form states)
7. the footer, 404 and inner pages (`/services/*`, `/blog`, `/portfolio/*`) on the new tokens

After each section: `npm run build` passes, screenshot it at 1440 and 390 and look at it, fix, commit. At the end, update DESIGN.md, PRODUCT.md, the CLAUDE.md status, DECISIONS (#50+) and `.context/HANDOFF.md`.

## 9. Done means

Run the pattern-breaker scripts; don't reinvent them:
- `C:/Users/User/.claude/skills/pattern-breaker/scripts/serve.mjs`
- `scroll-film.mjs`
- `motion-audit.mjs`
- `gates.mjs`
- `slop-scan.mjs`
- `preserve.mjs`
- plus the project gates `.gsd/temp/contrast-audit.mjs` and `.gsd/temp/verify-a11y-round.mjs`. Update their expected colours if the palette changes.

Pass criteria:
- **Build:** `npm run build` is clean.
- **Accessibility:** axe and contrast both at 0; a11y round green.
- **Layout:** no horizontal overflow from 320 to 1440; no console errors.
- **Performance:**
  - mobile Lighthouse median of 3 on `/`, `/services/building-websites` and `/blog`: LCP and TBT no more than 10% worse than `../mw-baseline`
  - CLS 0.05 or less during scroll
  - desktop 95 or above
- **Pattern-breaker scores:** slop-scan 40 or less; the preservation diff shows only intended changes; motion-audit shows at least 2 peaks and no FAQ-style all-fade zone.
- **Rive:** every Rive state is captured on desktop and phone, with no splash.
- **Nati's phone check:** `npm run dev -- --host`, then on his phone `http://192.168.0.31:5173` (same Wi-Fi).
- **Gate 2:** deploy only on Nati's explicit OK. Push to main only through the `mediawave-dev` account. Never switch gh accounts yourself.
