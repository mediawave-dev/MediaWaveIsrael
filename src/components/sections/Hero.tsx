import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

// Words to cycle through with typewriter effect
const typewriterWords = ['אתרים', 'דפי נחיתה', 'חנויות', 'תדמית']

export default function Hero() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  // Typewriter effect
  useEffect(() => {
    const currentWord = typewriterWords[currentWordIndex]
    const typeSpeed = isDeleting ? 80 : 120
    const pauseTime = 2000

    if (!isDeleting && displayText === currentWord) {
      const timeout = setTimeout(() => setIsDeleting(true), pauseTime)
      return () => clearTimeout(timeout)
    }

    if (isDeleting && displayText === '') {
      setIsDeleting(false)
      setCurrentWordIndex((prev) => (prev + 1) % typewriterWords.length)
      return
    }

    const timeout = setTimeout(() => {
      if (isDeleting) {
        setDisplayText(currentWord.substring(0, displayText.length - 1))
      } else {
        setDisplayText(currentWord.substring(0, displayText.length + 1))
      }
    }, typeSpeed)

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, currentWordIndex])

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* ===== LAYER 1: Video Background (z-0) ===== */}

      {/* Mobile: poster image as background */}
      <div
        className="absolute inset-0 md:hidden bg-cover bg-center"
        style={{
          backgroundImage: 'url(/images/hero-poster.jpg)',
          zIndex: 0,
        }}
      />

      {/* Desktop: video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        poster="/images/hero-poster.jpg"
        className="absolute inset-0 w-full h-full object-cover hidden md:block"
        style={{ zIndex: 0 }}
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* ===== LAYER 2: Gradient Overlay (z-[1]) ===== */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.75) 45%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      {/* ===== LAYER 3: Content (z-[2]) ===== */}
      <motion.div
        className="relative z-[2] container px-4 sm:px-6 pt-20 pb-12 md:pt-32 md:pb-32"
        style={{ opacity }}
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.span
            className="inline-flex items-center gap-2 bg-white/10 text-white text-xs md:text-sm font-semibold px-3 py-1 md:px-5 md:py-2 rounded-full mb-4 md:mb-8 backdrop-blur-sm border border-white/20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="w-2 h-2 bg-orange rounded-full animate-pulse" />
            פיתוח אתרים מקצועי
          </motion.span>

          {/* Main Headline */}
          <motion.h1
            className="text-3xl md:text-5xl lg:text-6xl font-headline leading-tight mb-3 md:mb-6"
            style={{ textShadow: '0 3px 15px rgba(0,0,0,0.9)' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <span className="block text-white">העסק שלכם —</span>
            <span
              className="inline-block text-white"
              style={{ borderBottom: '3px solid #F5A623', paddingBottom: '8px' }}
            >
              הבמה שלנו
            </span>
          </motion.h1>

          {/* Typewriter Section */}
          <motion.div
            className="text-lg md:text-2xl lg:text-3xl text-white mb-2 md:mb-4 min-h-[1.4em]"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <span>בניית </span>
            <span className="text-orange font-bold">
              {displayText}
              <span className="animate-pulse">|</span>
            </span>
            <span> מקצועיים</span>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            className="text-sm md:text-lg lg:text-xl text-white/80 mb-6 md:mb-10 max-w-2xl mx-auto px-6 md:px-0 leading-relaxed"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            עיצוב ופיתוח אתרים מקצועיים לעסקים קטנים ובינוניים.
            <br className="hidden md:block" />
            <span className="md:hidden"> </span>
            עם גישה אישית וליווי צמוד בכל שלב.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col md:flex-row gap-3 md:gap-5 justify-center mb-8 md:mb-16 px-2 md:px-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <motion.a
              href="#contact"
              className="group relative overflow-hidden bg-orange text-sm md:text-lg font-semibold py-3 px-6 md:py-4 md:px-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 w-full md:w-auto text-center focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              style={{ color: '#FFFFFF' }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Shine effect */}
              <motion.span
                className="absolute inset-0 bg-gradient-to-l from-transparent via-white/30 to-transparent -translate-x-full"
                animate={{ x: ['calc(-100%)', 'calc(200%)'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              />
              <span className="relative z-10 flex items-center justify-center gap-2">
                בואו נדבר על הפרויקט שלכם
                <motion.span
                  animate={{ x: [0, -4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ←
                </motion.span>
              </span>
            </motion.a>

            <motion.a
              href="#portfolio"
              className="border-2 border-white hover:bg-white hover:text-brown-dark text-white text-sm md:text-lg font-semibold py-3 px-6 md:py-4 md:px-10 rounded-full transition-all duration-300 w-full md:w-auto text-center focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              לפרויקטים שלנו
            </motion.a>
          </motion.div>

          {/* Social Proof / Stats */}
          <motion.div
            className="grid grid-cols-3 gap-4 md:gap-12 justify-center pt-4 md:pt-8 pb-8 md:pb-0 border-t border-white/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {[
              { value: '50+', label: 'פרויקטים הושלמו' },
              { value: '100%', label: 'לקוחות מרוצים' },
              { value: '24h', label: 'זמן תגובה' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="flex flex-col items-center gap-1 md:gap-2 text-center"
                style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.1 }}
              >
                <span className="text-2xl md:text-4xl font-headline text-orange">{stat.value}</span>
                <span className="text-[10px] md:text-base text-white/80">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-[2]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <span className="text-xs text-white/60">גלול למטה</span>
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div
            className="w-1.5 h-1.5 bg-orange rounded-full"
            animate={{ y: [0, 12, 0], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
