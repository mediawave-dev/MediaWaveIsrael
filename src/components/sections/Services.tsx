import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

// Service data - all 6 original services
const services = [
  {
    id: 'websites',
    number: '01',
    title: 'פיתוח אתרים מותאמים אישית',
    subtitle: 'פיתוח מקצועי',
    description: 'אתרים מקצועיים הבנויים בטכנולוגיות מתקדמות, מותאמים לצרכים הייחודיים של העסק שלך.',
    color: '#F5A623',
    preview: 'browser',
  },
  {
    id: 'landing',
    number: '02',
    title: 'עיצוב דפי נחיתה',
    subtitle: 'המרות גבוהות',
    description: 'דפי נחיתה שמניעים לפעולה ומגדילים את אחוזי ההמרה עם עיצוב ממוקד מטרה.',
    color: '#E07B54',
    preview: 'conversion',
  },
  {
    id: 'branding',
    number: '03',
    title: 'אתרי תדמית לעסקים',
    subtitle: 'עיצוב ייחודי',
    description: 'אתרים שמשקפים את המקצועיות והערכים של העסק ובונים אמון מול הלקוחות.',
    color: '#8BB4A0',
    preview: 'brand',
  },
  {
    id: 'mobile',
    number: '04',
    title: 'אופטימיזציה למובייל',
    subtitle: 'חווית משתמש',
    description: 'חוויית גלישה מושלמת בכל מכשיר - מחשב, טאבלט וסמארטפון.',
    color: '#F28B82',
    preview: 'mobile',
  },
  {
    id: 'support',
    number: '05',
    title: 'ליווי ותמיכה שוטפת',
    subtitle: 'תמיכה מקצועית',
    description: 'תמיכה מקצועית ועדכונים שוטפים לאחר ההשקה להבטחת הצלחה מתמשכת.',
    color: '#9B8AC4',
    preview: 'support',
  },
  {
    id: 'seo',
    number: '06',
    title: 'קידום אורגני (SEO)',
    subtitle: 'נראות בגוגל',
    description: 'אופטימיזציה למנועי חיפוש כדי להגדיל את החשיפה והתנועה האורגנית לאתר שלך.',
    color: '#5BA4A4',
    preview: 'seo',
  },
]

export default function Services() {
  return (
    <section
      id="services"
      className="relative py-16 md:py-24 bg-cream overflow-hidden"
    >
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(245,166,35,0.08) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 45, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(224,123,84,0.06) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, -30, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="container relative">
        {/* Header - Editorial style with large typography */}
        <div className="mb-12 md:mb-16">
          <motion.div
            className="flex items-center gap-4 mb-6"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="h-px w-12 bg-orange" />
            <span className="text-orange text-sm font-semibold tracking-widest uppercase">
              השירותים שלנו
            </span>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 items-end">
            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-headline leading-tight"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <span className="text-brown-dark">אנחנו בונים</span>
              <br />
              <span className="text-orange">חוויות דיגיטליות</span>
            </motion.h2>

            <motion.p
              className="text-lg md:text-xl text-brown-light leading-relaxed max-w-md lg:pb-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              מהרעיון הראשוני ועד להשקה - אנחנו מלווים אתכם בכל שלב עם גישה אישית ותשומת לב לפרטים.
            </motion.p>
          </div>
        </div>

        {/* Services Grid - Balanced 3-column layout */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-12 md:mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-brown-light mb-6 text-lg">רוצים לדעת עוד?</p>
          <motion.a
            href="#contact"
            className="inline-flex items-center gap-3 bg-orange font-semibold py-4 px-8 rounded-full shadow-lg hover:shadow-glow transition-all duration-300"
            style={{ color: '#FFFFFF' }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>בואו נדבר</span>
            <motion.span
              animate={{ x: [0, -4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ←
            </motion.span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

// Interactive 3D Tilt Card Component
function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Mouse position for 3D tilt effect
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth spring animation for tilt
  const rotateX = useSpring(useMotionValue(0), { stiffness: 150, damping: 20 })
  const rotateY = useSpring(useMotionValue(0), { stiffness: 150, damping: 20 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const x = e.clientX - centerX
    const y = e.clientY - centerY

    mouseX.set(x)
    mouseY.set(y)

    // Tilt effect (inverted for natural feel)
    rotateX.set((-y / rect.height) * 10)
    rotateY.set((x / rect.width) * 10)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.7, delay: index * 0.15 }}
    >
      {/* Number indicator - smaller for grid layout */}
      <motion.span
        className="absolute -right-2 -top-4 text-[80px] md:text-[100px] font-headline leading-none select-none pointer-events-none z-0"
        style={{ color: service.color, opacity: 0.1 }}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 + 0.1 }}
      >
        {service.number}
      </motion.span>

      <motion.div
        ref={cardRef}
        className="relative z-10 h-full group cursor-pointer"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          perspective: 1000,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="relative h-full bg-white rounded-2xl p-6 overflow-hidden transition-all duration-500 flex flex-col"
          style={{
            boxShadow: isHovered
              ? `0 20px 40px -12px ${service.color}25, 0 0 0 1px ${service.color}20`
              : '0 4px 16px rgba(74, 74, 74, 0.06), 0 0 0 1px rgba(74, 74, 74, 0.04)',
          }}
        >
          {/* Gradient overlay on hover */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `linear-gradient(135deg, ${service.color}08 0%, transparent 50%)`,
            }}
          />

          {/* Content - Vertical stack layout */}
          <div className="relative z-10 flex flex-col gap-5">
            {/* Visual preview at top */}
            <div className="w-full h-32">
              <ServicePreview type={service.preview} color={service.color} isHovered={isHovered} />
            </div>

            {/* Subtitle badge */}
            <motion.span
              className="inline-block self-start text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full"
              style={{
                color: service.color,
                backgroundColor: `${service.color}15`,
              }}
            >
              {service.subtitle}
            </motion.span>

            {/* Title */}
            <h3 className="text-xl md:text-2xl font-bold text-brown-dark group-hover:text-brown transition-colors leading-tight">
              {service.title}
            </h3>

            {/* Description */}
            <p className="text-brown-light text-sm leading-relaxed">
              {service.description}
            </p>

            {/* Learn more link */}
            <motion.span
              className="inline-flex items-center gap-2 text-sm font-semibold transition-colors mt-auto pt-2"
              style={{ color: service.color }}
            >
              <span>למידע נוסף</span>
              <motion.svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="rotate-180"
                animate={{ x: isHovered ? -4 : 0 }}
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </motion.svg>
            </motion.span>
          </div>

          {/* Decorative corner accent - smaller */}
          <motion.div
            className="absolute top-0 left-0 w-16 h-16 pointer-events-none"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <motion.path
                d="M0 0 L0 100 L100 100"
                fill="none"
                stroke={service.color}
                strokeWidth="2"
                strokeLinecap="round"
                className="opacity-15"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
              />
            </svg>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Visual Preview Components
function ServicePreview({ type, color, isHovered }: { type: string; color: string; isHovered: boolean }) {
  switch (type) {
    case 'browser':
      return <BrowserPreview color={color} isHovered={isHovered} />
    case 'conversion':
      return <ConversionPreview color={color} isHovered={isHovered} />
    case 'brand':
      return <BrandPreview color={color} isHovered={isHovered} />
    case 'mobile':
      return <MobilePreview color={color} isHovered={isHovered} />
    case 'support':
      return <SupportPreview color={color} isHovered={isHovered} />
    case 'seo':
      return <SeoPreview color={color} isHovered={isHovered} />
    default:
      return null
  }
}

// Mini browser window preview
function BrowserPreview({ color, isHovered }: { color: string; isHovered: boolean }) {
  return (
    <motion.div
      className="relative bg-cream-dark rounded-xl overflow-hidden shadow-lg"
      animate={{ y: isHovered ? -4 : 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Browser chrome */}
      <div className="bg-cream-darker px-3 py-2 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-coral/60" />
        <span className="w-2 h-2 rounded-full bg-orange/60" />
        <span className="w-2 h-2 rounded-full bg-sage/60" />
        <div className="flex-1 bg-cream rounded h-3 mx-2" />
      </div>

      {/* Content area */}
      <div className="p-3 space-y-2">
        {/* Header skeleton */}
        <div className="flex items-center gap-2">
          <motion.div
            className="w-8 h-8 rounded-lg"
            style={{ backgroundColor: color }}
            animate={{ scale: isHovered ? [1, 1.1, 1] : 1 }}
            transition={{ duration: 0.5 }}
          />
          <div className="space-y-1 flex-1">
            <div className="h-2 bg-brown/20 rounded w-20" />
            <div className="h-1.5 bg-brown/10 rounded w-14" />
          </div>
        </div>

        {/* Hero skeleton */}
        <motion.div
          className="h-16 rounded-lg overflow-hidden relative"
          style={{ backgroundColor: `${color}20` }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(90deg, transparent, ${color}30, transparent)`,
            }}
            animate={{ x: isHovered ? ['calc(-100%)', 'calc(100%)'] : 'calc(-100%)' }}
            transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0, ease: 'easeInOut' }}
          />
        </motion.div>

        {/* Content skeleton */}
        <div className="space-y-1.5">
          <div className="h-1.5 bg-brown/10 rounded w-full" />
          <div className="h-1.5 bg-brown/10 rounded w-4/5" />
          <div className="h-1.5 bg-brown/10 rounded w-3/5" />
        </div>
      </div>
    </motion.div>
  )
}

// Conversion metrics preview
function ConversionPreview({ color, isHovered }: { color: string; isHovered: boolean }) {
  return (
    <div className="bg-cream-dark rounded-xl p-4 space-y-3">
      {/* Chart bars */}
      <div className="flex items-end gap-1.5 h-20">
        {[35, 50, 45, 70, 60, 85, 75, 95].map((height, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-t"
            style={{ backgroundColor: i === 7 ? color : `${color}40` }}
            initial={{ height: 0 }}
            whileInView={{ height: `${height}%` }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 * i, duration: 0.4 }}
            animate={{
              height: isHovered ? `${Math.min(height + 10, 100)}%` : `${height}%`,
            }}
          />
        ))}
      </div>

      {/* Metric */}
      <div className="text-center">
        <motion.span
          className="text-2xl font-bold"
          style={{ color }}
          animate={{ scale: isHovered ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 0.5 }}
        >
          +127%
        </motion.span>
        <p className="text-xs text-brown-muted">המרות</p>
      </div>
    </div>
  )
}

// Brand identity preview
function BrandPreview({ color, isHovered }: { color: string; isHovered: boolean }) {
  return (
    <div className="bg-cream-dark rounded-xl p-4 relative overflow-hidden">
      {/* Floating shapes */}
      <motion.div
        className="absolute top-2 right-2 w-12 h-12 rounded-xl"
        style={{ backgroundColor: `${color}30` }}
        animate={{
          rotate: isHovered ? 360 : 0,
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ duration: 1 }}
      />
      <motion.div
        className="absolute bottom-4 left-4 w-8 h-8 rounded-full"
        style={{ backgroundColor: color }}
        animate={{
          y: isHovered ? -5 : 0,
        }}
        transition={{ duration: 0.3 }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 rounded-2xl"
        style={{ borderColor: `${color}50` }}
        animate={{
          rotate: isHovered ? -15 : 0,
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Logo placeholder */}
      <div className="relative z-10 h-24 flex items-center justify-center">
        <motion.div
          className="text-4xl font-headline font-bold"
          style={{ color }}
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.3 }}
        >
          Aa
        </motion.div>
      </div>
    </div>
  )
}

// Mobile device preview
function MobilePreview({ color, isHovered }: { color: string; isHovered: boolean }) {
  return (
    <motion.div
      className="relative mx-auto w-24"
      animate={{ y: isHovered ? -4 : 0, rotate: isHovered ? 3 : 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Phone frame */}
      <div className="bg-brown-dark rounded-2xl p-1.5">
        {/* Screen */}
        <div className="bg-cream rounded-xl overflow-hidden">
          {/* Notch */}
          <div className="flex justify-center py-1">
            <div className="w-10 h-1.5 bg-brown-dark rounded-full" />
          </div>

          {/* Content */}
          <div className="px-2 pb-3 space-y-1.5">
            <motion.div
              className="h-10 rounded-lg"
              style={{ backgroundColor: `${color}30` }}
              animate={{
                opacity: isHovered ? [0.5, 1, 0.5] : 0.5,
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <div className="space-y-1">
              <div className="h-1 bg-brown/10 rounded w-full" />
              <div className="h-1 bg-brown/10 rounded w-4/5" />
              <div className="h-1 bg-brown/10 rounded w-3/5" />
            </div>
            <motion.div
              className="h-6 rounded-full mx-auto w-16"
              style={{ backgroundColor: color }}
              animate={{
                scale: isHovered ? [1, 1.05, 1] : 1,
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Reflection */}
      <div
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-4 rounded-full blur-md opacity-30"
        style={{ backgroundColor: color }}
      />
    </motion.div>
  )
}

// Support chat preview
function SupportPreview({ color, isHovered }: { color: string; isHovered: boolean }) {
  return (
    <div className="bg-cream-dark rounded-xl p-4 relative overflow-hidden h-32">
      {/* Chat bubbles */}
      <motion.div
        className="absolute top-3 right-3 px-3 py-2 rounded-2xl rounded-tr-sm text-xs max-w-[80%]"
        style={{ backgroundColor: `${color}20` }}
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        <div className="h-2 bg-brown/20 rounded w-16 mb-1" />
        <div className="h-2 bg-brown/10 rounded w-12" />
      </motion.div>

      <motion.div
        className="absolute top-14 left-3 px-3 py-2 rounded-2xl rounded-tl-sm text-xs"
        style={{ backgroundColor: color }}
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        animate={{ scale: isHovered ? [1, 1.05, 1] : 1 }}
      >
        <div className="h-2 bg-white/40 rounded w-20 mb-1" />
        <div className="h-2 bg-white/30 rounded w-14" />
      </motion.div>

      {/* Typing indicator */}
      <motion.div
        className="absolute bottom-3 right-3 flex gap-1"
        animate={{ opacity: isHovered ? 1 : 0.5 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: color }}
            animate={{
              y: isHovered ? [0, -4, 0] : 0,
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
            }}
          />
        ))}
      </motion.div>

      {/* Headset icon */}
      <motion.div
        className="absolute bottom-3 left-3 w-8 h-8 flex items-center justify-center rounded-full"
        style={{ backgroundColor: `${color}20` }}
        animate={{ rotate: isHovered ? [0, 10, -10, 0] : 0 }}
        transition={{ duration: 0.5 }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
        </svg>
      </motion.div>
    </div>
  )
}

// SEO metrics preview
function SeoPreview({ color, isHovered }: { color: string; isHovered: boolean }) {
  return (
    <div className="bg-cream-dark rounded-xl p-4 space-y-3">
      {/* Search bar */}
      <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <div className="flex-1 h-2 bg-brown/10 rounded" />
      </div>

      {/* Ranking indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
            style={{ backgroundColor: `${color}20`, color }}
            animate={{ scale: isHovered ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.5 }}
          >
            #1
          </motion.div>
          <div className="space-y-1">
            <div className="h-2 bg-brown/20 rounded w-16" />
            <div className="h-1.5 bg-brown/10 rounded w-12" />
          </div>
        </div>
        <motion.svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2"
          animate={{ y: isHovered ? -3 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
          <polyline points="16 7 22 7 22 13" />
        </motion.svg>
      </div>

      {/* Traffic bars */}
      <div className="flex items-end gap-1 h-10">
        {[20, 35, 30, 50, 45, 70, 65, 90].map((height, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-t"
            style={{ backgroundColor: i >= 6 ? color : `${color}40` }}
            initial={{ height: 0 }}
            whileInView={{ height: `${height}%` }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 * i, duration: 0.3 }}
            animate={{
              height: isHovered ? `${Math.min(height + 15, 100)}%` : `${height}%`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
