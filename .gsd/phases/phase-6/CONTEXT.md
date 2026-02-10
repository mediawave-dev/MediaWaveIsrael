# Phase 6 Context: AI Chatbot

## Decisions

### Technical Stack
- **AI Model**: OpenAI GPT-4o-mini — $0.15/1M tokens, מהיר, מספיק לשיחות קצרות
- **Backend**: Cloudflare Worker — כבר משתמשים ב-CF Pages, Worker חינם עד 100K/day
- **Knowledge Sync**: System prompt סטטי — מזינים CONTENT.md ל-prompt, עדכון בכל deploy

### UI/UX
- **Placement**: Floating bubble בפינה ימנית תחתונה
- **WhatsApp Button**: נשאר! שניהם במיקומים שונים (WhatsApp למי שרוצה ישר, Chat למי שצריך עזרה)
- **Persona**: בוט ברור שזה בוט — "אני העוזר האוטומטי של MediaWave"
- **Opener**: "אהלן! אני העוזר של MediaWave. איך אפשר לעזור?"

### Behavior
- **Goal**: Answer FAQs + lead capture — עונה על שאלות נפוצות ומוביל ל-WhatsApp
- **Knowledge Base**: כל מה שב-CONTENT.md (שירותים, מחירים כלליים, תהליכי עבודה)
- **Guardrails**: הפניה אדיבה ל-WhatsApp כשלא רלוונטי — "אשמח להעביר שאלה זו לצוות..."
- **Conversation Length**: 3-4 הודעות מקסימום לפני הצעת WhatsApp

### Lead Capture Flow
1. משתמש שואל שאלה
2. Bot עונה + שואל שאלה מבהירה (אם צריך)
3. אחרי 2-3 הודעות: "כדי לתת לך הצעה מדויקת, כדאי שנדבר בוואטסאפ"
4. כפתור WhatsApp עם הודעה מוכנה (כולל ההקשר מהצ'אט)

## Out of Scope
- **Admin panel לעדכון knowledge** — יעשה דרך deploy
- **היסטוריית שיחות** — לא שומרים, כל שיחה חדשה
- **Multi-language** — עברית בלבד
- **Voice input** — טקסט בלבד

## Edge Cases
- **שאלות לא רלוונטיות** → הפניה אדיבה ל-WhatsApp
- **שאלות על מחירים ספציפיים** → "המחיר תלוי בפרויקט, בוא נדבר בוואטסאפ"
- **ניסיון לשבור את הבוט** → "אני מתמחה בשירותים של MediaWave, איך אפשר לעזור?"
- **Mobile keyboard** → צ'אט נפתח לגובה מלא, input נשאר גלוי
- **WhatsApp button conflict** → Chat בפינה ימנית תחתונה, WhatsApp קצת יותר למעלה

## Technical Notes

### Cloudflare Worker
```
/api/chat endpoint
- Receives: { messages: [...], context: string }
- Returns: { response: string, suggestWhatsApp: boolean }
- Rate limit: 10 req/min per IP
```

### System Prompt Structure
```
אתה העוזר האוטומטי של MediaWave.
אתה עונה על שאלות על שירותי החברה בלבד.
כשאתה לא בטוח או השאלה מחוץ לתחום — הפנה ל-WhatsApp.

[KNOWLEDGE FROM CONTENT.md]

כללים:
- עברית בלבד
- תשובות קצרות (2-3 משפטים)
- אחרי 2-3 הודעות — הצע WhatsApp
- לעולם אל תמציא מחירים
```

### UI Component Structure
```
ChatBot/
├── ChatBubble.tsx      — Floating button
├── ChatWindow.tsx      — Chat modal/overlay
├── ChatMessage.tsx     — Single message
├── ChatInput.tsx       — Input + send
└── useChatBot.ts       — State + API hook
```

## Open Questions
- מה הטקסט על ה-bubble? (אייקון צ'אט? "יש שאלות?")
- האם להציג typing indicator?
- האם לאפשר סגירה באמצע שיחה או רק X?
