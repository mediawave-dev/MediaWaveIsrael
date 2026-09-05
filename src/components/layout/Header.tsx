import { useState, useEffect, useRef } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { Logo } from '../ui'
import { headerLinks } from '../../config/navigation'
import { EASE_BRAND } from '../../config/motion'
import { useAmbientMotion } from '../../hooks/useReducedMotion'
import { track } from '../../utils/analytics'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  // Ambient micro-loops (menu CTA arrow) stop only via the a11y widget
  const ambient = useAmbientMotion()
  const navigate = useNavigate()
  const location = useLocation()

  // Check if we're on the home page
  const isHomePage = location.pathname === '/'

  // Remove static header from HTML once React mounts (LCP optimization)
  useEffect(() => {
    const staticHeader = document.getElementById('static-header')
    if (staticHeader) {
      staticHeader.remove()
    }
  }, [])

  // Throttled scroll handler using requestAnimationFrame
  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle navigation - supports hash links (#section) and route links (/blog)
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()

    // Route link (e.g., /blog) — use React Router navigation
    if (href.startsWith('/')) {
      navigate(href)
      return
    }

    // Hash link (e.g., #services) — scroll to section
    if (!isHomePage) {
      // Navigate to home page, then scroll to section
      navigate('/')
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const element = document.querySelector(href)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    } else {
      // Already on home page, just scroll
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

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

      const focusables = menuPanelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      )
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
      <header
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ${isScrolled || !isHomePage
          ? 'bg-brown-dark/95 backdrop-blur-lg shadow-sm py-2'
          : 'bg-transparent py-3 md:py-6'
          }`}
      >
        <div className="container px-4 sm:px-6">
          <nav className="flex items-center justify-between gap-4">
            {/* Logo */}
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault()
                navigate('/')
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="transition-colors duration-300"
              aria-label="חזרה לדף הבית"
            >
              <Logo variant="header" isScrolled={isScrolled || !isHomePage} />
            </a>

            {/* Desktop Navigation — compact at md so it never wraps at 768 */}
            <div className="hidden md:flex items-center gap-4 lg:gap-8">
              {headerLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="nav-link whitespace-nowrap text-lg lg:text-xl text-orange hover:text-orange-dark"
                >
                  {link.label}
                </a>
              ))}

              {/* CTA Button — self-contained tide-fill hover (no magnetic
                  drift: it pushed the pill toward the neighboring link) */}
              <a
                href="#contact"
                onClick={(e) => { track('cta_click', { placement: 'header' }); handleNavClick(e, '#contact') }}
                className="header-cta whitespace-nowrap bg-orange text-lg lg:text-xl font-semibold py-2.5 px-5 lg:py-3 lg:px-7 rounded-full shadow-sm"
                style={{ color: '#1e3a5f' }}
              >
                בואו נדבר
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              ref={burgerRef}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden relative w-11 h-11 flex items-center justify-center"
              aria-label={isMobileMenuOpen ? 'סגור תפריט' : 'פתח תפריט'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <div className="relative w-6 h-5">
                <m.span
                  className="absolute right-0 h-0.5 bg-white rounded-full transition-colors duration-300"
                  initial={false}
                  animate={{
                    width: isMobileMenuOpen ? 24 : 24,
                    top: isMobileMenuOpen ? 10 : 0,
                    rotate: isMobileMenuOpen ? 45 : 0,
                  }}
                  transition={{ duration: 0.3, ease: EASE_BRAND }}
                />
                <m.span
                  className="absolute right-0 top-[10px] h-0.5 bg-white rounded-full transition-colors duration-300"
                  initial={false}
                  animate={{
                    width: isMobileMenuOpen ? 0 : 18,
                    opacity: isMobileMenuOpen ? 0 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                />
                <m.span
                  className="absolute right-0 h-0.5 bg-white rounded-full transition-colors duration-300"
                  initial={false}
                  animate={{
                    width: isMobileMenuOpen ? 24 : 12,
                    top: isMobileMenuOpen ? 10 : 20,
                    rotate: isMobileMenuOpen ? -45 : 0,
                  }}
                  transition={{ duration: 0.3, ease: EASE_BRAND }}
                />
              </div>
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <m.div
              className="fixed inset-0 bg-brown-dark/20 backdrop-blur-sm z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Menu Panel - slides from right (RTL). z-[60]: above the
                cookie banner (z-50), which mounts later and otherwise overlaps it */}
            <m.div
              ref={menuPanelRef}
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="תפריט ניווט"
              className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-cream z-[60] md:hidden shadow-lg"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              {/* Decorative watercolor blobs */}
              <div className="absolute top-20 -left-10 w-40 h-40 watercolor-blob watercolor-orange opacity-30" />
              <div className="absolute bottom-40 right-10 w-32 h-32 watercolor-blob watercolor-terracotta opacity-20" />

              <div className="relative h-full flex flex-col p-6 pt-20">
                {/* Close button */}
                <button
                  ref={closeButtonRef}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="absolute top-5 left-5 w-11 h-11 flex items-center justify-center text-brown hover:text-sky-ink transition-colors"
                  aria-label="סגור תפריט"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>

                {/* Logo in mobile menu - smaller */}
                <div className="mb-8 max-w-40">
                  <Logo variant="mobile" />
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-col gap-5">
                  {headerLinks.map((link, index) => (
                    <m.a
                      key={link.href}
                      href={link.href}
                      className="text-2xl text-brown hover:text-sky-ink transition-colors duration-300 min-h-11 flex items-center"
                      onClick={(e) => {
                        handleNavClick(e, link.href)
                        setIsMobileMenuOpen(false)
                      }}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      {link.label}
                    </m.a>
                  ))}

                  {/* CTA Link - same style with arrow */}
                  <m.a
                    href="#contact"
                    className="text-2xl text-sky-ink font-semibold hover:text-sky-ink-strong transition-colors duration-300 min-h-11 flex items-center gap-2 group"
                    onClick={(e) => {
                      track('cta_click', { placement: 'mobile_menu' })
                      handleNavClick(e, '#contact')
                      setIsMobileMenuOpen(false)
                    }}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    בואו נדבר
                    <m.span
                      className="inline-block"
                      animate={ambient ? { x: [0, -4, 0] } : undefined}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      ←
                    </m.span>
                  </m.a>
                </nav>

                {/* Contact info - pushed to bottom */}
                <div className="mt-auto text-brown-light text-sm font-english space-y-1">
                  <p className="font-mono-spec">052-8731808</p>
                  <p>mediawaveisrael@gmail.com</p>
                </div>
              </div>
            </m.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
