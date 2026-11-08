# הפונטים של MediaWave

## mediawave-font1

פונט רחב לכותרות שציירנו מאפס.
כולל עברית, אנגלית, ספרות, פיסוק וסימן שקל, בשלושה משקלים: Thin, Regular ו-Bold.

| תיקייה | מה יש בה | למי זה מיועד |
|---|---|---|
| `mediawave-font1/otf` | קבצי התקנה | Windows, Mac, Figma, Word, Photoshop |
| `mediawave-font1/woff2` | קבצים לאתרים | מפתחים |
| `mediawave-font1/source` ו-`build.py` | הקוד שמצייר את האותיות | רק כדי לשנות את הפונט |

## התקנה במחשב

פותחים את `mediawave-font1/otf`, בוחרים את שלושת הקבצים, לוחצים קליק ימני ובוחרים Install.
ב-Mac פותחים כל קובץ ולוחצים Install Font.
אחרי ההתקנה צריך לסגור ולפתוח מחדש תוכנות שהיו פתוחות.

## שימוש באתר

מעתיקים את קובצי `woff2` לתיקיית הפונטים של האתר ומוסיפים:

```css
@font-face { font-family: "mediawave-font1"; src: url("/fonts/mediawave-font1-Thin.woff2") format("woff2"); font-weight: 100; font-display: swap; }
@font-face { font-family: "mediawave-font1"; src: url("/fonts/mediawave-font1-Regular.woff2") format("woff2"); font-weight: 400; font-display: swap; }
@font-face { font-family: "mediawave-font1"; src: url("/fonts/mediawave-font1-Bold.woff2") format("woff2"); font-weight: 700; font-display: swap; }
```

## מתי להשתמש בו

הפונט נועד לכותרות ולטקסט גדול, ולא לטקסט רץ.
Thin מתאים רק מגודל של כ-40 פיקסלים ומעלה, על רקע שקט.
מעל וידאו או תמונה עמוסה עדיף Regular.

## להוריד רק את התיקייה הזאת

המאגר המלא גדול, אז כדאי למשוך רק את הפונטים:

```bash
git clone --filter=blob:none --sparse https://github.com/mediawave-dev/MediaWaveIsrael.git mediawave-fonts
```

```bash
cd mediawave-fonts
```

```bash
git sparse-checkout set fonts
```

כדי לקבל עדכונים בהמשך, מריצים בתוך התיקייה:

```bash
git pull
```

כל הזכויות שמורות ל-MediaWave Israel.
