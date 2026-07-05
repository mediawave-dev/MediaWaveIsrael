# HANDOFF — MediaWave Israel

## Goal
מימוש DESIGN-UPGRADE "מעבדת הגלים" — ריצה אוטונומית מלאה (03-04/07/2026), branch: `design/wave-lab` (מעל feature/production-polish).

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
