# MediaWave logo: "Horizon" (chosen 2026-10-13, palette "Klein" chosen the same day)

A disc split by a wave into two tones, the MediaWave wordmark with a drop on the i, and the tagline "Web Development". This folder is the source of truth: every file here is final, vector, and drawn once. Copy the files; never redraw, retype or trace them.

## Files

| File | Use |
|---|---|
| `mediawave-horizontal-dark.svg` | main logo on dark backgrounds (wordmark + tagline beside the disc) |
| `mediawave-horizontal-light.svg` | main logo on light backgrounds |
| `mediawave-compact-dark.svg` / `-light.svg` | one line, no tagline: headers, small spaces |
| `mediawave-stacked-dark.svg` / `-light.svg` | disc above the name: square spaces, social profile, OG images |
| `mediawave-mark-dark.svg` / `-light.svg` | the disc alone: avatars, watermarks, very small spaces |
| `*-black.svg` / `*-white.svg` | one colour: print, engraving, on photos or video |
| `mediawave-app-icon-dark.svg` / `-light.svg` | app tile (the disc on a square ground) |
| `favicon.svg`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`, `icon-512.png` | browser and home-screen icons (`favicon.svg` follows the system light or dark mode) |

"dark" = for dark backgrounds, "light" = for light backgrounds.

## Colours

Each SVG paints its parts with four classes: `.a` (Media and the upper half of the disc), `.b` (Wave, the drop on the i and the lower half), `.t` (the tagline), `.l` (the tagline's thin rules).

| Palette | `.a` | `.b` | `.t` / `.l` | Background it is made for |
|---|---|---|---|---|
| dark | `#FFFFFF` | `#6E8CFF` | `#8E9CC8` (rules at 55 % opacity) | Klein night `#00113D`, or black |
| light | `#0E1016` | `#002FA7` (International Klein Blue) | `#4E5468` (rules at 55 % opacity) | paper `#FAFAF7`, or white |
| black / white | one colour for everything | | | print, photos |

The brand's one colour is International Klein Blue `#002FA7`: buttons and accents on light grounds. On dark grounds buttons are white with Klein-blue text. The palette lives in `scripts/brand-palette.mjs`, which rewrites these files and re-renders the PNG icons from vector.

## Rules

- Never change the geometry, the proportions, or the space between the disc and the name.
- Never swap the two tones of the disc: the upper half is always `.a` (white on dark, ink on light), the lower half `.b` (the blue), exactly as in the files.
- No shadow, outline, frame, gradient, glow or 3D effect.
- Clear space: at least half the disc's diameter empty on every side.
- Minimum sizes: horizontal 160 px wide, compact 90 px wide. The mark alone goes down to 16 px only as a favicon.
- Size it by height in CSS and let the width follow the viewBox (`height: 32px; width: auto`).
- On a busy photo or video use the white or black one-colour version.

## Using it

**Any website or document:** copy the SVG you need and use it as an image:

```html
<img src="/logo/mediawave-horizontal-dark.svg" alt="MediaWave" height="40">
```

**Inline SVG, coloured from CSS** (for a site with light and dark sections): paste the SVG's paths and replace the four class colours with variables, for example `fill: var(--logo-a, currentColor)` for `.a`, `var(--logo-b)` for `.b`, `var(--logo-tag)` for `.t` and `.l`. The MediaWave site does exactly this.

**React / Next.js:** the site's component is a ready reference, in the same repository (branch `design/pattern-break-20261012`):
- `src/components/ui/Logo.tsx`: `<Logo variant="horizontal | compact | stacked | mark" />`, inline SVG, colours from `--logo-a`, `--logo-b`, `--logo-tag`
- `src/components/ui/logo-paths.ts`: the path data, generated from this folder by `scripts/build-logo-paths.mjs` (copied verbatim, never redrawn)
- `src/components/ui/logo-motion.ts` + `AnimatedLogo.tsx`: the animated ident (a drop falls into the disc, the horizon settles like liquid, the name rises, a droplet lands on the i). Needs GSAP 3.

**Favicons:** copy the five icon files to the site root and link them:

```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
```

**PNG for tools that do not take SVG** (Canva, Word, social uploads): export from the SVG at 2x or 3x the size you need (Inkscape, Figma, or any browser screenshot of the SVG on a matching background); keep the clear space.
