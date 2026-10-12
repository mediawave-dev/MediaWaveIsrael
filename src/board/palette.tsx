// Direction B's colour schemes (?palette=), shared by /board/b and the idea pages.
// board-b.css defines what each field slot is per palette.

import { Link, useLocation } from 'react-router-dom'

export const PALETTES = {
  loud: { label: 'מקור', doc: '#F5B700' },
  faded: { label: 'דהוי', doc: '#EBC56B' },
  paper: { label: 'נייר ודיו', doc: '#F5B700' },
  green: { label: 'ירוק עמוק', doc: '#123D30' },
  ink: { label: 'דיו וזעפרן', doc: '#161616' },
} as const

export type Palette = keyof typeof PALETTES

export function usePalette(fallback: Palette = 'loud'): Palette {
  const v = new URLSearchParams(useLocation().search).get('palette')
  return v && v in PALETTES ? (v as Palette) : fallback
}

/** Board chrome: switch palettes in place. Hidden with ?clean for captures. */
export function PaletteSwitch({ current }: { current: Palette }) {
  const { search, pathname } = useLocation()
  if (new URLSearchParams(search).has('clean')) return null
  return (
    <nav aria-label="צבעים" style={{ position: 'fixed', insetInlineStart: 12, bottom: 12, zIndex: 90, display: 'flex', gap: 2, padding: 4, background: 'rgba(17,17,17,.88)', borderRadius: 8, font: '600 13px/1 Heebo, sans-serif', boxShadow: '0 2px 10px rgba(0,0,0,.2)' }}>
      {(Object.keys(PALETTES) as Palette[]).map((p) => {
        const q = new URLSearchParams(search)
        q.set('palette', p)
        return (
          <Link key={p} to={`${pathname}?${q}`} style={{ color: '#fff', padding: '8px 10px', borderRadius: 6, textDecoration: 'none', background: p === current ? 'rgba(255,255,255,.2)' : 'transparent' }}>
            {PALETTES[p].label}
          </Link>
        )
      })}
    </nav>
  )
}
