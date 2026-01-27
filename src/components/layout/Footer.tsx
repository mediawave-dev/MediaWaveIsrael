import { motion } from 'framer-motion'
import { Logo } from '../ui'

// Quick links for navigation
const quickLinks = [
  { label: 'דף הבית', href: '#top' },
  { label: 'שירותים', href: '#services' },
  { label: 'העבודות שלנו', href: '#portfolio' },
  { label: 'שאלות נפוצות', href: '#faq' },
  { label: 'צור קשר', href: '#contact' },
]

// Legal links
const legalLinks = [
  { label: 'תקנון שימוש', href: '/terms' },
  { label: 'מדיניות פרטיות', href: '/privacy' },
]

const currentYear = new Date().getFullYear()

export default function Footer() {
  // Smooth scroll handler
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      if (href === '#top') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        const element = document.querySelector(href)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }
  }

  return (
    <footer className="relative bg-[#1a1a1a] overflow-hidden">
      {/* Top gold border */}
      <div className="absolute top-0 right-0 left-0 h-px bg-[#C89453]" />

      {/* Main footer content */}
      <div className="container relative py-16 md:py-20 px-4 sm:px-6">
        {/* Desktop: 4 columns, Tablet: 2 columns, Mobile: 1 column */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Section 1 - Company Info (Right side in RTL) */}
          <div className="lg:col-span-1">
            <div className="mb-5">
              <Logo variant="footer" />
            </div>
            <p className="text-[#C89453] font-semibold text-lg mb-3">
              נותנים לעסק שלך נוכחות דיגיטלית מנצחת
            </p>
            <p className="text-gray-400 leading-relaxed text-sm">
              אנחנו מתמחים בבניית אתרים מקצועיים ומודרניים שמביאים תוצאות אמיתיות.
              מהרעיון ועד ההשקה - אנחנו איתכם בכל שלב.
            </p>
          </div>

          {/* Section 2 - Quick Links */}
          <div className="lg:col-span-1">
            <h3 className="text-[#C89453] font-headline text-lg mb-6">קישורים מהירים</h3>
            <nav className="flex flex-col gap-3">
              {quickLinks.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleSmoothScroll(e, link.href)}
                  className="text-gray-400 hover:text-[#C89453] transition-colors duration-300 w-fit text-sm"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: -4 }}
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
          </div>

          {/* Section 3 - Contact Info */}
          <div className="lg:col-span-1">
            <h3 className="text-[#C89453] font-headline text-lg mb-6">יצירת קשר</h3>
            <div className="space-y-4">
              {/* Email */}
              <a
                href="mailto:mediawaveisrael@gmail.com"
                className="flex items-center gap-3 text-gray-400 hover:text-[#C89453] transition-colors duration-300 group"
              >
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 group-hover:bg-[#C89453]/20 transition-colors duration-300 flex-shrink-0">
                  <MailIcon />
                </span>
                <span className="text-sm" dir="ltr">mediawaveisrael@gmail.com</span>
              </a>

              {/* Phone */}
              <a
                href="tel:052-8731808"
                className="flex items-center gap-3 text-gray-400 hover:text-[#C89453] transition-colors duration-300 group"
              >
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 group-hover:bg-[#C89453]/20 transition-colors duration-300">
                  <PhoneIcon />
                </span>
                <span className="text-sm" dir="ltr">052-8731808</span>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/972528731808?text=%D7%94%D7%99%D7%99%2C%20%D7%90%D7%A0%D7%99%20%D7%9E%D7%AA%D7%A2%D7%A0%D7%99%D7%99%D7%9F%2F%D7%AA%20%D7%91%D7%91%D7%A0%D7%99%D7%99%D7%AA%20%D7%90%D7%AA%D7%A8"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-400 hover:text-[#C89453] transition-colors duration-300 group"
              >
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 group-hover:bg-[#C89453]/20 transition-colors duration-300">
                  <WhatsAppIcon />
                </span>
                <span className="text-sm">WhatsApp</span>
              </a>

              {/* Hours */}
              <div className="flex items-center gap-3 text-gray-400">
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 flex-shrink-0">
                  <ClockIcon />
                </span>
                <span className="text-sm">ראשון-חמישי: 9:00-18:00</span>
              </div>
            </div>
          </div>

          {/* Section 4 - Legal */}
          <div className="lg:col-span-1">
            <h3 className="text-[#C89453] font-headline text-lg mb-6">משפטי</h3>
            <nav className="flex flex-col gap-3">
              {legalLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: -4 }}
                  className="w-fit"
                >
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-[#C89453] transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </a>
                </motion.div>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Social Media Icons */}
            <div className="flex items-center gap-4 order-2 md:order-1">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:bg-[#C89453]/20 hover:text-[#C89453] transition-all duration-300"
                aria-label="Facebook"
              >
                <FacebookIcon />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:bg-[#C89453]/20 hover:text-[#C89453] transition-all duration-300"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:bg-[#C89453]/20 hover:text-[#C89453] transition-all duration-300"
                aria-label="LinkedIn"
              >
                <LinkedInIcon />
              </a>
            </div>

            {/* Copyright */}
            <p className="text-gray-500 text-sm order-1 md:order-2">
              © {currentYear} MediaWave Israel. כל הזכויות שמורות
            </p>

            {/* Credits */}
            <p className="text-gray-500 text-sm order-3">
              Designed & Developed by{' '}
              <a
                href="https://www.mediawaveisrael.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C89453] hover:text-[#D4A060] transition-colors font-semibold"
              >
                MediaWave Israel
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button with glow pulse */}
      <motion.a
        href="https://wa.me/972528731808?text=%D7%94%D7%99%D7%99%2C%20%D7%90%D7%A0%D7%99%20%D7%9E%D7%AA%D7%A2%D7%A0%D7%99%D7%99%D7%9F%2F%D7%AA%20%D7%91%D7%91%D7%A0%D7%99%D7%99%D7%AA%20%D7%90%D7%AA%D7%A8%20%D7%95%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%A9%D7%9E%D7%95%D7%A2%20%D7%A4%D7%A8%D7%98%D7%99%D7%9D%20%D7%A0%D7%95%D7%A1%D7%A4%D7%99%D7%9D%20%F0%9F%98%8A"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-30 h-12 sm:h-14 bg-[#25D366] rounded-full shadow-lg flex items-center gap-2 px-3 sm:px-4"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="צור קשר בוואטסאפ"
      >
        {/* Pulsing ring effect */}
        <motion.span
          className="absolute inset-0 rounded-full bg-[#25D366]"
          animate={{
            scale: [1, 1.4, 1.4],
            opacity: [0.4, 0, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
        <motion.span
          className="absolute inset-0 rounded-full bg-[#25D366]"
          animate={{
            scale: [1, 1.3, 1.3],
            opacity: [0.3, 0, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeOut',
            delay: 0.3,
          }}
        />
        <svg className="relative z-10 w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        <span className="relative z-10 text-sm sm:text-base font-semibold hidden sm:inline" style={{ color: 'white' }}>דברו איתנו</span>
      </motion.a>
    </footer>
  )
}

// Icon Components
function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2"/>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}
