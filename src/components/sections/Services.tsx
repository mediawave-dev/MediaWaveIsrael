import { useRef } from 'react'
import { m, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { PlayCircle } from 'lucide-react'
import { LottieIcon, WaveDivider } from '../ui'
import { useAmbientMotion } from '../../hooks/useReducedMotion'
import { useReveal, useRevealFactory } from '../../config/reveal'
import { servicesData, type ServicePageData } from '../../data/services'

export default function Services() {
  // Animate the blurred orbs only while the section is actually on screen
  // (blur(60px) repaints offscreen are pure CPU waste on mobile)
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { margin: '200px' })
  const ambient = useAmbientMotion()
  const orbsActive = isInView && ambient
  // Header stays restrained (fadeUp); the tiles pop to scale (see ServiceCard)
  const reveal = useRevealFactory()

  return (
    <section
      ref={sectionRef}
      id="services"
      aria-label="שירותים"
      className="relative py-16 md:py-24 overflow-clip"
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

      {/* Wave hand-offs: from WhyUs above, into the next section below */}
      <WaveDivider variant="c" flip fill="#F1F5F9" className="absolute top-0 inset-x-0" />
      <WaveDivider variant="b" fill="#1E293B" className="absolute bottom-0 inset-x-0" />

      <div className="container relative max-w-6xl">
        {/* Header */}
        <div className="mb-10 md:mb-16 text-center">
          <m.h2
            className="text-4xl md:text-5xl font-headline leading-tight text-brown-dark mb-4"
            {...reveal('fadeUp', 0.1)}
          >
            מה אנחנו <span style={{ color: '#0284C7' }}>עושים</span>
          </m.h2>

          <div className="section-title-accent" aria-hidden="true" />

          <m.p
            className="text-lg md:text-xl text-brown-light leading-relaxed max-w-lg mx-auto mt-4"
            {...reveal('fadeUp', 0.2)}
          >
            מהרעיון ועד להשקה, אנחנו מלווים אתכם בכל שלב.
          </m.p>
        </div>

        {/* 6 services, 3-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {servicesData.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <m.div
          className="mt-10 md:mt-20 text-center"
          {...reveal('fadeUp', 0, { distance: 30 })}
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
              animate={ambient ? { x: [0, -4, 0] } : undefined}
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

// Solid system card (glass removed — decision 41; blur x6 was mobile GPU waste)
function ServiceCard({ service, index }: { service: ServicePageData; index: number }) {
  const hasImage = !!service.imageIcon
  const hasLottie = !hasImage && !!service.lottieAnimation
  // ~20% larger than the data value, keeping each icon's own proportion
  const iconSize = Math.round((service.lottieSize ?? 180) * 1.2)

  return (
    <m.div
      className="card-glow relative group rounded-xl overflow-visible h-full bg-white transition-transform duration-500 hover:-translate-y-[6px]"
      style={{
        border: '1px solid rgba(125, 211, 252, 0.2)',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.03)',
      }}
      {...useReveal('scaleIn', index * 0.1)}
    >
      {/* Blue accent top border */}
      <div
        className="absolute top-0 inset-x-0 h-[3px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right"
        style={{ background: 'linear-gradient(90deg, #BAE6FD, #BAE6FD)' }}
      />

      {/* Spec-sheet numbering (DESIGN-UPGRADE §4.5) */}
      <span
        className="absolute top-3 right-4 font-mono-spec text-sm select-none"
        style={{ color: '#0284C7' }}
        dir="ltr"
        aria-hidden="true"
      >
        {String(index + 1).padStart(2, '0')}·
      </span>

      {/* Card content */}
      <div className="p-4 md:p-6 text-center flex flex-col h-full">
        {/* Icon - Lottie or static SVG, same container for all */}
        <div className="h-44 md:h-56 flex items-center justify-center mb-3 md:mb-5 overflow-visible">
          {hasImage ? (
            <img
              src={service.imageIcon}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className="object-contain transition-transform duration-300 scale-[0.8] md:scale-100 md:group-hover:scale-105"
              style={{ width: iconSize, height: iconSize }}
            />
          ) : hasLottie ? (
            <div
              className="flex items-center justify-center transition-transform duration-300 scale-[0.8] md:scale-100 md:group-hover:scale-105"
              style={{ width: iconSize, height: iconSize }}
            >
              <LottieIcon
                animationPath={service.lottieAnimation}
                size={iconSize}
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
          {service.shortDescription}
        </p>

        {/* Actions — pinned to the bottom so cards align */}
        <div className="mt-auto flex flex-col items-center gap-3">
          {/* Portfolio example — only where a real work sample exists (memory
              videos). The strongest trust signal on the card, so it leads. */}
          {service.portfolioLink && (
            <Link
              to={service.portfolioLink}
              className="relative z-10 inline-flex items-center justify-center gap-2 text-sm font-semibold py-2.5 px-6 rounded-full text-white transition-[color,background-color,box-shadow,transform] duration-300 hover:shadow-glow hover:-translate-y-0.5"
              style={{ background: 'var(--color-sky-ink)' }}
              aria-label={`ראו דוגמה לפרויקט: ${service.title}`}
            >
              <PlayCircle size={16} aria-hidden="true" />
              ראו דוגמה לפרויקט
            </Link>
          )}

          {/* Read more — hover-only underline, sky-ink for AA on white */}
          <Link
            to={`/services/${service.slug}`}
            className="relative z-10 inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-sky-ink hover:text-sky-ink-strong transition-colors group/link"
            aria-label={`קראו עוד על ${service.title}`}
          >
            <span className="group-hover/link:underline underline-offset-4">קראו עוד</span>
            <span aria-hidden="true">←</span>
          </Link>
        </div>
      </div>

      {/* Hover tint wipe — clip-path reveal from the right (RTL), §4.5 */}
      <div
        className="wipe-overlay absolute inset-0 rounded-xl pointer-events-none"
        style={{
          background: 'linear-gradient(225deg, rgba(125, 211, 252, 0.14) 0%, rgba(125, 211, 252, 0.03) 55%, transparent 80%)',
        }}
      />
    </m.div>
  )
}
