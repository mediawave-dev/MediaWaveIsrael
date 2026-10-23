// "מעוף" (after The Power of Storytelling, Noomo): one glass bird flies the whole page on a scroll-seeked
// timeline, the sky turns from lilac day to dusk, night and a fire dawn, and every chapter is a few huge
// serif words that scrub in out of a blur. Our bird is the brand: wings of feathers whose leading edge is
// the Horizon wave, the drop of the logo's i for a body.
import { useEffect, useRef, useState } from 'react'
import '@fontsource/bellefair/hebrew-400.css'
import '@fontsource/bellefair/latin-400.css'
import { useScene } from '../../motion/ScrollEngineProvider'
import { C } from '../content'
import { waForStyle } from '../lead'
import { useHero } from '../preview'
import type { StyleProps } from '../registry'
import LeadForm from '../LeadForm'
import { finePointer } from '../motion'
import './flight.css'

export const prepare = () => document.fonts.load('400 64px Bellefair', 'אבג')

const PRERENDER = typeof window !== 'undefined' && !!(window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__

/** The work chapter's film: the four photos that come to life, one after another (3 s each). */
function WorkFilm() {
  const [i, setI] = useState(0)
  const clip = C.work.clips[i]
  return (
    <div className="fl-film">
      <video
        key={clip}
        className="fl-film__v"
        src={`${clip}${typeof window !== 'undefined' && window.innerWidth < 760 ? '-m' : ''}.mp4`}
        poster={`${clip}.webp`}
        muted
        playsInline
        autoPlay
        preload="metadata"
        onEnded={() => setI((n) => (n + 1) % C.work.clips.length)}
        aria-hidden="true"
      />
      <span className="fl-film__n" aria-hidden="true">0{i + 1} / 04</span>
    </div>
  )
}

export default function Flight({ tier, def }: StyleProps) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const [live, setLive] = useState(false)
  const hero = useHero()

  useEffect(() => {
    if (PRERENDER || !canvas.current) return
    let stop = () => {}
    let alive = true
    import('./scene').then(({ startFlight }) => {
      if (!alive || !canvas.current) return
      try {
        const s = startFlight(canvas.current, canvas.current.closest('.fl') as HTMLElement, tier)
        stop = s.stop
        // live once the programs are compiled and the first frame is drawn (the CSS sky until then)
        void s.ready.then(() => { if (alive) setLive(true) })
      } catch { /* no WebGL: the CSS sky stays */ }
    })
    return () => { alive = false; stop() }
  }, [tier])

  // Storytelling's text: every line scrubs in with the scroll, opacity 0 to 1, scale 1.3 to 1 and blur 8 to 0
  // (blur on fine pointers only, as they do), stagger 0.05, linear; and leaves the same way at the top.
  const ref = useScene<HTMLDivElement>((e, root) => {
    if (e.REDUCE || tier === 'still') return
    const blur = finePointer()
    root.querySelectorAll<HTMLElement>('[data-fl]').forEach((el) => {
      const lines = el.querySelectorAll<HTMLElement>('[data-ln]')
      const targets = lines.length ? [...lines] : [el]
      const from = { opacity: 0, scale: 1.3, filter: blur ? 'blur(8px)' : 'none' }
      const to = { opacity: 1, scale: 1, filter: blur ? 'blur(0px)' : 'none', ease: 'none', stagger: 0.05 }
      e.gsap.fromTo(targets, from, { ...to, scrollTrigger: { trigger: el, start: 'top 94%', end: 'top 52%', scrub: true } })
      if (!el.hasAttribute('data-stay')) {
        e.gsap.to(targets, { opacity: 0, scale: 0.92, filter: blur ? 'blur(6px)' : 'none', ease: 'none', stagger: 0.04, immediateRender: false,
          scrollTrigger: { trigger: el, start: 'bottom 34%', end: 'bottom 4%', scrub: true } })
      }
    })
  }, [tier])

  return (
    <div className="fl" ref={ref} data-live={live || undefined}>
      <canvas className="fl-canvas" ref={canvas} aria-hidden="true" />

      <section className="fl-hero" data-ch="hero" aria-labelledby="fl-h1">
        <h1 id="fl-h1" className="fl-h1">
          <span className="fl-h1__small">{hero.line1}</span>
          <span className="fl-h1__big">{hero.brand ? <bdi className="s60-name">{hero.line2}</bdi> : hero.line2}</span>
        </h1>
        <div className="fl-hero__foot">
          <p className="fl-hero__sub">{hero.sub}{hero.sub2 && <><br />{hero.sub2}</>}</p>
          <a className="fl-pill" href={waForStyle(def)} target="_blank" rel="noopener noreferrer">{hero.cta}</a>
        </div>
        {/* [קופי: נתי] */}
        <p className="fl-hint" aria-hidden="true" lang="en" dir="ltr">Scroll down</p>
      </section>

      <section className="fl-svc" data-ch="services" aria-labelledby="fl-svc-t">
        <h2 id="fl-svc-t" className="fl-kicker" data-fl><span data-ln>{C.services.title}</span></h2>
        {C.services.items.map((s, i) => (
          <article key={s.id} className="fl-word" data-side={i % 2 ? 'a' : 'b'}>
            <div data-fl>
              <p className="fl-word__n" data-ln aria-hidden="true">0{i + 1}</p>
              <h3 className="fl-giant" data-ln>{s.title}</h3>
              <p className="fl-word__line" data-ln>{s.line}</p>
              <a className="fl-go" data-ln href={s.href} lang="en" aria-label={`לפרטים על ${s.title}`}>Details</a>
            </div>
          </article>
        ))}
      </section>

      <section className="fl-work" data-ch="work" aria-labelledby="fl-work-t">
        <div className="fl-work__in">
          <p className="fl-kicker" data-fl lang="en" dir="ltr">{C.work.title}</p>
          <h2 id="fl-work-t" className="fl-giant fl-giant--m" data-fl>{C.work.name}</h2>
          <div data-fl><WorkFilm /></div>
          <p className="fl-word__line" data-fl>{C.work.line}</p>
          <a className="fl-go" data-fl href={C.work.href} lang="en" aria-label={`${C.work.name} - צפייה`}>{C.work.linkLabel}</a>
        </div>
      </section>

      <section className="fl-proc" data-ch="process" aria-labelledby="fl-proc-t">
        <h2 id="fl-proc-t" className="fl-h2" data-fl>
          <span data-ln className="fl-h2__sans">{C.process.title.split(' ').slice(0, 2).join(' ')}</span>{' '}
          <span data-ln className="fl-h2__serif">{C.process.title.split(' ').slice(2).join(' ')}</span>
        </h2>
        <ol className="fl-steps">
          {C.process.steps.map((s, i) => (
            <li key={s.id} className="fl-step" data-side={i % 2 ? 'a' : 'b'} data-fl>
              <span className="fl-step__n" data-ln aria-hidden="true">0{i + 1}</span>
              <h3 className="fl-step__t" data-ln>{s.title}</h3>
              <p className="fl-step__l" data-ln>{s.line}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="fl-faq" data-ch="faq" aria-labelledby="fl-faq-t">
        <h2 id="fl-faq-t" className="fl-h2" data-fl><span data-ln className="fl-h2__serif">{C.faq.title}</span></h2>
        <div className="fl-faq__list" data-fl data-stay>
          {C.faq.items.map((f) => (
            <details key={f.id} className="fl-q" data-ln>
              <summary><span>{f.q}</span><i aria-hidden="true" /></summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="fl-contact" data-ch="contact" aria-labelledby="fl-contact-t">
        <h2 id="fl-contact-t" className="fl-giant fl-giant--m" data-fl data-stay><span data-ln>{C.contact.title}</span></h2>
        <div className="fl-panel">
          <p className="fl-word__line">{C.contact.lead}</p>
          <LeadForm def={def} className="fl-form" />
          <p className="fl-contact__alt">
            <a href={`tel:${C.contact.phone}`} dir="ltr">{C.contact.phone}</a>
            <a href={`mailto:${C.contact.email}`} dir="ltr">{C.contact.email}</a>
          </p>
        </div>
      </section>
    </div>
  )
}
