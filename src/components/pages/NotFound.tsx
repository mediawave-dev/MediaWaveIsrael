import { m } from 'framer-motion'
import { Link } from 'react-router-dom'
import SEO from '../SEO'
import { SwellMark } from '../ui'
import { useAmbientMotion } from '../../hooks/useReducedMotion'

export default function NotFound() {
  // Ambient micro-loops (arrow nudge, floating dots) stop only via the a11y widget
  const ambient = useAmbientMotion()
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <SEO
        title="העמוד לא נמצא (404)"
        description="העמוד שחיפשתם לא קיים או שהוסר. חזרו לדף הבית של MediaWave Israel."
        noindex
      />
      <div className="text-center max-w-md">
        {/* Brand mark — the wave the lost page "drifted with" */}
        <m.div
          className="flex justify-center mb-6"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <SwellMark tone="onLight" className="w-20 h-20 md:w-24 md:h-24" title="MediaWave" />
        </m.div>

        {/* Animated 404 */}
        <m.div
          className="relative mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Watercolor blob background */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 rounded-full bg-orange/10 blur-3xl" />
          </div>

          {/* 404 number — the site's outline-stroke statement voice
              (same identity as the giant word and the process numbers) */}
          <h1
            className="relative text-[120px] md:text-[180px] font-headline leading-none select-none"
            style={{
              color: 'transparent',
              WebkitTextStroke: '2px rgba(56, 189, 248, 0.6)',
            }}
          >
            404
          </h1>

          {/* Decorative curved line */}
          <m.svg
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-8"
            viewBox="0 0 160 32"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <m.path
              d="M10 16 Q40 4 80 16 T150 16"
              fill="none"
              stroke="var(--color-orange)"
              strokeWidth="3"
              strokeLinecap="round"
              className="opacity-50"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </m.svg>
        </m.div>

        {/* Message */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-3xl md:text-4xl font-headline text-brown-dark mb-4">
            הדף הזה נסחף עם הגל
          </h2>
          <p className="text-lg text-brown-light mb-8 leading-relaxed">
            העמוד שחיפשתם לא קיים, או שהכתובת השתנתה.
            <br />
            בואו נחזיר אתכם למסלול.
          </p>

          {/* CTA Button */}
          <m.a
            href="/"
            className="inline-flex items-center gap-2 bg-orange font-semibold py-4 px-8 rounded-full shadow-md hover:shadow-glow hover:bg-orange-dark transition-all duration-300"
            style={{ color: '#1e3a5f' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <m.span
              animate={ambient ? { x: [0, 4, 0] } : undefined}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              →
            </m.span>
            <span>חזרה לדף הבית</span>
          </m.a>

          {/* Quick escapes */}
          <nav aria-label="קישורים מהירים" className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            <Link to="/blog" className="text-sky-ink hover:text-sky-ink-strong font-semibold transition-colors min-h-11 inline-flex items-center">
              הבלוג
            </Link>
            <a href="/#services" className="text-sky-ink hover:text-sky-ink-strong font-semibold transition-colors min-h-11 inline-flex items-center">
              השירותים שלנו
            </a>
            <a href="/#contact" className="text-sky-ink hover:text-sky-ink-strong font-semibold transition-colors min-h-11 inline-flex items-center">
              יצירת קשר
            </a>
          </nav>
        </m.div>

        {/* Floating decorative dots */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[
            { top: '20%', left: '10%', size: 8, delay: 0 },
            { top: '30%', right: '15%', size: 6, delay: 0.5 },
            { top: '60%', left: '20%', size: 10, delay: 1 },
            { top: '70%', right: '25%', size: 5, delay: 1.5 },
          ].map((dot, i) => (
            <m.div
              key={i}
              className="absolute rounded-full bg-orange/30"
              style={{
                width: dot.size,
                height: dot.size,
                top: dot.top,
                left: dot.left,
                right: dot.right,
              }}
              animate={ambient ? {
                y: [0, -15, 0],
                opacity: [0.3, 0.6, 0.3],
              } : undefined}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: dot.delay,
              }}
            />
          ))}
        </div>

        {/* Contact info */}
        <m.p
          className="mt-12 text-sm text-brown-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          צריכים עזרה? התקשרו אלינו:{' '}
          <a href="tel:052-8731808" className="text-sky-ink hover:underline" dir="ltr">
            052-8731808
          </a>
        </m.p>
      </div>
    </div>
  )
}
