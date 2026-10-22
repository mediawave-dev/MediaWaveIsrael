// The bot's text, shared by the chat panels (ChatWidget, look/sea/SeaChat).
import { track } from '../../utils/analytics'

// --- Bot message text hygiene ---
// The prompt forbids markdown (see src/config/chatbot-prompt.ts rule 3), but the
// bubble renders raw text in whitespace-pre-wrap, so a single slip shipped literal
// '**' to the client. Strip the markers rather than pull in a markdown renderer.
export function stripMarkdown(text: string) {
  return text
    .replace(/\*\*(.+?)\*\*/gs, '$1')
    .replace(/__(.+?)__/gs, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^[ \t]*[-*•][ \t]+/gm, '')
    .replace(/\s*—\s*/g, ', ')
    .trim()
}

// --- URL linkification for bot messages ---

const URL_REGEX = /(https?:\/\/[^\s)<>]+)/g

export function linkifyContent(text: string) {
  const parts = text.split(URL_REGEX)
  if (parts.length === 1) return text

  return parts.map((part, i) =>
    URL_REGEX.test(part) ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="underline text-sky-ink hover:text-sky-ink-strong transition-colors"
        onClick={() => track('chat_handoff', { placement: 'chat_message' })}
      >
        {part}
      </a>
    ) : (
      part
    )
  )
}
