import { useState, useEffect, useRef } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { LookButton } from '@look/button'
import { LOOK } from '../../look/look'
import { headerLinks } from '../../config/navigation'
import { useMotionEngine } from '../../motion/ScrollEngineProvider'
import { track } from '../../utils/analytics'
import { SITE_CONTACT } from '../../data/site'
import Logo from '../ui/Logo'
import AnimatedLogo from '../ui/AnimatedLogo'

// One header for the three looks (DECISIONS #50): sticky, opaque in the look's ground (KM:
// two layers that crossfade with the page's theme), the look's button family for
// "בואו נדבר". Its height is --head, which every held stage and anchor respects.
export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const engine = useMotionEngine()
  const navigate = useNavigate()
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  // Remove the static paint-first header from index.html once React mounts
  useEffect(() => {
    document.getElementById('static-header')?.remove()
  }, [])

  // Route links go through the router; hash links scroll (after going home if needed)
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    if (href.startsWith('/')) {
      navigate(href)
      return
    }
    const go = () => {
      const el = document.querySelector<HTMLElement>(href)
      if (!el) return
      if (engine) engine.scrollTo(el)
      else el.scrollIntoView({ behavior: 'smooth' })
    }
    if (!isHomePage) {
      navigate('/')
      setTimeout(go, 100)
    } else go()
  }

  // The open menu locks page scrolling (Lenis or native, through the engine)
  useEffect(() => {
    if (!isMobileMenuOpen) return
    if (engine) engine.lock()
    else document.body.style.overflow = 'hidden'
    return () => {
      if (engine) engine.unlock()
      else document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen, engine])

  // Menu dialog behavior: Escape closes, Tab stays inside the panel,
  // focus lands on the close button and returns to the burger afterwards
  const menuPanelRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const burgerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isMobileMenuOpen) return

    const burger = burgerRef.current
    closeButtonRef.current?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false)
        return
      }
      if (e.key !== 'Tab' || !menuPanelRef.current) return

      const focusables = menuPanelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement

      if (e.shiftKey && active === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      } else if (!menuPanelRef.current.contains(active)) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      burger?.focus()
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <header className="mw-head" data-zone="ui">
        {LOOK === 'km' && (
          <span className="theme-bg" aria-hidden="true"><i data-t="dark" /><i data-t="light" /></span>
        )}
        <div className="mw-head__bar">
          <a
            href="/"
            className="mw-head__logo"
            aria-label="MediaWave, חזרה לדף הבית"
            onClick={(e) => {
              e.preventDefault()
              navigate('/')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            <AnimatedLogo variant="compact" mode="intro" live decorative />
          </a>

          <nav className="mw-head__nav" aria-label="ניווט ראשי">
            {headerLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={(e) => handleNavClick(e, link.href)}>
                {link.label}
              </a>
            ))}
          </nav>

          <LookButton
            href="#contact"
            size="sm"
            className="mw-head__cta"
            onClick={(e) => { track('cta_click', { placement: 'header' }); handleNavClick(e as React.MouseEvent<HTMLAnchorElement>, '#contact') }}
          >
            בואו נדבר
          </LookButton>

          <button
            ref={burgerRef}
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="mw-head__burger"
            aria-label="פתח תפריט"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <span aria-hidden="true"><i /><i /><i /></span>
          </button>
        </div>
      </header>

      {/* Mobile menu: a full sheet in the look's ground (z-60: above the cookie banner) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <m.div
            ref={menuPanelRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="תפריט ניווט"
            className="mw-menu"
            data-lenis-prevent=""
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <span className="mw-menu__logo" aria-hidden="true"><Logo variant="compact" decorative /></span>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mw-menu__close"
              aria-label="סגור תפריט"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <nav aria-label="תפריט נייד">
              {headerLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    handleNavClick(e, link.href)
                    setIsMobileMenuOpen(false)
                  }}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="mw-menu__foot">
              <LookButton
                href="#contact"
                block
                onClick={(e) => {
                  track('cta_click', { placement: 'mobile_menu' })
                  handleNavClick(e as React.MouseEvent<HTMLAnchorElement>, '#contact')
                  setIsMobileMenuOpen(false)
                }}
              >
                בואו נדבר
              </LookButton>
              <a href={`tel:${SITE_CONTACT.phone.replace(/-/g, '')}`} dir="ltr" onClick={() => track('tel_click', { placement: 'mobile_menu' })}>{SITE_CONTACT.phone}</a>
              <a href={`mailto:${SITE_CONTACT.email}`} dir="ltr" onClick={() => track('mailto_click', { placement: 'mobile_menu' })}>{SITE_CONTACT.email}</a>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  )
}
