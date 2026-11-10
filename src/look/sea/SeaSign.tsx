// sea · the pen (D232, at the opening since D233). The first thing on the home page is ours: in the hero's disc a
// ballpoint pen draws the MediaWave logo on a sheet of paper lit on a dark desk (the disc's two halves, the name,
// and last the drop on the i). The film is ours from the first number to the last (design/film/ink: the sheet's
// fibres, the ink, the brass tip, the light and the lens are computed, nothing is stock footage), and so is its
// sound, built from the same strokes. It takes the place of the stock showreel and of the focus pull (gate `hero`).
//
// The opening's dots gather into the mark on this very spot; the veil lifts on the lit sheet, and the pen comes
// down. On the first scroll the words step back and the sheet comes to the middle of the screen and closer, held
// there for most of a screen: the film alone on the stage (the WhatsApp dock takes the keys' place meanwhile).
// Then the page goes on. The film plays once; after it the sheet stays signed, the hold shrinks to a short bow,
// and Replay draws it again.
//   still, no JavaScript     the signed sheet, a picture; no hold
//   calm, or Save-Data       the signed sheet, and the film on request (its file is fetched only then); no hold
//   full                     the film by itself, once; its sound only when the visitor's sound is already awake
// The picture is drawn on a canvas from a 2 px video, as the site's other films are: a canvas is never the page's
// largest paint, so the headline stays the LCP. The accessibility widget's stop switch can be pressed at any
// moment: the film stops, the signed sheet shows and the hold lets go. A film that will not start (autoplay
// refused, a dead network, a file that fails) also leaves the signed sheet, with Play: the logo is never missing.
// [קופי: נתי] the picture's description and the two labels.
import { useCallback, useEffect, useRef, useState } from 'react'
import * as field from './field'
import * as sound from './sound'
import { releaseHold } from './hold'
import './sea-sign.css'

const BASE = '/media/ink/ink'
const ALT = 'הלוגו של MediaWave, מצויר בעט כדורי על דף נייר'
type Still = 'open' | 'signed'

/** The film this visit gets: the page's tier, and "on request" where the browser was asked to save data. */
function filmTier(): field.Tier {
  const t = field.tier()
  const saver = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true
  return t === 'full' && saver ? 'calm' : t
}

let webm: boolean | null = null
function source(): string {
  if (webm === null) webm = document.createElement('video').canPlayType('video/webm; codecs="vp9"') === 'probably'
  const phone = !window.matchMedia('(min-width: 768px)').matches
  return `${BASE}${phone ? '-m' : ''}.${webm ? 'webm' : 'mp4'}`
}

// the two stills (the sheet before the pen, and signed): loaded once, never in the DOM
const stills = new Map<Still, Promise<HTMLImageElement>>()
function still(name: Still): Promise<HTMLImageElement> {
  let p = stills.get(name)
  if (!p) {
    p = new Promise<HTMLImageElement>((resolve, reject) => {
      const im = new Image()
      im.decoding = 'async'
      im.onload = () => resolve(im)
      im.onerror = () => { stills.delete(name); reject(new Error(`Failed to load the ink film's still: ${name}`)) }
      im.src = `${BASE}-${name}.webp`
    })
    stills.set(name, p)
  }
  return p
}

// the pen's sound: fetched once, decoded when the site's sound is awake (there is no context before a first tap)
let bytes: Promise<ArrayBuffer> | null = null
let pen: AudioBuffer | null = null
async function penSound(): Promise<AudioBuffer | null> {
  if (pen) return pen
  bytes ??= fetch(`${BASE}.m4a`)
    .then((r) => { if (!r.ok) throw new Error(`Failed to fetch the ink film's sound: ${r.status}`); return r.arrayBuffer() })
    .catch((e: unknown) => { bytes = null; throw e }) // a failed fetch is tried again the next time, not remembered
  // decoding empties the buffer it is given, so it gets a copy and the bytes stay for the next try
  const decoding = sound.decode((await bytes).slice(0))
  pen = decoding ? await decoding : null
  return pen
}

/** The widget's stop switch, read at the moment it matters (it is a class on the root, set at any time). */
const stoppedNow = () => { const c = document.documentElement.classList; return c.contains('disable-animations') || c.contains('motion-reduced') }
const openingNow = () => document.documentElement.classList.contains('sea-opening')
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const ease = (v: number) => { const u = clamp01(v); return u * u * (3 - 2 * u) }

/** wait: not played yet. refused: it did not start, or was stopped half way: the signed sheet, and Play. */
type Phase = 'wait' | 'playing' | 'done' | 'refused'

export default function SeaSign() {
  const root = useRef<HTMLElement>(null)
  const disc = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const hush = useRef<(() => void) | null>(null)
  const want = useRef<Still | 'film'>('signed') // what the canvas should be showing
  const seen = useRef(false) // the figure is on the screen
  const rolling = useRef(false) // the film really started (a 'playing' event)
  const run = useRef(0) // the frame loop's turn: a newer one ends the older
  const now = useRef<Phase>('wait') // the phase, for the handlers that outlive a render
  const [tier, setTier] = useState<field.Tier | null>(null) // null until the page is up: nothing is decided on the server
  const [stopped, setStopped] = useState(false)
  const [opening, setOpening] = useState(true)
  const [armed, setArmed] = useState(false) // the film's file is attached
  const [inView, setInView] = useState(false)
  const [phase, setPhase] = useState<Phase>('wait')
  now.current = phase

  // which film this visit gets; the stop switch and the opening, watched on the root's classes
  useEffect(() => {
    setTier(filmTier())
    const read = () => { setStopped(stoppedNow()); setOpening(openingNow()) }
    read()
    const mo = new MutationObserver(read)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => mo.disconnect()
  }, [])

  /** A still on the canvas (when it has loaded, and only if it is still the one wanted). */
  const put = useCallback((name: Still) => {
    want.current = name
    void still(name).then((im) => {
      const c = canvas.current
      if (!c || want.current !== name) return
      if (c.width !== im.naturalWidth) c.width = c.height = im.naturalWidth
      c.getContext('2d')?.drawImage(im, 0, 0)
      c.dataset.shows = name
    }).catch(() => { /* the sheet stays as it was */ })
  }, [])

  /** The film's frame on the canvas, now. */
  const paint = useCallback(() => {
    const v = video.current, c = canvas.current
    if (!v || !c || want.current !== 'film' || v.readyState < 2 || !v.videoWidth) return
    if (c.width !== v.videoWidth) c.width = c.height = v.videoWidth
    c.getContext('2d')?.drawImage(v, 0, 0, c.width, c.height)
    c.dataset.shows = 'film'
  }, [])
  /** Every frame of the film on the canvas while it plays. A new run ends the one before it (a stall, a replay). */
  const roll = useCallback(() => {
    const v = video.current
    if (!v) return
    const mine = ++run.current
    const step = () => {
      if (mine !== run.current || want.current !== 'film') return
      paint()
      if (v.paused || v.ended) return
      if ('requestVideoFrameCallback' in v) v.requestVideoFrameCallback(step)
      else requestAnimationFrame(step)
    }
    step()
  }, [paint])

  // what the sheet shows while no film runs: blank where the pen is about to come, signed everywhere else
  useEffect(() => {
    if (tier === null || ((phase === 'playing' || phase === 'done') && !stopped)) return
    put(tier === 'full' && !stopped && phase === 'wait' ? 'open' : 'signed')
  }, [tier, stopped, phase, put])

  /** The film's file, chosen once: a later render (a phone turned on its side) must not swap it under the picture. */
  const attach = useCallback(() => {
    const v = video.current
    if (v && !v.getAttribute('src')) { v.preload = 'auto'; v.src = source() }
    return v
  }, [])

  // full: the film's bytes come after the page has loaded and gone idle, never before the headline
  useEffect(() => {
    if (tier !== 'full') return
    let idle = 0
    const go = () => { attach(); setArmed(true) }
    const later = () => { idle = window.requestIdleCallback ? window.requestIdleCallback(go, { timeout: 2000 }) : window.setTimeout(go, 500) }
    if (document.readyState === 'complete') later()
    else window.addEventListener('load', later, { once: true })
    return () => {
      window.removeEventListener('load', later)
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle)
      window.clearTimeout(idle)
    }
  }, [tier, attach])

  // on the screen or not: the film starts only where it can be seen, and holds its frame when it cannot
  useEffect(() => {
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      seen.current = e.isIntersecting
      setInView(e.isIntersecting)
      const v = video.current
      if (!v) return
      if (!e.isIntersecting) { if (!v.paused) v.pause() }
      else if (now.current === 'playing' && v.paused && !v.ended && !document.hidden && !stoppedNow()) void v.play().catch(() => {})
    }, { threshold: 0.2 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const stopSound = useCallback(() => { hush.current?.(); hush.current = null }, [])
  // the sound joins the picture where the picture is: after a stall or a late tap it starts from the same moment.
  // Nothing is fetched unless the film is running and the sound is awake.
  const startSound = useCallback(async () => {
    stopSound()
    const live = () => { const v = video.current; return !!v && !v.paused && !v.ended && sound.isRunning() }
    if (!live()) return
    const buffer = await penSound().catch(() => null)
    const v = video.current
    if (!buffer || !v || !live()) return
    stopSound()
    hush.current = sound.over(buffer, v.currentTime)
  }, [stopSound])

  const draw = useCallback(() => {
    if (stoppedNow()) return
    const v = attach()
    if (!v) return
    // the button that asked goes away while the film runs: its focus moves to the picture, not to nowhere
    if (document.activeElement?.classList.contains('sea-sign__again')) disc.current?.focus()
    rolling.current = false
    // set here, not only at the next render: a film that is already buffered can start playing before React commits
    now.current = 'playing'
    try { v.currentTime = 0 } catch { /* nothing loaded yet: it starts at the start anyway */ }
    setPhase('playing')
    // an aborted play is a pause that came first (the hero left the screen): the film goes on when it is back
    void v.play().catch((e: unknown) => { if ((e as DOMException | null)?.name !== 'AbortError') setPhase('refused') })
  }, [attach])

  // full: when the opening has lifted and the sheet is on the screen, the pen comes down
  useEffect(() => {
    if (tier !== 'full' || stopped || opening || !armed || !inView || phase !== 'wait') return
    const t = window.setTimeout(draw, 700)
    return () => window.clearTimeout(t)
  }, [tier, stopped, opening, armed, inView, phase, draw])

  // while it plays: in a hidden tab the film holds its frame and its sound, and if nothing ever arrives the signed
  // sheet takes its place
  useEffect(() => {
    const v = video.current
    if (!v || phase !== 'playing') return
    const onTab = () => {
      if (document.hidden) { if (!v.paused) v.pause() }
      else if (seen.current && now.current === 'playing' && !stoppedNow() && v.paused && !v.ended) void v.play().catch(() => {})
    }
    document.addEventListener('visibilitychange', onTab)
    const dog = window.setTimeout(() => { if (!rolling.current) { v.pause(); setPhase('refused') } }, 8000)
    return () => { document.removeEventListener('visibilitychange', onTab); window.clearTimeout(dog) }
  }, [phase])

  // the stop switch, pressed while the film runs: it stops, and its sound with it
  useEffect(() => {
    if (!stopped) return
    const v = video.current
    if (v && !v.paused) v.pause()
    stopSound()
    setPhase((p) => (p === 'playing' ? 'refused' : p))
  }, [stopped, stopSound])

  // refused by the browser (autoplay off, a phone saving power): the visitor's next click or key on the page
  // starts it, as it does for the site's other films
  useEffect(() => {
    if (tier !== 'full' || phase !== 'refused' || stopped || !inView) return
    const again = (e: Event) => { if (!(e.target as Element | null)?.closest?.('.sea-sign__again')) draw() }
    window.addEventListener('click', again, { once: true })
    window.addEventListener('keydown', again, { once: true })
    return () => { window.removeEventListener('click', again); window.removeEventListener('keydown', again) }
  }, [tier, phase, stopped, inView, draw])

  // the visitor's sound switch: off stops the pen at once, on (a tap in the middle of the film) lets it in
  useEffect(() => sound.onChange(() => {
    if (!sound.isOn()) stopSound()
    else if (sound.isRunning() && !hush.current) void startSound()
  }), [startSound, stopSound])
  useEffect(() => () => { run.current++; stopSound() }, [stopSound])

  // the hold: on the first scroll the words step back and the sheet takes the middle of the screen, closer. Where
  // there is no motion, the stop switch is on, or the hero is taller than the screen, the hold's scroll length
  // leaves and the hero is a plain one.
  useEffect(() => {
    const fig = root.current, sheet = disc.current
    const wrap = fig?.closest<HTMLElement>('.sea-focus'), hero = fig?.closest<HTMLElement>('.sea-hero')
    const words = hero?.querySelector<HTMLElement>('.sea-in')
    if (tier === null || !fig || !sheet || !wrap || !hero || !words || (window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__) return
    const html = document.documentElement.classList
    const pin = () => parseFloat(getComputedStyle(hero).top) || 0
    const fits = () => hero.offsetHeight + pin() <= window.innerHeight + 1
    if (tier !== 'full' || stopped || !fits()) { releaseHold(wrap, hero); return }
    let raf = 0
    let rest: { x: number; y: number; w: number } | null = null
    const again = fig.querySelector<HTMLElement>('.sea-sign__again')
    const measure = () => {
      const was = sheet.style.transform
      sheet.style.transform = 'none'
      // where the sheet rests while the hero is pinned: its place in the hero, with the hero at the pin
      const h = hero.getBoundingClientRect(), d = sheet.getBoundingClientRect()
      rest = { x: d.left + d.width / 2, y: d.top - h.top + pin() + d.height / 2, w: d.width }
      sheet.style.transform = was
    }
    const apply = () => {
      raf = 0
      const hold = wrap.offsetHeight - hero.offsetHeight
      const p = hold > 0 ? clamp01((pin() - wrap.getBoundingClientRect().top) / hold) : 0
      const e = ease(p / 0.34)
      // at rest nothing is remembered: the next move measures the sheet where it now is (a banner answered, a
      // font arrived, the text made larger)
      if (e <= 0.001) rest = null
      else if (!rest) measure()
      if (rest) {
        const vw = window.innerWidth, vh = window.innerHeight
        const phone = vw < 768
        // a phone's sheet is already as wide as the screen: it comes closer, past the screen's sides
        const size = phone ? Math.min(vw * 1.18, vh * 0.6) : Math.min(vw, vh * 0.76, 760)
        const scale = 1 + (Math.min(3.2, Math.max(1, size / rest.w)) - 1) * e
        const tx = (vw / 2 - rest.x) * e, ty = ((phone ? vh : vh + pin()) / 2 - rest.y) * e
        sheet.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) scale(${scale.toFixed(4)})`
      } else {
        sheet.style.transform = ''
      }
      const away = p > 0 ? (1 - ease(p / 0.2)).toFixed(3) : ''
      words.style.opacity = away
      if (again) again.style.opacity = away
      wrap.classList.toggle('is-out', p > 0.1)
      // the hero's keys are gone from here on: the dock (ShotDock) reads this and takes their place
      html.toggle('sea-focus-out', p > 0.2)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(apply) }
    const letGo = () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      ro.disconnect()
      cancelAnimationFrame(raf)
      sheet.style.transform = ''
      words.style.opacity = ''
      if (again) again.style.opacity = ''
      wrap.classList.remove('is-out')
      html.remove('sea-focus-out')
    }
    // a phone turned on its side: the hero no longer fits, so the hold lets go
    function onResize() { rest = null; if (fits()) onScroll(); else { letGo(); releaseHold(wrap!, hero!) } }
    const ro = new ResizeObserver(() => { rest = null; onScroll() })
    ro.observe(hero)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    onScroll()
    return letGo
  }, [tier, stopped])

  // after the film the hold is a short bow, not a stop on a still picture. Its length changes only at the very
  // top of the page, where nobody's place depends on it
  useEffect(() => {
    const wrap = root.current?.closest<HTMLElement>('.sea-focus')
    if (!wrap) return
    const short = phase === 'done' || phase === 'refused'
    const set = () => {
      if (window.scrollY > 2 || wrap.classList.contains('is-signed') === short) return
      wrap.classList.toggle('is-signed', short)
      window.dispatchEvent(new Event('resize')) // the chapters below measured themselves with the hold
    }
    set()
    window.addEventListener('scroll', set, { passive: true })
    return () => window.removeEventListener('scroll', set)
  }, [phase])

  const film = tier !== null && tier !== 'still'
  const offer = film && !stopped && (phase === 'done' || phase === 'refused' || (tier === 'calm' && phase === 'wait'))
  return (
    <figure ref={root} className="sea-sign">
      <div ref={disc} className="sea-sign__disc" role="img" aria-label={ALT} data-zone="art" data-intro="" tabIndex={-1}>
        <canvas ref={canvas} className="sea-sign__film" width="16" height="16" aria-hidden="true" />
        {/* without JavaScript there is no canvas to draw on: the signed sheet as a plain picture */}
        <noscript dangerouslySetInnerHTML={{ __html: `<img class="sea-sign__film" src="${BASE}-signed.webp" alt="" width="900" height="900">` }} />
        {film && (
          <video
            ref={video}
            className="sea-sign__src"
            muted
            playsInline
            preload="none"
            disablePictureInPicture
            tabIndex={-1}
            aria-hidden="true"
            onPlaying={() => { if (now.current !== 'playing') return; rolling.current = true; want.current = 'film'; roll(); void startSound() }}
            onSeeked={paint}
            onWaiting={stopSound}
            onPause={stopSound}
            onEnded={() => { stopSound(); paint(); setPhase('done') }}
            onError={() => setPhase((p) => (p === 'playing' ? 'refused' : p))}
          />
        )}
      </div>
      {film && (
        // the name starts with the word on the button (WCAG 2.5.3: "click Replay" finds it), said as English
        <button type="button" className="sea-sign__again" data-zone="text" hidden={!offer} onClick={draw}>
          <span lang="en">{phase === 'done' ? 'Replay' : 'Play'}</span>
          <span className="sr-only">{phase === 'done' ? ', לצייר שוב את הלוגו' : ', להציג את ציור הלוגו'}</span>
        </button>
      )}
    </figure>
  )
}
