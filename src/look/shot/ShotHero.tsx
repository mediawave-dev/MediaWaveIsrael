// shot · S1 the hero, the dive (SPEC S1, storyboard "hero", DECISIONS #64, #83). The camera starts
// over the desk: the paper of the site lies there in an overview, the lens resting on the hero
// sheet's top edge, the closed laptop, the loupe and the cassette at the table's edges. Scrolling
// lowers the camera onto the sheet (camera.ts dive, about the H1's own line, never on Z) and the
// iris opens 0.72 -> 1 over the last 30% of the hold. After the release the sheet only tips away
// once its bottom has passed the top 18% (rule 3).
//
// The H1 is the LCP and paints at first paint. index.html paints the overview pose before the
// app boots (html.shot-dive / shot-dive-calm, shot-hero.css) from the numbers GSAP starts from,
// so nothing jumps; the scene removes both classes on every path, REDUCE included.
// REDUCE, the prerender and no JS: a flat sheet, no hold, no desk props, the lens at rest.
// Short stages (under 560px) and a scaled text size: no hold, only the late exit tilt.
import { useRef } from 'react'
import { LookButton } from '@look/button'
import { useMotionEngine, useScene } from '../../motion/ScrollEngineProvider'
import { Lens, type LensRange } from '../parts/Lens'
import { Laptop } from '../parts/Laptop'
import { Thing, type Kind } from '../parts/Things'
import Logo from '../../components/ui/Logo'
import { HERO } from '../data'
import { track } from '../../utils/analytics'
import { DEPTH, dive, land, scrubbing } from './camera'
import { useShotPolicy } from './policy'
// the lens on the desk palette (design/rive/lens/build-lens.mjs --palette shot); the frames are
// inline markup, never an <img>, so the H1 stays the LCP
import lensRiv from '../parts/lens-shot.riv?url'
import lensRest from '../parts/lens-shot-rest.svg?raw'
import lensClosed from '../parts/lens-shot-closed.svg?raw'
import './shot-hero.css'

const LENS_SRC = { riv: lensRiv, rest: lensRest, closed: lensClosed }
/** The film circle is 71% of the lens (SPEC S1). */
const FILM_SIZES = '(max-width: 767px) 42vw, 330px'

/** The tools around the sheet from 1100px, each lagging the camera by its depth (0.4-1). */
const DESK_OBJECTS: { kind: Kind; depth: number }[] = [
  { kind: 'phone', depth: 0.7 },
  { kind: 'bubble', depth: 0.5 },
  { kind: 'frame', depth: 0.9 },
]

export default function ShotHero() {
  const engine = useMotionEngine()
  const policy = useShotPolicy()
  // the dive runs (a held stage) or not (REDUCE, a short stage, scaled text): read by the lens's
  // range on every refresh, so the iris follows whichever scroll the sheet really has
  const diving = useRef(false)
  const holdRef = useRef<HTMLDivElement>(null)
  const range = useRef<LensRange>({
    trigger: () => holdRef.current,
    start: 'top top',
    end: () => (diving.current ? 'bottom bottom' : 'bottom top'),
    from: 0.7,
  }).current

  const ref = useScene<HTMLElement>((t, root) => {
    const html = document.documentElement
    const clearPose = () => html.classList.remove('shot-dive', 'shot-dive-calm')
    const hold = root.querySelector<HTMLElement>('.hold')
    const model = root.querySelector<HTMLElement>('.shot-hero__model')
    const sheet = root.querySelector<HTMLElement>('.shot-hero__sheet')
    diving.current = false
    if (t.REDUCE || !hold || !model || !sheet) {
      clearPose()
      return
    }
    if (policy.short || policy.textScaled) {
      clearPose()
      land(t, sheet, { enter: false })
      return
    }

    diving.current = true
    const tl = dive(t, { hold, layer: model, id: 'dive' })
    const stage = hold.querySelector<HTMLElement>('.hold__stage')
    // from 1100px the tools around the sheet lag the camera a little, each by its depth, and
    // settle again by the release (0 at both ends, so the first frame equals the painted pose)
    const half = tl.duration() / 2
    const k = t.CALM ? 0.35 : 1
    root.querySelectorAll<HTMLElement>('[data-depth]').forEach((obj) => {
      const depth = Number(obj.dataset.depth) || 0
      const lag = () => (window.innerWidth >= 1100 ? depth * 0.04 * window.innerHeight * k : 0)
      tl.fromTo(obj, { y: 0 }, { y: lag, ease: 'sine.inOut', duration: half }, 0)
      tl.fromTo(obj, { y: lag }, { y: 0, ease: 'sine.inOut', duration: half, immediateRender: false }, half)
    })
    // below 1100px the laptop, the cassette and the loupe lie in the table the overview shows; as
    // the camera lands they leave the frame (the two under the sheet through the bottom edge, the
    // loupe through the top), so the landed stage holds the sheet alone and no corner of them is
    // left at the release. yPercent, because the lag above owns y; the distance is measured on
    // every refresh, from where the object lies at scale 1 to just past the stage's edge.
    const exitAt = tl.duration() * 0.35
    const leave = (sel: string, dir: 1 | -1) => {
      const el = root.querySelector<HTMLElement>(sel)
      if (!el || !stage) return
      const pct = () => {
        if (window.innerWidth >= 1100) return 0
        const top = model.offsetTop + el.offsetTop
        const h = el.offsetHeight || 1
        return ((dir > 0 ? stage.clientHeight - top + 24 : -(top + h + 24)) / h) * 100
      }
      tl.fromTo(el, { yPercent: 0 }, { yPercent: pct, ease: 'power1.in', duration: tl.duration() - exitAt, immediateRender: false }, exitAt)
    }
    leave('.shot-desk__laptop', 1)
    leave('.shot-desk__cassette', 1)
    leave('.shot-desk__loupe', -1)
    // the hero sheet never lands (it starts in the overview); it tips away late, once its bottom
    // has passed the top 18% (rule 3). It sits in the stuck stage, whose document position a
    // trigger on the sheet would misread, so the trigger is the hold's bottom: after the release
    // the sheet's bottom is the hold's bottom minus the table below the sheet in the stage.
    if (stage) {
      const below = () => stage.clientHeight - (model.offsetTop + sheet.offsetTop + sheet.offsetHeight)
      const tilt = t.CALM ? 6 : 22
      t.gsap.fromTo(sheet,
        { rotateX: 0, scale: 1, transformPerspective: DEPTH, transformOrigin: '50% 100%' },
        { rotateX: -tilt * 0.6, scale: 0.94, transformOrigin: '50% 100%', immediateRender: false, ease: 'none',
          scrollTrigger: {
            trigger: hold, scrub: true, invalidateOnRefresh: true, onToggle: scrubbing(sheet),
            start: () => 'bottom ' + Math.round(window.innerHeight * 0.18 + below()) + 'px',
            end: () => 'bottom ' + Math.round(below()) + 'px',
          } })
    }
    return () => { diving.current = false }
  }, [policy.short, policy.textScaled])

  return (
    <section
      ref={ref}
      id="hero"
      className="shot-hero"
      data-chapter="hero"
      data-dossier="W19 W20 W09"
      aria-labelledby="hero-title"
    >
      <div ref={holdRef} className="hold" data-hold="dive">
        <div className="hold__stage shot-hero__stage">
          {/* the camera layer: the only transform of the dive */}
          <div className="shot-hero__model">
            {/* art zones on each object, not on the layer: the layer's box is the whole model. The
                two sheets under the hero sheet are paper under paper, no zone. */}
            <div className="shot-desk" aria-hidden="true">
              <i className="shot-desk__sheet shot-desk__sheet--a" />
              <i className="shot-desk__sheet shot-desk__sheet--b" />
              <span className="shot-desk__obj shot-desk__laptop" data-zone="art" data-depth="0.4">
                <Laptop className="shot-lap shot-lap--closed" back={<Logo variant="mark" decorative />} />
              </span>
              <span className="shot-desk__obj shot-desk__loupe" data-zone="art" data-depth="0.8"><Thing kind="loupe" /></span>
              <span className="shot-desk__obj shot-desk__cassette" data-zone="art" data-depth="0.6"><Thing kind="cassette" /></span>
              {DESK_OBJECTS.map((o) => (
                <span key={o.kind} className={`shot-desk__obj shot-desk__wide shot-desk__${o.kind}`} data-zone="art" data-depth={o.depth}>
                  <Thing kind={o.kind} />
                </span>
              ))}
            </div>
            <article className="shot-sheet shot-hero__sheet">
              <div className="shot-hero__lens" data-zone="art">
                <Lens engine={engine} range={range} startOnInteraction filmSizes={FILM_SIZES} src={LENS_SRC} />
              </div>
              <div className="shot-hero__copy">
                {/* One block, two lines through <br>: the H1 is then ONE text candidate for LCP (its two
                    lines together, about 33k px² at 390). As two block spans each line was its own
                    candidate (22k) and the lens poster (25k) won the LCP (measured on the build). */}
                <h1 id="hero-title" className="shot-hero__title" data-zone="text">
                  {HERO.line1}<br />{HERO.line2}
                </h1>
                <p className="shot-hero__sub" data-zone="text">{HERO.sub}</p>
                <div className="shot-hero__ctas" data-dock-hide="">
                  <LookButton href="#contact" block zone="text" onClick={() => track('cta_click', { placement: 'hero_contact' })}>
                    {HERO.cta}
                  </LookButton>
                  <a className="shot-link" href="#services" data-zone="text" onClick={() => track('cta_click', { placement: 'hero_services' })}>
                    {HERO.secondary}
                  </a>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}
