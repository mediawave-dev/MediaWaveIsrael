import { motion } from 'framer-motion'
import { Monitor, Target, Building2, Search, LifeBuoy, Smartphone } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface Service {
  id: string
  title: string
  description: string
  icon: LucideIcon
  span: 1 | 2
  tags?: string[]
}

const services: Service[] = [
  {
    id: 'websites',
    title: 'פיתוח אתרים מותאמים אישית',
    description:
      'נבנה לך אתר מקצועי שמותאם בדיוק לצרכים של העסק שלך. עיצוב ייחודי, קוד נקי, וביצועים מעולים.',
    icon: Monitor,
    span: 2,
    tags: ['React / WordPress', 'עיצוב רספונסיבי', 'טעינה מהירה'],
  },
  {
    id: 'landing',
    title: 'עיצוב דפי נחיתה',
    description:
      'דפים שמניעים לפעולה ומגדילים את אחוזי ההמרה שלך. עיצוב ממוקד מטרה שהופך מבקרים ללקוחות משלמים.',
    icon: Target,
    span: 1,
  },
  {
    id: 'branding',
    title: 'אתרי תדמית לעסקים',
    description:
      'נוכחות דיגיטלית מקצועית שמשדרת אמינות. האתר יהיה הכרטיס ביקור הדיגיטלי המושלם לעסק שלך.',
    icon: Building2,
    span: 1,
  },
  {
    id: 'seo',
    title: 'קידום אורגני (SEO)',
    description:
      'נדאג שהלקוחות ימצאו אתכם בגוגל. אופטימיזציה מקצועית שמביאה תנועה אורגנית ואיכותית לאתר.',
    icon: Search,
    span: 2,
    tags: ['מחקר מילות מפתח', 'אופטימיזציית תוכן', 'בניית קישורים'],
  },
  {
    id: 'support',
    title: 'ליווי ותמיכה שוטפת',
    description:
      'לא נעלמים אחרי ההשקה. תמיכה טכנית, עדכוני אבטחה, וגיבויים שוטפים - אנחנו כאן בשבילכם.',
    icon: LifeBuoy,
    span: 1,
  },
  {
    id: 'mobile',
    title: 'אופטימיזציה למובייל',
    description:
      'יותר מ-60% מהגולשים מגיעים מהנייד. נוודא שהאתר שלך נראה ועובד מושלם בכל מכשיר.',
    icon: Smartphone,
    span: 2,
    tags: ['התאמה לכל מסך', 'טעינה מהירה במובייל', 'חווית משתמש מעולה'],
  },
]

export default function Services() {
  return (
    <section
      id="services"
      className="relative py-20 md:py-28 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #ecfeff 100%)',
      }}
    >
      {/* Animated decorative background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <motion.div
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(125, 211, 252, 0.2) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(34, 211, 238, 0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={{ y: [0, 20, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(94, 234, 212, 0.1) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="container relative max-w-[1200px]">
        {/* Header - Right aligned for RTL */}
        <div className="mb-14 md:mb-16">
          <motion.span
            className="block text-base font-semibold tracking-widest uppercase mb-4"
            style={{ color: '#38BDF8' }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            השירותים שלנו
          </motion.span>

          <motion.h2
            className="text-4xl md:text-5xl font-headline leading-tight text-brown-dark mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            אנחנו בונים חוויות דיגיטליות
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-brown-light leading-relaxed max-w-lg"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            מהרעיון הראשוני ועד להשקה - אנחנו מלווים אתכם בכל שלב.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, index) => (
            <BentoCard key={service.id} service={service} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-14 md:mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.a
            href="#contact"
            className="inline-flex items-center gap-3 text-lg font-semibold py-3.5 px-10 rounded-full shadow-lg hover:shadow-glow transition-all duration-300 bg-orange hover:bg-orange-dark"
            style={{ color: '#1e3a5f' }}
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

// Glassmorphism bento card — consistent horizontal layout for ALL cards
function BentoCard({ service, index }: { service: Service; index: number }) {
  const IconComponent = service.icon
  const isWide = service.span === 2
  const hasTags = service.tags && service.tags.length > 0

  return (
    <motion.div
      className={`relative group rounded-3xl overflow-hidden ${isWide ? 'lg:col-span-2' : ''}`}
      style={{
        background: 'rgba(255, 255, 255, 0.55)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{
        y: -8,
        boxShadow:
          '0 20px 40px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(125, 211, 252, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
      }}
    >
      {/* Blue accent top border — scales in on hover */}
      <div
        className="absolute top-0 inset-x-0 h-[3px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right"
        style={{ background: 'linear-gradient(90deg, #BAE6FD, #BAE6FD)' }}
      />

      {/* Card content — consistent horizontal layout: Icon RIGHT, Text LEFT (RTL) */}
      <div className="p-6 md:p-7 flex items-start gap-4 md:gap-5">
        {/* Icon — first child = RIGHT side in RTL flex-row */}
        <div
          className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
          style={{
            background:
              'linear-gradient(135deg, rgba(125, 211, 252, 0.15) 0%, rgba(125, 211, 252, 0.05) 100%)',
            border: '1px solid rgba(125, 211, 252, 0.12)',
          }}
        >
          <IconComponent size={28} color="#38BDF8" strokeWidth={1.5} />
        </div>

        {/* Text — second child = LEFT side in RTL flex-row */}
        <div className="flex-1 min-w-0">
          <h3
            className="text-xl md:text-2xl font-semibold leading-tight mb-2"
            style={{ color: '#2A2A2A' }}
          >
            {service.title}
          </h3>
          <p className="text-base md:text-lg leading-relaxed" style={{ color: '#6A6A6A' }}>
            {service.description}
          </p>

          {/* Feature tags — only on large cards */}
          {hasTags && (
            <div className="flex flex-wrap gap-2 mt-3">
              {service.tags!.map((tag, tagIndex) => (
                <span
                  key={tag}
                  className={`inline-block rounded-full text-sm transition-transform duration-300 group-hover:scale-105${/[a-zA-Z]/.test(tag) ? ' font-english' : ''}`}
                  style={{
                    background: 'rgba(125, 211, 252, 0.12)',
                    color: '#0EA5E9',
                    padding: '4px 12px',
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
      </div>

      {/* Subtle hover gradient overlay */}
      <div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(125, 211, 252, 0.05) 0%, transparent 60%)',
        }}
      />
    </motion.div>
  )
}
