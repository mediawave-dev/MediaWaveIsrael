---
name: dev-best-practices
description: אוסף כללים ושיטות עבודה מומלצות לפיתוח תוכנה. כולל תכנון משימות, ניהול קוד, testing, ועוד. מתעדכן באופן שוטף עם טכניקות חדשות.
---

# Dev Best Practices 📘

> אוסף מתפתח של שיטות עבודה מומלצות לפיתוח תוכנה.
> **עדכון אחרון:** 2025-01-18

---

## 📚 תוכן עניינים

1. [Planning with Files](#-planning-with-files) - ניהול משימות מורכבות
2. [Code Best Practices](#-code-best-practices) - עקרונות קוד
3. [Testing](#-testing) - אסטרטגיית בדיקות
4. [Git Workflow](#-git-workflow) - עבודה עם Git
5. [Quick References](#-quick-references) - טבלאות מהירות
6. [טכניקות נוספות](#-טכניקות-נוספות) - יתווספו בהמשך

---

# 📋 Planning with Files

> מבוסס על Manus AI - שיטת העבודה שהפכה לשווה $2B
> **עקרון הליבה:** Context Window = RAM (נדיף). Filesystem = Disk (מתמשך). → כל דבר חשוב נכתב לדיסק.

---

## 🎯 מתי להפעיל

| סוג משימה | להפעיל? |
|-----------|---------|
| שאלה פשוטה / lookup | ❌ לא |
| תיקון קובץ בודד | ❌ לא |
| משימה עם 3+ שלבים | ✅ כן |
| בניית פיצ'ר חדש | ✅ כן |
| רפקטורינג | ✅ כן |
| מחקר + מימוש | ✅ כן |
| צפי ל-5+ tool calls | ✅ כן |

---

## 📋 שלושת קבצי התכנון

בתחילת כל משימה מורכבת, צור **בתיקיית הפרויקט** שלושה קבצים:

### 1. task_plan.md

```markdown
# Task Plan: [שם המשימה]

## Goal
[תיאור ברור של מה צריך להשיג]

## Success Criteria
- [ ] קריטריון 1
- [ ] קריטריון 2
- [ ] קריטריון 3

## Phases
| # | Phase | Status | Description |
|---|-------|--------|-------------|
| 1 | Planning | 🔄 in_progress | תכנון ופירוק |
| 2 | Research | ⬜ pending | מחקר וחקירה |
| 3 | Implementation | ⬜ pending | מימוש |
| 4 | Testing | ⬜ pending | בדיקות |
| 5 | Completion | ⬜ pending | סיום ותיעוד |

### Phase 1: Planning
- [x] הגדרת Goal
- [ ] פירוק לשלבים
- **Status:** 🔄 in_progress

### Phase 2: Research
- [ ] חקירת מערכת קיימת
- [ ] בחירת גישה
- **Status:** ⬜ pending

### Phase 3: Implementation
- [ ] מימוש core
- [ ] edge cases
- **Status:** ⬜ pending

### Phase 4: Testing
- [ ] בדיקות
- **Status:** ⬜ pending

### Phase 5: Completion
- [ ] תיעוד
- [ ] cleanup
- **Status:** ⬜ pending

## Decisions Made
| Decision | Rationale | Date |
|----------|-----------|------|

## Errors Encountered
| Error | Solution | Date |
|-------|----------|------|

## Current Status
**Phase 1** - Planning
```

### 2. findings.md

```markdown
# Findings: [שם המשימה]

## Research Summary
[סיכום קצר]

## System Analysis
### Key Files
| File | Purpose |
|------|---------|

### Patterns Found
- pattern 1
- pattern 2

## Technical Decisions
| Decision | Options | Chosen | Why |
|----------|---------|--------|-----|

## Resources
- [name](url)

## Open Questions
- [ ] שאלה 1?
```

### 3. progress.md

```markdown
# Progress Log: [שם המשימה]

## Session: [DATE]

### Actions
| Time | Action | Result |
|------|--------|--------|

### Files Modified
| File | Change |
|------|--------|

### Errors
| Error | Fix |
|-------|-----|

### Next Session
- [ ] המשך עם...
```

---

## 📏 כללי הברזל

### כלל 1: תמיד להתחיל עם תוכנית
```
❌ לא: מתחיל לעבוד מיד
✅ כן: יוצר task_plan.md → מתחיל
```

### כלל 2: כלל ה-2 פעולות
אחרי כל **2 פעולות חיפוש/קריאה** - חובה לעדכן findings.md:
```
פעולה 1: search/read → רושם בראש
פעולה 2: search/read → מעדכן findings.md!
פעולה 3: search/read → רושם בראש
פעולה 4: search/read → מעדכן findings.md!
```

### כלל 3: תיעוד שגיאות
כל שגיאה נכנסת לטבלת Errors ב-task_plan.md:
```markdown
| Error | Solution | Date |
|-------|----------|------|
| Module not found | npm install X | 2025-01-18 |
```
**למה?** שגיאה מתועדת = לא חוזרים עליה.

### כלל 4: קריאה לפני החלטה
לפני כל החלטה משמעותית:
1. קרא את task_plan.md
2. המטרות עכשיו "טריות" בקונטקסט
3. קבל את ההחלטה

### כלל 5: 3-Strike Protocol
```
Strike 1: שגיאה → תעד → נסה אחרת
Strike 2: שגיאה → תעד → נסה שלישית  
Strike 3: שגיאה → עצור, חשוב מחדש, עדכן תוכנית
```

### כלל 6: וידוא סיום
לפני סיום משימה, וודא:
- [ ] כל ה-Phases מסומנים ✅ complete
- [ ] כל ה-Success Criteria מסומנים
- [ ] שגיאות מתועדות
- [ ] קבצים מעודכנים

---

## 🔄 זרימת עבודה

```
[משימה חדשה]
      ↓
[האם מורכבת? 3+ שלבים?]
      ↓
   כן → צור task_plan.md, findings.md, progress.md
      ↓
[לולאת עבודה]
   ┌─────────────────────────────┐
   │ 1. קרא task_plan.md        │
   │ 2. בצע עבודה               │
   │ 3. עדכן קבצים מתאימים      │
   │ 4. סמן התקדמות             │
   └─────────────────────────────┘
      ↓
[כל השלבים complete?]
      ↓
   כן → סיים ✅
```

---

## 🔧 מתי לעדכן מה

| אירוע | עדכן |
|-------|------|
| מצאת מידע חדש | findings.md |
| אחרי 2 פעולות חיפוש | findings.md (חובה!) |
| סיימת פעולה | progress.md |
| קיבלת שגיאה | task_plan.md → Errors |
| קיבלת החלטה | task_plan.md → Decisions |
| סיימת שלב | task_plan.md → Status ✅ |
| לפני החלטה גדולה | קרא task_plan.md |

---

## 💡 למה זה עובד?

אחרי 50+ tool calls, המטרות המקוריות "רחוקות" בקונטקסט ונשכחות.
קריאה חוזרת של task_plan.md מביאה את המטרות חזרה ל"חלון הקשב".

```
תחילת הקונטקסט: [מטרה מקורית - נשכחה]
...הרבה tool calls...
סוף הקונטקסט: [task_plan.md שנקרא עכשיו - מקבל תשומת לב!]
```

---

# 💻 Code Best Practices

## מבנה פרויקט
```
project/
├── CLAUDE.md          # הקשר קבוע לקלוד
├── README.md
├── src/
│   ├── index.ts
│   ├── config/
│   ├── services/
│   └── utils/
├── tests/
└── docs/
```

## CLAUDE.md Template
```markdown
# [Project Name]

## Stack
- Language: TypeScript
- Framework: Next.js
- Database: PostgreSQL

## Conventions
- Style: [guide]
- Comments: [language]
- Tests: Required for new features

## Key Commands
npm run dev / test / build

## Key Files
| File | Purpose |
|------|---------|
```

## עקרונות קוד

### 1. Single Responsibility
פונקציה אחת = משימה אחת
```typescript
// ❌ פונקציה עושה הכל
function handleUser(action, data) { ... }

// ✅ פונקציות ממוקדות
function createUser(data) { ... }
function updateUser(id, data) { ... }
```

### 2. Error Handling
לתפוס, לתעד, לזרוק הלאה
```typescript
// ❌ בולע שגיאות
try { await op(); } catch (e) { console.log(e); }

// ✅ טיפול מסודר
try {
  await op();
} catch (error) {
  logger.error('Failed', { error, context });
  throw new AppError('OP_FAILED', error);
}
```

### 3. Types over Any
להגדיר interfaces, לא any
```typescript
// ❌
function process(data: any) { ... }

// ✅
interface UserData { id: string; name: string; }
function process(data: UserData) { ... }
```

### 4. Configuration
לא hardcoded values
```typescript
// ❌ hardcoded
const API_URL = 'https://api.example.com';

// ✅ configurable
const API_URL = process.env.API_URL || 'http://localhost:3000';
```

---

# 🧪 Testing

## פירמידה
```
     /\      E2E (מעט)
    /--\     Integration (בינוני)  
   /----\    Unit (הרבה)
```

## Unit Test Example
```typescript
describe('UserService', () => {
  describe('createUser', () => {
    it('should create user with valid data', async () => {
      const result = await service.createUser(validData);
      expect(result.id).toBeDefined();
    });

    it('should throw on invalid email', async () => {
      await expect(service.createUser(invalidData))
        .rejects.toThrow('Invalid email');
    });
  });
});
```

## Checklist לפני סיום
- [ ] בדיקות עוברות
- [ ] Coverage לא ירד
- [ ] אין console.log
- [ ] Types מוגדרים
- [ ] תיעוד מעודכן

---

# 📝 Git Workflow

## Commit Format
```
type(scope): description

feat(auth): add JWT refresh
fix(api): handle null response
docs: update README
```

## Types
| Type | שימוש |
|------|-------|
| `feat` | פיצ'ר חדש |
| `fix` | תיקון באג |
| `docs` | תיעוד |
| `refactor` | שינוי ללא שינוי התנהגות |
| `test` | בדיקות |
| `chore` | תחזוקה |

## Branch Strategy
```
main
  └── develop
        ├── feature/add-login
        ├── feature/dashboard
        └── fix/api-timeout
```

---

# 📚 Quick References

## 🚫 Anti-Patterns

| ❌ לא | ✅ כן |
|------|------|
| להתחיל בלי תוכנית | task_plan.md קודם |
| לשכוח לעדכן | עדכון אחרי כל 2 פעולות |
| לחזור על שגיאות | לתעד ב-Errors |
| לדחוס ל-context | לשמור בקבצים |
| לסיים עם pending | לוודא הכל complete |
| להחליט בלי לקרוא | לקרוא task_plan.md קודם |

## 📊 Status Icons

| Icon | משמעות |
|------|--------|
| ✅ | Complete |
| 🔄 | In Progress |
| ⬜ | Pending |
| ❌ | Failed/Blocked |
| ⚠️ | Warning |

## 🎯 Quick Start - משימה מורכבת

1. **צור task_plan.md** עם Goal, Success Criteria, Phases
2. **צור findings.md** ריק למחקר
3. **צור progress.md** ריק ללוג
4. **עבוד בלולאה:**
   - קרא plan → עבוד → עדכן → סמן
5. **לפני סיום:** וודא הכל ✅

---

# 🔧 טכניקות נוספות

> סעיף זה יתעדכן עם טכניקות חדשות שאמצא

### [ריק - יתמלא בהמשך]

---

# 📌 רעיונות להוספה עתידית

- [ ] Prompt engineering tips
- [ ] Debug strategies
- [ ] Performance optimization
- [ ] Security checklist
- [ ] API design patterns
- [ ] Database best practices
- [ ] Context window optimization
- [ ] Multi-agent workflows
- [ ] Custom MCP tools

---

# 📝 Changelog

| תאריך | שינוי |
|-------|-------|
| 2025-01-18 | גרסה ראשונה - Planning with Files, Code Practices, Testing, Git |

---

*עדכן את הקובץ הזה כשמוצאים טכניקות חדשות שעובדות טוב!*
