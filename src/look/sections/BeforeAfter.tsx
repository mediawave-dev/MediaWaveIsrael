// Before / after in the looks (step 3). One move: the slider is revealed by a clip that opens
// from the right (the reading side) while the frame settles from a slight zoom; then it is the
// visitor's to drag. clip-path + transform, once. In KM it is on the stage, between the
// flight and the launch, the free stretch that keeps the two holds apart.
//
// HONESTY: the images are a self-made demo (an outdated mock vs. this site), labelled so.

import { useScene } from '../../motion/ScrollEngineProvider'
import { BeforeAfterSlider } from '../../components/ui/BeforeAfterSlider'
import './before-after.css'

export default function BeforeAfter() {
  const ref = useScene<HTMLElement>((e, root) => {
    if (e.REDUCE) return
    const frame = root.querySelector<HTMLElement>('.ba__frame')!
    const inner = root.querySelector<HTMLElement>('.ba__inner')!
    const d = e.CALM ? 0.5 : 0.95
    const tl = e.gsap.timeline({ paused: true })
      .fromTo(frame, { clipPath: 'inset(0% 0% 0% 100% round 14px)' }, { clipPath: 'inset(0% 0% 0% 0% round 14px)', duration: d, ease: 'power3.inOut' })
      .fromTo(inner, { scale: e.CALM ? 1 : 1.06 }, { scale: 1, duration: d + 0.3, ease: 'power3.out' }, 0)
    tl.progress(0)
    e.ScrollTrigger.create({ trigger: frame, start: 'top 78%', once: true, onEnter: () => tl.play() })
  })
  return (
    <section ref={ref} id="before-after" className="ba" aria-labelledby="ba-title" data-theme="dark">
      <div className="ba__in">
        <h2 id="ba-title" data-zone="text">לפני ואחרי</h2>{/* [קופי: נתי] */}
        <p className="ba__lead" data-zone="text">גררו את הידית וראו איך מרגישה קפיצת דור באתר</p>{/* [קופי: נתי] */}
        <div className="ba__frame" data-zone="art">
          <div className="ba__inner">
            <BeforeAfterSlider beforeSrc="/images/demo-before.webp" afterSrc="/images/demo-after.webp" />
          </div>
        </div>
        <p className="ba__note" data-zone="text">הדגמה להמחשה בלבד, לא אתר של לקוח</p>
      </div>
    </section>
  )
}
