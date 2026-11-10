// sea · the signature (D232). Under the sentence that stands alone on the emptied stage, a ballpoint pen draws the
// MediaWave logo on a sheet of paper lit on a dark desk: the disc's two halves, the name, and last of all the drop
// on the i. The film is ours from the first number to the last (design/film/ink: the sheet's fibres, the ink, the
// brass tip, the light and the lens are computed, nothing is stock footage), and so is its sound, built from the
// same strokes. It plays once, when the stage has emptied, and then the page stays signed: coming back shows the
// finished sheet, and Replay draws it again.
//   still, no JavaScript     the finished sheet, a picture
//   calm, or Save-Data       the finished sheet, and the film on request (its file is fetched only then)
//   full                     the film by itself, once; its sound only when the visitor's sound is already awake
// The accessibility widget's stop switch can be pressed at any moment: the film stops and the finished sheet shows.
// A film that will not start (autoplay refused, a dead network, a file that fails) also leaves the finished sheet,
// with Play: the logo is never missing. The film is a disc of light (a soft round mask), the way the hero's disc
// is a disc of dots. [קופי: נתי] the picture's description and the two labels.
import { useCallback, useEffect, useRef, useState } from 'react'
import * as field from './field'
import * as sound from './sound'
import './sea-sign.css'

const BASE = '/media/ink/ink'
const ALT = 'הלוגו של MediaWave, מצויר בעט כדורי על דף נייר'

let webm: boolean | null = null
function source(): string {
  if (webm === null) webm = document.createElement('video').canPlayType('video/webm; codecs="vp9"') === 'probably'
  const phone = !window.matchMedia('(min-width: 768px)').matches
  return `${BASE}${phone ? '-m' : ''}.${webm ? 'webm' : 'mp4'}`
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

/** wait: not played yet. refused: it did not start, or was stopped half way: the finished sheet, and Play. */
type Phase = 'wait' | 'playing' | 'done' | 'refused'

export default function SeaSign({ on }: { on: boolean }) {
  const root = useRef<HTMLElement>(null)
  const disc = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const hush = useRef<(() => void) | null>(null)
  const seen = useRef(false) // the figure is on the screen
  const rolling = useRef(false) // the film really started (a 'playing' event)
  const [tier, setTier] = useState<field.Tier>('still')
  const [stopped, setStopped] = useState(false)
  const [near, setNear] = useState(false)
  const [phase, setPhase] = useState<Phase>('wait')

  // which film this visit gets, and the stop switch, watched for the whole visit
  useEffect(() => {
    const t = field.tier()
    const saver = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true
    setTier(t === 'full' && saver ? 'calm' : t)
    setStopped(stoppedNow())
    const mo = new MutationObserver(() => setStopped(stoppedNow()))
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => mo.disconnect()
  }, [])

  // full: the film's bytes wait until the stage is a screen and a half away
  useEffect(() => {
    const el = root.current
    if (!el || tier !== 'full') return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); io.disconnect() } }, { rootMargin: '150% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [tier])

  /** The film's file, chosen once: a later render (a phone turned on its side) must not swap it under the picture. */
  const attach = useCallback(() => {
    const v = video.current
    if (v && !v.getAttribute('src')) { v.preload = 'auto'; v.src = source() }
    return v
  }, [])
  useEffect(() => { if (near) attach() }, [near, attach])

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
    try { v.currentTime = 0 } catch { /* nothing loaded yet: it starts at the start anyway */ }
    setPhase('playing')
    // an aborted play is a pause that came first (the stage left the screen): the film goes on when it is back
    void v.play().catch((e: unknown) => { if ((e as DOMException | null)?.name !== 'AbortError') setPhase('refused') })
  }, [attach])

  // full: once the stage has emptied, the pen comes down (a beat after the sentence)
  useEffect(() => {
    if (tier !== 'full' || stopped || !on || !near || phase !== 'wait') return
    const t = window.setTimeout(draw, 900)
    return () => window.clearTimeout(t)
  }, [tier, stopped, on, near, phase, draw])

  // while it plays: off the screen or in a hidden tab the film holds its frame and its sound, and goes on from
  // there when it is back; and if nothing ever arrives, the finished sheet takes its place
  useEffect(() => {
    const el = root.current, v = video.current
    if (!el || !v || phase !== 'playing') return
    const go = () => { if (seen.current && !document.hidden && !stoppedNow() && v.paused && !v.ended) void v.play().catch(() => {}) }
    const io = new IntersectionObserver(([e]) => {
      seen.current = e.isIntersecting
      if (e.isIntersecting) go()
      else if (!v.paused) v.pause()
    })
    io.observe(el)
    const onTab = () => { if (!document.hidden) go(); else if (!v.paused) v.pause() }
    document.addEventListener('visibilitychange', onTab)
    const dog = window.setTimeout(() => { if (!rolling.current) { v.pause(); setPhase('refused') } }, 8000)
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', onTab); window.clearTimeout(dog) }
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
    if (tier !== 'full' || phase !== 'refused' || stopped || !on) return
    const again = (e: Event) => { if (!(e.target as Element | null)?.closest?.('.sea-sign__again')) draw() }
    window.addEventListener('click', again, { once: true })
    window.addEventListener('keydown', again, { once: true })
    return () => { window.removeEventListener('click', again); window.removeEventListener('keydown', again) }
  }, [tier, phase, stopped, on, draw])

  // the visitor's sound switch: off stops the pen at once, on (a tap in the middle of the film) lets it in
  useEffect(() => sound.onChange(() => {
    if (!sound.isOn()) stopSound()
    else if (sound.isRunning() && !hush.current) void startSound()
  }), [startSound, stopSound])
  useEffect(() => stopSound, [stopSound])

  const film = tier !== 'still'
  const live = (phase === 'playing' || phase === 'done') && !stopped
  const signed = tier !== 'full' || stopped || phase === 'refused'
  const offer = film && !stopped && (phase === 'done' || phase === 'refused' || (tier === 'calm' && phase === 'wait'))
  const word = phase === 'done' ? 'Replay' : 'Play'
  return (
    <figure ref={root} className={`sea-sign${live ? ' is-live' : ''}`}>
      <div ref={disc} className="sea-sign__disc" role="img" aria-label={ALT} data-zone="art" tabIndex={-1}>
        {/* under the film: the sheet before the pen where the film plays by itself, the signed sheet where it does not */}
        <img className="sea-sign__sheet" src={`${BASE}-${signed ? 'signed' : 'open'}.webp`} alt="" width="720" height="720" loading="lazy" decoding="async" />
        {film && (
          <video
            ref={video}
            className="sea-sign__film"
            muted
            playsInline
            preload="none"
            disablePictureInPicture
            tabIndex={-1}
            aria-hidden="true"
            onPlaying={() => { rolling.current = true; void startSound() }}
            onWaiting={stopSound}
            onPause={stopSound}
            onEnded={() => { stopSound(); setPhase('done') }}
            onError={() => setPhase((p) => (p === 'playing' ? 'refused' : p))}
          />
        )}
      </div>
      {film && (
        // the name starts with the word on the button, so "click Replay" finds it (WCAG 2.5.3)
        <button type="button" className="sea-sign__again" data-zone="text" hidden={!offer} onClick={draw} aria-label={`${word}: ${phase === 'done' ? 'לצייר שוב את הלוגו' : 'להציג את ציור הלוגו'}`}>
          <span aria-hidden="true">{word}</span>
        </button>
      )}
    </figure>
  )
}
