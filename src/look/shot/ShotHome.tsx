// shot · the home page as one camera move over Nati's desk (DECISIONS #83, #84; SPEC 1.2). The hero
// is eager (its H1 is the LCP and its CSS lands in the entry stylesheet); every chapter after it is
// a lazy chunk whose fallback holds the chapter's measured height, so nothing below moves when it
// arrives. Each chapter renders its own <section> straight into <main>; the footer stays in Layout.
// SEO comes from App's HOME_SEO (no document.title here).
import { lazy, Suspense } from 'react'
import ShotHero from './ShotHero' // eager: the H1 (LCP) and its CSS
import './shot-base.css'
import './shot-dock.css' // the dock's skin (ShotDock is mounted by Layout, which every look imports)

const ShotMeet = lazy(() => import('./ShotMeet'))
const ShotChoose = lazy(() => import('./ShotChoose'))
const ShotBuild = lazy(() => import('./ShotBuild')) // section#process (hold + steps)
const ShotStart = lazy(() => import('./ShotStart')) // #faq, BigWord, #contact
const ShotDeliver = lazy(() => import('./ShotDeliver')) // pull-back

export default function ShotHome() {
  return (
    <>
      <ShotHero />
      <Suspense fallback={<i className="shot-fb shot-fb--meet" aria-hidden="true" />}><ShotMeet /></Suspense>
      <Suspense fallback={<i className="shot-fb shot-fb--choose" aria-hidden="true" />}><ShotChoose /></Suspense>
      <Suspense fallback={<i className="shot-fb shot-fb--build" aria-hidden="true" />}><ShotBuild /></Suspense>
      <Suspense fallback={<i className="shot-fb shot-fb--start" aria-hidden="true" />}><ShotStart /></Suspense>
      <Suspense fallback={<i className="shot-fb shot-fb--deliver" aria-hidden="true" />}><ShotDeliver /></Suspense>
      {/* --safe-b resolved in px for JS (camera.ts safeB): fixed, width 0, height var(--safe-b) */}
      <i className="shot-probe" aria-hidden="true" />
    </>
  )
}
