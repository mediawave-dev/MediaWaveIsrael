# HANDOFF — MediaWave Israel

> **לסשן הבא:** `.context/NEXT-SESSION-PROMPT.md` מכיל את כל הקונטקסט של סשן העיצוב מחדש (13/10/2026). המשימה הראשונה: Claude Design ו-`/design-sync`.

## 🏁 סשן 16-18/10/2026: סבב SOTD אוטונומי (מחקר, תוכן, דפים פנימיים, פסים, דיפלוי)

- **מטרה:** הבקשה של נתי: מחקר עומק על איך אתר שמוכר שירות כזה צריך להיראות ולהישמע, עדכון התוכן והעיצוב בכל הדפים ברמת Site of the Day, מובייל קודם, 60fps, ועלייה לפרודקשן עם דרך חזרה בצעד אחד. הבריף: `.context/SOTD-SESSION-PROMPT.md`. הדוח לנתי: `.context/SOTD-REPORT.rtl.md`.
- **ענף:** `sotd/20261017` ב-worktree `G:/Web-Dev/MediaWaveIsrael/.claude/worktrees/sotd-20261017-dbce51`.
- **הושלם:**
  - מחקר: `design/research/01-04` + `SYNTHESIS.md`. תוכן: קופי חדש בכל האתר, יומן ב-`design/copy/CHANGELOG.rtl.md`.
  - דפים פנימיים ב-shot (D90), מעבר "הדף שלוחצים עליו הופך לדף הבא" (D91, D103, `vt.ts`).
  - פלטה שחור, לבן ושמנת בארבעה פסים (D109, D110, בקשת נתי). DESIGN.md מעודכן.
  - שלושה סבבי ביקורת: מבקר M1, critique סבב 2, חבר שופטים (6.5), ביקורת סבב 2 בעיניים חדשות (6.9): `design/audit/SOTD-REVIEW.md`. כל הממצאים מתועדים ב-D111 עד D115.
  - ניווט בין דפים לפרקי דף הבית נוחת על הפרק (D115, `scripts/qa/cross-page.mjs`).
  - תמונת שיתוף חדשה בפסים (`scripts/generate-og-image.mjs`), כתובות עם לוכסן (D113).
- **החלטות:** D90 עד D115 ב-`DECISIONS.rtl.md`, כולן מסומנות לאישור נתי.
- **פתוח לנתי:** תמונה שלו, אתרי לקוח, מחירי "החל מ", דמי ביטול בתקנון 9.1, הצהרת הנגישות (תאריך, תקן, שם רכז נגישות), השם "נתי" במכתב, זמן עבודה לווידאו, האם 24 שעות זו התחייבות.
- **פתוח בבנייה:** ביצועים במובייל בדף הבית (Style & Layout כבד, כנראה ממדידות GSAP), מיני האתר בטלפון עדיין פסים וקוביות ולא הטקסט האמיתי, אנימציית Lottie שמתחילה מפריים ריק (N8), קישורי הפתיחה ב-320 בלי חצים (N6).
- **קבצים:** `src/look/shot/pages/*` (הדפים הפנימיים), `src/look/shot/vt.ts`, `src/motion/ScrollEngineProvider.tsx` (נחיתה על #hash), `scripts/rollback-sotd.cmd`, `scripts/qa/all-pages.mjs`, `scripts/qa/cross-page.mjs`, `scripts/qa/lh-all.sh`, `design/audit/sotd/` (חפיפות ומדידות), `design/audit/SOTD-REVIEW.md`.
- **18.10 בבוקר:** התיקונים של נתי מהאתר החי (D116: בלי א' בזכוכית המגדלת, "עסקים" במקום "עסקים קטנים", אייקונים בכרטיס יצירת הקשר), תיקון ללשונית ישנה אחרי עלייה, וצבעי לוגו חדשים: Cyanotype (D117, נבחר מבין ארבעה כיוונים; ההשוואה ב-`design/audit/logo-palettes.png`). main = 023b34d. מקור הצבעים: `scripts/brand-palette.mjs`, ואחריו `npm run build` מעתיק את האייקונים.
- **באוויר מ-18.10.2026 07:42** (בבקשת נתי, אחרי ששמע מה לא עבר): main = 2dc9b5c, Cloudflare 5168afee. לחזרה: Cloudflare dashboard > mediawaveisrael > Deployments > 70fdf629 > Rollback; או `scripts\rollback-sotd.cmd` (התג prod-before-sotd = c718588 נדחף לפני העלייה); החזרת האתר החדש: `git push origin sotd-live:main --force-with-lease`. PageSpeed חי: דף הבית 79 במובייל ו-100 במחשב, דף נחיתה 95 במובייל. שלושה שערים לא עברו לפני העלייה: Lighthouse מקומי 65, impeccable 13/20, critique 29/40. - **הבא:** החלטה של נתי על העלייה; סבב ביצועים במובייל לדף הבית (ScrollTrigger ו-Style & Layout); P2 מהביקורת (N6, N8, N9).

---

## 🚀 סשן 16/10/2026 (אחר הצהריים): בדיקת impeccable, תיקונים, תפריט מלא, עלייה לפרודקשן

- **מטרה:** בדיקת איכות במובייל עם impeccable, תיקון כל מה שעלה, ואז העלאת shot לפרודקשן עם חזרה מהירה.
- **הושלם:**
  - **דוח impeccable:** `design/audit/impeccable/AUDIT.rtl.md` (14/20 לפני התיקונים). P0: החלון "השאירו פרטים" נפתח בתוך הדף; תוקן. P1: מדידת הפס התחתון החזירה 0, חפצי הפתיחה נראו כמשולשים שחורים, המשיכה לאחור נפתחה על מסך ריק; תוקנו.
  - **התפריט (D89):** חמישה פרקים בסדר הדף, נקודה ליד הפרק שבו נמצאים, וואטסאפ בתחתית. בדסקטופ ארבעה בשורה העליונה.
  - **טקסט:** טווחי מספרים בלי מקף ("2 עד 3 שבועות"), בנוסף לסבב המקפים הקודם.
  - **DESIGN.md** מתאר עכשיו את shot.
  - **אימות על בילד הפרודקשן:** חפיפות 0 בחמשת הרוחבים, axe 0, אין גלילה לצדדים, הדף מוצג בלי JS, tsc 0.
  - **commits (7 מעל הפרודקשן):** הפופאפ לפי כוונה (6bc7ac2, מ 15/10), המקש, Rive, shot, התפריט, הטקסט, החזרה המהירה; ועוד commit של מסמכים.
- **חזרה מהירה לאתר הקודם (KM, 412b810):**
  1. הכי מהיר, בלי בנייה: Cloudflare dashboard > Workers & Pages > mediawave > Deployments > הדיפלוי של 412b810 > Rollback to this deployment.
  2. דרך git: `scripts\rollback-shot.cmd` (מעביר את main לתג `prod-before-shot` ושומר את מה שעלה בתג `shot-live`).
  3. להחזיר את shot אחרי חזרה: `git push origin shot-live:main --force-with-lease`.
- **פתוח לנתי:** D88 (העדשה בלי פתיחה בטעינה), D89 (הנקודה והוואטסאפ בתפריט), 13 ההחלטות ב SPEC §5, הקופי מממצא 10 של המבקר, תשובות ממורכזות בשאלות הנפוצות, טקסט קטן בפתיחה בדסקטופ (ממצא 11), PageSpeed על האתר החי.
- **קבצים:** `design/audit/impeccable/` (הדוח והמדידות), `design/audit/shot-overlap-3/`, `design/audit/shot-gates-final/`, `G:/tmp/mobile-audit.mjs` (סקריפט הבדיקה במובייל).
- **באוויר:** הענף main בשרת GitHub הוא 1e7d492, והאתר mediawave.co.il מציג את shot. התג `prod-before-shot` (412b810) נדחף לפני העלייה. בדשבורד של Cloudflare הדיפלוי הקודם הוא 0a22fa1b, לחזרה מיידית.
- **תיקון אחרון:** ריבוע סביב כפתור הסגירה (X) בחלון הקופץ בטלפון (נתי). הפוקוס הראשון עובר עכשיו לכותרת החלון (1e7d492).
- **לקח:** טקסט עם backticks לא עובר בתוך מחרוזת של bash במירכאות כפולות (bash מריץ אותו). כותבים קבצים דרך קובץ סקריפט או Write.

---

## 🎬 סשן 16/10/2026: "שוט אחד" בנוי במלואו, סבב בדיקות ותיקונים

- **מטרה:** דף הבית החדש בעיצוב shot ("שוט אחד", D83): תנועת מצלמה אחת מעל השולחן של נתי, מובייל קודם (D84), הדברים הקודמים חוזרים כחפצים על השולחן.
- **הושלם:**
  - **מבנה:** עיצוב shot כ-look רביעי (בנוסף ל-K/M/KM, שנשארים לבנייה: `build:km`). ברירת המחדל של הענף היא shot.
  - **שישה פרקים:** פותחים (צלילה + עדשה), מכירים, בוחרים (הכלים), בונים (המחשב בונה, קו דיו, הצעדים), מתחילים (פנקס, "מתחילים?", כרטיס ומכתב עם המחשב של Rive), מקבלים (התרחקות לטלפון), ופוטר.
  - **כפתורים "המקש"** (D87), **לוגו בקליין עמוק** (D86), **פס עגינה אחד** במקום הכפתורים הצפים.
  - **בדיקות:** חפיפות 0 בכל הרוחבים (320 עד 1440), axe 0, אין גלילה לצדדים, התוכן גלוי בלי JS, LCP הוא ה-H1, CLS 0.0007.
  - **ביצועים מול KM באותה מכונה:** Lighthouse 67 מול 73, במדידה אמיתית LCP של 2.34 מול 2.19 שנ'. הפירוט ב-`design/LEDGER.md`.
- **החלטות בסבב:** D86 לוגו בקליין עמוק; D87 "המקש"; D88 העדשה נטענת רק בתזוזה הראשונה, בלי פתיחה בטעינה (ממתין לאישור נתי).
- **ידוע:** Lighthouse במכונה הזו רועש מאוד (כשהחלונית מנגנת וידאו). המספר האמיתי ייקבע רק ב-PageSpeed Insights על פריסת preview.
- **שאלות לנתי:** 13 החלטות עם ברירות מחדל ב-`design/shot/SPEC.md` §5 (ובעברית בסוף `design/shot/storyboard.rtl.md`), ועוד D88.
- **הבא:**
  1. מבקר עם הקשר נקי (רץ), ותיקון הממצאים שלו.
  2. אישור של נתי ל-preview deploy, ואז PageSpeed אמיתי.
  3. commit של כל העבודה בענף (באישור).
  4. שאר הדפים (שירות, נגישות, משפטי) תחת shot.
- **קבצים:**
  - `src/look/shot/*` (הדף כולו), `src/look/buttons/KeyButton.tsx` + `key-button.css`.
  - `design/shot/{storyboard.rtl.md,SPEC.md,inventory.json,BUILD-NOTES.md}`, `design/ideas/{directions-v2,logo-v2}.html`, `design/ideas/buttons/*.html`.
  - שרת: `npm run dev -- --port 5180` (launch.json "redesign"). בנייה: `npm run build:shot`. אם 4173 תפוס: `PRERENDER_PORT=4190 node scripts/prerender.mjs --dist dist-shot`.

---

## 🎬 סשן 15/10/2026: עיצוב מחדש דרך site-director, כיוון "שוט אחד"

- **מטרה:** עיצוב מחדש מלא של דף הבית דרך הסקיל site-director, ברמת Heron AI. קדושים: לוגו Horizon והאידנט, 13 הלוטים, סרטון ההירו. נתי לבד מאשר שערים.
- **הושלם:** אבחון (`design/DIAGNOSIS.rtl.md`), תיק עולם 24 פריטים, החלטות D65-D85 ב-DECISIONS.rtl.md, פופאפ לפי כוונה (commit 6bc7ac2, `src/utils/lead-intent.js`).
- **החלטות:** D81 הפלטה נעולה (#ECEEF1 / #FFFFFF / #1B1D21, Noto Sans Hebrew), כי נתי אהב אותה; D82 רעיונות "מקישור לאוויר" נפסלו (צמצום ל-390, מחוון, טלפון, טיימקוד); D83 כיוון "שוט אחד"; D84 מובייל קודם מעל הכל; D85 הקונדיטוריה נעצרה.
- **בעבודה:** `/proto-c` (dev בלבד, `src/proto/ProtoC.tsx` + `protoc.css`): צלילה להירו, "איך אנחנו עובדים" על גיליונות שנוחתים, התרחקות לטלפון. מחכה לתגובה של נתי.
- **ידוע:** אין עדיין סטוריבורד ל"שוט אחד" (storyboard.rtl.md ו-CONCEPT.md עוד של הסבב הראשון); קופי חדש מסומן טיוטה; `/proto` הישן נשאר להשוואה.
- **הבא:** תגובת נתי ל-/proto-c, אז סטוריבורד חדש (פרקים, אובייקט, פעימות) והרצת check-artifacts, אז בנייה במקום. commit של design/ ו-src/proto רק באישור. שום push.
- **קבצים:** `design/ideas/directions-v2.html` (ארבעת הכיוונים החיים), `design/shots/proto-c-v1/` ו-`proto-c-calm/` (צילומים), `design/LEDGER.md` (ממצאי המבקר), `design/baseline/` (לפני), דוח הסקילים: `C:/Users/User/.claude/skills-reports/site-director-2026-10-15.rtl.md`. שרת: `npm run dev -- --port 5180` (launch.json "redesign").

---

## 🔭 סשן 13/10/2026 (לילה): הפתיח "העדשה", כפתורי "צמצם", סרטון חדש

- **הים (#62) נפסל** (נתי ומוריה: "הרעיון של גל ממש לא יפה בעינינו"). במקומו (#64): עדשת מצלמה מתחת לכותרת, צמצם של 9 להבים בכחול קליין שנפתח בביקור ראשון; עכבר פותח עוד, לחיצה עושה קליק, גלילה פותחת עד הסוף ומקרבת. `design/rive/lens/` (CONTRACT, `npm run rive:lens`), `src/look/parts/Lens.tsx`, `lens-geometry.js`, `src/look/scenes/HeroLens.tsx`.
- **הסרטון בעדשה:** Pexels 5585952 (גולשת בחנות אונליין על לפטופ, שולחן עגול), בחירת נתי מתוך 4. לולאה הלוך-חזור 7.6 שניות, `public/videos/lens.mp4` + `lens-m.mp4`, פוסטרים `public/images/lens-poster.webp` + `lens-m-poster.webp`. המקור ב-`G:/tmp/mw-media/src`. מראות K ו-M עדיין עם סרטון השולחן (`DESK_FILM`).
- **כפתורים:** "צמצם" (`IrisButton`), עותק הטקסט בתוך הפתח כך שאף אות לא נעלמת.
- **נשאר מהסבב הקודם:** כפתור הנגישות בכותרת בטלפון (#63), הפופאפ לא קופץ בקפיצה לעוגן.
- **חזרה מהירה:** `prod-sea` = הים (43fec68), `prod-before-sea` = האתר שנבנה (5ff210f). `gh auth switch -u mediawave-dev` ואז `git push origin <tag>:main --force-with-lease`, או Rollback בדשבורד של Cloudflare Pages.

---

## 🌊 סשן 13/10/2026 (ערב): הפתיח החדש "הים", כפתורי "גאות", נגישות בכותרת

- **הפתיח (#62):** מוריה לא אהבה את "האתר שנבנה" ורצתה פתיח מפוצץ. עכשיו: הסרטון הוא המים, קו האופק של הלוגו הוא פני המים. בביקור ראשון קו אור משרטט את האופק מימין, גל נכנס מימין וממלא את החלק התחתון בסרטון, מתנפץ בקיר השמאלי ונרגע. אחר כך המבקר משחק במים (עכבר מעל, חוצה, לחיצה, נגיעה בטלפון, גלילה). בגלילה המים מציפים את ההירו. Rive מצייר, הפיזיקה בדף (data binding, 35 נקודות). הקבצים: `design/rive/opener/` (BRIEF, CONTRACT, `build-sea.mjs`, `npm run rive:sea`), `src/look/parts/Sea.tsx`, `sea-physics.ts`, `src/look/scenes/HeroSea.tsx`. ה-HeroStage הקודם (#60) נשאר למראה K.
- **כפתורים (#62):** "גאות": מים בצבע הטקסט עולים מאחורי הטקסט עם הגל של הלוגו וממלאים את הכפתור; הטקסט תמיד מעל ומשנה צבע (נתי ביקש: לא להסתיר את הטקסט). `src/look/buttons/TideButton.tsx`.
- **נגישות (#63):** בטלפון האייקון בכותרת ליד התפריט; הלשונית בצד רק בדסקטופ. הפופאפ של הלידים לא קופץ בקפיצה לעוגן.
- **אימות:** חפיפות 0 (320 עד 1440), axe 0, עוגנים, overflow 0, no-JS, טפסים. LCP בטלפון מואט 2.43 שניות (חציון 3, ברגע הציור הראשון; אלמנט ה-LCP הוא הפוסטר של הסרטון, שמצטייר עם הפריים הראשון). צילומים: `design/rive/opener/shots/`.
- **נתי:** אם לא יהיה מרוצה בפרודקשן, מחפשים רעיון אחר שלא קשור דווקא לגל.
- **חזרה מהירה לפתיח הקודם (אתר שנבנה, 5ff210f):** התג `prod-before-sea`. `gh auth switch -u mediawave-dev` ואז `git push origin prod-before-sea:main --force-with-lease`, או Rollback בדשבורד של Cloudflare Pages לדיפלוי של 5ff210f.

---

## 🎨 סשן 13/10/2026 (סיום): קליין, פונטים, ליטושים, אימות ודיפלוי

- **פלטת קליין (#58):** בחירה 13 מלוח הצבעים (נתי ומוריה). במה `#00113D`, נייר `#FAFAF7`, כחול קליין `#002FA7`. קבצי הלוגו נצבעו מחדש בלי לגעת בגיאומטריה (`scripts/brand-palette.mjs`), אייקונים ותמונת שיתוף מחדש מהווקטור (`?v=5`), וגם מלווה ה-Rive. לוח הצבעים: https://claude.ai/artifact/S2mDmb29A4Lkqe4tznfCb3
- **פונטים (#59):** EFT Betaamango לכותרות (הפונט של האתר החי), IBM Plex Sans Hebrew לטקסט ולכפתורים. הגרש (׳) לקוח מ-Plex כי ב-Betaamango החינמי אין אותו.
- **הוסרו:** סקשן לפני/אחרי (#57), "שישה כלים מרחפים...", "מהרעיון ועד ההשקה...". תוקן הזנב של בועת הצ'אט.
- **נגישות:** קישורים פנימיים מעבירים פוקוס לסקשן; הפופאפ לא נפתח בזמן הקלדה או ניווט במקלדת; שם הכפתור של וואטסאפ כולל את הטקסט שלו.
- **אימות:** חפיפות 0 בכל הרוחבים; Lighthouse מובייל 96 (LCP 2.39s, TBT 50ms, CLS 0.006) מול האתר החי 89; דסקטופ 100/100/100/100; axe 0; ניגודיות 0 כשלים (`design/audit/klein-contrast.md`); slop של האתר הבנוי 25.
- **ידוע:** גלילה במובייל בהאטה פי 4 עדיין עם יותר משימות ארוכות מהאתר הישן (בעיקר בניית הלוטים בשתי ההחזקות). Lighthouse (טעינה) טוב יותר מהישן.
- **מסך פתיחה חדש (#60):** אתר נבנה מול העיניים על מסך הבמה (Rive), והסרטון מתחיל בתוך האתר. `design/rive/hero/`.
- **מרכוז (#61):** כל הטקסטים והאלמנטים ממורכזים, גם ההחזקות בדסקטופ; הלוטים ממלאים את המסגרת בדיוק (לא נחתכים). בפרודקשן ב-5ff210f.
- **טעינה:** רק ה-CSS הראשי חוסם את הציור הראשון (prerender), ה-LCP הוא הכותרת.
- **חזרה מהירה:** `scripts\rollback-prod.cmd` או Rollback בדשבורד של Cloudflare Pages (התג `prod-before-looks` = 58cf21f).

---

## 🎨 סשן 13/10/2026 (המשך): STOP 1 הוכרע, שלב 3 ומלווה ה-Rive

- **STOP 1 (#54, #55):** נתי בחר KM ("ליל השקה"), דמות Rive לטופס צור קשר, ואישר את הקופי המסומן כמו שהוא. `npm run build` רגיל = KM.
- **שלב 3 נבנה:** WhyUs, לפני/אחרי, שלבי העבודה, FAQ (13 השאלות ב-`src/data/faqs.ts`), המילה הענקית, צור קשר, הפופאפ (LeadModal), באנר העוגיות, כפתור הצ'אט ופאנל הנגישות, 404 והעמודים הפנימיים, הכל על הטוקנים של המראה.
- **מלווה ה-Rive (#56):** המחשב הנייד מההירו יושב על הטופס. הוא כותב את ההודעה על המסך בזמן ההקלדה, מקפל אותה לקו האופק בזמן השליחה, וממלא את העיגול לסמל כשהיא נשלחה. בשגיאה השורות חוזרות ונקודה אדומה מופיעה. הקוד: `src/look/parts/Companion.tsx`; הקובץ נוצר מ-`design/rive/companion/build-scene.mjs` (`npm run rive:companion`); החוזה: `design/rive/companion/CONTRACT.md`.
- **נבדק חי:** דסקטופ, טלפון, הפחתת תנועה, הצלחה וכישלון (הבקשה יורטה, שום ליד לא נשלח).
- **הבא:** שלב 4 (אימות מלא: gates, slop-scan, preserve diff, ניגודיות ונגישות, Lighthouse מול ../mw-baseline, חפיפות, חלקות גלילה במובייל מול הפרודקשן, impeccable, סוכן ביקורת אחד), אחר כך STOP 2 ודיפלוי דרך mediawave-dev.
- **שים לב:** כונן C: התמלא (0 בתים). נמחקו 43 פרופילים זמניים של puppeteer מ-Temp. בבדיקות עם puppeteer להגדיר `TEMP=G:	mp	emp`.

---

## 🎨 סשן 13/10/2026: שלושה מראות (K / M / KM) מקוד אחד, עד STOP 1

- **שער 1 הוכרע:** נתי בחר בשני עולמות מהלוח: K (ההשקה) ו-M (עצמים מרחפים). נבנו כשלושה מראות מתחלפים מאותו קוד (DECISIONS #50): K לבד, M לבד, ו-KM (הדף עובר בין הבמה השחורה לחלל הלבנדר).
- **איך מחליפים מראה:** `npm run build:k` / `build:m` / `build:km` (תיקיות dist-k / dist-m / dist-km; `npm run build` רגיל = KM ל-dist). ב-dev: `http://localhost:5173/?look=k|m|km`. אם 4173 תפוס: `PRERENDER_PORT=4174 npm run build:k`.
- **מה נבנה (שלבים 1-2 בבריף):** טוקנים ופונטים (Assistant + Alef, self-hosted, fallback מדוד), הדר ופוטר לכל מראה, משפחות כפתורים עם 7 מצבים (`/states?look=` ב-dev), הירו לכל מראה, ההחזקות: "ההשקה" (מחשב נייד שנפתח ומסתובב, K שירותים, KM איך עובדים) ו"הטיסה" (טסים לתוך כלים מרחפים, M ו-KM שירותים), החלפת במה/חלל ב-KM.
- **בקשת נתי באמצע (#51):** סרטון ההירו מתנגן גם בטלפון, מקידוד קל (189KB) אחרי טעינה ו-idle.
- **שאר הסקשנים (WhyUs, לפני/אחרי, FAQ, צור קשר, עמודים פנימיים):** עדיין בעיצוב הישן, עטופים ב-`.legacy`. שלב 3 אחרי הבחירה.
- **כלי חדש:** `scripts/overlap-audit.mjs` (שום טקסט לא דורך על אובייקט, טקסט או כפתור צף).
- **לוגו חדש Horizon (#52)** והנפשה שלו (#53): טיפה נופלת לעיגול, האופק נשפך ומתייצב, השם עולה, וטיפה קופצת ונוחתת על ה-i. בהדר פעם אחת בביקור, בפוטר לוגו ענק שהגלילה מריצה.
- **מוזג main של הפרודקשן (58cf21f, ‏60521ce):** הבלוג הוסר, תיקוני נגישות ו-iOS.
- **חזרה מהירה לאתר הקודם:** `scripts/rollback-prod.cmd` (או Rollback בדשבורד של Cloudflare Pages). התג `prod-before-looks` = ‏58cf21f.
- **ממתין:** STOP 1, נתי בוחר K / M / KM ומה לשנות. נתי כבר אישר דיפלוי דרך mediawave-dev כשהכל מוכן.

---

## 🎨 סשן 12/10/2026 (המשך): לוח סגנון בשלושה כיוונים, ממתין לשער 1

- **בוצע:** המעבדה הישנה נמחקה; W0 נכנס ל-commit ‏46da290; לוח סגנון ב-`/board` (רק ב-dev, לא נבנה לפרודקשן) ב-commit ‏544fef5.
  - A חדר העריכה: Noto Sans Hebrew צר במיוחד, גרפיט + אדום של נורת REC, הסרטון במוניטור, סרגל זמן, החזקת שירותים שסורקת 6 קליפים.
  - B פוסטר עברי: Karantina, זעפרן/מג'נטה/ירוק, הדפס דואוטון של הסרטון, שדה צבע שמודבק על כל המסך בכל מערכה.
  - C גלריה: Bona Nova, קיר לבן + אדום סלון, הסרטון ממוסגר עם שלט מוזיאון, הליכה לאורך קיר אדום עם 6 הלוטים.
  - בכל כיוון: כפתור עם 7 מצבים לחיצים, וכל הלוטים האמיתיים. הפונטים ברישיון OFL.
- **ממתין:** נתי ומוריה בוחרים כיוון ביחד. קודם צריך לדחוף את הבראנץ' כדי שמוריה תריץ אצלה: נתי מריץ `gh auth switch -u mediawave-dev`, ואז `git push -u origin design/pattern-break-20261012`.
- **אחרי הבחירה:** שלב 2 בבריף (סעיף 8): טוקנים ופונטים, הירו, משפחת כפתורי Rive, החזקת השירותים, שאר הסקשנים, טופס, פוטר ועמודים פנימיים.
- **קופי לאישור נתי** (מסומן `[קופי: נתי]` בקוד): משפט המשנה בהירו, שש שורות השירותים, "נשלח. נחזור אליכם היום".
- Bona Nova 400 נשמר בזיכרון כפונט מועדף של נתי.
- **13/10 המשך:** ל-B נוספו 4 פלטות שקטות (`/board/b?palette=faded|paper|green|ink`, ‏9ecdec4). נוסף `references/idea-bank.md` לסקיל pattern-breaker (20 רעיונות לעמוד שלם), ושלושה מהם נבנו על B ב-`/board/i1` (האתר נבנה מול העיניים), `/board/i2` (השם שלכם בכותרת), `/board/i3` (מכתב ותשובה), ‏5ca4a56. הבראנץ' ב-GitHub עדיין ב-3b664fa: כדי שמוריה תראה את החדש צריך לדחוף שוב (חשבון mediawave-dev).
- **13/10, סבב שני:** נוסף לסקיל `references/direction-bank.md`: 20 עולמות עיצוב מאתרים אמיתיים (בעיקר אתרי החודש והשנה של Awwwards 2024 עד 2026). עשרה מהם נבנו על האתר: `/board/d` עד `/board/m` (מקלט, יום ולילה, שרטוט מפורק, כוכב קטן, קומיקס, אלבום, רחוב, השקה, בית בובות, עצמים מרחפים), כל אחד עם פלטה, פונט, גלילה וכפתור משלו (‏0472929, c4b6b9c). מנוע כפתורים ומעבדה משותפים ב-shared.tsx ו-lab.css.
- **לבירור לפני שימוש ציבורי:** כיוון I (אלבום) משתמש בתמונות המשפחה מתוך memory-video.mp4, וצריך את הסכמת המשפחה.
- **ממתין:** נתי ומוריה בוחרים. הבראנץ' ב-GitHub עוד לא כולל את הסבב הזה (צריך דחיפה דרך mediawave-dev).
- **build:** אם פורט 4173 תפוס (שרת של פרויקט אחר), להריץ `PRERENDER_PORT=4174 npm run build` (f0e7e84).

---

## 🎨 סשן 12/10/2026: שדרוג pattern-breaker + rive-studio → עובר לסשן חדש עם בריף מלא

**להמשך: בסשן חדש להדביק "קרא את .context/REDESIGN-PROMPT.md ובצע אותו".** הקובץ מכיל את כל ההקשר.

- נתי דחה את סבב המעבדה (3 דמואים ב-/lab): כולם נשארו בתכלת ובגל של ים. הוא רוצה **שינוי משמעותי**, ולכן הפלטה ומוטיב הים **שוחררו**. נשארו קדושים רק סרטון הפתיחה ו-13 הלוטים.
- נתי לא אהב קו מתחת לטקסט של כפתור. הוא ביקש עבודה **תכל'ס**: בלי צי סוכנים ובלי סבבי מחקר.
- **branch:** `design/pattern-break-20261012`, עם שינויי W0 שעוד לא נכנסו ל-commit:
  - מנוע גלילה ב-src/motion, עם מדיניות CALM (#47)
  - המרקי הוסר (#48)
  - תיקון הלוטי הכבד (#49)
  - prerender מסמן `__PRERENDER__`
- **המעבדה (src/lab, routes /lab):** נדחתה. למחוק אותה לפני build: ל-Lab C יש 2 שגיאות TS.
- **Rive CLI 1.5.1** מותקן. worktree של baseline נמצא ב-`../mw-baseline`. מדידות הבסיס ב-design/upgrade/baseline (slop 96).

---

## 🧩 סשן בניית הסקיל pattern-breaker (04–05/10/2026) — אפס שינויי קוד באתר MediaWave

**המטרה:** מגה-סקיל ששובר תבניתיות של פרונט-אנד שנבנה ב-AI, מזוקק מהמשאבים בפוסט שנתי שיתף
ומחקר עומק של liavmatzri.co.il. שני מצבים: אתר מאפס (יסודות נכונים בלי סשני תיקונים) ושדרוג אתר קיים.
מכוון ל-2026 ול-Opus 5.5.

**איפה הכל:** `C:\Users\User\.claude\skills\pattern-breaker\` (SKILL.md, 18 קבצי references,
engine + attribute-layer + moves-gallery, 9 סקריפטים, תבניות, GUIDE.rtl.md). המחקר הגולמי
(9 דוחות, ~6,000 שורות) ב-scratchpad של הסשן: `research/*.md`.

**הושלם:**
- [x] מחקר האתר המופתי (מראה מלאה, סרטוני גלילה דסקטופ/מובייל, פירוק הקוד של הכוריאוגרפיה)
- [x] 3 סבבי מחקר רשת (UI-skills, משאבי הפוסט, Opus 5.5, יסודות, שדרוג, Motion APIs, טקסונומיית סלופ)
- [x] SKILL.md + references (כולל foundations.md ו-motion-engine.md), שאלוני AskUserQuestion בעברית
- [x] כלים מאומתים: scroll-film, motion-audit, slop-scan (~120 כללים, 577 בדיקות עוברות), preserve, font-fallback, serve, lint-ask
- [x] באגים אמיתיים שנמצאו ותוקנו במנוע: SplitText שובר שורות בעברית (RTL → שורה אחת), דליפת split אסינכרוני, reveal מאוחר מדי

**נסגר (12/10/2026):** ריצות ההערכה נקטעו (מגבלת סשן + ניתוק רשת), אבל התמלילים שלהן נכרו: 6 סוקרים + 6 מאמתים
מצאו 77 ממצאים מאומתים ותוקנו (מעבדת קונספט שנתקעה על תקרת 128K, סדר שלבי השדרוג, קיזוז עוגנים, באגים במנוע ובכלים).
נוספו `scripts/selftest.mjs` (19/19 עוברים עם `--browser`) ו-`scripts/gates.mjs`. motion-audit על הגלריה: 17/17 בדסקטופ ובמובייל.
**לנתי:** להעתיק `assets/agents/pb-reflex-probe.md` ל-`~/.claude/agents/` (אופציונלי). לאשר את חלוקת העבודה מול mediawave-landing-page.
**אחרי כל שינוי בסקיל:** `node C:\Users\User\.claude\skills\pattern-breaker\scripts\selftest.mjs --browser` מתיקייה עם puppeteer.

**ממצאים על אתר MediaWave עצמו (לא תוקנו, לשיקול נתי):**
- slop-scan על `src/`: 96 ("AI-default template") — 40 fade-up, 26 transition-all, 19 hover-lift,
  ז'רגון בקופי (SEO, אופטימיזציה, ממירים), "גישה אישית" ו"ליווי צמוד" ב-Hero, Outfit כפונט.
- מדידה קודמת (G2): p95 פריים 50ms, long tasks במובייל 4,034ms, 7–10 אלמנטים זזים גם ב-reduced motion (חשיפת WCAG 2.2.2), ה-FAQ כולו fade.
- עותק impeccable המקומי ישן (v3.9.1 מול v4.5.0 upstream).

**צעדים הבאים:** לסיים את ה-eval → לשפר את הסקיל לפי הממצאים → סבב שני אם צריך.

---

## 🚀 דיפלוי שני (06/09/2026, ~08:40) — main = 6a0aabf · יציבות גלילה

נתי דיווח מהטלפון על "תבניות שקופצות בגלילה, נראה לא יציב" וביקש תיקון ודחיפה.

**האבחון (מדוד, לא הערכה):** כל אנימציית כניסה נורתה ברגע שקצה הבלוק נגע בתחתית
המסך, כך שאנימציה של 0.6 שניות עדיין רצה בזמן שהמשתמש גלל מעליה. מדידה בטלפון
(`scratchpad/measure-scrolljank2.mjs`, שני דגימות במרווח 170ms שסופרות רק אלמנט
שבאמת מתייצב): **18 מתוך 21 צעדי גלילה תפסו בלוק באמצע כניסה, 42 בלוקים בסך הכל.**

**מה תוקן (קומיט 6a0aabf):**
- `inViewOnce` ב-`src/config/motion.ts` = טריגר אחד לכל האתר, נורה 600px מראש.
  החליף 31 טריגרים כתובים ביד, שלושה מהם עם margin **שלילי** שאיחר עוד יותר.
- כניסות קצרות יותר (`DURATION.reveal` 0.35s) ומרחק קטן יותר (32→18px, כרטיסים
  40→14px, scale 0.92→0.96); ה-stagger מוגבל ל-0.2s.
- `HowWeWork` עקף את המערכת לגמרי: 40px + scale על springs עם מפל של 0.65s,
  ומספר צעד שהסתובב פנימה מ-scale 0.5 / ‎-10deg. עכשיו אותה עקומה ואותו תזמון.
- מכשירי מגע: אותן תכונות מונפשות אבל עם מגניטודה 0 (מעבר חוצה בלבד, בלי תנועה).
  **לא** החלפת אובייקט — שאילתת ה-pointer מתהפכת אחרי mount, וההחלפה השאירה
  כרטיסים תקועים ב-`translateX(18px)` עם opacity 1 (נתפס במדידה).
- `LottieIcon`: טעינה 800px מראש במקום 200px, ושלד בלי הפעימה התכלת.

**אחרי: 0 מתוך 21 צעדים בטלפון (1 מתוך 14 ב-1440).** שער: 13 עוברים, אותם 2
אדומים ידועים. אומתו גם /services/*, /portfolio/*, /blog/:slug ו-404 (תוכן מוסתר,
גלישה, שגיאות קונסול = 0).

**Rollback לדיפלוי הזה בלבד:** `git revert 6a0aabf` ואז דחיפה ל-main.
**Rollback מלא ללילה כולו:** `git push origin 299cb88:main --force-with-lease`.

---

## 🚀 נדחף לפרודקשן (06/09/2026, ~07:35) — main = c013d93

בקשת נתי: "דחוף לפרודקשן". בוצע `git push origin HEAD:main` (fast-forward מ-299cb88), דרך החשבון
`mediawave-dev` שהיה כבר הפעיל, עם `git -c credential.helper= -c credential.helper='!gh auth git-credential'`.

**מה עלה בפועל: 38 קומיטים**, לא רק 13:
- **24 קומיטים מריצת `upgrade/fable-20260712` (יולי)** — SEO (canonical/OG dedup, 404 אמיתי, breadcrumbs, FAQ ב-HTML),
  נגישות, אנליטיקס first-party, פרפורמנס (paint-first mount, Outfit self-hosted, lottie chunk, CLS).
  העבודה הזו הייתה מגודרת וירוקה מיולי אבל **לא מוזגה** אז, בהמתנה להחלטת נתי (audit/BLOCKED.md §5.4).
  היא ישבה בבסיס של בראנץ' הלילה, ולכן עלתה יחד איתו. זה גם מה שנבדק ונמדד כל הלילה.
- **13 קומיטים מריצת הלילה** (4 משימות השער + 6 באגים מדודים + 3 סבבי פרימיום).
- **1 קומיט תיעוד** (דוח הבוקר + handoff).

**Rollback לפרודקשן** (חוזר למצב שלפני הדחיפה):
```
git push origin 299cb88:main --force-with-lease
```
או Rollback מדשבורד Cloudflare Pages. אימות דיפלוי: `.design-loop/night-20260906/deploy-poll.log`
(סמן: המחרוזת `spotlight-card` מופיעה ב-HTML המ-prerendered רק בבילד החדש).

---

## עדכון אחרון (06/09/2026) — ריצה לילית design-gate (Fable), branch: fix/design-gate-20260906
**13 קומיטים מקומיים (83c9323..b61cf50), לא נדחף.** נתי אישר את 10 הראשונים ב-04:00 וביקש חוות דעת + שדרוג פרימיום; קומיטים 08123cf + 42bb70b + b61cf50 = סבב פרימיום (השלישי = תיקוני הביקורת: overflow-clip לציר ה-view(), סמן, הרמה ב-CSS) (סימן גל תחת כותרות, זרקור בכרטיסים `.spotlight-card` + `src/utils/spotlight.ts`, רדיוס/קצב אחידים, סמן מכונת כתיבה, בלי ping, וידאו WhyUs 20%). חוות הדעת המלאה בתוספת (2) של דוח הבוקר. ~~**10 קומיטים מקומיים (83c9323..b6956c4), לא נדחף. דוח בוקר מלא: `.context/OVERNIGHT_RESULT_2026-09-06.md`. ראיות: `.design-loop/night-20260906/` (gitignored).**
- 4 משימות הפרומפט: EASE_SOURCE/LEGACY_NAME/CONSOLE_ERROR ירוקים; SKY_INK: מילת ההירו תוקנה (הצהרת משטח כהה על #hero), קישורי ההדר = false positive של הדיטקטור (ניגודיות אמיתית 6.4–9:1) — נשאר אדום בכוונה; AXE_CONTRAST = flake של באנר העוגיות באמצע fade (במנוחה 0).
- מעבר לפרומפט (בהיתר נתי): טאב הנגישות חסם את מרכז הבורגר במובייל (P0, עבר ל-top:120px); באנר העוגיות כיסה את שדה הצ'אט (דיאלוגים ל-z-[60], backdrop תפריט z-[55]); 404 פינוי מההדר/FABs; noscript חושף את ה-prerender; טאגליין הפוטר לפי החלטה #31 (שינוי הקופי היחיד); `--ease-tide` טוקן.
- **פתוח לנתי:** ז׳רגון טכני בעמודי /services/*; לוטי LeadModal עם "CONTACT Us"; פופאפ 35 שניות; וואטסאפ ירוק = גוון שני; אזהרת framer PopChild ref (dev בלבד, upgrade patch); שער: SKY_INK ancestor-walk, AXE timing, TOKEN_DRIFT allowlist, verify.mjs בלי scroll-prime.
- **סקריפטים חד-פעמיים** בסקראצ׳פד של הסשן (לא בריפו): shoot-revealed.mjs (צילומים אחרי גלילה), shoot-states.mjs, pixel-diff.mjs, crop.mjs, probe-*.mjs, measure-backdrop.mjs.
- דחיפה: `gh auth switch -u mediawave-dev` → `git push -u origin fix/design-gate-20260906` → PR/מיזוג ל-main. חזרה לאחור: `git revert` לקומיט בודד (כל קומיט עצמאי) או `git branch -f fix/design-gate-20260906 83c9323` אחרי checkout לבראנץ' אחר.

---

## עדכון אחרון (16/07/2026) — ריצת שערים אוטונומית (Fable), branch: upgrade/fable-20260712
ריצה מלאה לפי בריף "MediaWave Site Upgrade": baseline מדוד → תיקונים → שערים על preview.
- **Baseline מלא של הפרודקשן** ב-audit/BASELINE.md (+ audit/raw/, לא ב-git). ממצאי ענק:
  Cloudflare חוסם את כל סורקי ה-AI ב-403 ברמת ה-zone (PROPOSALS #1 — רק נתי יכול לפתוח);
  canonicals כפולים שהצביעו לדף הבית מכל עמוד פנימי; תשובות FAQ לא היו ב-HTML;
  CLS 0.50 בבלוג (fallback 50vh); TBT 25-54s ב-video-editing (לוטי 356 paths);
  אפס מעקב המרות.
- **16 קומיטים** על הבראנץ': SEO (canonical/OG dedup, 404 אמיתי, breadcrumbs), G1 (תשובות FAQ ב-DOM),
  נגישות (קו תחתי לקישור בבאנר, heading-order, פוקוס בווידג'טים, aria-invalid בטפסים,
  sr-only לטייפרייטר, וידאו נעצר מהווידג'ט), אנליטיקס first-party (track() → /api/event, 28 נקודות),
  ופרפורמנס: mount אחרי load+150ms (paint-first), Outfit self-hosted (בלי גוגל פונטס!),
  font-display:optional, skip לאנימציות כניסה בעמודים prerendered, fallback 120vh,
  ווידג'טים אחרי idle, lottie-web מוצמד ל-chunk (היה נמשך לתוך StudioPage 5MB!), canvas renderer ללוטי הכבד.
- **מקומי (שרת gzip)**: הבית 69→88, video-editing 41→76 (TBT 6160→290ms), בלוג 46→82 (CLS 0.007);
  a11y/BP/SEO = 100/100/100. smoke 12/12. צילומי לפני/אחרי זהים (חוץ מהקו-תחתי המכוון).
- **סקיל חדש**: C:/Users/User/.claude/skills/site-gate-audit — צ'קליסט 10 השערים לכל אתר לקוח.
- **סיום הריצה (17/07)**: כל השערים ירוקים חוץ מ-perf/LCP (ראו audit/BLOCKED.md). לא מוזג לפי סעיף 5.4 — ההחלטה אצל נתי: PR מוכן בקליק, PROPOSALS #10 = תפריט ההחלטות לנקודות ה-perf האחרונות.
- /studio תוקן סופית (asset אמיתי, אומת 200 ב-preview v3); 21 קומיטים בבראנץ, נדחף.
- **Rollback לפרודקשן אם צריך**: git push origin 299cb88:main --force-with-lease
  (או Rollback בדשבורד CF Pages). production tip לפני הריצה: 299cb88.

---



## Goal
מימוש DESIGN-UPGRADE "מעבדת הגלים" — ריצה אוטונומית מלאה (03-04/07/2026), branch: `design/wave-lab` (מעל feature/production-polish).

## עדכון אחרון (10/07/2026) — סבב "ליגת על" אוטונומי, branch: `design/premium-league`
בראנצ' חדש מעל design/wave-lab. **לא נדחף / לא מוזג — ממתין להחלטת נתי על דיפלוי.**
- **חוויית מאמר פרימיום** (BlogPost): פס התקדמות קריאה scroll-linked (ReadingProgress.tsx, גרדיאנט sky→teal, נטען מימין ב-RTL, z-60 מעל ההדר), זמן קריאה בעברית תקינה (utils/blog.ts: formatReadingTime — "דקת קריאה"/"X דקות קריאה"), "כדאי לקרוא גם" (2 מאמרים לפי חפיפת תגיות, getRelatedPosts), שורת שיתוף (ShareRow.tsx: וואטסאפ / העתקת קישור עם אישור אינליין / Web Share API), wordCount+timeRequired ב-BlogPosting schema. זמן קריאה גם בכרטיסי /blog.
- **ליטושי CSS רוחביים**: ::selection חזק יותר (0.35, בלי דריסת צבע — עובד גם על משטחים כהים), scrollbar-color ממותג (#BAE6FD, מתכהה ב-high-contrast וב-prefers-contrast), caret-color ב-inputs, רקע html גרדיאנט כהה (overscroll מציג נייבי/שחור במקום הבזק לבן), text-wrap:pretty בפרוזה.
- **פוטר**: קישורים מהירים עברו מ-#ABABAB אפור-שטוח + JS hovers ל-.footer-link (frost-mist) — תיקון הפרת The-Mist-Rule; border-top/מפרידים ל-rgba frost.
- **נגישות מודאלים**: תפריט מובייל + LeadModal — Escape סוגר, role=dialog+aria-modal, מלכודת Tab, פוקוס נכנס וחוזר (דפוס זהה ל-ChatWidget הקיים).
- **404**: מספר בקו-מתאר sky (זהות ה-outline של האתר), קופי גלי ("הדף הזה נסחף עם הגל"), קישורים מהירים, תוקן em-dash בכותרת SEO.
- **SEO**: og:image:alt + twitter:image:alt ב-SEO.tsx.
- **חתימת קונסול** בפרודקשן בלבד (main.tsx, console.info ממותג + קישור וואטסאפ) — חריגה מודעת מכלל "no console.log".
- **כלי חדש**: scripts/screenshot-audit.mjs (צילומי דסקטופ+מובייל של עמודי מפתח; פלט ל-screenshots-audit/ — ב-gitignore).
- **שערים**: tsc נקי, eslint נקי על כל הקבצים שהשתנו, build+prerender מלא, design-verify, צילומי לפני/אחרי.
- **לא נגעתי**: שינויי .gsd/* בעץ העבודה (קדם-קיימים, לא שלי), קבצי junk לא-מנוהלים בשורש.

## עדכון אחרון (06/07/2026) — impeccable + שילוב תוכן + דיפלוי חי
- **דומיין פרודקשן: mediawave.co.il** (חי). ‏mediawaveisrael.com היה שגוי בכל ה-SEO — תוקן (canonical/OG/JSON-LD/sitemap/feed/og-image). פתוח: www.* מחזיר 522 (לחבר ב-CF Pages), Google Search Console.
- **דיפלוי:** push ל-main דרך חשבון `mediawave-dev` בלבד (החשבון של נתי מקבל 403). ‏CF Pages בונה מ-git תוך ~3-4 דק'. אין wrangler מקומי מחובר.
- **impeccable יושם במלואו** (החלטות 37-46 ב-DECISIONS): eyebrow הוסר, MagneticButton נמחק, glow חם→תכלת, focus-ring דו-מצבי, מספרי-צעדים stroke, כרטיסים בלי זכוכית, כל לולאות framer מגודרות, ‎~200 שורות CSS מת נמחקו. דוח: `IMPECCABLE-AUDIT.rtl.md`.
- **תוכן ממוריה שולב** (bundle) בעיצוב wave-lab: 9 מאמרי בלוג (היו 2), 6 שירותים (נוספו עריכת וידאו + סרטוני זיכרונות), עמודי `/services/:slug` + `/portfolio/memory-videos` עם וידאו לקוח אמיתי (9.7MB). גריד הבית 4→6 כרטיסים לבנים. **21 עמודי prerender**.
- **סרטוני זיכרונות:** אייקון SVG סטטי (`/animations/photo edit.svg`) + כפתור CTA בולט "ראו דוגמה לפרויקט" (sky-ink, אייקון play) בכרטיס — השירות היחיד עם דוגמת עבודה אמיתית.
- **שערים אחרי כל שינוי:** axe 0 הפרות (הורחב ל-11 עמודים), mobile-smooth 10/10 (סקריפט חדש `.gsd/temp/verify-mobile-smooth.mjs`), design-verify PASS (סורק כל מסלול לפני צילום), tsc/build 21 עמודים.
- **הגדלת אנימציות (06/07):** כל ה-Lottie/SVG הוגדלו משמעותית לפי בקשת נתי — כרטיסי שירותים 128→180 (chatbots 200 לפיצוי ריפוד פנימי), הירו של עמוד שירות +40 (200-240), WhyUs 112→160, HowWeWork 160→210, Contact 120→180 (0.78 במובייל), LeadModal 100→150, ChatWidget 48→56/44→52. אומת: אפס גלישה בכל רוחב, אפס חריגת-כרטיס, ביקורת ויזואלית יריבותית (6 סוכנים) ממוצע 84/100. חי בפרודקשן.
- **פתוח:** portfolioLink רק ל-memory-videos; שאר השירותים בלי דוגמאות (חסר תוכן). Lighthouse לא נמדד מחדש בסבב זה (מכונה עמוסה — למדוד בבוקר). לוגו ירוק חדש ב-Downloads — לא שולב (המתנה להחלטה).

## Completed (branch: design/wave-lab, ~15 קומיטים)
- [x] **Phase 1** — טוקנים (`--font-spec`, `--text-giant`, `--ease-brand`) + `src/config/motion.ts`; GrainOverlay גלובלי (`public/images/grain.png` 6KB); WaveDivider (3 וריאנטים א-סימטריים, flip/drift/bg, מושהה מחוץ למסך) פרוס בין כל הסקשנים; Marquee טכנולוגיות CSS-בלבד; צללי hover ל-pseudo+opacity
- [x] **Phase 2** — StaggeredWords (פיצול מילים בלבד!) + גל draw-on מתחת ל"המומחיות שלנו"; LoadTimeBadge (LCP אמיתי של המבקר + "בדקו בעצמכם"); ProofBand כהה עם קאונט-אפ (מספרים מדודים בלבד: 97/100, 1.0s, 0.53MB + סלוטים data-pending); מספור מפרט 01· + מילת מפתח צבועה בכל כותרת
- [x] **Phase 3** — BeforeAfterSlider (אפס תלויות, clip-path+CSS var, תמונות דמו עם תווית "הדגמה"); Services hover wipe; HowWeWork קו גלי אחד נמשך; MagneticButton על 3 CTA; מילת הענק "מתחילים?"
- [x] **Phase 4 חלקי** — View Transitions לבלוג (220ms, feature-detected). סמן מותאם/פליגראונד/Lenis — לא (מתועד ב-DECISIONS)
- [x] **תיקון יסוד: קסקדת CSS** — כללי base לא-ממושכבים דרסו את כל ה-utilities של Tailwind v4. הועברו ל-`@layer base`; סקיילינג נגישות עבר לשורש. בעקבות זה: גדלי הירו/כותרות אמיתיים לראשונה
- [x] תיקוני אודיט: אימייל נחתך ב-320, ניווט נשבר ב-768, bidi אינסטגרם, אימייל פוטר, ניגודיות קופירייט, גוון WhyUs חם→קר

## Key Decisions
ראה `DECISIONS.rtl.md` (18 החלטות מתועדות). עיקריות: מונו מערכתי במקום קניית פונט; sky-600 למילות מפתח על רקע בהיר (WCAG); מספרים מדודים בלבד ב-ProofBand; סמן מותאם הושמט.

## Quality Gates (כולם ירוקים בסוף כל Phase)
- tsc + eslint נקיים (3 אזהרות ישנות בקבצי sanity — לא קשורות)
- build מלא + prerender 7 עמודים
- Lighthouse: דסקטופ 97 (שער ≥95), מובייל 71-73 (שער ≥70; baseline היה 69)
- צילומי 320/390/768/1440 + blog/accessibility/404: אפס שגיאות קונסול/רשת/גלילה אופקית
- רגרסיית אנימציות (typewriter, וידאו, Lotties, אקורדיון, תפריט, מרקי, קאונט-אפ, סליידר, גל כותרת) + reduced-motion סטטי וקריא

## Known Issues / Next Steps
1. **ProofBand** — לעדכן ציונים אם ה-final run שונה; להזין מספרי לקוחות אמיתיים ל-data-pending
2. **רישיון EFT Betaamango/OffSet** — עדיין פתוח (לא הוחלף פונט בריצה זו)
3. **טבלת קופי לאישור נתי** — בדוח הסיום; כל מחרוזת חדשה מסומנת `[קופי: נתי]` בקוד
4. ליטושים שנצפו ולא טופלו (מתועדים): ריווח מובייל HowWeWork→FAQ, רשימת קשר דלילה במובייל, ווידג'ט צף מכסה כותרת ב-320, `<a>` מקונן ב-Header/Logo (קדם-קיים), אזהרת fetchPriority (React 18)
5. git push — הכל מקומי בלבד (לפי ההוראה)

## סבב משוב נתי (04/07/2026) — הושלם
- [x] גלים חיים: WaveDivider = 2-3 שכבות גל תקופתיות בלולאת transform חלקה (בלי תפרים), בכל הגבולות; מושהה מחוץ למסך; סטטי ב-reduced-motion
- [x] מרקי טכנולוגיות זורם מימין לשמאל; קו הכותרת בהירו מתנדנד עדין אחרי הציור
- [x] ריווח הירו מההדר (md:pt-44); הוסר הקו התכלת בראש הפוטר
- [x] מילת הענק מתמלאת בגלילה במובייל (pointer:coarse + in-view)
- [x] כל המקפים הארוכים הוסרו מטקסטים מוצגים (23 החלפות)
- [x] אתר הדמו הישן: "עסק לפיתוח אתרים!" בסגנון 2003 (פלאש, ספר אורחים, אקספלורר)
- [x] Lighthouse אחרי הסבב: דסקטופ 97, מובייל 75 (הכי טוב עד כה)

## סבב משוב נתי 2 (04/07/2026) — הושלם
- [x] מדיניות מושן אמביינטית: useAmbientMotion (ווידג'ט = כיבוי מוחלט; דגל מערכת = האטה בלבד לגלים/מרקי, ומכבה רק וידאו/כניסות/מגנטי). לוטי, מכונת כתיבה, אורבים, לופים = תמיד חיים
- [x] הוסרו מהאתר: LoadTimeBadge + פס הסטטיסטיקות של ProofBand (הקבצים נמחקו; בהיסטוריית git)
- [x] הסליידר נשמר בסקשן חדש BeforeAfterShowcase.tsx ("לפני ואחרי", נייבי, id=before-after)
- [x] מרקי הואץ ל-22s; הצהרת הנגישות עודכנה לנוסח מדויק
- [x] אומת: תחת reduce הגלים/מרקי/מכונת-כתיבה זזים; עם הווידג'ט הכל קופא; אפס שגיאות בכל הרוחבים

## סבב משוב נתי 3 (04/07/2026) — הושלם
- [x] תוקן טקסט מפוקסל: הגריין הגלובלי עם mix-blend-mode ביטל ClearType בכל הדף. הוחלף באריח רעש אלפא (grain-alpha.png) בקומפוזיציה רגילה, סקופ לפוטר ולסקשן לפני/אחרי בלבד, מאחורי התוכן. GrainOverlay + grain.png נמחקו

## סבב משוב נתי 4 (05/07/2026) — הושלם (החלטות 26-31)
רקע: "חוסר ההלימה בצבעים" + "קו מתחת לכל מילה" התבררו כמצב ניגודיות-גבוהה שנשאר דלוק בווידג'ט מביקור קודם (localStorage). הצ'אט בוט תקין — אזעקת שווא.
- [x] הגדרות נגישות לא נשמרות יותר: כל טעינה = טקסט רגיל + ניגודיות כבויה + אנימציות. המפתח הישן נמחק בכניסה (useAccessibility.ts)
- [x] ניגודיות גבוהה: פלטה במשפחת התכלת (#0369A1/#0284C7/#075985 במקום רויאל #0055AA), בלי קו תחתון גורף, header-cta לבן; prefers-contrast תוקן ל-more
- [x] ווידג'ט: הכפתור הנבחר קריא — צ'יפ כהה/לבן דרך `.text-size-btn[aria-pressed="true"]` (un-layered; utilities מפסידים שם). כלל data-active המת נמחק
- [x] "בואו נדבר": MagneticButton הוסר; hover חדש = גאות תכלת דו-שכבתית מוכלת (pseudo, transform בלבד, 600ms cubic-out, 130%/88%→-12%). אפס הזזה אופקית — מאומת
- [x] קווים תחתונים סטטיים → hover בלבד (HowWeWork + Contact/LeadModal); הקישור ב-HowWeWork יושר ל-#0284C7. חריגים: prose בבלוג, URLs בצ'אט
- [x] טאגליין: "עיצוב ופיתוח אתרים מקצועיים לעסקים" (הירו, meta, JSON-LD x2, App.tsx, CONTENT.md)
- [x] אימות: `.gsd/temp/verify-a11y-round.mjs` — ‏11/11 (כולל: אפס drift ב-CTA, איפוס מלא אחרי reload, אפס קווים תחתונים בפוטר ב-HC, אפס שגיאות קונסול). צילומים: `g:\tmp\mediawave-audit\wave-lab\a11y-round\`

## סבב משוב נתי 5 (05/07/2026) — הושלם (החלטות 32-36)
- [x] תמונת ה"אחרי" בסליידר רונדרה מחדש מהבילד העדכני (טאגליין קצר). `scripts/generate-demo-images.mjs`
- [x] **ניגודיות כלל-אתרית: טוקן `--color-sky-ink`/`-strong`.** השורש לכל תלונות "לא קריא" היה כלל בסיס גלובלי `a{color:#7DD3FC}` + עשרות text-orange = תכלת פסטל (1.6:1) על בהיר. הוחלף בכחול-שמיים עמוק (#0369A1, 5.9:1) בכל הטקסטים על משטח בהיר: בלוג, משפטיים, נגישות, 404, עוגיות, המלצות, צ'אט, תפריט מובייל, HowWeWork
- [x] **הכפתור "רגיל" בווידג'ט קריא** — צ'יפ כהה + טקסט לבן; מתגי off ל-gray-400
- [x] HC: קישורי הניווט בהדר נאלצים ללבן (הדר תמיד כהה); כל bg-orange CTA מקבל טקסט לבן
- [x] **אכיפה חדשה: `.gsd/temp/contrast-audit.mjs` (axe-core) = 0 הפרות** על 7 עמודים + מצבי ווידג'ט/HC/צ'אט/תפריט. הרץ בכל סבב עתידי כשער
- [x] אימות: axe 0/0, verify-a11y-round 11/11, tsc+eslint נקיים, build+prerender 7 עמודים. צילומי הווידג'ט: `widget-default-regil.png`

## Important Files
- `src/config/motion.ts` — easing חתימה אחד (EASE_BRAND); `src/hooks/useReducedMotion.ts` — גם useAmbientMotion
- `src/components/ui/` — WaveDivider, Marquee, StaggeredWords, BeforeAfterSlider, MagneticButton, GiantWord (נמחקו: LoadTimeBadge, GrainOverlay)
- `src/components/sections/BeforeAfterShowcase.tsx` — הסקשן הכהה עם הסליידר (החליף את ProofBand שנמחק)
- `scripts/design-verify.mjs` — שער ויזואלי רב-פעמי; `scripts/generate-demo-images.mjs` — נכסי הסליידר
- צילומים ודוחות: `g:\tmp\mediawave-audit\wave-lab\{before,phase1,phase2,phase3,final,motion,ambient}\`

## סשן impeccable (05/07/2026) — התקנה + init + ביקורת (אפס שינויי קוד)
- [x] **impeccable v3.9.1 הותקן גלובלית**: `C:\Users\User\.claude\skills\impeccable\` דרך `npx impeccable@latest skills install -y --providers=claude --scope=global --no-hooks`. עדכון עתידי: אותה פקודה בדיוק (מרעננת אם יש גרסה חדשה). בלי hooks בכוונה — אפשר להדליק פר-פרויקט עם `/impeccable hooks on`
- [x] **`/impeccable init` הורץ**: נוצרו `PRODUCT.md` + `DESIGN.md` (מקודדים את 9 החוקים הנעולים + Legacy-Name Rule) + `.impeccable/design.json` + `.impeccable/live/config.json`; מצביע Design Context נוסף ל-CLAUDE.md; ראיון המשתמש דולג בהיתר (כל תשובה נגזרה מתיעוד הריפו) — נתי מוזמן לערוך
- [x] **ביקורת מלאה — `IMPECCABLE-AUDIT.rtl.md`**: ‏audit ‏16/20, ‏critique ‏30/40, ‏AI-slop: עובר. ‏P1: ‏eyebrow עברי עם tracking + ‎#38BDF8 על בהיר (Services.tsx:92), ‏MagneticButton שנשאר בהירו+Contact, ‏glow חום ישן ב-Button.tsx:129. דיטקטור: 39 ממצאים (`g:\tmp\impeccable-detect.json`); צילומים: `g:\tmp\mediawave-audit\wave-lab\impeccable-audit\`
- [x] ~~ממתין להחלטת נתי~~ — נתי אישר הכל ("מאשר הכל, צא לדרך")

## סשן יישום לילי (06/07/2026) — כל ממצאי impeccable יושמו, אפס דיפלוי (חסום)
**11 קומיטים מקומיים על design/wave-lab, מוכנים לדחיפה. ‏origin לא עודכן.**

### ⚠️ דיפלוי — חסום על הרשאות, פקודות לבוקר
ה-push נכשל: מנהל ה-credentials של Windows מגיש טוקן ישן של `levy-n` (403); לחשבון gh הפעיל `NatiLevyy` אין הרשאה; החלפה אוטומטית ל-`mediawave-dev` נחסמה ע"י מסווג ההרשאות של Claude (נכון). **להריץ ידנית:**
```
gh auth switch -u mediawave-dev
git push -u origin design/wave-lab
git push origin design/wave-lab:main      # fast-forward נקי (אומת) → CF Pages production
gh auth switch -u NatiLevyy
```

### מה יושם (החלטות 37-46 ב-DECISIONS.rtl.md)
- P1: ‏eyebrow הוסר; MagneticButton נמחק מהאתר; glow חום ← תכלת
- P2: מערכת focus-ring דו-מצבית; מספרי-צעדים stroke + כרטיסים לבנים (בלי זכוכית); italic הוסר מציטוטי sanity; פלטת Testimonials ← תכלת; hover-ים דוהים ← sky-ink; **כל** לולאות framer מגודרות useAmbientMotion (מתג הווידג'ט עוצר גם JS — מאומת בסקריפט חדש `verify-widget-framer.mjs`)
- P3: ‏~200 שורות CSS מת נמחקו + פונטים רפאים; פוטר frost-mist (`.footer-link`); טלפונים מונו-ספק; קו-ניווט scaleX; `text-wrap: balance` (h2/h3 בלבד!); tap-highlight שקוף; `<a>` מקונן תוקן (Logo=div)

### שערים (הכל ירוק)
- tsc ✔ · eslint: רק 3 אזהרות sanity ישנות ✔ · build+prerender 7 עמודים ✔
- axe contrast: **0 הפרות** ×4 ריצות (+תוקן flake בשער: המתנת settle לפאנל הווידג'ט)
- verify-a11y-round: **11/11** ✔ · widget-framer: PASS (ברק קופא) ✔
- צילומי 320/390/768/1440 כל המסלולים: אפס שגיאות/overflow ×3 ריצות ✔ (`g:\tmp\mediawave-audit\wave-lab\impeccable-final2\`)
- **Lighthouse — הערה חשובה**: הלילה המכונה עמוסה; ‏A/B מול baseline ב-worktree: דסקטופ 93-94 מול 93 baseline (פריטי; ה-97 המתועד = סביבה נקייה), מובייל 61 מול 62 baseline (פריטי; מתועד 72-75). רגרסיית balance-על-h1 שהתגלתה (‏-2) תוקנה ע"י צמצום ל-h2/h3. **מומלץ למדוד שוב בבוקר על מכונה שקטה לפני merge**
- לא-משוחזר: חפיפת ווידג'ט-כותרת ב-320 (נבדק ויזואלית — אין)

### נשאר פתוח
1. הדחיפה + אימות דיפלוי CF Pages (פקודות למעלה)
2. רישיון EFT + החלפת Outfit (reflex-list) — לשיקול עתידי
3. איורי הכרטיסים בצבעים זרים (אדום/סגול) — recolor אופציונלי
4. תיקיות פונטים היסטוריות ב-src/fonts (noa-shalev, yarden, american-captain, Sn_armilado) — ארכיון, לא נגעתי
