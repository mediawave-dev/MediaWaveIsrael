# Tooling Catalog

קטלוג מלא של agents, skills, commands, ו-rules ל-Claude Code.

---

## Agents

סוכני משנה מתמחים. מיקום: `.claude/agents/`. הפעלה: `@agent-name`

### Core Agents (everything-claude-code)

| Agent | Description | Download |
|-------|-------------|----------|
| **planner** | תכנון מימוש פיצ'רים. פירוק משימות לשלבים. | [planner.md](https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/agents/planner.md) |
| **architect** | החלטות עיצוב מערכת. ארכיטקטורה ויחסי קומפוננטות. | [architect.md](https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/agents/architect.md) |
| **code-reviewer** | בדיקת איכות ואבטחה. זיהוי באגים ובעיות ביצועים. | [code-reviewer.md](https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/agents/code-reviewer.md) |
| **security-reviewer** | ניתוח פגיעויות. מציאת חולשות אבטחה. | [security-reviewer.md](https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/agents/security-reviewer.md) |
| **tdd-guide** | הנחיית TDD. כתיבת tests first. | [tdd-guide.md](https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/agents/tdd-guide.md) |
| **e2e-runner** | בדיקות Playwright E2E. יצירת והרצת browser tests. | [e2e-runner.md](https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/agents/e2e-runner.md) |
| **build-error-resolver** | תיקון build failures. ניתוח ופתרון שגיאות compilation. | [build-error-resolver.md](https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/agents/build-error-resolver.md) |
| **refactor-cleaner** | ניקוי dead code. הסרת קוד ו-imports לא בשימוש. | [refactor-cleaner.md](https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/agents/refactor-cleaner.md) |
| **doc-updater** | סנכרון דוקומנטציה. עדכון docs עם שינויי קוד. | [doc-updater.md](https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/agents/doc-updater.md) |

**Source:** https://github.com/affaan-m/everything-claude-code/tree/main/agents

### Extended Agents (VoltAgent - 100+)

| Category | Key Agents | Directory |
|----------|------------|-----------|
| Core Development | full-stack-dev, api-architect, db-specialist | [01-core-development](https://github.com/VoltAgent/awesome-claude-code-subagents/tree/main/categories/01-core-development) |
| Language Specialists | python-pro, typescript-wizard, rust-expert | [02-language-specialists](https://github.com/VoltAgent/awesome-claude-code-subagents/tree/main/categories/02-language-specialists) |
| DevOps & Cloud | docker-expert, k8s-admin, terraform-pro | [03-devops-cloud](https://github.com/VoltAgent/awesome-claude-code-subagents/tree/main/categories/03-devops-cloud) |
| Quality & Testing | test-architect, security-auditor, perf-optimizer | [04-quality-testing](https://github.com/VoltAgent/awesome-claude-code-subagents/tree/main/categories/04-quality-testing) |
| Data & ML | data-engineer, ml-engineer, ai-engineer | [05-data-ml](https://github.com/VoltAgent/awesome-claude-code-subagents/tree/main/categories/05-data-ml) |
| Mobile | ios-developer, android-expert, flutter-pro | [08-mobile](https://github.com/VoltAgent/awesome-claude-code-subagents/tree/main/categories/08-mobile) |

**Source:** https://github.com/VoltAgent/awesome-claude-code-subagents

---

## Skills

ידע שנטען אוטומטית. מיקום: `.claude/skills/`. הפעלה: אוטומטית לפי context.

| Skill | Description | Download |
|-------|-------------|----------|
| **coding-standards** | Best practices לשפות. naming, structure, style. | [coding-standards.md](https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/skills/coding-standards.md) |
| **backend-patterns** | API, database, caching patterns. REST design, query optimization. | [backend-patterns.md](https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/skills/backend-patterns.md) |
| **frontend-patterns** | React, Next.js patterns. State management, component design. | [frontend-patterns.md](https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/skills/frontend-patterns.md) |

**Source:** https://github.com/affaan-m/everything-claude-code/tree/main/skills

---

## Commands

פקודות slash. מיקום: `.claude/commands/`. הפעלה: `/command`

| Command | Action | Download |
|---------|--------|----------|
| **/plan** | תכנון מימוש פיצ'ר | [plan.md](https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/commands/plan.md) |
| **/tdd** | התחלת TDD workflow | [tdd.md](https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/commands/tdd.md) |
| **/code-review** | הרצת code review | [code-review.md](https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/commands/code-review.md) |
| **/e2e** | יצירת E2E tests | [e2e.md](https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/commands/e2e.md) |
| **/build-fix** | תיקון build errors | [build-fix.md](https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/commands/build-fix.md) |
| **/refactor-clean** | הסרת dead code | [refactor-clean.md](https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/commands/refactor-clean.md) |
| **/test-coverage** | ניתוח test coverage | [test-coverage.md](https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/commands/test-coverage.md) |

**Source:** https://github.com/affaan-m/everything-claude-code/tree/main/commands

---

## Rules

כללים פעילים תמיד. מיקום: `.claude/rules/`.

| Rule | Enforces | Download |
|------|----------|----------|
| **security** | ללא secrets בקוד, secure coding | [security.md](https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/rules/security.md) |
| **coding-style** | Immutability, ארגון קבצים | [coding-style.md](https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/rules/coding-style.md) |
| **testing** | TDD, 80% coverage | [testing.md](https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/rules/testing.md) |
| **git-workflow** | פורמט commits, תהליך PR | [git-workflow.md](https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/rules/git-workflow.md) |
| **performance** | בחירת model, ניהול context | [performance.md](https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/rules/performance.md) |

**Source:** https://github.com/affaan-m/everything-claude-code/tree/main/rules

---

## Configuration by Project Type

### Web Application
```
agents/: planner, architect, code-reviewer, e2e-runner
skills/: coding-standards, frontend-patterns, backend-patterns
commands/: /plan, /code-review, /e2e, /build-fix
rules/: security, coding-style, testing, git-workflow
```

### Backend API
```
agents/: planner, architect, code-reviewer, security-reviewer, tdd-guide
skills/: coding-standards, backend-patterns
commands/: /plan, /tdd, /code-review, /test-coverage
rules/: security, coding-style, testing, git-workflow, performance
```

### Mobile App
```
agents/: planner, architect, code-reviewer
skills/: coding-standards, frontend-patterns
commands/: /plan, /code-review, /build-fix
rules/: security, coding-style, testing
```

### ML/AI Project
```
agents/: planner, architect, code-reviewer
         + VoltAgent: ml-engineer, data-engineer, ai-engineer
skills/: coding-standards, backend-patterns
rules/: security, coding-style, testing
```

### DevOps/Infrastructure
```
agents/: planner, architect, security-reviewer
         + VoltAgent: docker-expert, k8s-admin, terraform-pro
skills/: coding-standards
rules/: security, git-workflow
```

### Data Engineering
```
agents/: planner, architect, code-reviewer
         + VoltAgent: data-engineer, etl-specialist
skills/: coding-standards, backend-patterns
rules/: security, testing
```

---

## Hooks

סקריפטים שרצים אוטומטית על אירועים. מיקום: `.claude/hooks/` או `settings.json`.

### Hook Events

| Event | מתי רץ | שימושים |
|-------|--------|---------|
| **PreToolUse** | לפני שClaude משתמש ב-tool | validation, logging, blocking |
| **PostToolUse** | אחרי שClaude משתמש ב-tool | notifications, cleanup |
| **Notification** | כשClaude שולח notification | alerts, logging |
| **Stop** | כשClaude מסיים session | summary, cleanup |
| **SubagentStop** | כשsubagent מסיים | aggregation, reporting |

### דוגמאות שימושיות

```json
// .claude/settings.json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [{
          "type": "command",
          "command": "echo 'About to modify files...'"
        }]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [{
          "type": "command",
          "command": "npm run lint --fix"
        }]
      }
    ],
    "Stop": [
      {
        "hooks": [{
          "type": "command",
          "command": "echo 'Session ended' >> ~/.claude/session.log"
        }]
      }
    ]
  }
}
```

### Hooks נפוצים לפי סוג פרויקט

| פרויקט | Hook מומלץ | מה עושה |
|--------|-----------|---------|
| Web/Backend | PostToolUse + Write | `npm run lint --fix` אחרי כל כתיבה |
| Python | PostToolUse + Write | `ruff check --fix` אחרי כל כתיבה |
| All | Stop | לוג של session לקובץ |
| CI/CD | PreToolUse + Bash | validation לפני הרצת פקודות |

**Source:** https://docs.anthropic.com/en/docs/claude-code/hooks

---

## Context Window Warning

> ⚠️ אל תפעיל יותר מדי MCPs בו-זמנית. 200K context יכול לרדת ל-70K עם יותר מדי tools.

**מגבלות:**
- פחות מ-10 MCPs לפרויקט
- פחות מ-80 tools פעילים
- השתמש ב-`disabledMcpServers` ב-config לכיבוי MCPs לא בשימוש

---

## Community Resources

| Resource | Description | Link |
|----------|-------------|------|
| everything-claude-code | Complete config collection | [GitHub](https://github.com/affaan-m/everything-claude-code) |
| awesome-claude-code | Curated resources | [GitHub](https://github.com/hesreallyhim/awesome-claude-code) |
| VoltAgent subagents | 100+ specialized agents | [GitHub](https://github.com/VoltAgent/awesome-claude-code-subagents) |
| Official Skills | Anthropic's skill repository | [GitHub](https://github.com/anthropics/skills) |
