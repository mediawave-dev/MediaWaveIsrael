// The five styles with their loaders. Each is a lazy chunk with its own CSS, fonts and scene; nothing here
// loads on the main site's pages (the home page reads only styles-meta.ts).
import type { ComponentType } from 'react'
import type { Tier } from './motion'

import { STYLE_META, type StyleId, type StyleMeta } from './styles-meta'

export type { StyleId } from './styles-meta'

export interface StyleProps {
  tier: Tier
  /** the style's own name, for the lead it builds into WhatsApp and the form */
  def: StyleDef
}

/** What a style chunk exports: the page, and an optional promise for what must be ready before it shows
    (its fonts), so the live switch never flashes a fallback face. */
export interface StyleModule {
  default: ComponentType<StyleProps>
  prepare?: () => Promise<unknown>
}

export interface StyleDef extends StyleMeta {
  load: () => Promise<StyleModule>
}

const LOADERS: Record<StyleId, () => Promise<StyleModule>> = {
  flight: () => import('./flight/Flight'),
  buzz: () => import('./buzz/Buzz'),
  blueprint: () => import('./blueprint/Blueprint'),
  clay: () => import('./clay/Clay'),
  depth: () => import('./depth/Depth'),
}

export const STYLES: StyleDef[] = STYLE_META.map((m) => ({ ...m, load: LOADERS[m.id] }))

export const DEFAULT_STYLE: StyleId = 'flight'

export const byId = (id: string | null | undefined): StyleDef =>
  STYLES.find((s) => s.id === id) ?? STYLES.find((s) => s.id === DEFAULT_STYLE)!

export const CHAPTERS = ['hero', 'services', 'work', 'process', 'faq', 'contact'] as const
