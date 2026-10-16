# LEDGER - MediaWave "a different Wave" (pattern-breaker upgrade + rive-studio)

Brief: .context/REDESIGN-PROMPT.md (2026-10-12) + the three-looks prompt (2026-10-13, Gate 1 decided: K + M). Decisions live in DECISIONS.rtl.md (#47+). Concept: design/CONCEPT.md. Score: design/SCROLL-SCORE.md.

## Open
- [ ] Mobile scroll under 4x CPU: more long tasks than the old site (Lottie building in the two holds); load metrics are better than the old site
- [ ] After deploy: preservation diff against the live site (environment differences cancel), console check on production (wasm MIME from _headers)
- [ ] Deploy (Nati's OK given 2026-10-13 for "when everything is done", through mediawave-dev; switching gh account allowed then). Rollback ready: tag prod-before-looks = 58cf21f, scripts/rollback-prod.cmd
- [ ] Before public use: direction I (album, board only) uses the family's photos from memory-video.mp4: needs the family's consent

## Done
- [x] Klein palette (#58), fonts (#59), before/after removed (#57), two generic lines removed, bubble tail, geresh, anchor focus, popup never interrupts typing (2026-10-13)
- [x] Step 4 checks (2026-10-13): overlap 0 (KM, 5 widths); gates: axe 0, overflow 0, no-JS 196 %, forms OK; Lighthouse mobile median 96 / LCP 2.39 s / TBT 50 ms / CLS 0.006 (live site 89 / 3.58 s / 34 ms / 0.016; July baseline 81 / 4.17 s / 116 ms); desktop 100 x4; contrast 0 failures; slop (built site) 25
- [x] Nati's instruction (2026-10-13): implement everything and deploy through mediawave-dev (STOP 2 waived)
- [x] STOP 1 (#54, #55): Nati chose KM "launch night", a Rive character for the contact form, and approved the marked copy as is (2026-10-13)
- [x] Step 3 (KM, shared by all looks): WhyUs, before/after, process line (K/M), FAQ (13 FAQs in src/data/faqs.ts), giant word, contact with the look's button; LeadModal on the look's tokens and button; cookie banner, chat FAB and a11y panel on the look (no backdrop-filter); 404 and inner pages on the tokens (legacy remap scope); Lottie `load` gating (holds build only the active ±1)
- [x] Rive contact companion (#56): the hero's laptop writes the message, folds it into the horizon while sending, fills into the mark when sent; design/rive/MOTION-BRIEF.md + companion/CONTRACT.md; canvas-lite 2.43.1, lazy after load + idle + near
- [x] Gate 1: Nati chose K (keynote launch, D-01) + M (floating objects, D-03), to be compared as K / M / KM (2026-10-13)
- [x] Look system (#50): VITE_LOOK via Vite modes (.env.look-*, build:k|m|km → dist-k|m|km, plain build = KM), data-look in the HTML via transformIndexHtml, dev ?look= override, @look/registry + @look/button aliases so each build ships only its own look (verified: no M/KM scene code in dist-k, no K code in dist-m, no product button in dist-km)
- [x] Tokens for the three looks in src/look/looks.css; fonts Assistant 200/400/600 + Alef 400/700 via @fontsource (hebrew + latin), metric-matched fallbacks (font-fallback.mjs, no rewrap); Heebo/Outfit/EFT removed; Assistant 200 Hebrew (4 KB) inlined in CSS, Alef 700 preloaded in M by prerender.mjs
- [x] Header + footer for all looks (sticky, --head, the look's button, KM theme layers inside the header, mobile sheet menu with engine lock)
- [x] Button families with seven states: K product button (tilt + press), M lens (blend on the disc's track, press fills), KM lens + calm tilt; /states?look= (dev only) shows all seven
- [x] Heroes: K/KM stage (H1, line, button, laptop playing the video, scrubbed lean), M void (copy at the start side, video on a floating screen among six tools, bob + depth drift)
- [x] Holds: LaunchHold (K services, KM process), FlightHold (M + KM services), sticky stages, transform/opacity only, only the on-stage Lottie plays (LottieIcon `active`), keyboard focus scrolls the hold to its item, list layout as the reduced / no-JS last frame
- [x] KM theme flip (T-01): fixed layers crossfade, body class flips text instantly, sections declare data-theme
- [x] Hero video on phones (#51, Nati's request): hero-bg-m.mp4 640 px 189 KB, after load + idle, not with Data Saver; poster srcset (17 KB on phones)
- [x] scripts/overlap-audit.mjs (zones text/art/ui, 5 widths, 2 % page steps, 5 % hold steps)
- [x] Earlier: W0 engine (46da290), style board (544fef5 … c4b6b9c), baseline slop 96, preservation snapshot
- [x] Horizon logo (#52): Logo.tsx from logos/horizon (verbatim paths), 4 variants, --logo-* per look, header compact 26/24, footer horizontal, 404 mark, boards K/M, favicons ?v=4, icon-512, og-image stacked, schema logo; unreferenced old files removed
- [x] Logo ident (#53): drop → disc → slosh → name rise → droplet onto the i; header once per visit (pre-paint gate in index.html), footer sign-off scrubbed by scroll, living horizon; engine refreshes on page-height change
- [x] Merged production main 58cf21f (blog removed, a11y + iOS fixes) as 60521ce; holds regained the portfolio link

## Verification log
- 2026-10-13 Rive companion: `rive --verify` clean, `inspect` 0 problems, probe "the file matches" the contract (canvas-lite 2.43.1); live page on desktop, phone, CALM, success and failure (request intercepted, never sent): every state renders, console clean except the dev server's missing /api/event (analytics function exists only on Cloudflare); CSS rest pose vs Rive idle frame identical within 1-3 colour levels (edges only); runtime chunk dynamic only (rive.js 49.8 KB gzip + wasm 365 KB gzip)
- 2026-10-13 tsc clean; build:k, build:m, build:km clean (prerender 21 pages each)
- 2026-10-13 mobile video: plays hero-bg-m.mp4 at 390 in K/M/KM, hero-bg.mp4 at 1440; nothing loads under OS reduce; ?motion=full overrides
- 2026-10-13 overlap audit run 2: 0 counted (3 looks x 320/390/768/1024/1440, 2 % page steps, 5 % hold steps)
- 2026-10-13 logo: header 214x26 / 198x24, footer sign-off scrubbed 1:1, ident ends exactly on the design (all transforms cleared), favicon light/dark verified; builds clean
- 2026-10-13 overlap audit run 1: 48 counted (KM process copy vs the chat button at 320 while the cookie banner lifts it; flight captions vs the cookie card at 1024; H1 vs the accessibility tab at 320) → fixed with --safe-b, captions on top, H1 size under 360 px

## site-director round (2026-10-15): direction C "link to live", D65-D80

### Open
- [x] Stage 2 gate (2026-10-15, Nati): round-1 ideas rejected, palette kept (D81, D82). Second round: four directions on design/ideas/directions-v2.html; Nati chose C "one shot", mobile first (D83, D84).
- [ ] /proto-c (dev only): mobile-first prototype of "one shot": hero dive, steps on landing sheets, pull-back into a phone. Waiting for Nati's reaction.
- [ ] Critic M1 high: the persistent phone "never leaves the screen" contradicts 2 holds / 33% held. Plan: the phone scrolls away between two holds; recompute the held share.
- [ ] Critic M1 high: CONCEPT puts hold 2 on measure > launch, the storyboard on build. Plan: hold measure > launch (the peak); build becomes free-scroll cuts.
- [ ] Critic M1 high: the 96 (this site, 13.10 build) was shown inside a "client" phone, and the gauge staged a red phase. Fixed in /proto: the phone shows mediawave.co.il, the arc fills in ink and turns green only at the real value.
- [ ] Critic M1 high: build cycles six services and 13 Lotties through one client's phone. Plan: build shows one site's sections appearing; the Lotties stay (sacred) as illustrations beside the steps, not as proof; video and tape get their own short proof outside the phone.
- [ ] Critic M1 high: no real client site is confirmed for the phone. Needs Nati: which client sites may be shown.
- [ ] Critic M1 high: the concept repeats lab/prior.md almost item by item. Plan: list the prior hits in the reflex check with brief-specific reasons; report the count to Nati.
- [ ] Critic M1 medium: dead tail 8.5-12 vp; ident placement differs between CONCEPT and storyboard (budget 4/3); CTA and WhatsApp button colour unstated; timecode reason (D76) partly false; motif mixes load bar and playhead; mobile object invisible. Plan: contact closes the loop (the hero's link returns as the WhatsApp link), ident folded into the hero load (3/3), CTA and WhatsApp in ink, fixed story timecodes or none, one meaning for the address line, design 390 first.

### Done
- [x] /proto (dev only): hero narrowing 1392 > 390 on the engine's hold, slider handle (role=slider, keys and drag move the scroll), measure chapter with honest proof; shots design/shots/proto-v1 (1440x900, 1440x700, 390, motion + reduced), 0 page errors (2026-10-15)
- [x] Smart lead popup on intent (D79), commit 6bc7ac2 (2026-10-15)

## shot · QA round (2026-10-16)

### Done
- [x] Overlap audit shot: 0 counted at 320/390/768/1024/1440 (114 positions each, holds dive/build/pullback; 40-79 passing per width, so the zones are present). Before and after the fixes below.
- [x] Gates on the build (dist-shot): axe 0 at 390 and 1440; overflow 0 at 320-1440; no-JS shows the page (H1 visible); forms OK. Two expected false positives: /api/event 404 (the analytics Pages Function does not exist under vite preview) and the "#main-content" anchor (it sits at y 0; the 32px is the H1 inside the dive's overview pose).
- [x] CLS 0.154 -> 0.0007 at 390 / 4x CPU / 1.6 Mbps: a phone zoomed the page out to 520px because the desk objects showed at their natural size before the chapters' own stylesheets arrived; fixed with overflow-x: clip on the root (a clip on main or on each chapter did not help); every chapter is now the containing block of its art (an ink line drew full height over the hero); the hero fills the first view before boot; the sub's width in rem (ch changed with the font swap). body.mw-consent-open no longer freezes into the prerender (CookieConsent skips under __PRERENDER__).
- [x] LCP element is the H1 (was the lens poster): the H1's two lines are one block with <br> (one 33k px² candidate instead of two 22k ones that lost to the 25k poster).
- [x] Lighthouse TBT 2.6 s -> 0.30 s: the lens's Rive no longer loads and plays its opening right after load (D88: on the first interaction); chapter scenes below the first view are built when within 1.5 viewports (src/look/shot/near.ts; ?at= still builds everything for the QA hooks).
- [x] camera.ts land()/setDown measured transform-free (docTop/landRange/exitRange): a refresh mid-landing had moved starts by ~28px and exits by ~370px.
- [x] Lotties: rest on their finished frame until they first play (draw-on files were empty at frame 0); under ?reduce=1 every Lottie is frozen (they all played before); no <video> element under ?reduce=1; the contact form's 4.2 s reset timer is cleared on a new send.
- [x] Fallback heights re-measured (390 and 1440x900).

### Measured (same machine, alternating runs, the side pane on a static page)
| | shot | KM |
|---|---|---|
| Lighthouse mobile, median of 5 | 67 (LCP 4.86 s sim, TBT 302 ms, CLS 0) | 73 (LCP 4.72 s sim, TBT 333 ms, CLS 0.006) |
| Lighthouse, reduced motion, median of 3 | 64 (TBT 382 ms) | 69 (TBT 636 ms) |
| rum.mjs (real Chrome, 390, 4x CPU, slow 4G), median of 3 | LCP 2.34 s (H1), CLS 0.000, blocking 1.30 s | LCP 2.19 s (image), CLS 0.005, blocking 1.21 s |
Lighthouse on this machine is noisy (the same build gave TBT 0.26-3.4 s across runs while the pane played video); only alternating, same-session runs compare. The 96 in HANDOFF was another day's conditions.

### Open
- [ ] Real-world Lighthouse: PageSpeed Insights on a Cloudflare preview deploy (needs Nati's OK for a preview deploy).
- [ ] D88 (lens without the load-time opening) needs Nati's OK.

## shot · impeccable audit and the critic fixes (2026-10-16)

Report: design/audit/impeccable/AUDIT.rtl.md (14/20 before the fixes). Evidence: design/audit/impeccable/mobile-audit*.md (G:/tmp/mobile-audit.mjs: tap targets, text under 12px, sideways overflow, fixed layers, fields, headings, axe at 320/390/768 in both visit states).

### Done
- [x] P0 the lead dialog rendered inside the page (a block at the top of main, pushing the page ~400px down, the form cut mid-field, the menu able to open over it): the shot rule main > * { position: relative } also caught the fixed dialog. Now main > :is(section, .shot-bw).
- [x] P1 the --safe-b probe measured 0 under the same rule (an inline <i> ignores height): landings and the pull-back ignored the dock and the cookie strip. Fixed by the same change (the probe reads 64 / 104).
- [x] P1 critic #1, the hero overview at 390/768: the closed laptop, the cassette and the loupe lie whole in the table the overview shows (below 1100px they were past the stage edges, black wedges), the dive pushes them out of the frame (yPercent, measured on refresh), nothing is left at the release. The closed laptop is seen from above (rotateX -55, as in S4: +55 was a camera under the table) with the Horizon mark on its lid; at 1100+ its lid sits just past the stage bottom.
- [x] P2 the hero lens lies on the sheet edge again below 1100px (display: flow-root; the lens margin collapsed through the sheet, so the paper rose to the lens top).
- [x] P1 critic #5, the pull-back: its first frame is the phone screen at the real letter width, centred in the band above the dock line (it opened on the bezel and two screens of bare table).
- [x] D89 the menu (Nati, 16.10): five chapters in page order, the chapter in view marked (aria-current, an ink dot), WhatsApp in the foot; the desktop bar shows four. Fits 320x568.
- [x] Focus never hides under the dock or the strip: scroll-padding-bottom: var(--safe-b) (WCAG 2.4.11). The skip link in ink on paper (it was sky on sky ink, 3.4:1). The cookie strip privacy link has a 44px tap height. The key legend 12px. The two key-spring curves carry an impeccable-disable comment (D87).
- [x] Number ranges in the copy: 2 עד 3 שבועות and the like (faqs, services, Terms, the legacy FAQ), per the no-unnecessary-hyphen rule.
- [x] DESIGN.md now documents shot (it described KM; the detector flagged 27 colours and 3 fonts as undocumented).
- [x] False positives in the audit: the 41px and 35px hero link is 44px at rest (the overview pose scales it); the 43px service links are mid-landing; the FAQ questions already compute ink.

### Verified on the production build (npm run build, served by vite preview, 2026-10-16)
- Overlap audit: 0 counted at 320/390/768/1024/1440, 114 positions each (design/audit/shot-overlap-3).
- Gates: axe 0 at 390 and 1440, overflow 0 at 320-1440, no-JS shows the page (H1 visible), the form has a receiver and labels (design/audit/shot-gates-final). The two FAILs are the known false positives: /api/event 404 under vite preview, #main-content 5-32px apart because of the dive overview pose.
- Mobile audit after the fixes: axe 0, no text under 12px, no sideways overflow at 320 and 390 in both visit states; the menu fits 320x568 (design/audit/impeccable/mobile-audit-after-*.md).
- tsc 0; the build prerenders 11 pages with data-look="shot".

### Open
- [ ] Critic #11, desktop: the overview at 0.64 renders the sub and the CTA small; a larger pose needs the bottom props re-placed with an exit (as below 1100px).
- [ ] Critic #6 (the self-building site reads as a template), #7 (no ink spine through meet and choose), #8 (blank faces on some props), #12 (every paper surface is the same card): design work, for Nati.
- [ ] FAQ answers are centred (D61); a 4-line centred paragraph reads worse than start-aligned: Nati.
