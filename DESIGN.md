---
name: MediaWave Israel
description: Hebrew RTL portfolio-site for a web/media studio - cool sky palette, living waves, kinetic type
colors:
  sky-pastel: "#7DD3FC"
  sky-soft: "#BAE6FD"
  sky-deep: "#38BDF8"
  sky-ink: "#0369A1"
  sky-ink-strong: "#075985"
  cyan-tint: "#67E8F9"
  cyan-soft: "#A5F3FC"
  teal-tint: "#99F6E4"
  teal-soft: "#CCFBF1"
  teal-deep: "#5EEAD4"
  frost: "#F8FAFC"
  frost-dark: "#F1F5F9"
  frost-line: "#E2E8F0"
  ink: "#4A4A4A"
  ink-strong: "#2A2A2A"
  ink-soft: "#6A6A6A"
  navy-surface: "#1E293B"
  navy-surface-high: "#334155"
  cta-text-on-sky: "#1E3A5F"
typography:
  display:
    fontFamily: "Outfit, EFT Betaamango, Heebo, sans-serif"
    fontSize: "clamp(2.5rem, 5vw, 4rem)"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "normal"
  headline:
    fontFamily: "Outfit, EFT Betaamango, Heebo, sans-serif"
    fontSize: "clamp(1.75rem, 3vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "Outfit, EFT OffSet, Heebo, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "ui-monospace, Cascadia Mono, Consolas, Courier New, Heebo, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    fontVariation: "tabular-nums"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  pill: "50px"
spacing:
  xs: "0.5rem"
  sm: "1rem"
  md: "2rem"
  lg: "4rem"
  section: "clamp(4rem, 10vh, 8rem)"
components:
  button-primary:
    backgroundColor: "{colors.sky-pastel}"
    textColor: "{colors.cta-text-on-sky}"
    rounded: "{rounded.pill}"
    padding: "16px 40px"
  button-primary-hover:
    backgroundColor: "{colors.sky-deep}"
  button-secondary:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.ink-strong}"
    rounded: "{rounded.pill}"
    padding: "16px 40px"
  card:
    backgroundColor: "#FFFFFF"
    rounded: "{rounded.xl}"
    padding: "clamp(1.5rem, 3vw, 2.5rem)"
  nav-link:
    textColor: "{colors.sky-pastel}"
    padding: "8px 0"
  chip-selected:
    backgroundColor: "{colors.ink-strong}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
---

# Design System: MediaWave Israel

## 1. Overview

**Creative North Star: "מעבדת הגלים" (The Wave Lab)**

A cool, coastal-light Hebrew RTL interface where water is the organizing
metaphor: living wave dividers flow between sections, the hero headline
draws a swaying wave underline, the header CTA fills with a rising tide on
hover. The system is precise (spec-mono numbers, one signature easing) yet
alive (ambient loops that never freeze). It is the portfolio of a web
studio, so craft IS the message: fast, readable, honest.

This system explicitly rejects: the site's own historical warm-watercolor
palette (never restore it), royal-blue corporate flatness, uniform
fade-in-on-scroll AI grammar, glassmorphism-by-default, magnetic hovers,
static underlines across UI, and any invented social proof.

**Key Characteristics:**
- Hebrew-first RTL; animations enter from the right; words never letter-split
- One accent family (sky), one easing (EASE_BRAND), one wave motif
- Frost-white surfaces with rare, deliberate navy statement sections
- Ambient motion always alive; accessibility switch is the only full stop
- AA contrast is a build gate, not an aspiration

## 2. Colors

A single sky-blue accent family over cool frost neutrals, with deep navy
reserved for statement *surfaces* - never as an accent color.

### Primary
- **Sky Pastel** (#7DD3FC): THE brand accent - fills, buttons, icons, marks,
  and text on *dark* surfaces only. At 1.6:1 on white it is banned as text
  on light surfaces.
- **Sky Deep** (#38BDF8): hover/active state of the accent; keyword marks.
- **Sky Ink** (#0369A1) / **Sky Ink Strong** (#075985): the *readable* end
  of the same family - all links and accent-colored text on light surfaces
  (5.9:1 on white). Hover shifts ink -> ink-strong.

### Secondary
- **Cyan Tint** (#67E8F9) / **Teal Tint** (#99F6E4) and their soft/deep
  steps: supporting tints for icon chips, gradient bar accents, decorative
  blobs. Cousins of the accent, never competitors.

### Neutral
- **Frost** (#F8FAFC): body background (cool slate-white - NOT warm cream,
  despite the legacy token name `--color-cream`).
- **Frost Dark** (#F1F5F9) / **Frost Line** (#E2E8F0): raised strips, panel
  fills, borders and dividers.
- **Ink** (#4A4A4A): body text. **Ink Strong** (#2A2A2A): headings, dark
  chips, scrolled header surface. **Ink Soft** (#6A6A6A): captions and
  secondary text (small sizes only where AA still passes).
- **Navy Surface** (#1E293B, high #334155): the dark statement sections
  (before/after showcase, chat header) and grain-textured footers.
- **Frost Mist** (rgba(248,250,252,0.60-0.70)): secondary text and links on
  dark surfaces (footer). Never flat gray (#9A9A9A-style) on a colored dark
  surface - it reads washed out; mist is the frost neutral at alpha.

### Named Rules
**The Sky-Ink Rule.** Pastel sky (#7DD3FC) is a fill color. The moment it
becomes text on a light surface it is a contrast bug; use sky-ink instead.
Enforced by an axe-core gate (0 violations across 7 pages + widget states).

**The Legacy-Name Rule.** CSS variable NAMES (`--color-orange`,
`--color-cream`, `--color-brown`) are legacy slots; their VALUES are the
current sky/frost/ink palette. Never "fix" a name back to its warm value.

**The One-Accent Rule.** Sky is the only accent. Navy (#1E293B) may carry a
section as a surface; it may never appear as an accent, border-accent or
link color.

## 3. Typography

**Display Font:** Outfit (Latin) with EFT Betaamango (Hebrew), Heebo fallback
**Body Font:** Outfit (Latin) with EFT OffSet (Hebrew), Heebo fallback
**Label/Mono Font:** system mono stack (`--font-spec`) with tabular-nums;
Hebrew glyphs fall through to Heebo

**Character:** Rounded, friendly Hebrew display type over a clean geometric
Latin sans; numbers speak in a spec-sheet mono voice (counters never jitter).

### Hierarchy
- **Display** (700, clamp(2.5rem, 5vw, 4rem) via `--text-hero`; hero
  utilities may scale up to 6rem max, line-height 1.3): hero headline only,
  revealed word-by-word.
- **Headline** (700, clamp(1.75rem, 3vw, 2.25rem)): section titles, with the
  48px gradient accent bar beneath.
- **Title** (700, clamp(1.25rem, 1.5vw, 1.5rem)): card and FAQ titles.
- **Body** (400, 1rem at 18px root, line-height 1.6-1.7 desktop / 1.7
  mobile): Hebrew body text; root font-size scales with the accessibility
  widget.
- **Label/Spec** (mono, 0.875rem, tabular-nums): counters, tech marquee,
  numbered process steps.
- **Giant statement** (`--text-giant` clamp(4rem, 12vw, 11rem)): ONE outline
  word per page ("מתחילים?"), fill-on-hover - a deliberate exception to
  normal display ceilings.

### Named Rules
**The Word-Split Rule.** Hebrew headlines animate by WORDS only;
letter-splitting breaks glyph shaping. No letter-spacing, no italic, no
em-dashes in displayed Hebrew.

**The Root-Scale Rule.** Accessibility text scaling multiplies the root
font-size (18px x scale); components must stay rem-based so everything
scales together.

## 4. Elevation

Soft, cool, ambient depth: surfaces are near-flat at rest with hairline
frost borders, and shadows respond to state. Hover shadows are pre-painted
on a `::after` pseudo-element and only their OPACITY animates (compositor-
cheap; never animate box-shadow directly). Dark navy sections use a
pre-baked alpha grain tile painted BEHIND content (`.grain-surface`) -
mix-blend-mode over text is forbidden (it kills ClearType on Windows).

### Shadow Vocabulary
- **shadow-sm** (`0 2px 8px rgba(74,74,74,0.06)`): chips, small controls.
- **shadow-md** (`0 4px 16px rgba(74,74,74,0.08)`): raised panels.
- **shadow-lg** (`0 8px 32px rgba(74,74,74,0.10)`): modals, popovers.
- **shadow-card** (`0 4px 20px rgba(74,74,74,0.08) + 1px ring`): cards.
- **shadow-glow** (`0 0 24px rgba(125,211,252,0.30)`): sky glow for hovered
  CTAs only.

### Named Rules
**The Opacity-Shadow Rule.** Hover elevation = pseudo-element shadow with
opacity transition. Animating box-shadow itself is a performance bug.

## 5. Components

### Buttons
- **Shape:** full pill (50px radius); generous padding (py-4 px-10 at md).
- **Primary:** Sky Pastel fill (#7DD3FC) with hard-coded deep-navy text
  (#1E3A5F) for AA on the pastel; hover deepens fill to #38BDF8.
- **Hover / Focus:** whileHover scale 1.02 + glow; focus ring 2px sky with
  offset. All effects stay inside the element - no magnetic displacement.
- **Secondary:** white fill, 2px frost-line border, ink text; border and
  text shift to accent on hover. **Ghost:** transparent, ink text, frost
  fill on hover.

### Header CTA - "The Tide" (signature)
Pill button whose hover raises a two-layer wavy crest inside it (deep-sky
tide + lighter foam, pseudo-elements, transform-only, 600ms cubic-out,
`overflow: hidden`). The canonical example of the Contained-Hover Rule.

### Cards / Containers
- **Corner Style:** 24px (`--radius-xl`).
- **Background:** white on frost sections; navy-surface panels on dark.
- **Shadow Strategy:** shadow-card at rest; opacity-driven hover glow
  (`.card-glow`). **Border:** none on light (ring lives in shadow-card).
- **Internal Padding:** clamp(1.5rem, 3vw, 2.5rem).
- Services cards add an RTL clip-path tint wipe from the right on hover.

### Inputs / Fields
- **Style:** white fill, frost-line border, 12px radius; RTL text with
  forced-LTR email/tel/url fields.
- **Focus:** border to accent + soft glow; error messages appear beneath
  with hover-only underlined links.

### Navigation
- **Style:** fixed header, transparent over the dark hero -> ink-strong/95
  + blur when scrolled; logo right, nav right (RTL).
- **Links:** sky text on the dark header; hover = 2px center-out underline
  (hover-only!), subtle sky halo, translateY(-2px).
- **Mobile:** right-sliding sheet, 44px+ targets.

### Wave Divider (signature)
Layered SVG waves between sections; each layer slides one full period on a
seamless linear loop (transform-only, paused offscreen, slowed - not
frozen - under OS reduced-motion, fully stopped by the site's accessibility
switch). Variants a/b/c differ in amplitude and direction; fill always
matches the adjacent section's solid color so seams are invisible.

### Giant Word (signature)
One outline-stroke statement word (2px sky stroke, transparent fill) that
fills sky on hover (desktop) or when scrolled to center (mobile). The same
outline-stroke voice marks the HowWeWork step-number watermarks (1.5px sky
stroke) - outline type is the site's "big decorative number/word" identity;
gradient text is banned.

## 6. Do's and Don'ts

### Do:
- **Do** use sky-ink (#0369A1 / #075985) for every link and accent-colored
  text on light surfaces; pastel sky belongs on fills and dark surfaces.
- **Do** run the axe-core contrast gate (0 violations) after any color or
  surface change - it is a build gate.
- **Do** import `m` from framer-motion (LazyMotion strict) and take easing
  ONLY from `src/config/motion.ts` (EASE_BRAND); no layoutId, no drag.
- **Do** gate every new infinite loop on useReducedMotion/useAmbientMotion
  and pause it offscreen (pattern in LottieIcon.tsx).
- **Do** split Hebrew headline animations by words; keep line-height >= 1.6;
  keep body copy at <= 75ch.
- **Do** keep hover effects clipped inside the element (The Tide is the
  reference implementation).
- **Do** rely on the global two-mode focus ring (`--focus-ring`): sky-ink on
  light surfaces, pastel on dark ones (header/footer/#hero/#before-after).
  Never suppress it with outline-none.
- **Do** label demo content as demo ("הדגמה") and show only verifiable
  numbers.

### Don't:
- **Don't** restore the warm watercolor palette; legacy token names
  (--color-orange/cream/brown) keep their COOL values (The Legacy-Name Rule).
- **Don't** set pastel sky (#7DD3FC) as text on a light background - 1.6:1
  fails WCAG for any size.
- **Don't** use navy as an accent; it is a surface color only.
- **Don't** add static underlines to UI links (hover-only; exceptions:
  blog-article prose and chat-bubble URLs).
- **Don't** use magnetic/displacing hovers, mix-blend-mode over text,
  letter-spacing or italics on Hebrew, or em-dashes in displayed copy.
- **Don't** persist accessibility-widget settings across visits; every load
  starts at defaults (owner decision, DECISIONS.rtl.md #26).
- **Don't** ship uniform fade-in on every section, purple gradients,
  glassmorphism-by-default, hero-metric stat templates, or fake social
  proof - the register's AI-slop tells.
