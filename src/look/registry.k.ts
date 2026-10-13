// K · the launch. Ships with build:k only (vite.config alias).
import { lazy } from 'react'
import HeroStage from './scenes/HeroStage'
import type { LookRegistry } from './registry.types'

const registry: LookRegistry = {
  look: 'k',
  Hero: HeroStage,
  Services: lazy(() => import('./sections/ServicesLaunch')),
  Process: lazy(() => import('./sections/ProcessLine')),
  ThemeLayers: null,
}
export default registry
