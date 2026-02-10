# PLAN-1: Build ROICalculator Component

## Task Overview
<task_spec>
<goal>יצירת קומפוננטת ROICalculator מלאה עם 3 שדות קלט, חישוב, count-up animation, ו-WhatsApp CTA</goal>
<context>
- Tech stack: React + TypeScript + Tailwind CSS + Framer Motion
- Location: src/components/sections/ROICalculator.tsx
- Style: מינימליסטי, נקי, תואם לשפת האתר
- RTL: CSS logical properties
</context>
<dependencies>Framer Motion (already installed)</dependencies>
</task_spec>

## Implementation Details

### Component Structure
```typescript
// ROICalculator.tsx
// Main section with id="roi-calculator"
// Contains: Header, InputsForm, ResultsDisplay, WhatsAppCTA
```

### שדות קלט (3)
| שדה | Label (Hebrew) | Type | Default | Min | Max |
|-----|----------------|------|---------|-----|-----|
| traffic | מבקרים באתר לחודש | number | 1000 | 1 | 1000000 |
| conversionRate | אחוז המרה נוכחי | number (%) | 2 | 0.1 | 100 |
| customerValue | ערך לקוח ממוצע (₪) | number | 500 | 1 | 100000 |

### נוסחת חישוב
```typescript
const currentRevenue = traffic * (conversionRate / 100) * customerValue;
const improvedRevenue = traffic * ((conversionRate * 1.2) / 100) * customerValue;
const monthlyLoss = improvedRevenue - currentRevenue;
const yearlyLoss = monthlyLoss * 12;
```

### Count-Up Animation
- Use Framer Motion's `useSpring` + `useTransform`
- Duration: 1.5-2 seconds
- Easing: easeOut
- Format: Hebrew locale with ₪ symbol (e.g., ₪120,000)

### WhatsApp CTA
```typescript
const message = encodeURIComponent(
  `היי, חישבתי במחשבון שלכם שאני מפסיד ₪${yearlyLoss.toLocaleString('he-IL')} בשנה.\nאשמח לשמוע איך אפשר לשפר את האתר שלי!`
);
const whatsappUrl = `https://wa.me/972528731808?text=${message}`;
```

### Edge Cases
- traffic = 0 → Show validation message "הזינו מספר מבקרים"
- conversionRate > 100 → Cap at 100
- yearlyLoss = 0 → Show "כל הכבוד! האתר שלך מייצר מקסימום"
- Large numbers → Format with toLocaleString('he-IL')

### UI Content (Hebrew)
```
Section Header:
- Badge: "מחשבון ROI"
- Title: "כמה כסף האתר האיטי עולה לך?"
- Subtitle: "גלה כמה לקוחות ומכירות אתה מפסיד כל חודש"

Inputs Labels:
- "מבקרים באתר לחודש"
- "אחוז המרה נוכחי (%)"
- "ערך לקוח ממוצע (₪)"

Result:
- "אתה מפסיד בערך"
- "₪{yearlyLoss}" (large, animated)
- "בשנה!"
- Small: "(מבוסס על מחקרי Google - אתר מהיר מעלה המרות ב-20%)"

CTA Button:
- "רוצה לתקן את זה? דבר איתנו"
- WhatsApp icon
```

### Styling Guidelines
- Background: Light section (bg-cream or bg-white)
- Inputs: Large, clear, with floating labels or top labels
- Result: Centered, bold, orange/terracotta for the number
- CTA: WhatsApp green (#25D366) or orange primary
- Mobile-first: Stack inputs vertically on mobile, side-by-side on desktop
- Animations: Subtle entrance with staggered fade-in

## Acceptance Criteria
- [ ] 3 input fields with proper Hebrew labels
- [ ] Live calculation updates as user types
- [ ] Count-up animation when result appears/changes
- [ ] Numbers formatted with Hebrew locale (e.g., 1,000)
- [ ] WhatsApp button opens pre-filled message
- [ ] Edge cases handled (0, max values, etc.)
- [ ] Responsive: works on mobile and desktop
- [ ] RTL: all text and layout correct
- [ ] Accessibility: proper labels, keyboard navigation
- [ ] Matches site design (colors, fonts, spacing)

## Files to Create/Modify
- **Create:** `src/components/sections/ROICalculator.tsx`
- **Modify:** `src/components/sections/index.ts` (add export)

## Estimated Scope
~200-250 lines of TypeScript/JSX
