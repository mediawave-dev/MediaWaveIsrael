import { useState, useEffect } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { useReducedMotion, useAmbientMotion } from '../../hooks/useReducedMotion'
import { useRevealFactory } from '../../config/reveal'
import { testimonials } from '../../data/testimonials'
import { inViewOnce, DURATION, EASE_BRAND } from '../../config/motion'

// Color palette for testimonial cards — sky family only (the old warm
// watercolor values are historical; never restore them)
const cardColors = ['#38BDF8', '#5EEAD4', '#7DD3FC', '#67E8F9']

function getColor(index: number): string {
  return cardColors[index % cardColors.length]
}

export default function Testimonials() {
  const prefersReducedMotion = useReducedMotion()
  const ambient = useAmbientMotion()
  // Header text tilts in gently (stars keep their spin, carousel untouched)
  const reveal = useRevealFactory()
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-rotate testimonials (respect OS reduced motion AND the a11y widget)
  useEffect(() => {
    if (prefersReducedMotion || !ambient) {
      setIsAutoPlaying(false)
      return
    }

    if (!isAutoPlaying || testimonials.length <= 1) return

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, prefersReducedMotion, ambient])

  // Don't render if no testimonials collected yet
  if (testimonials.length === 0) return null

  const color = getColor(activeIndex)
  const active = testimonials[activeIndex]

  const getImageUrl = (img?: string | null) => img ?? undefined

  return (
    <section
      id="testimonials"
      aria-label="המלצות לקוחות"
      className="relative py-16 md:py-24 bg-gradient-to-b from-cream to-cream-dark overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Giant quote mark */}
        <m.div
          className="absolute -top-20 -right-20 text-[400px] font-headline leading-none select-none"
          style={{ color: 'rgba(245, 166, 35, 0.05)' }}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={inViewOnce}
          transition={{ duration: 1 }}
        >
          &ldquo;
        </m.div>

        {/* Floating shapes */}
        <m.div
          className="absolute top-1/4 left-10 w-32 h-32 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(125,211,252,0.12) 0%, transparent 70%)' }}
          animate={ambient ? { y: [0, -20, 0], scale: [1, 1.1, 1] } : undefined}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <m.div
          className="absolute bottom-1/4 right-20 w-40 h-40 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(153,246,228,0.12) 0%, transparent 70%)' }}
          animate={ambient ? { y: [0, 15, 0], scale: [1, 1.05, 1] } : undefined}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="container relative">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <m.div
            className="flex items-center justify-center gap-3 mb-4"
            initial={{ opacity: 0, transform: 'translateY(20px)' }}
            whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
            viewport={inViewOnce}
          >
            {[...Array(5)].map((_, i) => (
              <m.svg
                key={i}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                style={{ fill: 'var(--color-orange)' }}
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={inViewOnce}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </m.svg>
            ))}
          </m.div>

          <m.h2
            className="text-5xl md:text-6xl font-headline text-brown-dark mb-4"
            {...reveal('rotateSubtle', 0.2)}
          >
            מה אומרים עלינו
          </m.h2>

          <div className="section-title-accent" aria-hidden="true" />

          <m.p
            className="text-brown-light text-2xl max-w-md mx-auto mt-4"
            {...reveal('rotateSubtle', 0.3)}
          >
            לקוחות מרוצים מספרים על החוויה שלהם
          </m.p>
        </div>

        {/* Featured Testimonial - Large card */}
        <div className="max-w-4xl mx-auto mb-12">
          <AnimatePresence mode="wait">
            <m.div
              key={activeIndex}
              className="relative"
              initial={{ opacity: 0, transform: 'translateY(30px) scale(0.95)' }}
              animate={{ opacity: 1, transform: 'translateY(0px) scale(1)' }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              <div
                className="relative bg-white rounded-3xl p-8 md:p-12 shadow-xl overflow-hidden"
                style={{ boxShadow: `0 25px 60px -15px ${color}20` }}
              >
                {/* Gradient accent */}
                <div
                  className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-30"
                  style={{ background: color }}
                />

                {/* Quote icon */}
                <m.div
                  className="absolute top-6 right-6 md:top-8 md:right-8"
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                >
                  <svg width="48" height="48" viewBox="0 0 24 24" fill={color} className="opacity-20">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </m.div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Stars */}
                  {active.rating && (
                    <div className="flex gap-1 mb-6">
                      {[...Array(active.rating)].map((_, i) => (
                        <m.svg
                          key={i}
                          width="24" height="24" viewBox="0 0 24 24" fill={color}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 + i * 0.05 }}
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </m.svg>
                      ))}
                    </div>
                  )}

                  {/* Quote */}
                  <m.p
                    className="text-xl md:text-2xl lg:text-3xl font-headline text-brown-dark leading-relaxed mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    &ldquo;{active.quote}&rdquo;
                  </m.p>

                  {/* Author */}
                  <m.div
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {active.image ? (
                      <img
                        src={getImageUrl(active.image)}
                        alt={active.name}
                        width={56}
                        height={56}
                        loading="lazy"
                        className="w-14 h-14 rounded-full object-cover shadow-lg"
                      />
                    ) : (
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg"
                        style={{ backgroundColor: color }}
                      >
                        {active.name.charAt(0)}
                      </div>
                    )}

                    <div>
                      <p className="font-bold text-xl text-brown-dark">{active.name}</p>
                      <p className="text-brown-light text-sm">{active.business}</p>
                      {active.url && (
                        <a
                          href={active.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-ink text-sm hover:underline"
                        >
                          {active.url}
                        </a>
                      )}
                    </div>
                  </m.div>
                </div>

                {/* Decorative line */}
                <m.div
                  className="absolute bottom-0 left-0 right-0 h-1"
                  style={{ backgroundColor: color }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 5, ease: 'linear' }}
                />
              </div>
            </m.div>
          </AnimatePresence>
        </div>

        {/* Navigation dots */}
        {testimonials.length > 1 && (
          <div className="flex justify-center gap-3 mb-16">
            {testimonials.map((testimonial, index) => (
              <button
                key={testimonial.id}
                onClick={() => {
                  setActiveIndex(index)
                  setIsAutoPlaying(false)
                }}
                className="relative group"
                aria-label={`עבור לביקורת ${index + 1}`}
              >
                <m.div
                  className="w-3 h-3 rounded-full transition-all duration-300"
                  style={{ backgroundColor: activeIndex === index ? getColor(index) : '#D4D4D4' }}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                />
                {activeIndex === index && (
                  <m.div
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: getColor(index) }}
                    initial={false}
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Mini cards grid */}
        {testimonials.length > 1 && (
          <m.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            initial={{ opacity: 0, transform: 'translateY(30px)' }}
            whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
            viewport={inViewOnce}
            transition={{ delay: 0.1, duration: DURATION.reveal, ease: EASE_BRAND }}
          >
            {testimonials.map((testimonial, index) => (
              <m.button
                key={testimonial.id}
                onClick={() => {
                  setActiveIndex(index)
                  setIsAutoPlaying(false)
                }}
                className={`relative p-4 rounded-xl text-right transition-all duration-300 ${
                  activeIndex === index
                    ? 'bg-white shadow-lg scale-105'
                    : 'bg-white/50 hover:bg-white hover:shadow-md'
                }`}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                {activeIndex === index && (
                  <m.div
                    className="absolute inset-0 rounded-xl"
                    style={{ border: `2px solid ${getColor(index)}` }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}

                <div className="relative z-10">
                  {testimonial.image ? (
                    <img
                      src={getImageUrl(testimonial.image)}
                      alt={testimonial.name}
                      width={40}
                      height={40}
                      loading="lazy"
                      className="w-10 h-10 rounded-full object-cover mb-2"
                    />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-base font-bold mb-2"
                      style={{ backgroundColor: getColor(index) }}
                    >
                      {testimonial.name.charAt(0)}
                    </div>
                  )}

                  <p className="font-semibold text-base text-brown-dark truncate">{testimonial.name}</p>

                  {testimonial.rating && (
                    <div className="flex gap-0.5 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          width="16" height="16" viewBox="0 0 24 24"
                          fill={i < (testimonial.rating ?? 0) ? getColor(index) : '#E5E5E5'}
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                  )}
                </div>
              </m.button>
            ))}
          </m.div>
        )}
      </div>
    </section>
  )
}
