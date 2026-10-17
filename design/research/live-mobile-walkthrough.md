# Live site walkthrough at 390x844 (before the SOTD round)

Observed 2026-10-16 17:25 on https://mediawave.co.il/ (the shot release), by the verification session.
Evidence: frames in `design/audit/sotd-before/live-390/` (home-00 to home-21, step 0.9 viewport, motion on, cookie choice stored, lead popup off), `report.json` in the same folder, and `design/audit/sotd-before/psi-live.md`.
Measured facts: home is 16,063 px tall at 390 (19.0 screens); axe 0 and sideways overflow 0 on all 12 routes at 390 and 1440; PSI mobile 81 / 100 / 100 / 100 (LCP 4.0 s, TBT 10 ms, CLS 0).

## Home page, screen by screen

| Frames | What a first-time visitor sees | Intuitiveness note |
|---|---|---|
| home-00, 01 | The lens (video circle) dominates the top half. H1 "העסק שלכם / המומחיות שלנו". The sub line is small grey text. The key button "בואו נדבר על הפרויקט שלכם" carries an "Enter" legend; its label reads small for the main CTA. Black desk props (closed laptop with the mark, a device) cut by the bottom edge. | The H1 says nothing about what is sold or for whom (critic #10). The offer appears only in the sub line. The props read as black shapes, not objects. |
| home-02, 03 | "למה לעבוד איתנו?" with three screens and stock Lotties (purple and blue). | Readable. The Lottie palette is the only colour on the page and fights the grey/white/ink system. |
| home-04 to 07 | "מה אנחנו עושים": six tools, each a black device frame with a Lottie and a paper label with "לפרטים". | Clear but long: about 3.5 screens for six one-line services. "לפרטים" is a small text link with no visible affordance. "מתחילים פרויקט" comes after all six. |
| home-08, 09, 10 | The build hold: a black slab (the closed laptop seen from above), then a wireframe site building on a laptop screen. | About 2.5 screens with no information to read. On a phone this reads as an empty or stuck page. Critic #6: the self-building wireframe reads as a template. |
| home-11 to 13 | "איך אנחנו עובדים / ארבעה צעדים / מהשיחה ועד ההשקה", steps 1/4 to 4/4 on an ink line, each with a Lottie. | Clear. This is the most informative stretch of the page. |
| home-13 to 15 | FAQ notepad, 13 numbered questions with "+", the note "עדיין יש שאלות?" and "צרו קשר". | Fine. Answers are centred (D61). |
| home-15 | "מתחילים?" giant outline word, "דברו איתנו". | Fine. |
| home-16, 17 | Contact card (phone, email, WhatsApp, Instagram), "אנחנו מגיבים לפניות תוך 24 שעות בימי עסקים", the companion laptop with a blank white screen above the form, the form. | The blank laptop face reads unfinished (critic #8). |
| home-18, 19 | The pull-back: a phone with a wireframe miniature of the site, props around it. | About 1.5 screens with nothing to read, after the form, where a visitor who did not write is deciding whether to leave. |
| home-20, 21 | Footer: "עיצוב ופיתוח אתרים מקצועיים לעסקים", links, contact. | "מקצועיים" is the market's cliché word (critic #10). |

Count: about 5 of 22 screens (home-08, 09, 10, 18, 19) carry no readable information, plus the props in the first screen.
No price signal anywhere on the page, no "what you get" until the FAQ, no proof except the process and one memory-video link.
The dock (WhatsApp pill "דברו איתנו" plus the chat disc) is visible from home-03 on and is the strongest conversion element on mobile.

## Service page (`/services/building-websites`, frames services_building-websites-00 to 06)

- Still the old KM paper system: off-white ground, Klein filled button, rounded pills, check-mark cards. It does not look like the same site as the home page.
- Copy is jargon-heavy, against the voice rule: "Next.js", "React", "Tailwind CSS", "Framer Motion", "SSL", "רספונסיביות", "אופטימיזציה", tag pills "React / Next.js / Tailwind CSS" right under the hero.
- Structure: breadcrumb, stock Lottie icon, H1 = the service name, sub line, three prose sections, a feature checklist, FAQ, a CTA pair ("צרו קשר" + "שלחו הודעת WhatsApp"), "שירותים נוספים" pills, then the footer with the large MediaWave WEB DEVELOPMENT logo.
- First mobile screen: no CTA; the first CTA is about 5 screens down.
- No price signal, no timeframe in the hero (the timeframe exists only in the FAQ), no example of the work.

## 404 (`/no-such-page`)

- "הדף הזה נסחף עם הגל" with a wave drawn through "404": the wave motif Nati rejected (DECISIONS #62).
- Klein filled button "חזרה לדף הבית", links "השירותים שלנו" and "יצירת קשר". No offer, no WhatsApp in the page body.

## Desktop at 1440x900 (frames `design/audit/sotd-before/live-1440/home-00` to `home-19`)

- home-00: the overview pose shows the hero sheet small in the middle of a large empty table, with six small props around it; the H1, the sub line and the CTA render small (critic #11). The first impression is mostly empty grey.
- home-02 to 06: the chapters sit on wide stretches of empty table; the service tools are scattered with small paper labels and small "לפרטים" links.
- home-07 to 09: the build hold again shows a black slab and then a wireframe on a laptop, about three screens with nothing to read.
- The desktop header shows four chapter links and the paper key "בואו נדבר", which is clear.

## What this means for the round (input to SYNTHESIS)

1. The first screen must say what is sold and for whom; the lens can stay, but the H1 must carry the offer.
2. Screens without information on a phone (the build hold and the pull-back) need to be shortened or to carry content, or the visitor reads them as a stuck page.
3. The inner pages need the shot system and a CTA on the first screen; the jargon must go.
4. The 404 must drop the wave pun and sell.
