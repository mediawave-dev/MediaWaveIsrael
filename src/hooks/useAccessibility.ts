import { useState, useEffect, useCallback } from 'react'

// Types
export type TextSize = 'normal' | 'large' | 'extra-large'

export interface AccessibilitySettings {
  textSize: TextSize
  highContrast: boolean
  disableAnimations: boolean
}

// Constants
const STORAGE_KEY = 'mediawave-accessibility'

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

// Helper to safely get from localStorage
function getStoredSettings(): AccessibilitySettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return DEFAULT_SETTINGS

    const parsed = JSON.parse(stored)
    return {
      textSize: parsed.textSize || DEFAULT_SETTINGS.textSize,
      highContrast: Boolean(parsed.highContrast),
      disableAnimations: Boolean(parsed.disableAnimations),
    }
  } catch {
    return DEFAULT_SETTINGS
  }
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
 * Hook for managing accessibility settings
 * Persists to localStorage and applies to DOM
 */
export function useAccessibility() {
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize from localStorage on mount
  useEffect(() => {
    const stored = getStoredSettings()
    setSettings(stored)
    applySettings(stored)
    setIsInitialized(true)
  }, [])

  // Persist and apply whenever settings change (after initialization)
  useEffect(() => {
    if (!isInitialized) return

    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    applySettings(settings)
  }, [settings, isInitialized])

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
    isInitialized,
  }
}

export default useAccessibility
