import { useEffect, useRef } from 'react'
import { m, useInView, animate } from 'framer-motion'
import { WaveDivider } from '../ui/WaveDivider'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { EASE_BRAND } from '../../config/motion'

/**
 * ProofBand — the single dark trust anchor (DESIGN-UPGRADE §4.3).
 * ONE navy section between Services and HowWeWork; the contrast itself is
 * the design move. Every number here is measured from THIS site's build
 * (Lighthouse run on the deployed bundle) — honesty red line: no invented
 * client counts, no vague "hundreds". Real client/experience numbers wait
 * for Nati in the data-pending slots below.
 *
 * Count-up: useInView + framer `animate` writing textContent directly —
 * NO setState per frame.
 */

interface Stat {
  value: number
  decimals: number
  suffix: string
  label: string
}

// Measured 03/07/2026, Lighthouse 12.8.2, desktop preset, production build.
// Update alongside the final Lighthouse run of each design iteration.
const STATS: Stat[] = [
  { value: 97, decimals: 0, suffix: '/100', label: 'ציון Lighthouse (דסקטופ)' }, // [קופי: נתי]
  { value: 1.0, decimals: 1, suffix: 's', label: 'שניות עד התוכן הראשי (LCP)' }, // [קופי: נתי]
  { value: 0.53, decimals: 2, suffix: 'MB', label: 'משקל העמוד כולו' }, // [קופי: נתי]
]

const PAGESPEED_URL = 'https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fmediawaveisrael.com%2F'

function CountUp({ stat, delay }: { stat: Stat; delay: number }) {
  const numRef = useRef<HTMLSpanElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const inView = useInView(wrapRef, { once: true, margin: '-60px' })
  const prefersReducedMotion = useReducedMotion()
  const finalText = stat.value.toFixed(stat.decimals)

  useEffect(() => {
    const el = numRef.current
    if (!el || !inView) return
    if (prefersReducedMotion) {
      el.textContent = finalText
      return
    }
    const controls = animate(0, stat.value, {
      duration: 1.6,
      delay,
      ease: EASE_BRAND,
      onUpdate: (v) => {
        el.textContent = v.toFixed(stat.decimals)
      },
    })
    return () => controls.stop()
  }, [inView, prefersReducedMotion, stat.value, stat.decimals, finalText, delay])

  return (
    <div ref={wrapRef} className="text-center">
      <p className="mb-1 md:mb-2">
        <span className="sr-only">{`${finalText}${stat.suffix}`}</span>
        <span
          aria-hidden="true"
          dir="ltr"
          className="font-mono-spec font-bold text-5xl md:text-7xl"
          style={{ color: '#7DD3FC' }}
        >
          <span ref={numRef}>{prefersReducedMotion ? finalText : '0'}</span>
          <span className="text-2xl md:text-4xl" style={{ color: '#38BDF8' }}>
            {stat.suffix}
          </span>
        </span>
      </p>
      <p className="text-sm md:text-base text-white/70">{stat.label}</p>
    </div>
  )
}

export default function ProofBand() {
  return (
    <section
      id="proof"
      aria-label="ביצועים מדודים"
      className="relative overflow-hidden py-16 md:py-24"
      style={{ background: '#1E293B' }}
    >
      {/* Subtle cyan mesh on the navy — static, no animation */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 80% 10%, rgba(125, 211, 252, 0.10) 0%, transparent 60%), radial-gradient(ellipse 50% 45% at 15% 90%, rgba(94, 234, 212, 0.07) 0%, transparent 60%)',
        }}
      />

      <div className="container relative max-w-5xl">
        <m.div
          className="text-center mb-10 md:mb-14"
          initial={{ opacity: 0, transform: 'translateY(20px)' }}
          whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE_BRAND }}
        >
          <h2 className="text-4xl md:text-5xl font-headline text-white mb-4">
            {/* [קופי: נתי — כותרת פס ההוכחות] */}
            האתר הזה הוא <span style={{ color: '#7DD3FC' }}>ההוכחה</span>
          </h2>
          <div className="section-title-accent" aria-hidden="true" />
          <p className="text-lg md:text-xl text-white/70 mt-4">
            {/* [קופי: נתי] */}
            לא מבטיחים מהירות — מודדים אותה, על האתר הזה ממש.
          </p>
        </m.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-6">
          {STATS.map((stat, i) => (
            <CountUp key={stat.label} stat={stat} delay={i * 0.15} />
          ))}
        </div>

        {/*
          data-pending — slots for REAL client numbers (projects delivered,
          years, average client Lighthouse score). Built and styled, hidden
          until Nati supplies verified values. NEVER fill with estimates.
        */}
        <div data-pending hidden aria-hidden="true">
          <div className="text-center">
            <p className="font-mono-spec font-bold text-5xl md:text-7xl" style={{ color: '#7DD3FC' }}>
              0
            </p>
            <p className="text-sm md:text-base text-white/70">פרויקטים שהושקו</p>
          </div>
          <div className="text-center">
            <p className="font-mono-spec font-bold text-5xl md:text-7xl" style={{ color: '#7DD3FC' }}>
              0
            </p>
            <p className="text-sm md:text-base text-white/70">שנות ניסיון</p>
          </div>
        </div>

        <m.p
          className="text-center mt-10 text-sm text-white/50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4, ease: EASE_BRAND }}
        >
          נמדד עם Lighthouse על הגרסה החיה.{' '}
          <a
            href={PAGESPEED_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 text-white/70 hover:text-orange decoration-white/30 hover:decoration-orange transition-colors"
          >
            בדקו בעצמכם
          </a>
        </m.p>
      </div>

      {/* Exit wave into HowWeWork (cream) */}
      <WaveDivider variant="c" fill="#F8FAFC" className="absolute bottom-0 inset-x-0" />
    </section>
  )
}
