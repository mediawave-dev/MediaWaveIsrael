# Phase 5, Task 3: Chatbot State Management & API Integration

## Goal
Connect the chat widget UI to the API endpoint with conversation state management.

## Context
- ChatWidget UI exists (from Task 2)
- API endpoint exists (from Task 1)
- Need to wire them together with proper state management

## Actions

### Step 1: Create Chat Hook
- Create `src/hooks/useChat.ts`
- State:
  - `messages: Message[]` — conversation history
  - `isLoading: boolean` — API call in progress
  - `error: string | null` — error state
  - `messageCount: number` — track for 20-message limit
- Functions:
  - `sendMessage(content: string)` — add user msg, call API, add bot response
  - `resetConversation()` — clear all state
- Keep messages in memory only (not localStorage)
- Send last 10 messages as context to API (cost control)

### Step 2: Wire Hook to ChatWidget
- Import `useChat` in ChatWidget
- Connect send button and input to `sendMessage`
- Show loading state with typing indicator
- Show error messages inline
- After 20 messages: show WhatsApp redirect message, disable input

### Step 3: Error Handling
- API unavailable: Show Hebrew error + WhatsApp fallback
- Network error: Retry suggestion
- Rate limited: "אנא המתינו רגע ונסו שוב"
- Input sanitization: Strip HTML tags before sending (XSS prevention)

### Step 4: Session Persistence
- Close and reopen widget in same session → conversation preserved
- Page refresh → conversation cleared (by design)
- Browser tab close → conversation cleared

### Step 5: Verify
- Send message → get Hebrew response from Claude
- Conversation flows naturally
- 20-message limit triggers WhatsApp redirect
- Error states display correctly
- No XSS vectors
- Build clean

## Acceptance Criteria
- [ ] Messages send and receive correctly
- [ ] Loading state with typing indicator
- [ ] 20-message conversation limit enforced
- [ ] Error messages in Hebrew
- [ ] XSS prevention on input
- [ ] Session persistence (close/reopen widget)
- [ ] Clean build

## Dependencies
- Phase 5, Task 1 (API endpoint)
- Phase 5, Task 2 (Widget UI)

## Estimated Scope
~30 minutes, state management + integration
