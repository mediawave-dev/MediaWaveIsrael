// sun · the home page (D237): a statement first, the work in the first screen, then the answers a
// visitor needs in the order they ask them: what do you build, show me, why does it work, how, how much.
// One action on the whole page (WhatsApp), repeated; the form at the end has two fields.
import { useState, type FormEvent } from 'react'
import SEO from '../components/SEO'
import { SITE_CONTACT } from '../data/site'
import { getWhatsAppUrl } from '../utils/whatsapp'
import { isValidName, isValidPhone, validationErrors } from '../utils/validation'
import { track } from '../utils/analytics'
import Wheel from './Wheel'
import { ANATOMY, CONTACT, FACTS, FAQ, HERO, OFFER, PRICE, PROCESS, PROJECTS, WA, WORK } from './content'
import { IconArrow, IconCheck, IconMail, IconOut, IconPhone, IconPlus, IconWhatsApp } from './icons'

const wa = (placement: string) => () => track('whatsapp_click', { placement })

export function WhatsAppButton({ href = WA.hero, placement, label = HERO.cta, tone = 'ink' }: { href?: string; placement: string; label?: string; tone?: 'ink' | 'sun' | 'paper' }) {
  return (
    <a className={`btn btn--${tone}`} href={href} target="_blank" rel="noopener" onClick={wa(placement)}>
      <IconWhatsApp /><span>{label}</span>
    </a>
  )
}

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-h">
      <div className="wrap hero__text">
        <h1 id="hero-h" className="h1">{HERO.h1[0]}<br /><span className="h1__mark">{HERO.h1[1]}</span></h1>
        <p className="lede hero__lede">{HERO.lede}</p>
        <div className="hero__actions">
          <WhatsAppButton placement="hero" />
          <a className="btn btn--line" href="#work" onClick={() => track('cta_click', { location: 'hero_work' })}><span>{HERO.second}</span><IconArrow /></a>
        </div>
        <p className="hero__note">{HERO.note}</p>
      </div>
      <div className="hero__stage">
        <p className="sticker"><span>{HERO.sticker[0]}<br />{HERO.sticker[1]}<br /><b>{HERO.sticker[2]}</b><br />{HERO.sticker[3]}</span></p>
        <Wheel />
      </div>
    </section>
  )
}

function Facts() {
  return (
    <section className="facts" aria-label="מספרים שכתובים בהצעת המחיר">
      <ul className="wrap facts__grid">
        {FACTS.map((f) => (
          <li key={f.line} className="fact">
            <span className="fact__n" dir="ltr">{f.n}</span>
            <span className="fact__unit">{f.unit}</span>
            <span className="fact__line">{f.line}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Offer() {
  return (
    <section id="offer" className="band" aria-labelledby="offer-h">
      <div className="wrap">
        <h2 id="offer-h" className="h2">{OFFER.h2}</h2>
        <div className="offer">
          {OFFER.cards.map((c) => (
            <article key={c.name} className={`offer__card offer__card--${c.tone}`}>
              <h3 className="h3">{c.name}</h3>
              <p className="offer__who">{c.who}</p>
              <p className="offer__what">{c.what}</p>
              <ul className="ticks">
                {c.points.map((p) => <li key={p}><IconCheck width={18} height={18} /><span>{p}</span></li>)}
              </ul>
              <p className="offer__time">{c.time}</p>
              <div className="offer__actions">
                <a className="btn btn--card" href={c.wa} target="_blank" rel="noopener" onClick={wa(`offer_${c.tone}`)}>
                  <IconWhatsApp /><span>דברו איתנו בוואטסאפ</span>
                </a>
                {c.href && <a className="more" href={c.href}><span>{c.more}</span><IconArrow width={18} height={18} /></a>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Work() {
  return (
    <section id="work" className="band band--cream" aria-labelledby="work-h">
      <div className="wrap">
        <h2 id="work-h" className="h2">{WORK.h2}</h2>
        <ol className="work">
          {PROJECTS.map((p) => (
            <li key={p.slug} id={`work-${p.slug}`} className="work__row">
              <div className="work__art">
                <div className="frame frame--desk">
                  <span className="frame__bar" aria-hidden="true"><i /><i /><i /></span>
                  <img src={`/work/${p.slug}-desk.webp`} alt={`צילום מסך של ${p.name} במחשב`} width={1280} height={800} loading="lazy" decoding="async" />
                </div>
                <div className="frame frame--phone">
                  <img src={`/work/${p.slug}-phone-s.webp`} alt={`צילום מסך של ${p.name} בטלפון`} width={360} height={1948} loading="lazy" decoding="async" />
                </div>
              </div>
              <div className="work__text">
                <p className="chip">{p.kind}</p>
                <h3 className="h3">{p.name}</h3>
                <p className="work__client">{p.client}</p>
                <p className="work__goal">{p.goal}</p>
                {p.live && (
                  <a className="btn btn--line" href={p.url} target="_blank" rel="noopener" onClick={() => track('cta_click', { location: `work_${p.slug}` })}>
                    <span>{WORK.liveLabel}</span><IconOut />
                  </a>
                )}
              </div>
            </li>
          ))}
          <li className="work__row work__row--next">
            <div className="work__art work__art--next" aria-hidden="true"><span /></div>
            <div className="work__text">
              <h3 className="h3">{WORK.next.title}</h3>
              <p className="work__goal">{WORK.next.line}</p>
              <WhatsAppButton placement="work_next" label={WORK.next.cta} tone="sun" />
            </div>
          </li>
        </ol>
      </div>
    </section>
  )
}

/** A landing page drawn as a diagram: five numbered parts, the same numbers as the list beside it. */
function Diagram() {
  return (
    <div className="diagram" role="img" aria-label="שרטוט של דף נחיתה עם חמשת החלקים שברשימה">
      <div className="diagram__page" aria-hidden="true">
        <div className="dg dg--head"><i className="pin">1</i><b /><b /><em /></div>
        <div className="dg dg--btn"><i className="pin">2</i><span /></div>
        <div className="dg dg--proof"><i className="pin">3</i><span /><span /><span /></div>
        <div className="dg dg--faq"><i className="pin">4</i><em /><em /><em /></div>
        <div className="dg dg--form"><i className="pin">5</i><em /><em /><span /></div>
      </div>
    </div>
  )
}

function Anatomy() {
  return (
    <section id="anatomy" className="band" aria-labelledby="anatomy-h">
      <div className="wrap anatomy">
        <div className="anatomy__intro">
          <h2 id="anatomy-h" className="h2">{ANATOMY.h2}</h2>
          <p className="lede">{ANATOMY.lede}</p>
        </div>
        <Diagram />
        <ol className="anatomy__list">
          {ANATOMY.items.map((it, i) => (
            <li key={it.name}>
              <span className="pin" aria-hidden="true">{i + 1}</span>
              <div><h3 className="h4">{it.name}</h3><p>{it.line}</p></div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Process() {
  return (
    <section id="process" className="band band--blue" aria-labelledby="process-h">
      <div className="wrap">
        <h2 id="process-h" className="h2">{PROCESS.h2}</h2>
        <ol className="steps">
          {PROCESS.steps.map((s, i) => (
            <li key={s.title} className="step">
              <span className="step__n" aria-hidden="true">{i + 1}</span>
              <h3 className="h3">{s.title}</h3>
              <p>{s.line}</p>
            </li>
          ))}
        </ol>
        <div className="band__cta"><WhatsAppButton placement="process" tone="sun" /></div>
      </div>
    </section>
  )
}

function Price() {
  return (
    <section id="price" className="band" aria-labelledby="price-h">
      <div className="wrap price">
        <div>
          <h2 id="price-h" className="h2">{PRICE.h2}</h2>
          <p className="lede">{PRICE.lede}</p>
        </div>
        <div className="price__cols">
          <div className="price__col price__col--in">
            <h3 className="h4">{PRICE.inTitle}</h3>
            <ul className="ticks">{PRICE.in.map((l) => <li key={l}><IconCheck width={18} height={18} /><span>{l}</span></li>)}</ul>
          </div>
          <div className="price__col price__col--out">
            <h3 className="h4">{PRICE.outTitle}</h3>
            <ul className="ticks ticks--plus">{PRICE.out.map((l) => <li key={l}><IconPlus width={18} height={18} /><span>{l}</span></li>)}</ul>
          </div>
        </div>
        <p className="price__pay">{PRICE.pay}</p>
      </div>
    </section>
  )
}

function Faq() {
  const ld = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: FAQ.items.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
  }
  return (
    <section id="faq" className="band band--cream" aria-labelledby="faq-h">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="wrap wrap--narrow">
        <h2 id="faq-h" className="h2">{FAQ.h2}</h2>
        <div className="faq">
          {FAQ.items.map((f) => (
            <details key={f._id} className="faq__item">
              <summary><span>{f.question}</span><IconPlus /></summary>
              <p>{f.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

type Field = 'name' | 'phone'

export function LeadForm({ placement = 'contact_form' }: { placement?: string }) {
  const [data, setData] = useState({ name: '', phone: '', need: CONTACT.needs[0] })
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle')
  const [status, setStatus] = useState('')

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (state === 'loading') return
    const errs: Partial<Record<Field, string>> = {}
    if (!isValidName(data.name)) errs.name = validationErrors.name
    if (!isValidPhone(data.phone)) errs.phone = validationErrors.phone
    setErrors(errs)
    const first = (['name', 'phone'] as Field[]).find((f) => errs[f])
    if (first) { requestAnimationFrame(() => document.getElementById(`lead-${first}`)?.focus()); return }

    const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT
    // No endpoint: hand the message to WhatsApp, prefilled. Never pretend it was sent.
    if (!endpoint) {
      const text = `היי, אני ${data.name.trim()}.\nמעניין אותי: ${data.need}.\nטלפון לחזרה: ${data.phone.trim()}`
      track('form_submit', { placement, mode: 'whatsapp_fallback' })
      window.open(getWhatsAppUrl(text), '_blank', 'noopener')
      setStatus(CONTACT.viaWhatsApp)
      return
    }
    setState('loading')
    try {
      await fetch(endpoint, {
        method: 'POST', mode: 'no-cors',
        body: new URLSearchParams({ fullName: data.name.trim(), phone: data.phone.trim(), message: `מעניין אותי: ${data.need}`, page: window.location.href, userAgent: navigator.userAgent }),
      })
      track('form_submit', { placement, mode: 'endpoint' })
      setState('done'); setStatus(CONTACT.sent); setData({ name: '', phone: '', need: CONTACT.needs[0] })
    } catch {
      setState('idle'); setStatus(CONTACT.failed)
    }
  }

  const input = (f: Field, label: string, props: Record<string, unknown>) => (
    <div className="field" data-invalid={errors[f] ? '' : undefined}>
      <label htmlFor={`lead-${f}`}>{label}</label>
      <input id={`lead-${f}`} name={f} value={data[f]} required onChange={(e) => setData((d) => ({ ...d, [f]: e.target.value }))}
        aria-invalid={errors[f] ? true : undefined} aria-describedby={errors[f] ? `lead-${f}-err` : undefined} {...props} />
      {errors[f] && <p id={`lead-${f}-err`} className="field__err">{errors[f]}</p>}
    </div>
  )

  return (
    <form className="form" onSubmit={submit} noValidate>
      {input('name', 'שם', { type: 'text', autoComplete: 'name' })}
      {input('phone', 'טלפון', { type: 'tel', inputMode: 'tel', autoComplete: 'tel', dir: 'ltr' })}
      <div className="field">
        <label htmlFor="lead-need">מה אתם צריכים?</label>
        <select id="lead-need" value={data.need} onChange={(e) => setData((d) => ({ ...d, need: e.target.value }))}>
          {CONTACT.needs.map((n) => <option key={n}>{n}</option>)}
        </select>
      </div>
      <button className="btn btn--ink btn--wide" type="submit" disabled={state === 'loading'}>
        <span>{state === 'loading' ? 'שולחים...' : CONTACT.submit}</span><IconArrow />
      </button>
      <p className="form__status" role="status" aria-live="polite">{status}</p>
      <p className="form__legal">בשליחה אתם מאשרים את <a href="/privacy/">מדיניות הפרטיות</a>.</p>
    </form>
  )
}

export function Contact({ h2 = CONTACT.h2, lede = CONTACT.lede, waHref = WA.hero }: { h2?: string; lede?: string; waHref?: string }) {
  const tel = `tel:${SITE_CONTACT.phone.replace(/-/g, '')}`
  return (
    <section id="contact" className="contact" aria-labelledby="contact-h">
      <div className="wrap contact__in">
        <div className="contact__text">
          <h2 id="contact-h" className="h2">{h2}</h2>
          <p className="lede">{lede}</p>
          <ul className="contact__ways">
            <li><a href={waHref} target="_blank" rel="noopener" onClick={wa('contact')}><IconWhatsApp /><span>וואטסאפ</span></a></li>
            <li><a href={tel} onClick={() => track('tel_click', { placement: 'contact' })}><IconPhone /><span dir="ltr">{SITE_CONTACT.phone}</span></a></li>
            <li><a href={`mailto:${SITE_CONTACT.email}`} onClick={() => track('mailto_click', { placement: 'contact' })}><IconMail /><span dir="ltr">{SITE_CONTACT.email}</span></a></li>
          </ul>
        </div>
        <div className="contact__disc">
          <p className="badge" aria-hidden="true">עונים תוך<br /><b>24 שעות</b><br />בימי עסקים</p>
          <LeadForm />
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <SEO
        title="דפי נחיתה ואתרי תדמית שמביאים פניות"
        description="MediaWave בונה דפי נחיתה, אתרי תדמית ואתרים לתוכניות ליווי. דף נחיתה באוויר תוך 5 עד 7 ימי עבודה, וכל דף נבנה כדי שמי שנכנס יכתוב לכם."
        canonical="/"
      />
      <Hero />
      <Facts />
      <Offer />
      <Work />
      <Anatomy />
      <Process />
      <Price />
      <Faq />
      <Contact />
    </>
  )
}
