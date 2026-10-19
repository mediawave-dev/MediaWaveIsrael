// sea · text that develops out of dots (harvest lamalama-deep.rtl.md §3 #5, our material): a label,
// the clock, the cursor's label and the header's line are first written as halftone dots, one per
// letter from the start of the line, and 0.2s later each dot turns into its letter. Two passes of
// 0.15s + 5ms per letter (ease out); leaving runs the same in reverse. Spaces stay spaces, so the
// words keep their shape while they develop.
// Only in full motion: calm and still write the text at once (D130). The element's accessible text
// is never the animated one: callers decode aria-hidden tags or keep a static copy for readers.
import { tier } from './field'

const DOTS = ['·', '•', '•', '●']
const runs = new WeakMap<Element, number>()
const easeOut = (t: number) => 1 - (1 - t) * (1 - t)

function dotsFor(text: string): string[] {
  return [...text].map((ch) => (/\s/.test(ch) ? ch : DOTS[Math.floor(Math.random() * DOTS.length)]))
}

function animated(): boolean {
  return tier() === 'full' && !document.documentElement.classList.contains('disable-animations')
}

/** Write `text` into `el` by developing it from dots. Resolves when the last letter has landed. */
export function decode(el: HTMLElement, text: string, delay = 0): Promise<void> {
  cancelAnimationFrame(runs.get(el) ?? 0)
  if (!animated()) { el.textContent = text; return Promise.resolve() }
  const chars = [...text]
  const dots = dotsFor(text)
  const n = chars.length
  const d = (0.15 + 0.005 * n) * 1000
  const lag = 200
  const t0 = performance.now() + delay
  return new Promise((resolve) => {
    const tick = (now: number) => {
      const t = now - t0
      const shown = Math.round(easeOut(Math.min(1, Math.max(0, t / d))) * n)
      const real = Math.round(easeOut(Math.min(1, Math.max(0, (t - lag) / d))) * n)
      let out = ''
      for (let i = 0; i < shown; i++) out += i < real ? chars[i] : dots[i]
      if (el.textContent !== out) el.textContent = out
      if (real < n) runs.set(el, requestAnimationFrame(tick))
      else { el.textContent = text; resolve() }
    }
    runs.set(el, requestAnimationFrame(tick))
  })
}

/** Take the text away the same way: letters back to dots, then the dots go, from the end. */
export function undecode(el: HTMLElement): Promise<void> {
  cancelAnimationFrame(runs.get(el) ?? 0)
  const text = el.textContent ?? ''
  if (!animated() || !text) { el.textContent = ''; return Promise.resolve() }
  const chars = [...text]
  const dots = dotsFor(text)
  const n = chars.length
  const d = (0.15 + 0.005 * n) * 1000
  const t0 = performance.now()
  return new Promise((resolve) => {
    const tick = (now: number) => {
      const t = now - t0
      const real = n - Math.round(easeOut(Math.min(1, t / d)) * n)
      const shown = n - Math.round(easeOut(Math.min(1, Math.max(0, (t - 100) / d))) * n)
      let out = ''
      for (let i = 0; i < shown; i++) out += i < real ? chars[i] : dots[i]
      if (el.textContent !== out) el.textContent = out
      if (shown > 0) runs.set(el, requestAnimationFrame(tick))
      else resolve()
    }
    runs.set(el, requestAnimationFrame(tick))
  })
}

/** Develop every decorative tag inside `root` that has not been developed yet (the reveal calls it). */
export function decodeTags(root: Element) {
  root.querySelectorAll<HTMLElement>('.sea-tag:not([data-dec]):not(.sea-rec)').forEach((el, i) => {
    el.dataset.dec = '1'
    // only plain text tags: a tag with markup inside (the clock, the deck) keeps its children
    if (el.children.length) return
    const text = el.textContent ?? ''
    if (!text.trim()) return
    void decode(el, text, i * 60)
  })
}
