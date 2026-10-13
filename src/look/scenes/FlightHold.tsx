// M's signature hold, "the flight" (direction-bank D-03, moves H-09): the camera flies
// through a lavender void into one floating tool after another; each tool's white face
// holds its service's real Lottie, and the caption names it. M and KM use it for the
// services. All text stays HTML (Igloo's lesson).
//
// Nothing steps on anything: the stage is split into a caption band and an art box
// (desktop: captions under the art; phone: captions on top, the floating buttons keep the
// bottom). An object never grows past the art box: its scale is capped at the box's fit,
// measured on refresh only. Per frame each object gets one transform and one opacity,
// written directly; the active item is derived from progress on every update.
// Reduced (and no JS): the tools stand in a grid with their captions.

import { useEffect, useState, type CSSProperties, type FocusEvent, type ReactNode } from 'react'
import { LookButton } from '@look/button'
import { useMotionEngine, useScene } from '../../motion/ScrollEngineProvider'
import { track } from '../../utils/analytics'
import { Art } from '../parts/Art'
import { KINDS, THING_EM, Thing } from '../parts/Things'
import type { ShowItem } from '../data'
import './flight.css'
import { useIdleWarm } from './idle-warm'

export interface FlightHoldProps {
  sectionId: string
  holdId: string
  heading: ReactNode
  headingId: string
  intro?: string
  items: ShowItem[]
  cta?: { label: string; placement: string }
  length: [string, string]
}

/** the slice of progress spent on each item, and the dwell around each arrival */
const DWELL = 0.2
const PASS = 0.34
const NEAR = 1.4

export default function FlightHold({ sectionId, holdId, heading, headingId, intro, items, cta, length }: FlightHoldProps) {
  const engine = useMotionEngine()
  const n = items.length
  const [active, setActive] = useState(-1)
  // the Lotties built so far: the one on stage and its neighbours, kept once built
  const [warm, setWarm] = useState<Set<number>>(() => new Set([0]))
  useEffect(() => {
    setWarm((w) => {
      const next = [active - 1, active, active + 1].filter((i) => i >= 0 && i < n && !w.has(i))
      return next.length ? new Set([...w, ...next]) : w
    })
  }, [active, n])
  // q runs from the first object still on its way to the last one resting in front
  const Q0 = -0.62
  const Q1 = n - 1 + DWELL * 0.6

  const ref = useScene<HTMLElement>((e, root) => {
    if (e.REDUCE) return
    const hold = root.querySelector<HTMLElement>('.flight__hold')!
    const stage = root.querySelector<HTMLElement>('.flight__stage')!
    const box = root.querySelector<HTMLElement>('.flight__artbox')!
    const flies = [...root.querySelectorAll<HTMLElement>('.flight__fly')]
    let rest: number[] = []
    let fill: number[] = []
    let off: [number, number][] = []
    let progress = 0
    let last = -2

    // layout is read here only (refresh), never per frame
    const measure = () => {
      const w = box.clientWidth
      const h = box.clientHeight
      // objects are drawn at their largest (font-size in flight.css) and only scaled down
      const em = parseFloat(getComputedStyle(flies[0].firstElementChild as HTMLElement).fontSize) || 10
      fill = flies.map((_, i) => {
        const [ew, eh] = THING_EM[KINDS[i % KINDS.length]]
        return Math.min(1, (w * 0.96) / (ew * em), (h * 0.96) / (eh * em))
      })
      rest = fill.map((f) => f * 0.76)
      off = flies.map((_, i) => [(i % 2 ? -1 : 1) * w * 0.2, ((i % 3) - 1) * h * 0.14])
    }

    const set = (p: number) => {
      progress = p
      const q = Q0 + p * (Q1 - Q0)
      let now = -1
      flies.forEach((el, i) => {
        const t = q - i
        const tt = t < -DWELL ? t + DWELL : t > DWELL ? t - DWELL : 0
        let s: number, o: number, dx = 0, dy = 0
        if (tt <= 0) {
          const a = Math.max(0, 1 + tt / NEAR)
          s = rest[i] * (0.12 + 0.88 * a * a)
          o = Math.min(1, Math.max(0, (a - 0.08) * 2.4))
          dx = (1 - a) * off[i][0]
          dy = (1 - a) * off[i][1]
        } else {
          const u = Math.min(1, tt / PASS)
          s = rest[i] + (fill[i] - rest[i]) * u
          o = 1 - u
        }
        el.style.transform = `translate(-50%, -50%) translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px) scale(${s.toFixed(4)})`
        el.style.opacity = o.toFixed(3)
        if (Math.abs(t) <= DWELL + 0.14) now = i
      })
      if (now !== last) {
        last = now
        stage.dataset.active = String(now)
        setActive(now)
      }
    }

    flies.forEach((el, i) => { el.style.zIndex = String(100 - i) })
    measure()
    const tl = e.holdTimeline(hold, {
      id: holdId,
      scrub: e.CALM ? true : 0.5,
      onUpdate: (self) => set(self.progress),
      onRefresh: (self) => { measure(); set(self.progress) },
      // will-change only while the stage is on screen and moving
      onToggle: (self) => stage.classList.toggle('is-live', self.isActive),
    })
    tl.to({}, { duration: 1 })
    set(progress)
    // the art box changes size without a refresh when the cookie banner opens or closes
    // (it lifts the floating buttons): re-fit the objects then, never per frame
    const ro = new ResizeObserver(() => { measure(); set(progress) })
    ro.observe(box)
    return () => {
      ro.disconnect()
      flies.forEach((el) => { el.style.transform = ''; el.style.opacity = ''; el.style.zIndex = '' })
      stage.classList.remove('is-live')
      delete stage.dataset.active
    }
  })

  // Keyboard: tabbing onto a caption's link flies to that object.
  const onFocus = (i: number) => (ev: FocusEvent<HTMLElement>) => {
    if (!engine || engine.REDUCE || !ev.target.matches('a')) return
    const hold = ev.currentTarget.closest<HTMLElement>('.flight__hold')
    if (!hold) return
    const top = hold.getBoundingClientRect().top + window.scrollY
    const range = hold.offsetHeight - window.innerHeight
    engine.scrollTo(top + range * ((i - Q0) / (Q1 - Q0)), { immediate: true })
  }

  useIdleWarm(ref, n, setWarm)

  return (
    <section ref={ref} id={sectionId} className="flight" aria-labelledby={headingId} data-theme="light">
      <div className="flight__intro">
        <h2 id={headingId} data-zone="text">{heading}</h2>
        {intro && <p data-zone="text">{intro}</p>}
      </div>
      <div className="hold flight__hold" data-hold={holdId} style={{ '--hold-h': length[0], '--hold-h-phone': length[1] } as CSSProperties}>
        <div className="hold__stage flight__stage" data-active="-1">
          <div className="flight__artbox" aria-hidden="true" />
          {items.map((it, i) => (
            <div className="flight__item" key={it.id} onFocus={onFocus(i)}>
              <div className="flight__fly" data-i={i} data-zone="art" aria-hidden="true">
                <Thing kind={KINDS[i % KINDS.length]}>
                  <span className="thing__art"><Art item={it} size={240} active={engine && !engine.REDUCE ? active === i : undefined} load={!engine || engine.REDUCE || warm.has(i)} /></span>
                </Thing>
              </div>
              <div className="flight__caption" data-i={i} data-zone="text">
                <h3>{it.title}</h3>
                <p>{it.line}</p>
                <p className="flight__links">
                  {it.href && <a href={it.href} aria-label={it.hrefLabel}>לפרטים</a>}
                  {it.portfolio && <a href={it.portfolio} aria-label={`ראו דוגמה לפרויקט: ${it.title}`}>ראו דוגמה</a>}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {cta && (
        <div className="flight__cta">
          <LookButton href="#contact" zone="text" onClick={() => track('cta_click', { placement: cta.placement })}>{cta.label}</LookButton>
        </div>
      )}
    </section>
  )
}
