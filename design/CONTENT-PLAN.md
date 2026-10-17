# CONTENT PLAN: what each page says, in what order (SOTD round, 2026-10-17)

Built from [research/SYNTHESIS.md](research/SYNTHESIS.md). Every line on the site traces to a fact in `src/components/pages/Terms.tsx`, `src/data/faqs.ts`, `src/data/services.ts` or the memory-video sample; the line-by-line log is [copy/CHANGELOG.rtl.md](copy/CHANGELOG.rtl.md). Slots that need a fact we do not have are marked `[לבירור: נתי]` in the docs, never on the live page.

## The narrative
1. **The promise (first phone screen):** a site that brings enquiries to WhatsApp. Built from scratch, a basic site live in 2 to 3 weeks. One action: tell us about the business.
2. **Why this studio (01 מכירים):** fast on a phone; found by Google and by chatbots (no promise of placement); you talk to the developer, with no one in between.
3. **What we do (02 בוחרים):** six services as the tools on the desk, each a link to its own page (the label becomes the page, D91).
4. **How it goes (03 בונים):** the laptop builds this very site, captioned; then the four steps on the ink line, each with its real detail (approval, two revision rounds, a link to the phone, the first month of support).
5. **The objections (04 שואלים):** price first (how it is set, VAT included, half on start), then time, what is included, ownership, phones, Google, editing, content, after launch, the second year's hosting, a shop, a logo, the whole process.
6. **The ask (05 כותבים):** the form and the four ways (phone, email, WhatsApp, Instagram); one reply promise.
7. **The meaning (06 מקבלים):** the camera pulls back to one phone: this site was built here, yours will be built the same way. WhatsApp.

## Each service page (one page sells one service)
| Block | Content | Source |
|---|---|---|
| Path | home / services / the service | |
| Hero sheet | the service name (H1), one outcome line, three facts, "כתבו לנו בוואטסאפ" with the service's own message, "איך זה עובד" | services.ts heroSubtitle, tags, waText |
| The object | the service's Thing from the home desk, with its Lottie | D90, D91 |
| Why | two or three short paragraphs printed on the table | services.ts sections |
| Proof | chatbots: try the site's own bot; memory videos: the real sample plays | ChatWidget, portfolio-examples.ts |
| What you get | a ruled checklist of outcomes | services.ts features |
| What it costs | the quote slip: what moves the price, what is always included, the deposit, a written quote, VAT included | services.ts price + PRICE_COMMON (Terms 3.1, 3.2, 3.4, 7.1, 7.2) |
| How it goes | the ink line through the steps, then how long it takes | services.ts steps, time |
| Questions | the notepad | services.ts faq |
| Action | the closing question, the reply promise, WhatsApp, the form | services.ts cta |
| More | the other five services as their objects | |

## Portfolio (/portfolio/memory-videos)
Labelled as a real sample from client work; the film first, then the note (what came in, what was made, where it was shown), then the action and the way to the service page.

## Legal (/terms, /privacy, /accessibility)
The legal text unchanged, on one plain sheet with the path above it.

## 404
The empty spot on the desk, a plain line, home, WhatsApp, the phone, and the six services.

## Not on the site yet, waiting for Nati
- A photo of Nati (research 01: a real face and name is the strongest proof without testimonials).
- Real client sites for a portfolio of websites (world dossier W21).
- "From" prices, if he wants them published (market bands in research 03 §2).
- A dated mobile speed receipt (copy.ts SPEED_PROOF), only once the live site measures well on PageSpeed Insights.
