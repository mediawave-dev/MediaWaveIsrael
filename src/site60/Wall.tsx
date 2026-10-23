// The wall of screens (D217, after Jesper Landberg's curved wall, Awwwards SOTD 29.9.2026, Developer 8.17:
// work shown as screens on a concave arc, a drag turns it, the screen in front is on air). Ours is the
// editing suite's wall of monitors, one phone per world, each already carrying the visitor's name in that
// world's face and colours. The finger turns the wall (RTL: the next world waits on the left); the screen
// in front goes on air: the real world takes it over (Air.tsx) once it is painted. Screens are pictures;
// the controls are the arrows, the arrow keys and the key under the wall.
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { STYLE_META } from '../studio/styles-meta'
import type { Tier } from '../studio/motion'
import type { Slot } from './Air'

/** A screen's picture before its world is on air: the visitor's name in the world's face and colours. */
export function ScreenCard({ name, kicker }: { name: string; kicker: string }) {
  return (
    <>
      <span className="s60-scr__bar"><bdi>{name}</bdi><i /></span>
      <span className="s60-scr__k">{kicker}</span>
      <bdi className="s60-scr__name">{name}</bdi>
      <span className="s60-scr__pill" />
    </>
  )
}

const N = STYLE_META.length
const STEP = 36 // degrees between two screens on the arc
const wrap = (d: number) => ((((d + N / 2) % N) + N) % N) - N / 2

export default function Wall({ index, onIndex, onChoose, onTurning, onSlot, name, kicker, tier, live }: {
  index: number
  onIndex: (i: number) => void
  onChoose: () => void
  /** the wall is moving (the frame on air steps aside until it rests) */
  onTurning: (moving: boolean) => void
  /** the front screen's box at rest, for the frame on air */
  onSlot: (s: Slot) => void
  name: string
  kicker: string
  tier: Tier
  /** the front screen's world is on air */
  live: boolean
}) {
  const stage = useRef<HTMLDivElement>(null)
  const slot = useRef<HTMLDivElement>(null)
  const screens = useRef<(HTMLDivElement | null)[]>([])
  const pos = useRef(index)
  const target = useRef(index)
  const drag = useRef<{ x: number; y: number; p: number; t: number; v: number; on: boolean } | null>(null)
  const moving = useRef(false)
  const [, setTick] = useState(0)
  const turning = useRef(onTurning)
  turning.current = onTurning
  const pick = useRef(onIndex)
  pick.current = onIndex

  const place = useCallback(() => {
    const w = slot.current?.offsetWidth ?? 240
    const R = w * 1.75
    screens.current.forEach((el, i) => {
      if (!el) return
      const d = wrap(i - pos.current)
      const a = d * STEP
      const rad = (a * Math.PI) / 180
      const far = Math.abs(d)
      el.style.visibility = far > 2.2 ? 'hidden' : 'visible'
      el.style.transform = `translate3d(${(-R * Math.sin(rad)).toFixed(1)}px, 0, ${(R * (1 - Math.cos(rad))).toFixed(1)}px) rotateY(${a.toFixed(2)}deg)`
      el.style.zIndex = String(10 - Math.round(far * 3))
      el.style.setProperty('--dim', Math.min(1, far).toFixed(3))
    })
  }, [])

  // the front screen's box: the slot sits where the front screen rests, untransformed
  const report = useCallback(() => {
    const s = slot.current
    if (!s) return
    const r = s.getBoundingClientRect()
    onSlot({ x: r.left, y: r.top, w: r.width, r: parseFloat(getComputedStyle(s).borderTopLeftRadius) || 0 })
  }, [onSlot])
  useLayoutEffect(() => { place(); report() }, [place, report])
  useEffect(() => {
    const on = () => { place(); report() }
    window.addEventListener('resize', on)
    window.addEventListener('scroll', report, { passive: true })
    return () => { window.removeEventListener('resize', on); window.removeEventListener('scroll', report) }
  }, [place, report])

  // the one clock: ease toward the target, report the rest
  const raf = useRef(0)
  const run = useCallback(() => {
    cancelAnimationFrame(raf.current)
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (!drag.current?.on) {
        const k = tier === 'still' ? 1 : 1 - Math.exp(-dt * (tier === 'calm' ? 7 : 9))
        pos.current += (target.current - pos.current) * k
        if (Math.abs(target.current - pos.current) < 0.002) pos.current = target.current
      }
      place()
      if (drag.current?.on || pos.current !== target.current) { raf.current = requestAnimationFrame(tick); return }
      moving.current = false
      turning.current(false)
      const i = ((Math.round(pos.current) % N) + N) % N
      pick.current(i)
      setTick((n) => n + 1)
    }
    raf.current = requestAnimationFrame(tick)
  }, [place, tier])
  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  const go = useCallback((to: number) => {
    target.current = to
    if (!moving.current) { moving.current = true; turning.current(true) }
    run()
  }, [run])

  // the parent asked for a world (the arrows, the keys): turn the short way round
  useEffect(() => {
    const now = ((Math.round(target.current) % N) + N) % N
    if (now !== index) go(target.current + wrap(index - now))
  }, [index, go])

  // the finger: horizontal drags turn the wall, vertical ones still scroll the page
  useEffect(() => {
    const el = stage.current
    if (!el) return
    const down = (e: PointerEvent) => {
      if (e.button !== 0) return
      drag.current = { x: e.clientX, y: e.clientY, p: pos.current, t: performance.now(), v: 0, on: false }
    }
    const move = (e: PointerEvent) => {
      const d = drag.current
      if (!d) return
      const dx = e.clientX - d.x
      if (!d.on) {
        if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(e.clientY - d.y)) return
        d.on = true
        el.setPointerCapture?.(e.pointerId)
        if (!moving.current) { moving.current = true; turning.current(true) }
        run()
      }
      const w = slot.current?.offsetWidth ?? 240
      const now = performance.now()
      const p = d.p + dx / (w * 0.95)
      d.v = (p - pos.current) / Math.max(0.008, (now - d.t) / 1000) * 0.4 + d.v * 0.6
      d.t = now
      pos.current = p
    }
    const up = () => {
      const d = drag.current
      drag.current = null
      if (!d?.on) return
      // a flick carries on to the next screen; never more than two at a time
      const aim = Math.round(pos.current + Math.max(-1.4, Math.min(1.4, d.v * 0.16)))
      go(Math.max(d.p - 2, Math.min(d.p + 2, aim)))
    }
    el.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    return () => {
      el.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
  }, [go, run])

  const tapScreen = (i: number) => {
    if (drag.current?.on || moving.current) return
    const d = wrap(i - pos.current)
    if (Math.abs(d) < 0.5) onChoose()
    else go(Math.round(pos.current + d))
  }

  return (
    <div className="s60-wall" ref={stage} data-live={live || undefined}>
      <div className="s60-wall__floor" aria-hidden="true" />
      <div className="s60-wall__slot" ref={slot} aria-hidden="true" />
      <div className="s60-wall__ring" aria-hidden="true">
        {STYLE_META.map((s, i) => (
          <div
            key={s.id}
            ref={(el) => { screens.current[i] = el }}
            className="s60-scr"
            onClick={() => tapScreen(i)}
            style={{ ['--g' as string]: s.ground, ['--k' as string]: s.ink, ['--face' as string]: s.face }}
          >
            <ScreenCard name={name} kicker={kicker} />
          </div>
        ))}
      </div>
      <p className="s60-wall__air" aria-hidden="true" lang="en" dir="ltr">{live ? 'ON AIR' : 'TUNING IN'}</p>
    </div>
  )
}
