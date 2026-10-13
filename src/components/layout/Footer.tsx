import { useNavigate } from 'react-router-dom'
import { WHATSAPP_URLS } from '../../utils/whatsapp'
import { footerLinks } from '../../config/navigation'
import { track } from '../../utils/analytics'
import { SITE_CONTACT } from '../../data/site'
import AnimatedLogo from '../ui/AnimatedLogo'
import { useMediaQuery } from '../../hooks/useMediaQuery'

const currentYear = new Date().getFullYear()

// One footer for the three looks (DECISIONS #50): the look's ground and ink, the lockup,
// the tagline in the display face, links and contact in two columns. In KM it sits on the
// stage (data-theme="dark"). Every link keeps its track() call.
export default function Footer() {
  const navigate = useNavigate()
  // the sign-off: horizontal on wide screens, stacked on phones (a bigger disc at phone width)
  const phone = useMediaQuery('(max-width: 639px)')

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    // Route link (e.g., /terms): ScrollEngineProvider handles the scroll reset
    if (href.startsWith('/')) {
      navigate(href)
      return
    }
    if (href === '#top') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="mw-foot" data-theme="dark">
      <div className="mw-foot__in">
        <div className="mw-foot__brand">
          <p className="mw-foot__line">עיצוב ופיתוח אתרים מקצועיים לעסקים</p>
        </div>

        {/* h2: the page h1 comes first, footer headings must not skip levels */}
        <div className="mw-foot__col">
          <h2>קישורים מהירים</h2>
          <nav aria-label="ניווט בתחתית העמוד">
            <ul>
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} onClick={(e) => handleLinkClick(e, link.href)}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mw-foot__col mw-foot__col--wide">
          <h2>יצירת קשר</h2>
          <ul>
            <li>
              <a href={`tel:${SITE_CONTACT.phone}`} onClick={() => track('tel_click', { placement: 'footer' })}>
                <PhoneIcon /><span dir="ltr">{SITE_CONTACT.phone}</span>
              </a>
            </li>
            <li>
              <a href={WHATSAPP_URLS.footer} target="_blank" rel="noopener noreferrer" onClick={() => track('whatsapp_click', { placement: 'footer' })}>
                <WhatsAppIcon /><span>וואטסאפ</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE_CONTACT.email}`} onClick={() => track('mailto_click', { placement: 'footer' })}>
                <MailIcon /><span dir="ltr">{SITE_CONTACT.email}</span>
              </a>
            </li>
            <li>
              <a href={SITE_CONTACT.instagramUrl} target="_blank" rel="noopener noreferrer" onClick={() => track('instagram_click', { placement: 'footer' })}>
                <InstagramIcon /><span>אינסטגרם</span>
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* The sign-off (DECISIONS #53): the logo's ident, scrubbed by the visitor's scroll */}
      <a href="/" className="mw-foot__sign" aria-label="MediaWave, חזרה לדף הבית" onClick={(e) => handleLinkClick(e, '/')}>
        <AnimatedLogo variant={phone ? 'stacked' : 'horizontal'} mode="scroll" live decorative />
      </a>

      <div className="mw-foot__bottom">
        <div className="mw-foot__base">
          <nav aria-label="מסמכים">
            <a href="/terms" target="_blank" rel="noopener noreferrer">תקנון שימוש</a>
            <a href="/privacy" target="_blank" rel="noopener noreferrer">מדיניות פרטיות</a>
            <a href="/accessibility" target="_blank" rel="noopener noreferrer">הצהרת נגישות</a>
          </nav>
          <p dir="ltr">© {currentYear} MediaWave Israel</p>
        </div>
      </div>
    </footer>
  )
}

// Small inline icons (16px), in the link's colour
function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}
