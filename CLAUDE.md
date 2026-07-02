# MediaWave Israel - Website Project

## Project Overview
Hebrew website for MediaWave Israel (MediaWaveIsrael.com) - a digital media services company.
Design inspiration: https://microsoft.ai/about/

## Tech Stack
- React 18.3.1 + Vite 6.0.5
- Tailwind CSS v4.1.18
- Framer Motion 12.26.2 (animations) — via `LazyMotion strict`: **always import `m`, never `motion`**
- TypeScript 5.6.2
- Deployed on **Cloudflare Pages** (functions/ = Pages Functions, e.g. /api/chat)

## ⚠️ STATUS UPDATE — July 2026 (overrides stale sections below)
- **CMS: NONE.** Directus was fully removed (July 2026). All content is static:
  section data lives inside each component, blog in `src/data/blog-posts.ts`,
  contact details in `src/data/site.ts`. A new CMS may be added later.
  Sanity exists ONLY for the lazy `/studio` route (not used for public content).
- **Palette remap:** the CSS variable NAMES are legacy (`--color-orange`, `--color-cream`,
  `--color-brown`) but their VALUES are the current light-blue theme:
  orange=#7DD3FC (sky), orange-dark=#38BDF8, cream=#F8FAFC, terracotta/sage=cyan/teal tints.
  The "warm watercolor" palette documented below is HISTORICAL — do not restore it.
- **Deleted components** (do not reference): ServiceCard, ConnectingLine, PageDecorations,
  SectionSkeleton, Packages section. Services renders its own inline card.
- **Home sections (actual):** Hero, WhyUs, Services, HowWeWork, Testimonials (hidden until
  real testimonials are added to `src/data/testimonials.ts`), FAQ, Contact.
- **Pages:** /, /blog, /blog/:slug, /terms, /privacy, /accessibility, /studio, 404.
- **Build:** `npm run build` = generate-seo → tsc → vite → puppeteer prerender (7 pages).
- **Forms:** no endpoint configured yet — Contact + LeadModal hand the lead off to
  WhatsApp with a prefilled message (honest fallback). Real endpoint = future task.
- **Perf guardrails:** hero/whyus videos mount desktop-only after idle/in-view;
  Lotties pause offscreen; infinite framer loops gate on prefers-reduced-motion.

---

## ⚡ SKILLS - MANDATORY!

### YOU MUST USE SKILLS FOR THIS PROJECT

Before ANY design or coding work, ALWAYS activate the appropriate skill first.

### Primary Skill: frontend-design
**USE THIS FOR ALL VISUAL WORK!**

```
Use the frontend-design skill to create [component/section].
```

The frontend-design skill ensures:
- Distinctive, memorable design (avoids generic "AI slop")
- Bold aesthetic direction
- Proper typography choices
- Meaningful animations and micro-interactions
- Production-grade, polished code
- No boring defaults (Inter font, purple gradients, etc.)

### When to Use Each Skill

| Task | Skill | Activation |
|------|-------|------------|
| ANY UI component | `frontend-design` | "Use the frontend-design skill..." |
| Hero section | `frontend-design` | "Use the frontend-design skill..." |
| Cards, buttons, forms | `frontend-design` | "Use the frontend-design skill..." |
| Animations | `frontend-design` | "Use the frontend-design skill..." |
| Illustrations/SVGs | `frontend-design` | "Use the frontend-design skill..." |
| Performance optimization | `pagespeed-100` | "Use the pagespeed-100 skill..." |
| SEO & meta tags | `seo-specialist` | "Use the seo-specialist skill..." |
| Animations & motion | `animation-designer` | "Use the animation-designer skill..." |

### IMPORTANT RULES FOR SKILLS

1. **ALWAYS** read the skill BEFORE starting the task
2. **FOLLOW** the skill's methodology completely
3. **NEVER** create visual components without frontend-design skill
4. The skill will guide you to make BOLD, DISTINCTIVE choices
5. If output looks generic → you didn't follow the skill properly

### Design Direction (for frontend-design skill)
When using frontend-design skill, specify this aesthetic:
- **Tone**: Warm, inviting, professional yet friendly
- **Inspiration**: Microsoft AI about page
- **Style**: Watercolor illustrations, organic shapes, curved lines
- **Feel**: Hand-crafted, artisanal, not corporate/cold

---

## 🏢 BUSINESS CONTEXT - MediaWave

### What MediaWave Does
MediaWave is a **web development and digital media company** offering:
- **Website Development** - Custom websites, landing pages, e-commerce
- **Video Editing** - Professional video production and editing
- **Tape Conversion** - Converting old media (VHS, cassettes) to digital

### Animation Philosophy for This Site
**The animations should DEMONSTRATE our capabilities** - if we build websites, OUR website must be impressive!

Every animation should say: "אנחנו יודעים מה אנחנו עושים"

### Animation Guidelines
1. **Show Technical Excellence**
   - Smooth, buttery animations (no jank)
   - Precise timing and easing
   - Attention to micro-details

2. **Demonstrate Creativity**
   - Unique transitions (not default fades)
   - Playful but professional
   - Memorable moments

3. **Prove User Experience Skills**
   - Animations guide the eye
   - Nothing blocks content
   - Respects user time (not too slow)

4. **Be a Portfolio Piece**
   - Every section is a mini-demo
   - Showcase different animation techniques
   - Make visitors think "I want MY site to do this!"

### Specific Animation Ideas
| Section | Animation Concept | Message to Visitors |
|---------|-------------------|---------------------|
| Hero | Dramatic entrance, floating elements | "WOW, first impression" |
| Services | Interactive cards, reveal effects | "We make things come alive" |
| Portfolio | Gallery transitions, hover magic | "Look at our craft" |
| Contact | Form micro-interactions | "Every detail matters" |

### What to AVOID
- Generic fade-ins everywhere
- Slow, boring transitions
- Animations that feel "template-like"
- Anything that makes the site feel cheap

### The Meta Message
This website IS the portfolio. The animations ARE the proof.
A visitor should think: "If their OWN site looks this good, imagine what they'll build for ME!"

---

## 📁 PROJECT STRUCTURE (Complete)

```
MediaWaveIsrael/
├── .claude/                          # Claude Code configuration
│   ├── agents/                       # Custom agents (@planner, @architect, etc.)
│   ├── commands/                     # Commands (/plan, /code-review, /build-fix)
│   ├── rules/                        # Auto-loaded rules (security, coding-style, etc.)
│   ├── skills/                       # Skills (project-setup)
│   ├── settings.json                 # Shared settings (Git-tracked)
│   └── settings.local.json           # Local settings (not tracked)
│
├── src/
│   ├── assets/                       # Static assets
│   │   ├── mediawave-logo.png        # Main logo (transparent PNG)
│   │   ├── yaelevy-screenshot.png    # Portfolio project screenshot
│   │   └── microsoft.ai.about.txt    # Design inspiration reference
│   │
│   ├── components/
│   │   ├── layout/                   # Layout components
│   │   │   ├── Header.tsx            # Fixed nav with mobile menu
│   │   │   ├── Footer.tsx            # Footer with WhatsApp button
│   │   │   └── Layout.tsx            # Main wrapper (decorations, scroll-to-top)
│   │   │
│   │   ├── pages/                    # Page components
│   │   │   └── NotFound.tsx          # 404 page
│   │   │
│   │   ├── sections/                 # Page sections (in order)
│   │   │   ├── Hero.tsx              # Landing hero with parallax blobs
│   │   │   ├── Services.tsx          # 6 service cards, asymmetric grid
│   │   │   ├── About.tsx             # Company story, values, illustration
│   │   │   ├── Portfolio.tsx         # Featured project showcase
│   │   │   └── Contact.tsx           # Contact form + info
│   │   │
│   │   └── ui/                       # Reusable UI components
│   │       ├── Button.tsx            # Variants: primary/secondary/ghost
│   │       ├── Input.tsx             # Input + Textarea with floating labels
│   │       ├── Logo.tsx              # Logo, LogoIcon, LogoText
│   │       ├── ServiceCard.tsx       # Card with 6 animation types
│   │       ├── ConnectingLine.tsx    # SVG path animator + FloatingBlob/Dot
│   │       ├── PageDecorations.tsx   # Global decorative elements
│   │       └── index.ts              # Barrel exports
│   │
│   ├── fonts/                        # Custom Hebrew fonts
│   │   ├── noa-shalev/               # Headlines (calligraphic serif)
│   │   │   ├── NoaShalev-Regular.woff2
│   │   │   └── NoaShalev-Regular.woff
│   │   └── yarden/                   # Body text (friendly handwritten)
│   │       ├── Yarden-Regular.woff2
│   │       └── Yarden-Regular.woff
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── useReducedMotion.ts       # Accessibility: motion preferences
│   │   └── index.ts
│   │
│   ├── styles/
│   │   ├── index.css                 # Main styles + Tailwind v4 theme
│   │   └── fonts.css                 # @font-face declarations
│   │
│   ├── utils/                        # Helper functions
│   │   └── index.ts
│   │
│   ├── App.tsx                       # Root component (renders all sections)
│   ├── main.tsx                      # React DOM entry point
│   └── vite-env.d.ts                 # Vite type declarations
│
├── public/                           # Static files (copied as-is)
├── dist/                             # Build output (generated)
│
├── index.html                        # HTML entry point
├── vite.config.ts                    # Vite configuration
├── tsconfig.json                     # TypeScript config (references)
├── tsconfig.app.json                 # App TypeScript config
├── tsconfig.node.json                # Node TypeScript config
├── eslint.config.js                  # ESLint configuration
├── package.json                      # Dependencies & scripts
│
├── CLAUDE.md                         # This file - project instructions
├── CONTENT.md                        # ALL Hebrew text content
└── PROMPTS_GUIDE.md                  # Prompts documentation
```

---

## 🧩 COMPONENTS REFERENCE

### Layout Components

| Component | File | Purpose |
|-----------|------|---------|
| `Header` | `src/components/layout/Header.tsx` | Fixed navigation, mobile hamburger menu, scroll detection |
| `Footer` | `src/components/layout/Footer.tsx` | Contact info, navigation, WhatsApp floating button |
| `Layout` | `src/components/layout/Layout.tsx` | Main wrapper with decorations, scroll-to-top, skip-link |

### Section Components (Page Order)

| Section | File | Key Features |
|---------|------|--------------|
| `Hero` | `src/components/sections/Hero.tsx` | Parallax blobs, animated headline, social proof badges, scroll indicator |
| `Services` | `src/components/sections/Services.tsx` | 6 cards in asymmetric grid, connecting lines, 6 animation types |
| `About` | `src/components/sections/About.tsx` | Company story, pull quote, values, watercolor illustration |
| `Portfolio` | `src/components/sections/Portfolio.tsx` | Browser mockup, project screenshot, tech badges, hover effects |
| `Contact` | `src/components/sections/Contact.tsx` | Form (name/email/message), contact methods, envelope illustration |

### UI Components

| Component | File | Exports | Description |
|-----------|------|---------|-------------|
| `Button` | `src/components/ui/Button.tsx` | `Button` | Variants: primary/secondary/ghost, loading state, ripple effect |
| `Input` | `src/components/ui/Input.tsx` | `Input`, `Textarea` | Floating labels, error states, focus glow |
| `Logo` | `src/components/ui/Logo.tsx` | `Logo`, `LogoIcon`, `LogoText` | Main logo, SVG icon, text-only |
| `ServiceCard` | `src/components/ui/ServiceCard.tsx` | `ServiceCard` | 6 animation types: tilt3d, glitch, reveal, float, pulse, wave |
| `ConnectingLine` | `src/components/ui/ConnectingLine.tsx` | `ConnectingLine`, `FloatingBlob`, `FloatingDot`, `GrainOverlay` | SVG path animations, decorative elements |
| `PageDecorations` | `src/components/ui/PageDecorations.tsx` | `PageDecorations` | Global blobs, dots, geometric shapes |

### Hooks

| Hook | File | Purpose |
|------|------|---------|
| `useReducedMotion` | `src/hooks/useReducedMotion.ts` | Detects `prefers-reduced-motion` |
| `useMotionSafe` | `src/hooks/useReducedMotion.ts` | Returns appropriate animation variant |
| `useReducedTransition` | `src/hooks/useReducedMotion.ts` | Returns instant transition if reduced motion |

---

## 🎨 DESIGN SYSTEM

### Color Palette

```css
/* Backgrounds */
--color-cream: #FDFBF7          /* Main background */
--color-cream-dark: #F5F0E8     /* Slightly darker */
--color-cream-darker: #EDE5D8   /* Borders/accents */

/* Accents */
--color-orange: #F5A623         /* Primary accent */
--color-orange-light: #FFBE4D
--color-orange-dark: #D4890F
--color-terracotta: #E07B54     /* Warm earth tone */
--color-coral: #F28B82          /* Warm accent */
--color-sage: #8BB4A0           /* Muted green-blue */

/* Text */
--color-brown: #4A4A4A          /* Main text */
--color-brown-light: #6A6A6A
--color-brown-dark: #2A2A2A     /* Darkest */
--color-brown-muted: #8A8A7A
```

### Typography

```css
/* Font Families */
--font-headline: 'Noa Shalev', 'Heebo', sans-serif  /* Headlines */
--font-body: 'Yarden', 'Heebo', sans-serif          /* Body text */

/* Font Sizes (fluid) */
--text-hero: clamp(3rem, 6vw, 5rem)
--text-h1: clamp(2.5rem, 4vw, 3.5rem)
--text-h2: clamp(2rem, 3vw, 2.75rem)
--text-h3: clamp(1.5rem, 2vw, 2rem)
--text-base: 1.125rem

/* Line Heights (Hebrew) */
--leading-normal: 1.75          /* Hebrew: 1.7-1.8 */
```

### Shadows & Effects

```css
--shadow-sm: 0 2px 8px rgba(74, 74, 74, 0.06)
--shadow-md: 0 4px 16px rgba(74, 74, 74, 0.08)
--shadow-lg: 0 8px 32px rgba(74, 74, 74, 0.10)
--shadow-glow: 0 0 24px rgba(245, 166, 35, 0.20)  /* Orange glow */
```

### Animation Easing

```css
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)
--ease-out-back: cubic-bezier(0.34, 1.56, 0.64, 1)
--ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275)
```

---

## 🌐 Hebrew & RTL

### RTL Requirements
- `dir="rtl"` on html element
- Use CSS logical properties: `margin-inline-start`, `padding-inline-end` (NOT margin-left/right)
- Logo positioned on RIGHT
- Navigation menu slides from RIGHT
- Animations enter from RIGHT

### Typography Rules
- **NO italic** for Hebrew - use color/weight for emphasis
- Line-height: 1.7-1.8 for readability
- Email/phone inputs: force LTR direction with `text-align: left`

### Content Source
- **ALL text from:** `CONTENT.md`
- **NEVER** modify, translate, or invent Hebrew text
- Contact: 052-8731808, mediawaveisrael@gmail.com

---

## 🛠 Available Tools

### Agents (invoke with @)
| Agent | Purpose |
|-------|---------|
| `@planner` | Plan feature implementation before coding |
| `@architect` | System design and technical decisions |
| `@code-reviewer` | Code quality and security review |
| `@e2e-runner` | Playwright E2E test creation |

### Commands (invoke with /)
| Command | Purpose |
|---------|---------|
| `/plan` | Create implementation plan |
| `/code-review` | Review uncommitted changes |
| `/build-fix` | Fix TypeScript/build errors |

### Rules (auto-loaded)
- `security` - No hardcoded secrets, input validation
- `coding-style` - Immutability, file size limits (<800 lines)
- `testing` - 80% coverage, TDD workflow
- `git-workflow` - Conventional commits

---

## 📦 NPM Commands

```bash
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # TypeScript check + production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## ♿ Accessibility Features

- Skip-to-content link (visible on focus)
- Focus-visible outlines (2px orange)
- Semantic HTML (proper heading hierarchy)
- ARIA labels on interactive elements
- Touch targets: 44px minimum
- `prefers-reduced-motion` support
- `prefers-contrast: high` support
- Keyboard navigation throughout

---

## 🚀 Performance Considerations

- Lazy loading for images (except header logo)
- `font-display: swap` for custom fonts
- Efficient SVG animations (paths vs. transforms)
- CSS custom properties (reduce recalculations)
- Code organized by feature/section

---

## Important Notes

- Mobile-first responsive design
- Navigation aligned RIGHT
- Logo on RIGHT side
- **ALWAYS use frontend-design skill for visual work!**
- This website IS the portfolio - every animation demonstrates capabilities

