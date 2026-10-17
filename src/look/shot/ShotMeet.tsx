// shot · S2 meet, why us (SPEC S2, storyboard "meet"). One sheet of paper lands on the table with
// three screens drawn in ink on it, switched off. Each screen switches on as its top crosses the
// 62% line (the dot shrinks, the well turns from table to paper, its Lottie starts) and off again
// when scrolled back: the state is derived from the scroll position, never spent. Only the lit
// screen in the eye band plays its Lottie (useEyeLine). REDUCE, prerender and no JS: all three on,
// no landing. The copy and the Lottie paths are single-sourced in WhyUs.tsx (WHY_ITEMS).
import { useEffect, useState, type CSSProperties, type RefObject } from 'react'
import { useSceneNear } from './near'
import { WHY_ITEMS } from '../sections/WhyUs'
import { EyeArt, useEyeLine, posterFor } from './eye-line'
import { DEPTH, land, scrubbing } from './camera'
import { SPEED_PROOF, speedLine } from './copy'
import './shot-meet.css'

/** Each Lottie's own aspect (width / height): its box is sized to the well, never scaled by a transform. */
const ASPECT: Record<string, number> = { tech: 1, ai: 1, personal: 1459 / 1080 }

/** The well's inner size in px (re-measured on resize, so the Lottie box is its real size). */
function useWell(ref: RefObject<HTMLElement | null>) {
  const [box, setBox] = useState({ w: 280, h: 205 }) // the 390 well: 300x225 screen, 2px ink, 8px inset
  useEffect(() => {
    const el = ref.current?.querySelector<HTMLElement>('.shot-screen__well')
    if (!el) return
    const ro = new ResizeObserver(() => {
      const w = Math.round(el.clientWidth)
      const h = Math.round(el.clientHeight)
      if (w > 0 && h > 0) setBox((b) => (b.w === w && b.h === h ? b : { w, h }))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])
  return box
}

/** The receipt, with the number and the date in LTR islands. Rendered only once SPEED_PROOF is set. */
function Receipt({ proof }: { proof: { score: number; date: string } }) {
  const line = speedLine(proof)
  const score = String(proof.score)
  const a = line.indexOf(score)
  const b = line.indexOf(proof.date, a + score.length)
  if (a < 0 || b < 0) return <p className="shot-receipt" data-zone="text">{line}</p>
  return (
    <p className="shot-receipt" data-zone="text">
      {line.slice(0, a)}<bdi dir="ltr">{score}</bdi>{line.slice(a + score.length, b)}<bdi dir="ltr">{proof.date}</bdi>{line.slice(b + proof.date.length)}
    </p>
  )
}

export default function ShotMeet() {
  // which screens are on; null = no engine (prerender, no JS) or REDUCE: all on
  const [lit, setLit] = useState<boolean[] | null>(null)

  // the scene runs after render (a layout effect), by when `eye` below is set
  const ref = useSceneNear<HTMLElement>((t, root) => {
    const screens = [...root.querySelectorAll<HTMLElement>('.shot-screen')]
    const marks = [...root.querySelectorAll<HTMLElement>('.shot-meet__mark')]
    const sheet = root.querySelector<HTMLElement>('.shot-meet__sheet')
    if (t.REDUCE || !sheet || marks.length !== screens.length) {
      eye.setup(t, root, screens)
      setLit(null)
      return
    }

    // The sheet lands and tips away (camera land): while it is tilted under perspective its
    // projected box is up to a third taller, and ScrollTrigger measures whatever pose the sheet
    // holds at refresh time. So nothing in this chapter is measured on the sheet: each screen has
    // an untransformed twin on the section (a mark with the screen's layout box, from offsetTop,
    // which ignores transforms), placed again before every refresh measures.
    const place = () => {
      screens.forEach((screen, i) => {
        marks[i].style.top = sheet.offsetTop + screen.offsetTop + 'px'
        marks[i].style.height = screen.offsetHeight + 'px'
      })
    }
    place()
    t.ScrollTrigger.addEventListener('refreshInit', place)

    eye.setup(t, root, marks)

    const setOn = (i: number, on: boolean) =>
      setLit((l) => {
        const cur = l ?? WHY_ITEMS.map(() => true)
        if (cur[i] === on) return l
        const next = [...cur]
        next[i] = on
        return next
      })
    setLit(WHY_ITEMS.map(() => false))
    marks.forEach((mark, i) => {
      t.ScrollTrigger.create({
        trigger: mark,
        start: 'top 62%',
        onRefresh: (self) => setOn(i, self.progress > 0),
        onEnter: () => setOn(i, true),
        onLeaveBack: () => setOn(i, false),
      })
    })

    // the landing (art first: it is flat before the first title enters the reading band) ...
    const first = screens[0]
    land(t, sheet, { strength: 1, art: () => first.offsetTop + first.offsetHeight, exit: false })
    // ... and land's late exit, measured on the section (untransformed): the sheet's bottom is the
    // section's bottom less its padding. Same pose and timing as camera.ts land().
    const tilt = t.CALM ? 6 : 22
    const padB = () => parseFloat(getComputedStyle(root).paddingBottom) || 0
    t.gsap.fromTo(sheet,
      { rotateX: 0, scale: 1, transformPerspective: DEPTH, transformOrigin: '50% 100%' },
      { rotateX: -tilt * 0.6, scale: 0.94, transformOrigin: '50% 100%', immediateRender: false, ease: 'none',
        scrollTrigger: { trigger: root, start: () => `bottom-=${padB()} 18%`, end: () => `bottom-=${padB()} top`, scrub: true, onToggle: scrubbing(sheet) } })

    return () => {
      t.ScrollTrigger.removeEventListener('refreshInit', place)
      setLit(null)
    }
  })
  const eye = useEyeLine(ref, WHY_ITEMS.length)
  const well = useWell(ref)

  return (
    <section
      ref={ref}
      id="why-us"
      className="shot-meet"
      data-chapter="meet"
      data-dossier="W05 W23 W19"
      aria-labelledby="why-title"
    >
      <header className="shot-table-head">
        <h2 id="why-title" data-zone="text">למה לעבוד איתנו?</h2>
      </header>
      {WHY_ITEMS.map((it) => <i key={it.id} className="shot-meet__mark" aria-hidden="true" />)}
      <ul className="shot-sheet shot-meet__sheet">
        {WHY_ITEMS.map((it, i) => {
          const on = !lit || lit[i]
          const size = Math.max(1, Math.floor(Math.min(well.w, well.h * (ASPECT[it.id] ?? 1))))
          return (
            <li key={it.id} className="shot-meet__item" data-on={on ? '' : undefined}>
              <div className="shot-screen" aria-hidden="true" data-zone="art">
                <span className="shot-screen__well" style={{ '--poster': posterFor(it.lottie) ? `url("${posterFor(it.lottie)!.src}")` : 'none' } as CSSProperties}>
                  <EyeArt eye={eye} i={i} item={it} size={size} lit={on} />
                </span>
                <i className="shot-screen__dot" />
              </div>
              <div className="shot-meet__text">
                <h3 data-zone="text">{it.title}</h3>
                <p data-zone="text">{it.line}</p>
                {i === 0 && SPEED_PROOF ? <Receipt proof={SPEED_PROOF} /> : null}
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
