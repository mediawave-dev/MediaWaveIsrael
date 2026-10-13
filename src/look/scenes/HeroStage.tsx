// K and KM · the hero is a stage (centred because a stage has a centre): the H1, the line,
// the button, and under them the product, a laptop playing the hero video. The H1 is the
// LCP element: never hidden, never faded in. One scrubbed move: as the stage scrolls away
// the laptop leans toward you (one transform on one wrapper).

import { LookButton } from '@look/button'
import { useScene } from '../../motion/ScrollEngineProvider'
import { track } from '../../utils/analytics'
import { HERO } from '../data'
import { Laptop } from '../parts/Laptop'
import { HeroMedia } from '../parts/HeroMedia'
import './hero-stage.css'

export default function HeroStage() {
  const ref = useScene<HTMLElement>((e, root) => {
    if (e.REDUCE) return
    const tilt = root.querySelector<HTMLElement>('.kh__tilt')!
    e.gsap.fromTo(tilt, { rotationX: 12 }, {
      rotationX: e.CALM ? 7 : 0,
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
        <div className="kh__tilt">
          <Laptop><HeroMedia /></Laptop>
        </div>
      </div>
    </section>
  )
}
