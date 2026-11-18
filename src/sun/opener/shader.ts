// sun · the opener's sea (D296). One fragment shader draws a shoreline seen from above: the page is the sand,
// and a wave runs up it and back. Everything is analytic (no feedback buffers), so a frame is one pass:
//   front(x)  the water's edge, lobed like real swash: arcs that bulge up the beach and meet in cusps
//   wet(x)    the highest line the water reached, frozen at its peak; the sand below it is wet and dries
//   text      the sentence lies on the sand as a texture: the water bends it while it is shallow and hides it when deep
// The canvas is transparent where the sand is dry, so the same picture sits on the mint cover first and on the
// live page at the end. Output is premultiplied.
// Compile cost (measured rule from the sea build, 20.10.2026): loops stay tiny and hold no texture taps.

export const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`

export const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uT, uL, uAmp, uSurge, uBack, uK;
uniform vec4 uWet;      // level, amplitude, strength, the moment it froze
uniform vec2 uShow;     // the two lines of the sentence
uniform sampler2D uText;// r: line one, g: line two, b: a soft halo of both
uniform vec4 uWave;     // uv box of the word "Wave" (the logo's teal)
uniform vec4 uMark;     // uv box of the marker under the last word
uniform float uMarkP;
uniform vec3 uDrop[6];  // where a bubble touched down: x, y, when

const vec3 INK = vec3(.075, .141, .122);
const vec3 TEAL = vec3(.059, .518, .471);
const vec3 SUN = vec3(1., .80, .20);

float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1., 0.)), f.x), mix(hash(i + vec2(0., 1.)), hash(i + vec2(1., 1.)), f.x), f.y);
}
// three octaves, written out: the D3D compiler unrolls every loop at every call, and that is where its time goes
float fbm(vec2 p){
  float s = .5 * noise(p); p = p * 2.03 + vec2(17.1, 3.7);
  s += .25 * noise(p); p = p * 2.03 + vec2(17.1, 3.7);
  return (s + .125 * noise(p)) / .875;
}
// foam behind a wave is a web of thin white threads: ridges of noise, bent by a slower noise. 1 on a thread.
float veins(vec2 p){
  p += (vec2(noise(p * .7 + 3.1), noise(p * .7 + 11.7)) - .5) * 1.3;
  float a = 1. - abs(2. * noise(p) - 1.);
  float b = 1. - abs(2. * noise(p * 2.3 + 5.2) - 1.);
  float c = 1. - abs(2. * noise(p * 5.3 + 1.7) - 1.);
  return a * .50 + b * .31 + c * .19;
}
// light through moving water onto the floor (the well-known folded-sine net, five turns)
float net(vec2 uv, float t){
  vec2 p = uv * 6.2831 - 250., i = p; float c = 1.;
  for (int n = 0; n < 4; n++) {
    float tt = t * (1. - 3.5 / float(n + 1));
    i = p + vec2(cos(tt - i.x) + sin(tt + i.y), sin(tt - i.y) + cos(tt + i.x));
    c += 1. / length(vec2(p.x / (sin(i.x + tt) / .005), p.y / (cos(i.y + tt) / .005)));
  }
  c = 1.17 - pow(c / 4., 1.4);
  return pow(abs(c), 8.);
}
// two nets, turned against each other, so the eye finds no grid in it
float caustic(vec2 p, float t){
  float a = net(p, t), b = net(mat2(.80, -.60, .60, .80) * p * 1.31 + 3.7, t * .87 + 2.);
  return min(a, b) * 1.5 + (a + b) * .22;
}
// opener.ts holds the same two lines of maths (the bubbles ride this edge)
float lobes(float x, float t){
  float a = x * uK + t * .07 + 1.7, b = x * uK * 1.73 - t * .05 + 4.2;
  return sqrt(sin(a) * sin(a) + .004) * .62 + sqrt(sin(b) * sin(b) + .004) * .38;
}
float edge(float x, float t, float level, float amp){
  return level + amp * (lobes(x, t) - .64) + .010 * sin(x * uK * .5 + t * .9) + (fbm(vec2(x * 7., t * .3)) - .5) * .022;
}
void over(inout vec3 c, inout float a, vec3 s, float k){ k = clamp(k, 0., 1.); c = c * (1. - k) + s * k; a = a * (1. - k) + k; }

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float asp = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * asp, uv.y);
  float t = uT;

  float d = edge(p.x, t, uL, uAmp) - p.y;           // above zero: under water
  float wd = edge(p.x, uWet.w, uWet.x, uWet.y) - p.y; // above zero: sand the water has touched
  float up = max(-d, 0.);                             // how far up the beach from the water

  vec3 col = vec3(0.); float a = 0.;

  // ---- the wet sand: darker, and glassy close to the water
  float wet = smoothstep(-.004, .022, wd) * uWet.z;
  over(col, a, vec3(.02, .23, .21), wet * (.06 + .10 * exp(-up * 7.)));
  float sheen = wet * exp(-up * 5.5) * (.35 + .65 * fbm(vec2(p.x * 2.6, p.y * 16. + t * .15)));
  over(col, a, vec3(1.), sheen * .17);

  // ---- the sentence. Under shallow water it bends; deeper, it is gone.
  float sub = smoothstep(0., .05, d);
  vec2 bend = (vec2(noise(p * 15. + vec2(0., t * 1.3)), noise(p * 15. + vec2(5.2, -t * 1.1))) - .5) * .016 * sub;
  vec2 tuv = uv + bend * vec2(1. / asp, 1.);
  vec3 tx = texture2D(uText, tuv).rgb;
  float l1 = tx.r * uShow.x, l2 = tx.g * uShow.y;
  float tm = max(l1, l2);
  float seen = exp(-max(d, 0.) * 13.);
  vec2 mc = (tuv - uMark.xy) / (uMark.zw - uMark.xy);
  float wob = (noise(vec2(mc.x * 9., 3.)) - .5) * .16;
  float mk = smoothstep(0., .03, mc.x) * smoothstep(1., .97, mc.x)
           * smoothstep(0., .16, mc.y + wob) * smoothstep(1., .84, mc.y + wob)
           * smoothstep(1. - uMarkP - .04, 1. - uMarkP + .04, mc.x) * step(.001, uMarkP);
  over(col, a, SUN, mk * uShow.y * seen);
  float inWave = step(uWave.x, tuv.x) * step(tuv.x, uWave.z) * step(uWave.y, tuv.y) * step(tuv.y, uWave.w);
  over(col, a, mix(INK, TEAL, inWave * step(l2, l1)), tm * seen);

  // ---- rings where a bubble touched down
  float rip = 0.;
  for (int i = 0; i < 6; i++) {
    vec3 dr = uDrop[i]; float age = t - dr.z, r = length(p - dr.xy);
    rip += step(0., age) * step(age, 1.8) * exp(-max(age, 0.) * 2.4) * (smoothstep(.010, 0., abs(r - (.018 + age * .10))) + .5 * smoothstep(.008, 0., abs(r - (.008 + age * .055))));
  }
  over(col, a, vec3(1.), rip * .55 * (.25 + wet));

  if (d < .004) {
    // ---- what the backwash leaves on the sand: fizz that thins out, a broken line at the high-water mark,
    //      and foam that clings round the letters for a moment
    float vz = veins(vec2(p.x * 21., p.y * 15.) + vec2(0., t * .12));
    float gone = exp(-up / .07);
    float fizz = wet * uBack * gone * smoothstep(1.0 - .62 * gone, 1.12 - .5 * gone, vz + .25 * gone);
    float cling = wet * uBack * exp(-up / .09) * tx.b * (1. - tm) * smoothstep(.35, .7, vz);
    float mark = exp(-abs(wd) / .0032) * uWet.z * uWet.z * smoothstep(.25, .6, noise(vec2(p.x * 70., uWet.w)));
    over(col, a, vec3(1.), fizz * .8 + cling * .75 + mark * .5);
    // the lens of water at the very edge throws a thin shadow ahead of it
    over(col, a, vec3(.02, .16, .15), exp(-up / .006) * .20);
  }

  if (d > -.004) {
    float s = max(d, 0.);
    vec2 q = vec2(p.x, d);
    // ---- the water by depth: a clear sheet, the logo's turquoise, then deep
    vec3 wc = mix(vec3(.82, .97, .93), vec3(.17, .80, .70), smoothstep(0., .13, s));
    wc = mix(wc, vec3(.04, .53, .50), smoothstep(.10, .50, s));
    wc = mix(wc, vec3(.02, .31, .34), smoothstep(.45, 1.15, s));
    float wo = mix(.26, 1., smoothstep(0., .11, s));
    // light on the sea floor: it lies on the sand, so it does not travel with the wave
    vec2 warp = vec2(fbm(p * 3.2 + vec2(0., t * .12)), fbm(p * 3.2 + vec2(7.3, -t * .1))) - .5;
    float cz = caustic(p * 4.6 + warp * .55, t * .5);
    float lit = smoothstep(0., .03, s) * (1. - smoothstep(.14, .75, s));
    wc += vec3(.80, 1., .93) * min(cz, 1.5) * .34 * lit;
    // long swells walking in, far out
    float wv = fbm(vec2(p.x * 1.6, s * 4.) + vec2(t * .04, 0.));
    float sw = sin(s * 19. + t * 1.3 + wv * 6.);
    float band = smoothstep(.16, .40, s) * (1. - smoothstep(.85, 1.2, s));
    wc += pow(max(sw, 0.), 6.) * band * .07;
    wc -= smoothstep(-.2, -1., sw) * band * .03;
    // ---- foam: solid at the edge, lace behind it, long streaks while the wave is running
    //      (the line is never even: it swells and thins along the shore, and at rest it breaks off)
    float along = fbm(vec2(p.x * 4.5, t * .22));
    float w = (.004 + .011 * smoothstep(.3, .75, along)) * (1. - uSurge) + .050 * uSurge * (.6 + .8 * along);
    float e = exp(-s / w);
    float reach = w * 4.6 + .030 * uBack + .034 * uSurge + .005;
    float far = 1. - exp(-s / reach);                       // 0 at the edge, 1 where the foam has thinned to nothing
    // threads stretched along the run of the water; they ride with the edge and boil slowly
    vec2 fq = vec2(q.x * 18., q.y * 9.) + warp * 1.5 + vec2(t * .07, -t * .22);
    float v = veins(fq);
    float thr = mix(.04, .86, far);
    float web = smoothstep(thr, thr + .20, v) * (1. - smoothstep(.80, 1., far));
    float nz = fbm(q * vec2(13., 21.) + vec2(0., -t * .4));
    float solid = smoothstep(.44, .80, e + (nz - .5) * .6);
    float foam = max(solid, web);
    // longer, fainter threads far behind while the wave is running
    float tail = smoothstep(.62, .92, veins(vec2(q.x * 9., q.y * 4.2) + warp + vec2(0., -t * .15))) * exp(-s * 3.6) * (.10 + .90 * uSurge) * smoothstep(.02, .10, s);
    foam = max(foam, tail * .55);
    foam = max(foam, rip * .7);
    // froth has body: it is a shade darker in its hollows, and thin foam lets the water's colour through
    vec3 fc = mix(vec3(.80, .95, .92), vec3(1.), smoothstep(.15, .75, foam)) - vec3(.09, .04, .04) * solid * smoothstep(.62, .25, v);
    wc = mix(wc, fc, foam);
    wo = max(wo, foam) * smoothstep(-.004, .002, d);
    over(col, a, wc, wo);
  }

  gl_FragColor = vec4(col, a);
}
`
