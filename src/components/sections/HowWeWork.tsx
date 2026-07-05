import { m } from 'framer-motion'
import { LottieIcon } from '../ui/LottieIcon'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { EASE_BRAND } from '../../config/motion'

interface StepItem {
  _id: string
  stepNumber: string
  title: string
  description: string
  animationPath?: string
}

const steps: StepItem[] = [
  { _id: '01', stepNumber: '01', title: 'שיחת היכרות', description: 'מבינים את העסק, היעדים והקהל שלכם', animationPath: '/animations/8 call/Call Center Support Lottie Animation.json' },
  { _id: '02', stepNumber: '02', title: 'אפיון ועיצוב', description: 'מתכננים מבנה, עיצוב ו-UX מותאם אישית', animationPath: '/animations/10 design/Web Design Illustration.json' },
  { _id: '03', stepNumber: '03', title: 'פיתוח ובנייה', description: 'בונים עם הטכנולוגיה המתאימה, מהיר ומאובטח', animationPath: '/animations/9 build/website build.json' },
  { _id: '04', stepNumber: '04', title: 'השקה וליווי', description: 'משיקים, עוקבים אחרי ביצועים ומלווים לאורך זמן', animationPath: '/animations/11 launch/web deployment - Isometric Concept Lottie Animations.json' },
]

// Stagger container animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

// Card entrance animation
const cardVariants = {
  hidden: {
    opacity: 0,
    transform: 'translateY(40px) scale(0.95)',
  },
  visible: {
    opacity: 1,
    transform: 'translateY(0px) scale(1)',
    transition: {
      type: 'spring' as const,
      damping: 20,
      stiffness: 100,
    },
  },
}

// Number gradient animation
const numberVariants = {
  hidden: { opacity: 0, scale: 0.5, rotate: -10 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring' as const,
      damping: 12,
      stiffness: 150,
      delay: 0.1,
    },
  },
}

function StepCard({ step, index }: { step: StepItem; index: number }) {
  return (
    <m.article
      className="card-glow relative group rounded-3xl"
      style={{ '--hover-shadow': '0 16px 48px rgba(125, 211, 252, 0.20)' } as React.CSSProperties}
      variants={cardVariants}
    >
      {/* Glassmorphism card — hover shadow lives on the parent's .card-glow
          pseudo (this div clips children with overflow-hidden) */}
      <div className="relative overflow-hidden rounded-3xl p-6 md:p-8
        bg-white/70 backdrop-blur-xl
        border border-white/50
        shadow-[0_8px_32px_rgba(125,211,252,0.12),inset_0_1px_0_rgba(255,255,255,0.8)]
        transition-[transform,background-color] duration-500
        hover:bg-white/80
        hover:-translate-y-2
      ">
        {/* Large gradient number */}
        <m.div
          className="absolute -top-1 -right-1 md:-top-4 md:-right-4 select-none pointer-events-none"
          variants={numberVariants}
        >
          <span className="text-5xl md:text-8xl font-headline font-black
            bg-gradient-to-br from-sky-300 via-cyan-400 to-teal-400
            bg-clip-text text-transparent
            opacity-30 group-hover:opacity-50
            transition-opacity duration-500
          ">
            {step.stepNumber}
          </span>
        </m.div>

        {/* Decorative blob */}
        <div className="absolute -bottom-16 -left-16 w-32 h-32
          bg-gradient-to-tr from-sky-200/30 to-cyan-100/20
          rounded-full blur-2xl
          opacity-0 group-hover:opacity-100
          transition-opacity duration-700
          pointer-events-none
        " />

        {/* Lottie Animation */}
        <div className="relative z-10 mb-4 md:mb-6 flex justify-center">
          <LottieIcon
            animationPath={step.animationPath}
            size={160}
            playOnHover={true}
            loop={true}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center">
          <h3 className="text-xl md:text-2xl font-headline font-bold text-brown-dark mb-2
            group-hover:text-sky-600 transition-colors duration-300
          ">
            {step.title}
          </h3>
          <p className="text-brown-light leading-relaxed text-sm md:text-base">
            {step.description}
          </p>
        </div>

        {/* Bottom accent line */}
        <m.div
          className="absolute bottom-0 left-0 right-0 h-1
            bg-gradient-to-l from-sky-400 via-cyan-400 to-teal-400
            origin-right
          "
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 + index * 0.1, ease: 'easeOut' }}
        />
      </div>
    </m.article>
  )
}

// ONE process wave drawn across all four steps (DESIGN-UPGRADE §4.7) —
// continues the site's wave language; draws from the RIGHT (step 01, RTL)
function ProcessWave({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
  return (
    <div
      className="hidden lg:block absolute inset-x-6 top-1/2 -translate-y-1/2 pointer-events-none"
      aria-hidden="true"
    >
      <svg width="100%" height="40" viewBox="0 0 1200 40" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="processWaveGrad" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#7DD3FC" />
            <stop offset="50%" stopColor="#67E8F9" />
            <stop offset="100%" stopColor="#5EEAD4" />
          </linearGradient>
        </defs>
        <m.path
          d="M1200,20 C1120,2 1030,38 940,20 C850,2 760,38 670,20 C580,2 490,38 400,20 C310,2 220,38 130,20 C85,11 40,26 0,20"
          fill="none"
          stroke="url(#processWaveGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={prefersReducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 1.8, ease: EASE_BRAND }}
        />
      </svg>
    </div>
  )
}

export default function HowWeWork() {
  const prefersReducedMotion = useReducedMotion()
  return (
    <section
      id="process"
      className="section relative overflow-hidden py-20 md:py-28"
      aria-labelledby="how-we-work-title"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-sky-100/40 to-cyan-50/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-tr from-teal-100/30 to-sky-50/20 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        {/* Section header */}
        <m.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, transform: 'translateY(30px)' }}
          whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h2 id="how-we-work-title" className="text-4xl md:text-5xl font-headline font-bold text-brown-dark mb-4">
            איך אנחנו <span style={{ color: '#0284C7' }}>עובדים</span>
          </h2>
          <div className="section-title-accent" aria-hidden="true" />
          <p className="text-lg md:text-xl text-brown-light max-w-2xl mx-auto mt-4">
            מהרעיון ועד ההשקה: תהליך פשוט וברור
          </p>
        </m.div>

        {/* Steps grid with the single process wave behind the cards */}
        <div className="relative">
          <ProcessWave prefersReducedMotion={prefersReducedMotion} />

          <m.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            {steps.map((step, index) => (
              <StepCard key={step._id} step={step} index={index} />
            ))}
          </m.div>
        </div>

        {/* Bottom CTA suggestion */}
        <m.div
          className="text-center mt-12 md:mt-16"
          initial={{ opacity: 0, transform: 'translateY(20px)' }}
          whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <p className="text-brown-muted text-sm md:text-base">
            מוכנים להתחיל?
            <a
              href="#contact"
              className="text-[#0284C7] hover:text-[#0369A1] font-medium mx-1 hover:underline underline-offset-4 transition-colors duration-300"
            >
              דברו איתנו
            </a>
            ונתחיל בשיחת היכרות
          </p>
        </m.div>
      </div>
    </section>
  )
}
