// How we work, Heron's floor plan translated: a page's plan assembles from scattered blocks as you scroll
// (grey to ink), its dimension lines arrive, then red markers 01-04 land on the parts each step makes.
// The scene (Blueprint.tsx) scrubs it; markup alone shows the finished plan.
import { C } from '../content'

export const MARKS = [
  { x: 330, y: 86 },
  { x: 330, y: 152 },
  { x: 330, y: 318 },
  { x: 330, y: 548 },
]

export default function Plan() {
  return (
    <svg className="bp-plan" viewBox="0 0 360 600" aria-hidden="true" focusable="false">
      <defs>
        <pattern id="bp-st3" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="0.9" /><circle cx="4.5" cy="4.3" r="0.65" /></pattern>
      </defs>
      <g className="bp-blk" data-f="-60,-40,-8"><rect x="20" y="20" width="320" height="34" /><circle cx="318" cy="37" r="7" /><path d="M36 37h16M58 37h16M80 37h16" /></g>
      <g className="bp-blk" data-f="70,-30,6"><rect className="bp-fill" x="140" y="74" width="200" height="22" /><rect className="bp-fill" x="180" y="102" width="160" height="22" /></g>
      <g className="bp-blk" data-f="-90,20,-5"><rect className="bp-stip" x="20" y="140" width="320" height="150" rx="6" /><rect x="20" y="140" width="320" height="150" rx="6" /><path d="M20 236c50-20 90 18 150-2s110-18 170 0" /></g>
      <g className="bp-blk" data-f="40,60,9"><rect x="20" y="306" width="100" height="90" rx="6" /><rect x="130" y="306" width="100" height="90" rx="6" /><rect x="240" y="306" width="100" height="90" rx="6" /></g>
      <g className="bp-blk" data-f="-50,70,-7"><rect x="20" y="412" width="320" height="110" rx="6" /><path d="M40 440h280M40 470h280M40 500h180" /></g>
      <g className="bp-blk" data-f="80,40,12"><rect x="200" y="536" width="140" height="34" rx="17" /><path d="M232 553h76" /></g>
      <g className="bp-dims">
        <path d="M20 8H340M20 3v10M340 3v10" /><text x="180" y="4">390 PX</text>
        <path d="M352 20V570M347 20h10M347 570h10" />
      </g>
      {MARKS.map((m, i) => (
        <g key={i} className="bp-mark" transform={`translate(${m.x} ${m.y})`}>
          <rect x="-11" y="-11" width="22" height="22" /><text y="4">0{i + 1}</text>
        </g>
      ))}
    </svg>
  )
}

export function Steps() {
  return (
    <ol className="bp-steps">
      {C.process.steps.map((s, i) => (
        <li key={s.id} className="bp-step" data-i={i}>
          <span className="bp-step__k" dir="ltr">STEP 0{i + 1}</span>
          <h3>{s.title}</h3>
          <p>{s.line}</p>
        </li>
      ))}
    </ol>
  )
}
