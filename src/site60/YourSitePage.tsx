// /your-site/: "האתר שלכם ב-60 שניות" (D217). A business owner picks their trade, types the business name
// and sees the opening of their own site at once, live, in each of the studio's five worlds; they pick a
// world, say what to build, and one tap opens WhatsApp with everything already written. The result is
// never held behind a form (Huemor's calculator lesson, without the gate), and the one action is always
// one tap away (Metabole's lesson: a winner that buried its action lost meetings).
// Its own shell, outside Layout (like /styles/): no sea, no chat; one lazy chunk, nothing on the home page.
import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useNavigationType } from 'react-router-dom'
import SEO from '../components/SEO'
import Logo from '../components/ui/Logo'
import DotGlyph from '../look/sea/DotGlyph'
import { track } from '../utils/analytics'
import { WHATSAPP_URLS } from '../utils/whatsapp'
import { openAccessibility } from '../components/ui/a11y-event'
import { setText } from '../utils/set-text'
import { liftTurnCover } from '../look/sea/SeaTurn'
import { useTier } from '../studio/motion'
import { STYLE_META } from '../studio/styles-meta'
import { cleanText, fieldById, LINE_MAX, NAME_MAX, type BuildId, type FieldId } from '../data/site-in-60'
import Air, { AIR_H, AIR_W, type Ready, type Slot } from './Air'
import Wall, { ScreenCard } from './Wall'
import { BuildStep, FieldStep, Key, NameStep } from './Steps'
import { waFor } from './message'
import '@fontsource/bellefair/hebrew-400.css'
import '@fontsource/bellefair/latin-400.css'
import '@fontsource/heebo/hebrew-700.css'
import '@fontsource/heebo/latin-700.css'
import '@fontsource/ibm-plex-sans-hebrew/hebrew-700.css'
import '@fontsource/ibm-plex-sans-hebrew/latin-700.css'
import '@fontsource/karantina/hebrew-700.css'
import '@fontsource/karantina/latin-700.css'
import '@fontsource/assistant/hebrew-800.css'
import '@fontsource/assistant/latin-800.css'
import './s60.css'

const AccessibilityWidget = lazy(() => import('../components/ui/AccessibilityWidget'))
const CookieConsent = lazy(() => import('../components/ui/CookieConsent'))

type Step = 'field' | 'name' | 'style' | 'build'
const ORDER: Step[] = ['field', 'name', 'style', 'build']
const DESK = 900
const tc = (ms: number) => { const s = Math.floor(ms / 1000); return `00:${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}` }

/** The tape's timecode (the video world's clock): the visitor's own time, from the first tap to the
    message. True data; it holds still under the stop switch and ?reduce=1 (WCAG 2.2.2), like the
    home's clock. */
function useStopwatch(still: boolean) {
  const [from, setFrom] = useState<number | null>(null)
  const [to, setTo] = useState<number | null>(null)
  const el = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (from === null) { setText(el.current, tc(0)); return }
    if (to !== null || still) { setText(el.current, tc((to ?? Date.now()) - from)); return }
    const tick = () => setText(el.current, tc(Date.now() - from))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [from, to, still])
  return {
    el,
    start: () => setFrom((f) => f ?? Date.now()),
    stop: () => setTo((t) => t ?? Date.now()),
    reset: () => { setFrom(null); setTo(null) },
    took: from !== null && to !== null ? tc(to - from) : null,
  }
}

export default function YourSitePage() {
  const tier = useTier()
  const location = useLocation()
  const navigate = useNavigate()
  const first = useMemo(() => new URLSearchParams(location.search), []) // eslint-disable-line react-hooks/exhaustive-deps
  // an ad can open on a trade (?field=food) and a world (?s=clay)
  const [field, setField] = useState<FieldId | null>(() => fieldById(first.get('field'))?.id ?? null)
  const [name, setName] = useState('')
  const [line, setLine] = useState('')
  const [styleIdx, setStyleIdx] = useState(() => Math.max(0, STYLE_META.findIndex((s) => s.id === first.get('s'))))
  const [build, setBuild] = useState<BuildId | null>(null)
  const [sent, setSent] = useState(false)
  const [widgets, setWidgets] = useState(false)
  const heading = useRef<HTMLHeadingElement>(null)
  const clock = useStopwatch(tier === 'still')
  /** a trade was just tapped: a second tap during the card's fill is not a second step */
  const leaving = useRef(false)

  // the step lives in the history, so the phone's own back goes one question back
  const asked = (location.state as { s60?: Step } | null)?.s60
  const clean = cleanText(name, NAME_MAX).trim()
  const step: Step = (() => {
    const want = asked && ORDER.includes(asked) ? asked : field ? 'name' : 'field'
    if (want !== 'field' && !field) return 'field'
    if ((want === 'style' || want === 'build') && !clean) return 'name'
    return want
  })()
  useEffect(() => {
    if (asked !== step) navigate(`${location.pathname}${location.search}`, { replace: true, state: { s60: step } })
  }, [asked, step]) // eslint-disable-line react-hooks/exhaustive-deps
  // how many questions this visit pushed: Back pops one of them, or steps back in place when the visit
  // opened on a later question (an ad's ?field=)
  const depth = useRef(0)
  const navType = useNavigationType()
  useEffect(() => { if (navType === 'POP') depth.current = Math.max(0, depth.current - 1) }, [location.key]) // eslint-disable-line react-hooks/exhaustive-deps
  const goTo = useCallback((s: Step) => {
    depth.current += 1
    navigate(`${location.pathname}${location.search}`, { state: { s60: s } })
  }, [navigate, location.pathname, location.search])

  // each question starts at the top, with the reader on its heading (the name: on its field)
  const seen = useRef(false)
  useEffect(() => {
    window.scrollTo(0, 0)
    if (seen.current && step !== 'name') heading.current?.focus({ preventScroll: true })
    seen.current = true
  }, [step])

  useEffect(() => {
    const html = document.documentElement
    html.classList.add('s60-on')
    liftTurnCover()
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    const was = meta?.content
    if (meta) meta.content = '#0f1011'
    const id = window.setTimeout(() => setWidgets(true), 1800)
    return () => { html.classList.remove('s60-on'); if (meta && was) meta.content = was; clearTimeout(id) }
  }, [])

  // the frame of the real studio loads once the visitor is past the trade, while they type
  const [air, setAir] = useState(false)
  useEffect(() => {
    if (step === 'field' || air) return
    const id = window.setTimeout(() => setAir(true), 450)
    // the five faces for the wall's screens, before the wall
    STYLE_META.forEach((s) => { void document.fonts.load(s.face.replace('1em', '40px'), 'אבג').catch(() => {}) })
    return () => clearTimeout(id)
  }, [step, air])

  const style = STYLE_META[styleIdx]
  const words = useMemo(() => ({ name: clean, field: field ?? 'other', line: cleanText(line, LINE_MAX).trim() }), [clean, field, line])
  const [live, setLive] = useState<Ready | null>(null)
  const [turning, setTurning] = useState(false)
  const [wallSlot, setWallSlot] = useState<Slot | null>(null)
  const sheet = useRef<HTMLDivElement>(null)
  const [vp, setVp] = useState(() => ({ w: typeof window === 'undefined' ? 390 : window.innerWidth, h: typeof window === 'undefined' ? 844 : window.innerHeight }))
  useEffect(() => {
    const on = () => setVp({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])

  // chosen: the site takes the screen (Jesper's take-over). On a phone it fills the width at its true
  // size, with its heading in the part the sheet leaves open; on a desk it stands as a tall phone beside
  // the last question.
  const [sheetH, setSheetH] = useState(0)
  useEffect(() => {
    if (step !== 'build' || !sheet.current) return
    const ro = new ResizeObserver(() => setSheetH(sheet.current?.offsetHeight ?? 0))
    ro.observe(sheet.current)
    return () => ro.disconnect()
  }, [step])
  const takeSlot = useMemo<Slot>(() => {
    if (vp.w >= DESK) {
      const h = Math.min(vp.h - 112, 760)
      const w = (h * AIR_W) / AIR_H
      return { x: Math.round(vp.w * 0.3 - w / 2), y: Math.round((vp.h - h) / 2 + 24), w, r: 22, animate: true, fixed: true }
    }
    const k = vp.w / AIR_W
    const open = Math.max(160, vp.h - sheetH)
    const mid = live?.style === style.id && live.h1 ? ((live.h1.top + live.h1.bottom) / 2) * k : open / 2
    const y = Math.min(0, Math.max(open - AIR_H * k, open / 2 - mid))
    return { x: 0, y: Math.round(y), w: vp.w, r: 0, animate: true, fixed: true }
  }, [vp, sheetH, live, style.id])

  // nothing a step holds outlives it: the wall's turn, the sent note (Back from it asks the question again)
  useEffect(() => {
    if (step !== 'style') setTurning(false)
    if (step !== 'build') setSent(false)
  }, [step])

  const slot = step === 'style' ? wallSlot : step === 'build' ? takeSlot : null
  const onAir = live?.style === style.id && !turning

  const choice = field && clean && build ? { field, name: clean, line: words.line, style: style.id, build } : null
  const fieldLabel = fieldById(field)?.label ?? ''

  const index = ORDER.indexOf(step)
  return (
    <div className="s60" data-step={step} data-tier={tier}>
      <SEO
        title="האתר שלכם ב-60 שניות"
        description="בוחרים תחום, כותבים את שם העסק ורואים מיד את הפתיחה של האתר שלכם בחמישה סגנונות. בסוף שולחים לנו הכל בהודעה אחת בוואטסאפ."
        canonical="/your-site/"
      />
      <a className="s60-skip" href="#main-content">דלג לתוכן הראשי</a>
      <header className="s60-bar">
        <a className="s60-bar__home" href="/" aria-label="MediaWave, לדף הבית"><Logo variant="compact" decorative /></a>
        <div className="s60-bar__end">
          {index > 0 && (
            <button type="button" className="s60-bar__btn" lang="en" dir="ltr" aria-label="חזרה לשאלה הקודמת"
              onClick={() => (depth.current > 0 ? navigate(-1) : navigate(`${location.pathname}${location.search}`, { replace: true, state: { s60: ORDER[index - 1] } }))}>( →<span className="s60-bar__bw"> Back</span> )</button>
          )}
          <button type="button" className="s60-bar__wa" aria-label="תפריט נגישות" aria-haspopup="dialog" onClick={(e) => openAccessibility(e.currentTarget)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="4.5" r="2.5" /><path d="M12 7v5" /><path d="M6 10l6 2 6-2" /><path d="M9 22l3-8 3 8" /><path d="M7 17h10" />
            </svg>
          </button>
          <a className="s60-bar__wa" href={WHATSAPP_URLS.general} target="_blank" rel="noopener noreferrer" aria-label="כתבו לנו בוואטסאפ"
            onClick={() => track('whatsapp_click', { location: 's60_bar' })}>
            <DotGlyph name="wa" className="s60-bar__wa-g" />
          </a>
          <span className="s60-bar__n" lang="en" dir="ltr" aria-hidden="true">{String(index + 1).padStart(2, '0')} / 04</span>
          {tier !== 'still' && (
            <span className="s60-bar__tc" lang="en" dir="ltr" aria-hidden="true" data-on={clock.took ? undefined : step !== 'field' || undefined}><span ref={clock.el}>00:00:00</span></span>
          )}
        </div>
        <span className="s60-bar__line" aria-hidden="true">{ORDER.map((s, i) => <i key={s} data-on={i <= index || undefined} />)}</span>
      </header>

      <main id="main-content" className="s60-main">
        {step !== 'field' && <h1 className="s60-sr">האתר שלכם ב-60 שניות</h1>}
        <p className="s60-sr" aria-live="polite">{`שאלה ${index + 1} מתוך 4`}</p>
        {step === 'field' && (
          <FieldStep value={field} headingRef={heading} onPick={(f) => {
            if (leaving.current) return
            leaving.current = true
            window.setTimeout(() => { leaving.current = false }, 600)
            setField(f)
            clock.start()
            track('cta_click', { location: `s60_field_${f}` })
            window.setTimeout(() => goTo('name'), tier === 'still' ? 0 : 260)
          }} />
        )}
        {step === 'name' && (
          <NameStep name={name} line={line} onName={setName} onLine={setLine} headingRef={heading} onNext={() => { track('cta_click', { location: 's60_name' }); goTo('style') }} />
        )}
        {step === 'style' && (
          <section className="s60-step s60-style" aria-labelledby="s60-q3">
            <header className="s60-head">
              <h2 id="s60-q3" className="s60-q" ref={heading} tabIndex={-1}>באיזה סגנון?</h2>
            </header>
            <Wall
              index={styleIdx}
              onIndex={setStyleIdx}
              onChoose={() => { track('cta_click', { location: `s60_style_${style.id}` }); goTo('build') }}
              onTurning={setTurning}
              onSlot={setWallSlot}
              name={clean}
              kicker={fieldById(field)?.kicker ?? ''}
              tier={tier}
              live={onAir}
            />
            <div className="s60-ctl">
              <button type="button" className="s60-arrow" aria-label="הסגנון הקודם" onClick={() => setStyleIdx((i) => (i + STYLE_META.length - 1) % STYLE_META.length)}>
                <span aria-hidden="true">→</span>
              </button>
              <p className="s60-now" aria-live="polite">
                <span className="s60-now__n" lang="en" dir="ltr" aria-hidden="true">{String(styleIdx + 1).padStart(2, '0')} / {String(STYLE_META.length).padStart(2, '0')}</span>
                <span className="s60-now__name">{style.name}</span>
                <span className="s60-sr">{`, סגנון ${styleIdx + 1} מתוך ${STYLE_META.length}: `}</span>
                <span className="s60-now__feel">{style.feel}</span>
              </p>
              <button type="button" className="s60-arrow" aria-label="הסגנון הבא" onClick={() => setStyleIdx((i) => (i + 1) % STYLE_META.length)}>
                <span aria-hidden="true">←</span>
              </button>
            </div>
            <div className="s60-actions">
              <Key onClick={() => { track('cta_click', { location: `s60_style_${style.id}` }); goTo('build') }}>זה הסגנון שלי</Key>
            </div>
            <p className="s60-fine s60-fine--c">מחליקים בין הסגנונות. הטקסט לדוגמה, ואת האמיתי כותבים יחד.</p>
          </section>
        )}
        {step === 'build' && (
          <div className="s60-sheet" ref={sheet}>
            {sent ? (
              <section className="s60-step s60-done" aria-labelledby="s60-done-t">
                <h2 id="s60-done-t" className="s60-q" ref={heading} tabIndex={-1}>ההודעה מחכה לכם בוואטסאפ.</h2>
                <p className="s60-lede">שולחים אותה, ואנחנו חוזרים אליכם עם הצעה כתובה.</p>
                {clock.took && <p className="s60-took" lang="en" dir="ltr">( YOUR SITE IN {clock.took} )</p>}
                {choice && <Key href={waFor(choice)} wa className="s60-key--wa">לפתוח שוב את ההודעה</Key>}
                <button type="button" className="s60-again" lang="en" dir="ltr" onClick={() => { setSent(false); setBuild(null); clock.reset(); goTo('field') }}>( Start over )</button>
              </section>
            ) : (
              <BuildStep
                value={build}
                headingRef={heading}
                onPick={(b) => { setBuild(b); track('cta_click', { location: `s60_build_${b}` }) }}
                waHref={choice ? waFor(choice) : null}
                onSend={() => { clock.stop(); track('whatsapp_click', { location: 's60_send' }); window.setTimeout(() => setSent(true), 400) }}
                summary={{ name: clean, field: fieldLabel, style: style.name }}
              />
            )}
          </div>
        )}
        {/* chosen, and the world never came on air (no WebGL, a slow line): its card holds the place */}
        {step === 'build' && !onAir && (
          <div className="s60-scr s60-take" aria-hidden="true" style={{
            transform: `translate3d(${takeSlot.x}px, ${takeSlot.y}px, 0) scale(${takeSlot.w / AIR_W})`,
            ['--g' as string]: style.ground, ['--k' as string]: style.ink, ['--face' as string]: style.face,
          }}>
            <ScreenCard name={clean} kicker={fieldById(field)?.kicker ?? ''} />
          </div>
        )}
        {/* inside main (its own layer, z-index 1 in the site's base CSS): over the wall, under the sheet */}
        {air && (
          <Air
            style={style.id}
            words={words}
            slot={slot}
            show={(step === 'style' || step === 'build') && !turning}
            onReady={setLive}
          />
        )}
      </main>

      {widgets && (
        <aside aria-label="כלים">
          <Suspense fallback={null}><AccessibilityWidget /></Suspense>
          {/* the cookie note gates nothing here (the analytics set no cookie): it waits until the message
              is on its way, so it never covers the flow's one key */}
          {sent && <Suspense fallback={null}><CookieConsent /></Suspense>}
        </aside>
      )}
    </div>
  )
}
