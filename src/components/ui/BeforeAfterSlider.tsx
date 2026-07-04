import { useRef, useCallback } from 'react'

/**
 * BeforeAfterSlider — the interactive proof (DESIGN-UPGRADE §4.4).
 * Zero dependencies, zero re-renders: pointer moves write a CSS custom
 * property directly and the top image is clipped with clip-path
 * (S-tier compositor property).
 *
 * RTL: the handle travels from the RIGHT edge; --pos is the revealed
 * "before" portion measured from the right.
 *
 * HONESTY: the images are a self-made demo (an intentionally outdated
 * mock vs. this very site) — labeled as such. NEVER present them as a
 * client project.
 */

interface BeforeAfterSliderProps {
  beforeSrc: string
  afterSrc: string
  beforeLabel?: string
  afterLabel?: string
  className?: string
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeLabel = 'לפני',
  afterLabel = 'אחרי',
  className = '',
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const posRef = useRef(50)

  const setPos = useCallback((pct: number) => {
    const el = containerRef.current
    if (!el) return
    posRef.current = clamp(pct, 0, 100)
    el.style.setProperty('--pos', `${posRef.current}%`)
    el.setAttribute('aria-valuenow', String(Math.round(posRef.current)))
  }, [])

  const updateFromPointer = useCallback(
    (clientX: number) => {
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      // RTL: 0% at the right edge, 100% at the left edge
      setPos(((rect.right - clientX) / rect.width) * 100)
    },
    [setPos]
  )

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId)
      updateFromPointer(e.clientX)
    },
    [updateFromPointer]
  )

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.buttons !== 1) return
      updateFromPointer(e.clientX)
    },
    [updateFromPointer]
  )

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      // RTL slider: ArrowLeft reveals more (handle moves left)
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        setPos(posRef.current + 5)
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        setPos(posRef.current - 5)
      } else if (e.key === 'Home') {
        e.preventDefault()
        setPos(0)
      } else if (e.key === 'End') {
        e.preventDefault()
        setPos(100)
      }
    },
    [setPos]
  )

  return (
    <div
      ref={containerRef}
      className={`before-after relative select-none overflow-hidden rounded-2xl ${className}`}
      style={{ '--pos': '50%', touchAction: 'pan-y' } as React.CSSProperties}
      role="slider"
      aria-label="השוואת לפני ואחרי — הדגמה"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={50}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onKeyDown={onKeyDown}
    >
      {/* AFTER — full layer underneath */}
      <img
        src={afterSrc}
        alt="האתר החדש — העיצוב הנוכחי של MediaWave"
        width={1200}
        height={750}
        loading="lazy"
        decoding="async"
        className="block w-full"
        draggable={false}
      />

      {/* BEFORE — clipped to the right portion (RTL reveal) */}
      <img
        src={beforeSrc}
        alt="אתר בסגנון מיושן — הדגמה בלבד"
        width={1200}
        height={750}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="absolute inset-0 block w-full"
        style={{ clipPath: 'inset(0 0 0 calc(100% - var(--pos)))' }}
      />

      {/* Handle line + grip */}
      <div
        className="absolute inset-y-0 pointer-events-none"
        style={{ right: 'var(--pos)', transform: 'translateX(50%)' }}
        aria-hidden="true"
      >
        <div className="h-full w-1 bg-white shadow-[0_0_8px_rgba(0,0,0,0.45)]" />
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center">
          <svg width="22" height="14" viewBox="0 0 22 14" fill="none" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 1 L1 7 L7 13" />
            <path d="M15 1 L21 7 L15 13" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <span className="absolute top-3 right-3 rounded-full bg-black/60 text-white text-xs md:text-sm px-3 py-1 pointer-events-none" aria-hidden="true">
        {beforeLabel}
      </span>
      <span className="absolute top-3 left-3 rounded-full bg-black/60 text-white text-xs md:text-sm px-3 py-1 pointer-events-none" aria-hidden="true">
        {afterLabel}
      </span>
    </div>
  )
}

export default BeforeAfterSlider
