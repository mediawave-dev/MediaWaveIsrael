# Ralph Loop - Autonomous Development

## מה זה Ralph Loop?

לולאת פיתוח אוטונומית שמריצה את Claude Code שוב ושוב עם **context חדש בכל iteration**.

השם מגיע מ-Ralph Wiggum מהסימפסונס - פילוסופיה של להמשיך לנסות למרות כישלונות.

## למה זה עובד?

### Context Rot

> **Context Rot** = ירידה הדרגתית בדיוק של AI כש-context window מתמלא ברעש שמטשטש את הקו הישר.

### הפתרון: Fresh Context

```
┌─────────────────────────────────────────────┐
│              RALPH LOOP                      │
├─────────────────────────────────────────────┤
│  1. פתיחת context window חדש וטרי           │
│  2. קריאת prd.md → מציאת task הבא          │
│  3. קריאת progress.txt → קבלת context       │
│  4. מימוש task אחד בלבד                     │
│  5. הרצת tests                              │
│  6. אם הצלחה:                               │
│     - סימון task כ-✅ ב-prd.md              │
│     - commit                                │
│     - כתיבה ל-progress.txt                  │
│  7. אם כישלון:                              │
│     - לא לסמן!                              │
│     - כתיבת פרטי כישלון ל-progress.txt      │
│  8. יציאה → הלולאה מתחילה מחדש              │
└─────────────────────────────────────────────┘
```

**הכוח של Ralph Loop:**
- כל iteration מתחילה נקייה
- אין רעש מצטבר מניסיונות קודמים
- progress.txt מספק היסטוריה בלי לזהם את ה-context

---

## ⚠️ חשוב!

**Ralph Loop ≠ Ralph Plugin**

ה-plugin הרשמי של Anthropic לא מנהל context חדש בכל iteration!
Ralph Loop האמיתי = לולאת bash/powershell שמריצה claude מחדש.

---

## Required Files

| File | Purpose |
|------|---------|
| `prd.md` | מקור האמת. רשימת tasks עם status. מתעדכן כש-tasks מושלמים. |
| `progress.txt` | לוג הרצה. Claude כותב הצלחות/כישלונות לiterations הבאות. |

---

## The Command

```bash
claude --dangerously-skip-permissions -p --output-format text "[PROMPT]"
```

**Flags:**
- `--dangerously-skip-permissions` - מצב לא-אינטראקטיבי (בלי confirmations)
- `-p` - קבלת prompt כארגומנט
- `--output-format text` - פלט טקסט פשוט

---

## Ralph Script - Bash (Linux/Mac)

שמור כ-`ralph.sh`:

```bash
#!/bin/bash
set -e
MAX_ITERATIONS=${1:-10}

PROMPT=$(cat << 'EOF'
Read prd.md and progress.txt.

You are Ralph, an autonomous coding agent. Execute ONE task per iteration.

## Execution Plan
1. Find first uncompleted task in prd.md (Status: ⬜)
2. Check progress.txt for relevant patterns/context
3. Implement that ONE task only
4. Run tests/typecheck
5. If SUCCESS:
   - Update prd.md: change status to ✅
   - Commit: "feat: [US-XXX] - [title]"
   - Append to progress.txt what worked
6. If FAIL:
   - Do NOT change status
   - Do NOT commit
   - Append failure details to progress.txt
7. Output <ralph>COMPLETE</ralph> if ALL tasks done
8. Output <ralph>STUCK</ralph> if blocked after 3 attempts

## Rules
- ONE task per iteration
- Each iteration = fresh context, so write everything important to progress.txt
- Be specific in progress.txt about what worked and what didn't
EOF
)

echo "Starting Ralph Loop - $MAX_ITERATIONS iterations"

for i in $(seq 1 $MAX_ITERATIONS); do
    echo "═══ Iteration $i of $MAX_ITERATIONS ═══"
    
    OUTPUT=$(claude --dangerously-skip-permissions -p --output-format text "$PROMPT" 2>&1 | tee /dev/stderr) || true
    
    if echo "$OUTPUT" | grep -q "<ralph>COMPLETE</ralph>"; then
        echo "✅ All tasks complete!"
        exit 0
    fi
    
    if echo "$OUTPUT" | grep -q "<ralph>STUCK</ralph>"; then
        echo "❌ Ralph is stuck. Check progress.txt for details."
        exit 2
    fi
    
    sleep 2
done

echo "⚠️ Max iterations reached"
exit 1
```

**להפוך לexecutable:**
```bash
chmod +x ralph.sh
```

**להרצה:**
```bash
./ralph.sh 15    # 15 iterations
```

---

## Ralph Script - PowerShell (Windows)

שמור כ-`ralph.ps1`:

```powershell
param([int]$Iterations = 10)

$prompt = @"
Read prd.md and progress.txt.

You are Ralph, an autonomous coding agent. Execute ONE task per iteration.

## Execution Plan
1. Find first uncompleted task in prd.md (Status: ⬜)
2. Check progress.txt for relevant patterns/context
3. Implement that ONE task only
4. Run tests/typecheck
5. If SUCCESS: Update prd.md status to ✅, commit, log to progress.txt
6. If FAIL: Do NOT change status, log failure to progress.txt
7. Output <ralph>COMPLETE</ralph> if ALL tasks done
8. Output <ralph>STUCK</ralph> if blocked after 3 attempts

## Rules
- ONE task per iteration
- Write everything important to progress.txt (fresh context each time!)
"@

Write-Host "Starting Ralph Loop - $Iterations iterations"

for ($i = 1; $i -le $Iterations; $i++) {
    Write-Host "=== Iteration $i of $Iterations ==="
    
    $output = claude --dangerously-skip-permissions -p --output-format text $prompt 2>&1
    Write-Host $output
    
    if ($output -match "<ralph>COMPLETE</ralph>") {
        Write-Host "✅ All tasks complete!"
        exit 0
    }
    
    if ($output -match "<ralph>STUCK</ralph>") {
        Write-Host "❌ Ralph is stuck. Check progress.txt"
        exit 2
    }
    
    Start-Sleep -Seconds 2
}

Write-Host "⚠️ Max iterations reached"
exit 1
```

**להרצה:**
```powershell
.\ralph.ps1 -Iterations 15
```

---

## Usage Flow

```bash
# Step 1: יצירת PRD (אינטראקטיבי, פעם אחת)
claude "Use your project-setup skill to create a PRD for [your idea]"

# Step 2: הפיכת הסקריפט ל-executable
chmod +x ralph.sh

# Step 3: הרצת Ralph Loop
./ralph.sh 15
```

---

## Best Practices

### 1. Task Sizing
כל task חייב להתאים ל-~10 דקות עבודה.
אם גדול מדי - פרק ב-PRD לפני שמריצים.

### 2. progress.txt (ראה תבנית מלאה ב-`references/templates.md`)
- כתוב patterns שעבדו - לא רק מה עשית
- כתוב שגיאות ספציפיות עם error messages מדויקים
- כתוב file paths מלאים
- כתוב root cause analysis - לא רק "נכשל"
- **זכור:** Iteration הבאה תקרא את זה - תכתוב בצורה שתעזור ל-Claude הבא!

### 3. Monitoring
- עקוב אחרי הפלט
- עצור אם משהו לא הגיוני
- בדוק את progress.txt אם תקוע

### 4. Costs
- כל iteration = קריאת API
- שים limit הגיוני (10-20 iterations)
- תחשוב על עלות לפני overnight runs

---

## Troubleshooting

### "Ralph gets stuck on same task"
- בדוק progress.txt - האם יש מספיק פרטים?
- אולי ה-task גדול מדי - פרק אותו ב-PRD
- הוסף hints ב-progress.txt

### "Ralph breaks things"
- הוסף tests ל-acceptance criteria
- הוסף "run tests before commit" ל-prompt
- שקול לעשות git stash לפני כל run

### "Context window fills up"
- וודא ש-PRD ו-progress.txt לא ארוכים מדי
- מחק iterations ישנות מ-progress.txt
- שמור רק מידע רלוונטי

---

## 🚀 Advanced: Ralphie - Multi-Agent Orchestration

למי שרוצה לקחת את Ralph Loop לשלב הבא.

### מה זה Ralphie?

Ralphie הוא **מערכת אורקסטרציה מלאה** - לא plugin אלא framework שמאפשר:

- **הרצה מקבילית** - כמה AI agents עובדים בו-זמנית
- **Git worktrees נפרדים** - כל agent עובד בסביבה מבודדת
- **תמיכה ב-PRD/YAML/GitHub Issues** כמקור tasks
- **ניהול branches אוטומטי** - branch per task, auto PR
- **פתרון merge conflicts עם AI**

### ההבדל מ-Ralph Loop

| תכונה | Ralph Loop | Ralphie |
|-------|------------|---------|
| מקביליות | ❌ סדרתי | ✅ מקבילי |
| AI Engines | Claude Code בלבד | Claude Code, OpenCode, Cursor |
| Branch Management | ידני | אוטומטי |
| Task Sources | PRD בלבד | PRD, YAML, GitHub Issues |
| מורכבות | פשוט | מתקדם |

### מתי להשתמש ב-Ralphie?

- יש לך **רשימה ארוכה של tasks** שיכולים לרוץ במקביל
- אתה רוצה **branch per feature** אוטומטי
- עבודת צוות עם **PR workflow**
- פרויקטים גדולים עם **dependencies בין tasks**

### מתי להישאר עם Ralph Loop?

- Task בודד ומורכב עם success criteria ברורים
- פרויקט קטן/בינוני
- רוצה שליטה פשוטה ומלאה

### למידע נוסף

- GitHub: חפש "Ralphie Claude Code"
- המלצה: התחל עם Ralph Loop הבסיסי, עבור ל-Ralphie כשצריך scale
