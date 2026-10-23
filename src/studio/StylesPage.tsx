// /styles/: the site's content in five styles, each a careful re-reading of an award-winning site's
// signal, translated into our world. The visitor picks a style and the page turns into it live
// (View Transitions, each style its own entrance); the pick rides into the WhatsApp message and the form.
// The main site stays the sea of dots; nothing of this page loads there.
import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState, type ComponentType } from 'react'
import { flushSync } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import SEO from '../components/SEO'
import Logo from '../components/ui/Logo'
import { useMotionEngine } from '../motion/ScrollEngineProvider'
import { byId, CHAPTERS, STYLES, type StyleDef, type StyleModule, type StyleProps } from './registry'
import { useTier, tierNow } from './motion'
import Guide, { STUDIO_PLAN } from './Guide'
import WorldMap from './WorldMap'
import SoundButton from './SoundButton'
import { dimWorld, isSoundOn, leaveWorlds, onSoundChange, preloadSound, setSoundOn, setWorld } from './sound'
import SoundInvite, { type SoundSource } from './SoundInvite'
import { resumeMusic, yieldMusic } from '../look/sea/sound'

type PickAt = { x: number; y: number }
import { getCurtain, prepareCurtain } from './curtain'
import { fitNames, listenParent, PREVIEW, tellParent, useHero } from './preview'
import { liftTurnCover } from '../look/sea/SeaTurn'
import './studio.css'

const AccessibilityWidget = lazy(() => import('../components/ui/AccessibilityWidget'))
const CookieConsent = lazy(() => import('../components/ui/CookieConsent'))

/** The prerendered page (no JS yet, or the first chunk in flight): shown as it was painted. */
const PRERENDERED = (() => {
  if (typeof document === 'undefined' || PREVIEW) return ''
  const main = document.getElementById('main-content')
  const here = window.location.pathname.replace(/\/+$/, '')
  return main?.dataset.route === '/styles' && here === '/styles' ? main.innerHTML : ''
})()

// the worlds' music for the invitation (D199); [קופי: נתי] the track names
const STUDIO_SOUND: SoundSource = { isOn: isSoundOn, turnOn: () => setSoundOn(true), subscribe: onSoundChange, prepare: preloadSound }
const TRACK: Record<string, string> = { flight: 'Cinematic ambient', buzz: 'Sunny lo-fi', blueprint: 'Felt piano · minimal', clay: 'Morning tape', depth: 'Deep ambient · sonar' }

const fromUrl = () => (typeof window === 'undefined' ? null : new URLSearchParams(window.location.search).get('s'))

/** Fonts first: a style never shows in a fallback face. Never waits longer than 1.6 s. */
const prepare = (m: StyleModule) => Promise.race([(m.prepare?.() ?? Promise.resolve()).catch(() => undefined), new Promise((r) => setTimeout(r, 1600))])

/** The chapter under the reading line, so a switch lands on the same content in the new style. */
function chapterNow(): string {
  // (D215) below a world's scroll padding (depth's scanner window on phones) the reading line moves down with it
  const pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0
  const line = Math.max(window.innerHeight * 0.42, pad + (window.innerHeight - pad) * 0.25)
  for (const id of CHAPTERS) {
    const el = document.querySelector<HTMLElement>(`[data-ch="${id}"]`)
    const r = el?.getBoundingClientRect()
    if (r && r.top <= line && r.bottom > line) return id
  }
  return 'hero'
}

function setTheme(colour: string) {
  let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  if (!meta) { meta = document.createElement('meta'); meta.name = 'theme-color'; document.head.appendChild(meta) }
  meta.content = colour
}

export default function StylesPage() {
  const [def, setDef] = useState<StyleDef>(() => byId(fromUrl()))
  const [Page, setPage] = useState<ComponentType<StyleProps> | null>(null)
  const [busy, setBusy] = useState(false)
  const [widgets, setWidgets] = useState(false)
  const [map, setMap] = useState(false)
  const [title, setTitle] = useState<{ def: StyleDef; out: boolean } | null>(null)
  const tier = useTier()
  const engine = useMotionEngine()
  const navigate = useNavigate()
  const lock = useRef(false)
  // a visitor who just came through the guide on the main site is not offered it again right away
  const plan = useRef(typeof window !== 'undefined' && window.__studioArrival ? { ...STUDIO_PLAN, first: 30000 } : STUDIO_PLAN)

  // the first style: its chunk and fonts, then the page (the prerendered one stands until then)
  useEffect(() => {
    let live = true
    def.load().then(async (m) => { await prepare(m); if (live) setPage(() => m.default) })
    // build the wave at idle, so the first switch never waits on a compile
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback
    // and the other styles' chunks and fonts, so the wave never waits on the network either
    if (tierNow() !== 'still') (idle ?? ((cb: () => void) => window.setTimeout(cb, 1200)))(() => {
      if (!PREVIEW) prepareCurtain()
      window.setTimeout(() => STYLES.forEach((s) => { if (s.id !== def.id) void s.load().then(prepare).catch(() => {}) }), 2500)
    })
    const id = window.setTimeout(() => setWidgets(true), 1800)
    return () => { live = false; clearTimeout(id) }
  }, [])

  // one music at a time (D199): the site's lo-fi gives way to the worlds' tracks; a visitor who was
  // listening keeps listening (the world's track rises in its place), and on the way out it goes back
  useEffect(() => {
    if (PREVIEW) return
    // reached from the home's style cards through the page turn: open at once (D217)
    liftTurnCover()
    if (yieldMusic(0.8) && tierNow() !== 'still') setSoundOn(true)
    return () => {
      const was = isSoundOn()
      leaveWorlds()
      if (was) resumeMusic(1.6)
    }
  }, [])

  useEffect(() => {
    const html = document.documentElement
    html.dataset.style = def.id
    setTheme(def.theme)
    if (!PREVIEW) setWorld(def.id)
    return () => { delete html.dataset.style }
  }, [def])

  // arriving from the main site through the wave (D192): the world is ready, its name shows, the wave opens
  useEffect(() => {
    if (!Page || !window.__studioArrival) return
    delete window.__studioArrival
    const wave = getCurtain()
    if (!wave) return
    setTitle({ def, out: false })
    const id = window.setTimeout(() => { setTitle({ def, out: true }); void wave.reveal(tier === 'calm' ? 560 : 980).then(() => setTitle(null)) }, 650)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Page])

  // (D217) inside the frame of /your-site/: a world goes on air on the parent's word, at once (the wall
  // around the frame is the transition); the last word wins when the visitor swipes fast
  const want = useRef(def.id)
  const words = useHero()
  useEffect(() => listenParent((id) => {
    const next = byId(id)
    want.current = next.id
    void next.load().then(async (m) => {
      await prepare(m)
      if (want.current !== next.id) return
      flushSync(() => { setDef(next); setPage(() => m.default) })
      window.scrollTo(0, 0)
    })
  }), [])
  // on air: once the world is painted (a WebGL world once its first frame is drawn, 1.8 s at most), the
  // name fits its line and the parent is told
  useEffect(() => {
    if (!PREVIEW || !Page) return
    let live = true
    const id = def.id
    const t0 = performance.now()
    const wait = () => {
      if (!live) return
      const root = document.querySelector('.st-main > *')
      if (root?.matches('.fl, .cl') && !root.hasAttribute('data-live') && performance.now() - t0 < 1800) { requestAnimationFrame(wait); return }
      fitNames()
      // a world whose name sits below its first screen (clay's paper under the room) names the frame to show
      const at = document.querySelector<HTMLElement>('[data-pv-at]')
      const y = at ? Math.max(0, at.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.4) : 0
      if (engine?.lenis) engine.lenis.scrollTo(y, { immediate: true, force: true })
      else window.scrollTo(0, y)
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (!live) return
        const h = document.querySelector('.st-main h1')?.getBoundingClientRect()
        tellParent({ type: 's60:ready', style: id, h1: h ? { top: Math.round(h.top), bottom: Math.round(h.bottom) } : undefined })
      }))
    }
    requestAnimationFrame(wait)
    return () => { live = false }
  }, [Page, def, engine, words])
  useLayoutEffect(() => { if (PREVIEW && Page) fitNames() }, [words, Page])

  const land = (ch: string) => {
    const el = document.querySelector<HTMLElement>(`[data-ch="${ch}"]`)
    if (ch === 'hero' || !el) {
      if (engine?.lenis) engine.lenis.scrollTo(0, { immediate: true, force: true })
      else window.scrollTo(0, 0)
      return
    }
    // a world may name the element to land on inside a chapter (depth: its heading, so the words show below the veil)
    const at = el.querySelector<HTMLElement>('[data-land]') ?? el
    if (engine?.lenis) engine.lenis.scrollTo(at, { immediate: true, force: true })
    else at.scrollIntoView({ block: 'start' })
  }

  const swapTo = (next: StyleDef, Mod: ComponentType<StyleProps>, ch: string) => {
    flushSync(() => { setDef(next); setPage(() => Mod) })
    land(ch)
    const url = new URL(window.location.href)
    url.searchParams.set('s', next.id)
    window.history.replaceState(window.history.state, '', url)
  }

  async function choose(next: StyleDef, at: PickAt) {
    if (lock.current || next.id === def.id) return
    lock.current = true
    setBusy(true)
    const ch = chapterNow()
    const loading = next.load().then(async (m) => { await prepare(m); return m })
    const wave = tier === 'still' ? null : getCurtain()
    if (wave) {
      // the wave (D188): it floods the screen in the new colours, the page changes under it, the name
      // shows, and a second wave breaks into squares to open the new style
      const calm = tier === 'calm'
      // the music dips as the wave rises; the new world's track rises as it opens (setWorld, music/engine)
      dimWorld(calm ? 520 : 820)
      await wave.cover(at, { from: def.ground, to: next.ground, ink: next.ink }, calm ? 520 : 820)
      const mod = await loading
      setTitle({ def: next, out: false })
      swapTo(next, mod.default, ch)
      await new Promise((r) => setTimeout(r, calm ? 220 : 560))
      setTitle({ def: next, out: true })
      await wave.reveal(calm ? 560 : 980)
      setTitle(null)
    } else {
      const mod = await loading
      const html = document.documentElement
      html.style.setProperty('--vt-x', `${at.x}px`)
      html.style.setProperty('--vt-y', `${at.y}px`)
      html.dataset.vt = next.id
      const doc = document as Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } }
      if (tier !== 'still' && doc.startViewTransition) await doc.startViewTransition(() => swapTo(next, mod.default, ch)).finished.catch(() => {})
      else swapTo(next, mod.default, ch)
      delete html.dataset.vt
    }
    lock.current = false
    setBusy(false)
  }

  // back to the main site (D199, Nati: there was no way back): the wave in the sea's colours, the world's
  // music falling away, the site's own coming back (the cleanup above), without a page load
  async function goHome(e: { preventDefault: () => void }) {
    e.preventDefault()
    if (lock.current) return
    lock.current = true
    setMap(false)
    const wave = tier === 'still' ? null : getCurtain()
    if (wave) {
      dimWorld(760)
      await wave.cover({ x: window.innerWidth / 2, y: 40 }, { from: def.ground, to: '#0f1011', ink: '#ede7da' }, tier === 'calm' ? 520 : 760)
      navigate('/')
      window.setTimeout(() => { void wave.reveal(tier === 'calm' ? 520 : 900) }, 420)
    } else navigate('/')
  }

  if (PREVIEW) {
    return (
      <div className="st st--preview" data-tier={tier}>
        {/* the visitor's site: their name as the wordmark, a menu that is only drawn */}
        <header className="st-bar st-pv" aria-hidden="true">
          <bdi className="st-pv__brand" style={{ ['--pv-face' as string]: def.face }}>{words.brand}</bdi>
          <span className="st-pv__menu"><i /><i /><i /></span>
        </header>
        <main id="main-content" className="st-main">
          {Page && <Page key={def.id} tier={tier} def={def} />}
        </main>
      </div>
    )
  }

  return (
    <div className="st" data-tier={tier}>
      <SEO
        title="סטודיו הסגנונות"
        description="אותו אתר בחמישה סגנונות. בוחרים סגנון, רואים את האתר משתנה מול העיניים, ושולחים לנו הודעה עם הכיוון שאהבתם."
        canonical="/styles/"
      />
      <a className="st-skip" href="#main-content">דלג לתוכן הראשי</a>
      <header className="st-bar">
        <a className="st-bar__home" href="/" aria-label="MediaWave, לדף הבית" onClick={goHome}><Logo variant="compact" decorative /></a>
        {/* the always-there way to the worlds (keyboard, screen readers, anyone who missed the guide) */}
        <button type="button" className="st-bar__worlds" lang="en" dir="ltr" onClick={() => setMap(true)} aria-haspopup="dialog" aria-label="מפת העולמות: בחירת סגנון">
          ( Worlds<span className="st-bar__n"> · {String(STYLES.length).padStart(2, '0')}</span> )
        </button>
        {/* [קופי: נתי] the plain way back, beside the worlds */}
        <a className="st-bar__worlds st-bar__back" href="/" lang="en" dir="ltr" onClick={goHome} aria-label="חזרה לאתר הראשי">( Home )</a>
        <SoundButton />
      </header>

      <main id="main-content" className="st-main">
        {Page
          ? <Page key={def.id} tier={tier} def={def} />
          : PRERENDERED
            ? <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: PRERENDERED }} />
            : <div style={{ minHeight: '120vh' }} aria-hidden="true" />}
      </main>

      <footer className="st-foot">
        <nav aria-label="מסמכים">
          <a href="/terms/">תקנון שימוש</a>
          <a href="/privacy/">מדיניות פרטיות</a>
          <a href="/accessibility/">הצהרת נגישות</a>
          <a href="/" lang="en" dir="ltr" onClick={goHome}>( Back to the site + )</a>
        </nav>
      </footer>

      {title && (
        <div className="st-title" data-out={title.out || undefined} style={{ ['--st-t-ink' as string]: title.def.ink }} aria-hidden="true">
          <span className="st-title__name" style={{ font: title.def.face }}>
            {[...title.def.name].map((ch, i) => <span key={i} style={{ ['--k' as string]: i }}>{ch}</span>)}
          </span>
          <span className="st-title__by">{title.def.feel}</span>
        </div>
      )}
      <Guide color={def.guide ?? def.ink} tier={tier} open={map || busy} onOpen={() => setMap(true)} plan={plan.current} />
      {map && <WorldMap current={def} onClose={() => setMap(false)} onPick={(s, at) => { setMap(false); void choose(s, at) }} onHome={(e) => void goHome(e)} />}
      {tier !== 'still' && def.id !== 'clay' && <SoundInvite track={TRACK[def.id] ?? 'Music'} source={STUDIO_SOUND} cue={def.id} />}

      {widgets && (
        <aside aria-label="כלים">
          <Suspense fallback={null}><AccessibilityWidget /></Suspense>
          <Suspense fallback={null}><CookieConsent /></Suspense>
        </aside>
      )}
    </div>
  )
}
