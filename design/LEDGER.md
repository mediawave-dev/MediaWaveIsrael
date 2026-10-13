# LEDGER - MediaWave "a different Wave" (pattern-breaker upgrade + rive-studio)

Brief: .context/REDESIGN-PROMPT.md (2026-10-12) + the three-looks prompt (2026-10-13, Gate 1 decided: K + M). Decisions live in DECISIONS.rtl.md (#47+). Concept: design/CONCEPT.md. Score: design/SCROLL-SCORE.md.

## Open
- [ ] **STOP 1 (owner: Nati):** K, M or KM, and what to change. Films + screenshots of the three looks side by side
- [ ] Copy marked [קופי: נתי]: hero sub line, six service lines, "נשלח. נחזור אליכם היום", "שש הכרזות קטנות.", "שישה כלים מרחפים. גוללים, וטסים לתוך כל אחד.", "הכירו את / האתר שלכם", "ארבעה צעדים / מהשיחה ועד ההשקה", "מתחילים פרויקט" (was "התחל פרויקט")
- [ ] Step 3 (chosen look): WhyUs, before/after, process (K/M), FAQ, giant word, contact + Rive companion, 404, inner pages on the new tokens; legacy widgets (cookie banner, chat FAB, a11y panel) on the look's tokens
- [ ] Step 4: gates.mjs, slop-scan (≤ 40), preserve diff, contrast + a11y rounds, Lighthouse mobile median of 3 vs ../mw-baseline, overlap-audit 0, console 0, no overflow 320-1440, impeccable pass, one critic agent
- [ ] STOP 2 (owner: Nati): deploy only with his OK, only through mediawave-dev
- [ ] Before public use: direction I (album, board only) uses the family's photos from memory-video.mp4: needs the family's consent

## Done
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

## Verification log
- 2026-10-13 tsc clean; build:k, build:m, build:km clean (prerender 21 pages each)
- 2026-10-13 mobile video: plays hero-bg-m.mp4 at 390 in K/M/KM, hero-bg.mp4 at 1440; nothing loads under OS reduce; ?motion=full overrides
- 2026-10-13 overlap audit run 1: 48 counted (KM process copy vs the chat button at 320 while the cookie banner lifts it; flight captions vs the cookie card at 1024; H1 vs the accessibility tab at 320) → fixed with --safe-b, captions on top, H1 size under 360 px
