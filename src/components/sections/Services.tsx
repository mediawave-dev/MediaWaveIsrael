import { m } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { LottieIcon } from '../ui'

interface Service {
  id: string
  title: string
  description: string
  icon?: LucideIcon
  lottieAnimation?: string
  lottieSize?: number
  videoAnimation?: string
  tags?: string[]
}

const services: Service[] = [
  {
    id: 'websites',
    title: 'בניית אתרים',
    description: 'אנחנו בוחרים את הטכנולוגיה הנכונה לעסק שלכם, בין אם זה React, Next.js או WordPress.',
    lottieAnimation: '/animations/1/web-design.json',
    tags: ['React', 'Next.js', 'WordPress'],
  },
  {
    id: 'landing',
    title: 'דפי נחיתה',
    description: 'דף ממוקד המרה עם WhatsApp וטפסים חכמים.',
    lottieAnimation: '/animations/3%20landing%20page/Contact%20us.json',
    tags: ['עיצוב ממיר', 'Mobile-First'],
  },
  {
    id: 'seo',
    title: 'קידום אורגני',
    description: 'קידום אורגני שבאמת עובד, עם מחקר מילות מפתח, תוכן ממוקד ומבנה טכני נכון.',
    lottieAnimation: '/animations/4%20SEO/Website%20SEO%20Audit.json',
    tags: ['Google', 'תוכן ממוקד'],
  },
  {
    id: 'chatbots',
    title: 'צ׳אטבוטים חכמים',
    description: 'צ׳אטבוטים מבוססי AI מהדור האחרון. אוטומציה של שירות לקוחות, תמיכה 24/7, ואיסוף לידים – הכל בלי להוסיף כוח אדם.',
    videoAnimation: '/animations/14%20chatbot/Live%20chatbot.webm',
    tags: ['AI', 'WhatsApp', '24/7'],
  },
]

export default function Services() {
  return (
    <section
      id="services"
      aria-label="שירותים"
      className="relative py-20 md:py-28 overflow-hidden"
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
          animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <m.div
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(34, 211, 238, 0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={{ y: [0, 20, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="container relative max-w-6xl">
        {/* Header */}
        <div className="mb-14 md:mb-16 text-center">
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

          <m.p
            className="text-lg md:text-xl text-brown-light leading-relaxed max-w-lg mx-auto"
            initial={{ opacity: 0, transform: 'translateY(15px)' }}
            whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            מהרעיון הראשוני ועד להשקה, אנחנו מלווים אתכם בכל שלב.
          </m.p>
        </div>

        {/* 4-column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <m.div
          className="mt-14 md:mt-20 text-center"
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
              animate={{ x: [0, -4, 0] }}
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
function ServiceCard({ service, index }: { service: Service; index: number }) {
  const IconComponent = service.icon
  const hasTags = service.tags && service.tags.length > 0
  const hasLottie = !!service.lottieAnimation
  const hasVideo = !!service.videoAnimation

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
      <div className="p-5 md:p-6 text-center flex flex-col h-full">
        {/* Icon / Lottie - same container for all */}
        <div className="h-32 flex items-center justify-center mb-5 overflow-visible">
          {hasVideo ? (
            <div className="flex items-center justify-center transition-transform duration-300 group-hover:scale-105 w-32 h-32">
              <video
                autoPlay
                muted
                loop
                playsInline
                aria-hidden="true"
                className="w-full h-full object-contain"
              >
                <source src={service.videoAnimation} type="video/webm" />
              </video>
            </div>
          ) : hasLottie ? (
            <div
              className="flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
              style={{ width: service.lottieSize ?? 128, height: service.lottieSize ?? 128 }}
            >
              <LottieIcon
                animationPath={service.lottieAnimation}
                size={service.lottieSize ?? 128}
                playOnHover={true}
                loop={true}
              />
            </div>
          ) : IconComponent ? (
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
              style={{
                background:
                  'linear-gradient(135deg, rgba(125, 211, 252, 0.15) 0%, rgba(125, 211, 252, 0.05) 100%)',
                border: '1px solid rgba(125, 211, 252, 0.12)',
              }}
            >
              <IconComponent size={28} color="#38BDF8" strokeWidth={1.5} />
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

        {/* Tags - Centered, pushed to bottom */}
        {hasTags && (
          <div className="flex flex-wrap justify-center gap-2 mt-auto">
            {service.tags!.map((tag, tagIndex) => (
              <span
                key={tag}
                className={`inline-block rounded-full text-sm transition-transform duration-300 group-hover:scale-105${/[a-zA-Z]/.test(tag) ? ' font-english' : ''}`}
                style={{
                  background: 'rgba(125, 211, 252, 0.12)',
                  color: '#0EA5E9',
                  padding: '3px 10px',
                  border: '1px solid rgba(125, 211, 252, 0.25)',
                  transitionDelay: `${tagIndex * 100}ms`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
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
