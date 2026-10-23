// "עומק" (D215, after Lidar Drone Scanning by Riotters, SOTD 6.10.2026): the fifth world. Nati picked it from
// the four SOTD proposals ("הכי מרשים") as a world of its own, the main site unchanged. One cloud of points in
// space carries the whole page: the Horizon as a world with its sea at the top, then a laptop, a phone, a
// magnifier, a chat bubble, a film reel and a cassette, one for each service as its row crosses the middle of
// the screen; a photo from the memories film for the work; a laptop for the process; the sea for the
// questions; the bubble for the letter. A scan plane sweeps every object as it lands, the pointer steers the
// camera, and a mono readout gives the cloud's true numbers. On a phone the top of the screen is the scanner's
// window (the cloud over a veil of the ground) and the words are read below it, fading as they rise into it;
// from 1100px the cloud lives on the left half.
import { useEffect, useRef, useState } from 'react'
import '@fontsource/assistant/hebrew-400.css'
import '@fontsource/assistant/hebrew-800.css'
import '@fontsource/assistant/latin-400.css'
import '@fontsource/assistant/latin-800.css'
import '@fontsource/geist-mono/latin-500.css'
import { C } from '../content'
import { waForStyle } from '../lead'
import type { StyleProps } from '../registry'
import LeadForm from '../LeadForm'
import { finePointer } from '../motion'
import { setText } from '../../utils/set-text'
import { startCloud, type Cloud, type ShapeId } from './cloud'
import './depth.css'

export const prepare = () => Promise.all([document.fonts.load('800 60px Assistant', 'אבג'), document.fonts.load('400 18px Assistant', 'אבג'), document.fonts.load('500 12px "Geist Mono"', 'AB')])

/** each service's object in the cloud */
const SHAPE: Record<string, ShapeId> = { websites: 'laptop', landing: 'phone', seo: 'search', chatbots: 'bubble', 'video-editing': 'reel', 'memory-videos': 'cassette' }
/** the readout's names, in English like every label of the kind (Nati, 21.10) */
const NAME: Record<ShapeId, string> = { horizon: 'HORIZON', laptop: 'LAPTOP', phone: 'PHONE', search: 'SEARCH', bubble: 'BUBBLE', reel: 'REEL', cassette: 'CASSETTE', photo: 'PHOTO · 60', sea: 'SEA' }

export default function Depth({ tier, def }: StyleProps) {
  /** a restored WebGL context starts the cloud again (a new canvas) */
  const [gen, setGen] = useState(0)
  const root = useRef<HTMLDivElement>(null)
  const host = useRef<HTMLDivElement>(null)
  const pts = useRef<HTMLSpanElement>(null)
  const scan = useRef<HTMLSpanElement>(null)
  const obj = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const hv = host.current
    const el = root.current
    if (!hv || !el) return
    let cloud: Cloud | null = null
    let alive = true
    let read = 0
    const offs: (() => void)[] = []
    // the readout says what the cloud shows: in the still tier there is no interval, so it is written on every change
    const paint = (c: Cloud) => { const r = c.readout(); setText(scan.current, r.scan.toFixed(2)); setText(obj.current, NAME[r.shape]) }
    const html = document.documentElement
    const none = (on: boolean) => { if (on) { el.dataset.nocloud = ''; html.dataset.nocloud = '' } else { delete el.dataset.nocloud; delete html.dataset.nocloud } }
    startCloud(hv, {
      still: tier === 'still', calm: tier === 'calm', photoSrc: '/media/work-life-1.webp',
      onLost: () => { if (alive) { none(true); window.clearInterval(read) } },
      onRestored: () => { if (alive) setGen((g) => g + 1) },
    }).then((c) => {
      if (!alive || !c) { c?.stop(); if (alive) none(true); return }
      none(false)
      cloud = c
      setText(pts.current, c.readout().points.toLocaleString('en-US'))
      // the object follows the block on the middle line of the screen
      const io = new IntersectionObserver((es) => es.forEach((e) => {
        if (!e.isIntersecting) return
        c.to((e.target as HTMLElement).dataset.shape as ShapeId)
        if (tier === 'still') paint(c)
      }), { rootMargin: '-46% 0px -46% 0px' })
      el.querySelectorAll<HTMLElement>('[data-shape]').forEach((n) => io.observe(n))
      offs.push(() => io.disconnect())
      if (finePointer()) {
        const move = (e: PointerEvent) => c.steer(e.clientX / window.innerWidth - 0.5, e.clientY / window.innerHeight - 0.5)
        window.addEventListener('pointermove', move, { passive: true })
        offs.push(() => window.removeEventListener('pointermove', move))
      }
      const sc = () => c.scroll(window.scrollY / window.innerHeight)
      window.addEventListener('scroll', sc, { passive: true })
      offs.push(() => window.removeEventListener('scroll', sc))
      // the readout: true numbers only, a few times a second (never every frame)
      if (tier !== 'still') read = window.setInterval(() => paint(c), 140)
      else paint(c)
    }).catch(() => { if (alive) none(true) })
    return () => { alive = false; window.clearInterval(read); offs.forEach((f) => f()); cloud?.stop(); delete html.dataset.nocloud }
  }, [tier, gen])

  return (
    <div className="dp" ref={root}>
      {/* the cloud makes its own canvas in here on every start (cloud.ts) */}
      <div className="dp-cloud-host" ref={host} aria-hidden="true" />
      {/* phones: the top of the screen is the scanner's window; the words fade under it as they rise */}
      <div className="dp-veil" aria-hidden="true" />
      <p className="dp-read" aria-hidden="true" dir="ltr"><b ref={pts}>0</b> PTS · SCAN <i ref={scan}>0.00</i> · <span ref={obj}>HORIZON</span></p>

      <section className="dp-sec dp-hero" data-ch="hero" data-shape="horizon" aria-labelledby="dp-h1">
        <div className="dp-sheet">
          <p className="dp-k" dir="ltr" lang="en" aria-hidden="true">[ DEPTH · LIDAR ]</p>
          <h1 id="dp-h1" className="dp-h1">{C.hero.line1}<br />{C.hero.line2}</h1>
          <p className="dp-body">{C.hero.sub} {C.hero.sub2}</p>
          <a className="dp-key" href={waForStyle(def)} target="_blank" rel="noopener noreferrer">{C.hero.cta}</a>
          {/* [קופי: נתי] */}
          <p className="dp-hint" lang="en" dir="ltr" aria-hidden="true">SCROLL TO SCAN ↓</p>
        </div>
      </section>

      <section className="dp-sec" id="dp-services" data-ch="services" aria-labelledby="dp-svc-t">
        <div className="dp-sheet">
          <p className="dp-k" dir="ltr" lang="en" aria-hidden="true">[ SERVICES · 06 ]</p>
          <h2 id="dp-svc-t" className="dp-h2" data-land="">{C.services.title}</h2>
          <ul className="dp-rows">
            {C.services.items.map((s, i) => (
              <li key={s.id} data-shape={SHAPE[s.id] ?? 'horizon'}>
                <a className="dp-row" href={s.href}>
                  <span className="dp-row__n" dir="ltr" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <span className="dp-row__t">{s.title}</span>
                  <span className="dp-row__l">{s.line}</span>
                  <span className="dp-row__go" lang="en" dir="ltr"><span aria-hidden="true">( </span>Details<span aria-hidden="true"> + )</span></span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="dp-sec" id="dp-work" data-ch="work" data-shape="photo" aria-labelledby="dp-work-t">
        <div className="dp-sheet">
          <p className="dp-k" dir="ltr" lang="en" aria-hidden="true">[ WORK · REAL ]</p>
          <h2 id="dp-work-t" className="dp-h2" data-land="">{C.work.name}</h2>
          <p className="dp-body">{C.work.line}</p>
          <a className="dp-more" href={C.work.href} aria-label={`${C.work.linkLabel}: ${C.work.name}`}><span lang="en" dir="ltr">( {C.work.linkLabel} + )</span></a>
        </div>
      </section>

      <section className="dp-sec" id="dp-process" data-ch="process" data-shape="laptop" aria-labelledby="dp-proc-t">
        <div className="dp-sheet">
          <p className="dp-k" dir="ltr" lang="en" aria-hidden="true">[ PROCESS · 04 ]</p>
          <h2 id="dp-proc-t" className="dp-h2" data-land="">{C.process.title}</h2>
          <ol className="dp-steps">
            {C.process.steps.map((s, i) => (
              <li key={s.id}><span className="dp-row__n" dir="ltr" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span><h3 className="dp-step__t">{s.title}</h3><span>{s.line}</span></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="dp-sec" id="dp-faq" data-ch="faq" data-shape="sea" aria-labelledby="dp-faq-t">
        <div className="dp-sheet">
          <p className="dp-k" dir="ltr" lang="en" aria-hidden="true">[ FAQ ]</p>
          <h2 id="dp-faq-t" className="dp-h2" data-land="">{C.faq.title}</h2>
          <div className="dp-qs">
            {C.faq.items.map((f) => (
              <details key={f.id} className="dp-q">
                <summary><span>{f.q}</span><span className="dp-q__sign" aria-hidden="true">+</span></summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="dp-sec dp-contact" id="dp-contact" data-ch="contact" data-shape="bubble" aria-labelledby="dp-contact-t">
        <div className="dp-sheet">
          <p className="dp-k" dir="ltr" lang="en" aria-hidden="true">[ CONTACT ]</p>
          <h2 id="dp-contact-t" className="dp-h2" data-land="">{C.contact.title}</h2>
          <p className="dp-body">{C.contact.lead}</p>
          <LeadForm def={def} className="dp-form" />
          <p className="dp-alt" dir="ltr"><a href={`tel:${C.contact.phone}`}>{C.contact.phone}</a><a href={`mailto:${C.contact.email}`}>{C.contact.email}</a></p>
        </div>
      </section>
    </div>
  )
}
