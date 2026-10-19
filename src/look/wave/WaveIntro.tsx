// wave · the opening (D129): the page opens quietly, once per visit. A cream screen runs a second of
// timecode while the wave's line grows under it; the Horizon disc draws itself in that line and
// fills; then the screen leaves in horizontal bands, like a video deck's tracking noise (the trail's
// material), and the hero comes in: the H1 rises into place, then the line under it, the key and the
// laptop. The whole sequence is CSS (wave.css, html.wv-opening), so it starts at first paint, before
// the app boots; this component only ends it and lets any tap, key or wheel skip it.
// index.html decides before first paint (home page, motion allowed, not ?reduce=1, not a prerender,
// not seen this visit) and removes the class after 7s if the app never boots. The H1 is painted
// under the veil from the first frame and only moves (transform), so it stays the LCP.
import { useEffect, useRef } from 'react'
import { refreshGears } from './clock'

const BANDS = Array.from({ length: 10 }, (_, k) => k)
const END_MS = 3300
/** CALM (OS reduced motion): the counter and the mark, then a fade; nothing slides */
const END_CALM_MS = 2000

export default function WaveIntro() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const html = document.documentElement
    if (!html.classList.contains('wv-opening')) return
    const veil = ref.current
    const events = ['pointerdown', 'keydown', 'wheel', 'touchstart'] as const
    let done = false
    let fade = 0
    const end = () => {
      if (done) return
      done = true
      html.classList.remove('wv-opening', 'wv-opening-calm')
      events.forEach((e) => window.removeEventListener(e, skip))
      refreshGears() // the hero settled: measure the line's anchors where they now lie
    }
    const skip = () => {
      if (done || !veil) { end(); return }
      veil.style.transition = 'opacity 0.3s ease'
      veil.style.opacity = '0'
      fade = window.setTimeout(end, 300)
    }
    const timer = window.setTimeout(end, html.classList.contains('wv-opening-calm') ? END_CALM_MS : END_MS)
    events.forEach((e) => window.addEventListener(e, skip, { passive: true }))
    return () => { window.clearTimeout(timer); window.clearTimeout(fade); end() }
  }, [])

  return (
    <div ref={ref} className="wv-intro" aria-hidden="true">
      <div className="wv-intro__bands">{BANDS.map((k) => <i key={k} style={{ ['--k' as string]: k }} />)}</div>
      <div className="wv-intro__stage">
        <svg className="wv-intro__mark" viewBox="-40 -40 80 80" focusable="false">
          <defs><clipPath id="wv-intro-disc"><circle r="34" /></clipPath></defs>
          <g clipPath="url(#wv-intro-disc)" className="wv-intro__fill">
            <rect x="-40" y="-40" width="80" height="80" className="wv-intro__ink" />
            <path d="M-40 2q10 -7 20 0t20 0t20 0t20 0V40H-40z" className="wv-intro__sea" />
          </g>
          <circle r="34" className="wv-intro__ring" pathLength={100} />
        </svg>
        <p className="wv-intro__tc"><span className="wv-intro__run" /><span className="wv-intro__end">00:00:01:00</span></p>
        <i className="wv-intro__bar" />
      </div>
    </div>
  )
}
