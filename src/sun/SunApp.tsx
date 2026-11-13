// sun · routes (D237). The home page is in the first download (it holds the H1); the inner pages are
// one lazy chunk. While that chunk loads, the prerendered <main> of the same route stays on screen.
import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Shell from './Shell'
import Home from './Home'
import { trackView } from '../utils/analytics'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { WA } from './content'

/** What a visitor sees if a part of the page fails to load or breaks: never a blank page, always a way to write to us.
    A chunk left over from the previous deploy reloads the page once on its own (ErrorBoundary). */
function Oops({ full = false }: { full?: boolean }) {
  return (
    <section className={`oops wrap${full ? ' oops--full' : ''}`} dir="rtl">
      <h1 className="h1 h1--page">משהו בדף לא נטען.</h1>
      <p>אפשר לרענן את הדף, או לכתוב לנו ישר בוואטסאפ.</p>
      <div className="oops__acts">
        <button type="button" className="btn btn--ink" onClick={() => window.location.reload()}>רענון הדף</button>
        <a className="btn btn--paper" href={WA.hero} target="_blank" rel="noopener">כתבו לנו בוואטסאפ</a>
      </div>
    </section>
  )
}

const pages = () => import('./pages')
const Service = lazy(() => pages().then((m) => ({ default: m.Service })))
const Sample = lazy(() => pages().then((m) => ({ default: m.Sample })))
const Terms = lazy(() => pages().then((m) => ({ default: m.Terms })))
const Privacy = lazy(() => pages().then((m) => ({ default: m.Privacy })))
const Accessibility = lazy(() => pages().then((m) => ({ default: m.Accessibility })))
const NotFound = lazy(() => pages().then((m) => ({ default: m.NotFound })))

// The prerendered <main> is reused only for the route it was painted for (the prerender stamps data-route).
const PRERENDERED = (() => {
  if (typeof document === 'undefined') return { path: '', html: '' }
  const main = document.getElementById('main-content')
  const here = window.location.pathname.replace(/\/+$/, '') || '/'
  const route = main?.dataset.route
  return { path: window.location.pathname, html: main && route && (route === '*' || route === here) ? main.innerHTML : '' }
})()
const Fallback = () => (PRERENDERED.html && PRERENDERED.path === window.location.pathname
  ? <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: PRERENDERED.html }} />
  : <div style={{ minHeight: '120vh' }} aria-hidden="true" />)

/** A link to a section (/#process). On the prerendered build the browser has already landed on it, so this
    only serves a first paint that had no content yet (the dev server): it never pulls a reader back. */
function useHashScroll() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash || window.scrollY > 0) return
    // a malformed hash (#% from a mistyped or crafted link) must not take the page down
    let id = hash.slice(1)
    try { id = decodeURIComponent(id) } catch { /* keep it as it came */ }
    const t = window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }), 60)
    return () => clearTimeout(t)
  }, [pathname, hash])
}

export default function SunApp() {
  useHashScroll()
  const { pathname } = useLocation()
  useEffect(() => { trackView() }, [pathname])
  const L = (el: React.ReactNode) => <Suspense fallback={<Fallback />}>{el}</Suspense>
  // two nets: the page's content (the header and footer stay), and the whole shell
  return (
    <ErrorBoundary fallback={<Oops full />}>
      <Shell>
        <ErrorBoundary key={pathname} fallback={<Oops />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services/:slug" element={L(<Service />)} />
            <Route path="/portfolio/:slug" element={L(<Sample />)} />
            <Route path="/terms" element={L(<Terms />)} />
            <Route path="/privacy" element={L(<Privacy />)} />
            <Route path="/accessibility" element={L(<Accessibility />)} />
            <Route path="*" element={L(<NotFound />)} />
          </Routes>
        </ErrorBoundary>
      </Shell>
    </ErrorBoundary>
  )
}
