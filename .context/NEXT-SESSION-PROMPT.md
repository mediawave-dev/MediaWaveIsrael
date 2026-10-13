# MediaWave: session prompt (written 2026-10-13, end of the "launch night" redesign session)

Start a fresh Claude Code session in `G:\Web-Dev\MediaWaveIsrael` and say: **"קרא את .context/NEXT-SESSION-PROMPT.md ועבוד לפיו"**. This file holds everything worth keeping from a very long session: what is live, how it is built, every correction Nati made (they are rules now), the skills and tools used, and what is still open. Read it fully before acting. Also read `CLAUDE.md`, `DESIGN.md` and the top of `.context/HANDOFF.md`.

---

## 0. First task: Claude Design and `/design-sync`

**Goal:** bring the live MediaWave design system into Claude Design, so Nati and his partner Moriah can design new pages, sections and variations there and hand them back to Claude Code.

1. Nati starts `/design-sync` (the skill; the `DesignSync` tool only runs inside it). Source: this local repo. Target: a new design-system project, for example "MediaWave · Launch night".
2. The design system must carry, from the real code (never invented):
   - **Tokens** from `src/look/looks.css`: stage `#00113D`, void (paper) `#FAFAF7`, Klein `#002FA7`, inks (`#FFFFFF` / `#A3AFD6` on the stage, `#0E1016` / `#4E5468` in the void), lines, `--lens` (`#D5DEFF` stage, `#2457E6` void), errors, focus rings. Contrast proof: `design/audit/klein-contrast.md`.
   - **Type:** headings = EFT Betaamango (Hebrew) + Outfit 500 (Latin and digits), body and UI = IBM Plex Sans Hebrew 400/600. Files in `public/fonts`. All of them may be uploaded to the Claude Design project: Nati confirmed on 2026-10-13 that the EFT files are free to use there, and Plex and Outfit are OFL.
   - **Logo:** Horizon, `logos/horizon` (all variants, dark and light palettes, rules in `logos/horizon/README.md`), React `src/components/ui/Logo.tsx`.
   - **Components:** the lens button and its seven states (`src/look/buttons/LensButton.tsx`, `/states?look=km` in dev), header, footer, section patterns (why-us screens, FAQ accordion, contact column with the form), the floating objects (`src/look/parts/Things.tsx`), the laptop (`src/look/parts/Laptop.tsx`), the stage screen.
   - **Rules:** Hebrew RTL, centered and symmetric composition, the brand rules below (section 3).
3. After the sync, render one sample page in Claude Design and check it with Nati on his phone: Hebrew, RTL, Klein palette, the right fonts, centered.
4. The way back: Export menu, "Handoff to Claude Code", "Send to local coding agent", or `/design` in Claude Code. Every design that comes back gets wired into the motion engine and passes the overlap audit, the gates and the contrast check before it ships.

Facts (support.claude.com "Get started with Claude Design", checked 2026-10-13): Claude Design is an Artifacts template, available in chats, in the Artifacts tab and in Claude Code (`/design`). The standalone claude.ai/design closes on 2026-12-14. No version history yet, and usage counts toward the plan's limits.

---

## 1. Project and live state

- **Business:** MediaWave, Nati's one-developer web studio for Hebrew-speaking small businesses (sites, landing pages, video editing, memory videos).
- **Repo:** `G:\Web-Dev\MediaWaveIsrael`, branch `design/pattern-break-20261012`. Production = `main` = `5ff210f`. The docs commits `4cd7936` (handoff) and the one that adds this file are **local only**: push them with the next deploy.
- **Hosting:** Cloudflare Pages builds `main` on every push (`npm run build`, look KM). Production: https://mediawave.co.il. Form endpoint (Google Apps Script) is set in Cloudflare's env; locally it is empty, so the form falls back to WhatsApp.
- **Deploy (only with Nati's OK each time unless he says otherwise):** `gh auth switch -u mediawave-dev`, then `git -c credential.helper= -c credential.helper='!gh auth git-credential' push origin design/pattern-break-20261012` and `... push origin design/pattern-break-20261012:main`. Afterwards switch back with `gh auth switch -u levy-n`. Never switch gh accounts without his OK.
- **Rollback:** `scripts\rollback-prod.cmd` (tag `prod-before-looks` = `58cf21f`, the site before the redesign) or Cloudflare dashboard → Deployments → "Rollback to this deployment".
- **Confirm a deploy** by the served asset hash, not only by the GitHub check run (the check run can be the branch preview): e.g. `curl -s https://mediawave.co.il/ | grep -o 'assets/WhyUs-[^"]*\.css'`, then `node scripts/qa/live-check.mjs`.

---

## 2. What is live (the design system)

Decisions are numbered in `DECISIONS.rtl.md`; this session added **#50-#61**.

- **One codebase, three looks** (#50): `npm run build:k | build:m | build:km` (dist-k/m/km); production is **KM, "launch night"** (#54): a Klein-night stage and a paper void alternate as you scroll (theme layers).
- **Palette "Klein"** (#58, choice 13 of the board https://claude.ai/artifact/S2mDmb29A4Lkqe4tznfCb3, chosen with Moriah). Buttons: white with Klein text on the stage, Klein with white text in the void. Floating objects: Klein bodies, white faces. The lens disc is a lighter tone under the label (a difference blend flashed yellow on Klein). `scripts/brand-palette.mjs` recolours every logo file and re-renders the icons from vector.
- **Fonts** (#59): see section 0. Composite families "MW Display" / "MW Text" with measured Arial fallbacks (`design/fonts/mw-*-fallback.css`, no rewrap). Betaamango's free edition has no geresh or gershayim: U+05F3-05F4 come from Plex 600 inside the display family.
- **Logo:** Horizon (#52), ident animation (#53, `src/components/ui/logo-motion.ts`): once per visit in the header, scrubbed by scroll in the footer.
- **Hero** (#60): the H1 "העסק שלכם / המומחיות שלנו", the line, the button, then the stage's big screen. On it a website builds itself (Rive: window, wireframe arriving from the right, paint in Klein, a cursor clicks the site's button); at the click the scene fires `reveal` and the **real hero film starts inside the built site's hero slot** (a DOM video placed exactly over the slot). Once per visit (`sessionStorage mw-hero-build`), starts at 60 % in view, the screen moves toward you as you scroll. Without JS, under reduced motion, on repeat visits or if Rive is late (4 s): the finished frame (inline SVG, same numbers) with the film. Files: `design/rive/hero/` (CONTRACT.md, `build-hero.mjs`), `src/look/parts/HeroBuild.tsx`, `npm run rive:hero`.
- **Sections in order:** Hero, Why us (three screens that switch on), Services (the flight hold: you fly into six floating tools), Process (the launch hold: a laptop opens and turns, one step per announcement), Testimonials (hidden until real ones exist), FAQ, the giant word "מתחילים?", Contact, Footer. Removed: before/after (#57).
- **Composition** (#61): everything centered and symmetric, including both holds at every width (object or laptop on top, the caption centered under it). Contact is one centered column.
- **Contact companion** (#56): the hero's laptop on the form writes the message as you type, folds it into the Horizon line while sending, fills into the mark when sent; red dot on error. `design/rive/companion/` (CONTRACT.md, `build-scene.mjs`), `npm run rive:companion`. Rive runtime `@rive-app/canvas-lite` 2.43.1, one lazy chunk and one wasm shared by both pieces (`_headers` serves `application/wasm`).
- **Lotties:** the 13 are sacred and unchanged. Every Lottie box now fills its frame exactly (a percentage height in a grid cell did not resolve: the art came out square, low and cut). They render at their own frame rate; the holds build theirs in idle slots before the scene.
- **Motion engine** `src/motion/` (GSAP ScrollTrigger, Lenis on desktop only). REDUCE (the a11y widget's stop switch, `?reduce=1`, prerender) = last frames; CALM (the OS flag) keeps scroll-driven scenes, drops autonomous motion. **Nati's Windows has reduced motion on**: preview with `?motion=full`.
- **Accessibility:** in-page links move focus to the section; the lead popup (opens at half the page) never opens while focus is on a link, button or field; axe 0; contrast 0 failures.
- **Measured** (2026-10-13): overlap audit 0 at 320/390/768/1024/1440; real-browser phone LCP 2.3 s (the H1) vs 2.9 s on the old site; desktop Lighthouse 100/100/100/100; desktop scroll p95 16.9 ms, jank 0.3 %, CLS 0; built-site slop index 25.

---

## 3. Nati's corrections from this session: these are rules

1. **Logic before wow.** He rejected the hero video inside a drawn laptop ("מחשבים ניידים בתוך מחשב... פחות מסתדר והגיוני"). Every visual metaphor must make literal sense.
2. **Center everything, symmetric** ("לא כתיב מהצד אלא ממורכז לאמצע... שהכל יהיה סימטרי ויפהפה"). He reviews on his phone first.
3. **Illustrations whole and centered in their frames**: never cropped, never sitting low. Check on a 390 px viewport.
4. **No generic copy.** Removed for being generic: "שישה כלים מרחפים. גוללים, וטסים לתוך כל אחד." and "מהרעיון ועד ההשקה: תהליך פשוט וברור". New lines are marked `[קופי: נתי]` until he approves; never invent proof, numbers or testimonials.
5. **The opening screen must impress**, and Rive is welcome where it earns its bytes; the hero film stays, its framing may change ("תשאיר את הסירטון בקונסטלציה כזו או אחרת").
6. **Colour:** no purple. Klein is the brand now.
7. **Fonts: show, don't guess.** Render 3-4 options on the real page as one image labelled A/B/C/D, then ask. Always include Bona Nova 400 (his favourite). Never: Varela Round (he calls it AI slop), Inter, Roboto, Arial, Fraunces, Frank Ruhl Libre; Heebo, Assistant and Rubik are reflex choices to avoid as the brand voice.
8. **Typography details matter:** the geresh sat wrong because the font lacked it; check ׳ ״ and digits whenever a face changes.
9. **Small geometry matters:** the chat bubble's tail poked past its frame; check shapes at phone size.
10. **Dashes:** only "-" in every output, chat included (no em dash, en dash or maqaf).
11. **Hebrew:** no letter-spacing, no italics, direction-bearing motion enters from the right, split by words or lines.
12. **Buttons:** no line under or inside a label at rest; hovers stay inside their element (no magnetic pull); hover-only underlines on links are fine.
13. **Accessibility settings never persist;** AA contrast is a gate.
14. **Work style:** direct, in Hebrew, no agent fleets, at most one critic agent; questions only at real decision points, as rendered options; commit after each verified step with explicit paths (never `git add .`: the repo has unrelated `.gsd/*` changes and root junk).

---

## 4. Skills used, and how

- **pattern-breaker** (upgrade mode, rebuild in place): concept, scroll score, holds as sticky stages, verification. Scripts at `C:/Users/User/.claude/skills/pattern-breaker/scripts/`: `serve.mjs`, `scroll-film.mjs`, `motion-audit.mjs --budget-cls 0.05`, `gates.mjs`, `slop-scan.mjs` (use `--url` on the built site; scanning `src` counts the dev-only board and dead legacy files), `preserve.mjs` (baseline `design/upgrade/baseline/preservation.json`, intended changes `design/upgrade/intended.json`), `font-fallback.mjs`, `lint-ask.mjs`.
- **rive-studio:** the CLI path (`C:\Users\User\.rive\bin\rive.exe`, 1.5.1, unsigned builds, no Luau, no `--publish`). Both pieces are generated from one set of numbers (RML + the static SVG rest frame), verified with `rive --verify`, `rive inspect --summary`, CLI screenshots per state, then `rive-probe.mjs --contract ... --renderer canvas-lite` (I fixed a bug in the probe's page template: a literal newline in a template string broke it). Brief and ledger: `design/rive/MOTION-BRIEF.md`.
- **anthropic-skills:nati-design-prefs:** the font and dash rules above.
- **Artifacts** (artifact-design): the 15-palette colour board.
- **Not run yet:** an impeccable pass and the one fresh critic agent.

---

## 5. Tools in the repo

- `npm run build` (KM to `dist`), `build:k|m|km` (to `dist-k|m|km`); if port 4173 is busy: `PRERENDER_PORT=4174`. Local static servers for the three looks were on 4175 (k), 4176 (m), 4177 (km) via pattern-breaker `serve.mjs`.
- `node scripts/overlap-audit.mjs --looks km=http://localhost:4177/ --out design/audit/overlap` (must report 0).
- `scripts/qa/` (added this session, see its README): `rum.mjs` (real-browser LCP/CLS/blocking on a throttled phone: trust it over Lighthouse's simulation, which swung wildly here), `live-check.mjs` (production: console, wasm MIME, companion, fonts), `page-shots.mjs`, `hero-build-film.mjs`, `companion-live.mjs` (intercepts the form request: never sends a real lead), `why-measure.mjs`, `trace-section.mjs`, `profile-scroll.mjs`, `layers.mjs`, `contrast-klein.py`, `font-specimens.mjs`, `text-specimens.mjs`, `lh3.sh` (Lighthouse 13.5 in `G:\tmp\lh`).
- Brand and assets: `node scripts/brand-palette.mjs`, `npm run generate:favicons`, `npm run generate:og`, `npm run rive:companion`, `npm run rive:hero`.

---

## 6. Gotchas that cost time this session

- **C: drive fills to 0** (twice). Run node and puppeteer with `TEMP=G:\tmp\temp TMP=G:\tmp\temp`, npm with `npm_config_cache=G:\tmp\npm-cache`; puppeteer leaves ~40 MB profiles in `%LOCALAPPDATA%\Temp` (`puppeteer_dev_chrome_profile-*`, safe to delete when no test runs). A full disk truncated a file to 0 bytes mid-edit.
- Headless Chrome reports `prefers-reduced-motion: reduce`: emulate `no-preference` in every capture.
- Puppeteer `clip` with `captureBeyondViewport: false` takes document coordinates (add `scrollY`).
- The lead popup opens at half the page and steals focus in tests: set `sessionStorage.leadModalClosed = 'true'` before load.
- Prerender: `main.tsx` uses `createRoot`, which wipes the prerendered DOM and re-renders. Keep the H1 the LCP (inline SVG is never an LCP candidate; an `<img>` is). Only the entry stylesheet blocks the first paint; section CSS loads `media="print"` and swaps on load, with a `<noscript>` copy.
- The local `serve.mjs` serves `.wasm` without `application/wasm` (a console error locally only; production is fine).
- Shell: Git Bash heredocs with quotes broke several times; write Python or JS edit scripts to files instead. Nati's global rule: Windows-compatible commands.

---

## 7. Open items, in order

1. `/design-sync` (section 0).
2. Push `4cd7936` and the commit adding this file with the next approved deploy.
3. **Phone scroll in the two holds** under 4x CPU still blocks more than the old site (about 13-14 s of long tasks vs 6.8 s; desktop is perfect). Ideas: the canvas renderer for the heaviest Lotties on phones, fewer objects in the flight, lighter hold transitions.
4. **Inner pages** (`/services/*`, `/portfolio/*`, legal) still use the legacy layout remapped to Klein: not yet centered or rebuilt in the new system.
5. FAQ questions are in the seller's voice ("האם..."): propose customer-voice rewrites, Nati approves.
6. The impeccable pass and one fresh critic agent on the live site.
7. Re-verify the K and M comparison looks after Klein and centering (they share tokens but were not filmed).
8. Testimonials stay hidden until real, owner-confirmed ones exist. The board's album direction (dev only) uses family photos: needs their consent before any public use.
9. Keep `DECISIONS.rtl.md` (#62+), `design/LEDGER.md`, `.context/HANDOFF.md` and `DESIGN.md` current.

---

## 8. Where things are

| Path | What |
|---|---|
| `src/look/looks.css` | tokens, fonts, header, footer, theme layers, legacy remap |
| `src/look/scenes/` | HeroStage, FlightHold, LaunchHold (+ `idle-warm.ts`) |
| `src/look/sections/` | WhyUs, Faq, BigWord, Contact, ProcessLaunch, ServicesFlight |
| `src/look/parts/` | HeroBuild, HeroMedia, Companion, Laptop, Things, Art (+ the .riv files and rest frames) |
| `src/look/buttons/` | LensButton (KM, M), ProductButton (K), StateButton |
| `src/components/ui/` | Logo, logo-motion, AnimatedLogo, LottieIcon |
| `src/motion/` | the scroll engine and its provider |
| `design/rive/` | MOTION-BRIEF.md, `companion/`, `hero/` |
| `design/` | CONCEPT.md, SCROLL-SCORE.md, LEDGER.md, audit/, upgrade/, fonts/, logo-colours.html |
| `logos/horizon/` | the logo files and the partners' README |
| `DECISIONS.rtl.md`, `DESIGN.md`, `CLAUDE.md`, `.context/HANDOFF.md` | decisions, design system, project rules, session log |
