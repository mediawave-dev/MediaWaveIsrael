import { useParams, Link, Navigate } from 'react-router-dom'
import { m } from 'framer-motion'
import { ArrowRight, Check, ChevronDown, PlayCircle } from 'lucide-react'
import { useState } from 'react'
import SEO from '../SEO'
import { LottieIcon } from '../ui/LottieIcon'
import { WaveDivider } from '../ui/WaveDivider'
import { getServiceBySlug, servicesData } from '../../data/services'

export default function ServicePage() {
  const { slug } = useParams<{ slug: string }>()
  const service = slug ? getServiceBySlug(slug) : undefined

  if (!service) {
    return <Navigate to="/404" replace />
  }

  // Hero icon is larger than the home-grid card icon (more room, focal point)
  const heroIconSize = service.lottieSize ? service.lottieSize + 60 : 240

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: service.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.shortDescription,
    provider: {
      '@type': 'LocalBusiness',
      name: 'MediaWave Israel',
      url: 'https://mediawave.co.il',
    },
    areaServed: { '@type': 'Country', name: 'Israel' },
    url: `https://mediawave.co.il/services/${service.slug}`,
  }

  return (
    <>
      <SEO
        title={service.metaTitle}
        description={service.metaDescription}
        canonical={`/services/${service.slug}`}
      />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      {/* Hero */}
      <section
        className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #ecfeff 100%)',
        }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div
            className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(125, 211, 252, 0.2) 0%, transparent 70%)',
              filter: 'blur(60px)',
            }}
          />
        </div>

        <div className="container relative max-w-4xl text-center">
          {/* Breadcrumb */}
          <m.nav
            className="flex items-center justify-center gap-2 text-sm text-brown-light mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            aria-label="breadcrumb"
          >
            <Link to="/" className="hover:text-sky-ink transition-colors">
              דף הבית
            </Link>
            <span>/</span>
            <Link to="/#services" className="hover:text-sky-ink transition-colors">
              שירותים
            </Link>
            <span>/</span>
            <span className="text-brown-dark font-medium">{service.title}</span>
          </m.nav>

          {/* Icon - static SVG takes precedence over Lottie */}
          {service.imageIcon ? (
            <m.div
              className="flex justify-center mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={service.imageIcon}
                alt=""
                aria-hidden="true"
                width={heroIconSize}
                height={heroIconSize}
                className="object-contain"
                style={{ width: heroIconSize, height: heroIconSize }}
              />
            </m.div>
          ) : service.lottieAnimation ? (
            <m.div
              className="flex justify-center mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <LottieIcon
                animationPath={service.lottieAnimation}
                size={heroIconSize}
                loop
              />
            </m.div>
          ) : null}

          <m.h1
            className="text-4xl md:text-5xl lg:text-6xl font-headline leading-tight text-brown-dark mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {service.title}
          </m.h1>

          <m.p
            className="text-lg md:text-xl text-brown-light leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {service.heroSubtitle}
          </m.p>

          {service.tags && service.tags.length > 0 && (
            <m.div
              className="flex flex-wrap gap-2 justify-center mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {service.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm rounded-full"
                  style={{
                    background: 'rgba(56, 189, 248, 0.1)',
                    color: 'var(--color-sky-ink)',
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </m.div>
          )}
        </div>

        {/* Signature wave hand-off into the content */}
        <WaveDivider variant="b" fill="#F8FAFC" className="absolute bottom-0 inset-x-0" />
      </section>

      {/* Content Sections */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="container max-w-4xl">
          {service.sections.map((section, index) => (
            <m.div
              key={section.heading}
              className="mb-12 last:mb-0"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: index * 0.1 }}
            >
              <h2 className="text-2xl md:text-3xl font-headline text-brown-dark mb-4">
                {section.heading}
              </h2>
              <p className="text-lg text-brown-light leading-relaxed">{section.content}</p>
            </m.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section
        className="py-16 md:py-24"
        style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #f0f9ff 100%)' }}
      >
        <div className="container max-w-4xl">
          <m.h2
            className="text-3xl md:text-4xl font-headline text-brown-dark mb-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            מה כולל השירות
          </m.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {service.features.map((feature, index) => (
              <m.div
                key={feature}
                className="flex items-start gap-3 p-4 rounded-xl bg-white"
                style={{
                  border: '1px solid rgba(125, 211, 252, 0.2)',
                  boxShadow: 'var(--shadow-sm)',
                }}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <div
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5"
                  style={{ background: 'rgba(56, 189, 248, 0.15)' }}
                >
                  <Check size={14} style={{ color: 'var(--color-sky-ink)' }} />
                </div>
                <span className="text-brown-dark">{feature}</span>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Example Link */}
      {service.portfolioLink && (
        <section className="py-12 bg-cream">
          <div className="container max-w-4xl text-center">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block"
            >
              <Link
                to={service.portfolioLink}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:shadow-glow hover:-translate-y-0.5 text-white"
                style={{ background: 'var(--color-sky-ink)' }}
              >
                <PlayCircle size={22} />
                ראו דוגמה לפרויקט
              </Link>
            </m.div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="container max-w-3xl">
          <m.h2
            className="text-3xl md:text-4xl font-headline text-brown-dark mb-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            שאלות נפוצות
          </m.h2>

          <div className="space-y-3">
            {service.faq.map((item, index) => (
              <FaqItem key={index} question={item.question} answer={item.answer} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-16 md:py-24 text-center"
        style={{
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #ecfeff 100%)',
        }}
      >
        <div className="container max-w-3xl">
          <m.h2
            className="text-3xl md:text-4xl font-headline text-brown-dark mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {service.cta}
          </m.h2>

          <m.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <a
              href="/#contact"
              className="inline-flex items-center justify-center gap-2 text-lg font-semibold py-3.5 px-10 rounded-full shadow-lg hover:shadow-glow transition-all duration-300 bg-orange hover:bg-orange-dark"
              style={{ color: '#1e3a5f' }}
            >
              צרו קשר
            </a>
            <a
              href="https://wa.me/972528731808"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 text-lg font-semibold py-3.5 px-10 rounded-full transition-all duration-300 bg-white/80 hover:bg-white"
              style={{
                border: '1px solid rgba(125, 211, 252, 0.3)',
                color: '#2A2A2A',
              }}
            >
              שלחו הודעת WhatsApp
            </a>
          </m.div>

          {/* Back link */}
          <m.div
            className="mt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              to="/#services"
              className="inline-flex items-center gap-2 text-brown-light hover:text-sky-ink transition-colors"
            >
              <ArrowRight size={16} />
              חזרה לכל השירותים
            </Link>
          </m.div>
        </div>
      </section>

      {/* Other Services */}
      <section className="py-12 md:py-16 bg-cream">
        <div className="container max-w-4xl">
          <h3 className="text-xl font-semibold text-brown-dark mb-6 text-center">
            שירותים נוספים
          </h3>
          <div className="flex flex-wrap gap-3 justify-center">
            {servicesData
              .filter((s) => s.id !== service.id)
              .map((s) => (
                <Link
                  key={s.id}
                  to={`/services/${s.slug}`}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:shadow-md bg-white"
                  style={{
                    border: '1px solid rgba(125, 211, 252, 0.25)',
                    color: '#2A2A2A',
                  }}
                >
                  {s.title}
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  )
}

function FaqItem({
  question,
  answer,
  index,
}: {
  question: string
  answer: string
  index: number
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <m.div
      className="rounded-xl overflow-hidden bg-white"
      style={{
        border: '1px solid rgba(125, 211, 252, 0.2)',
        boxShadow: 'var(--shadow-sm)',
      }}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
    >
      <button
        className="w-full flex items-center justify-between gap-4 p-5 text-right"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="text-lg font-medium text-brown-dark">{question}</span>
        <ChevronDown
          size={20}
          className="flex-shrink-0 transition-transform duration-300"
          style={{
            color: 'var(--color-sky-ink)',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>
      <m.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <p className="px-5 pb-5 text-brown-light leading-relaxed">{answer}</p>
      </m.div>
    </m.div>
  )
}
