// sun · the inner pages (D237): a service, a sample, the three legal pages and the 404, all on the
// same bright sheet. The data and the legal text are the existing ones (src/data, TermsBody and friends);
// only the presentation is new.
import type { ReactNode } from 'react'
import { useParams } from 'react-router-dom'
import SEO from '../components/SEO'
import { SITE_URL } from '../data/site'
import { getServiceBySlug, PRICE_COMMON } from '../data/services'
import { getPortfolioExampleBySlug } from '../data/portfolio-examples'
import { getWhatsAppUrl } from '../utils/whatsapp'
import { TermsBody } from '../components/pages/Terms'
import { PrivacyBody } from '../components/pages/Privacy'
import { AccessibilityBody } from '../components/pages/Accessibility'
import { Contact, H2, WhatsAppButton } from './Home'
import { IconCheck, IconChevron } from './icons'

function Crumbs({ name, path }: { name: string; path: string }) {
  const ld = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ראשי', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name, item: `${SITE_URL}${path}/` },
    ],
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <nav className="crumbs" aria-label="מיקום באתר"><a href="/">דף הבית</a><span aria-hidden="true">/</span><span aria-current="page">{name}</span></nav>
    </>
  )
}

function PageHero({ name, path, title, lede, children }: { name: string; path: string; title: string; lede?: string; children?: ReactNode }) {
  return (
    <section className="phero">
      <div className="wrap wrap--narrow">
        <Crumbs name={name} path={path} />
        <h1 className="h1 h1--page">{title}</h1>
        {lede && <p className="lede">{lede}</p>}
        {children}
      </div>
    </section>
  )
}

export function NotFound() {
  return (
    <>
      <SEO title="הדף לא נמצא" description="הדף שחיפשתם לא נמצא." noindex />
      <PageHero name="הדף לא נמצא" path="/404" title="הדף הזה לא נמצא." lede="ייתכן שהכתובת השתנתה. דף הבית מראה את כל מה שאנחנו בונים.">
        <div className="phero__actions"><a className="btn btn--ink" href="/"><span>לדף הבית</span></a><WhatsAppButton placement="404" tone="paper" /></div>
      </PageHero>
    </>
  )
}

export function Service() {
  const { slug = '' } = useParams()
  const s = getServiceBySlug(slug)
  if (!s) return <NotFound />
  const path = `/services/${s.slug}`
  const waHref = getWhatsAppUrl(s.waText ?? 'היי, אשמח לשמוע פרטים.')
  const ld = {
    '@context': 'https://schema.org', '@type': 'Service', name: s.title, description: s.metaDescription,
    provider: { '@type': 'ProfessionalService', name: 'MediaWave Israel', url: SITE_URL }, areaServed: 'IL', url: `${SITE_URL}${path}/`,
  }
  const faqLd = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: s.faq.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
  }
  return (
    <>
      <SEO title={s.metaTitle} description={s.metaDescription} canonical={path} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      {s.faq.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}
      <PageHero name={s.title} path={path} title={s.title} lede={s.heroSubtitle}>
        <div className="phero__actions"><WhatsAppButton href={waHref} placement={`service_${s.slug}_hero`} /></div>
      </PageHero>

      <section className="band">
        <div className="wrap wrap--narrow prose-blocks">
          {s.sections.map((b) => (<div key={b.heading}><h2 className="h3">{b.heading}</h2><p>{b.content}</p></div>))}
        </div>
      </section>

      <section className="band band--cream">
        <div className="wrap wrap--narrow">
          <H2>מה |מקבלים?</H2>
          <ul className="ticks ticks--cols">{s.features.map((f) => <li key={f}><IconCheck width={18} height={18} /><span>{f}</span></li>)}</ul>
          {s.portfolioLink && <p className="after"><a className="more" href={s.portfolioLink}><span>לצפייה בסרטון לדוגמה</span></a></p>}
        </div>
      </section>

      {s.steps && (
        <section className="band band--blue">
          <div className="wrap">
            <H2>איך זה |עובד?</H2>
            <ol className="route" data-n={s.steps.length}>
              {s.steps.map((st, i) => (<li key={st.title} className="route__stop"><span className="route__n" aria-hidden="true">{i + 1}</span><h3 className="h3">{st.title}</h3><p>{st.line}</p></li>))}
            </ol>
            {s.time && <p className="route__time">{s.time}</p>}
          </div>
        </section>
      )}

      <section className="band">
        <div className="wrap wrap--narrow">
          <H2>כמה זה |עולה?</H2>
          <ul className="ticks">{[...(s.price ?? []), ...PRICE_COMMON].map((l) => <li key={l}><IconCheck width={18} height={18} /><span>{l}</span></li>)}</ul>
        </div>
      </section>

      {s.faq.length > 0 && (
        <section className="band band--line">
          <div className="wrap wrap--narrow">
            <H2>שאלות |שחוזרות</H2>
            <div className="faq">
              {s.faq.map((f) => (<details key={f.question} className="faq__item"><summary><span>{f.question}</span><IconChevron /></summary><p>{f.answer}</p></details>))}
            </div>
          </div>
        </section>
      )}
      {/* the closing question in two weights like every heading; the form's message is the service's own */}
      <Contact h2={s.cta.replace(/^(רוצים|יש לכם) /, '$1 |')} waHref={waHref} ask={s.waText?.replace(/^היי,\s*/, '')} />
    </>
  )
}

export function Sample() {
  const { slug = '' } = useParams()
  const p = getPortfolioExampleBySlug(slug)
  if (!p) return <NotFound />
  const path = `/portfolio/${p.slug}`
  return (
    <>
      <SEO title={p.metaTitle} description={p.metaDescription} canonical={path} />
      <PageHero name={p.title} path={path} title={p.title} lede={p.subtitle} />
      <section className="band">
        <div className="wrap wrap--narrow">
          {p.localVideoPath && (
            <video className="sample__video" controls playsInline preload="none" poster="/videos/memory-video-poster.webp">
              <source src={p.localVideoPath} type="video/mp4" />
            </video>
          )}
          <p className="sample__text">{p.description}</p>
          <ul className="tags">{p.tags.map((t) => <li key={t}>{t}</li>)}</ul>
          <p className="after"><a className="more" href={`/services/${p.serviceSlug}/`}><span>עוד על השירות</span></a></p>
        </div>
      </section>
      <Contact h2="רוצים |סרטון כזה?" waHref={getWhatsAppUrl('היי, אשמח לשמוע על סרטון זיכרונות.')} ask="אשמח לשמוע על סרטון זיכרונות." />
    </>
  )
}

function Legal({ name, path, updated, description, children }: { name: string; path: string; updated: string; description: string; children: ReactNode }) {
  return (
    <>
      <SEO title={name} description={description} canonical={path} />
      <PageHero name={name} path={path} title={name} lede={`עודכן לאחרונה: ${updated}`} />
      <section className="band"><div className="wrap wrap--narrow legal">{children}</div></section>
    </>
  )
}

export const Terms = () => (
  <Legal name="תקנון שימוש" path="/terms" updated="ינואר 2026" description="תקנון השימוש של MediaWave Israel: תנאי שימוש באתר ושירותי פיתוח אתרים."><TermsBody /></Legal>
)
export const Privacy = () => (
  <Legal name="מדיניות פרטיות" path="/privacy" updated="ינואר 2026" description="מדיניות הפרטיות של MediaWave Israel: איזה מידע נאסף באתר ואיך משתמשים בו."><PrivacyBody /></Legal>
)
export const Accessibility = () => (
  <Legal name="הצהרת נגישות" path="/accessibility" updated="נובמבר 2026" description="הצהרת הנגישות של MediaWave Israel: התאמות הנגישות באתר ודרכי פנייה."><AccessibilityBody /></Legal>
)
