import { useRef, useState, useCallback, CSSProperties } from 'react'
import { useReducedMotion } from './useReducedMotion'

interface TiltState {
  rotateX: number
  rotateY: number
  scale: number
}

interface UseTilt3DOptions {
  maxRotation?: number  // Max rotation in degrees (default: 8)
  scale?: number        // Scale on hover (default: 1.02)
  perspective?: number  // Perspective in px (default: 1000)
  springStrength?: number // Lower = smoother (default: 0.1)
}

interface UseTilt3DReturn<T extends HTMLElement> {
  ref: React.RefObject<T>
  style: CSSProperties
  handlers: {
    onMouseMove: (e: React.MouseEvent<T>) => void
    onMouseLeave: () => void
    onMouseEnter: () => void
  }
  isHovering: boolean
}

/**
 * Custom hook for 3D tilt effect on hover
 * Respects prefers-reduced-motion for accessibility
 */
export function useTilt3D<T extends HTMLElement = HTMLDivElement>(
  options: UseTilt3DOptions = {}
): UseTilt3DReturn<T> {
  const {
    maxRotation = 8,
    scale = 1.02,
    perspective = 1000,
    springStrength = 0.1,
  } = options

  const ref = useRef<T>(null!)
  const prefersReducedMotion = useReducedMotion()
  const [isHovering, setIsHovering] = useState(false)
  const [tilt, setTilt] = useState<TiltState>({ rotateX: 0, rotateY: 0, scale: 1 })

  // Animation frame ID for smooth updates
  const animationRef = useRef<number | null>(null)
  const targetTilt = useRef<TiltState>({ rotateX: 0, rotateY: 0, scale: 1 })

  // Smooth spring animation
  const animateTilt = useCallback(() => {
    setTilt(current => {
      const newRotateX = current.rotateX + (targetTilt.current.rotateX - current.rotateX) * springStrength
      const newRotateY = current.rotateY + (targetTilt.current.rotateY - current.rotateY) * springStrength
      const newScale = current.scale + (targetTilt.current.scale - current.scale) * springStrength

      // Check if we're close enough to stop animating
      const isSettled =
        Math.abs(newRotateX - targetTilt.current.rotateX) < 0.01 &&
        Math.abs(newRotateY - targetTilt.current.rotateY) < 0.01 &&
        Math.abs(newScale - targetTilt.current.scale) < 0.001

      if (!isSettled) {
        animationRef.current = requestAnimationFrame(animateTilt)
      }

      return { rotateX: newRotateX, rotateY: newRotateY, scale: newScale }
    })
  }, [springStrength])

  const onMouseMove = useCallback((e: React.MouseEvent<T>) => {
    if (prefersReducedMotion || !ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Calculate rotation based on mouse position relative to center
    // Inverted for natural feel (move mouse right = rotate left edge up)
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * -maxRotation
    const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * maxRotation

    targetTilt.current = { rotateX, rotateY, scale }

    // Start animation if not already running
    if (animationRef.current === null) {
      animationRef.current = requestAnimationFrame(animateTilt)
    }
  }, [maxRotation, scale, prefersReducedMotion, animateTilt])

  const onMouseEnter = useCallback(() => {
    if (prefersReducedMotion) return
    setIsHovering(true)
  }, [prefersReducedMotion])

  const onMouseLeave = useCallback(() => {
    if (prefersReducedMotion) return

    setIsHovering(false)
    targetTilt.current = { rotateX: 0, rotateY: 0, scale: 1 }

    // Start animation back to neutral
    if (animationRef.current === null) {
      animationRef.current = requestAnimationFrame(animateTilt)
    }
  }, [prefersReducedMotion, animateTilt])

  // Style to apply to the element
  const style: CSSProperties = prefersReducedMotion
    ? {}
    : {
        transform: `perspective(${perspective}px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${tilt.scale})`,
        transformStyle: 'preserve-3d' as const,
        willChange: 'transform',
        transition: 'box-shadow 0.3s ease',
      }

  return {
    ref,
    style,
    handlers: {
      onMouseMove,
      onMouseLeave,
      onMouseEnter,
    },
    isHovering,
  }
}

/**
 * Calculate inner parallax offset for depth effect
 * Use this on child elements that should move opposite to tilt
 */
export function useInnerParallax(
  parentRotateX: number,
  parentRotateY: number,
  intensity: number = 10
): CSSProperties {
  return {
    transform: `translate(${parentRotateY * intensity / 8}px, ${-parentRotateX * intensity / 8}px)`,
    transition: 'transform 0.1s ease-out',
  }
}
