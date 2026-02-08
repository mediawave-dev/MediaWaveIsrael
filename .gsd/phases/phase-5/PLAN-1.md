# Phase 5, Task 1: Chatbot Backend — API Endpoint

## Goal
Create a serverless API endpoint that proxies requests to Claude Haiku API.

## Context
- Site hosted on Cloudflare Pages — can use Cloudflare Workers or Pages Functions
- Model: Claude Haiku 4.5 (claude-haiku-4-5-20251001)
- API key stored as environment variable (never in code)
- Rate limiting: 20 messages/conversation max, 5 conversations/min/IP
- Max tokens per response: 500

## Actions

### Step 1: Determine API Route Strategy
- Check if Cloudflare Pages Functions are configured
- If yes → create `functions/api/chat.ts`
- If no → create Cloudflare Worker separately
- Alternative: Vite API route with serverless adapter

### Step 2: Create System Prompt Config
- Create `src/config/chatbot-prompt.ts`
- Contains the full system prompt from MEDIAWAVE_WORKPLAN.md (section 5.2)
- Export as a constant string
- Includes: company info, services, packages, contact details, behavior guidelines
- All in Hebrew with English fallback instruction

### Step 3: Create API Endpoint
- Endpoint: POST `/api/chat`
- Request body: `{ messages: Array<{role: string, content: string}> }`
- Server-side:
  - Validate request (max 10 messages in context)
  - Prepend system prompt
  - Call Anthropic Messages API with Claude Haiku
  - Return response
- Error handling: rate limit errors, API errors, timeout
- CORS headers for same-origin
- Input sanitization (prevent injection)

### Step 4: Environment Setup
- Document required env var: `ANTHROPIC_API_KEY`
- Add to `.env.example` (without actual key)
- Add `.env` to `.gitignore` (verify)

### Step 5: Verify
- Test endpoint with curl/httpie
- Verify Hebrew response
- Verify rate limiting works
- Verify error responses are user-friendly
- Run build — no errors

## Acceptance Criteria
- [ ] API endpoint responds to POST /api/chat
- [ ] Uses Claude Haiku 4.5 model
- [ ] System prompt loaded from config file
- [ ] API key from environment variable (not hardcoded)
- [ ] Rate limiting functional
- [ ] Input validation (max messages, content length)
- [ ] Error responses in Hebrew
- [ ] No secrets in code or git

## Dependencies
- Anthropic API key (user must provide)
- Cloudflare Worker/Pages Functions access

## Estimated Scope
~45 minutes, backend setup
