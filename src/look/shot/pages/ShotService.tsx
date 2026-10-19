// shot · a service page (D90): one page sells one service (research SYNTHESIS, "Each service page").
// The hero sheet is the same paper as the service's label on the home page (D91: the browser morphs
// one into the other on the link), with the service's own object from the desk lying on its top
// edge. Under it, in this order, the surfaces a visitor needs before writing: why (printed on the
// table), what you get (a ruled checklist), how it goes (the ink line), what it costs (the quote
// slip), the questions (the notepad), the action, and the other services' objects.
// Every existing track() call is kept: cta_click and whatsapp_click with placement service_page.
import { useParams, Navigate } from 'react-router-dom'
import SEO from '../../../components/SEO'
import { getServiceBySlug, servicesData, PRICE_COMMON } from '../../../data/services'
import { portfolioExamples } from '../../../data/portfolio-examples'
import { SITE_URL } from '../../../data/site'
import { SERVICES } from '../../data'
import { track } from '../../../utils/analytics'
import { openChat } from '../../../components/ui/chat-event'
import { useScene } from '../../../motion/ScrollEngineProvider'
import { land } from '../camera'
import { inkLine } from '../moves'
import { posterFor } from '../eye-line'
import { Thing } from '../../parts/Things'
import { Trail, WaKey, DeskObject, Checklist, Steps, Slip, Pad, OBJECT, vt } from './kit'
import { vtMark } from '../vt'
import SeaShape from '../../sea/SeaShape'

/** The hero object's artwork size in px at 390 (the CSS sizes the Thing; this seeds the Lottie box). */
const ART = 220

/** The quiet motion every inner page shares: sheets land at half strength, the ink line draws. */
export function usePageMotion(key: string) {
  return useScene<HTMLDivElement>((t, root) => {
    root.querySelectorAll('.sp-land').forEach((el) => land(t, el, { strength: 0.5, exit: false }))
    // the hero sheet starts flat (it is the paper that arrived from the home page) and tips away
    // late, once its bottom has passed the top 18%, as the home page's sheets do (rule 3)
    const hero = root.querySelector('.sp-hero')
    if (hero) land(t, hero, { enter: false, strength: 0.5 })
    const trackEl = root.querySelector<HTMLElement>('.sp-steps__track')
    const fill = trackEl?.querySelector<HTMLElement>('.shot-line__fill')
    if (!trackEl || !fill) return
    const nodes = [...trackEl.querySelectorAll<HTMLElement>('.sp-step__node')]
    inkLine(t, {
      track: trackEl, fill, nodes, start: 'top 75%', end: 'bottom 60%',
      onReach: (r) => nodes.forEach((n, i) => n.classList.toggle('is-reached', i <= r)),
    })
  }, [key])
}

/** The other services as their objects on the table (posters only: no Lottie runs down here). */
function More({ current }: { current: string }) {
  const others = servicesData.filter((s) => s.id !== current)
  return (
    <nav className="sp-more" aria-labelledby="sp-more-title">
      <h2 id="sp-more-title" className="sp-h2" data-zone="text">עוד שירותים</h2>
      <ul>
        {others.map((s) => {
          const item = SERVICES.find((x) => x.id === s.id)
          const still = s.imageIcon ?? posterFor(item?.lottie)?.src
          return (
            <li key={s.id}>
              <a href={`/services/${s.slug}/`} className="sp-more__link" {...vtMark.to(s.id)}>
                <span className={`sp-obj sp-obj--${OBJECT[s.id]} sp-obj--small`} {...vtMark.obj(s.id)} aria-hidden="true">
                  <Thing kind={OBJECT[s.id]}>
                    {still && <span className="thing__art"><img src={still} alt="" width="120" height="120" loading="lazy" decoding="async" /></span>}
                  </Thing>
                </span>
                <span className="sp-more__name" data-zone="text">{s.title}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

/** Memory videos: the real sample plays on the page (the strongest proof the studio has). */
function Sample({ href }: { href: string }) {
  const ex = portfolioExamples.find((e) => e.slug === href.split('/').pop())
  if (!ex?.localVideoPath) return null
  return (
    <figure className="sp-sample sp-land">
      <div className="sp-sample__frame" style={{ viewTransitionName: `film-${ex.slug}` }}>
        <video src={ex.localVideoPath} controls playsInline preload="none" poster="/videos/memory-video-poster.webp" width="1280" height="720" aria-label={`דוגמה: ${ex.title}`} />
      </div>
      <figcaption data-zone="text">
        {ex.subtitle} <a className="shot-link" href={href}>על הסרטון הזה</a>
      </figcaption>
    </figure>
  )
}

export default function ShotService() {
  const { slug = '' } = useParams<{ slug: string }>()
  const service = getServiceBySlug(slug)
  const ref = usePageMotion(slug)
  if (!service) return <Navigate to="/404" replace />

  const item = SERVICES.find((s) => s.id === service.id)!
  const url = `${SITE_URL}/services/${service.slug}/`
  const wa = service.waText ?? 'היי, אשמח לשמוע פרטים.'
  const schema = [
    {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: service.faq.map((q) => ({ '@type': 'Question', name: q.question, acceptedAnswer: { '@type': 'Answer', text: q.answer } })),
    },
    {
      '@context': 'https://schema.org', '@type': 'Service', name: service.title, description: service.heroSubtitle, url,
      areaServed: { '@type': 'Country', name: 'Israel' },
      provider: { '@type': 'ProfessionalService', name: 'MediaWave Israel', url: SITE_URL, telephone: '+972528731808' },
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'ראשי', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'שירותים', item: `${SITE_URL}/#services` },
        { '@type': 'ListItem', position: 3, name: service.title, item: url },
      ],
    },
  ]

  return (
    <div ref={ref} className="sp sp--service" data-service={service.id} data-wa={wa}>
      <SEO title={service.metaTitle} description={service.metaDescription} canonical={`/services/${service.slug}`} />
      {schema.map((s, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />)}

      <div className="sp-top">
      <Trail items={[{ label: 'דף הבית', href: '/' }, { label: 'שירותים', href: '/#services' }, { label: service.title }]} />
      {/* the sea (D133, D139): this service's object, in its own slot, never under the words */}
      <SeaShape id={service.id} />

      <article className="sp-sheet sp-hero" style={vt.sheet(service.id)} aria-labelledby="sp-title">
        <div className="sp-hero__obj"><DeskObject id={service.id} item={service.id === 'memory-videos' ? { ...item, image: '/videos/memory-video-poster-640.webp', lottie: undefined } : item} size={ART} /></div>
        <div className="sp-hero__copy">
          <h1 id="sp-title" className="sp-h1" data-zone="text">{service.title}</h1>
          <p className="sp-sub" data-zone="text">{service.heroSubtitle}</p>
          <div className="sp-ctas" data-dock-hide="">
            <WaKey text={wa} placement="service_hero" />
            <a className="shot-link" href="#how" data-zone="text">איך זה עובד</a>
          </div>
          {service.tags && (
            <ul className="sp-facts" aria-label="בקצרה">
              {service.tags.map((t) => <li key={t} data-zone="text">{t}</li>)}
            </ul>
          )}
        </div>
      </article>
      </div>

      <section className="sp-sheet sp-prose sp-land" aria-label={`על ${service.title}`}>
        {service.sections.map((s) => (
          <div key={s.heading} className="sp-prose__item">
            <h2 className="sp-h2" data-zone="text">{s.heading}</h2>
            <p data-zone="text">{s.content}</p>
          </div>
        ))}
        {service.id === 'chatbots' && (
          <p className="sp-try" data-zone="text">
            את הבוט שעונה באתר הזה בנינו בעצמנו.{' '}
            <button type="button" className="shot-link" onClick={() => openChat('service_chatbots')}>נסו אותו עכשיו</button>
          </p>
        )}
      </section>

      {service.portfolioLink && <Sample href={service.portfolioLink} />}

      <div className="sp-pair">
        <Checklist title="מה מקבלים" items={service.features} />
        {service.price && <Slip title="איך נקבע המחיר" lines={[...service.price, ...PRICE_COMMON]} />}
      </div>

      <div className="sp-flow">
        {service.steps && <Steps title="איך זה עובד" steps={service.steps} time={service.time} />}
        <Pad title="שאלות" items={service.faq} />
      </div>

      <section className="sp-final" aria-labelledby="sp-final-title">
        <h2 id="sp-final-title" className="sp-big" data-zone="text">{service.cta}</h2>
        <p className="sp-final__line" data-zone="text">כותבים בוואטסאפ, ומי שעושה את העבודה עונה תוך 24 שעות בימי עסקים.</p>
        <div className="sp-final__keys" data-dock-hide="">
          <WaKey text={wa} placement="service_page" />
          <a className="shot-link" href="/#contact" data-zone="text" onClick={() => track('cta_click', { placement: 'service_page' })}>או ספרו לנו בטופס</a>
        </div>
      </section>

      <More current={service.id} />
    </div>
  )
}
