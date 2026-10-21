// Flight's shaders. The sky (lilac day, pink dusk, navy night with stars, a fire dawn; the sun and its
// rainbow halo) and the glass wing (feathers in a fan whose leading edge is the Horizon wave, flapping
// with a lag along the span and along each feather; folded, the feathers become one upright blade).
// Storytelling's DNA, read from its bundle and frames (design/styles/storytelling/harvest.rtl.md).

export const SKY_VERT = /* glsl */ `
void main() { gl_Position = vec4(position.xy, 0.9999, 1.0); }
`

export const SKY_FRAG = /* glsl */ `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uSun;
uniform vec4 uMix;
uniform float uHalo;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = (gl_FragCoord.xy - uSun * uRes) / uRes.y;
  float r = length(p);
  vec3 day = mix(vec3(0.80, 0.75, 0.95), vec3(0.89, 0.86, 0.98), uv.y);
  day = mix(day, vec3(0.80, 0.87, 0.97), smoothstep(0.55, 0.0, uv.y) * 0.55);
  day = mix(day, vec3(0.93, 0.80, 0.90), exp(-pow(length((uv - vec2(0.15, 0.2)) * vec2(1.4, 1.0)), 2.0) * 5.0) * 0.45);
  vec3 dusk = mix(vec3(0.97, 0.80, 0.86), vec3(0.85, 0.78, 0.96), uv.y);
  dusk = mix(dusk, vec3(1.0, 0.86, 0.74), smoothstep(0.45, 0.0, uv.y) * 0.5);
  vec3 night = mix(vec3(0.0, 0.016, 0.075), vec3(0.016, 0.03, 0.09), uv.y);
  vec2 c = (gl_FragCoord.xy - vec2(0.5, 0.52) * uRes) / uRes.y;
  night += vec3(0.16, 0.17, 0.66) * exp(-dot(c, c) * 9.0) * 0.55;
  vec3 dawn = mix(vec3(0.70, 0.30, 0.10), vec3(0.11, 0.02, 0.015), smoothstep(0.05, 0.85, uv.y));
  dawn += vec3(1.0, 0.55, 0.15) * exp(-pow(uv.y - 0.12, 2.0) * 60.0) * 0.35;
  vec3 col = day * uMix.x + dusk * uMix.y + night * uMix.z + dawn * uMix.w;

  float lit = 1.0 - uMix.z * 0.9;
  vec3 sunCol = mix(vec3(1.0, 0.99, 0.97), vec3(1.0, 0.78, 0.35), uMix.w);
  float disc = smoothstep(0.05, 0.042, r);
  float glow = exp(-r * 16.0) * 0.55 + exp(-r * 4.2) * 0.13;
  col = mix(col, sunCol, disc * lit);
  col += sunCol * glow * lit;

  float d = r - 0.34;
  vec3 spec = 0.5 + 0.5 * cos(6.28318 * (d * 7.0 + vec3(0.0, 0.33, 0.67)));
  float ring = exp(-d * d * 520.0);
  col += (spec * 0.55 + 0.25) * ring * 0.20 * uHalo * lit;
  col += vec3(1.0) * exp(-d * d * 60.0) * 0.05 * uHalo * lit;

  vec2 g = floor(gl_FragCoord.xy / 2.0);
  float h = hash(g);
  float star = step(0.9982, h) * (0.55 + 0.45 * sin(uTime * (1.0 + h * 3.0) + h * 80.0));
  col += vec3(0.75, 0.82, 1.0) * star * uMix.z;

  col += (hash(gl_FragCoord.xy + fract(uTime) * 61.0) - 0.5) / 160.0;
  gl_FragColor = vec4(col, 1.0);
}
`

export const WING_VERT = /* glsl */ `
uniform float uFlap;
uniform float uAmp;
uniform float uBias;
uniform float uFold;
uniform float uSpread;
attribute float aU;
attribute float aT;
attribute float aS;
attribute float aF;
attribute float aL;
attribute float aW;
attribute float aLayer;
varying float vT;
varying float vS;
varying float vU;
varying float vF;
varying vec3 vWorld;

void main() {
  float u = aU;
  float t = aT;
  float ang = mix(0.06, 1.38, pow(u, 0.75)) + (aF - 0.5) * 0.10 - aLayer * 0.07;
  ang = mix(ang, ang * 0.55, 1.0 - uSpread);
  // the fan opens in a plane that leans back and down from the arm, so it faces a camera in front
  vec3 X = vec3(1.0, 0.0, 0.0);
  vec3 B = normalize(vec3(0.0, -0.78, -0.62));
  vec3 Nn = normalize(cross(X, B));
  vec3 dir = sin(ang) * X + cos(ang) * B;
  vec3 side = cos(ang) * X - sin(ang) * B;
  float hw = aW * (1.0 - pow(t, 2.3)) * smoothstep(-0.04, 0.12, t);
  hw *= aS > 0.0 ? 0.62 : 1.0;
  vec3 root = vec3(1.5 * u * uSpread + 0.2 * u, 0.12 * sin(u * 3.1416), 0.10 * sin(u * 3.1416));
  vec3 p = root + dir * (aL * t) + side * (hw * aS);
  // feathers curl out of the plane, the coverts sit over the flight feathers
  p += Nn * (0.16 * aL * t * t + aLayer * 0.05 + (aF - 0.5) * 0.04);
  // the leading edge rides the Horizon wave
  p.y += 0.26 * sin(u * 4.6 + 0.5) * u;

  float ph = uFlap - u * 1.45 - t * 0.75;
  float a = (uAmp * sin(ph) + uBias) * (0.35 + 0.65 * u);
  float c = cos(a);
  float s = sin(a);
  p = vec3(c * p.x - s * p.y, s * p.x + c * p.y, p.z);
  p.z += uAmp * 0.18 * sin(ph + 1.2) * u;

  vec3 blade = vec3(aS * hw * 0.5 + (u - 0.5) * 0.06, t * aL * 0.95 + u * 0.7 - 0.9, (aF - 0.5) * 0.08 + aLayer * 0.025);
  p = mix(p, blade, uFold);

  vec4 w = modelMatrix * vec4(p, 1.0);
  vWorld = w.xyz;
  vT = t;
  vS = aS;
  vU = u;
  vF = aF;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`

export const WING_FRAG = /* glsl */ `
precision highp float;
uniform vec3 uRoot;
uniform vec3 uTip;
uniform float uGlow;
uniform float uHue;
uniform float uOpacity;
varying float vT;
varying float vS;
varying float vU;
varying float vF;
varying vec3 vWorld;

void main() {
  vec3 N = normalize(cross(dFdx(vWorld), dFdy(vWorld)));
  vec3 V = normalize(cameraPosition - vWorld);
  float ndv = abs(dot(N, V));
  float fres = pow(1.0 - ndv, 2.0);
  float barbs = 0.5 + 0.5 * sin(vT * 64.0 + abs(vS) * 7.0 + vF * 31.0);
  float rachis = exp(-abs(vS) * 22.0) * (1.0 - vT * 0.7);
  float edge = smoothstep(0.72, 1.0, abs(vS));
  float hue = (vF - 0.5) * 0.35;
  vec3 film = 0.5 + 0.5 * cos(6.28318 * (vec3(0.0, 0.33, 0.67) + ndv * 1.1 + vT * 0.45 + vU * 0.3 + uHue + hue));
  float k = smoothstep(0.3, 1.05, vT * 0.62 + vU * 0.48 + (vF - 0.5) * 0.35);
  vec3 base = mix(uRoot, uTip, k);
  // clear glass near the shaft and the root, colour toward the vane's edge and the tip
  float clear = (0.2 + 0.4 * (1.0 - abs(vS))) * (1.0 - vT * 0.6);
  vec3 col = mix(mix(base, film, 0.34), vec3(0.97, 0.97, 1.0), clear * 0.55);
  col += mix(vec3(1.0), film, 0.45) * (fres * 0.5 + edge * 0.32) + vec3(1.0) * rachis * 0.55;
  float a = 0.13 + 0.36 * fres + 0.24 * edge + 0.36 * rachis + k * 0.06;
  a *= 0.8 + 0.2 * barbs;
  a *= smoothstep(1.0, 0.88, vT);
  col += base * uGlow * (0.6 + fres);
  a = clamp(a * uOpacity * (1.0 + uGlow * 0.6), 0.0, 1.0);
  gl_FragColor = vec4(col * a, a);
}
`

export const DUST_VERT = /* glsl */ `
uniform float uTime;
uniform float uSize;
attribute float aSeed;
varying float vA;
void main() {
  vec3 p = position;
  p.y += mod(uTime * (0.08 + aSeed * 0.12) + aSeed * 10.0, 8.0) - 4.0;
  p.x += sin(uTime * 0.4 + aSeed * 20.0) * 0.3;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * (0.4 + aSeed) / -mv.z;
  vA = 0.35 + 0.65 * fract(aSeed * 7.13);
}
`

export const DUST_FRAG = /* glsl */ `
precision highp float;
uniform vec3 uCol;
uniform float uOpacity;
varying float vA;
void main() {
  vec2 q = gl_PointCoord - 0.5;
  float d = length(q);
  float a = smoothstep(0.5, 0.0, d) * vA * uOpacity;
  gl_FragColor = vec4(uCol * a, a);
}
`
