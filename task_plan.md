# Task Plan — MediaWave site upgrade (upgrade/fable-20260712)

## Goal
Make the homepage's three implicit promises — fast, AI-findable, professionally built —
verifiably true against the §6 gate set, measured with real tools, and ship behind the
§5 preview gate. Baseline: `audit/BASELINE.md` (production, 2026-07-12).

## Success criteria
The §6 gates, verbatim, measured against the preview deployment and then production:
G1 content-without-JS · G2 AI-crawler access · G3 Lighthouse mobile (perf≥95, a11y=100,
BP≥95, SEO=100, every route) · G4 lab CWV (LCP≤2.0s, CLS≤0.05, TBT≤150ms) · G5 axe+
keyboard zero critical/serious · G6 valid JSON-LD · G7 RTL correctness · G8 no
regressions · G9 nothing broken · G10 every conversion path fires a distinct event.

## Two gates are owner-gated at the edge (cannot be turned green from this repo)
- **G2 on production**: Cloudflare blocks all six AI crawlers with 403 at the zone edge
  and injects Disallow rules into robots.txt. The repo side (content, robots.txt,
  prerendered HTML) is already correct/fixed here; the preview URL (*.pages.dev, outside
  the zone) is expected to pass, production will stay red until Nati flips the Cloudflare
  toggle → PROPOSALS.md #1.
- **SEO=100 on production** partially depends on the same zone setting (Cloudflare's
  injected Content-Signal/managed lines are what Lighthouse flags as invalid robots.txt).
  Repo-side canonical bug is fixed here; preview measures the repo truthfully.
Gate verdicts will therefore be recorded per-environment (preview vs production) with
this distinction stated plainly.

## Work order — ranked by (impact on inquiries ÷ effort)

| # | Item | Gate | Why first-order for inquiries |
|---|------|------|-------------------------------|
| 1 | Remove hardcoded homepage `canonical` + `og:url` from index.html template (helmet owns them per-route; prerender bakes the right one) | G9/G3-SEO | Conflicting canonicals risk Google folding every service/blog page into the homepage — direct organic-traffic threat |
| 2 | Blog CLS 0.5 cluster fix (root cause via diagnosis agent) | G3/G4 | 5 posts score 46–56 perf today; CLS is 25% of the score |
| 3 | FAQ answers rendered into the HTML body (CSS-collapsed, not JS-mounted) | G1 | The one G1 failure; also what AI crawlers will read once unblocked |
| 4 | A11y to 100: static-underline the in-text privacy link, footer heading order, per-field aria-invalid/aria-describedby, ChatWidget focus-return, AccessibilityWidget tab-trap, CookieConsent keyboard reachability, typewriter SR alternative, videos gated on the site a11y toggle | G5/G3 | Legal floor (IS 5568) + 4–6 Lighthouse points sitewide |
| 5 | G10 tracking layer: tiny first-party `track()` util + `/api/event` Pages Function, wired to all 20 conversion paths with distinct event names | G10 | Without it no future change can honestly claim conversion impact |
| 6 | Perf round (after diagnosis): fonts (`crossorigin` preconnect, font-display strategy), LCP render-delay fix, lottie deferral, image sizing, video-editing TBT outlier | G3/G4 | Perf 41–75 → target ≥95; biggest single gate gap |
| 7 | Soft-404 → real 404: prerender NotFound to 404.html, replace `_redirects` catch-all with `/studio/*` rule only | G9 | Stops junk URLs indexing as 200s |
| 8 | BreadcrumbList on service/portfolio/legal pages | G6 | Completes the schema set |
| 9 | eslint scope fix: ignore `.claude/` templates (13 pre-existing errors are in a skill template, not site code) | G8 | "Zero lint errors" gate must be true, honestly |
| 10 | Security headers: add HSTS + Permissions-Policy | hardening | Cheap, no-risk; CSP deliberately deferred → PROPOSALS (regression risk vs no gate requirement) |

## Decisions
- **Base branch**: `upgrade/fable-20260712` branched from `299cb88` = origin/main = live production.
- **No framework migration** unless the perf gate proves unreachable after the tuning
  round; if so, it will be written up (per brief §3) before any such step — not started
  unilaterally.
- **Videos already satisfy the letter of G5** (they honor `prefers-reduced-motion` and
  never mount on mobile); gating them additionally on the site's own a11y-widget toggle
  is a cheap real improvement, so it's included.
- **CSP not enforced in this pass**: no gate requires it, and a wrong CSP can break the
  chat widget/Sanity studio/Google Fonts silently. Proposed with a tested policy instead.
- **Analytics sink**: no third-party analytics account exists and creating one needs
  Nati's Google login (out of bounds). The tracking layer lands complete and functional
  (sendBeacon → `/api/event` function), with the durable sink (GA4 property / Plausible)
  as PROPOSALS #3. G10's letter ("fires a distinct trackable event", code review) is met.
- **Uncommitted pre-existing working-tree changes** (.gsd/*, CMS/, SOCIAL/, scripts/…)
  are not mine and stay untouched/uncommitted. Only files I change are staged, explicitly.

## New dependencies
None planned. (Gate work must not enlarge the JS bundle — G8.)

## Error log
- Baseline build agent died mid-run (API socket error) — re-ran the build baseline
  directly: build+tsc clean, 21 pages prerendered, eslint 13 pre-existing errors all in
  `.claude/skills/directus-cms-setup/templates/seed-directus.ts` (not site code).
- (rolling — updated as encountered)

## Phases
- Phase 0 ✅ baseline (audit/BASELINE.md)
- Phase 1 ✅ this plan + PROPOSALS.md
- Phase 2 ⏳ fixes on this branch, one concern per commit, logged in progress.md
- Phase 3 fresh-context verifier subagents + my own before/after screenshot review
- Phase 4 push → preview deployment → full gate set vs preview URL
- Phase 5 green ⇒ merge to main (deploy), re-measure production → audit/AFTER.md;
  any red ⇒ audit/BLOCKED.md, production untouched
