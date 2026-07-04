import { useEffect, useState } from 'react'
import { m } from 'framer-motion'
import { EASE_BRAND } from '../../config/motion'

/**
 * LoadTimeBadge — the un-fakeable proof (DESIGN-UPGRADE §5.1).
 * PerformanceObserver reads THIS visitor's real LCP and shows it after the
 * LCP already happened (so the badge itself never affects the metric).
 * Browsers without the LCP entry type (Safari) simply never show the badge —
 * an honest number or nothing.
 */

const PAGESPEED_URL = 'https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fmediawaveisrael.com%2F'

export function LoadTimeBadge({ className = '' }: { className?: string }) {
  const [seconds, setSeconds] = useState<string | null>(null)

  useEffect(() => {
    if (typeof PerformanceObserver === 'undefined') return
    if (!PerformanceObserver.supportedEntryTypes?.includes('largest-contentful-paint')) return

    let latest = 0
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        latest = Math.max(latest, entry.startTime)
      }
    })
    observer.observe({ type: 'largest-contentful-paint', buffered: true })

    // LCP is final once the page settles — read it shortly after load,
    // long after the metric itself was recorded
    const timer = setTimeout(() => {
      observer.disconnect()
      if (latest > 0 && latest < 30000) {
        setSeconds((latest / 1000).toFixed(1))
      }
    }, 2500)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [])

  if (!seconds) return null

  return (
    <m.p
      className={`flex flex-wrap items-center justify-center gap-x-2 text-sm text-white/70 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: EASE_BRAND }}
    >
      <span>
        {/* [קופי: נתי — נוסח מד הטעינה] */}
        העמוד הזה נטען אצלך תוך{' '}
        <span className="font-mono-spec font-bold text-orange" dir="ltr">
          {seconds}s
        </span>
      </span>
      <a
        href={PAGESPEED_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-4 decoration-white/40 hover:decoration-orange text-white/70 hover:text-orange transition-colors"
      >
        בדקו בעצמכם
      </a>
    </m.p>
  )
}

export default LoadTimeBadge
