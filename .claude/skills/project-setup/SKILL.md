---
name: project-setup
description: Initialize Claude Code projects with optimal configuration. Use when starting a new project, user says "new project", "setup project", "init", "let's build", or has an existing project needing Claude Code tooling. Includes PRD creation, Ralph Loop automation, and battle-tested agents/skills/commands/rules.
---

# Project Setup Skill

מומחה להגדרת פרויקטים עם Claude Code - מפרויקט חדש ועד אוטומציה מלאה.

## ⚠️ Critical Guidelines - When Using This Skill

```
1. BE 100% OBJECTIVE - No bias toward simplicity or minimalism
2. IGNORE TOKEN COSTS - Do NOT optimize for fewer tools/shorter responses  
3. RECOMMEND WHAT'S BEST - Even if it means 10+ tools or complex setup
4. JUSTIFY PROFESSIONALLY - Every recommendation needs solid reasoning
5. COMPARE ALTERNATIVES - Show trade-offs, don't just pick one option
6. NO COMPROMISES - Quality and completeness over brevity
```

**For EACH recommendation include:**
- Problem it solves
- Why it's better than alternatives
- Trade-off if skipped
- Priority: Must-have / Nice-to-have / Optional

---

## 📖 story.txt vs progress.txt - שני קבצים, שני קהלים

### story.txt - MANDATORY for Every Project (עבור היוזר)

**חובה ליצור קובץ story.txt בשורש הפרויקט ולעדכן אותו בכל שלב.**

**מה זה?**
תיעוד חי בעברית של כל שלב בבנייה - כמו פרזנטציה מעניינת שמישהו מעביר.
לא יבש וטכני מדי - אלא סיפור שאפשר לקרוא ולהבין בדיוק מה נבנה ולמה.

**קהל יעד:** היוזר (המפתח/הלקוח) - במיוחד מי שרוצה ללמוד ולהבין.

**למה חובה?**
1. **חיבור לעבודה הטכנית** - היוזר מבין מה קורה בפרויקט שלו
2. **למידה ארכיטקטונית** - גם מי שאינו מומחה לומד איך בונים פרויקט
3. **הבנה עמוקה** - לא רק מה נעשה, אלא למה ואיך
4. **תיעוד לעתיד** - חוזרים לפרויקט אחרי חודש ומבינים הכל

### progress.txt - For Ralph Loop (עבור Claude)

**נוצר אוטומטית כחלק מ-Ralph Loop.**

**מה זה?**
לוג טכני שבו Claude כותב לעצמו מה עשה, מה עבד, מה נכשל - בשפה שהוא יבין הכי טוב.

**קהל יעד:** Claude Code - לקבלת קונטקסט ב-iteration הבא.

**למה צריך?**
- כל iteration של Ralph Loop מתחיל עם context window נקי
- progress.txt מספק את ההיסטוריה בלי לזהם את ה-context
- Claude קורא אותו ומבין מה כבר נעשה ומה נכשל

### ההבדל בקצרה

| קובץ | עבור מי | מטרה | סגנון |
|------|---------|------|-------|
| `story.txt` | היוזר | ללמוד ולהבין את הפרויקט | פרזנטציה מעניינת, חינוכי |
| `progress.txt` | Claude | קונטקסט ל-iteration הבא | טכני, תמציתי, patterns |

### פורמט הכתיבה של story.txt

```
===========================================
שלב [מספר]: [שם השלב]
זמן: [timestamp]
===========================================

מה עשינו:
[הסבר בעברית פשוטה, כאילו מספרים לחבר]

למה ככה:
[הסיבה להחלטות שהתקבלו]

מה זה נותן לנו:
[התועלת המיידית]

קבצים שנוצרו/השתנו:
- [קובץ] - [מה הוא עושה במשפט אחד]

מה הלאה:
[מה השלב הבא]

---
```

### דוגמה

```
===========================================
שלב 1: הקמת שלד הפרויקט
זמן: 2025-01-19 10:30
===========================================

מה עשינו:
יצרנו פרויקט Next.js חדש עם TypeScript. בחרנו ב-App Router 
כי זו הגישה המודרנית של Next.js ותומכת ב-Server Components.
הוספנו TailwindCSS לעיצוב כי זה מאפשר לבנות UI מהר בלי 
לכתוב CSS נפרד.

למה ככה:
Next.js נבחר כי צריך SSR לביצועים ו-SEO. 
TypeScript כי עדיף לתפוס שגיאות בזמן כתיבה ולא בפרודקשן.
Tailwind כי הפרויקט צריך להיבנות מהר ואין מעצב.

מה זה נותן לנו:
בסיס יציב שאפשר להתחיל לבנות עליו מיד. הכל מוגדר נכון 
מההתחלה - לא נצטרך לתקן configurations אחר כך.

קבצים שנוצרו:
- package.json - הגדרות הפרויקט והתלויות
- tsconfig.json - הגדרות TypeScript
- tailwind.config.js - הגדרות עיצוב
- app/layout.tsx - השלד הראשי של האפליקציה
- app/page.tsx - דף הבית

מה הלאה:
נגדיר את מבנה הדאטאבייס ונחבר ל-Supabase.

---

===========================================
שלב 2: חיבור לדאטאבייס
זמן: 2025-01-19 11:15
===========================================

מה עשינו:
חיברנו את הפרויקט ל-Supabase. יצרנו את הטבלאות הראשונות:
users לניהול משתמשים, ו-tasks למשימות. הגדרנו Row Level 
Security כדי שכל משתמש יראה רק את המידע שלו.

למה ככה:
Supabase נבחר כי הוא נותן דאטאבייס PostgreSQL אמיתי עם 
authentication מובנה. ה-RLS חשוב לאבטחה - בלי זה כל 
משתמש יכול לראות מידע של אחרים.

...
```

### כללי כתיבה

1. **כתוב כאילו אתה מסביר לחבר** - לא יבש, לא טכני מדי
2. **הסבר את ה"למה"** - לא רק מה עשית, אלא למה בחרת ככה
3. **עדכן בזמן אמת** - אחרי כל שלב משמעותי, לא בסוף
4. **היה ספציפי** - שמות קבצים, מה כל אחד עושה
5. **קשר לתמונה הגדולה** - איך השלב הזה מקדם את המטרה

---

## 🚀 Quick Start

**לפרויקט חדש:**
→ `prompts/new_project.md` - Claude ישאל שאלות ויציג המלצות (agents, skills, hooks...) ואתה תבחר

**לפרויקט קיים:**
→ `prompts/existing_project.md` - Claude יציג המלצות לשדרוג (agents, skills, hooks...) ואתה תבחר

## Decision Tree: Problem → Action

### Step 1: New or Existing?

| Situation | Go To |
|-----------|-------|
| Starting from scratch | `prompts/new_project.md` |
| Have existing codebase | `prompts/existing_project.md` |
| Just need tooling recommendations | `references/tooling_catalog.md` |
| Want to understand Ralph Loop | `references/ralph_loop.md` |

### Step 2: Identify Project Type

| User Says | Type | Config |
|-----------|------|--------|
| "React", "Next.js", "Vue", "frontend" | Web App | web |
| "React Native", "Flutter", "iOS", "Android" | Mobile | mobile |
| "API", "backend", "FastAPI", "Express" | Backend | backend |
| "ML", "machine learning", "AI", "model" | ML/AI | ml |
| "Docker", "Kubernetes", "Terraform" | DevOps | devops |

### Step 3: Standard Pipeline

```
1. Clarifying Questions → 2. Create PRD → 3. Set Up .claude/ → 4. Create CLAUDE.md → 5. (Optional) Ralph Loop
```

## Critical Rule: Task Sizing for Ralph Loop

**Each user story MUST fit in a single context window (~10 min work).**

| ✅ Good Size | ❌ Too Big |
|--------------|-----------|
| Add a field to database | Build the dashboard |
| Create one UI component | Add authentication system |
| Implement single endpoint | Implement drag & drop |

> **Rule:** If you can't describe it in 2-3 sentences, split it up.

---

## Reference Structure

```
prompts/
├── new_project.md          # 🆕 מטא-פרומפט לפרויקט חדש
└── existing_project.md     # 📂 מטא-פרומפט לפרויקט קיים

references/
├── prd_creation.md         # יצירת PRD + תבנית + task sizing
├── ralph_loop.md           # הסבר מלא + סקריפטים (Bash/PowerShell)
├── tooling_catalog.md      # agents, skills, commands, rules, hooks + configs by project type
├── dev-workflow.md         # 🆕 Planning with Files + Code Best Practices + Testing + Git
├── installation.md         # פקודות התקנה (git clone / curl)
└── templates.md            # תבניות CLAUDE.md + PRD + progress.txt
```

---

## Dev Workflow & Best Practices

Location: `references/dev-workflow.md`

שיטת עבודה מבוססת על Manus AI (שווה $2B) - **Context = RAM, Filesystem = Disk**.

### Planning with Files
למשימות מורכבות (3+ שלבים), צור שלושה קבצים:
- `task_plan.md` - Goal, Success Criteria, Phases, Decisions, Errors
- `findings.md` - מחקר וממצאים
- `progress.md` - לוג התקדמות

### כללי הברזל
- **כלל ה-2 פעולות:** אחרי כל 2 פעולות חיפוש → עדכן findings.md
- **3-Strike Protocol:** 3 שגיאות באותו נושא → עצור וחשוב מחדש
- **קריאה לפני החלטה:** תמיד לקרוא task_plan.md לפני החלטה גדולה

### Code Best Practices
- Single Responsibility
- Error Handling מסודר
- Types over Any
- Configuration לא hardcoded

### Testing & Git
- פירמידת בדיקות (Unit → Integration → E2E)
- Conventional Commits
- Branch Strategy

---

## PRD Creation

Location: `references/prd_creation.md`

- Clarifying questions (1A, 2B, 3C format)
- PRD Template with status markers (⬜/🔄/✅/❌)
- Task sizing guidelines
- Acceptance criteria patterns
- progress.txt format

---

## Ralph Loop

Location: `references/ralph_loop.md`

- What is Ralph Loop (fresh context per iteration)
- Why it works (prevents context rot)
- The command: `claude --dangerously-skip-permissions -p --output-format text`
- Bash script (Linux/Mac)
- PowerShell script (Windows)
- progress.txt patterns
- Troubleshooting

---

## Tooling Catalog

Location: `references/tooling_catalog.md`

### By Category
| Category | Examples |
|----------|----------|
| **Agents** | planner, architect, code-reviewer, security-reviewer, tdd-guide, e2e-runner |
| **Skills** | coding-standards, backend-patterns, frontend-patterns |
| **Commands** | /plan, /tdd, /code-review, /e2e, /build-fix |
| **Rules** | security, coding-style, testing, git-workflow |
| **Hooks** | PreToolUse, PostToolUse, Stop - אוטומציה על אירועים |

### By Project Type
- Web App config
- Backend API config
- Mobile App config
- ML/AI config
- DevOps config

---

## Installation

Location: `references/installation.md`

- One-time setup (clone repos)
- Project setup by type (cp commands)
- Direct download (curl)
- Ralph Loop setup (scripts + files)

---

## Templates

Location: `references/templates.md`

- CLAUDE.md for Web App
- CLAUDE.md for Backend API
- CLAUDE.md for Mobile
- CLAUDE.md for ML/AI
- PRD template
- progress.txt template

---

## Context Window Warning

> ⚠️ Don't enable too many MCPs at once. 200K context can shrink to 70K.

**Limits:** <10 MCPs, <80 tools. Use `disabledMcpServers` for unused MCPs.

---

## Community Resources

| Resource | Link |
|----------|------|
| everything-claude-code | https://github.com/affaan-m/everything-claude-code |
| awesome-claude-code | https://github.com/hesreallyhim/awesome-claude-code |
| VoltAgent subagents | https://github.com/VoltAgent/awesome-claude-code-subagents |
| Official Skills | https://github.com/anthropics/skills |

---

## 📦 התקנת הסקיל

### מיקום הסקיל

| מיקום | זמינות | נתיב |
|-------|--------|------|
| **Personal (מומלץ)** | כל הפרויקטים | `~/.claude/skills/project-setup/SKILL.md` |
| **Project** | פרויקט ספציפי | `.claude/skills/project-setup/SKILL.md` |

### התקנה

```bash
# Personal - זמין בכל הפרויקטים (מומלץ)
mkdir -p ~/.claude/skills/project-setup
cp -r project-setup/* ~/.claude/skills/project-setup/

# או Project - רק לפרויקט הנוכחי
mkdir -p .claude/skills/project-setup
cp -r project-setup/* .claude/skills/project-setup/
```

### מבנה נדרש

```
project-setup/
├── SKILL.md              # חובה! השם חייב להיות SKILL.md
├── prompts/              # אופציונלי
└── references/           # אופציונלי
```

> ⚠️ **חשוב:** השם חייב להיות `SKILL.md` (לא skill.md או אחר). Claude Code מחפש את הקובץ הזה בדיוק.

---

## הוראות שימוש

1. **התקן את הסקיל** למיקום המתאים (ראה למעלה)
2. **בחר את הפרומפט המתאים** מתוך `prompts/`
3. **ענה על שאלות ההבהרה** - בפורמט 1A, 2B, 3C
4. **אשר את ה-PRD** - לפני שמתחילים לכתוב קוד
5. **הגדר את .claude/** - עם tooling מתאים (ראה `references/tooling_catalog.md`)
6. **(אופציונלי) הרץ Ralph Loop** - לפיתוח אוטונומי (ראה `references/ralph_loop.md`)
