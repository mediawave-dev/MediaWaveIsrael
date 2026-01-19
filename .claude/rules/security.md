# Security Rules

## Mandatory Security Checks (Before Every Commit)

- [ ] No hardcoded secrets (API keys, passwords, tokens)
- [ ] All user inputs validated
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (sanitized HTML)
- [ ] CSRF protection enabled
- [ ] Authentication/authorization verified
- [ ] Rate limiting on all endpoints
- [ ] Error messages don't leak sensitive data

## Secret Management

**NEVER** embed secrets directly in code:

```typescript
// ❌ BAD
const apiKey = "sk-abc123xyz";

// ✅ GOOD
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error('OPENAI_API_KEY environment variable is required');
}
```

## Environment Variables

Use `.env` files for local development:

```bash
# .env.local (never commit!)
API_KEY=your-key-here
DATABASE_URL=postgres://...
```

Add to `.gitignore`:
```
.env
.env.local
.env.*.local
```

## Security Response Protocol

When vulnerabilities are discovered:

1. **STOP** immediately
2. Use **@security-reviewer** agent
3. Fix CRITICAL issues before continuing
4. Rotate any exposed secrets
5. Review entire codebase for similar issues

## Common Vulnerabilities to Prevent

### XSS (Cross-Site Scripting)
```typescript
// ❌ BAD - dangerouslySetInnerHTML with user input
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ GOOD - React auto-escapes
<div>{userInput}</div>
```

### SQL Injection
```typescript
// ❌ BAD - string concatenation
const query = `SELECT * FROM users WHERE id = ${userId}`;

// ✅ GOOD - parameterized query
const query = 'SELECT * FROM users WHERE id = $1';
await db.query(query, [userId]);
```

### Path Traversal
```typescript
// ❌ BAD - user controls path
const filePath = `./uploads/${userFilename}`;

// ✅ GOOD - validate and sanitize
const safeName = path.basename(userFilename);
const filePath = path.join('./uploads', safeName);
```
