// The hero's opening (DECISIONS #60): on the stage's big screen a website builds itself, then
// the launch film starts inside it. One set of numbers produces:
//   cli/scene.rml                    the Rive scene (built to src/look/parts/hero.riv)
//   src/look/parts/hero-built.svg    the finished frame, shown without JS, under the stop switch,
//                                    and as the fallback (identical to the scene's last frame)
// The film itself is a DOM <video> placed over the slot rectangle (SLOT below, exported for the
// component), revealed when the scene fires its "reveal" event: the site's button is clicked.
//
// Sequence (60 fps, about 4.4 s, once): a browser window opens on the screen; the page arrives
// as a wireframe, block by block from the right (a Hebrew page); the paint goes on (paper,
// ink, Klein blue, the Horizon mark); a cursor comes in and clicks the button; the film starts
// in the hero slot; a message arrives (a toast). Then it rests.
// Run: npm run rive:hero

import { writeFileSync, copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { execFileSync } from 'node:child_process'
import { homedir } from 'node:os'
import { ROOT, markPaths, cubics, vertices, clockwise } from '../companion/mark-vertices.mjs'

const W = 1600, H = 900
export const SLOT = { x: 164, y: 236, w: 720, h: 405, r: 18 }
const C = {
  screen: '030A26', frame: '0F1C4D', frameLine: '24346F', addr: '16255E', dot: '3A4C8F',
  pageDark: '0A1640', page: 'FAFAF7', wireFill: '13215A', wireLine: '3B4E93',
  ink: '0E1016', ink2: '4E5468', mute: 'B4B8C6', line: 'E4E4DE', klein: '002FA7', kleinTint: 'E3E9FB',
  white: 'FFFFFF', logoA: '0E1016', logoB: '002FA7',
}
const WIN = { x: 96, y: 72, w: 1408, h: 764, r: 20, bar: 56 }
const PAGE_Y = WIN.y + WIN.bar
const REVEAL = 190, END = 264

// ---------------------------------------------------------------- helpers
let next = 2000
const nid = () => `0:${next++}`
const n = (v) => +(+v).toFixed(3)
const attrs = (o) => Object.entries(o).filter(([, v]) => v !== undefined).map(([k, v]) => `${k}="${typeof v === 'number' ? n(v) : v}"`).join(' ')
const solid = (c, a = 'FF') => `<SolidColor colorValue="${a}${c}" name="C"/>`
const EASE = { out: [0.16, 1, 0.3, 1], inout: [0.65, 0, 0.35, 1], soft: [0.4, 0, 0.2, 1], press: [0.3, 0, 0.2, 1] }
const curve = (e) => `<CubicEaseInterpolator ${attrs(Object.fromEntries(['x1', 'y1', 'x2', 'y2'].map((k, i) => [k, EASE[e][i]])))}/>`
const kd = ([f, v, e]) => e && e !== 'hold' ? `<KeyFrameDouble ${attrs({ value: v, frame: f, interpolationType: 'cubic' })}>${curve(e)}</KeyFrameDouble>` : `<KeyFrameDouble ${attrs({ value: v, frame: f, interpolationType: 'hold' })}/>`
const kc = ([f, v, e]) => e && e !== 'hold' ? `<KeyFrameColor ${attrs({ value: v, frame: f, interpolationType: 'cubic' })}>${curve(e)}</KeyFrameColor>` : `<KeyFrameColor ${attrs({ value: v, frame: f, interpolationType: 'hold' })}/>`

// tracks: [objectId, property, keys, 'd'|'c']
const tracks = []
const track = (obj, prop, keys, type = 'd') => tracks.push([obj, prop, keys, type])
// appear: opacity 0 -> 1 and scaleX from the right edge (RTL), from frame f over len frames
const appearX = (node, f, len = 18) => { track(node, 'opacity', [[0, 0], [f, 0, 'out'], [f + len, 1]]); track(node, 'scaleX', [[0, 0.001], [f, 0.001, 'out'], [f + len, 1]]) }
const appearUp = (node, f, len = 20, dy = 18, y0) => { track(node, 'opacity', [[0, 0], [f, 0, 'out'], [f + len, 1]]); track(node, 'y', [[0, y0 + dy], [f, y0 + dy, 'out'], [f + len, y0]]) }
const PAINT0 = 84, PAINT1 = 112
// a block's paint: wireframe fill + outline, then its final colour, the outline fading
const paint = (fillId, strokeId, final) => {
  track(fillId, 'colorValue', [[0, `FF${C.wireFill}`], [PAINT0, `FF${C.wireFill}`, 'soft'], [PAINT1, `FF${final}`]], 'c')
  track(strokeId, 'colorValue', [[0, `FF${C.wireLine}`], [PAINT0, `FF${C.wireLine}`, 'soft'], [PAINT1, `00${C.wireLine}`]], 'c')
}

// a rectangle block anchored at its right edge (scales from the right)
const blocks = []
const svgFinal = [] // the finished frame, for the static SVG
function block({ name, right, cy, w, h, r, final, f, wire = true }) {
  const node = nid(), fillC = nid(), strokeC = nid()
  blocks.push(`<Node ${attrs({ x: right, y: cy, name, id: node })}>
      <Shape name="${name} shape"><Rectangle ${attrs({ width: w, height: h, originX: 1, originY: 0.5, cornerRadiusTL: r, name: 'Path' })}/>
        <Fill name="Fill"><SolidColor colorValue="FF${wire ? C.wireFill : final}" name="C" id="${fillC}"/></Fill>
        <Stroke ${attrs({ thickness: 2, name: 'Wire' })}><SolidColor colorValue="${wire ? 'FF' + C.wireLine : '00' + C.wireLine}" name="C" id="${strokeC}"/></Stroke>
      </Shape>
    </Node>`)
  appearX(node, f)
  if (wire) paint(fillC, strokeC, final)
  svgFinal.push(`<rect x="${n(right - w)}" y="${n(cy - h / 2)}" width="${n(w)}" height="${n(h)}" rx="${r}" fill="#${final}"/>`)
  return node
}

// ---------------------------------------------------------------- the page
const R = 1436 // the page's right margin (RTL start)
// header
const markNode = nid()
const halves = markPaths().map((d, i) => ({ vs: vertices(cubics(d)), tone: i ? C.logoB : C.logoA }))
const MARK = { cx: R - 15, cy: PAGE_Y + 36, s: 0.3 }
block({ name: 'Brand', right: R - 44, cy: MARK.cy, w: 112, h: 14, r: 7, final: C.ink, f: 24 })
;[0, 1, 2].forEach((i) => block({ name: `Nav ${i + 1}`, right: 1010 - i * 100, cy: MARK.cy, w: 70, h: 10, r: 5, final: C.ink2, f: 28 + i * 3 }))
block({ name: 'Header button', right: 280, cy: MARK.cy, w: 124, h: 38, r: 19, final: C.klein, f: 36 })
// hero text column
block({ name: 'Headline 1', right: R, cy: 300, w: 520, h: 42, r: 8, final: C.ink, f: 32 })
block({ name: 'Headline 2', right: R, cy: 358, w: 400, h: 42, r: 8, final: C.ink, f: 36 })
block({ name: 'Sub 1', right: R, cy: 424, w: 460, h: 14, r: 7, final: C.mute, f: 40 })
block({ name: 'Sub 2', right: R, cy: 450, w: 360, h: 14, r: 7, final: C.mute, f: 43 })
block({ name: 'Link', right: 1200, cy: 522, w: 104, h: 12, r: 6, final: C.ink2, f: 50 })
// the button (its own node so the click can press it)
const BTN = { right: R, cy: 522, w: 214, h: 60 }
const btnNode = nid(), btnFill = nid(), btnStroke = nid(), btnLabel = nid()
blocks.push(`<Node ${attrs({ x: BTN.right - BTN.w / 2, y: BTN.cy, name: 'Button', id: btnNode })}>
      <Shape name="Button label"><Rectangle ${attrs({ width: 112, height: 12, cornerRadiusTL: 6, name: 'Path' })}/>
        <Fill name="Fill"><SolidColor colorValue="00FFFFFF" name="C" id="${btnLabel}"/></Fill></Shape>
      <Shape name="Button shape"><Rectangle ${attrs({ width: BTN.w, height: BTN.h, cornerRadiusTL: 14, name: 'Path' })}/>
        <Fill name="Fill"><SolidColor colorValue="FF${C.wireFill}" name="C" id="${btnFill}"/></Fill>
        <Stroke ${attrs({ thickness: 2, name: 'Wire' })}><SolidColor colorValue="FF${C.wireLine}" name="C" id="${btnStroke}"/></Stroke></Shape>
    </Node>`)
track(btnNode, 'opacity', [[0, 0], [46, 0, 'out'], [64, 1]])
track(btnNode, 'scaleX', [[0, 0.6], [46, 0.6, 'out'], [64, 1], [180, 1, 'press'], [186, 0.95, 'out'], [REVEAL + 8, 1]])
track(btnNode, 'scaleY', [[0, 1], [180, 1, 'press'], [186, 0.95, 'out'], [REVEAL + 8, 1]])
paint(btnFill, btnStroke, C.klein)
track(btnLabel, 'colorValue', [[0, '00FFFFFF'], [PAINT0, '00FFFFFF', 'soft'], [PAINT1, 'FFFFFFFF']], 'c')
svgFinal.push(`<rect x="${BTN.right - BTN.w}" y="${BTN.cy - BTN.h / 2}" width="${BTN.w}" height="${BTN.h}" rx="14" fill="#${C.klein}"/><rect x="${BTN.right - BTN.w / 2 - 56}" y="${BTN.cy - 6}" width="112" height="12" rx="6" fill="#FFFFFF"/>`)

// the film's slot (the DOM video sits exactly over it)
const slotNode = nid(), slotFill = nid(), slotStroke = nid()
blocks.push(`<Node ${attrs({ x: SLOT.x + SLOT.w / 2, y: SLOT.y + SLOT.h / 2, name: 'Slot', id: slotNode })}>
      <Shape name="Slot shape"><Rectangle ${attrs({ width: SLOT.w, height: SLOT.h, cornerRadiusTL: SLOT.r, name: 'Path' })}/>
        <Fill name="Fill"><SolidColor colorValue="FF${C.wireFill}" name="C" id="${slotFill}"/></Fill>
        <Stroke ${attrs({ thickness: 2, name: 'Wire' })}><SolidColor colorValue="FF${C.wireLine}" name="C" id="${slotStroke}"/></Stroke></Shape>
    </Node>`)
track(slotNode, 'opacity', [[0, 0], [38, 0, 'out'], [60, 1]])
track(slotNode, 'scaleX', [[0, 0.94], [38, 0.94, 'out'], [60, 1]])
track(slotNode, 'scaleY', [[0, 0.94], [38, 0.94, 'out'], [60, 1]])
paint(slotFill, slotStroke, C.kleinTint)
svgFinal.push(`<rect x="${SLOT.x}" y="${SLOT.y}" width="${SLOT.w}" height="${SLOT.h}" rx="${SLOT.r}" fill="#${C.kleinTint}"/>`)

// cards
const CARD = { y: 746, h: 120, w: 400, gap: 32 }
;[0, 1, 2].forEach((i) => {
  const right = R - i * (CARD.w + CARD.gap)
  const node = nid(), fillC = nid(), strokeC = nid(), icon = nid(), b1 = nid(), b2 = nid()
  blocks.push(`<Node ${attrs({ x: 0, y: 0, name: `Card ${i + 1}`, id: node })}>
      <Shape ${attrs({ x: right - 52, y: CARD.y, name: 'Icon' })}><Ellipse ${attrs({ width: 46, height: 46, name: 'Path' })}/>
        <Fill name="Fill"><SolidColor colorValue="FF${C.wireFill}" name="C" id="${icon}"/></Fill></Shape>
      <Shape ${attrs({ x: right - 92, y: CARD.y - 12, name: 'Title' })}><Rectangle ${attrs({ width: 150, height: 12, originX: 1, cornerRadiusTL: 6, name: 'Path' })}/>
        <Fill name="Fill"><SolidColor colorValue="FF${C.wireFill}" name="C" id="${b1}"/></Fill></Shape>
      <Shape ${attrs({ x: right - 92, y: CARD.y + 14, name: 'Text' })}><Rectangle ${attrs({ width: 220, height: 9, originX: 1, cornerRadiusTL: 4.5, name: 'Path' })}/>
        <Fill name="Fill"><SolidColor colorValue="FF${C.wireFill}" name="C" id="${b2}"/></Fill></Shape>
      <Shape ${attrs({ x: right - CARD.w / 2, y: CARD.y, name: 'Card shape' })}><Rectangle ${attrs({ width: CARD.w, height: CARD.h, cornerRadiusTL: 16, name: 'Path' })}/>
        <Fill name="Fill"><SolidColor colorValue="FF${C.wireFill}" name="C" id="${fillC}"/></Fill>
        <Stroke ${attrs({ thickness: 2, name: 'Wire' })}><SolidColor colorValue="FF${C.wireLine}" name="C" id="${strokeC}"/></Stroke></Shape>
    </Node>`)
  appearUp(node, 52 + i * 5, 22, 22, 0)
  track(fillC, 'colorValue', [[0, `FF${C.wireFill}`], [PAINT0, `FF${C.wireFill}`, 'soft'], [PAINT1, 'FFFFFFFF']], 'c')
  track(strokeC, 'colorValue', [[0, `FF${C.wireLine}`], [PAINT0, `FF${C.wireLine}`, 'soft'], [PAINT1, `FF${C.line}`]], 'c')
  track(icon, 'colorValue', [[0, `FF${C.wireLine}`], [PAINT0, `FF${C.wireLine}`, 'soft'], [PAINT1, `FF${C.kleinTint}`]], 'c')
  track(b1, 'colorValue', [[0, `FF${C.wireLine}`], [PAINT0, `FF${C.wireLine}`, 'soft'], [PAINT1, `FF${C.ink}`]], 'c')
  track(b2, 'colorValue', [[0, `FF${C.wireLine}`], [PAINT0, `FF${C.wireLine}`, 'soft'], [PAINT1, `FF${C.mute}`]], 'c')
  svgFinal.push(`<rect x="${right - CARD.w + 1}" y="${CARD.y - CARD.h / 2 + 1}" width="${CARD.w - 2}" height="${CARD.h - 2}" rx="16" fill="#FFFFFF" stroke="#${C.line}" stroke-width="2"/><circle cx="${right - 52}" cy="${CARD.y}" r="23" fill="#${C.kleinTint}"/><rect x="${right - 92 - 150}" y="${CARD.y - 18}" width="150" height="12" rx="6" fill="#${C.ink}"/><rect x="${right - 92 - 220}" y="${CARD.y + 9.5}" width="220" height="9" rx="4.5" fill="#${C.mute}"/>`)
})

// the Horizon mark in the page header (appears with the paint)
const markXml = `<Node ${attrs({ x: MARK.cx, y: MARK.cy, scaleX: MARK.s, scaleY: MARK.s, name: 'Mark', id: markNode })}>
      ${halves.map((h, i) => `<Shape name="${i ? 'Lower' : 'Upper'}"><PointsPath isClosed="true" isClockwise="${clockwise(h.vs)}" name="Path">${h.vs.map((v) => `<CubicDetachedVertex ${attrs(v)}/>`).join('')}</PointsPath><Fill name="Fill">${solid(h.tone)}</Fill></Shape>`).join('\n      ')}
    </Node>`
track(markNode, 'scaleX', [[0, 0.001], [100, 0.001, 'out'], [118, MARK.s]])
track(markNode, 'scaleY', [[0, 0.001], [100, 0.001, 'out'], [118, MARK.s]])
const [upD, loD] = markPaths()
svgFinal.push(`<g transform="translate(${n(MARK.cx - 50 * MARK.s)} ${n(MARK.cy - 50 * MARK.s)}) scale(${MARK.s})"><path d="${upD}" fill="#${C.logoA}"/><path d="${loD}" fill="#${C.logoB}"/></g>`)

// the header rule
block({ name: 'Rule', right: WIN.x + WIN.w, cy: PAGE_Y + 72, w: WIN.w, h: 2, r: 0, final: 'E6E6E0', f: 22, wire: true })

// ---------------------------------------------------------------- the toast (a message arrives)
const TOAST = { x: 128, y: 142, w: 360, h: 84 } // floats over the page's top corner, above the film's slot
const toastNode = nid()
const toastXml = `<Node ${attrs({ x: 0, y: 0, opacity: 0, name: 'Toast', id: toastNode })}>
      <Shape ${attrs({ x: TOAST.x + TOAST.w - 48, y: TOAST.y + TOAST.h / 2, name: 'Bubble' })}><Ellipse ${attrs({ width: 44, height: 44, name: 'Path' })}/><Fill name="Fill">${solid(C.klein)}</Fill></Shape>
      <Shape ${attrs({ x: TOAST.x + TOAST.w - 48, y: TOAST.y + TOAST.h / 2, name: 'Bubble dot' })}><Ellipse ${attrs({ width: 12, height: 12, name: 'Path' })}/><Fill name="Fill">${solid('FFFFFF')}</Fill></Shape>
      <Shape ${attrs({ x: TOAST.x + TOAST.w - 86, y: TOAST.y + 32, name: 'From' })}><Rectangle ${attrs({ width: 160, height: 12, originX: 1, cornerRadiusTL: 6, name: 'Path' })}/><Fill name="Fill">${solid(C.ink)}</Fill></Shape>
      <Shape ${attrs({ x: TOAST.x + TOAST.w - 86, y: TOAST.y + 54, name: 'Message' })}><Rectangle ${attrs({ width: 210, height: 9, originX: 1, cornerRadiusTL: 4.5, name: 'Path' })}/><Fill name="Fill">${solid(C.mute)}</Fill></Shape>
      <Shape ${attrs({ x: TOAST.x + TOAST.w / 2, y: TOAST.y + TOAST.h / 2, name: 'Card' })}><Rectangle ${attrs({ width: TOAST.w, height: TOAST.h, cornerRadiusTL: 16, name: 'Path' })}/><Fill name="Fill">${solid('FFFFFF')}</Fill><Stroke thickness="2" name="Line">${solid(C.line)}</Stroke></Shape>
    </Node>`
track(toastNode, 'opacity', [[0, 0], [214, 0, 'out'], [234, 1]])
track(toastNode, 'y', [[0, -22], [214, -22, 'out'], [238, 0]])
svgFinal.push(`<g><rect x="${TOAST.x + 1}" y="${TOAST.y + 1}" width="${TOAST.w - 2}" height="${TOAST.h - 2}" rx="16" fill="#FFFFFF" stroke="#${C.line}" stroke-width="2"/><circle cx="${TOAST.x + TOAST.w - 48}" cy="${TOAST.y + TOAST.h / 2}" r="22" fill="#${C.klein}"/><circle cx="${TOAST.x + TOAST.w - 48}" cy="${TOAST.y + TOAST.h / 2}" r="6" fill="#FFFFFF"/><rect x="${TOAST.x + TOAST.w - 86 - 160}" y="${TOAST.y + 26}" width="160" height="12" rx="6" fill="#${C.ink}"/><rect x="${TOAST.x + TOAST.w - 86 - 210}" y="${TOAST.y + 49.5}" width="210" height="9" rx="4.5" fill="#${C.mute}"/></g>`)

// ---------------------------------------------------------------- the cursor
const cursorNode = nid()
const cursorXml = `<Node ${attrs({ x: 1640, y: 960, name: 'Cursor', id: cursorNode })}>
      <Shape name="Arrow"><PointsPath isClosed="true" name="Path">
        ${[[0, 0], [0, 38], [10, 29], [17, 44], [24, 41], [17, 26], [30, 26]].map(([x, y]) => `<StraightVertex ${attrs({ x, y, radius: 1.5 })}/>`).join('')}
      </PointsPath><Fill name="Fill">${solid('FFFFFF')}</Fill><Stroke thickness="2.5" join="round" name="Line">${solid(C.ink)}</Stroke></Shape>
    </Node>`
const CX = BTN.right - BTN.w / 2 + 10, CY = BTN.cy + 6
track(cursorNode, 'x', [[0, 1640], [128, 1640, 'inout'], [176, CX], [REVEAL + 20, CX, 'inout'], [256, CX + 70]])
track(cursorNode, 'y', [[0, 960], [128, 960, 'inout'], [176, CY], [REVEAL + 20, CY, 'inout'], [256, CY + 120]])
track(cursorNode, 'scaleX', [[0, 1], [180, 1, 'press'], [186, 0.86, 'out'], [REVEAL + 6, 1]])
track(cursorNode, 'scaleY', [[0, 1], [180, 1, 'press'], [186, 0.86, 'out'], [REVEAL + 6, 1]])
track(cursorNode, 'opacity', [[0, 0], [128, 0, 'out'], [140, 1], [236, 1, 'soft'], [260, 0]])

// ---------------------------------------------------------------- the window and the page ground
const pageFill = nid(), winNode = nid()
const chrome = `<Node ${attrs({ x: 0, y: 0, name: 'Window', id: winNode })}>
    ${[0, 1, 2].map((i) => `<Shape ${attrs({ x: WIN.x + 36 + i * 26, y: WIN.y + WIN.bar / 2, name: `Dot ${i + 1}` })}><Ellipse width="13" height="13" name="Path"/><Fill name="Fill">${solid(C.dot)}</Fill></Shape>`).join('\n    ')}
    <Shape ${attrs({ x: 800, y: WIN.y + WIN.bar / 2, name: 'Address' })}><Rectangle ${attrs({ width: 520, height: 30, cornerRadiusTL: 15, name: 'Path' })}/><Fill name="Fill">${solid(C.addr)}</Fill></Shape>
    <Shape ${attrs({ x: 800 + 230, y: WIN.y + WIN.bar / 2, name: 'Address lock' })}><Ellipse width="10" height="10" name="Path"/><Fill name="Fill">${solid(C.dot)}</Fill></Shape>
    <Shape ${attrs({ x: 800 + 214, y: WIN.y + WIN.bar / 2, name: 'Address text' })}><Rectangle ${attrs({ width: 170, height: 8, originX: 1, cornerRadiusTL: 4, name: 'Path' })}/><Fill name="Fill">${solid(C.dot)}</Fill></Shape>
    <Shape ${attrs({ x: WIN.x + WIN.w / 2, y: PAGE_Y + (WIN.h - WIN.bar) / 2, name: 'Page' })}><Rectangle ${attrs({ width: WIN.w, height: WIN.h - WIN.bar, linkCornerRadius: 'false', cornerRadiusTL: 0, cornerRadiusTR: 0, cornerRadiusBR: WIN.r, cornerRadiusBL: WIN.r, name: 'Path' })}/>
      <Fill name="Fill"><SolidColor colorValue="FF${C.pageDark}" name="C" id="${pageFill}"/></Fill></Shape>
    <Shape ${attrs({ x: WIN.x + WIN.w / 2, y: WIN.y + WIN.h / 2, name: 'Frame' })}><Rectangle ${attrs({ width: WIN.w, height: WIN.h, cornerRadiusTL: WIN.r, name: 'Path' })}/>
      <Fill name="Fill">${solid(C.frame)}</Fill><Stroke thickness="2" name="Line">${solid(C.frameLine)}</Stroke></Shape>
  </Node>`
track(winNode, 'opacity', [[0, 0], [2, 0, 'out'], [22, 1]])
track(winNode, 'y', [[0, 26], [2, 26, 'out'], [26, 0]])
track(pageFill, 'colorValue', [[0, `FF${C.pageDark}`], [PAINT0 - 4, `FF${C.pageDark}`, 'soft'], [PAINT1 - 4, `FF${C.page}`]], 'c')

// the content rides with the window as it settles
const site = `<Node ${attrs({ x: 0, y: 0, name: 'Site', id: nid() })}>
    ${blocks.join('\n    ')}
    ${markXml}
  </Node>`

// ---------------------------------------------------------------- the event and the machine
const EVT = '0:1900'
const ANIM = '0:1901', REST = '0:1902', SM = '0:1903', LAYER = '0:1904', S_BUILD = '0:1905', S_REST = '0:1906'
const VM = '0:1910', P_RED = '0:1911', INST = '0:1912'
const kfAll = tracks.map(([o, p, keys, t]) => `<KeyedObject objectId="${o}"><KeyedProperty property="${p}">${keys.map(t === 'c' ? kc : kd).join('')}</KeyedProperty></KeyedObject>`).join('\n    ')
// the resting pose: every keyed property at its last value
const restKeys = tracks.map(([o, p, keys, t]) => { const v = keys[keys.length - 1][1]; return `<KeyedObject objectId="${o}"><KeyedProperty property="${p}">${t === 'c' ? kc([0, v]) : kd([0, v])}</KeyedProperty></KeyedObject>` }).join('\n    ')
const reducedIs = (b) => `<TransitionViewModelCondition><TransitionPropertyViewModelComparator><BindablePropertyBoolean><DataBindContext sourcePathIds="${VM}-${P_RED}" propertyKey="634"/></BindablePropertyBoolean></TransitionPropertyViewModelComparator><TransitionValueBooleanComparator value="${b}"/></TransitionViewModelCondition>`

const rml = `<Rive version="1" kind="fragment">
<!-- GENERATED by design/rive/hero/build-hero.mjs: edit the generator, not this file. -->
<Artboard ${attrs({ defaultStateMachineId: SM, styleId: '0:1999', viewModelId: VM, viewModelInstanceId: INST, width: W, height: H, name: 'Hero', id: '0:1998' })}>
  <LayoutComponentStyle name="Artboard Style" id="0:1999"/>
  <StateMachine name="Main" id="${SM}">
    <StateMachineLayer name="Build" id="${LAYER}">
      <AnyState x="0" y="-200"/>
      <ExitState x="500" y="-200"/>
      <EntryState x="-200" y="0">
        <StateTransition stateToId="${S_REST}">${reducedIs('true')}</StateTransition>
        <StateTransition stateToId="${S_BUILD}">${reducedIs('false')}</StateTransition>
      </EntryState>
      <AnimationState x="150" y="0" animationId="${ANIM}" id="${S_BUILD}"/>
      <AnimationState x="150" y="160" animationId="${REST}" id="${S_REST}"/>
    </StateMachineLayer>
  </StateMachine>
  <Event name="reveal" id="${EVT}"/>
  <Node name="Top" id="${nid()}">
  ${cursorXml}
  ${toastXml}
  ${site}
  ${chrome}
  </Node>
  <Shape ${attrs({ x: W / 2, y: H / 2, name: 'Screen' })}><Rectangle ${attrs({ width: W, height: H, name: 'Path' })}/><Fill name="Fill">${solid(C.screen)}</Fill></Shape>
  <LinearAnimation ${attrs({ loopValue: 'oneShot', fps: 60, duration: END, name: 'Build', id: ANIM })}>
    ${kfAll}
    <KeyedObject objectId="${EVT}"><KeyedProperty property="trigger"><KeyFrameCallback frame="${REVEAL}"/></KeyedProperty></KeyedObject>
  </LinearAnimation>
  <LinearAnimation ${attrs({ loopValue: 'oneShot', fps: 60, duration: 1, name: 'Rest', id: REST })}>
    ${restKeys}
  </LinearAnimation>
</Artboard>
<ViewModel defaultInstanceId="${INST}" name="Hero" id="${VM}">
  <ViewModelPropertyBoolean name="prefersReducedMotion" id="${P_RED}"/>
  <ViewModelInstance exports="true" name="Default" id="${INST}">
    <ViewModelInstanceBoolean propertyValue="false" viewModelPropertyId="${P_RED}"/>
  </ViewModelInstance>
</ViewModel>
</Rive>
`
writeFileSync(resolve(ROOT, 'design/rive/hero/cli/scene.rml'), rml)

// ---------------------------------------------------------------- the finished frame (SVG)
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<rect width="${W}" height="${H}" fill="#${C.screen}"/>
<rect x="${WIN.x + 1}" y="${WIN.y + 1}" width="${WIN.w - 2}" height="${WIN.h - 2}" rx="${WIN.r}" fill="#${C.frame}" stroke="#${C.frameLine}" stroke-width="2"/>
<path d="M${WIN.x} ${PAGE_Y}H${WIN.x + WIN.w}V${WIN.y + WIN.h - WIN.r}A${WIN.r} ${WIN.r} 0 0 1 ${WIN.x + WIN.w - WIN.r} ${WIN.y + WIN.h}H${WIN.x + WIN.r}A${WIN.r} ${WIN.r} 0 0 1 ${WIN.x} ${WIN.y + WIN.h - WIN.r}Z" fill="#${C.page}"/>
${[0, 1, 2].map((i) => `<circle cx="${WIN.x + 36 + i * 26}" cy="${WIN.y + WIN.bar / 2}" r="6.5" fill="#${C.dot}"/>`).join('')}
<rect x="540" y="${WIN.y + WIN.bar / 2 - 15}" width="520" height="30" rx="15" fill="#${C.addr}"/><circle cx="1030" cy="${WIN.y + WIN.bar / 2}" r="5" fill="#${C.dot}"/><rect x="${1014 - 170}" y="${WIN.y + WIN.bar / 2 - 4}" width="170" height="8" rx="4" fill="#${C.dot}"/>
${svgFinal.join('\n')}
</svg>
`
writeFileSync(resolve(ROOT, 'src/look/parts/hero-built.svg'), svg)
writeFileSync(resolve(ROOT, 'src/look/parts/hero-slot.json'), JSON.stringify({ artboard: { w: W, h: H }, slot: SLOT }) + '\n')
console.log(`scene.rml ${rml.length} chars, ${tracks.length} tracks; hero-built.svg ${svg.length} chars`)

if (process.argv.includes('--riv')) {
  const cli = resolve(ROOT, 'design/rive/hero/cli')
  const exe = [resolve(homedir(), '.rive/bin/rive.exe'), resolve(homedir(), '.rive/bin/rive')].find(existsSync) ?? 'rive'
  execFileSync(exe, [cli, '--once'], { stdio: 'inherit' })
  copyFileSync(resolve(cli, 'build/cli.riv'), resolve(ROOT, 'src/look/parts/hero.riv'))
  console.log('copied to src/look/parts/hero.riv')
}
