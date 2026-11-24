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
import { IconA11y, IconChevron, IconClose, IconInstagram, IconMail, IconPhone, IconWhatsApp } from './icons'
import { Buoy } from './Tide'
import { Glyph, Go, MenuGlyph, Say, Stage } from './ButtonParts'
import { cue } from './btn'

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
  const sheetWa = useRef<HTMLAnchorElement>(null)
  // D275: the menu settles, then its WhatsApp button plays its relay once
  useEffect(() => { if (menu) cue(sheetWa.current, 'relay', 420) }, [menu])
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
            <Glyph /><span>דברו איתנו</span><Go />
          </a>
          <button type="button" ref={a11yBtn} className="icon-btn" aria-label="כלי נגישות" aria-expanded={a11y} onClick={() => setA11y((v) => !v)}><IconA11y width={22} height={22} /></button>
          <button type="button" className="icon-btn head__menu" aria-label={menu ? 'סגירת התפריט' : 'פתיחת התפריט'} aria-expanded={menu} aria-controls="sheet" onClick={toggleMenu}>
            <MenuGlyph />
          </button>
        </div>
      </div>

      {/* the pinned corner (D245, D249): the shape of the "כתבו לנו" tab, turned to hang from the top corner */}
      <div className="pin" ref={pin}>
        <svg className="pin__blob" viewBox="0 0 200 90" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path d="M0 0H200V70C146 100 60 66 0 0Z" />
        </svg>
        <button type="button" ref={menuBtn} className="icon-btn pin__menu" aria-label={menu ? 'סגירת התפריט' : 'פתיחת התפריט'} aria-expanded={menu} aria-controls="sheet" onClick={toggleMenu}>
          <MenuGlyph />
        </button>
        <a className="pin__logo" href="/" aria-label="MediaWave, לדף הבית"><span className="pin__clip"><Logo variant="compact" decorative /></span></a>
      </div>

      <div id="sheet" className="sheet" hidden={!menu}>
        <nav aria-label="תפריט">
          {NAV.map((n) => <a key={n.href} href={n.href} onClick={() => setMenu(false)}><span>{n.label}</span><IconChevron /></a>)}
          <button type="button" onClick={() => { setMenu(false); setA11y(true) }}><span>כלי נגישות</span><IconA11y width={22} height={22} /></button>
        </nav>
        <a ref={sheetWa} className="btn btn--ink btn--wide" href={WA.hero} target="_blank" rel="noopener" onClick={() => track('whatsapp_click', { placement: 'menu' })}>
          <Glyph /><Say>כתבו לנו בוואטסאפ</Say><Go /><Stage />
        </a>
      </div>
      <A11yPanel open={a11y} anchor="head" onClose={() => {
        if (document.activeElement?.closest('.a11y')) a11yBtn.current?.focus({ preventScroll: true })
        setA11y(false)
      }} />
    </header>
  )
}

/** D288 (Nati, 15.11.2026, option 6 of six: "שיהיה איכותי עם אנימציה קלילה שתתן מראה אלגנטי"): the footer is the logo's
    horizon drawn across the page's end. Above the line, on the paper, the MW mark, its line and the four ways to reach
    us; the line is the disc's own wave; below it, on the sea, the two link lists and the legal line, with the
    back-to-top buoy on its rule. The light motion (useHorizon): a paler swell behind the wave drifts slowly sideways
    while the footer is on screen, and the wave moves a little with the scroll. */
function Footer() {
  const tel = `tel:${SITE_CONTACT.phone.replace(/-/g, '')}`
  const foot = useRef<HTMLElement>(null)
  useHorizon(foot)
  const ways = [
    { href: WA.hero, label: 'וואטסאפ', icon: <IconWhatsApp />, out: true, ev: 'whatsapp_click' },
    { href: tel, label: `טלפון ${SITE_CONTACT.phone}`, icon: <IconPhone />, out: false, ev: 'tel_click' },
    { href: `mailto:${SITE_CONTACT.email}`, label: `אימייל ${SITE_CONTACT.email}`, icon: <IconMail />, out: false, ev: 'mailto_click' },
    { href: SITE_CONTACT.instagramUrl, label: 'אינסטגרם', icon: <IconInstagram />, out: true, ev: 'instagram_click' },
  ] as const
  return (
    <footer className="foot" ref={foot}>
      <div className="wrap foot__top">
        <div className="foot__brand">
          <Emblem />
          <p>דפי נחיתה, אתרי תדמית ואתרים לתוכניות ליווי.</p>
        </div>
        <ul className="foot__ways" aria-label="דרכים ליצירת קשר">
          {ways.map((w) => (
            <li key={w.ev}>
              <a className="foot__way" href={w.href} aria-label={w.label} {...(w.out ? { target: '_blank', rel: 'noopener' } : {})}
                onClick={() => track(w.ev, { placement: 'footer' })}>{w.icon}</a>
            </li>
          ))}
        </ul>
      </div>
      <div className="foot__horizon" aria-hidden="true">
        <span className="foot__swell"><svg viewBox="0 0 800 44" preserveAspectRatio="none" focusable="false"><path d={SWELL} /></svg></span>
        <span className="foot__front"><svg viewBox="0 0 400 44" preserveAspectRatio="none" focusable="false"><path d={FRONT} /></svg></span>
      </div>
      <div className="foot__sea">
        <div className="wrap foot__in">
          <nav aria-label="בדף הבית">
            <p className="foot__h" aria-hidden="true">SITE</p>
            {NAV.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}
          </nav>
          <nav aria-label="שירותים">
            <p className="foot__h" aria-hidden="true">SERVICES</p>
            {ALSO.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}
          </nav>
        </div>
        <div className="wrap foot__legal">
          <span>© {new Date().getFullYear()} MediaWave Israel</span>
          <a href="/terms/">תקנון</a>
          <a href="/privacy/">פרטיות</a>
          <a href="/accessibility/">נגישות</a>
          <Buoy at="foot" to="top" label="חזרה לראש הדף" />
        </div>
      </div>
    </footer>
  )
}

/** The horizon: the disc's wave, down on the left half and up on the right (logos/horizon), the sea below it.
    The swell behind it is the same wave, twice, so it can drift by one length and start over without a seam. */
const FRONT = 'M0 22C100 40 100 40 200 22S300 4 400 22V44H0Z'
const SWELL = 'M0 22C100 40 100 40 200 22S300 4 400 22S500 40 600 22S700 4 800 22V44H0Z'

/** D289 (Nati: "אני רוצה שהצבע למטה ישתנה כל הזמן כמו האייקון שמשתנה. בצורה טבעית ואיכותית"): the sea walks through the
    disc's colours on the disc's own clock (D262, D268: 36 s a round, every walk started at the page's time zero).
    D290: the sea is the disc's water, its lower half (sun.css, mark-clear: the same stops in the same places), with
    the ink on it; the swell behind the wave is the same colour at half strength. D291: the pastel spectrum. */
const WALK_MS = 28000
// D300: the calm walk around the turquoise, the same stops as mark-clear in sun.css (D293 had seven vivid colours)
const VIVID = ['#17CCBB', '#0FCBC3', '#11CACB', '#0EC9D2', '#11C8D7', '#06C8DC', '#0DC7DE', '#10C7DF', '#0DC7DE', '#06C8DC', '#11C8D7', '#0EC9D2', '#11CACB', '#0FCBC3', '#17CCBB', '#2ACCB2', '#39CCA9', '#46CCA1', '#50CB9A', '#57CB95', '#5BCB92', '#5DCB91', '#5BCB92', '#57CB95', '#50CB9A', '#46CCA1', '#39CCA9', '#2ACCB2']
const CLEAR: [number, string][] = [...VIVID.map((c, i) => [i / VIVID.length, c] as [number, string]), [1, VIVID[0]]]
const rgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
function walkAt(stops: [number, string][], k: number) {
  let i = 0
  while (i < stops.length - 2 && k > stops[i + 1][0]) i++
  const [k0, c0] = stops[i]
  const [k1, c1] = stops[i + 1]
  const t = k1 > k0 ? (k - k0) / (k1 - k0) : 0
  const a = rgb(c0), b = rgb(c1)
  return `rgb(${a.map((v, j) => Math.round(v + (b[j] - v) * t)).join(' ')})`
}

/** The footer's light motion. The swell drifts only while the footer is on screen (data-live, a CSS animation of a
    transform on its own box, the compositor's work); the wave follows the scroll a few pixels (--fx), read in the
    scroll event and written once a frame; and while it is on screen the sea walks through the disc's colours (--sea,
    written every other frame from the page's clock). Nothing moves, and the sea stays the brand's teal, with ?calm=1,
    "ללא אנימציות", high contrast, or in the prerender. */
function useHorizon(foot: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const el = foot.current
    if (!el || PRERENDER || typeof IntersectionObserver === 'undefined') return
    const html = document.documentElement
    const still = () => html.classList.contains('calm') || html.classList.contains('disable-animations') || html.classList.contains('high-contrast')
    let live = false
    let raf = 0
    let walk = 0
    let odd = false
    let disc: Animation | null = null
    let fx = 0
    const write = () => { raf = 0; el.style.setProperty('--fx', fx.toFixed(1)) }
    const onScroll = () => {
      if (!live || still()) return
      const r = el.getBoundingClientRect()
      const k = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight + r.height)))
      fx = (k - 0.5) * 36
      if (!raf) raf = requestAnimationFrame(write)
    }
    const rest = () => el.style.removeProperty('--sea')
    const colour = () => {
      walk = 0
      if (!live) return
      if (still()) { rest(); return }
      odd = !odd
      if (odd) {
        // the time is read from the disc's own walk, so the two can never drift apart
        if (!disc || disc.playState === 'idle') disc = document.getAnimations().find((a) => (a as CSSAnimation).animationName === 'mark-clear') ?? null
        const now = disc ? Number(disc.currentTime ?? 0) : null
        if (now === null) { rest(); walk = 0; return }
        const k = ((now % WALK_MS) + WALK_MS) % WALK_MS / WALK_MS
        el.style.setProperty('--sea', walkAt(CLEAR, k))
      }
      walk = requestAnimationFrame(colour)
    }
    const io = new IntersectionObserver(([e]) => {
      live = e.isIntersecting
      el.toggleAttribute('data-live', live)
      if (live) { onScroll(); if (!walk) walk = requestAnimationFrame(colour) }
    })
    io.observe(el)
    window.addEventListener('scroll', onScroll, { passive: true })
    // the panel's switches: the walk rests on the brand's colours at once, and comes back when they are off
    const mo = new MutationObserver(() => { if (still()) rest(); else if (live && !walk) walk = requestAnimationFrame(colour) })
    mo.observe(html, { attributes: true, attributeFilter: ['class'] })
    return () => { io.disconnect(); mo.disconnect(); window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); cancelAnimationFrame(walk) }
  }, [foot])
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
    // D297: under the opener the note comes at once, not after 2.5 s. Its first paint (a blurred shadow, a glass
    // button) holds the GPU for a quarter of a second on a cold cache: at once, that falls while the page boots
    // under the cover and the first wave has not left yet (the opener waits for quiet frames); 2.5 s in, it fell
    // in the middle of the wave. The last wave uncovers the note with the page (sun.css keeps it under the cover).
    const wait = document.documentElement.classList.contains('mw-intro') ? 0 : 2500
    try { if (!localStorage.getItem(CONSENT_KEY)) t = window.setTimeout(() => setConsent(true), wait) } catch { /* private mode: no note */ }
    return () => { window.removeEventListener('scroll', on); clearTimeout(t) }
  }, [])
  const choose = (v: 'accepted' | 'rejected') => { try { localStorage.setItem(CONSENT_KEY, v) } catch { /* nothing to keep */ } setConsent(false) }
  const tab = useRef<HTMLAnchorElement>(null)
  useEffect(() => { if (past) cue(tab.current, 'relay', 700) }, [past])
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
      {/* D275: a capsule that rises when the hero's button has left the screen and types once as it arrives; then it
          takes its turns with the other buttons (it types, its chevrons flow) */}
      <a ref={tab} className="tab" data-on={past ? '' : undefined} data-beats="relay" href={WA.hero} target="_blank" rel="noopener" aria-label="כתבו לנו בוואטסאפ" aria-hidden={past ? undefined : true}
        tabIndex={past ? 0 : -1} onClick={() => track('whatsapp_click', { placement: 'corner' })}>
        <svg className="tab__wave" viewBox="0 0 200 90" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M0 90V20C54 -10 140 24 200 90Z" /></svg>
        <span className="tab__in"><Glyph />כתבו לנו<Go /></span><Stage />
      </a>
    </aside>
  )
}

/** D268: every colour walk on the page (the disc, "Wave", the footer's W, the buoys) keeps one clock, the page's own,
    whenever its element appeared: each walk is set to have started at the page's time zero. */
function useOneColourClock() {
  const { pathname } = useLocation()
  useEffect(() => {
    if (PRERENDER || typeof document.getAnimations !== 'function') return
    // D297: while the opener plays the walks stand still (sun.css pauses the page's other loops; these ones are
    // driven from here, and giving one a start time sets it running again, so they are paused from here too). When
    // the opener ends they go on from the colour they stood at, all of them shifted by the same pause, so they still
    // share one clock.
    const html = document.documentElement
    let stoodAt: number | null = null
    let shift = 0
    const sync = () => {
      const walks = document.getAnimations().filter((a) => { const name = (a as CSSAnimation).animationName; return !!name && /^(mark|walk)-/.test(name) })
      if (html.classList.contains('mw-intro')) {
        walks.forEach((a) => a.pause())
        if (stoodAt === null && walks[0]) stoodAt = Number(walks[0].currentTime) || 0
        return
      }
      if (stoodAt !== null) { shift = Number(document.timeline.currentTime) - stoodAt; stoodAt = null }
      walks.forEach((a) => { a.startTime = shift })
    }
    const t = window.setTimeout(sync, 60)
    const mo = new MutationObserver(() => window.setTimeout(sync, 60))
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => { clearTimeout(t); mo.disconnect() }
  }, [pathname])
}

export default function Shell({ children, route }: { children: ReactNode; route?: string }) {
  useOneColourClock()
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
