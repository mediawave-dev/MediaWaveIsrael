// sea · what we do (D133): the six services in one held stage. One scroll number runs through them at a
// fixed ratio (the page's one scroll mechanic, wave/clock.ts), and the field gathers each service into
// its own object, wound by the same number: the laptop with the site and its lead (websites), a phone
// with one page and one button (landing pages), a results page where ours climbs to first (Google), a
// customer's question and the bot's answer (chatbots), the cassette (video), a print that develops
// like a cyanotype (memory videos). The surprises of D122 (S1-S3) live in these objects now.
// A phone shows one service at a time, in big type under its object; a wide screen keeps the whole
// index beside the object and lights the current row. Every row stays a link, in the tab order and
// in the accessibility tree. No WebGL, still mode or no JS: a plain ruled index (html.sea-held off).
import { useEffect, useRef } from 'react'
import { SERVICES } from '../data'
import { track } from '../../utils/analytics'
import { docTop, useGear } from '../wave/clock'
import { SCENE, reels, serviceAt } from './gears'
import { Lines, Tag } from './parts'
import * as sound from './sound'
import SeaImage from './SeaImage'
import { CLIPS, SERVICE_MEDIA, posterOf, tileOf, videoOf } from './media'
import { GroundSource } from './SeaGround'
import * as field from './field'
import { opt } from './lab'

const N = SERVICES.length
const TAPE_AT = SERVICES.findIndex((s) => s.id === 'video-editing')
const pad = (n: number) => String(n).padStart(2, '0')
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

export default function SeaServices() {
  const run = useRef<HTMLDivElement>(null)
  const list = useRef<HTMLOListElement>(null)
  const count = useRef<HTMLSpanElement>(null)
  const deck = useRef<HTMLSpanElement>(null)
  const state = useRef<HTMLSpanElement>(null)
  const tape = useRef(reels())
  const shown = useRef(-1)
  const spot = useRef<HTMLSpanElement>(null)
  // the colour round (D154, gate `rows`): each row's picture develops while its service is on the stage
  const rows = opt('rows')
  // the stage's backdrop (D158; Lama's "WHAT WE DO."): the service on the stage, or the one under the
  // pointer, as its footage's material behind the list, changing through a fade
  const stage = useRef<HTMLDivElement>(null)
  const source = useRef<HTMLVideoElement>(null)
  const backdrop = useRef<{ id: number | null; posters: Record<string, HTMLImageElement>; now: string; show: (svc: string) => void }>({ id: null, posters: {}, now: '', show: () => {} })
  useEffect(() => {
    const el = stage.current
    if (!el || field.tier() === 'still') return
    let alive = true
    const b = backdrop.current
    const full = field.tier() === 'full'
    const clip = (svc: string) => CLIPS[SERVICE_MEDIA[svc]?.[0] ?? 'svc-websites']
    const poster = (svc: string) => {
      if (!b.posters[svc]) { const im = new Image(); im.decoding = 'async'; im.src = posterOf(clip(svc), !window.matchMedia('(min-width: 768px)').matches); b.posters[svc] = im }
      return b.posters[svc]
    }
    let hoverT = 0
    b.show = (svc: string) => {
      window.clearTimeout(hoverT)
      hoverT = window.setTimeout(() => {
        if (!alive || b.id === null || svc === b.now) return
        b.now = svc
        field.swapFilm(b.id, videoOf(clip(svc)), poster(svc))
      }, 140)
    }
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      void field.ready.then((ok) => {
        if (!alive || !ok) return
        const first = SERVICES[0].id
        const im = poster(first)
        const v = full ? source.current : null
        im.onload = () => {
          if (!alive) return
          if (v) { v.src = videoOf(clip(first)); v.load() }
          b.now = first
          b.id = field.addFilm(el, v, im, { mode: 'colour', veil: true, edge: 0.1, top: 0.14, style: 3 })
        }
      })
    }, { rootMargin: '80% 0px' })
    io.observe(el)
    return () => { alive = false; io.disconnect(); window.clearTimeout(hoverT); field.dropFilm(b.id); b.id = null }
  }, [])

  useGear(run, (el, vh) => {
    const top = docTop(el)
    return [top, top + el.offsetHeight - vh]
  }, (p) => {
    const at = (i: number) => clamp01(p * N - i)
    const active = Math.min(N - 1, Math.floor(p * N))
    if (active !== shown.current && list.current) {
      shown.current = active
      list.current.querySelectorAll('li').forEach((li, i) => li.classList.toggle('is-on', i === active))
      // the stage's one slot takes the current service's scene; the last one fades out in place
      if (spot.current) spot.current.dataset.spot = SCENE[SERVICES[active].id] ?? 'quiet'
      if (count.current) count.current.textContent = `${pad(active + 1)} / ${pad(N)}`
      // the header's mark follows the object on the stage (SeaWay)
      window.dispatchEvent(new CustomEvent('sea:svc', { detail: SERVICES[active].id }))
      backdrop.current.show(SERVICES[active].id)
      sound.tick()
    }
    // the websites row keeps the laptop where its chapter left it (open, the lead arrived)
    SERVICES.forEach((s, i) => { if (s.id !== 'websites' && s.id !== 'video-editing') serviceAt(s.id, at(i)) })
    const tp = at(TAPE_AT)
    const dv = tape.current(tp)
    if (deck.current) deck.current.textContent = String(Math.round(tp * 1800)).padStart(4, '0')
    if (state.current) state.current.textContent = dv > 0.0004 ? '▶ PLAY' : dv < -0.0004 ? '◀◀ REW' : '■ STOP'
  })

  return (
    <section id="services" className="sea-ch sea-svc" aria-labelledby="services-title" data-chapter="services">
      <div ref={run} className="sea-svc__run" style={{ ['--n' as string]: N }}>
        <div ref={stage} className="sea-svc__stage">
          <GroundSource video={source} />
          {/* one slot for the six objects (D139): above the words on a phone, beside them when wide */}
          <span ref={spot} className="sea-spot sea-spot--svc" data-spot={SCENE[SERVICES[0].id]} aria-hidden="true" />
          <header className="sea-head" data-reveal="">
            <Tag className="sea-fade">02 · SERVICES</Tag>
            <h2 id="services-title" className="sea-h2 sea-svc__h2" data-zone="text"><Lines lines={['מה אנחנו עושים']} /></h2>
            <span className="sea-tag sea-svc__count" aria-hidden="true"><span ref={count}>01 / {pad(N)}</span></span>
          </header>
          <ol ref={list} className="sea-svc__list">
            {SERVICES.map((s, i) => (
              <li key={s.id} className={`sea-svc__item${i === 0 ? ' is-on' : ''}`}>
                <a
                  className="sea-svc__row"
                  href={s.href}
                  data-cursor="לדף השירות"
                  onClick={() => track('cta_click', { placement: `services_${s.id}` })}
                  onPointerEnter={(e) => { if (e.pointerType !== 'touch') backdrop.current.show(s.id) }}
                  onPointerLeave={() => { const on = SERVICES[Math.max(0, shown.current)]; if (on) backdrop.current.show(on.id) }}
                >
                  <span className="sea-svc__n" aria-hidden="true">{pad(i + 1)}</span>
                  <span className="sea-svc__title" data-zone="text">{s.title}</span>
                  <span className="sea-svc__line" data-zone="text">{s.line}</span>
                  {rows === 'tile' && SERVICE_MEDIA[s.id] && <SeaImage src={tileOf(CLIPS[SERVICE_MEDIA[s.id][1] ?? SERVICE_MEDIA[s.id][0]])} w={384} h={240} when="row" className="sea-svc__pic" />}
                  {i === TAPE_AT && (
                    <span className="sea-deck" aria-hidden="true">
                      <span ref={deck} className="sea-deck__count">0000</span>
                      <span ref={state} className="sea-deck__state">■ STOP</span>
                    </span>
                  )}
                  <svg className="sea-svc__go" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M12.5 4.5 7 10l5.5 5.5" /></svg>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
