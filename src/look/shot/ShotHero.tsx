// shot · S1 the hero, the dive (SPEC S1, storyboard "hero", DECISIONS #83, D118, D119). The camera
// starts over the desk: the paper of the site lies there in an overview, the closed laptop resting on
// the hero sheet's top edge (its lid shows the Horizon mark), the loupe and the cassette at the
// table's edges. Scrolling lowers the camera onto the sheet (camera.ts dive, about the H1's own line,
// never on Z) and opens the lid, geared to the same scrub (Mr. Pandas' bike: one eased number, a
// fixed ratio), so the hero film plays on the screen as the camera lands. After the release the
// sheet only tips away once its bottom has passed the top 18% (rule 3).
//
// The H1 is the LCP and paints at first paint. index.html paints the overview pose before the
// app boots (html.shot-dive / shot-dive-calm, shot-hero.css) from the numbers GSAP starts from,
// so nothing jumps; the scene removes both classes on every path, REDUCE included.
// REDUCE, the prerender and no JS: a flat sheet, no hold, no desk props, the laptop open.
// Short stages (under 560px) and a scaled text size: no hold, only the late exit tilt.
import { LookButton } from '@look/button'
import { useScene } from '../../motion/ScrollEngineProvider'
import { Laptop } from '../parts/Laptop'
import { HeroMedia } from '../parts/HeroMedia'
import { Thing, type Kind } from '../parts/Things'
import Logo from '../../components/ui/Logo'
import { HERO } from '../data'
import { track } from '../../utils/analytics'
import { WHATSAPP_URLS } from '../../utils/whatsapp'
import { DEPTH, dive, land, scrubbing } from './camera'
import { useShotPolicy } from './policy'
import { DeskFace } from './Faces'
import './shot-hero.css'

/** The screen is about 76% of the laptop, which is 1.3 lens boxes wide (shot-hero.css). */
const SCREEN_SIZES = '(max-width: 767px) 80vw, 480px'
/** Where the lid opens inside the dive: from 8% of the hold, over 70% of it (the film is on by the landing). */
const LID_AT = 0.08
const LID_SPAN = 0.7

/** The tools around the sheet from 1100px, each lagging the camera by its depth (0.4-1). */
const DESK_OBJECTS: { kind: Kind; depth: number }[] = [
  { kind: 'phone', depth: 0.7 },
  { kind: 'bubble', depth: 0.5 },
  { kind: 'frame', depth: 0.9 },
]

export default function ShotHero() {
  const policy = useShotPolicy()

  const ref = useScene<HTMLElement>((t, root) => {
    const html = document.documentElement
    const clearPose = () => html.classList.remove('shot-dive', 'shot-dive-calm')
    const hold = root.querySelector<HTMLElement>('.hold')
    const model = root.querySelector<HTMLElement>('.shot-hero__model')
    const sheet = root.querySelector<HTMLElement>('.shot-hero__sheet')
    if (t.REDUCE || !hold || !model || !sheet) {
      clearPose()
      return
    }
    if (policy.short || policy.textScaled) {
      clearPose()
      land(t, sheet, { enter: false })
      return
    }

    const tl = dive(t, { hold, layer: model, id: 'dive' })
    // the lid, geared to the dive's scrub: shut (-86deg, the pre-paint pose) to open (-6deg)
    const lid = root.querySelector<HTMLElement>('.shot-hero__laptop .lap__lid')
    if (lid) {
      const d = tl.duration()
      tl.fromTo(lid, { rotateX: -86 }, { rotateX: -6, ease: 'power2.inOut', duration: d * LID_SPAN, immediateRender: true }, d * LID_AT)
    }
    const stage = hold.querySelector<HTMLElement>('.hold__stage')
    // the black band ends with the stage, 120px (390) to 170px (1440) under the landed paper stack
    // (review round 2, N4): the next chapter's cream comes up to 40px under the stack
    // (--hero-slack, shot-base.css). Only while the dive runs: the hold keeps the next chapter far
    // below the first view, so moving it never shifts what is on screen.
    const slack = () => {
      if (!stage) return
      const below = stage.clientHeight - (model.offsetTop + sheet.offsetTop + sheet.offsetHeight) - 16
      html.style.setProperty('--hero-slack', `${Math.max(0, Math.round(below))}px`)
    }
    slack()
    window.addEventListener('resize', slack)
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
        const top = model.offsetTop + el.offsetTop
        const h = el.offsetHeight || 1
        return ((dir > 0 ? stage.clientHeight - top + 24 : -(top + h + 24)) / h) * 100
      }
      tl.fromTo(el, { yPercent: 0 }, { yPercent: pct, ease: 'power1.in', duration: tl.duration() - exitAt, immediateRender: false }, exitAt)
    }
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
    return () => {
      window.removeEventListener('resize', slack)
      html.style.removeProperty('--hero-slack')
    }
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
      <div className="hold" data-hold="dive">
        <div className="hold__stage shot-hero__stage">
          {/* the camera layer: the only transform of the dive */}
          <div className="shot-hero__model">
            {/* art zones on each object, not on the layer: the layer's box is the whole model. The
                two sheets under the hero sheet are paper under paper, no zone. */}
            <div className="shot-desk" aria-hidden="true">
              <i className="shot-desk__sheet shot-desk__sheet--a" />
              <i className="shot-desk__sheet shot-desk__sheet--b" />
              <span className="shot-desk__obj shot-desk__loupe" data-zone="art" data-depth="0.8"><Thing kind="loupe"><DeskFace kind="loupe" /></Thing></span>
              <span className="shot-desk__obj shot-desk__cassette" data-zone="art" data-depth="0.6"><Thing kind="cassette"><DeskFace kind="cassette" /></Thing></span>
              {DESK_OBJECTS.map((o) => (
                <span key={o.kind} className={`shot-desk__obj shot-desk__wide shot-desk__${o.kind}`} data-zone="art" data-depth={o.depth}>
                  <Thing kind={o.kind}><DeskFace kind={o.kind} /></Thing>
                </span>
              ))}
            </div>
            <article className="shot-sheet shot-hero__sheet">
              <div className="shot-hero__lap" data-zone="art">
                <Laptop className="shot-lap shot-hero__laptop" back={<Logo variant="mark" decorative />}>
                  <HeroMedia sizes={SCREEN_SIZES} />
                </Laptop>
              </div>
              <div className="shot-hero__copy">
                {/* One block, two lines through <br>: the H1 is then ONE text candidate for LCP (its two
                    lines together, about 33k px² at 390). As two block spans each line was its own
                    candidate (22k) and the lens poster (25k) won the LCP (measured on the build). The laptop's
                    poster is fetchpriority low and hidden behind the shut lid at first paint. */}
                <h1 id="hero-title" className="shot-hero__title" data-zone="text">
                  {HERO.line1}{' '}<br />{HERO.line2}
                </h1>
                <p className="shot-hero__sub" data-zone="text">{HERO.sub}</p>
                <div className="shot-hero__ctas" data-dock-hide="">
                  <LookButton href={WHATSAPP_URLS.general} target="_blank" rel="noopener noreferrer" block zone="text" onClick={() => track('whatsapp_click', { placement: 'hero' })}>
                    {HERO.cta}
                  </LookButton>
                  <span className="shot-hero__links">
                    <a className="shot-link" href="#contact" data-zone="text" onClick={() => track('cta_click', { placement: 'hero_contact' })}>
                      {HERO.contact}
                    </a>
                    <a className="shot-link" href="#services" data-zone="text" onClick={() => track('cta_click', { placement: 'hero_services' })}>
                      {HERO.secondary}
                    </a>
                  </span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}
