# Phase 1, Task 1: Remove About Section

## Goal
להסיר את סקשן About מהאתר — כולל הקומפוננטה וה-import ב-App.tsx.

## Context
- `src/components/sections/About.tsx` — סקשן "הסיפור שלנו"
- כולל blockquote ריק ("יותר פניות, יותר מכירות")
- כולל differentiators (3 כרטיסים) — אלו יעברו לקומפוננטה חדשה ב-Task 3
- החלטה: המשתמש לא רוצה סקשן About כלל

## Actions

### Step 1: גיבוי Differentiators Data
לפני מחיקה, להעתיק את ה-differentiators array מ-About.tsx:
```typescript
const differentiators = [
  { icon: Code2, title: 'טכנולוגיה מתקדמת', description: '...', color: 'orange' },
  { icon: Gauge, title: 'ציון PageSpeed מושלם', description: '...', color: 'terracotta' },
  { icon: HeartHandshake, title: 'ליווי אישי', description: '...', color: 'sage' },
]
```
לשמור בצד — ישמש ב-Task 3.

### Step 2: הסרה מ-App.tsx
- פתח `src/App.tsx`
- מחק את `import About from './components/sections/About'`
- מחק את `<About />` מה-render flow
- ודא שסדר הסקשנים נשאר: Hero → Services → Portfolio → Packages → FAQ → Contact

### Step 3: מחיקת הקובץ
- מחק `src/components/sections/About.tsx`
- עדכן `src/components/sections/index.ts` אם קיים

### Step 4: וידוא
```bash
npm run build
npm run dev
```
- אין שגיאות TypeScript
- האתר נטען ללא סקשן About
- המעבר בין Services ל-Portfolio חלק

## Acceptance Criteria
- [ ] About.tsx נמחק
- [ ] App.tsx לא מכיל import או שימוש ב-About
- [ ] Differentiators data שמור בצד (לTask 3)
- [ ] `npm run build` עובר ללא שגיאות
- [ ] האתר נטען תקין

## Files to Modify
- `src/App.tsx` — הסר import ושימוש
- `src/components/sections/About.tsx` — למחוק
- `src/components/sections/index.ts` — עדכון אם קיים

## Estimated Time
~10 דקות
