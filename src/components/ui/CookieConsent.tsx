import { useState, useEffect } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { EASE_BRAND } from '../../config/motion'

const CONSENT_KEY = 'mw_cookie_consent'

type ConsentStatus = 'pending' | 'accepted' | 'rejected'

export default function CookieConsent() {
  const [status, setStatus] = useState<ConsentStatus>('pending')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // The prerender snapshot never carries the banner: a slow snapshot once froze
    // body.mw-consent-open into the shot HTML, so returning visitors started with the strip's space
    if ((window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__) return
    const stored = localStorage.getItem(CONSENT_KEY)
    if (stored === 'accepted' || stored === 'rejected') {
      document.documentElement.classList.remove('consent-pending', 'consent-later')
      setStatus(stored)
    } else {
      // Show banner after short delay. Inner pages (the shot, D102): not over the first screen a
      // visitor lands on from a search, but at the first scroll (or after 8 s), so it never covers
      // the page's offer and its WhatsApp key at first sight; the home page reserves its band.
      if (window.location.pathname !== '/') {
        const show = () => setIsVisible(true)
        const timer = setTimeout(show, 8000)
        window.addEventListener('scroll', show, { once: true, passive: true })
        return () => { clearTimeout(timer); window.removeEventListener('scroll', show) }
      }
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
    // Shot: index.html reserved the strip in --safe-b from frame 0 (SPEC 1.5); the choice frees it
    document.documentElement.classList.remove('consent-pending')
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
          className="mw-consent-banner fixed inset-x-3 sm:inset-x-auto sm:right-4 sm:max-w-sm z-50"
          data-zone="ui"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: EASE_BRAND }}
        >
          {/* Mobile: single compact row. Desktop (sm+): stacked card. */}
          <div className="mw-consent p-3 sm:p-4">
            <div className="flex items-center gap-3 sm:flex-col sm:items-stretch sm:gap-0">
              <p className="mw-consent__text flex-1 text-sm leading-snug sm:leading-relaxed sm:mb-3">
                האתר משתמש בעוגיות.{' '}
                {/* Static underline is a WCAG 1.4.1 requirement for links inside
                    running text (axe link-in-text-block fired on every page) —
                    color alone (1.49:1 vs surrounding text) is not a valid cue */}
                <a
                  href="/privacy"
                  className="mw-consent__link underline underline-offset-2 whitespace-nowrap"
                >
                  מדיניות פרטיות
                </a>
              </p>

              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <button
                  onClick={() => handleConsent(true)}
                  className="mw-consent__ok px-4 py-2 sm:flex-1 text-sm rounded-lg"
                >
                  אישור
                </button>
                <button
                  onClick={() => handleConsent(false)}
                  className="mw-consent__no px-2.5 py-2 text-sm"
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
