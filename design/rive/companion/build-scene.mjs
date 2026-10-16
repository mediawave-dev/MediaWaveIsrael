// The contact companion, from one set of numbers (design/rive/companion/CONTRACT.md):
//   cli/scene.rml                       the Rive scene (built to public/rive/companion.riv)
//   src/look/parts/companion-rest.svg   the CSS rest pose, the same geometry as the scene's
//                                       idle pose with progress 0, shown until Rive takes over
// Run: npm run rive:companion  (this script with --riv: generate, build the unsigned .riv with
// the Rive CLI, copy it to src/look/parts/companion.riv, where Vite fingerprints it)
//
// The laptop is the hero's (src/look/parts/laptop.css), seen straight on: same lid, screen,
// camera, aluminium base and notch, same colours. On its screen a message page: a header with
// the Horizon mark, then four lines that write themselves from the right as the visitor types.
// Sending folds the lines into the horizon and draws the disc around it; the horizon sloshes
// while the request is out. Sent: the level rises and fills the disc into the exact mark.
// Error: the horizon unfolds back into the lines (nothing lost) and the header shows a dot.
//
// Palettes: `--palette km` (default) writes the files above. `--palette shot` (the one-shot desk,
// DECISIONS #81/#86, SPEC section 3) changes colours only and writes its own files next to them:
//   cli-shot/scene.rml, src/look/parts/companion-shot-rest.svg, src/look/parts/companion-shot.riv
// Run: node design/rive/companion/build-scene.mjs --riv --palette shot

import { writeFileSync, copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { execFileSync } from 'node:child_process'
import { homedir } from 'node:os'
import { ROOT, markPaths, cubics, vertices, clockwise, horizonSegments } from './mark-vertices.mjs'

const AB = { w: 330, h: 216 }
const argv = process.argv.slice(2)
const PALETTE = argv.includes('--palette') ? argv[argv.indexOf('--palette') + 1] : 'km'
// Colours are RRGGBB, or AARRGGBB where a colour is ink at an alpha.
const PALETTES = {
  // the screen speaks the site's Klein palette (DECISIONS #58); the laptop itself is the hero's
  // hardware (lid, edge, camera, aluminium) and keeps its own greys
  km: {
    ink: 'FFFFFF', words: '8E9CC8', logoA: 'FFFFFF', logoB: '6E8CFF', ui: '2A3563', hair: '1A2246',
    edge: '3A3A3D', lid: '0E0E10', screen: '000000', cam: '2A2A2D', notch: 'B9B9BE', err: 'FF6961',
    base: [['E6E6E9', 0], ['A2A2A7', 0.65], ['6E6E73', 1]],
  },
  // the desk (D81): an ink laptop with a white page, the Horizon mark in deep Klein (D86), a paper
  // base with an ink-alpha edge instead of aluminium (the CSS laptop skin in shot-base.css), and
  // no red: the error dot is ink (the form's alert carries the meaning)
  shot: {
    ink: '1B1D21', words: '4A4F57', logoA: '1B1D21', logoB: '00248A', ui: 'ECEEF1', hair: '241B1D21',
    edge: '4A4F57', lid: '1B1D21', screen: 'FFFFFF', cam: '4A4F57', notch: 'ECEEF1', err: '1B1D21',
    base: 'FFFFFF', baseEdge: '241B1D21',
  },
}
const COL = PALETTES[PALETTE]
if (!COL) throw new Error(`unknown --palette ${PALETTE} (km or shot)`)
const SHOT = PALETTE === 'shot'
const OUT = {
  cli: SHOT ? 'design/rive/companion/cli-shot' : 'design/rive/companion/cli',
  rest: SHOT ? 'src/look/parts/companion-shot-rest.svg' : 'src/look/parts/companion-rest.svg',
  riv: SHOT ? 'src/look/parts/companion-shot.riv' : 'src/look/parts/companion.riv',
}
const G = {
  lid: { cx: 165, cy: 102, w: 290, h: 200, r: 6, edge: 1.5 },
  screen: { cx: 165, cy: 100.5, w: 272.5, h: 183, r: 4 },
  cam: { cx: 165, cy: 5.6, d: 3 },
  base: { cx: 165, cy: 208, w: 330, h: 12, tl: 2, tr: 2, br: 8, bl: 8 },
  notch: { cx: 165, cy: 204.5, w: 49.5, h: 5, tl: 0, tr: 0, br: 3, bl: 3 },
  mini: { cx: 281, cy: 24, s: 0.11 },
  addr: { cx: 242, cy: 24, w: 52, h: 4 },
  hair: { cx: 165, cy: 40, w: 244, h: 1 },
  mark: { cx: 165, cy: 101, s: 0.96 },
  fold: { cx: 165, cy: 101, right: 121, ys: [-27, -9, 9, 27], ws: [226, 240, 204, 120], dashOff: [0, 46, 87, 23], thick: 5 },
  caret: { w: 2, h: 12, gap: 3 },
  level: { cx: 165, w: 130, h: 140, low: 160, high: 48 },
}
// word lengths and spaces for the dash pattern (round caps add the stroke width to each word)
const WORDS = [18, 9, 30, 9, 12, 9, 26, 9, 20, 9, 8, 9, 34, 9]

// ---------------------------------------------------------------- ids
let next = 1000
const nid = () => `0:${next++}`
const ID = {
  ab: '0:1', sm: '0:2', lMain: '0:3', lSlosh: '0:4', lCaret: '0:5',
  aIdle: '0:20', aTyping: '0:21', aSend: '0:22', aSent: '0:23', aError: '0:24', aStill: '0:25', aSlosh: '0:26', aSolid: '0:27', aBlink: '0:28',
  sIdle: '0:30', sTyping: '0:31', sLoading: '0:32', sSent: '0:33', sError: '0:34', sStill: '0:35', sSlosh: '0:36', sSolid: '0:37', sBlink: '0:38',
  content: '0:100', mini: '0:102', err: '0:105',
  mark: '0:110', horizon: '0:111', hTrim: '0:112', fill: '0:113', outline: '0:116', oTrim: '0:117', level: '0:120',
  fold: '0:130', caretWrap: '0:150', blink: '0:151',
  vm: '0:900', pStatus: '0:901', pProgress: '0:902', pKey: '0:903', pReduced: '0:904', inst: '0:910',
  en: '0:950', eIdle: '0:951', eTyping: '0:952', eLoading: '0:953', eSent: '0:954', eError: '0:955',
}
const STATUS = { idle: ID.eIdle, typing: ID.eTyping, loading: ID.eLoading, sent: ID.eSent, error: ID.eError }

// ---------------------------------------------------------------- helpers
const n = (v) => +(+v).toFixed(4)
const attrs = (o) => Object.entries(o).filter(([, v]) => v !== undefined).map(([k, v]) => `${k}="${typeof v === 'number' ? n(v) : v}"`).join(' ')
const argb = (c) => (c.length === 8 ? c : `FF${c}`)
const solid = (c, name = 'Color') => `<SolidColor colorValue="${argb(c)}" name="${name}"/>`
const fill = (c) => `<Fill name="Fill">${solid(c)}</Fill>`
const rect = (w, h, extra = {}) => `<Rectangle ${attrs({ width: w, height: h, ...extra, name: 'Path' })}/>`
const radii = (g) => ({ linkCornerRadius: 'false', cornerRadiusTL: g.tl, cornerRadiusTR: g.tr, cornerRadiusBR: g.br, cornerRadiusBL: g.bl })
const bind = (prop, key, conv) => `<DataBindContext ${attrs({ sourcePathIds: `${ID.vm}-${prop}`, propertyKey: key, converterId: conv })}/>`

function halves(prefix) {
  return markPaths().map((d, i) => {
    const vs = vertices(cubics(d))
    const tone = i === 0 ? COL.logoA : COL.logoB
    const name = i === 0 ? 'Upper' : 'Lower'
    return { name: `${prefix} ${name}`, tone, vs, cw: clockwise(vs) }
  })
}
const pointsPath = (vs, closed, cw = true) =>
  `<PointsPath ${attrs({ isClosed: closed ? 'true' : 'false', isClockwise: cw ? 'true' : 'false', name: 'Path' })}>\n` +
  vs.map((v) => `          <CubicDetachedVertex ${attrs({ x: v.x, y: v.y, inRotation: v.inRotation ?? 0, inDistance: v.inDistance ?? 0, outRotation: v.outRotation ?? 0, outDistance: v.outDistance ?? 0 })}/>`).join('\n') +
  `\n        </PointsPath>`

// ---------------------------------------------------------------- converters
const conv = []
const mapper = (name, a, b, c, d) => { const id = nid(); conv.push(`<DataConverterRangeMapper ${attrs({ minInput: a, maxInput: b, minOutput: c, maxOutput: d, clampLower: 'true', clampUpper: 'true', name, id })}/>`); return id }

// ---------------------------------------------------------------- scene
const F = G.fold
const lines = F.ys.map((y, i) => {
  const lo = 25 * i, hi = lo + 25
  const endConv = mapper(`Line ${i + 1} end`, lo, hi, 0, 1)
  const start = F.right, stop = F.right - F.ws[i]
  return `<Shape ${attrs({ x: 0, y, name: `Line ${i + 1}`, id: nid() })}>
        <PointsPath isClosed="false" name="Path">
          <StraightVertex ${attrs({ x: start, y: 0 })}/>
          <StraightVertex ${attrs({ x: stop, y: 0 })}/>
        </PointsPath>
        <Stroke ${attrs({ thickness: F.thick, cap: 'round', join: 'round', name: 'Words' })}>
          ${solid(COL.words)}
          <TrimPath ${attrs({ start: 0, end: 0, modeValue: 'sequential', name: 'Written' })}>${bind(ID.pProgress, 115, endConv)}</TrimPath>
          <DashPath ${attrs({ offset: F.dashOff[i], name: 'Words' })}>
            ${WORDS.map((l, k) => `<Dash length="${l}" name="${k % 2 ? 'Space' : 'Word'}"/>`).join('')}
          </DashPath>
        </Stroke>
      </Shape>`
})

// the caret rides just past the written end of its line (round cap + gap), so text and caret
// move together and never overlap; on an empty line it waits where the first word will start
const caretX0 = F.right - F.thick / 2 - G.caret.gap - G.caret.w / 2
const carets = F.ys.map((y, i) => {
  const lo = 25 * i, hi = lo + 25
  const xConv = mapper(`Caret ${i + 1} x`, lo, hi, caretX0, caretX0 - F.ws[i])
  const onConv = i > 0 ? mapper(`Caret ${i + 1} on`, lo - 0.01, lo, 0, 1) : undefined
  const offConv = i < 3 ? mapper(`Caret ${i + 1} off`, hi - 0.01, hi, 1, 0) : undefined
  return `<Node ${attrs({ x: 0, y, opacity: i > 0 ? 0 : 1, name: `Caret ${i + 1} line`, id: nid() })}>${onConv ? bind(ID.pProgress, 18, onConv) : ''}
          <Shape ${attrs({ x: caretX0, y: 0, name: `Caret ${i + 1}`, id: nid() })}>
            ${bind(ID.pProgress, 13, xConv)}${offConv ? bind(ID.pProgress, 18, offConv) : ''}
            ${rect(G.caret.w, G.caret.h, { cornerRadiusTL: 1 })}
            ${fill(COL.ink)}
          </Shape>
        </Node>`
})

const big = halves('Mark')
const mini = halves('Mini')
const hz = vertices(horizonSegments(), false)
const L = G.level

const scene = `
<Artboard ${attrs({ defaultStateMachineId: ID.sm, styleId: "0:6", viewModelId: ID.vm, viewModelInstanceId: ID.inst, width: AB.w, height: AB.h, name: 'Companion', id: ID.ab })}>
  <LayoutComponentStyle name="Artboard Style" id="0:6"/>
  <StateMachine name="Main" id="${ID.sm}">
    __LAYERS__
  </StateMachine>

  <Node ${attrs({ x: 0, y: 0, opacity: 0.5, name: 'Content', id: ID.content })}>
    <Node ${attrs({ x: 0, y: 0, name: 'Header', id: nid() })}>
      <Shape ${attrs({ x: G.mini.cx, y: G.mini.cy, opacity: 0, name: 'Unsent', id: ID.err })}>
        <Ellipse ${attrs({ width: 7, height: 7, name: 'Path' })}/>
        ${fill(COL.err)}
      </Shape>
      <Node ${attrs({ x: G.mini.cx, y: G.mini.cy, scaleX: G.mini.s, scaleY: G.mini.s, name: 'Mini mark', id: ID.mini })}>
        ${mini.map((h) => `<Shape ${attrs({ name: h.name, id: nid() })}>
        ${pointsPath(h.vs, true, h.cw)}
        ${fill(h.tone)}
      </Shape>`).join('\n        ')}
      </Node>
      <Shape ${attrs({ x: G.addr.cx, y: G.addr.cy, name: 'Address', id: nid() })}>${rect(G.addr.w, G.addr.h, { cornerRadiusTL: 2 })}${fill(COL.ui)}</Shape>
      <Shape ${attrs({ x: G.hair.cx, y: G.hair.cy, name: 'Rule', id: nid() })}>${rect(G.hair.w, G.hair.h)}${fill(COL.hair)}</Shape>
    </Node>

    <Node ${attrs({ x: F.cx, y: F.cy, name: 'Caret', id: ID.caretWrap })}>
      <Node ${attrs({ x: 0, y: 0, name: 'Blink', id: ID.blink })}>
        ${carets.join('\n        ')}
      </Node>
    </Node>

    <Node ${attrs({ x: F.cx, y: F.cy, name: 'Fold', id: ID.fold })}>
      ${lines.join('\n      ')}
    </Node>

    <Node ${attrs({ x: G.mark.cx, y: G.mark.cy, scaleX: G.mark.s, scaleY: G.mark.s, name: 'Mark', id: ID.mark })}>
      <Shape ${attrs({ opacity: 0, name: 'Horizon', id: ID.horizon })}>
        ${pointsPath(hz, false)}
        <Stroke ${attrs({ thickness: 2, cap: 'round', name: 'Stroke' })}>
          ${solid(COL.words)}
          <TrimPath ${attrs({ start: 0.5, end: 0.5, modeValue: 'sequential', name: 'Draw', id: ID.hTrim })}/>
        </Stroke>
      </Shape>
      <Node ${attrs({ opacity: 0, name: 'Fill', id: ID.fill })}>
        ${big.map((h) => `<Shape ${attrs({ name: h.name, id: nid() })}>
          ${pointsPath(h.vs, true, h.cw)}
          ${fill(h.tone)}
          <ClippingShape ${attrs({ sourceId: ID.level, name: 'Level clip' })}/>
        </Shape>`).join('\n        ')}
      </Node>
      <Shape ${attrs({ opacity: 0, name: 'Outline', id: ID.outline })}>
        <Ellipse ${attrs({ width: 100, height: 100, name: 'Path' })}/>
        <Stroke ${attrs({ thickness: 1.5, name: 'Stroke' })}>
          ${solid(COL.ui)}
          <TrimPath ${attrs({ start: 0, end: 0, offset: 0.5, modeValue: 'sequential', name: 'Draw', id: ID.oTrim })}/>
        </Stroke>
      </Shape>
    </Node>

    <Shape ${attrs({ x: L.cx, y: L.low, name: 'Level', id: ID.level })}>
      ${rect(L.w, L.h, { originY: 0 })}
    </Shape>
  </Node>

  <Shape ${attrs({ x: G.cam.cx, y: G.cam.cy, name: 'Camera', id: nid() })}>
    <Ellipse ${attrs({ width: G.cam.d, height: G.cam.d, name: 'Path' })}/>
    ${fill(COL.cam)}
  </Shape>
  <Shape ${attrs({ x: G.screen.cx, y: G.screen.cy, name: 'Screen', id: nid() })}>
    ${rect(G.screen.w, G.screen.h, { cornerRadiusTL: G.screen.r })}
    ${fill(COL.screen)}
  </Shape>
  <Shape ${attrs({ x: G.lid.cx, y: G.lid.cy, name: 'Lid', id: nid() })}>
    ${rect(G.lid.w, G.lid.h, { cornerRadiusTL: G.lid.r })}
    ${fill(COL.lid)}
    <Stroke ${attrs({ thickness: G.lid.edge, position: 'inside', name: 'Edge' })}>${solid(COL.edge)}</Stroke>
  </Shape>
  <Shape ${attrs({ x: G.notch.cx, y: G.notch.cy, name: 'Notch', id: nid() })}>
    ${rect(G.notch.w, G.notch.h, radii(G.notch))}
    ${fill(COL.notch)}
  </Shape>
  <Shape ${attrs({ x: G.base.cx, y: G.base.cy, name: 'Base', id: nid() })}>
    ${rect(G.base.w, G.base.h, radii(G.base))}
    ${Array.isArray(COL.base) ? `<Fill name="Fill">
      <LinearGradient ${attrs({ startX: 0, startY: -G.base.h / 2, endX: 0, endY: G.base.h / 2, name: 'Aluminium' })}>
        ${COL.base.map(([c, p]) => `<GradientStop ${attrs({ colorValue: `FF${c}`, position: p })}/>`).join('')}
      </LinearGradient>
    </Fill>` : `${fill(COL.base)}
    <Stroke ${attrs({ thickness: 1, position: 'inside', name: 'Edge' })}>${solid(COL.baseEdge)}</Stroke>`}
  </Shape>

  __ANIMATIONS__
</Artboard>`

// ---------------------------------------------------------------- motion
// cubic-bezier curves (the site's personality: decisive ease-out, no overshoot, no elastic)
const EASE = {
  out: [0.16, 1, 0.3, 1], inout: [0.45, 0, 0.2, 1], rise: [0.33, 0, 0.12, 1], swing: [0.45, 0, 0.55, 1], soft: [0.4, 0, 0.2, 1],
}
const kf = ([frame, value, ease]) => {
  if (!ease || ease === 'hold') return `<KeyFrameDouble ${attrs({ value, frame, interpolationType: 'hold' })}/>`
  if (ease === 'linear') return `<KeyFrameDouble ${attrs({ value, frame, interpolationType: 'linear' })}/>`
  const [x1, y1, x2, y2] = EASE[ease]
  return `<KeyFrameDouble ${attrs({ value, frame, interpolationType: 'cubic' })}><CubicEaseInterpolator ${attrs({ x1, y1, x2, y2 })}/></KeyFrameDouble>`
}
const anim = (name, id, duration, loop, tracks) => `<LinearAnimation ${attrs({ loopValue: loop, fps: 60, duration, name, id })}>
${tracks.map(([obj, prop, keys]) => `    <KeyedObject objectId="${obj}"><KeyedProperty property="${prop}">${keys.map(kf).join('')}</KeyedProperty></KeyedObject>`).join('\n')}
  </LinearAnimation>`

// one pose per state: every property this layer owns, keyed in every animation
const pose = (o) => [
  [ID.content, 'opacity', [[0, o.content]]],
  [ID.fold, 'scaleX', [[0, o.foldX]]], [ID.fold, 'scaleY', [[0, o.foldY]]], [ID.fold, 'opacity', [[0, o.fold]]],
  [ID.hTrim, 'start', [[0, o.hs]]], [ID.hTrim, 'end', [[0, o.he]]], [ID.horizon, 'opacity', [[0, o.h]]],
  [ID.oTrim, 'end', [[0, o.oe]]], [ID.outline, 'opacity', [[0, o.o]]],
  [ID.fill, 'opacity', [[0, o.fillOp]]], [ID.level, 'y', [[0, o.level]]],
  [ID.caretWrap, 'opacity', [[0, o.caret]]], [ID.mini, 'opacity', [[0, o.mini]]], [ID.err, 'opacity', [[0, o.err]]],
]
const REST = { content: 0.5, foldX: 1, foldY: 1, fold: 1, hs: 0.5, he: 0.5, h: 0, oe: 0, o: 0, fillOp: 0, level: L.low, caret: 1, mini: 1, err: 0 }
const FOLDED = { ...REST, content: 1, foldX: 0.42, foldY: 0, fold: 0, hs: 0, he: 1, h: 1, oe: 1, o: 1, caret: 0 }
// replace a pose's single key with a keyed track
const over = (base, tracks) => base.map(([obj, prop, keys]) => {
  const t = tracks.find(([o, p]) => o === obj && p === prop)
  return t ? t : [obj, prop, keys]
})

const animations = [
  anim('Idle', ID.aIdle, 1, 'oneShot', pose(REST)),
  anim('Typing', ID.aTyping, 1, 'oneShot', pose({ ...REST, content: 1 })),
  anim('Send', ID.aSend, 40, 'oneShot', over(pose({ ...REST, content: 1 }), [
    [ID.caretWrap, 'opacity', [[0, 1, 'linear'], [6, 0]]],
    [ID.fold, 'scaleX', [[0, 1, 'inout'], [24, 0.42]]],
    [ID.fold, 'scaleY', [[0, 1, 'inout'], [24, 0]]],
    [ID.fold, 'opacity', [[0, 1], [12, 1, 'linear'], [24, 0]]],
    [ID.hTrim, 'start', [[0, 0.5], [10, 0.5, 'out'], [32, 0]]],
    [ID.hTrim, 'end', [[0, 0.5], [10, 0.5, 'out'], [32, 1]]],
    [ID.horizon, 'opacity', [[0, 0], [8, 0, 'linear'], [12, 1]]],
    [ID.oTrim, 'end', [[0, 0], [14, 0, 'inout'], [40, 1]]],
    [ID.outline, 'opacity', [[0, 0], [12, 0, 'linear'], [16, 1]]],
  ])),
  anim('Sent', ID.aSent, 90, 'oneShot', over(pose({ ...FOLDED, fillOp: 1 }), [
    [ID.level, 'y', [[0, L.low, 'rise'], [60, L.high]]],
    [ID.horizon, 'opacity', [[0, 1], [30, 1, 'soft'], [56, 0]]],
    [ID.outline, 'opacity', [[0, 1], [44, 1, 'soft'], [74, 0]]],
  ])),
  anim('Error', ID.aError, 40, 'oneShot', over(pose({ ...REST, content: 1 }), [
    [ID.hTrim, 'start', [[0, 0, 'inout'], [18, 0.5]]],
    [ID.hTrim, 'end', [[0, 1, 'inout'], [18, 0.5]]],
    [ID.horizon, 'opacity', [[0, 1], [10, 1, 'linear'], [18, 0]]],
    [ID.oTrim, 'end', [[0, 1, 'inout'], [18, 0]]],
    [ID.outline, 'opacity', [[0, 1], [6, 1, 'linear'], [18, 0]]],
    [ID.fold, 'scaleX', [[0, 0.42], [6, 0.42, 'out'], [30, 1]]],
    [ID.fold, 'scaleY', [[0, 0], [6, 0, 'out'], [30, 1]]],
    [ID.fold, 'opacity', [[0, 0], [6, 0, 'linear'], [14, 1]]],
    [ID.mini, 'opacity', [[0, 1], [8, 1, 'linear'], [14, 0]]],
    [ID.err, 'opacity', [[0, 0], [8, 0, 'linear'], [14, 1]]],
    [ID.caretWrap, 'opacity', [[0, 0], [24, 0, 'linear'], [30, 1]]],
  ])),
  // slosh: the level tilts while the message is out (the mark is a circle, so a rotation of the
  // whole mark is a tilt of its horizon and the outline never moves)
  anim('Still', ID.aStill, 1, 'oneShot', [[ID.mark, 'rotation', [[0, 0]]]]),
  anim('Slosh', ID.aSlosh, 72, 'pingPong', [[ID.mark, 'rotation', [[0, -0.055, 'swing'], [72, 0.055]]]]),
  // caret: solid while typing, a few blinks after a pause, then solid again (stops within 5 s)
  anim('Caret solid', ID.aSolid, 30, 'oneShot', [[ID.blink, 'opacity', [[0, 1]]]]),
  anim('Caret blink', ID.aBlink, 256, 'oneShot', [[ID.blink, 'opacity', [0, 32, 64, 96, 128, 160, 192, 224, 256].map((f, i) => [f, i % 2 ? 0 : 1])]]),
]

// ---------------------------------------------------------------- state machine
const statusIs = (v, op = 'equal') => `<TransitionViewModelCondition opValue="${op}">
            <TransitionPropertyViewModelComparator><BindablePropertyEnum>${bind(ID.pStatus, 637)}</BindablePropertyEnum></TransitionPropertyViewModelComparator>
            <TransitionValueEnumComparator value="${STATUS[v]}"/>
          </TransitionViewModelCondition>`
const reducedIs = (b) => `<TransitionViewModelCondition>
            <TransitionPropertyViewModelComparator><BindablePropertyBoolean>${bind(ID.pReduced, 634)}</BindablePropertyBoolean></TransitionPropertyViewModelComparator>
            <TransitionValueBooleanComparator value="${b}"/>
          </TransitionViewModelCondition>`
const keystroke = `<TransitionViewModelCondition>
            <TransitionPropertyViewModelComparator><BindablePropertyTrigger>${bind(ID.pKey, 686)}</BindablePropertyTrigger></TransitionPropertyViewModelComparator>
            <TransitionValueTriggerComparator/>
          </TransitionViewModelCondition>`
const tr = (to, ms, ease, conds, extra = {}) => {
  const curve = ease ? `<CubicEaseInterpolator ${attrs(Object.fromEntries(['x1', 'y1', 'x2', 'y2'].map((k, i) => [k, EASE[ease][i]])))}/>` : ''
  return `<StateTransition ${attrs({ stateToId: to, duration: ms, interpolationType: ease ? 'cubic' : undefined, ...extra })}>
          ${curve}${conds.join('')}
        </StateTransition>`
}

const layers = `<StateMachineLayer name="Status" id="${ID.lMain}">
      <AnyState x="0" y="-200">
        ${tr(ID.sIdle, 600, 'soft', [statusIs('idle')])}
        ${tr(ID.sTyping, 220, 'soft', [statusIs('typing')])}
        ${tr(ID.sLoading, 120, 'soft', [statusIs('loading')])}
        ${tr(ID.sSent, 120, 'soft', [statusIs('sent')])}
        ${tr(ID.sError, 120, 'soft', [statusIs('error')])}
      </AnyState>
      <ExitState x="600" y="-200"/>
      <EntryState x="-200" y="0">${tr(ID.sIdle, 0, null, [])}</EntryState>
      <AnimationState x="0" y="0" animationId="${ID.aIdle}" id="${ID.sIdle}"/>
      <AnimationState x="200" y="0" animationId="${ID.aTyping}" id="${ID.sTyping}"/>
      <AnimationState x="400" y="0" animationId="${ID.aSend}" id="${ID.sLoading}"/>
      <AnimationState x="300" y="160" animationId="${ID.aSent}" id="${ID.sSent}"/>
      <AnimationState x="500" y="160" animationId="${ID.aError}" id="${ID.sError}"/>
    </StateMachineLayer>
    <StateMachineLayer name="Slosh" id="${ID.lSlosh}">
      <AnyState x="0" y="-200"/>
      <ExitState x="400" y="-200"/>
      <EntryState x="-200" y="0">${tr(ID.sStill, 0, null, [])}</EntryState>
      <AnimationState x="0" y="0" animationId="${ID.aStill}" id="${ID.sStill}">
        ${tr(ID.sSlosh, 300, 'soft', [statusIs('loading'), reducedIs('false')])}
      </AnimationState>
      <AnimationState x="250" y="120" animationId="${ID.aSlosh}" id="${ID.sSlosh}">
        ${tr(ID.sStill, 700, 'soft', [statusIs('loading', 'notEqual')])}
        ${tr(ID.sStill, 200, 'soft', [reducedIs('true')])}
      </AnimationState>
    </StateMachineLayer>
    <StateMachineLayer name="Caret" id="${ID.lCaret}">
      <AnyState x="0" y="-200">
        ${tr(ID.sSolid, 0, null, [keystroke])}
      </AnyState>
      <ExitState x="400" y="-200"/>
      <EntryState x="-200" y="0">${tr(ID.sSolid, 0, null, [])}</EntryState>
      <AnimationState x="0" y="0" animationId="${ID.aSolid}" id="${ID.sSolid}">
        ${tr(ID.sBlink, 0, null, [statusIs('typing'), reducedIs('false')], { enableExitTime: 'true', exitTimeIsPercetange: 'true', exitTime: 100 })}
      </AnimationState>
      <AnimationState x="250" y="120" animationId="${ID.aBlink}" id="${ID.sBlink}"/>
    </StateMachineLayer>`

const data = `
<DataEnumCustom name="Status" id="${ID.en}">
  ${Object.entries(STATUS).map(([k, id]) => `<DataEnumValue key="${k}" value="${k[0].toUpperCase() + k.slice(1)}" id="${id}"/>`).join('\n  ')}
</DataEnumCustom>

<ViewModel defaultInstanceId="${ID.inst}" name="Companion" id="${ID.vm}">
  <ViewModelPropertyEnumCustom enumId="${ID.en}" name="status" id="${ID.pStatus}"/>
  <ViewModelPropertyNumber name="progress" id="${ID.pProgress}"/>
  <ViewModelPropertyTrigger name="keystroke" id="${ID.pKey}"/>
  <ViewModelPropertyBoolean name="prefersReducedMotion" id="${ID.pReduced}"/>
  <ViewModelInstance exports="true" name="Default" id="${ID.inst}">
    <ViewModelInstanceEnum propertyValue="${ID.eIdle}" viewModelPropertyId="${ID.pStatus}"/>
    <ViewModelInstanceNumber propertyValue="0" viewModelPropertyId="${ID.pProgress}"/>
    <ViewModelInstanceTrigger viewModelPropertyId="${ID.pKey}"/>
    <ViewModelInstanceBoolean propertyValue="false" viewModelPropertyId="${ID.pReduced}"/>
  </ViewModelInstance>
</ViewModel>

${conv.join('\n')}
`

const rml = `<Rive version="1" kind="fragment">
<!-- GENERATED by design/rive/companion/build-scene.mjs: edit the generator, not this file. -->
${scene.replace('__LAYERS__', layers).replace('__ANIMATIONS__', animations.join('\n  '))}
${data}
</Rive>
`
mkdirSync(resolve(ROOT, OUT.cli), { recursive: true })
writeFileSync(resolve(ROOT, OUT.cli, 'scene.rml'), rml)

// ---------------------------------------------------------------- the CSS rest pose (SVG)
// The idle pose with progress 0: the laptop, the header and the caret at the first line's
// start, the screen content at the idle dim. Nothing else is visible in that pose.
const hex = (c) => `#${c.slice(-6).toLowerCase()}`
// an SVG paint attribute; an AARRGGBB colour adds its alpha as <attr>-opacity
const paint = (attr, c) => `${attr}="${hex(c)}"${c.length === 8 ? ` ${attr}-opacity="${n(parseInt(c.slice(0, 2), 16) / 255)}"` : ''}`
const rr = (g) => {
  // a rectangle with four radii, as a path (x, y = top left)
  const x = g.cx - g.w / 2, y = g.cy - g.h / 2, w = g.w, h = g.h
  const { tl, tr: t2, br, bl } = g
  return `M${n(x + tl)} ${n(y)}H${n(x + w - t2)}${t2 ? `A${t2} ${t2} 0 0 1 ${n(x + w)} ${n(y + t2)}` : ''}V${n(y + h - br)}${br ? `A${br} ${br} 0 0 1 ${n(x + w - br)} ${n(y + h)}` : ''}H${n(x + bl)}${bl ? `A${bl} ${bl} 0 0 1 ${n(x)} ${n(y + h - bl)}` : ''}V${n(y + tl)}${tl ? `A${tl} ${tl} 0 0 1 ${n(x + tl)} ${n(y)}` : ''}Z`
}
const box = (g, r = 0) => `x="${n(g.cx - g.w / 2)}" y="${n(g.cy - g.h / 2)}" width="${n(g.w)}" height="${n(g.h)}"${r ? ` rx="${r}"` : ''}`
const [up, lo] = markPaths()
const m = G.mini
const ins = G.lid.edge / 2
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${AB.w} ${AB.h}" width="${AB.w}" height="${AB.h}">
${Array.isArray(COL.base) ? `<defs><linearGradient id="al" x1="0" y1="0" x2="0" y2="1">${COL.base.map(([c, p]) => `<stop offset="${p}" stop-color="${hex(c)}"/>`).join('')}</linearGradient></defs>
<path d="${rr(G.base)}" fill="url(#al)"/>` : `<path d="${rr(G.base)}" ${paint('fill', COL.base)}/>
<path d="${rr({ ...G.base, w: G.base.w - 1, h: G.base.h - 1 })}" fill="none" ${paint('stroke', COL.baseEdge)} stroke-width="1"/>`}
<path d="${rr(G.notch)}" fill="${hex(COL.notch)}"/>
<rect ${box(G.lid, G.lid.r)} fill="${hex(COL.lid)}"/>
<rect x="${n(G.lid.cx - G.lid.w / 2 + ins)}" y="${n(G.lid.cy - G.lid.h / 2 + ins)}" width="${n(G.lid.w - 2 * ins)}" height="${n(G.lid.h - 2 * ins)}" rx="${n(G.lid.r - ins)}" fill="none" stroke="${hex(COL.edge)}" stroke-width="${G.lid.edge}"/>
<rect ${box(G.screen, G.screen.r)} fill="${hex(COL.screen)}"/>
<circle cx="${G.cam.cx}" cy="${G.cam.cy}" r="${G.cam.d / 2}" fill="${hex(COL.cam)}"/>
<g opacity="${REST.content}">
<rect ${box(G.hair)} ${paint('fill', COL.hair)}/>
<rect ${box(G.addr, 2)} fill="${hex(COL.ui)}"/>
<g transform="translate(${n(m.cx - 50 * m.s)} ${n(m.cy - 50 * m.s)}) scale(${m.s})"><path d="${up}" fill="${hex(COL.logoA)}"/><path d="${lo}" fill="${hex(COL.logoB)}"/></g>
<rect x="${n(F.cx + caretX0 - G.caret.w / 2)}" y="${n(F.cy + F.ys[0] - G.caret.h / 2)}" width="${G.caret.w}" height="${G.caret.h}" rx="1" fill="${hex(COL.ink)}"/>
</g>
</svg>
`
writeFileSync(resolve(ROOT, OUT.rest), svg)
console.log(`[${PALETTE}] scene.rml ${rml.length} chars, ${OUT.rest} ${svg.length} chars, ${conv.length} converters`)

if (process.argv.includes('--riv')) {
  const cli = resolve(ROOT, OUT.cli)
  // the Rive CLI project: rive.yaml names the build (build/<name>.riv)
  const name = SHOT ? 'cli-shot' : 'cli'
  if (!existsSync(resolve(cli, 'rive.yaml'))) writeFileSync(resolve(cli, 'rive.yaml'), `name: ${name}
logs:
  file: build/rive.log
  problems: build/problems.log
`)
  const exe = [resolve(homedir(), '.rive/bin/rive.exe'), resolve(homedir(), '.rive/bin/rive')].find(existsSync) ?? 'rive'
  execFileSync(exe, [cli, '--once'], { stdio: 'inherit' })
  copyFileSync(resolve(cli, `build/${name}.riv`), resolve(ROOT, OUT.riv))
  console.log(`copied to ${OUT.riv}`)
}
