// site-director prototype, direction C "one shot" (Nati, 2026-10-15), built for 390 first.
// The page is one camera move over white paper on a grey table: it dives from an overview onto the
// hero, passes over sheets that land as they reach the eye line, and pulls back at the end until the
// whole site sits inside one phone. No cuts, no crossfades, no colour flips: one ground (D67/D81).
// Every move is a transform on a sheet-sized layer (the page itself never scrolls by transform), so
// focus, find-in-page and anchors keep working. Motion runs on the shared engine (useScene).

import { useEffect, useState } from 'react'
import { useScene } from '../motion/ScrollEngineProvider'
import Logo from '../components/ui/Logo'
import LottieIcon from '../components/ui/LottieIcon'
import { HERO, STEPS } from '../look/data'
import { getWhatsAppUrl } from '../utils/whatsapp'
import './protoc.css'

const WA = getWhatsAppUrl('היי, אשמח לשמוע על אתר לעסק שלי')

/** The miniature of the whole site the camera sees from far away (decoration only). */
function Miniature() {
  return (
    <>
      <div className="pc-mini pc-mini--steps"><i /><i /><i /><i /></div>
      <div className="pc-mini pc-mini--rows"><i /><i /><i /></div>
      <div className="pc-mini pc-mini--rows"><i /><i /></div>
      <div className="pc-mini pc-mini--end" />
    </>
  )
}

function Hero() {
  const ref = useScene<HTMLElement>((e, root) => {
    const model = root.querySelector<HTMLElement>('.pc-model')!
    if (e.REDUCE) return
    // The overview: the paper site lies on the table, turned like a sheet someone put down, and runs
    // toward the viewer. CALM (OS reduce on this site) keeps the dive but with a small tilt.
    const from = e.CALM
      ? { rotateX: 10, rotateZ: -3, scale: 0.86, yPercent: 4 }
      : { rotateX: 30, rotateZ: -11, scale: 0.62, yPercent: -1 }
    const tl = e.holdTimeline(root.querySelector('.pc-hold')!, { id: 'dive', scrub: e.CALM ? true : 0.6 })
    tl.fromTo(model, { ...from, transformPerspective: 1100, transformOrigin: '50% 22%' },
      { rotateX: 0, rotateZ: 0, scale: 1, yPercent: 0, ease: 'power1.inOut', immediateRender: true })
    tl.to(root.querySelector('.pc-cue'), { autoAlpha: 0, duration: 0.15, ease: 'none' }, 0)
  })

  return (
    <section ref={ref} className="pc-hero" aria-labelledby="pc-title" data-chapter="hero">
      <div className="pc-hold">
        <div className="pc-stage">
          <div className="pc-model">
            <article className="pc-sheet pc-sheet--hero">
              <div className="pc-film">
                <video muted playsInline loop autoPlay preload="none" aria-hidden="true"
                  poster="/images/lens-m-poster.webp">
                  <source src="/videos/lens.mp4" media="(min-width: 760px)" type="video/mp4" />
                  <source src="/videos/lens-m.mp4" type="video/mp4" />
                </video>
              </div>
              <div className="pc-copy">
                <h1 id="pc-title"><span>{HERO.line1}</span><span>{HERO.line2}</span></h1>
                <p>{HERO.sub}</p>
                <a className="pc-btn" href={WA} target="_blank" rel="noopener">{HERO.cta}</a>
              </div>
            </article>
            <div aria-hidden="true"><Miniature /></div>
          </div>
          {/* [קופי: טיוטה לאישור נתי] */}
          <p className="pc-cue" aria-hidden="true">גוללים, והמצלמה יורדת אל האתר</p>
        </div>
      </div>
    </section>
  )
}

function Steps() {
  const [active, setActive] = useState(-1)
  const ref = useScene<HTMLElement>((e, root) => {
    const sheets = Array.from(root.querySelectorAll<HTMLElement>('.pc-step'))
    sheets.forEach((sheet, i) => {
      // Lotties play only while their sheet lies flat in front of the eye (DECISIONS #50).
      e.ScrollTrigger.create({ trigger: sheet, start: 'top 62%', end: 'bottom 38%', onToggle: (s) => s.isActive && setActive(i) })
      if (e.REDUCE) return
      const tilt = e.CALM ? 6 : 24
      // Landing: the sheet comes in lying on the table and is flat by the time it reaches the eye line.
      e.gsap.fromTo(sheet, { rotateX: tilt, scale: 0.9, y: 30, transformPerspective: 1000, transformOrigin: '50% 0%' },
        { rotateX: 0, scale: 1, y: 0, ease: 'none', scrollTrigger: { trigger: sheet, start: 'top bottom', end: 'top 36%', scrub: true } })
      // Leaving: it tips away from the camera instead of sliding off flat, so the shot never cuts.
      e.gsap.fromTo(sheet, { rotateX: 0, scale: 1 },
        { rotateX: -tilt * 0.6, scale: 0.94, ease: 'none', immediateRender: false, transformOrigin: '50% 100%',
          scrollTrigger: { trigger: sheet, start: 'bottom 42%', end: 'bottom top', scrub: true } })
    })
  })

  return (
    <section ref={ref} className="pc-steps" aria-labelledby="pc-steps-title" data-chapter="build">
      <h2 id="pc-steps-title" className="pc-h2">איך אנחנו עובדים</h2>
      <ol>
        {STEPS.map((s, i) => (
          <li key={s.id} className="pc-sheet pc-step">
            <span className="pc-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <div className="pc-art" aria-hidden="true">
              {s.lottie && <LottieIcon animationPath={s.lottie} renderer={s.renderer} size={220} loop active={active === i} load={Math.abs(active - i) <= 1} />}
            </div>
            <h3>{s.title}</h3>
            <p>{s.line}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

function Finale() {
  const ref = useScene<HTMLElement>((e, root) => {
    const site = root.querySelector<HTMLElement>('.pc-pocket')!
    if (e.REDUCE) return
    // The pull-back: everything the visitor passed lies on the table again, then shrinks into the phone.
    const tl = e.holdTimeline(root.querySelector('.pc-hold')!, { id: 'pullback', scrub: e.CALM ? true : 0.6 })
    tl.fromTo(site, { scale: e.CALM ? 1.15 : 2.1, rotateX: e.CALM ? 6 : 26, rotateZ: e.CALM ? -2 : -9, transformPerspective: 1100, transformOrigin: '50% 30%' },
      { scale: 1, rotateX: 0, rotateZ: 0, ease: 'power1.inOut' })
    tl.fromTo(root.querySelector('.pc-phone-frame'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.12, ease: 'none' }, 0.8)
  })

  return (
    <section ref={ref} className="pc-end" aria-labelledby="pc-end-title" data-chapter="launch">
      <div className="pc-hold pc-hold--end">
        <div className="pc-stage pc-stage--end">
          <div className="pc-phone" aria-hidden="true">
            <div className="pc-pocket">
              <div className="pc-mini pc-mini--hero"><b>{HERO.line1}<br />{HERO.line2}</b><span /></div>
              <Miniature />
            </div>
            <div className="pc-phone-frame" />
          </div>
          <div className="pc-end-copy">
            <h2 id="pc-end-title" className="pc-h2">דברו איתנו</h2>
            {/* [קופי: טיוטה לאישור נתי] */}
            <p>כל מה שגללתם עכשיו נבנה כדי להיראות טוב קודם כל בטלפון. ככה נבנה גם האתר שלכם.</p>
            <a className="pc-btn" href={WA} target="_blank" rel="noopener">{HERO.cta}</a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function ProtoC() {
  useEffect(() => { document.title = 'אב-טיפוס: שוט אחד | MediaWave' }, [])
  return (
    <div className="pc" dir="rtl">
      <a className="pc-skip" href="#pc-main">דילוג לתוכן</a>
      <header className="pc-head">
        <Logo variant="compact" title="MediaWave" />
        <a className="pc-head-cta" href={WA} target="_blank" rel="noopener">בואו נדבר</a>
      </header>
      <main id="pc-main">
        <Hero />
        <Steps />
        <Finale />
      </main>
    </div>
  )
}
