import { useState, useEffect, useCallback } from 'react'

// Types
export type TextSize = 'normal' | 'large' | 'extra-large'

export interface AccessibilitySettings {
  textSize: TextSize
  highContrast: boolean
  disableAnimations: boolean
}

// Constants
// Legacy key from when settings persisted between visits — purged on mount
// so returning visitors always start from the defaults.
const LEGACY_STORAGE_KEY = 'mediawave-accessibility'

const TEXT_SCALES: Record<TextSize, number> = {
  'normal': 1,
  'large': 1.15,
  'extra-large': 1.3,
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  textSize: 'normal',
  highContrast: false,
  disableAnimations: false,
}

// Apply settings to DOM
function applySettings(settings: AccessibilitySettings): void {
  if (typeof document === 'undefined') return

  const html = document.documentElement

  // Text scaling
  html.style.setProperty('--accessibility-text-scale', String(TEXT_SCALES[settings.textSize]))

  // High contrast
  html.classList.toggle('high-contrast', settings.highContrast)

  // Disable animations
  html.classList.toggle('disable-animations', settings.disableAnimations)
}

/**
 * Hook for managing accessibility settings.
 *
 * Settings apply for the current visit only and are NEVER persisted:
 * every page load starts from the defaults (normal text, contrast off,
 * animations on). This is deliberate — see DECISIONS.rtl.md.
 */
export function useAccessibility() {
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS)

  // Purge the legacy persisted value so returning visitors aren't
  // stuck with settings they toggled on a previous visit.
  useEffect(() => {
    try {
      localStorage.removeItem(LEGACY_STORAGE_KEY)
    } catch {
      // Storage unavailable (private mode) — nothing to purge
    }
  }, [])

  // Apply to DOM whenever settings change (in-memory only)
  useEffect(() => {
    applySettings(settings)
  }, [settings])

  // Setters
  const setTextSize = useCallback((textSize: TextSize) => {
    setSettings(prev => ({ ...prev, textSize }))
  }, [])

  const toggleHighContrast = useCallback(() => {
    setSettings(prev => ({ ...prev, highContrast: !prev.highContrast }))
  }, [])

  const toggleAnimations = useCallback(() => {
    setSettings(prev => ({ ...prev, disableAnimations: !prev.disableAnimations }))
  }, [])

  const reset = useCallback(() => {
    setSettings(DEFAULT_SETTINGS)
  }, [])

  return {
    settings,
    setTextSize,
    toggleHighContrast,
    toggleAnimations,
    reset,
  }
}

export default useAccessibility
