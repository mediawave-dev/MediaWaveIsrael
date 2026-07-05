import { useNavigate } from 'react-router-dom'
import { Logo } from '../ui'
import { WHATSAPP_URLS } from '../../utils/whatsapp'
import { footerLinks } from '../../config/navigation'

const currentYear = new Date().getFullYear()

export default function Footer() {
  const navigate = useNavigate()

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()

    // Route link (e.g., /blog) — ScrollToTop handles the scroll reset
    if (href.startsWith('/')) {
      navigate(href)
      return
    }

    // Hash link (e.g., #services)
    if (href === '#top') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <footer className="grain-surface relative bg-[#1a1a1a] overflow-hidden">
      {/* Main footer content */}
      <div className="relative max-w-[1100px] mx-auto px-6 pt-14 pb-5 md:pt-16">
        {/* ROW 1 — 3 columns on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-10 text-center md:text-right">
          {/* Column 1 — Logo + Tagline (rightmost in RTL) */}
          <div>
            <div className="flex justify-center md:justify-start mb-4">
              <Logo variant="footer" />
            </div>
            <p className="text-sm leading-relaxed text-cream/70">
              בונים נוכחות דיגיטלית מנצחת לעסקים
            </p>
          </div>

          {/* Column 2 — Quick Links */}
          <div>
            <h4
              className="text-sm font-semibold mb-4"
              style={{ color: '#7DD3FC' }}
            >
              קישורים מהירים
            </h4>
            <nav className="flex flex-col gap-2.5">
              {footerLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="text-sm transition-colors duration-200 w-fit mx-auto md:mx-0"
                  style={{ color: '#ABABAB' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#7DD3FC')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#ABABAB')}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Column 3 — Contact */}
          <div>
            <h4
              className="text-sm font-semibold mb-4"
              style={{ color: '#7DD3FC' }}
            >
              יצירת קשר
            </h4>
            <div className="flex flex-col gap-2.5">
              {/* Phone */}
              <a
                href="tel:052-8731808"
                className="footer-link flex items-center gap-2 text-sm justify-center md:justify-start"
              >
                <PhoneIcon />
                <span dir="ltr" className="font-mono-spec">052-8731808</span>
              </a>

              {/* WhatsApp */}
              <a
                href={WHATSAPP_URLS.footer}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link flex items-center gap-2 text-sm justify-center md:justify-start"
              >
                <WhatsAppIcon />
                <span className="font-english">WhatsApp</span>
              </a>

              {/* Email */}
              <a
                href="mailto:mediawaveisrael@gmail.com"
                className="footer-link flex items-center gap-2 text-sm justify-center md:justify-start"
              >
                <MailIcon />
                <span dir="ltr" className="whitespace-nowrap font-english">mediawaveisrael@gmail.com</span>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/mediawaveisrael?igsh=aXcwOGVsMXk0bmll&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link flex items-center gap-2 text-sm justify-center md:justify-start"
              >
                <InstagramIcon />
                <span className="font-english">Instagram</span>
              </a>
            </div>
          </div>
        </div>

        {/* ROW 2 — Bottom bar */}
        <div
          className="mt-10 pt-5 flex flex-col-reverse md:flex-row justify-between items-center gap-3"
          style={{ borderTop: '1px solid #333' }}
        >
          {/* Left side in RTL = copyright */}
          <p className="text-xs font-english text-cream/60">
            © {currentYear} MediaWave Israel
          </p>

          {/* Right side in RTL = legal links */}
          <div className="flex items-center gap-3 text-xs text-cream/60">
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              תקנון שימוש
            </a>
            <span style={{ color: '#444' }}>|</span>
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              מדיניות פרטיות
            </a>
            <span style={{ color: '#444' }}>|</span>
            <a
              href="/accessibility"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              הצהרת נגישות
            </a>
          </div>
        </div>
      </div>

    </footer>
  )
}

// Small inline SVG icons (14px)
function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}
