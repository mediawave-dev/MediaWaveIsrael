// shot · one shot (DECISIONS #83); since D118 the home page is the wave (wave/WaveHome). Ships with build:shot and the plain build. The look composes the
// whole home page itself (Home), so the shared hero and holds are not used; ThemeLayers is null
// because the page keeps one ground from top to bottom (#81). The inner pages are the shot's own
// (D90): the same table, paper and ink, each one a lazy chunk with its own stylesheet.
import { lazy } from 'react'
import WaveHome from './wave/WaveHome'
import type { LookRegistry } from './registry.types'

const Unused = () => null

const registry: LookRegistry = {
  look: 'shot',
  Home: WaveHome,
  Hero: Unused,
  Services: Unused,
  Process: Unused,
  ThemeLayers: null,
  pages: {
    Service: lazy(() => import('./shot/pages/ShotService')),
    Portfolio: lazy(() => import('./shot/pages/ShotPortfolio')),
    Terms: lazy(() => import('./shot/pages/ShotTerms')),
    Privacy: lazy(() => import('./shot/pages/ShotPrivacy')),
    Accessibility: lazy(() => import('./shot/pages/ShotAccessibility')),
    NotFound: lazy(() => import('./shot/pages/ShotNotFound')),
  },
}
export default registry
