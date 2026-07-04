import { useState, useEffect, useRef } from 'react'
import { m } from 'framer-motion'
import { LottieIcon, WaveDivider } from '../ui'
import { useMediaQuery } from '../../hooks/useMediaQuery'

interface WhyUsItem {
  _id: string
  title: string
  description: string
  lottieAnimation?: string
  color: 'orange' | 'terracotta' | 'sage'
}

const differentiators: WhyUsItem[] = [
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
    description: 'מדברים ישירות עם המפתח, בלי מתווכים.',
    color: 'sage',
  },
]

const colorMap: Record<string, { border: string }> = {
  orange: { border: 'border-orange/20' },
  terracotta: { border: 'border-terracotta/20' },
  sage: { border: 'border-sage/20' },
}

export default function WhyUs() {
  // Detect reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Mount the background video only on desktop and only when the section is
  // near the viewport — mobile never downloads it, desktop pays for it lazily.
  const sectionRef = useRef<HTMLElement>(null)
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [videoNearby, setVideoNearby] = useState(false)

  useEffect(() => {
    if (!sectionRef.current || !isDesktop) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVideoNearby(true)
          observer.disconnect()
        }
      },
      { rootMargin: '400px' }
    )
    observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [isDesktop])

  return (
    <section
      ref={sectionRef}
      id="why-us"
      aria-label="למה אנחנו"
      className="relative py-16 md:py-20 overflow-hidden"
    >
      {/* ===== LAYER 1: Video Background ===== */}

      {/* Poster image — always present, acts as the desktop backdrop until
          the video mounts (and as the permanent one under reduced motion) */}
      <img
        src="/images/whyus-poster.webp"
        alt=""
        width="750"
        height="500"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover md:opacity-30"
        style={{ zIndex: 0 }}
      />

      {/* Desktop: video, mounted only near the viewport (if motion allowed) */}
      {isDesktop && videoNearby && !prefersReducedMotion && (
        <video
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          poster="/images/whyus-poster.webp"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          style={{ zIndex: 0 }}
        >
          <source src="/videos/whyus-bg.mp4" type="video/mp4" />
        </video>
      )}

      {/* ===== LAYER 2: Light Overlay (cool slate gradient for readability —
           matches the current light-blue palette; the old warm cream tint
           was a leftover from the historical watercolor palette) ===== */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          background: 'linear-gradient(to bottom, rgba(248, 250, 252, 0.9) 0%, rgba(241, 245, 249, 0.94) 100%)',
        }}
      />

      {/* Wave hand-off from the marquee strip above (same cream) */}
      <WaveDivider
        variant="b"
        flip
        fill="#F8FAFC"
        className="absolute top-0 inset-x-0 z-[1]"
      />

      {/* ===== LAYER 3: Content ===== */}
      <div className="relative z-2 container max-w-5xl">
        {/* Header */}
        <m.div
          className="text-center mb-12"
          initial={{ opacity: 0, transform: 'translateY(20px)' }}
          whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-headline mb-3">
            למה לעבוד <span style={{ color: '#0284C7' }}>איתנו?</span>
          </h2>
          <div className="section-title-accent" aria-hidden="true" />
          <p className="text-lg text-brown-light mt-4">
            שלושה דברים שמבדילים אותנו
          </p>
        </m.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {differentiators.map((item, index) => {
            const colors = colorMap[item.color] ?? colorMap.orange
            const hasLottie = !!item.lottieAnimation
            return (
              <m.div
                key={item._id}
                className={`card-glow bg-white/95 backdrop-blur-sm rounded-xl p-6 border ${colors.border} shadow-sm group text-center`}
                style={{ '--hover-shadow': '0 8px 24px rgba(74, 74, 74, 0.08)' } as React.CSSProperties}
                initial={{ opacity: 0, transform: 'translateY(20px)' }}
                whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
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
              </m.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
