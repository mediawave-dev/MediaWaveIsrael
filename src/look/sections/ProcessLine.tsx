// How we work in K and M (step 3; KM uses its launch hold instead). One move: a line draws
// with the scroll from the first step to the last (from the right, RTL), and each step's
// screen switches on as the line reaches it, its Lottie starting then. Per frame only the
// line's transform is written; the screens' covers are CSS (one owner each). Reduced and no
// JS: the line is full and every screen is on. Phones: the steps stack and the line runs down.

import { useState } from 'react'
import { LookButton } from '@look/button'
import { useScene } from '../../motion/ScrollEngineProvider'
import { LottieIcon } from '../../components/ui/LottieIcon'
import { track } from '../../utils/analytics'
import { STEPS } from '../data'
import './process.css'

export default function ProcessLine() {
  const n = STEPS.length
  // the last step the line has reached; null = no scene (prerender, reduced, no JS): all on
  const [on, setOn] = useState<number | null>(null)
  const ref = useScene<HTMLElement>((e, root) => {
    if (e.REDUCE) return
    const fill = root.querySelector<HTMLElement>('.proc__fill')!
    const track = root.querySelector<HTMLElement>('.proc__steps')!
    let vertical = false // read on refresh only: phones run the line down the side
    let last = -2
    const set = (p: number) => {
      fill.style.transform = vertical ? `scaleY(${p.toFixed(4)})` : `scaleX(${p.toFixed(4)})`
      // the steps sit at (i + 0.5) / n along the line; one is reached a little before its centre
      const i = Math.max(-1, Math.min(n - 1, Math.floor(p * n - 0.3)))
      if (i !== last) { last = i; setOn(i) }
    }
    e.ScrollTrigger.create({
      trigger: track, start: 'top 75%', end: 'bottom 55%', scrub: e.CALM ? true : 0.5,
      onUpdate: (self) => set(self.progress),
      onRefresh: (self) => { vertical = window.matchMedia('(max-width: 860px)').matches; set(self.progress) },
    })
    vertical = window.matchMedia('(max-width: 860px)').matches
    set(0)
    return () => { fill.style.transform = ''; setOn(null) }
  })

  return (
    <section ref={ref} id="process" className="proc" aria-labelledby="how-we-work-title">
      <div className="proc__in">
        <h2 id="how-we-work-title" data-zone="text">איך אנחנו עובדים</h2>
        <p className="proc__lead" data-zone="text">מהרעיון ועד ההשקה: תהליך פשוט וברור</p>
        <div className="proc__track">
          <span className="proc__line" aria-hidden="true"><i className="proc__fill" /></span>
          <ol className="proc__steps">
            {STEPS.map((s, i) => {
              const lit = on === null || i <= on
              return (
                <li key={s.id} className="proc__step" data-on={lit ? '' : undefined}>
                  <div className="proc__face" data-zone="art" aria-hidden="true">
                    <div className="proc__art">
                      <LottieIcon animationPath={s.lottie} size={200} renderer={s.renderer} playOnHover={false} loop active={lit ? undefined : false} />
                    </div>
                    <span className="proc__off" />
                  </div>
                  <p className="proc__kicker" data-zone="text"><span dir="ltr">{i + 1} / {n}</span></p>
                  <h3 data-zone="text">{s.title}</h3>
                  <p className="proc__text" data-zone="text">{s.line}</p>
                </li>
              )
            })}
          </ol>
        </div>
        <div className="proc__cta">
          <LookButton href="#contact" zone="text" onClick={() => track('cta_click', { placement: 'process' })}>דברו איתנו</LookButton>
        </div>
      </div>
    </section>
  )
}
