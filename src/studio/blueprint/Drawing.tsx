// The hero drawing (our translation of Heron's elevation of a house): a laptop with a landing page on its
// screen, a phone in front of it and a cassette beside it, in graphite on paper, with stipple shading and
// dimension lines. Drag across it (or tap a red square) to see what we check on every site: Heron's
// violations, turned into our promises. Every line on the cards is the site's existing copy.
import { useRef, useState, type PointerEvent as RPE } from 'react'

interface Check { id: string; x: number; y: number; code: string; text: string }

/** positions in the drawing's viewBox (1000 x 560) */
export const CHECKS: Check[] = [
  { id: 'wa', x: 650, y: 228, code: 'CHECK 01 · WHATSAPP', text: 'כל פנייה מהאתר מגיעה ישר לוואטסאפ.' },
  { id: 'phone', x: 864, y: 306, code: 'CHECK 02 · 390 PX', text: 'נבנה קודם לטלפון, ונבדק בטלפון ובמחשב.' },
  { id: 'google', x: 585, y: 150, code: 'CHECK 03 · GOOGLE', text: 'גוגל יכול למצוא אותו ולהבין מה יש בו.' },
  { id: 'speed', x: 340, y: 214, code: 'CHECK 04 · SPEED', text: 'נפתח מהר, גם בטלפון.' },
  { id: 'tape', x: 111, y: 416, code: 'CHECK 05 · TAPES', text: 'מהצילומים שלכם לסרטון גמור, ומקלטות ישנות לקובץ.' },
]

const W = 1000
const H = 560

function Art() {
  return (
    <svg className="bp-art" viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
      <defs>
        <pattern id="bp-st" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="0.95" /><circle cx="4.5" cy="4.3" r="0.7" /></pattern>
        <pattern id="bp-st2" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="0.6" /></pattern>
        <pattern id="bp-ht" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="5" /></pattern>
      </defs>
      {/* the desk line and its hatch */}
      <path className="bp-l" pathLength={1} d="M20 446H980" />
      <rect className="bp-hatch" x="110" y="447" width="720" height="10" />
      <rect className="bp-hatch" x="792" y="481" width="148" height="8" />
      {/* laptop: the lid, its frame in stipple, the display */}
      <path className="bp-st2" fillRule="evenodd" d="M216 70h508a16 16 0 0 1 16 16v324H200V86a16 16 0 0 1 16-16zM222 92v296h496V92z" />
      <rect className="bp-l bp-l--b" pathLength={1} x="200" y="70" width="540" height="340" rx="16" />
      <rect className="bp-l" pathLength={1} x="222" y="92" width="496" height="296" rx="4" />
      <circle className="bp-ink" cx="470" cy="81" r="2.5" />
      <path className="bp-st2" d="M150 410H790L840 438Q842 446 832 446H108Q98 446 100 438Z" />
      <path className="bp-l bp-l--b" pathLength={1} d="M150 410H790L840 438Q842 446 832 446H108Q98 446 100 438Z" />
      <path className="bp-l" pathLength={1} d="M430 410Q470 418 510 410" />
      {/* the page on the screen (Hebrew, right-aligned) */}
      <path className="bp-l bp-l--t" pathLength={1} d="M232 118H708" />
      <circle className="bp-l" pathLength={1} cx="690" cy="106" r="7" />
      <path className="bp-l bp-l--t" pathLength={1} d="M683 107c4-3 9-3 14 0" />
      <path className="bp-l bp-l--t" pathLength={1} d="M240 106h18M266 106h18M292 106h18" />
      <rect className="bp-ink" x="470" y="140" width="230" height="16" />
      <rect className="bp-ink" x="520" y="164" width="180" height="16" />
      <rect className="bp-ink bp-ink--soft" x="540" y="190" width="160" height="4" />
      <rect className="bp-ink bp-ink--soft" x="566" y="200" width="134" height="4" />
      <rect className="bp-l" pathLength={1} x="600" y="216" width="100" height="24" rx="12" />
      <path className="bp-l bp-l--t" pathLength={1} d="M622 228h56" />
      <rect className="bp-st" x="240" y="140" width="200" height="150" rx="6" />
      <circle className="bp-paper bp-l" pathLength={1} cx="340" cy="200" r="34" />
      <path className="bp-hatch" d="M240 230C280 215 310 245 350 228S420 215 440 226V284a6 6 0 0 1-6 6H246a6 6 0 0 1-6-6Z" />
      <path className="bp-l" pathLength={1} d="M240 230C280 215 310 245 350 228S420 215 440 226" />
      <rect className="bp-l" pathLength={1} x="240" y="140" width="200" height="150" rx="6" />
      {[240, 398, 556].map((x) => (
        <g key={x}>
          <rect className="bp-l bp-l--t" pathLength={1} x={x} y="306" width="144" height="66" rx="6" />
          <rect className="bp-st" x={x + 110} y="318" width="22" height="22" rx="3" />
          <path className="bp-l bp-l--t" pathLength={1} d={`M${x + 50} 326h50M${x + 66} 338h34M${x + 76} 356h24`} />
        </g>
      ))}
      {/* the phone in front */}
      <rect className="bp-paper bp-l bp-l--b" pathLength={1} x="800" y="230" width="128" height="252" rx="18" />
      <rect className="bp-l" pathLength={1} x="808" y="244" width="112" height="224" rx="12" />
      <rect className="bp-ink" x="846" y="249" width="36" height="7" rx="3.5" />
      <rect className="bp-ink" x="850" y="268" width="62" height="8" />
      <rect className="bp-ink" x="866" y="280" width="46" height="8" />
      <rect className="bp-st" x="816" y="298" width="96" height="62" rx="5" />
      <path className="bp-l bp-l--t" pathLength={1} d="M816 338c18-8 30 6 48-2s30-8 48 0" />
      <rect className="bp-l" pathLength={1} x="852" y="370" width="60" height="16" rx="8" />
      <path className="bp-l bp-l--t" pathLength={1} d="M840 400h72M852 410h60M866 420h46" />
      {/* the cassette beside the laptop */}
      <rect className="bp-paper bp-l bp-l--b" pathLength={1} x="36" y="350" width="150" height="96" rx="8" />
      <path className="bp-st2" d="M58 446l10-22h86l10 22z" />
      <path className="bp-l" pathLength={1} d="M58 446l10-22h86l10 22" />
      <rect className="bp-l bp-l--t" pathLength={1} x="50" y="360" width="122" height="34" rx="3" />
      <path className="bp-l bp-l--t" pathLength={1} d="M60 372h70M60 382h50" />
      <rect className="bp-l" pathLength={1} x="78" y="403" width="66" height="26" rx="13" />
      <circle className="bp-l" pathLength={1} cx="96" cy="416" r="8.5" />
      <circle className="bp-l" pathLength={1} cx="126" cy="416" r="8.5" />
      <path className="bp-l bp-l--t" pathLength={1} d="M96 409v3M96 420v3M89 416h3M100 416h3M126 409v3M126 420v3M119 416h3M130 416h3" />
      {/* dimension lines */}
      <g className="bp-dim">
        <path className="bp-l bp-l--t" pathLength={1} d="M200 478H740M200 472v12M740 472v12" />
        <text x="470" y="472">1440 PX</text>
        <path className="bp-l bp-l--t" pathLength={1} d="M800 214H928M800 208v12M928 208v12" />
        <text x="864" y="207">390 PX</text>
        <path className="bp-l bp-l--t" pathLength={1} d="M176 70V410M170 70h12M170 410h12" />
        <text x="168" y="244" transform="rotate(-90 168 244)">900 PX</text>
      </g>
    </svg>
  )
}

interface Sel { x0: number; y0: number; x1: number; y1: number }

export default function Drawing({ fine }: { fine: boolean }) {
  const box = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState<Record<string, boolean>>({})
  const [sel, setSel] = useState<Sel | null>(null)
  const [cross, setCross] = useState<{ x: number; y: number } | null>(null)
  const drag = useRef<Sel | null>(null)

  const local = (e: RPE) => {
    const r = box.current!.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top, w: r.width, h: r.height }
  }
  // Heron's drag (a box in the drag direction, 1:1, after 2 px); mouse only, touch scrolls and taps
  const down = (e: RPE) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return
    const p = local(e)
    drag.current = { x0: p.x, y0: p.y, x1: p.x, y1: p.y }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }
  const move = (e: RPE) => {
    if (e.pointerType !== 'mouse') return
    const p = local(e)
    setCross({ x: p.x, y: p.y })
    const d = drag.current
    if (!d) return
    d.x1 = p.x
    d.y1 = p.y
    if (Math.abs(d.x1 - d.x0) + Math.abs(d.y1 - d.y0) < 2) return
    setSel({ ...d })
    const [xa, xb] = [Math.min(d.x0, d.x1) / p.w * W, Math.max(d.x0, d.x1) / p.w * W]
    const [ya, yb] = [Math.min(d.y0, d.y1) / p.h * H, Math.max(d.y0, d.y1) / p.h * H]
    const hit = CHECKS.filter((c) => c.x >= xa && c.x <= xb && c.y >= ya && c.y <= yb)
    if (hit.length) setOpen((o) => ({ ...o, ...Object.fromEntries(hit.map((c) => [c.id, true])) }))
  }
  const up = () => { drag.current = null; window.setTimeout(() => setSel(null), 600) }

  const s = sel && {
    left: Math.min(sel.x0, sel.x1), top: Math.min(sel.y0, sel.y1),
    width: Math.abs(sel.x1 - sel.x0), height: Math.abs(sel.y1 - sel.y0),
    ['--bp-dir' as string]: `${sel.x1 >= sel.x0 ? 90 : 270}deg`,
  }
  return (
    <div className="bp-draw" ref={box} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={() => setCross(null)}>
      <Art />
      {fine && cross && (
        <div className="bp-cross" aria-hidden="true" style={{ ['--x' as string]: `${cross.x}px`, ['--y' as string]: `${cross.y}px` }}>
          <i className="bp-cross__h" /><i className="bp-cross__v" /><b className="bp-cross__p" />
          <span className="bp-cross__xy" dir="ltr">X:{Math.round(cross.x)}PX<br />Y:{Math.round(cross.y)}PX</span>
        </div>
      )}
      {s && <div className="bp-sel" style={s} aria-hidden="true" />}
      {CHECKS.map((c) => (
        <div key={c.id} className="bp-check" style={{ left: `${(c.x / W) * 100}%`, top: `${(c.y / H) * 100}%` }} data-open={open[c.id] || undefined} data-dir={c.x > 520 ? 'l' : 'r'}>
          <button type="button" className="bp-check__dot" aria-expanded={!!open[c.id]} aria-label={c.text} onClick={() => setOpen((o) => ({ ...o, [c.id]: !o[c.id] }))} />
          <div className="bp-check__card" role="note">
            <span className="bp-check__code" dir="ltr">{c.code}</span>
            <span className="bp-check__t">{c.text}</span>
            <button type="button" className="bp-check__x" aria-label="סגירה" onClick={() => setOpen((o) => ({ ...o, [c.id]: false }))}>×</button>
          </div>
        </div>
      ))}
    </div>
  )
}
