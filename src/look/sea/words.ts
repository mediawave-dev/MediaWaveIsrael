// sea · the letter's words (D171; Nati: "what one writes in the form is engraved into the bubble's
// drawing, beautiful and impressive, in Hebrew and in English"; then: "written by the dots themselves, and
// more text: responsive, smaller the more there is, so everything fits"). The contact form's three fields
// are painted on a small canvas in the bubble's own units: the name large in the display face at the top,
// the email in mono (always left to right) under it, the message in the text face, wrapped. All of it is
// scaled together to the largest size at which everything fits; each line is centred and takes its
// direction from its first strong letter. The shader reads the canvas at the centre of every dot of the
// bubble (field.ts setWords, shader.ts wordAt): R the letters (their dots light up), B the letters just
// typed (their dots burn in). paint() returns the smallest letter size, from which the field picks how
// fine the bubble's dots must be for the letters to read. Nothing leaves the page.

export interface Words { name: string; email: string; message: string }
export type Line = keyof Words
/** letters added at the end of one line (typing): they burn in */
export interface Fresh { line: Line; from: number }

/** The text area in the bubble's units (shader.ts wordAt reads the same numbers). */
export const AREA = { x0: -1.04, y0: -0.46, w: 2.08, h: 1.18 }

const HEB = /[֐-׿]/
const LAT = /[A-Za-z0-9]/
function dirOf(s: string): 'rtl' | 'ltr' {
  for (const ch of s) {
    if (HEB.test(ch)) return 'rtl'
    if (LAT.test(ch)) return 'ltr'
  }
  return 'rtl'
}

/** Which line grew at its end since the last values (typing), if any. */
export function freshOf(was: Words, now: Words): Fresh | null {
  for (const line of ['name', 'email', 'message'] as Line[]) {
    const a = was[line]
    const b = now[line]
    if (b.length > a.length && b.startsWith(a) && b.trim()) return { line, from: a.length }
  }
  return null
}

const face = (v: string, fb: string) => getComputedStyle(document.documentElement).getPropertyValue(v).trim() || fb

/** Cut `s` to fit `maxW`, with an ellipsis. */
function cut(g: CanvasRenderingContext2D, s: string, maxW: number): string {
  if (g.measureText(s).width <= maxW) return s
  let lo = 0
  let hi = s.length
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1
    if (g.measureText(`${s.slice(0, mid).trimEnd()}…`).width <= maxW) lo = mid
    else hi = mid - 1
  }
  return `${s.slice(0, lo).trimEnd()}…`
}

/** Break `s` into lines of `maxW` (a word longer than a line is cut). */
function wrap(g: CanvasRenderingContext2D, s: string, maxW: number): string[] {
  const out: string[] = []
  let cur = ''
  for (const word of s.split(' ')) {
    const next = cur ? `${cur} ${word}` : word
    if (g.measureText(next).width <= maxW) { cur = next; continue }
    if (cur) out.push(cur)
    cur = g.measureText(word).width <= maxW ? word : cut(g, word, maxW)
  }
  if (cur) out.push(cur)
  return out
}

interface Block { line: Line; rows: string[]; px: number; font: string; lh: number; gap: number }

/** Lay the words out at base size `s` (px of the name); null when they do not fit the height. */
function layout(g: CanvasRenderingContext2D, v: Words, s: number, w: number, h: number, last: boolean, least: number): Block[] | null {
  const display = face('--face-display', 'sans-serif')
  const text = face('--face-text', 'sans-serif')
  const mono = face('--sea-mono', 'monospace')
  const maxW = w * 0.9
  const out: Block[] = []
  let y = 0
  const add = (line: Line, raw: string, px: number, fontOf: (p: number) => string, one: boolean) => {
    const t = raw.replace(/\s+/g, ' ').trim()
    if (!t) return
    let p = px
    let font = fontOf(p)
    g.font = font
    // a single line (the name, the email) shrinks to fit the width before it is cut
    if (one) {
      const m = g.measureText(t).width
      if (m > maxW) { p = Math.max(px * 0.5, least, (px * maxW) / m); font = fontOf(p); g.font = font }
    }
    const rows = one ? [cut(g, t, maxW)] : wrap(g, t, maxW)
    const lh = p * 1.18
    const gap = out.length ? s * 0.2 : 0
    y += gap
    out.push({ line, rows, px: p, font, lh, gap })
    y += rows.length * lh
  }
  add('name', v.name, s, (p) => `800 ${p}px ${display}`, true)
  add('email', v.email, s * 0.5, (p) => `600 ${p}px ${mono}`, true)
  add('message', v.message, s * 0.5, (p) => `600 ${p}px ${text}`, false)
  if (y <= h * 0.96) return out
  if (!last) return null
  // at the smallest size the message keeps the lines that fit, the last one cut
  const msg = out.find((b) => b.line === 'message')
  if (msg) {
    const room = Math.max(1, Math.floor((h * 0.96 - (y - msg.rows.length * msg.lh)) / msg.lh))
    if (room < msg.rows.length) {
      g.font = msg.font
      const end = msg.rows[room - 1]
      msg.rows = [...msg.rows.slice(0, room - 1), g.measureText(`${end}…`).width <= maxW ? `${end}…` : cut(g, `${end}${' '.repeat(40)}`, g.measureText(end).width - 1)]
    }
  }
  return out
}

/** Paint the words on `cv` (w x h px), no letter smaller than the size that still reads in the sign's
    dots (`least`). Returns the smallest letter size used (px), 0 for none. */
export function paint(cv: HTMLCanvasElement, w: number, h: number, v: Words, fresh: Fresh | null, least = 0): number {
  if (cv.width !== w) cv.width = w
  if (cv.height !== h) cv.height = h
  const g = cv.getContext('2d')
  if (!g) return 0
  g.globalCompositeOperation = 'source-over'
  g.fillStyle = '#000'
  g.fillRect(0, 0, w, h)
  // the largest base size at which everything fits: from nearly half the height (a name alone) down to a
  // twelfth
  const hi = h * (v.email.trim() || v.message.trim() ? 0.34 : 0.46)
  const lo = Math.max(h * 0.085, least * 2)
  let blocks: Block[] | null = null
  for (let i = 0; i < 9 && !blocks; i++) {
    const s = hi * Math.pow(lo / hi, i / 8)
    blocks = layout(g, v, Math.max(s, lo), w, h, i === 8, least)
  }
  if (!blocks || !blocks.length) return 0
  g.globalCompositeOperation = 'lighter'
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  const cx = w / 2
  let y = 0
  let min = Infinity
  blocks.forEach((b) => {
    y += b.gap
    g.font = b.font
    min = Math.min(min, b.px)
    b.rows.forEach((row, i) => {
      const dir = b.line === 'email' ? 'ltr' : dirOf(row)
      g.direction = dir
      const yy = y + b.lh * (i + 0.5)
      g.fillStyle = 'rgb(255,0,0)'
      g.fillText(row, cx, yy)
      // the letters just typed: the end of the line's last row (its start side in Hebrew)
      if (!fresh || fresh.line !== b.line || i !== b.rows.length - 1 || row.endsWith('…')) return
      const text = b.line === 'name' ? v.name : b.line === 'email' ? v.email : v.message
      const k = Math.min(row.length, text.replace(/\s+/g, ' ').trim().length - fresh.from)
      if (k <= 0) return
      const wt = g.measureText(row).width
      const wn = wt - g.measureText(row.slice(0, row.length - k)).width
      const x0 = dir === 'ltr' ? cx + wt / 2 - wn : cx - wt / 2
      g.save()
      g.beginPath()
      g.rect(x0 - 2, yy - b.lh / 2, wn + 4, b.lh)
      g.clip()
      g.fillStyle = 'rgb(0,0,255)'
      g.fillText(row, cx, yy)
      g.restore()
    })
    y += b.rows.length * b.lh
  })
  return Number.isFinite(min) ? min : 0
}
