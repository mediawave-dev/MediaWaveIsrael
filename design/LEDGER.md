# LEDGER - MediaWave "a different Wave" (pattern-breaker upgrade + rive-studio)

Plan: C:/Users/User/.claude/plans/parsed-splashing-tarjan.md. Decisions live in DECISIONS.rtl.md (#47+).

## Open
- [ ] Stage 1 lab: three demos (/lab/a,b,c) built and verified by workflow wf_a245e4c3-da0
- [ ] Gate 1 (Nati): direction + button personality
- [ ] W1 hero + Rive button family (Rive CLI 1.5.1 installed, unsigned builds, no Luau)
- [ ] W2 signature hold (services)
- [ ] W3 story: second hold, WhyUs, FAQ, act flip, dividers
- [ ] W4 contact companion (Rive), giant word, copy track [קופי: נתי]
- [ ] Final verification set + critic x2 + Lighthouse A/B vs ../mw-baseline (quiet machine)
- [ ] Gate 2 (Nati): production deploy via mediawave-dev

## Done
- [x] Intake round (2026-10-12): sacred = hero video; Lotties stay; Rive in buttons + earned scenes; palette/copy/dividers may change
- [x] Short research: Awwwards SOTY 2025 Lando Norris (motif as reactive surface), Ocean School water buttons
- [x] W0 foundation: engine in src/motion (CALM policy, #47), ScrollEngineProvider replaces ScrollToTop, prerender sets __PRERENDER__, motion-engine chunk, Marquee removed (#48), Testimonials unmounted while empty, Services Lottie renderer bug (#49)
- [x] Baseline: slop-scan 96 (design/upgrade/baseline/slop-scan.md), preservation snapshot of live site (11 URLs)
- [x] Smoke: engine on /, /services/*, /blog, /accessibility: no errors; #faq lands at 90px with and without Lenis

## Verification log
- 2026-10-12 engine smoke (reduce emulated + ?motion=full): 0 console errors, anchors OK
