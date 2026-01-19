# New Project - Meta Prompt

## 🚀 פשוט העתק והדבק:

```
I want to start a new project. Use your project-setup skill to help me.

## CRITICAL INSTRUCTIONS - READ CAREFULLY:

1. **BE 100% OBJECTIVE** - No bias toward simplicity or minimalism
2. **IGNORE TOKEN COSTS** - Do NOT optimize for fewer tools/shorter responses
3. **RECOMMEND WHAT'S BEST** - Even if it means 10+ tools, complex setup, or long explanations
4. **JUSTIFY PROFESSIONALLY** - Every recommendation needs solid reasoning
5. **COMPARE ALTERNATIVES** - Show trade-offs, don't just pick one option
6. **NO COMPROMISES** - Quality and completeness over brevity

## MANDATORY: story.txt

Once we start building, create and maintain a story.txt file in the project root.
This file documents EVERY step of the build process in Hebrew, written like an engaging presentation.
Not dry and technical - a story that anyone can read and understand exactly what was built and why.

After EVERY significant action, append to story.txt:
- What was done (in simple Hebrew, like explaining to a friend)
- Why this approach was chosen
- What benefit it provides
- Files created/modified
- What comes next

This is NOT optional. Every project MUST have story.txt updated in real-time.

## Step 1: Ask Clarifying Questions

Ask me detailed questions to understand:
- What problem am I solving? For whom?
- What are the must-have features?
- What's the scale (users, data, complexity)?
- What tech stack do I prefer (if any)?
- What's my experience level with relevant technologies?
- Any constraints (time/budget/team/infrastructure)?
- What does success look like?

## Step 2: After I Answer - Present Comprehensive Analysis

DO NOT execute anything yet. Present a full professional report:

**Project Classification**
- Type, complexity, scale assessment

**Recommended Tech Stack**
- For each technology choice: WHY it fits, what are the alternatives, trade-offs

**Agents Analysis**
- For each agent: What problem does it solve? Why for THIS project? Priority level? Skip cost?
- Compare alternatives where relevant

**Skills Analysis**  
- Which skills are relevant? What specific problems do they solve?

**Commands Analysis**
- Which slash commands? In what scenarios would I use each?

**Rules Analysis**
- Which rules? What problems do they prevent? Consequences of skipping?

**Hooks Analysis**
- What automations? Specific triggers and actions. Workflow improvement estimate.

**Dev Workflow Recommendation**
- Should I use Planning with Files for this project?
- Why or why not? Be specific.

**For EACH recommendation include:**
- Problem it solves
- Why it's better than alternatives  
- Trade-off if skipped
- Priority: Must-have / Nice-to-have / Optional

**Be Honest About Gaps**
- If something is needed but not in your tooling catalog, say so
- If my idea has potential issues, warn me

I'll decide what to implement after seeing the complete picture.
```

---

## מה קורה אחרי שמעתיקים:

### שלב 1: Claude שואל שאלות מעמיקות
```
לפני שאמליץ, אני צריך להבין לעומק:

**על הבעיה:**
1. מה הבעיה המדויקת שאתה פותר?
2. מי הקהל? כמה משתמשים צפויים?
3. איך פותרים את זה היום (אם בכלל)?

**על הפתרון:**
4. מה 3-5 הפיצ'רים הקריטיים ל-MVP?
5. מה בהחלט לא צריך להיות בגרסה הראשונה?
6. איך נראית הצלחה אחרי 3 חודשים?

**על הטכנולוגיה:**
7. יש לך העדפות טכנולוגיות? ניסיון קודם?
8. איפה זה ירוץ? (Vercel, AWS, self-hosted...)
9. יש אינטגרציות נדרשות?

**על המגבלות:**
10. לו"ז? תקציב? גודל צוות?
11. דרישות אבטחה/compliance מיוחדות?
```

### שלב 2: אתה עונה בפירוט

### שלב 3: Claude מציג ניתוח מקצועי מלא
```
## Project Analysis

**Classification:** B2B SaaS Web Application
**Complexity:** High
**Scale:** Medium (1K-10K users)
**Risk Areas:** Real-time sync, data consistency

---

## Tech Stack Analysis

### Frontend: Next.js 14 (App Router)
**Why:** SSR for SEO, React ecosystem, Vercel deployment
**Alternatives considered:**
- Remix: Better nested routing, but smaller ecosystem
- SvelteKit: Faster, but team has React experience
**Trade-off:** Slightly more complex than Remix for forms

### Backend: Supabase
**Why:** Real-time built-in, auth included, PostgreSQL
**Alternatives considered:**
- Firebase: NoSQL limits complex queries
- Custom: 3x development time
**Trade-off:** Vendor lock-in

---

## Agents Analysis

### MUST-HAVE (Skip Cost: High)

**@planner** - Priority: Critical
- Problem: Feature creep, scope unclear
- For THIS project: 15+ user stories, complex flows
- Skip cost: 50%+ rework, missed edge cases
- Alternative: Manual planning (slower, less structured)

**@architect** - Priority: Critical  
- Problem: Technical debt from day 1
- For THIS project: Real-time + auth + complex state
- Skip cost: Refactoring hell at 6 months
- Alternative: None adequate

**@code-reviewer** - Priority: High
- Problem: Bugs, inconsistencies
- For THIS project: Solo developer = no second pair of eyes
- Skip cost: 2x bug rate in production

### NICE-TO-HAVE (Skip Cost: Medium)

**@security-reviewer** - Priority: Medium
- Problem: Vulnerabilities
- For THIS project: User data, payments
- Skip cost: Potential breach, compliance issues

---

## Dev Workflow Recommendation

**Use Planning with Files:** YES - STRONGLY RECOMMENDED

**Reasoning:**
- Project has 15+ features
- Multiple integrations (Stripe, email, real-time)
- Solo developer = high context-switching cost
- 3-month timeline = can't afford rework

**Specific files needed:**
- task_plan.md for each major feature
- findings.md for integration research
- progress.md for daily continuity

**Skip cost:** Based on similar projects, 40% more time without structured planning.

---

## Gaps & Warnings

⚠️ **Warning:** Real-time features are complex. Consider starting with polling and upgrading to WebSockets in v2.

⚠️ **Gap:** No specific Supabase agent in catalog. Use @architect for Supabase-specific decisions.
```

### שלב 4: אתה מחליט מה להתקין

---

## אחרי שתראה את ההמלצות:

| מה אתה רוצה | מה לכתוב |
|-------------|----------|
| התקן הכל | `Set up everything you recommended` |
| רק Must-haves | `Set up only the must-have items` |
| בחירה ספציפית | `Set up [specific items]` |
| שאלות נוספות | `Explain more about [specific recommendation]` |
| התחל עם PRD | `Now create a PRD based on our discussion` |
| Ralph Loop | `Set up everything and initialize Ralph Loop` |

---

## 💡 למה ההנחיות האלה חשובות?

בלי הנחיות ברורות, LLMs נוטים ל:
- **להמליץ על פחות** - כי תשובות קצרות "נראות" טוב יותר
- **להימנע ממורכבות** - גם כשהיא נחוצה
- **לדלג על trade-offs** - כי זה מאריך את התשובה
- **להתפשר על איכות** - לטובת קיצור
- **לא להזהיר** - כי זה "שלילי"

ההנחיות מבטלות את ה-biases האלה ומכריחות ניתוח מקצועי אמיתי.
