// shot · 404 (D90): an empty spot on the same desk. Where the page should lie there is only its
// outline on the table, the loupe looking for it, and the ways on: the services, WhatsApp, home.
// The wave pun is gone (#62 rejected the sea motif). The tel_click 'not_found' call is kept.
import SEO from '../../../components/SEO'
import { SITE_CONTACT } from '../../../data/site'
import { servicesData } from '../../../data/services'
import { WHATSAPP_URLS } from '../../../utils/whatsapp'
import { track } from '../../../utils/analytics'
import { LookButton } from '@look/button'
import './shot-pages.css'

export default function ShotNotFound() {
  return (
    <div className="sp sp--lost">
      <SEO title="העמוד לא נמצא (404)" description="העמוד שחיפשתם לא קיים, או שהכתובת השתנתה. מכאן חוזרים לדף הבית." noindex />
      <div className="sp-top sp-lost__top">
      {/* the sea: where the page should be, only the horizon (the field draws the disc in its slot) */}
      <span className="sea-spot sea-spot--lost" data-spot="horizon" aria-hidden="true" />
      <span className="sea-tag sp-lost__tag" aria-hidden="true">404 · NO SIGNAL</span>
      </div>
      <div className="sp-lost__copy">
        <h1 className="sp-h1" data-zone="text">העמוד הזה לא על השולחן</h1>
        <p className="sp-sub" data-zone="text">אולי הכתובת השתנתה, אולי היא נכתבה עם טעות. כל השאר כאן:</p>
        <div className="sp-final__keys" data-dock-hide="">
          <LookButton href="/" block zone="text">חזרה לדף הבית</LookButton>
          <a className="shot-link" href={WHATSAPP_URLS.general} target="_blank" rel="noopener noreferrer" data-zone="text"
            onClick={() => track('whatsapp_click', { placement: 'not_found' })}>כתבו לנו בוואטסאפ</a>
          <a className="shot-link" href={`tel:${SITE_CONTACT.phone.replace(/-/g, '')}`} dir="ltr" data-zone="text"
            onClick={() => track('tel_click', { placement: 'not_found' })}>{SITE_CONTACT.phone}</a>
        </div>
      </div>
      <nav className="sp-lost__more" aria-labelledby="sp-lost-more">
        <h2 id="sp-lost-more" className="sp-h3" data-zone="text">אולי חיפשתם את אחד מאלה</h2>
        <ul>
          {servicesData.map((s) => (
            <li key={s.id}><a className="shot-link" href={`/services/${s.slug}/`} data-zone="text">{s.title}</a></li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
