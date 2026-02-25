# Phase 7 / Task 2 — Client Guide & Environment Documentation

## Goal
Create Hebrew client guide for Sanity Studio usage and document all environment variables.

## Steps

### 1. Create Hebrew client guide
Create `docs/sanity-guide.rtl.md`:

Guide structure (all in Hebrew):
```markdown
# מדריך ניהול תוכן — MediaWave Studio

## כניסה ל-Studio
- גש לכתובת: [domain]/studio
- היכנס עם פרטי המשתמש שקיבלת

## ניווט בתפריט
- **תוכן האתר**: שירותים, חבילות, למה אנחנו, איך עובדים, שאלות נפוצות
- **בלוג ופורטפוליו**: פוסטים, פרויקטים, המלצות
- **הגדרות אתר**: פרטי קשר, לוגו, רשתות חברתיות

## הוספת פוסט חדש בבלוג
1. לחץ על "בלוג ופורטפוליו" > "פוסטים בבלוג"
2. לחץ על כפתור "+" (הוספה)
3. מלא: כותרת, תקציר, תוכן, תמונה ראשית, תגיות
4. סמן "מפורסם" כש-ready
5. לחץ "Publish" (פרסם)

## עריכת שירות
1. לחץ על "תוכן האתר" > "שירותים"
2. בחר את השירות לעריכה
3. ערוך שדות רצויים
4. לחץ "Publish"

## העלאת תמונות
- גרור תמונה לשדה התמונה
- ניתן לחתוך ולהגדיר נקודת מוקד (hotspot)
- פורמטים נתמכים: JPG, PNG, WebP

## שינוי סדר פריטים
- גרור את הפריט למיקום הרצוי ברשימה
- סדר נשמר אוטומטית

## עדכון פרטי קשר
1. לחץ על "הגדרות אתר"
2. ערוך: טלפון, אימייל, WhatsApp, אינסטגרם
3. לחץ "Publish"

## תצוגה מקדימה
- הוסף ?preview=true לכתובת האתר
- תראה גם תוכן בטיוטה (לא מפורסם)

## שאלות נפוצות
- **מתי שינויים נכנסים לתוקף?** מיידית לאחר לחיצה על Publish
- **מה קורה אם אני טועה?** ניתן לחזור לגרסה קודמת בהיסטוריה
- **צריך עזרה?** פנה ל-MediaWave בווטסאפ 052-8731808
```

### 2. Update .env.example with full documentation
Update `.env.example`:
```bash
# === MediaWave Site ===
VITE_CONTACT_ENDPOINT=        # Contact form submission endpoint

# === Sanity CMS ===
SANITY_STUDIO_PROJECT_ID=     # Sanity project ID (from manage.sanity.io)
SANITY_STUDIO_DATASET=production  # Sanity dataset name

# Client-side Sanity access (duplicated for Vite env)
VITE_SANITY_PROJECT_ID=       # Same as SANITY_STUDIO_PROJECT_ID
VITE_SANITY_DATASET=production

# Preview mode (dev/staging only — DO NOT set in production)
VITE_SANITY_PREVIEW_TOKEN=    # Read-only Sanity token for draft preview

# Migration only (never deploy)
SANITY_WRITE_TOKEN=           # Write token for migration scripts
```

### 3. Update project README or create deployment checklist
Create `docs/deployment-checklist.md`:
```markdown
# Deployment Checklist

## First-time Setup
1. Create Sanity project at manage.sanity.io
2. Note the Project ID
3. Create dataset "production"
4. Add CORS origins:
   - https://your-domain.pages.dev (with credentials)
   - http://localhost:5173 (for dev)
5. Create API tokens:
   - Viewer token (for preview)
   - Editor token (for migration)
6. Set environment variables in Cloudflare Pages
7. Run migration script
8. Create siteSettings document in Studio
9. Deploy

## After Deploy
- Verify /studio loads correctly
- Verify all sections show content
- Test editing in Studio
- Share Studio URL + credentials with client
```

## Acceptance Criteria
- [ ] Hebrew client guide created at `docs/sanity-guide.rtl.md`
- [ ] Guide covers: login, navigation, CRUD operations, image upload, ordering, preview
- [ ] `.env.example` documents all variables with descriptions
- [ ] Deployment checklist created
- [ ] All documentation in Hebrew where client-facing
