// sun · the shell around every page (D237, D249): the header, the footer and the floating tools.
// The header has two parts. The bar (the links, the accessibility button) is part of the page and scrolls away.
// The corner is pinned, as on Libra: a white corner wave that holds the logo. As the page scrolls the logo
// folds down to its mark and a menu button comes in beside it; the move follows the scroll and is eased.
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import Logo from '../components/ui/Logo'
import Emblem from './Emblem'
import { SITE_CONTACT } from '../data/site'
import { track } from '../utils/analytics'
import { ALSO, NAV, WA } from './content'
import { IconA11y, IconChevron, IconChevrons, IconClose, IconMenu, IconWhatsApp } from './icons'
import { Buoy } from './Tide'

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
  // the caller passes a new onClose on every render: kept in a ref, so a re-render of the header never pulls
  // the focus back into the panel (focus moves in once, when the panel opens)
  const close = useRef(onClose)
  close.current = onClose
  useEffect(() => {
    if (!open) return
    ref.current?.querySelector<HTMLElement>('button')?.focus()
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') close.current() }
    document.addEventListener('keydown', key)
    return () => document.removeEventListener('keydown', key)
  }, [open])
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
  // closing with the keyboard hands focus back to the button that opened it (only if focus was inside, and without scrolling)
  const a11yBtn = useRef<HTMLButtonElement>(null)
  const menuBtn = useRef<HTMLButtonElement>(null)
  const pin = useRef<HTMLDivElement>(null)
  const menuOpen = useRef(false)
  const syncFold = useRef<() => void>(() => {})
  useEffect(() => { setMenu(false) }, [pathname, hash])
  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', menu)
    // an open menu folds the logo too, wherever the page is: the mark and the close button head the sheet
    menuOpen.current = menu
    syncFold.current()
    if (!menu) return
    const key = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (document.activeElement?.closest('#sheet')) menuBtn.current?.focus({ preventScroll: true })
      setMenu(false)
    }
    document.addEventListener('keydown', key)
    return () => document.removeEventListener('keydown', key)
  }, [menu])

  // The fold: --p goes from 0 (top of the page: the whole logo) to 1 (140 px down: the mark and a menu button).
  // It follows the scroll and eases toward it, so a wheel's steps and a finger's jitter come out as one move.
  // Only transform, opacity and one width change with it. With "ללא אנימציות" it jumps instead of easing.
  useEffect(() => {
    const el = pin.current
    if (!el || PRERENDER) return
    const html = document.documentElement
    let p = 0
    let target = 0
    let raf = 0
    const tick = () => {
      raf = 0
      p = html.classList.contains('disable-animations') ? target : p + (target - p) * 0.2
      if (Math.abs(target - p) < 0.002) p = target
      el.style.setProperty('--p', p.toFixed(4))
      el.toggleAttribute('data-folded', p > 0.6)
      if (p !== target) raf = requestAnimationFrame(tick)
    }
    let first = true
    const on = () => {
      target = menuOpen.current ? 1 : Math.min(1, Math.max(0, window.scrollY / 140))
      // the first reading (a reload in the middle of the page) takes the corner straight to where it belongs
      if (first) { first = false; p = target }
      if (!raf) raf = requestAnimationFrame(tick)
    }
    syncFold.current = on
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => { window.removeEventListener('scroll', on); cancelAnimationFrame(raf) }
  }, [])

  const toggleMenu = () => setMenu((v) => !v)
  return (
    <header className="head" id="top">
      <div className="head__in">
        <nav className="head__nav" aria-label="ניווט ראשי">
          {NAV.slice(0, -1).map((n) => <a key={n.href} href={n.href}><span>{n.label}</span></a>)}
        </nav>
        <div className="head__tools">
          <a className="head__cta" href={WA.hero} target="_blank" rel="noopener" onClick={() => track('whatsapp_click', { placement: 'header' })}>
            <IconWhatsApp /><span>דברו איתנו</span><IconChevrons />
          </a>
          <button type="button" ref={a11yBtn} className="icon-btn" aria-label="כלי נגישות" aria-expanded={a11y} onClick={() => setA11y((v) => !v)}><IconA11y width={22} height={22} /></button>
          <button type="button" className="icon-btn head__menu" aria-label={menu ? 'סגירת התפריט' : 'פתיחת התפריט'} aria-expanded={menu} aria-controls="sheet" onClick={toggleMenu}>
            <IconMenu width={22} height={22} />
          </button>
        </div>
      </div>

      {/* the pinned corner (D245, D249): the shape of the "כתבו לנו" tab, turned to hang from the top corner */}
      <div className="pin" ref={pin}>
        <svg className="pin__blob" viewBox="0 0 200 90" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path d="M0 0H200V70C146 100 60 66 0 0Z" />
        </svg>
        <button type="button" ref={menuBtn} className="icon-btn pin__menu" aria-label={menu ? 'סגירת התפריט' : 'פתיחת התפריט'} aria-expanded={menu} aria-controls="sheet" onClick={toggleMenu}>
          {menu ? <IconClose width={22} height={22} /> : <IconMenu width={22} height={22} />}
        </button>
        <a className="pin__logo" href="/" aria-label="MediaWave, לדף הבית"><span className="pin__clip"><Logo variant="compact" decorative /></span></a>
      </div>

      <div id="sheet" className="sheet" hidden={!menu}>
        <nav aria-label="תפריט">
          {NAV.map((n) => <a key={n.href} href={n.href} onClick={() => setMenu(false)}><span>{n.label}</span><IconChevron /></a>)}
          <button type="button" onClick={() => { setMenu(false); setA11y(true) }}><span>כלי נגישות</span><IconA11y width={22} height={22} /></button>
        </nav>
        <a className="btn btn--ink btn--wide" href={WA.hero} target="_blank" rel="noopener" onClick={() => track('whatsapp_click', { placement: 'menu' })}>
          <IconWhatsApp /><span>כתבו לנו בוואטסאפ</span><IconChevrons />
        </a>
      </div>
      <A11yPanel open={a11y} anchor="head" onClose={() => {
        if (document.activeElement?.closest('.a11y')) a11yBtn.current?.focus({ preventScroll: true })
        setA11y(false)
      }} />
    </header>
  )
}

function Footer() {
  const tel = `tel:${SITE_CONTACT.phone.replace(/-/g, '')}`
  return (
    <footer className="foot">
      <div className="wrap foot__in">
        <div className="foot__brand">
          <Emblem title="MediaWave" />
          <p>דפי נחיתה, אתרי תדמית ואתרים לתוכניות ליווי.</p>
        </div>
        <nav aria-label="בדף הבית">
          <h2 className="foot__h">באתר</h2>
          {NAV.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}
        </nav>
        <nav aria-label="שירותים">
          <h2 className="foot__h">שירותים</h2>
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
        <Buoy at="foot" to="top" label="חזרה לראש הדף" />
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
      <a className="tab" data-on={past ? '' : undefined} href={WA.hero} target="_blank" rel="noopener" aria-label="כתבו לנו בוואטסאפ" aria-hidden={past ? undefined : true}
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
