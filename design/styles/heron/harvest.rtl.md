# קציר סגנון: Heron AI (Bearplus)

אתר: https://heronaiapp.com/ (Webflow + באנדל Vite מעורפל, Lenis 1.1.5, GSAP 3.12.5 + SplitText 3.13.0, Barba; נבדק 21.10.2026).
המטרה: לבנות מחדש את הסגנון, לא את הנכסים.
בסיס: `C:/Users/User/.claude/skills/site-director/references/heron-case.md` (מקרה מאומת); כאן רק מה שנמדד או נוסף עכשיו, והערכים מהמקרה מסומנים "(case)".
כל ערך אחר מגיע מקוד שנקרא כטקסט, ממדידה בדפדפן, או מפריים.

קבצי מקור שנקראו (טקסט בלבד, `G:/tmp/harvest/heron/`):
- `index.html` (262 KB, כולל 6 בלוקי `<style>` inline; שלד: `_skeleton.txt`, CSS inline: `_inline-css.txt`)
- `webflow.css` (`heronai.webflow.shared.9f21166e0.min.css`; טוקנים וסולם טיפוגרפי: `_tokens.txt`, `_tokens2.txt`)
- `main.js` (290 KB, מעורפל, נקרא לערכים מילוליים בלבד: `_h1.txt`) ו-`config.js`

צילום (GPU, ANGLE d3d11):
- 1440x900: `G:/tmp/harvest/heron/film-desktop/` (78 סטילים: preloader, הירו, sweep של סמן, שתי גרירות על השרטוט, hover על כפתור, לחיצה, ואז שליש מסך לכל צעד)
- 390x844 DPR 2, UA של iPhone, touch: `G:/tmp/harvest/heron/film-mobile/` (61 סטילים)
- מדידות חיות: `film-desktop/meta.json`, `film-mobile/meta.json`
- דפי מגע: `G:/tmp/harvest/sheets/heron/heron-1440.jpg`, `G:/tmp/harvest/sheets/heron/heron-390.jpg`

הערה: הבאנר של העוגיות נדחה ("Reject") לפני הגלילה, כי הוא מכסה את הפינה הימנית התחתונה.
הערה: התוכן בדף הבית השתנה מאז ה-case: H1 הוא עכשיו "An AI agent that works inside your design tools", והפרקים הם Observe / Act / Learn בתוך "Built to work the way you do".

---

## 1. טבלת DNA

| ציר | הערך | מקור |
|---|---|---|
| קרקע (ground) | נייר שרטוט חם אחד לכל האתר: `body` עם `background-image: bg.svg` (טקסטורת נייר), נדגם `#F5F5EE` בשוליים ו-`#F1F1EA` כממוצע מסך ריק. אין סקשן כהה בכלל, אין gradient. מסגרת פנימית `.8rem` סביב כל הדף, עם קו `1px` `#B3B3AF`. | `film-desktop/meta.json` (`bodyBgImg`); `G:/tmp/harvest/heron/colors-desktop.json` (`001-intro`, `029-y2100`); `webflow.css` `.loading{inset:.8rem}` |
| חומר (material) | גרפיט על נייר: שרטוטי חזית (elevation) בקו דק, רנדרים מנוקדים (stipple) בשחור-לבן, תוכניות קומה עם קירות `#282828` עבים וקווי מידה דקים. הצבע היחיד: אדום `#FA3600` (`--content--brand`), רק על הפרות (violations), סמנים, קו התקדמות, כפתור CTA וקישור "Contact us". צורות באוהאוס אדומות (עיגול, מלבן) בסקשן "Made for". | `webflow.css` `:root`; פריימים `008-hero.png`, `049-y7200.png`, `064-y11100.png` |
| טיפוגרפיה | שתי משפחות: BT Grotesk (400/500/600/700 + italics) לכותרות ולגוף, Geist Mono 500 לכל תווית. root נזיל: `0.5787vw` (8.333px ב-1440, 10px ב-1728), `1.199vw` עד 991px, `2.5445vw` עד 767px (9.92px ב-390). נמדד: H1 = 46.67px / 700 / uppercase / ls -0.93px (-0.02em) / lh 1 בדסקטופ, 31.76px / 600 במובייל. H2 = 40px / 600 (4.8rem) בדסקטופ, 31.76px (3.2rem) במובייל. ה-H2 של האינטרו = 33.33px (4rem) שנצבע מאפור `#B4B4B0` לשחור בגלילה (23.82px במובייל). גוף `.txt-16` = 13.33px / lh 17.33px / 400-500 / ls -0.27px, צבע `#282828` או `#282828B8` (72%); במובייל 15.88px / lh 20.64px. מונו `.txt-14` = 11.67px / lh 16.33px / uppercase / 500; במובייל 13.89px. מונו קטן `.txt-12` = 10px, `.txt-10` = 8.33px. | `film-desktop/meta.json`, `film-mobile/meta.json` (`h1`, `h2`, `body`, `mono`); `webflow.css` (`.heading.h1{font-size:5.6rem}`, `.heading.h2{4.8rem}`, `.txt.txt-font-mono`); `_inline-css.txt` (`font-size: 0.5787037037vw`) |
| מבנה | גיליון שרטוט: 12 עמודות, gap `2rem` (16.7px ב-1440); במובייל 4 עמודות, gap `1.6rem`. כל תא תחום בקו `1px` `#B3B3AF` או בקו מקווקו (`ic-dash.svg`, `.5rem 1px`). סרגלים עם שנתות לאורך שולי ההירו והמפה, `+` בכל פינה, וקואורדינטות חיות במונו ליד הסמן (`X:713PX Y:690PX`). גובה ההירו `calc(100dvh - 1.6rem)` = 887px. | `webflow.css` (`.grid`, `.line`, `.line-dash`, `--size--max-screen-height`); `_skeleton.txt` (52 `home-hero-ruler-item-line-vertical`, 26 אופקיים); פריים `022-y300.png` |
| צפיפות | נמוכה מאוד: מוקד אחד לכל מסך. יש מסכים שלמים עם 3-4 מילים בלבד ("RIGHT THERE WITH YOU", "FOR THE WHOLE DESIGN"). המידע הקטן (מטא-דאטה, קודי בנייה) כולו במונו 10-12px בשוליים. | דף מגע `heron-1440.jpg`, פריימים `029-y2100.png` עד `037-y4200.png` |
| דימוי | רק מעולם האדריכלות: חזית בית בטון עם עצים חשופים (הירו), מגדל בקו (אינטרו), תוכנית קומה שנבנית (מפה), צילומי בטון בשחור-לבן עם צורות אדומות (Made for), לוגו איזומטרי וכיתוב "HERON AI" בקו מתאר בפוטר. מסכי מוצר (צ'אט, דשבורד) מעוצבים מחדש באותה שפה. | פריימים `008-hero`, `023-y600`, `049-y7200`, `054-y8400`, `065-y11400`, `072-y12810` |
| חתימת תנועה | שקטה וישירה. Lenis על ה-container של Barba (`.main-inner.lenis`, overflow hidden), ScrollTrigger מסונכרן (case). טקסט: צבע עובר keyframes `[from, mid, to]` עם `easeEach:"power2.in"`, משך 1 s (0.8 s בגרסה המהירה), stagger 0.08 (0.03), צבע הדגשה `#FF6B30`. הופעת אלמנט: `scale:1, autoAlpha:1, duration:1.6, ease:"expo.out"`. פרלקסה של הסמן בהירו: lerp 0.1, רק מעל 991px. שאר משכי הזמן בבאנדל: 0.8 s (11 פעמים), 1 s (10), 0.5 s (6), 0.6 s (4), 1.2 s (3); easings: `power1.out` (4), `power2.in` (3), `expo.out` (2), `power3.out`, `power2.out`, `cubic-bezier(1,0,0.44,1)`. כפתורים: `transform .48s cubic-bezier(.625,.05,0,1)` (התווית מתחלפת למעלה/למטה). | `main.js` (`keyframes:{color:[`, `duration:1.6,autoAlpha:1,ease:"expo.out"`, ספירת `duration:` ו-ease); `webflow.css` `.btn-fill-label-inner` |
| פתיחה | preloader בתוך המסגרת `.8rem`: שרטוט קו של החזית, קו אדום אופקי `1px` שיורד עם האחוזים (`93%` במונו אדום), `+` אדום עם קריאת `Y:-7PX` בפינה, למטה משמאל "DESIGNED BY BEARPLUS, THE AWARD-WINNING DESIGN AGENCY" ב-H גדול, ובימין טבלת מטא-דאטה במונו (TYPE / FOUNDED / FOCUS / LOCATION) ויומן "001 INITIALIZE CORE SYSTEM ... 008 ENABLE REAL-TIME PROCESSING". יציאה: פריטי ההתקדמות זזים (`y`, צבע ל-`#b3b3af`, 0.8 s), `--trans-percent` 0→50% ו-`--mask-percent` (0.8 s), `--size--line` 0→ערך (0.8 s), שכבה autoAlpha 0.32→0 (0.5 s), ואז השרטוט מתמלא ברנדר של ההירו. | `webflow.css` `.loading*`; `main.js` `"--trans-percent":"0%","--mask-percent":"0%"`, `"--size--line"`; פריים `001-intro.png`, מובייל `000-intro.png` (85%-97%) |
| סאונד | אין. | אין `audio` ב-HTML או בבאנדל |
| סמן | בדסקטופ בלבד (`.cursor{display:none}` עד 991px): canvas 1440x900 שמחובר ל-body (נמדד), נקודה מרובעת 9px עם lerp 0.18 ושובל מעל מהירות 1.5 (case). מעל השרטוט: קווי כוונת אופקיים ואנכיים שנמשכים עד הסרגלים, `+` אדום, וקריאת `X:...PX Y:...PX` במונו 8px. CSS גיבוי: `.cursor-inner` עיגול `.6rem` `#DD6013`. | `film-desktop/meta.json` (`cursorEls`); `webflow.css` `.cursor`; `main.js` (`.home-hero-cursor-line`); פריימים `013-drag.png`, `022-y300.png` |

---

## 2. מלאי הרגעים לפי סדר הגלילה (1440x900, גלילה כוללת 12810px)

קצב הסקשנים (גובה בפיקסלים, נמדד): hero 887, intro 723, problem 743, map 6300 (sticky, 7 מסכים), platform 710, why 2040, usecase 887, footer 711.
במובייל (גלילה כוללת 11023px): hero 828, intro 863, problem 869, map 4819, platform 927, why 807, usecase 997, footer 1239.
מקור: `meta.json` (`m1.secs`).

| # | גלילה | מה זז | מה מניע | משך / easing / קבועים | פריים |
|---|---|---|---|---|---|
| 0 | טעינה | קו אדום יורד על שרטוט קו, אחוזים במונו, יומן מערכת | התקדמות טעינה | ראו "פתיחה" | `001-intro.png` |
| 1 | 0 | השרטוט מתמלא לרנדר מנוקד; ה-header (לוגו + 5 תאים במונו) וה-H1 עם עמודת הגוף ו-"DISCOVER MORE →" אדום מופיעים | סיום הטעינה | 0.8 s | `002-intro.png`, `008-hero.png` |
| 2 | 0 | תווית שחורה "CLICK AND DRAG YOUR MOUSE TO SEE VIOLATIONS" (מונו 8px לבן על `#282828`), שני ריבועים אדומים קטנים על נקודות ההפרה | קבוע | | `008-hero.png` |
| 3 | 0 | קווי כוונת עד הסרגלים + קואורדינטות עוקבים אחרי הסמן; פרלקסה עדינה של השרטוט | pointer | lerp 0.1 (פרלקסה), 0.18 (סמן) | `009-sweep.png`, `010-sweep.png` |
| 4 | 0 | גרירה: מלבן בחירה עם מסגרת אדומה דקה ו-gradient אדום שקוף בכיוון הגרירה; כרטיסי הפרה אדומים `#FA3600` עם טקסט מונו לבן ("IBC 1011.11 HANDRAILS REQUIRED.", "IBC 1015.3 GUARDRAIL REQUIRED FOR FALL PROTECTION") ו-× | גרירה, יחס 1:1, סף 2px (case) | הכרטיסים נשארים אחרי שחרור | `012-drag.png`, `013-drag.png`, `015-drag-release.png`, `017-drag2.png` |
| 5 | 0 | hover על כפתור: התווית מתחלפת אנכית, רקע מתמלא בפיקסלים (mask-position על `--ph-mask-image`, 2000% רוחב) | hover | `.48s cubic-bezier(.625,.05,0,1)` | `019-btn-hover.png`, `020-btn-hover2.png` |
| 6 | 0-300 | marquee במונו: "FEWER MISTAKES ⬡ LESS BUSYWORK ⬡ FASTER ITERATIONS" רץ אופקית מתחת ל-H1 | זמן | | `022-y300.png` |
| 7 | 300-900 | H2 האינטרו (33px) נצבע מילה אחר מילה מאפור `#B4B4B0` לשחור `#282828` | scrub | | `022-y300.png`, `023-y600.png` |
| 8 | 600-900 | מעבר "דיו": מגדל בקו (סקיצה) הופך לרנדר עם עיגול אדום; ה-mask עם feTurbulence (baseFrequency 0.045 0.055, 4 octaves, seed 5) → feDisplacementMap 100 → feGaussianBlur 1.8 → feFuncA slope 2.2 intercept -0.6 (case) | scrub | 5 מופעים של `.ink-mask` בדף | `023-y600.png` → `024-y900.png` |
| 9 | 1200-1800 | "YOUR DESIGN TOOLS DO WHAT YOU TELL THEM, NOTHING MORE" + 4 עמודות בעיות עם אייקונים איזומטריים בקו | scrub | | `026-y1200.png`, `027-y1500.png`, `028-y1800.png` |
| 10 | 2100-4200 | מסך ריק עם "RIGHT THERE WITH YOU" (40px) במרכז, דועך; ואז "FOR THE WHOLE DESIGN" | scrub, sticky | מילים לבד על נייר במשך כ-2 מסכים | `029-y2100.png`, `034-y3300.png`, `036-y3900.png` |
| 11 | 4500-6300 | תוכנית קומה נבנית מקטעי קיר מפוזרים שמתחברים, אפור → שחור; תווית "INTRODUCTION" שחורה בפינה | scrub, sticky | | `040-y4800.png`, `041-y5100.png`, `043-y5700.png` |
| 12 | 6300-7500 | קווי מידה במונו מופיעים, ואז סמני הפרה ממוספרים 01/02/03 באדום, "[CLICK ON VIOLATION]" | scrub | | `047-y6600.png`, `049-y7200.png` |
| 13 | 7500-8700 | "RUN AN AGENT NATIVELY IN YOUR MODEL" + רשימה עם אייקונים; התוכנית זזה לצד; מסכי "HERON CHAT WIDGET" ו-"HERON DASHBOARD" באותה שפה | scrub | | `050-y7500.png`, `052-y8100.png`, `055-y8700.png` |
| 14 | 9000-10500 | "BUILT TO WORK THE WAY YOU DO": פסים שחורים OBSERVE / ACT / LEARN על קו אדום אופקי, שרטוטים עם תגיות הפרה אדומות | scrub | | `057-y9300.png`, `058-y9600.png`, `062-y10500.png` |
| 15 | 10800-11700 | "MADE FOR THE PEOPLE IN THE MODEL": צילום בטון ש"ב + עיגול ומלבן אדומים; אקורדיון ARCHITECTS / INTERIOR DESIGNERS / ... עם + | scrub + hover | | `064-y11100.png`, `065-y11400.png` |
| 16 | 11700-12300 | CTA "SEE WHAT HERON CAN DO IN YOUR MODEL" + כפתור אדום "CONTACT US →" | | | `066-y11700.png`, `068-y12000.png` |
| 17 | 12300-12810 | פוטר: עמודות קישורים במונו, לוגו איזומטרי, "HERON AI" ענק בקו מתאר אפור | | | `071-y12810.png` |

במובייל אותו סדר, בעמודה אחת: ההירו ממוסגר עם H1 31.76px מתחת לשרטוט, אין גרירה ואין סמן, ה-marquee נשאר.

---

## 3. למה זה מרגיש רגוע ופרימיום

- קרקע אחת (נייר `#F5F5EE`) ואקסנט אחד עם משמעות אחת (אדום `#FA3600` = הפרה או פעולה). אין gradient, אין זוהר, אין צל, אין WebGL.
- כל קו הוא `1px` באותו אפור `#B3B3AF`: המבנה נראה מצויר, לא מעוצב.
- כותרות גרוטסק כבדות, uppercase וצפופות (-0.02em), אבל בגודל צנוע (47px ב-1440, כ-3.2% מהרוחב). הביטחון בא מהמרווח, לא מהגודל.
- כל תווית קטנה במונו uppercase (8-12px): מטא-דאטה, קודי בנייה וקואורדינטות. זה נותן "מכשיר" ולא "פרסומת".
- מוקד אחד למסך, ומסכים שלמים של נייר ריק עם 3-4 מילים: נשימה.
- תנועה קשורה לגלילה ב-scrub או ישירה 1:1, ומשכים בינוניים (0.8-1.6 s) עם `expo.out`. שום דבר לא קופץ.
- הסיפור כולו בשפה של הלקוח: הפרה, תוכנית, קו מידה, קוד בנייה. ה-swap test עובר.

## 4. מה לא להעתיק (נוסף על ה-case)

- root ב-`vw` בלבד (8.33px ב-1440, גוף 13.33px): קטן מדי וחוסם הגדלת פונט.
- גלילה ב-container עם `overflow:hidden` ו-Lenis: בהדמיית מגע headless, swipe ו-`synthesizeScrollGesture` לא גללו כלל; צולם עם `scrollBy` על ה-container. לבדוק על מכשיר אמיתי לפני שמאמצים.
- תמונה שלא נטענה בזמן הגלילה השאירה טקסט alt גלוי (`058-y9600.png`).
- `config.js` שטוען bundle מ-localhost עם `?dev`.

---

## 5. פריימים שכדאי לראות

1440x900 (`G:/tmp/harvest/heron/film-desktop/`):
- `001-intro.png` - ה-preloader (קו אדום, אחוזים, מטא-דאטה).
- `008-hero.png` - ההירו עם הסרגלים, התווית והבאנר.
- `013-drag.png` - הגרירה: מלבן אדום וכרטיסי הפרה.
- `022-y300.png` - קווי כוונת וקואורדינטות + H2 שנצבע.
- `029-y2100.png` - "RIGHT THERE WITH YOU" על נייר ריק.
- `049-y7200.png` - תוכנית קומה עם קווי מידה וסמני הפרה.
- `058-y9600.png` - OBSERVE על הקו האדום.
- `065-y11400.png` - צילום בטון וצורות אדומות.
- `071-y12810.png` - הפוטר.

390x844 (`G:/tmp/harvest/heron/film-mobile/`):
- `000-intro.png` - preloader מובייל (97%).
- `008-hero.png` - הירו מובייל.
- `010-y564.png` - האינטרו עם המגדל והעיגול האדום.
- `027-y4512.png` - תוכנית הקומה.
- `044-y8742.png` - OBSERVE ו-MADE FOR.
- `053-y10998.png` - הפוטר.
הערה: בכמה סטילים במובייל (למשל `009-y282.png`, `013-y1128.png`) מופיע פס כפול; זה ארטיפקט של צילום מסך עם container גלילה פנימי, לא של האתר.

וידאו:
- `G:/tmp/harvest/heron/film-desktop/visit.webm` (720x450, כל הביקור כולל הגרירות)
- `G:/tmp/harvest/heron/film-mobile/visit.webm` (חצי רזולוציה)

דפי מגע:
- `G:/tmp/harvest/sheets/heron/heron-1440.jpg` (70 פריימים)
- `G:/tmp/harvest/sheets/heron/heron-390.jpg` (54 פריימים)
