import { useParams, Link, Navigate } from 'react-router-dom'
import { m } from 'framer-motion'
import { ArrowRight, Play } from 'lucide-react'
import SEO from '../SEO'
import { WaveDivider } from '../ui/WaveDivider'
import { getPortfolioExampleBySlug } from '../../data/portfolio-examples'

export default function PortfolioExample() {
  const { slug } = useParams<{ slug: string }>()
  const example = slug ? getPortfolioExampleBySlug(slug) : undefined

  if (!example) {
    return <Navigate to="/404" replace />
  }

  return (
    <>
      <SEO
        title={example.metaTitle}
        description={example.metaDescription}
        canonical={`/portfolio/${example.slug}`}
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
            <Link
              to={`/services/${example.serviceSlug}`}
              className="hover:text-sky-ink transition-colors"
            >
              {example.serviceTitle}
            </Link>
            <span>/</span>
            <span className="text-brown-dark font-medium">דוגמה לפרויקט</span>
          </m.nav>

          <m.span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-6"
            style={{
              background: 'rgba(56, 189, 248, 0.1)',
              color: 'var(--color-sky-ink)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            דוגמה לפרויקט
          </m.span>

          <m.h1
            className="text-4xl md:text-5xl lg:text-6xl font-headline leading-tight text-brown-dark mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {example.title}
          </m.h1>

          <m.p
            className="text-lg md:text-xl text-brown-light leading-relaxed max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {example.subtitle}
          </m.p>

          <m.div
            className="flex flex-wrap gap-2 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {example.tags.map((tag) => (
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
        </div>

        {/* Signature wave hand-off into the content */}
        <WaveDivider variant="b" fill="#F8FAFC" className="absolute bottom-0 inset-x-0" />
      </section>

      {/* Video Section */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="container max-w-4xl">
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {example.localVideoPath ? (
              <video
                src={example.localVideoPath}
                controls
                playsInline
                preload="metadata"
                className="w-full rounded-2xl shadow-lg"
                style={{ maxHeight: '70vh' }}
              >
                הדפדפן שלך אינו תומך בהפעלת וידאו.
              </video>
            ) : example.videoUrl ? (
              <div
                className="relative w-full rounded-2xl overflow-hidden shadow-lg"
                style={{ paddingBottom: '56.25%' /* 16:9 */ }}
              >
                <iframe
                  src={example.videoUrl}
                  title={example.title}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <VideoPlaceholder title={example.title} />
            )}
          </m.div>
        </div>
      </section>

      {/* Description */}
      <section
        className="py-16 md:py-20"
        style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #f0f9ff 100%)' }}
      >
        <div className="container max-w-3xl">
          <m.h2
            className="text-2xl md:text-3xl font-headline text-brown-dark mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            על הפרויקט
          </m.h2>
          <m.p
            className="text-lg text-brown-light leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            {example.description}
          </m.p>
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
            className="text-3xl md:text-4xl font-headline text-brown-dark mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            רוצים סרטון כזה?
          </m.h2>
          <m.p
            className="text-lg text-brown-light mb-8"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            שלחו לנו את התמונות ונתחיל לעבוד
          </m.p>

          <m.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
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

          <m.div
            className="mt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link
              to={`/services/${example.serviceSlug}`}
              className="inline-flex items-center gap-2 text-brown-light hover:text-sky-ink transition-colors"
            >
              <ArrowRight size={16} />
              חזרה לדף {example.serviceTitle}
            </Link>
          </m.div>
        </div>
      </section>
    </>
  )
}

function VideoPlaceholder({ title }: { title: string }) {
  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden flex items-center justify-center"
      style={{
        paddingBottom: '56.25%',
        background: 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)',
        border: '2px dashed rgba(125, 211, 252, 0.4)',
      }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(125, 211, 252, 0.15)' }}
        >
          <Play size={36} style={{ color: 'var(--color-sky-ink)' }} />
        </div>
        <p className="text-brown-light text-lg text-center px-8">{title}</p>
        <p className="text-brown-muted text-sm">הסרטון יופיע כאן בקרוב</p>
      </div>
    </div>
  )
}
