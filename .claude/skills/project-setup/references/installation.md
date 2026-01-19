# Installation Guide

הוראות התקנה מלאות לכל סוגי הפרויקטים.

---

## One-Time Setup

### Clone Config Repositories

```bash
# Clone the main config repository
git clone https://github.com/affaan-m/everything-claude-code.git ~/claude-configs

# Optional: Clone VoltAgent for 100+ specialized agents
git clone https://github.com/VoltAgent/awesome-claude-code-subagents.git ~/claude-agents
```

---

## Project Setup

### Create Directory Structure

```bash
# Run in your project directory
mkdir -p .claude/{agents,skills,commands,rules}
```

---

## Installation by Project Type

### Web Application (React/Next.js/Vue)

```bash
# Agents
cp ~/claude-configs/agents/planner.md .claude/agents/
cp ~/claude-configs/agents/architect.md .claude/agents/
cp ~/claude-configs/agents/code-reviewer.md .claude/agents/
cp ~/claude-configs/agents/e2e-runner.md .claude/agents/

# Skills
cp ~/claude-configs/skills/coding-standards.md .claude/skills/
cp ~/claude-configs/skills/frontend-patterns.md .claude/skills/
cp ~/claude-configs/skills/backend-patterns.md .claude/skills/

# Commands
cp ~/claude-configs/commands/plan.md .claude/commands/
cp ~/claude-configs/commands/code-review.md .claude/commands/
cp ~/claude-configs/commands/e2e.md .claude/commands/
cp ~/claude-configs/commands/build-fix.md .claude/commands/

# Rules
cp ~/claude-configs/rules/security.md .claude/rules/
cp ~/claude-configs/rules/coding-style.md .claude/rules/
cp ~/claude-configs/rules/testing.md .claude/rules/
cp ~/claude-configs/rules/git-workflow.md .claude/rules/
```

### Backend API (Node/Python/Go)

```bash
# Agents
cp ~/claude-configs/agents/planner.md .claude/agents/
cp ~/claude-configs/agents/architect.md .claude/agents/
cp ~/claude-configs/agents/code-reviewer.md .claude/agents/
cp ~/claude-configs/agents/security-reviewer.md .claude/agents/
cp ~/claude-configs/agents/tdd-guide.md .claude/agents/

# Skills
cp ~/claude-configs/skills/coding-standards.md .claude/skills/
cp ~/claude-configs/skills/backend-patterns.md .claude/skills/

# Commands
cp ~/claude-configs/commands/plan.md .claude/commands/
cp ~/claude-configs/commands/tdd.md .claude/commands/
cp ~/claude-configs/commands/code-review.md .claude/commands/
cp ~/claude-configs/commands/test-coverage.md .claude/commands/

# Rules
cp ~/claude-configs/rules/security.md .claude/rules/
cp ~/claude-configs/rules/coding-style.md .claude/rules/
cp ~/claude-configs/rules/testing.md .claude/rules/
cp ~/claude-configs/rules/git-workflow.md .claude/rules/
cp ~/claude-configs/rules/performance.md .claude/rules/
```

### Mobile App (React Native/Flutter)

```bash
# Agents
cp ~/claude-configs/agents/planner.md .claude/agents/
cp ~/claude-configs/agents/architect.md .claude/agents/
cp ~/claude-configs/agents/code-reviewer.md .claude/agents/

# Skills
cp ~/claude-configs/skills/coding-standards.md .claude/skills/
cp ~/claude-configs/skills/frontend-patterns.md .claude/skills/

# Commands
cp ~/claude-configs/commands/plan.md .claude/commands/
cp ~/claude-configs/commands/code-review.md .claude/commands/
cp ~/claude-configs/commands/build-fix.md .claude/commands/

# Rules
cp ~/claude-configs/rules/security.md .claude/rules/
cp ~/claude-configs/rules/coding-style.md .claude/rules/
cp ~/claude-configs/rules/testing.md .claude/rules/
```

### ML/AI Project

```bash
# Base agents
cp ~/claude-configs/agents/planner.md .claude/agents/
cp ~/claude-configs/agents/architect.md .claude/agents/
cp ~/claude-configs/agents/code-reviewer.md .claude/agents/

# Skills
cp ~/claude-configs/skills/coding-standards.md .claude/skills/
cp ~/claude-configs/skills/backend-patterns.md .claude/skills/

# Rules
cp ~/claude-configs/rules/security.md .claude/rules/
cp ~/claude-configs/rules/coding-style.md .claude/rules/
cp ~/claude-configs/rules/testing.md .claude/rules/

# Additional from VoltAgent (if cloned)
cp ~/claude-agents/categories/05-data-ml/ml-engineer.md .claude/agents/
cp ~/claude-agents/categories/05-data-ml/data-engineer.md .claude/agents/
```

---

## Direct Download (Without Git Clone)

```bash
# Create structure
mkdir -p .claude/{agents,skills,commands,rules}

# Download specific files
BASE_URL="https://raw.githubusercontent.com/affaan-m/everything-claude-code/main"

# Download agents
for agent in planner architect code-reviewer; do
  curl -o .claude/agents/${agent}.md ${BASE_URL}/agents/${agent}.md
done

# Download skills
for skill in coding-standards backend-patterns frontend-patterns; do
  curl -o .claude/skills/${skill}.md ${BASE_URL}/skills/${skill}.md
done

# Download commands
for cmd in plan code-review build-fix; do
  curl -o .claude/commands/${cmd}.md ${BASE_URL}/commands/${cmd}.md
done

# Download rules
for rule in security coding-style testing git-workflow; do
  curl -o .claude/rules/${rule}.md ${BASE_URL}/rules/${rule}.md
done
```

---

## Ralph Loop Setup

### Create Files

```bash
# Create empty progress.txt
touch progress.txt

# PRD will be created by Claude using the project-setup skill
```

### Create Ralph Script (Bash)

```bash
cat > ralph.sh << 'SCRIPT'
#!/bin/bash
set -e
MAX_ITERATIONS=${1:-10}

PROMPT=$(cat << 'EOF'
Read prd.md and progress.txt.
You are Ralph, an autonomous coding agent. Execute ONE task per iteration.
1. Find first uncompleted task in prd.md (Status: ⬜)
2. Implement that ONE task only
3. If SUCCESS: Update prd.md to ✅, commit, log to progress.txt
4. If FAIL: Log failure to progress.txt
5. Output <ralph>COMPLETE</ralph> if ALL tasks done
EOF
)

for i in $(seq 1 $MAX_ITERATIONS); do
    echo "=== Iteration $i/$MAX_ITERATIONS ==="
    OUTPUT=$(claude --dangerously-skip-permissions -p --output-format text "$PROMPT" 2>&1 | tee /dev/stderr) || true
    if echo "$OUTPUT" | grep -q "<ralph>COMPLETE</ralph>"; then
        echo "✅ All tasks complete!"
        exit 0
    fi
    sleep 2
done
SCRIPT

chmod +x ralph.sh
```

---

## Verification

```bash
# List installed configs
echo "=== Agents ===" && ls .claude/agents/
echo "=== Skills ===" && ls .claude/skills/
echo "=== Commands ===" && ls .claude/commands/
echo "=== Rules ===" && ls .claude/rules/
```

---

## Updating Configs

```bash
# Update source repository
cd ~/claude-configs && git pull

# Re-copy to your project
# (use the same cp commands from your project type above)
```
