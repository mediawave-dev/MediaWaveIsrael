// sea · the pen (D232; the hero's ground since D234). The home page opens on a sheet of paper: the hero's whole
// ground is our own film, in which a ballpoint pen draws the MediaWave logo (the disc's two halves, the name, and
// last the drop on the i), and the headline is set on the same sheet, in ink. It is the one light chapter of a dark
// site. The film is ours from the first number to the last (design/film/ink: the sheet's fibres, the ink, the brass
// tip, the light and the lens are computed, nothing is stock footage), and so is its sound, built from the same
// strokes. It takes the place of the stock showreel and of the focus pull (gate `hero`).
//
// Two cuts of the same take, chosen by the screen's shape: upright (the pen in the upper half, the lower half of
// the sheet left calm for the words) and wide (the pen on the left and high, the lower right left calm). The
// opening's dots gather into the logo's disc where the pen will then draw it; the veil lifts on the lit sheet, and
// the pen comes down. The sheet ends inside the first screen: its foot breaks into the site's dots, and under it
// the showreel waits (SeaHome). The first scroll lifts the sheet off the films, like a page. The film plays once;
// after it the signed still eases in over the last frame, and Replay, a caption under the logo, draws it again.
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
import './sea-sign.css'

const BASE = '/media/ink/ink'
const ALT = 'הלוגו של MediaWave, מצויר בעט כדורי על דף נייר'
type Still = 'open' | 'signed'
/** p: the upright cut (phones). w: the wide one. The same edge is in sea-sign.css (max-aspect-ratio: 19/20, itself included). */
type Cut = 'p' | 'w'
const cutNow = (): Cut => (window.innerWidth / window.innerHeight <= 0.95 ? 'p' : 'w')

/** The film this visit gets: the page's tier, and "on request" where the browser was asked to save data. */
function filmTier(): field.Tier {
  const t = field.tier()
  const saver = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true
  return t === 'full' && saver ? 'calm' : t
}

let webm: boolean | null = null
function source(cut: Cut): string {
  if (webm === null) webm = document.createElement('video').canPlayType('video/webm; codecs="vp9"') === 'probably'
  // the wide cut has a lighter encode for small screens (a phone on its side, a small tablet)
  const light = cut === 'w' && !window.matchMedia('(min-width: 1100px)').matches
  return `${BASE}-${cut}${light ? '-m' : ''}.${webm ? 'webm' : 'mp4'}`
}

/** The signed sheet is what stays on the screen, so where the film's own size would be stretched (a dense or a
    large screen) it comes at twice the size; the blank sheet has nothing to sharpen. */
const dense = (cut: Cut) => {
  const across = cut === 'p' ? Math.max(window.innerWidth, window.innerHeight * 0.5625) : Math.max(window.innerWidth, window.innerHeight * (16 / 9))
  return across * (window.devicePixelRatio || 1) > (cut === 'p' ? 810 : 1600) * 1.25
}
// the stills of each cut (the sheet before the pen, and signed): loaded once, never in the DOM
const stills = new Map<string, Promise<HTMLImageElement>>()
function still(cut: Cut, name: Still): Promise<HTMLImageElement> {
  const key = `${cut}-${name}${name === 'signed' && dense(cut) ? '-2x' : ''}`
  let p = stills.get(key)
  if (!p) {
    p = new Promise<HTMLImageElement>((resolve, reject) => {
      const im = new Image()
      im.decoding = 'async'
      im.onload = () => resolve(im)
      im.onerror = () => { stills.delete(key); reject(new Error(`Failed to load the ink film's still: ${key}`)) }
      im.src = `${BASE}-${key}.webp`
    })
    stills.set(key, p)
  }
  return p
}

// the pen's sound (one for both cuts: the hand is the same): fetched once, decoded when the site's sound is awake
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

/** wait: not played yet. refused: it did not start, or was stopped half way: the signed sheet, and Play. */
type Phase = 'wait' | 'playing' | 'done' | 'refused'

export default function SeaSign() {
  const root = useRef<HTMLElement>(null)
  const sheet = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const hush = useRef<(() => void) | null>(null)
  const want = useRef<Still | 'film'>('signed') // what the canvas should be showing
  const seen = useRef(false) // the sheet is on the screen
  const rolling = useRef(false) // the film really started (a 'playing' event)
  const run = useRef(0) // the frame loop's turn: a newer one ends the older
  const now = useRef<Phase>('wait') // the phase, for the handlers that outlive a render
  const shape = useRef<Cut>('p') // the cut, for the same handlers
  const drawn = useRef<Cut | null>(null) // the cut whose picture is on the canvas
  const [cut, setCut] = useState<Cut | null>(null) // null until the page is up: until then the stylesheet's own guess stands
  const [tier, setTier] = useState<field.Tier | null>(null) // null until the page is up: nothing is decided on the server
  const [stopped, setStopped] = useState(false)
  const [opening, setOpening] = useState(true)
  const [armed, setArmed] = useState(false) // the film's file is attached
  const [inView, setInView] = useState(false)
  const [phase, setPhase] = useState<Phase>('wait')
  now.current = phase
  if (cut) shape.current = cut

  // the cut follows the screen's shape (a phone turned on its side, a window pulled wide), never under a running film
  useEffect(() => {
    const pick = () => { if (now.current !== 'playing') setCut(cutNow()) }
    pick()
    window.addEventListener('resize', pick)
    return () => window.removeEventListener('resize', pick)
  }, [])
  useEffect(() => { if (phase !== 'playing') setCut(cutNow()) }, [phase])
  // a file of the other cut is let go: the next play attaches the right one
  useEffect(() => {
    const v = video.current, src = v?.getAttribute('src')
    if (!v || !cut || !src || src.startsWith(`${BASE}-${cut}`)) return
    v.removeAttribute('src')
    v.load()
  }, [cut])

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
    const of = shape.current
    void still(of, name).then((im) => {
      const c = canvas.current
      if (!c || want.current !== name || shape.current !== of) return
      if (c.width !== im.naturalWidth || c.height !== im.naturalHeight) { c.width = im.naturalWidth; c.height = im.naturalHeight }
      c.getContext('2d')?.drawImage(im, 0, 0)
      c.dataset.shows = name
      drawn.current = of
    }).catch(() => { /* the sheet stays as it was */ })
  }, [])

  /** The film's frame on the canvas, now. */
  const paint = useCallback(() => {
    const v = video.current, c = canvas.current
    if (!v || !c || want.current !== 'film' || v.readyState < 2 || !v.videoWidth) return
    if (c.width !== v.videoWidth || c.height !== v.videoHeight) { c.width = v.videoWidth; c.height = v.videoHeight }
    c.getContext('2d')?.drawImage(v, 0, 0, c.width, c.height)
    c.dataset.shows = 'film'
    drawn.current = shape.current
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
  /** After the film's last frame the signed still eases in over it: the sheet rests on the clean picture, not on
      a frame of a compressed film (a bright flat sheet is where an encoder's steps show). */
  const settle = useCallback(() => {
    const of = shape.current
    void still(of, 'signed').then((im) => {
      const c = canvas.current, ctx = c?.getContext('2d'), v = video.current
      if (!c || !ctx || !v?.ended || want.current !== 'film' || shape.current !== of) return
      const mine = ++run.current
      const t0 = performance.now()
      const step = (t: number) => {
        if (mine !== run.current || want.current !== 'film' || !v.ended) return
        if (t - t0 < 600) {
          // thin coats, one a frame: they close on the still with no step to see
          ctx.globalAlpha = 0.16
          ctx.drawImage(im, 0, 0, c.width, c.height)
          ctx.globalAlpha = 1
          requestAnimationFrame(step)
          return
        }
        if (c.width !== im.naturalWidth || c.height !== im.naturalHeight) { c.width = im.naturalWidth; c.height = im.naturalHeight }
        ctx.drawImage(im, 0, 0)
      }
      requestAnimationFrame(step)
    }).catch(() => { /* the film's last frame stays */ })
  }, [])

  // what the sheet shows while no film runs: blank where the pen is about to come, signed everywhere else. The
  // film's own frames stay (its first, then its last) unless the screen changed shape under them
  useEffect(() => {
    if (tier === null || cut === null) return
    // (nothing drawn yet under a film that has begun: its own first frame is on its way, and a still must not take its place)
    if ((phase === 'playing' || phase === 'done') && !stopped && (drawn.current === null || drawn.current === cut)) return
    put(tier === 'full' && !stopped && phase === 'wait' ? 'open' : 'signed')
  }, [tier, cut, stopped, phase, put])

  /** The film's file, attached once per cut: a later render must not swap it under the picture. */
  const attach = useCallback(() => {
    const v = video.current
    if (v && !v.getAttribute('src')) { v.preload = 'auto'; v.src = source(shape.current) }
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

  // on the screen or not: the film starts only where it can be seen, and holds its frame once half the sheet has
  // left the screen (by then the films under it are playing: the pen does not decode alongside them)
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
    }, { threshold: 0.5 })
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
    if (document.activeElement?.classList.contains('sea-sign__again')) sheet.current?.focus()
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
    let t = 0
    // (a tab nobody is looking at: the pen waits for them)
    const go = () => { window.clearTimeout(t); if (!document.hidden) t = window.setTimeout(draw, 700) }
    go()
    document.addEventListener('visibilitychange', go)
    return () => { window.clearTimeout(t); document.removeEventListener('visibilitychange', go) }
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

  const film = tier !== null && tier !== 'still'
  // (the prerender's window is not the visitor's: its cut stays out of the snapshot, and the stylesheet decides)
  const mine = (window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__ ? null : cut
  const offer = film && !stopped && (phase === 'done' || phase === 'refused' || (tier === 'calm' && phase === 'wait'))
  return (
    <figure ref={root} className="sea-sign" data-cut={mine ?? undefined}>
      {/* the film is the first screen of the sheet; a sheet longer than the screen goes on as plain paper */}
      <div className="sea-sign__band">
      <div ref={sheet} className="sea-sign__sheet" role="img" aria-label={ALT} tabIndex={-1}>
        <canvas ref={canvas} className="sea-sign__film" width="16" height="16" aria-hidden="true" />
        {/* without JavaScript there is no canvas to draw on: the signed sheet as a plain picture, in the cut the
            screen's shape asks for */}
        <noscript dangerouslySetInnerHTML={{ __html: `<picture><source media="(max-aspect-ratio: 19/20)" srcset="${BASE}-p-signed.webp 1x, ${BASE}-p-signed-2x.webp 2x"><img class="sea-sign__film" src="${BASE}-w-signed.webp" srcset="${BASE}-w-signed.webp 1x, ${BASE}-w-signed-2x.webp 2x" alt=""></picture>` }} />
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
            onEnded={() => { stopSound(); paint(); settle(); setPhase('done') }}
            onError={() => setPhase((p) => (p === 'playing' ? 'refused' : p))}
          />
        )}
      </div>
      {/* where the mark will be drawn: the opening's dots gather here (field.heroSpot) */}
      <span className="sea-sign__mark" data-intro="" aria-hidden="true" />
      {/* the pen's ground, in two boxes: the worlds' orb (studio/Guide) never comes to rest on it */}
      <span className="sea-sign__keep gd-keep" aria-hidden="true" />
      <span className="sea-sign__keep gd-keep" aria-hidden="true" />
      {film && (
        // the name starts with the word on the button (WCAG 2.5.3: "click Replay" finds it), said as English
        <button type="button" className="sea-sign__again" data-zone="text" hidden={!offer} onClick={draw}>
          <span className="sea-sign__br" aria-hidden="true">[</span>
          <span lang="en">{phase === 'done' ? 'Replay' : 'Play'}</span>
          <span className="sr-only">{phase === 'done' ? ', לצייר שוב את הלוגו' : ', להציג את ציור הלוגו'}</span>
          <span className="sea-sign__br" aria-hidden="true">]</span>
        </button>
      )}
      </div>
    </figure>
  )
}
