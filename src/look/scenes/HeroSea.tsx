// KM · the opener (DECISIONS #62): MediaWave taken literally. The launch film is the water and
// the Horizon mark's wave line is its surface: "העסק שלכם" stands in the night above it, the
// work goes on below it. On the first visit the horizon is drawn from the right and the film
// pours in behind a crest (Sea); then the visitor can touch the water. The H1 is real text,
// the LCP, never hidden or faded in; the film fills the whole hero, so Chrome treats it as a
// background and never takes it for the LCP. One scrubbed move: as the hero scrolls away the
// water rises over it, the night lifts and the film fills the stage (one transform).

import { LookButton } from '@look/button'
import { useMotionEngine, useScene } from '../../motion/ScrollEngineProvider'
import { track } from '../../utils/analytics'
import { HERO } from '../data'
import { HeroMedia } from '../parts/HeroMedia'
import { Sea } from '../parts/Sea'
import './hero-sea.css'

export default function HeroSea() {
  const engine = useMotionEngine()
  const ref = useScene<HTMLElement>((e, root) => {
    if (e.REDUCE) return
    const lid = root.querySelector<HTMLElement>('.ks__lid')!
    const band = root.querySelector<HTMLElement>('.ks__band')!
    // the night lifts until the surface (and its highest crest) is above the hero
    e.gsap.fromTo(lid, { y: 0 }, {
      y: () => { const sea = band.offsetHeight / 1.9; return -(root.offsetHeight - sea + sea * 0.8) },
      ease: 'power1.in',
      scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: e.CALM ? true : 0.3, invalidateOnRefresh: true },
    })
  })

  return (
    <section ref={ref} id="hero" className="ks" aria-label="ראשי" data-theme="dark">
      <div className="ks__film" aria-hidden="true">
        <HeroMedia sizes="100vw" />
      </div>
      <Sea engine={engine} />
      <h1 className="ks__title" data-zone="text">
        <span>{HERO.line1}</span>
        <span>{HERO.line2}</span>
      </h1>
      <p className="ks__sub" data-zone="text">{HERO.sub}</p>
      <div className="ks__ctas">
        <LookButton href="#contact" zone="text" onClick={() => track('cta_click', { placement: 'hero_contact' })}>
          {HERO.cta}
        </LookButton>
        <a href="#services" className="ks__more" data-zone="text" onClick={() => track('cta_click', { placement: 'hero_services' })}>
          {HERO.secondary}
        </a>
      </div>
    </section>
  )
}
