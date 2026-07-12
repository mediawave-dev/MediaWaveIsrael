import { useState, useRef, useEffect, useCallback, type KeyboardEvent } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { X, Send, RotateCcw } from 'lucide-react'
import { useChat, type ChatMessage } from '../../hooks/useChat'
import { LottieIcon } from './index'

// --- Typing Indicator ---

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3 bg-cream-dark rounded-2xl rounded-tr-sm w-fit">
      {[0, 1, 2].map((i) => (
        <m.span
          key={i}
          className="w-2 h-2 rounded-full bg-brown-muted"
          animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  )
}

// --- URL linkification for bot messages ---

const URL_REGEX = /(https?:\/\/[^\s)<>]+)/g

function linkifyContent(text: string) {
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
      >
        {part}
      </a>
    ) : (
      part
    )
  )
}

// --- Message Bubble ---

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'

  return (
    <m.div
      className={`flex ${isUser ? 'justify-start' : 'justify-end'}`}
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className={`max-w-[85%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-orange text-brown-dark rounded-2xl rounded-tl-sm'
            : 'bg-cream-dark text-brown rounded-2xl rounded-tr-sm'
        }`}
      >
        {isUser ? message.content : linkifyContent(message.content)}
      </div>
    </m.div>
  )
}

// --- Main Widget ---

interface ChatWidgetProps {
  onOpenChange?: (open: boolean) => void
}

export default function ChatWidget({ onOpenChange }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [viewportHeight, setViewportHeight] = useState<number | null>(null)
  const { messages, isLoading, isLimitReached, sendMessage, resetConversation } = useChat()

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Close must return focus to the trigger (it re-mounts via AnimatePresence,
  // so focus on the next tick) — keyboard users were dropped at <body>
  const closeChat = useCallback(() => {
    setIsOpen(false)
    setTimeout(() => triggerRef.current?.focus(), 60)
  }, [])

  // Notify parent of open state changes
  useEffect(() => {
    onOpenChange?.(isOpen)
  }, [isOpen, onOpenChange])

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  // Track visual viewport height for mobile keyboard
  useEffect(() => {
    if (!isOpen) return

    const vv = window.visualViewport
    if (!vv) return

    const updateHeight = () => {
      setViewportHeight(vv.height)
      scrollToBottom()
    }

    updateHeight()
    vv.addEventListener('resize', updateHeight, { passive: true })
    vv.addEventListener('scroll', updateHeight, { passive: true })
    return () => {
      vv.removeEventListener('resize', updateHeight)
      vv.removeEventListener('scroll', updateHeight)
    }
  }, [isOpen, scrollToBottom])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading, scrollToBottom])

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  // Focus trap + Escape
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeChat()
        return
      }

      if (e.key !== 'Tab' || !panelRef.current) return

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last?.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeChat])

  // Send handler
  const handleSend = useCallback(() => {
    const text = input.trim()
    if (!text || isLoading || isLimitReached) return

    sendMessage(text)
    setInput('')

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
    }
  }, [input, isLoading, isLimitReached, sendMessage])

  // Enter = send, Shift+Enter = newline
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Auto-resize textarea
  const handleInput = (value: string) => {
    setInput(value)
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 100)}px`
    }
  }

  // Reset conversation
  const handleReset = () => {
    resetConversation()
    setInput('')
  }

  const canSend = input.trim().length > 0 && !isLoading && !isLimitReached

  return (
    <>
      {/* --- Trigger Button --- */}
      <AnimatePresence>
        {!isOpen && (
          <m.div
            className="floating-cta fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            {/* Tooltip */}
            <m.span
              className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-brown-dark text-white text-xs px-3 py-1.5 rounded-lg opacity-0 pointer-events-none"
              whileHover={{ opacity: 1 }}
            >
              צ'אטבוט
              <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-brown-dark" />
            </m.span>

            <m.button
              ref={triggerRef}
              onClick={() => setIsOpen(true)}
              className="group relative w-16 h-16 rounded-full bg-orange shadow-lg flex items-center justify-center hover:bg-orange-dark transition-colors overflow-hidden"
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.95 }}
              aria-label="פתח צ'אט"
            >
              {/* Pulse ring */}
              <span className="absolute inset-0 rounded-full bg-orange animate-ping opacity-20" />
              <div className="relative z-10">
                <LottieIcon
                  animationPath="/animations/7%20chatbot/chatbot_header.json"
                  size={56}
                  loop={true}
                  playOnHover={false}
                />
              </div>
            </m.button>
          </m.div>
        )}
      </AnimatePresence>

      {/* --- Chat Panel --- */}
      <AnimatePresence>
        {isOpen && (
          <m.div
            ref={panelRef}
            role="dialog"
            aria-label="צ'אט עם MediaWave"
            aria-modal="true"
            className="fixed z-50 inset-x-0 bottom-0 sm:inset-auto sm:bottom-6 sm:right-6 w-full sm:w-[360px] h-[100dvh] sm:h-[520px] sm:rounded-2xl overflow-hidden flex flex-col shadow-2xl"
            style={{
              background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
              border: '1px solid rgba(226, 232, 240, 0.6)',
              ...(viewportHeight && window.innerWidth < 640
                ? { height: `${viewportHeight}px` }
                : {}),
            }}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
              }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-14 h-14 rounded-full bg-orange/20 flex items-center justify-center overflow-hidden">
                  <LottieIcon
                    animationPath="/animations/7%20chatbot/chatbot_header.json"
                    size={52}
                    loop={true}
                    playOnHover={false}
                  />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold font-english">MediaWave</p>
                  <p className="text-white/70 text-xs">עוזר אוטומטי</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {isLimitReached && (
                  <button
                    onClick={handleReset}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-orange"
                    aria-label="שיחה חדשה"
                    title="שיחה חדשה"
                  >
                    <RotateCcw size={16} />
                  </button>
                )}
                <button
                  onClick={closeChat}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-orange"
                  aria-label="סגור צ'אט"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
              dir="rtl"
            >
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {isLoading && (
                <div className="flex justify-end">
                  <TypingIndicator />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="flex-shrink-0 border-t border-cream-darker/40 px-3 py-2.5 bg-white">
              <div className="flex items-end gap-2" dir="rtl">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => handleInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isLimitReached ? 'השיחה הסתיימה' : 'הקלידו הודעה...'}
                  rows={1}
                  className="flex-1 resize-none bg-cream rounded-xl px-3.5 py-2.5 text-sm text-brown placeholder:text-brown-muted/60 outline-none focus:ring-2 focus:ring-orange/30 transition-shadow min-h-[40px] max-h-[100px] disabled:opacity-50"
                  style={{ direction: 'rtl' }}
                  aria-label="הקלידו הודעה"
                  disabled={isLoading || isLimitReached}
                />
                <m.button
                  onClick={handleSend}
                  disabled={!canSend}
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-orange text-brown-dark disabled:opacity-40 disabled:cursor-not-allowed hover:bg-orange-dark transition-colors"
                  whileHover={canSend ? { scale: 1.05 } : {}}
                  whileTap={canSend ? { scale: 0.95 } : {}}
                  aria-label="שלח הודעה"
                >
                  <Send size={18} className="rotate-180" />
                </m.button>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  )
}
