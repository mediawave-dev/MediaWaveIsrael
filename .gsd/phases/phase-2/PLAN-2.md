# Phase 2, Task 2: Source & Prepare WhyUs Video

## Goal
להוריד וידאו Business/Success מ-Pexels ולהכין אותו לשימוש ב-WhyUs section.

## Context
- **נושא**: Business/Success — פגישות, לחיצות יד, משרד מודרני
- **סגנון**: רקע סאטל (30-50% opacity), לא מתחרה עם תוכן
- **מקור**: Pexels — שימוש מסחרי חינם
- **מפרט**: 10-15 שניות loop, 720p/1080p, < 3 MB

## Actions

### Step 1: מציאת וידאו ב-Pexels
חפש ב-https://www.pexels.com/search/videos/

**מונחי חיפוש מומלצים:**
- "business meeting"
- "professional handshake"
- "modern office"
- "team collaboration"
- "startup office"

**קריטריונים לבחירה:**
- [ ] לולאה חלקה (תחילה וסוף דומים)
- [ ] תאורה חמה, לא קרה/תאגידית
- [ ] ללא פנים ברורות (privacy)
- [ ] תנועה איטית, לא hectic
- [ ] רזולוציה: HD (720p) או Full HD (1080p)
- [ ] אורך: 10-20 שניות

### Step 2: הורדה וחיתוך
1. הורד את הוידאו מ-Pexels
2. אם ארוך מ-15 שניות, חתוך:
   ```powershell
   # עם ffmpeg
   ffmpeg -i input.mp4 -t 15 -c copy whyus-bg.mp4
   ```
3. אם גדול מדי (> 3 MB), דחוס:
   ```powershell
   ffmpeg -i input.mp4 -vcodec libx264 -crf 28 -preset slow whyus-bg.mp4
   ```

### Step 3: יצירת פוסטר
צור תמונת poster מהפריים הראשון או מפריים מייצג:

```powershell
# חילוץ פריים ראשון
ffmpeg -i whyus-bg.mp4 -vframes 1 -f image2 whyus-poster-temp.jpg

# המרה ל-WebP (עם squoosh.app או)
# יעד: < 100 KB
```

### Step 4: שמירה ל-public
```
public/
├── videos/
│   └── whyus-bg.mp4        # < 3 MB
└── images/
    └── whyus-poster.webp   # < 100 KB
```

### Step 5: וידוא
- [ ] `whyus-bg.mp4` קיים וקטן מ-3 MB
- [ ] `whyus-poster.webp` קיים וקטן מ-100 KB
- [ ] הוידאו לולאה חלקה (אין קפיצה)
- [ ] הפוסטר איכותי ומייצג

## Acceptance Criteria
- [ ] וידאו נבחר מ-Pexels (עם קרדיט אם נדרש)
- [ ] `public/videos/whyus-bg.mp4` — < 3 MB, 10-15 שניות
- [ ] `public/images/whyus-poster.webp` — < 100 KB
- [ ] לולאה חלקה, תנועה איטית
- [ ] תוכן מתאים (business/success, לא generic)

## Files to Create
- `public/videos/whyus-bg.mp4` — **חדש**
- `public/images/whyus-poster.webp` — **חדש**

## Pexels Credit (if required)
שמור את הקרדיט במקרה שנצטרך:
```
Video by [Author Name] from Pexels: [URL]
```

## Estimated Time
~20 דקות (כולל חיפוש, הורדה, עיבוד)
