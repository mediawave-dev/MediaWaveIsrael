// M · the hero in the void: the copy at the start side (it reads first in RTL), and beside
// it the hero video on a floating screen among the tools of the trade. The objects bob
// (CSS `translate` on each object, paused off screen and under the OS flag) and drift by
// depth as the hero scrolls away (GSAP owns each float's `transform`). The H1 is the LCP:
// never hidden, never faded in.

import { LookButton } from '@look/button'
import { useScene } from '../../motion/ScrollEngineProvider'
import { track } from '../../utils/analytics'
import { HERO } from '../data'
import { HeroMedia } from '../parts/HeroMedia'
import { Thing, type Kind } from '../parts/Things'
import './hero-void.css'

/** The tools around the screen; depth sets the drift (far objects lag more). */
const FLOATS: { kind: Kind; depth: number }[] = [
  { kind: 'bubble', depth: 0.5 },
  { kind: 'phone', depth: 0.9 },
  { kind: 'loupe', depth: 0.7 },
  { kind: 'cassette', depth: 1 },
  { kind: 'laptop', depth: 0.4 },
  { kind: 'frame', depth: 0.6 },
]

export default function HeroVoid() {
  const ref = useScene<HTMLElement>((e, root) => {
    if (e.REDUCE) return
    const floats = [...root.querySelectorAll<HTMLElement>('[data-depth]')]
    const travel = e.CALM ? 0.35 : 1
    floats.forEach((el) => {
      const d = Number(el.dataset.depth)
      e.gsap.fromTo(el, { y: 0 }, {
        y: () => d * travel * window.innerHeight * 0.14,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: e.CALM ? true : 0.5, invalidateOnRefresh: true },
      })
    })
    // the bob runs only while the hero is on screen
    const io = new IntersectionObserver(([entry]) => root.classList.toggle('mh--off', !entry.isIntersecting))
    io.observe(root)
    return () => io.disconnect()
  })

  return (
    <section ref={ref} id="hero" className="mh" aria-label="ראשי">
      <div className="mh__copy">
        <h1 className="mh__title" data-zone="text">
          <span>{HERO.line1}</span>
          <span>{HERO.line2}</span>
        </h1>
        <p className="mh__sub" data-zone="text">{HERO.sub}</p>
        <div className="mh__ctas">
          <LookButton href="#contact" zone="text" onClick={() => track('cta_click', { placement: 'hero_contact' })}>
            {HERO.cta}
          </LookButton>
          <a href="#services" className="mh__more" data-zone="text" onClick={() => track('cta_click', { placement: 'hero_services' })}>
            {HERO.secondary}
          </a>
        </div>
      </div>
      <div className="mh__void" aria-hidden="true">
        <span className="mh__float mh__float--screen" data-depth="0.2" data-zone="art">
          <span className="mh__screen"><HeroMedia /></span>
        </span>
        {FLOATS.map((f) => (
          <span key={f.kind} className={`mh__float mh__float--${f.kind}`} data-depth={f.depth} data-zone="art">
            <Thing kind={f.kind} />
          </span>
        ))}
      </div>
    </section>
  )
}
