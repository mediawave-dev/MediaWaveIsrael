# MediaWave Website Mega-Upgrade

## Vision
שדרוג אתר MediaWave מאתר גנרי לאתר שמייצר לידים ומבדל מ-99% מהסוכנויות בישראל.
הוכחת יכולת בזמן אמת — לא דרך טקסט שיווקי.

## Core Problem
- חזרתיות בטקסטים ("מותאם אישית", "קוד מאפס" x10)
- תיק עבודות חלש — פרויקט בודד בלי מדדים
- Social proof ריק — ציטוטים ללא שם/ייחוס
- Hero גנרי — תמונת stock עם parallax
- 6 קוביות שירותים — גלילה אינסופית במובייל
- אין אינטראקטיביות — הכל סטטי

## Target User
בעלי עסקים ישראליים שמחפשים שירותי פיתוח אתרים.
גולשים בעיקר במובייל, דוברי עברית.

## Tech Stack
- **Framework**: React 18.3.1 + Vite 6.0.5
- **Styling**: Tailwind CSS v4.1.18
- **Animation**: Framer Motion 12.26.2
- **Language**: TypeScript 5.6.2
- **Fonts**: Noa Shalev (headlines), Yarden (body), Heebo (fallback)
- **Hosting**: Cloudflare Pages (mediawaveisrael.pages.dev)
- **Direction**: RTL (Hebrew)
- **Backend**: Supabase (לידים)
- **APIs**: None (currently)

## Key Constraints
- RTL first — CSS logical properties
- Mobile-first — 70% מהגולשים במובייל
- No fake data — רק מספרים אמיתיים או [PLACEHOLDER]
- PageSpeed 90+ — אחרי כל פאזה
- ALL text from CONTENT.md

## Success Criteria
- [ ] אין ביטוי חוזר יותר מפעמיים באתר
- [ ] כל CTA ייחודי
- [ ] ROI Calculator מייצר לידים
- [ ] Before/After Slider עובד על מובייל
- [ ] Chatbot מוביל ל-lead capture ב-3-4 הודעות
- [ ] Lighthouse 90+ בכל הקטגוריות
