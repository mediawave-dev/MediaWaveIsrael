import { useState, useEffect, useRef } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { LookButton } from '@look/button'
import { LottieIcon } from './ui/LottieIcon'
import { X } from 'lucide-react'
import '../look/lead-modal.css'
import { isValidName, isValidPhone, validationErrors } from '../utils/validation'
import { getWhatsAppUrl, WHATSAPP_URLS } from '../utils/whatsapp'
import { track } from '../utils/analytics'
import { createLeadIntent, type LeadIntent } from '../utils/lead-intent.js'
import { leadReady, sendLead } from '../utils/lead'

export default function LeadModal() {
    const [isVisible, setIsVisible] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)
    const [waHandoff, setWaHandoff] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    // Validation errors live on the failing field (aria-invalid + aria-describedby
    // via Input); the form-level alert is only for send failures
    const [fieldErrors, setFieldErrors] = useState<{ name?: string; phone?: string; privacy?: string }>({})
    const [privacyChecked, setPrivacyChecked] = useState(false)
    // (D218) the site's own mail (/api/lead), asked only once the modal opens; until it answers yes,
    // the details go to WhatsApp. `opened` dates the send for the server's bot check.
    const [mail, setMail] = useState(false)
    const opened = useRef(0)
    useEffect(() => {
        if (!isVisible) return
        opened.current ||= Date.now()
        let on = true
        void leadReady().then((ok) => { if (on) setMail(ok) })
        return () => { on = false }
    }, [isVisible])
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
    })

    // Open on intent, never on a bare timer (Nati, 2026-10-15). The old "10 s after halfway"
    // trigger covered the whole story for anyone who read slowly (diagnosis: frames 21-37 of the
    // phone film were all popup). lead-intent.js scores what the visitor does (engaged reading,
    // time on the process and FAQ, opening FAQ answers, coming back to the tab, scrolling back up)
    // and opens on two signals, or on one strong one (the pointer leaving through the top edge after
    // real reading; reading to the footer and heading back up), and only at a calm moment: not while
    // scrolling, typing, navigating by keyboard, jumping to an anchor, with the contact form in view,
    // with a dialog (chat, accessibility, menu) open, or while the cookie banner waits for an answer.
    // A WhatsApp, phone or mail click or any form submit counts as converted: never again.
    const intentRef = useRef<LeadIntent | null>(null)
    useEffect(() => {
        const intent = createLeadIntent({
            onOpen: (reason) => {
                track('lead_modal_open', { reason })
                setIsVisible(true)
            },
            isBusy: () => document.body.classList.contains('mw-consent-open'),
            // Keys the previous trigger wrote: a visitor who already submitted or closed stays quiet
            legacyConverted: ['leadModalSubmitted'],
            legacyDismissed: ['leadModalClosed'],
        })
        intentRef.current = intent
        return () => intent.destroy()
    }, [])

    const handleClose = () => {
        setIsVisible(false)
        sessionStorage.setItem('leadModalClosed', 'true')
        intentRef.current?.dismissed()
    }

    // Dialog behavior (same pattern as ChatWidget): Escape closes, Tab stays
    // inside, focus enters the card and returns to where the visitor was.
    // Focus lands on the title, not the close button: the popup opens by itself
    // (no tap before it), so a phone drew the focus ring around the X (Nati, 16.10).
    // A long dialog starting at a static element at its top is the APG pattern;
    // Tab goes on to the first field, Shift+Tab to the close button.
    const cardRef = useRef<HTMLDivElement>(null)
    const closeButtonRef = useRef<HTMLButtonElement>(null)
    const titleRef = useRef<HTMLHeadingElement>(null)

    useEffect(() => {
        if (!isVisible) return

        const previouslyFocused = document.activeElement as HTMLElement | null
        ;(titleRef.current ?? closeButtonRef.current)?.focus({ preventScroll: true })

        const handleKeyDown = (e: globalThis.KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsVisible(false)
                sessionStorage.setItem('leadModalClosed', 'true')
                intentRef.current?.dismissed()
                return
            }

            if (e.key !== 'Tab' || !cardRef.current) return

            const focusable = cardRef.current.querySelectorAll<HTMLElement>(
                'a[href], button:not([disabled]), input:not([disabled])'
            )
            if (focusable.length === 0) return
            const first = focusable[0]
            const last = focusable[focusable.length - 1]

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault()
                last.focus()
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault()
                first.focus()
            } else if (!cardRef.current.contains(document.activeElement)) {
                e.preventDefault()
                first.focus()
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            previouslyFocused?.focus?.()
        }
    }, [isVisible])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (isSubmitting) return

        setErrorMsg('')

        // Validation
        if (!isValidName(formData.name)) {
            setFieldErrors({ name: validationErrors.name })
            return
        }

        if (!isValidPhone(formData.phone)) {
            setFieldErrors({ phone: validationErrors.phone })
            return
        }

        // noValidate on the form means the browser no longer enforces the
        // required checkbox — validate it here with a Hebrew announced error
        if (!privacyChecked) {
            setFieldErrors({ privacy: validationErrors.privacy })
            return
        }

        setFieldErrors({})

        // No mail on the server: hand the lead off to WhatsApp with the details
        // prefilled. Never show a fake "received" state for data that went nowhere.
        if (!mail) {
            const waMessage = `היי, אני ${formData.name.trim()}. אשמח שתחזרו אליי לשיחה.\nטלפון: ${formData.phone.trim()}`
            track('lead_submit', { placement: 'lead_modal', mode: 'whatsapp_fallback' })
            window.open(getWhatsAppUrl(waMessage), '_blank', 'noopener')
            setWaHandoff(true)
            setSuccess(true)
            setTimeout(() => {
                setIsVisible(false)
            }, 4000)
            return
        }

        setIsSubmitting(true)

        try {
            const res = await sendLead({
                kind: 'callback', name: formData.name.trim(), phone: formData.phone.trim(),
                t: opened.current ? Date.now() - opened.current : 0,
            })
            if (!res.ok) throw new Error(`lead not sent: ${res.error ?? 'network'}`)

            // Mark as submitted permanently
            localStorage.setItem('leadModalSubmitted', 'true')
            track('lead_submit', { placement: 'lead_modal', mode: 'endpoint' })
            setSuccess(true)

            // Close after success message shown briefly
            setTimeout(() => {
                setIsVisible(false)
            }, 3000)

        } catch {
            setErrorMsg('הפרטים לא נשלחו. נסו שוב, או כתבו לנו ישר בוואטסאפ.')
        } finally {
            setIsSubmitting(false)
        }
    }

    // The look's dialog (DECISIONS #54): the current ground and ink (KM: whichever of the
    // stage or the void is on screen), labelled fields, the look's button with its states.
    const field = (id: 'name' | 'phone', label: string, props: Record<string, unknown>) => {
        const err = fieldErrors[id]
        return (
            <div className="lm__field" data-invalid={err ? '' : undefined}>
                <label htmlFor={`lead-${id}`}>{label}</label>
                <input
                    id={`lead-${id}`}
                    required
                    value={formData[id]}
                    aria-invalid={err ? true : undefined}
                    aria-describedby={err ? `lead-${id}-err` : undefined}
                    onChange={(e) => {
                        setFieldErrors({})
                        setFormData(prev => ({ ...prev, [id]: e.target.value }))
                    }}
                    {...props}
                />
                {err && <p id={`lead-${id}-err`} className="lm__err">{err}</p>}
            </div>
        )
    }

    return (
        <AnimatePresence>
            {isVisible && (
                /* z-60: above the cookie banner (z-50) so the form is never covered */
                <div className="lm" data-lenis-prevent="">
                    <m.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="lm__backdrop"
                    />
                    <m.div
                        ref={cardRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="lead-modal-title"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 16 }}
                        transition={{ duration: 0.25 }}
                        className="lm__card"
                    >
                        <button ref={closeButtonRef} type="button" onClick={handleClose} aria-label="סגירת החלון" className="lm__close">
                            <X size={22} aria-hidden="true" />
                        </button>

                        {success ? (
                            <div className="lm__done">
                                <span className="lm__check" aria-hidden="true">✓</span>
                                <h3 id="lead-modal-title">תודה.</h3>
                                <p>
                                    {waHandoff
                                        ? 'ההודעה מחכה לכם בוואטסאפ. נשאר רק לשלוח.'
                                        : 'קיבלנו. נחזור אליכם תוך 24 שעות בימי עסקים.'}
                                </p>
                            </div>
                        ) : (
                            <>
                                <h3 id="lead-modal-title" ref={titleRef} tabIndex={-1}>רוצים שנחזור אליכם? השאירו שם וטלפון.</h3>
                                <div className="lm__face" aria-hidden="true">
                                    <LottieIcon
                                        animationPath="/animations/13%20Leave%20Details/contact%20us.json"
                                        size={120}
                                        playOnHover={false}
                                        loop={true}
                                    />
                                </div>
                                <form onSubmit={handleSubmit} noValidate className="lm__form">
                                    {field('name', 'שם מלא', { type: 'text', autoComplete: 'name' })}
                                    {field('phone', 'טלפון', { type: 'tel', autoComplete: 'tel', inputMode: 'tel', dir: 'ltr' })}
                                    <div className="lm__privacy">
                                        <input
                                            type="checkbox"
                                            required
                                            id="privacy"
                                            checked={privacyChecked}
                                            aria-invalid={fieldErrors.privacy ? true : undefined}
                                            aria-describedby={fieldErrors.privacy ? 'privacy-error' : undefined}
                                            onChange={(e) => {
                                                setPrivacyChecked(e.target.checked)
                                                setFieldErrors({})
                                            }}
                                        />
                                        <label htmlFor="privacy">
                                            קראתי את <a href="/privacy" target="_blank" rel="noopener noreferrer">מדיניות הפרטיות</a> של האתר והסכמתי לה.
                                        </label>
                                    </div>
                                    {fieldErrors.privacy && (
                                        <p id="privacy-error" role="alert" className="lm__err">{fieldErrors.privacy}</p>
                                    )}
                                    {errorMsg && (
                                        <p role="alert" className="lm__failure">
                                            {errorMsg}{' '}
                                            <a
                                                href={WHATSAPP_URLS.general}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={() => track('whatsapp_click', { placement: 'lead_modal_error_alert' })}
                                            >
                                                לוואטסאפ
                                            </a>
                                        </p>
                                    )}
                                    <LookButton type="submit" block live state={isSubmitting ? 'loading' : errorMsg ? 'error' : 'idle'}>
                                        {mail ? 'תחזרו אליי' : 'שליחה בוואטסאפ'}
                                    </LookButton>
                                </form>
                            </>
                        )}
                    </m.div>
                </div>
            )}
        </AnimatePresence>
    )
}
