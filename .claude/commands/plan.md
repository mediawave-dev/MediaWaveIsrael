# Plan Command

Create a comprehensive implementation plan before coding.

## Usage

```
/plan [feature description]
```

## When to Use

- New features
- Significant architectural changes
- Complex refactoring
- Multi-file changes
- Unclear requirements

## What It Does

1. **Requirement Clarification** - Restates what needs building
2. **Risk Assessment** - Identifies potential blockers
3. **Phased Breakdown** - Structures work into actionable steps
4. **Confirmation Gate** - Waits for user approval

## Output Structure

- Restated requirements in clear language
- Phase-based implementation structure
- Component dependency mapping
- Risk categorization (HIGH/MEDIUM/LOW)
- Effort estimates

## Critical Rule

**The planner will NOT write any code until you explicitly confirm the plan.**

You can request:
- Modifications
- Alternative approaches
- Phase reordering

## Related Commands

- `/tdd` - Test-Driven Development workflow
- `/build-fix` - Fix build errors
- `/code-review` - Review code changes
