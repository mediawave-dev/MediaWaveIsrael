# Templates

**📌 מקור יחיד לכל התבניות - כל התבניות נמצאות כאן.**

תבניות מוכנות לשימוש לפרויקטים עם Claude Code.

---

## 🎯 Quick Reference

| Template | מטרה | קהל יעד |
|----------|------|---------|
| `story.txt` | סיפור הפרויקט | היוזר (חינוכי) |
| `progress.txt` | לוג טכני | Claude (קונטקסט) |
| `CLAUDE.md` | הגדרות פרויקט | Claude Code |
| `PRD` | דרישות מוצר | Ralph Loop |

---

## story.txt Template - עבור היוזר (MANDATORY)

**מטרה:** לחבר את היוזר לעבודה הטכנית, ללמד מי שאינו מומחה.
**סגנון:** כמו פרזנטציה מעניינת - לא יבש, לא טכני מדי.

```
===========================================
הסיפור של [שם הפרויקט]
התחלה: [תאריך]
===========================================

מה אנחנו בונים:
[תיאור קצר של הפרויקט והמטרה שלו - למה זה חשוב]

---

===========================================
שלב 1: [שם השלב]
זמן: [timestamp]
===========================================

מה עשינו:
[הסבר בעברית פשוטה, כאילו מספרים לחבר מה בדיוק נבנה]

למה ככה:
[הסיבה להחלטות שהתקבלו - למה בחרנו בטכנולוגיה X ולא Y]

מה זה נותן לנו:
[התועלת המיידית - מה אפשר לעשות עכשיו שלא היה אפשר קודם]

קבצים שנוצרו/השתנו:
- [קובץ] - [מה הוא עושה במשפט אחד]

מה הלאה:
[מה השלב הבא ואיך הוא מתחבר לתמונה הגדולה]

---

===========================================
שלב 2: [שם השלב]
זמן: [timestamp]
===========================================

...
```

### כללי כתיבה ל-story.txt

| כלל | הסבר |
|-----|------|
| כתוב כמו שמסבירים לחבר | לא יבש, לא טכני מדי |
| הסבר את ה"למה" | לא רק מה עשית, אלא למה בחרת ככה |
| עדכן בזמן אמת | אחרי כל שלב משמעותי, לא בסוף |
| היה ספציפי | שמות קבצים, מה כל אחד עושה |
| קשר לתמונה הגדולה | איך השלב הזה מקדם את המטרה |

---

## CLAUDE.md Template - Web Application

```markdown
# Project: [PROJECT_NAME]

## Overview
Web application built with [FRAMEWORK].

## Tech Stack
- Frontend: [React/Next.js/Vue]
- Backend: [Node/Python/etc]
- Database: [PostgreSQL/MongoDB/etc]
- Hosting: [Vercel/AWS/etc]

## Available Agents
- @planner - Plan feature implementation
- @architect - System design decisions
- @code-reviewer - Code quality review
- @e2e-runner - E2E test generation

## Commands
- /plan - Create implementation plan
- /code-review - Run code review
- /e2e - Generate E2E tests
- /build-fix - Fix build errors

## Development Workflow
1. /plan - Plan the feature
2. Write tests first
3. Implement
4. /code-review - Review before commit
5. /e2e - Add E2E tests for critical flows

## Coding Standards
- Use TypeScript strict mode
- Follow ESLint/Prettier config
- Components in PascalCase
- Utilities in camelCase

## Testing Requirements
- Unit tests for utilities
- Integration tests for API
- E2E tests for critical flows
- Minimum 80% coverage

## Git Workflow
- Feature branches from main
- PR required for merge
- Conventional commits
```

---

## CLAUDE.md Template - Backend API

```markdown
# Project: [PROJECT_NAME]

## Overview
Backend API service built with [FRAMEWORK].

## Tech Stack
- Runtime: [Node.js/Python/Go]
- Framework: [Express/FastAPI/Gin]
- Database: [PostgreSQL/MongoDB]
- Cache: [Redis]

## Available Agents
- @planner - Plan feature implementation
- @architect - System design decisions
- @code-reviewer - Code quality review
- @security-reviewer - Security analysis
- @tdd-guide - TDD workflow guidance

## Commands
- /plan - Create implementation plan
- /tdd - Start TDD workflow
- /code-review - Run code review
- /test-coverage - Analyze test coverage

## Development Workflow
1. /plan - Plan the feature
2. /tdd - Write tests first (RED)
3. Implement (GREEN)
4. Refactor (IMPROVE)
5. /code-review - Review before commit

## API Design
- RESTful endpoints
- Versioned API (v1, v2)
- Consistent error responses
- Rate limiting enabled

## Security Requirements
- No hardcoded secrets
- Input validation on all endpoints
- SQL injection prevention
- CORS configured

## Testing Requirements
- Unit tests for business logic
- Integration tests for API endpoints
- Minimum 80% coverage
```

---

## CLAUDE.md Template - Mobile App

```markdown
# Project: [PROJECT_NAME]

## Overview
Mobile application built with [FRAMEWORK].

## Tech Stack
- Framework: [React Native/Flutter]
- State: [Redux/MobX/Riverpod]
- Backend: [API endpoint]
- Storage: [AsyncStorage/SQLite]

## Available Agents
- @planner - Plan feature implementation
- @architect - System design decisions
- @code-reviewer - Code quality review

## Commands
- /plan - Create implementation plan
- /code-review - Run code review
- /build-fix - Fix build errors

## Development Workflow
1. /plan - Plan the feature
2. Implement UI components
3. Connect to state management
4. /code-review - Review before commit
5. Test on both platforms

## Platform Requirements
- iOS minimum: 13.0
- Android minimum: API 24
- Test on both platforms

## UI/UX Standards
- Follow platform guidelines
- Responsive layouts
- Accessibility support
- Dark mode support
```

---

## CLAUDE.md Template - ML/AI Project

```markdown
# Project: [PROJECT_NAME]

## Overview
Machine learning project for [OBJECTIVE].

## Tech Stack
- Language: Python 3.10+
- ML Framework: [PyTorch/TensorFlow/scikit-learn]
- Data: [Pandas/Polars]
- Experiment Tracking: [MLflow/W&B]

## Available Agents
- @planner - Plan implementation
- @architect - System design
- @code-reviewer - Code review

## Development Workflow
1. /plan - Define experiment plan
2. Prepare data pipeline
3. Implement model
4. Train and evaluate
5. /code-review - Review before commit
6. Document results

## Project Structure
```
project/
├── data/           # Raw and processed data
├── notebooks/      # Exploration notebooks
├── src/
│   ├── data/       # Data processing
│   ├── models/     # Model definitions
│   ├── training/   # Training scripts
│   └── evaluation/ # Evaluation metrics
├── experiments/    # Experiment configs
└── outputs/        # Model outputs
```

## Experiment Standards
- Log all hyperparameters
- Version datasets
- Reproducible seeds
- Document findings
```

---

## PRD Template

```markdown
# PRD: [Project Name]

## Problem Statement
[What problem? Who has it? Why does it matter?]

## Goals
- [ ] Primary goal with measurable outcome
- [ ] Secondary goal

## Success Criteria
- [How do we know we're done?]
- [What metrics define success?]

## User Stories

### US-001: [Short Name]
**Description:** [2-3 sentences MAX]

**Acceptance Criteria:**
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

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
- [What we're NOT building]

## Tech Stack
- Frontend: [...]
- Backend: [...]
- Database: [...]

## Notes
- [Additional context]
```

---

## progress.txt Template - עבור Claude (Ralph Loop)

**מטרה:** לספק קונטקסט ל-Claude ב-iteration הבא.
**סגנון:** טכני, תמציתי, patterns-oriented.

```markdown
# Progress Log

## Iteration 1 - [Timestamp]
**Task:** US-001 - [Name]
**Status:** ✅ Complete

**What was done:**
- Created [specific files with full paths]
- Modified [exactly what was changed]

**Commit:** feat: US-001 - [message]

**Patterns discovered:**
- [Useful patterns for future iterations]
- [File locations and conventions found]
- [API patterns that worked]

**Tech decisions:**
- [Why chose approach X over Y]

---

## Iteration 2 - [Timestamp]
**Task:** US-002 - [Name]
**Status:** ❌ Failed

**Issue:** [Specific error message or problem]

**Attempted:**
- Tried [approach 1] - failed because [exact reason]
- Tried [approach 2] - failed because [exact reason]

**Root cause analysis:**
- [What's actually going wrong]

**For next iteration:**
- [Specific guidance - not vague hints]
- [Alternative approaches to try]
- [Files to look at]

---
```

**כללי כתיבה ל-progress.txt:**

| ✅ טוב | ❌ רע |
|--------|------|
| `Created src/api/users.ts with CRUD endpoints` | `Created user file` |
| `Error: Cannot find module 'lodash' at line 42` | `Got an error` |
| `Pattern: All services use BaseService class` | `Found patterns` |
| `Next: Try using async/await instead of .then()` | `Fix the bug` |

---

## Status Values

| Status | Meaning | Use |
|--------|---------|-----|
| ⬜ | Not Started | Default for new tasks |
| 🔄 | In Progress | Currently being worked on |
| ✅ | Complete | Task finished successfully |
| ❌ | Blocked | Cannot proceed, needs help |
