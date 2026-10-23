// The studio as the visitor's own site (D217): /styles/?preview=1 runs inside the frame of /your-site/.
// The opening shows the visitor's business name, a line for their trade and their own sentence, in the
// world on air; nothing else of the studio shows (no bar of ours, no guide, music, invitations or
// chapters below the opening). The parent page talks to it with postMessage, same origin only:
//   parent -> frame  { type: 's60:hero', name, field, line }   the words (any time)
//   parent -> frame  { type: 's60:show', style }               put a world on air
//   frame -> parent  { type: 's60:hello' }                     listening (the parent sends the words and world again)
//   frame -> parent  { type: 's60:ready', style, name, h1 }    that world is painted with these words; where its heading is
// The first words and world also come in the URL (?s=&name=&field=&line=), so the frame paints right
// even before the first message.
import { useSyncExternalStore } from 'react'
import { C } from './content'
import { cleanText, fieldById, LINE_MAX, NAME_MAX } from '../data/site-in-60'

export const PREVIEW = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('preview') === '1'

export interface Hero {
  line1: string
  line2: string
  sub: string
  sub2: string
  cta: string
  /** the visitor's business name (preview only): the bar's wordmark */
  brand?: string
  /** a world's small label row (Buzz) */
  tags?: string
}

const OURS: Hero = { ...C.hero }
let hero: Hero = OURS
/** the name as the parent sent it, echoed back in 'ready' so the parent knows the frame shows it */
let sentName = ''
const subs = new Set<() => void>()

function heroFor(name: string, fieldId: string, line: string): Hero {
  const f = fieldById(fieldId) ?? fieldById('other')!
  const n = cleanText(name, NAME_MAX).trim() || 'העסק שלכם'
  const l = cleanText(line, LINE_MAX).trim()
  return { line1: f.kicker, line2: n, sub: l || f.sub, sub2: '', cta: f.cta, brand: n, tags: f.tags }
}

export function setHero(name: string, field: string, line: string) {
  sentName = name
  hero = heroFor(name, field, line)
  subs.forEach((f) => f())
}

if (PREVIEW) {
  // before the first paint: the chapters below the opening never show (studio.css, D217)
  document.documentElement.classList.add('st-preview')
  const q = new URLSearchParams(window.location.search)
  sentName = q.get('name') ?? ''
  hero = heroFor(sentName, q.get('field') ?? '', q.get('line') ?? '')
}

const subscribe = (f: () => void) => { subs.add(f); return () => { subs.delete(f) } }
const get = () => hero

/** The opening's words: ours on the studio, the visitor's inside the frame of /your-site/. */
export function useHero(): Hero {
  return useSyncExternalStore(subscribe, get, () => OURS)
}

/** Tell the page around the frame (same origin only). */
export function tellParent(msg: { type: 's60:hello' } | { type: 's60:ready'; style: string; h1?: { top: number; bottom: number } }) {
  if (!PREVIEW || window.parent === window) return
  window.parent.postMessage(msg.type === 's60:ready' ? { ...msg, name: sentName } : msg, window.location.origin)
}

type Incoming = { type: 's60:hero'; name: string; field: string; line: string } | { type: 's60:show'; style: string }

/** Listen to the page around the frame; returns the cleanup. */
export function listenParent(onShow: (style: string) => void): () => void {
  if (!PREVIEW) return () => {}
  const on = (e: MessageEvent) => {
    if (e.origin !== window.location.origin || e.source !== window.parent) return
    const m = e.data as Incoming
    if (!m || typeof m !== 'object') return
    if (m.type === 's60:hero') setHero(String(m.name ?? ''), String(m.field ?? ''), String(m.line ?? ''))
    else if (m.type === 's60:show' && typeof m.style === 'string') onShow(m.style)
  }
  window.addEventListener('message', on)
  tellParent({ type: 's60:hello' })
  return () => window.removeEventListener('message', on)
}

/** The long name fits its line (.s60-name, an inline-block <bdi> inside a world's big line): it shrinks
    until it holds inside its heading in at most two lines; the world's own size is the ceiling. A single
    word too long even at the floor breaks anywhere. Runs again whenever the words change. */
export function fitNames(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('.s60-name').forEach((el) => {
    el.style.fontSize = ''
    el.style.overflowWrap = ''
    const box = el.closest<HTMLElement>('h1') ?? el.parentElement
    if (!box) return
    const cs = getComputedStyle(el)
    const max = parseFloat(cs.fontSize)
    const lh0 = parseFloat(cs.lineHeight) || max * 1.05
    // the heading's box, and never wider than the screen (a world may let its heading run past it)
    const width = Math.min(box.clientWidth, document.documentElement.clientWidth - 32)
    let size = max
    for (let i = 0; i < 24; i++) {
      const lines = el.getBoundingClientRect().height / (lh0 * (size / max))
      if (el.scrollWidth <= width + 1 && el.getBoundingClientRect().width <= width + 1 && lines <= 2.2) return
      if (size <= Math.max(18, max * 0.32)) break
      size *= 0.9
      el.style.fontSize = `${size.toFixed(1)}px`
    }
    el.style.overflowWrap = 'anywhere'
  })
}
