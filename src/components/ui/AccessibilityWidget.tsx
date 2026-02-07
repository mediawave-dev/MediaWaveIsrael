import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

  // Animation variants - respect disable animations setting
  const panelVariants = settings.disableAnimations
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, scale: 0.95, y: -10 },
        visible: { opacity: 1, scale: 1, y: 0 },
      }

  return (
    <div className="fixed top-24 left-4 z-50">
      {/* Floating Button */}
      <motion.button
        ref={buttonRef}
        onClick={handleToggle}
        className="w-12 h-12 rounded-full bg-cream border-2 border-cream-darker text-brown shadow-md flex items-center justify-center hover:bg-orange hover:text-white hover:border-orange transition-colors duration-200"
        whileHover={settings.disableAnimations ? undefined : { scale: 1.05 }}
        whileTap={settings.disableAnimations ? undefined : { scale: 0.95 }}
        aria-label="הגדרות נגישות"
        aria-expanded={isOpen}
        aria-controls="accessibility-panel"
      >
        <AccessibilityIcon className="w-6 h-6" />
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            id="accessibility-panel"
            role="dialog"
            aria-label="הגדרות נגישות"
            aria-modal="true"
            className="accessibility-panel absolute top-14 left-0 w-72 p-4"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: settings.disableAnimations ? 0 : 0.2 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-cream-darker">
              <h2 className="text-lg font-bold text-brown-dark">נגישות</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-brown-light hover:bg-cream-darker hover:text-brown-dark transition-colors"
                aria-label="סגור"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Text Size */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-brown-dark mb-2">
                גודל טקסט
              </label>
              <div className="flex gap-2">
                {TEXT_SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setTextSize(size)}
                    className="text-size-btn flex-1 text-sm"
                    data-active={settings.textSize === size}
                    aria-pressed={settings.textSize === size}
                  >
                    {TEXT_SIZE_LABELS[size]}
                  </button>
                ))}
              </div>
            </div>

            {/* High Contrast */}
            <div className="mb-3">
              <button
                onClick={toggleHighContrast}
                className="accessibility-toggle w-full"
                aria-pressed={settings.highContrast}
              >
                <span className="text-sm font-medium text-brown-dark">
                  ניגודיות גבוהה
                </span>
                <span
                  className="accessibility-toggle-switch"
                  data-active={settings.highContrast}
                  aria-hidden="true"
                />
              </button>
            </div>

            {/* Disable Animations */}
            <div className="mb-4">
              <button
                onClick={toggleAnimations}
                className="accessibility-toggle w-full"
                aria-pressed={settings.disableAnimations}
              >
                <span className="text-sm font-medium text-brown-dark">
                  ללא אנימציות
                </span>
                <span
                  className="accessibility-toggle-switch"
                  data-active={settings.disableAnimations}
                  aria-hidden="true"
                />
              </button>
            </div>

            {/* Reset */}
            <button
              onClick={reset}
              className="w-full py-2 px-4 rounded-lg border-2 border-cream-darker text-brown hover:bg-cream-darker transition-colors text-sm font-medium"
            >
              איפוס
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
