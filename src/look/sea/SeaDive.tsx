// sea · the dive and the emptied stage (S3, S4). The dive holds the screen between the Websites chapter and the
// film: the scroll falls into one dot of the laptop, and that dot's disc becomes the film chapter (optical/dive.ts).
// It lies over the two chapters beside it (sea-dive.css), so it starts on the laptop as it stands and ends on the
// film as it opens, with no cut. After the film everything has left, and one sentence stands alone on the ground,
// and under it a pen signs it: the ink film draws the logo (SeaSign, D232).
// Neither adds a data-chapter: the header's icons keep to the chapters they know. Still, calm or no WebGL: no held
// dive, the film chapter simply follows; the sentence is a plain line of the page. [קופי: נתי] the sentence.
import { useEffect, useRef, useState } from 'react'
import * as field from './field'
import { opt } from './lab'
import { CLIPS, posterOf } from './media'
import SeaSign from './SeaSign'
import './sea-dive.css'

export default function SeaDive() {
  const root = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const [off, setOff] = useState(false)

  useEffect(() => {
    const el = root.current
    if (!el) return
    // still: without html.sea-held the stylesheet has left it out already
    const tier = field.tier()
    if (tier === 'still') return
    if (tier !== 'full' || opt('bleed') !== 'veil' || opt('film') === 'off') { setOff(true); return }
    let alive = true
    let idle = 0
    let dispose: (() => void) | null = null
    // the held screen leaves the page: what the reader has passed of it comes off the scroll (where the browser's own
    // scroll anchoring has not done it already), and the chapters below measure themselves again
    const fallBack = () => {
      dispose?.()
      dispose = null
      if (!alive) return
      const after = el.nextElementSibling
      const was = after?.getBoundingClientRect().top ?? 0
      const gone = Math.max(0, -el.getBoundingClientRect().top)
      el.classList.add('is-off')
      setOff(true)
      const rose = was - (after?.getBoundingClientRect().top ?? 0)
      if (gone > 0 && rose > 0) window.scrollBy(0, -Math.min(gone, rose))
      window.dispatchEvent(new Event('resize'))
    }
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const start = () => {
        void Promise.all([import('./optical/dive'), field.ready]).then(async ([m, ok]) => {
          const film = document.querySelector<HTMLElement>('main [data-chapter="film"]')
          const lap = document.querySelector<HTMLElement>('main .sea-lap__stage')
          const spot = document.querySelector<HTMLElement>('main [data-spot="laptop"]')
          if (!alive || !stage.current || !canvas.current) return
          if (!ok || !film || !lap || !spot) { fallBack(); return }
          const phone = !window.matchMedia('(min-width: 768px)').matches
          const done = await m.mountDive(el, stage.current, canvas.current, { poster: posterOf(CLIPS['film-veil'], phone), film, lap, spot, onLost: fallBack })
          if (!done) { fallBack(); return }
          if (alive) dispose = done
          else done()
        }).catch(fallBack)
      }
      // the compile waits for an idle moment, so it never lands in the middle of a scroll
      if (typeof window.requestIdleCallback === 'function') idle = window.requestIdleCallback(start, { timeout: 600 })
      else idle = window.setTimeout(start, 200)
    }, { rootMargin: '220% 0px' })
    io.observe(el)
    return () => {
      alive = false
      io.disconnect()
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle)
      window.clearTimeout(idle)
      dispose?.()
    }
  }, [])

  return (
    <div ref={root} className={`sea-dive${off ? ' is-off' : ''}`} aria-hidden="true">
      <div ref={stage} className="sea-dive__stage"><canvas ref={canvas} /></div>
    </div>
  )
}

/** The sentence, alone, and the signature under it: they arrive once the screen has emptied (the top of the screen
    has passed the mark). */
export function SeaEmpty() {
  const mark = useRef<HTMLSpanElement>(null)
  const [on, setOn] = useState(false)

  useEffect(() => {
    const el = mark.current
    if (!el || field.tier() === 'still') return
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin: '0px 0px -99% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div className={`sea-empty${on ? ' is-on' : ''}`}>
      <span ref={mark} className="sea-empty__mark" aria-hidden="true" />
      <div className="sea-empty__stage">
        {/* [קופי: נתי] the Websites heading once more, word for word, so a screen reader hears it once */}
        <p className="sea-empty__say" data-zone="text" aria-hidden="true"><span>אתר שנבנה בשבילכם,</span>{' '}<strong>ונשאר שלכם.</strong></p>
        <SeaSign on={on} />
      </div>
    </div>
  )
}
