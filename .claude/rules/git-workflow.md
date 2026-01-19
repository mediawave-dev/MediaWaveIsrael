# Git Workflow Rules

## Commit Message Format

```
<type>: <description>

[optional body]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `docs` | Documentation only |
| `test` | Adding or updating tests |
| `chore` | Maintenance tasks |
| `perf` | Performance improvement |
| `ci` | CI/CD changes |

### Examples

```bash
feat: add contact form validation
fix: resolve header overlap on mobile
refactor: extract email service from controller
docs: update API documentation
test: add unit tests for user service
```

## Branch Strategy

```
main (production)
  └── develop (staging)
       ├── feature/add-contact-form
       ├── feature/improve-seo
       └── fix/header-mobile
```

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `refactor/description` - Refactoring
- `docs/description` - Documentation

## Pull Request Workflow

1. **Review all commits** (not just the latest)
2. Use `git diff [base-branch]...HEAD` to see changes
3. Create thorough PR summary
4. Document test plan

### PR Template

```markdown
## Summary
- What changed and why

## Changes
- List of changes

## Test Plan
- [ ] Unit tests pass
- [ ] Manual testing done
- [ ] Edge cases covered

## Screenshots (if UI changes)
```

## Feature Implementation Workflow

1. **Planning** - Use @planner agent
2. **TDD** - Write tests first with @tdd-guide
3. **Code Review** - Use @code-reviewer
4. **Commit** - Follow conventional commits

## Pre-Commit Checklist

- [ ] Tests pass
- [ ] Linting passes
- [ ] No console.log
- [ ] No hardcoded secrets
- [ ] Commit message follows format
- [ ] PR description is clear

## Commands

```bash
# Check status
git status

# Create feature branch
git checkout -b feature/my-feature

# Stage changes
git add .

# Commit with message
git commit -m "feat: add new feature"

# Push and create PR
git push -u origin feature/my-feature
```
