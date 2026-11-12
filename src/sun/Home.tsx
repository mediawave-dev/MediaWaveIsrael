// sun · the home page (D237, D238): a statement first, the work in the first screen, then the answers a
// visitor needs in the order they ask them: what do you build, show me, why does it work, how, how much.
// One action on the whole page (WhatsApp), repeated; the form at the end has two fields.
// D238 (Nati: "no AI slop, nothing templated"): no metric strip, no grid of equal cards, no numbered discs.
// Each section has its own form: the visitor's situation as a spoken line, posters for the work, a diagram,
// a route, a receipt.
import { useState, type FormEvent } from 'react'
import SEO from '../components/SEO'
import { SITE_CONTACT } from '../data/site'
import { getWhatsAppUrl } from '../utils/whatsapp'
import { isValidName, isValidPhone, validationErrors } from '../utils/validation'
import { track } from '../utils/analytics'
import Wheel from './Wheel'
import { ANATOMY, CONTACT, FAQ, HERO, OFFER, PRICE, PROCESS, PROJECTS, WA, WORK } from './content'
import { IconChevron, IconChevrons, IconMail, IconPhone, IconWhatsApp } from './icons'

const wa = (placement: string) => () => track('whatsapp_click', { placement })

/** A section heading in two weights (after Libra, D238): a light lead-in, then the bold payoff. "a|b" in the copy. */
export function H2({ id, children }: { id?: string; children: string }) {
  const [lead, bold] = children.includes('|') ? children.split('|') : ['', children]
  return <h2 id={id} className="h2">{lead}<b>{bold}</b></h2>
}

/** Line drawings for the three kinds of site: black outline, one yellow part (Libra's icon language). */
const KIND_ICON: Record<string, JSX.Element> = {
  sun: (<><rect x="14" y="6" width="20" height="36" rx="3" /><path d="M19 13h10M19 18h7" /><rect className="fill" x="19" y="27" width="10" height="6" rx="3" /></>),
  blue: (<><rect x="6" y="10" width="36" height="26" rx="3" /><path d="M6 17h36M18 42h12M24 36v6" /><rect className="fill" x="11" y="22" width="11" height="9" rx="1.500" /><path d="M27 23h10M27 28h7" /></>),
  coral: (<><circle className="fill" cx="24" cy="15" r="6" /><path d="M11 40c1-8 6-12 13-12s12 4 13 12" /><path d="M33 9l2 2 4-5" /></>),
}

export function WhatsAppButton({ href = WA.hero, placement, label = HERO.cta, tone = 'ink' }: { href?: string; placement: string; label?: string; tone?: 'ink' | 'sun' | 'paper' }) {
  return (
    <a className={`btn btn--${tone}`} href={href} target="_blank" rel="noopener" onClick={wa(placement)}>
      <IconWhatsApp /><span>{label}</span><IconChevrons />
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
          <a className="btn btn--line" href="#work" onClick={() => track('cta_click', { location: 'hero_work' })}><span>{HERO.second}</span><IconChevrons /></a>
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

/** Three situations in the visitor's own words; each one answered by what we build for it. */
function Offer() {
  return (
    <section id="offer" className="band" aria-labelledby="offer-h">
      <div className="wrap">
        <H2 id="offer-h">{OFFER.h2}</H2>
        <ol className="asks">
          {OFFER.cards.map((c) => (
            <li key={c.name} className={`ask ask--${c.tone}`}>
              <h3 className="ask__name">
                <span className="ring">
                  <svg viewBox="0 0 48 48" width="48" height="48" aria-hidden="true" focusable="false">{KIND_ICON[c.tone]}</svg>
                  <span>{c.name}</span>
                </span>
              </h3>
              <p className="ask__say">{c.who}</p>
              <div className="ask__ans">
                <p className="ask__what">{c.what}</p>
                <ul className="ask__points">{c.points.map((p) => <li key={p}>{p}</li>)}</ul>
                <p className="ask__time">{c.time}</p>
                <div className="ask__actions">
                  <a className="btn btn--ink" href={c.wa} target="_blank" rel="noopener" onClick={wa(`offer_${c.tone}`)}>
                    <IconWhatsApp /><span>דברו איתנו</span><IconChevrons />
                  </a>
                  {c.href && <a className="more" href={c.href}><span>{c.more}</span><IconChevrons width={18} height={18} /></a>}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/** The work as posters: the name set large on its own colour, the site itself standing at the bottom edge. */
function Work() {
  return (
    <section id="work" className="band" aria-labelledby="work-h">
      <div className="wrap">
        <H2 id="work-h">{WORK.h2}</H2>
        <ol className="work">
          {PROJECTS.map((p) => (
            <li key={p.slug} id={`work-${p.slug}`} className="poster">
              <div className="poster__text">
                <p className="poster__kind">{p.kind}</p>
                <h3 className="poster__name">{p.name}</h3>
                <p className="poster__client">{p.client}</p>
                <p className="poster__goal">{p.goal}</p>
              </div>
              <div className="poster__art">
                <img className="poster__desk" src={`/work/${p.slug}-desk.webp`} alt={`${p.name}: האתר במחשב`} width={1280} height={800} loading="lazy" decoding="async" />
                <img className="poster__phone" src={`/work/${p.slug}-card-top.webp`} alt={`${p.name}: האתר בטלפון`} width={448} height={896} loading="lazy" decoding="async" />
              </div>
            </li>
          ))}
          <li className="poster poster--next">
            <div className="poster__text">
              <h3 className="poster__name">{WORK.next.title}</h3>
              <p className="poster__goal">{WORK.next.line}</p>
              <WhatsAppButton placement="work_next" label={WORK.next.cta} />
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
    <section id="anatomy" className="band band--cream" aria-labelledby="anatomy-h">
      <div className="wrap anatomy">
        <div className="anatomy__intro">
          <H2 id="anatomy-h">{ANATOMY.h2}</H2>
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

/** One line from the first call to the day the page is live; the stops sit on it. */
function Process() {
  return (
    <section id="process" className="band band--blue" aria-labelledby="process-h">
      <div className="wrap">
        <H2 id="process-h">{PROCESS.h2}</H2>
        <ol className="route">
          {PROCESS.steps.map((s, i) => (
            <li key={s.title} className="route__stop">
              <span className="route__n" aria-hidden="true">{i + 1}</span>
              <h3 className="h3">{s.title}</h3>
              <p>{s.line}</p>
            </li>
          ))}
        </ol>
        <div className="band__cta"><WhatsAppButton placement="process" /></div>
      </div>
    </section>
  )
}

/** The price as the paper it arrives on: a sample quote, what is on it and what is not. */
function Price() {
  return (
    <section id="price" className="band band--cream" aria-labelledby="price-h">
      <div className="wrap price">
        <div className="price__text">
          <H2 id="price-h">{PRICE.h2}</H2>
          <p className="lede">{PRICE.lede}</p>
          <p className="price__pay">{PRICE.pay}</p>
        </div>
        <div className="price__paper"><div className="receipt">
          <p className="receipt__head"><b>{PRICE.paper}</b><span>MediaWave</span></p>
          <dl>
            {PRICE.in.map((l) => <div key={l}><dt>{l}</dt><dd>{PRICE.inMark}</dd></div>)}
          </dl>
          <p className="receipt__sub">{PRICE.outTitle}</p>
          <dl>
            {PRICE.out.map((l) => <div key={l.name}><dt>{l.name}</dt><dd>{l.value}</dd></div>)}
          </dl>
          <p className="receipt__total"><b>{PRICE.totalLabel}</b><span>{PRICE.total}</span></p>
        </div></div>
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
    <section id="faq" className="band" aria-labelledby="faq-h">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="wrap wrap--narrow">
        <H2 id="faq-h">{FAQ.h2}</H2>
        <div className="faq">
          {FAQ.items.map((f) => (
            <details key={f._id} className="faq__item">
              <summary><span>{f.question}</span><IconChevron /></summary>
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
        <span>{state === 'loading' ? 'שולחים...' : CONTACT.submit}</span><IconChevrons />
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
          <H2 id="contact-h">{h2}</H2>
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
