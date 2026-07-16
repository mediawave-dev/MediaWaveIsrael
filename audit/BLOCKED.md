# BLOCKED — the §5 gate verdict (2026-07-17)

Per the brief's §5.4: two gates are red on the preview deployment, so **nothing was
merged and production is untouched**. Everything below is measured; raw output in
`audit/raw/gate-preview/` and `audit/raw/gate-preview-v2/`.

**The branch is finished, tested, and one click from shipping:**
https://github.com/mediawave-dev/MediaWaveIsrael/pull/new/upgrade/fable-20260712
(or: `git checkout main && git merge upgrade/fable-20260712 && git push origin main`
from the mediawave-dev account). Rollback if ever needed:
`git push origin 299cb88:main --force-with-lease` (production tip before this run),
or the Cloudflare Pages dashboard → Deployments → Rollback.

## Gate scoreboard — production today vs the preview build

| Gate | Production (before) | Preview (this branch) | Verdict |
|---|---|---|---|
| G1 content without JS | FAIL — 13 FAQ answers absent from HTML | 21/21 routes full content; 13/13 FAQ Q&A in body; all service FAQs in body | **GREEN** |
| G2 AI crawlers | FAIL — all 6 bots get 403 from Cloudflare's zone setting | 0/126 checks blocked; robots.txt clean | **GREEN on the site itself.** Production stays red until you flip the Cloudflare toggle (PROPOSALS #1) — no repo change can do it. |
| G3 Lighthouse mobile | perf 41–75 · a11y 94–96 · BP 96–100 · SEO 66–92 | perf 81–98 · **a11y 100 (21/21)** · **BP 100 (21/21)** · **SEO 100 (21/21, excluding only Cloudflare's preview-noindex header)** | **RED on perf ≥95** (3/21 routes pass; home 81) — see "why perf is red" below |
| G4 lab CWV | LCP 4.3–5.4s · CLS up to 0.53 · TBT up to 6,160ms | LCP 1.8–4.2s · **CLS ≤0.014 (21/21)** · **TBT ≤116ms median (21/21)** | **RED on LCP ≤2.0s** (1/21 passes; most 3.0–3.5s) |
| G5 real accessibility | 22 axe-serious + focus/announce defects | **0 axe violations at any severity across 14 scans** incl. open chat/modal/menu states; every verifier finding fixed and re-verified live (honest form errors, contained chat focus, Escape focus-returns, Hebrew noValidate errors, live-region chat) | **GREEN** |
| G6 structured data | gaps (no breadcrumbs on 5 templates) | 21/21 routes complete and parse-valid: LocalBusiness (real phone/hours/area), Service+FAQPage per service, BlogPosting+Breadcrumb per post, breadcrumbs everywhere | **GREEN** |
| G7 Hebrew/RTL | minor issues | verifier PASS: dir isolation, aria-hidden duplicates, sr-only alternatives, punctuation | **GREEN** |
| G8 no regressions | — | tsc 0 errors · eslint 0 errors · build+prerender 21 pages + 404.html · entry chunk +980 bytes raw (tracking util) while initial-load JS shrank by ~100KB+ (modulepreloads removed, widgets deferred, 5MB Sanity leak fixed) · before/after screenshots visually identical except the intended underline | **GREEN** |
| G9 nothing broken | soft-404s; conflicting canonicals sitewide | real HTTP 404; single correct canonical on 21/21; 0 broken links of 131; sitemap exact; console clean (one unreproducible transient 404 on one crawl) | **GREEN** |
| G10 measurable | 0 of 20 paths tracked | **37 distinct tracked call sites** covering every WhatsApp/tel/mailto/form/chat/share path incl. error-alert recovery links; /api/event live (204/400 validation verified) | **GREEN** (durable sink = your 10-minute decision, PROPOSALS #3) |

## Why perf/LCP are red — and why no code change I'm permitted can fix them

The remaining LCP is not JavaScript. Measured floor: **the pure static page with all
JavaScript removed still sims at LCP 2.49s** (audit/raw/diag/lh-w2 experiment) under
the gate's own measurement (Lighthouse mobile, simulated throttling). The floor is:

1. **TTFB ~620–640ms** on every route (Cloudflare Pages HTML is not edge-cached).
   A third of the 2.0s budget is gone before the first byte of HTML.
2. **~140KB of brand fonts before first paint** (EFT Betaamango + EFT OffSet + Heebo
   Hebrew + Outfit Latin subsets). They are preloaded deliberately: un-preloading them
   brings back the measured font-swap layout shift (CLS 0.127) and a late LCP re-emit.
   At the gate's 1.6Mbps that's ~700ms.
3. **First-frame render of the page** (~0.5–1.0s at the gate's 4× CPU throttle).
4. On `/services/*` the LCP element is the **animated Lottie hero icon** itself —
   structurally chained to React + a 170–600KB JSON fetch (LCP 4.2s on seo-promotion).

What this run already removed: the React remount race (paint-first mount), the Google
Fonts paint-hold (~1s), the 0.50 CLS bug, the 6-second TBT page, a 5MB chunk leaking
onto every page. Perf went 41–75 → 81–98 and every non-perf Lighthouse category is
now 100. The rest is a **product decision, not an engineering defect**:

- **Fonts**: fewer/lighter faces above the fold (e.g. drop the Outfit preloads and/or
  Betaamango from the critical path, accept fallback-first rendering) — worth ~0.3–0.5s
  LCP, at a brand-typography cost only you can approve.
- **Service-page heroes**: static-first icon (like memory-videos' SVG) with the Lottie
  animating in after load — makes the LCP a static image at ~1.5s. Changes the first
  impression you deliberately designed.
- **TTFB**: edge-cache the HTML (Cache-Control + cache rules on the zone) — worth
  ~0.4–0.5s on every route, needs a freshness policy decision.
- Or **recalibrate G3/G4** to what the architecture honestly supports today
  (perf ≥85 and LCP ≤2.5s lab would be green across the board except seo-promotion) —
  for reference, real headed-Chrome measurement of this build: LCP ~1.1–1.7s.

## What I need from you (in one sitting)

1. Merge decision on the branch as-is (everything above the perf line is strictly
   better than production; production today has the broken canonicals and the false
   AI-crawler promise).
2. The Cloudflare AI-crawler toggle (PROPOSALS #1) — without it G2 stays red on
   production no matter what ships.
3. A pick from the perf menu above (fonts / hero / TTFB / recalibrate), if you want
   G3/G4 green rather than just dramatically better.
