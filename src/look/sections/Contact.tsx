// Contact in the looks (step 3). The form is the page's last ask, so it is plain and calm:
// labelled fields (never a placeholder for a label), errors on the failing field, the look's
// button driven by the real states (idle, loading, sent, error). The Rive companion sits on
// the form and answers it (DECISIONS #56, design/rive/companion/CONTRACT.md): the hero's
// laptop writes the message on its screen as you type, folds it into the Horizon line while it
// is sent and fills into the mark when it arrives. In KM: on the stage.
// Every track() call of the old section is kept.
// The shot (SPEC S8) adds, only when LOOK === 'shot': the business card (.ct__card around the
// Lottie and the four ways), overlap-audit zones on the ways, the time line and the messages,
// and its own companion file through `pal`. The props are optional; the looks' DOM is unchanged.

import { Fragment, useEffect, useRef, useState, type FocusEvent, type FormEvent, type ReactNode } from 'react'
import { LookButton } from '@look/button'
import type { BtnState } from '../buttons/StateButton'
import { useMotionEngine } from '../../motion/ScrollEngineProvider'
import { LottieIcon } from '../../components/ui/LottieIcon'
import Companion, { type CompanionStatus } from '../parts/Companion'
import { isValidEmail, isValidName, isValidMessage, validationErrors } from '../../utils/validation'
import { WHATSAPP_URLS, getWhatsAppUrl } from '../../utils/whatsapp'
import { SITE_CONTACT } from '../../data/site'
import { track } from '../../utils/analytics'
import { LOOK } from '../look'
import './contact.css'

type Field = 'name' | 'email' | 'message'

const SHOT = LOOK === 'shot'
/** overlap-audit zone for the shot's text (the looks keep their markup as it was) */
const Z = SHOT ? 'text' : undefined
/** the shot's business card around the Lottie and the ways; a Fragment in the looks */
const Card = ({ children }: { children: ReactNode }) => (SHOT ? <div className="ct__card">{children}</div> : <Fragment>{children}</Fragment>)

interface ContactProps {
  /** data-chapter on the section (the shot's chapter id) */
  chapter?: string
  /** data-dossier on the section */
  dossier?: string
  /** the companion's file and rest pose in another palette (passed through as Companion `src`) */
  pal?: { riv: string; rest: string }
  /** a line above the heading (the shot's chapter verb) */
  kicker?: ReactNode
}

export default function Contact({ chapter, dossier, pal: palSrc, kicker }: ContactProps = {}) {
  const engine = useMotionEngine()
  const [data, setData] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [state, setState] = useState<BtnState>('idle')
  const [status, setStatus] = useState('')
  const [failure, setFailure] = useState('')
  const [focused, setFocused] = useState(false)
  const [keys, setKeys] = useState(0)
  const timer = useRef(0)
  useEffect(() => () => clearTimeout(timer.current), [])

  // the companion's state: the request lifecycle first, then whether a field has focus
  const pal: CompanionStatus = state === 'loading' || state === 'sent' || state === 'error' ? state : focused ? 'typing' : 'idle'
  // 180 characters fill the laptop's page
  const progress = Math.min(100, ((data.name.length + data.email.length + data.message.length) * 100) / 180)
  const isField = (el: EventTarget | null) => el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement
  const focusIn = (e: FocusEvent) => { if (isField(e.target)) setFocused(true) }
  const focusOut = (e: FocusEvent) => { if (!isField(e.relatedTarget)) setFocused(false) }

  const change = (f: Field) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFailure('')
    setErrors({})
    if (state === 'error') setState('idle')
    setData((d) => ({ ...d, [f]: e.target.value }))
    setKeys((k) => k + 1)
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (state === 'loading') return
    setStatus('')
    setFailure('')
    // every error at once, focus on the first (one at a time took three submits to find three)
    // no form endpoint: the message goes to WhatsApp, so the email is optional (an address only helps)
    const needEmail = !!import.meta.env.VITE_CONTACT_ENDPOINT
    const errs: Partial<Record<Field, string>> = {}
    if (!isValidName(data.name)) errs.name = validationErrors.name
    if ((needEmail || data.email.trim()) && !isValidEmail(data.email)) errs.email = validationErrors.email
    if (!isValidMessage(data.message)) errs.message = validationErrors.message
    const first = (['name', 'email', 'message'] as Field[]).find((f) => errs[f])
    if (first) {
      setErrors(errs)
      requestAnimationFrame(() => document.getElementById(`contact-${first}`)?.focus())
      return
    }
    setErrors({})

    const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT
    // No endpoint: hand the message to WhatsApp, prefilled. Never pretend it was sent.
    if (!endpoint) {
      const wa = `היי, אני ${data.name.trim()}.\n${data.message.trim()}` + (data.email.trim() ? `\n(אימייל לחזרה: ${data.email.trim()})` : '')
      track('form_submit', { placement: 'contact_form', mode: 'whatsapp_fallback' })
      window.open(getWhatsAppUrl(wa), '_blank', 'noopener')
      setStatus('ההודעה מחכה לכם בוואטסאפ. נשאר רק לשלוח.')
      return
    }

    // a second send within 4.2 s must not be reset to idle by the first send's timer mid-request
    clearTimeout(timer.current)
    setState('loading')
    try {
      await fetch(endpoint, {
        method: 'POST',
        mode: 'no-cors',
        body: new URLSearchParams({
          fullName: data.name.trim(),
          email: data.email.trim(),
          message: data.message.trim(),
          page: window.location.href,
          userAgent: navigator.userAgent,
        }),
      })
      track('form_submit', { placement: 'contact_form', mode: 'endpoint' })
      setState('sent')
      setStatus('קיבלנו. נחזור אליכם תוך 24 שעות בימי עסקים.')
      setData({ name: '', email: '', message: '' })
      timer.current = window.setTimeout(() => setState('idle'), 4200)
    } catch {
      setState('error')
      setFailure('ההודעה לא נשלחה. נסו שוב, או כתבו לנו ישר בוואטסאפ.')
    }
  }

  const field = (f: Field, label: string, props: Record<string, unknown>, area = false) => {
    const id = `contact-${f}`
    const err = errors[f]
    const shared = {
      id, name: f, value: data[f], required: f !== 'email' || !!import.meta.env.VITE_CONTACT_ENDPOINT, onChange: change(f),
      'aria-invalid': err ? true : undefined, 'aria-describedby': err ? `${id}-err` : undefined, ...props,
    }
    return (
      <div className="ct__field" data-invalid={err ? '' : undefined}>
        <label htmlFor={id} data-zone={Z}>{label}</label>
        {area ? <textarea rows={5} {...shared} /> : <input {...shared} />}
        {err && <p id={`${id}-err`} className="ct__err">{err}</p>}
      </div>
    )
  }

  return (
    <section id="contact" className="ct" aria-labelledby="contact-title" data-theme="dark" data-intent="contact" data-chapter={chapter} data-dossier={dossier}>
      <div className="ct__in">
        <div className="ct__side">
          {kicker}
          <h2 id="contact-title" data-zone="text">דברו איתנו</h2>
          <p className="ct__lead" data-zone="text">כתבו כמה מילים על העסק ומה חסר לו. המפתח עצמו קורא ועונה.</p>
          <Card>
            <div className="ct__face" aria-hidden="true">
              <LottieIcon animationPath="/animations/12 Talk with us/Topictalk_icon.json" size={180} playOnHover={false} loop />
            </div>
            <ul className="ct__ways">
              <li className="ct__way--wa">
                <a data-zone={Z} href={WHATSAPP_URLS.contact} target="_blank" rel="noopener noreferrer" onClick={() => track('whatsapp_click', { placement: 'contact_section' })}>
                  <span>וואטסאפ</span><b>כתבו לנו בוואטסאפ</b>
                </a>
              </li>
              <li>
                <a data-zone={Z} href={`tel:${SITE_CONTACT.phone.replace(/-/g, '')}`} onClick={() => track('tel_click', { placement: 'contact_section' })}>
                  <span>טלפון</span><b dir="ltr">{SITE_CONTACT.phone}</b>
                </a>
              </li>
              <li>
                <a data-zone={Z} href={`mailto:${SITE_CONTACT.email}`} onClick={() => track('mailto_click', { placement: 'contact_section' })}>
                  <span>אימייל</span><b dir="ltr">{SITE_CONTACT.email}</b>
                </a>
              </li>
              <li>
                <a data-zone={Z} href={SITE_CONTACT.instagramUrl} target="_blank" rel="noopener noreferrer" onClick={() => track('instagram_click', { placement: 'contact_section' })}>
                  <span>אינסטגרם</span><b dir="ltr">@mediawaveisrael</b>
                </a>
              </li>
            </ul>
          </Card>
          <p className="ct__time" data-zone={Z}>{SITE_CONTACT.responseTime}</p>
        </div>

        <form className="ct__form" onSubmit={submit} onFocus={focusIn} onBlur={focusOut} noValidate>
          <Companion engine={engine} status={pal} progress={progress} keys={keys} src={palSrc} />
          {field('name', 'שם מלא', { type: 'text', autoComplete: 'name' })}
          {field('email', import.meta.env.VITE_CONTACT_ENDPOINT ? 'אימייל' : 'אימייל (לא חובה)', { type: 'email', autoComplete: 'email', dir: 'ltr', inputMode: 'email' })}
          {field('message', 'הודעה', {}, true)}
          {status && <p role="status" className="ct__status" data-zone={Z}>{status}</p>}
          {failure && (
            <p role="alert" className="ct__failure" data-zone={Z}>
              {failure}{' '}
              <a href={WHATSAPP_URLS.contact} target="_blank" rel="noopener noreferrer" onClick={() => track('whatsapp_click', { placement: 'contact_error_alert' })}>לוואטסאפ</a>
            </p>
          )}
          <LookButton type="submit" block state={state} live zone="text">{import.meta.env.VITE_CONTACT_ENDPOINT ? 'שליחת הודעה' : 'שליחה בוואטסאפ'}</LookButton>
        </form>
      </div>
    </section>
  )
}
