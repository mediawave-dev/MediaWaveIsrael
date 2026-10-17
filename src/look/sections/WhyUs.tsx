// WhyUs in the looks (step 3). One move: "the screens switch on". Three screens (K: a bezel
// like the laptop's; M: a floating object's charcoal body) sit dark; as the section comes up
// they light from the right, one after another, and each one's Lottie starts as it lights.
// Opacity only (a dark cover over a white face). Reduced and no JS: lit from the start.
// In KM it stays on the stage, right after the hero.

import { useState } from 'react'
import { useScene } from '../../motion/ScrollEngineProvider'
import { LottieIcon } from '../../components/ui/LottieIcon'
import './why.css'

export const WHY_ITEMS = [
  { id: 'tech', lottie: '/animations/2/computer%20technician.json', title: 'אתר מהיר שלא נתקע', line: 'נפתח מהר, גם בטלפון.' },
  { id: 'ai', lottie: '/animations/AI/AI%20animation.json', title: 'אתר שגם צ׳אטבוט יכול לקרוא', line: 'יש מי שמחפש בגוגל ויש מי ששואל צ׳אטבוט. הטקסט באתר בנוי כך ששניהם יכולים לקרוא אותו.' },
  { id: 'personal', lottie: '/animations/6%20personal/contact%20us.json', title: 'ליווי אישי', line: 'מדברים ישירות עם המפתח, בלי מתווכים.' },
]

export default function WhyUs() {
  // which screens are on; undefined = no engine yet (prerender, no JS): all on
  const [lit, setLit] = useState<boolean[] | null>(null)
  const ref = useScene<HTMLElement>((e, root) => {
    if (e.REDUCE) return
    const covers = [...root.querySelectorAll<HTMLElement>('.why__off')]
    const tl = e.gsap.timeline({ paused: true })
    covers.forEach((c, i) => {
      tl.fromTo(c, { opacity: 1 }, {
        opacity: 0, duration: e.CALM ? 0.25 : 0.5, ease: 'power2.out',
        onStart: () => setLit((l) => { const n = [...(l ?? [false, false, false])]; n[i] = true; return n }),
      }, i * (e.CALM ? 0.08 : 0.18))
    })
    setLit([false, false, false])
    tl.progress(0)
    e.ScrollTrigger.create({ trigger: root, start: 'top 72%', once: true, onEnter: () => tl.play() })
    return () => setLit(null)
  })

  return (
    <section ref={ref} id="why-us" className="why" aria-labelledby="why-title" data-theme="dark">
      <div className="why__in">
        <h2 id="why-title" data-zone="text">למה לעבוד איתנו?</h2>
        <p className="why__lead" data-zone="text">מה מקבלים, בקצרה</p>
        <ul className="why__list">
          {WHY_ITEMS.map((it, i) => {
            const on = !lit || lit[i]
            return (
              <li key={it.id} className="why__item">
                <div className="why__face" data-zone="art" aria-hidden="true">
                  <div className="why__art">
                    <LottieIcon animationPath={it.lottie} size={220} playOnHover={false} loop active={on ? undefined : false} />
                  </div>
                  <span className="why__off" />
                </div>
                <h3 data-zone="text">{it.title}</h3>
                <p data-zone="text">{it.line}</p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
