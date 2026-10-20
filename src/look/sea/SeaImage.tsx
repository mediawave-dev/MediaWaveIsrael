// sea · a live picture (D158; Lama Lama's webgl_image, translated; Nati: "pictures that stand and do
// nothing are generic"): the field draws it (field.ts, addImage). At rest it is its own material, a
// warm grey grain; it develops into colour when it is on, from the point where the pointer came in or
// in another way each time; the pointer's wake stirs it and it drifts inside its frame as the page
// scrolls. On: `row` while its row is on the services stage (and on a phone only that row's picture
// shows), `hover` while the pointer is on its row or link, or on a phone while it crosses the middle of
// the screen. Without WebGL (or ?reduce=1, or before the field starts) the plain picture shows.
import { useEffect, useRef } from 'react'
import * as field from './field'

interface Props {
  src: string
  w: number
  h: number
  when: 'row' | 'hover'
  /** print (D166): a cyanotype that develops like a photo in a tray, instead of the squares */
  look?: 'print' | 'quiet'
  className?: string
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

export default function SeaImage({ src, w, h, when, look, className = '' }: Props) {
  const box = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = box.current
    if (!el || field.tier() === 'still') return
    const html = document.documentElement.classList
    const host = el.closest<HTMLElement>('a, li')
    const li = el.closest('li')
    let alive = true
    let id: number | null = null
    let hovered = false
    let isOn = false
    let centred = false
    const sync = () => {
      el.dataset.on = hovered || isOn || centred ? '1' : '0'
      field.touchImages()
    }
    let mo: MutationObserver | null = null
    if (when === 'row' && li) {
      const read = () => {
        isOn = li.classList.contains('is-on')
        el.dataset.hide = !window.matchMedia('(min-width: 1100px)').matches && html.contains('sea-held') && !isOn ? '1' : '0'
        sync()
      }
      mo = new MutationObserver(read)
      mo.observe(li, { attributes: true, attributeFilter: ['class'] })
      read()
    }
    // the pointer: it develops from where the pointer came in
    const enter = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      const r = el.getBoundingClientRect()
      el.dataset.ox = String(clamp01((e.clientX - r.left) / Math.max(1, r.width)))
      el.dataset.oy = String(clamp01(1 - (e.clientY - r.top) / Math.max(1, r.height)))
      hovered = true
      sync()
    }
    const leave = () => { hovered = false; delete el.dataset.ox; delete el.dataset.oy; sync() }
    host?.addEventListener('pointerenter', enter)
    host?.addEventListener('pointerleave', leave)
    // phones have no pointer: the middle of the screen is the stage
    let io: IntersectionObserver | null = null
    if (when === 'hover' && !window.matchMedia('(hover: hover)').matches) {
      io = new IntersectionObserver(([e]) => { centred = e.isIntersecting; sync() }, { rootMargin: '-32% 0px -32% 0px' })
      io.observe(el)
    }
    void field.ready.then((ok) => {
      if (!alive || !ok) return
      const img = new Image()
      img.decoding = 'async'
      img.src = src
      img.onload = () => {
        if (!alive) return
        id = field.addImage(el, img)
        el.classList.add('is-live')
      }
    })
    return () => {
      alive = false
      mo?.disconnect()
      io?.disconnect()
      host?.removeEventListener('pointerenter', enter)
      host?.removeEventListener('pointerleave', leave)
      field.dropImage(id)
      el.classList.remove('is-live')
    }
  }, [src, when])

  return (
    <span ref={box} className={`simg ${className}`.trim()} aria-hidden="true" data-on="0" data-look={look}>
      <img className="simg__img" src={src} width={w} height={h} alt="" loading="lazy" decoding="async" />
    </span>
  )
}
