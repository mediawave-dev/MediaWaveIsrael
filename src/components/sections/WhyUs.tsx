import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LottieIcon } from '../ui'
import SectionSkeleton from '../ui/SectionSkeleton'
import { useSanityQuery } from '../../sanity/hooks'
import { WHY_US_QUERY } from '../../sanity/queries'

interface SanityWhyUs {
  _id: string
  title: string
  description: string
  lottieAnimation?: string
  color: 'orange' | 'terracotta' | 'sage'
}

const fallbackDifferentiators: SanityWhyUs[] = [
  {
    _id: 'tech',
    lottieAnimation: '/animations/2/computer%20technician.json',
    title: 'טכנולוגיה מתקדמת',
    description: 'עובדים עם React, Next.js ו-Astro לביצועים מעולים ותחזוקה קלה.',
    color: 'orange',
  },
  {
    _id: 'ai',
    lottieAnimation: '/animations/AI/AI%20animation.json',
    title: 'מותאם לבינה מלאכותית',
    description: 'האתר שלכם מותאם גם למנועי AI כמו ChatGPT ו-Perplexity, לא רק לגוגל. כך לקוחות חדשים מוצאים אתכם בכל מקום.',
    color: 'terracotta',
  },
  {
    _id: 'personal',
    lottieAnimation: '/animations/6%20personal/contact%20us.json',
    title: 'ליווי אישי',
    description: 'מדברים ישירות עם המפתח, בלי middlemen.',
    color: 'sage',
  },
]

const colorMap = {
  orange: { border: 'border-orange/20' },
  terracotta: { border: 'border-terracotta/20' },
  sage: { border: 'border-sage/20' },
}

export default function WhyUs() {
  const { data, loading, error } = useSanityQuery<SanityWhyUs[]>(WHY_US_QUERY)

  const differentiators = data && data.length > 0 ? data : (error ? fallbackDifferentiators : null)

  // Detect reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  if (loading && !differentiators) {
    return <SectionSkeleton lines={3} />
  }

  if (!differentiators || differentiators.length === 0) return null

  return (
    <section
      id="why-us"
      aria-label="למה אנחנו"
      className="relative py-16 md:py-20 overflow-hidden"
    >
      {/* ===== LAYER 1: Video Background ===== */}

      {/* Mobile: poster image */}
      <img
        src="/images/whyus-poster.webp"
        alt=""
        width="750"
        height="500"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover md:hidden"
        style={{ zIndex: 0 }}
      />

      {/* Desktop: video (if motion allowed) */}
      {!prefersReducedMotion && (
        <video
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          poster="/images/whyus-poster.webp"
          className="absolute inset-0 w-full h-full object-cover hidden md:block opacity-40"
          style={{ zIndex: 0 }}
        >
          <source src="/videos/whyus-bg.mp4" type="video/mp4" />
        </video>
      )}

      {/* Desktop: poster fallback if reduced motion */}
      {prefersReducedMotion && (
        <div
          className="absolute inset-0 hidden md:block bg-cover bg-center opacity-40"
          style={{
            backgroundImage: 'url(/images/whyus-poster.webp)',
            zIndex: 0,
          }}
        />
      )}

      {/* ===== LAYER 2: Light Overlay (cream gradient for readability) ===== */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          background: 'linear-gradient(to bottom, rgba(253, 251, 247, 0.85) 0%, rgba(245, 240, 232, 0.9) 100%)',
        }}
      />

      {/* ===== LAYER 3: Content ===== */}
      <div className="relative z-2 container max-w-5xl">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, transform: 'translateY(20px)' }}
          whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-headline mb-3">
            למה לעבוד איתנו?
          </h2>
          <p className="text-lg text-brown-light">
            שלושה דברים שמבדילים אותנו
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {differentiators.map((item, index) => {
            const colors = colorMap[item.color] ?? colorMap.orange
            const hasLottie = !!item.lottieAnimation
            return (
              <motion.div
                key={item._id}
                className={`bg-white/95 backdrop-blur-sm rounded-xl p-6 border ${colors.border} shadow-sm group text-center`}
                initial={{ opacity: 0, transform: 'translateY(20px)' }}
                whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(74, 74, 74, 0.08)' }}
              >
                {hasLottie ? (
                  <div className="w-28 h-28 mx-auto mb-4 transition-transform duration-300 group-hover:scale-105">
                    <LottieIcon
                      animationPath={item.lottieAnimation}
                      size={112}
                      playOnHover={true}
                      loop={true}
                    />
                  </div>
                ) : null}
                <h3 className="font-headline font-bold text-brown-dark text-xl mb-2">
                  {item.title}
                </h3>
                <p className="text-brown-light leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
