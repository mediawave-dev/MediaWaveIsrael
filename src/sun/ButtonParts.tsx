// sun · the parts every button is made of (D275; ButtonParts, beside btn.ts and btn.css). Each part that moves is its own HTML box, so a beat moves it with
// transform and opacity only (the compositor's work, nothing for the page to lay out again; D210).
//   Glyph  the WhatsApp mark in layers: its bubble stays, the handset inside can step aside for three typing dots.
//   Go     the onward chevrons as three pieces: two seen, a third waiting behind them, so they can flow forward.
//   Say    the label and, in the same place, a second line that the button shows now and then (hidden until then).
// btn.ts plays the beats; without scripts, in the prerender and with "ללא אנימציות" these stand still as plain parts.

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
