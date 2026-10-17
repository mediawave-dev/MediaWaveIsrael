# SOTD review, round 2 (fresh eyes, 2026-10-18)

Reviewed build: the vite preview on http://localhost:4191/ (dist built 00:52, commit c6f8704, D113).
Not in the served build: commit 847c7c9 (new share image, 01:08) and the uncommitted work on
`design/rive/hero/build-hero.mjs`, `src/look/parts/hero-built-shot.svg` and `hero-shot.riv`.
Evidence lives in `G:/tmp/sotd/final/review/` (frames, probe JSON, film). Lighthouse was not re-run;
performance numbers come from `MEASURED.md`.

## Verdict

1. Round 2 fixed most of the visible round-1 defects: the chevrons, the hero key, the seam, the legal and 404 openings, the cream objects on black, the services index and the slash URLs.
2. Two fixes did not land in the build. The dock still paints a cream bar across the white band (the override loses the cascade), and cross-page chapter links still drop the visitor at the top of the home page.
3. The concept and the type are still the site's strength. The weak spots are the same three: the home band cuts, the generic build screen and a home page that misses its own mobile speed budget.
4. Weighted score 6.9 (round 1: 6.5). Phone first 7.1 (round 1: 7.0). Impeccable audit 13/20, the same band as round 1.
5. This is a solid studio site, not yet SOTD level (7.2 to 8.1). Fixing the P0, the dock and the opening slab is the shortest path to about 7.2.

## Score sheet

Weights: Design 40%, Usability 30%, Creativity 20%, Content 10%.

| Category | Round 1 | Round 2 | Why it moved (or not) |
|---|---|---|---|
| Design (40%) | 6.3 | 6.9 | Fixed: hero key fits its cap, chevrons, a continuous white band behind the big word, cream objects on the black desk, no seam, every inner page opens on black, and the hero sheet hangs over the cut on inner pages. Still wrong: a cream dock bar across the white band, an empty black slab under the hero stack, the big word's stray stub, the flat contact slab, ragged facts, the footer tagline break. |
| Usability (30%) | 7.0 | 7.1 | Fixed: chevrons, the services index, "how we work" landing on its heading (on the home page), the WhatsApp key first in the service hero, the dock using each page's message. Still broken: chapter links and the header key from inner pages (new P0 N1); 17.5 phone screens with reduced motion only 2.3% shorter. |
| Creativity (20%) | 6.5 | 6.8 | The pull-back now opens on a phone with its bezel, its URL bar and the site's bands. Inner pages bridge the bands with paper. Still the same: the build screen shows a generic wireframe, the home bands are flat cuts, and the credits are a plain footer. |
| Content (10%) | 6.0 | 6.6 | Fixed: slash canonicals, og:url, sitemap and JSON-LD; the owner is named in the letter; the share image is redone in source. Open: home mobile performance, sloppy JSON-LD, stale footer labels, the accessibility statement, duplicated key text in the HTML, no immutable cache headers. |
| **Weighted total** | **6.5** | **6.9** | 6.9 x 0.4 + 7.1 x 0.3 + 6.8 x 0.2 + 6.6 x 0.1 = 6.91 |
| Phone first | 7.0 | 7.1 | 390x844: 7.3 (clean first view, WhatsApp on every screen, 0 overflow, axe 0; but the menu's chapter links fail from inner pages). 320x568: 6.8 (the services index wraps and orphans its chevrons, hero links lose their chevrons and measure 41px, 3-line cookie strip at 360). |
| Impeccable audit | 13/20 | 13/20 | Fixes landed inside each dimension, but none crossed a score band (table below). |

## Impeccable technical audit

| # | Dimension | Score | Key finding |
|---|---|---|---|
| 1 | Accessibility | 3 | axe 0 on all 12 routes at 390 and 1440. The cream focus ring on black works (probe: header link outline rgb(237,231,218) 3px), and high contrast now has shot rules. Gaps: the skip link is ink on the ink header with an ink ring, keyboard jumps from inner pages land on the home top, the statement says WCAG 2.0 and July 2026, and key labels are sized in px so the widget's text size skips them. |
| 2 | Performance | 2 | Home median 52 (51, 52, 81; LCP 5.65s, TBT 927 to 1112ms) against the 70 budget. /services/landing-pages/ median 74. CLS 0.000 on both (round 1: 0.283 on landing). |
| 3 | Responsive design | 3 | 0 horizontal overflow and 0 text under 12px at 320, 390 and 1440. At 360 to about 370 the cookie strip wraps to 90px over a 76px reserve. At 320 the services index wraps and the hero links measure 41px. |
| 4 | Theming | 2 | About 50 token colours repeated as literals in the shot CSS (`#1a1917` x16, `#ede7da` x11, `rgba(237,231,218,..)` x11, `#fff` x7), plus pure-black shadows outside the ink-alpha rule (detector, 6 hits). The override stack is now failing for real: the dock fix (shot-base.css:538) loses to shot-dock.css:5. |
| 5 | Anti-patterns | 3 | No AI tells: one typeface on purpose, no gradients or glass, no hero metrics. The only generic note is the stack of identical framed cards in why us and services, filled with flat stock illustrations (the Lotties are locked, so this is a layout point, not a content point). The detector's other 3 hits are known false positives (fallback font name, an img in a comment). |
| | **Total** | **13/20** | **Acceptable (10 to 13): significant work needed** |

## Round-1 P0 and P1 findings

IDs: D design, U usability, Cr creativity, Ct content, A audit, PH phone. Duplicates share a row.

| Round-1 IDs | Issue | Status | Evidence |
|---|---|---|---|
| D1 (P0), PH-1 | Cookie strip over the dock on small phones | Partly fixed | One-row strip at 375 to 430 (76px = token, overlap 0) and at 320 (104 = 104). At 360 it still wraps to 3 lines: 90px over a 76px reserve, so it covers 6px of the WhatsApp pill and part of the chat disc. `probe/probe2.json` firstScrolled, `probe/first-scrolled-360.png` |
| D2 (P0) | Hero WhatsApp label wider than its cap at 1100 to 1920 | Fixed | Label 193px inside a 268px cap at 1100, 1280 and 1440, 196 in 272 at 1920; scrollWidth equals clientWidth. `probe/probe.json` heroKey |
| D3, U1, Cr5, Ct4, A4, PH-2 | Chevrons mirrored in RTL | Fixed | Down chevrons on anchors, left (forward) on page links: `p390/home-01.jpg`, `p390/home-03.jpg`. Exception at 320: the hero links have no chevron at all (N6). |
| D4, Cr4 | White band broken around the big word | Partly fixed | The band is continuous white now. The ink segment above the word still floats about 70px clear of the pad and reads as a stray stub. `film/mobile/f-0025-y010550.jpg` |
| D5, Cr1 (home) | Black opening ends in an empty slab; flat band cuts | Open on the home page, fixed on inner pages | About 120 CSS px of bare black under the paper stack at 390 (`p390/home-01.jpg`, y 442 to 561) and about 170px at 1440 (`p1440/home-02.jpg`). On inner pages the hero sheet hangs 72px over the cut, which is the right answer (`p390/services_building-websites_-00.jpg`). |
| D6 | Objects on the black desk read as wireframes | Fixed | Cream bodies, white faces, cream laptop lid with the logo: `p390/home-00.jpg`, `p1440/home-00.jpg` |
| D7, A6, Cr10 (P2) | Dock paints a cream bar over the white and black bands | **Open (the fix did not land)** | Computed `.shot-dock` background is still rgb(237,231,218) with the inset hairline over #faq at 1440 and 390 (`probe/probe2.json` dockWhite, `probe/dock-faq-1440.png`). See N2. |
| D8, Cr6 | 8px cream seam under the header on inner pages | Fixed | The pixel row under the header is `.sp-top` black at 1440 and 390 on /services/landing-pages/, /terms/, /no-such-page and /portfolio/memory-videos/. `probe/probe.json` inner |
| D9, Cr12 (P2), A12 (P2) | Legal pages and 404 open on cream | Fixed | `.sp-top--hang` and `.sp-lost__top` black bands: `p1440/terms_-00.jpg`, `p1440/no-such-page-00.jpg` |
| U2 | "How we work" lands on the build preface | Fixed on the home page | The nav points to `#how-we-work-title` (H2). The header click on the home lands with the heading at top 56. From inner pages it fails (N1). |
| U3, Ct9 (P2) | Websites buried sixth of six, no overview | Fixed (index), order unchanged | Six-name ruled index under the H2: `p390/home-03.jpg`. At 320 the index wraps badly (N5). |
| U4, A9, Cr3, PH-6 (P2) | Pull-back opens on a blurred wireframe | Partly fixed (now P2) | The phone's bezel and "mediawave.co.il" bar show from the first frame, and the mini has black, cream and white bands (`film/mobile/f-0028` to `f-0031`, `film/desktop/f-0029` to `f-0031`). The mini is still bars and boxes, not the real H1 and headings. |
| Cr2 | The build screen shows a generic SaaS wireframe | Open (work in progress, not in the build) | The finished screen is a white page, a cream image box with the lens photo, bars and three cards, not the black opening the visitor just saw. `film/desktop/f-0017-y007650.jpg`. The working tree has uncommitted changes to the build SVG and Riv. |
| Ct1 (P0) | Cross-page navigation broken | **Partly fixed, still P0** | Footer links now navigate, but they land short. Header, menu and the header key go to the home top. See N1. |
| Ct2, A8 | Mobile performance under budget | Open on the home page | Home median 52 (LCP 5.65s), landing median 74 (`MEASURED.md`) |
| Ct3 | Canonicals without the trailing slash | Fixed | `<link rel="canonical" href="https://mediawave.co.il/services/landing-pages/">`, og:url the same, sitemap updated |
| Ct5 | Share image in the retired Klein navy with the retired tagline | Fixed in source, not served | Served `/og-image.png` (18,460 bytes) is the old card. Commit 847c7c9 has the new black and cream card with the H1. Rebuild and deploy. |
| Ct6 | Nobody is named as the one who answers | Partly fixed | The letter says "נתי, המפתח, קורא ועונה בעצמו". Service pages still say "מי שעושה את העבודה עונה", and the Terms still say "החברה". |
| A1 (P0) | Inner pages vanish after first paint | Fixed | The prerendered main is the route's fallback (route-stamped). Landing CLS 0.000 (round 1: 0.283), `MEASURED.md` |
| A2 | Inner-page CSS loaded async | Fixed | shot-pages and ShotLegal stylesheets are render-blocking on inner routes (`scripts/prerender.mjs`) |
| A3 | Focus invisible on the black band | Partly fixed | Header and band links get a cream 3px ring. The skip link is ink on the ink header with an ink ring and covers half the logo (`probe/skip-390.png`). See N7. |
| A5 | Service hero hides the dock on small phones | Fixed | `data-dock-hide` only on `.sp-ctas`; the key comes before the facts |
| A7 | High contrast does nothing on the shot look | Fixed (code) | `html.high-contrast[data-look="shot"]` rules at shot-base.css:556 to 558. Not checked visually. |
| PH-3 | Dock always sends the website message | Fixed | After pointerdown on /services/memory-videos/ the dock's href carries "היי, אשמח לשמוע על סרטון זיכרונות מתמונות." (`probe/probe2.json` dockMemory) |

Round-1 P2 items, one line each: D10, U9, PH-9 (contact WhatsApp slab) open. D11 (portfolio subtitle off axis, still about 150px right of the title's axis at 1440) open. D12 (ragged fact bullets, footer tagline breaking inside "לעסקים קטנים") open. U5 (reduced motion 14,588 vs 14,926px, 2.3% shorter) open. U6 (about 23% chrome while consent is pending) open. U8 (washed-out posters) open. U10 (no real figures on the price slip) open. U11 (loupe) partly. U12, Ct11 (statement, footer labels) open, raised to P1 as N3. Ct7 (key text duplicated in the HTML: the header key's text reads "!ספרו לנו00:00:00!ספרו לנו00:00:00") open. Ct8 (JSON-LD without @id, `openingHours` "Su-Th") open. Ct10 content gaps open. Ct12 (no Cache-Control in `public/_headers`) open. Cr7 (footer as credits) open. Cr8 (laptop at first view) fixed at 390 with consent stored. Cr11 (websites morph) partly: the page object is now a laptop carrying the same phone Lottie. PH-4 (no big play key on the film print) open. PH-5 (no price link in the service hero) open. PH-7 (unknown slug redirects to /404) open. PH-8 (first view names only websites) open. PH-10 (footer 1062px on a phone) open.

## New findings

### P0

**N1. Chapter links and the header key from inner pages drop the visitor at the top of the home page, or short of the target.**
Routes: all 9 inner routes. Viewports: 390 (menu, footer) and 1440 (header).
Evidence (`probe/probe3.json`, probe4 output):
- Header "שאלות נפוצות" on /services/landing-pages/ at 1440: URL becomes "/" (the hash is dropped), scrollY stays 0 for 10 s, and #faq is 10,413px below.
- The header key "ספרו לנו" on /services/seo-promotion/: scrollY 0, and #contact is 11,831px below.
- Menu "שאלות נפוצות" on /services/chatbots/ at 390: scrollY 0, and #faq is 9,685px below.
- Footer "דברו איתנו" on /terms/ at 390: URL /#contact, but #contact is still 1,599px below (about 2 screens short). A direct load of /#faq at 390 lands 1,429px short.
- On the home page the same links land exactly (target top 56), so the engine is fine.
Cause:
- `Header.tsx:63-65` calls `navigate('/')` and then `setTimeout(go, 100)`. After 100ms the lazy chapters are not mounted, so `go` finds no element.
- The browser's native hash jump (footer, direct load) fires before the holds and the near-mounted chapters take their height.
Fix (no visual change):
- On inner pages, keep the hash: `navigate('/' + href)`, or let the plain `/#id` href load.
- In ShotHome, when `location.hash` is set, mount the chapters up to the target without the near.ts gate. Wait until the target exists and its offset has been stable for two frames (3 s cap). Then call `engine.scrollTo(el)` and focus the target, as `go` already does.
- Add the cross-page case to the gates: from one service page, the header, menu and footer links must each land the target within 8px of the header line.

### P1

**N2. The dock is still a full-width cream bar with a hairline over the white band (the D7/A6 fix lost the cascade).**
Routes: / (FAQ, big word, letter, pull-back) and the black openings. Viewports: 1440 and 390.
Evidence: `getComputedStyle('.shot-dock').backgroundColor` is rgb(237,231,218) with `inset 0 1px 0` over #faq at both widths (`probe/probe2.json`, `probe/dock-faq-1440.png`).
Cause: `shot-base.css:538` (`html[data-look="shot"] .shot-dock { background: none }`) has the same specificity as `shot-dock.css:5`. shot-dock.css comes later, because ShotHome imports it lazily, so it wins.
Fix: change it at the source. In `shot-dock.css` set `background: none; box-shadow: none;` on `.shot-dock`, and delete the override in shot-base.css. Add a gate that samples the dock's computed background over #faq.

**N3. The accessibility statement is out of date and does not name the coordinator (a legal requirement for an Israeli site).**
Route: /accessibility/. All viewports.
Evidence: it still reads "עודכן לאחרונה: יולי 2026" and "WCAG 2.0 ברמה AA". It names no accessibility coordinator; regulation 35 asks for the name next to the phone and email that are already there.
Fix:
- Add the coordinator's name, marked [לבירור: נתי].
- Date the statement to the October 2026 redesign and cite ת"י 5568 at the WCAG level actually tested (axe runs 2.0 to 2.2 AA).
- Describe the real behaviour: scroll-linked camera moves, small angles under OS reduced motion, and none under the widget's stop switch.

**N4. The home opening still ends on a bare black slab (D5) while the inner pages already solved it.**
Route: /. Viewports: 390 (about 120px of empty black, `p390/home-01.jpg`) and 1440 (about 170px, `p1440/home-02.jpg`).
Fix inside the locked bands: reuse the inner-page bridge. Give the hero paper stack `position: relative; z-index: 1` and a negative bottom margin, so the bottom sheet hangs 40 to 60px over the cream and the cut passes behind paper. Or close the band 32 to 48px under the stack. Check the result after the dive's last frame, not only at rest.

Still open from round 1 and kept at P1: Cr2 (the build screen) and Ct2/A8 (home mobile performance). Both are in the table above.

### P2

**N5. The services index muddles at 320.** Route: /. Viewport: 320x568.
In the two-column grid each chevron is pushed to the far end of its cell, so the right column's chevron sits beside the left column's label ("‹ דפי נחיתה ‹ בניית אתרים"). "צ׳אטבוט לעסק" and "סרטוני זיכרונות" also wrap to two lines. Evidence: `z320-index.png`.
Fix: below 360px use one column, or set `justify-content: flex-start; gap: 8px` so the chevron follows its label, and add a 16px column gap with a hairline between the columns.

**N6. At 320 the hero's two text links lose their down chevrons and shrink to 41px.** Route: /. Viewport: 320x568.
Evidence: `shot-hero.css:246` sets `content: none`, and the report lists 132x41 and 118x41 targets (`p320/report.json`).
Fix: keep the chevron and stack the two links (each 44px), or shorten the gap. The "where it goes" rule should hold at every width.

**N7. The skip link is ink on ink.** Every route. Viewports: 390 and 1440.
Evidence: background rgb(26,25,23), outline rgb(26,25,23) 3px, sitting on the black header and covering the lower half of the logo (`probe/skip-390.png`).
Fix: a paper ground with ink text and a cream ring, placed under the header row (top: 64px) so it never covers the logo.

**N8. The playing Lottie in why us starts from an almost empty frame.** Route: /. Viewport: 390.
Evidence: the "אתר שגם צ׳אטבוט יכול לקרוא" screen shows a single small hexagon in a large empty white frame while it plays (`p390/home-02.jpg`). The resting posters next to it are washed out (`p390/home-01.jpg`, U8).
Fix: start playback from the poster frame (`goToAndPlay(posterFrame, true)`) so poster and play match, and show posters at full opacity in their own colours.

**N9. The big word's ink segment floats.** Route: /. Viewport: 390.
Evidence: the segment is meant to run from the pad's margin into the first letter, but it starts about 70px below the pad and ends above the letter's top (`film/mobile/f-0025-y010550.jpg`).
Fix: start it at the pad's bottom edge (negative top equal to the `.shot-bw` margin plus the `faq__more` padding), or drop it now that a white gap separates the two.

## Strengths

- The opening is a real idea, well made: a white sheet lit on a black desk, the real video inside the lens, and one Noto Sans Hebrew family at 800 and 75% width with no letter-spacing. It reads as a studio with a point of view.
- Accessibility hygiene is strong: axe 0 on all 12 routes at 390 and 1440, 0 overflow, 0 text under 12px, a cream focus ring on black, and CLS 0.000 measured on home and landing.
- Wayfinding is now honest: correct chevrons, a six-name services index, home anchor jumps that land exactly under the header and move focus, and a WhatsApp key on every screen that carries the page's own message.
- Inner pages are the most consistent part of the site: a black opening, the hero sheet hanging over the cut into cream, a ruled checklist, a perforated price slip, the notepad FAQ, and the same treatment on legal and 404.
- The copy stays honest: no invented clients, numbers or prices. The letter names who answers, and the price slip explains how the price is set.
- The pull-back now reads as "the page I scrolled, as a phone on the desk" from its first frame.

## Content gaps (not build defects)

- A photo of the owner.
- Client sites for a real portfolio (the memory-video sample is the only real work shown).
- Real testimonials (the section stays hidden until they exist).
- Video editing turnaround time; SEO billing rhythm and minimum period ([לבירור: נתי]).
- The accessibility coordinator's name and the business's legal name for the Terms ([לבירור: נתי]).
- Whether to show the two real figures that already exist in the Terms and service pages (hosting renewal 500 to 800 ₪ a year, extra work 200 to 300 ₪ an hour) on the home price slip and in the FAQ (U10, an owner decision).

## Builder's follow-up after this review (written by the builder, not re-scored)

The reviewer's scores above stand as written. These changes landed after the review; none of them
was re-scored by a fresh juror.

| Finding | Change | Evidence |
|---|---|---|
| N1 (P0) cross-page chapter links | The engine lands on a #hash once its target exists and the page above it settled (D115) | `scripts/qa/cross-page.mjs`: 6 of 6 land at the header line (header, key, menu, footer, two direct loads) |
| N2 dock bar | The bar is removed in `shot-dock.css` itself; the WhatsApp pill keeps a thin cream rim for black bands | computed `.shot-dock` background `rgba(0, 0, 0, 0)` at 390 |
| N4 opening slab | The meet chapter rises to 40px under the landed paper stack (`--hero-slack`), off between 768 and 1023px where the desk objects are still leaving | at 390: 126px of slack, cream starts 67px under the sheet; overlap audit 0 at 320, 390, 1024, 1440 |
| Cr2 build screen | The built page shows this site's bands: black header and opening, hero text on a white sheet, cream band with the cards (D114) | Rive rebuilt, 0 errors; `src/look/parts/hero-built-shot.svg` |
| Ct5 share image | Rebuilt in the bands (logo on black, H1 on cream) | `public/og-image.png` |
| N5, N7 | Services index chevrons follow their labels, one column under 360px; the skip link is a paper tab under the header | CSS in `shot-base.css` |
| Overlap at 320x568 | Service hero objects at 72% on short phones (memory videos had its line under the dock) | overlap audit `/services/memory-videos/`: 0 |

Still open: N3 (the accessibility statement needs the owner: coordinator name and date), N6, N8, N9,
home mobile performance.
