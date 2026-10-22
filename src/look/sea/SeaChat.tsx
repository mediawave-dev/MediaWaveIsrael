// The chat panel in the sea (D204, Nati: "fix the AI assistant's window so it suits the site's design. Be
// smart"). The legacy panel was Tailwind on the old light palette (a cream header with white words, an
// invisible ×, a white input bar). This one is made of the site's own material: the dark ground with the
// sea's dots at rest behind the conversation, the AI's spark in dots, the name in the display face, the
// controls as the contact rows' mono "( × )". Every message stands on an island of halftone (parts/Isle):
// the bot's dark on the start side, the visitor's cream on the end side (the Hebrew WhatsApp habit). The
// input is the contact form's dotted frame; the send key is an island that fills with cream once there
// is something to send. The input stays open while the bot writes (a phone keeps its keyboard; sending
// waits for the reply). ChatWidget keeps the state, the focus trap and the keyboard; this is the panel.
import { useEffect, type KeyboardEvent, type RefObject } from 'react'
import { m } from 'framer-motion'
import type { ChatMessage } from '../../hooks/useChat'
import { linkifyContent, stripMarkdown } from '../../components/ui/chat-text'
import DotGlyph from './DotGlyph'
import Isle from '../parts/Isle'
import './sea-chat.css'

export interface SeaChatProps {
  panelRef: RefObject<HTMLDivElement>
  inputRef: RefObject<HTMLTextAreaElement>
  endRef: RefObject<HTMLDivElement>
  messages: ChatMessage[]
  isLoading: boolean
  isLimitReached: boolean
  input: string
  canSend: boolean
  height: number | null
  onInput: (value: string) => void
  onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void
  onSend: () => void
  onReset: () => void
  onClose: () => void
}

function Message({ message }: { message: ChatMessage }) {
  const me = message.role === 'user'
  const failed = message.id.startsWith('error-')
  return (
    <m.div
      className={`sc__msg sc__msg--${me ? 'me' : 'ai'}`}
      data-failed={failed || undefined}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="sc__bubble">
        {me ? message.content : linkifyContent(stripMarkdown(message.content))}
        <Isle out={6} radius={16} ink={false} />
      </div>
    </m.div>
  )
}

const SendArrow = () => (
  <svg className="sc__arrow" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <path d="M13 8H3m4-4L3 8l4 4" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function SeaChat(p: SeaChatProps) {
  // while it is open the guide and the music's invitation step away (sea-chat.css, SoundInvite)
  useEffect(() => {
    const html = document.documentElement.classList
    html.add('chat-open')
    return () => html.remove('chat-open')
  }, [])
  const phone = typeof window !== 'undefined' && window.innerWidth < 640
  return (
    <m.div
      ref={p.panelRef}
      role="dialog"
      aria-label="צ'אט עם MediaWave"
      aria-modal="true"
      className="sc"
      style={p.height && phone ? { height: `${p.height}px` } : undefined}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 28 }}
      transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="sc__head">
        <DotGlyph name="ai" n={11} className="sc__spark" />
        <div className="sc__who">
          <p className="sc__name">MediaWave</p>
          <p className="sc__role">עוזר אוטומטי</p>
        </div>
        {p.isLimitReached && (
          <button type="button" className="sc__ctl" onClick={p.onReset} aria-label="שיחה חדשה" title="שיחה חדשה">
            <span aria-hidden="true">( ↺ )</span>
          </button>
        )}
        <button type="button" className="sc__ctl" onClick={p.onClose} aria-label="סגור צ'אט">
          <span aria-hidden="true">( × )</span>
        </button>
      </div>

      {/* role=log + a polite live region: screen readers hear the bot's replies and its errors */}
      <div className="sc__log" dir="rtl" role="log" aria-live="polite">
        {p.messages.map((msg) => <Message key={msg.id} message={msg} />)}
        {p.isLoading && (
          <div className="sc__msg sc__msg--ai">
            <div className="sc__bubble sc__bubble--typing" aria-label="הבוט כותב">
              <span className="sc__dots" aria-hidden="true"><i /><i /><i /></span>
              <Isle out={6} radius={16} ink={false} />
            </div>
          </div>
        )}
        <div ref={p.endRef} />
      </div>

      <div className="sc__bar" dir="rtl">
        <textarea
          ref={p.inputRef}
          className="sc__input"
          value={p.input}
          onChange={(e) => p.onInput(e.target.value)}
          onKeyDown={p.onKeyDown}
          placeholder={p.isLimitReached ? 'השיחה הסתיימה' : 'הקלידו הודעה...'}
          rows={1}
          aria-label="הקלידו הודעה"
          disabled={p.isLimitReached}
        />
        {/* a tap on send keeps the focus (and a phone's keyboard) in the input */}
        <button type="button" className="sc__send" onMouseDown={(e) => e.preventDefault()} onClick={p.onSend} disabled={!p.canSend} data-ready={p.canSend || undefined} aria-label="שלח הודעה">
          <SendArrow />
          <Isle out={6} />
        </button>
      </div>
    </m.div>
  )
}
