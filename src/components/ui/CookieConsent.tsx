import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const CONSENT_KEY = 'mw_cookie_consent'

type ConsentStatus = 'pending' | 'accepted' | 'rejected'

export default function CookieConsent() {
  const [status, setStatus] = useState<ConsentStatus>('pending')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY)
    if (stored === 'accepted' || stored === 'rejected') {
      setStatus(stored)
    } else {
      // Show banner after short delay
      const timer = setTimeout(() => setIsVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleConsent = (accepted: boolean) => {
    const newStatus = accepted ? 'accepted' : 'rejected'
    localStorage.setItem(CONSENT_KEY, newStatus)
    setStatus(newStatus)
    setIsVisible(false)
  }

  // Don't render if consent already given
  if (status !== 'pending') return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          role="dialog"
          aria-label="הודעת עוגיות"
          aria-live="polite"
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="bg-white rounded-xl shadow-lg border border-cream-darker/30 p-4">
            <p className="text-sm text-brown leading-relaxed mb-3">
              האתר משתמש בעוגיות לשיפור החוויה.{' '}
              <a
                href="/privacy"
                className="text-orange hover:underline"
              >
                מדיניות פרטיות
              </a>
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => handleConsent(true)}
                className="flex-1 px-3 py-2 text-sm font-medium bg-orange text-brown-dark rounded-lg hover:bg-orange-dark transition-colors focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
              >
                אישור
              </button>
              <button
                onClick={() => handleConsent(false)}
                className="px-3 py-2 text-sm text-brown-muted hover:text-brown transition-colors"
              >
                דחייה
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
