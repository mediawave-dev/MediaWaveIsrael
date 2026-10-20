// sea · the dot field's shaders (D131; prototype design/eye/premium/template.html). One full-screen
// triangle strip; every fragment finds its cell on a fixed grid and draws one halftone dot whose size
// is the value of the chapter's shape at the cell's centre. The shapes come from MediaWave's world and
// most are wound by the scroll (the chapters write their gears through uniforms):
//   horizon  the Horizon disc with its blue sea (the opening and the end of the tape)
//   laptop   the lid opens; code types itself on the screen, becomes a small business site, the site
//            scrolls, a cursor taps its WhatsApp key and a lead rises out of the screen (D133)
//   reels    a cassette whose reels are wound by the scroll, the emptying pack turning faster
//   bubble   a chat bubble that types while the visitor types (the contact form)
//   landing  a phone with one page and one button: the page scrolls, the button fills
//   seo      a results page: our result climbs from fourth place to first
//   chat     a customer's question, the bot typing, the answer
//   memory   a print that develops like a cyanotype, in the logo's blue
// Shape-local coordinates are in units of the slot's radius, y up, from the slot's centre (D139).

export const VERT = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`

export const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uCell;
uniform float uTime;
uniform vec2 uPtr;
uniform float uPtrE;
uniform vec4 uS[8];     // each scene's slot: x, y, radius (device px) and weight: horizon, laptop, reels,
                        // bubble, landing, seo, chat, memory
uniform vec4 uG;        // gears: landing, seo, chat, memory
uniform float uAmb;     // the quiet field spreading out from the mark, 0..1
uniform vec2 uC;        // where the quiet field spreads from after the opening
uniform float uR;       // the ripple's reach
uniform float uLid;     // lid angle, radians (0 shut)
uniform vec4 uScr;      // the screen: code typed, code to site, site scrolled, cursor and tap
uniform float uLead;    // the lead rising out of the screen
uniform vec4 uReel;     // angle L, angle R, pack radius L, pack radius R
uniform float uType;    // typing, 0..1
uniform float uTypeT;   // the typing phase (advances only while someone types)
uniform float uRew;     // rewind, 0..1
uniform vec4 uTxt[16];  // the words on screen: centre and half-size, device px (D139)
uniform float uNTxt;
uniform float uPad;
uniform float uLvl;     // the music's level, 0..1: the dots breathe with it (D142)
uniform vec4 uCh[4];    // the chapters with their own effect (D165): why, process, questions, letter; each
                        // top, bottom (device px, y up), weight in view, and its own: the seconds since the
                        // process's last cut, the letter's bubble gathered (0..1)
uniform vec4 uChK;      // the process's four steps: their tops (device px, y up)
uniform float uRipAll;  // the field's ripple under the pointer everywhere (lab trail=ripple), else only on the dots
uniform vec4 uNote;     // the last bell: x, y (device px), energy, the ring's radius now
// the Lama Lama lab (design/harvest/lamalama-deep.rtl.md §9)
uniform sampler2D uFilm0; // the films (D154): a frame of each video (or its poster), flipped so v runs up
uniform sampler2D uFilm1;
uniform vec4 uFilmR[2]; // each slot: left, bottom, width, height (device px, y up)
uniform vec4 uFilmK[2]; // weight in view, developed (0..1), pointer mode (0|1), frame ready (0|1)
uniform vec3 uFilmP[2]; // where the finger develops it: x, y (device px), energy
uniform float uFilmA[2]; // the video's aspect (width / height)
uniform float uFilmS[2]; // the slot's shape: 0 its rectangle, 1 the disc inside it (the hero's horizon), 2 the chapter's ground
uniform sampler2D uReel0; // the showreel (D157): the two takes
uniform sampler2D uReel1;
uniform vec4 uReelR;    // its chapter: left, bottom, width, height (device px, y up)
uniform vec4 uReelK;    // weight, developed, the change (0..1), its type (0..7)
uniform vec4 uReelS;    // the change: seed, origin x, origin y, angle
uniform vec4 uReelV;    // its edge, how far the dots last below it, A's aspect, B's aspect
uniform vec4 uReelX;    // A's drift, B's drift, which texture is A, a change is on (0|1)
uniform float uGrain;
uniform vec4 uFlowP[12]; // the pointer's wake (D158): its recent path, x, y (device px), speed x, y
uniform vec4 uFlowE[3];  // their energies, four to a vector
uniform float uFlowR;   // the wake's reach (device px)
uniform float uGrainPx; // the material's squares (device px, 2 CSS px)
uniform float uTrail;   // the pointer's trail of squares on (D162)
uniform vec4 uPress;    // the finger (D163): x, y (device px), strength 0..1, radius (device px)
uniform vec4 uRip[6];   // ripples from the finger's path (D164): x, y (device px), age 0..1, strength
uniform float uScrollV;
uniform sampler2D uAtlas; // live pictures (D158): eight cells of 512 x 320
uniform vec4 uImgR[8];  // each picture's frame: left, bottom, width, height (device px, y up)
uniform vec4 uImgU[8];  // its cell in the atlas: u, v, width, height
uniform vec4 uImgK[8];  // weight, developed (0..1), the way it develops (0 all over, 1 from a point, 2 top down), seed
uniform vec4 uImgO[8];  // the point it develops from (uv), its drift in the frame, its zoom // the scroll's speed, -1..1 (phones stir the picture by scrolling)   // the quiet grain everywhere (D157: off, as Lama Lama's plain ground)
uniform vec4 uFilmV[2]; // a ground (D156): its edge (0 bottom .. 1 top), how far below it the dots last, the picture's focus
uniform vec4 uGnd[2];   // a chapter's own ground: top, bottom (device px, y up), kind (1 deep, 2 paper), on
uniform float uGE;      // the depth of the dotted edge (device px)
uniform vec4 uTurn;     // the page turn: x, y (device px), cover 0..1, reveal 0..1
uniform vec3 uTurnC;    // the turn's colour

const vec3 BG = vec3(0.059, 0.063, 0.067);
const vec3 CREAM = vec3(0.929, 0.906, 0.855);
const vec3 BLUE = vec3(0.475, 0.627, 0.773);
const vec3 DEEP = vec3(0.106, 0.243, 0.384);   // under the horizon: the logo's sea, deep (#1b3e62)
const vec3 PAPER = vec3(0.929, 0.906, 0.855);  // the paper chapter (cream)
const vec3 INK = vec3(0.059, 0.063, 0.067);
const vec3 INKBLUE = vec3(0.133, 0.314, 0.475); // the logo's blue on light grounds (#225079)

// one dot's width in the current drawing's units (slot() sets it before each drawing): thin lines and
// outlines are never thinner than a dot, so every row and column of a line gets exactly its dot (D163)
float gCU = 0.05;
// the same per axis: inside the laptop's screen a dot is wider in screen units one way than the other
vec2 gCV = vec2(0.05);
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float h1(float n) { return fract(sin(n * 91.345) * 47453.5453); }
float box(vec2 p, vec2 b, float r) { vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
float inside(float d) { return 1.0 - step(0.0, d); }
float rim(float d, float w) { float ww = max(w * 0.6, 0.55 * gCU); return 1.0 - smoothstep(ww * 0.7, ww, abs(d)); }
float bar(vec2 q, vec2 c, vec2 h) { h = max(h, 0.5 * gCV); return step(abs(q.x - c.x), h.x) * step(abs(q.y - c.y), h.y); }
/** a rectangle's outline, square-cornered, its sides t thick on each side of the edge: the corners meet */
float rimBox(vec2 p, vec2 b, vec2 t) {
  vec2 a = abs(p);
  return step(a.x, b.x + t.x) * step(a.y, b.y + t.y) * (1.0 - step(a.x, b.x - t.x) * step(a.y, b.y - t.y));
}
/** a bar that grows from the inline start (the right, in Hebrew) by k */
float barR(vec2 q, vec2 c, vec2 h, float k) { return bar(q, c, h) * step(c.x + h.x - 2.0 * h.x * k, q.x); }
float tri(vec2 p, vec2 a, vec2 b, vec2 c) {
  vec2 e0 = b - a, e1 = c - b, e2 = a - c, v0 = p - a, v1 = p - b, v2 = p - c;
  vec2 pq0 = v0 - e0 * clamp(dot(v0, e0) / dot(e0, e0), 0.0, 1.0);
  vec2 pq1 = v1 - e1 * clamp(dot(v1, e1) / dot(e1, e1), 0.0, 1.0);
  vec2 pq2 = v2 - e2 * clamp(dot(v2, e2) / dot(e2, e2), 0.0, 1.0);
  float sg = sign(e0.x * e2.y - e0.y * e2.x);
  vec2 d = min(min(vec2(dot(pq0, pq0), sg * (v0.x * e0.y - v0.y * e0.x)), vec2(dot(pq1, pq1), sg * (v1.x * e1.y - v1.y * e1.x))), vec2(dot(pq2, pq2), sg * (v2.x * e2.y - v2.y * e2.x)));
  return -sqrt(d.x) * sign(d.y);
}
float wsea(vec2 c, float t) { return sin(c.x * 0.013 + t * 0.55) * 0.045 + sin(c.x * 0.031 - t * 0.9 + c.y * 0.004) * 0.022; }

vec2 horizon(vec2 c, vec2 q, float t) {
  float d = length(q) - 1.0;
  float inD = 1.0 - smoothstep(-0.015, 0.015, d);
  float sea = q.y - (-0.04 + wsea(c, t));
  float under = 1.0 - smoothstep(-0.02, 0.02, sea);
  float depth = clamp(-sea, 0.0, 1.0);
  float vSea = 0.42 + 0.38 * (0.5 + 0.5 * sin(c.x * 0.05 + t * 1.3 + depth * 9.0)) * (1.0 - depth * 0.4);
  float v = inD * mix(0.88, vSea, under);
  // the sea goes on past the disc, low and quiet
  float band = (1.0 - inD) * (1.0 - smoothstep(-0.02, 0.02, q.y + 0.06 - wsea(c, t) * 1.5)) * smoothstep(-1.9, -0.25, q.y) * 0.22;
  return vec2(v + band, max(under * inD, step(0.001, band)));
}

// ── the laptop: from the front and a little above, normalised by the hinge's half-width ──
const float HY = -0.39;
const float HW = 1.0;
const float FW = 1.31;
const float DD = 0.59;
const float LL = 1.26;
vec2 lidEdge(float a) { return vec2(HY - DD * cos(a) + LL * sin(a), HW + (FW - HW) * cos(a)); }

// what the screen shows, in screen units: x -1 (left) .. 1, y 1 (top) .. -1
vec2 screenPage(vec2 s, float t) {
  float boot = uScr.x; float build = uScr.y; float scroll = uScr.z; float tap = uScr.w;
  float v = 0.06 + 0.03 * sin(s.y * 30.0 - t * 2.0);
  float b = 0.0;
  // the code types itself, line by line (left to right: code reads LTR)
  float rows = 9.0;
  float r = floor((1.0 - s.y) * 0.5 * rows);
  float ry = 1.0 - (r + 0.5) / rows * 2.0;
  float typed = boot * rows;
  float indent = step(0.55, h1(r + 3.0)) * 0.18 + step(0.85, h1(r + 9.0)) * 0.18;
  float len = (0.25 + 0.95 * h1(r + 1.0)) * clamp(typed - r, 0.0, 1.0);
  float x0 = -0.86 + indent;
  float onRow = step(abs(s.y - ry), max(0.07, 0.5 * gCV.y)) * step(x0, s.x) * step(s.x, x0 + len * 1.45);
  float kw = step(s.x, x0 + 0.24) * step(0.4, h1(r + 5.0));
  float code = onRow * mix(0.62, 0.9, kw);
  // the site replaces the code from the top down, then scrolls up with the reader
  float wipe = step((1.0 - s.y) * 0.5, build * 1.15);
  vec2 p = vec2(s.x, s.y - scroll * 1.7);
  float site = 0.0;
  float sb = 0.0;
  float logo = bar(p, vec2(0.8, 0.86), vec2(0.08, 0.06));
  site = max(site, logo * 0.9); sb = max(sb, logo);
  for (int k = 0; k < 3; k++) site = max(site, bar(p, vec2(-0.78 + float(k) * 0.24, 0.86), vec2(0.08, 0.04)) * 0.5);
  float hero = bar(p, vec2(0.0, 0.45), vec2(0.9, 0.26));
  float wave = step(p.y, 0.42 + 0.06 * sin(p.x * 6.0));
  site = max(site, hero * mix(0.34, 0.66, wave)); sb = max(sb, hero * wave);
  site = max(site, barR(p, vec2(0.25, 0.04), vec2(0.65, 0.075), 1.0) * 0.95);
  site = max(site, barR(p, vec2(0.35, -0.14), vec2(0.55, 0.045), 1.0) * 0.42);
  float key = inside(box(p - vec2(0.55, -0.4), vec2(0.35, 0.11), 0.1));
  site = max(site, key * 0.88); sb = max(sb, key);
  for (int k = 0; k < 3; k++) {
    vec2 cc = p - vec2(0.6 - float(k) * 0.6, -0.98);
    site = max(site, max(rimBox(cc, vec2(0.25, 0.25), max(vec2(0.025), 0.5 * gCV)) * 0.62, bar(cc, vec2(0.0, 0.08), vec2(0.15, 0.045)) * 0.42));
  }
  float band = bar(p, vec2(0.0, -1.85), vec2(1.0, 0.34));
  float key2 = inside(box(p - vec2(0.0, -1.85), vec2(0.44, 0.13), 0.12));
  site = max(site, max(band * 0.14, key2 * 0.92)); sb = max(sb, key2);
  // the cursor comes to the closing key and taps it
  vec2 cp = mix(vec2(-0.55, -0.85), vec2(0.08, -0.2), smoothstep(0.0, 0.6, tap));
  float cur = inside(tri(s, cp, cp + vec2(0.0, -0.26), cp + vec2(0.17, -0.18)));
  float ring = rim(length(s - vec2(0.0, -0.15)) - 0.14 - 0.5 * smoothstep(0.62, 1.0, tap), 0.06) * step(0.62, tap) * (1.0 - smoothstep(0.85, 1.0, tap));
  site = max(site, max(cur * 0.98, ring * 0.7));
  v = max(v, mix(code, site, wipe));
  b = mix(kw * onRow, sb, wipe);
  return vec2(v, b);
}

vec2 laptop(vec2 q, float t) {
  vec2 e = lidEdge(uLid);
  float yF = HY - DD;
  // the deck
  float dv = (q.y - yF) / DD;
  float dhw = mix(FW, HW, dv);
  float inDeck = step(0.0, dv) * step(dv, 1.0) * step(abs(q.x), dhw);
  float deckRim = max(rim(q.y - yF, 0.035), rim(abs(q.x) - dhw, 0.04)) * step(-0.04, dv) * step(dv, 1.04) * step(abs(q.x), dhw + 0.04);
  float ku = q.x / dhw;
  float kv = 1.0 - dv;
  float keys = step(0.1, kv) * step(kv, 0.58) * step(abs(ku), 0.86);
  float keyGap = step(0.16, fract(ku * 7.0 + 0.5)) * step(0.2, fract(kv / 0.48 * 5.0));
  float pad = step(abs(ku), 0.2) * step(0.66, kv) * step(kv, 0.92);
  float v = max(max(inDeck * (0.34 + keys * (keyGap * 0.3 - 0.16) + pad * 0.14), deckRim * 0.92), step(abs(q.x), FW) * step(yF - 0.05, q.y) * step(q.y, yF) * 0.7);
  float blue = 0.0;
  // the lid
  float lv = (q.y - HY) / (e.x - HY);
  // its taper in whole dots (D164): up to two dots a side is drawn straight, or each side breaks into
  // two parallel runs a column apart; a real taper (the lid opening) stays an even diagonal
  float tq = floor(abs(e.y - HW) / gCU + 0.5);
  float ey = tq < 3.0 ? HW : HW + sign(e.y - HW) * tq * gCU;
  float lhw = mix(HW, ey, lv);
  float ls = q.x / lhw;
  float inLid = step(0.0, lv) * step(lv, 1.0) * step(abs(ls), 1.0);
  if (inLid > 0.5) {
    float tb = max(0.035, 0.75 * gCU / max(abs(e.x - HY), 0.001));
    float sd = max(0.035, 0.75 * gCU / max(lhw, 0.001));
    float lidRim = max(max(step(lv, tb), step(1.0 - tb, lv)), step(1.0 - sd, abs(ls)));
    if (e.x < HY) {
      // shut or nearly: the lid's back, with the Horizon disc
      float dq = length(vec2(ls / 0.34, (lv - 0.5) / 0.38));
      float inDisc = step(dq, 1.0);
      float sea = step(lv, 0.5 + 0.04 * sin(ls * 9.0 + t * 0.8));
      v = mix(0.6, mix(0.08, 0.9, sea), inDisc);
      blue = inDisc * sea;
      v = max(v, lidRim * 0.95);
    } else {
      float inScr = step(0.07, lv) * step(lv, 0.93) * step(abs(ls), 0.93);
      vec2 s = vec2(ls / 0.93, (lv - 0.5) / 0.43);
      // the screen's units: x spans 0.93 of the lid's half-width, y 0.43 of its height (D164: its lines
      // were thinner than a dot and fell apart)
      float g0 = gCU;
      vec2 v0 = gCV;
      gCV = gCU / vec2(0.93 * lhw, 0.43 * max(abs(e.x - HY), 0.001));
      gCU = max(gCV.x, gCV.y);
      vec2 pg = screenPage(s, t);
      gCU = g0;
      gCV = v0;
      v = mix(0.86, pg.x, inScr);
      blue = pg.y * inScr;
    }
  }
  // the lead rises out of the screen: a blue bubble beside its top corner
  if (uLead > 0.001) {
    vec2 lc = mix(vec2(-0.55, 0.45), vec2(-1.0, 1.02), smoothstep(0.0, 1.0, uLead));
    float sz = smoothstep(0.0, 0.5, uLead);
    vec2 bq = (q - lc) / max(0.001, sz);
    float bd = min(box(bq, vec2(0.5, 0.21), 0.2), tri(bq, vec2(0.14, -0.16), vec2(0.42, -0.16), vec2(0.5, -0.38)));
    float inB = inside(bd) * step(0.01, sz);
    float txt = bar(bq, vec2(0.04, 0.07), vec2(0.32, 0.045)) + bar(bq, vec2(0.14, -0.07), vec2(0.22, 0.045));
    v = mix(v, mix(0.86, 0.12, step(0.5, txt)), inB);
    blue = mix(blue, 1.0 - step(0.5, txt), inB);
  }
  return vec2(v, blue);
}

// ── the cassette ──
vec2 reels(vec2 q) {
  float v = 0.0;
  float b = 0.0;
  for (int i = 0; i < 2; i++) {
    vec2 o = vec2(i == 0 ? -0.6 : 0.6, 0.08);
    vec2 r = q - o;
    float d = length(r);
    float pack = i == 0 ? uReel.z : uReel.w;
    float a = atan(r.y, r.x) + (i == 0 ? uReel.x : uReel.y);
    float ring = 1.0 - smoothstep(0.0, 0.02, abs(d - 0.16) - 0.025);
    float spokes = step(0.06, d) * step(d, 0.14) * step(0.35, cos(a * 3.0));
    float tape = step(0.19, d) * (1.0 - smoothstep(pack - 0.01, pack + 0.01, d)) * (0.42 + 0.14 * sin(d * 90.0));
    v = max(v, max(max(ring * 0.95, spokes * 0.9), tape));
    b = max(b, step(0.001, tape));
  }
  float shell = rim(box(q, vec2(1.3, 0.82), 0.1), 0.035);
  float win = rim(box(q - vec2(0.0, 0.08), vec2(0.98, 0.34), 0.3), 0.025);
  float label = step(0.5, q.y) * step(q.y, 0.68) * step(abs(q.x), 1.08) * 0.16;
  float head = rim(box(q - vec2(0.0, -0.68), vec2(0.62, 0.14), 0.02), 0.025) * step(q.y, -0.55);
  return vec2(max(max(v, shell * 0.85), max(max(win * 0.5, label), head * 0.7)), b);
}

// ── the contact bubble ──
vec2 bubble(vec2 q) {
  float bd = box(q - vec2(0.0, 0.1), vec2(1.2, 0.75), 0.35);
  float tail = tri(q, vec2(-0.45, -0.5), vec2(-0.95, -0.5), vec2(-1.12, -0.98));
  float inB = 1.0 - smoothstep(-0.01, 0.01, min(bd, tail));
  float typing = 0.0;
  for (int k = 0; k < 3; k++) {
    float fk = float(k);
    float bob = 0.07 * uType * max(0.0, sin(uTypeT * 6.0 - fk * 0.9));
    typing = max(typing, 1.0 - smoothstep(0.1, 0.12, length(q - vec2(0.45 - fk * 0.45, 0.1 + bob))));
  }
  return vec2(inB * mix(0.8, 0.07, typing), typing * (0.4 + 0.6 * uType));
}

// ── landing pages: a phone, one page, one button ──
vec2 landing(vec2 q, float g) {
  float body = box(q, vec2(0.54, 1.0), 0.15);
  float inScr = inside(box(q, vec2(0.46, 0.9), 0.08));
  vec2 c = vec2(q.x, q.y - g * 0.78);
  float v = 0.04;
  float b = 0.0;
  float hero = bar(c, vec2(0.0, 0.58), vec2(0.38, 0.2));
  float wave = step(c.y, 0.55 + 0.04 * sin(c.x * 9.0));
  v = max(v, hero * mix(0.3, 0.6, wave)); b = max(b, hero * wave);
  v = max(v, barR(c, vec2(0.1, 0.24), vec2(0.28, 0.045), 1.0) * 0.95);
  v = max(v, barR(c, vec2(0.18, 0.12), vec2(0.2, 0.045), 1.0) * 0.95);
  for (int k = 0; k < 4; k++) {
    float fk = float(k);
    float w = 0.36 - 0.05 * mod(fk, 2.0) - 0.04 * step(2.5, fk);
    v = max(v, barR(c, vec2(0.38 - w, -0.03 - fk * 0.085), vec2(w, 0.016), 1.0) * 0.36);
  }
  // the one button: it fills from the start side as it reaches the thumb
  float btn = box(c - vec2(0.0, -0.52), vec2(0.36, 0.09), 0.09);
  float fill = step(0.36 - 0.72 * smoothstep(0.5, 0.82, g), c.x);
  v = max(v, inside(btn) * mix(0.32, 0.92, fill)); b = max(b, inside(btn) * fill);
  v = max(v, rim(btn, 0.022) * 0.8);
  // and the tap that sends it
  float tap = smoothstep(0.84, 1.0, g);
  v = max(v, rim(length(c - vec2(0.0, -0.52)) - 0.06 - 0.36 * tap, 0.03) * step(0.84, g) * (1.0 - tap) * 0.8);
  v *= inScr; b *= inScr;
  v = max(v, rim(body, 0.035) * 0.92);
  v = max(v, bar(q, vec2(0.0, 0.94), vec2(0.12, 0.02)) * 0.6);
  return vec2(v, b);
}

// ── search: our result climbs from fourth place to first ──
vec2 seo(vec2 q, float g) {
  float sb = box(q - vec2(0.2, 0.72), vec2(0.92, 0.13), 0.13);
  float v = rim(sb, 0.03) * 0.9;
  v = max(v, rim(length(q - vec2(0.92, 0.72)) - 0.055, 0.022) * 0.95);
  v = max(v, barR(q, vec2(0.52, 0.72), vec2(0.28, 0.02), 1.0) * 0.55);
  float ours = 3.0 * (1.0 - smoothstep(0.06, 0.8, g));
  float b = 0.0;
  for (int k = 0; k < 4; k++) {
    float fk = float(k);
    float slot = k == 3 ? ours : fk + clamp(fk + 1.0 - ours, 0.0, 1.0);
    float y = 0.38 - slot * 0.33;
    // ours steps out a little while it climbs, so the rows never print over each other
    float dx = k == 3 ? -0.12 * sin(3.14159 * clamp(ours / 3.0, 0.0, 1.0)) * step(0.02, ours) : 0.0;
    vec2 rq = q - vec2(dx, 0.0);
    float title = bar(rq, vec2(1.06 - 0.36, y), vec2(0.36, 0.045));
    float url = bar(rq, vec2(1.06 - 0.24, y - 0.09), vec2(0.24, 0.018));
    float line = bar(rq, vec2(1.06 - 0.58, y - 0.16), vec2(0.58, 0.018));
    float val = max(title * 0.94, max(url * 0.46, line * 0.32));
    if (k == 3) b = max(b, step(0.01, val));
    v = max(v, val);
  }
  // first place: a mark beside it once it is there
  float first = smoothstep(0.8, 0.95, g);
  v = max(v, (1.0 - step(0.065 * first, length(q - vec2(-0.2, 0.38)))) * 0.9);
  b = max(b, (1.0 - step(0.065 * first, length(q - vec2(-0.2, 0.38)))));
  return vec2(v, b);
}

// ── the search engine's mark in dots, at the start of the search bar: its ring sweeps round as the
//    take begins, red, yellow, green, blue, and its bar closes it (Nati, 20.10) ──
const vec3 G_BLUE = vec3(0.259, 0.522, 0.957);
const vec3 G_RED = vec3(0.918, 0.263, 0.208);
const vec3 G_YEL = vec3(0.984, 0.737, 0.020);
const vec3 G_GRN = vec3(0.204, 0.659, 0.325);
vec4 gmark(vec2 q, float g) {
  vec2 p = (q - vec2(-1.02, 0.72)) / 0.25;
  float r = length(p);
  float ang = atan(p.y, p.x);
  float onRing = step(0.56, r) * step(r, 1.0);
  // the ring runs from the top right, counterclockwise, round to the bar
  float s = mod(ang - 0.62, 6.28318) / (6.28318 - 0.62);
  float drawn = smoothstep(0.02, 0.3, g);
  float ring = onRing * step(s, drawn) * step(0.0, s) * (1.0 - step(1.0, s));
  float bar = step(abs(p.y), 0.2) * step(-0.02, p.x) * step(p.x, 0.98) * smoothstep(0.28, 0.34, g);
  float v = max(ring, bar) * 0.95;
  vec3 col = G_BLUE;
  if (ang > 0.62 && ang <= 2.5) col = G_RED;
  else if (ang > 2.5 || ang <= -2.35) col = G_YEL;
  else if (ang > -2.35 && ang <= -0.72) col = G_GRN;
  return vec4(v, col);
}

// ── a chatbot: the question, the bot typing, the answer ──
// the AI's spark (Nati, 20.10: "everyone should see it is AI"): a four-pointed star, the sign people
// now read as AI, drawn in dots; our own, not any company's mark
float spark(vec2 p, float s, float a) {
  p = mat2(cos(a), sin(a), -sin(a), cos(a)) * p / s;
  return clamp((1.0 - (sqrt(abs(p.x)) + sqrt(abs(p.y)))) * 1.7, 0.0, 1.0);
}

vec2 chat(vec2 q, float g) {
  float a1 = smoothstep(0.02, 0.22, g);
  vec2 c1 = q - vec2(0.42, 0.52);
  float in1 = inside(box(c1, vec2(0.66, 0.2) * a1 + 0.001, 0.18 * a1)) * step(0.01, a1);
  float t1 = max(barR(c1, vec2(0.05, 0.05), vec2(0.5, 0.03), 1.0), barR(c1, vec2(0.2, -0.06), vec2(0.35, 0.03), 1.0)) * step(0.95, a1);
  float v = in1 * mix(0.82, 0.1, t1);
  float b = 0.0;
  float typing = step(0.28, g) * (1.0 - step(0.6, g));
  vec2 c2 = q - vec2(-0.62, 0.02);
  float inT = inside(box(c2, vec2(0.36, 0.15), 0.15)) * typing;
  // the bot thinks: its spark turns and breathes inside the bubble (the scroll turns it)
  float dots = spark(c2, 0.16 + 0.03 * sin(g * 60.0), g * 18.0);
  v = max(v, inT * mix(0.78, 0.1, dots));
  b = max(b, inT * (1.0 - dots));
  float a2 = smoothstep(0.6, 0.82, g);
  vec2 c3 = q - vec2(-0.28, -0.4);
  float in3 = inside(box(c3, vec2(0.92, 0.38) * a2 + 0.001, 0.2 * a2)) * step(0.01, a2);
  float lines = 0.0;
  for (int k = 0; k < 3; k++) {
    float fk = float(k);
    float w = 0.7 - fk * 0.14;
    lines = max(lines, barR(c3, vec2(0.74 - w, 0.15 - fk * 0.15), vec2(w, 0.03), 1.0));
  }
  lines *= step(0.95, a2);
  v = max(v, in3 * mix(0.74, 0.12, lines));
  b = max(b, in3 * (1.0 - lines));
  // the answer is signed with the spark, beside it, with a small one by its side
  float sg = smoothstep(0.62, 0.86, g);
  float sk = max(spark(q - vec2(-1.26, -0.06), 0.24 * sg + 0.001, 0.0), spark(q - vec2(-1.04, 0.16), 0.09 * sg + 0.001, 0.0)) * step(0.01, sg);
  v = max(v, sk * 0.95);
  b = max(b, sk);
  return vec2(v, b);
}

// ── a memory: a print that develops like a cyanotype ──
vec2 memory(vec2 q, vec2 cell, float g) {
  // square to the grid (D163): a tilted print falls on the dots in steps
  float an = 0.0;
  vec2 p = mat2(cos(an), sin(an), -sin(an), cos(an)) * q;
  float inP = inside(box(p, vec2(0.86, 0.98), 0.02));
  vec2 ip = p - vec2(0.0, 0.14);
  float inI = inside(box(ip, vec2(0.72, 0.7), 0.0));
  float sun = 1.0 - step(0.16, length(ip - vec2(-0.32, 0.36)));
  float hill = step(ip.y, -0.18 + 0.12 * sin(ip.x * 2.6 + 0.6));
  float fig1 = max(1.0 - step(0.075, length(ip - vec2(0.18, -0.04))), bar(ip, vec2(0.18, -0.26), vec2(0.065, 0.15)));
  float fig2 = max(1.0 - step(0.06, length(ip - vec2(0.38, -0.1))), bar(ip, vec2(0.38, -0.28), vec2(0.05, 0.12)));
  float light = max(sun, max(fig1, fig2));
  // each cell turns blue in its own moment, where the light did not fall
  float dev = clamp(g * 1.35 - hash(cell) * 0.35, 0.0, 1.0) * inI * (1.0 - light);
  float v = inP * 0.62;
  v = mix(v, mix(0.82, 0.58, hill), dev);
  v = max(v, rim(box(p, vec2(0.86, 0.98), 0.02), 0.03) * 0.9);
  return vec2(v, dev);
}

// one film in its slot: R = slot (left, bottom, width, height), K = weight, developed, pointer mode,
// frame ready; P = the finger; A = the video's aspect; S = 1 for the disc inside the slot
vec3 filmLayer(sampler2D tx, vec4 R, vec4 K, vec3 P, float A, float S, vec2 c, vec2 px, vec2 cell, float t, vec3 outc) {
  vec2 fr = (c - R.xy) / R.zw;
  vec2 fp = (px - R.xy) / R.zw;
  // the disc: a cell joins by its centre, the developed colour by each pixel (a clean round edge)
  float cin = step(0.0, fr.x) * step(fr.x, 1.0) * step(0.0, fr.y) * step(fr.y, 1.0);
  float pin = step(0.0, fp.x) * step(fp.x, 1.0) * step(0.0, fp.y) * step(fp.y, 1.0);
  if (S > 0.5) {
    float rd = 0.5 * R.z;
    cin = step(length((fr - 0.5) * R.zw), rd);
    pin = 1.0 - smoothstep(rd - 1.0, rd + 0.5, length((fp - 0.5) * R.zw));
  }
  if (cin < 0.5 && pin <= 0.0) return outc;
  // cover fit: the video fills the slot, cropped on the long side
  float ra = R.z / R.w;
  vec2 sc = ra > A ? vec2(1.0, A / ra) : vec2(ra / A, 1.0);
  float pdf = length(c - uPtr);
  vec2 wob = normalize(c - uPtr + 0.001) * uPtrE * uRipAll * 0.012 * exp(-pdf / (0.4 * uR)) * sin(pdf * 0.075 - t * 7.0);
  vec2 uvC = clamp((fr - 0.5) * sc + 0.5 + wob, 0.0, 1.0);
  vec2 uvP = clamp((fp - 0.5) * sc + 0.5, 0.0, 1.0);
  vec3 vc = texture2D(tx, uvC).rgb;
  float L = dot(vc, vec3(0.299, 0.587, 0.114));
  float fv = clamp(L * 1.15 * K.w + 0.12 * (1.0 - K.w), 0.0, 1.0);
  float frr = pow(fv, 0.62) * uCell * 0.5;
  float fa = (1.0 - smoothstep(frr - 0.8, frr + 0.6, length(px - c))) * step(0.03, fv);
  vec3 fcol = mix(BLUE, CREAM, smoothstep(0.2, 0.7, L));
  vec3 dotted = cin > 0.5 ? mix(BG, fcol, fa * (0.35 + 0.65 * fv)) : outc;
  float hc = hash(cell + 7.0);
  float dev = step(hc * 0.98 + 0.01, K.y) * K.w;
  float fdR = 0.36 * min(R.z, R.w);
  dev = max(dev, K.z * K.w * P.z * (1.0 - smoothstep(fdR * 0.55, fdR, length(c - P.xy) + hc * fdR * 0.4)));
  vec3 film = mix(dotted, texture2D(tx, uvP).rgb, dev * pin);
  return mix(outc, film, K.x);
}

// ── Lama Lama's material, read from their own shaders (D162) ──
// One grid of tiny squares for everything on the screen (uGrainPx each, 2 CSS px), four by four to a cell.
// A level from 0 to 1 lights a cell's squares one after another in our own order (rank 0 first). The
// first seven draw a little Horizon, the sun over the sea line, so the material never goes solid: at its
// brightest it is that glyph, and on the way the cells hold different clusters, one square, a pair, an
// L, a dash. A picture's edge breaks through all sixteen: holes open in it square by square, and what is
// left keeps the picture's own colour.
const vec3 SQ = vec3(0.88, 0.862, 0.81);   // the material's squares: cream, a touch softer
const vec3 MAT = vec3(0.40, 0.385, 0.36);
const vec3 LUM = vec3(0.299, 0.587, 0.114);
float rankAt(vec2 px) {
  vec2 q = mod(floor(px / uGrainPx), 4.0);
  vec4 r = q.y < 0.5 ? vec4(1.0, 6.0, 3.0, 5.0) : (q.y < 1.5 ? vec4(8.0, 12.0, 14.0, 10.0) : (q.y < 2.5 ? vec4(11.0, 4.0, 0.0, 7.0) : vec4(13.0, 2.0, 9.0, 15.0)));
  return dot(r, vec4(equal(vec4(q.x), vec4(0.0, 1.0, 2.0, 3.0))));
}
// all sixteen squares, in order (a picture's colour); and the material, the glyph at most
float sq16(float rk, float a) { return step(rk + 0.5, a * 16.0); }
float sq7(float rk, float a) { return step(rk + 0.5, min(a, 1.0) * 7.0); }
float vn(vec2 p) {
  vec2 i = floor(p);
  vec2 u = fract(p);
  u = u * u * (3.0 - 2.0 * u);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
// Lama's noise over the cells: smooth and squared (mostly low, a few hills), turning slowly with r
float cellN(vec2 px, float r) {
  vec2 c = floor(px / (4.0 * uGrainPx)) * 4.0 * uGrainPx / uRes.y * 8.0;
  float a = r * 0.05;
  float v = vn(mat2(cos(a), sin(a), -sin(a), cos(a)) * c + 3.7);
  return v * v;
}
// row by row: each row of cells its own noise along the edge, so an edge frays into dashes
float rowN(vec2 px, float r) {
  float v = vn(vec2(floor(px.y / (4.0 * uGrainPx)) * 1.7, px.x / uRes.y * 3.0 + r * 0.05));
  return v * v;
}
// a level that runs 0 to 1 with p, held back a little where the noise is high (Lama's reveal curve)
float lamaP(float p, float n) { return 1.0 - smoothstep(0.0, 1.0, (1.0 - p) * (1.0 + 0.5 * n)); }
// a picture's edge: 1 inside past the band, 0 outside it; the band swells along the edge with the noise
float edgeLv(float y, float e, float w, float n) { return smoothstep(e - w, e, y + w * 0.75 * n); }
// the pointer's wake (D159) and trail (D162): its recent path, each point with its speed and energy. Like
// a fingertip drawn through water, the picture is pushed a little away from the path and carried a little
// along the motion (xy, device px); z: how much it bends here; w: the trail, fading twice as fast
vec4 flowAt(vec2 px) {
  vec4 acc = vec4(0.0);
  float r2 = uFlowR * uFlowR;
  for (int i = 0; i < 12; i++) {
    float e = dot(uFlowE[i / 4], vec4(equal(vec4(float(i - (i / 4) * 4)), vec4(0.0, 1.0, 2.0, 3.0))));
    if (e < 0.01) continue;
    vec2 d = px - uFlowP[i].xy;
    float g = exp(-dot(d, d) / r2);
    acc += vec4((d / uFlowR) * 10.0 * g * e + uFlowP[i].zw * 0.3 * g * e, g * e, g * e * e);
  }
  return acc;
}

// ── a chapter's ground (D156, D162): the clip across the whole width; at its edges it breaks into its own
// squares, each ground in its own way (style): 0 holes (Lama's edge, a broad swell), 1 material (past
// the holes the clip goes on as its cream material), 2 rows (each row of cells frays on its own), 3
// backdrop (Lama's backdrop behind a list: only the clip's material, quiet) ──
vec3 veilLayer(sampler2D tx, vec4 R, vec4 K, float A, vec4 V, float style, vec2 px, float t, float soft, vec4 fl, vec3 outc) {
  vec2 fp = (px - R.xy) / R.zw;
  if (fp.y < 0.0 || fp.y > 1.0) return outc;
  float ra = R.z / R.w;
  vec2 sc = ra > A ? vec2(1.0, A / ra) : vec2(ra / A, 1.0);
  vec2 c0 = clamp(V.zw, sc * 0.5, 1.0 - sc * 0.5);
  vec2 sv = vec2(0.0, uScrollV * 0.012 * sin(fp.x * 9.0 + t * 1.3));
  vec2 base = (fp - 0.5) * sc + c0 + sv;
  vec2 off = fl.xy / R.zw * sc;
  vec3 col = texture2D(tx, clamp(base - off, 0.0, 1.0)).rgb;
  if (fl.z > 0.02) {
    col.r = texture2D(tx, clamp(base - off * 1.35, 0.0, 1.0)).r;
    col.b = texture2D(tx, clamp(base - off * 0.65, 0.0, 1.0)).b;
    col += min(0.06, fl.z * 0.05);
  }
  float L = dot(col, LUM);
  float rk = rankAt(px);
  float n = style > 1.5 && style < 2.5 ? rowN(px, t) : cellN(px, t * 0.2);
  float n2 = style > 1.5 && style < 2.5 ? rowN(px + 57.0, t) : cellN(px + 91.0, t * 0.2);
  if (style > 2.5) {
    float lv = edgeLv(fp.y, 0.24, 0.24, n) * edgeLv(1.0 - fp.y, 0.24, 0.24, n2);
    float a = sq7(rk, L * 1.25 * lv);
    return mix(outc, mix(outc, SQ, 0.42 * mix(0.25, 1.0, soft)), a * K.x);
  }
  float w = V.y + abs(uScrollV) * 0.05;
  float lvB = edgeLv(fp.y, V.x, w, n);
  float lvT = K.z > 0.0 ? edgeLv(1.0 - fp.y, K.z, K.z, n2) : 1.0;
  float dv = lamaP(clamp(K.y * 1.25 - 0.1 + (fp.y - 0.5) * 0.15, 0.0, 1.0), n);
  // the bottom edge opens its holes in one order, the top edge in the other (Lama's inverse)
  float a = sq16(rk, min(lvB, dv)) * sq16(15.0 - rk, lvT);
  vec3 res = outc;
  if (a > 0.5) res = col * mix(0.32, 1.0, soft) * mix(0.55, 1.0, min(lvB, lvT));
  else if (style > 0.5 && style < 1.5) {
    float lm = L * 1.35 * edgeLv(fp.y, V.x - w * 0.5, w * 1.6, n) * edgeLv(fp.y, 0.14, 0.14, n2) * lvT * dv;
    if (sq7(rk, lm) > 0.5) res = SQ * mix(0.3, 1.0, soft);
  }
  return mix(outc, res, K.x);
}

// ── the hero's showreel (D157, D162): two takes, A on screen and B coming in through one of eight smooth
// changes; the squares carry the grain, the bloom's rim, the wipe's front and the material ──
vec3 reelTex(float which, vec2 uv) { return which < 0.5 ? texture2D(uReel0, uv).rgb : texture2D(uReel1, uv).rgb; }
vec2 reelUV(vec2 f, float asp, float s) {
  float ra = uReelR.z / uReelR.w;
  vec2 sc = ra > asp ? vec2(1.0, asp / ra) : vec2(ra / asp, 1.0);
  return clamp((f - 0.5) * sc / s + 0.5, 0.001, 0.999);
}
vec3 reelColour(vec2 f, vec2 px, float t) {
  float ty = uReelK.w;
  float k = uReelK.z;
  float sw = uReelX.z;
  float sA = uReelX.x;
  float sB = uReelX.y;
  float ra = uReelR.z / uReelR.w;
  vec2 fa = f;
  vec2 fb = f;
  bool tr = uReelX.w > 0.5;
  float side = cos(uReelS.w) > 0.0 ? 1.0 : -1.0;
  if (tr && ty > 2.5 && ty < 3.5) {
    vec2 nn = vec2(sin(f.y * 8.0 + uReelS.x + k * 4.0), cos(f.x * 6.0 + uReelS.x * 1.3 - k * 3.0));
    fa += nn * 0.05 * k;
    fb -= nn * 0.05 * (1.0 - k);
  }
  if (tr && ty > 3.5 && ty < 4.5) { sA *= 1.0 + 0.35 * k; sB *= 1.2 - 0.2 * k; }
  if (tr && ty > 5.5 && ty < 6.5) { fa.x += side * k * 0.3; fb.x += -side * (1.0 - k); }
  vec3 a = reelTex(sw, reelUV(fa, uReelV.z, sA));
  if (!tr) return a;
  vec3 b = reelTex(1.0 - sw, reelUV(fb, uReelV.w, sB));
  float rk = rankAt(px);
  float n = cellN(px, t);
  // 0 squares: B comes in square by square, unevenly (Lama's dissolve)
  if (ty < 0.5) return sq16(rk, lamaP(k, n)) > 0.5 ? b : a;
  // 1 bloom: B opens from a point, its rim breaking into squares
  if (ty < 1.5) {
    float d = length((f - uReelS.yz) * vec2(ra, 1.0));
    float rr = k * (ra + 1.0) * 0.95;
    return sq16(rk, 1.0 - smoothstep(rr - 0.16, rr, d + 0.06 * n)) > 0.5 ? b : a;
  }
  // 2 wipe: at an angle, a front of squares sweeps B in
  if (ty < 2.5) {
    vec2 dir = vec2(cos(uReelS.w), sin(uReelS.w));
    float s = 0.5 + dot((f - 0.5) * vec2(ra, 1.0), dir) / (0.5 * (ra + 1.0));
    return sq16(rk, clamp((k * 1.5 - 0.25 - s + 0.08 * n) / 0.25, 0.0, 1.0)) > 0.5 ? b : a;
  }
  // 3 liquid: the picture flows into the next
  if (ty < 3.5) return mix(a, b, smoothstep(0.12, 0.88, k));
  // 4 push: A zooms through, B settles in
  if (ty < 4.5) return mix(a, b, smoothstep(0.3, 0.7, k));
  // 5 through the dark: B appears first where A is darkest
  if (ty < 5.5) {
    float L = dot(a, LUM);
    return mix(a, b, smoothstep(L - 0.08, L, k * 1.16 - 0.08));
  }
  // 6 slide: B slides in from a side, A drifts away behind it, a soft shadow on the seam
  if (ty < 6.5) {
    float x = side > 0.0 ? f.x - (1.0 - k) : k - f.x;
    float seam = exp(-abs(x) * 60.0) * 0.35 * step(0.0, x);
    return x > 0.0 ? b * (1.0 - seam) : a * (1.0 - 0.3 * k);
  }
  // 7 material: A sinks into its cream squares, B rises out of them in colour
  float h = k < 0.5 ? k * 2.0 : (k - 0.5) * 2.0;
  vec3 src = k < 0.5 ? a : b;
  float L = dot(src, LUM);
  if (sq16(rk, lamaP(k < 0.5 ? 1.0 - h : h, n)) > 0.5) return src;
  return sq7(rk, L * 1.4 * (k < 0.5 ? 1.0 - 0.5 * h : 0.5 + 0.5 * h)) > 0.5 ? SQ : BG;
}
vec3 reelLayer(vec2 px, float t, float soft, vec4 fl, vec3 outc) {
  vec2 fp = (px - uReelR.xy) / uReelR.zw;
  if (fp.y < 0.0 || fp.y > 1.0) return outc;
  vec2 off = fl.xy / uReelR.zw;
  vec2 fq = fp - off + vec2(0.0, uScrollV * 0.012 * sin(fp.x * 9.0 + t * 1.3));
  vec3 col = reelColour(fq, px, t);
  if (fl.z > 0.02) {
    col.r = reelColour(fq - off * 0.35, px, t).r;
    col.b = reelColour(fq + off * 0.35, px, t).b;
    col += min(0.06, fl.z * 0.05);
  }
  float rk = rankAt(px);
  float n = cellN(px, t * 0.2);
  // the bottom (Lama's hero): holes open in the picture square by square down a band that swells along
  // the width; what is left keeps the picture's colour, dimmer as it goes. The band climbs as the hero
  // scrolls away
  float lv = edgeLv(fp.y, uReelV.x, uReelV.y + abs(uScrollV) * 0.05, n);
  // at the start the picture comes in square by square, from the top down
  float dv = lamaP(clamp(uReelK.y * 1.3 - (1.0 - fp.y) * 0.3, 0.0, 1.0), n);
  float a = sq16(rk, min(lv, dv));
  // under the words the picture is dimmed; in the band, where only scattered squares are left, less so
  vec3 pic = col * mix(mix(0.32, 1.0, soft), 1.0, (1.0 - lv) * 0.55) * mix(0.68, 1.0, lv);
  return mix(outc, mix(outc, pic, a), uReelK.x);
}

// ── live pictures (D158, D162): at rest their cream material, the colour arriving square by square in its
// own way, stirred by the pointer's wake, drifting inside their frames; one edge of each breaks into the
// page, its own side (bottom, top, start, end) ──
const vec3 TILE = vec3(0.07, 0.075, 0.08);
vec3 imgLayer(vec2 px, float t, vec4 fl, vec3 outc) {
  for (int i = 0; i < 8; i++) {
    vec4 K = uImgK[i];
    if (K.x < 0.001) continue;
    vec4 R = uImgR[i];
    vec2 f = (px - R.xy) / R.zw;
    if (f.x < 0.0 || f.x > 1.0 || f.y < 0.0 || f.y > 1.0) continue;
    vec4 O = uImgO[i];
    vec2 off = fl.xy / R.zw;
    vec2 g = clamp((f - 0.5) / O.w + 0.5 + vec2(0.0, O.z) - off, 0.002, 0.998);
    vec3 col = texture2D(uAtlas, uImgU[i].xy + g * uImgU[i].zw).rgb;
    if (fl.z > 0.02) {
      col.r = texture2D(uAtlas, uImgU[i].xy + clamp(g - off * 0.35, 0.002, 0.998) * uImgU[i].zw).r;
      col.b = texture2D(uAtlas, uImgU[i].xy + clamp(g + off * 0.35, 0.002, 0.998) * uImgU[i].zw).b;
      col += min(0.06, fl.z * 0.05);
    }
    float L = dot(col, LUM);
    float rk = rankAt(px);
    float n = cellN(px, t);
    float reach = K.y;
    if (K.z > 0.5 && K.z < 1.5) reach = clamp(K.y * 1.8 - length((f - O.xy) * vec2(R.z / R.w, 1.0)) * 0.8, 0.0, 1.0);
    if (K.z > 1.5) reach = clamp(K.y * 1.5 - (1.0 - f.y) * 0.5, 0.0, 1.0);
    vec3 res = sq16(rk, lamaP(reach, n)) > 0.5 ? col : (sq7(rk, L * 1.3) > 0.5 ? SQ : TILE);
    float y = K.w < 0.5 ? f.y : (K.w < 1.5 ? 1.0 - f.y : (K.w < 2.5 ? f.x : 1.0 - f.x));
    float lv = edgeLv(y, 0.2, 0.2, n);
    float keep = K.w < 1.5 ? sq16(rk, lv) : sq16(15.0 - rk, lv);
    res = keep > 0.5 ? res * mix(0.55, 1.0, lv) : outc;
    return mix(outc, res, K.x);
  }
  return outc;
}

// ── each chapter its own effect on the screen (D165), all in the squares, all quiet at rest ──
// a chapter's band on the screen, soft at its ends
float chBand(vec4 ch, float y, float px1) { return smoothstep(ch.y, ch.y + 80.0 * px1, y) * (1.0 - smoothstep(ch.x - 80.0 * px1, ch.x, y)) * ch.z; }
vec3 chapterFx(vec2 p, float t, float soft, vec3 outc) {
  float px1 = 0.5 * uGrainPx;
  float sq = uGrainPx;
  float rk = rankAt(p);
  float v = abs(uScrollV);
  float dir = uScrollV < 0.0 ? -1.0 : 1.0;
  // why (a fast site, one a bot can read): render lines. While the page moves, thin lines of squares run
  // across behind the words, like a page drawing itself line by line; longer the faster it scrolls, the
  // other way when it scrolls back; nothing at rest
  float b0 = chBand(uCh[0], p.y, px1);
  if (b0 > 0.001 && v > 0.02) {
    float row = floor(p.y / (4.0 * sq));
    float hr = hash(vec2(row, 7.0));
    float L = uRes.x * (0.1 + 0.5 * min(1.0, v * 1.6)) * (0.45 + 0.55 * hash(vec2(row, 11.0)));
    float run = fract(t * (0.3 + 0.5 * hash(vec2(row, 3.0))) + hr) * (uRes.x + L);
    float head = dir > 0.0 ? uRes.x - run : run - L;
    float d = dir > 0.0 ? p.x - head : head + L - p.x;
    float line = step(0.62, hr) * step(0.0, d) * (1.0 - smoothstep(0.0, L, d));
    float thin = step(mod(floor(p.y / sq), 4.0), 1.5);
    outc = mix(outc, CREAM, sq16(rk, line * min(1.0, v * 3.0)) * thin * 0.8 * b0 * mix(0.2, 1.0, soft));
  }
  // process (talk, design, build, launch): an editor's playhead. A dotted line at the inline end with the
  // timeline's ticks moving with the page and a longer mark at each step; the playhead holds the middle
  // of the screen, and where it crosses a step a cut flashes across the screen in squares
  float b1 = chBand(uCh[1], p.y, px1);
  if (b1 > 0.001) {
    float x0 = 7.0 * px1;
    float mid = uRes.y * 0.5;
    float a = 0.0;
    float onLine = step(abs(p.x - x0), sq * 0.5) * step(mod(floor(p.y / sq), 2.0), 0.5);
    a = max(a, onLine * mix(0.3, 0.85, step(mid, p.y)));
    float tk = mod(uCh[1].x - p.y, 24.0 * px1);
    a = max(a, step(tk, sq) * step(x0 - sq * 0.5, p.x) * step(p.x, x0 + 2.5 * sq) * 0.4);
    for (int i = 0; i < 4; i++) a = max(a, step(abs(p.y - uChK[i]), sq * 0.5) * step(x0 - sq * 0.5, p.x) * step(p.x, x0 + 4.5 * sq) * 0.9);
    a = max(a, step(abs(p.y - mid), sq * 0.5) * step(abs(p.x - x0), 4.5 * sq));
    a = max(a, step(abs(p.y - mid), sq * 1.5) * step(abs(p.x - x0), sq * 1.5));
    outc = mix(outc, CREAM, a * b1);
    float cut = exp(-uCh[1].w * 5.0);
    if (cut > 0.01) outc = mix(outc, CREAM, sq7(rk, cut * (1.0 - smoothstep(0.0, 3.0 * sq, abs(p.y - mid)))) * 0.75 * b1 * mix(0.25, 1.0, soft));
  }
  // questions: a tape being tracked. Two thin bands drift down the screen, their rows of squares slipping
  // sideways in the deck's red and teal, stronger while the page moves; almost nothing at rest
  float b2 = chBand(uCh[2], p.y, px1);
  if (b2 > 0.001) {
    float amt = b2 * (0.1 + 0.9 * min(1.0, v * 2.2));
    float tb = 0.0;
    for (int k = 0; k < 2; k++) {
      float fk = float(k);
      float yc = uRes.y * fract(t * (0.05 + 0.04 * fk) + fk * 0.53 - uCh[2].x / uRes.y * 0.5);
      tb = max(tb, 1.0 - smoothstep(0.0, (14.0 + 22.0 * fk) * px1, abs(p.y - yc)));
    }
    if (tb * amt > 0.01) {
      float row = floor(p.y / sq);
      float slip = (hash(vec2(row, floor(t * 16.0))) - 0.5) * 48.0 * px1 * tb;
      float lv = tb * amt * (0.35 + 0.65 * hash(vec2(floor((p.x + slip) / (6.0 * sq)), row)));
      vec3 tint = mod(row, 2.0) < 1.0 ? vec3(0.93, 0.58, 0.52) : vec3(0.52, 0.8, 0.84);
      outc = mix(outc, mix(CREAM, tint, 0.5), sq7(rankAt(p + vec2(slip, 0.0)), lv) * 0.6 * mix(0.25, 1.0, soft));
    }
  }
  return outc;
}

// a drawing's centre sits on a column of dots, so its left and right halves fall on the grid alike and
// every symmetric drawing stays symmetric (D163: the laptop's screen had stepped out at different heights)
vec4 slot(vec4 s) { s.x = (floor(s.x / uCell) + 0.5) * uCell; gCU = uCell / max(s.z, 1.0); gCV = vec2(gCU); return s; }

void main() {
  vec2 px = gl_FragCoord.xy;
  // the finger (D163): under it everything swells a little, like a drop of water on the glass. p0 keeps
  // the straight pixel for the squares of its ring
  vec2 p0 = px;
  float dome = 0.0;
  vec2 domeU = vec2(0.0);
  if (uPress.z > 0.001) {
    vec2 dd = px - uPress.xy;
    float rr = length(dd) / uPress.w;
    dome = uPress.z * exp(-rr * rr * 1.8);
    px = uPress.xy + dd * (1.0 - 0.22 * dome);
    domeU = rr > 0.001 ? dd / (rr * uPress.w) * (3.6 * rr * dome) : vec2(0.0);
  }
  float t = uTime;
  // rewind: rows slip sideways like a deck's tracking
  float row = floor(px.y / uCell);
  float slipH = hash(vec2(row, floor(t * 24.0)));
  float slip = uRew * step(0.8, slipH) * (slipH - 0.8) * 30.0 * uCell;
  px.x += slip;
  vec2 cell = floor(px / uCell);
  vec2 c = (cell + 0.5) * uCell;
  vec2 f = vec2(0.0);
  vec4 s;
  s = slot(uS[0]); if (s.w > 0.001) f += horizon(c, (c - s.xy) / s.z, t) * s.w;
  s = slot(uS[1]); if (s.w > 0.001) f += laptop((c - s.xy) / s.z, t) * s.w;
  s = slot(uS[2]); if (s.w > 0.001) f += reels((c - s.xy) / s.z) * s.w;
  // the letter's bubble (D165): each dot first samples the shape somewhere else, so the bubble is a loose
  // cloud of its own dots that gathers into its shape as the chapter arrives
  s = slot(uS[3]); if (s.w > 0.001) {
    vec2 scat = (vec2(hash(cell + 19.0), hash(cell + 23.0)) - 0.5) * s.z * 2.6 * (1.0 - uCh[3].w) * (1.0 - uCh[3].w);
    f += bubble((c + scat - s.xy) / s.z) * s.w;
  }
  s = slot(uS[4]); if (s.w > 0.001) f += landing((c - s.xy) / s.z, uG.x) * s.w;
  s = slot(uS[5]); if (s.w > 0.001) f += seo((c - s.xy) / s.z, uG.y) * s.w;
  s = slot(uS[6]); if (s.w > 0.001) f += chat((c - s.xy) / s.z, uG.z) * s.w;
  s = slot(uS[7]); if (s.w > 0.001) f += memory((c - s.xy) / s.z, cell, uG.w) * s.w;
  // a quiet field everywhere, like grain on paper; after the opening it spreads out from the mark
  float reach = uAmb * length(uRes) * 1.1;
  float amb = (0.05 + 0.04 * sin(c.x * 0.021 + t * 0.4) * sin(c.y * 0.017 - t * 0.3)) * smoothstep(reach, reach - 160.0, length(c - uC)) * uGrain;
  // the sea of dots (D131) comes back as the ground of two chapters (D165: why, process). It swells in from
  // each edge along a slow wave, as the logo's sea, and its waves drift a little slower than the page
  float dg = 0.0;
  float sea = 0.0;
  for (int i = 0; i < 2; i++) {
    vec4 ch = uCh[i];
    if (ch.z < 0.01) continue;
    float inside = min(ch.x - c.y, c.y - ch.y);
    if (inside <= 0.0) continue;
    float swell = sin(c.x * 0.011 + t * 0.5) * 0.5 + sin(c.x * 0.027 - t * 0.8) * 0.3;
    float cov = clamp(inside / uGE + swell * 0.18 - 0.06, 0.0, 1.0) * ch.z;
    float yy = c.y - ch.x * 0.4;
    float w = 0.075 + 0.05 * sin(c.x * 0.021 + t * 0.4) * sin(yy * 0.017 - t * 0.3) + 0.02 * sin(c.x * 0.006 - yy * 0.009 + t * 0.2);
    sea = max(sea, w * cov);
    dg = max(dg, cov);
  }
  // the words (D139): a safety net under every text block. It dims only what moves (a shape near the
  // words, the music's rings, the ripple); the quiet grain stays even, so no box shows behind a line
  float mask = 1.0;
  float soft = 1.0;
  for (int i = 0; i < 16; i++) {
    if (float(i) >= uNTxt) break;
    vec4 tr = uTxt[i];
    vec2 dq = abs(c - tr.xy) - tr.zw;
    float dist = length(max(dq, 0.0)) + min(max(dq.x, dq.y), 0.0);
    mask = min(mask, smoothstep(-uPad * 0.3, uPad, dist));
    // per pixel: over a picture a cell-sized step would show
    vec2 dp = abs(px - tr.xy) - tr.zw;
    soft = min(soft, smoothstep(-uPad, uPad * 7.0, length(max(dp, 0.0)) + min(max(dp.x, dp.y), 0.0)));
  }
  float give = mix(0.1, 1.0, mask);
  // the big dots (D162, D163): every outline, key and line of text keeps its full dots, so each drawing
  // stays exact; only inside the fills do the dots grow and shrink, in order, under soft diagonal bands of
  // light that drift slowly across the shape (never at random)
  float light = 0.5 + 0.5 * sin(dot(c, vec2(-0.55, 0.83)) / (uCell * 13.0) - t * 0.35);
  float fill = smoothstep(0.1, 0.2, f.x) * (1.0 - smoothstep(0.84, 0.9, f.x));
  f.x *= mix(1.0, 0.68 + 0.32 * light, fill);
  // the music: the shapes and the grain breathe with its level, and each bell sends a ring out
  float v = max(max(f.x * (1.0 + 0.16 * uLvl) * give, amb * (1.0 + 1.1 * uLvl)), sea * (1.0 + 1.1 * uLvl));
  float nd = length(c - uNote.xy);
  v += uGrain * uNote.z * 0.36 * exp(-pow((nd - uNote.w) / (uCell * 4.0), 2.0)) * exp(-nd / (2.4 * uR)) * give;
  // the finger or the pointer ripples the dots like water
  float pd = length(c - uPtr);
  v += uPtrE * max(uRipAll, dg) * 0.55 * exp(-pd / (0.55 * uR)) * (0.5 + 0.5 * sin(pd * 0.075 - t * 7.0)) * mix(0.3, 1.0, mask);
  v += uRew * step(0.93, slipH) * 0.35;
  v = clamp(v, 0.0, 1.0);
  float r = pow(v, 0.62) * uCell * 0.5;
  float a = 1.0 - smoothstep(r - 0.8, r + 0.6, length(px - c));
  a *= step(0.02, v);
  // a chapter's own ground (lab gate: ground): inside its box the ground is solid; along its top and
  // bottom edges it arrives as dots of its colour that grow until they merge, the edge a slow swell
  vec3 ground = BG;
  float onPaper = 0.0;
  for (int i = 0; i < 2; i++) {
    vec4 gb = uGnd[i];
    if (gb.w < 0.5) continue;
    float inside = min(gb.x - c.y, c.y - gb.y);
    if (inside <= 0.0) continue;
    float swell = sin(c.x * 0.011 + t * 0.5) * 0.5 + sin(c.x * 0.027 - t * 0.8) * 0.3;
    float cov = clamp(inside / uGE + swell * 0.16 - 0.08, 0.0, 1.0);
    float gr = cov * uCell * 0.74;
    float ga = cov > 0.995 ? 1.0 : (1.0 - smoothstep(gr - 0.8, gr + 0.6, length(px - c))) * step(0.02, cov);
    vec3 gc = gb.z > 1.5 ? PAPER : DEEP;
    ground = mix(ground, gc, ga);
    onPaper = max(onPaper, ga * step(1.5, gb.z));
  }
  vec3 col = mix(mix(CREAM, BLUE, clamp(f.y, 0.0, 1.0)), mix(INK, INKBLUE, clamp(f.y, 0.0, 1.0)), onPaper);
  vec3 outc = mix(ground, col, a * (0.35 + 0.65 * v) * mix(1.0, 0.8, onPaper));
  // the search engine's mark on the results page (its own colours, only there)
  if (uS[5].w > 0.001) {
    vec4 gm = gmark((c - slot(uS[5]).xy) / uS[5].z, uG.y);
    if (gm.x > 0.01) {
      float gv = gm.x * uS[5].w;
      float grr = pow(gv, 0.62) * uCell * 0.5;
      float gaa = (1.0 - smoothstep(grr - 0.8, grr + 0.6, length(px - c)));
      outc = mix(outc, gm.yzw, gaa * (0.35 + 0.65 * gv));
    }
  }
  // the films (D146, D154): each in its own slot, drawn in the sea's dots from the video's light, the
  // finger's ripple moving it like water; cell by cell it develops into the real film, like a print
  // a ground dims its dots softly under the words
  // the drawings read clearly (D163): a ground's footage stays quiet around them
  float near = 0.0;
  for (int i = 0; i < 8; i++) {
    vec4 sl = uS[i];
    if (sl.w < 0.001) continue;
    near = max(near, sl.w * (1.0 - smoothstep(1.25, 1.9, length(px - sl.xy) / max(sl.z, 1.0))));
  }
  float softV = min(soft, 1.0 - 0.72 * near);
  vec4 fl = flowAt(px);
  if (uReelK.x > 0.001) outc = reelLayer(px, t, soft, fl, outc);
  outc = imgLayer(px, t, fl, outc);
  if (uFilmK[0].x > 0.001) outc = uFilmS[0] > 1.5 ? veilLayer(uFilm0, uFilmR[0], uFilmK[0], uFilmA[0], uFilmV[0], uFilmS[0] - 2.0, px, t, softV, fl, outc) : filmLayer(uFilm0, uFilmR[0], uFilmK[0], uFilmP[0], uFilmA[0], uFilmS[0], c, px, cell, t, outc);
  if (uFilmK[1].x > 0.001) outc = uFilmS[1] > 1.5 ? veilLayer(uFilm1, uFilmR[1], uFilmK[1], uFilmA[1], uFilmV[1], uFilmS[1] - 2.0, px, t, softV, fl, outc) : filmLayer(uFilm1, uFilmR[1], uFilmK[1], uFilmP[1], uFilmA[1], uFilmS[1], c, px, cell, t, outc);
  outc = chapterFx(p0, t, soft, outc);
  // the pointer's trail (D162, Lama's): a ribbon of small cream squares, fuller where the pointer ran
  // fast, thinning behind it in a few tenths of a second; the glyph at most, never solid
  if (uTrail > 0.5 && fl.w > 0.02) outc = mix(outc, CREAM, sq7(rankAt(p0), fl.w * 1.2));
  // the finger's drop (D163, D164): lit on the side that faces the light, shaded on the other, a
  // hairline of light where it meets the glass; as the finger moves, thin ripples spread from its path
  // and fade, like a fingertip drawn across water (no squares on a phone: they were too heavy)
  float px1 = 0.5 * uGrainPx;
  float hl = 0.0;
  if (uPress.z > 0.001) {
    float facing = dot(domeU, vec2(0.6, 0.8));
    outc *= 1.0 + 0.32 * facing;
    outc += vec3(0.05, 0.05, 0.045) * max(0.0, facing) * uPress.z;
    float R0 = uPress.w * (0.78 + 0.22 * uPress.z);
    hl += uPress.z * 0.42 * (1.0 - smoothstep(0.2 * px1, 1.3 * px1, abs(length(p0 - uPress.xy) - R0)));
  }
  for (int i = 0; i < 6; i++) {
    vec4 rp = uRip[i];
    if (rp.w < 0.01) continue;
    float grow = 1.0 - (1.0 - rp.z) * (1.0 - rp.z);
    float rad = uPress.w * (0.55 + 1.25 * grow);
    float a = rp.w * 0.34 * (1.0 - rp.z) * (1.0 - rp.z);
    hl += a * (1.0 - smoothstep(0.15 * px1, 1.1 * px1, abs(length(p0 - rp.xy) - rad)));
  }
  if (hl > 0.001) outc = mix(outc, CREAM, min(hl, 0.6));
  // rewind tint: the deck's red and teal on the slipping rows
  if (uRew > 0.001 && slip > 0.0) outc += uRew * vec3(0.08, -0.02, 0.05) * step(0.5, fract(row * 0.5));
  // the page turn (lab gate: turn): dots of the turn's colour swell out from where the visitor clicked
  // until they cover the page; on the next page they shrink away from the centre outward
  if (uTurn.z > 0.0 || uTurn.w > 0.0) {
    float big = length(uRes);
    float hj = hash(cell + 3.0) * 0.12;
    float kIn = clamp((uTurn.z * 1.3 - length(c - uTurn.xy) / big - hj) / 0.22, 0.0, 1.0);
    float kOut = clamp((uTurn.w * 1.3 - length(c - uRes * 0.5) / big - hj) / 0.22, 0.0, 1.0);
    float tc = kIn * (1.0 - kOut);
    float trr = tc * uCell * 0.74;
    float ta = tc > 0.995 ? 1.0 : (1.0 - smoothstep(trr - 0.8, trr + 0.6, length(px - c))) * step(0.02, tc);
    outc = mix(outc, uTurnC, ta);
  }
  gl_FragColor = vec4(outc, 1.0);
}
`
