// shot · S4 build, the laptop hold (SPEC S4, storyboard "build", the page's peak). Nati's laptop
// lands on the table closed, seen from above, opens, and this very site builds itself on its
// screen as the visitor scrolls (HeroBuild in scrub mode, Rive): a browser window rises, the
// blocks arrive from the right as a wireframe and are painted, a cursor clicks the button and the
// hero's lens appears in the slot (the poster still, never a second video), a message arrives.
// The camera turns a little around the laptop and comes back frontal; then an ink line leaves
// the base's inline-start corner and runs down to the stage's bottom, where S5 (the steps,
// ShotProcess) picks it up. The stage holds art only: no text ever moves in it (rule 4).
//
// One hold timeline of length 1 (id 'build', so ?at=build:0.3 lands mid-scene):
//   0    - 0.30  openLaptop: the laptop from 55deg to frontal, the lid from -86deg to -6deg
//   0.30 - 0.92  the build, 0 → 1 (HeroBuild.setProgress), derived from the timeline on every render
//   0.31 - 0.34  the opening frame (the Horizon mark on the white screen) gives way to the window
//   0    - 1     orbit: rotateY 0 → amp → 0 (4deg below 1100px, 8deg above; none under CALM)
//   0.90 - 1     the ink line's stub draws down
// Scrolling back runs it all backwards (the site unbuilds): nothing is played once or remembered.
// CALM: the laptop lands from 20deg, no orbit, the build still follows the scroll. REDUCE (and no
// JS, prerender): no hold, the laptop open and frontal with the finished site, the stub drawn.
import { useRef } from 'react'
import { useMotionEngine } from '../../motion/ScrollEngineProvider'
import { useSceneNear } from './near'
import { Laptop } from '../parts/Laptop'
import { HeroBuild, type HeroBuildHandle } from '../parts/HeroBuild'
import Logo from '../../components/ui/Logo'
import heroShotRiv from '../parts/hero-shot.riv?url'
import heroBuiltShotSvg from '../parts/hero-built-shot.svg?raw'
import { openLaptop, orbit } from './moves'
import ShotProcess from './ShotProcess'
import './shot-build.css'

/** module-level, so HeroBuild's effect never restarts on a re-render */
const BUILD_SRC = { riv: heroShotRiv, built: heroBuiltShotSvg }
const POSTER = '/images/lens-m-poster.webp'

/** the beats, as fractions of the hold */
const OPEN_SPAN = 0.3
const BUILD_AT = 0.3
const BUILD_SPAN = 0.62
const MARK_OUT = 0.31
const STUB_AT = 0.9

export default function ShotBuild() {
  const engine = useMotionEngine()
  const build = useRef<HeroBuildHandle>(null)

  const ref = useSceneNear<HTMLElement>((t, root) => {
    const setBuild = (p: number) => build.current?.setProgress(p)
    if (t.REDUCE) { setBuild(1); return }
    const hold = root.querySelector<HTMLElement>('.shot-build__hold')
    const cam = root.querySelector<HTMLElement>('.shot-build__cam')
    const lap = root.querySelector<HTMLElement>('.shot-build__lap')
    const lid = lap?.querySelector<HTMLElement>('.lap__lid')
    const mark = root.querySelector<HTMLElement>('.shot-lap__opening')
    const stub = root.querySelector<HTMLElement>('.shot-line--stub .shot-line__fill')
    if (!hold || !cam || !lap || !lid || !mark || !stub) return

    // will-change only while the hold scrubs (SPEC 1.4): the camera, the laptop and its lid
    const layers = [cam, lap, lid]
    const toggle = (on: boolean) => { for (const el of layers) el.classList.toggle('is-scrubbing', on) }
    // The build's progress is the timeline's own (scrubbed) time, so it lags the scroll exactly like
    // the lid and the camera do. It is read on every render of the timeline, and also on the
    // trigger's refresh and update: a refresh (a deep link, ?at=, a resize) moves the timeline with
    // its events suppressed, so its own onUpdate alone could leave the screen a step behind.
    let tl: gsap.core.Timeline | null = null // the trigger may refresh inside holdTimeline, before tl is set
    const sync = () => { if (tl) setBuild((tl.time() - BUILD_AT) / BUILD_SPAN) }
    tl = t.holdTimeline(hold, {
      id: 'build', scrub: t.CALM ? true : 0.6,
      onToggle: (self) => toggle(self.isActive), onRefresh: sync, onUpdate: sync,
    })
    // The camera looks down on the closed laptop: its top tilted toward the viewer (negative X), so
    // the folded lid shows its ink back. (+55 is a camera below the table: the folded lid would
    // show its screen.) CALM lands from -20, the helper's CALM angle on this side.
    // turned a little on the table while closed (a 3/4 view reads as a laptop, not a slab), square
    // to the camera once open
    openLaptop(tl, lap, lid, { from: t.CALM ? -20 : -55, fromZ: t.CALM ? 0 : -9, at: 0, span: OPEN_SPAN })
    tl.fromTo(mark, { opacity: 1 }, { opacity: 0, duration: 0.03 }, MARK_OUT)
    orbit(tl, cam, window.innerWidth >= 1100 ? 8 : 4, t.CALM)
    tl.fromTo(stub, { scaleY: 0, transformOrigin: '50% 0%' }, { scaleY: 1, transformOrigin: '50% 0%', duration: 1 - STUB_AT }, STUB_AT)
    tl.eventCallback('onUpdate', sync)
    sync()
    return () => { toggle(false); setBuild(1) }
  })

  return (
    <section ref={ref} id="process" className="shot-build" data-chapter="build" data-dossier="W01 W12 W19 W21" data-intent="interest" aria-labelledby="how-we-work-title">
      <div className="hold shot-build__hold" data-hold="build">
        <div className="hold__stage shot-build__stage">
          {/* the scene's one caption: static (never moved by the camera), above the laptop, in the DOM
              for every reader; the five held screens no longer carry nothing to read (walkthrough) */}
          <p className="shot-build__cap" data-zone="text">על המסך נבנה האתר הזה. כשבונים את שלכם, מקבלים קישור ורואים אותו נבנה בטלפון.</p>
          <div className="shot-build__cam" aria-hidden="true" data-zone="art">
            <Laptop className="shot-lap shot-build__lap" back={<Logo variant="mark" decorative />}>
              <span className="shot-lap__opening"><Logo variant="mark" decorative /></span>
              <HeroBuild ref={build} engine={engine} mode="scrub" src={BUILD_SRC} poster={POSTER} />
            </Laptop>
          </div>
          <i className="shot-line shot-line--stub" aria-hidden="true" data-zone="art"><i className="shot-line__fill" /></i>
        </div>
      </div>
      <ShotProcess />
    </section>
  )
}
