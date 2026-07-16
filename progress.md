# Progress log — upgrade/fable-20260712

## 2026-07-12

- **Phase 0 complete.** Baseline of production written to `audit/BASELINE.md`
  (8-agent measurement fleet; raw output in `audit/raw/`). Headline: Cloudflare
  blocks all six AI crawlers with 403 at the edge (owner-only fix → PROPOSALS #1);
  perf 41–75 mobile; conflicting canonicals sitewide; FAQ answers missing from HTML;
  zero conversion tracking.
- **Phase 1 complete.** `task_plan.md` + `PROPOSALS.md` (9 items) written.
- Diagnosis workflow launched for the three perf mysteries (blog CLS 0.5 cluster,
  LCP ~86% render-delay despite prerendered HTML, video-editing TBT 6160 ms outlier).
- `5de5dd2` fix(seo): removed template-level canonical/OG/description duplicates —
  verified live that every inner page served the homepage description + og:title
  FIRST; helmet owns all of it per-route.
- `4519f74` fix(seo): homepage FAQ answers now always mounted (collapsed via
  height) — prerendered HTML previously contained questions only.
- `242ce96` fix(a11y): cookie-banner privacy link gets a static underline (the
  single axe violation, present on all 22 pages) + footer h4→h2 heading order.
  Note: static underline deviates from the "no static underlines" taste rule —
  WCAG 1.4.1 requires a non-color cue for links inside running text; scoped to
  this one in-text link only.
- `7f9a0ba` fix(a11y): ChatWidget focus-return on close; AccessibilityWidget Tab trap.
- `fb8155c` fix(a11y): per-field aria-invalid/aria-describedby error wiring
  (Input/Textarea + Contact + LeadModal).
- `3605af4` fix(a11y): both background videos now stop when the site's own
  animation toggle is off (WCAG 2.2.2 pause mechanism); typewriter line gained a
  static sr-only sentence (was reading half-typed words + a literal "|").
- `dabf03a` chore: eslint scoped to site code (13 pre-existing errors were all in
  `.claude/` skill templates); `_headers` gained HSTS + Permissions-Policy.

## Perf round (after diagnosis)
- Root causes nailed by measurement (see audit/raw/diag/): (1) Google Fonts
  media=print trick held first paint ~1s; (2) createRoot raced and beat the
  first frame, chaining FCP/LCP to the whole JS graph; (3) the 50vh page
  fallback caused the exact-0.50 blog CLS; (4) an unpinned lottie-web import
  hoisted into the 5MB Sanity chunk (10s compile task on every page);
  (5) the "Web Design Illustration" lottie (356 paths) burned 25-54s TBT on
  /services/video-editing via SVG per-frame layout.
- `68d8e09` fonts self-hosted + display:optional; `90e82b5` paint-first mount
  + startTransition; `ef6a43f` hero entrance-skip on prerendered loads;
  `11e8a90` 120vh page fallback; `f37eae7` widgets after idle + lottie-web pin;
  `44a0eb6` canvas renderer for the pathological animation.
- Local (gzip static server, LH mobile simulated): home 69→88, video-editing
  41→76 (TBT 6160→290ms), blog post 46→82 (CLS 0.51→0.007); a11y/BP/SEO
  100/100/100 on all measured routes. Local numbers carry a localhost
  artifact (load fires before first paint, so Lantern still chains some LCP
  to JS) — the preview deployment is the real gate.
- Smoke test 12/12 (2 initial fails were headless reduced-motion artifacts,
  re-verified with no-preference emulation: video mounts, a11y toggle stops
  it, typewriter runs). Visual before/after on home/service/post at
  390+1440px: identical except the intended cookie-link underline; the ⚠
  chat icon in local shots is a test-server %20-decoding artifact (verified
  fine on production).

## Preview gate runs (v1-v3) and verdict — 2026-07-16/17
- Full §6 suite vs preview v1 (7 agents, 63 LH runs + adversarial fresh-eyes
  verifier): G1/G2/G6/G7/G9 PASS; axe 0 violations at every severity across 14
  scans incl. open-widget states; a11y/BP 100 on 21/21; SEO 100 excluding only
  Cloudflare's preview-noindex header.
- The adversarial verifier found what I missed: Button flashed "נשלח בהצלחה!"
  on ANY submit (pre-existing, dishonest — removed); chat Tab-trap leaked via
  its disabled send button; a11y-panel Escape dropped focus to body; chat had
  no live region; native validation bubbles appeared in the browser locale;
  cookie banner covered the chat trigger on desktop; 9 conversion links
  untracked. All fixed and re-verified live on v2 (7/8 spot checks; the 8th —
  /studio — fixed in v3 by shipping studio/index.html as a real asset after
  proving CF turns exact-path /index.html rewrites into 308s).
- v2 re-measure: home TBT 380→116, CLS outlier 0.131→0.007, seo-promotion 81→85.
- Verdict per §5.4: G3-perf (≥95) and G4-LCP (≤2.0s) remain RED → NOT merged,
  production untouched, audit/BLOCKED.md written. Decisive evidence: the no-JS
  static page sims at LCP 2.49s — the gate is unreachable without product
  decisions (fonts/hero/TTFB) recorded in PROPOSALS.md #10.
- Final branch state: 21 commits, tsc/eslint clean, /studio + real-404 + bots +
  FAQ-in-HTML all verified on preview v3.
