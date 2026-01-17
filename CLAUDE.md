# MediaWave Israel - Website Project

## Project Overview
Hebrew website for MediaWave Israel (MediaWaveIsrael.com) - a digital media services company.
Design inspiration: https://microsoft.ai/about/

## Tech Stack
- React 18 + Vite
- Tailwind CSS
- Framer Motion (animations)
- TypeScript

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

### Hebrew & RTL
- ALL text must be in Hebrew from CONTENT.md
- DO NOT modify, translate, or invent any text content
- Full RTL support: `dir="rtl"` on html
- Use CSS logical properties: `margin-inline-start`, `padding-inline-end` (NOT margin-left/right)
- Animations enter from RIGHT (RTL direction)

### Custom Fonts
Location: `src/fonts/`
- **Headlines**: "Noa Shalev" (noa-shalev/) - elegant calligraphic serif
- **Body**: "Yarden" (yarden/) - friendly handwritten style
- **Fallback**: "Heebo", sans-serif (Google Fonts)

### Design Language (Microsoft AI inspired)
- Watercolor/hand-drawn illustrations
- Curved SVG connecting lines between sections
- Scroll-triggered animations (staggered reveals)
- Warm color palette: cream bg (#FDFBF7), orange accent (#F5A623), brown text (#4A4A4A)
- Interactive cards with hover states
- Generous whitespace

---

## Commands
```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Project Structure
```
src/
├── fonts/           # Custom Hebrew fonts (Noa Shalev, Yarden)
├── components/      # React components
│   ├── ui/          # Reusable UI components
│   ├── sections/    # Page sections (Hero, Services, About, etc.)
│   └── layout/      # Layout components (Header, Footer)
├── styles/          # Global styles and font declarations
├── assets/          # Images, illustrations, SVGs
├── hooks/           # Custom React hooks
└── utils/           # Helper functions
```

## Content Source
- Read ALL text content from: `CONTENT.md`
- NEVER change the Hebrew text
- Only apply styling and design

## Important Notes
- Mobile-first responsive design
- Navigation aligned RIGHT
- Logo on RIGHT side
- No italic for Hebrew - use color/weight for emphasis
- Line-height for Hebrew: 1.7-1.8
- **ALWAYS use frontend-design skill for visual work!**
