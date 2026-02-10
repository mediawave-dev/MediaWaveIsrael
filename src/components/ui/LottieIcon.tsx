import Lottie from 'lottie-react'
import { useRef, useState, useEffect } from 'react'
import type { LottieRefCurrentProps } from 'lottie-react'

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
}

/**
 * LottieIcon - Lottie animation component with hover interaction
 */
export function LottieIcon({
  animationPath,
  animationData,
  size = 64,
  className = '',
  playOnHover = true,
  loop = true,
  speed = 1,
}: LottieIconProps) {
  const lottieRef = useRef<LottieRefCurrentProps>(null)
  const [loadedData, setLoadedData] = useState<object | null>(animationData || null)
  const [isLoading, setIsLoading] = useState(!animationData && !!animationPath)
  const [error, setError] = useState<string | null>(null)

  // Load animation from URL
  useEffect(() => {
    if (!animationPath || animationData) return

    setIsLoading(true)
    setError(null)

    fetch(animationPath)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(data => {
        setLoadedData(data)
        setIsLoading(false)
      })
      .catch(err => {
        if (import.meta.env.DEV) {
          console.error('Failed to load Lottie:', animationPath, err)
        }
        setError(err.message)
        setIsLoading(false)
      })
  }, [animationPath, animationData])

  // Set animation speed
  useEffect(() => {
    if (lottieRef.current && speed !== 1) {
      lottieRef.current.setSpeed(speed)
    }
  }, [speed, loadedData])

  // Hover handlers
  const handleMouseEnter = () => {
    if (playOnHover && lottieRef.current) {
      lottieRef.current.goToAndPlay(0)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div
        className={`animate-pulse bg-sky-100 rounded-xl ${className}`}
        style={{ width: size, height: size }}
      />
    )
  }

  // Error state
  if (error || !loadedData) {
    return (
      <div
        className={`flex items-center justify-center bg-sky-50 rounded-xl text-sky-300 ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.4 }}
      >
        ⚠
      </div>
    )
  }

  return (
    <div
      className={className}
      style={{ width: size, height: size }}
      onMouseEnter={handleMouseEnter}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={loadedData}
        loop={loop}
        autoplay={true}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}

export default LottieIcon
