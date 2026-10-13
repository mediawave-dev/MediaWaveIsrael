// The opener (DECISIONS #64): a camera lens under the H1. Its iris blades, in Klein blue, open
// on the first visit and reveal the launch film inside; the pointer, a click (a shutter) and the
// scroll move them after that. The geometry is src/look/parts/lens-geometry.js (shared with the
// page); the page writes blade 0's corners and gradient and the barrel's focus turn through
// data binding, and the other eight blades are blade 0 turned by 40 degrees each. Produces:
//   cli/scene.rml                    the Rive scene (built to src/look/parts/lens.riv)
//   src/look/parts/lens-rest.svg     the rest pose (before Rive, no JS, the stop switch, fallback)
//   src/look/parts/lens-closed.svg   the closed iris (the first paint of a first visit)
// Run: npm run rive:lens

import { writeFileSync, copyFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'
import { homedir } from 'node:os'
import { LENS, blade, twistFor } from '../../../src/look/parts/lens-geometry.js'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..')
const { size: S, n: N, rl: RL, rOut: RO } = LENS
const C = {
  lit: '3366E8', mid: '002FA7', shade: '00175C', edge: '00103F',
  bevel: '060F33', scale: '0E1B4D', grip: '0A1640', knurl: '040B26', shadow: '00061E', night: '00113D',
}
const RING = { bevel: [RL, RL + 16], scale: [RL + 16, RL + 56], grip: [RL + 56, RO] }
const TICK = { from: RL + 22, to: RL + 34, major: RL + 44, w: 2.2, count: 60 }
const KNURL = { from: RL + 62, to: RO - 6, w: 4.5, count: 144 }
const restFocus = (a) => 0.35 * (a - LENS.rest)

// ---------------------------------------------------------------- helpers
let next = 4000
const nid = () => `0:${next++}`
const f = (v) => +(+v).toFixed(3)
const attrs = (o) => Object.entries(o).filter(([, v]) => v !== undefined).map(([k, v]) => `${k}="${typeof v === 'number' ? f(v) : v}"`).join(' ')
const solid = (c, al = 'FF') => `<SolidColor colorValue="${al}${c}" name="C"/>`


// ---------------------------------------------------------------- view model
const VM = nid(), INST = nid()
const rest = blade(LENS.rest, twistFor(LENS.rest))
const props = []
const prop = (name, value) => { const id = nid(); props.push([name, id, value]); return id }
const P = {
  vx: prop('v0x', rest.v[0]), vy: prop('v0y', rest.v[1]),
  e0x: prop('e0x', rest.e0[0]), e0y: prop('e0y', rest.e0[1]),
  e1x: prop('e1x', rest.e1[0]), e1y: prop('e1y', rest.e1[1]),
  g0x: prop('g0x', rest.g0[0]), g0y: prop('g0y', rest.g0[1]),
  g1x: prop('g1x', rest.g1[0]), g1y: prop('g1y', rest.g1[1]),
  focus: prop('focus', restFocus(LENS.rest)),
}
const bind = (p, key) => `<DataBindContext ${attrs({ sourcePathIds: `${VM}-${p}`, propertyKey: key })}/>`
const vtx = (x, y, px, py) => `<StraightVertex ${attrs({ x, y })}>${bind(px, 24)}${bind(py, 25)}</StraightVertex>`

// ---------------------------------------------------------------- the drawing (first child is in front)
const circle = (name, d, inner) => `<Shape name="${name}" id="${nid()}"><Ellipse ${attrs({ width: d, height: d, name: 'Path' })}/>${inner}</Shape>`
const ringStroke = (name, [a, b], col, al = 'FF') => circle(name, a + b, `<Stroke ${attrs({ thickness: b - a, name: 'Ring' })}>${solid(col, al)}</Stroke>`)
// radial bars as one shape of many little paths
const bars = (name, { from, to, w, count }, col, al, major) => {
  const paths = []
  for (let k = 0; k < count; k++) {
    const r1 = major && k % 5 === 0 ? major : to
    const th = (2 * Math.PI * k) / count + w / 2 / ((from + r1) / 2)
    const c = Math.cos(th), s = Math.sin(th), hx = (-s * w) / 2, hy = (c * w) / 2
    const pts = [[from * c - hx, from * s - hy], [r1 * c - hx, r1 * s - hy], [r1 * c + hx, r1 * s + hy], [from * c + hx, from * s + hy]]
    paths.push(`<PointsPath isClosed="true" name="Bar">${pts.map(([x, y]) => `<StraightVertex ${attrs({ x, y })}/>`).join('')}</PointsPath>`)
  }
  return `<Shape name="${name}" id="${nid()}">${paths.join('')}<Fill name="Fill">${solid(col, al)}</Fill></Shape>`
}
// light from the upper left on the barrel; it does not turn with the focus ring
const barrelLight = circle('Barrel light', RING.scale[0] + RING.grip[1], `<Stroke ${attrs({ thickness: RING.grip[1] - RING.scale[0], name: 'Light' })}><LinearGradient ${attrs({ startX: -RO * 0.8, startY: -RO * 0.8, endX: RO * 0.45, endY: RO * 0.45, name: 'Sky' })}><GradientStop colorValue="2EFFFFFF" position="0"/><GradientStop colorValue="00FFFFFF" position="0.55"/><GradientStop colorValue="33000000" position="1"/></LinearGradient></Stroke>`)
const sheen = circle('Glass', 2 * RL, `<Fill name="Fill"><LinearGradient ${attrs({ startX: -RL * 0.75, startY: -RL * 0.75, endX: 0, endY: 0, name: 'Sheen' })}><GradientStop colorValue="1CFFFFFF" position="0"/><GradientStop colorValue="00FFFFFF" position="1"/></LinearGradient></Fill>`)
const rings = `<Node name="Barrel" id="${nid()}">${bind(P.focus, 15)}
    ${circle('Rim', 2 * RO, `<Stroke ${attrs({ thickness: 2, name: 'Line' })}>${solid('FFFFFF', '38')}</Stroke>`)}
    ${circle('Inner rim', 2 * (RL + 1), `<Stroke ${attrs({ thickness: 1.5, name: 'Line' })}>${solid('FFFFFF', '59')}</Stroke>`)}
    ${bars('Ticks', TICK, 'FFFFFF', '61', TICK.major)}
    ${bars('Knurl', KNURL, C.knurl, 'FF')}
    ${ringStroke('Grip', RING.grip, C.grip)}
    ${ringStroke('Scale', RING.scale, C.scale)}
    ${ringStroke('Bevel', RING.bevel, C.bevel)}
  </Node>`
const bladeXml = (i) => `<Node ${attrs({ rotation: (2 * Math.PI * i) / N, name: `Blade ${i + 1}`, id: nid() })}>
      <Shape name="Edge" id="${nid()}"><PointsPath isClosed="false" name="Path">${vtx(rest.e0[0], rest.e0[1], P.e0x, P.e0y)}${vtx(rest.v[0], rest.v[1], P.vx, P.vy)}</PointsPath>
        <Stroke ${attrs({ thickness: 2.2, cap: 'round', name: 'Line' })}>${solid(C.edge)}</Stroke></Shape>
      <Shape name="Face" id="${nid()}"><PointsPath isClosed="true" name="Path">${vtx(rest.e0[0], rest.e0[1], P.e0x, P.e0y)}${vtx(rest.v[0], rest.v[1], P.vx, P.vy)}${vtx(rest.e1[0], rest.e1[1], P.e1x, P.e1y)}</PointsPath>
        <Fill name="Fill"><LinearGradient ${attrs({ startX: rest.g0[0], startY: rest.g0[1], endX: rest.g1[0], endY: rest.g1[1], name: 'Light' })}>${bind(P.g0x, 42)}${bind(P.g0y, 33)}${bind(P.g1x, 34)}${bind(P.g1y, 35)}
          <GradientStop colorValue="FF${C.lit}" position="0"/><GradientStop colorValue="FF${C.mid}" position="0.5"/><GradientStop colorValue="FF${C.shade}" position="1"/>
        </LinearGradient></Fill></Shape>
    </Node>`
const blades = `<Node name="Iris" id="${nid()}">
    ${Array.from({ length: N }, (_, i) => bladeXml(i)).join('\n    ')}
  </Node>`
const vignette = circle('Depth', 2 * RL, `<Fill name="Fill"><RadialGradient ${attrs({ startX: 0, startY: 0, endX: RL, endY: 0, name: 'Vignette' })}><GradientStop colorValue="00${C.night}" position="0.62"/><GradientStop colorValue="A6${C.night}" position="1"/></RadialGradient></Fill>`)
const shadow = circle('Shadow', 1080, `<Fill name="Fill"><RadialGradient ${attrs({ startX: 0, startY: 0, endX: 540, endY: 0, name: 'Shade' })}><GradientStop colorValue="00${C.shadow}" position="0.86"/><GradientStop colorValue="8C${C.shadow}" position="0.9"/><GradientStop colorValue="00${C.shadow}" position="1"/></RadialGradient></Fill>`)

const SM = nid(), LAYER = nid(), IDLE = nid(), S_IDLE = nid()
const rml = `<Rive version="1" kind="fragment">
<!-- GENERATED by design/rive/lens/build-lens.mjs: edit the generator, not this file. -->
<Artboard ${attrs({ defaultStateMachineId: SM, styleId: '0:3999', viewModelId: VM, viewModelInstanceId: INST, width: S, height: S, name: 'Lens', id: '0:3998' })}>
  <LayoutComponentStyle name="Artboard Style" id="0:3999"/>
  <StateMachine name="Main" id="${SM}">
    <StateMachineLayer name="Live" id="${LAYER}">
      <AnyState x="0" y="-200"/>
      <ExitState x="500" y="-200"/>
      <EntryState x="-200" y="0"><StateTransition stateToId="${S_IDLE}"/></EntryState>
      <AnimationState x="150" y="0" animationId="${IDLE}" id="${S_IDLE}"/>
    </StateMachineLayer>
  </StateMachine>
  <Node ${attrs({ x: S / 2, y: S / 2, name: 'Lens', id: nid() })}>
  ${sheen}
  ${barrelLight}
  ${rings}
  ${blades}
  ${vignette}
  ${shadow}
  </Node>
  <LinearAnimation ${attrs({ loopValue: 'loop', fps: 60, duration: 60, name: 'Live', id: IDLE })}/>
</Artboard>
<ViewModel defaultInstanceId="${INST}" name="Lens" id="${VM}">
  ${props.map(([name, id]) => `<ViewModelPropertyNumber name="${name}" id="${id}"/>`).join('\n  ')}
  <ViewModelInstance exports="true" name="Default" id="${INST}">
    ${props.map(([, id, v]) => `<ViewModelInstanceNumber propertyValue="${f(v)}" viewModelPropertyId="${id}"/>`).join('\n    ')}
  </ViewModelInstance>
</ViewModel>
</Rive>
`
writeFileSync(resolve(ROOT, 'design/rive/lens/cli/scene.rml'), rml)

// ---------------------------------------------------------------- the static poses (SVG)
const dash = (r, count, w) => { const c = 2 * Math.PI * r; return `${f(w)} ${f(c / count - w)}` }
function svgPose(a, id) {
  const b = blade(a, twistFor(a))
  const deg = (x) => f((x * 180) / Math.PI)
  const pt = (p) => `${f(p[0])},${f(p[1])}`
  const tickR = (TICK.from + TICK.to) / 2, majR = (TICK.from + TICK.major) / 2, knR = (KNURL.from + KNURL.to) / 2
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-S / 2} ${-S / 2} ${S} ${S}" aria-hidden="true" focusable="false">
<defs>
<radialGradient id="${id}-shadow" cx="0" cy="0" r="540" gradientUnits="userSpaceOnUse"><stop offset="0.86" stop-color="#${C.shadow}" stop-opacity="0"/><stop offset="0.9" stop-color="#${C.shadow}" stop-opacity="0.55"/><stop offset="1" stop-color="#${C.shadow}" stop-opacity="0"/></radialGradient>
<radialGradient id="${id}-depth" cx="0" cy="0" r="${RL}" gradientUnits="userSpaceOnUse"><stop offset="0.62" stop-color="#${C.night}" stop-opacity="0"/><stop offset="1" stop-color="#${C.night}" stop-opacity="0.65"/></radialGradient>
<linearGradient id="${id}-blade" gradientUnits="userSpaceOnUse" x1="${f(b.g0[0])}" y1="${f(b.g0[1])}" x2="${f(b.g1[0])}" y2="${f(b.g1[1])}"><stop offset="0" stop-color="#${C.lit}"/><stop offset="0.5" stop-color="#${C.mid}"/><stop offset="1" stop-color="#${C.shade}"/></linearGradient>
<linearGradient id="${id}-light" gradientUnits="userSpaceOnUse" x1="${f(-RO * 0.8)}" y1="${f(-RO * 0.8)}" x2="${f(RO * 0.45)}" y2="${f(RO * 0.45)}"><stop offset="0" stop-color="#fff" stop-opacity="0.18"/><stop offset="0.55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.2"/></linearGradient>
<linearGradient id="${id}-sheen" gradientUnits="userSpaceOnUse" x1="${f(-RL * 0.75)}" y1="${f(-RL * 0.75)}" x2="0" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0.11"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
</defs>
<circle r="540" fill="url(#${id}-shadow)"/>
<circle r="${RL}" fill="url(#${id}-depth)"/>
${Array.from({ length: N }, (_, i) => `<g transform="rotate(${f((360 * i) / N)})"><polygon points="${pt(b.e0)} ${pt(b.v)} ${pt(b.e1)}" fill="url(#${id}-blade)"/><line x1="${f(b.e0[0])}" y1="${f(b.e0[1])}" x2="${f(b.v[0])}" y2="${f(b.v[1])}" stroke="#${C.edge}" stroke-width="2.2" stroke-linecap="round"/></g>`).join('\n')}
<g transform="rotate(${deg(restFocus(a))})" fill="none">
<circle r="${(RING.bevel[0] + RING.bevel[1]) / 2}" stroke="#${C.bevel}" stroke-width="${RING.bevel[1] - RING.bevel[0]}"/>
<circle r="${(RING.scale[0] + RING.scale[1]) / 2}" stroke="#${C.scale}" stroke-width="${RING.scale[1] - RING.scale[0]}"/>
<circle r="${(RING.grip[0] + RING.grip[1]) / 2}" stroke="#${C.grip}" stroke-width="${RING.grip[1] - RING.grip[0]}"/>
<circle r="${knR}" stroke="#${C.knurl}" stroke-width="${KNURL.to - KNURL.from}" stroke-dasharray="${dash(knR, KNURL.count, KNURL.w)}"/>
<circle r="${tickR}" stroke="#fff" stroke-opacity="0.38" stroke-width="${TICK.to - TICK.from}" stroke-dasharray="${dash(tickR, TICK.count, TICK.w)}"/>
<circle r="${majR}" stroke="#fff" stroke-opacity="0.38" stroke-width="${TICK.major - TICK.from}" stroke-dasharray="${dash(majR, TICK.count / 5, TICK.w)}"/>
<circle r="${RL + 1}" stroke="#fff" stroke-opacity="0.35" stroke-width="1.5"/>
<circle r="${RO}" stroke="#fff" stroke-opacity="0.22" stroke-width="2"/>
</g>
<circle r="${(RING.scale[0] + RING.grip[1]) / 2}" fill="none" stroke="url(#${id}-light)" stroke-width="${RING.grip[1] - RING.scale[0]}"/>
<circle r="${RL}" fill="url(#${id}-sheen)"/>
</svg>
`
}
writeFileSync(resolve(ROOT, 'src/look/parts/lens-rest.svg'), svgPose(LENS.rest, 'lr'))
writeFileSync(resolve(ROOT, 'src/look/parts/lens-closed.svg'), svgPose(0, 'lc'))
console.log(`scene.rml ${rml.length} chars, ${props.length} view model numbers`)

if (process.argv.includes('--riv')) {
  const cli = resolve(ROOT, 'design/rive/lens/cli')
  const exe = [resolve(homedir(), '.rive/bin/rive.exe'), resolve(homedir(), '.rive/bin/rive')].find(existsSync) ?? 'rive'
  execFileSync(exe, [cli, '--once'], { stdio: 'inherit' })
  copyFileSync(resolve(cli, 'build/cli.riv'), resolve(ROOT, 'src/look/parts/lens.riv'))
  console.log('copied to src/look/parts/lens.riv')
}

