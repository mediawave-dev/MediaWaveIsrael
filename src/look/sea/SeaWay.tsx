// sea · the header knows where you are (harvest lamalama-deep.rtl.md §3 #6, in our material). Past the
// opening, the wordmark in the title pill gives way to the mark in dots and a short line: entering a
// chapter (its top past the middle of the screen), the mark's dots travel into that chapter's object
// (the laptop, the cassette, the bubble ...) and a line for the chapter develops out of dots, one of
// two or three at random, so a second visit reads differently. On the services stage the mark follows
// the object on the stage. SeaIsland decides how much of the pill shows (gate `head`, lab.ts).
// Decorative (aria-hidden): the chapter's heading says the same; the home link keeps its label.
// Calm and still: the mark switches without travel and the line without developing.
// [קופי: נתי] every line below.
import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { icon, GRID, DOT_COLOURS, type Dot } from './way-icons'
import { WA_DOTS } from './wa-dots-data'
import { decode, undecode } from './decode'
import { tier } from './field'
import { SCENE } from './gears'
import { SERVICES } from '../data'

const LINES: Record<string, string[]> = {
  hero: ['נעים להכיר', 'ברוכים הבאים', 'כאן מתחילים'],
  websites: ['כאן נבנה האתר', 'מקוד לאתר', 'מאפס, בלי תבנית'],
  film: ['מהקלטת למסך'],
  why: ['למה דווקא אנחנו', 'מה מקבלים', 'בלי אותיות קטנות'],
  services: ['מה אנחנו עושים', 'בחרו מה צריך', 'שש דרכים לעזור'],
  process: ['ככה זה עובד', 'צעד אחרי צעד', 'בלי הפתעות'],
  faq: ['שאלתם, ענינו', 'לפני שכותבים', 'הכל על השולחן'],
  contact: ['רק תגידו שלום', 'שורה אחת מספיקה', 'נדבר?'],
  work: ['מהעבודה', 'עבודה אמיתית'],
}
const ICON: Record<string, string> = {
  hero: 'horizon', websites: 'laptop', film: 'reels', why: 'why', services: 'laptop', process: 'process', faq: 'faq', contact: 'wa', work: 'laptop',
}
const SIZE = 30

const WA: Dot[] = WA_DOTS.map(([x, y, r]) => [(x * GRID) / 15, (y * GRID) / 15, (r * GRID) / 15, 0])
const dotsOf = (name: string): Dot[] => (name === 'wa' ? WA : icon(name))

interface Live { x: number; y: number; r: number; b: number; fx: number; fy: number; fr: number; fb: number; tx: number; ty: number; tr: number; tb: number; delay: number }

/** Pair each new dot with the nearest old one, so every dot travels a short way. */
function pairs(from: Live[], to: Dot[]): Live[] {
  const left = from.map((d, i) => ({ d, i }))
  const out: Live[] = []
  for (const [x, y, r, b] of to) {
    let best = -1
    let bd = Infinity
    for (let k = 0; k < left.length; k++) {
      const dd = (left[k].d.x - x) ** 2 + (left[k].d.y - y) ** 2
      if (dd < bd) { bd = dd; best = k }
    }
    const src = best >= 0 ? left.splice(best, 1)[0].d : { x: GRID / 2, y: GRID / 2, r: 0, b }
    out.push({ x: src.x, y: src.y, r: src.r, b: src.b, fx: src.x, fy: src.y, fr: src.r, fb: src.b, tx: x, ty: y, tr: r, tb: b, delay: Math.random() * 140 })
  }
  // the dots with no place in the new object shrink away where they are
  for (const { d } of left) out.push({ ...d, fx: d.x, fy: d.y, fr: d.r, fb: d.b, tx: d.x, ty: d.y, tr: 0, tb: d.b, delay: Math.random() * 80 })
  return out
}

const ease = (t: number) => 1 - Math.pow(1 - t, 3)

// (D199) where each chapter starts, in page px, measured once and again whenever the page's height changes
// (lazy chapters, fonts, the held stages growing). Reading every chapter's box on each scroll frame, right
// after the scroll scenes had written their styles, forced a full style and layout every frame (1.3 s of a
// 6 s phone scroll).
let tops: { id: string; top: number }[] = []
function measureChapters() {
  const y = window.scrollY
  tops = [...document.querySelectorAll<HTMLElement>('main [data-chapter]')].map((el) => ({ id: el.dataset.chapter ?? '', top: el.getBoundingClientRect().top + y }))
}
function chapterAt(y: number, vh: number): string {
  const mid = y + vh * 0.5
  let cur = 'hero'
  for (const t of tops) if (t.top <= mid) cur = t.id || cur
  return cur
}

export default function SeaWay() {
  const cv = useRef<HTMLCanvasElement>(null)
  const line = useRef<HTMLSpanElement>(null)
  const { pathname } = useLocation()

  useEffect(() => {
    const canvas = cv.current
    const ctx = canvas?.getContext('2d')
    const html = document.documentElement.classList
    const moving = tier() === 'full'
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    if (canvas) { canvas.width = SIZE * dpr; canvas.height = SIZE * dpr }
    const unit = SIZE / GRID
    let dots: Live[] = dotsOf('horizon').map(([x, y, r, b]) => ({ x, y, r, b, fx: x, fy: y, fr: r, fb: b, tx: x, ty: y, tr: r, tb: b, delay: 0 }))
    let t0 = 0
    let raf = 0
    const draw = (now: number) => {
      raf = 0
      if (!ctx) return
      let busy = false
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, SIZE, SIZE)
      for (const d of dots) {
        const k = moving ? ease(Math.min(1, Math.max(0, (now - t0 - d.delay) / 460))) : 1
        if (k < 1) busy = true
        d.x = d.fx + (d.tx - d.fx) * k
        d.y = d.fy + (d.ty - d.fy) * k
        d.r = d.fr + (d.tr - d.fr) * k
        d.b = k > 0.5 ? d.tb : d.fb
        if (d.r < 0.04) continue
        ctx.fillStyle = DOT_COLOURS[d.b] ?? DOT_COLOURS[0]
        ctx.beginPath()
        ctx.arc(d.x * unit, d.y * unit, Math.max(0.5, d.r * unit * 0.92), 0, Math.PI * 2)
        ctx.fill()
      }
      if (busy) raf = requestAnimationFrame(draw)
      else dots = dots.filter((d) => d.r > 0.04)
    }
    const morph = (name: string) => {
      dots = pairs(dots, dotsOf(name))
      t0 = performance.now()
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    // inner pages: the page's own object and the service's name
    const svc = SERVICES.find((s) => pathname.replace(/\/$/, '') === (s.href ?? '').replace(/\/$/, ''))
    let chapter = ''
    let iconName = ''
    let svcIcon = ''
    const lastLine: Record<string, string> = {}
    const setIcon = (name: string) => { if (name !== iconName) { iconName = name; morph(name) } }
    const setLine = (key: string) => {
      const el = line.current
      if (!el) return
      const list = svc && key === 'page' ? [svc.title] : LINES[key] ?? []
      const choices = list.filter((l) => l !== lastLine[key])
      const next = (choices.length ? choices : list)[Math.floor(Math.random() * (choices.length || list.length))] ?? ''
      lastLine[key] = next
      // the folded header opens just wide enough to say it (SeaIsland)
      window.dispatchEvent(new CustomEvent('sea:way', { detail: next }))
      void undecode(el).then(() => decode(el, next))
    }
    // the scroll position is read in the scroll event (layout is clean there), not in the frame after
    let sy = window.scrollY
    let vh = window.innerHeight
    const update = () => {
      // the wordmark at the top of every page; the mark in dots once the reader is under way
      const under = sy > vh * 0.35
      if (html.contains('sea-way-on') !== under) html.toggle('sea-way-on', under)
      const ch = svc ? 'page' : chapterAt(sy, vh)
      if (ch !== chapter) {
        chapter = ch
        setLine(ch)
        if (ch === 'page') setIcon(SCENE[svc!.id] ?? 'horizon')
        else setIcon(ch === 'services' && svcIcon ? svcIcon : ICON[ch] ?? 'horizon')
      }
    }
    let pending = 0
    const onScroll = () => { sy = window.scrollY; vh = window.innerHeight; if (!pending) pending = requestAnimationFrame(() => { pending = 0; update() }) }
    // ResizeObserver callbacks run after layout, so measuring there is free
    const ro = new ResizeObserver(() => { vh = window.innerHeight; measureChapters(); update() })
    ro.observe(document.body)
    measureChapters()
    const onSvc = (e: Event) => {
      const id = (e as CustomEvent<string>).detail
      svcIcon = SCENE[id] ?? 'laptop'
      if (chapter === 'services') setIcon(svcIcon)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('sea:svc', onSvc)
    return () => {
      cancelAnimationFrame(raf)
      cancelAnimationFrame(pending)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('sea:svc', onSvc)
      ro.disconnect()
      html.remove('sea-way-on')
    }
  }, [pathname])

  return (
    <span className="sea-way" aria-hidden="true">
      <canvas ref={cv} className="sea-way__mark" width={SIZE} height={SIZE} />
      <span ref={line} className="sea-way__line" />
    </span>
  )
}
