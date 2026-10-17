// shot · a work sample (D90): the film is the proof, so it is the page. A print of the film lies on
// the table (the same print as on the service page: D91 morphs one into the other), the note
// beside it says what came in and what was made, then one action. Labelled as a real sample.
// Every existing track() call is kept: cta_click and whatsapp_click with placement portfolio.
import { useParams, Navigate } from 'react-router-dom'
import SEO from '../../../components/SEO'
import { getPortfolioExampleBySlug } from '../../../data/portfolio-examples'
import { getServiceBySlug } from '../../../data/services'
import { SITE_URL } from '../../../data/site'
import { track } from '../../../utils/analytics'
import { Trail, WaKey } from './kit'
import { usePageMotion } from './ShotService'

export default function ShotPortfolio() {
  const { slug = '' } = useParams<{ slug: string }>()
  const ex = getPortfolioExampleBySlug(slug)
  const ref = usePageMotion(slug)
  if (!ex) return <Navigate to="/404" replace />
  const service = getServiceBySlug(ex.serviceSlug)
  const wa = service?.waText ?? 'היי, אשמח לשמוע פרטים.'
  const crumbs = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ראשי', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: ex.serviceTitle, item: `${SITE_URL}/services/${ex.serviceSlug}` },
      { '@type': 'ListItem', position: 3, name: ex.title, item: `${SITE_URL}/portfolio/${ex.slug}` },
    ],
  }
  const video = {
    '@context': 'https://schema.org', '@type': 'VideoObject', name: ex.title, description: ex.subtitle,
    thumbnailUrl: `${SITE_URL}/videos/memory-video-poster.webp`, contentUrl: ex.localVideoPath ? `${SITE_URL}${ex.localVideoPath}` : undefined,
    uploadDate: '2026-01-01', duration: 'PT2M7S',
  }

  return (
    <div ref={ref} className="sp sp--work">
      <SEO title={ex.metaTitle} description={ex.metaDescription} canonical={`/portfolio/${ex.slug}`} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      {ex.localVideoPath && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(video) }} />}

      <Trail items={[{ label: 'דף הבית', href: '/' }, { label: ex.serviceTitle, href: `/services/${ex.serviceSlug}` }, { label: 'דוגמה' }]} />

      <header className="sp-work__head">
        <p className="sp-kicker" data-zone="text">דוגמה אמיתית</p>
        <h1 className="sp-h1" data-zone="text">{ex.title}</h1>
        <p className="sp-sub" data-zone="text">{ex.subtitle}</p>
      </header>

      {ex.localVideoPath && (
        <figure className="sp-sample sp-sample--hero">
          <div className="sp-sample__frame" style={{ viewTransitionName: `film-${ex.slug}` }}>
            <video src={ex.localVideoPath} controls playsInline preload="none" width="1280" height="720"
              poster="/videos/memory-video-poster.webp" aria-label={ex.title} />
          </div>
        </figure>
      )}

      <section className="sp-sheet sp-note sp-land" aria-labelledby="sp-note-title">
        <h2 id="sp-note-title" className="sp-h2" data-zone="text">על הסרטון</h2>
        <p data-zone="text">{ex.description}</p>
        <ul className="sp-facts sp-note__facts" aria-label="מה יש בסרטון">
          {ex.tags.map((t) => <li key={t} data-zone="text">{t}</li>)}
        </ul>
      </section>

      <section className="sp-final" aria-labelledby="sp-final-title">
        <h2 id="sp-final-title" className="sp-big" data-zone="text">רוצים סרטון כזה?</h2>
        <p className="sp-final__line" data-zone="text">שולחים תמונות בוואטסאפ, ומקבלים סרטון לאירוע. עונים תוך 24 שעות בימי עסקים.</p>
        <div className="sp-final__keys" data-dock-hide="">
          <WaKey text={wa} placement="portfolio" />
          <a className="shot-link" href="/#contact" data-zone="text" onClick={() => track('cta_click', { placement: 'portfolio' })}>או ספרו לנו בטופס</a>
          <a className="shot-link" href={`/services/${ex.serviceSlug}`} data-zone="text">איך זה עובד ואיך נקבע המחיר</a>
        </div>
      </section>
    </div>
  )
}
