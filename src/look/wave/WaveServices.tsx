// wave · what we do: the services as one ruled index (number, name, the outcome line, a forward
// arrow), each row a link to its page. Three rows carry a small surprise drawn in the wave's line
// (D122, the details lab's S1-S3): the website builds itself, a memory develops like a cyanotype
// print in the logo's blue, and a cassette's reels spin. A fine pointer fires it on hover or focus;
// a phone fires it once, when the row crosses the middle of the screen. Each surprise is small,
// lives about two seconds, never covers the row's name and is aria-hidden. Still and calm: none.
import { useEffect, useRef } from 'react'
import { SERVICES } from '../data'
import { track } from '../../utils/analytics'
import { isCalm, isStill } from './clock'

type Kind = 'site' | 'memory' | 'cass'
const POP: Partial<Record<string, Kind>> = { websites: 'site', 'memory-videos': 'memory', 'video-editing': 'cass' }

function PopArt({ kind }: { kind: Kind }) {
  if (kind === 'site') return (
    <svg viewBox="0 0 132 92" focusable="false">
      <rect className="pl" x="1" y="1" width="130" height="90" rx="5" />
      <path className="pl" d="M1 15h130" />
      <circle className="pf" cx="121" cy="8" r="2.2" /><circle className="pf o" cx="113" cy="8" r="2.2" />
      <rect className="pb" x="10" y="23" width="112" height="22" rx="2" style={{ transitionDelay: '.04s' }} />
      <rect className="pb o" x="44" y="52" width="78" height="6" rx="2" style={{ transitionDelay: '.14s' }} />
      <rect className="pb o" x="26" y="63" width="96" height="4" rx="2" style={{ transitionDelay: '.22s' }} />
      <rect className="pb o" x="56" y="72" width="66" height="4" rx="2" style={{ transitionDelay: '.3s' }} />
      <rect className="pb" x="88" y="80" width="34" height="6" rx="2" style={{ transitionDelay: '.4s' }} />
    </svg>
  )
  if (kind === 'memory') return (
    <svg viewBox="0 0 104 116" focusable="false">
      <rect className="pl paper" x="1" y="1" width="102" height="114" rx="2" />
      <g className="cyan">
        <rect x="9" y="9" width="86" height="78" />
        <circle className="sun" cx="68" cy="32" r="10" />
        <path className="hill" d="M9 66c16-11 31-13 46-6s26 6 40-3v30H9z" />
        <circle className="fig" cx="38" cy="64" r="3.6" /><rect className="fig" x="35.2" y="67.4" width="5.6" height="11" rx="2" />
        <circle className="fig" cx="49" cy="66" r="2.8" /><rect className="fig" x="46.9" y="68.6" width="4.2" height="9" rx="2" />
      </g>
    </svg>
  )
  return (
    <svg viewBox="0 0 132 84" focusable="false">
      <rect className="pl paper" x="1" y="1" width="130" height="82" rx="7" />
      <rect className="pl" x="31" y="24" width="70" height="30" rx="15" />
      <circle className="pf" cx="49" cy="39" r="11" /><circle className="pf" cx="83" cy="39" r="7" />
      <g className="reel" style={{ transformOrigin: '49px 39px' }}><circle className="hub" cx="49" cy="39" r="5" /><path className="pl" d="M49 34v3M49 41v3M44 39h3M51 39h3" /></g>
      <g className="reel" style={{ transformOrigin: '83px 39px' }}><circle className="hub" cx="83" cy="39" r="5" /><path className="pl" d="M83 34v3M83 41v3M78 39h3M85 39h3" /></g>
      <path className="pl" d="M41 83l5-12h40l5 12" />
    </svg>
  )
}

export default function WaveServices() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root || isStill() || isCalm()) return
    const rows = [...root.querySelectorAll<HTMLElement>('[data-pop]')]
    const timers = new Map<HTMLElement, number>()
    const fire = (row: HTMLElement) => {
      row.classList.remove('is-pop'); void row.offsetWidth; row.classList.add('is-pop')
      window.clearTimeout(timers.get(row))
      timers.set(row, window.setTimeout(() => row.classList.remove('is-pop'), 2200))
    }
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const offs: (() => void)[] = []
    if (fine) {
      rows.forEach((row) => {
        const on = () => fire(row)
        row.addEventListener('pointerenter', on); row.addEventListener('focusin', on)
        offs.push(() => { row.removeEventListener('pointerenter', on); row.removeEventListener('focusin', on) })
      })
    } else {
      const io = new IntersectionObserver((entries) => entries.forEach((en) => {
        if (!en.isIntersecting) return
        fire(en.target as HTMLElement); io.unobserve(en.target)
      }), { rootMargin: '-46% 0px -46% 0px' })
      rows.forEach((row) => io.observe(row))
      offs.push(() => io.disconnect())
    }
    return () => { offs.forEach((f) => f()); timers.forEach((t) => window.clearTimeout(t)) }
  }, [])

  return (
    <section ref={ref} id="services" className="wv-ch wv-svc" aria-labelledby="services-title" data-chapter="services">
      <i className="wv-pt wv-pt--end" aria-hidden="true" />
      <header className="wv-head">
        <span className="wv-num" aria-hidden="true">02</span>
        <h2 id="services-title" className="wv-h2" data-zone="text">מה אנחנו עושים</h2>
      </header>
      <ol className="wv-svc__list">
        {SERVICES.map((s, i) => {
          const kind = POP[s.id]
          return (
            <li key={s.id} className="wv-svc__item">
              <a className="wv-svc__row" href={s.href} data-pop={kind} onClick={() => track('cta_click', { placement: `services_${s.id}` })}>
                <span className="wv-svc__n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <span className="wv-svc__title" data-zone="text">{s.title}</span>
                <span className="wv-svc__line" data-zone="text">{s.line}</span>
                <svg className="wv-svc__go" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M12.5 4.5 7 10l5.5 5.5" /></svg>
                {kind && <span className={`wv-pop wv-pop--${kind}`} aria-hidden="true"><PopArt kind={kind} /></span>}
              </a>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
