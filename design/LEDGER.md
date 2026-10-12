# LEDGER - MediaWave "a different Wave" (pattern-breaker upgrade + rive-studio)

Brief: .context/REDESIGN-PROMPT.md (2026-10-12, supersedes the sky/wave plan). Decisions live in DECISIONS.rtl.md (#47+).

## Open
- [ ] Gate 1 (Nati + Moriah, owner: Nati): pick a direction on /board (mixing allowed). Branch must be pushed first so Moriah can run it (needs `gh auth switch -u mediawave-dev` by Nati)
- [ ] Copy marked [קופי: נתי] on the board: hero sub line, six service lines, sent label "נחזור אליכם היום"
- [ ] W1 hero + Rive button family (Rive CLI 1.5.1 installed, unsigned builds, no Luau)
- [ ] W2 signature hold (services)
- [ ] W3 story: second hold, WhyUs, FAQ, act flip, dividers
- [ ] W4 contact companion (Rive), giant word, copy track [קופי: נתי]
- [ ] Final verification set + critic x2 + Lighthouse A/B vs ../mw-baseline (quiet machine)
- [ ] Gate 2 (Nati): production deploy via mediawave-dev

## Done
- [x] Rejected sky-palette lab deleted; W0 committed 46da290
- [x] Style board /board (dev only) committed 544fef5: A edit suite (Noto Sans Hebrew ExtraCondensed, graphite + tally red), B Hebrew poster (Karantina, saffron/magenta/green), C gallery (Bona Nova, white cube + salon red). Each: real hero + video rules, button family with 7 states, services signature moment with the real Lotties. Fonts OFL via @fontsource.
- [x] Intake round (2026-10-12): sacred = hero video; Lotties stay; Rive in buttons + earned scenes; palette/copy/dividers may change
- [x] Short research: Awwwards SOTY 2025 Lando Norris (motif as reactive surface), Ocean School water buttons
- [x] W0 foundation: engine in src/motion (CALM policy, #47), ScrollEngineProvider replaces ScrollToTop, prerender sets __PRERENDER__, motion-engine chunk, Marquee removed (#48), Testimonials unmounted while empty, Services Lottie renderer bug (#49)
- [x] Baseline: slop-scan 96 (design/upgrade/baseline/slop-scan.md), preservation snapshot of live site (11 URLs)
- [x] Smoke: engine on /, /services/*, /blog, /accessibility: no errors; #faq lands at 90px with and without Lenis

## Verification log
- 2026-10-12 board: /board, /a, /b, /c at 1440 and 390 with motion on: 0 console errors, 0 horizontal overflow; tsc clean; npm run build clean and dist has no board code
- 2026-10-12 engine smoke (reduce emulated + ?motion=full): 0 console errors, anchors OK
