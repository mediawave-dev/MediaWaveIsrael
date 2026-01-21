import { useState } from 'react'
import { motion } from 'framer-motion'

const testimonials = [
  {
    id: 1,
    name: 'יעל כ.',
    quote: 'שירות מקצועי ואדיב, האתר יצא מעל ומעבר למצופה. ממליצה בחום!',
    initial: 'י',
  },
  {
    id: 2,
    name: 'דני ל.',
    quote: 'תהליך עבודה נעים ומהיר, התוצאה מדהימה. תודה רבה!',
    initial: 'ד',
  },
  {
    id: 3,
    name: 'מיכל א.',
    quote: 'מקצועיות ברמה גבוהה, זמינות מלאה ותוצאה מושלמת',
    initial: 'מ',
  },
  {
    id: 4,
    name: 'רון מ.',
    quote: 'חוויה מעולה מההתחלה ועד הסוף, אתר מרשים ומקצועי',
    initial: 'ר',
  },
]

export default function Testimonials() {
  // Show 2 cards at a time, so we have 2 "pages" (0-1 and 2-3)
  const [currentPage, setCurrentPage] = useState(0)
  const cardsPerPage = 2
  const totalPages = Math.ceil(testimonials.length / cardsPerPage)

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
  }

  // Get current visible cards
  const startIndex = currentPage * cardsPerPage
  const visibleTestimonials = testimonials.slice(startIndex, startIndex + cardsPerPage)

  return (
    <section
      id="testimonials"
      className="relative py-20 md:py-28 bg-cream-dark overflow-hidden"
    >
      {/* Background decorations */}
      <motion.div
        className="absolute top-20 left-[5%] w-80 h-80 rounded-full bg-orange/6 blur-3xl pointer-events-none"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-20 right-[10%] w-72 h-72 rounded-full bg-terracotta/5 blur-3xl pointer-events-none"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Decorative floating dots */}
      <motion.div
        className="absolute top-32 right-[20%] w-3 h-3 rounded-full bg-orange/40 hidden lg:block"
        animate={{
          y: [0, -20, 0],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-40 left-[15%] w-2 h-2 rounded-full bg-terracotta/50 hidden lg:block"
        animate={{
          y: [0, 15, 0],
          x: [0, -8, 0],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      <div className="container relative">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          {/* Badge */}
          <motion.span
            className="inline-flex items-center gap-2 bg-orange/10 text-orange text-sm font-semibold px-5 py-2.5 rounded-full mb-6 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="w-2 h-2 bg-orange rounded-full animate-pulse" />
            המלצות
          </motion.span>

          {/* Title */}
          <div className="relative inline-block">
            <motion.h2
              className="text-h2 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              לקוחות ממליצים
            </motion.h2>

            {/* Hand-drawn underline */}
            <motion.svg
              className="absolute -bottom-1 right-1/2 translate-x-1/2 w-40 h-3"
              viewBox="0 0 160 10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <motion.path
                d="M2 6 Q40 2 80 5 T158 4"
                fill="none"
                stroke="var(--color-orange)"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="opacity-40"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
            </motion.svg>
          </div>

          {/* Subtitle */}
          <motion.p
            className="text-lg text-brown-light mt-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            מה הלקוחות שלנו אומרים על העבודה איתנו
          </motion.p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Arrows */}
          <motion.button
            onClick={handlePrev}
            disabled={currentPage === 0}
            className="absolute top-1/2 -translate-y-1/2 -right-2 md:-right-6 lg:-right-14 z-10 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-brown hover:text-orange hover:shadow-xl transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-brown disabled:hover:shadow-lg border border-cream-darker/20"
            whileHover={{ scale: currentPage === 0 ? 1 : 1.08 }}
            whileTap={{ scale: currentPage === 0 ? 1 : 0.95 }}
            aria-label="הקודם"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </motion.button>

          <motion.button
            onClick={handleNext}
            disabled={currentPage >= totalPages - 1}
            className="absolute top-1/2 -translate-y-1/2 -left-2 md:-left-6 lg:-left-14 z-10 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-brown hover:text-orange hover:shadow-xl transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-brown disabled:hover:shadow-lg border border-cream-darker/20"
            whileHover={{ scale: currentPage >= totalPages - 1 ? 1 : 1.08 }}
            whileTap={{ scale: currentPage >= totalPages - 1 ? 1 : 0.95 }}
            aria-label="הבא"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </motion.button>

          {/* Cards Container */}
          <div className="mx-8 md:mx-6 lg:mx-0">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
              key={currentPage}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {visibleTestimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <TestimonialCard testimonial={testimonial} />
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2.5 mt-8">
            {Array.from({ length: totalPages }).map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentPage === index
                    ? 'bg-orange w-6'
                    : 'bg-brown-muted/25 w-2 hover:bg-brown-muted/40'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`עבור לעמוד ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom wave transition */}
      <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none">
        <svg
          className="absolute bottom-0 w-full h-full"
          viewBox="0 0 1440 64"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0,20 C360,50 720,10 1080,35 C1260,47 1380,30 1440,25 L1440,64 L0,64 Z"
            fill="var(--color-cream)"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          />
        </svg>
      </div>
    </section>
  )
}

interface TestimonialCardProps {
  testimonial: {
    id: number
    name: string
    quote: string
    initial: string
  }
}

function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <motion.article
      className="relative bg-white rounded-2xl p-6 md:p-7 shadow-card hover:shadow-lg transition-all duration-400 h-full min-h-[200px] flex flex-col border border-cream-darker/10"
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Quote Icon - top right */}
      <div className="absolute top-5 right-5">
        <motion.svg
          width="40"
          height="40"
          viewBox="0 0 56 56"
          fill="none"
          className="text-orange/15"
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <path
            d="M18.667 25.667c-2.934 0-5.334 2.4-5.334 5.333v8c0 2.933 2.4 5.333 5.334 5.333h5.333c2.933 0 5.333-2.4 5.333-5.333V31c0-8.827-7.173-16-16-16v5.333c4.414 0 8 3.587 8 8v.334c0 1.466-1.2 2.666-2.666 2.666h-5.334c-1.466 0-2.666-1.2-2.666-2.666 0-1.467 1.2-2.667 2.666-2.667h5.334v-2.666c0-1.467-1.2-2.667-2.667-2.667h-2.667zm18.666 0c-2.933 0-5.333 2.4-5.333 5.333v8c0 2.933 2.4 5.333 5.333 5.333h5.334c2.933 0 5.333-2.4 5.333-5.333V31c0-8.827-7.173-16-16-16v5.333c4.413 0 8 3.587 8 8v.334c0 1.466-1.2 2.666-2.667 2.666h-5.333c-1.467 0-2.667-1.2-2.667-2.666 0-1.467 1.2-2.667 2.667-2.667h5.333v-2.666c0-1.467-1.2-2.667-2.667-2.667h-2.666z"
            fill="currentColor"
          />
        </motion.svg>
      </div>

      {/* Quote Text - smaller font */}
      <div className="flex-1 flex items-center pt-10 pb-3">
        <p className="text-base md:text-lg text-brown leading-relaxed font-headline">
          "{testimonial.quote}"
        </p>
      </div>

      {/* Customer Info - name only */}
      <div className="flex items-center gap-3 pt-4 border-t border-cream-darker/20">
        {/* Avatar */}
        <motion.div
          className="w-10 h-10 rounded-full bg-gradient-to-br from-orange via-orange-light to-terracotta flex items-center justify-center text-white font-bold text-sm shadow-sm"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.2 }}
        >
          {testimonial.initial}
        </motion.div>
        {/* Name only */}
        <p className="font-semibold text-brown-dark">{testimonial.name}</p>
      </div>

      {/* Subtle corner accent */}
      <div className="absolute bottom-0 left-0 w-20 h-20 rounded-tl-2xl bg-gradient-to-tr from-orange/5 to-transparent pointer-events-none" />
    </motion.article>
  )
}
