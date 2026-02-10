import { useState, useCallback } from 'react'
import { CHATBOT_CONFIG } from '../config/chatbot-prompt'

// --- Types ---

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export interface UseChatReturn {
  messages: ChatMessage[]
  isLoading: boolean
  isLimitReached: boolean
  sendMessage: (content: string) => Promise<void>
  resetConversation: () => void
}

// --- Constants (from unified config) ---

const {
  maxMessagesPerConversation: MAX_MESSAGES,
  maxContextMessages: MAX_CONTEXT_MESSAGES,
  maxMessageLength: MAX_MESSAGE_LENGTH,
} = CHATBOT_CONFIG

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: 'אהלן! אני העוזר של MediaWave. איך אפשר לעזור?',
}

const LIMIT_MESSAGE = 'תודה על השיחה! לשיחה מעמיקה יותר, לחצו כאן: https://wa.me/972528731808'

// --- Helpers ---

/** Escape HTML entities to prevent XSS */
function sanitize(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim()
}

function getErrorMessage(status: number, serverMsg?: string): string {
  if (serverMsg) return serverMsg

  switch (status) {
    case 429:
      return 'אנא המתינו רגע ונסו שוב.'
    case 503:
      return 'שירות הצ׳אט אינו זמין כרגע. נסו שוב מאוחר יותר.'
    default:
      return 'אופס, משהו השתבש. נסו שוב בעוד רגע, או צרו קשר ישירות בוואטסאפ https://wa.me/972528731808.'
  }
}

// --- Hook ---

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE])
  const [isLoading, setIsLoading] = useState(false)
  const [isLimitReached, setIsLimitReached] = useState(false)

  const sendMessage = useCallback(async (content: string) => {
    const sanitized = sanitize(content)
    if (!sanitized || isLoading || isLimitReached) return

    // Enforce max length
    const trimmed = sanitized.slice(0, MAX_MESSAGE_LENGTH)

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setIsLoading(true)

    // Check conversation limit
    if (updatedMessages.length >= MAX_MESSAGES) {
      setMessages((prev) => [
        ...prev,
        { id: `limit-${Date.now()}`, role: 'assistant', content: LIMIT_MESSAGE },
      ])
      setIsLimitReached(true)
      setIsLoading(false)
      return
    }

    try {
      // Build API payload — exclude welcome, take last N messages
      const apiMessages = updatedMessages
        .filter((m) => m.id !== 'welcome')
        .slice(-MAX_CONTEXT_MESSAGES)
        .map((m) => ({ role: m.role, content: m.content }))

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        const errorMsg = getErrorMessage(response.status, data?.error)
        throw new Error(errorMsg)
      }

      const data = await response.json()

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: data.message || 'מצטער, לא הצלחתי לענות. נסו שוב.',
        },
      ])
    } catch (err) {
      const errorContent =
        err instanceof Error && err.message !== 'Failed to fetch'
          ? err.message
          : 'בעיית חיבור. בדקו את האינטרנט ונסו שוב, או צרו קשר בוואטסאפ https://wa.me/972528731808.'

      setMessages((prev) => [
        ...prev,
        { id: `error-${Date.now()}`, role: 'assistant', content: errorContent },
      ])
    } finally {
      setIsLoading(false)
    }
  }, [messages, isLoading, isLimitReached])

  const resetConversation = useCallback(() => {
    setMessages([WELCOME_MESSAGE])
    setIsLimitReached(false)
  }, [])

  return { messages, isLoading, isLimitReached, sendMessage, resetConversation }
}
