// sun · the shell around every page (D237): a header that stays at the top of the page (it never follows
// the scroll, D145), the footer, and the three floating tools: WhatsApp, accessibility, the cookie note.
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import Logo from '../components/ui/Logo'
import { SITE_CONTACT } from '../data/site'
import { track } from '../utils/analytics'
import { ALSO, NAV, WA } from './content'
import { IconA11y, IconChevron, IconChevrons, IconClose, IconMenu, IconWhatsApp } from './icons'

const PRERENDER = typeof window !== 'undefined' && !!(window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__

/** Accessibility tools. Nothing persists between visits (D26): every load starts at the defaults. */
function A11yPanel({ open, onClose, anchor }: { open: boolean; onClose: () => void; anchor: 'head' | 'side' }) {
  const [size, setSize] = useState(0)
  const [contrast, setContrast] = useState(false)
  const [still, setStill] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const d = document.documentElement
    if (size) d.dataset.text = String(size); else delete d.dataset.text
    d.classList.toggle('high-contrast', contrast)
    d.classList.toggle('disable-animations', still || /[?&]reduce=1(&|$)/.test(location.search))
  }, [size, contrast, still])
  useEffect(() => {
    if (!open) return
    ref.current?.querySelector<HTMLElement>('button')?.focus()
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', key)
    return () => document.removeEventListener('keydown', key)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className={`a11y a11y--${anchor}`} ref={ref} role="dialog" aria-label="כלי נגישות">
      <div className="a11y__head"><strong>נגישות</strong><button type="button" className="icon-btn" onClick={onClose} aria-label="סגירת כלי הנגישות"><IconClose /></button></div>
      <p className="a11y__label" id="a11y-size">גודל טקסט</p>
      <div className="a11y__row" role="group" aria-labelledby="a11y-size">
        {['רגיל', 'גדול', 'גדול מאוד'].map((l, i) => (
          <button key={l} type="button" className="a11y__opt" aria-pressed={size === i} onClick={() => setSize(i)}>{l}</button>
        ))}
      </div>
      <button type="button" className="a11y__opt a11y__opt--wide" aria-pressed={contrast} onClick={() => setContrast((v) => !v)}>ניגודיות גבוהה</button>
      <button type="button" className="a11y__opt a11y__opt--wide" aria-pressed={still} onClick={() => setStill((v) => !v)}>ללא אנימציות</button>
      <a className="a11y__link" href="/accessibility/">הצהרת נגישות</a>
    </div>
  )
}

function Header() {
  const [menu, setMenu] = useState(false)
  const [a11y, setA11y] = useState(false)
  const { pathname, hash } = useLocation()
  useEffect(() => { setMenu(false) }, [pathname, hash])
  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', menu)
    if (!menu) return
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenu(false) }
    document.addEventListener('keydown', key)
    return () => document.removeEventListener('keydown', key)
  }, [menu])
  return (
    <header className="head">
      {/* the ribbon (after Libra, D238): paper with a wave for its lower edge, and a blue wave at the far end */}
      <svg className="head__wave" viewBox="0 0 1440 110" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path className="w-paper" d="M0 0H1440V92C1340 112 1210 78 1040 70C820 60 640 84 430 66C290 54 140 62 0 78Z" />
        <path className="w-corner" d="M0 0H372C338 28 276 64 172 82C110 92 50 91 0 85Z" />
      </svg>
      <div className="head__in">
        <a className="head__logo" href="/" aria-label="MediaWave, לדף הבית"><Logo variant="compact" decorative /></a>
        <nav className="head__nav" aria-label="ניווט ראשי">
          {NAV.slice(0, -1).map((n) => <a key={n.href} href={n.href}><span>{n.label}</span></a>)}
        </nav>
        <div className="head__tools">
          <a className="head__cta" href={WA.hero} target="_blank" rel="noopener" onClick={() => track('whatsapp_click', { placement: 'header' })}>
            <IconWhatsApp /><span>דברו איתנו</span><IconChevrons />
          </a>
          <button type="button" className="icon-btn" aria-label="כלי נגישות" aria-expanded={a11y} onClick={() => setA11y((v) => !v)}><IconA11y width={22} height={22} /></button>
          <button type="button" className="icon-btn head__menu" aria-label={menu ? 'סגירת התפריט' : 'פתיחת התפריט'} aria-expanded={menu} aria-controls="sheet" onClick={() => setMenu((v) => !v)}>
            {menu ? <IconClose width={22} height={22} /> : <IconMenu width={22} height={22} />}
          </button>
        </div>
        <A11yPanel open={a11y} onClose={() => setA11y(false)} anchor="head" />
      </div>
      <div id="sheet" className="sheet" hidden={!menu}>
        <nav aria-label="תפריט">
          {NAV.map((n) => <a key={n.href} href={n.href} onClick={() => setMenu(false)}><span>{n.label}</span><IconChevron /></a>)}
        </nav>
        <a className="btn btn--ink btn--wide" href={WA.hero} target="_blank" rel="noopener" onClick={() => track('whatsapp_click', { placement: 'menu' })}>
          <IconWhatsApp /><span>כתבו לנו בוואטסאפ</span><IconChevrons />
        </a>
        <svg className="sheet__wave" viewBox="0 0 390 46" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M0 0H390V8C318 44 232 6 150 24C92 37 40 40 0 30Z" /></svg>
      </div>
    </header>
  )
}

function Footer() {
  const tel = `tel:${SITE_CONTACT.phone.replace(/-/g, '')}`
  return (
    <footer className="foot">
      <div className="wrap foot__in">
        <div className="foot__brand">
          <Logo variant="horizontal" title="MediaWave" />
          <p>דפי נחיתה, אתרי תדמית ואתרים לתוכניות ליווי.</p>
        </div>
        <nav aria-label="בדף הבית">
          <h2 className="foot__h">באתר</h2>
          {NAV.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}
        </nav>
        <nav aria-label="שירותים נוספים">
          <h2 className="foot__h">עוד דברים שאנחנו עושים</h2>
          {ALSO.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}
        </nav>
        <div>
          <h2 className="foot__h">קשר</h2>
          <a href={WA.hero} target="_blank" rel="noopener" onClick={() => track('whatsapp_click', { placement: 'footer' })}>וואטסאפ</a>
          <a href={tel} dir="ltr" onClick={() => track('tel_click', { placement: 'footer' })}>{SITE_CONTACT.phone}</a>
          <a href={`mailto:${SITE_CONTACT.email}`} dir="ltr" onClick={() => track('mailto_click', { placement: 'footer' })}>{SITE_CONTACT.email}</a>
          <a href={SITE_CONTACT.instagramUrl} target="_blank" rel="noopener" onClick={() => track('instagram_click', { placement: 'footer' })}>אינסטגרם</a>
        </div>
      </div>
      <div className="wrap foot__legal">
        <span>© {new Date().getFullYear()} MediaWave Israel</span>
        <a href="/terms/">תקנון</a>
        <a href="/privacy/">פרטיות</a>
        <a href="/accessibility/">נגישות</a>
      </div>
    </footer>
  )
}

const CONSENT_KEY = 'mw_cookie_consent'

/** WhatsApp stays one tap away once the hero's own button has left the screen; the cookie note sits above it. */
function Floating() {
  const [past, setPast] = useState(false)
  const [consent, setConsent] = useState(false)
  useEffect(() => {
    if (PRERENDER) return
    const on = () => setPast(window.scrollY > 520)
    on()
    window.addEventListener('scroll', on, { passive: true })
    let t = 0
    try { if (!localStorage.getItem(CONSENT_KEY)) t = window.setTimeout(() => setConsent(true), 2500) } catch { /* private mode: no note */ }
    return () => { window.removeEventListener('scroll', on); clearTimeout(t) }
  }, [])
  const choose = (v: 'accepted' | 'rejected') => { try { localStorage.setItem(CONSENT_KEY, v) } catch { /* nothing to keep */ } setConsent(false) }
  if (PRERENDER) return null
  return (
    <aside aria-label="כלים ופעולות מהירות">
      {consent && (
        <div className="consent" role="region" aria-label="עוגיות">
          <p>האתר משתמש בעוגיות לתפקוד ולמדידה. <a href="/privacy/">פרטים</a></p>
          <div>
            <button type="button" className="btn btn--ink btn--small" onClick={() => choose('accepted')}>בסדר</button>
            <button type="button" className="consent__no" onClick={() => choose('rejected')}>רק חיוניות</button>
          </div>
        </div>
      )}
      {/* the corner wave (after Libra): WhatsApp stays one tap away once the hero button has left the screen */}
      <a className="tab" data-on={past ? '' : undefined} href={WA.hero} target="_blank" rel="noopener" aria-label="כתבו לנו בוואטסאפ"
        tabIndex={past ? 0 : -1} onClick={() => track('whatsapp_click', { placement: 'corner' })}>
        <svg className="tab__wave" viewBox="0 0 200 90" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M0 90V20C54 -10 140 24 200 90Z" /></svg>
        <span><IconWhatsApp />כתבו לנו<IconChevrons width={18} height={18} /></span>
      </a>
    </aside>
  )
}

export default function Shell({ children, route }: { children: ReactNode; route?: string }) {
  return (
    <>
      <a className="skip" href="#main-content">דלג לתוכן הראשי</a>
      <Header />
      <main id="main-content" data-route={route}>{children}</main>
      <Footer />
      <Floating />
    </>
  )
}
