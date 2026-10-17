// shot · S5 the process, inside section#process (SPEC S5, storyboard "build" 10.06-12.47): the rest
// after the peak. The heading is printed on the table; the ink line that left the laptop's base
// keeps running down beside it (phones) and through the four step sheets. The line is drawn by the
// scroll (one scaleY), its front at 70% of the viewport; a step's dot fills the moment the drawn
// line reaches it, its sheet switches on (the title goes from ink-2 to ink) and its Lottie plays
// only while the sheet is in the eye band (useEyeLine). Everything is derived from the scroll
// position both ways. Each sheet lands on its Lottie well (art first) and tips away late.
// 1100+: the line runs down the middle and the sheets alternate sides, about two per screen; the
// line starts under the heading there, so it never crosses the centred words.
// REDUCE, prerender and no JS: the line drawn, every dot filled, every sheet on and flat.
import { useState, type CSSProperties } from 'react'
import { LookButton } from '@look/button'
import { useSceneNear } from './near'
import { track } from '../../utils/analytics'
import { STEPS } from '../data'
import { EyeArt, useEyeLine } from './eye-line'
import { land, scrubbing } from './camera'
import { inkLine } from './moves'
import './shot-process.css'

/** each step Lottie's own aspect (width / height): the well takes it, so nothing is cropped or scaled */
const ASPECT: Record<string, string> = { call: '680 / 500', design: '1200 / 800', build: '1920 / 1080', launch: '1200 / 800' }

export default function ShotProcess() {
  // the last step the drawn line has reached; all of them until the scene says otherwise (no JS, REDUCE)
  const [reached, setReached] = useState(STEPS.length - 1)

  const ref = useSceneNear<HTMLDivElement>((t, root) => {
    const steps = [...root.querySelectorAll<HTMLElement>('.shot-step')]
    const dots = steps.map((s) => s.querySelector<HTMLElement>('.shot-step__dot')!)
    const line = root.querySelector<HTMLElement>('.shot-process__track > .shot-line')
    const fill = line?.querySelector<HTMLElement>('.shot-line__fill')
    eye.setup(t, root, steps)
    if (!line || !fill) return
    inkLine(t, { track: line, fill, nodes: dots, onReach: setReached })
    if (t.REDUCE) return

    // phones: the line's segment beside the heading, its front on the same 70% line, so the stub
    // from the laptop, this segment and the steps' line read as one stroke
    const head = root.querySelector<HTMLElement>('.shot-line--head')
    const headFill = head?.querySelector<HTMLElement>('.shot-line__fill')
    if (head && headFill && head.offsetHeight > 0) {
      t.gsap.fromTo(headFill, { scaleY: 0, transformOrigin: '50% 0%' }, {
        scaleY: 1, transformOrigin: '50% 0%', ease: 'none',
        scrollTrigger: { trigger: head, start: 'top 70%', end: 'bottom 70%', scrub: t.CALM ? true : 0.5, onToggle: scrubbing(headFill) },
      })
    }

    // each sheet lands on its well: flat before its first text line (the kicker) enters the reading band
    for (const step of steps) {
      const paper = step.querySelector<HTMLElement>('.shot-step__paper')
      const kicker = step.querySelector<HTMLElement>('.shot-step__kicker')
      if (paper && kicker) land(t, paper, { strength: 1, art: () => kicker.offsetTop })
    }
  })

  const eye = useEyeLine(ref, STEPS.length)

  return (
    <div ref={ref} className="shot-process">
      <header className="shot-table-head shot-process__head">
        <i className="shot-line shot-line--head" aria-hidden="true" data-zone="art"><i className="shot-line__fill" /></i>
        <p className="shot-kicker" data-zone="text"><b>03</b>בונים</p>
        <h2 id="how-we-work-title" data-zone="text">איך אנחנו עובדים</h2>
        <p className="shot-process__big" data-zone="text"><span>ארבעה צעדים</span> <span>מהשיחה ועד ההשקה</span></p>
      </header>
      <div className="shot-process__track">
        <i className="shot-line" aria-hidden="true" data-zone="art"><i className="shot-line__fill" /></i>
        <ol className="shot-steps">
          {STEPS.map((s, i) => {
            const on = i <= reached
            return (
              <li key={s.id} className="shot-step" data-on={on ? '' : undefined}>
                <i className="shot-step__dot" aria-hidden="true" />
                <div className="shot-sheet shot-step__paper">
                  <div className="shot-step__well" aria-hidden="true" data-zone="art" style={{ '--ar': ASPECT[s.id] ?? '4 / 3' } as CSSProperties}>
                    <EyeArt eye={eye} i={i} item={s} size={190} lit={on} />
                  </div>
                  <p className="shot-step__kicker" data-zone="text"><bdi dir="ltr">{i + 1} / {STEPS.length}</bdi></p>
                  <h3 data-zone="text">{s.title}</h3>
                  <p className="shot-step__line" data-zone="text">{s.line}</p>
                </div>
              </li>
            )
          })}
        </ol>
        <div className="shot-process__cta">
          <LookButton href="#contact" block zone="text" onClick={() => track('cta_click', { placement: 'process' })}>ספרו לנו על העסק</LookButton>
        </div>
      </div>
    </div>
  )
}
