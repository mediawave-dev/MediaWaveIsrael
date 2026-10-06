import Lottie from 'lottie-react'
import { useRef, useState, useEffect } from 'react'
import type { LottieRefCurrentProps } from 'lottie-react'
// lottie-react DROPS its renderer prop (destructured and discarded), so the
// canvas path drives lottie-web directly — same module lottie-react bundles,
// zero added download.
import lottie, { type AnimationItem } from 'lottie-web'
import { useAmbientMotion } from '../../hooks/useReducedMotion'

interface LottieIconProps {
  /** URL path to animation JSON file */
  animationPath?: string
  /** Animation data object (imported JSON) */
  animationData?: object
  /** Size in pixels */
  size?: number
  /** Custom className */
  className?: string
  /** Play animation on hover */
  playOnHover?: boolean
  /** Loop the animation */
  loop?: boolean
  /** Animation speed (1 = normal) */
  speed?: number
  /** 'canvas' for vector-heavy animations — the default SVG renderer re-lays-out
      every shape node per frame, which measured 25-54s TBT on one 356-path file */
  renderer?: 'svg' | 'canvas'
  /** Drawn instead of the animation if it cannot be loaded. Pass one wherever
      an empty box would look broken (a CTA button); omit it for decoration. */
  fallback?: React.ReactNode
}

/**
 * LottieIcon - Lottie animation component with hover interaction
 * Only fetches animation data when the element is visible in viewport
 */
export function LottieIcon({
  animationPath,
  animationData,
  size = 64,
  className = '',
  playOnHover = true,
  loop = true,
  speed = 1,
  renderer = 'svg',
  fallback = null,
}: LottieIconProps) {
  const lottieRef = useRef<LottieRefCurrentProps>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const canvasAnimRef = useRef<AnimationItem | null>(null)

  // Both renderers expose the same control surface for our needs
  const getAnim = () => lottieRef.current ?? canvasAnimRef.current
  const [loadedData, setLoadedData] = useState<object | null>(animationData || null)
  const [isLoading, setIsLoading] = useState(!animationData && !!animationPath)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  // Lotties are brand ambient motion: they loop everywhere (mobile has no
  // hover!) and stop only via the site's accessibility widget
  const ambient = useAmbientMotion()

  // Observe visibility - only load when in viewport
  useEffect(() => {
    if (!containerRef.current || animationData) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      // Load well ahead of the scroll: at 200px a fast phone flick arrived
      // before the icon did, so the card visibly swapped placeholder -> art.
      { rootMargin: '800px' }
    )

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [animationData])

  // Load animation from URL - only when visible
  useEffect(() => {
    if (!animationPath || animationData || !isVisible) return

    let cancelled = false
    let retryTimer: ReturnType<typeof setTimeout> | undefined
    setIsLoading(true)
    setError(null)

    fetch(animationPath)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(data => {
        if (cancelled) return
        setLoadedData(data)
        setIsLoading(false)
      })
      .catch(err => {
        if (cancelled) return
        if (import.meta.env.DEV) {
          console.error('Failed to load Lottie:', animationPath, err)
        }
        // One retry: a single dropped request (flaky mobile connection, Low
        // Power Mode) used to leave the icon permanently in its error state.
        // isLoading stays true meanwhile, so the reserved box is shown.
        if (attempt < 1) {
          retryTimer = setTimeout(() => setAttempt(a => a + 1), 1200)
          return
        }
        setError(err.message)
        setIsLoading(false)
      })

    return () => {
      cancelled = true
      clearTimeout(retryTimer)
    }
  }, [animationPath, animationData, isVisible, attempt])

  // Canvas renderer path — lottie-web drives a <canvas> directly (no per-frame
  // SVG DOM layout; measured 25-54s TBT on one 356-path animation)
  useEffect(() => {
    if (renderer !== 'canvas' || !loadedData || !canvasContainerRef.current) return

    const anim = lottie.loadAnimation({
      container: canvasContainerRef.current,
      renderer: 'canvas',
      loop: loop && ambient,
      autoplay: ambient,
      animationData: loadedData,
      rendererSettings: { clearCanvas: true },
    })
    canvasAnimRef.current = anim

    return () => {
      anim.destroy()
      canvasAnimRef.current = null
    }
  }, [renderer, loadedData, loop, ambient])

  // Set animation speed
  useEffect(() => {
    if (speed !== 1) {
      getAnim()?.setSpeed(speed)
    }
     
  }, [speed, loadedData])

  // Pause when scrolled out of view, resume when back — a dozen looping
  // Lotties running offscreen is the biggest CPU cost on the home page
  useEffect(() => {
    if (!containerRef.current || !loadedData || !ambient) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          getAnim()?.play()
        } else {
          getAnim()?.pause()
        }
      },
      { rootMargin: '100px' }
    )

    observer.observe(containerRef.current)
    return () => observer.disconnect()
     
  }, [loadedData, ambient])

  // Animations disabled (a11y widget): freeze on the LAST frame — draw-on
  // animations are empty at frame 0, while the final frame always shows
  // the complete artwork
  useEffect(() => {
    const anim = getAnim()
    if (!ambient && anim && loadedData) {
      const totalFrames = anim.getDuration(true)
      anim.goToAndStop(Math.max(0, (totalFrames ?? 1) - 1), true)
    }
     
  }, [ambient, loadedData])

  // Hover handlers
  const handleMouseEnter = () => {
    if (playOnHover) {
      getAnim()?.goToAndPlay(0)
    }
  }

  // Loading state
  if (isLoading || !isVisible) {
    return (
      <div
        ref={containerRef}
        // Reserve the space silently. The old pulsing sky-blue block drew the
        // eye to a placeholder and then swapped to the illustration.
        className={`rounded-xl ${className}`}
        style={{ width: size, height: size }}
      />
    )
  }

  // Error state — a decorative animation that fails must never announce it.
  // This used to render "⚠", which iOS draws with emoji presentation (a yellow
  // warning triangle, ignoring text-sky-300) right in the middle of the chat
  // trigger: one dropped request made the site look broken. Show the caller's
  // own fallback, or nothing at all.
  if (error || !loadedData) {
    return (
      <div
        ref={containerRef}
        className={`flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        {fallback}
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: size, height: size }}
      onMouseEnter={handleMouseEnter}
    >
      {renderer === 'canvas' ? (
        <div ref={canvasContainerRef} style={{ width: '100%', height: '100%' }} />
      ) : (
        <Lottie
          lottieRef={lottieRef}
          animationData={loadedData}
          loop={loop && ambient}
          autoplay={ambient}
          style={{ width: '100%', height: '100%' }}
        />
      )}
    </div>
  )
}

export default LottieIcon
