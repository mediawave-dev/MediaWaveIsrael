// site-director stage 3 prototype (dev only, /proto): the hero ("narrow the page to 390", D72)
// and one chapter ("measure", the score climbs to the real 96 and the address goes live, D66/D71).
// Direction C "link to live": one ground for the whole page (D67), Noto Sans Hebrew (D68/D69),
// green only for "passed / live" (D66), hard cuts, never crossfades (D75), timecode marks (D76).
// Motion runs on the shared pattern-breaker engine (useScene), never on a separate rAF loop.

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent as RPointerEvent } from 'react'
import { useMotionEngine, useScene } from '../motion/ScrollEngineProvider'
import Logo from '../components/ui/Logo'
import { HERO } from '../look/data'
import { getWhatsAppUrl } from '../utils/whatsapp'
import './proto.css'

const MAX_W = 1440
const MIN_W = 390
// Lighthouse mobile, median of the runs on this site's 13 Oct build (LEDGER "Step 4 checks"); never invented.
// It is MediaWave's own page, so the phone shows mediawave.co.il, never a client's address (critic M1, q11).
const SCORE = 96
const MEASURED = '13.10.2026'
const SITE = 'mediawave.co.il'

/** Timecode for a scroll position: the page is a 25 fps timeline, one viewport = one second (D76). */
function timecode(vp: number) {
  const total = Math.max(0, Math.round(vp * 25))
  const ff = total % 25
  const s = Math.floor(total / 25)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `00:00:${pad(s)}:${pad(ff)}`
}

function Hero() {
  const engine = useMotionEngine()
  const [width, setWidth] = useState(MAX_W)
  const holdRef = useRef<HTMLDivElement>(null)

  const ref = useScene<HTMLElement>((e, root) => {
    const hold = root.querySelector<HTMLElement>('.px-hold')!
    const frame = root.querySelector<HTMLElement>('.px-frame')!
    const title = root.querySelector<HTMLElement>('.px-title')!
    // Phones and reduced motion get the final state: the page at 390 (storyboard, beat 0-1.5).
    if (e.REDUCE || !e.FINE) {
      frame.style.setProperty('--w', `${MIN_W}px`)
      setWidth(MIN_W)
      return
    }
    let last = -1
    const set = (p: number) => {
      // The frame never exceeds what fits beside the margins at 1440 x 700 or 1440 x 900.
      const room = Math.min(MAX_W, root.clientWidth - 48)
      const w = Math.round(room - (room - MIN_W) * p)
      frame.style.setProperty('--w', `${w}px`)
      // The headline's width axis narrows with the page (D68: 100% to 75%), last third only,
      // so the words never change while the reader is still reading them at full width.
      const q = Math.max(0, (p - 0.66) / 0.34)
      title.style.fontStretch = `${(100 - 25 * q).toFixed(1)}%`
      const shown = w
      if (shown !== last) { last = shown; setWidth(shown) }
    }
    const tl = e.holdTimeline(hold, {
      id: 'narrow',
      scrub: e.CALM ? true : 0.5,
      onUpdate: (self) => set(self.progress),
      onRefresh: (self) => set(self.progress),
    })
    tl.to({}, { duration: 1 })
    set(0)
    return () => { frame.style.removeProperty('--w'); title.style.fontStretch = '' }
  })

  // The handle is a slider: dragging or arrow keys move the page scroll, so scroll stays the one
  // source of truth for the width (keyboard and pointer reach the same states as the wheel).
  const toProgress = (w: number) => (MAX_W - w) / (MAX_W - MIN_W)
  const scrollToWidth = (w: number) => {
    const hold = holdRef.current
    if (!hold || !engine) return
    const top = hold.getBoundingClientRect().top + window.scrollY
    const range = hold.offsetHeight - window.innerHeight
    engine.scrollTo(top + range * Math.min(1, Math.max(0, toProgress(w))), { immediate: true })
  }
  const onKey = (ev: KeyboardEvent<HTMLDivElement>) => {
    const step = ev.shiftKey ? 150 : 50
    const map: Record<string, number> = { ArrowLeft: width - step, ArrowRight: width + step, ArrowDown: width - step, ArrowUp: width + step, Home: MAX_W, End: MIN_W }
    if (!(ev.key in map)) return
    ev.preventDefault()
    scrollToWidth(Math.min(MAX_W, Math.max(MIN_W, map[ev.key])))
  }
  const drag = useRef<{ x: number; w: number } | null>(null)
  const onDown = (ev: RPointerEvent<HTMLDivElement>) => {
    drag.current = { x: ev.clientX, w: width }
    ev.currentTarget.setPointerCapture(ev.pointerId)
  }
  const onMove = (ev: RPointerEvent<HTMLDivElement>) => {
    if (!drag.current) return
    // The handle sits on the frame's left edge; the frame is centred, so 1 px of pointer is 2 px of width.
    const w = drag.current.w - (drag.current.x - ev.clientX) * -2
    scrollToWidth(Math.min(MAX_W, Math.max(MIN_W, w)))
  }
  const onUp = () => { drag.current = null }

  return (
    <section ref={ref} className="px-hero" aria-labelledby="px-title" data-chapter="hero" data-dossier="W02 W19">
      <div ref={holdRef} className="px-hold">
        <div className="px-stage">
          <div className="px-ruler" aria-hidden="true">
            <span dir="ltr">{width} × 900</span>
            <span dir="ltr">{timecode(0)}</span>
          </div>
          <div className="px-frame">
            <div className="px-site">
              <div className="px-copy">
                <h1 id="px-title" className="px-title"><span>{HERO.line1}</span><span>{HERO.line2}</span></h1>
                <p className="px-sub">{HERO.sub}</p>
                <div className="px-ctas">
                  <a className="px-btn" href={getWhatsAppUrl('היי, אשמח לשמוע על אתר לעסק שלי')} target="_blank" rel="noopener">{HERO.cta}</a>
                  <a className="px-sec" href="#measure">איך מודדים</a>
                </div>
              </div>
              <div className="px-film">
                <video src="/videos/lens.mp4" poster="/images/lens-poster.webp" muted playsInline loop autoPlay preload="none" aria-hidden="true" />
              </div>
            </div>
            <div
              className="px-handle"
              role="slider"
              tabIndex={0}
              aria-label="רוחב הדף"
              aria-valuemin={MIN_W}
              aria-valuemax={MAX_W}
              aria-valuenow={width}
              aria-valuetext={`${width} פיקסלים`}
              onKeyDown={onKey}
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
            />
          </div>
          {/* [קופי: טיוטה לאישור נתי] */}
          <p className="px-hint" aria-hidden="true">גוללים או גוררים את הקצה: כך כל אתר נבדק ב-390 פיקסלים, רוחב של טלפון</p>
        </div>
      </div>
    </section>
  )
}

function Measure() {
  const [score, setScore] = useState(0)
  const [landed, setLanded] = useState(false)
  const ARC = 251.3 // the arc's length for r = 80 (half circle, pi * r)

  const ref = useScene<HTMLElement>((e, root) => {
    const arc = root.querySelector<SVGPathElement>('.px-arc-fill')!
    const apply = (p: number) => {
      const s = Math.round(SCORE * Math.min(1, p / 0.8))
      arc.style.strokeDashoffset = String(ARC * (1 - s / 100))
      // The arc fills in ink and turns green only on the frame it reaches the real score: no staged
      // red-to-orange phase that never happened (critic M1, q11), and green means passed (D66).
      const done = s >= SCORE
      arc.dataset.pass = done ? 'true' : 'false'
      setScore(s)
      setLanded(done)
    }
    if (e.REDUCE) { apply(1); return }
    e.ScrollTrigger.create({
      trigger: root.querySelector('.px-phone'),
      start: 'top 70%',
      end: 'center 40%',
      scrub: e.CALM ? true : 0.4,
      onUpdate: (self) => apply(self.progress),
      onRefresh: (self) => apply(self.progress),
    })
    apply(0)
  })

  useEffect(() => { document.documentElement.lang = 'he' }, [])

  return (
    <section ref={ref} id="measure" className="px-measure" aria-labelledby="px-measure-title" data-chapter="measure" data-dossier="W05 W06 W23 W12">
      <p className="px-tc" aria-hidden="true" dir="ltr">{timecode(6)}</p>
      <div className="px-measure-grid">
        <div className="px-phone" aria-hidden="true">
          <div className="px-addr" data-live={landed ? 'true' : 'false'}>
            <span dir="ltr">{SITE}</span>
            <i className="px-dot" />
          </div>
          <div className="px-screen">
            <svg className="px-gauge" viewBox="0 0 200 120" role="presentation">
              <path className="px-arc-track" d="M20 110 A80 80 0 0 1 180 110" />
              <path className="px-arc-fill" d="M20 110 A80 80 0 0 1 180 110" style={{ strokeDasharray: ARC, strokeDashoffset: ARC }} />
            </svg>
            <p className="px-score" dir="ltr">{score}</p>
            <p className="px-score-label">ציון מהירות במובייל</p>
            <p className="px-verdict">{landed ? 'עבר' : 'נמדד...'}</p>
          </div>
        </div>
        <div className="px-measure-copy">
          <h2 id="px-measure-title">מודדים לפני שעולים לאוויר</h2>
          {/* [קופי: טיוטה לאישור נתי] */}
          <p>אתר עולה לאוויר רק אחרי שמדדנו אותו בטלפון. כך נמדד העמוד שאתם קוראים עכשיו:</p>
          <dl className="px-readout">
            <dt>ציון מהירות</dt><dd dir="ltr">{SCORE} / 100</dd>
            <dt>נמדד</dt><dd dir="ltr">{MEASURED}</dd>
            <dt>איזה אתר</dt><dd dir="ltr">{SITE}</dd>
            <dt>כלי</dt><dd>Lighthouse, מובייל (חציון)</dd>
          </dl>
          <p className="px-live" aria-live="polite">{landed ? 'באוויר, ועבר את המדידה' : 'מודדים'}</p>
        </div>
      </div>
    </section>
  )
}

export default function Proto() {
  useEffect(() => {
    document.title = 'אב-טיפוס: מקישור לאוויר | MediaWave'
  }, [])
  return (
    <div className="px" dir="rtl">
      <a className="px-skip" href="#px-main">דילוג לתוכן</a>
      <header className="px-head">
        <Logo variant="compact" title="MediaWave" />
      </header>
      <main id="px-main">
        <Hero />
        <Measure />
        <section className="px-end" data-chapter="support">
          <p>סוף אב-הטיפוס: הירו ופרק אחד (site-director, שלב 3).</p>
        </section>
      </main>
    </div>
  )
}
