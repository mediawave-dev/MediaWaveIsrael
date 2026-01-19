# Build Fix Command

Systematically resolve TypeScript and build errors.

## Usage

```
/build-fix
```

## Process

1. Run the build command (`npm run build`)
2. Parse errors grouped by file and severity
3. Address issues one at a time:
   - Show 5 lines of context around error
   - Explain what caused it
   - Suggest a remedy
   - Apply the fix
   - Re-run build to confirm

## Key Principles

- **One error at a time** for safety
- **Show context** before fixing
- **Explain** the problem clearly
- **Verify** each fix works

## Stopping Criteria

Stop when:
- A fix creates additional problems
- An error remains unresolved after 3 attempts
- User requests a pause

## Completion Summary

When finished, provide:
- Errors resolved (count and list)
- Issues that persist
- Any newly introduced problems

## Example Output

```
🔧 Build Fix Report

✅ Resolved:
- src/components/Hero.tsx:42 - Missing type annotation
- src/utils/format.ts:15 - Unused import

⚠️ Remaining:
- src/api/client.ts:88 - Type mismatch (needs review)

📝 Notes:
- Consider upgrading @types/react for better compatibility
```
