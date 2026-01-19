# Existing Project - Meta Prompt

## 📂 פשוט העתק והדבק:

```
Analyze this project and use your project-setup skill to present recommendations.

## CRITICAL INSTRUCTIONS - READ CAREFULLY:

1. **BE 100% OBJECTIVE** - No bias toward simplicity or minimalism
2. **IGNORE TOKEN COSTS** - Do NOT optimize for fewer tools/shorter responses
3. **RECOMMEND WHAT'S BEST** - Even if it means 10+ tools, complex setup, or long explanations
4. **JUSTIFY PROFESSIONALLY** - Every recommendation needs solid reasoning
5. **COMPARE ALTERNATIVES** - Show trade-offs, don't just pick one option
6. **NO COMPROMISES** - Quality and completeness over brevity

## MANDATORY: story.txt

Create and maintain a story.txt file in the project root.
This file documents EVERY step of the build process in Hebrew, written like an engaging presentation.
Not dry and technical - a story that anyone can read and understand exactly what was built and why.

After EVERY significant action, append to story.txt:
- What was done (in simple Hebrew, like explaining to a friend)
- Why this approach was chosen
- What benefit it provides
- Files created/modified
- What comes next

This is NOT optional. Every project MUST have story.txt updated in real-time.

## Your Task:

1. **Deep Analysis** - Thoroughly scan the project structure, tech stack, patterns, dependencies, and existing workflows

2. **Project Classification** - Identify the exact project type and its specific needs

3. **Comprehensive Report** - Present ALL relevant recommendations:

   **Agents** - Which agents fit this project? Compare alternatives. Explain what each does and WHY it's needed here.
   
   **Skills** - Which skills would help? What specific problems do they solve for THIS project?
   
   **Commands** - Which slash commands would be useful? In what scenarios?
   
   **Rules** - Which rules should be enforced? What problems do they prevent?
   
   **Hooks** - What automations could improve the workflow? Be specific about triggers and actions.
   
   **Dev Workflow** - Should this project use Planning with Files? Why or why not?

4. **For EACH recommendation:**
   - What problem does it solve?
   - Why is it better than alternatives?
   - What's the trade-off if we skip it?
   - Priority: Must-have / Nice-to-have / Optional

5. **Be Honest About Gaps** - If something is missing from the tooling catalog that this project needs, say so.

DO NOT execute anything - present the full analysis first. I'll decide what to implement.
```

---

## מה קורה אחרי שמעתיקים:

1. **Claude עושה ניתוח עמוק**
   - לא רק מבט מהיר - חקירה אמיתית
   - קורא קבצי config, בודק dependencies
   - מזהה patterns ובעיות פוטנציאליות

2. **Claude מציג דוח מקצועי:**
   ```
   ## Project Analysis
   Type: Web Application
   Stack: Next.js 14, Supabase, TypeScript
   Complexity: Medium-High
   Team Size Indication: Solo/Small team
   
   ## Agents Analysis
   
   ### MUST-HAVE:
   
   **@planner**
   - Problem it solves: Feature creep, unclear requirements
   - Why for THIS project: Complex state management needs clear planning
   - Alternative: Manual planning docs (worse because...)
   - Skip cost: 40% more rework time
   
   **@code-reviewer**
   - Problem it solves: Bugs reaching production
   - Why for THIS project: No existing review process detected
   ...
   
   ### NICE-TO-HAVE:
   
   **@architect**
   - Problem it solves: Technical debt from ad-hoc decisions
   - For THIS project: Current structure is decent, but...
   ...
   
   ## Dev Workflow Recommendation
   
   Should use Planning with Files: YES
   Reason: Project has 15+ components, complex state, multiple integrations
   Specific benefit: task_plan.md would prevent...
   ```

3. **אתה מקבל תמונה מלאה ומחליט**

---

## אחרי שתראה את ההמלצות:

| מה אתה רוצה | מה לכתוב |
|-------------|----------|
| התקן הכל | `Set up everything you recommended` |
| רק Must-haves | `Set up only the must-have items` |
| בחירה ספציפית | `Set up [specific items]` |
| שאלות נוספות | `Explain more about [specific recommendation]` |
| התחל עם PRD | `Now create a PRD for [feature]` |

---

## 💡 למה ההנחיות האלה חשובות?

בלי הנחיות ברורות, LLMs נוטים ל:
- **להמליץ על פחות** - כי תשובות קצרות "נראות" טוב יותר
- **להימנע ממורכבות** - גם כשהיא נחוצה
- **לדלג על trade-offs** - כי זה מאריך את התשובה
- **להתפשר על איכות** - לטובת קיצור

ההנחיות מבטלות את ה-biases האלה ומכריחות ניתוח מקצועי אמיתי.
