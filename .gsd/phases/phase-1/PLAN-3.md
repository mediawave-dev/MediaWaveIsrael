# Phase 1, Task 3: Create WhyUs Section + Update CTAs

## Goal
ליצור סקשן "למה אנחנו" חדש עם 3 הכרטיסים (differentiators) ולעדכן CTAs כפולים.

## Context
- ה-differentiators מ-About.tsx (שנמחק ב-Task 1) הם התוכן הכי טוב באתר
- צריך להעביר אותם לסקשן חדש
- בנוסף: לתקן CTAs כפולים ("בואו נדבר" מופיע יותר מדי)

## Actions

### Step 1: יצירת WhyUs.tsx
צור קובץ חדש `src/components/sections/WhyUs.tsx`:

```tsx
import { motion } from 'framer-motion'
import { Code2, Gauge, HeartHandshake } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface Differentiator {
  icon: LucideIcon
  title: string
  description: string
  color: 'orange' | 'terracotta' | 'sage'
}

const differentiators: Differentiator[] = [
  {
    icon: Code2,
    title: 'טכנולוגיה מתקדמת',
    description: 'React, Next.js, Astro — לא WordPress ולא תבניות.',
    color: 'orange',
  },
  {
    icon: Gauge,
    title: 'ביצועים מעולים',
    description: 'ציון גבוה ב-Google PageSpeed — כי מהירות זה גם SEO.',
    color: 'terracotta',
  },
  {
    icon: HeartHandshake,
    title: 'ליווי אישי',
    description: 'מדברים ישירות עם המפתח, בלי middlemen.',
    color: 'sage',
  },
]

const colorMap = {
  orange: { bg: 'bg-orange/10', text: 'text-orange', border: 'border-orange/20' },
  terracotta: { bg: 'bg-terracotta/10', text: 'text-terracotta', border: 'border-terracotta/20' },
  sage: { bg: 'bg-sage/10', text: 'text-sage-dark', border: 'border-sage/20' },
}

export default function WhyUs() {
  return (
    <section
      id="why-us"
      aria-label="למה אנחנו"
      className="py-16 md:py-20 bg-cream-dark"
    >
      <div className="container max-w-5xl">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-headline mb-3">
            למה לעבוד איתנו?
          </h2>
          <p className="text-lg text-brown-light">
            שלושה דברים שמבדילים אותנו
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {differentiators.map((item, index) => {
            const Icon = item.icon
            const colors = colorMap[item.color]
            return (
              <motion.div
                key={item.title}
                className={`bg-white rounded-xl p-6 border ${colors.border} shadow-sm`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(74, 74, 74, 0.08)' }}
              >
                <div className={`w-12 h-12 rounded-lg ${colors.bg} flex items-center justify-center mb-4`}>
                  <Icon size={24} className={colors.text} strokeWidth={1.5} />
                </div>
                <h3 className="font-headline font-bold text-brown-dark text-xl mb-2">
                  {item.title}
                </h3>
                <p className="text-brown-light leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
```

### Step 2: הוספה ל-App.tsx
```tsx
import WhyUs from './components/sections/WhyUs'

// בתוך ה-render, אחרי Services ולפני Portfolio:
<Services />
<WhyUs />
<Portfolio />
```

### Step 3: עדכון Contact.tsx
שנה את הכותרת מ-"בואו נדבר" ל-"דברו איתנו":

```tsx
<motion.h2 className="text-4xl md:text-5xl font-headline mb-4">
  דברו איתנו
</motion.h2>
```

### Step 4: עדכון CONTENT.md
הוסף סקשן חדש:
```markdown
## WHY US SECTION

### כותרת
למה לעבוד איתנו?

### תת כותרת
שלושה דברים שמבדילים אותנו

### כרטיסים
1. טכנולוגיה מתקדמת — React, Next.js, Astro — לא WordPress ולא תבניות.
2. ביצועים מעולים — ציון גבוה ב-Google PageSpeed — כי מהירות זה גם SEO.
3. ליווי אישי — מדברים ישירות עם המפתח, בלי middlemen.
```

### Step 5: וידוא
```bash
npm run build
npm run dev
```
- WhyUs מופיע בין Services ל-Portfolio
- 3 כרטיסים עם אייקונים
- Contact כותרת "דברו איתנו"
- אין "בואו נדבר" כפול

## Acceptance Criteria
- [ ] WhyUs.tsx נוצר ומוצג באתר
- [ ] 3 כרטיסים עם אייקונים וצבעים
- [ ] Contact כותרת: "דברו איתנו"
- [ ] CONTENT.md מעודכן
- [ ] `npm run build` עובר

## CTA Map (Final Check)
| סקשן | CTA |
|------|-----|
| Hero | "בואו נדבר על הפרויקט שלכם" |
| Services | "התחל פרויקט" |
| Portfolio | "צפה בעבודות" / קישור לאתר |
| Contact | כותרת "דברו איתנו" |

## Files to Create/Modify
- `src/components/sections/WhyUs.tsx` — **חדש**
- `src/App.tsx` — הוסף import ושימוש
- `src/components/sections/Contact.tsx` — שנה כותרת
- `CONTENT.md` — הוסף WhyUs section

## Estimated Time
~25 דקות
