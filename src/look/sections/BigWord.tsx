// The giant word before the form ("מתחילים?" [קופי: נתי]), in the looks (step 3). One move:
// the outlined word fills with ink from the right as it crosses the screen (scrubbed: a clip
// on the filled copy, one owner). Decorative; the real CTA is the form below it.
import { useScene } from '../../motion/ScrollEngineProvider'
import './bigword.css'

export default function BigWord({ word = 'מתחילים?' }: { word?: string }) {
  const ref = useScene<HTMLDivElement>((e, root) => {
    if (e.REDUCE) return
    const fill = root.querySelector<HTMLElement>('.bw__fill')!
    e.gsap.fromTo(fill, { clipPath: 'inset(0% 0% 0% 100%)' }, {
      clipPath: 'inset(0% 0% 0% 0%)', ease: 'none',
      scrollTrigger: { trigger: root, start: 'top 85%', end: 'bottom 45%', scrub: e.CALM ? true : 0.4 },
    })
  })
  return (
    <div ref={ref} className="bw" aria-hidden="true" data-theme="dark">
      <span className="bw__line">{word}</span>
      <span className="bw__line bw__fill">{word}</span>
    </div>
  )
}
