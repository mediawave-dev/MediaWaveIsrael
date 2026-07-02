import { useState, useEffect } from 'react'
import { m, AnimatePresence } from 'framer-motion'

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

  // While the banner is visible, shift the floating CTA buttons up (mobile)
  // so the banner never hides WhatsApp/chat — see .floating-cta in index.css
  useEffect(() => {
    if (isVisible) {
      document.body.classList.add('mw-consent-open')
    } else {
      document.body.classList.remove('mw-consent-open')
    }
    return () => document.body.classList.remove('mw-consent-open')
  }, [isVisible])

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
        <m.div
          role="dialog"
          aria-label="הודעת עוגיות"
          aria-live="polite"
          className="fixed bottom-3 inset-x-3 sm:bottom-4 sm:inset-x-auto sm:right-4 sm:max-w-sm z-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Mobile: single compact row. Desktop (sm+): stacked card. */}
          <div className="bg-white rounded-xl shadow-lg border border-cream-darker/30 p-3 sm:p-4">
            <div className="flex items-center gap-3 sm:flex-col sm:items-stretch sm:gap-0">
              <p className="flex-1 text-xs sm:text-sm text-brown leading-snug sm:leading-relaxed sm:mb-3">
                האתר משתמש בעוגיות לשיפור החוויה.{' '}
                <a
                  href="/privacy"
                  className="text-orange hover:underline whitespace-nowrap"
                >
                  מדיניות פרטיות
                </a>
              </p>

              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <button
                  onClick={() => handleConsent(true)}
                  className="px-4 py-2 sm:flex-1 text-sm font-medium bg-orange text-brown-dark rounded-lg hover:bg-orange-dark transition-colors focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
                >
                  אישור
                </button>
                <button
                  onClick={() => handleConsent(false)}
                  className="px-2.5 py-2 text-sm text-brown-muted hover:text-brown transition-colors"
                >
                  דחייה
                </button>
              </div>
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  )
}
