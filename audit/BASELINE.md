# BASELINE — mediawave.co.il production, measured 2026-07-12

All numbers below were measured with real tools against the live production site
(https://mediawave.co.il, git tip `299cb88`) on 2026-07-12. Raw tool output lives in
`audit/raw/`. Nothing here is estimated.

## Measurement inventory

| What | Tool | Raw output |
|---|---|---|
| AI-crawler access (G2) | curl × 6 real bot UAs × 22 URLs | `raw/bot-access.json` |
| Content without JS (G1) | curl + node text-extraction + puppeteer rendered-DOM diff | `raw/nojs-content.json` |
| Structured data (G6) | curl + JSON-LD extraction, all 21 routes | `raw/structured-data.json` |
| Accessibility (G5) | axe-core 4.12 (WCAG 2.0/2.1 A+AA), 22 pages | `raw/axe-baseline.json` |
| Console errors / links (G9) | puppeteer crawl, 131 internal links HEAD-checked | `raw/console-errors.json`, `raw/links-check.json` |
| Lighthouse (G3/G4) | Lighthouse 12.8.2 CLI, mobile, simulated throttling; 3 runs (median) on 6 key routes, 1 screening run on the other 15 | `raw/lh/*.json`, `raw/lighthouse-key.json`, `raw/lighthouse-rest.json` |
| Code audit (G5/G7/G10) | grep/read of src, functions, headers | `raw/repo-audit.md` |
| Screenshots | puppeteer, 390×844@2x + 1440×900, all routes | `raw/screens-baseline/` |
| Build (G8) | npm run build + eslint + bundle sizes | `raw/build-baseline-log.txt` |

## Gate scoreboard (production, before any change)

| Gate | Status | Evidence |
|---|---|---|
| G1 content without JS | **FAIL (one item)** | All 21 routes serve full prerendered HTML: H1, body copy, phone, email, JSON-LD present; raw/rendered text ratio 1.02–1.29 (raw ≥ rendered) on every route. **The 13 FAQ answers are NOT in the HTML body** — questions render as closed `<button aria-expanded=false>`, answers exist only inside the JSON-LD block and are mounted by JS on click. |
| G2 AI assistants can read the site | **FAIL — critical, edge-level** | 126/132 checks: **HTTP 403 "Your request was blocked."** for GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot and PerplexityBot on every route (CF-RAY headers = Cloudflare edge). Live robots.txt contains a Cloudflare-injected "managed content" section that `Disallow: /` for GPTBot and ClaudeBot **above** the owner's own `Allow: /` stanzas; the repo's `public/robots.txt` is clean — the block and the Content-Signal preamble are injected by the Cloudflare zone setting. Caveat: tests spoofed UAs from a residential IP; CF may treat verified crawler IPs differently — but the injected robots.txt proves the "block AI crawlers" zone feature is active. **Not fixable from the repo.** |
| G3 Lighthouse mobile | **FAIL** | Perf 41–75 (gate ≥95, 0/21 pass). A11y 94–96 (gate 100, 0/21). Best-Practices 96–100 (20/21 pass ≥95, actually 100 on 20 routes). SEO 83–92 (gate 100, 0/21). |
| G4 Lab CWV mobile | **FAIL** | LCP 4.30–5.35 s on every route (gate ≤2.0). LCP breakdown on home: TTFB 627 ms, render delay ≈4.2 s (86 %) — the text paints only after the JS bundle executes. TBT over 150 ms on 17/21 routes (worst: `/services/video-editing` at 6,160 ms — single-run screening number, needs re-measurement). CLS median fine (≤0.011) except a **5-post blog cluster at CLS 0.50–0.53**. |
| G5 real accessibility | **FAIL (small set)** | axe: exactly one distinct violation, `link-in-text-block` (serious), on all 22 pages — the cookie-notice "מדיניות פרטיות" link is color-only (1.49:1 vs surrounding text). Lighthouse adds `heading-order` (footer `h4` after `h1`) on 4 routes. Code audit: videos honor `prefers-reduced-motion` but the site's own a11y-widget "ללא אנימציות" toggle does **not** stop them and there is no pause control; ChatWidget has no focus-return on close; AccessibilityWidget panel has no Tab trap; CookieConsent takes no keyboard focus; form errors are announced (aria-live) but not linked per-field (`aria-invalid`/`aria-describedby` absent). LeadModal + mobile menu focus handling is correct. Skip-link + global focus-visible: present. |
| G6 structured data | **PASS with gaps** | Build-time LocalBusiness (real phone +972-52-873-1808, areaServed Israel, `Su-Th 09:00-18:00`), Organization, WebSite on every route. FAQPage (13/13 Q&A pairs) on home; FAQPage + Service on all 6 service pages; BlogPosting + BreadcrumbList on all 8 posts; BreadcrumbList on /blog. **Missing:** BreadcrumbList on service pages, portfolio, terms/privacy/accessibility; no schema specific to the portfolio page. Not yet run through a schema validator (gate-time task). |
| G7 Hebrew / RTL | **PASS (minor items)** | `lang="he" dir="rtl"` correct. Phones/emails/Latin islands isolated with `dir="ltr"` consistently (equivalent to `<bdi>`). Marquee duplicate is `aria-hidden`. Rotating hero headline uses sr-only + aria-hidden correctly. Remaining: the typewriter line has no stable SR alternative (SR users can catch a half-typed word + a literal `\|` cursor character); raw-HTML h1 text doubles each phrase (sr-only + animated copy) — harmless for AT, noisy for naive scrapers. |
| G8 no regressions | baseline being recorded | `npm run build` output + bundle sizes in `raw/build-baseline-log.txt` (see file). tsc/eslint state recorded there. |
| G9 nothing broken | **FAIL (one item)** | 0 console errors, 0 failed requests, 0 broken links out of 131. Sitemap covers exactly the 21 real routes. **Soft-404: any unknown URL returns HTTP 200 with the homepage shell** (`_redirects` SPA catch-all). Duplicate conflicting `<link rel=canonical>` + `og:url` on every inner page (hardcoded homepage value from the template + the correct helmet one) — the worst SEO defect found; also drives the Lighthouse SEO 83. Sitemap URLs are non-trailing-slash while CF Pages 308-redirects to trailing slash. |
| G10 measurable | **FAIL — total** | 20 conversion paths identified (WhatsApp × 9 surfaces, tel × 3, mailto × 3, form submits × 2, modal submits, chat handoff). **Zero analytics of any kind in the codebase.** No event fires anywhere; the owner cannot attribute a single inquiry to any CTA. |

## Key per-route Lighthouse numbers (mobile, production)

Key routes = median of 3 runs; others = 1 screening run.

| Route | Perf | A11y | BP | SEO | LCP s | CLS | TBT ms |
|---|---|---|---|---|---|---|---|
| / | 69 | 95 | 100 | 92 | 4.83 | 0.007 | 201 |
| /blog | 75 | 94 | 100 | 83 | 4.30 | 0.003 | 139 |
| /services/building-websites | 70 | 96 | 100 | 83 | 4.48 | 0.003 | 227 |
| /blog/why-your-business-needs-a-website-2026 | 71 | 96 | 100 | 83 | 4.56 | 0.011 | 187 |
| /portfolio/memory-videos | 72 | 94 | 100 | 83 | 4.43 | 0.011 | 174 |
| /accessibility | 69 | 94 | 100 | 83 | 4.73 | 0.007 | 156 |
| /terms | 69 | 94 | 100 | 83 | 4.52 | 0.003 | 251 |
| /privacy | 70 | 94 | 100 | 83 | 4.39 | 0.000 | 242 |
| /services/landing-pages | 66 | 96 | 100 | 83 | 4.52 | 0.003 | 284 |
| /services/seo-promotion | 67 | 96 | 100 | 83 | 5.35 | 0.003 | 212 |
| /services/chatbots | 71 | 96 | 100 | 83 | 4.30 | 0.003 | 235 |
| /services/video-editing | **41** | 96 | 100 | 83 | 4.49 | 0.003 | **6160** |
| /services/memory-videos | 72 | 96 | 100 | 83 | 4.60 | 0.003 | 150 |
| /blog/what-is-pagespeed… | 72 | 96 | 100 | 83 | 4.46 | 0.003 | 185 |
| /blog/how-to-choose-web-developer… | 73 | 96 | 100 | 83 | 4.53 | 0.003 | 126 |
| /blog/landing-page-guide… | 56 | 96 | 96 | 83 | 4.20 | **0.504** | 95 |
| /blog/seo-basics… | 51 | 96 | 100 | 83 | 4.70 | **0.504** | 231 |
| /blog/chatbot-for-business… | 73 | 96 | 100 | 83 | 4.63 | 0.011 | 98 |
| /blog/common-website-mistakes… | 51 | 96 | 100 | 83 | 4.54 | **0.511** | 153 |
| /blog/what-is-responsive… | 46 | 96 | 100 | 83 | 4.54 | **0.531** | 210 |
| /blog/increase-website-leads-tips | 46 | 96 | 100 | 83 | 4.66 | **0.511** | 254 |

Intermittent CLS spikes (0.54–0.63 in single runs) also hit `/portfolio/memory-videos`
and `/blog/why-your-business-needs-a-website-2026` — same suspected root cause as the
blog cluster.

## Additional findings outside the gates

- **www.mediawave.co.il returns HTTP 522** (origin unreachable) — no www→apex redirect
  exists. Anyone typing "www." gets a Cloudflare error page. DNS/dashboard fix, owner-only.
  (Already known in HANDOFF since 06/07, still open.)
- Security headers: `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`,
  `Referrer-Policy` present; **CSP, HSTS, Permissions-Policy missing**.
- `functions/api/chat.ts`: rate limiting present (5/min/IP), secret handled correctly,
  but `Access-Control-Allow-Origin: *` lets any site consume the chat API quota.
- fonts.googleapis.com preconnect is missing `crossorigin` → hint unused (~98 ms LCP).
- Lighthouse top opportunities (home): unused lottie JS 50 KiB (~300 ms), oversized
  images demo-before/after + hero-poster 88 KiB (~150 ms), JS execution 2,996 ms
  attributable (react-vendor 2,231 ms + framer-motion 606 ms).
