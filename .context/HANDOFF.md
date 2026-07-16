# HANDOFF — MediaWave Israel

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
