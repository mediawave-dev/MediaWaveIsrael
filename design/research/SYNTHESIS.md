# SYNTHESIS: what mediawave.co.il must do, ranked, per page

Written 2026-10-17 from the five research files in this folder:
- [01-conversion.md](01-conversion.md): what makes a small-studio visitor get in touch (NN/g, Baymard, Unbounce, web.dev).
- [02-awwwards.md](02-awwwards.md): how the Awwwards jury scores, 22 winner score cards, methods to steal.
- [03-israeli-market.md](03-israeli-market.md): 12 Israeli competitors, prices, legal norms.
- [04-hebrew-copy.md](04-hebrew-copy.md): Hebrew sales voice, AI tells, a line-by-line audit of 214 strings.
- [live-mobile-walkthrough.md](live-mobile-walkthrough.md): a screen-by-screen read of the live site at 390 (by the second session).

Every item carries its evidence. "Locked" flags an item that would break D81 (palette and type), D83 (one shot), D84 (mobile first) or the no-invented-proof rule; a locked item is never shipped, it goes to Nati as a proposal.

## The five findings that decide everything

1. **Usability and accessibility on a phone are where SOTD sites lose points, so that is where this site wins.** In 22 winner score cards Usability was the lowest jury category 21 times and Accessibility the lowest dev category 16 times [02 §Exec 4-6]. Nati's own top rule for this mission is the same: perfect intuitiveness and a perfect phone fit.
2. **The first phone screen must say what, for whom and the outcome.** Visitors decide in about 10 seconds [01 §1]. The live H1 "העסק שלכם / המומחיות שלנו" is a calque of "Your business. Our expertise." and could sit on any competitor's site [04 §Exec 3].
3. **The service pages are the weakest part of the site.** They still use the KM palette, name the stack (React, Next.js, Tailwind, SSL as tag pills), promise page one in the SEO hero while their own FAQ says nobody can, and put the first CTA about five screens down [04 §Exec 1-2; walkthrough].
4. **Honest proof exists, it is just buried.** Prices include VAT (Terms 3.4), year one of hosting and the domain is included (Terms 7.1), the code and design pass to the client (Terms 5.1), written timelines (faqs.ts), 50% deposit (Terms 3.2). Nobody in the Israeli sample shows all of these together [03 §4-5].
5. **One signature moment, done fully, beats many effects** [02 §Q3, S8]. The most transferable method for this concept is "the camera move is the route change" (San Rita, Jesper): the sheet you tap becomes the next page [02 Methods 1].

## Ranked: the whole site

| # | Do this | Evidence | Locked? |
|---|---|---|---|
| 1 | Bring every inner page into the shot system: table, paper, ink, Noto, the key buttons, the same header and dock | [02 §Q4] "inner pages feel like a different site" is a named failure | no |
| 2 | WhatsApp is the one primary action, named on the button, with a per-page, gender-neutral prefill; phone and email stay visible | [01 Top 2, 11]; [04 §Exec 6] (99% of Israelis use WhatsApp) | no |
| 3 | Plain Hebrew at a 7th-grade level, no stack names, no "מקצועי / חכם / מותאם אישית / 24/7", no slash gender forms | [01 Exec 2]; [03 §3]; [04 voice rules] | no |
| 4 | One verb per destination: "בואו נדבר" and "דברו איתנו" now point at three different places | [04 §Exec 7] | no |
| 5 | Honest price signals: what is always included, VAT included, the deposit, what moves the price. No invented numbers | [01 §3, Top 8]; [03 §5]; Terms 3.2, 3.4, 7.1 | numbers: Nati |
| 6 | Honest risk reversal: a written quote, two revision rounds, the code is yours after payment, 30 days of bug fixes. No result guarantees | [01 Top 9]; Terms 4.2, 5.1, 8.1 | no |
| 7 | One reply-time promise everywhere (today it is "24 שעות בימי עסקים", "היום" and "בהקדם") | [04 §Exec 2] | no |
| 8 | Reduced-motion and no-JS versions show every beat's last frame with all text in the DOM | [02 Methods 2] | no |
| 9 | No scrolljacking on phones, no text that only exists inside a scroll scene | [01 §9]; [02 §Q5] | no |
| 10 | Server-rendered semantics: Service, FAQPage, BreadcrumbList, ProfessionalService on every route | [02 Methods 9] (WPO + Semantics + Markup = 0.55 of the dev score) | no |
| 11 | A real photo and name of Nati near the top | [01 Top 5]; [03 §7] | **needs a photo from Nati** (none in the repo; no downloads allowed) |
| 12 | A dated mobile score with a re-test link | [03 §4.1] | only after a fresh measurement of the live shot build |
| 13 | Real client sites in the portfolio | [01 Top 15]; [03 §7] | **needs Nati's list** |

## Per page

### Home (the one shot)
1. **H1 with the offer.** "אתר שמביא / פניות לוואטסאפ" with a sub that carries two facts the visitor can hold us to (built from scratch, 2 to 3 weeks) [04 Part C option 1; 01 §1]. The H1 stays one LCP block with a `<br>`.
2. **Chapter verbs.** Each chapter carries its verb (מכירים, בוחרים, בונים, מתחילים, מקבלים) as a printed kicker, so the long camera move has visible places [02 Methods 3, 8; critic #10]. A sequence, so numbering is honest here.
3. **The build scene must carry text.** Five of 22 phone screens carry nothing to read (the build hold and the pull-back) [walkthrough]. Add a caption to each held beat, in the DOM.
4. **The finale must say something.** The pull-back ends on one phone: say what it means and offer the action [critic #10; 02 §Q3 footer finale].
5. **FAQ from real objections:** price drivers, ownership, what happens after year one, revision rounds, who you talk to [01 §4; 03 §7]. Answers start-aligned (four centred lines read worse) [impeccable P2].
6. **No duplicate lines** ("מדברים ישירות עם המפתח, בלי מתווכים." appears twice) [critic #10].
7. **Desktop overview:** the sub and CTA render small at scale 0.64 [critic #11].

### Each service page (one page sells one service)
Structure from [01 §7] and [03 §7], about 500 words [01 Top 12]:
1. Hero sheet: the service name (H1, for search), one outcome line, the WhatsApp action and a quieter "how it works" link, all in the first phone screen.
2. The service's own object from the desk (phone, loupe, bubble, cassette, frame, laptop) with its Lottie: the page is the same desk.
3. What you get (outcomes, no stack names).
4. How it goes, with times (an ink line through the steps).
5. What it costs: what is always included, VAT, the deposit, what moves the price; "price on WhatsApp within a day" style honesty, no numbers.
6. FAQ (the notepad).
7. Final action, then the other services as objects on the desk.
Service-specific: SEO stops promising page one [04]; chatbots stop "24/7" and "חכמים" [03 §3]; video and tapes state formats and the MP4 delivery [03 §7]; memory videos sell the human edit and point to the real sample [03 §7].

### Portfolio (/portfolio/memory-videos)
The video is the proof: it plays in a frame on the desk, the description reads as a production note (what came in, what was made, where it was shown), then one action [02 Methods 6, 10].

### Legal pages
One plain sheet on the table, the same header and type, a readable measure, a sheet index at the top, no camera move [02 §Q4, Methods 12]. Legal text unchanged except hyphens [mission rule 4].

### 404
An empty spot on the same desk where the page should be, a true 404, and routes to services, WhatsApp and home; drop the wave pun "נסחף עם הגל" (rejected in #62) [02 Methods 11; 01 §8; walkthrough].

## The signature moment for this round
**The sheet you tap becomes the page.** A service label on the home page and the hero sheet of its service page share one paper: with cross-document View Transitions the browser morphs one into the other on a normal link, with no JavaScript, and it falls back to an ordinary page load where unsupported or under reduced motion. The same happens between service pages (the next service's object becomes its hero object). It extends the one shot across routes without a new look and is native to a tap [02 Methods 1].

## For Nati (never shipped without him)
- A photo of himself for the home page and the contact card [01 Top 5].
- Which client sites may be shown [world dossier W21].
- Real "from" prices, if he wants them published (market bands in [03 §2]).
- Terms 9.1: the 10% cancellation fee may exceed the consumer cap (5% or 100 ₪) for memory videos and tapes; a lawyer should look [03 §6].
- Revision rounds: Terms says "עד שני סבבי תיקונים"; the video FAQ said "2 עד 3". The site now follows the Terms.
