// KM · the opener (DECISIONS #64): a camera lens under the H1. "העסק שלכם / המומחיות שלנו", and
// below it the launch film seen through a lens whose Klein-blue iris opens on the first visit
// (Lens). MediaWave is media; the lens is the expertise that brings your business into focus,
// and its circle is the Horizon mark's disc. The H1 is the LCP: never hidden, never faded in.
// One scrubbed move: as the hero scrolls away the lens comes toward you (one transform) while
// its iris opens all the way.

import { LookButton } from '@look/button'
import { useMotionEngine, useScene } from '../../motion/ScrollEngineProvider'
import { track } from '../../utils/analytics'
import { HERO } from '../data'
import { Lens } from '../parts/Lens'
import './hero-lens.css'

export default function HeroLens() {
  const engine = useMotionEngine()
  const ref = useScene<HTMLElement>((e, root) => {
    if (e.REDUCE) return
    const lens = root.querySelector<HTMLElement>('.kl__lens')!
    const phone = window.matchMedia('(max-width: 860px)').matches
    e.gsap.fromTo(lens, { scale: 1 }, {
      scale: e.CALM ? 1.06 : phone ? 1.16 : 1.32,
      ease: 'none',
      scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: e.CALM ? true : 0.4 },
    })
  })

  return (
    <section ref={ref} id="hero" className="kl" aria-label="ראשי" data-theme="dark">
      <h1 className="kl__title" data-zone="text">
        <span>{HERO.line1}</span>
        <span>{HERO.line2}</span>
      </h1>
      <p className="kl__sub" data-zone="text">{HERO.sub}</p>
      <div className="kl__ctas">
        <LookButton href="#contact" zone="text" onClick={() => track('cta_click', { placement: 'hero_contact' })}>
          {HERO.cta}
        </LookButton>
        <a href="#services" className="kl__more" data-zone="text" onClick={() => track('cta_click', { placement: 'hero_services' })}>
          {HERO.secondary}
        </a>
      </div>
      <Lens engine={engine} />
    </section>
  )
}
