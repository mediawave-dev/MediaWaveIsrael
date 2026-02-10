# Phase 1, Task 2: Rewrite Services (6 → 3)

## Goal
לשכתב את סקשן השירותים מ-6 קוביות עם פסקאות ארוכות ל-3 קוביות עם משפט אחד כל אחת.

## Context
- `src/components/sections/Services.tsx` — 6 שירותים כרגע
- כל שירות עם תיאור של 2-3 שורות — גלילה אינסופית במובייל
- החלטה: להשאיר רק 3 קטגוריות:
  1. **אתרים** (במקום "פיתוח אתרים מותאמים אישית" + "אתרי תדמית")
  2. **דפי נחיתה** (נשאר כמו שהוא)
  3. **SEO** (במקום "קידום אורגני")

## Actions

### Step 1: עדכון services array
החלף את ה-services array ב:

```typescript
const services: Service[] = [
  {
    id: 'websites',
    title: 'בניית אתרים',
    description: 'אתרים מקצועיים בהתאמה אישית — מקוד מאפס, לא מתבניות.',
    icon: Monitor,
    tags: ['React', 'Next.js', 'WordPress'],
  },
  {
    id: 'landing',
    title: 'דפי נחיתה',
    description: 'דף אחד שממיר גולשים ללידים — עם חיבור ל-WhatsApp וטפסים.',
    icon: Target,
    tags: ['עיצוב ממיר', 'Mobile-First'],
  },
  {
    id: 'seo',
    title: 'קידום אורגני',
    description: 'מחקר מילות מפתח ואופטימיזציה כדי שגוגל יעבוד בשבילכם.',
    icon: Search,
    tags: ['Google', 'תוכן ממוקד'],
  },
]
```

### Step 2: עדכון interface
הסר את `span` property — כל הקוביות שוות עכשיו:

```typescript
interface Service {
  id: string
  title: string
  description: string
  icon: LucideIcon
  tags?: string[]
}
```

### Step 3: עדכון Grid Layout
שנה מ-bento grid ל-grid פשוט של 3:

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {services.map((service, index) => (
    <ServiceCard key={service.id} service={service} index={index} />
  ))}
</div>
```

### Step 4: פישוט ServiceCard (BentoCard)
- הסר את ה-`isWide` logic
- שמור על העיצוב הנוכחי (glassmorphism)
- הקטן את הפדינג קלות לקוביות קטנות יותר

### Step 5: עדכון כותרת הסקשן
שנה מ:
```
"אנחנו בונים חוויות דיגיטליות"
```
ל:
```
"מה אנחנו עושים"
```

### Step 6: עדכון CTA
שנה את ה-CTA בסוף מ-"בואו נדבר" ל:
```
"התחל פרויקט"
```

### Step 7: וידוא
```bash
npm run build
npm run dev
```
- 3 קוביות שוות
- טקסט קצר בכל אחת
- Tags מוצגים
- Responsive תקין (3 cols → 1 col במובייל)

## Acceptance Criteria
- [ ] 3 שירותים במקום 6
- [ ] כל תיאור = משפט אחד בלבד
- [ ] Tags מוצגים מתחת לתיאור
- [ ] Grid פשוט (לא bento asymmetric)
- [ ] CTA: "התחל פרויקט" (לא "בואו נדבר")
- [ ] כותרת: "מה אנחנו עושים"
- [ ] Mobile responsive

## Files to Modify
- `src/components/sections/Services.tsx`

## Estimated Time
~20 דקות
