// The giant word before the form ("מתחילים?" [קופי: נתי]), in the looks (step 3). One move:
// the outlined word fills with ink from the right as it crosses the screen (scrubbed: a clip
// on the filled copy, one owner). Decorative; the real CTA is the form below it.
// The shot (SPEC S7) moves the fill's start and end (`start`, `end`, `endTrigger`: the fill ends
// when the contact card reaches the dock line); without them the scrub is the looks' own.
import { useScene } from '../../motion/ScrollEngineProvider'
import './bigword.css'

type Pos = string | (() => string)

interface BigWordProps {
  word?: string
  /** where the fill starts (default 'top 85%' of the word) */
  start?: Pos
  /** where the fill ends (default 'bottom 45%' of the word, or of `endTrigger`) */
  end?: Pos
  /** the element (or selector) the end is measured on (default: the word) */
  endTrigger?: string | Element
}

export default function BigWord({ word = 'מתחילים?', start = 'top 85%', end = 'bottom 45%', endTrigger }: BigWordProps) {
  const ref = useScene<HTMLDivElement>((e, root) => {
    if (e.REDUCE) return
    const fill = root.querySelector<HTMLElement>('.bw__fill')!
    // a selector is resolved in the document: inside the scene, gsap would scope it to the word
    const until = typeof endTrigger === 'string' ? document.querySelector(endTrigger) : endTrigger
    e.gsap.fromTo(fill, { clipPath: 'inset(0% 0% 0% 100%)' }, {
      clipPath: 'inset(0% 0% 0% 0%)', ease: 'none',
      scrollTrigger: { trigger: root, start, end, ...(until ? { endTrigger: until } : {}), scrub: e.CALM ? true : 0.4 },
    })
  }, [start, end, endTrigger])
  return (
    <div ref={ref} className="bw" aria-hidden="true" data-theme="dark">
      <span className="bw__line">{word}</span>
      <span className="bw__line bw__fill">{word}</span>
    </div>
  )
}
