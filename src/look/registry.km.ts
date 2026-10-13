// KM · launch night. Ships with build:km (and plain build) only (vite.config alias).
import { lazy } from 'react'
import HeroLens from './scenes/HeroLens'
import ThemeLayers from './sections/ThemeLayers'
import type { LookRegistry } from './registry.types'

const registry: LookRegistry = {
  look: 'km',
  Hero: HeroLens,
  Services: lazy(() => import('./sections/ServicesFlight')),
  Process: lazy(() => import('./sections/ProcessLaunch')),
  ThemeLayers,
}
export default registry
