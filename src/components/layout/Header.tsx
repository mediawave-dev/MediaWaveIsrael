import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Logo } from '../ui'

// All navigation links - plain text style
const navLinks = [
  { label: 'שירותים', href: '#services' },
  { label: 'העבודות שלנו', href: '#portfolio' },
  { label: 'שאלות נפוצות', href: '#faq' },
  { label: 'צור קשר', href: '#contact' },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-cream/80 backdrop-blur-lg shadow-sm py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="container px-4 sm:px-6">
          <nav className="flex items-center justify-between gap-4">
            {/* Logo - RIGHT side (RTL) */}
            <Logo variant="header" isScrolled={isScrolled} />

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className="group relative text-brown hover:text-orange transition-colors duration-300 py-2"
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
                    whileHover={{ opacity: 1, backgroundColor: 'rgba(245, 166, 35, 0.05)' }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.a>
              ))}

              {/* CTA Button */}
              <motion.a
                href="#contact"
                className="relative overflow-hidden bg-orange font-semibold py-3 px-6 rounded-full shadow-sm transition-all duration-300 hover:shadow-glow hover:-translate-y-0.5 group"
                style={{ color: '#2A2A2A' }}
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
              className="md:hidden relative w-10 h-10 flex items-center justify-center"
              aria-label={isMobileMenuOpen ? 'סגור תפריט' : 'פתח תפריט'}
              aria-expanded={isMobileMenuOpen}
            >
              <div className="relative w-6 h-5">
                {/* Hamburger lines with smooth morph to X */}
                <motion.span
                  className="absolute right-0 h-0.5 bg-brown rounded-full"
                  initial={false}
                  animate={{
                    width: isMobileMenuOpen ? 24 : 24,
                    top: isMobileMenuOpen ? 10 : 0,
                    rotate: isMobileMenuOpen ? 45 : 0,
                  }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                />
                <motion.span
                  className="absolute right-0 top-[10px] h-0.5 bg-brown rounded-full"
                  initial={false}
                  animate={{
                    width: isMobileMenuOpen ? 0 : 18,
                    opacity: isMobileMenuOpen ? 0 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="absolute right-0 h-0.5 bg-brown rounded-full"
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

              <div className="relative h-full flex flex-col p-8 pt-24">
                {/* Close button */}
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="absolute top-6 left-6 w-10 h-10 flex items-center justify-center text-brown hover:text-orange transition-colors"
                  aria-label="סגור תפריט"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>

                {/* Logo in mobile menu */}
                <div className="mb-12">
                  <Logo variant="mobile" />
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-col gap-6">
                  {navLinks.map((link, index) => (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      className="text-2xl text-brown hover:text-orange transition-colors duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      {link.label}
                    </motion.a>
                  ))}
                </nav>

                {/* CTA Button */}
                <motion.a
                  href="#contact"
                  className="mt-auto mb-8 bg-orange text-center font-semibold py-4 px-8 rounded-full shadow-sm"
                  style={{ color: '#2A2A2A' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  בואו נדבר
                </motion.a>

                {/* Contact info */}
                <div className="text-brown-light text-sm">
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
