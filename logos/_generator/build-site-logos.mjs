/**
 * Source of truth for the MediaWave "Swell" logo across the live site.
 * Reads component-data.json (vectorized wordmark + swell ribbon paths) and emits:
 *   - src/components/ui/Logo.tsx        inline, theme-aware React lockup + SwellMark
 *   - public/logo-lockup-white.svg      standalone onDark lockup (static header / preload / schema)
 *   - public/logo-lockup-ink.svg        standalone onLight lockup (email/print/light embeds)
 *   - public/logo-mark-white.svg        mark only, onDark
 *   - public/favicon.svg                swell mark on a sky tile, favicon-tuned (thick, no thin trails)
 * Run: node logos/_generator/build-site-logos.mjs   (from repo root)
 */
import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, '..', '..')
const data = JSON.parse(readFileSync(resolve(HERE, 'component-data.json'), 'utf8'))

const MEDIA_D = data.wordmark.media
const WAVE_D = data.wordmark.wave
const TAG_D = data.tagline.d
const R3_D = 'M10.07 64.48 C18.6 33.84 45.67 7.87 84 23 C46.33 10.13 21.4 36.16 13.93 65.52 C13.25 68.09 9.38 67.06 10.07 64.48 Z'
const RIBBONS = [...data.swell.ribbons, R3_D] // r0..r3, base -> crest
const TRAILS = data.swell.trails

// ---- lockup layout (design units, from the composed swell-horizontal) --------
const capH = data.wordmark.capHeight // 70.3
const fullAdv = data.wordmark.fullAdv // 537.9
const waveOff = Math.round(data.wordmark.waveOffsetX * 100) / 100 // 281.5
const tagAdv = data.tagline.adv // 1413

const markScale = 1.5
// wmX = wordmark start x. Mark's rightmost point is ~153 in lockup space, so
// this sets the mark→wordmark gap (was 178 = 25u, too airy).
const wmX = 164
const waveX = Math.round((wmX + waveOff) * 100) / 100 // 459.5
const tagScale = Math.round(((fullAdv * 0.88) / tagAdv) * 10000) / 10000
const tagW = Math.round(tagAdv * tagScale * 100) / 100
const tagX = Math.round((wmX + (fullAdv - tagW) / 2) * 100) / 100
const tagBase = 40
const tagCap = 70.3 * tagScale
const lineY = Math.round((tagBase - tagCap / 2) * 100) / 100
const textRight = Math.round((wmX + fullAdv) * 100) / 100 // 715.9
const markTx = Math.round(-8 * markScale * 100) / 100 // -12
const markTy = Math.round(((-capH + 40) / 2 - 57 * markScale) * 100) / 100 // -100.65
const VB = { x: -8, y: -106, w: Math.round(wmX + fullAdv + 26), h: 168 } // -8 -106 742 168

// ---- palette tones ----------------------------------------------------------
const TONES = {
  onDark: { g0: '#38BDF8', g1: '#67E8F9', r1: '#7DD3FC', r2: '#BAE6FD', r3: '#FFFFFF', trail: '#7DD3FC', trailOp: 0.85, trailW: 2.1, media: '#F8FAFC', wave: '#7DD3FC', tag: '#F8FAFC', tagOp: 0.62, lineOp: 0.34 },
  onLight: { g0: '#075985', g1: '#0369A1', r1: '#075985', r2: '#0284C7', r3: '#0369A1', trail: '#0369A1', trailOp: 0.4, trailW: 1.6, media: '#2A2A2A', wave: '#0369A1', tag: '#4A4A4A', tagOp: 0.78, lineOp: 0.43 },
}

// ---- plain-SVG emitters (public assets) -------------------------------------
function markInner(t, gid) {
  return `  <defs>
    <linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="16" y1="99" x2="110" y2="69">
      <stop offset="0" stop-color="${t.g0}"/><stop offset="1" stop-color="${t.g1}"/>
    </linearGradient>
  </defs>
  <g fill="none" stroke="${t.trail}" stroke-opacity="${t.trailOp}" stroke-width="${t.trailW}" stroke-linecap="round">
    ${TRAILS.map((d) => `<path d="${d}"/>`).join('\n    ')}
  </g>
  <path d="${RIBBONS[0]}" fill="url(#${gid})"/>
  <path d="${RIBBONS[1]}" fill="${t.r1}"/>
  <path d="${RIBBONS[2]}" fill="${t.r2}"/>
  <path d="${RIBBONS[3]}" fill="${t.r3}"/>`
}

function lockupSvg(toneName) {
  const t = TONES[toneName]
  const gid = `mw-${toneName}`
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VB.x} ${VB.y} ${VB.w} ${VB.h}" role="img" aria-labelledby="mwt mwd">
  <title id="mwt">MediaWave — Web Development</title>
  <desc id="mwd">The MediaWave breaking-wave mark beside the MediaWave wordmark and WEB DEVELOPMENT tagline.</desc>
  <g transform="translate(${markTx} ${markTy}) scale(${markScale})">
${markInner(t, gid).split('\n').map((l) => '  ' + l).join('\n')}
  </g>
  <path fill="${t.media}" transform="translate(${wmX} 0)" d="${MEDIA_D}"/>
  <path fill="${t.wave}" transform="translate(${waveX} 0)" d="${WAVE_D}"/>
  <path fill="${t.tag}" fill-opacity="${t.tagOp}" transform="translate(${tagX} ${tagBase}) scale(${tagScale})" d="${TAG_D}"/>
  <line x1="${wmX}" y1="${lineY}" x2="${tagX - 16}" y2="${lineY}" stroke="${t.tag}" stroke-opacity="${t.lineOp}" stroke-width="1.6"/>
  <line x1="${tagX + tagW + 16}" y1="${lineY}" x2="${textRight}" y2="${lineY}" stroke="${t.tag}" stroke-opacity="${t.lineOp}" stroke-width="1.6"/>
</svg>
`
}

function markSvg(toneName) {
  const t = TONES[toneName]
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" aria-label="MediaWave">
${markInner(t, `mwm-${toneName}`)}
</svg>
`
}

// Favicon: swell ribbons only (no thin trails), thickened via generous scale,
// white on a sky gradient tile so it survives 16px.
function faviconSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" aria-label="MediaWave">
  <defs>
    <linearGradient id="mwft" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#38BDF8"/><stop offset="1" stop-color="#0369A1"/>
    </linearGradient>
  </defs>
  <rect width="120" height="120" rx="27" fill="url(#mwft)"/>
  <g transform="translate(2 30) scale(1.06)" fill="#FFFFFF">
    <path d="${RIBBONS[0]}"/>
    <path d="${RIBBONS[1]}"/>
    <path d="${RIBBONS[2]}"/>
    <path d="${RIBBONS[3]}"/>
  </g>
</svg>
`
}

// ---- React component --------------------------------------------------------
function tsx() {
  const arr = (a) => '[' + a.map((s) => JSON.stringify(s)).join(', ') + ']'
  return `import { useId } from 'react'
import { m } from 'framer-motion'
import { EASE_BRAND } from '../../config/motion'

/**
 * MediaWave "Swell" logo — inline SVG, generated by
 * logos/_generator/build-site-logos.mjs (do not hand-edit the path data).
 * Crisp at every DPR, theme-aware (onDark / onLight), unique gradient ids per
 * instance so multiple logos on one page never collide.
 */

// --- geometry (generated) ---------------------------------------------------
const MEDIA_D = ${JSON.stringify(MEDIA_D)}
const WAVE_D = ${JSON.stringify(WAVE_D)}
const TAG_D = ${JSON.stringify(TAG_D)}
const RIBBONS = ${arr(RIBBONS)}
const TRAILS = ${arr(TRAILS)}

const VIEWBOX = '${VB.x} ${VB.y} ${VB.w} ${VB.h}'
const MARK_TF = 'translate(${markTx} ${markTy}) scale(${markScale})'
const WM_X = ${wmX}
const WAVE_X = ${waveX}
const TAG_X = ${tagX}
const TAG_SCALE = ${tagScale}
const TAG_W = ${tagW}
const TAG_BASE = ${tagBase}
const LINE_Y = ${lineY}
const TEXT_RIGHT = ${textRight}

type Tone = 'onDark' | 'onLight'

const TONES: Record<Tone, {
  g0: string; g1: string; r1: string; r2: string; r3: string
  trail: string; trailOp: number; trailW: number
  media: string; wave: string; tag: string; tagOp: number; lineOp: number
}> = {
  onDark: ${JSON.stringify(TONES.onDark)},
  onLight: ${JSON.stringify(TONES.onLight)},
}

function MarkPaths({ tone, gid }: { tone: Tone; gid: string }) {
  const t = TONES[tone]
  return (
    <>
      <defs>
        <linearGradient id={gid} gradientUnits="userSpaceOnUse" x1="16" y1="99" x2="110" y2="69">
          <stop offset="0" stopColor={t.g0} />
          <stop offset="1" stopColor={t.g1} />
        </linearGradient>
      </defs>
      <g fill="none" stroke={t.trail} strokeOpacity={t.trailOp} strokeWidth={t.trailW} strokeLinecap="round">
        {TRAILS.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      <path d={RIBBONS[0]} fill={\`url(#\${gid})\`} />
      <path d={RIBBONS[1]} fill={t.r1} />
      <path d={RIBBONS[2]} fill={t.r2} />
      <path d={RIBBONS[3]} fill={t.r3} />
    </>
  )
}

/** Mark only (favicon-sized displays, watermarks, loaders). */
export function SwellMark({
  tone = 'onDark',
  className = '',
  title = 'MediaWave',
  size,
}: {
  tone?: Tone
  className?: string
  title?: string
  size?: number
}) {
  const uid = useId().replace(/:/g, '')
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      width={size}
      height={size}
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <MarkPaths tone={tone} gid={\`mwk-\${uid}\`} />
    </svg>
  )
}

interface LogoProps {
  /** Placement — decides size + on-dark/on-light theme. */
  variant?: 'header' | 'footer' | 'mobile'
  className?: string
  /** Header shrinks the lockup once the page is scrolled. */
  isScrolled?: boolean
}

/**
 * MediaWave lockup: swell mark + "Media"(neutral) + "Wave"(accent) + WEB DEVELOPMENT.
 */
export default function Logo({ variant = 'header', className = '', isScrolled = false }: LogoProps) {
  const uid = useId().replace(/:/g, '')
  const tone: Tone = variant === 'mobile' ? 'onLight' : 'onDark'
  const t = TONES[tone]

  const heightClass = {
    header: isScrolled ? 'h-10 md:h-11' : 'h-10 sm:h-11 md:h-[3.25rem] lg:h-14',
    footer: 'h-10 md:h-[3.25rem]',
    mobile: 'h-11',
  }[variant]

  return (
    <m.div
      className={\`mw-logo inline-flex items-center \${className}\`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: EASE_BRAND }}
    >
      <svg
        className={\`\${heightClass} w-auto transition-[height] duration-500 ease-out\`}
        viewBox={VIEWBOX}
        role="img"
        aria-label="MediaWave — פיתוח אתרים"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g className="mw-logo-mark" transform={MARK_TF}>
          <MarkPaths tone={tone} gid={\`mwl-\${uid}\`} />
        </g>
        <g className="mw-logo-word">
          <path fill={t.media} transform={\`translate(\${WM_X} 0)\`} d={MEDIA_D} />
          <path fill={t.wave} transform={\`translate(\${WAVE_X} 0)\`} d={WAVE_D} />
          <path
            fill={t.tag}
            fillOpacity={t.tagOp}
            transform={\`translate(\${TAG_X} \${TAG_BASE}) scale(\${TAG_SCALE})\`}
            d={TAG_D}
          />
          <line x1={WM_X} y1={LINE_Y} x2={TAG_X - 16} y2={LINE_Y} stroke={t.tag} strokeOpacity={t.lineOp} strokeWidth="1.6" />
          <line x1={TAG_X + TAG_W + 16} y1={LINE_Y} x2={TEXT_RIGHT} y2={LINE_Y} stroke={t.tag} strokeOpacity={t.lineOp} strokeWidth="1.6" />
        </g>
      </svg>
    </m.div>
  )
}

/** Backwards-compatible mark-only icon (was the old M-wave). */
export function LogoIcon({ size = 32, className = '' }: { size?: number; className?: string }) {
  return <SwellMark tone="onDark" className={className} title="MediaWave" size={size} />
}

/** Text-only wordmark for minimal contexts. */
export function LogoText({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeClasses = { sm: 'text-xl', md: 'text-2xl md:text-3xl', lg: 'text-3xl md:text-4xl' }
  return (
    <span className={\`font-english-display \${sizeClasses[size]} \${className}\`}>
      MediaWave
    </span>
  )
}
`
}

// ---- write ------------------------------------------------------------------
const outputs = {
  'src/components/ui/Logo.tsx': tsx(),
  'public/logo-lockup-white.svg': lockupSvg('onDark'),
  'public/logo-lockup-ink.svg': lockupSvg('onLight'),
  'public/logo-mark-white.svg': markSvg('onDark'),
  'public/favicon.svg': faviconSvg(),
}
for (const [rel, content] of Object.entries(outputs)) {
  writeFileSync(resolve(ROOT, rel), content)
  console.log('  →', rel, `(${content.length}b)`)
}
console.log('lockup viewBox:', VIEWBOX_LOG())
function VIEWBOX_LOG() {
  return `${VB.x} ${VB.y} ${VB.w} ${VB.h} | aspect ${(VB.w / VB.h).toFixed(2)} | tagScale ${tagScale} tagX ${tagX} lineY ${lineY}`
}
