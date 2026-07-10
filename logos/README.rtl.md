# חבילת לוגו MediaWave — יולי 2026

פתח את `index.html` בדפדפן לתצוגה מלאה של כל הגרסאות + הנחיות שימוש.

## מה יש כאן

שתי משפחות סימן, שתיהן וקטור טהור:

### The Crest (ראשי) — מניפת גל מחודדת
| קובץ | שימוש |
|---|---|
| `mediawave-crest-horizontal-dark.svg` | הלוקאפ הראשי על רקע כהה (header, footer, וידאו) |
| `mediawave-crest-horizontal-light.svg` | על רקע בהיר (מסמכים, הצעות מחיר, חשבוניות) |
| `mediawave-crest-horizontal-dark-animated.svg` | עם אנימציית כניסה מובנית (CSS בתוך הקובץ, מכבד prefers-reduced-motion) |
| `mediawave-crest-horizontal-mono-white.svg` | לבן מלא — על צילומים/וידאו כהה |
| `mediawave-crest-horizontal-mono-ink-light.svg` | צבע אחד כהה — הדפסה/חריטה |
| `mediawave-crest-stacked-dark/light.svg` | פורמט מרובע — פרופיל רשתות, חותמת |
| `mediawave-crest-mark-dark/light.svg` | הסימן לבדו — watermark, מקומות צרים |
| `mediawave-crest-apptile.svg` | אריח אפליקציה (גרדיאנט + סימן לבן) |
| `mediawave-crest-favicon.svg` | **favicon ייעודי** — 3 סרטים מעובים ששורדים 16px |

### The Swell (חלופי) — גל שובר עם שובלי תנועה
| קובץ | שימוש |
|---|---|
| `mediawave-swell-horizontal-dark/light.svg` | לוקאפ מלא |
| `mediawave-swell-mark-dark/light.svg` | הסימן לבדו |

### The Curl (כיוון נועז) — תלתל גל סביב מרכז
| קובץ | שימוש |
|---|---|
| `mediawave-curl-mark-dark/light.svg` | סימן בלבד — הקריאוּת הטובה ביותר בקטן, אבל ריחוק מה-DNA המקורי |

## מה מיוחד טכנית
- **הכיתוב הוא נתיבים, לא טקסט** — "MediaWave" נבנה מ-Outfit 600 עם kerning אמיתי (opentype.js) והומר ל-path. הלוגו זהה בכל מכשיר, גם בלי הפונט.
- **הסרטים מחודדים באמת** — כל קו גל הוא נתיב סגור עם שתי שפות bezier בהיסט משתנה (עבה בבסיס → דק בקצה), לא stroke אחיד. זה ההבדל שרואים בגדול.
- **פלטה = מערכת העיצוב של האתר** — sky-pastel `#7DD3FC`, sky-deep `#38BDF8`, sky-ink `#0369A1/#075985`. בגרסה הבהירה קצות הסרטים מסתיימים ב-`#0284C7` (ולא pastel) כדי לשמור ניגודיות על frost.
- **נגישות** — לכל קובץ `role="img"` + `<title>` + `<desc>`.
- **דו-גוון בכיתוב** — "Media" ניטרלי, "Wave" בכחול המותג. בלי גרדיאנט על טקסט (חוק DESIGN.md).

## החלפה באתר (כשתחליט)
1. `public/favicon.svg` ← `mediawave-crest-favicon.svg` (להתאים viewBox ל-32 או להשאיר 120 — עובד).
2. `public/images/logo-white.webp` ← לייצא PNG מ-`mono-white` או להטמיע SVG ישירות ב-`Logo.tsx` (עדיף — חד בכל רזולוציה).
3. `LogoIcon` ב-`src/components/ui/Logo.tsx` עדיין מצייר M ישן בצבעי טורקיז legacy — להחליף בסימן החדש.
4. `public/og-image.svg` — לעדכן עם הלוקאפ החדש.

## ייצוא PNG
```
npx svgexport mediawave-crest-horizontal-dark.svg logo@2x.png 2x
```
או פתיחה ב-Figma/Inkscape וייצוא בגודל הרצוי.
