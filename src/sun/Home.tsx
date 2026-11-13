// sun · the home page (D237-D240). Six short stops and one action (WhatsApp):
// the promise with the wheel of sites, nice to meet you, what we build, how it goes, four questions, the form.
// D240 (Nati): fewer words and sections, no client names, no links to the sites. The sites are seen only on
// the wheel; the work list, the page diagram and the price sheet left the page.
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import SEO from '../components/SEO'
import { SITE_CONTACT } from '../data/site'
import { getWhatsAppUrl } from '../utils/whatsapp'
import { isValidName, isValidPhone, validationErrors } from '../utils/validation'
import { track } from '../utils/analytics'
import { MIN_FILL_MS, TRAP_FIELD, leadReady, sendLead } from '../utils/lead'
import './lead.css'
import Wheel from './Wheel'
import { Buoy, Tide, useRise } from './Tide'
import { GoogleLine, Signature, SpeedCheck, VoiceAt } from './Proof'
import { ABOUT, CONTACT, FAQ, HERO, LAUNCH, OFFER, PROCESS, WA } from './content'
import { IconChevron, IconChevrons, IconInstagram, IconMail, IconPhone, IconWhatsApp } from './icons'

const wa = (placement: string) => () => track('whatsapp_click', { placement })

/** A section heading in two weights (after Libra, D238): a light lead-in, then the bold payoff. "a|b" in the copy. */
export function H2({ id, children }: { id?: string; children: string }) {
  const [lead, bold] = children.includes('|') ? children.split('|') : ['', children]
  return <h2 id={id} className="h2">{lead}<b>{bold}</b></h2>
}

/** Line drawings for the three kinds of site: black outline, one yellow part (Libra's icon language). */
/** Each kind's own page. The key is the kind's tone, which every version of the copy keeps. */
const KIND_HREF: Record<string, string> = { sun: '/services/landing-pages/', blue: '/services/building-websites/', coral: '/services/program-sites/' }
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
      </div>
      {/* the work comes right under the promise (Nati, D250); the two actions stand below it, on the paper */}
      <div className="hero__stage">
        <p className="sticker"><span>{HERO.sticker[0]}<br />{HERO.sticker[1]}<br /><b>{HERO.sticker[2]}</b><br />{HERO.sticker[3]}</span></p>
        <Wheel />
      </div>
      <div className="hero__cta">
        <div className="hero__actions">
          <WhatsAppButton placement="hero" />
          <a className="btn btn--line" href="#process" onClick={() => track('cta_click', { placement: 'hero_process' })}><span>{HERO.second}</span><IconChevrons /></a>
        </div>
        <p className="hero__note">{HERO.note}</p>
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
        <Signature />
      </div>
    </section>
  )
}

function Offer() {
  return (
    <section id="offer" className="band band--cream" aria-labelledby="offer-h">
      <Buoy at="top" to="offer" label="לחלק הבא, מה אתם צריכים" />
      <div className="wrap">
        <H2 id="offer-h">{OFFER.h2}</H2>
        <ul className="kinds">
          {OFFER.kinds.map((k) => (
            <li key={k.name} className="kind">
              <span className="ring" aria-hidden="true">
                <svg viewBox="0 0 48 48" width="56" height="56" focusable="false">{KIND_ICON[k.tone]}</svg>
              </span>
              <h3 className="h3"><a className="kind__link" href={KIND_HREF[k.tone]} onClick={() => track('cta_click', { placement: `offer_${k.tone}` })}><span>{k.name}</span><IconChevrons /></a></h3>
              <p>{k.line}</p>
            </li>
          ))}
        </ul>
        <p className="about__close offer__close"><span>{OFFER.close[0]}</span> <b>{OFFER.close[1]}</b></p>
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
  const rise = useRise<HTMLOListElement>()
  return (
    <section id="process" className="band band--blue" aria-labelledby="process-h">
      <Buoy at="top" to="process" label="לחלק הבא, איך זה עובד" />
      <div className="wrap">
        <H2 id="process-h">{PROCESS.h2}</H2>
        <ol className="route" ref={rise}>
          {PROCESS.steps.map((s, i) => (
            <li key={s.title} className="route__stop">
              <span className="route__n" aria-hidden="true"><Tide level={(i + 1) / PROCESS.steps.length} /><b>{i + 1}</b></span>
              <h3 className="h3">{s.title}</h3>
              <p>{s.line}</p>
            </li>
          ))}
        </ol>
        {/* proof (Proof.tsx): the page's own speed for the visitor to measure, and a client's sentence once there is one */}
        <SpeedCheck steps={PROCESS.steps.length} />
        <LaunchDate />
        <VoiceAt place="steps" />
        <div className="band__cta"><WhatsAppButton placement="process" /></div>
      </div>
      <Buoy at="bottom" to="faq" label="לחלק הבא, שאלות שחוזרות" />
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

/** `ask` is the sentence about what the visitor wants: a service page passes its own, so the message fits the page.
    The form sends in one of two ways and its button says which. Where the server can mail (/api/lead answers
    that it is ready) the enquiry is posted and reaches the studio whatever the visitor does next. Everywhere
    else, and after a send that failed, the same words open in WhatsApp for the visitor to send. */
export function LeadForm({ placement = 'contact_form', ask = ASK }: { placement?: string; ask?: string }) {
  const [data, setData] = useState({ name: '', phone: '' })
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState('')
  const [mail, setMail] = useState(false)
  const form = useRef<HTMLFormElement>(null)
  const trap = useRef<HTMLInputElement>(null)
  // refs, not state: they are read inside handlers and must be true the moment they are set
  const busy = useRef(false)
  const mailFailed = useRef(false)
  const started = useRef(false)
  const seenAt = useRef(0)
  const openedAt = useRef(0)

  // The server is asked only when the form is about to come into view, so the answer is there before the
  // button is read and a visit that never reaches the form costs no request. Seeing the form is counted once.
  useEffect(() => {
    const el = form.current
    if (!el || (window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__) return
    let live = true
    const near = () => { void leadReady().then((ok) => { if (live && ok && !mailFailed.current) setMail(true) }) }
    const seen = () => { seenAt.current ||= Date.now(); track('form_view', { placement }) }
    if (!('IntersectionObserver' in window)) { near(); seen(); return () => { live = false } }
    const once = (run: () => void, init: IntersectionObserverInit) => {
      const io = new IntersectionObserver((entries) => { if (entries.some((x) => x.isIntersecting)) { io.disconnect(); run() } }, init)
      io.observe(el)
      return io
    }
    const a = once(near, { rootMargin: '800px 0px' })
    const b = once(seen, { threshold: 0.5 })
    return () => { live = false; a.disconnect(); b.disconnect() }
  }, [placement])

  const change = (f: Field) => (e: ChangeEvent<HTMLInputElement>) => {
    if (!started.current) { started.current = true; seenAt.current ||= Date.now(); track('form_start', { placement }) }
    setData((d) => ({ ...d, [f]: e.target.value }))
    if (errors[f]) setErrors((x) => ({ ...x, [f]: undefined }))
  }

  const refuse = (errs: Partial<Record<Field, string>>) => {
    setErrors(errs)
    const first = (['name', 'phone'] as Field[]).find((f) => errs[f])
    if (first) requestAnimationFrame(() => document.getElementById(`lead-${first}`)?.focus())
    return !!first
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    // a second press while the first is on its way is not a second enquiry
    if (busy.current) return
    // one more press right after "received" (the fields are empty again) is not a new enquiry with two errors
    if (status === CONTACT.sent && !data.name && !data.phone) return
    const name = data.name.trim()
    const phone = data.phone.trim()
    if (refuse({ ...(!isValidName(name) && { name: validationErrors.name }), ...(!isValidPhone(phone) && { phone: validationErrors.phone }) })) return

    // No mail here, or the mail just failed: hand the message to WhatsApp, prefilled. Never pretend it was sent.
    // Opened inside the press itself, before anything is awaited, so no browser blocks the new tab.
    if (!mail) {
      // a double click is one message, not two WhatsApp tabs and two counted sends
      if (Date.now() - openedAt.current < 1000) return
      openedAt.current = Date.now()
      track('form_submit', { placement, mode: mailFailed.current ? 'whatsapp_after_fail' : 'whatsapp' })
      window.open(getWhatsAppUrl(leadText(name, phone, ask)), '_blank', 'noopener')
      setStatus(CONTACT.viaWhatsApp)
      return
    }

    busy.current = true
    setSending(true)
    setStatus('')
    // the server refuses a send that comes too soon after the form was seen; a person this quick waits it out
    const since = seenAt.current || (seenAt.current = Date.now())
    const early = MIN_FILL_MS - (Date.now() - since)
    if (early > 0) await new Promise((r) => window.setTimeout(r, early))
    const out = await sendLead({ name, phone, ask, t: Date.now() - since, trap: trap.current?.value ?? '' })
    busy.current = false
    setSending(false)

    if (out.ok) {
      track('form_submit', { placement, mode: 'mail' })
      setData({ name: '', phone: '' })
      setStatus(CONTACT.sent)
      return
    }
    // the server's own check refused a field the browser let through: say it on the field
    if (out.error === 'name' || out.error === 'phone') { refuse({ [out.error]: validationErrors[out.error] }); return }
    // Not sent, and the form says so. What the visitor typed stays, and the button now sends it through WhatsApp.
    track('form_submit', { placement, mode: 'mail_failed' })
    mailFailed.current = true
    setMail(false)
    setStatus(CONTACT.failed)
  }

  const input = (f: Field, label: string, props: Record<string, unknown>) => (
    <div className="field" data-invalid={errors[f] ? '' : undefined}>
      <label htmlFor={`lead-${f}`}>{label}</label>
      <input id={`lead-${f}`} name={f} value={data[f]} required onChange={change(f)}
        aria-invalid={errors[f] ? true : undefined} aria-describedby={errors[f] ? `lead-${f}-err` : undefined} {...props} />
      {errors[f] && <p id={`lead-${f}-err`} className="field__err">{errors[f]}</p>}
    </div>
  )

  return (
    // method="dialog" outside a dialog submits nowhere: a press before the script is alive (the prerendered
    // page on a slow phone) leaves the page and the typed fields as they are. Without it the browser would
    // reload the page with the name and the phone in the address.
    <form ref={form} className="form" method="dialog" onSubmit={submit} noValidate>
      {input('name', 'שם מלא', { type: 'text', autoComplete: 'name' })}
      {input('phone', 'טלפון נייד', { type: 'tel', inputMode: 'tel', autoComplete: 'tel', dir: 'ltr' })}
      {/* the field people never see (lead.css): a script that fills it is refused by the server */}
      <div className="form__trap" aria-hidden="true"><input ref={trap} type="text" name={TRAP_FIELD} tabIndex={-1} autoComplete="off" /></div>
      {/* aria-disabled, not disabled: a disabled button drops the keyboard focus to the page body, and the
          visitor would have to hunt for the button again after the answer. busy blocks a second send. */}
      <button className="btn btn--white btn--wide" type="submit" aria-disabled={sending || undefined}>
        <span>{sending ? 'שולחים...' : mail ? CONTACT.submit : CONTACT.submitWhatsApp}</span><IconChevrons />
      </button>
      <p className="form__status" role="status" aria-live="polite">{status}</p>
      <p className="form__legal">בשליחה אתם מאשרים את <a href="/privacy/">מדיניות הפרטיות</a>.</p>
    </form>
  )
}

/** The page breaks its bands here with one large circle, as Libra does: the form sits inside it. */
/** The envelope over the form (D256): drawn in the site's line, it flies in with the circle and flies off when the form is sent. */
function Envelope() {
  return (
    <svg className="env" viewBox="0 0 120 64" width="96" height="52" aria-hidden="true" focusable="false">
      <g className="env__lines"><path d="M6 14h22M2 26h16M8 38h12" /></g>
      <g className="env__body">
        <path d="M38 8h70a6 6 0 0 1 6 7l-8 36a7 7 0 0 1-7 6H29a6 6 0 0 1-6-7l8-36a7 7 0 0 1 7-6Z" />
        <path className="env__flap" d="M36 11l32 26 40-26" />
        <path d="M30 52l24-20M100 52l-17-19" />
      </g>
    </svg>
  )
}

/** Adds .is-in once the circle is a third into view, and .is-sent when the form goes out (WhatsApp or mail). */
function useContactMotion() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('is-in'); io.disconnect() } }, { threshold: 0.3 })
    io.observe(el)
    const status = el.querySelector('.form__status')
    const mo = status ? new MutationObserver(() => {
      const t = status.textContent || ''
      el.classList.toggle('is-sent', t === CONTACT.viaWhatsApp || t === CONTACT.sent)
    }) : null
    if (status && mo) mo.observe(status, { childList: true, characterData: true, subtree: true })
    return () => { io.disconnect(); mo?.disconnect() }
  }, [])
  return ref
}

export function Contact({ h2 = CONTACT.h2, lede = CONTACT.lede, waHref = WA.hero, ask }: { h2?: string; lede?: string; waHref?: string; ask?: string }) {
  const tel = `tel:${SITE_CONTACT.phone.replace(/-/g, '')}`
  const motion = useContactMotion()
  return (
    <>
    {/* a client's sentence stands right over the circle, on every page that ends with the form */}
    <VoiceAt place="form" />
    <section id="contact" className="contact" aria-labelledby="contact-h" ref={motion}>
      <div className="contact__disc">
        <div className="contact__in">
          <Envelope />
          <H2 id="contact-h">{h2}</H2>
          <p className="contact__lede">{lede}</p>
          <LeadForm ask={ask} />
        </div>
      </div>
      <GoogleLine />
      <ul className="contact__ways">
        <li><a href={waHref} target="_blank" rel="noopener" onClick={wa('contact')}><IconWhatsApp /><span>וואטסאפ</span></a></li>
        <li><a href={tel} onClick={() => track('tel_click', { placement: 'contact' })}><IconPhone /><span dir="ltr">{SITE_CONTACT.phone}</span></a></li>
        <li><a href={`mailto:${SITE_CONTACT.email}`} onClick={() => track('mailto_click', { placement: 'contact' })}><IconMail /><span dir="ltr">{SITE_CONTACT.email}</span></a></li>
        <li><a href={SITE_CONTACT.instagramUrl} target="_blank" rel="noopener" onClick={() => track('instagram_click', { placement: 'contact' })}><IconInstagram /><span>אינסטגרם</span></a></li>
      </ul>
    </section>
    </>
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
      <VoiceAt place="hero" />
      <About />
      <Offer />
      <Process />
      <Faq />
      <Contact />
    </>
  )
}
