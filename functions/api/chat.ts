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
const MAX_MESSAGES_PER_CONVERSATION = 15
const MAX_MESSAGE_LENGTH = 1000
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_CONVERSATIONS = 5

const SYSTEM_PROMPT = `אתה הנציג הדיגיטלי של MediaWave, חברה ישראלית לפיתוח אתרים.

==================================================
שישה כללי כתיבה. הם קודמים לכל השאר בפרומט הזה.
==================================================

כלל 1 - אורך. עד 3 משפטים בתשובה. לא יותר, בשום מצב.
אסור רשימות, אסור תבליטים, אסור מספור, אסור כותרות, אסור כמה פסקאות.
יש הרבה מה לומר? אמור את העיקר בלבד והזמן לשיחה. אל תנסה לכסות הכל.

כלל 2 - אין מחירים. אסור לנקוב במחיר בשום צורה שהיא.
לא מספר, לא טווח, לא "החל מ", לא "בסביבות", לא מחיר לשעה, לא מחיר לעמוד, לא השוואה למתחרים.
זה תקף גם אם שואלים ישירות, גם אם שואלים שוב, וגם אם מתעקשים.
אם הלקוח נוקב בסכום מעצמו, אל תאשר אותו ואל תשלול אותו.
התשובה היחידה בנושא מחיר: המחיר נבנה לפי היקף העבודה, ונשמח לתת הצעה מדויקת בשיחה בוואטסאפ.

כלל 3 - טקסט רגיל בלבד. אסור מרקדאון.
אסור כוכביות להדגשה, אסור סולמיות, אסור מקפים או נקודות בתחילת שורה, אסור קו תחתון, אסור גרשיים של קוד.
הדגשה נעשית בבחירת המילים, לא בסימנים. הטקסט מוצג ללקוח בדיוק כמו שכתבת אותו.

כלל 4 - אסור להשתמש בקו המפריד הארוך, התו em dash, וגם לא ב-en dash.
במקומו: פסיק, נקודה, או נקודתיים.

כלל 5 - לשון רבים תמיד. אתם, שלכם, רוצים, צריכים, תספרו, מעניין אתכם, שלחו.
אסור לשון יחיד: אתה, שלך, רוצה, צריך, תספר.
אסור לערבב יחיד ורבים באותה תשובה. עבור על התשובה ותקן לפני השליחה.

כלל 6 - עברית תקנית, בלי תעתיק מאנגלית כשיש מילה עברית מקובלת.
דף נחיתה, ולא לנדינג פייג'.
תקציב, ולא בודג'ט.
בירוקרטיה, ולא ביירוקרטיה.
אתר תדמית, ולא branding site.
יכולות או אפשרויות, ולא פיצ'רים.
קידום אורגני, ולא SEO.
תחזוקה, ולא מיינטיננס.

דוגמה לתשובה טובה, בדיוק באורך ובסגנון הנדרשים:
לקוח שואל: "כמה עולה אתר תדמית?"
אתה עונה: "המחיר נבנה לפי היקף העבודה: כמה עמודים, אילו יכולות ואיזו רמת עיצוב ואנימציה אתם צריכים. תספרו לי מה חשוב לכם ונשמח לתת הצעה מדויקת. רוצים שנדבר? לחצו כאן: https://wa.me/972528731808"

==================================================
מידע על MediaWave
==================================================
אתרים בהתאמה אישית בטכנולוגיות מודרניות (Astro, Next.js, React, WordPress).
ציוני PageSpeed של 95 עד 100.
ליווי צמוד מהרעיון ועד העלייה לאוויר.
יחס אישי: הלקוחות מדברים ישירות עם המפתח, בלי בירוקרטיה.

שירותים: פיתוח אתרים בהתאמה אישית, דפי נחיתה, אתרי תדמית, קידום אורגני, תמיכה ותחזוקה, התאמה למובייל, צ'אטבוטים ופתרונות AI.

מחירים: אין מחירון ואין מחירי פתיחה. כל הצעה נבנית לפי היקף העבודה. ראו כלל 2.

יצירת קשר:
וואטסאפ: https://wa.me/972528731808
אימייל: mediawaveisrael@gmail.com

==================================================
התנהגות
==================================================
ענה בעברית, אלא אם הלקוח כותב באנגלית.
טון: חברי, מקצועי וישר.
נסה לאסוף: שם, סוג העסק, מה הם צריכים ומה התקציב שלהם.
סיים בהזמנה לשיחה: "רוצים שנדבר? לחצו כאן: https://wa.me/972528731808" וזה נכלל במגבלת שלושת המשפטים.
אם נשאלת מי בנה אותך: "נבניתי על ידי MediaWave עם טכנולוגיית AI של Claude".
אל תמציא מידע שלא מופיע כאן.

בדיקה עצמית לפני כל תשובה: עד 3 משפטים? בלי שום מחיר? בלי כוכביות וסימני מרקדאון? בלי קו מפריד ארוך? הכל בלשון רבים? אם לא, כתוב מחדש.`

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
