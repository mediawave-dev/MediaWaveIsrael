// shot · one shot (DECISIONS #83). Ships with build:shot and the plain build. The look composes the
// whole home page itself (Home), so the shared hero and holds are not used; ThemeLayers is null
// because the page keeps one ground from top to bottom (#81). The inner pages are the shot's own
// (D90): the same table, paper and ink, each one a lazy chunk with its own stylesheet.
import { lazy } from 'react'
import ShotHome from './shot/ShotHome'
import type { LookRegistry } from './registry.types'

const Unused = () => null

const registry: LookRegistry = {
  look: 'shot',
  Home: ShotHome,
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
