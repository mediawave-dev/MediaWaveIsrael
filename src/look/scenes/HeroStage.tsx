// K and KM · the hero is a stage (centred because a stage has a centre): the H1, the line,
// the button, and under them the stage's big screen (DECISIONS #60; the hero video used to
// play inside a drawn laptop, which made laptops inside a laptop): a website builds itself on
// it and, when its button is clicked, the launch film starts in its hero (HeroBuild). The H1
// is never hidden or faded in. One scrubbed move: as the stage scrolls away the screen comes
// toward you, a camera moving in (one transform, one element).

import { LookButton } from '@look/button'
import { useMotionEngine, useScene } from '../../motion/ScrollEngineProvider'
import { track } from '../../utils/analytics'
import { HERO } from '../data'
import { HeroBuild } from '../parts/HeroBuild'
import './hero-stage.css'

export default function HeroStage() {
  const engine = useMotionEngine()
  const ref = useScene<HTMLElement>((e, root) => {
    if (e.REDUCE) return
    const screen = root.querySelector<HTMLElement>('.kh__screen')!
    const phone = window.matchMedia('(max-width: 860px)').matches
    e.gsap.fromTo(screen, { scale: 1 }, {
      scale: e.CALM ? 1.05 : phone ? 1.1 : 1.22,
      ease: 'none',
      scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: e.CALM ? true : 0.4 },
    })
  })

  return (
    <section ref={ref} id="hero" className="kh" aria-label="ראשי" data-theme="dark">
      <h1 className="kh__title" data-zone="text">
        <span>{HERO.line1}</span>
        <span>{HERO.line2}</span>
      </h1>
      <p className="kh__sub" data-zone="text">{HERO.sub}</p>
      <div className="kh__ctas">
        <LookButton href="#contact" zone="text" onClick={() => track('cta_click', { placement: 'hero_contact' })}>
          {HERO.cta}
        </LookButton>
        <a href="#services" className="kh__more" data-zone="text" onClick={() => track('cta_click', { placement: 'hero_services' })}>
          {HERO.secondary}
        </a>
      </div>
      <div className="kh__object" data-zone="art">
        <div className="kh__screen"><HeroBuild engine={engine} /></div>
      </div>
    </section>
  )
}
