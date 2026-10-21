// The four styles. Each is a lazy chunk with its own CSS, fonts and scene; nothing here loads on the
// main site's pages. The names are ours [קופי: נתי]; the credit names the award winner it follows.
import type { ComponentType } from 'react'
import type { Tier } from './motion'

export type StyleId = 'flight' | 'buzz' | 'blueprint' | 'clay'

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

export interface StyleDef {
  id: StyleId
  /** the style's Hebrew name in the picker [קופי: נתי] */
  name: string
  /** one line on what it feels like [קופי: נתי] */
  feel: string
  /** the award winner it follows (the credit line) */
  credit: string
  creditUrl: string
  /** the picker chip: the style's ground and ink, split like the Horizon disc */
  swatch: [string, string]
  /** the browser's theme colour while the style is on */
  theme: string
  load: () => Promise<StyleModule>
}

export const STYLES: StyleDef[] = [
  {
    id: 'flight',
    name: 'מעוף',
    feel: 'סיפור שנפתח בגלילה',
    credit: 'The Power of Storytelling',
    creditUrl: 'https://storytelling.noomoagency.com/',
    swatch: ['#dcd3f7', '#3a3270'],
    theme: '#e5def9',
    load: () => import('./flight/Flight'),
  },
  {
    id: 'buzz',
    name: 'זמזום',
    feel: 'קליל, שיקי ומלא חיים',
    credit: 'Buzz',
    creditUrl: 'https://buzz.xyz/',
    swatch: ['#d7d72e', '#231e1e'],
    theme: '#d7d72e',
    load: () => import('./buzz/Buzz'),
  },
  {
    id: 'blueprint',
    name: 'שרטוט',
    feel: 'מדויק כמו תוכנית עבודה',
    credit: 'Heron AI',
    creditUrl: 'https://heronaiapp.com/',
    swatch: ['#f5f5ee', '#fa3600'],
    theme: '#f5f5ee',
    load: () => import('./blueprint/Blueprint'),
  },
  {
    id: 'clay',
    name: 'חימר',
    feel: 'חדר רך באור של בוקר',
    credit: 'Léo Parpeix',
    creditUrl: 'https://www.leoparpeix.com/',
    swatch: ['#efe4d4', '#083d2a'],
    theme: '#efe4d4',
    load: () => import('./clay/Clay'),
  },
]

export const DEFAULT_STYLE: StyleId = 'flight'

export const byId = (id: string | null | undefined): StyleDef =>
  STYLES.find((s) => s.id === id) ?? STYLES.find((s) => s.id === DEFAULT_STYLE)!

export const CHAPTERS = ['hero', 'services', 'work', 'process', 'faq', 'contact'] as const
