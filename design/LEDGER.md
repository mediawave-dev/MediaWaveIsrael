# LEDGER - MediaWave "a different Wave" (pattern-breaker upgrade + rive-studio)

Brief: .context/REDESIGN-PROMPT.md (2026-10-12) + the three-looks prompt (2026-10-13, Gate 1 decided: K + M). Decisions live in DECISIONS.rtl.md (#47+). Concept: design/CONCEPT.md. Score: design/SCROLL-SCORE.md.

## Open
- [ ] Step 4: gates.mjs, slop-scan (≤ 40), preserve diff, contrast + a11y rounds, Lighthouse mobile median of 3 vs ../mw-baseline, overlap-audit 0, console 0, no overflow 320-1440, mobile scroll smoothness vs production, impeccable pass, one critic agent (also scores the Rive companion)
- [ ] STOP 2 (owner: Nati) after step 4
- [ ] Deploy (Nati's OK given 2026-10-13 for "when everything is done", through mediawave-dev; switching gh account allowed then). Rollback ready: tag prod-before-looks = 58cf21f, scripts/rollback-prod.cmd
- [ ] Before public use: direction I (album, board only) uses the family's photos from memory-video.mp4: needs the family's consent

## Done
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
