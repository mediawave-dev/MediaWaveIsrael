import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

// Words to cycle through with typewriter effect
const typewriterWords = ['אתרים', 'דפי נחיתה', "צ'אטבוטים"]

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
        className="relative z-[2] container px-4 sm:px-6 pt-32 pb-12 md:pt-36 md:pb-32"
        style={{ opacity }}
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Headline */}
          <motion.h1
            className="text-8xl md:text-[11rem] lg:text-[14rem] font-headline leading-none mb-4 md:mb-8"
            style={{ textShadow: '0 3px 15px rgba(0,0,0,0.9)' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <span className="block text-white mb-2 md:mb-4">העסק שלכם</span>
            <span
              className="inline-block text-white"
              style={{ borderBottom: '3px solid #F5A623', paddingBottom: '8px' }}
            >
              הבמה שלנו
            </span>
          </motion.h1>

          {/* Typewriter Section */}
          <motion.div
            className="text-2xl md:text-4xl lg:text-5xl text-white mb-2 md:mb-4 min-h-[1.4em]"
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
            className="text-xl md:text-2xl lg:text-3xl text-white/80 mb-6 md:mb-10 max-w-2xl mx-auto px-6 md:px-0 leading-relaxed"
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
              className="group relative overflow-hidden bg-orange text-lg md:text-2xl font-semibold py-3 px-8 md:py-4 md:px-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 w-full md:w-auto text-center focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 focus-visible:ring-offset-black"
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
              href="#services"
              className="border-2 border-white hover:bg-white hover:text-brown-dark text-white text-lg md:text-2xl font-semibold py-3 px-8 md:py-4 md:px-10 rounded-full transition-all duration-300 w-full md:w-auto text-center focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              לשירותים שלנו
            </motion.a>
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
