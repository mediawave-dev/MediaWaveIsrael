# Critic M1: the SOTD round, fresh eyes (2026-10-17)

Reviewer: an independent critic (pattern-breaker `references/critic.md`, milestone after the first full build). Judged on what is on screen in the production preview at http://localhost:4191/, not on the builder's notes. Palette, type and the one-shot concept are treated as locked; every fix below stays inside them.

Evidence lives outside the repo, in `G:/tmp/sotd/critic-m1/`:
- `film/mobile/f-NNNN-yNNNNNN.jpg` (390x844, every half viewport, first visit, no cookie choice) and `film/desktop/...` (1440x900).
- `p390/<route>-NN.jpg` and `p1440/<route>-NN.jpg` (every route, cookie choice stored, so the dock shows), plus `report.json` per folder.
- `p320/` (320x568 probe), `probe/menu-390.jpg` (the open menu), `probe/calm-*.jpg` (OS reduced motion).
- Contact sheets of all of the above in `sheets/`.

## Verdict

1. The shot system now holds across all 12 routes: one table, one paper, one ink, the same header, keys and dock; inner pages finally read as the same world as the home page, and nothing overflows at 320 (axe 0, overflowX 0 on every route).
2. The first phone screen states the offer well ("אתר שמביא פניות לוואטסאפ" plus two checkable facts), but on a first visit WhatsApp, the site's own primary action, is nowhere on screen: the hero key goes to a form 14 screens down and the cookie strip replaces the dock until the visitor makes a choice.
3. The two long camera beats that should be the proof (the laptop that "builds this site", the pull-back into one phone) read as grey skeleton loaders and black bezel slabs: about five phone screens where the claim on screen is not supported by the picture.
4. D91 (the sheet becomes the page) is the right signature for this concept, but as built the paper is not the tap target, and every desk object carries a shared name on both pages, so unrelated objects are likely to morph across the screen; it needs dynamic naming before it can be shown to a jury.
5. Today this is a clean, honest, coherent small-studio site at about 6.7 on the Awwwards scale; the gap to SOTD is usability on the first visit, two scenes that do not deliver their promise, generic chapter copy, and a desktop composition that leaves most of the table empty.

Competitor sentence: "A Hebrew one-page site on a grey desk where paper cards slide by, with a WhatsApp button and a FAQ." Most memorable moment: the last frame of the pull-back, one phone on the desk among the props (`film/desktop/f-0032-y014400.jpg`, `film/mobile/f-0034-y014348.jpg`).

## Provisional Awwwards score

| Category | Weight | Score | Why |
|---|---|---|---|
| Design | 40% | 7.0 | Disciplined palette and type, real paper craft (the quote slip, the notepad, the ruled checklist); loses on empty desktop tables, skeleton-box scenes, a template numbered eyebrow and stock Lotties in blank frames |
| Usability | 30% | 6.0 | No WhatsApp on a first visit, the hero key jumps to a far form, service cards not tappable as cards, the menu does not list services, holds stay long under reduced motion |
| Creativity | 20% | 7.0 | One camera over a desk plus cross-document view transitions is a real idea; the two signature beats do not yet land |
| Content | 10% | 6.5 | Honest price slips and timelines on service pages; generic chapter headings on home, no human face, no website proof, 4 steps on home vs 5 on service pages |
| **Weighted** | | **6.65** | Calibration: Heron AI (SOTD, 12 Oct 2026) scored 7.7 |

Cheapest raises: Usability from 6 to 8 is mostly F1, F3, F6 and F9 (hours, no new art). Design from 7 to 8 is F7, F8 and F16.

## Findings

Counts: P0 1, P1 15, P2 14.

### P0 (blocks shipping)

**F1. On a first visit there is no WhatsApp anywhere on the phone home page, and the hero key leads away from it.**
- Page, viewport: home, 390 and 320.
- Frames: `film/mobile/f-0000-y000000.jpg` through `f-0038-y015855.jpg` (the dock never appears in 39 frames; the cookie strip owns the bottom band the whole way); `p390/home-00.jpg` (consent stored: still no WhatsApp in the hero, the dock steps aside); `p320` probe: visible WhatsApp links on the first screen = none, with and without consent.
- What is wrong: `ShotDock.tsx` hides the dock while `consent-pending` is set, so until the visitor answers the cookie strip the site's one primary action does not exist on the page. The hero key "ספרו לנו על העסק" points to `#contact` (the form, about 14 phone screens down) while the H1 promises "פניות לוואטסאפ". The menu shows WhatsApp only as a plain text line under the form key (`probe/menu-390.jpg`).
- Why it matters: SYNTHESIS item 2 (WhatsApp is the one primary action) and finding 1 (usability on a phone is where this site must win). Many visitors never touch a cookie strip; for them the most important button is gone, and the first key they see sends them on the longest possible trip.
- Fix: (a) let the cookie strip and the dock coexist: the strip sits one row above the dock band (raise `--safe-b` by the strip height while it is open) or the strip's own row carries the WhatsApp key at the inline start; never hide WhatsApp for a pending consent. (b) Make the hero primary key "כתבו לנו בוואטסאפ" with the home prefill (the same `WaKey` the service pages use) and demote "ספרו לנו על העסק" to the quiet text link beside it, or drop it, since "מה אנחנו עושים" already covers exploring. Keep the dock hidden over the hero only because the hero itself now holds WhatsApp.

### P1 (must fix for SOTD level)

**F2. D91 names every desk object on both pages, so unrelated objects will morph across the viewport.**
- Page, viewport: home to any service page, and service to service, all widths (headed Chrome 126+ only; not filmable headless, judged from markup).
- Evidence: `src/look/shot/ShotChoose.tsx` lines 50, 67, 81 (all six labels and all six objects named on home); `src/look/shot/pages/ShotService.tsx` line 54 (the "עוד דברים שעושים כאן" strip names the other five objects `svc-obj-*`); built HTML: `dist/index.html` and `dist/services/building-websites/index.html` both carry `svc-obj-landing`, `svc-obj-seo`, `svc-obj-chatbots`, `svc-obj-video-editing`, `svc-obj-memory-videos`.
- What is wrong: going from home to /services/building-websites forms six object pairs, not one. Five of them pair a home object (above or below the tapped card) with a small object in the strip at the bottom of the new page, so they are tweened from where they lay on home to the bottom of the service page during the 0.52s group animation. Confidence medium: confirm in a headed browser.
- Why it matters: the signature moment must show one paper becoming one page; five objects streaking past make it look like a glitch, which is worse than no transition.
- Fix: name nothing statically. On the old page, in `pageswap`, set `view-transition-name` only on the tapped label and its object (read the target from `event.activation.entry.url`); on the new page, in `pagereveal`, name only the hero sheet and hero object when `navigation.activation.from` is a page that named them. This is the documented pattern for cross-document transitions and keeps the strip unnamed until it is the source of a tap. Keep `vt.ts` as the single place that builds the names.

**F3. The paper looks tappable but only the small "לפרטים" link is.**
- Page, viewport: home, services chapter, 390 and 1440.
- Frames: `p390/home-05.jpg`, `p390/home-06.jpg`, `film/mobile/f-0008-y003376.jpg`.
- What is wrong: each label is a white card with a heading and a line, but the heading, line, paper and object are inert; the only target is the 44px text "לפרטים" at the bottom. The D91 story is "the sheet you tap becomes the page", yet you cannot tap the sheet.
- Why it matters: a non-technical owner taps the card or the object first; nothing happens, and the signature never fires.
- Fix: make "לפרטים" a stretched link (`::after { inset: 0 }` on the anchor, label `position: relative`) so the whole label, and the object above it, opens the service page; raise "ראו דוגמה" above the stretch on the memory videos label. The bubble keeps its own button ("נסו את הבוט") above the stretch.

**F4. The contact form says "שליחת הודעה" but opens WhatsApp, after demanding an email.**
- Page, viewport: home #contact, all widths.
- Frames: `film/mobile/f-0030-y012660.jpg`, `f-0031-y013082.jpg`; code `src/look/sections/Contact.tsx` lines 81 to 90 (no `VITE_CONTACT_ENDPOINT` in the shot env, so every submit is the WhatsApp fallback).
- What is wrong: the label promises a sent message; the result is a WhatsApp window and the status "נשאר רק לשלוח". The email field is required although nobody will email back from a WhatsApp thread.
- Why it matters: D99's own rule (a button that opens WhatsApp says WhatsApp); an honest-voice brand breaking its own promise at the conversion point.
- Fix: while there is no endpoint, label the key "המשיכו לוואטסאפ" and make the email optional ("אם נוח לכם שנחזור במייל"). When Nati adds an endpoint, switch back to "שליחת הודעה". `[קופי: נתי]`.

**F5. In the contact card WhatsApp is listed third, and its value reads "כתבו לנו", the form's verb.**
- Page, viewport: home #contact, 390.
- Frame: `film/mobile/f-0029-y012238.jpg`.
- What is wrong: order is phone, email, WhatsApp, Instagram; the WhatsApp row's value "כתבו לנו" is the same words D99 reserved for the form, and the same words as the header key that goes to the form.
- Why it matters: one verb per destination (SYNTHESIS item 4) breaks exactly where the visitor chooses a channel.
- Fix: WhatsApp first, as the full ink key "כתבו לנו בוואטסאפ" above the card; phone and email stay as quiet rows below; drop the WhatsApp row from the list.

**F6. The menu does not list the services, and WhatsApp is its weakest line.**
- Page, viewport: every page, phones and tablets.
- Frame: `probe/menu-390.jpg`.
- What is wrong: five chapter links, then a large "כתבו לנו" key (form), then "וואטסאפ" as plain text, phone, email. A visitor who came for "קידום בגוגל" must open the menu, tap שירותים, scroll the home page, find the card and tap "לפרטים". On inner pages the same five links all leave the page.
- Why it matters: "can a non-technical owner find services and WhatsApp without thinking" is the brief; today services are three steps away from anywhere.
- Fix: under "שירותים" print the six services as a two-column ruled sub-index (their real page links); make WhatsApp the ink key and the form a text line. The menu stays the same white ruled sheet (D89).

**F7. The build scene shows a skeleton loader, not "this site", for three phone screens.**
- Page, viewport: home #process, 390 (and 1440).
- Frames: `film/mobile/f-0014-y005908.jpg` to `f-0019-y008018.jpg`; desktop `film/desktop/f-0012-y005400.jpg` to `f-0018-y008100.jpg`.
- What is wrong: one static caption ("על המסך נבנה האתר הזה...") sits above a laptop whose screen fills with grey rectangles; only the last frames add a lens circle and black bars. Nothing on the screen resembles the hero the visitor just read. Three viewports of near-identical frames is the dead-zone threshold.
- Why it matters: the caption makes a claim the picture does not prove; jurors read grey boxes as a placeholder, and this is the site's longest hold.
- Fix: build the screen from real fragments of the hero: the actual H1 words set in Noto 800 at screen scale, the real ink key, the real lens poster, the six objects in a row; let each third of the hold change the caption (for example "קודם השלד", "אחר כך המילים שלכם", "ואז זה עולה לטלפון", `[קופי: נתי]`), as SYNTHESIS home item 3 asked. On phones shorten the hold from 300svh to 200svh.

**F8. The pull-back has no match frame; it cuts from the letter to black bezels and a wireframe.**
- Page, viewport: home, after #contact, 390 and 1440.
- Frames: `film/mobile/f-0031-y013082.jpg` to `f-0034-y014348.jpg`; desktop `film/desktop/f-0028-y012600.jpg` to `f-0031-y013950.jpg`.
- What is wrong: SPEC says the pull-back starts "as close as the real letter". In the frames, the real form scrolls away and black slabs (the bezel at extreme zoom) and a black-bar wireframe (`Mini.tsx`) take over; about two phone screens carry no words except a URL.
- Why it matters: a matched cut is the whole point of the move; without it the beat reads as a different illustration, not a camera pulling back.
- Fix: make the phone's first screen a still of the real letter (a poster rendered from the contact chapter at the same crop, generated at build like the Lottie posters), cross-fading to the mini wireframe only once the phone is smaller than half the viewport. Show the finale line ("את האתר הזה בנינו כאן...") pinned at the top from the start of the hold, not only after it.

**F9. Under OS reduced motion the holds keep their full length: about seven screens of near-static scrolling.**
- Page, viewport: home, 390, `prefers-reduced-motion: reduce`.
- Frames: `probe/calm-42.jpg` (the build at rest), `probe/calm-23.jpg` (the pull-back at rest); measured page height 16,595px, the same as with motion (hero 1,688px, process 4,523px, deliver 1,969px).
- What is wrong: CALM keeps the 200svh, 300svh and 200svh sticky stages and only shrinks the angles, so a visitor who asked for less motion scrolls the longest stretches of the page past a nearly still laptop and phone.
- Why it matters: accessibility is the category SOTD sites lose most (SYNTHESIS finding 1); long empty scroll is its own barrier, and the jury tests with reduced motion.
- Fix: under CALM give every hold its REDUCE height (the last frame as the layout, about 100svh each) and keep only the small angle moves; the stage height belongs to the motion, so it goes with it.

**F10. The "unlit" Why-us screens are blank grey boxes that read as broken images.**
- Page, viewport: home #why-us, 390.
- Frames: `film/mobile/f-0005-y002110.jpg` (the third screen is an empty grey rectangle; the first, already played, is empty except a pale ellipse), `f-0004-y001688.jpg`.
- What is wrong: "screens that light one at a time" is executed as off = empty.
- Why it matters: an empty frame with a black border is the universal sign of a failed image; it costs trust exactly in the "why us" chapter.
- Fix: the off state shows the Lottie's fullest-frame poster (the posters already exist, `lottie-posters.json`) at reduced contrast behind a thin paper veil, with a small ink power LED in the frame corner that lights when it plays; after playing, return to the poster, never to blank.

**F11. On home, the price signal is one accordion row that answers "תלוי".**
- Page, viewport: home #faq, 390.
- Frames: `film/mobile/f-0025-y010550.jpg` (FAQ row 1 "כמה עולה אתר?"); compare the strong quote slip on `p390/services_building-websites-02.jpg` and `-03.jpg`.
- What is wrong: the service pages carry an honest "כמה זה עולה" slip (VAT included, half up front, hosting from year two 500 to 800 ₪, a written quote, the hourly rate in the Terms); the home page, where most visitors decide, hides all of it inside a closed FAQ row whose answer starts "תלוי".
- Why it matters: SYNTHESIS item 5 and finding 4: the honest proof exists and is buried.
- Fix: put the same quote slip component on home, at the end of the services chapter (after websites, before the laptop opens): what is always included, VAT, the deposit, what moves the price, the reply time. A "from" price only if Nati provides it.

**F12. Stacked headlines: two or three display lines compete in one screen.**
- Page, viewport: home #process and #contact, 390 and 1440.
- Frames: `film/mobile/f-0020-y008440.jpg` ("איך אנחנו עובדים" and then "ארבעה צעדים מהשיחה ועד ההשקה" set larger than the H2); `film/mobile/f-0028-y011816.jpg` and desktop `f-0027-y012150.jpg` ("מתחילים?" giant word, then kicker "05 כותבים", then H2 "דברו איתנו", then the sub).
- What is wrong: the subordinate line is bigger than the heading it serves; in contact, the big word, the kicker and the H2 all say "start here".
- Why it matters: hierarchy is the first thing a design juror reads; a phone screen with three headlines has none.
- Fix: in process, set "ארבעה צעדים מהשיחה ועד ההשקה" as the sub (body size, ink-2) or make it the H2 and drop "איך אנחנו עובדים". In contact, let "מתחילים?" be the heading (mark it up as the H2 with the kicker above it) and drop the "דברו איתנו" line, keeping the sentence under it.

**F13. Home says four steps, every service page says five.**
- Page, viewport: home #process vs /services/*, all widths.
- Frames: `film/mobile/f-0020-y008440.jpg` to `f-0023-y009706.jpg` (1/4 to 4/4) vs `p390/services_building-websites-03.jpg` and `-04.jpg` (שיחה, הצעת מחיר, עיצוב לאישור, בנייה, השקה).
- What is wrong: the written quote, the strongest risk-reversal step, exists only on inner pages.
- Why it matters: content consistency is noticed, and the missing step is the one that reassures a cautious owner.
- Fix: one process everywhere, five steps with "הצעת מחיר בכתב" as step 2; update the home line to "חמישה צעדים" (`ShotProcess.tsx` line 65).

**F14. No human and no website proof for a studio that sells websites.**
- Page, viewport: home and /services/building-websites, all widths.
- Frames: `film/mobile/f-0000-y000000.jpg` to `f-0038-y015855.jpg` (no face, no name of the developer, no client site); the only work sample is the memory video (`p390/portfolio_memory-videos-00.jpg`).
- What is wrong: "מדברים ישירות עם המפתח" is said three times, but the developer never appears; the website service has no example except "this site".
- Why it matters: SYNTHESIS items 11 and 13; for a one-person studio the face is the proof.
- Fix (needs Nati: a photo and a list of approvable client sites): a paper ID card on the desk in the contact chapter with the photo, the name and "עונה בעצמו"; in the services chapter, one printed screenshot sheet per approved client site, landing like the other sheets. Until then, do not fake either.

**F15. The home chapter headings are the generic agency set.**
- Page, viewport: home, all widths.
- Frames: `film/mobile/f-0004-y001688.jpg` ("למה לעבוד איתנו?" with the sub "מה מקבלים כשעובדים איתנו", which repeats it), `f-0007-y002954.jpg` ("מה אנחנו עושים"), `f-0019-y008018.jpg` ("איך אנחנו עובדים"), `f-0006-y002532.jpg` ("ליווי אישי"); /services/memory-videos `p390/services_memory-videos-01.jpg` ("הבינה המלאכותית מזיזה. הסיפור נבחר ביד.", a balanced slogan pair, an AI tell).
- What is wrong: SYNTHESIS's own test ("could sit on any competitor's site") fails for four of six H2s; "ליווי אישי" is on the voice rules' cliché list.
- Why it matters: content is what jurors and owners actually read on the way down; generic headings undo the distinctive H1.
- Fix: outcome headlines in the voice of the hero and the WhyUs cards, keeping the menu labels as they are for navigation. Directions to write from (all `[קופי: נתי]`): why us, about the developer answering himself; services, about what each thing does for the business; process, about knowing the price and the date before starting. Replace "ליווי אישי" with the concrete fact already in its line. Rewrite the memory videos heading as a plain sentence.

**F16. Desktop leaves most of the table empty and shrinks the scene text to body size.**
- Page, viewport: home and service pages, 1440.
- Frames: `film/desktop/f-0010-y004500.jpg` (services as small cards scattered over grey), `f-0012-y005400.jpg` (the build caption alone at 1.05rem in an empty viewport), `p1440/services_building-websites-02.jpg` (steps hugging the right edge, 60% of the width empty).
- What is wrong: the layout is the 390 layout widened; the desk metaphor needs objects arranged on a desk at 1440, not a phone column floating on it. Awwwards jurors review on desktop first.
- Why it matters: Design is 40% of the score and the desktop frames are where the jury forms it.
- Fix: from 1100px, a three-column desk for the services (object above label, labels on one baseline), the build caption at display size beside the laptop (inline start column), and on service pages the steps and the quote slip side by side in two columns.

### P2 (polish)

**F17. The numbered eyebrow "01" plus a bar plus "מכירים" is the most common template reflex, and its rule reads as an em dash.**
- Home, all widths. Frames: `film/mobile/f-0004-y001688.jpg`, `f-0007-y002954.jpg`. Code: `shot-base.css` line 353 (`.shot-kicker b::after`, an 18px bar).
- Why: a numbered kicker over every H2 is the default of 2025 to 2026 AI landing pages; the bar breaks the no-dash rule visually even though it is CSS.
- Fix: keep the verbs, lose the rule: print the verb on a small paper index tab on the sheet's edge (the menu's ruled index already uses this language), number in tabular figures inside the tab.

**F18. Line breaks split phrases and number ranges; widows on several headings.**
- Frames: `p320/c_-0.jpg` ("2 עד" / "3 שבועות"), `film/mobile/f-0000-y000000.jpg` ("אתר" alone at the end of line one), `film/mobile/f-0024-y010128.jpg` ("אחר" / "כך"), `p390/no-such-page-00.jpg` ("לא על" / "השולחן").
- Fix: non-breaking spaces inside number ranges and "אחר כך"; `text-wrap: balance` on subs and short headings, `text-wrap: pretty` on paragraphs; break the hero sub after the first sentence.

**F19. The Latin "Enter ↵" legend sits on every key, including on phones; one key lacks the word.**
- Frames: `film/mobile/f-0000-y000000.jpg`, `f-0027-y011394.jpg` (the FAQ key shows only "○ ↵").
- Why: on a touch screen "Enter" competes with the Hebrew label and means nothing; inconsistency reads as a bug.
- Fix: under `(hover: none)` hide `.lg-word` and keep the glyph and LED; make the FAQ key use the same legend as the others.

**F20. The footer lockup says "WEB DEVELOPMENT" in English on a Hebrew site that also sells videos.**
- Frames: `film/mobile/f-0036-y015192.jpg`, `p390/services_memory-videos-06.jpg`.
- Fix: use the lockup without the tagline (the line under it already says "אתרים וסרטונים לעסקים קטנים, ישר מהמפתח."), or generate a Hebrew tagline variant in `logos/_generator`.

**F21. The footer is a template: "קישורים מהירים", a duplicated "יצירת קשר", about 1.5 phone screens tall.**
- Frame: `film/mobile/f-0037-y015614.jpg`.
- Fix: one sign-off sheet: the logo line, the WhatsApp key, phone and email on one row, legal links on one row, the copyright; drop the quick-links column (the header already has it).

**F22. The 404 hides its own number and pushes its heading below the fold at 320.**
- Frames: `p1440/no-such-page-00.jpg` (the loupe's white lens covers "404"), `p320/c_no-such-page-0.jpg` (dashed box takes 390px; the H1 starts at y 393 of 568).
- Fix: put the loupe beside the number, looking at it; cap the empty spot at about 30svh on phones.

**F23. The "more services" grid leaves one object alone.**
- Frame: `p390/services_building-websites-06.jpg` (five objects in two columns, the last one alone on the right).
- Fix: three columns of small objects at 390 (they fit at 100px), or 3 plus 2 centred.

**F24. A stray blue drop floats before the footer logo on inner pages.**
- Frames: `p390/services_seo-promotion-05.jpg`, `p390/portfolio_memory-videos-01.jpg`.
- Fix: the logo mark's entrance starts from a visible scale (0.6) with opacity, or inner pages skip the entrance.

**F25. The cookie strip gives "דחייה" far less weight than "אישור".**
- Frame: `film/mobile/f-0000-y000000.jpg`.
- Why: unequal prominence is treated as a dark pattern by privacy regulators and by accessibility reviewers; it also lengthens the time the strip blocks the dock (F1).
- Fix: two keys of the same size, paper and ink.

**F26. Fact bullets on the service hero align with the last line when an item wraps.**
- Frame: `p320/c_services_landing-pages-0.jpg` (the square sits beside "מוכנה", the second line).
- Fix: the bullet as `::before` on the first line (`align-items: start` with a top offset of half a line).

**F27. At rest, the hero's top object is cut by the screen edge and its face reads as a warning.**
- Frame: `film/mobile/f-0000-y000000.jpg` (the loupe and bubble with "!!" touches x = 390), `film/desktop/f-0000-y000000.jpg`.
- Fix: keep every object inside the 16px gutter in the rest pose; give the loupe a face that cannot be read as "!!" (a magnified Hebrew word, per D98's own description).

**F28. The legal pages have no index.**
- Frame: `p390/terms-00.jpg` (about nine phone screens of terms with no jump list).
- Fix: a ruled index at the top of the sheet, the same style as the menu, linking to each numbered section (SYNTHESIS, legal pages).

**F29. Service page "why" prose is printed straight on the table.**
- Frame: `p390/services_building-websites-01.jpg`.
- Why: DESIGN.md says every surface is a sheet; three long paragraphs on the grey table are the one place text has no paper, and they read as a different, unfinished layer.
- Fix: put the prose on a sheet that lands like the others (`.sp-land`), or set it as three short captions under small objects.

**F30. Small dev smells.**
- `p390/report.json`: the hero's "מה אנחנו עושים" link is 41px tall (under the 44px rule).
- `dist/terms/index.html`: every inner page loads all ten home chapter stylesheets (async, but wasted bytes on a phone).
- Fix: `min-block-size: 44px` on the hero secondary link; split the home chapter CSS out of the inner pages' preload list in the prerender.
