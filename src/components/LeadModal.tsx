import { useState, useEffect } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { LottieIcon } from './ui/LottieIcon'
import { X, User, Phone } from 'lucide-react'
import { isValidName, isValidPhone, validationErrors } from '../utils/validation'

// Same endpoint as Contact form
const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT

export default function LeadModal() {
    const [isVisible, setIsVisible] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
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

        // Show after 60 seconds
        const timer = setTimeout(() => {
            setIsVisible(true)
        }, 60000)

        return () => clearTimeout(timer)
    }, [])

    const handleClose = () => {
        setIsVisible(false)
        sessionStorage.setItem('leadModalClosed', 'true')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (isSubmitting) return

        setErrorMsg('')

        // Validation
        if (!isValidName(formData.name)) {
            setErrorMsg(validationErrors.name)
            return
        }

        if (!isValidPhone(formData.phone)) {
            setErrorMsg(validationErrors.phone)
            return
        }

        setIsSubmitting(true)

        try {
            if (endpoint) {
                // Send to Google Sheets
                // Note: Sending phone in message as fallback, and as separate field
                const message = `New Lead from Popup. Phone: ${formData.phone.trim()}`

                await fetch(endpoint, {
                    method: 'POST',
                    mode: 'no-cors',
                    body: new URLSearchParams({
                        fullName: formData.name.trim(),
                        email: 'popup@lead.com', // Placeholder for script compatibility
                        phone: formData.phone.trim(),
                        message: message,
                        page: window.location.href,
                        userAgent: navigator.userAgent,
                    }),
                })
            }

            // Mark as submitted permanently
            localStorage.setItem('leadModalSubmitted', 'true')
            setSuccess(true)

            // Close after success message shown briefly
            setTimeout(() => {
                setIsVisible(false)
            }, 3000)

        } catch {
            setErrorMsg('משהו השתבש בשליחה. נסו שוב.')
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
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 overflow-hidden"
                    >
                        {/* Dashed Border Decoration */}
                        <div className="absolute inset-0 border-[3px] border-dashed border-orange/30 rounded-2xl m-2 pointer-events-none" />

                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-4 left-4 p-1 text-brown-muted hover:text-orange transition-colors z-10"
                        >
                            <X size={20} />
                        </button>

                        {success ? (
                            <div className="text-center py-10">
                                <div className="w-16 h-16 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl text-sage-dark">✓</span>
                                </div>
                                <h3 className="text-2xl font-bold text-brown-dark mb-2">תודה!</h3>
                                <p className="text-brown">הפרטים התקבלו, נחזור אליכם בהקדם.</p>
                            </div>
                        ) : (
                            <div className="text-center relative z-10">
                                <h3 className="text-xl md:text-2xl font-bold text-brown-dark mb-2">
                                    השאירו פרטים ונחזור אליכם לשיחת ייעוץ ללא עלות!
                                </h3>

                                {/* Lead animation */}
                                <div className="flex justify-center mb-4">
                                    <LottieIcon
                                        animationPath="/animations/13 Leave Details/contact us.json"
                                        size={100}
                                        playOnHover={false}
                                        loop={true}
                                    />
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <Input
                                        label="שם מלא"
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        icon={<User size={18} />}
                                        className="bg-cream-dark border-cream-darker focus:border-orange text-right"
                                    />

                                    <Input
                                        label="טלפון"
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
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
                                            {errorMsg}
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
