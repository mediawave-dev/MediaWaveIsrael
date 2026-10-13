// The opener (DECISIONS #62): the hero's sea. MediaWave taken literally: the launch film is the
// water, the Horizon mark's wave line is its surface, and the visitor can touch it. The physics
// runs in the page (src/look/parts/sea-physics.ts) and reaches this file as numbers through
// data binding: one height and one slope per surface point. Rive draws the night above the
// surface, the two lines of the mark's tones on it, a haze under it and the horizon guide that
// the opening draws before the water pours in. One set of numbers produces:
//   cli/scene.rml                  the Rive scene (built to src/look/parts/sea.riv)
//   src/look/parts/sea-rest.svg    the calm surface, shown before Rive, without JS, under the
//                                  stop switch and as the fallback (the scene's rest pose)
//   src/look/parts/sea.json        the geometry the physics needs (points, rest curve)
// Run: npm run rive:sea

import { writeFileSync, copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { execFileSync } from 'node:child_process'
import { homedir } from 'node:os'
import { ROOT, horizonSegments } from '../companion/mark-vertices.mjs'

// The artboard is a band across the hero: the night above the surface, the film below it.
// The page stretches it to the hero's width (Fit.Fill); the physics works in artboard units.
const W = 1600, H = 760
const REST = 320 // the calm surface's height in the band: 0.8 of the sea's height above it for the crests
const N = 35, X0 = -50, DX = 50 // surface points, one beyond each edge so the night never ends short
const HANDLE = DX / 3
const C = { night: '00113D', white: 'FFFFFF', tone: '6E8CFF', haze: '2F4FC4' }

// The rest curve is the mark's own horizon: two arcs, sagging on the left and rising on the
// right, which a sine follows to within 2% of the disc. Stretched across the band, its height
// goes from 8.5% of the disc to 1% of the band (16 units).
const sag = Math.max(...horizonSegments().flat().map((p) => Math.abs(p[1])))
if (sag < 8 || sag > 12) throw new Error(`the mark's horizon changed (sag ${sag}); check the rest curve`)
const AMP = 16
const rest = (x) => -AMP * Math.sin((2 * Math.PI * (x - W / 2)) / W)
const xs = Array.from({ length: N }, (_, i) => X0 + i * DX)
const ys = xs.map((x) => REST + rest(x))
const slope = (i) => Math.atan2(ys[Math.min(N - 1, i + 1)] - ys[Math.max(0, i - 1)], (Math.min(N - 1, i + 1) - Math.max(0, i - 1)) * DX)
const rots = xs.map((_, i) => slope(i))

// ---------------------------------------------------------------- helpers
let next = 3000
const nid = () => `0:${next++}`
const n = (v) => +(+v).toFixed(3)
const attrs = (o) => Object.entries(o).filter(([, v]) => v !== undefined).map(([k, v]) => `${k}="${typeof v === 'number' ? n(v) : v}"`).join(' ')
const solid = (c, al = 'FF') => `<SolidColor colorValue="${al}${c}" name="C"/>`

// ---------------------------------------------------------------- the view model
const VM = nid(), INST = nid()
const props = [] // [name, id, default]
const prop = (name, value) => { const id = nid(); props.push([name, id, value]); return id }
const PY = xs.map((_, i) => prop(`y${i}`, ys[i]))
const PR = xs.map((_, i) => prop(`r${i}`, rots[i]))
const P_GUIDE_START = prop('guideStart', 1), P_GUIDE_END = prop('guideEnd', 1)
const P_LINE_A = prop('lineA', 2.2), P_LINE_B = prop('lineB', 1.4)
const bind = (p, key) => `<DataBindContext ${attrs({ sourcePathIds: `${VM}-${p}`, propertyKey: key })}/>`

// a surface vertex bound to its point's height (key 25) and slope (key 82)
const surfaceVertex = (i) => `<CubicMirroredVertex ${attrs({ x: xs[i], y: ys[i], rotation: rots[i], distance: HANDLE })}>${bind(PY[i], 25)}${bind(PR[i], 82)}</CubicMirroredVertex>`
const surface = () => xs.map((_, i) => surfaceVertex(i)).join('')
const corner = (x, y) => `<StraightVertex ${attrs({ x, y })}/>`

// ---------------------------------------------------------------- the drawing (first child is in front)
// the guide: the calm horizon, drawn from the right before the water arrives (trim bound)
const guidePts = xs.map((x, i) => `<CubicMirroredVertex ${attrs({ x, y: ys[i], rotation: rots[i], distance: HANDLE })}/>`).join('')
const guide = `<Shape name="Guide" id="${nid()}">
    <PointsPath isClosed="false" name="Path">${guidePts}</PointsPath>
    <Stroke ${attrs({ thickness: 1.6, cap: 'round', name: 'Line' })}>${solid(C.white, 'D9')}<TrimPath ${attrs({ start: 1, end: 1, modeValue: 1, name: 'Draw' })}>${bind(P_GUIDE_START, 114)}${bind(P_GUIDE_END, 115)}</TrimPath></Stroke>
  </Shape>`
// the mark's two tones on the surface: white on top, the lower half's blue just under it
const lineA = `<Shape name="Horizon" id="${nid()}">
    <PointsPath isClosed="false" name="Path">${surface()}</PointsPath>
    <Stroke ${attrs({ thickness: 2.2, cap: 'round', name: 'Line' })}>${bind(P_LINE_A, 47)}${solid(C.white)}</Stroke>
  </Shape>`
const lineB = `<Node ${attrs({ y: 7, name: 'Under' })}><Shape ${attrs({ opacity: 0.85, name: 'Horizon tone', id: nid() })}>
    <PointsPath isClosed="false" name="Path">${surface()}</PointsPath>
    <Stroke ${attrs({ thickness: 1.4, cap: 'round', name: 'Line' })}>${bind(P_LINE_B, 47)}${solid(C.tone)}</Stroke>
  </Shape></Node>`
// the night above the surface: the surface left to right, then round the top
const sky = `<Shape name="Night" id="${nid()}">
    <PointsPath isClosed="true" name="Path">${surface()}${corner(xs[N - 1], -60)}${corner(xs[0], -60)}</PointsPath>
    <Fill name="Fill">${solid(C.night)}</Fill>
  </Shape>`
// a haze of the mark's blue just under the surface, fading into the film
const haze = `<Shape name="Haze" id="${nid()}">
    <PointsPath isClosed="true" name="Path">${surface()}${corner(xs[N - 1], H + 80)}${corner(xs[0], H + 80)}</PointsPath>
    <Fill name="Fill"><LinearGradient ${attrs({ startX: 0, startY: REST - 24, endX: 0, endY: REST + 150, name: 'Depth' })}>
      <GradientStop colorValue="70${C.tone}" position="0"/>
      <GradientStop colorValue="2E${C.haze}" position="0.4"/>
      <GradientStop colorValue="00${C.haze}" position="1"/>
    </LinearGradient></Fill>
  </Shape>`

// ---------------------------------------------------------------- the machine (binds apply only while one runs)
const SM = nid(), LAYER = nid(), IDLE = nid(), S_IDLE = nid()
const rml = `<Rive version="1" kind="fragment">
<!-- GENERATED by design/rive/opener/build-sea.mjs: edit the generator, not this file. -->
<Artboard ${attrs({ defaultStateMachineId: SM, styleId: '0:2999', viewModelId: VM, viewModelInstanceId: INST, width: W, height: H, clip: 'true', name: 'Sea', id: '0:2998' })}>
  <LayoutComponentStyle name="Artboard Style" id="0:2999"/>
  <StateMachine name="Main" id="${SM}">
    <StateMachineLayer name="Live" id="${LAYER}">
      <AnyState x="0" y="-200"/>
      <ExitState x="500" y="-200"/>
      <EntryState x="-200" y="0"><StateTransition stateToId="${S_IDLE}"/></EntryState>
      <AnimationState x="150" y="0" animationId="${IDLE}" id="${S_IDLE}"/>
    </StateMachineLayer>
  </StateMachine>
  ${guide}
  ${lineA}
  ${lineB}
  ${sky}
  ${haze}
  <LinearAnimation ${attrs({ loopValue: 'loop', fps: 60, duration: 60, name: 'Live', id: IDLE })}/>
</Artboard>
<ViewModel defaultInstanceId="${INST}" name="Sea" id="${VM}">
  ${props.map(([name, id]) => `<ViewModelPropertyNumber name="${name}" id="${id}"/>`).join('\n  ')}
  <ViewModelInstance exports="true" name="Default" id="${INST}">
    ${props.map(([, id, v]) => `<ViewModelInstanceNumber propertyValue="${n(v)}" viewModelPropertyId="${id}"/>`).join('\n    ')}
  </ViewModelInstance>
</ViewModel>
</Rive>
`
writeFileSync(resolve(ROOT, 'design/rive/opener/cli/scene.rml'), rml)

// ---------------------------------------------------------------- the rest pose (SVG, stretched like Fit.Fill)
const seg = (i) => {
  const c1 = [xs[i] + HANDLE * Math.cos(rots[i]), ys[i] + HANDLE * Math.sin(rots[i])]
  const c2 = [xs[i + 1] - HANDLE * Math.cos(rots[i + 1]), ys[i + 1] - HANDLE * Math.sin(rots[i + 1])]
  return `C${n(c1[0])} ${n(c1[1])} ${n(c2[0])} ${n(c2[1])} ${n(xs[i + 1])} ${n(ys[i + 1])}`
}
const curve = `M${xs[0]} ${n(ys[0])}${xs.slice(0, -1).map((_, i) => seg(i)).join('')}`
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true" focusable="false">
<defs><linearGradient id="sea-haze" gradientUnits="userSpaceOnUse" x1="0" y1="${REST - 24}" x2="0" y2="${REST + 150}"><stop offset="0" stop-color="#${C.tone}" stop-opacity="0.44"/><stop offset="0.4" stop-color="#${C.haze}" stop-opacity="0.18"/><stop offset="1" stop-color="#${C.haze}" stop-opacity="0"/></linearGradient></defs>
<path d="${curve}L${xs[N - 1]} ${H + 80}L${xs[0]} ${H + 80}Z" fill="url(#sea-haze)"/>
<path d="${curve}L${xs[N - 1]} -60L${xs[0]} -60Z" fill="#${C.night}"/>
<path d="${curve}" transform="translate(0 7)" fill="none" stroke="#${C.tone}" stroke-opacity="0.85" stroke-width="1.4" vector-effect="non-scaling-stroke"/>
<path d="${curve}" fill="none" stroke="#${C.white}" stroke-width="2.2" vector-effect="non-scaling-stroke"/>
</svg>
`
writeFileSync(resolve(ROOT, 'src/look/parts/sea-rest.svg'), svg)
writeFileSync(resolve(ROOT, 'src/look/parts/sea.json'), JSON.stringify({ w: W, h: H, rest: REST, n: N, x0: X0, dx: DX, curve: ys.map((y) => n(y - REST)) }) + '\n')
console.log(`scene.rml ${rml.length} chars, ${props.length} view model numbers; sea-rest.svg ${svg.length} chars`)

if (process.argv.includes('--riv')) {
  const cli = resolve(ROOT, 'design/rive/opener/cli')
  const exe = [resolve(homedir(), '.rive/bin/rive.exe'), resolve(homedir(), '.rive/bin/rive')].find(existsSync) ?? 'rive'
  execFileSync(exe, [cli, '--once'], { stdio: 'inherit' })
  copyFileSync(resolve(cli, 'build/cli.riv'), resolve(ROOT, 'src/look/parts/sea.riv'))
  console.log('copied to src/look/parts/sea.riv')
}
