import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Input, Textarea } from '../ui/Input'
import { Button } from '../ui/Button'

// Contact info from CONTENT.md
const contactInfo = {
  email: 'mediawaveisrael@gmail.com',
  phone: '052-8731808',
  note: 'אנחנו מגיבים לפניות תוך 24 שעות בימי עסקים. לפניות דחופות, מומלץ להתקשר.',
}

export default function Contact() {
  const containerRef = useRef<HTMLElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], [0, -50])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    // Reset form
    setFormData({ name: '', email: '', message: '' })
  }

  return (
    <section
      ref={containerRef}
      id="contact"
      className="relative py-24 md:py-32 bg-cream-dark overflow-hidden"
    >
      {/* Background pattern - subtle dots */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, var(--color-brown) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Watercolor blobs with parallax */}
      <motion.div
        className="absolute top-20 right-[5%] w-80 h-80 pointer-events-none"
        style={{ y: bgY }}
      >
        <div className="w-full h-full rounded-full bg-orange/6 blur-3xl" />
      </motion.div>
      <motion.div
        className="absolute bottom-32 left-[10%] w-64 h-64 pointer-events-none"
        style={{ y: bgY }}
      >
        <div className="w-full h-full rounded-full bg-terracotta/5 blur-3xl" />
      </motion.div>

      <div className="container relative">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          {/* Badge */}
          <motion.span
            className="inline-flex items-center gap-2 bg-orange/10 text-orange text-sm font-semibold px-5 py-2.5 rounded-full mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="w-2 h-2 bg-orange rounded-full animate-pulse" />
            יצירת קשר
          </motion.span>

          {/* Title */}
          <motion.h2
            className="text-h2 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            בואו נדבר
          </motion.h2>

          {/* Subtitle from CONTENT.md */}
          <motion.p
            className="text-lg text-brown-light"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            מעוניינים באתר חדש או דף נחיתה? נשמח לשמוע על הפרויקט שלכם
          </motion.p>
        </div>

        {/* Two columns: Form RIGHT + Info LEFT (RTL) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Form Column - RIGHT side (spans 7 cols) */}
          <motion.div
            className="lg:col-span-7 lg:order-2"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-card">
              {/* Form header decoration */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-1 bg-orange rounded-full" />
                <span className="text-sm font-semibold text-orange">שלחו לנו הודעה</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name field */}
                <Input
                  label="שם מלא"
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                />

                {/* Email field */}
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

                {/* Message field */}
                <Textarea
                  label="הודעה"
                  name="message"
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                />

                {/* Submit button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  isLoading={isSubmitting}
                  loadingText="שולח..."
                  icon={<ArrowIcon />}
                >
                  שליחת הודעה
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Contact Info Column - LEFT side (spans 5 cols) */}
          <motion.div
            className="lg:col-span-5 lg:order-1"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Creative division - watercolor illustration */}
            <div className="relative mb-12">
              <ContactIllustration />
            </div>

            {/* Contact details */}
            <div className="space-y-6">
              {/* Phone */}
              <motion.a
                href={`tel:${contactInfo.phone.replace(/-/g, '')}`}
                className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-white/50 transition-colors"
                whileHover={{ x: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-14 h-14 rounded-2xl bg-orange/10 flex items-center justify-center group-hover:bg-orange/20 transition-colors">
                  <PhoneIcon className="w-6 h-6 text-orange" />
                </div>
                <div>
                  <p className="text-sm text-brown-muted mb-1">טלפון</p>
                  <p className="text-lg font-semibold text-brown-dark group-hover:text-orange transition-colors" dir="ltr">
                    {contactInfo.phone}
                  </p>
                </div>
              </motion.a>

              {/* Email */}
              <motion.a
                href={`mailto:${contactInfo.email}`}
                className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-white/50 transition-colors"
                whileHover={{ x: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-14 h-14 rounded-2xl bg-terracotta/10 flex items-center justify-center group-hover:bg-terracotta/20 transition-colors">
                  <EmailIcon className="w-6 h-6 text-terracotta" />
                </div>
                <div>
                  <p className="text-sm text-brown-muted mb-1">אימייל</p>
                  <p className="text-lg font-semibold text-brown-dark group-hover:text-terracotta transition-colors break-all font-english">
                    {contactInfo.email}
                  </p>
                </div>
              </motion.a>

              {/* WhatsApp */}
              <motion.a
                href="https://wa.me/972528731808"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-white/50 transition-colors"
                whileHover={{ x: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-14 h-14 rounded-2xl bg-sage/15 flex items-center justify-center group-hover:bg-sage/25 transition-colors">
                  <WhatsAppIcon className="w-6 h-6 text-sage" />
                </div>
                <div>
                  <p className="text-sm text-brown-muted mb-1">וואטסאפ</p>
                  <p className="text-lg font-semibold text-brown-dark group-hover:text-sage transition-colors">
                    דברו איתנו
                  </p>
                </div>
              </motion.a>

              {/* Note */}
              <motion.p
                className="text-sm text-brown-muted mt-8 p-4 bg-white/40 rounded-xl border border-cream-darker/20"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                {contactInfo.note}
              </motion.p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-1/4 left-[15%] w-3 h-3 rounded-full bg-orange/30 hidden lg:block"
        animate={{ y: [0, -15, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/3 right-[8%] w-2 h-2 rounded-full bg-terracotta/40 hidden lg:block"
        animate={{ y: [0, 12, 0], x: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
    </section>
  )
}

// Watercolor-style illustration for contact section
function ContactIllustration() {
  return (
    <motion.svg
      viewBox="0 0 300 200"
      className="w-full max-w-xs mx-auto lg:mx-0"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <defs>
        <filter id="contactBlur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
        </filter>
        <radialGradient id="contactOrange" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#F5A623" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#F5A623" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="contactTerracotta" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#E07B54" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#E07B54" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background blobs */}
      <ellipse cx="100" cy="100" rx="80" ry="60" fill="url(#contactOrange)" filter="url(#contactBlur)" />
      <ellipse cx="200" cy="120" rx="60" ry="50" fill="url(#contactTerracotta)" filter="url(#contactBlur)" />

      {/* Envelope shape */}
      <motion.path
        d="M80,80 L150,120 L220,80 L220,150 L80,150 Z"
        fill="none"
        stroke="var(--color-orange)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-40"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 0.3 }}
      />
      <motion.path
        d="M80,80 L150,115 L220,80"
        fill="none"
        stroke="var(--color-terracotta)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-50"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.6 }}
      />

      {/* Decorative dots */}
      {[
        { cx: 60, cy: 70, r: 4 },
        { cx: 240, cy: 90, r: 3 },
        { cx: 120, cy: 170, r: 5 },
        { cx: 200, cy: 60, r: 3 },
      ].map((dot, i) => (
        <motion.circle
          key={i}
          cx={dot.cx}
          cy={dot.cy}
          r={dot.r}
          fill="var(--color-orange)"
          className="opacity-40"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 + i * 0.1 }}
        />
      ))}
    </motion.svg>
  )
}

// Icon components
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

function ArrowIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  )
}
