import { useState } from 'react'
import { motion } from 'framer-motion'
import { Input, Textarea } from '../ui/Input'
import { Button } from '../ui/Button'

// Contact info from CONTENT.md
const contactInfo = {
  email: 'mediawaveisrael@gmail.com',
  phone: '052-8731808',
}

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    setSuccessMsg('')
    setErrorMsg('')

    const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT

    if (!endpoint) {
      setErrorMsg('חסר קישור לשליחה')
      return
    }

    setIsSubmitting(true)
    try {
      await fetch(endpoint, {
        method: 'POST',
        mode: 'no-cors',
        body: new URLSearchParams({
          fullName: formData.name,
          email: formData.email,
          message: formData.message,
          page: window.location.href,
          userAgent: navigator.userAgent,
        }),
      })

      setSuccessMsg('ההודעה נשלחה בהצלחה! נחזור אליכם בהקדם')
      setFormData({ name: '', email: '', message: '' })
    } catch {
      setErrorMsg('משהו השתבש בשליחה. נסו שוב.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      id="contact"
      className="py-32 md:py-40 bg-cream"
    >
      <div className="container max-w-5xl">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2
            className="text-h2 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            בואו נדבר
          </motion.h2>

          <motion.p
            className="text-lg text-brown-light"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            מעוניינים באתר חדש? נשמח לשמוע על הפרויקט שלכם
          </motion.p>
        </div>

        {/* Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Form */}
          <motion.div
            className="order-2 lg:order-1"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="שם מלא"
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                />

                <Input
                  label="אימייל"
                  type="email"
                  name="email"
                  required
                  dir="ltr"
                  className="text-left"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                />

                <Textarea
                  label="הודעה"
                  name="message"
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                />

                {successMsg && (
                  <div className="bg-sage/10 border border-sage/30 p-4 rounded text-sage-dark text-sm">
                    {successMsg}
                  </div>
                )}

                {errorMsg && (
                  <div className="bg-coral/10 border border-coral/30 p-4 rounded text-coral text-sm">
                    {errorMsg}
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  isLoading={isSubmitting}
                  loadingText="שולח..."
                >
                  שליחת הודעה
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="order-1 lg:order-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="space-y-8">
              {/* Phone */}
              <a
                href={`tel:${contactInfo.phone.replace(/-/g, '')}`}
                className="group flex items-center gap-4 p-4 rounded-lg hover:bg-cream-dark transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-orange/10 flex items-center justify-center">
                  <PhoneIcon className="w-5 h-5 text-orange" />
                </div>
                <div>
                  <p className="text-sm text-brown-muted">טלפון</p>
                  <p className="text-lg font-semibold text-brown-dark group-hover:text-orange transition-colors" dir="ltr">
                    {contactInfo.phone}
                  </p>
                </div>
              </a>

              {/* Email */}
              <a
                href={`mailto:${contactInfo.email}`}
                className="group flex items-center gap-4 p-4 rounded-lg hover:bg-cream-dark transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-terracotta/10 flex items-center justify-center">
                  <EmailIcon className="w-5 h-5 text-terracotta" />
                </div>
                <div>
                  <p className="text-sm text-brown-muted">אימייל</p>
                  <p className="text-lg font-semibold text-brown-dark group-hover:text-terracotta transition-colors font-english" dir="ltr">
                    {contactInfo.email}
                  </p>
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/972528731808?text=%D7%94%D7%99%D7%99%2C%20%D7%90%D7%A0%D7%99%20%D7%9E%D7%AA%D7%A2%D7%A0%D7%99%D7%99%D7%9F%2F%D7%AA%20%D7%91%D7%91%D7%A0%D7%99%D7%99%D7%AA%20%D7%90%D7%AA%D7%A8"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-4 rounded-lg hover:bg-cream-dark transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-sage/10 flex items-center justify-center">
                  <WhatsAppIcon className="w-5 h-5 text-sage" />
                </div>
                <div>
                  <p className="text-sm text-brown-muted">וואטסאפ</p>
                  <p className="text-lg font-semibold text-brown-dark group-hover:text-sage transition-colors">
                    דברו איתנו
                  </p>
                </div>
              </a>

              {/* Note */}
              <p className="text-sm text-brown-muted p-4 bg-cream-dark rounded-lg">
                אנחנו מגיבים לפניות תוך 24 שעות בימי עסקים
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Icons
function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function EmailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
