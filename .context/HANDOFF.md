# HANDOFF — MediaWave Israel

## Goal
ליטוש האתר לרמת פרודקשן: הסרת Directus מוחלטת, תיקון באגי פרודקשן, מובייל, ביצועים, עיצוב פרימיום — ריצת לילה אוטונומית (02-03/07/2026).

## Completed (branch: feature/production-polish, 9 commits)
- [x] 3b35ce2 — הסרת Directus מלאה: כל הסקשנים סטטיים, נמחקו src/directus, docker-compose, seeds, @directus/sdk. קוד מת נמחק (Packages, ServiceCard, ConnectingLine, PageDecorations, SectionSkeleton)
- [x] 3d3ae83 — לוגו: תיקון preload 404 של logo.webp, נוצרו logo.webp (30KB) + logo-white.webp (15KB), פוטר קריא, og-image 214→50KB, נמחקו 20.5MB מדיה מתה
- [x] 8062d5d — טפסים כנים: LeadModal/Contact פותחים וואטסאפ עם הודעה מוכנה כשאין endpoint (לא עוד הצלחה מזויפת + נעילת localStorage)
- [x] 4424f58 — מובייל: באנר עוגיות קומפקטי (כפתורים צפים מורמים מעליו), דחיסות Services/FAQ, "בלי מתווכים" (bidi), ScrollToTop לראוטים, חץ 404, WhyUs overlay
- [x] 0648d40 — ביצועים: וידאו עצל (מובייל לא מוריד 3.3MB), Lottie pause מחוץ למסך, motion→m בכל 15 הקבצים, פונטים woff2 (225→88KB) + preload
- [x] 4a58066 — דף הצהרת נגישות /accessibility (ת"י 5568) + ראוט/פוטר/sitemap/prerender
- [x] 3042b1b — תיקון מלבן לבן ב-Lottie של בניית אתרים (רק ה-fill, הציור נשמר)
- [x] 18171ce — עיצוב: פס מבטא אחיד לכותרות, קונטרסט CTA (לבן→נייבי על תכלת), FAQ/טופס מעודנים, scroll-margin
- [x] 6162ee3 — **התיקון הקריטי**: צ'אנק Sanity Studio של 1.26MB נשלח לכל מבקר (manualChunks) + modulepreload שנאפו ב-prerender + LeadModal eager. Lighthouse: דסקטופ 54→99, מובייל 56→74, תעבורה 1.8MB→538KB
- [x] עדכון CLAUDE.md (סטטוס אמיתי: אין CMS, פלטה, קומפוננטות שנמחקו)

## Key Decisions
- **Directus הוסר לגמרי** (החלטת נתי) — CMS חדש ייבחר בעתיד; `src/data/site.ts` = מקור יחיד לפרטי קשר
- **טופס ללא endpoint** = handoff לוואטסאפ (החלטת נתי: endpoint אמיתי בהמשך)
- **הפלטה**: שמות המשתנים legacy (orange=תכלת #7DD3FC) — מתועד ב-CLAUDE.md
- puppeteer headless מדמה prefers-reduced-motion:reduce — לכן וידאו לא נראה בצילומים אוטומטיים (עובד אצל משתמשים אמיתיים, אומת עם emulateMediaFeatures)

## Known Issues / Next Steps
1. **git push** — ה-branch מקומי בלבד; main מקדים את origin ב-8 קומיטים עוד מקודם. צריך: merge + push + Cloudflare Pages preview
2. **endpoint לטפסים** — Cloudflare Function /api/contact + Resend (מומלץ) או Web3Forms
3. **Testimonials** — הסקשן מוסתר עד שנתי יוסיף המלצות אמיתיות ל-src/data/testimonials.ts
4. **SANITY_WRITE_TOKEN ב-.env** — מומלץ לרוטט (sanity.io/manage)
5. נוסח דף הנגישות ממתין לאישור נתי (כבר בקומיט — קל לתקן)
6. מובייל Lighthouse 74 בסימולציית slow-4G ללא דחיסה; בפרודקשן (Brotli של Cloudflare) יהיה גבוה משמעותית

## Important Files
- `src/data/site.ts` — פרטי קשר (מקור יחיד)
- `src/data/blog-posts.ts` — תוכן הבלוג + מזין sitemap/prerender/feed
- `src/hooks/useMediaQuery.ts` — חדש; גם useReducedMotion בשימוש נרחב
- `scripts/prerender.mjs` — כולל ניקוי modulepreload של runtime
- `vite.config.ts` — אסור להחזיר sanity ל-manualChunks (גורם לצ'אנק eager!)
- צילומי לפני/אחרי: `g:\tmp\mediawave-audit\` (baseline, mid, final, verify) + דוחות Lighthouse
