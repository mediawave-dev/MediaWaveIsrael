import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Check, Star } from 'lucide-react'
import SectionSkeleton from '../ui/SectionSkeleton'
import { useSanityQuery } from '../../sanity/hooks'
import { PACKAGES_QUERY } from '../../sanity/queries'

interface SanityPackage {
  _id: string
  name: string
  price: string
  description: string
  features: string[]
  idealFor: string
  cta: string
  ctaLink: string
  popular?: boolean
}

const fallbackPackages: SanityPackage[] = [
  { _id: 'landing', name: 'דף נחיתה', price: 'החל מ-₪1,500', description: 'נוכחות דיגיטלית מהירה ואפקטיבית', features: ['עמוד אחד רספונסיבי', 'עיצוב מותאם אישית', 'טופס יצירת קשר', 'אופטימיזציית מהירות', 'SEO בסיסי'], idealFor: 'לעסקים שרוצים נוכחות דיגיטלית מהירה', cta: 'בואו נדבר', ctaLink: '#contact' },
  { _id: 'business', name: 'אתר תדמית', price: 'החל מ-₪3,500', description: 'אתר מקצועי ומרשים לעסק שלך', features: ['עד 5 עמודים', 'עיצוב מותאם אישית', 'רספונסיבי מלא', 'SEO מובנה', 'אינטגרציית Google Analytics', 'טופס יצירת קשר מתקדם', 'ליווי עד להשקה'], idealFor: 'לעסקים שרוצים אתר מקצועי ומרשים', cta: 'בואו נדבר', ctaLink: '#contact', popular: true },
  { _id: 'custom', name: 'פרויקט מותאם', price: 'לפי הצעת מחיר', description: 'פתרון מותאם לצרכים ייחודיים', features: ['אתר מורכב / חנות / אפליקציה', 'פיצ׳רים מתקדמים (צ׳אטבוט AI, אינטגרציות, CMS)', 'עיצוב פרימיום', 'תמיכה שוטפת'], idealFor: 'לעסקים עם צרכים ייחודיים ושאפתניים', cta: 'בואו נדבר', ctaLink: '#contact' },
]

// --- Animation variants ---

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
}

// --- Package Card ---

function PackageCard({ pkg }: { pkg: SanityPackage }) {
  return (
    <motion.div
      variants={cardVariants}
      className={`relative flex flex-col rounded-2xl p-8 transition-shadow duration-300 ${
        pkg.popular
          ? 'bg-white shadow-xl border-2 border-orange/40 lg:scale-105 lg:-my-4 z-10'
          : 'bg-white/80 shadow-md border border-cream-darker/40'
      }`}
      whileHover={{
        y: -6,
        boxShadow: pkg.popular
          ? '0 25px 50px -12px rgba(125, 211, 252, 0.2), 0 0 30px rgba(125, 211, 252, 0.08)'
          : '0 20px 40px -10px rgba(74, 74, 74, 0.12)',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      {/* Popular badge */}
      {pkg.popular && (
        <motion.div
          className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-orange text-white text-sm font-semibold px-5 py-2 rounded-full shadow-md"
          initial={{ opacity: 0, y: -10, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 400, damping: 20 }}
        >
          <Star size={14} fill="currentColor" />
          <span>הכי פופולרי</span>
        </motion.div>
      )}

      {/* Header */}
      <div className={`mb-6 ${pkg.popular ? 'pt-2' : ''}`}>
        <h3 className="text-2xl font-headline font-bold text-brown-dark mb-2">{pkg.name}</h3>
        <p className="text-brown-light text-sm leading-relaxed">{pkg.description}</p>
      </div>

      {/* Price */}
      <div className="mb-8">
        <span className="text-3xl md:text-4xl font-headline font-bold text-brown-dark">{pkg.price}</span>
      </div>

      {/* Divider */}
      <div className={`h-px mb-6 ${pkg.popular ? 'bg-orange/20' : 'bg-cream-darker'}`} />

      {/* Features */}
      <ul className="space-y-3 mb-8 flex-1">
        {pkg.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <span className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${pkg.popular ? 'bg-orange/15 text-orange' : 'bg-sage/20 text-sage-dark'}`}>
              <Check size={12} strokeWidth={3} />
            </span>
            <span className="text-brown-light text-sm leading-relaxed">{feature}</span>
          </li>
        ))}
      </ul>

      {/* Ideal for */}
      <p className="text-xs text-brown-muted mb-6">{pkg.idealFor}</p>

      {/* CTA */}
      <motion.a
        href={pkg.ctaLink}
        className={`block text-center font-semibold py-3.5 px-6 rounded-full transition-colors duration-300 ${
          pkg.popular
            ? 'shadow-md hover:shadow-lg'
            : 'bg-cream-dark text-brown-dark hover:bg-orange/10 hover:text-orange border border-cream-darker/50'
        }`}
        style={pkg.popular ? { backgroundColor: '#0EA5E9', color: '#FFFFFF' } : undefined}
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {pkg.cta}
      </motion.a>
    </motion.div>
  )
}

// --- Main Packages Section ---

export default function Packages() {
  const sectionRef = useRef<HTMLElement>(null)
  const { data, loading, error } = useSanityQuery<SanityPackage[]>(PACKAGES_QUERY)

  const packages = data && data.length > 0 ? data : (error ? fallbackPackages : null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], [0, -50])

  if (loading && !packages) {
    return <SectionSkeleton lines={3} />
  }

  if (!packages || packages.length === 0) return null

  return (
    <section
      ref={sectionRef}
      id="packages"
      aria-label="חבילות ומחירים"
      className="relative py-16 md:py-24 bg-cream overflow-hidden"
    >
      {/* Background decoration — parallax glow */}
      <motion.div className="absolute top-1/3 left-[8%] w-72 h-72 pointer-events-none" style={{ y: bgY }}>
        <div className="w-full h-full rounded-full bg-orange/6 blur-3xl" />
      </motion.div>

      <div className="container relative">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <motion.span
            className="inline-flex items-center gap-2 bg-orange/10 text-orange text-sm font-semibold px-5 py-2.5 rounded-full mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut' as const }}
          >
            <span className="w-2 h-2 bg-orange rounded-full animate-pulse" />
            תמחור שקוף
          </motion.span>

          <motion.h2
            className="text-h2 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            החבילות שלנו
          </motion.h2>

          <motion.p
            className="text-lg text-brown-light leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' as const }}
          >
            בחרו את החבילה שמתאימה לכם. כל פרויקט מותאם אישית לצרכים שלכם
          </motion.p>
        </div>

        {/* Cards grid — staggered entrance */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto items-start"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {packages.map((pkg) => (
            <PackageCard key={pkg._id} pkg={pkg} />
          ))}
        </motion.div>

        {/* Bottom note */}
        <motion.p
          className="text-center text-sm text-brown-muted mt-10 max-w-lg mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          כל המחירים כוללים מע״מ. התמחור הסופי נקבע לפי היקף הפרויקט ודרישות הלקוח.
        </motion.p>
      </div>
    </section>
  )
}
