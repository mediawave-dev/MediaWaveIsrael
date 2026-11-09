// sea · the words (S6): a chapter's opening paragraph lights up word by word as the reader scrolls into it,
// on the site's one scroll clock (wave/clock.ts). Each word goes from about 22% ink to the paragraph's own
// colour, linearly, a stagger behind the one before it; nothing moves in space. Quantised to a few shades
// (sea-ink.css), a word is written only when its shade changes and the loop never reads layout. The prerender,
// no script, the still and the calm tiers keep the plain paragraph, fully lit: the words are split only after
// mount and only in the full tier, into inline spans with ordinary spaces, so the text stays one paragraph.
// Dim words are for a page in motion only: a reader who stops gets the whole paragraph at full ink (REST_MS), and it
// stays lit; a paragraph already on the screen at mount is never split, so it cannot flash dark.
import { Fragment, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react'
import { clamp01, docTop, useGear, type Range } from '../wave/clock'
import { tier } from './field'
import './sea-ink.css'

/** Shades between the first ink and the paragraph's own colour; the last shade is no class at all. */
const STEPS = 8
const SHADE = Array.from({ length: STEPS }, (_, i) => `sea-ink__k${i}`)
/** On a timeline in which one word takes BODY: about six words are in the middle of lighting at any moment. */
const STAGGER = 0.02
const BODY = 0.12
/** how long after the scroll stops the words on the screen come to full ink: AA holds for anything the reader stops on */
const REST_MS = 700

/** From the paragraph's arrival at the bottom of the screen until its last line is above the lower third. */
const flowing: Range = (el, vh) => {
  const top = docTop(el)
  const start = top - vh * 0.9
  const end = Math.max(start + vh * 0.42, top + el.offsetHeight - vh * 0.6)
  const last = document.documentElement.scrollHeight - vh
  return [Math.min(start, last - 1), Math.min(end, last)]
}

/** Inside the laptop's sticky stage the paragraph stands still, so it lights over the first part of the hold. */
const held: Range = (el, vh) => {
  const stage = el.closest<HTMLElement>('.sea-lap__stage')
  const run = stage?.parentElement
  if (!stage || !run) return flowing(el, vh)
  const top = docTop(run)
  const start = top + docTop(el) - docTop(stage) - vh * 0.92
  return [start, Math.max(start + vh * 0.42, top + Math.max(0, run.offsetHeight - vh) * 0.25)]
}

function Words({ host, text, range }: { host: RefObject<HTMLElement>; text: string; range: Range }) {
  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text])
  const spans = useRef<HTMLSpanElement[]>([])
  const shown = useRef(new Int8Array(words.length).fill(-1))
  const length = BODY + (words.length - 1) * STAGGER
  const progress = useRef(0)
  /** dim only while near the screen: anything further away, and a paragraph the reader has stopped on, is at full ink */
  const dimmable = useRef(false)

  const paint = useCallback(() => {
    const t = progress.current * length
    for (let i = 0; i < words.length; i++) {
      const q = dimmable.current ? Math.round(clamp01((t - i * STAGGER) / BODY) * STEPS) : STEPS
      if (q === shown.current[i]) continue
      shown.current[i] = q
      spans.current[i].className = q < STEPS ? SHADE[q] : ''
    }
  }, [words, length])

  useEffect(() => {
    const el = host.current
    if (!el) return
    let timer = 0
    let rested = false
    const settle = () => {
      const r = el.getBoundingClientRect()
      if (r.bottom <= 0 || r.top >= window.innerHeight) return
      rested = true
      dimmable.current = false
      el.classList.add('sea-ink--rest')
      paint()
      window.removeEventListener('scroll', arm)
      io.disconnect()
    }
    const arm = () => {
      window.clearTimeout(timer)
      if (dimmable.current) timer = window.setTimeout(settle, REST_MS)
    }
    // the margin keeps the change of shade out of sight
    const io = new IntersectionObserver(([e]) => {
      if (rested) return
      dimmable.current = e.isIntersecting
      paint()
      arm()
    }, { rootMargin: '30% 0px' })
    io.observe(el)
    window.addEventListener('scroll', arm, { passive: true })
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('scroll', arm)
      io.disconnect()
    }
  }, [host, paint])

  useGear(host, range, (p) => {
    progress.current = p
    paint()
  })

  return (
    <>
      {words.map((w, i) => (
        <Fragment key={i}><span ref={(n) => { if (n) spans.current[i] = n }}>{w}</span>{i < words.length - 1 ? ' ' : ''}</Fragment>
      ))}
    </>
  )
}

interface SeaInkProps {
  /** the paragraph, as plain text */
  text: string
  className?: string
  /** rendered before the words, inside the paragraph (a small tag in the first line's indent) */
  before?: ReactNode
  /** the paragraph sits in the laptop's sticky stage */
  hold?: boolean
  /** keeps [data-reveal] on the paragraph, for a tag inside it */
  reveal?: boolean
}

export default function SeaInk({ text, className = '', before, hold = false, reveal = false }: SeaInkProps) {
  const host = useRef<HTMLParagraphElement>(null)
  const [live, setLive] = useState(false)
  // before the first paint; a paragraph the reader can already see (a reload half way down, a chapter that mounts on screen) stays plain
  useLayoutEffect(() => {
    const el = host.current
    if (el && tier() === 'full' && el.getBoundingClientRect().top >= window.innerHeight) setLive(true)
  }, [])
  return (
    <p ref={host} className={className} data-zone="text" data-reveal={reveal ? '' : undefined}>
      {before}
      {live ? <Words host={host} text={text} range={hold ? held : flowing} /> : text}
    </p>
  )
}
