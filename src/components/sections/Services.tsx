import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import ServiceCard from '../ui/ServiceCard'

// Service data from CONTENT.md - exact Hebrew text
const services = [
  {
    title: 'פיתוח אתרים מותאמים אישית',
    description: 'אתרים מקצועיים הבנויים בטכנולוגיות מתקדמות, מותאמים לצרכים הייחודיים של העסק שלך.',
    icon: <CodeIcon />,
    accent: 'orange' as const,
    animationType: 'tilt3d' as const, // 3D tilt effect
  },
  {
    title: 'עיצוב דפי נחיתה',
    description: 'דפי נחיתה שמניעים לפעולה ומגדילים את אחוזי ההמרה עם עיצוב ממוקד מטרה.',
    icon: <LayoutIcon />,
    accent: 'terracotta' as const,
    animationType: 'glitch' as const, // VHS glitch effect
  },
  {
    title: 'אתרי תדמית לעסקים',
    description: 'אתרים שמשקפים את המקצועיות והערכים של העסק ובונים אמון מול הלקוחות.',
    icon: <BuildingIcon />,
    accent: 'coral' as const,
    animationType: 'reveal' as const, // Reveal animation
  },
  {
    title: 'אופטימיזציה למובייל',
    description: 'חוויית גלישה מושלמת בכל מכשיר - מחשב, טאבלט וסמארטפון.',
    icon: <SmartphoneIcon />,
    accent: 'sage' as const,
    animationType: 'float' as const, // Float animation
  },
  {
    title: 'ליווי ותמיכה שוטפת',
    description: 'תמיכה מקצועית ועדכונים שוטפים לאחר ההשקה להבטחת הצלחה מתמשכת.',
    icon: <HeadphonesIcon />,
    accent: 'orange' as const,
    animationType: 'pulse' as const, // Pulse animation
  },
  {
    title: 'קידום אורגני (SEO)',
    description: 'אופטימיזציה למנועי חיפוש כדי להגדיל את החשיפה והתנועה האורגנית לאתר שלך.',
    icon: <TrendingUpIcon />,
    accent: 'terracotta' as const,
    animationType: 'wave' as const, // Wave animation
  },
]

export default function Services() {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  // Connecting line draws as user scrolls
  const lineProgress = useTransform(scrollYProgress, [0, 0.4], [0, 1])
  const flowingLineProgress = useTransform(scrollYProgress, [0.1, 0.8], [0, 1])

  // Parallax for background elements
  const bgY1 = useTransform(scrollYProgress, [0, 1], [0, -80])
  const bgY2 = useTransform(scrollYProgress, [0, 1], [0, 60])

  return (
    <section
      ref={containerRef}
      id="services"
      className="relative py-24 md:py-32 bg-cream-dark overflow-hidden"
    >
      {/* Decorative connecting line from Hero - draws on scroll, hidden on mobile */}
      <svg
        className="absolute top-0 left-0 right-0 h-32 -mt-32 pointer-events-none overflow-visible hidden md:block"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M0,60 Q360,120 720,60 T1440,90"
          fill="none"
          stroke="var(--color-orange)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="8 12"
          className="opacity-40"
          style={{ pathLength: lineProgress }}
        />
      </svg>

      {/* Background watercolor decorations with parallax */}
      <motion.div
        className="absolute top-20 right-[10%] w-96 h-96 pointer-events-none"
        style={{ y: bgY1 }}
      >
        <div className="w-full h-full rounded-full bg-orange/8 blur-3xl" />
      </motion.div>
      <motion.div
        className="absolute bottom-40 left-[5%] w-72 h-72 pointer-events-none"
        style={{ y: bgY2 }}
      >
        <div className="w-full h-full rounded-full bg-terracotta/8 blur-3xl" />
      </motion.div>
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none opacity-30"
        style={{ y: bgY1 }}
      >
        <div className="w-full h-full rounded-full bg-sage/5 blur-3xl" />
      </motion.div>

      <div className="container relative">
        {/* Section Header */}
        <div className="max-w-2xl mb-20">
          {/* Badge */}
          <motion.span
            className="inline-flex items-center gap-2 bg-orange/10 text-orange text-sm font-semibold px-5 py-2.5 rounded-full mb-6 backdrop-blur-sm"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="w-2 h-2 bg-orange rounded-full animate-pulse" />
            שירותים
          </motion.span>

          {/* Title with decorative curved line */}
          <div className="relative">
            <motion.h2
              className="text-h2 mb-6"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              שירותי פיתוח ועיצוב אתרים
            </motion.h2>

            {/* Hand-drawn underline that draws on view */}
            <motion.svg
              className="absolute -bottom-2 right-0 w-56 h-4"
              viewBox="0 0 220 12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <motion.path
                d="M2 8 Q55 2 110 6 T218 4"
                fill="none"
                stroke="var(--color-orange)"
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

          {/* Description */}
          <motion.p
            className="text-lg text-brown-light leading-relaxed mt-10"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            אנחנו מתמחים בבניית אתרים ודפי נחיתה שמשלבים עיצוב מרשים עם חוויית משתמש מעולה.
            כל פרויקט מותאם אישית לצרכי העסק ומיועד להביא תוצאות מדידות - יותר פניות, יותר מכירות, יותר הצלחה.
          </motion.p>
        </div>

        {/* Services Grid - ASYMMETRIC CREATIVE LAYOUT */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Card 1 - Large, spans 7 columns */}
          <div className="lg:col-span-7">
            <ServiceCard
              title={services[0].title}
              description={services[0].description}
              icon={services[0].icon}
              index={0}
              accentColor={services[0].accent}
              animationType={services[0].animationType}
            />
          </div>

          {/* Card 2 - Medium, spans 5 columns */}
          <div className="lg:col-span-5">
            <ServiceCard
              title={services[1].title}
              description={services[1].description}
              icon={services[1].icon}
              index={1}
              accentColor={services[1].accent}
              animationType={services[1].animationType}
            />
          </div>

          {/* Card 3 - Medium, spans 5 columns, offset */}
          <div className="lg:col-span-5 lg:col-start-1">
            <ServiceCard
              title={services[2].title}
              description={services[2].description}
              icon={services[2].icon}
              index={2}
              accentColor={services[2].accent}
              animationType={services[2].animationType}
            />
          </div>

          {/* Card 4 - Large, spans 7 columns */}
          <div className="lg:col-span-7">
            <ServiceCard
              title={services[3].title}
              description={services[3].description}
              icon={services[3].icon}
              index={3}
              accentColor={services[3].accent}
              animationType={services[3].animationType}
            />
          </div>

          {/* Card 5 - Medium, spans 6 columns */}
          <div className="lg:col-span-6">
            <ServiceCard
              title={services[4].title}
              description={services[4].description}
              icon={services[4].icon}
              index={4}
              accentColor={services[4].accent}
              animationType={services[4].animationType}
            />
          </div>

          {/* Card 6 - Medium, spans 6 columns */}
          <div className="lg:col-span-6">
            <ServiceCard
              title={services[5].title}
              description={services[5].description}
              icon={services[5].icon}
              index={5}
              accentColor={services[5].accent}
              animationType={services[5].animationType}
            />
          </div>
        </div>

        {/* Decorative flowing line through cards - draws on scroll */}
        <svg
          className="absolute top-[40%] left-0 right-0 h-[400px] pointer-events-none opacity-25 hidden lg:block z-0"
          viewBox="0 0 1200 400"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0,100 C150,180 250,50 400,100 S550,200 700,120 S900,180 1050,80 S1150,150 1200,100"
            fill="none"
            stroke="var(--color-terracotta)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="12 8"
            style={{ pathLength: flowingLineProgress }}
          />
          {/* Second decorative line */}
          <motion.path
            d="M0,300 C200,250 300,350 500,280 S750,320 900,260 S1100,300 1200,280"
            fill="none"
            stroke="var(--color-sage)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="6 10"
            style={{ pathLength: flowingLineProgress }}
            className="opacity-60"
          />
        </svg>

        {/* Floating decorative elements */}
        <motion.div
          className="absolute top-1/3 right-[5%] w-3 h-3 rounded-full bg-orange/40 hidden lg:block"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-2/3 left-[8%] w-2 h-2 rounded-full bg-terracotta/40 hidden lg:block"
          animate={{
            y: [0, 15, 0],
            x: [0, 10, 0],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <motion.div
          className="absolute bottom-1/4 right-[15%] w-4 h-4 rounded-full bg-sage/30 hidden lg:block"
          animate={{
            y: [0, -25, 0],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </div>

      {/* Bottom wave transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none">
        <svg
          className="absolute bottom-0 w-full h-full"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0,40 C360,80 720,10 1080,50 C1260,70 1380,30 1440,40 L1440,80 L0,80 Z"
            fill="var(--color-cream)"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          />
        </svg>
      </div>
    </section>
  )
}

// Icon Components - minimal, elegant designs
function CodeIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )
}

function LayoutIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <line x1="3" x2="21" y1="9" y2="9" />
      <line x1="9" x2="9" y1="21" y2="9" />
    </svg>
  )
}

function BuildingIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  )
}

function SmartphoneIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </svg>
  )
}

function HeadphonesIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
    </svg>
  )
}

function TrendingUpIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  )
}
