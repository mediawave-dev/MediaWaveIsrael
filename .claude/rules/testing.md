# Testing Rules

## Coverage Requirements

- **Minimum 80% code coverage**
- All critical paths must have tests
- New code must include tests

## Test Categories

### Unit Tests
- Isolated function testing
- Mock external dependencies
- Fast execution

### Integration Tests
- API endpoint testing
- Database operations
- Service interactions

### E2E Tests (Playwright)
- Critical user journeys
- Form submissions
- Navigation flows

## Test-Driven Development (TDD) Workflow

1. **RED** - Write test first (it should fail)
2. **GREEN** - Write minimal code to pass
3. **REFACTOR** - Improve code, maintain coverage

```typescript
// Step 1: Write failing test
test('adds two numbers', () => {
  expect(add(2, 3)).toBe(5);
});

// Step 2: Minimal implementation
function add(a: number, b: number) {
  return a + b;
}

// Step 3: Refactor if needed
```

## Test Structure

```typescript
describe('UserService', () => {
  describe('createUser', () => {
    it('should create a user with valid data', async () => {
      // Arrange
      const userData = { name: 'Test', email: 'test@example.com' };

      // Act
      const result = await userService.createUser(userData);

      // Assert
      expect(result.name).toBe('Test');
    });

    it('should throw error for invalid email', async () => {
      // ...
    });
  });
});
```

## When Tests Fail

1. **Don't modify the test first** (unless the test is wrong)
2. **Fix the implementation**
3. Use **@tdd-guide** agent for help
4. Ensure tests are isolated
5. Validate mock implementations

## Agent Support

- **@tdd-guide** - Test-first methodology guidance
- **@e2e-runner** - Playwright E2E test creation

## Commands

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific file
npm test -- src/services/user.test.ts

# Watch mode
npm test -- --watch
```

## Best Practices

- [ ] Tests are independent (no shared state)
- [ ] Descriptive test names
- [ ] Arrange-Act-Assert pattern
- [ ] Mock external services
- [ ] Test edge cases
- [ ] No flaky tests
