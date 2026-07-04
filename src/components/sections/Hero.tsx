import { useState, useEffect, useRef } from 'react'
import { m, useScroll, useTransform } from 'framer-motion'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { WaveDivider } from '../ui/WaveDivider'
import { StaggeredWords } from '../ui/StaggeredWords'
import { LoadTimeBadge } from '../ui/LoadTimeBadge'
import { MagneticButton } from '../ui/MagneticButton'
import { EASE_BRAND } from '../../config/motion'

/** Signature wave underline — draws on from the RIGHT (RTL) instead of the
    old static border-bottom */
function WaveUnderline({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
  return (
    <svg
      className="absolute inset-x-0 -bottom-1 md:-bottom-2 w-full"
      height="16"
      viewBox="0 0 300 16"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ overflow: 'visible', height: '0.14em', minHeight: 10 }}
    >
      <m.path
        d="M298,11 C285,14 260,5 225,9 C180,14 150,4 110,9 C70,14 40,3 2,8"
        fill="none"
        stroke="#7DD3FC"
        strokeWidth="4"
        strokeLinecap="round"
        initial={prefersReducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 1.1, delay: 0.75, ease: EASE_BRAND }}
      />
    </svg>
  )
}

// Words to cycle through with typewriter effect
const typewriterWords = ['אתרים', 'דפי נחיתה', "צ'אטבוטים"]

export default function Hero() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  // Detect reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Mount the background video only on desktop, and only once the browser is
  // idle — the poster (identical first frame) covers the gap. Mobile never
  // downloads the 2.8MB video (display:none alone does NOT prevent the fetch).
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [videoReady, setVideoReady] = useState(false)

  useEffect(() => {
    if (!isDesktop) return
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => setVideoReady(true), { timeout: 1500 })
      return () => window.cancelIdleCallback(id)
    }
    const timer = setTimeout(() => setVideoReady(true), 300)
    return () => clearTimeout(timer)
  }, [isDesktop])

  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  // Typewriter effect - disabled when reduced motion is preferred
  useEffect(() => {
    // If reduced motion is preferred, show full first word without animation
    if (prefersReducedMotion) {
      setDisplayText(typewriterWords[0])
      return
    }

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
  }, [displayText, isDeleting, currentWordIndex, prefersReducedMotion])

  return (
    <section
      ref={containerRef}
      id="hero"
      aria-label="ראשי"
      className="relative min-h-screen-dvh flex items-center justify-center overflow-hidden"
    >
      {/* ===== LAYER 1: Video Background (z-0) ===== */}

      {/* Poster image — instant LCP on all devices, stays as the desktop
          backdrop until the video mounts (identical first frame, no flash) */}
      <img
        src="/images/hero-poster.webp"
        alt=""
        width="750"
        height="1334"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
      />

      {/* Desktop: video background, mounted after idle */}
      {isDesktop && videoReady && !prefersReducedMotion && (
        <video
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          poster="/images/hero-poster.webp"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 0 }}
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
      )}

      {/* ===== LAYER 2: Gradient Overlay (z-[1]) ===== */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.75) 45%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      {/* ===== LAYER 3: Content (z-[2]) ===== */}
      <m.div
        className="relative z-[2] container px-4 sm:px-6 pt-40 pb-12 md:pt-48 md:pb-32"
        style={{ opacity }}
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Headline — kinetic word-by-word reveal (DESIGN-UPGRADE §4.1).
              Split by WORDS only; splitting Hebrew letters breaks glyphs. */}
          <h1
            className="text-[2.4rem] sm:text-[3.4rem] md:text-[5.5rem] lg:text-[6.5rem] font-body leading-none mb-4 md:mb-8"
            style={{ textShadow: '0 3px 15px rgba(0,0,0,0.9)' }}
          >
            <StaggeredWords
              text="העסק שלכם"
              delay={0.1}
              className="block text-white mb-2 md:mb-4"
            />
            <span className="relative inline-block text-white pb-2">
              <StaggeredWords text="המומחיות שלנו" delay={0.3} />
              <WaveUnderline prefersReducedMotion={prefersReducedMotion} />
            </span>
          </h1>

          {/* Typewriter Section */}
          <m.div
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
          </m.div>

          {/* Subtitle */}
          <m.p
            className="hidden md:block text-xl md:text-2xl lg:text-3xl text-white/80 mb-6 md:mb-10 max-w-2xl mx-auto px-6 md:px-0 leading-relaxed"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}
            initial={{ opacity: 0, transform: 'translateY(20px)' }}
            animate={{ opacity: 1, transform: 'translateY(0px)' }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            עיצוב ופיתוח אתרים מקצועיים לעסקים קטנים ובינוניים.
            <br className="hidden md:block" />
            <span className="md:hidden"> </span>
            עם גישה אישית וליווי צמוד בכל שלב.
          </m.p>

          {/* CTA Buttons */}
          <m.div
            className="flex flex-col md:flex-row gap-3 md:gap-5 justify-center mb-8 md:mb-16 px-2 md:px-0"
            initial={{ opacity: 0, transform: 'translateY(20px)' }}
            animate={{ opacity: 1, transform: 'translateY(0px)' }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <MagneticButton className="w-full md:w-auto">
            <m.a
              href="#contact"
              className="group relative block overflow-hidden bg-orange hover:bg-orange-dark text-base md:text-2xl font-semibold py-3 px-8 md:py-4 md:px-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 w-full md:w-auto text-center focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              style={{ color: '#1e3a5f' }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Shine effect */}
              <m.span
                className="absolute inset-0 bg-gradient-to-l from-transparent via-white/30 to-transparent -translate-x-full"
                animate={prefersReducedMotion ? undefined : { x: ['calc(-100%)', 'calc(200%)'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              />
              <span className="relative z-10 flex items-center justify-center gap-2">
                בואו נדבר על הפרויקט שלכם
                <m.span
                  animate={prefersReducedMotion ? undefined : { x: [0, -4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ←
                </m.span>
              </span>
            </m.a>
            </MagneticButton>

            <m.a
              href="#services"
              className="border-2 border-white hover:bg-white hover:text-brown-dark text-white text-base md:text-2xl font-semibold py-3 px-8 md:py-4 md:px-10 rounded-full transition-all duration-300 w-full md:w-auto text-center focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              לשירותים שלנו
            </m.a>
          </m.div>

          {/* The un-fakeable proof: this visit's real LCP (DESIGN-UPGRADE §5.1) */}
          <LoadTimeBadge className="-mt-4 mb-6 md:mb-0" />


        </div>
      </m.div>

      {/* Signature wave hand-off into the next section (drift layer = depth) */}
      <WaveDivider
        variant="a"
        fill="#F8FAFC"
        drift
        className="absolute bottom-0 inset-x-0 z-[2]"
      />
    </section>
  )
}
