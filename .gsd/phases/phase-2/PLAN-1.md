# Phase 2, Task 1: Optimize Hero Poster

## Goal
להמיר את hero-poster.jpg (1.86 MB) ל-WebP קל (~100 KB) לשיפור ביצועים במובייל.

## Context
- `public/images/hero-poster.jpg` — 1.86 MB (כבד מדי!)
- משמש כ-fallback למובייל במקום הוידאו
- Hero.tsx כבר מצביע לקובץ הזה
- צריך לשמור על איכות ויזואלית טובה

## Actions

### Step 1: המרה ל-WebP
השתמש ב-squoosh.app או כלי דומה:

**אפשרות א: squoosh.app (מומלץ)**
1. פתח https://squoosh.app
2. העלה את `public/images/hero-poster.jpg`
3. בחר WebP format
4. Quality: 75-80
5. Resize אם רוחב > 1920px
6. הורד ושמור ל-`public/images/hero-poster.webp`

**אפשרות ב: PowerShell עם ImageMagick**
```powershell
magick convert public/images/hero-poster.jpg -quality 80 -resize "1920>" public/images/hero-poster.webp
```

**יעד:** < 150 KB עם איכות טובה

### Step 2: עדכון Hero.tsx
פתח `src/components/sections/Hero.tsx` והחלף:

**שורה ~79 (Mobile background):**
```tsx
backgroundImage: 'url(/images/hero-poster.webp)',
```

**שורה ~91 (Video poster):**
```tsx
poster="/images/hero-poster.webp"
```

### Step 3: שמירת גיבוי
```powershell
Rename-Item "public\images\hero-poster.jpg" "hero-poster-original.jpg"
```

### Step 4: וידוא
```bash
npm run build
npm run dev
```
- תמונת הפוסטר נטענת נכון בדסקטופ ומובייל
- איכות ויזואלית טובה
- גודל קובץ < 150 KB

## Acceptance Criteria
- [ ] `hero-poster.webp` קיים ב-public/images/
- [ ] גודל קובץ < 150 KB
- [ ] Hero.tsx מעודכן לשימוש ב-webp
- [ ] Mobile fallback עובד
- [ ] Video poster fallback עובד
- [ ] איכות ויזואלית לא נפגעה משמעותית
- [ ] `npm run build` עובר

## Files to Modify
- `public/images/hero-poster.webp` — **חדש**
- `public/images/hero-poster.jpg` → `hero-poster-original.jpg` — **rename**
- `src/components/sections/Hero.tsx` — עדכון נתיבים

## Estimated Time
~10 דקות
