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
uniform vec4 uNote;     // the last bell: x, y (device px), energy, the ring's radius now

const vec3 BG = vec3(0.059, 0.063, 0.067);
const vec3 CREAM = vec3(0.929, 0.906, 0.855);
const vec3 BLUE = vec3(0.475, 0.627, 0.773);

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float h1(float n) { return fract(sin(n * 91.345) * 47453.5453); }
float box(vec2 p, vec2 b, float r) { vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
float inside(float d) { return 1.0 - step(0.0, d); }
float rim(float d, float w) { return 1.0 - smoothstep(0.0, w, abs(d)); }
float bar(vec2 q, vec2 c, vec2 h) { return step(abs(q.x - c.x), h.x) * step(abs(q.y - c.y), h.y); }
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
  float onRow = step(abs(s.y - ry), 0.07) * step(x0, s.x) * step(s.x, x0 + len * 1.45);
  float kw = step(s.x, x0 + 0.24) * step(0.4, h1(r + 5.0));
  float code = onRow * mix(0.62, 0.9, kw);
  // the site replaces the code from the top down, then scrolls up with the reader
  float wipe = step((1.0 - s.y) * 0.5, build * 1.15);
  vec2 p = vec2(s.x, s.y - scroll * 1.7);
  float site = 0.0;
  float sb = 0.0;
  float logo = 1.0 - step(0.08, length(p - vec2(0.8, 0.86)));
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
    site = max(site, max(rim(box(cc, vec2(0.25, 0.25), 0.04), 0.05) * 0.62, bar(cc, vec2(0.0, 0.08), vec2(0.15, 0.045)) * 0.42));
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
  float lhw = mix(HW, e.y, lv);
  float ls = q.x / lhw;
  float inLid = step(0.0, lv) * step(lv, 1.0) * step(abs(ls), 1.0);
  if (inLid > 0.5) {
    float lidRim = max(max(step(lv, 0.035), step(0.965, lv)), step(0.965, abs(ls)));
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
      vec2 pg = screenPage(s, t);
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
  float sb = box(q - vec2(0.0, 0.72), vec2(1.12, 0.13), 0.13);
  float v = rim(sb, 0.03) * 0.9;
  v = max(v, rim(length(q - vec2(0.92, 0.72)) - 0.055, 0.022) * 0.95);
  v = max(v, barR(q, vec2(0.48, 0.72), vec2(0.3, 0.02), 1.0) * 0.55);
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

// ── a chatbot: the question, the bot typing, the answer ──
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
  float dots = 0.0;
  for (int k = 0; k < 3; k++) {
    float fk = float(k);
    float bob = 0.05 * max(0.0, sin(g * 70.0 - fk * 0.9));
    dots = max(dots, 1.0 - step(0.075, length(c2 - vec2(0.2 - fk * 0.2, bob))));
  }
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
  return vec2(v, b);
}

// ── a memory: a print that develops like a cyanotype ──
vec2 memory(vec2 q, vec2 cell, float g) {
  float an = -0.07;
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

void main() {
  vec2 px = gl_FragCoord.xy;
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
  s = uS[0]; if (s.w > 0.001) f += horizon(c, (c - s.xy) / s.z, t) * s.w;
  s = uS[1]; if (s.w > 0.001) f += laptop((c - s.xy) / s.z, t) * s.w;
  s = uS[2]; if (s.w > 0.001) f += reels((c - s.xy) / s.z) * s.w;
  s = uS[3]; if (s.w > 0.001) f += bubble((c - s.xy) / s.z) * s.w;
  s = uS[4]; if (s.w > 0.001) f += landing((c - s.xy) / s.z, uG.x) * s.w;
  s = uS[5]; if (s.w > 0.001) f += seo((c - s.xy) / s.z, uG.y) * s.w;
  s = uS[6]; if (s.w > 0.001) f += chat((c - s.xy) / s.z, uG.z) * s.w;
  s = uS[7]; if (s.w > 0.001) f += memory((c - s.xy) / s.z, cell, uG.w) * s.w;
  // a quiet field everywhere, like grain on paper; after the opening it spreads out from the mark
  float reach = uAmb * length(uRes) * 1.1;
  float amb = (0.05 + 0.04 * sin(c.x * 0.021 + t * 0.4) * sin(c.y * 0.017 - t * 0.3)) * smoothstep(reach, reach - 160.0, length(c - uC));
  // the words (D139): a safety net under every text block. It dims only what moves (a shape near the
  // words, the music's rings, the ripple); the quiet grain stays even, so no box shows behind a line
  float mask = 1.0;
  for (int i = 0; i < 16; i++) {
    if (float(i) >= uNTxt) break;
    vec4 tr = uTxt[i];
    vec2 dq = abs(c - tr.xy) - tr.zw;
    float dist = length(max(dq, 0.0)) + min(max(dq.x, dq.y), 0.0);
    mask = min(mask, smoothstep(-uPad * 0.3, uPad, dist));
  }
  float give = mix(0.1, 1.0, mask);
  // the music: the shapes and the grain breathe with its level, and each bell sends a ring out
  float v = max(f.x * (1.0 + 0.16 * uLvl) * give, amb * (1.0 + 1.1 * uLvl));
  float nd = length(c - uNote.xy);
  v += uNote.z * 0.36 * exp(-pow((nd - uNote.w) / (uCell * 4.0), 2.0)) * exp(-nd / (2.4 * uR)) * give;
  // the finger or the pointer ripples the dots like water
  float pd = length(c - uPtr);
  v += uPtrE * 0.55 * exp(-pd / (0.55 * uR)) * (0.5 + 0.5 * sin(pd * 0.075 - t * 7.0)) * mix(0.3, 1.0, mask);
  v += uRew * step(0.93, slipH) * 0.35;
  v = clamp(v, 0.0, 1.0);
  float r = pow(v, 0.62) * uCell * 0.5;
  float a = 1.0 - smoothstep(r - 0.8, r + 0.6, length(px - c));
  a *= step(0.02, v);
  vec3 col = mix(CREAM, BLUE, clamp(f.y, 0.0, 1.0));
  vec3 outc = mix(BG, col, a * (0.35 + 0.65 * v));
  // rewind tint: the deck's red and teal on the slipping rows
  if (uRew > 0.001 && slip > 0.0) outc += uRew * vec3(0.08, -0.02, 0.05) * step(0.5, fract(row * 0.5));
  gl_FragColor = vec4(outc, 1.0);
}
`
