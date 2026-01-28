import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const testimonials = [
  {
    id: 1,
    name: 'יעל כ.',
    role: 'בעלת עסק',
    quote: 'שירות מקצועי ואדיב, האתר יצא מעל ומעבר למצופה. ממליצה בחום!',
    rating: 5,
    color: '#F5A623',
  },
  {
    id: 2,
    name: 'דני ל.',
    role: 'יזם',
    quote: 'תהליך עבודה נעים ומהיר, התוצאה מדהימה. תודה רבה!',
    rating: 5,
    color: '#E07B54',
  },
  {
    id: 3,
    name: 'מיכל א.',
    role: 'מנהלת שיווק',
    quote: 'מקצועיות ברמה גבוהה, זמינות מלאה ותוצאה מושלמת.',
    rating: 5,
    color: '#8BB4A0',
  },
  {
    id: 4,
    name: 'רון מ.',
    role: 'בעל חברה',
    quote: 'חוויה מעולה מההתחלה ועד הסוף, אתר מרשים ומקצועי.',
    rating: 5,
    color: '#9B8AC4',
  },
]

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-rotate testimonials
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  return (
    <section
      id="testimonials"
      className="relative py-16 md:py-24 bg-gradient-to-b from-cream to-cream-dark overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Giant quote mark */}
        <motion.div
          className="absolute -top-20 -right-20 text-[400px] font-headline leading-none select-none"
          style={{ color: 'rgba(245, 166, 35, 0.05)' }}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          "
        </motion.div>

        {/* Floating shapes */}
        <motion.div
          className="absolute top-1/4 left-10 w-32 h-32 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(245,166,35,0.1) 0%, transparent 70%)' }}
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-20 w-40 h-40 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(139,180,160,0.1) 0%, transparent 70%)' }}
          animate={{
            y: [0, 15, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="container relative">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.div
            className="flex items-center justify-center gap-3 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Stars decoration */}
            {[...Array(5)].map((_, i) => (
              <motion.svg
                key={i}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="#F5A623"
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </motion.svg>
            ))}
          </motion.div>

          <motion.h2
            className="text-3xl md:text-4xl font-headline text-brown-dark mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            מה אומרים עלינו
          </motion.h2>

          <motion.p
            className="text-brown-light text-lg max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            לקוחות מרוצים מספרים על החוויה שלהם
          </motion.p>
        </div>

        {/* Featured Testimonial - Large card */}
        <div className="max-w-4xl mx-auto mb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              className="relative"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              <div
                className="relative bg-white rounded-3xl p-8 md:p-12 shadow-xl overflow-hidden"
                style={{
                  boxShadow: `0 25px 60px -15px ${testimonials[activeIndex].color}20`,
                }}
              >
                {/* Gradient accent */}
                <div
                  className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-30"
                  style={{ background: testimonials[activeIndex].color }}
                />

                {/* Quote icon */}
                <motion.div
                  className="absolute top-6 right-6 md:top-8 md:right-8"
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                >
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill={testimonials[activeIndex].color}
                    className="opacity-20"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </motion.div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Stars */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                      <motion.svg
                        key={i}
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill={testimonials[activeIndex].color}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 + i * 0.05 }}
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </motion.svg>
                    ))}
                  </div>

                  {/* Quote */}
                  <motion.p
                    className="text-xl md:text-2xl lg:text-3xl font-headline text-brown-dark leading-relaxed mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    "{testimonials[activeIndex].quote}"
                  </motion.p>

                  {/* Author */}
                  <motion.div
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {/* Avatar */}
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg"
                      style={{ backgroundColor: testimonials[activeIndex].color }}
                    >
                      {testimonials[activeIndex].name.charAt(0)}
                    </div>

                    <div>
                      <p className="font-bold text-lg text-brown-dark">
                        {testimonials[activeIndex].name}
                      </p>
                      <p className="text-brown-light text-sm">
                        {testimonials[activeIndex].role}
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Decorative line */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1"
                  style={{ backgroundColor: testimonials[activeIndex].color }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 5, ease: 'linear' }}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation dots */}
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
              <motion.div
                className="w-3 h-3 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: activeIndex === index ? testimonial.color : '#D4D4D4',
                }}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
              />
              {activeIndex === index && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: testimonial.color }}
                  layoutId="activeDot"
                  initial={false}
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Mini cards grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.button
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
              {/* Active indicator */}
              {activeIndex === index && (
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  style={{ border: `2px solid ${testimonial.color}` }}
                  layoutId="activeCard"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}

              <div className="relative z-10">
                {/* Mini avatar */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mb-2"
                  style={{ backgroundColor: testimonial.color }}
                >
                  {testimonial.name.charAt(0)}
                </div>

                {/* Name */}
                <p className="font-semibold text-sm text-brown-dark truncate">
                  {testimonial.name}
                </p>

                {/* Stars */}
                <div className="flex gap-0.5 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill={i < testimonial.rating ? testimonial.color : '#E5E5E5'}
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Trust badges */}
        <motion.div
          className="mt-16 pt-12 border-t border-cream-darker"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {/* Badge 1 */}
            <div className="flex items-center gap-3 text-brown-light">
              <div className="w-12 h-12 rounded-full bg-orange/10 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-brown-dark text-lg">100%</p>
                <p className="text-sm">לקוחות מרוצים</p>
              </div>
            </div>

            {/* Badge 2 */}
            <div className="flex items-center gap-3 text-brown-light">
              <div className="w-12 h-12 rounded-full bg-sage/20 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8BB4A0" strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-brown-dark text-lg">5.0</p>
                <p className="text-sm">דירוג ממוצע</p>
              </div>
            </div>

            {/* Badge 3 */}
            <div className="flex items-center gap-3 text-brown-light">
              <div className="w-12 h-12 rounded-full bg-terracotta/10 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E07B54" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-brown-dark text-lg">50+</p>
                <p className="text-sm">פרויקטים הושלמו</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
