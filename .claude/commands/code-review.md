# Code Review Command

Run a comprehensive security and quality review on uncommitted changes.

## Usage

```
/code-review
```

## Process

1. Identify changed files using `git diff --name-only HEAD`
2. Examine each file across three categories
3. Report findings with severity levels

## Review Categories

### Security (CRITICAL)

- Hardcoded credentials, API keys, tokens
- SQL injection vulnerabilities
- Cross-site scripting (XSS) risks
- Missing input validation
- Unsafe dependencies
- Directory traversal exposures

### Code Quality (HIGH)

- Functions exceeding 50 lines
- Files beyond 800 lines
- Nesting 4+ levels deep
- Missing error handling
- Debugging statements (console.log)
- Unresolved TODO/FIXME markers
- Undocumented public functions

### Best Practices (MEDIUM)

- Non-immutable data modification
- Insufficient test coverage
- Accessibility compliance issues
- Poor variable naming

## Report Format

Each issue includes:
- Severity: CRITICAL/HIGH/MEDIUM/LOW
- File path and line number
- Clear description
- Recommended solution

## Enforcement

- **Block** commits with CRITICAL or HIGH findings
- **Warn** on MEDIUM findings
- **Approve** only clean code

> "Never approve code with security vulnerabilities!"
