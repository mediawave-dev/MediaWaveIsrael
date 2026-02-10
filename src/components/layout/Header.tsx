import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { Logo } from '../ui'
import { headerLinks } from '../../config/navigation'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Check if we're on the home page
  const isHomePage = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
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
            {/* Logo - RIGHT side (RTL), white on hero via CSS filter */}
            <div className="transition-all duration-300">
              <Logo variant="header" isScrolled={isScrolled || !isHomePage} />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {headerLinks.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`group relative text-xl ${isScrolled || !isHomePage ? 'text-cream hover:text-orange' : 'text-brown hover:text-orange'} transition-colors duration-300 py-2`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {link.label}
                  {/* Animated underline - expands from center */}
                  <motion.span
                    className="absolute -bottom-1 left-1/2 h-0.5 bg-orange rounded-full"
                    initial={{ width: 0, x: '-50%' }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  />
                  {/* Subtle glow on hover */}
                  <motion.span
                    className="absolute inset-0 -z-10 rounded-lg"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1, backgroundColor: 'rgba(212, 165, 116, 0.10)' }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.a>
              ))}

              {/* CTA Button */}
              <motion.a
                href="#contact"
                onClick={(e) => handleNavClick(e, '#contact')}
                className="relative overflow-hidden bg-orange text-xl font-semibold py-3 px-7 rounded-full shadow-sm transition-all duration-300 hover:shadow-glow hover:bg-orange-dark hover:-translate-y-0.5 group"
                style={{ color: '#1e3a5f' }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Shine effect */}
                <span className="absolute inset-0 bg-gradient-to-l from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative">בואו נדבר</span>
              </motion.a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden relative w-11 h-11 flex items-center justify-center"
              aria-label={isMobileMenuOpen ? 'סגור תפריט' : 'פתח תפריט'}
              aria-expanded={isMobileMenuOpen}
            >
              <div className="relative w-6 h-5">
                {/* Hamburger lines with smooth morph to X */}
                <motion.span
                  className="absolute right-0 h-0.5 bg-white rounded-full transition-colors duration-300"
                  initial={false}
                  animate={{
                    width: isMobileMenuOpen ? 24 : 24,
                    top: isMobileMenuOpen ? 10 : 0,
                    rotate: isMobileMenuOpen ? 45 : 0,
                  }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                />
                <motion.span
                  className="absolute right-0 top-[10px] h-0.5 bg-white rounded-full transition-colors duration-300"
                  initial={false}
                  animate={{
                    width: isMobileMenuOpen ? 0 : 18,
                    opacity: isMobileMenuOpen ? 0 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="absolute right-0 h-0.5 bg-white rounded-full transition-colors duration-300"
                  initial={false}
                  animate={{
                    width: isMobileMenuOpen ? 24 : 12,
                    top: isMobileMenuOpen ? 10 : 20,
                    rotate: isMobileMenuOpen ? -45 : 0,
                  }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
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
            <motion.div
              className="fixed inset-0 bg-brown-dark/20 backdrop-blur-sm z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Menu Panel - slides from right (RTL) */}
            <motion.div
              className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-cream z-50 md:hidden shadow-lg"
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
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="absolute top-5 left-5 w-11 h-11 flex items-center justify-center text-brown hover:text-orange transition-colors"
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
                    <motion.a
                      key={link.href}
                      href={link.href}
                      className="text-2xl text-brown hover:text-orange transition-colors duration-300 min-h-11 flex items-center"
                      onClick={(e) => {
                        handleNavClick(e, link.href)
                        setIsMobileMenuOpen(false)
                      }}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      {link.label}
                    </motion.a>
                  ))}

                  {/* CTA Link - same style with arrow */}
                  <motion.a
                    href="#contact"
                    className="text-2xl text-orange font-semibold hover:text-orange-dark transition-colors duration-300 min-h-11 flex items-center gap-2 group"
                    onClick={(e) => {
                      handleNavClick(e, '#contact')
                      setIsMobileMenuOpen(false)
                    }}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    בואו נדבר
                    <motion.span
                      className="inline-block"
                      animate={{ x: [0, -4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      ←
                    </motion.span>
                  </motion.a>
                </nav>

                {/* Contact info - pushed to bottom */}
                <div className="mt-auto text-brown-light text-sm font-english space-y-1">
                  <p>052-8731808</p>
                  <p>mediawaveisrael@gmail.com</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
