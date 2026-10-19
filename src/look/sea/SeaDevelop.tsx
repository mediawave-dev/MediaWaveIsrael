// sea · a picture in the sea's material (D154; harvest lamalama-deep.rtl.md §5, "material to colour"):
// a clip's poster drawn first as the sea's halftone dots (light in cream, shadow in the logo's blue, on
// the dark ground), which develops into the real colour cell by cell, like a print in a tray, and back
// to dots when it leaves. For the small pictures the field does not draw (it holds two films at most):
// the services' rows on the home page and the clips on each service page. When: `view` develops a
// moment after it is fully in view; `row` develops while its row is the one on the stage (li.is-on).
// A clip with `play` runs its loop once developed, only on screen and only in full motion. Calm: the
// same states without the dissolve; still (?reduce=1, the prerender): the colour poster, no dots. The
// pictures are decorative (aria-hidden, alt="").
import { useEffect, useRef } from 'react'
import { tier } from './field'
import { opt } from './lab'
import { CLIPS, type ClipKey, avifOf, posterOf, posterSet, tileOf, videoOf } from './media'

const BG = [15, 16, 17]
const CREAM = [237, 231, 218]
const BLUE = [121, 160, 197]
const sm = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t) }
const hash = (i: number) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s) }

export interface Still { src: string; w: number; h: number }

interface Props {
  /** a clip from the catalogue, or a plain still (the work rows' frames) */
  clip?: ClipKey
  still?: Still
  /** band: a clip on a service page (its poster, its loop); tile: a row's small picture */
  size?: 'band' | 'tile'
  when?: 'view' | 'row'
  play?: boolean
  sizes?: string
  className?: string
}

export default function SeaDevelop({ clip, still, size = 'band', when = 'view', play = false, sizes = '100vw', className = '' }: Props) {
  const box = useRef<HTMLSpanElement>(null)
  const c = clip ? CLIPS[clip] : null

  useEffect(() => {
    const el = box.current
    if (!el) return
    const t = tier()
    if (t === 'still') { el.classList.add('is-plain'); return }
    // in colour from the start (D157, gate `media`; Lama's thumbnails): the picture fades in when it has
    // loaded, and a clip runs its loop while it is on screen, in full motion
    if (opt('media') === 'colour') {
      el.classList.add('is-colour')
      const pic = el.querySelector('img') as HTMLImageElement
      const shown = () => el.classList.add('is-ready')
      if (pic.complete && pic.naturalWidth) shown(); else pic.addEventListener('load', shown, { once: true })
      const v = el.querySelector('video')
      if (!v || !play || t !== 'full' || !c) return
      const io = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) {
          if (!v.getAttribute('src')) { v.src = videoOf(c); v.load() }
          v.play().then(() => v.classList.add('is-on')).catch(() => {})
        } else if (!v.paused) v.pause()
      }, { threshold: 0.15 })
      io.observe(el)
      return () => { io.disconnect(); v.pause() }
    }
    const img = el.querySelector('img') as HTMLImageElement
    const cv = el.querySelector('canvas') as HTMLCanvasElement
    const vid = el.querySelector('video')
    const ctx = cv.getContext('2d')
    if (!ctx) { el.classList.add('is-plain'); return }
    const full = t === 'full'
    let alive = true
    let raf = 0
    let k = 0
    let target = 0
    let inView = false
    let last = 0
    let built = false
    let cols = 0
    let rows = 0
    let cell = 0
    let dpr = 1
    let lum = new Float32Array(0)
    let order = new Float32Array(0)

    const build = () => {
      const r = el.getBoundingClientRect()
      if (r.width < 4 || !img.naturalWidth) return
      dpr = Math.min(1.5, window.devicePixelRatio || 1)
      cell = size === 'tile' ? 5 : window.innerWidth < 768 ? 7 : 9
      cv.width = Math.round(r.width * dpr)
      cv.height = Math.round(r.height * dpr)
      cols = Math.ceil(r.width / cell)
      rows = Math.ceil(r.height / cell)
      // the poster at one sample per cell, cover-fitted like the picture under it
      const o = document.createElement('canvas')
      o.width = cols
      o.height = rows
      const oc = o.getContext('2d', { willReadFrequently: true })
      if (!oc) return
      const ir = img.naturalWidth / img.naturalHeight
      const br = r.width / r.height
      let sw = img.naturalWidth
      let sh = img.naturalHeight
      if (ir > br) sw = sh * br; else sh = sw / br
      oc.drawImage(img, (img.naturalWidth - sw) / 2, (img.naturalHeight - sh) / 2, sw, sh, 0, 0, cols, rows)
      const d = oc.getImageData(0, 0, cols, rows).data
      lum = new Float32Array(cols * rows)
      order = new Float32Array(cols * rows)
      for (let i = 0; i < cols * rows; i++) {
        lum[i] = (d[i * 4] * 0.299 + d[i * 4 + 1] * 0.587 + d[i * 4 + 2] * 0.114) / 255
        order[i] = hash(i + 7) * 0.98 + 0.01
      }
      built = true
      paint()
      el.classList.add('is-ready')
    }

    // the dots everywhere the print has not developed yet; developed cells are left clear
    const paint = () => {
      if (!built) return
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, cols * cell, rows * cell)
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const n = j * cols + i
          if (order[n] < k) continue
          ctx.fillStyle = `rgb(${BG[0]},${BG[1]},${BG[2]})`
          ctx.fillRect(i * cell, j * cell, cell, cell)
          const L = lum[n]
          const v = Math.min(1, L * 1.15)
          if (v < 0.03) continue
          const a = 0.35 + 0.65 * v
          const m = sm(0.2, 0.7, L)
          const col = [0, 1, 2].map((q) => Math.round(BG[q] + (BLUE[q] + (CREAM[q] - BLUE[q]) * m - BG[q]) * a))
          ctx.fillStyle = `rgb(${col[0]},${col[1]},${col[2]})`
          ctx.beginPath()
          ctx.arc((i + 0.5) * cell, (j + 0.5) * cell, Math.pow(v, 0.62) * cell * 0.5, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    const video = (on: boolean) => {
      if (!vid || !play || !full) return
      if (on) {
        if (!vid.getAttribute('src') && c) { vid.src = videoOf(c); vid.load() }
        vid.play().then(() => vid.classList.add('is-on')).catch(() => {})
      } else if (!vid.paused) vid.pause()
    }

    const step = (now: number) => {
      raf = 0
      if (!alive) return
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016)
      last = now
      const k0 = k
      k = target > k ? Math.min(target, k + dt / 1.4) : Math.max(target, k - dt / 0.8)
      if (k !== k0) paint()
      if (k !== target) raf = requestAnimationFrame(step)
      else last = 0
    }
    const aim = (v: number) => {
      target = v
      video(v > 0 && inView)
      if (!full) { k = v; paint(); return }
      if (!raf) raf = requestAnimationFrame(step)
    }

    let seen = 0
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting
      if (when === 'view') {
        window.clearTimeout(seen)
        if (e.intersectionRatio >= 0.6) seen = window.setTimeout(() => aim(1), 600)
        else if (e.intersectionRatio < 0.15) aim(0)
      } else video(target > 0 && inView)
    }, { threshold: [0, 0.15, 0.6] })
    io.observe(el)

    let mo: MutationObserver | null = null
    const li = when === 'row' ? el.closest('li') : null
    if (li) {
      const sync = () => aim(li.classList.contains('is-on') ? 1 : 0)
      mo = new MutationObserver(sync)
      mo.observe(li, { attributes: true, attributeFilter: ['class'] })
      sync()
    }

    let rt = 0
    const ro = new ResizeObserver(() => { window.clearTimeout(rt); rt = window.setTimeout(build, 120) })
    ro.observe(el)
    if (img.complete && img.naturalWidth) build()
    else img.addEventListener('load', build, { once: true })

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      window.clearTimeout(seen)
      window.clearTimeout(rt)
      io.disconnect()
      ro.disconnect()
      mo?.disconnect()
      vid?.pause()
    }
  }, [c, still, size, when, play])

  return (
    <span ref={box} className={`sdv sdv--${size} ${className}`.trim()} aria-hidden="true">
      {still ? (
        <img className="sdv__img" src={still.src} width={still.w} height={still.h} alt="" loading="lazy" decoding="async" />
      ) : !c ? null : size === 'tile' ? (
        <img className="sdv__img" src={tileOf(c)} width="384" height="240" alt="" loading="lazy" decoding="async" />
      ) : (
        <picture>
          <source type="image/avif" srcSet={avifOf(c)} media="(min-width: 768px)" />
          <img className="sdv__img" src={posterOf(c, true)} srcSet={posterSet(c)} sizes={sizes} width={c.w} height={c.h} alt="" loading="lazy" decoding="async" />
        </picture>
      )}
      {play && c && <video className="sdv__vid" muted loop playsInline preload="none" />}
      <canvas className="sdv__dots" />
    </span>
  )
}
