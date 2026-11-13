// sun · the inner pages (D237): a service, a sample, the three legal pages and the 404, all on the
// same bright sheet. The data and the legal text are the existing ones (src/data, TermsBody and friends);
// only the presentation is new.
// D253: a service page is the customer's own questions in the order they ask them. The promise and two
// cards of our work; one or two questions; the price as the written quote we really send; what happens
// after they write; the questions left; the form. Nothing else.
// D254: the four side services are the same page at about half the length (no steps), and the memory
// film's sample stands on its service page as the answer to "what does one look like".
// After two reviewers (13.11.2026): the slip answers first (how the price is set stands right under its name)
// and says "כלול במחיר" once; a page shows cards only of the kind of work it is about; the older page's
// fallbacks are gone, since every service carries the page's own fields.
import type { ReactNode } from 'react'
import { useParams } from 'react-router-dom'
import SEO from '../components/SEO'
import { SITE_URL } from '../data/site'
import { getServiceBySlug, PRICE_COMMON, type ServicePageData, type ServiceQuote } from '../data/services'
import { getPortfolioExampleByService, getPortfolioExampleBySlug, type PortfolioExampleData } from '../data/portfolio-examples'
import { getWhatsAppUrl } from '../utils/whatsapp'
import { TermsBody } from '../components/pages/Terms'
import { PrivacyBody } from '../components/pages/Privacy'
import { AccessibilityBody } from '../components/pages/Accessibility'
import { Contact, H2, WhatsAppButton } from './Home'
import { VoiceAt } from './Proof'
import { IconChevron, IconChevrons } from './icons'

/** "light|heavy": the two weights every heading is said in. No bar: all of it heavy. */
const weights = (t: string): [string, string] => { const i = t.indexOf('|'); return i < 0 ? ['', t] : [t.slice(0, i), t.slice(i + 1)] }
const plain = (t: string) => t.replace('|', '')
/** A range and its unit stay on one line ("2 עד 3 דקות"): broken in the middle it reads as two numbers. */
const tie = (t: string) => t.replace(/(\d+) עד (\d+)( (?=\S))?/g, (_, a, b, unit) => `${a}\u00A0עד\u00A0${b}${unit ? '\u00A0' : ''}`)
/** *stars* in a line of the quote: the one number worth a highlight */
const marked = (t: string) => tie(t).split('*').map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part))

/** Where the page stands. `via` is a page between the home page and this one; `here` is the word for this
    page on the line itself (the structured data keeps the full name). A page without an address of its own
    (the 404) passes `listed={false}` and gets the line without the structured data. */
function Crumbs({ name, path, via, here = name, listed = true }: { name: string; path: string; via?: { name: string; path: string }; here?: string; listed?: boolean }) {
  const trail = [{ name: 'ראשי', path: '' }, ...(via ? [via] : []), { name, path }]
  const ld = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, item: `${SITE_URL}${t.path}/` })),
  }
  return (
    <>
      {listed && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />}
      <nav className="crumbs" aria-label="מיקום באתר">
        <a href="/">דף הבית</a><span aria-hidden="true">/</span>
        {via && <><a href={`${via.path}/`}>{via.name}</a><span aria-hidden="true">/</span></>}
        <span aria-current="page">{here}</span>
      </nav>
    </>
  )
}

/** The top of a page without pictures. A title with a bar is said in two weights, as on the service pages. */
function PageHero({ name, path, title, lede, via, here, listed, children }: { name: string; path: string; title: string; lede?: string; via?: { name: string; path: string }; here?: string; listed?: boolean; children?: ReactNode }) {
  const [light, heavy] = weights(title)
  return (
    <section className="phero">
      <div className="wrap wrap--narrow">
        <Crumbs name={name} path={path} via={via} here={here} listed={listed} />
        {light ? <h1 className="h1 h1--page h1--two">{light}<b>{heavy}</b></h1> : <h1 className="h1 h1--page">{title}</h1>}
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
      <PageHero name="הדף לא נמצא" path="/404" listed={false} title={'הדף הזה |לא\u00A0נמצא.'} lede="ייתכן שהכתובת השתנתה. דף הבית מראה את כל מה שאנחנו בונים.">
        <div className="phero__actions"><a className="btn btn--ink" href="/"><span>לדף הבית</span><IconChevrons /></a><WhatsAppButton placement="404" tone="paper" /></div>
      </PageHero>
    </>
  )
}

/** A sample film in the frame the wheel's cards wear. Nothing of it is downloaded until it is played. */
function Film({ p }: { p: PortfolioExampleData }) {
  if (!p.localVideoPath) return null
  return (
    <video className="film" controls playsInline preload="none" width={1280} height={720} poster={p.poster} aria-label={p.title}>
      <source src={p.localVideoPath} type="video/mp4" />
    </video>
  )
}

/** A still in the film's frame, so the two video pages are drawn by one hand. It is content: the alt says
    what is seen. It waits until the reader is near it. Its three files in public/media (a still without
    all three does not fit here): the avif, and for a browser without AVIF the webp, the phone's one on a
    narrow screen. */
function Still({ name, alt }: { name: string; alt: string }) {
  const file = `/media/${name}-poster`
  return (
    <picture>
      <source type="image/avif" srcSet={`${file}.avif`} />
      <source type="image/webp" media="(max-width: 699px)" srcSet={`${file}-m.webp`} />
      <img className="film" src={`${file}.webp`} alt={alt} width={1280} height={720} loading="lazy" decoding="async" />
    </picture>
  )
}

/** The promise, and where we have built that kind of site, two cards of it standing still as they stand on
    the wheel. Pictures only: no names, no links, no captions (D240). On a phone they rise from under the
    hero's edge, so the heading and the answer stay the largest things in the first screen. */
function ServiceHero({ s, path, waHref }: { s: ServicePageData; path: string; waHref: string }) {
  const [light, heavy] = weights(s.h1)
  return (
    <section className={`phero${s.shots ? ' phero--shots' : ''}`}>
      <div className={`wrap phero__in${s.shots ? '' : ' wrap--narrow'}`}>
        <div className="phero__text">
          <Crumbs name={s.title} path={path} here={s.crumb} />
          <h1 className="h1 h1--page h1--two">{light}<b>{heavy}</b></h1>
          <p className="lede">{tie(s.lede)}</p>
          <div className="phero__actions"><WhatsAppButton href={waHref} placement={`service_${s.slug}_hero`} /></div>
        </div>
        {s.shots && (
          <div className="shots" aria-hidden="true">
            {/* the first card is the largest paint from a tablet's width up, so only the second one waits */}
            {s.shots.slice(0, 2).map((name, i) => (
              <span key={name} className="wheel__card">
                <img src={`/work/${name}.webp`} alt="" width={528} height={1056} draggable={false} decoding="async" {...(i ? { fetchpriority: 'low' } : {})} />
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

/** The written quote every job starts with (Terms 3.1), drawn simply. The heading over it asks what it costs,
    so how the price is set stands first; then what it includes (said once, over the rows), what it does not
    (each row with its own note), how long the work takes, and that it includes VAT. The page's one object. */
function Quote({ q }: { q: ServiceQuote }) {
  const [light, heavy] = weights(q.name)
  const [sum, ...notes] = q.lines
  return (
    <div className="quote">
      <h3 className="quote__head">{light}<b>{heavy}</b></h3>
      {sum && <p className="quote__sum">{marked(sum)}</p>}
      <p className="quote__in">כלול במחיר</p>
      <ul className="quote__rows">
        {q.rows.map((r) => <li key={r}>{tie(r)}</li>)}
      </ul>
      {q.extra && (
        <ul className="quote__rows">
          {q.extra.map(([r, note]) => <li key={r}><span>{tie(r)}</span><small>{tie(note)}</small></li>)}
        </ul>
      )}
      <div className="quote__notes">
        {notes.map((l) => <p key={l}>{marked(l)}</p>)}
        <p>{PRICE_COMMON[1]}</p>
      </div>
    </div>
  )
}

export function Service() {
  const { slug = '' } = useParams()
  const s = getServiceBySlug(slug)
  if (!s) return <NotFound />
  const path = `/services/${s.slug}`
  const waHref = getWhatsAppUrl(s.waText ?? 'היי, אשמח לשמוע פרטים.')
  // a service with a sample of its own shows it as the answer to one of its questions
  const sample = getPortfolioExampleByService(s.slug)
  const ld = {
    '@context': 'https://schema.org', '@type': 'Service', name: s.title, description: s.metaDescription,
    provider: { '@type': 'ProfessionalService', name: 'MediaWave Israel', url: SITE_URL }, areaServed: 'IL', url: `${SITE_URL}${path}/`,
  }
  // a side service is half a page: no steps and no questions at the end (what they say is in its answers and its slip)
  const steps = s.brief ? undefined : s.steps
  const faq = s.brief ? [] : s.faq
  // every question the page answers in the open: the ones above the price and the ones at the end
  const answered = [
    ...s.asks.map((a) => ({ question: plain(a.q), answer: [...a.a, ...(a.close ?? [])].join(' ') })),
    ...faq,
  ]
  const faqLd = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: answered.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
  }
  return (
    <>
      <SEO title={s.metaTitle} description={s.metaDescription} canonical={path} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      {answered.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}
      <ServiceHero s={s} path={path} waHref={waHref} />

      <section className="band">
        <div className="wrap wrap--narrow asks">
          {s.asks.map((a) => (
            <div key={a.q} className="ask">
              <H2>{a.q}</H2>
              {a.sample && sample && <Film p={sample} />}
              {a.still && <Still {...a.still} />}
              {a.a.map((p) => <p key={p}>{tie(p)}</p>)}
              {a.close && <p className="about__close"><span>{a.close[0]}</span> <b>{a.close[1]}</b></p>}
            </div>
          ))}
        </div>
      </section>

      <section className="band band--cream" aria-labelledby="price-h">
        <div className="wrap wrap--narrow">
          <H2 id="price-h">כמה זה |עולה?</H2>
          <Quote q={s.quote} />
          <VoiceAt place="price" service={s.slug} />
          {/* on a side page the form stands right under the slip, so the slip needs no button of its own */}
          {!s.brief && <div className="band__cta"><WhatsAppButton href={waHref} placement={`service_${s.slug}_quote`} label="בקשו הצעת מחיר" /></div>}
        </div>
      </section>

      {steps && (
        <section className="band band--blue" aria-labelledby="steps-h">
          <div className="wrap">
            <H2 id="steps-h">מה קורה |אחרי שפונים?</H2>
            <ol className="route" data-n={steps.length}>
              {steps.map((st, i) => (<li key={st.title} className="route__stop"><span className="route__n" aria-hidden="true">{i + 1}</span><h3 className="h3">{st.title}</h3><p>{tie(st.line)}</p></li>))}
            </ol>
          </div>
        </section>
      )}

      {faq.length > 0 && (
        <section className="band" aria-labelledby="faq-h">
          <div className="wrap wrap--narrow">
            <H2 id="faq-h">שאלות |שחוזרות</H2>
            <div className="faq">
              {faq.map((f) => (<details key={f.question} className="faq__item"><summary><span>{f.question}</span><IconChevron /></summary><p>{tie(f.answer)}</p></details>))}
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
  const service = getServiceBySlug(p.serviceSlug)
  const waText = service?.waText ?? 'היי, אשמח לשמוע פרטים.'
  const videoLd = p.localVideoPath && p.poster && p.uploadDate && {
    '@context': 'https://schema.org', '@type': 'VideoObject', name: p.title, description: p.metaDescription,
    thumbnailUrl: `${SITE_URL}${p.poster}`, contentUrl: `${SITE_URL}${p.localVideoPath}`, uploadDate: p.uploadDate, duration: p.duration,
  }
  return (
    <>
      <SEO title={p.metaTitle} description={p.metaDescription} canonical={path} />
      {videoLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoLd) }} />}
      <PageHero name={p.title} path={path} title={p.h1 ?? p.title} lede={p.lede ?? p.subtitle}
        via={service && { name: service.title, path: `/services/${service.slug}` }} here="דוגמה" />
      {/* the film is the page: it stands first, then how it was made, then the way to the service's own questions */}
      <section className="band">
        <div className="wrap wrap--narrow ask">
          <Film p={p} />
          {(p.story ?? [p.description]).map((t) => <p key={t}>{t}</p>)}
          <a className="more" href={`/services/${p.serviceSlug}/`}><span>כמה תמונות צריך, וכמה זה עולה</span><IconChevrons /></a>
        </div>
      </section>
      <Contact h2="רוצים |סרטון כזה?" waHref={getWhatsAppUrl(waText)} ask={waText.replace(/^היי,\s*/, '')} />
    </>
  )
}

function Legal({ name, path, updated, description, children }: { name: string; path: string; updated: string; description: string; children: ReactNode }) {
  return (
    <>
      <SEO title={name} description={description} canonical={path} />
      <PageHero name={name} path={path} title={name} lede={`עודכן לאחרונה ב${updated}`} />
      <section className="band"><div className="wrap wrap--narrow legal">{children}</div></section>
    </>
  )
}

export const Terms = () => (
  <Legal name="תקנון שימוש" path="/terms" updated="ינואר 2026" description="התקנון של MediaWave Israel קובע את תנאי השימוש באתר ואת תנאי שירותי פיתוח האתרים."><TermsBody /></Legal>
)
export const Privacy = () => (
  <Legal name="מדיניות פרטיות" path="/privacy" updated="ינואר 2026" description="מדיניות הפרטיות של MediaWave Israel מפרטת איזה מידע נאסף באתר ואיך משתמשים בו."><PrivacyBody /></Legal>
)
export const Accessibility = () => (
  <Legal name="הצהרת נגישות" path="/accessibility" updated="נובמבר 2026" description="הצהרת הנגישות של MediaWave Israel מפרטת את התאמות הנגישות באתר ואת דרכי הפנייה."><AccessibilityBody /></Legal>
)
