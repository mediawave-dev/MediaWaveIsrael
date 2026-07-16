# PROPOSALS — decisions only you can make (sharpest first)

Each item: what, why it matters, what I need from you. Evidence for every claim is in
`audit/BASELINE.md` and `audit/raw/`.

## 1. Cloudflare is blocking every AI assistant from your site — the homepage promise is currently false
GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot and PerplexityBot all
receive **HTTP 403 "Your request was blocked."** on every route (126/132 checks,
`audit/raw/bot-access.json`). Cloudflare also injects `Disallow: /` rules for GPTBot and
ClaudeBot into your live robots.txt, overriding the Allow rules you wrote. Your homepage
sells "האתר שלכם יימצא על ידי עוזרי AI" — right now no AI assistant can read a single
page. **Action (≈5 minutes, only you have dashboard access):** Cloudflare dashboard →
mediawave.co.il zone → **AI Crawl Control** (or Security → Bots): set AI crawlers to
**Allow** (at minimum: search/assistant crawlers), and disable the robots.txt managed
injection ("manage AI bot traffic" / Content-Signal option) so your own
`public/robots.txt` serves as written. Verify afterwards with:
`curl -A "GPTBot/1.2" -o NUL -s -w "%{http_code}" https://mediawave.co.il/` → expect 200.
Note: if you *want* to keep blocking AI **training** while allowing AI **search**,
Cloudflare's AI Crawl Control lets you allow per-crawler — allow the search/user-request
bots (OAI-SearchBot, ChatGPT-User, Claude-SearchBot, PerplexityBot) and decide separately
on the trainers (GPTBot/ClaudeBot). Blocking trainers keeps the homepage promise only
partially true — my recommendation for a business that sells being-findable-by-AI is to
allow all six and revisit if scraping volume ever becomes a cost.

## 2. www.mediawave.co.il is a dead end (HTTP 522)
Anyone typing `www.` gets a Cloudflare error page, and links/bookmarks with www are lost
traffic. Known open item since 06/07 — still broken today. **Action:** Cloudflare
dashboard → DNS: add a proxied record for `www` (CNAME to `mediawave.co.il` or to the
Pages project), then Rules → Redirect Rules: `www.mediawave.co.il/*` → 301 →
`https://mediawave.co.il/$1`. Two minutes, permanent fix.

## 3. The site now fires conversion events — but they need a destination you own
I wired every conversion path (all WhatsApp CTAs by placement, tel/mailto clicks, form
and lead-modal submits, chat opens) to a tiny first-party tracker. Events currently post
to `/api/event` (a Pages Function) which logs them — visible live via the Cloudflare
dashboard, but **not stored durably**. To actually answer "which CTA brings inquiries":
create a **GA4 property** (needs your Google account, ~10 min) and give me the
`G-XXXXXXX` measurement ID — the tracker will forward events server-side (no extra JS on
the page, no performance cost, no cookie banner change). Alternative if you prefer
no-Google: Plausible (€9/mo) or a free Cloudflare Analytics Engine binding (5 min in the
dashboard). Until one of these exists, tracking works but memory is short-term.

## 4. The only "work" a visitor sees is a demo with a disclaimer
The before/after slider is explicitly labeled a demo, and it is the sole portfolio
evidence on the homepage; the one real work sample (memory-videos) is buried on a service
page. A prospect deciding whether to call is deciding on proof. **Action (content only
you can supply):** one real client before/after (even one!) to replace the demo, or
permission to feature the memory-videos project on the homepage showcase slot. I did not
touch the section — inventing or reframing proof is off-limits by your own rule, rightly.

## 5. Contact form has no phone field — in this market that's a conversion decision
Israeli small-business owners overwhelmingly prefer a callback over email. The form
collects name/email/message only; the lead modal *does* collect phone. Adding an optional
phone field to the main form likely raises lead quality and callback rate, but it changes
a form you designed — your call, one line from me once you decide.

## 6. Form submissions still have no real endpoint
`VITE_CONTACT_ENDPOINT` is unset, so the form hands off to WhatsApp with a prefilled
message (honest fallback, kept). If you want submissions that arrive even when the
visitor doesn't complete the WhatsApp step: tell me where they should land (email via a
worker, Google Sheet, or a simple KV store + weekly digest) and I'll build it in the next
pass — it needs one secret/binding only you can create.

## 7. Content-Security-Policy — prepared but not enforced
No gate requires it and a wrong CSP silently breaks the chat widget, Sanity studio and
Google Fonts. When you're ready I'll ship a tested `Content-Security-Policy` in
Report-Only mode for a week, then enforce. Zero visitor impact, real XSS hardening.

## 8. Google Search Console — still unverified (open since 06/07)
`public/google-verification.html` exists but the property isn't verified/monitored. After
the canonical fix ships, GSC is how you'd see indexing recover. Needs your Google login.

## 9. Testimonials section is hidden for lack of content
`src/data/testimonials.ts` is empty by design and the section stays hidden until real
quotes exist. Two or three one-line quotes from past clients (even tape-conversion
customers) unlock a trust section that's already built and styled.

## 10. The last Lighthouse points are a product decision, not a bug — pick from a menu
After this branch, every Lighthouse category except performance is 100 on all 21
routes, and performance is 81–98 (was 41–75). The measured floor: even with ALL
JavaScript removed, the page sims at LCP 2.49s — the budget is eaten by TTFB
(~0.62s, HTML isn't edge-cached), ~140KB of brand fonts before first paint, and
first-frame rendering. Getting perf ≥95 / LCP ≤2.0s everywhere needs one or more of:
(a) lighter font strategy above the fold (drop Outfit and/or Betaamango from the
critical path — brand-typography call); (b) static-first service-page hero icons with
the Lottie animating in after load (changes the designed first impression; also the
only fix for seo-promotion's LCP=the-animation itself); (c) edge-caching the HTML
(Cache-Control decision — worth ~0.4-0.5s on every route); or (d) recalibrating the
gate to what this architecture honestly supports (perf ≥85 / LCP ≤2.5s lab passes
everywhere except seo-promotion; real headed-Chrome LCP of this build is ~1.1-1.7s).
Full evidence: audit/BLOCKED.md.
