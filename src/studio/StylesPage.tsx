// /styles/: the site's content in four styles, each a careful re-reading of an award-winning site's
// signal, translated into our world. The visitor picks a style and the page turns into it live
// (View Transitions, each style its own entrance); the pick rides into the WhatsApp message and the form.
// The main site stays the sea of dots; nothing of this page loads there.
import { lazy, Suspense, useEffect, useRef, useState, type ComponentType } from 'react'
import { flushSync } from 'react-dom'
import SEO from '../components/SEO'
import Logo from '../components/ui/Logo'
import { useMotionEngine } from '../motion/ScrollEngineProvider'
import { byId, CHAPTERS, STYLES, type StyleDef, type StyleModule, type StyleProps } from './registry'
import { useTier, tierNow } from './motion'
import Guide from './Guide'
import WorldMap from './WorldMap'
import SoundButton from './SoundButton'
import { setWorld } from './sound'

type PickAt = { x: number; y: number }
import { getCurtain } from './curtain'
import './studio.css'

const AccessibilityWidget = lazy(() => import('../components/ui/AccessibilityWidget'))
const CookieConsent = lazy(() => import('../components/ui/CookieConsent'))

/** The prerendered page (no JS yet, or the first chunk in flight): shown as it was painted. */
const PRERENDERED = (() => {
  if (typeof document === 'undefined') return ''
  const main = document.getElementById('main-content')
  const here = window.location.pathname.replace(/\/+$/, '')
  return main?.dataset.route === '/styles' && here === '/styles' ? main.innerHTML : ''
})()

const fromUrl = () => (typeof window === 'undefined' ? null : new URLSearchParams(window.location.search).get('s'))

/** Fonts first: a style never shows in a fallback face. Never waits longer than 1.6 s. */
const prepare = (m: StyleModule) => Promise.race([(m.prepare?.() ?? Promise.resolve()).catch(() => undefined), new Promise((r) => setTimeout(r, 1600))])

/** The chapter under the reading line, so a switch lands on the same content in the new style. */
function chapterNow(): string {
  const line = window.innerHeight * 0.42
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
  const lock = useRef(false)

  // the first style: its chunk and fonts, then the page (the prerendered one stands until then)
  useEffect(() => {
    let live = true
    def.load().then(async (m) => { await prepare(m); if (live) setPage(() => m.default) })
    // build the wave at idle, so the first switch never waits on a compile
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback
    // and the other styles' chunks and fonts, so the wave never waits on the network either
    if (tierNow() !== 'still') (idle ?? ((cb: () => void) => window.setTimeout(cb, 1200)))(() => {
      getCurtain()
      window.setTimeout(() => STYLES.forEach((s) => { if (s.id !== def.id) void s.load().then(prepare).catch(() => {}) }), 2500)
    })
    const id = window.setTimeout(() => setWidgets(true), 1800)
    return () => { live = false; clearTimeout(id) }
  }, [])

  useEffect(() => {
    const html = document.documentElement
    html.dataset.style = def.id
    setTheme(def.theme)
    setWorld(def.id)
    return () => { delete html.dataset.style }
  }, [def])

  const land = (ch: string) => {
    const el = document.querySelector<HTMLElement>(`[data-ch="${ch}"]`)
    if (ch === 'hero' || !el) { engine?.lenis ? engine.lenis.scrollTo(0, { immediate: true, force: true }) : window.scrollTo(0, 0); return }
    if (engine?.lenis) engine.lenis.scrollTo(el, { immediate: true, force: true })
    else el.scrollIntoView({ block: 'start' })
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

  return (
    <div className="st" data-tier={tier}>
      <SEO
        title="סטודיו הסגנונות"
        description="אותו אתר בארבעה סגנונות. בוחרים סגנון, רואים את האתר משתנה מול העיניים, ושולחים לנו הודעה עם הכיוון שאהבתם."
        canonical="/styles/"
      />
      <a className="st-skip" href="#main-content">דלג לתוכן הראשי</a>
      <header className="st-bar">
        <a className="st-bar__home" href="/" aria-label="MediaWave, לדף הבית"><Logo variant="compact" decorative /></a>
        {/* the always-there way to the worlds (keyboard, screen readers, anyone who missed the guide) */}
        <button type="button" className="st-bar__worlds" lang="en" dir="ltr" onClick={() => setMap(true)} aria-haspopup="dialog" aria-label="מפת העולמות: בחירת סגנון">
          ( Worlds · 04 )
        </button>
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
          <a href="/" lang="en" dir="ltr">( Back to the site + )</a>
        </nav>
        <p className="st-foot__credit" lang="en" dir="ltr">
          <span>{def.name}</span> · Inspired by <a href={def.creditUrl} target="_blank" rel="noopener noreferrer">{def.credit} ↗</a>
        </p>
      </footer>

      {title && (
        <div className="st-title" data-out={title.out || undefined} style={{ ['--st-t-ink' as string]: title.def.ink }} aria-hidden="true">
          <span className="st-title__name" style={{ font: title.def.face }}>
            {[...title.def.name].map((ch, i) => <span key={i} style={{ ['--k' as string]: i }}>{ch}</span>)}
          </span>
          <span className="st-title__by" lang="en" dir="ltr">Inspired by {title.def.credit}</span>
        </div>
      )}
      <Guide def={def} tier={tier} open={map || busy} onOpen={() => setMap(true)} />
      {map && <WorldMap current={def} onClose={() => setMap(false)} onPick={(s, at) => { setMap(false); void choose(s, at) }} />}

      {widgets && (
        <aside aria-label="כלים">
          <Suspense fallback={null}><AccessibilityWidget /></Suspense>
          <Suspense fallback={null}><CookieConsent /></Suspense>
        </aside>
      )}
    </div>
  )
}
