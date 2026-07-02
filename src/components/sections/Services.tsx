import { useRef } from 'react'
import { m, useInView } from 'framer-motion'
import { LottieIcon } from '../ui'
import { useReducedMotion } from '../../hooks/useReducedMotion'

interface ServiceItem {
  _id: string
  title: string
  description: string
  lottieAnimation?: string
  lottieSize?: number
  tags?: string[]
}

const services: ServiceItem[] = [
  {
    _id: 'websites',
    title: 'בניית אתרים',
    description: 'כל אתר נבנה מאפס בקוד, עם הטכנולוגיות המתקדמות בשוק. מהיר, מאובטח, וללא תלות בשום פלטפורמה.',
    lottieAnimation: '/animations/1/web-design.json',
    tags: ['React', 'Next.js', 'Tailwind CSS'],
  },
  {
    _id: 'landing',
    title: 'דפי נחיתה',
    description: 'דף ממוקד המרה עם WhatsApp וטפסים חכמים.',
    lottieAnimation: '/animations/3%20landing%20page/Contact%20us.json',
  },
  {
    _id: 'seo',
    title: 'קידום אורגני',
    description: 'קידום אורגני שבאמת עובד, עם מחקר מילות מפתח, תוכן ממוקד ומבנה טכני נכון.',
    lottieAnimation: '/animations/4%20SEO/Website%20SEO%20Audit.json',
  },
  {
    _id: 'chatbots',
    title: 'צ׳אטבוטים חכמים',
    description: 'צ׳אטבוטים מבוססי AI מהדור האחרון. אוטומציה של שירות לקוחות, תמיכה 24/7, ואיסוף לידים – הכל בלי להוסיף כוח אדם.',
    lottieAnimation: '/animations/14%20chatbot/Live%20chatbot.json',
    lottieSize: 160,
  },
]

export default function Services() {
  // Animate the blurred orbs only while the section is actually on screen
  // (blur(60px) repaints offscreen are pure CPU waste on mobile)
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { margin: '200px' })
  const prefersReducedMotion = useReducedMotion()
  const orbsActive = isInView && !prefersReducedMotion

  return (
    <section
      ref={sectionRef}
      id="services"
      aria-label="שירותים"
      className="relative py-14 md:py-28 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #ecfeff 100%)',
      }}
    >
      {/* Animated decorative background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <m.div
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(125, 211, 252, 0.2) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={orbsActive ? { y: [0, -20, 0], scale: [1, 1.05, 1] } : undefined}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <m.div
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(34, 211, 238, 0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={orbsActive ? { y: [0, 20, 0], scale: [1, 1.08, 1] } : undefined}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="container relative max-w-6xl">
        {/* Header */}
        <div className="mb-10 md:mb-16 text-center">
          <m.span
            className="block text-base font-semibold tracking-widest uppercase mb-4"
            style={{ color: '#38BDF8' }}
            initial={{ opacity: 0, transform: 'translateY(10px)' }}
            whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
            viewport={{ once: true }}
          >
            השירותים שלנו
          </m.span>

          <m.h2
            className="text-4xl md:text-5xl font-headline leading-tight text-brown-dark mb-4"
            initial={{ opacity: 0, transform: 'translateY(20px)' }}
            whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            מה אנחנו עושים
          </m.h2>

          <div className="section-title-accent" aria-hidden="true" />

          <m.p
            className="text-lg md:text-xl text-brown-light leading-relaxed max-w-lg mx-auto mt-4"
            initial={{ opacity: 0, transform: 'translateY(15px)' }}
            whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            מהרעיון הראשוני ועד להשקה, אנחנו מלווים אתכם בכל שלב.
          </m.p>
        </div>

        {/* 4-column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {services.map((service, index) => (
            <ServiceCard key={service._id} service={service} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <m.div
          className="mt-10 md:mt-20 text-center"
          initial={{ opacity: 0, transform: 'translateY(30px)' }}
          whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
          viewport={{ once: true }}
        >
          <m.a
            href="#contact"
            className="inline-flex items-center gap-3 text-lg font-semibold py-3.5 px-10 rounded-full shadow-lg hover:shadow-glow transition-all duration-300 bg-orange hover:bg-orange-dark"
            style={{ color: '#1e3a5f' }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>התחל פרויקט</span>
            <m.span
              animate={prefersReducedMotion ? undefined : { x: [0, -4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ←
            </m.span>
          </m.a>
        </m.div>
      </div>
    </section>
  )
}

// Glassmorphism service card
function ServiceCard({ service, index }: { service: ServiceItem; index: number }) {
  const hasLottie = !!service.lottieAnimation

  return (
    <m.div
      className="relative group rounded-2xl overflow-visible h-full"
      style={{
        background: 'rgba(255, 255, 255, 0.55)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
      }}
      initial={{ opacity: 0, transform: 'translateY(30px)' }}
      whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{
        y: -8,
        boxShadow:
          '0 20px 40px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(125, 211, 252, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
      }}
    >
      {/* Blue accent top border */}
      <div
        className="absolute top-0 inset-x-0 h-[3px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right"
        style={{ background: 'linear-gradient(90deg, #BAE6FD, #BAE6FD)' }}
      />

      {/* Card content */}
      <div className="p-4 md:p-6 text-center flex flex-col h-full">
        {/* Icon / Lottie - same container for all */}
        <div className="h-24 md:h-32 flex items-center justify-center mb-3 md:mb-5 overflow-visible">
          {hasLottie ? (
            <div
              className="flex items-center justify-center transition-transform duration-300 scale-75 md:scale-100 md:group-hover:scale-105"
              style={{ width: service.lottieSize ?? 128, height: service.lottieSize ?? 128 }}
            >
              <LottieIcon
                animationPath={service.lottieAnimation}
                size={service.lottieSize ?? 128}
                playOnHover={true}
                loop={true}
              />
            </div>
          ) : null}
        </div>

        {/* Title */}
        <h3
          className="text-xl font-semibold leading-tight mb-2"
          style={{ color: '#2A2A2A' }}
        >
          {service.title}
        </h3>

        {/* Description - single sentence */}
        <p className="text-base leading-relaxed mb-4 flex-grow" style={{ color: '#6A6A6A' }}>
          {service.description}
        </p>

      </div>

      {/* Subtle hover gradient overlay */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(125, 211, 252, 0.05) 0%, transparent 60%)',
        }}
      />
    </m.div>
  )
}
