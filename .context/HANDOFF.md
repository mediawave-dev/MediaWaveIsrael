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

## Important Files
- `src/config/motion.ts` — easing חתימה אחד (EASE_BRAND)
- `src/components/ui/` — WaveDivider, Marquee, StaggeredWords, LoadTimeBadge, BeforeAfterSlider, MagneticButton, GiantWord, GrainOverlay
- `src/components/sections/ProofBand.tsx` — המספרים המדודים (לעדכן עם כל מדידה)
- `scripts/design-verify.mjs` — שער ויזואלי רב-פעמי; `scripts/generate-demo-images.mjs` — נכסי הסליידר
- צילומים ודוחות: `g:\tmp\mediawave-audit\wave-lab\{before,phase1,phase2,phase3,final}\`
