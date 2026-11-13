// Round 2 of the MW initials (13.11.2026). Nati: round 1 was generic, nothing said high-tech.
// What the research says reads as technology (LogoLounge 2026 report and tech-logo reviews): marks built from a few
// exact modules instead of typed letters, motion and dimension inside a still image, two-tone duality, channels
// between flat parts, parallel signal lines, a compact silhouette that survives one colour and 16 px.
// Every mark here is constructed from numbers, not from a font. Fourteen were drawn; these are the ones that held.

export const THEMES = {
  lit: { a: '#F4FBF9', b: '#2CC5B3', o: '#A9E9DF', g: '#0B1714' },   // on the dark stage
  day: { a: '#13241F', b: '#14A390', o: '#0C5F56', g: '#FFFFFF' },   // on white or mint
  ink: { a: '#13241F', b: '#13241F', o: '#13241F', g: '#FFFFFF', mono: true },
  snow: { a: '#FFFFFF', b: '#FFFFFF', o: '#FFFFFF', g: '#13241F', mono: true },
}
let uid = 0
export const id = () => 'm' + (++uid)
const f = (n) => +n.toFixed(2)

// the M-W zigzag: M is 0,1,.5,1,0 and W is 1,0,.5,0,1; they share the long falling stroke. 180 degrees symmetric.
const ZH = 72, ZT = 15
const ZP = [[0, 0], [24, 72], [36, 36], [48, 72], [72, 0], [84, 36], [96, 0], [120, 72]]
const blade = (a, b, ox = ZT / 2, H = ZH, t = ZT) => `M${f(a[0] + ox - t / 2)} ${H - a[1]}H${f(a[0] + ox + t / 2)}L${f(b[0] + ox + t / 2)} ${H - b[1]}H${f(b[0] + ox - t / 2)}Z`
/** a folded strip through the given points: rising blades show the face, falling blades the back */
const strip = (P, c, ox = ZT / 2) => { let s = '', hatch = ''
  let back = c.b
  if (c.mono && !c.tiny) { const h = id(); hatch = `<defs><pattern id="${h}" patternUnits="userSpaceOnUse" width="4" height="4.2"><rect width="4" height="2.7" fill="${c.a}"/></pattern></defs>`; back = `url(#${h})` }
  for (let i = 0; i < P.length - 1; i++) if (P[i + 1][1] < P[i][1]) s += `<path fill="${back}" d="${blade(P[i], P[i + 1], ox)}"/>`
  for (let i = 0; i < P.length - 1; i++) if (P[i + 1][1] > P[i][1]) s += `<path fill="${c.a}" d="${blade(P[i], P[i + 1], ox)}"/>`
  if (!c.mono) for (let i = 1; i < P.length - 1; i++) { const [x, y] = P[i], peak = y > P[i - 1][1]; s += `<path fill="${c.o}" d="M${f(x + ox - ZT / 2)} ${ZH - y}H${f(x + ox + ZT / 2)}L${f(x + ox)} ${ZH - (y + (peak ? -1 : 1) * 1.5 * ZT)}Z"/>` }
  return hatch + s }

export const MARKS = [
  { key: 'fold', en: 'FOLD', spec: '7 BLADES · ONE SLOPE 18.4°', he: 'סרט מקופל',
    idea: 'סרט אחד מתקפל ומצייר MW. בכל קיפול רואים את הצד השני שלו, וה-M וה-W חולקות מקטע אחד.',
    draw: (c) => ({ w: 120 + ZT, h: ZH, body: strip(ZP, c) }) },

  { key: 'shards', en: 'BLADES', spec: '3 PARTS · 180° SYMMETRY', he: 'שלושה להבים',
    idea: 'משולש, להב ומשולש. המשולש הראשון והלהב בונים M, הלהב והמשולש השני בונים W.',
    draw: (c) => { const u = 36, g = 4; return { w: 4 * u + 2 * g, h: 2 * u, body:
      `<path fill="${c.a}" d="M0 0V${2 * u}H${u}Z"/><path fill="${c.b}" d="M${u + g} ${2 * u}H${2 * u + g}L${3 * u + g} 0H${2 * u + g}Z"/><path fill="${c.a}" d="M${4 * u + 2 * g} 0V${2 * u}L${3 * u + 2 * g} 0Z"/>` } } },

  { key: 'lines', en: 'CHANNELS', spec: '3 PARALLEL TRACKS', he: 'שלושה ערוצים',
    idea: 'קו ה-MW מצויר כשלושה קווים מקבילים שרצים יחד, כמו ערוצים בציר הזמן של עריכת וידאו.',
    draw: (c) => { if (c.tiny) return { w: 120 + ZT, h: ZH, body: strip(ZP, { ...c, b: c.a, o: c.a, mono: true, tiny: true }) }
      const k = id(), m1 = id(), m2 = id(), X = (x) => x + 9, Y = (y) => ZH - y
      const pts = [[-8, -24], ...ZP.slice(1, 7), [128, 96]].map(([x, y], i) => `${i ? 'L' : 'M'}${f(X(x))} ${Y(y)}`).join('')
      const st = (w, col) => `<path d="${pts}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linejoin="miter" stroke-miterlimit="8"/>`
      return { w: 138, h: ZH, body: `<defs><clipPath id="${k}"><rect width="138" height="${ZH}"/></clipPath>
        <mask id="${m1}" maskUnits="userSpaceOnUse" x="-40" y="-40" width="220" height="160">${st(16.6, '#fff')}${st(9.4, '#000')}</mask>
        <mask id="${m2}" maskUnits="userSpaceOnUse" x="-40" y="-40" width="220" height="160">${st(3.8, '#fff')}</mask></defs>
        <g clip-path="url(#${k})"><rect x="-40" y="-40" width="220" height="160" fill="${c.a}" mask="url(#${m1})"/><rect x="-40" y="-40" width="220" height="160" fill="${c.b}" mask="url(#${m2})"/></g>` } } },

  { key: 'pulse', en: 'PULSE', spec: 'ONE STROKE · ONE PERIOD', he: 'פולס',
    idea: 'קו אחד בזוויות ישרות, כמו אות דיגיטלי. מעל האופק הוא m, מתחת לאופק הוא w, ויחד הם מחזור שלם.',
    draw: (c) => { const k = id(), l = id(); const d = 'M6 58V14a8 8 0 0 1 8-8H24a8 8 0 0 1 8 8V58M32 14a8 8 0 0 1 8-8H50a8 8 0 0 1 8 8V102a8 8 0 0 0 8 8H76a8 8 0 0 0 8-8V58M84 102a8 8 0 0 0 8 8H102a8 8 0 0 0 8-8V58'
      return { w: 116, h: 116, body: `<defs><clipPath id="${k}"><rect width="116" height="58"/></clipPath><clipPath id="${l}"><rect y="58" width="116" height="58"/></clipPath></defs>
        <g fill="none" stroke-width="12"><path clip-path="url(#${k})" stroke="${c.a}" d="${d}"/><path clip-path="url(#${l})" stroke="${c.b}" d="${d}"/></g>` } } },

  { key: 'pixels', en: 'SAMPLE', spec: 'ANALOG IN · DIGITAL OUT', he: 'מגל לפיקסלים',
    idea: 'ה-m מצוירת כגל חלק, וה-w בנויה מפיקסלים. זה מה שאנחנו עושים, הופכים חומר לדיגיטלי.',
    draw: (c) => { let s = `<path fill="none" stroke="${c.a}" stroke-width="12" d="M6 54V18A12 12 0 0 1 30 18V54M30 18A12 12 0 0 1 54 18"/>`
      const u = 6, q = c.mono ? 0.3 : 0.5
      const cell = (col, row) => { s += `<rect x="${f(48 + col * u + q)}" y="${f(row * u + q)}" width="${f(u - 2 * q)}" height="${f(u - 2 * q)}" fill="${c.b}"/>` }
      for (let r = 0; r < 9; r++) for (let col = 0; col < 10; col++) {
        const stem = col < 2 || (col > 3 && col < 6) || col > 7
        const on = r === 7 ? true : r === 8 ? col > 0 && col < 9 : stem
        if (on && !(col < 2 && r < 3)) cell(col, r) }
      return { w: 108, h: 54, body: s } } },

  { key: 'comb', en: 'LOCK', spec: '2 PARTS · ONE CHANNEL', he: 'נעילה',
    idea: 'ה-m יורדת מלמעלה, ה-w עולה מלמטה, והן ננעלות זו בזו. הרווח ביניהן הוא אות דיגיטלי אחד רציף.',
    draw: (c) => { const s9 = 9, g = 3.5, p = 25, H = 71.5, R = 4.5
      const m = `M0 ${R}a${R} ${R} 0 0 1 ${R} ${-R}H${59 - R}a${R} ${R} 0 0 1 ${R} ${R}V${H - s9 - g}h${-s9}V${s9}h${-(p - s9)}V${H - s9 - g}h${-s9}V${s9}h${-(p - s9)}V${H - s9 - g}h${-s9}Z`
      return { w: 71.5, h: H, body: `<path fill="${c.a}" d="${m}"/><path fill="${c.b}" transform="rotate(180 ${71.5 / 2} ${H / 2})" d="${m}"/>` } } },

  { key: 'roll', en: 'ROLL', spec: '1 RIBBON · 4 TURNS', he: 'סרט מתגלגל',
    idea: 'סרט אחד שמתגלגל במקום להתקפל. בכל סיבוב הוא מתהפך ומראה את הצד השני, ויחד נכתב mw.',
    draw: (c) => { const A = c.ra || c.a, B = c.rb || c.b, g1 = id(), g2 = id(), g3 = id(), g4 = id()
      const gr = (n, x0, x1, c0, c1) => `<linearGradient id="${n}" gradientUnits="userSpaceOnUse" x1="${x0}" y1="0" x2="${x1}" y2="0"><stop offset=".08" stop-color="${c0}"/><stop offset=".92" stop-color="${c1}"/></linearGradient>`
      return { w: 116, h: 64, body: `<defs>${gr(g1, 6, 32, A, B)}${gr(g2, 32, 58, B, A)}${gr(g3, 58, 84, A, B)}${gr(g4, 84, 110, B, A)}</defs>
        <rect y="19" width="12" height="45" fill="${A}"/><rect x="26" y="19" width="12" height="45" fill="${B}"/><rect x="52" y="19" width="12" height="26" fill="${A}"/><rect x="78" width="12" height="45" fill="${B}"/><rect x="104" width="12" height="45" fill="${A}"/>
        <g fill="none" stroke-width="12"><path stroke="url(#${g1})" d="M6 19.2A13 13 0 0 1 32 19.2"/><path stroke="url(#${g2})" d="M32 19.2A13 13 0 0 1 58 19.2"/><path stroke="url(#${g3})" d="M58 44.8A13 13 0 0 0 84 44.8"/><path stroke="url(#${g4})" d="M84 44.8A13 13 0 0 0 110 44.8"/></g>` } } },
]

/** The initials inside the name: the M and the W of the wordmark are drawn as folded strips, the rest stays. */
export const nameMark = { key: 'name', en: 'WORDMARK', spec: 'NO SEPARATE SYMBOL', he: 'האותיות בתוך השם',
  idea: 'בלי סמל נפרד. ה-M וה-W של השם עצמו מצוירות כסרט מקופל, ושאר האותיות נשארות כמו היום.',
  draw: (c, art) => { const k = 70.3 / ZH, MP = ZP.slice(0, 5), WP = [[0, 72], [24, 0], [36, 36], [48, 0], [72, 72]]
    const cm = { ...c, o: c.mono ? c.a : c.o }, cw = c.mono ? c : { ...c, a: c.b, b: c.t || c.b, o: c.o }
    const mW = (72 + ZT) * k, dM = mW - 70.6 - 7, wX = 281.5 + dM - 2, dW = wX + mW - (281.5 + 97.1) - 9
    return { vb: `0 -72 ${f(538 + dW + 6)} 76`, w: 538 + dW + 6, h: 76, body:
      `<g transform="translate(0 -70.3) scale(${f(k)})">${strip(MP, cm)}</g><g fill="${c.a}" transform="translate(${f(dM)} 0)"><path d="${art.mediaRest}"/></g><path fill="${c.b}" transform="translate(${f(dM)} 0)" d="${art.drop}"/>
       <g transform="translate(${f(wX)} -70.3) scale(${f(k)})">${strip(WP, cw)}</g><path fill="${c.b}" transform="translate(${f(dW + 281.5)} 0)" d="${art.waveRest}"/>` } } }
