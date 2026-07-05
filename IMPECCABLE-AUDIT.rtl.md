# דוח impeccable — ‏audit + critique ‏(05/07/2026)

Method: single-context (audit+critique הורצו בסשן הראשי לפי בקשת נתי — "דוח לפני יישום"; ‏Assessment B ‏(דיטקטור) הורץ בנפרד ותוצאותיו שולבו רק אחרי סקירת הקוד, לפי רוח ה-flow. **אפס שינויי קוד בוצעו** — דוח בלבד.)

- כלי: ‏impeccable v3.9.1 (סקיל גלובלי, ‏`C:\Users\User\.claude\skills\impeccable`)
- קלט: קוד המקור המלא, ‏DESIGN.md/PRODUCT.md שנוצרו ב-init, דיטקטור דטרמיניסטי (45 כללים, 39 ממצאים), צילומי 320/390/768/1440 של כל המסלולים (`g:\tmp\mediawave-audit\wave-lab\impeccable-audit\`)
- שערים בזמן הביקורת: build+prerender 7 עמודים ✔, ‏tsc ✔, ‏eslint רק 3 אזהרות sanity ישנות ✔, צילומים: אפס שגיאות קונסול/רשת/גלילה אופקית ✔

## פסיקת "AI slop"

**עובר.** האתר לא נראה מיוצר-AI: זהות גלים ייחודית (WaveDivider חי, גאות בכפתור, מילת ענק קווית), מספור מפרט מונו, קופי עברי כן, ואפס תבניות SaaS גנריות. נמצאו כמה tells מקומיים (טקסט-גרדיאנט במספרי הצעדים, glassmorphism בסקשן אחד, eyebrow יחיד) — מפורטים למטה; אף אחד מהם לא משנה את הפסיקה.

## ציוני audit (טכני)

| # | ממד | ציון | ממצא מרכזי |
|---|---|---|---|
| 1 | נגישות | 3/4 | eyebrow ‏"השירותים שלנו" ‏~2:1 על רקע בהיר; טבעת פוקוס פסטל חלשה |
| 2 | ביצועים | 3/4 | backdrop-blur×4 ‏+ transition-all בכפתור + לולאות framer לא מגודרות |
| 3 | Theming | 3/4 | ערכים קשיחים (#1e3a5f, אפורי פוטר) + שרידי פלטה חמה ב-Testimonials |
| 4 | רספונסיביות | 4/4 | אפס overflow בכל הרוחבים; יעדי מגע 44px; dvh; שדות LTR |
| 5 | אנטי-דפוסים | 3/4 | gradient-text במספרים, glassmorphism, מגנטיות שנשארה |
| **סה"כ** | | **16/20** | **Good — לטפל בממדים החלשים** |

## ‏critique (‏Nielsen) — ‏30/40 ‏(Good)

סטטוס-מערכת 3 · שפת-משתמש 4 · שליטת-משתמש 3 · עקביות 3 · מניעת-שגיאות 3 · זיהוי-במקום-זיכרון 4 · גמישות 3 · אסתטיקה-מינימליזם 3 · התאוששות-משגיאות 3 · עזרה-ותיעוד 3. החוזקות: שפה עברית טבעית וכנה, ניווט מזוהה, FAQ + צ'אט + נגישות. החולשה הרוחבית: **עקביות פנימית של שפת האינטראקציה** (מגנטי מול גאות, זכוכית מול כרטיס לבן, גרדיאנט מול קו-מתאר).

## ממצאים לפי חומרה

### P1 — לתקן לפני שחרור

1. **‏eyebrow ‏"השירותים שלנו": שלוש בעיות באלמנט אחד** — ‏[Services.tsx:92](src/components/sections/Services.tsx#L92)
   ‏`tracking-widest` על טקסט עברי (הפרת חוק נעול 6 — אין letter-spacing בעברית); צבע ‎#38BDF8 בגודל base על רקע בהיר = **‏~2.0:1, כשל AA אמיתי** (חמק משער ה-axe כי הרקע שם גרדיאנט/בלובים — axe מסמן "incomplete" ולא הפרה); ותבנית ה-eyebrow עצמה היא ה-tell המסומן של impeccable (כאן רק פעם אחת — לא "בכל סקשן").
   **תיקון מוצע:** להסיר את השורה (פס ה-accent מתחת לכותרת כבר עושה את העבודה), או: בלי tracking/uppercase + צבע sky-ink‏ (#0369A1). ‏פקודה: `/impeccable typeset services`

2. **מגנטיות עדיין חיה בשני CTA** — ‏[Hero.tsx:223](src/components/sections/Hero.tsx#L223), ‏[Contact.tsx:207](src/components/sections/Contact.tsx#L207)
   ‏DECISIONS ‏#29 הסיר את MagneticButton מההדר והחליף בגאות מוכלת ("יפהפה, לא AI slop"), אבל ההירו וטופס הקשר עדיין עטופים ב-MagneticButton (‏strength ‏5-7px). סתירה לחוק נעול 4 ("בלי מגנטיות שמזיזה כפתור") ואי-עקביות עם דפוס ה-hover המאושר.
   **תיקון מוצע:** להסיר את העטיפה או להחליף בגרסת הגאות. פקודה: `/impeccable polish hero contact`

3. **‏glow חום מהפלטה הישנה בכפתור הראשי** — ‏[Button.tsx:129](src/components/ui/Button.tsx#L129)
   ‏`boxShadow: '0 0 30px rgba(212, 165, 116, 0.45)'` = זוהר בגוון חול/כתום-חם (‏#D4A574) — שריד ישיר מהפלטה ההיסטורית, על ה-CTA המרכזי בכל האתר. מפר את חוק ה-accent היחיד (נעול 1). כמעט בלתי-נראה ברוב המסכים ולכן שרד — אבל זה בדיוק סוג הדריפט ש-DESIGN.md החדש נועד לתפוס.
   **תיקון מוצע:** ‏rgba(125,211,252,0.45) או ‏`--shadow-glow`. שינוי של שורה.

### P2 — לתקן בסבב הבא

4. **מחוון פוקוס פסטל על רקעים בהירים** — ‏[index.css:253](src/styles/index.css#L253), וגם ‏ring-orange ב-Button/Input
   ‏`:focus-visible { outline: 2px solid var(--color-orange) }` = ‏1.6:1 על לבן — מחוון הפוקוס כמעט נעלם למנווטי מקלדת (WCAG 1.4.11 דורש 3:1). על משטחים כהים הוא דווקא מצוין.
   **תיקון מוצע:** ‏outline ב-sky-ink על משטחים בהירים (טוקן קיים; אפשר בכלל אחד גלובלי + חריג למשטחים כהים). ‏`/impeccable harden`

5. **מספרי הצעדים = טקסט-גרדיאנט** — ‏[HowWeWork.tsx:88-95](src/components/sections/HowWeWork.tsx#L88-L95)
   ‏`bg-gradient-to-br … bg-clip-text text-transparent` — ‏ban מוחלט של impeccable ("decorative, never meaningful"). זה ווטרמרק דקורטיבי ב-30% שקיפות, אז הנזק קטן, אבל יש כאן הזדמנות מיתוג: להחליף לקו-מתאר (webkit-text-stroke תכלת) — בדיוק שפת ה-GiantWord "מתחילים?" — ולאחד את זהות המספרים באתר.

6. **כרטיסי הצעדים הם glassmorphism** — ‏[HowWeWork.tsx:75-82](src/components/sections/HowWeWork.tsx#L75-L82)
   ‏`bg-white/70 backdrop-blur-xl` על רקע בהיר (אין מה לטשטש) — ‏ban של impeccable כברירת-מחדל, וגם עלות GPU במובייל (×4 כרטיסים). שאר האתר משתמש בכרטיס לבן אטום + ‏shadow-card.
   **תיקון מוצע (עדין):** כרטיס לבן רגיל מהמערכת. החלטת טעם שלך — אם הזכוכית מכוונת, לתעד אותה כחריג ב-DESIGN.md.

7. **ציטוט בבלוג: ‏italic על עברית + פס צד** — ‏[PortableTextComponents.tsx:22](src/sanity/PortableTextComponents.tsx#L22), ‏[prose-hebrew.css:75](src/styles/prose-hebrew.css#L75)
   ‏blockquote עם `italic` — הפרת חוק נעול 6 (אין italic בעברית). פס-הצד (border 4px) הוא ban של impeccable אבל נמצא באזור החריג שלך (prose בבלוג) — קונבנציה עריכתית לגיטימית; ההמלצה: להסיר רק את ה-italic (רקע תכלת עדין/גופן מודגש במקום), הפס — החלטה שלך.

8. **‏Testimonials המוסתר נושא את הפלטה החמה הישנה** — ‏[Testimonials.tsx:65,71](src/components/sections/Testimonials.tsx#L65)
   ‏`rgba(245,166,35,0.1)` ‏(=‏#F5A623 הכתום הישן!) + ‏`rgba(139,180,160,0.1)` ‏(sage ישן) בבלובים. הסקשן מוסתר עד שיהיו המלצות אמיתיות — אבל ביום שיודלק, הכתום חוזר. לנקות עכשיו כשזה זול.

9. **מתג "עצירת אנימציות" בווידג'ט כנראה לא עוצר לולאות framer** — ‏[Button.tsx:110-121,209-215](src/components/ui/Button.tsx#L110-L121)
   ‏`html.disable-animations` הורג CSS בלבד; אנימציות ה-shine (סריקה כל 3 שניות) וריצוד האייקון בכפתור הן framer-JS ללא גידור useAmbientMotion, ולכן צפויות לשרוד את המתג — חור קטן בהצהרת "כיבוי מוחלט" (DECISIONS ‏#24). **דורש אימות חי** (דקה בדפדפן); אם מאומת — לגדר כמו ה-orbs ב-Services.

10. **‏hover של פרטי הקשר צונח לפסטל על לבן** — ‏[Contact.tsx:242,294](src/components/sections/Contact.tsx#L242)
    מספר הטלפון/אינסטגרם ב-`group-hover:text-orange` — במעבר עכבר הטקסט יורד ל-1.6:1. תיקון: ‏hover ל-sky-ink. (אותו דפוס גם ב-X של LeadModal:135.)

### P3 — ליטוש

11. **קוד CSS מת עם דפוסים אסורים** — ‏[index.css](src/styles/index.css): ‏`.text-emphasis` (פסטל כטקסט!), ‏`.link-animated`, ‏`.icon-bounce` + ‏`--ease-out-back`/`--ease-spring` (‏easing קפיצי — ‏ban), ‏`.glow-pulse`, ‏`.shimmer`, ‏`.stagger-children`, ‏`.magnetic-hover` — אפס שימושים ב-tsx. מחיקה בטוחה ≈ 120 שורות, מסירה 4 ממצאי דיטקטור.
12. **אפורי הפוטר לא בטוקנים** — ‏#9A9A9A/#A6A6A6 (עוברים AA ‏≈5:1, אבל אפור-שטוח-על-כהה נראה דהוי לפי impeccable; אלטרנטיבה: לבן באלפא או אפור-תכלת). + ‏rgba-scrims של ההירו — לתעד כטוקן scrim.
13. **אנימציית רוחב בקו-התחתון של הניווט** — ‏[index.css:707,748](src/styles/index.css#L707) — ‏transition:width (מאפיין layout); להחליף ל-transform:scaleX. זול, קוסמטי.
14. **פונטים רפאים**: ‏BA Platforma מוצהר ולא בשימוש; תיקיית ‏OS-Luizi שלמה ב-src/fonts; הערת "Playfair Display" מיושנת ב-fonts.css (‏.font-english עדיין מצהיר italic — מת בפועל בגלל font-synthesis:none). ניקוי.
15. **מספרים בזהות לא אחידה** — טלפון/אימייל בפוטר וב-Contact ב-`font-english` במקום ‏`.font-mono-spec` (זהות "המפרט" של wave-lab). ליישר.
16. **צבעי האיורים חורגים מהפלטה** (אדום/ורוד/סגול באייקוני Services/WhyUs) — מקובל לאיורים, אבל recolor לתכלת-טורקיז יעמיק את האחידות. אופציונלי לגמרי.
17. **‏transition-all בכפתור** — ‏[Button.tsx:77](src/components/ui/Button.tsx#L77) — לצמצם למאפיינים ספציפיים.
18. **‏text-wrap: balance לכותרות** — המלצת impeccable שאין לה התנגשות עם החוקים; שיפור שבירת שורות בעברית בחינם (h1-h3).

## המלצות שנדחו (התנגשות עם חוקים נעולים / זהות)

| המלצת impeccable | הכרעה | נימוק |
|---|---|---|
| ‏"Reduced motion is not optional" על גלים/מרקי | **נדחה** | מדיניות המושן האמביינטית (נעול 9, ‏DECISIONS ‏#24): דגל OS מאט, הווידג'ט מכבה. מתועד בהצהרת הנגישות |
| תקרת display ‏6rem — ‏GiantWord ‏11rem חורג | **נדחה** | "מתחילים?" הוא statement מכוון (brand permission); חריג יחיד ומתועד |
| ‏Outfit ברשימת ה-reflex-reject (פונט "ברירת-מחדל של AI") | **נשאר פתוח** | ‏identity-preservation גובר לפי impeccable עצמו; רלוונטי רק אם תחליט לרענן פונטים (קשור לרישיון EFT הפתוח) |
| פס-accent זהה מתחת לכל כותרת (uniform scaffold) | **נדחה** | זו חתימת מותג עקבית מכוונת — ‏named system = voice |
| פס-צד בציטוטי בלוג | **בידיים שלך** | באזור החריג המוצהר (prose); ה-italic כן מוסר (P2-7) |

## ‏false positives שנבדקו והופרכו

- "טקסט לבן על פסטל" בכפתורי צרו-קשר/שליחה בצילומים — **הופרך בקוד**: שניהם ‏#1e3a5f (≈7:1). אשליית דחיסה.
- ‏detector: ‏animate-bounce ב-index.css:683 — זו שורת ה-*ביטול* בבלוק reduced-motion, לא שימוש.
- ההדר בעמודים בהירים — ‏`isScrolled || !isHomePage` מכריח משטח כהה מיידית; פסטל-על-כהה תקין בכל המצבים.

## מה עובד מצוין (לשמר ולשכפל)

- **שכבת הנגישות ההנדסית**: שער axe אוטומטי, סקיילינג בשורש, HC במשפחת המותג, ווידג'ט לא-פרסיסטנטי — רמה שלא רואים באתרי עסקים קטנים.
- **משמעת הביצועים**: צל-hover על pseudo+opacity, גלים transform-בלבד מושהים מחוץ למסך, וידאו דסקטופ-בלבד אחרי idle.
- **חתימות המותג**: הגאות בהדר, מספור המפרט, מילת הענק, הגלים החיים — ייחודי ועקבי.
- **כנות**: סליידר "הדגמה" מסומן, אפס מספרים מומצאים, ‏WhatsApp fallback שקוף.

## נספחים

- דיטקטור מלא (39 ממצאים): ‏`g:\tmp\impeccable-detect.json` — ‏29 צבעים לא-מתועדים (רובם scrims לגיטימיים; המהותיים שולבו למעלה), 2 פונטים, 2 side-tab, 4 bounce, 2 layout-transition.
- צילומים: ‏`g:\tmp\mediawave-audit\wave-lab\impeccable-audit\` ‏(+report.json).
- טבלת קופי: **אין קופי עברי חדש באתר** בריצה זו (PRODUCT/DESIGN הם מסמכי סוכן באנגלית; אפס מחרוזות UI נוספו).

## סדר פעולות מומלץ (אחרי אישורך — כלום לא יושם)

1. ‏P1-1 עד P1-3 (שלושתם שינויים קטנים ומדויקים) → הרצת שערים מלאה
2. ‏P2-4 (פוקוס) + ‏P2-7 (italic) + ‏P2-8 (טסטימוניאלס) + ‏P2-10 (hover קשר)
3. אימות חי של P2-9 (מתג האנימציות מול framer) והחלטה
4. החלטות טעם: זכוכית (P2-6), מספרי גרדיאנט (P2-5), פס ציטוט, איורים
5. ליטושי P3 במקבץ אחד + ניקוי CSS מת
