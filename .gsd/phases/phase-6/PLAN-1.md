# Phase 6, Task 1: Cloudflare Worker + OpenAI Integration

## Goal
Create `/api/chat` endpoint using Cloudflare Pages Functions with GPT-4o-mini.

## Context
- ChatWidget.tsx already calls `/api/chat` with `{ messages: [...] }`
- Need Cloudflare Worker to forward to OpenAI
- Rate limit: 10 req/min per IP
- System prompt with MediaWave knowledge (from CONTENT.md)

## Actions

### Step 1: Create Functions Directory Structure

```
functions/
└── api/
    └── chat.ts    ← POST /api/chat
```

Cloudflare Pages Functions auto-deploy from `/functions` directory.

### Step 2: Create `functions/api/chat.ts`

**Request format** (from useChat.ts):
```ts
{ messages: [{ role: 'user' | 'assistant', content: string }] }
```

**Response format**:
```ts
{ message: string }
// or on error:
{ error: string }
```

**Implementation structure**:
```ts
interface Env {
  OPENAI_API_KEY: string
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  // 1. Parse request body
  // 2. Validate messages array
  // 3. Call OpenAI API
  // 4. Return response
}
```

### Step 3: OpenAI API Call

```ts
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
  },
  body: JSON.stringify({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...userMessages,
    ],
    max_tokens: 300,
    temperature: 0.7,
  }),
})
```

### Step 4: System Prompt

Create comprehensive system prompt from CONTENT.md knowledge:

```
אתה העוזר האוטומטי של MediaWave — חברה לפיתוח אתרים ושירותי מדיה דיגיטלית.
אתה עונה על שאלות על שירותי החברה בלבד.

שירותים שלנו:
- פיתוח אתרים מותאמים אישית (React, Next.js, WordPress — לא תבניות)
- עיצוב דפי נחיתה ממוקדי המרה
- אתרי תדמית לעסקים
- קידום אורגני (SEO)
- ליווי ותמיכה שוטפת
- אופטימיזציה למובייל (Mobile-First)

מידע כללי:
- אתר בסיסי: 2-3 שבועות, עד 5 עמודים
- אתר מורכב: 4-6 שבועות
- חבילה בסיסית: עיצוב רספונסיבי, WhatsApp integration, טופס לידים
- יצירת קשר: 052-8731808, mediawaveisrael@gmail.com

כללים:
- עברית בלבד
- תשובות קצרות (2-3 משפטים מקסימום)
- אחרי 2-3 הודעות — הצע לדבר בוואטסאפ
- לעולם אל תמציא מחירים ספציפיים
- לשאלות מחוץ לתחום: "אשמח להעביר את השאלה לצוות. צרו קשר בוואטסאפ 052-8731808"
- נושאים לא רלוונטיים: הפנה בעדינות בחזרה לשירותי MediaWave
```

### Step 5: Error Handling

| Status | Hebrew Message |
|--------|----------------|
| 400 | הודעה לא תקינה. |
| 429 | אנא המתינו רגע ונסו שוב. |
| 500 | שירות הצ׳אט אינו זמין כרגע. צרו קשר בוואטסאפ 052-8731808 |
| 503 | שירות הצ׳אט אינו זמין כרגע. נסו שוב מאוחר יותר. |

### Step 6: CORS Headers

```ts
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}
```

### Step 7: Configure Environment Variable

Add to Cloudflare Pages Dashboard:
- Settings → Environment variables → Add variable
- Name: `OPENAI_API_KEY`
- Value: `sk-...` (production secret)

### Step 8: Test Locally

```bash
# Install wrangler if needed
npm install -D wrangler

# Run local dev with Pages Functions
npx wrangler pages dev dist --binding OPENAI_API_KEY=sk-test-xxx
```

### Step 9: Deploy & Verify

```bash
# Build frontend
npm run build

# Deploy (or git push triggers auto-deploy)
npx wrangler pages deploy dist
```

Test: Open DevTools → Network → Send chat message → Verify 200 response.

## Acceptance Criteria

- [ ] `functions/api/chat.ts` created
- [ ] POST /api/chat returns AI response
- [ ] System prompt includes MediaWave knowledge
- [ ] Errors return Hebrew messages
- [ ] CORS headers present
- [ ] No API key exposed in client code
- [ ] Build and deploy successful

## Files to Create

1. `functions/api/chat.ts` — Main worker (~120 lines)

## Reference Files

- `src/hooks/useChat.ts:88-99` — Client request format
- `CONTENT.md` — Knowledge base for system prompt
- `.gsd/phases/phase-6/CONTEXT.md` — Full specifications

## Notes

- Rate limiting can be added later via Cloudflare KV if needed
- For local dev, use `wrangler pages dev` with binding
