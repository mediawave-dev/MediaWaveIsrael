# Coding Style Rules

## Immutability (Critical)

**ALWAYS create new objects, NEVER mutate.**

```typescript
// ❌ BAD - mutation
user.name = 'New Name';
items.push(newItem);

// ✅ GOOD - immutable
const updatedUser = { ...user, name: 'New Name' };
const updatedItems = [...items, newItem];
```

## File Organization

- **Many small files > few large files**
- 200-400 lines typical
- 800 lines maximum
- Structure by feature, not by type

```
// ✅ GOOD - by feature
src/
  features/
    auth/
      components/
      hooks/
      utils/
    dashboard/
      components/
      hooks/

// ❌ BAD - by type
src/
  components/
  hooks/
  utils/
```

## Function Size

- Maximum 50 lines per function
- Single responsibility
- Clear naming

```typescript
// ❌ BAD - too many responsibilities
function processUser(user) {
  // validate
  // transform
  // save
  // notify
  // log
}

// ✅ GOOD - single responsibility
function validateUser(user) { ... }
function transformUser(user) { ... }
function saveUser(user) { ... }
function notifyUser(user) { ... }
```

## Error Handling

```typescript
// ❌ BAD - generic error
throw new Error('Error');

// ✅ GOOD - descriptive error
throw new Error(`Failed to fetch user ${userId}: ${response.statusText}`);
```

## Input Validation

Use schema validation (Zod recommended):

```typescript
import { z } from 'zod';

const UserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  age: z.number().int().positive().optional(),
});

function createUser(input: unknown) {
  const user = UserSchema.parse(input);
  // ...
}
```

## Nesting

Maximum 4 levels of nesting:

```typescript
// ❌ BAD - too deep
if (a) {
  if (b) {
    if (c) {
      if (d) {
        // ...
      }
    }
  }
}

// ✅ GOOD - early returns
if (!a) return;
if (!b) return;
if (!c) return;
if (!d) return;
// ...
```

## Quality Checklist

Before completing any code:

- [ ] Code is readable and self-documenting
- [ ] Functions are < 50 lines
- [ ] Files are < 800 lines
- [ ] Nesting is < 4 levels
- [ ] Proper error handling
- [ ] No console.log statements
- [ ] No hardcoded values
- [ ] Immutable patterns used
