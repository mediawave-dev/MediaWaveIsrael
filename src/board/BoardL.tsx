// Direction L · בית הבובות (the dollhouse cutaway). Dev-only. direction-bank.md D-15 (Hotel 1,
// Place Vendôme's guided tour; Esimple's room by room story). MediaWave's studio as a
// three-storey building cut open: six rooms, one per service, each painted its own colour.
// The hero shows the whole house with the video on the living-room screen. In the services
// hold the camera flies into one room after another, then pulls back to the whole house.

import { useScene, useMotionEngine } from '../motion/ScrollEngineProvider'
import { SERVICES, HERO, NAV, HeroMedia, ServiceArt, BoardNav, useDocBackground, StateButton, ButtonLab, type StateButtonProps, type BoardService } from './shared'
import './fonts.css'
import './lab.css'
import './board-l.css'

/** Rooms by service; [קופי: נתי] for the names */
const ROOMS = ['חדר העבודה', 'חדר הדפים', 'הספרייה', 'עמדת השיחות', 'חדר העריכה', 'חדר האלבומים']

/** The door button: a little door beside the label swings open on its hinge to show the light. */
function DoorButton(p: StateButtonProps) {
  return (
    <StateButton {...p} cls="door" render={(label, state) => (
      <>
        <span className="door__frame" aria-hidden="true"><span className="door__leaf" /></span>
        <span className="door__label" aria-live="polite">{state === 'sent' && <span aria-hidden="true">✓ </span>}{label}</span>
      </>
    )} />
  )
}

function Room({ s, i, art }: { s?: BoardService; i: number; art?: boolean }) {
  return (
    <div className={`l-room l-room--${i}`} data-i={i}>
      <span className="l-room__window" aria-hidden="true" />
      <span className="l-room__furn" aria-hidden="true"><i /><i /></span>
      <div className="l-room__frame">{art && s ? <ServiceArt service={s} size={200} /> : null}</div>
      {s && art && (
        <div className="l-plaque">
          <p className="l-plaque__room">{ROOMS[i]}</p>
          <h3>{s.title}</h3>
          <p>{s.line}</p>
          <a href={`/services/${s.slug}`}>לפרטים</a>
        </div>
      )}
    </div>
  )
}

export default function BoardL() {
  useDocBackground('#E4E1DA')
  return (
    <div className="bd-l" dir="rtl" lang="he">
      <header className="l-head">
        <a href="/board/l" className="l-head__logo" aria-label="MediaWave">
          <img src="/logo-lockup-ink.svg" alt="MediaWave" width="150" height="30" />
        </a>
        <nav className="l-head__nav" aria-label="ראשי">{NAV.map((n) => <a key={n} href="#services">{n}</a>)}</nav>
        <DoorButton href="#lab" size="sm">{HERO.headerCta}</DoorButton>
      </header>

      <main>
        <section className="l-hero" aria-label="ראשי">
          <div className="l-hero__copy">
            <h1 className="l-hero__title"><span>{HERO.line1}</span><span>{HERO.line2}</span></h1>
            <p className="l-hero__sub">{HERO.sub}</p>
            <DoorButton href="#lab">{HERO.cta}</DoorButton>
          </div>
          <div className="l-house l-house--hero" aria-hidden="true">
            <span className="l-roof" />
            <div className="l-floors">
              {SERVICES.map((s, i) => (
                i === 0
                  ? <div className="l-room l-room--0 l-room--tv" key={s.id}><span className="l-room__window" /><div className="l-tv"><HeroMedia className="l-tv__media" /></div><span className="l-room__furn"><i /><i /></span></div>
                  : <Room key={s.id} i={i} />
              ))}
            </div>
            <span className="l-ground" />
          </div>
        </section>

        <Tour />
        <ButtonLab Btn={DoorButton} title="הכפתור: דלת" note="ריחוף: הדלת הקטנה נפתחת על הציר שלה ומאחוריה אור. לחיצה: היא נטרקת. בטלפון יש רק את הלחיצה." />
      </main>
      <BoardNav tone="light" />
    </div>
  )
}

/* ───────────── signature: the camera visits room after room ───────────── */

function Tour() {
  const engine = useMotionEngine()
  const holdRef = useScene<HTMLDivElement>((e, root) => {
    if (e.REDUCE) return
    const stage = root.querySelector<HTMLElement>('.l-tour__stage')!
    const house = root.querySelector<HTMLElement>('.l-house--tour')!
    const rooms = [...house.querySelectorAll<HTMLElement>('.l-room')]
    type Cam = { x: number; y: number; s: number }
    let cams: Cam[] = []
    const measure = () => {
      const W = stage.clientWidth, H = stage.clientHeight
      const HW = house.offsetWidth, HH = house.offsetHeight
      const whole = Math.min(W / HW, H / HH) * 0.9
      const view = (cx: number, cy: number, s: number): Cam => ({ x: W / 2 - cx * s, y: H / 2 - cy * s, s })
      cams = [view(HW / 2, HH / 2, whole)]
      rooms.forEach((r) => {
        const s = Math.min(W / r.offsetWidth, H / r.offsetHeight) * 0.92
        cams.push(view(r.offsetLeft + r.offsetWidth / 2, r.offsetTop + r.offsetHeight / 2, s))
      })
      cams.push(cams[0])
    }
    const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
    let last = -2
    const place = (p: number) => {
      if (!cams.length) return
      const segs = cams.length - 1
      const f = Math.min(segs - 1e-6, p * segs)
      const k = Math.floor(f)
      // each stop: a short flight (first 45%), then a hold on the room
      const t = ease(Math.min(1, (f - k) / 0.45))
      const A = cams[k], B = cams[k + 1]
      const c = { x: A.x + (B.x - A.x) * t, y: A.y + (B.y - A.y) * t, s: A.s + (B.s - A.s) * t }
      house.style.transform = `translate(${c.x.toFixed(1)}px, ${c.y.toFixed(1)}px) scale(${c.s.toFixed(4)})`
      const i = t > 0.5 ? k : k - 1 // the room we are in, or -1 for the whole house
      const active = i >= 0 && i < rooms.length ? i : -1
      if (active !== last) { stage.dataset.active = String(active); last = active }
    }
    const tl = e.holdTimeline(root, { id: 'l-tour', scrub: e.CALM ? true : 0.6, onUpdate: (self) => place(self.progress) })
    tl.to({}, { duration: 1 })
    measure(); place(0)
    const onRefresh = () => { measure(); place(tl.scrollTrigger?.progress ?? 0) }
    e.ScrollTrigger.addEventListener('refresh', onRefresh)
    return () => e.ScrollTrigger.removeEventListener('refresh', onRefresh)
  })

  return (
    <section id="services" className={`l-tour${engine?.REDUCE ? ' l-tour--still' : ''}`} aria-labelledby="l-tour-h">
      <div className="l-tour__intro">
        <h2 id="l-tour-h">מה אנחנו עושים</h2>
        <p>שישה חדרים בבית אחד. גוללים, ונכנסים לכל אחד.</p>{/* [קופי: נתי] */}
      </div>
      <div className="l-tour__hold" ref={holdRef}>
        <div className="l-tour__stage" data-active="-1">
          <div className="l-house l-house--tour">
            <span className="l-roof" aria-hidden="true" />
            <div className="l-floors">
              {SERVICES.map((s, i) => <Room key={s.id} s={s} i={i} art />)}
            </div>
            <span className="l-ground" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  )
}
