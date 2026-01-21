import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  // Parallax transforms
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 150])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Complex layered background */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-hero" />

        {/* Grain texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Floating watercolor blobs - parallax layers, smaller on mobile */}
      <motion.div
        className="absolute top-[10%] right-[5%] w-[250px] h-[250px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] pointer-events-none"
        style={{ y: y1 }}
      >
        <WatercolorBlob1 />
      </motion.div>

      <motion.div
        className="absolute bottom-[15%] left-[10%] w-[200px] h-[200px] md:w-[300px] md:h-[300px] lg:w-[400px] lg:h-[400px] pointer-events-none"
        style={{ y: y2 }}
      >
        <WatercolorBlob2 />
      </motion.div>

      <motion.div
        className="absolute top-[30%] left-[20%] w-[150px] h-[150px] md:w-[200px] md:h-[200px] lg:w-[300px] lg:h-[300px] pointer-events-none opacity-50 hidden sm:block"
        style={{ y: y1 }}
      >
        <WatercolorBlob3 />
      </motion.div>

      {/* Floating decorative shapes */}
      <FloatingElements />

      {/* Main content */}
      <motion.div
        className="container relative z-10 pt-24 pb-32"
        style={{ opacity, scale }}
      >
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <motion.span
            className="inline-flex items-center gap-2 bg-orange/10 text-orange text-sm font-semibold px-5 py-2.5 rounded-full mb-8 backdrop-blur-sm border border-orange/20 mx-auto"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="w-2 h-2 bg-orange rounded-full animate-pulse" />
            פיתוח אתרים מקצועי
          </motion.span>

          {/* Main Headline */}
          <motion.h1
            className="text-hero leading-tight mb-6"
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              type: 'spring',
              damping: 20,
              stiffness: 90,
              delay: 0.1,
            }}
          >
            <span className="block">העסק שלכם -</span>
            <span className="relative inline-block">
              <span className="text-orange">הבמה שלנו</span>
              {/* Decorative underline */}
              <motion.svg
                className="absolute -bottom-2 right-0 w-full h-4"
                viewBox="0 0 200 12"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8, ease: 'easeOut' }}
              >
                <motion.path
                  d="M2 8 Q50 2 100 6 T198 4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="text-orange/40"
                />
              </motion.svg>
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.h2
            className="text-3xl md:text-4xl font-headline text-brown mb-4"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              type: 'spring',
              damping: 20,
              stiffness: 90,
              delay: 0.2,
            }}
          >
            בניית אתרים ודפי נחיתה
          </motion.h2>

          {/* Description */}
          <motion.p
            className="text-xl md:text-2xl font-headline text-brown-light mb-10 max-w-xl mx-auto leading-relaxed"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.3,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            עיצוב ופיתוח אתרים מקצועיים לעסקים קטנים ובינוניים
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-wrap gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: 'spring',
              damping: 15,
              stiffness: 100,
              delay: 0.4,
            }}
          >
            {/* Primary CTA with Magnetic Hover Effect */}
            <MagneticButton href="#contact">
              בואו נדבר על הפרויקט שלכם
            </MagneticButton>

            <motion.a
              href="#portfolio"
              className="group relative bg-white/50 backdrop-blur-sm border-2 border-cream-darker hover:border-orange text-brown hover:text-orange font-semibold py-4 px-8 rounded-full transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative flex items-center gap-2">
                לפרויקטים נבחרים
                <motion.svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ x: [0, -4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5M12 5l-7 7 7 7" />
                </motion.svg>
              </span>
            </motion.a>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            className="flex flex-wrap gap-8 mt-16 pt-8 border-t border-cream-darker/50 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            {[
              { value: '50+', label: 'פרויקטים הושלמו' },
              { value: '100%', label: 'לקוחות מרוצים' },
              { value: '24h', label: 'זמן תגובה' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="flex items-center gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.1 }}
              >
                <span className="text-2xl font-headline text-orange">{stat.value}</span>
                <span className="text-sm text-brown-light">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Curved line to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none">
        <svg
          className="absolute bottom-0 w-full h-full"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,80 1440,60 L1440,120 L0,120 Z"
            fill="var(--color-cream-dark)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          />
        </svg>

        {/* Decorative flowing line - hidden on mobile */}
        <svg
          className="absolute bottom-20 w-full h-20 overflow-visible hidden md:block"
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0,30 Q360,60 720,30 T1440,30"
            fill="none"
            stroke="var(--color-orange)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="8 8"
            className="opacity-30"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1, duration: 1.5, ease: 'easeOut' }}
          />
        </svg>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <span className="text-xs text-brown-muted">גלול למטה</span>
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-brown-muted/30 flex justify-center pt-2"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <motion.div
            className="w-1.5 h-1.5 bg-orange rounded-full"
            animate={{ y: [0, 12, 0], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

// Watercolor blob SVG components
function WatercolorBlob1() {
  return (
    <motion.svg
      viewBox="0 0 200 200"
      className="w-full h-full"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 0.6 }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
    >
      <defs>
        <filter id="blur1" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
        </filter>
        <radialGradient id="grad1" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#F5A623" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#F5A623" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#F5A623" stopOpacity="0" />
        </radialGradient>
      </defs>
      <motion.path
        d="M100,20 C140,25 170,50 175,90 C180,130 160,165 120,175 C80,185 40,170 25,130 C10,90 30,50 60,30 C75,22 85,18 100,20"
        fill="url(#grad1)"
        filter="url(#blur1)"
        animate={{
          d: [
            "M100,20 C140,25 170,50 175,90 C180,130 160,165 120,175 C80,185 40,170 25,130 C10,90 30,50 60,30 C75,22 85,18 100,20",
            "M105,25 C145,30 165,55 170,95 C175,135 155,170 115,178 C75,186 45,165 30,125 C15,85 35,45 65,28 C80,20 90,22 105,25",
            "M100,20 C140,25 170,50 175,90 C180,130 160,165 120,175 C80,185 40,170 25,130 C10,90 30,50 60,30 C75,22 85,18 100,20",
          ],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.svg>
  )
}

function WatercolorBlob2() {
  return (
    <motion.svg
      viewBox="0 0 200 200"
      className="w-full h-full"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 0.5 }}
      transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
    >
      <defs>
        <filter id="blur2" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
        </filter>
        <radialGradient id="grad2" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#E07B54" stopOpacity="0.35" />
          <stop offset="60%" stopColor="#E07B54" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#E07B54" stopOpacity="0" />
        </radialGradient>
      </defs>
      <motion.ellipse
        cx="100"
        cy="100"
        rx="80"
        ry="70"
        fill="url(#grad2)"
        filter="url(#blur2)"
        animate={{
          rx: [80, 85, 80],
          ry: [70, 75, 70],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.svg>
  )
}

function WatercolorBlob3() {
  return (
    <motion.svg
      viewBox="0 0 200 200"
      className="w-full h-full"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 0.4 }}
      transition={{ duration: 1.5, delay: 0.6, ease: 'easeOut' }}
    >
      <defs>
        <filter id="blur3" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="12" />
        </filter>
        <radialGradient id="grad3" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8BB4A0" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#8BB4A0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="70" fill="url(#grad3)" filter="url(#blur3)" />
    </motion.svg>
  )
}

function FloatingElements() {
  const elements = [
    { size: 8, top: '20%', right: '15%', delay: 0 },
    { size: 6, top: '40%', right: '80%', delay: 0.5 },
    { size: 10, top: '60%', right: '25%', delay: 1 },
    { size: 5, top: '75%', right: '70%', delay: 1.5 },
    { size: 7, top: '30%', right: '60%', delay: 2 },
  ]

  return (
    <>
      {elements.map((el, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{ top: el.top, right: el.right }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.6, scale: 1 }}
          transition={{ delay: 1 + el.delay * 0.2, duration: 0.5 }}
        >
          <motion.div
            className="rounded-full bg-orange/20"
            style={{ width: el.size, height: el.size }}
            animate={{
              y: [0, -15, 0],
              x: [0, 5, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: el.delay,
            }}
          />
        </motion.div>
      ))}
    </>
  )
}

// Magnetic Button Component - follows cursor on hover
function MagneticButton({ href, children }: { href: string; children: React.ReactNode }) {
  const buttonRef = useRef<HTMLAnchorElement>(null)

  // Motion values for the magnetic effect
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Spring physics for smooth following
  const springConfig = { damping: 15, stiffness: 150 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return

    const rect = buttonRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Calculate distance from center (magnetic pull strength)
    const distanceX = e.clientX - centerX
    const distanceY = e.clientY - centerY

    // Apply magnetic effect (button follows cursor slightly)
    x.set(distanceX * 0.3)
    y.set(distanceY * 0.3)
  }

  const handleMouseLeave = () => {
    // Snap back to center
    x.set(0)
    y.set(0)
  }

  return (
    <motion.a
      ref={buttonRef}
      href={href}
      className="group relative overflow-hidden bg-orange font-semibold py-4 px-8 rounded-full shadow-md"
      style={{ x: xSpring, y: ySpring, color: '#2A2A2A' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.95 }}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-orange via-orange-light to-orange"
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{ backgroundSize: '200% 200%' }}
      />

      {/* Shine effect on hover */}
      <span className="absolute inset-0 bg-gradient-to-l from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          boxShadow: '0 0 30px rgba(245, 166, 35, 0.5), 0 0 60px rgba(245, 166, 35, 0.3)',
        }}
      />

      {/* Text with slight scale on hover */}
      <motion.span
        className="relative z-10 flex items-center gap-2"
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 400 }}
      >
        {children}
        <motion.span
          animate={{ x: [0, -5, 0] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
        >
          ←
        </motion.span>
      </motion.span>
    </motion.a>
  )
}
