// sun · routes (D237). The home page is in the first download (it holds the H1); the inner pages are
// one lazy chunk. While that chunk loads, the prerendered <main> of the same route stays on screen.
import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Shell from './Shell'
import Home from './Home'
import { trackView } from '../utils/analytics'

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
    const id = decodeURIComponent(hash.slice(1))
    const t = window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }), 60)
    return () => clearTimeout(t)
  }, [pathname, hash])
}

export default function SunApp() {
  useHashScroll()
  const { pathname } = useLocation()
  useEffect(() => { trackView() }, [pathname])
  const L = (el: React.ReactNode) => <Suspense fallback={<Fallback />}>{el}</Suspense>
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services/:slug" element={L(<Service />)} />
        <Route path="/portfolio/:slug" element={L(<Sample />)} />
        <Route path="/terms" element={L(<Terms />)} />
        <Route path="/privacy" element={L(<Privacy />)} />
        <Route path="/accessibility" element={L(<Accessibility />)} />
        <Route path="*" element={L(<NotFound />)} />
      </Routes>
    </Shell>
  )
}
