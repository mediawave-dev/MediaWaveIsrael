import { useNavigate } from 'react-router-dom'
import { WHATSAPP_URLS } from '../../utils/whatsapp'
import { footerLinks } from '../../config/navigation'
import { track } from '../../utils/analytics'
import { SITE_CONTACT } from '../../data/site'
import AnimatedLogo from '../ui/AnimatedLogo'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { LOOK } from '../../look/look'
import { turnThen, turnFrom } from '../../look/sea/SeaTurn'
import DotGlyph from '../../look/sea/DotGlyph'

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
      // the sea: the page turns in dots before the route changes (SeaTurn; off elsewhere)
      const at = turnFrom(e)
      turnThen(at.x, at.y, () => navigate(href), 'spa')
      return
    }
    if (href === '#top') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      document.querySelector<HTMLElement>('.mw-head__logo')?.focus({ preventScroll: true })
      return
    }
    const el = document.querySelector<HTMLElement>(href)
    if (!el) { window.location.assign('/' + href); return }
    el.scrollIntoView({ behavior: 'smooth' })
    // keyboard users continue from the section they asked for
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
    el.focus({ preventScroll: true })
  }

  // The sign-off (DECISIONS #53): the logo's ident, scrubbed by the visitor's scroll. In the shot
  // look it comes first in DOM order, stamped on the table right under the phone the page ends in
  // (SPEC S10), so focus order still equals visual order; every other look keeps it after the columns.
  const signFirst = LOOK === 'shot'
  // the overlap audit's text zone on the base (the last lines, where the cookie strip could sit),
  // in the shot look only: the other looks' DOM is unchanged. The rest of the footer stays unzoned,
  // or the audit's end-of-page rule would count whatever column scrolls under the header there.
  const zone = LOOK === 'shot' ? 'text' : undefined
  const sign = (
    <a href="/" className="mw-foot__sign" aria-label="MediaWave, חזרה לדף הבית" onClick={(e) => handleLinkClick(e, '/')}>
      <AnimatedLogo variant={phone ? 'stacked' : 'horizontal'} mode="scroll" live decorative />
    </a>
  )

  // the sea (D164): the end credits in the page's own language, never a generic footer. A mono label,
  // the line in the display face, numbered rows on hairlines with ( + ) (the work rows, Lama's rows),
  // contact rows keyed in mono, the logo's ident as the sign-off, and the documents in brackets.
  // [קופי: נתי] the label END CREDITS and the keys TEL, WHATSAPP, MAIL, INSTAGRAM
  if (LOOK === 'shot') {
    const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => handleLinkClick(e, href)
    const contact = [
      { k: 'TEL', ico: 'phone', t: SITE_CONTACT.phone, href: `tel:${SITE_CONTACT.phone}`, ltr: true, ev: 'tel_click' as const, ext: false },
      { k: 'WHATSAPP', ico: 'wa', t: 'וואטסאפ', href: WHATSAPP_URLS.footer, ltr: false, ev: 'whatsapp_click' as const, ext: true },
      { k: 'MAIL', ico: 'mail', t: SITE_CONTACT.email, href: `mailto:${SITE_CONTACT.email}`, ltr: true, ev: 'mailto_click' as const, ext: false },
      { k: 'INSTAGRAM', ico: 'insta', t: 'אינסטגרם', href: SITE_CONTACT.instagramUrl, ltr: false, ev: 'instagram_click' as const, ext: true },
    ]
    return (
      <footer className="mw-foot sea-foot" data-theme="dark" data-intent="end">
        <div className="sea-foot__in">
          <div className="sea-foot__head">
            <span className="sea-tag">END CREDITS</span>
            <p className="sea-foot__line">אתרים וסרטונים לעסקים.</p>
          </div>
          <div className="sea-foot__cols">
            <nav className="sea-foot__col" aria-labelledby="sea-foot-nav">
              <h2 id="sea-foot-nav" className="sea-tag sea-tag--he">קישורים מהירים</h2>
              <ul className="sea-foot__rows">
                {footerLinks.map((link, i) => (
                  <li key={link.href}>
                    <a className="sea-foot__row" href={link.href.startsWith('#') && window.location.pathname !== '/' ? `/${link.href}` : link.href} onClick={(e) => go(e, link.href)}>
                      <span className="sea-foot__k" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                      <span className="sea-foot__t">{link.label}</span>
                      <span className="sea-foot__plus" aria-hidden="true">( + )</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="sea-foot__col">
              <h2 className="sea-tag sea-tag--he">יצירת קשר</h2>
              <ul className="sea-foot__rows sea-foot__rows--contact">
                {contact.map((c) => (
                  <li key={c.k}>
                    <a className="sea-foot__row" href={c.href} {...(c.ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})} onClick={() => track(c.ev, { placement: 'footer' })}>
                      {/* each key with its mark, the same dot glyphs as the letter above (22.10: back by request) */}
                      <span className="sea-foot__k" aria-hidden="true"><span className="sea-foot__ico"><DotGlyph name={c.ico} /></span>{c.k}</span>
                      <span className="sea-foot__t" dir={c.ltr ? 'ltr' : undefined}>{c.t}</span>
                      <span className="sea-foot__plus" aria-hidden="true">{c.ext ? '( ↗ )' : '( + )'}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {sign}
        <div className="sea-foot__base">
          <nav aria-label="מסמכים">
            <a href="/terms/" data-zone={zone} target="_blank" rel="noopener noreferrer">תקנון שימוש</a>
            <a href="/privacy/" data-zone={zone} target="_blank" rel="noopener noreferrer">מדיניות פרטיות</a>
            <a href="/accessibility/" data-zone={zone} target="_blank" rel="noopener noreferrer">הצהרת נגישות</a>
          </nav>
          <p dir="ltr" data-zone={zone}>© {currentYear} MEDIAWAVE ISRAEL</p>
        </div>
      </footer>
    )
  }

  return (
    <footer className="mw-foot" data-theme="dark" data-intent="end">
      {signFirst && sign}
      <div className="mw-foot__in">
        <div className="mw-foot__brand">
          <p className="mw-foot__line">אתרים וסרטונים לעסקים.</p>
        </div>

        {/* h2: the page h1 comes first, footer headings must not skip levels */}
        <div className="mw-foot__col">
          <h2>קישורים מהירים</h2>
          <nav aria-label="ניווט בתחתית העמוד">
            <ul>
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href.startsWith('#') && window.location.pathname !== '/' ? `/${link.href}` : link.href} onClick={(e) => handleLinkClick(e, link.href)}>{link.label}</a>
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

      {!signFirst && sign}

      <div className="mw-foot__bottom">
        <div className="mw-foot__base">
          <nav aria-label="מסמכים">
            <a href="/terms/" data-zone={zone} target="_blank" rel="noopener noreferrer">תקנון שימוש</a>
            <a href="/privacy/" data-zone={zone} target="_blank" rel="noopener noreferrer">מדיניות פרטיות</a>
            <a href="/accessibility/" data-zone={zone} target="_blank" rel="noopener noreferrer">הצהרת נגישות</a>
          </nav>
          <p dir="ltr" data-zone={zone}>© {currentYear} MediaWave Israel</p>
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
