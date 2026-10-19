// sea · a service page's clips (D154, D156): after the first screen, the service's own colour. With the
// ground (gate `bleed`, the default) its first clip runs across the whole width as the page's ground,
// arriving through dots at its top and breaking into the sea's dots at its bottom (SeaGround); the
// band's box keeps its place, so nothing moves when the field starts, and without WebGL the poster
// shows in it. Otherwise the first clip is the big picture. The next clip runs too (two loops a page at
// most), any further one stays a still; each shows in dots and develops a moment after it is fully in
// view (SeaDevelop). Decorative; the small tag says they illustrate (found media is never shown as the
// studio's own work). [קופי: נתי] the tag "להמחשה".
import { useRef } from 'react'
import SeaDevelop from './SeaDevelop'
import SeaImage from './SeaImage'
import { CLIPS, SERVICE_MEDIA, posterOf, posterSet } from './media'
import { opt } from './lab'
import { GroundSource, useGround } from './SeaGround'

/** each service page's ground gives way differently (D158): grain, ordered, soft */
const EDGE: Record<string, number> = { websites: 2, landing: 0, seo: 1, chatbots: 2, 'video-editing': 0, 'memory-videos': 1 }

export default function SeaClips({ id }: { id: string }) {
  const list = SERVICE_MEDIA[id]
  const band = useRef<HTMLSpanElement>(null)
  const source = useRef<HTMLVideoElement>(null)
  const veil = opt('bleed') === 'veil'
  useGround(band, source, list?.[0] ?? 'svc-websites', { on: veil && Boolean(list?.length), edge: 0.46, top: 0.18, hi: true, style: EDGE[id] ?? 0 })
  if (!list?.length) return null
  const [main, ...more] = list
  const c = CLIPS[main]
  return (
    <div className={`sea-clips sea-clips--${more.length}${veil ? ' sea-clips--veil' : ''}`} aria-hidden="true">
      {veil ? (
        <span ref={band} className="sea-clips__main sea-clips__ground">
          <img className="sea-clips__still" src={posterOf(c, true)} srcSet={posterSet(c)} sizes="100vw" width={c.w} height={c.h} alt="" loading="lazy" decoding="async" />
          <GroundSource video={source} />
        </span>
      ) : (
        <SeaDevelop clip={main} play className="sea-clips__main" sizes="(min-width: 1100px) 760px, 100vw" />
      )}
      {more.map((k) => (
        <SeaImage key={k} src={posterOf(CLIPS[k])} w={CLIPS[k].w} h={CLIPS[k].h} when="hover" className="sea-clips__more" />
      ))}
      <span className="sea-tag sea-tag--he sea-clips__tag">להמחשה</span>
    </div>
  )
}
