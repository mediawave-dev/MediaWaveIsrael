import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { projects, type Project } from '../../data/projects'
import { ExternalLink } from 'lucide-react'

// --- Animation variants (RTL-aware: horizontal enters from right = negative x) ---

const featureListVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.4,
    },
  },
}

const featureItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
}

const tagVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.2,
    },
  },
}

const tagItemVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: 'easeOut' as const },
  },
}

// --- Featured Project Card (asymmetric layout for single/primary project) ---

function FeaturedProject({ project }: { project: Project }) {
  const cardRef = useRef<HTMLDivElement>(null)

  return (
    <motion.div
      ref={cardRef}
      className="relative"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
    >
      <div className="relative grid lg:grid-cols-12 gap-8 lg:gap-0 items-center">
        {/* Screenshot side - 7 columns on desktop */}
        <div className="lg:col-span-7 relative z-10">
          {/* Browser window frame */}
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl overflow-hidden group"
            whileHover={{ boxShadow: '0 30px 60px -12px rgba(74, 74, 74, 0.15), 0 0 40px rgba(245, 166, 35, 0.08)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Browser header */}
            <div className="bg-cream-dark px-4 py-3 flex items-center gap-3 border-b border-cream-darker">
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-coral/60" />
                <span className="w-3 h-3 rounded-full bg-orange/60" />
                <span className="w-3 h-3 rounded-full bg-sage/60" />
              </div>
              <div
                className="flex-1 bg-cream rounded-md px-3 py-1.5 text-sm text-brown-muted text-center font-english"
                dir="ltr"
              >
                {project.url.replace('https://www.', '').replace('https://', '')}
              </div>
            </div>

            {/* Screenshot with hover effects */}
            <div className="relative overflow-hidden">
              <motion.img
                src={project.image}
                alt={`${project.title} - ${project.type}`}
                width={800}
                height={600}
                className="w-full h-auto block"
                loading="lazy"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              />

              {/* Overlay gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-brown-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* View site button on hover */}
              {!project.selfLink && (
                <motion.a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white text-brown-dark font-semibold px-6 py-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-orange hover:text-white flex items-center gap-2"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span>צפה באתר</span>
                  <ExternalLink size={18} />
                </motion.a>
              )}
            </div>
          </motion.div>

          {/* Single decorative glow (one orchestrated accent, not multiple scattered) */}
          <div
            className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-orange/8 blur-3xl -z-10 pointer-events-none"
          />
        </div>

        {/* Info side - 5 columns, overlaps slightly (RTL: enters from right = negative x) */}
        <motion.div
          className="lg:col-span-5 lg:-mr-12 relative z-20"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 lg:p-10 shadow-xl border border-cream-darker/50">
            {/* Project type badge */}
            <span className="inline-flex items-center gap-2 bg-terracotta/10 text-terracotta text-sm font-semibold px-4 py-2 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-terracotta rounded-full" />
              {project.type}
            </span>

            {/* Project title */}
            <h3 className="text-3xl md:text-4xl font-english font-semibold text-brown-dark mb-4">
              {project.title}
            </h3>

            {/* Description */}
            <p className="text-lg text-brown-light leading-relaxed mb-6">
              {project.description}
            </p>

            {/* Tech tags — staggered entrance */}
            <div className="mb-8">
              <span className="text-sm font-semibold text-brown-dark block mb-3">טכנולוגיות:</span>
              <motion.div
                className="flex flex-wrap gap-2"
                variants={tagVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {project.tags.map((tag) => (
                  <motion.span
                    key={tag}
                    variants={tagItemVariants}
                    className="bg-cream-dark text-brown text-sm px-3 py-1.5 rounded-lg border border-cream-darker/40 hover:border-orange/30 hover:bg-orange/5 transition-colors duration-200"
                  >
                    {tag}
                  </motion.span>
                ))}
              </motion.div>
            </div>

            {/* Features — staggered list with variants (RTL: enter from right) */}
            {project.features && project.features.length > 0 && (
              <motion.div
                className="space-y-3 mb-8"
                variants={featureListVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <span className="text-sm font-semibold text-brown-dark block mb-3">
                  מאפיינים עיקריים:
                </span>
                {project.features.map((feature) => (
                  <motion.div
                    key={feature}
                    className="flex items-center gap-3 text-brown-light"
                    variants={featureItemVariants}
                  >
                    <span className="w-2 h-2 bg-orange rounded-full flex-shrink-0" />
                    <span>{feature}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* CTA Button — spring hover for tactile feel */}
            {project.selfLink ? (
              <motion.a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className="inline-flex items-center gap-2 bg-orange font-semibold px-6 py-3 rounded-full shadow-sm hover:shadow-glow transition-shadow duration-300"
                style={{ color: '#FFFFFF' }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <span>אתם כבר כאן</span>
              </motion.a>
            ) : (
              <motion.a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-orange font-semibold px-6 py-3 rounded-full shadow-sm hover:shadow-glow transition-shadow duration-300 group"
                style={{ color: '#FFFFFF' }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <span>צפה באתר</span>
                <ExternalLink
                  size={18}
                  className="transition-transform duration-300 group-hover:-translate-x-1"
                />
              </motion.a>
            )}
          </div>
        </motion.div>
      </div>

      {/* Connecting decorative line */}
      <svg
        className="absolute top-1/2 left-0 w-full h-40 pointer-events-none opacity-20 hidden lg:block -translate-y-1/2"
        viewBox="0 0 1000 160"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M0,80 Q250,20 500,80 T1000,60"
          fill="none"
          stroke="var(--color-terracotta)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="8 12"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />
      </svg>
    </motion.div>
  )
}

// --- Grid Project Card (for additional projects) ---

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      className="group relative bg-white rounded-2xl shadow-md overflow-hidden border border-cream-darker/30"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.12, ease: 'easeOut' }}
      whileHover={{ y: -6, boxShadow: '0 20px 40px -10px rgba(74, 74, 74, 0.12)' }}
    >
      {/* Browser mockup header */}
      <div className="bg-cream-dark px-3 py-2 flex items-center gap-2 border-b border-cream-darker">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-coral/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-orange/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-sage/60" />
        </div>
        <div
          className="flex-1 bg-cream rounded px-2 py-1 text-xs text-brown-muted text-center font-english"
          dir="ltr"
        >
          {project.url.replace('https://www.', '').replace('https://', '')}
        </div>
      </div>

      {/* Screenshot */}
      <div className="relative overflow-hidden h-48">
        <motion.img
          src={project.image}
          alt={`${project.title} - ${project.type}`}
          width={400}
          height={192}
          className="w-full h-full object-cover object-top"
          loading="lazy"
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      {/* Content */}
      <div className="p-6">
        <span className="inline-flex items-center gap-1.5 bg-terracotta/10 text-terracotta text-xs font-semibold px-3 py-1 rounded-full mb-3">
          <span className="w-1 h-1 bg-terracotta rounded-full" />
          {project.type}
        </span>

        <h3 className="text-xl font-english font-semibold text-brown-dark mb-2">
          {project.title}
        </h3>

        <p className="text-brown-light text-sm leading-relaxed mb-4 line-clamp-3">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="bg-cream-dark text-brown text-xs px-2.5 py-1 rounded-md border border-cream-darker/40"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        {project.selfLink ? (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="inline-flex items-center gap-2 text-orange font-semibold text-sm hover:text-orange-dark transition-colors"
          >
            <span>אתם כבר כאן</span>
          </a>
        ) : (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-orange font-semibold text-sm hover:text-orange-dark transition-colors group/link"
          >
            <span>צפה באתר</span>
            <ExternalLink size={14} className="transition-transform group-hover/link:-translate-x-0.5" />
          </a>
        )}
      </div>
    </motion.div>
  )
}

// --- Grid layout logic ---

function getGridClass(count: number): string {
  if (count <= 1) return 'max-w-2xl mx-auto'
  if (count <= 3) return 'grid md:grid-cols-2 gap-8'
  return 'grid md:grid-cols-2 lg:grid-cols-3 gap-8'
}

// --- Main Portfolio Section ---

export default function Portfolio() {
  const containerRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const bgY1 = useTransform(scrollYProgress, [0, 1], [0, -60])
  const bgY2 = useTransform(scrollYProgress, [0, 1], [0, 80])

  const featured = projects.find((p) => p.featured)
  const additional = projects.filter((p) => !p.featured)

  return (
    <section
      ref={containerRef}
      id="portfolio"
      aria-label="תיק עבודות"
      className="relative py-16 md:py-24 bg-cream overflow-hidden"
    >
      {/* Background decorations — parallax blurs for depth */}
      <motion.div
        className="absolute top-20 left-[10%] w-80 h-80 pointer-events-none"
        style={{ y: bgY1 }}
      >
        <div className="w-full h-full rounded-full bg-orange/6 blur-3xl" />
      </motion.div>
      <motion.div
        className="absolute bottom-32 right-[5%] w-64 h-64 pointer-events-none"
        style={{ y: bgY2 }}
      >
        <div className="w-full h-full rounded-full bg-terracotta/6 blur-3xl" />
      </motion.div>

      <div className="container relative">
        {/* Section Header — RTL: horizontal animations enter from right (negative x) */}
        <div className="max-w-2xl mb-12 md:mb-16">
          <motion.span
            className="inline-flex items-center gap-2 bg-terracotta/10 text-terracotta text-sm font-semibold px-5 py-2.5 rounded-full mb-6 backdrop-blur-sm"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <span className="w-2 h-2 bg-terracotta rounded-full animate-pulse" />
            העבודות שלנו
          </motion.span>

          <div className="relative">
            <motion.h2
              className="text-h2 mb-6"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              {projects.length === 1 ? 'פרויקט לדוגמה' : 'פרויקטים נבחרים'}
            </motion.h2>

            <motion.svg
              className="absolute -bottom-2 right-0 w-48 h-4"
              viewBox="0 0 200 12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <motion.path
                d="M2 8 Q50 2 100 6 T198 4"
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

          <motion.p
            className="text-lg md:text-xl text-brown-light leading-relaxed mt-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          >
            {projects.length === 1
              ? 'דוגמה לפרויקט שמציג את הגישה שלנו לפיתוח ועיצוב אתרים מקצועיים. כל פרויקט נבנה בהתאמה אישית עם דגש על עיצוב ייחודי וחוויית משתמש מעולה.'
              : 'מבחר עבודות שמציגות את הגישה שלנו לפיתוח ועיצוב אתרים מקצועיים'}
          </motion.p>
        </div>

        {/* Featured project — full asymmetric layout */}
        {featured && <FeaturedProject project={featured} />}

        {/* Additional projects — grid */}
        {additional.length > 0 && (
          <div className={`mt-16 ${getGridClass(additional.length)}`}>
            {additional.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          className="mt-12 md:mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
        >
          <p className="text-brown-light mb-6 text-xl">
            רוצים אתר כזה לעסק שלכם?
          </p>
          <motion.a
            href="#contact"
            className="inline-flex items-center gap-3 bg-orange/10 text-orange font-semibold px-8 py-3.5 rounded-full hover:bg-orange hover:text-white transition-colors duration-300 group"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <span>בואו נדבר על הפרויקט שלכם</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="rotate-180 transition-transform duration-300 group-hover:-translate-x-1"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </motion.a>
        </motion.div>
      </div>

      {/* Bottom wave transition */}
      <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none">
        <svg
          className="absolute bottom-0 w-full h-full"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0,30 C480,70 960,10 1440,40 L1440,80 L0,80 Z"
            fill="var(--color-cream-dark)"
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
