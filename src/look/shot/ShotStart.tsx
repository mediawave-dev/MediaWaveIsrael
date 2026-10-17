// shot · S6-S8 start (SPEC S6-S8, storyboard "start"): the FAQ as a ruled notepad, 'מתחילים?'
// written on the table, Nati's business card and the letter with the laptop at its head. The three
// shared sections render straight into <main> with their anchors, the FAQPage JSON-LD, the form and
// every track() call unchanged; this file adds the shot's props, its CSS and its motion.
//
// The motion, one scene for the chapter (the three roots are siblings in <main>, so the scene finds
// them by id rather than by a wrapper):
//   the pad      lands once on its binding band (land strength .5, art 64px), then lies flat and
//                never tilts on exit; rows never move. Its margin line draws down with the scroll.
//   the word     a short segment of the same line comes down to the first letter and hands it the
//                ink; BigWord's own fill then runs until the card's top reaches the dock line.
//   the card     is put down (rotateZ -4 → 0, rotateX 11 → 0 on its Lottie band), flat before its
//                first row enters the reading band.
//   the laptop   (the Rive companion) settles 16px onto the letter as its shadow tightens; the
//                letter itself is never transformed.
// REDUCE: nothing runs, the CSS is the last frame (lines full, word filled, everything flat).
// CALM: the same moves with small angles (the helpers' CALM values), scrub true.
import { useMemo } from 'react'
import { useGSAP } from '@gsap/react'
import Faq from '../sections/Faq'
import BigWord from '../sections/BigWord'
import Contact from '../sections/Contact'
import { useMotionEngine } from '../../motion/ScrollEngineProvider'
import type { MotionEngine } from '../../motion/motion-engine'
import { land, landRange, safeB, scrubbing, type Px } from './camera'
import { useNear } from './near'
import { inkLine, setDown } from './moves'
import palRiv from '../parts/companion-shot.riv?url'
import palRest from '../parts/companion-shot-rest.svg'
import './shot-start.css'

type El = HTMLElement

const PAL = { riv: palRiv, rest: palRest }

/** the pad's binding band: the art above its first row (px), rule 2 */
const BINDING = 64

/**
 * A scrubbed landing leaves an identity 3D transform behind (perspective plus zero angles), which
 * keeps the paper's text on its own layer. Once the landing is over, the paper rests with no
 * transform at all; scrolling back, the landing's own tween writes its transform again.
 */
function restFlat(t: MotionEngine, el: El, art: Px) {
  t.ScrollTrigger.create({
    trigger: el, ...landRange(t, el, art), invalidateOnRefresh: true,
    onLeave: () => { el.style.transform = 'none' },
    // a refresh past the landing re-renders it at its end: rest again
    onRefresh: (self) => { if (self.progress === 1) el.style.transform = 'none' },
  })
}

function startScene(t: MotionEngine) {
  if (t.REDUCE) return
  const q = <T extends El = El>(sel: string) => document.querySelector<T>(sel)

  // S6 the pad: lands once, then the margin line draws down it
  const list = q('#faq .faq__list')
  const margin = q('#faq .shot-line--margin .shot-line__fill')
  if (list) {
    land(t, list, { strength: 0.5, art: BINDING, exit: false })
    restFlat(t, list, BINDING)
    if (margin) inkLine(t, { track: list, fill: margin, nodes: [], start: 'top 70%', end: 'bottom 70%' })
  }

  // S7 the segment comes down to the first letter; it is drawn exactly when the fill starts
  const word = q('.shot-bw .bw')
  const seg = q('.shot-bw .shot-line--to-word .shot-line__fill')
  if (word && seg) {
    t.gsap.fromTo(seg, { scaleY: 0, transformOrigin: '50% 0%' }, {
      scaleY: 1, transformOrigin: '50% 0%', ease: 'none',
      scrollTrigger: { trigger: word, start: 'top 95%', end: 'top 80%', scrub: t.CALM ? true : 0.4, onToggle: scrubbing(seg) },
    })
  }

  // S8 the card is put down on its Lottie band; its rows are text, so it ends flat (toZ 0)
  const card = q('#contact .ct__card')
  const ways = q('#contact .ct__ways')
  if (card) {
    // the art band is the Lottie (to the first row). landEnd keeps the dock band clear as well; here
    // the card is flat before its first row even enters the viewport (the dock band given back), so
    // no tilted row is ever on screen, not even under the dock or the cookie strip
    const art = () => (ways ? ways.offsetTop : 124) - safeB(t)
    setDown(t, card, { tilt: 11, fromZ: -4, toZ: 0, art })
    restFlat(t, card, art)
  }

  // S8 the laptop settles onto the letter (y only: never a scale on the canvas's parent); its
  // contact shadow on the letter tightens through a custom property (the form is never moved)
  const pal = q('#contact .ct__pal')
  const form = q('#contact .ct__form')
  if (pal && form) {
    const st = { trigger: pal, start: 'top bottom', end: 'top 70%', scrub: true }
    t.gsap.fromTo(pal, { y: t.CALM ? -6 : -16 }, { y: 0, ease: 'none', scrollTrigger: { ...st, onToggle: scrubbing(pal) } })
    t.gsap.fromTo(form, { '--pal-shadow': 0.4 }, { '--pal-shadow': 1, ease: 'none', scrollTrigger: st })
  }
}

/** The chapter's scene (SPEC 1.6: one per chapter), reverted on unmount and engine swaps. */
function StartMotion() {
  const engine = useMotionEngine()
  // built when the chapter (the FAQ notepad, its first element) comes within 1.5 viewports (near.ts)
  const near = useNear(() => document.getElementById('faq'))
  useGSAP(() => {
    if (!engine || engine.PRERENDER || !near) return
    startScene(engine)
  }, { dependencies: [engine, near], revertOnUpdate: true })
  return null
}

export default function ShotStart() {
  const engine = useMotionEngine()
  // the word fills until the card's top reaches the dock line (measured again on every refresh)
  const wordEnd = useMemo(() => () => 'top ' + (innerHeight - safeB(engine ?? undefined)) + 'px', [engine])
  return (
    <>
      <Faq
        chapter="start"
        dossier="W01"
        kicker={<p className="shot-kicker" data-zone="text"><b>04</b>שואלים</p>}
        decor={<i className="shot-line shot-line--margin" aria-hidden="true" data-zone="art"><i className="shot-line__fill" /></i>}
      />
      <div className="shot-bw" data-chapter="start" data-zone="art">
        <i className="shot-line shot-line--to-word" aria-hidden="true"><i className="shot-line__fill" /></i>
        <BigWord start="top 80%" end={wordEnd} endTrigger="#contact .ct__card" />
      </div>
      <Contact chapter="start" dossier="W16" pal={PAL} kicker={<p className="shot-kicker" data-zone="text"><b>05</b>כותבים</p>} />
      <StartMotion />
    </>
  )
}
