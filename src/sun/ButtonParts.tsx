// sun · the parts every button is made of (D275; ButtonParts, beside btn.ts and btn.css). Each part that moves is its own HTML box, so a beat moves it with
// transform and opacity only (the compositor's work, nothing for the page to lay out again; D210).
//   Glyph  the WhatsApp mark in layers: its bubble stays, the handset inside can step aside for three typing dots.
//   Go     the onward chevrons as three pieces: two seen, a third waiting behind them, so they can flow forward.
//   Say    the label and, in the same place, a second line that the button shows now and then (hidden until then).
//   Stage  the middle of a WhatsApp button, where the relay plays.
// btn.ts plays the beats; without scripts, in the prerender and with "ללא אנימציות" these stand still as plain parts.
import { LOGO_ART } from '../components/ui/logo-paths'

const RING = 'M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Z'
const HANDSET = 'M16.5 14.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.4.2-.4a.5.5 0 0 0 0-.4c0-.1-.6-1.4-.8-1.9s-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-.9 2.2 5 5 0 0 0 1.1 2.7 11.5 11.5 0 0 0 4.4 3.9c.6.3 1.1.4 1.5.5a3.6 3.6 0 0 0 1.6.1 2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.2c0-.2-.2-.2-.4-.3Z'
const svg = { viewBox: '0 0 24 24', 'aria-hidden': true, focusable: false } as const

export function Glyph() {
  return (
    <span className="glyph" aria-hidden="true">
      <svg {...svg}><path fill="currentColor" d={RING} /></svg>
      <span className="glyph__set"><svg {...svg}><path fill="currentColor" d={HANDSET} /></svg></span>
      <span className="glyph__dots"><i /><i /><i /></span>
    </span>
  )
}

const CHEVRON = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const
export function Go() {
  return (
    <span className="go" aria-hidden="true">
      <i><svg {...svg}><path {...CHEVRON} d="M12 6l-6 6 6 6" /></svg></i>
      <i><svg {...svg}><path {...CHEVRON} d="M19 6l-6 6 6 6" /></svg></i>
      <i><svg {...svg}><path {...CHEVRON} d="M19 6l-6 6 6 6" /></svg></i>
    </span>
  )
}

/** The middle of a WhatsApp button, empty at rest. In its turn (btn.ts, relay) the label steps aside and this stage
    plays: chevrons set off from the middle and run out at the end, the MediaWave disc comes in (D278, Nati: "תשים את
    האייקון היפה שלנו של mediawave"), the chevrons again, and the label comes back. The disc is the logo's own two
    halves (logos/horizon, through LOGO_ART), drawn here without the logo's endless colour walk: btn.ts gives it the
    header disc's colour of that moment, so it stays on the page's one colour clock (D268). */
export function Stage() {
  return (
    <span className="stage" aria-hidden="true">
      <span className="stage__go">
        <i><svg {...svg}><path {...CHEVRON} d="M14 6l-6 6 6 6" /></svg></i>
        <i><svg {...svg}><path {...CHEVRON} d="M14 6l-6 6 6 6" /></svg></i>
        <i><svg {...svg}><path {...CHEVRON} d="M14 6l-6 6 6 6" /></svg></i>
      </span>
      <span className="stage__disc">
        <svg viewBox={DISC.viewBox} aria-hidden="true" focusable="false">
          {DISC.parts.map((p) => <path key={p.part} className={p.part === 'mark-a' ? 'disc__a' : 'disc__b'} d={p.d} />)}
        </svg>
      </span>
    </span>
  )
}
const DISC = LOGO_ART.mark

const words = (s: string) => s.split(' ').map((w, i) => <span key={i}>{i > 0 && ' '}<span className="w">{w}</span></span>)

/** The label. `alt` is a second line that takes the label's place for a moment; it is not part of the button's name. */
export function Say({ children, alt }: { children: string; alt?: string }) {
  return (
    <span className="say">
      <span className="say__a">{words(children)}</span>
      {alt && <span className="say__b" aria-hidden="true">{words(alt)}</span>}
    </span>
  )
}

/** D285, D286 (Nati, 16.11.2026: "תוריד את הבועה מכפתור ההמבורגר... ותעצב אותו אחרת שיהיה סופר יפהפה וייחודי", then
    "תעשה פשוט שלושה גלים יפהפיים"): the menu's glyph is three waves, one above the other, each the horizon line of the
    MediaWave disc that stands beside it in the corner (the same dip at the start and rise at the end). The button's
    aria-expanded drives it (btn.css): open, the outer two flatten into straight strokes as they turn into an X and the
    middle one flattens away; under a pointer the three turn over one after the other, a ripple passing. One wave,
    laid at the middle three times and placed by transforms, so every change is a transform that eases. */
// the wave spans the glyph's whole width; its rise is the disc's own (8.6% of a full wave, logos/horizon), D287
const WAVE = 'M4 12c2.67 1.85 5.33 1.85 8 0s5.33-1.85 8 0'
export function MenuGlyph() {
  return (
    <svg className="menu-glyph" viewBox="4 4 16 16" width="18" height="18" aria-hidden="true" focusable="false">
      <path className="menu-glyph__a" d={WAVE} />
      <path className="menu-glyph__w" d={WAVE} />
      <path className="menu-glyph__b" d={WAVE} />
    </svg>
  )
}
