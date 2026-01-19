# PRD Creation Guide

## מה זה PRD?

**Product Requirements Document** - מסמך שמתאר את הדרישות של המוצר.
זה ה-"Single Source of Truth" - מקור האמת היחידי לפרויקט.

## מתי יוצרים PRD?

- לפני תחילת פיתוח פרויקט חדש
- לפני הוספת פיצ'ר משמעותי
- כשרוצים להריץ Ralph Loop

---

## תהליך יצירת PRD

### Step 1: שאלות הבהרה

שאל את המשתמש (בפורמט 1A, 2B, 3C לתשובה קלה):

```markdown
## שאלות להגדרת הפרויקט

**1. הבעיה**
A) מה הבעיה שאתה פותר?
B) מי סובל מהבעיה הזו?
C) למה זה חשוב עכשיו?

**2. הפתרון**
A) איך המוצר יפתור את הבעיה?
B) מה ההבדל מפתרונות קיימים?

**3. משתמשים**
A) מי המשתמש העיקרי?
B) מה הוא מנסה להשיג?
C) מה יגרום לו להשתמש במוצר?

**4. פיצ'רים**
A) מה ה-3 פיצ'רים הכי חשובים?
B) מה בהחלט לא צריך להיות בגרסה הראשונה?

**5. הצלחה**
A) איך נדע שהמוצר הצליח?
B) מה המטריקות החשובות?

**6. מגבלות**
A) טכנולוגיות מועדפות?
B) מגבלות זמן/תקציב?
C) דרישות ביצועים?
```

### Step 2: כתיבת PRD

לאחר קבלת תשובות, צור PRD לפי התבנית למטה.

### Step 3: אימות

- וודא שכל user story מתאימה ל-context window אחד
- וודא שיש acceptance criteria ברורים
- וודא שה-non-goals ברורים

---

## PRD Template

```markdown
# PRD: [Project Name]

## Problem Statement
[מה הבעיה? מי סובל ממנה? למה זה חשוב?]

## Goals
- [ ] Primary goal with measurable outcome
- [ ] Secondary goal

## Success Criteria
- [איך נדע שהצלחנו?]
- [מה המטריקות?]

## User Stories

### US-001: [Short Name]
**Description:** [2-3 sentences MAX - must fit single context window]

**Acceptance Criteria:**
- [ ] Specific, testable criterion 1
- [ ] Specific, testable criterion 2
- [ ] Specific, testable criterion 3

**Status:** ⬜ Not Started

---

### US-002: [Short Name]
**Description:** [2-3 sentences]

**Acceptance Criteria:**
- [ ] Criterion 1
- [ ] Criterion 2

**Status:** ⬜ Not Started

---

## Non-Goals
- [מה בהחלט לא בונים בגרסה הזו]
- [פיצ'רים שנדחו לעתיד]

## Tech Stack
- Frontend: [React/Next.js/Vue/etc]
- Backend: [Node/Python/etc]
- Database: [PostgreSQL/MongoDB/etc]
- Hosting: [Vercel/AWS/etc]

## Notes
- [הערות נוספות]
```

---

## Status Values

| Status | Meaning |
|--------|---------|
| ⬜ Not Started | לא התחיל |
| 🔄 In Progress | בתהליך |
| ✅ Complete | הושלם |
| ❌ Blocked | תקוע |

---

## Task Sizing - Critical Rule!

**כל user story חייבת להתאים ל-context window אחד (~10 דקות עבודה).**

### ✅ גודל נכון:
- הוספת שדה לדאטאבייס
- יצירת קומפוננטת UI אחת
- מימוש endpoint אחד
- הוספת validation לטופס
- כתיבת test suite אחד

### ❌ גדול מדי - לפרק:
- "בנה dashboard" → פרק לווידג'טים נפרדים
- "הוסף authentication" → login form, session handling, logout
- "מימוש drag & drop" → draggable items, drop zones, state
- "CRUD מלא" → create, read, update, delete בנפרד

### Rule of Thumb:
> אם אי אפשר לתאר ב-2-3 משפטים, זה גדול מדי.

---

## Acceptance Criteria Best Practices

### ✅ טוב:
```markdown
- [ ] Form validates email format before submit
- [ ] Error message appears below invalid field
- [ ] Submit button disabled until form valid
- [ ] Success toast appears after save
- [ ] Data persists after page refresh
```

### ❌ רע:
```markdown
- [ ] Form works
- [ ] Good UX
- [ ] No bugs
```

**כללים:**
- Specific (ספציפי)
- Testable (ניתן לבדיקה)
- One thing per criterion (דבר אחד לכל קריטריון)

---

## progress.txt Template

ראה את התבנית המלאה ב: `references/templates.md`

**עקרונות מרכזיים:**
- כתוב patterns שעבדו - לא רק מה עשית
- כתוב שגיאות ספציפיות עם פרטים
- כתוב file paths חשובים
- כל iteration תקרא את זה - תכתוב בצורה שתעזור ל-Claude הבא

---

## Integration with Ralph Loop

1. PRD נקרא בתחילת כל iteration
2. Ralph מוצא את ה-task הראשון עם ⬜
3. אחרי הצלחה - מעדכן ל-✅
4. אחרי כישלון - כותב ב-progress.txt
5. הלולאה ממשיכה עד שהכל ✅
