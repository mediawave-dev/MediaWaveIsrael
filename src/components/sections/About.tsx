import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

// Values/Unique Points from CONTENT.md
const values = [
  { title: 'פיתוח מותאם אישית', icon: '✦' },
  { title: 'עיצוב מרשים', icon: '◈' },
  { title: 'תמיכה שוטפת', icon: '◇' },
]

export default function About() {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  // Parallax effects
  const illustrationY = useTransform(scrollYProgress, [0, 1], [60, -60])
  const textY = useTransform(scrollYProgress, [0, 1], [30, -30])
  const floatY1 = useTransform(scrollYProgress, [0, 1], [0, -100])
  const floatY2 = useTransform(scrollYProgress, [0, 1], [0, 80])
  const lineProgress = useTransform(scrollYProgress, [0.2, 0.7], [0, 1])

  return (
    <section
      ref={containerRef}
      id="about"
      className="relative py-24 md:py-32 bg-cream overflow-hidden"
    >
      {/* Background decorative elements with parallax */}
      <motion.div
        className="absolute top-20 left-[5%] w-64 h-64 pointer-events-none"
        style={{ y: floatY1 }}
      >
        <div className="w-full h-full rounded-full bg-orange/5 blur-3xl" />
      </motion.div>
      <motion.div
        className="absolute bottom-32 right-[10%] w-48 h-48 pointer-events-none"
        style={{ y: floatY2 }}
      >
        <div className="w-full h-full rounded-full bg-sage/8 blur-3xl" />
      </motion.div>

      <div className="container relative">
        {/* Asymmetric two-column layout (not 50/50) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Text Column - RIGHT side for RTL (spans 7 cols) */}
          <motion.div
            className="lg:col-span-7 lg:order-2 relative z-10"
            style={{ y: textY }}
          >
            {/* Badge */}
            <motion.span
              className="inline-flex items-center gap-2 bg-terracotta/10 text-terracotta text-sm font-semibold px-5 py-2.5 rounded-full mb-6"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="w-2 h-2 bg-terracotta rounded-full" />
              אודותינו
            </motion.span>

            {/* Title with decorative element */}
            <div className="relative mb-8">
              <motion.h2
                className="text-h2"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                הסיפור שלנו
              </motion.h2>

              {/* Hand-drawn decorative underline */}
              <motion.svg
                className="absolute -bottom-2 right-0 w-40 h-4"
                viewBox="0 0 160 12"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <motion.path
                  d="M2 8 Q40 2 80 6 T158 4"
                  fill="none"
                  stroke="var(--color-terracotta)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="opacity-50"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />
              </motion.svg>
            </div>

            {/* Main paragraph - from CONTENT.md */}
            <motion.p
              className="text-lg text-brown-light leading-relaxed mb-6 font-body"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              אנחנו מתמחים בבניית אתרים ודפי נחיתה שמשלבים עיצוב מרשים עם חוויית משתמש מעולה.
              כל פרויקט מותאם אישית לצרכי העסק ונבנה להציג את העסק שלכם בצורה הטובה ביותר.
            </motion.p>

            {/* Pull quote with special styling */}
            <motion.blockquote
              className="relative my-10 pr-6 border-r-4 border-orange/40"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <p className="text-xl font-headline text-brown-dark italic leading-relaxed">
                "יותר פניות, יותר מכירות, יותר הצלחה"
              </p>
              {/* Decorative quote mark */}
              <span className="absolute -top-4 -right-2 text-6xl text-orange/20 font-serif">״</span>
            </motion.blockquote>

            {/* Second paragraph */}
            <motion.p
              className="text-brown-light leading-relaxed mb-8 font-body"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              אנחנו מאמינים שכל עסק ראוי לנוכחות דיגיטלית מרשימה. עם גישה אישית וליווי צמוד,
              אנחנו מלווים אתכם מהרעיון הראשוני ועד להשקת האתר - ואחרי.
            </motion.p>

            {/* Values/Unique Points */}
            <motion.div
              className="flex flex-wrap gap-4 mt-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2.5 rounded-full shadow-sm border border-cream-darker/20"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.9)' }}
                >
                  <span className="text-orange">{value.icon}</span>
                  <span className="text-sm font-semibold text-brown-dark">{value.title}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Illustration Column - LEFT side for RTL (spans 5 cols) */}
          <motion.div
            className="lg:col-span-5 lg:order-1 relative"
            style={{ y: illustrationY }}
          >
            {/* Creative overlap - illustration extends beyond its grid */}
            <div className="relative lg:-mr-12">
              <WatercolorIllustration />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Connecting curved line to next section - hidden on mobile */}
      <svg
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none overflow-visible hidden md:block"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M0,60 Q480,10 720,60 T1440,30"
          fill="none"
          stroke="var(--color-terracotta)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="8 12"
          className="opacity-30"
          style={{ pathLength: lineProgress }}
        />
      </svg>

      {/* Floating decorative shapes */}
      <motion.div
        className="absolute top-1/4 right-[8%] w-3 h-3 rounded-full bg-orange/30 hidden lg:block"
        animate={{ y: [0, -15, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/3 left-[12%] w-2 h-2 rounded-full bg-terracotta/40 hidden lg:block"
        animate={{ y: [0, 12, 0], x: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      <motion.div
        className="absolute top-1/2 left-[25%] w-4 h-4 rounded-full bg-sage/25 hidden lg:block"
        animate={{ rotate: [0, 180, 360], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
    </section>
  )
}

// Watercolor-style SVG Illustration - abstract shapes representing creativity/media
function WatercolorIllustration() {
  return (
    <motion.div
      className="relative w-full aspect-square max-w-md mx-auto lg:mx-0"
      initial={{ opacity: 0, x: -60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full"
        fill="none"
      >
        {/* Filters for watercolor effect */}
        <defs>
          <filter id="watercolor1" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
          </filter>
          <filter id="watercolor2" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
          </filter>
          <filter id="grain" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise" />
            <feComposite in="SourceGraphic" in2="noise" operator="in" />
          </filter>

          {/* Gradients */}
          <radialGradient id="orangeGrad" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#F5A623" stopOpacity="0.6" />
            <stop offset="70%" stopColor="#F5A623" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#F5A623" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="terracottaGrad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#E07B54" stopOpacity="0.5" />
            <stop offset="80%" stopColor="#E07B54" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#E07B54" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sageGrad" cx="60%" cy="60%" r="50%">
            <stop offset="0%" stopColor="#8BB4A0" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#8BB4A0" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#8BB4A0" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="coralGrad" cx="40%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#F28B82" stopOpacity="0.4" />
            <stop offset="75%" stopColor="#F28B82" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#F28B82" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Large background blob - orange */}
        <motion.ellipse
          cx="180"
          cy="160"
          rx="140"
          ry="120"
          fill="url(#orangeGrad)"
          filter="url(#watercolor2)"
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          animate={{
            rx: [140, 145, 140],
            ry: [120, 125, 120],
          }}
          transition={{
            default: { duration: 1.2, delay: 0.2 },
            rx: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
            ry: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
          }}
        />

        {/* Middle blob - terracotta */}
        <motion.path
          d="M280,200 C320,160 340,220 300,280 C260,340 180,320 160,260 C140,200 200,160 240,180 C260,190 260,220 280,200"
          fill="url(#terracottaGrad)"
          filter="url(#watercolor1)"
          initial={{ scale: 0.7, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
        />

        {/* Top blob - sage */}
        <motion.circle
          cx="300"
          cy="100"
          r="60"
          fill="url(#sageGrad)"
          filter="url(#watercolor2)"
          initial={{ scale: 0.6, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          animate={{
            cy: [100, 110, 100],
            r: [60, 65, 60],
          }}
          transition={{
            default: { duration: 1, delay: 0.6 },
            cy: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
            r: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
          }}
        />

        {/* Small accent blob - coral */}
        <motion.ellipse
          cx="120"
          cy="300"
          rx="50"
          ry="40"
          fill="url(#coralGrad)"
          filter="url(#watercolor1)"
          initial={{ scale: 0.5, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          animate={{
            cx: [120, 130, 120],
            rx: [50, 55, 50],
          }}
          transition={{
            default: { duration: 0.8, delay: 0.8 },
            cx: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
            rx: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
          }}
        />

        {/* Hand-drawn style curved lines */}
        <motion.path
          d="M80,180 Q120,140 180,160 T280,140"
          stroke="var(--color-brown)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          className="opacity-20"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 1 }}
        />
        <motion.path
          d="M100,280 Q160,240 220,260 T320,220"
          stroke="var(--color-terracotta)"
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="4 6"
          fill="none"
          className="opacity-30"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 1.2 }}
        />

        {/* Small decorative dots */}
        {[
          { cx: 150, cy: 120, r: 4 },
          { cx: 320, cy: 180, r: 3 },
          { cx: 200, cy: 320, r: 5 },
          { cx: 90, cy: 220, r: 3 },
          { cx: 340, cy: 280, r: 4 },
        ].map((dot, i) => (
          <motion.circle
            key={i}
            cx={dot.cx}
            cy={dot.cy}
            r={dot.r}
            fill="var(--color-orange)"
            className="opacity-40"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 0.4 }}
            viewport={{ once: true }}
            animate={{
              y: [0, -5, 0],
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{
              default: { delay: 1.4 + i * 0.1, duration: 0.4 },
              y: { duration: 3 + i, repeat: Infinity, ease: 'easeInOut' },
              opacity: { duration: 3 + i, repeat: Infinity, ease: 'easeInOut' },
            }}
          />
        ))}

        {/* Abstract geometric accent */}
        <motion.rect
          x="260"
          y="240"
          width="30"
          height="30"
          rx="4"
          fill="none"
          stroke="var(--color-sage)"
          strokeWidth="1.5"
          className="opacity-30"
          initial={{ rotate: 0, scale: 0 }}
          whileInView={{ rotate: 15, scale: 1 }}
          viewport={{ once: true }}
          animate={{ rotate: [15, 20, 15] }}
          transition={{
            default: { delay: 1.5, duration: 0.6 },
            rotate: { duration: 10, repeat: Infinity, ease: 'easeInOut' },
          }}
        />
      </svg>

      {/* Floating elements around the illustration */}
      <motion.div
        className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-orange/10 blur-lg"
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-8 -left-8 w-16 h-16 rounded-full bg-terracotta/10 blur-xl"
        animate={{ scale: [1, 1.2, 1], y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
    </motion.div>
  )
}
