// The ink film · the shaders. One path-traced sample of the scene per pass (a thin lens, an open shutter, a
// softbox sampled as an area light), summed over many passes; then a bloom and the film's finish.
// Loop-free on purpose: on ANGLE/D3D11 the HLSL compiler unrolls loops, and a heavy loop takes minutes to compile.
// Units are millimetres. The paper is the plane y = 0.

export const VERT = `#version 300 es
in vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }`

export const TRACE = `#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;

uniform sampler2D uSum, uPaper, uInk;
uniform vec2 uRes;
uniform int uK;
uniform float uA[14];
uniform uint uFrame;
uniform vec3 uCamPos, uCamX, uCamY, uCamZ, uCamPos1, uCamX1, uCamY1, uCamZ1;
uniform float uTan, uFocus, uFocus1, uAperture;
uniform float uT0, uT1;
uniform vec3 uTip0, uTip1, uAxis0, uAxis1;
uniform vec4 uInkBox;
uniform float uInkMm;
uniform float uTile, uPaperPx;
uniform vec3 uKeyPos, uKeyU, uKeyV, uKeyN, uKeyRad;
uniform float uKeyArea, uKeyD2;
uniform vec3 uKickPos, uKickU, uKickV, uKickN, uKickRad;
uniform vec4 uPool;
out vec4 o;

const float PI = 3.14159265;
const float BALL = __BALL__;
const float GROOVE = 0.03;             // how deep the ball presses the sheet, mm
const vec3 BOUNCE = vec3(0.34, 0.315, 0.28); // the room's own light on the sheet: shadows are never ink black
const vec3 INK = vec3(5.4, 2.45, 1.7); // what a film of the paste takes out of the light: the logo's Prussian blue

// ── numbers ──
uint hashu(uint x) { x ^= x >> 16; x *= 0x7feb352du; x ^= x >> 15; x *= 0x846ca68bu; x ^= x >> 16; return x; }
uint gSeed;
// a low-discrepancy sequence per pixel and per dimension: every dimension has its own irrational step
float sq(int dim) { return fract(float(hashu(gSeed + uint(dim) * 0x9e3779b9u)) * (1.0 / 4294967296.0) + float(uK) * uA[dim]); }
float h21(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1.0, 0.0)), f.x), mix(h21(i + vec2(0.0, 1.0)), h21(i + vec2(1.0, 1.0)), f.x), f.y);
}
float dot2(vec3 v) { return dot(v, v); }

// ── the pen: a ball in a brass socket, a tube, a lacquered nose and barrel ──
struct Hit { float t; vec3 n; int id; };

float iSphere(vec3 ro, vec3 rd, vec3 c, float r) {
  vec3 oc = ro - c; float b = dot(oc, rd); float h = b * b - (dot(oc, oc) - r * r);
  if (h < 0.0) return -1.0;
  return -b - sqrt(h);
}
// a capped cone between pa (radius ra) and pb (radius rb); after Inigo Quilez's intersectors
vec4 iCone(vec3 ro, vec3 rd, vec3 pa, vec3 pb, float ra, float rb) {
  vec3 ba = pb - pa, oa = ro - pa, ob = ro - pb;
  float m0 = dot(ba, ba), m1 = dot(oa, ba), m2 = dot(rd, ba), m3 = dot(rd, oa), m5 = dot(oa, oa), m9 = dot(ob, ba);
  if (m1 < 0.0) {
    if (dot2(oa * m2 - rd * m1) < (ra * ra * m2 * m2)) return vec4(-m1 / m2, -ba * inversesqrt(m0));
  } else if (m9 > 0.0) {
    float t = -m9 / m2;
    if (dot2(ob + rd * t) < (rb * rb)) return vec4(t, ba * inversesqrt(m0));
  }
  float rr = ra - rb, hy = m0 + rr * rr;
  float k2 = m0 * m0 - m2 * m2 * hy;
  float k1 = m0 * m0 * m3 - m1 * m2 * hy + m0 * ra * (rr * m2);
  float k0 = m0 * m0 * m5 - m1 * m1 * hy + m0 * ra * (rr * m1 * 2.0 - m0 * ra);
  float h = k1 * k1 - k2 * k0;
  if (h < 0.0) return vec4(-1.0);
  float t = (-k1 - sqrt(h)) / k2;
  float y = m1 + t * m2;
  if (y < 0.0 || y > m0) return vec4(-1.0);
  return vec4(t, normalize(m0 * (m0 * (oa + t * rd) + rr * ba * ra) - ba * hy * y));
}
Hit penHit(vec3 ro, vec3 rd, vec3 c, vec3 a) {
  Hit h = Hit(1e9, vec3(0.0), 0);
  float ts = iSphere(ro, rd, c, BALL);
  if (ts > 0.0) { h.t = ts; h.n = normalize(ro + rd * ts - c); h.id = 1; }
  vec4 r = iCone(ro, rd, c - a * (BALL * 0.34), c + a * 3.6, BALL * 0.965, 0.98);
  if (r.x > 0.0 && r.x < h.t) { h.t = r.x; h.n = r.yzw; h.id = 2; }
  r = iCone(ro, rd, c + a * 3.6, c + a * 9.5, 1.12, 1.12);
  if (r.x > 0.0 && r.x < h.t) { h.t = r.x; h.n = r.yzw; h.id = 3; }
  r = iCone(ro, rd, c + a * 9.5, c + a * 19.0, 1.75, 3.9);
  if (r.x > 0.0 && r.x < h.t) { h.t = r.x; h.n = r.yzw; h.id = 4; }
  r = iCone(ro, rd, c + a * 19.0, c + a * 125.0, 3.9, 3.9);
  if (r.x > 0.0 && r.x < h.t) { h.t = r.x; h.n = r.yzw; h.id = 5; }
  if (h.id == 0) h.t = -1.0;
  return h;
}

// ── the room: dark, with the key softbox behind and a small cool box in front ──
vec3 boxLight(vec3 ro, vec3 rd, vec3 pos, vec3 U, vec3 V, vec3 N, vec3 rad) {
  float dn = dot(rd, N);
  if (dn > -1e-4) return vec3(0.0);
  float t = dot(pos - ro, N) / dn;
  if (t < 0.0) return vec3(0.0);
  vec3 p = ro + rd * t - pos;
  float u = dot(p, U) / dot(U, U), v = dot(p, V) / dot(V, V);
  return rad * smoothstep(1.0, 0.84, abs(u)) * smoothstep(1.0, 0.84, abs(v));
}
// lamps: what a mirror sees (the room and both softboxes). Without them: the dark room alone
vec3 env(vec3 ro, vec3 rd, bool lamps) {
  vec3 c = mix(vec3(0.005, 0.006, 0.008), vec3(0.022, 0.025, 0.032), smoothstep(-0.1, 0.9, rd.y));
  if (lamps) c += boxLight(ro, rd, uKickPos, uKickU, uKickV, uKickN, uKickRad) + boxLight(ro, rd, uKeyPos, uKeyU, uKeyV, uKeyN, uKeyRad);
  return c;
}

float ggxD(float nh, float a) { float a2 = a * a; float d = nh * nh * (a2 - 1.0) + 1.0; return a2 / (PI * d * d); }
float smithV(float nv, float nl, float a) { float k = a * 0.5; return 0.25 / ((nv * (1.0 - k) + k) * (nl * (1.0 - k) + k)); }

// one pass of the pen over this point: the ink it left and the groove it pressed
void layer(float u, float T, vec2 du, float tm, float hf, vec2 P, inout float tau, inout float wet, inout float cover, inout vec2 gs) {
  if (u > 3.2 || T > tm) return;
  du *= min(1.0, 6.0 / max(length(du), 1e-4));        // a seam in the map must never read as a cliff
  float n = vnoise(P * 26.0) * 0.65 + vnoise(P * 71.0) * 0.35;
  float edge = 1.0 - smoothstep(0.86, 1.02, u + (n - 0.5) * 0.09);
  float q = vnoise(vec2(T * 6.0, 3.7));               // the supply of ink wanders along the line
  float th = mix(0.24, 0.5, q);
  float fm = smoothstep(th - 0.22, th + 0.22, hf);    // the paste sits on the fibres and misses the valleys
  float c = edge * mix(0.7, 1.0, fm);
  float w = exp(-(tm - T) / 1.5);
  // the ball lays the paste in tracks: streaks that run along the line, a little paler down its middle
  float track = vnoise(vec2(u * 4.2, T * 2.6 + 3.1));
  tau += c * (0.82 + 0.6 * fm) * (0.84 + 0.3 * track) * (0.88 + 0.26 * smoothstep(0.15, 0.9, u)) * (1.0 + 0.22 * w);
  cover = max(cover, c);
  wet = max(wet, w * c);
  gs += du * (GROOVE * 2.0 * u / 0.6 * exp(-(u * u) / 0.6));
}

// the sheet at P, seen from V: fibres under a raking light, the ink, the pen's shadow
vec3 paper(vec3 P, vec3 V, float dist, float tm, vec3 c, vec3 a, bool ambientRay, vec2 xl, vec2 xa) {
  float fp = dist * 2.0 * uTan / uRes.y / max(0.18, V.y);
  float lod = max(0.0, log2(fp * uPaperPx / uTile) - 1.4);
  vec4 pt = textureLod(uPaper, P.xz / uTile, lod);
  vec2 slope = (pt.rg - 0.5) * 2.0;
  float hf = pt.b;

  float tau = 0.0, tauA = 0.0, tauB = 0.0, wet = 0.0, cover = 0.0; vec2 gs = vec2(0.0);
  vec2 uvi = (P.xz - uInkBox.xy) * uInkBox.zw;
  if (uvi.x > 0.003 && uvi.y > 0.003 && uvi.x < 0.997 && uvi.y < 0.997) {
    vec4 k = textureLod(uInk, uvi, 0.0);
    if (min(k.x, k.z) < 3.2) {
      vec2 e = uInkMm * uInkBox.zw;
      vec4 kx = textureLod(uInk, uvi + vec2(e.x, 0.0), 0.0) - textureLod(uInk, uvi - vec2(e.x, 0.0), 0.0);
      vec4 kz = textureLod(uInk, uvi + vec2(0.0, e.y), 0.0) - textureLod(uInk, uvi - vec2(0.0, e.y), 0.0);
      float inv = 0.5 / uInkMm;
      layer(k.x, k.y, vec2(kx.x, kz.x) * inv, tm, hf, P.xz, tauA, wet, cover, gs);
      layer(k.z, k.w, vec2(kx.z, kz.z) * inv, tm, hf, P.xz, tauB, wet, cover, gs);
      // where two strokes meet the paste does not double: the heavier one shows, the other deepens it a little
      tau = max(tauA, tauB) + 0.22 * min(tauA, tauB);
    }
  }
  // wet paste levels the fibres under it; the groove tilts the sheet toward the line
  slope = slope * (1.0 - 0.8 * cover * (0.85 + 0.15 * wet)) + gs;
  vec3 N = normalize(vec3(-slope.x, 1.0, -slope.y));

  float form = vnoise(P.xz * 0.31) * 0.6 + vnoise(P.xz * 1.3) * 0.4;   // the sheet's cloudy formation
  // the valleys between the fibres sit in their neighbours' shade
  vec3 alb = vec3(0.91, 0.868, 0.782) * (0.80 + 0.36 * smoothstep(0.15, 0.75, hf)) * (0.95 + 0.10 * form);
  alb *= exp(-tau * INK);

  float pd = length(P.xz - uPool.xy);
  float pool = 0.012 + 0.988 * pow(smoothstep(uPool.w, uPool.z, pd), 1.35);

  vec3 Lp = uKeyPos + uKeyU * (xl.x * 2.0 - 1.0) + uKeyV * (xl.y * 2.0 - 1.0);
  vec3 Lv = Lp - P; float d2 = dot(Lv, Lv); vec3 L = Lv * inversesqrt(d2);
  // the key lights the sheet as a far lamp would: evenly from one end of the logo to the other
  float geo = max(0.0, -dot(L, uKeyN)) * uKeyArea / uKeyD2;
  Hit sh = penHit(P + vec3(0.0, 2e-3, 0.0), L, c, a);
  vec3 E = uKeyRad * geo * pool * (sh.t > 0.0 ? 0.0 : 1.0);

  float nl = dot(N, L), nv = max(0.05, dot(N, V));
  vec3 col = alb * E * max(0.0, (nl + 0.14) / 1.14) / PI;
  if (nl > 0.0) {
    vec3 H = normalize(L + V);
    float inkish = smoothstep(0.0, 0.55, cover);
    float rough = mix(0.5, mix(0.3, 0.13, wet), inkish);
    float F = mix(0.03, 0.04, inkish) + 0.4 * pow(1.0 - max(0.0, dot(V, H)), 5.0);
    vec3 tint = mix(vec3(1.0), vec3(1.0, 0.76, 0.62), 0.42 * inkish);  // ballpoint paste bronzes at the glint
    col += tint * E * F * ggxD(max(0.0, dot(N, H)), rough) * smithV(nv, nl, rough) * nl;
  }

  vec3 amb = BOUNCE;
  if (ambientRay) {
    float r = sqrt(xa.x), ph = 2.0 * PI * xa.y;
    vec3 ad = vec3(r * cos(ph), sqrt(max(0.0, 1.0 - xa.x)), r * sin(ph));
    Hit ah = penHit(P + vec3(0.0, 2e-3, 0.0), ad, c, a);
    amb = ah.t > 0.0 ? vec3(0.05, 0.043, 0.034) : env(P, ad, false) + BOUNCE;
  }
  return col + alb * amb * (0.25 + 0.75 * pool);
}

vec3 shadePen(Hit h, vec3 P, vec3 V, float tm, vec3 c, vec3 a, vec2 xl) {
  vec3 n = h.n;
  float s = dot(P - c, a);
  vec3 tang = normalize(cross(a, n) + vec3(1e-5, 0.0, 0.0));
  vec3 ax = normalize(cross(n, tang));
  // two gaussian numbers for the facet the ray meets
  float g0 = sqrt(-2.0 * log(max(1e-5, sq(10)))), g1 = 2.0 * PI * sq(11);
  vec2 g = g0 * vec2(cos(g1), sin(g1));
  vec3 F0 = vec3(0.05), base = vec3(0.0);
  float at = 0.02, aa = 0.02;
  if (h.id == 1) {
    // tungsten carbide under a smear of paste
    float film = max(smoothstep(0.5, 0.72, vnoise(n.xz * 5.0 + n.y * 3.0 + 2.0)), smoothstep(-BALL * 0.62, -BALL * 0.36, s));
    F0 = mix(vec3(0.56, 0.57, 0.61), vec3(0.06, 0.07, 0.11), film);
    base = vec3(0.012, 0.026, 0.15) * film;
    at = aa = mix(0.045, 0.09, film);
  } else if (h.id == 2 || h.id == 3) {
    // turned brass: the lathe's rings stretch every highlight along the tip
    float ring = sin(s * 105.0 + 2.4 * vnoise(vec2(s * 9.0, 1.3)));
    // two turned grooves, one behind the lip and one before the shoulder
    float g1 = (s - 1.15) / 0.05, g2 = (s - 3.25) / 0.05;
    float cut = 0.8 * (g1 * exp(-g1 * g1) + g2 * exp(-g2 * g2));
    n = normalize(n + ax * (0.035 * ring - (h.id == 2 ? cut : 0.0)));
    float wear = vnoise(P.xy * 2.6 + P.z * 1.7);
    F0 = mix(vec3(0.90, 0.75, 0.45), vec3(0.78, 0.62, 0.38), wear * 0.6);
    // the seam where the ball sits in its socket: paste and shade
    F0 *= mix(0.3, 1.0, smoothstep(-BALL * 0.34, -BALL * 0.34 + 0.16, s));
    at = 0.016; aa = h.id == 2 ? 0.025 : 0.05;
  } else {
    base = vec3(0.008, 0.014, 0.046);   // blue-black lacquer
    at = aa = 0.02;
  }
  vec3 m = normalize(n + tang * g.x * at + ax * g.y * aa);
  vec3 R = reflect(-V, m);
  if (dot(R, h.n) < 0.02) R = normalize(reflect(-V, h.n) + h.n * 0.06);
  vec3 Q = P + h.n * 3e-3;
  Hit h2 = penHit(Q, R, c, a);
  float tp = R.y < -1e-4 ? -Q.y / R.y : -1.0;
  vec3 Lr;
  if (h2.t > 0.0 && (tp < 0.0 || h2.t < tp)) Lr = h2.id == 2 || h2.id == 3 ? vec3(0.10, 0.075, 0.04) : vec3(0.02);
  else if (tp > 0.0) Lr = paper(Q + R * tp, -R, tp + length(P - uCamPos), tm, c, a, false, vec2(sq(12), sq(13)), vec2(0.5));
  else Lr = env(Q, R, true);
  vec3 F = F0 + (1.0 - F0) * pow(1.0 - max(0.0, dot(V, m)), 5.0);
  vec3 col = F * Lr;
  if (base.b > 0.0) {
    vec3 Lp = uKeyPos + uKeyU * (xl.x * 2.0 - 1.0) + uKeyV * (xl.y * 2.0 - 1.0);
    vec3 Lv = Lp - P; float d2 = dot(Lv, Lv); vec3 L = Lv * inversesqrt(d2);
    vec3 E = uKeyRad * max(0.0, -dot(L, uKeyN)) * uKeyArea / uKeyD2;
    col += base * (E * max(0.0, dot(h.n, L)) / PI + vec3(0.03));
  }
  return col;
}

void main() {
  gSeed = hashu(uint(gl_FragCoord.x) * 1973u + uint(gl_FragCoord.y) * 9277u + uFrame * 26699u) | 1u;
  // a tent filter a pixel and a half wide
  vec2 j = vec2(sq(0), sq(1)) * 2.0 - 1.0;
  j = sign(j) * (1.0 - sqrt(1.0 - abs(j)));
  vec2 ndc = ((gl_FragCoord.xy + j * 0.75) / uRes) * 2.0 - 1.0;
  ndc.x *= uRes.x / uRes.y;
  // the shutter is open for half the frame: the pen, the ink and the camera all move through it
  float ft = sq(4);
  vec3 camPos = mix(uCamPos, uCamPos1, ft);
  vec3 camX = normalize(mix(uCamX, uCamX1, ft)), camY = normalize(mix(uCamY, uCamY1, ft)), camZ = normalize(mix(uCamZ, uCamZ1, ft));
  vec3 dir = normalize(camZ + (camX * ndc.x + camY * ndc.y) * uTan);
  vec3 focusP = camPos + dir * (mix(uFocus, uFocus1, ft) / dot(dir, camZ));
  float lr = sqrt(sq(2)), la = 2.0 * PI * sq(3);
  vec3 ro = camPos + (camX * cos(la) + camY * sin(la)) * lr * uAperture;
  vec3 rd = normalize(focusP - ro);

  float tm = mix(uT0, uT1, ft);
  vec3 c = mix(uTip0, uTip1, ft);
  vec3 a = normalize(mix(uAxis0, uAxis1, ft));
  vec2 xl = vec2(sq(5), sq(6));

  vec3 col;
  Hit hp = penHit(ro, rd, c, a);
  float tp = rd.y < -1e-5 ? -ro.y / rd.y : -1.0;
  if (hp.t > 0.0 && (tp < 0.0 || hp.t < tp)) col = shadePen(hp, ro + rd * hp.t, -rd, tm, c, a, xl);
  else if (tp > 0.0) col = paper(ro + rd * tp, -rd, tp, tm, c, a, true, xl, vec2(sq(7), sq(8)));
  else col = env(ro, rd, true);
  o = texelFetch(uSum, ivec2(gl_FragCoord.xy), 0) + vec4(min(col, vec3(40.0)), 1.0);
}`

// what burns: a quarter of the pixels, only the light above paper white
export const BRIGHT = `#version 300 es
precision highp float;
uniform sampler2D uSum;
uniform vec2 uRes;
uniform float uN, uExposure;
out vec4 o;
void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 px = 0.5 / uRes;
  vec3 c = (texture(uSum, uv + px * vec2(-1.0, -1.0)).rgb + texture(uSum, uv + px * vec2(1.0, -1.0)).rgb + texture(uSum, uv + px * vec2(-1.0, 1.0)).rgb + texture(uSum, uv + px * vec2(1.0, 1.0)).rgb) * (0.25 / uN) * uExposure;
  float m = max(c.r, max(c.g, c.b));
  o = vec4(min(c, vec3(12.0)) * smoothstep(1.05, 2.6, m), 1.0);
}`

export const BLUR = `#version 300 es
precision highp float;
uniform sampler2D uTex;
uniform vec2 uRes, uStep;
out vec4 o;
void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec3 c = texture(uTex, uv).rgb * 0.2270270270;
  c += (texture(uTex, uv + uStep * 1.3846153846).rgb + texture(uTex, uv - uStep * 1.3846153846).rgb) * 0.3162162162;
  c += (texture(uTex, uv + uStep * 3.2307692308).rgb + texture(uTex, uv - uStep * 3.2307692308).rgb) * 0.0702702703;
  o = vec4(c, 1.0);
}`

// the finish: bloom, exposure, a filmic curve, a soft vignette, the page's own ground as the black, grain
export const FINISH = `#version 300 es
precision highp float;
uniform sampler2D uSum, uBloomA, uBloomB;
uniform vec2 uRes;
uniform float uN, uExposure, uGrain;
uniform uint uFrame;
uniform vec3 uGround;
out vec4 o;
uint hashu(uint x) { x ^= x >> 16; x *= 0x7feb352du; x ^= x >> 15; x *= 0x846ca68bu; x ^= x >> 16; return x; }
float rnd(uint s) { return float(hashu(s)) * (1.0 / 4294967296.0); }
vec3 film(vec3 x) { return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0); }
vec3 oetf(vec3 c) { return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c)); }
void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec3 c = texture(uSum, uv).rgb / uN * uExposure;
  c += texture(uBloomA, uv).rgb * 0.10 + texture(uBloomB, uv).rgb * 0.09;
  float r = length(uv - 0.5) * 1.3;
  c *= mix(1.0, 0.34, smoothstep(0.25, 1.0, r));
  c = oetf(film(c));
  c = uGround + c * (1.0 - uGround);
  uint s = uint(gl_FragCoord.x) * 7919u + uint(gl_FragCoord.y) * 104729u + uFrame * 15485863u;
  float g = (rnd(s) + rnd(s + 1u) + rnd(s + 2u) + rnd(s + 3u) - 2.0) * 0.5;   // near gaussian
  float lum = dot(c, vec3(0.299, 0.587, 0.114));
  c += g * uGrain * (0.35 + 0.65 * smoothstep(0.0, 0.5, lum)) * (1.0 - 0.5 * lum);
  c += (rnd(s + 9u) - 0.5) / 255.0;
  o = vec4(c, 1.0);
}`
