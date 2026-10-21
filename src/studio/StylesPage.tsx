// /styles/: the site's content in four styles, each a careful re-reading of an award-winning site's
// signal, translated into our world. The visitor picks a style and the page turns into it live
// (View Transitions, each style its own entrance); the pick rides into the WhatsApp message and the form.
// The main site stays the sea of dots; nothing of this page loads there.
import { lazy, Suspense, useEffect, useRef, useState, type ComponentType } from 'react'
import { flushSync } from 'react-dom'
import SEO from '../components/SEO'
import Logo from '../components/ui/Logo'
import { useMotionEngine } from '../motion/ScrollEngineProvider'
import { byId, CHAPTERS, type StyleDef, type StyleModule, type StyleProps } from './registry'
import { useTier } from './motion'
import Picker, { type PickAt } from './Picker'
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
  const tier = useTier()
  const engine = useMotionEngine()
  const lock = useRef(false)

  // the first style: its chunk and fonts, then the page (the prerendered one stands until then)
  useEffect(() => {
    let live = true
    def.load().then(async (m) => { await prepare(m); if (live) setPage(() => m.default) })
    const id = window.setTimeout(() => setWidgets(true), 1800)
    return () => { live = false; clearTimeout(id) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const html = document.documentElement
    html.dataset.style = def.id
    setTheme(def.theme)
    return () => { delete html.dataset.style }
  }, [def])

  const land = (ch: string) => {
    const el = document.querySelector<HTMLElement>(`[data-ch="${ch}"]`)
    if (ch === 'hero' || !el) { engine?.lenis ? engine.lenis.scrollTo(0, { immediate: true, force: true }) : window.scrollTo(0, 0); return }
    if (engine?.lenis) engine.lenis.scrollTo(el, { immediate: true, force: true })
    else el.scrollIntoView({ block: 'start' })
  }

  async function choose(next: StyleDef, at: PickAt) {
    if (lock.current || next.id === def.id) return
    lock.current = true
    setBusy(true)
    const ch = chapterNow()
    const mod = await next.load()
    await prepare(mod)
    const html = document.documentElement
    html.style.setProperty('--vt-x', `${at.x}px`)
    html.style.setProperty('--vt-y', `${at.y}px`)
    html.dataset.vt = next.id
    const swap = () => {
      flushSync(() => { setDef(next); setPage(() => mod.default) })
      land(ch)
      const url = new URL(window.location.href)
      url.searchParams.set('s', next.id)
      window.history.replaceState(window.history.state, '', url)
    }
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } }
    if (tier !== 'still' && doc.startViewTransition) await doc.startViewTransition(swap).finished.catch(() => {})
    else swap()
    delete html.dataset.vt
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
        {/* [קופי: נתי] the page's name */}
        <p className="st-bar__name">( סטודיו הסגנונות )</p>
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
          <a href="/">( חזרה לאתר + )</a>
        </nav>
      </footer>

      <Picker current={def} onPick={choose} busy={busy} />

      {widgets && (
        <aside aria-label="כלים">
          <Suspense fallback={null}><AccessibilityWidget /></Suspense>
          <Suspense fallback={null}><CookieConsent /></Suspense>
        </aside>
      )}
    </div>
  )
}
