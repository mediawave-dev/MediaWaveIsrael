// K's signature hold, "the launch" (direction-bank D-01): a laptop on a dark stage. Its lid
// opens, then it turns a little for each announcement while its screen shows the item's
// Lottie and a thin headline announces it. K uses it for the services, KM for the four
// steps of how we work.
//
// Smoothness: a sticky stage read by ScrollTrigger (no pin). Per frame only two transforms
// are written, on the lid and on the laptop. The active item is derived from progress on
// every update; on a change the stage's data-active flips (CSS swaps the copy, out before
// in) and React tells the one Lottie on stage to play; every other Lottie is paused.
// Reduced (and no JS): no stage at all, a list of the items, each with its art.

import { useEffect, useState, type CSSProperties, type FocusEvent, type ReactNode } from 'react'
import { LookButton } from '@look/button'
import { useMotionEngine, useScene } from '../../motion/ScrollEngineProvider'
import { track } from '../../utils/analytics'
import { Laptop } from '../parts/Laptop'
import { Art } from '../parts/Art'
import Logo from '../../components/ui/Logo'
import type { ShowItem } from '../data'
import './launch.css'

export interface LaunchHoldProps {
  sectionId: string
  holdId: string
  heading: ReactNode
  headingId: string
  intro: string
  items: ShowItem[]
  /** the frame shown while the lid opens */
  opening: { kicker: string; line: string }
  cta?: { label: string; placement: string }
  /** scroll length of the hold, desktop and phone */
  length: [string, string]
}

/** progress: the lid opens over [0, OPEN], the items share [START, 1] */
const OPEN = 0.12
const START = 0.14

export default function LaunchHold({ sectionId, holdId, heading, headingId, intro, items, opening, cta, length }: LaunchHoldProps) {
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

  const ref = useScene<HTMLElement>((e, root) => {
    if (e.REDUCE) return
    const hold = root.querySelector<HTMLElement>('.launch__hold')!
    const stage = root.querySelector<HTMLElement>('.launch__stage')!
    const lap = root.querySelector<HTMLElement>('.launch__lap')!
    const lid = lap.querySelector<HTMLElement>('.lap__lid')!
    const amp = e.CALM ? 4 : 9
    let last = -2
    const set = (p: number) => {
      const open = Math.min(1, p / OPEN)
      const eased = 1 - (1 - open) ** 3
      lid.style.transform = `rotateX(${(-86 + eased * 80).toFixed(2)}deg)`
      const q = Math.max(0, (p - START) / (1 - START))
      const turn = p < START ? -22 * (1 - eased) : Math.sin(q * n * Math.PI) * amp
      lap.style.transform = `rotateY(${turn.toFixed(2)}deg) rotateX(6deg)`
      const i = p < START ? -1 : Math.min(n - 1, Math.floor(q * n))
      if (i !== last) {
        last = i
        stage.dataset.active = String(i)
        setActive(i)
      }
    }
    const tl = e.holdTimeline(hold, {
      id: holdId,
      scrub: e.CALM ? true : 0.6,
      onUpdate: (self) => set(self.progress),
      onRefresh: (self) => set(self.progress),
    })
    tl.to({}, { duration: 1 })
    set(0)
    return () => { lid.style.transform = ''; lap.style.transform = ''; delete stage.dataset.active }
  })

  // Keyboard: tabbing onto an item's link scrolls the hold to that item, so focus is never
  // on copy that is not on stage.
  const onFocus = (i: number) => (ev: FocusEvent<HTMLElement>) => {
    if (!engine || engine.REDUCE || !ev.target.matches('a')) return
    const hold = ev.currentTarget.closest<HTMLElement>('.launch__hold')
    if (!hold) return
    const top = hold.getBoundingClientRect().top + window.scrollY
    const range = hold.offsetHeight - window.innerHeight
    const p = START + ((i + 0.5) / n) * (1 - START)
    engine.scrollTo(top + range * p, { immediate: true })
  }

  return (
    <section ref={ref} id={sectionId} className="launch" aria-labelledby={headingId} data-theme="dark">
      <div className="launch__intro">
        <h2 id={headingId} data-zone="text">{heading}</h2>
        <p data-zone="text">{intro}</p>
      </div>
      <div className="hold launch__hold" data-hold={holdId} style={{ '--hold-h': length[0], '--hold-h-phone': length[1] } as CSSProperties}>
        <div className="hold__stage launch__stage" data-active="-1">
          <div className="launch__specs">
            <div className="launch__spec launch__spec--opening" data-i="-1" aria-hidden="true" data-zone="text">
              <p className="launch__kicker">{opening.kicker}</p>
              <p className="launch__big">{opening.line}</p>
            </div>
            {items.map((it, i) => (
              <div className="launch__spec" data-i={i} key={it.id} data-zone="text" onFocus={onFocus(i)}>
                <div className="launch__thumb"><Art item={it} size={120} /></div>
                <p className="launch__kicker"><span dir="ltr">{i + 1} / {n}</span></p>
                <h3>{it.title}</h3>
                <p className="launch__line">{it.line}</p>
                <p className="launch__links">
                  {it.href && <a href={it.href} className="launch__link" aria-label={it.hrefLabel}>לפרטים</a>}
                  {it.portfolio && <a href={it.portfolio} className="launch__link" aria-label={`ראו דוגמה לפרויקט: ${it.title}`}>ראו דוגמה</a>}
                </p>
              </div>
            ))}
          </div>
          <div className="launch__turntable" aria-hidden="true" data-zone="art">
            <Laptop className="launch__lap">
              <div className="launch__shot launch__shot--opening" data-i="-1"><Logo variant="horizontal" decorative /></div>
              {items.map((it, i) => (
                <div className="launch__shot" data-i={i} key={it.id}><div className="launch__art"><Art item={it} size={260} active={active === i} load={warm.has(i)} /></div></div>
              ))}
            </Laptop>
          </div>
        </div>
      </div>
      {cta && (
        <div className="launch__cta">
          <LookButton href="#contact" zone="text" onClick={() => track('cta_click', { placement: cta.placement })}>{cta.label}</LookButton>
        </div>
      )}
    </section>
  )
}
