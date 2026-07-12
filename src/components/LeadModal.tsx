import { useState, useEffect, useRef } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { LottieIcon } from './ui/LottieIcon'
import { X, User, Phone } from 'lucide-react'
import { isValidName, isValidPhone, validationErrors } from '../utils/validation'
import { getWhatsAppUrl, WHATSAPP_URLS } from '../utils/whatsapp'
import { track } from '../utils/analytics'

// Same endpoint as Contact form
const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT

export default function LeadModal() {
    const [isVisible, setIsVisible] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)
    const [waHandoff, setWaHandoff] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    // Validation errors live on the failing field (aria-invalid + aria-describedby
    // via Input); the form-level alert is only for send failures
    const [fieldErrors, setFieldErrors] = useState<{ name?: string; phone?: string }>({})
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
    })

    useEffect(() => {
        // Check if previously submitted (permanent)
        const hasSubmitted = localStorage.getItem('leadModalSubmitted')
        if (hasSubmitted) return

        // Check if previously closed in this session (temporary)
        const hasClosed = sessionStorage.getItem('leadModalClosed')
        if (hasClosed) return

        // Show after 35 seconds
        const timer = setTimeout(() => {
            setIsVisible(true)
        }, 35000)

        return () => clearTimeout(timer)
    }, [])

    const handleClose = () => {
        setIsVisible(false)
        sessionStorage.setItem('leadModalClosed', 'true')
    }

    // Dialog behavior (same pattern as ChatWidget): Escape closes, Tab stays
    // inside, focus enters the card and returns to where the visitor was
    const cardRef = useRef<HTMLDivElement>(null)
    const closeButtonRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        if (!isVisible) return

        const previouslyFocused = document.activeElement as HTMLElement | null
        closeButtonRef.current?.focus()

        const handleKeyDown = (e: globalThis.KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsVisible(false)
                sessionStorage.setItem('leadModalClosed', 'true')
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

        setFieldErrors({})

        // No endpoint configured — hand the lead off to WhatsApp with the details
        // prefilled. Never show a fake "received" state for data that went nowhere.
        if (!endpoint) {
            const waMessage = `היי, אני ${formData.name.trim()} ואשמח לשיחת ייעוץ ללא עלות.\nטלפון: ${formData.phone.trim()}`
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
            const message = `New Lead from Popup. Phone: ${formData.phone.trim()}`

            await fetch(endpoint, {
                method: 'POST',
                mode: 'no-cors',
                body: new URLSearchParams({
                    fullName: formData.name.trim(),
                    phone: formData.phone.trim(),
                    message: message,
                    page: window.location.href,
                    userAgent: navigator.userAgent,
                }),
            })

            // Mark as submitted permanently
            localStorage.setItem('leadModalSubmitted', 'true')
            track('lead_submit', { placement: 'lead_modal', mode: 'endpoint' })
            setSuccess(true)

            // Close after success message shown briefly
            setTimeout(() => {
                setIsVisible(false)
            }, 3000)

        } catch {
            setErrorMsg('משהו השתבש בשליחה. נסו שוב, או דברו איתנו ישירות בוואטסאפ.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <m.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Modal Card */}
                    <m.div
                        ref={cardRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="lead-modal-title"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 overflow-hidden"
                    >
                        {/* Dashed Border Decoration */}
                        <div className="absolute inset-0 border-[3px] border-dashed border-orange/30 rounded-2xl m-2 pointer-events-none" />

                        {/* Close Button */}
                        <button
                            ref={closeButtonRef}
                            onClick={handleClose}
                            aria-label="סגירת החלון"
                            className="absolute top-2 left-2 sm:top-4 sm:left-4 p-1 text-brown-muted hover:text-sky-ink transition-colors z-10"
                        >
                            <X size={20} aria-hidden="true" />
                        </button>

                        {success ? (
                            <div className="text-center py-10">
                                <div className="w-16 h-16 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl text-sage-dark">✓</span>
                                </div>
                                <h3 id="lead-modal-title" className="text-2xl font-bold text-brown-dark mb-2">תודה!</h3>
                                <p className="text-brown">
                                    {waHandoff
                                        ? 'פתחנו לכם וואטסאפ עם ההודעה מוכנה, רק ללחוץ על שלח 😊'
                                        : 'הפרטים התקבלו, נחזור אליכם בהקדם.'}
                                </p>
                            </div>
                        ) : (
                            <div className="text-center relative z-10">
                                <h3 id="lead-modal-title" className="text-xl md:text-2xl font-bold text-brown-dark mb-2">
                                    השאירו פרטים ונחזור אליכם לשיחת ייעוץ ללא עלות!
                                </h3>

                                {/* Lead animation */}
                                <div className="flex justify-center mb-4">
                                    <LottieIcon
                                        animationPath="/animations/13%20Leave%20Details/contact%20us.json"
                                        size={150}
                                        playOnHover={false}
                                        loop={true}
                                    />
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <Input
                                        label="שם מלא"
                                        type="text"
                                        required
                                        error={fieldErrors.name}
                                        value={formData.name}
                                        onChange={(e) => {
                                            setFieldErrors({})
                                            setFormData(prev => ({ ...prev, name: e.target.value }))
                                        }}
                                        icon={<User size={18} />}
                                        className="bg-cream-dark border-cream-darker focus:border-orange text-right"
                                    />

                                    <Input
                                        label="טלפון"
                                        type="tel"
                                        required
                                        error={fieldErrors.phone}
                                        value={formData.phone}
                                        onChange={(e) => {
                                            setFieldErrors({})
                                            setFormData(prev => ({ ...prev, phone: e.target.value }))
                                        }}
                                        className="bg-cream-dark border-cream-darker focus:border-orange text-right"
                                        icon={<Phone size={18} />}
                                        dir="ltr" // Keep numbers LTR
                                    />

                                    <div className="flex items-start gap-2 text-right text-xs text-brown-muted mt-2">
                                        <input type="checkbox" required id="privacy" className="mt-1 accent-orange" />
                                        <label htmlFor="privacy">
                                            אני מאשר/ת שקראתי ואישרתי את תנאי מדיניות הפרטיות של האתר.
                                        </label>
                                    </div>

                                    {errorMsg && (
                                        <div role="alert" aria-live="assertive" className="bg-coral/10 border border-coral/30 p-3 rounded text-coral text-sm text-right">
                                            {errorMsg}{' '}
                                            <a
                                                href={WHATSAPP_URLS.general}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:underline font-semibold"
                                            >
                                                לוואטסאפ
                                            </a>
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        variant="primary"
                                        className="w-full font-bold py-3 rounded-full text-lg shadow-lg shadow-orange/20"
                                        isLoading={isSubmitting}
                                    >
                                        תחזרו אליי
                                    </Button>
                                </form>
                            </div>
                        )}
                    </m.div>
                </div>
            )}
        </AnimatePresence>
    )
}
