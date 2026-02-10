# Phase 2, Task 3: Implement WhyUs Video Background

## Goal
להוסיף רקע וידאו סאטל ל-WhyUs section עם overlay וfallbacks.

## Context
- `WhyUs.tsx` קיים עם 3 כרטיסי differentiators
- נכסי הוידאו מוכנים מ-Task 2:
  - `public/videos/whyus-bg.mp4`
  - `public/images/whyus-poster.webp`
- סגנון: 30-50% opacity, לא מתחרה עם תוכן
- דפוס דומה ל-Hero.tsx (desktop video, mobile poster)

## Actions

### Step 1: הוספת שכבת וידאו
פתח `src/components/sections/WhyUs.tsx` והוסף לפני התוכן:

```tsx
import { useState, useEffect } from 'react'

export default function WhyUs() {
  // Detect reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return (
    <section
      id="why-us"
      aria-label="למה אנחנו"
      className="relative py-16 md:py-20 overflow-hidden"
    >
      {/* ===== LAYER 1: Video Background ===== */}

      {/* Mobile: poster image */}
      <div
        className="absolute inset-0 md:hidden bg-cover bg-center"
        style={{
          backgroundImage: 'url(/images/whyus-poster.webp)',
          zIndex: 0,
        }}
      />

      {/* Desktop: video (if motion allowed) */}
      {!prefersReducedMotion && (
        <video
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          poster="/images/whyus-poster.webp"
          className="absolute inset-0 w-full h-full object-cover hidden md:block opacity-40"
          style={{ zIndex: 0 }}
        >
          <source src="/videos/whyus-bg.mp4" type="video/mp4" />
        </video>
      )}

      {/* Desktop: poster fallback if reduced motion */}
      {prefersReducedMotion && (
        <div
          className="absolute inset-0 hidden md:block bg-cover bg-center opacity-40"
          style={{
            backgroundImage: 'url(/images/whyus-poster.webp)',
            zIndex: 0,
          }}
        />
      )}

      {/* ===== LAYER 2: Dark Overlay ===== */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          background: 'linear-gradient(to bottom, rgba(253, 251, 247, 0.85) 0%, rgba(245, 240, 232, 0.9) 100%)',
        }}
      />

      {/* ===== LAYER 3: Content ===== */}
      <div className="relative z-[2] container max-w-5xl">
        {/* ... existing content ... */}
      </div>
    </section>
  )
}
```

### Step 2: עדכון ה-overlay
שים לב — ה-overlay צריך להיות בהיר (cream) ולא כהה כמו ב-Hero:
- Hero: רקע כהה + טקסט לבן
- WhyUs: רקע בהיר + טקסט כהה

```tsx
background: 'linear-gradient(to bottom, rgba(253, 251, 247, 0.85) 0%, rgba(245, 240, 232, 0.9) 100%)'
```

### Step 3: התאמת opacity
- וידאו: `opacity-40` (40% — סאטל)
- overlay: 85-90% (כמעט אטום, רק רמז לוידאו מאחור)

### Step 4: עדכון הכרטיסים
הכרטיסים צריכים `bg-white/90` או `backdrop-blur` לקריאות:

```tsx
className={`bg-white/95 backdrop-blur-sm rounded-xl p-6 border ${colors.border} shadow-sm`}
```

### Step 5: וידוא
```bash
npm run build
npm run dev
```

**בדיקות:**
- [ ] וידאו מתנגן בדסקטופ
- [ ] פוסטר מוצג במובייל
- [ ] טקסט קריא על כל הרקעים
- [ ] אנימציות חלקות (60fps)
- [ ] prefers-reduced-motion נכבד
- [ ] אין קפיצה בלולאה

## Acceptance Criteria
- [ ] WhyUs.tsx כולל וידאו רקע
- [ ] Mobile fallback לפוסטר
- [ ] Overlay מבטיח קריאות טקסט
- [ ] Accessibility: prefers-reduced-motion
- [ ] וידאו opacity 30-50%
- [ ] כרטיסים קריאים (bg-white/95 + blur)
- [ ] `npm run build` עובר
- [ ] 60fps בדסקטופ

## Files to Modify
- `src/components/sections/WhyUs.tsx` — **עדכון משמעותי**

## Reference
השווה ל-Hero.tsx (שורות 73-106) לדפוס הוידאו.

## Estimated Time
~25 דקות
