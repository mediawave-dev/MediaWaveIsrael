import { useState, useEffect, useRef, useCallback } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { useAccessibility, type TextSize } from '../../hooks/useAccessibility'

// Accessibility icon (universal symbol)
function AccessibilityIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="4.5" r="2.5" />
      <path d="M12 7v5" />
      <path d="M6 10l6 2 6-2" />
      <path d="M9 22l3-8 3 8" />
      <path d="M7 17h10" />
    </svg>
  )
}

// Close icon
function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

// Text size labels
const TEXT_SIZE_LABELS: Record<TextSize, string> = {
  'normal': 'רגיל',
  'large': 'גדול',
  'extra-large': 'גדול מאוד',
}

const TEXT_SIZES: TextSize[] = ['normal', 'large', 'extra-large']

export default function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const {
    settings,
    setTextSize,
    toggleHighContrast,
    toggleAnimations,
    reset,
  } = useAccessibility()

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
        buttonRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Focus first element when panel opens
  useEffect(() => {
    if (isOpen && panelRef.current) {
      const firstFocusable = panelRef.current.querySelector<HTMLElement>(
        'button, [tabindex]:not([tabindex="-1"])'
      )
      firstFocusable?.focus()
    }
  }, [isOpen])

  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  // Animation variants
  const panelVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -8 },
    visible: { opacity: 1, scale: 1, y: 0 },
  }

  return (
    <div className="absolute left-0 z-[51]" data-accessibility-widget style={{ top: '15px' }}>
      {/* Desktop override */}
      <style>{`@media(min-width:768px){[data-accessibility-widget]{top:120px!important}}`}</style>
      {/* Side Panel Drawer */}
      <AnimatePresence mode='wait'>
        {isOpen && (
          <m.div
            ref={panelRef}
            id="accessibility-panel"
            role="dialog"
            aria-label="הגדרות נגישות"
            aria-modal="true"
            className="fixed top-16 left-2 bg-white/95 backdrop-blur-md shadow-2xl border border-cream-darker rounded-2xl p-6 w-72 max-h-[80vh] overflow-y-auto z-50"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-cream-darker">
              <h2 className="text-xl font-bold text-brown-dark flex items-center gap-2">
                <AccessibilityIcon className="w-5 h-5 text-orange" />
                נגישות
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-brown-light hover:bg-cream-darker hover:text-brown-dark transition-colors"
                aria-label="סגור"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Text Size */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-brown-dark mb-3">
                גודל טקסט
              </label>
              <div className="flex gap-2">
                {TEXT_SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setTextSize(size)}
                    className={`text-size-btn flex-1 py-2 text-sm rounded-lg border transition-all ${
                      settings.textSize === size
                        ? 'bg-orange text-white border-orange shadow-md'
                        : 'bg-cream text-brown border-cream-darker hover:border-orange/50'
                    }`}
                    aria-pressed={settings.textSize === size}
                  >
                    {TEXT_SIZE_LABELS[size]}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-4 mb-6">
              {/* High Contrast */}
              <button
                onClick={toggleHighContrast}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                  settings.highContrast
                    ? 'bg-brown-dark text-white border-brown-dark'
                    : 'bg-cream text-brown border-cream-darker hover:border-orange/50'
                }`}
                aria-pressed={settings.highContrast}
              >
                <span className="text-sm font-medium">ניגודיות גבוהה</span>
                <div className={`w-10 h-6 rounded-full relative transition-colors ${
                  settings.highContrast ? 'bg-orange' : 'bg-gray-300'
                }`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                    settings.highContrast ? 'left-1' : 'right-1'
                  }`} />
                </div>
              </button>

              {/* Disable Animations */}
              <button
                onClick={toggleAnimations}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                  settings.disableAnimations
                    ? 'bg-orange/10 border-orange text-brown-dark'
                    : 'bg-cream text-brown border-cream-darker hover:border-orange/50'
                }`}
                aria-pressed={settings.disableAnimations}
              >
                <span className="text-sm font-medium">ללא אנימציות</span>
                <div className={`w-10 h-6 rounded-full relative transition-colors ${
                  settings.disableAnimations ? 'bg-orange' : 'bg-gray-300'
                }`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                    settings.disableAnimations ? 'left-1' : 'right-1'
                  }`} />
                </div>
              </button>
            </div>

            {/* Reset */}
            <button
              onClick={reset}
              className="w-full py-2.5 px-4 rounded-lg border-2 border-cream-darker text-brown hover:bg-cream-darker hover:text-brown-dark transition-colors text-sm font-bold active:scale-95"
            >
              איפוס הגדרות
            </button>
          </m.div>
        )}
      </AnimatePresence>

      {/* Trigger — half-circle tab flush to left edge */}
      {!isOpen && (
        <button
          ref={buttonRef}
          onClick={handleToggle}
          className="w-7 h-11 rounded-r-full bg-white/90 border border-l-0 border-cream-darker shadow-md flex items-center justify-center text-brown hover:text-orange hover:bg-white transition-colors"
          aria-label="פתח תפריט נגישות"
          aria-expanded={isOpen}
        >
          <AccessibilityIcon className="w-4 h-4 mr-0.5" />
        </button>
      )}
    </div>
  )
}
