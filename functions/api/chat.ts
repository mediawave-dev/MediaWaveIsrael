/**
 * Cloudflare Pages Function — POST /api/chat
 *
 * Proxies chat messages to Claude Haiku API.
 * Requires ANTHROPIC_API_KEY set in Cloudflare Pages environment variables.
 */

// --- Types ---

interface Env {
  ANTHROPIC_API_KEY: string
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ChatRequest {
  messages: ChatMessage[]
}

// --- Constants (duplicated from src/config to avoid bundling issues) ---

const CHATBOT_MODEL = 'claude-haiku-4-5-20251001'
const MAX_TOKENS = 500
const MAX_CONTEXT_MESSAGES = 10
const MAX_MESSAGES_PER_CONVERSATION = 20
const MAX_MESSAGE_LENGTH = 1000
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_CONVERSATIONS = 5

const SYSTEM_PROMPT = `אתה הנציג הדיגיטלי של MediaWave — חברה ישראלית לפיתוח אתרים.

## About MediaWave
- Custom websites with modern tech (Astro, Next.js, React, WordPress)
- PageSpeed scores 95-100
- Close support from concept to launch
- Personal approach — client talks directly to developer

## Services
- Custom website development, Landing pages, Branding sites
- Organic SEO, Support & maintenance, Mobile optimization
- Chatbots and AI solutions

## Packages
- Landing page: Starting from ₪1,500
- Branding site: Starting from ₪3,500
- Custom project: By quote

## Contact
- Phone/WhatsApp: 052-8731808
- Email: mediawaveisrael@gmail.com

## Behavior
- Respond in Hebrew unless client writes in English
- Friendly, professional, concise (2-4 sentences max)
- Try to collect: name, business type, what they need, budget
- End with: "רוצים שנדבר? שלחו הודעה ב-WhatsApp 052-8731808"
- If asked who built you: "אני נבניתי על ידי MediaWave עם טכנולוגיית AI של Claude"
- Don't fabricate info not provided here`

// --- Rate limiting (per-isolate, best-effort) ---

const rateLimitMap = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const timestamps = rateLimitMap.get(ip) ?? []

  // Clean expired entries
  const valid = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS)

  if (valid.length >= RATE_LIMIT_MAX_CONVERSATIONS) {
    rateLimitMap.set(ip, valid)
    return true
  }

  valid.push(now)
  rateLimitMap.set(ip, valid)

  // Periodically clean up old IPs (every ~100 requests)
  if (rateLimitMap.size > 200) {
    for (const [key, vals] of rateLimitMap) {
      const fresh = vals.filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
      if (fresh.length === 0) rateLimitMap.delete(key)
      else rateLimitMap.set(key, fresh)
    }
  }

  return false
}

// --- Helpers ---

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  })
}

function errorResponse(message: string, status: number): Response {
  return jsonResponse({ error: message }, status)
}

/** Strip HTML tags to prevent XSS in stored/reflected content */
function sanitize(text: string): string {
  return text.replace(/[<>]/g, '')
}

function isValidMessage(msg: unknown): msg is ChatMessage {
  if (typeof msg !== 'object' || msg === null) return false
  const m = msg as Record<string, unknown>
  return (
    (m.role === 'user' || m.role === 'assistant') &&
    typeof m.content === 'string' &&
    m.content.trim().length > 0 &&
    m.content.length <= MAX_MESSAGE_LENGTH
  )
}

// --- CORS Preflight ---

export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, { status: 204, headers: CORS_HEADERS })
}

// --- Main Handler ---

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context

  // 1. Check API key is configured
  if (!env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY not configured')
    return errorResponse('שירות הצ׳אט אינו זמין כרגע. אנא נסו שוב מאוחר יותר.', 503)
  }

  // 2. Rate limiting by IP
  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown'
  if (isRateLimited(ip)) {
    return errorResponse('יותר מדי בקשות. אנא המתינו דקה ונסו שוב.', 429)
  }

  // 3. Parse and validate request body
  let body: ChatRequest
  try {
    body = await request.json()
  } catch {
    return errorResponse('בקשה לא תקינה.', 400)
  }

  if (!body.messages || !Array.isArray(body.messages)) {
    return errorResponse('פורמט הודעות לא תקין.', 400)
  }

  // 4. Validate conversation length
  if (body.messages.length > MAX_MESSAGES_PER_CONVERSATION) {
    return errorResponse('השיחה ארוכה מדי. אנא התחילו שיחה חדשה.', 400)
  }

  // 5. Validate and sanitize each message
  const sanitizedMessages: ChatMessage[] = []
  for (const msg of body.messages) {
    if (!isValidMessage(msg)) {
      return errorResponse('הודעה לא תקינה.', 400)
    }
    sanitizedMessages.push({
      role: msg.role,
      content: sanitize(msg.content.trim()),
    })
  }

  // 6. Take only the last N messages for context
  const contextMessages = sanitizedMessages.slice(-MAX_CONTEXT_MESSAGES)

  // 7. Call Anthropic Messages API
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: CHATBOT_MODEL,
        max_tokens: MAX_TOKENS,
        system: SYSTEM_PROMPT,
        messages: contextMessages,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Anthropic API error ${response.status}: ${errorText}`)

      if (response.status === 429) {
        return errorResponse('השירות עמוס כרגע. אנא נסו שוב בעוד כמה שניות.', 429)
      }
      return errorResponse('שגיאה בשירות הצ׳אט. אנא נסו שוב.', 502)
    }

    const data = await response.json() as {
      content: Array<{ type: string; text: string }>
    }

    // Extract text from response
    const assistantText = data.content
      ?.filter((block: { type: string }) => block.type === 'text')
      .map((block: { text: string }) => block.text)
      .join('') ?? ''

    return jsonResponse({ message: assistantText })
  } catch (err) {
    console.error('Chat API error:', err)
    return errorResponse('שגיאה בלתי צפויה. אנא נסו שוב.', 500)
  }
}
