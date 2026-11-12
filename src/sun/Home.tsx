// sun · the home page (D237-D240). Six short stops and one action (WhatsApp):
// the promise with the wheel of sites, nice to meet you, what we build, how it goes, four questions, the form.
// D240 (Nati): fewer words and sections, no client names, no links to the sites. The sites are seen only on
// the wheel; the work list, the page diagram and the price sheet left the page.
import { useEffect, useState, type FormEvent } from 'react'
import SEO from '../components/SEO'
import { SITE_CONTACT } from '../data/site'
import { getWhatsAppUrl } from '../utils/whatsapp'
import { isValidName, isValidPhone, validationErrors } from '../utils/validation'
import { track } from '../utils/analytics'
import Wheel from './Wheel'
import { ABOUT, CONTACT, FAQ, HERO, LAUNCH, OFFER, PROCESS, WA } from './content'
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
  blue: (<><rect x="6" y="10" width="36" height="26" rx="3" /><path d="M6 17h36M18 42h12M24 36v6" /><rect className="fill" x="11" y="22" width="11" height="9" rx="1.5" /><path d="M27 23h10M27 28h7" /></>),
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
        <h1 id="hero-h" className="h1">{HERO.h1[0]} <span className="h1__rest">{HERO.h1[1]}</span></h1>
        <p className="lede hero__lede">{HERO.lede}</p>
        <div className="hero__actions">
          <WhatsAppButton placement="hero" />
          <a className="btn btn--line" href="#process" onClick={() => track('cta_click', { location: 'hero_process' })}><span>{HERO.second}</span><IconChevrons /></a>
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

/** Nice to meet you: who we are, the problem we keep meeting, and what we do about it. */
function About() {
  return (
    <section id="about" className="band about" aria-labelledby="about-h">
      <div className="wrap wrap--narrow">
        <H2 id="about-h">{ABOUT.h2}</H2>
        {ABOUT.lines.map((l) => <p key={l} className="about__line">{l}</p>)}
        <p className="about__close"><span>{ABOUT.close[0]}</span> <b>{ABOUT.close[1]}</b></p>
      </div>
    </section>
  )
}

function Offer() {
  return (
    <section id="offer" className="band band--cream" aria-labelledby="offer-h">
      <div className="wrap">
        <H2 id="offer-h">{OFFER.h2}</H2>
        <ul className="kinds">
          {OFFER.kinds.map((k) => (
            <li key={k.name} className="kind">
              <span className="ring" aria-hidden="true">
                <svg viewBox="0 0 48 48" width="56" height="56" focusable="false">{KIND_ICON[k.tone]}</svg>
              </span>
              <h3 className="h3">{k.name}</h3>
              <p>{k.line}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** Seven working days (Sunday to Thursday) from the next working day: the "5 to 7 working days" as a real date. */
function launchDates() {
  const works = (d: Date) => d.getDay() <= 4
  const d = new Date()
  d.setHours(12, 0, 0, 0)
  do d.setDate(d.getDate() + 1); while (!works(d))
  const start = new Date(d)
  for (let n = 1; n < 7;) { d.setDate(d.getDate() + 1); if (works(d)) n++ }
  const fmt = (x: Date) => new Intl.DateTimeFormat('he-IL', { weekday: 'long', day: 'numeric', month: 'numeric' }).format(x)
  return { start: fmt(start), end: fmt(d) }
}

/** Today's answer to "when would mine be live?". Computed in the browser only: a prerendered date would go stale. */
function LaunchDate() {
  const [dates, setDates] = useState<{ start: string; end: string } | null>(null)
  // never in the prerendered HTML: a date baked at build time would be shown, stale, until the app boots
  useEffect(() => { if (!(window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__) setDates(launchDates()) }, [])
  return (
    <p className="launch">
      {dates && (<>
        <b>{LAUNCH.start}{dates.start}?</b>
        <span>{LAUNCH.end} <strong>{dates.end}</strong>.</span>
        <small>{LAUNCH.note}</small>
      </>)}
    </p>
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
        <LaunchDate />
        <div className="band__cta"><WhatsAppButton placement="process" /></div>
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

/** The one message the form produces: the bubble shows it while it is typed, and the send uses the same words. */
const ASK = 'אשמח לשמוע על דף נחיתה או אתר.'
const leadText = (name: string, phone: string, ask = ASK) => `היי, אני ${name}.\n${ask}\nהטלפון שלי ${phone}`

/** `ask` is the sentence about what the visitor wants: a service page passes its own, so the message fits the page. */
export function LeadForm({ placement = 'contact_form', ask = ASK }: { placement?: string; ask?: string }) {
  const [data, setData] = useState({ name: '', phone: '' })
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
      const text = leadText(data.name.trim(), data.phone.trim(), ask)
      track('form_submit', { placement, mode: 'whatsapp_fallback' })
      window.open(getWhatsAppUrl(text), '_blank', 'noopener')
      setStatus(CONTACT.viaWhatsApp)
      return
    }
    setState('loading')
    try {
      await fetch(endpoint, {
        method: 'POST', mode: 'no-cors',
        body: new URLSearchParams({ fullName: data.name.trim(), phone: data.phone.trim(), message: leadText(data.name.trim(), data.phone.trim(), ask), page: window.location.href, userAgent: navigator.userAgent }),
      })
      track('form_submit', { placement, mode: 'endpoint' })
      setState('done'); setStatus(CONTACT.sent); setData({ name: '', phone: '' })
    } catch {
      setState('idle'); setStatus(CONTACT.failed)
    }
  }

  const input = (f: Field, label: string, props: Record<string, unknown>) => (
    <div className="field" data-invalid={errors[f] ? '' : undefined}>
      <label htmlFor={`lead-${f}`}>{label}</label>
      <input id={`lead-${f}`} name={f} value={data[f]} required onChange={(e) => { setData((d) => ({ ...d, [f]: e.target.value })); if (errors[f]) setErrors((x) => ({ ...x, [f]: undefined })) }}
        aria-invalid={errors[f] ? true : undefined} aria-describedby={errors[f] ? `lead-${f}-err` : undefined} {...props} />
      {errors[f] && <p id={`lead-${f}-err`} className="field__err">{errors[f]}</p>}
    </div>
  )

  return (
    <form className="form" onSubmit={submit} noValidate>
      {input('name', 'שם מלא', { type: 'text', autoComplete: 'name' })}
      {input('phone', 'טלפון נייד', { type: 'tel', inputMode: 'tel', autoComplete: 'tel', dir: 'ltr' })}
      <button className="btn btn--white btn--wide" type="submit" disabled={state === 'loading'}>
        <span>{state === 'loading' ? 'שולחים...' : import.meta.env.VITE_CONTACT_ENDPOINT ? CONTACT.submit : CONTACT.submitWhatsApp}</span><IconChevrons />
      </button>
      <p className="form__status" role="status" aria-live="polite">{status}</p>
      <p className="form__legal">בשליחה אתם מאשרים את <a href="/privacy/">מדיניות הפרטיות</a>.</p>
    </form>
  )
}

/** The page breaks its bands here with one large circle, as Libra does: the form sits inside it. */
export function Contact({ h2 = CONTACT.h2, lede = CONTACT.lede, waHref = WA.hero, ask }: { h2?: string; lede?: string; waHref?: string; ask?: string }) {
  const tel = `tel:${SITE_CONTACT.phone.replace(/-/g, '')}`
  return (
    <section id="contact" className="contact" aria-labelledby="contact-h">
      <div className="contact__disc">
        <div className="contact__in">
          <H2 id="contact-h">{h2}</H2>
          <p className="contact__lede">{lede}</p>
          <LeadForm ask={ask} />
        </div>
      </div>
      <ul className="contact__ways">
        <li><a href={waHref} target="_blank" rel="noopener" onClick={wa('contact')}><IconWhatsApp /><span>וואטסאפ</span></a></li>
        <li><a href={tel} onClick={() => track('tel_click', { placement: 'contact' })}><IconPhone /><span dir="ltr">{SITE_CONTACT.phone}</span></a></li>
        <li><a href={`mailto:${SITE_CONTACT.email}`} onClick={() => track('mailto_click', { placement: 'contact' })}><IconMail /><span dir="ltr">{SITE_CONTACT.email}</span></a></li>
      </ul>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <SEO
        title="בונים דפי נחיתה, אתרי תדמית ואתרים לקורסים ולתוכניות ליווי"
        description="MediaWave בונה דפי נחיתה שאנשים משאירים בהם פרטים, וגם אתרי תדמית ואתרים לקורסים ולתוכניות ליווי. דף נחיתה רגיל באוויר תוך 5 עד 7 ימי עבודה."
        canonical="/"
      />
      <Hero />
      <About />
      <Offer />
      <Process />
      <Faq />
      <Contact />
    </>
  )
}
