# MediaWave Israel - Design Specification

> **Design Philosophy**: Warm, inviting, hand-crafted feel inspired by microsoft.ai/about.
> Reject cold corporate aesthetics. Embrace organic shapes, watercolor textures, and human warmth.

---

## 1. COLOR PALETTE

### Primary Colors
```css
--color-cream:          #FDFBF7;   /* Background - warm off-white, like aged paper */
--color-cream-dark:     #F5F0E8;   /* Subtle sections, cards */
--color-cream-darker:   #EDE5D8;   /* Borders, dividers */
```

### Accent Colors
```css
--color-orange:         #F5A623;   /* Primary accent - warm amber/marigold */
--color-orange-light:   #FFBE4D;   /* Hover states, glows */
--color-orange-dark:    #D4890F;   /* Active states */
--color-terracotta:     #E07B54;   /* Secondary accent - earthy warmth */
--color-coral:          #F28B82;   /* Soft accent for variety */
```

### Text Colors
```css
--color-brown:          #4A4A4A;   /* Primary text - warm charcoal, not cold black */
--color-brown-light:    #6A6A6A;   /* Secondary text */
--color-brown-dark:     #2A2A2A;   /* Headlines, emphasis */
--color-brown-muted:    #8A8A7A;   /* Captions, placeholders */
```

### Decorative Colors (for watercolor illustrations)
```css
--color-watercolor-1:   rgba(245, 166, 35, 0.15);   /* Amber wash */
--color-watercolor-2:   rgba(224, 123, 84, 0.12);   /* Terracotta wash */
--color-watercolor-3:   rgba(139, 180, 160, 0.10);  /* Sage green wash */
--color-watercolor-4:   rgba(180, 160, 200, 0.08);  /* Lavender wash */
```

### Gradients
```css
--gradient-warm:        linear-gradient(135deg, #FDFBF7 0%, #F5F0E8 50%, #FDF8F0 100%);
--gradient-sunset:      linear-gradient(180deg, #FDFBF7 0%, rgba(245, 166, 35, 0.08) 100%);
--gradient-hero:        radial-gradient(ellipse at 30% 20%, rgba(245, 166, 35, 0.12) 0%, transparent 50%),
                        radial-gradient(ellipse at 70% 80%, rgba(224, 123, 84, 0.08) 0%, transparent 50%),
                        linear-gradient(180deg, #FDFBF7 0%, #F5F0E8 100%);
```

### Shadows
```css
--shadow-sm:            0 2px 8px rgba(74, 74, 74, 0.06);
--shadow-md:            0 4px 16px rgba(74, 74, 74, 0.08);
--shadow-lg:            0 8px 32px rgba(74, 74, 74, 0.10);
--shadow-glow:          0 0 24px rgba(245, 166, 35, 0.20);
--shadow-card:          0 4px 20px rgba(74, 74, 74, 0.08),
                        0 0 0 1px rgba(74, 74, 74, 0.03);
```

---

## 2. TYPOGRAPHY SCALE

### Font Families
```css
--font-headline:        'Noa Shalev', 'Heebo', sans-serif;   /* Elegant calligraphic - titles only */
--font-body:            'Yarden', 'Heebo', sans-serif;       /* Friendly handwritten - body text */
--font-fallback:        'Heebo', sans-serif;                 /* System fallback */
```

### Font Sizes (Desktop → Mobile)
```css
/* Headlines - "Noa Shalev" */
--text-hero:            clamp(3rem, 6vw, 5rem);      /* 48px → 80px - Main hero only */
--text-h1:              clamp(2.5rem, 4vw, 3.5rem);  /* 40px → 56px */
--text-h2:              clamp(2rem, 3vw, 2.75rem);   /* 32px → 44px */
--text-h3:              clamp(1.5rem, 2vw, 2rem);    /* 24px → 32px */
--text-h4:              clamp(1.25rem, 1.5vw, 1.5rem); /* 20px → 24px */

/* Body - "Yarden" */
--text-lg:              1.25rem;    /* 20px - Lead paragraphs */
--text-base:            1.125rem;   /* 18px - Body text (larger for Hebrew) */
--text-sm:              1rem;       /* 16px - Secondary text */
--text-xs:              0.875rem;   /* 14px - Captions, labels */
```

### Line Heights (Optimized for Hebrew)
```css
--leading-tight:        1.3;        /* Headlines */
--leading-normal:       1.75;       /* Body text - generous for Hebrew */
--leading-relaxed:      1.85;       /* Large blocks of text */
--leading-loose:        2;          /* Captions with breathing room */
```

### Font Weights
```css
--weight-normal:        400;        /* Body text */
--weight-medium:        500;        /* Subtle emphasis */
--weight-semibold:      600;        /* Buttons, labels */
--weight-bold:          700;        /* Headlines, strong emphasis */
```

### Letter Spacing
```css
--tracking-tight:       -0.02em;    /* Large headlines */
--tracking-normal:      0;          /* Body text */
--tracking-wide:        0.05em;     /* Buttons, uppercase labels */
```

### Typography Rules
- **NO ITALICS** for Hebrew - use color or weight for emphasis instead
- Headlines: Bold weight + darker brown or orange accent
- Pull quotes: Larger size + orange left/right border (RTL-aware)
- Links: Orange underline on hover, not color change

---

## 3. SPACING SYSTEM

### Base Scale (8px system)
```css
--space-1:              0.25rem;    /* 4px - Micro spacing */
--space-2:              0.5rem;     /* 8px - Tight */
--space-3:              0.75rem;    /* 12px - Compact */
--space-4:              1rem;       /* 16px - Default */
--space-5:              1.5rem;     /* 24px - Comfortable */
--space-6:              2rem;       /* 32px - Spacious */
--space-8:              3rem;       /* 48px - Section gaps */
--space-10:             4rem;       /* 64px - Large gaps */
--space-12:             6rem;       /* 96px - Section padding */
--space-16:             8rem;       /* 128px - Hero spacing */
```

### Section Spacing
```css
--section-padding-y:    clamp(4rem, 10vh, 8rem);     /* Vertical section padding */
--section-padding-x:    clamp(1rem, 5vw, 4rem);      /* Horizontal container padding */
--section-gap:          clamp(6rem, 15vh, 10rem);    /* Between sections */
```

### Container Widths
```css
--container-sm:         640px;      /* Narrow content (text blocks) */
--container-md:         768px;      /* Medium content */
--container-lg:         1024px;     /* Standard content */
--container-xl:         1280px;     /* Wide content (cards grid) */
--container-max:        1440px;     /* Maximum width */
```

### Component Spacing
```css
--card-padding:         clamp(1.5rem, 3vw, 2.5rem);
--card-gap:             clamp(1.5rem, 3vw, 2rem);
--input-padding-x:      1.25rem;
--input-padding-y:      1rem;
--button-padding-x:     2rem;
--button-padding-y:     1rem;
```

---

## 4. COMPONENT STYLES

### Buttons

#### Primary Button (CTA)
```css
.btn-primary {
  background: var(--color-orange);
  color: white;
  font-family: var(--font-body);
  font-weight: var(--weight-semibold);
  font-size: var(--text-base);
  padding: var(--button-padding-y) var(--button-padding-x);
  border-radius: 50px;              /* Pill shape - friendly, not sharp */
  border: none;
  box-shadow: var(--shadow-sm), 0 0 0 0 rgba(245, 166, 35, 0.3);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.btn-primary:hover {
  background: var(--color-orange-light);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md), 0 0 20px rgba(245, 166, 35, 0.3);
}

.btn-primary:active {
  background: var(--color-orange-dark);
  transform: translateY(0);
}
```

#### Secondary Button
```css
.btn-secondary {
  background: transparent;
  color: var(--color-brown);
  border: 2px solid var(--color-cream-darker);
  border-radius: 50px;
  /* Same spacing as primary */
}

.btn-secondary:hover {
  border-color: var(--color-orange);
  color: var(--color-orange);
  background: rgba(245, 166, 35, 0.05);
}
```

#### Ghost Button
```css
.btn-ghost {
  background: transparent;
  color: var(--color-orange);
  border: none;
  padding: var(--space-2) var(--space-3);
  position: relative;
}

.btn-ghost::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;                         /* RTL */
  width: 0;
  height: 2px;
  background: var(--color-orange);
  transition: width 0.3s ease;
}

.btn-ghost:hover::after {
  width: 100%;
}
```

### Cards

#### Service Card
```css
.service-card {
  background: white;
  border-radius: 24px;              /* Soft, friendly corners */
  padding: var(--card-padding);
  box-shadow: var(--shadow-card);
  position: relative;
  overflow: hidden;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.3s ease;
}

.service-card::before {
  /* Watercolor accent blob in corner */
  content: '';
  position: absolute;
  top: -20%;
  left: -20%;                       /* RTL: will be flipped */
  width: 60%;
  height: 60%;
  background: radial-gradient(circle, var(--color-watercolor-1) 0%, transparent 70%);
  opacity: 0.5;
  transition: opacity 0.3s ease;
}

.service-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
}

.service-card:hover::before {
  opacity: 0.8;
}
```

#### Portfolio Card
```css
.portfolio-card {
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  aspect-ratio: 4/3;
  background: var(--gradient-warm);
}

.portfolio-card__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(42, 42, 42, 0.8) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.portfolio-card:hover .portfolio-card__overlay {
  opacity: 1;
}

.portfolio-card__content {
  position: absolute;
  bottom: 0;
  right: 0;                         /* RTL */
  left: 0;
  padding: var(--space-5);
  transform: translateY(20px);
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.portfolio-card:hover .portfolio-card__content {
  transform: translateY(0);
  opacity: 1;
}
```

### Form Inputs
```css
.input {
  width: 100%;
  padding: var(--input-padding-y) var(--input-padding-x);
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--color-brown);
  background: white;
  border: 2px solid var(--color-cream-darker);
  border-radius: 16px;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.input:focus {
  border-color: var(--color-orange);
  box-shadow: 0 0 0 4px rgba(245, 166, 35, 0.15);
}

.input::placeholder {
  color: var(--color-brown-muted);
}

/* Floating label style */
.input-wrapper {
  position: relative;
}

.input-label {
  position: absolute;
  top: 50%;
  right: var(--input-padding-x);    /* RTL */
  transform: translateY(-50%);
  color: var(--color-brown-muted);
  pointer-events: none;
  transition: all 0.2s ease;
}

.input:focus ~ .input-label,
.input:not(:placeholder-shown) ~ .input-label {
  top: 0;
  font-size: var(--text-xs);
  color: var(--color-orange);
  background: white;
  padding: 0 var(--space-2);
}
```

### Textarea
```css
.textarea {
  /* Same as input */
  min-height: 150px;
  resize: vertical;
  line-height: var(--leading-relaxed);
}
```

---

## 5. ANIMATION PATTERNS

### Timing Functions
```css
--ease-out-expo:        cubic-bezier(0.16, 1, 0.3, 1);      /* Smooth deceleration */
--ease-out-back:        cubic-bezier(0.34, 1.56, 0.64, 1);  /* Slight overshoot (playful) */
--ease-in-out:          cubic-bezier(0.65, 0, 0.35, 1);     /* Smooth both ways */
--ease-spring:          cubic-bezier(0.175, 0.885, 0.32, 1.275); /* Bouncy */
```

### Duration Scale
```css
--duration-fast:        150ms;      /* Micro-interactions (button press) */
--duration-normal:      300ms;      /* Standard transitions */
--duration-slow:        500ms;      /* Emphasis transitions */
--duration-slower:      800ms;      /* Reveals, entrances */
--duration-slowest:     1200ms;     /* Hero animations, lines drawing */
```

### Scroll Reveal (Framer Motion)
```javascript
// Base reveal - elements fade in and slide from right (RTL)
const revealVariants = {
  hidden: {
    opacity: 0,
    x: 40,                          // Positive X = from right in RTL
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],      // ease-out-expo
    }
  }
};

// Staggered children
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    }
  }
};
```

### Hover Effects
```javascript
// Card lift
whileHover={{
  y: -8,
  transition: { type: "spring", stiffness: 300 }
}}

// Button press
whileTap={{ scale: 0.98 }}

// Image zoom
whileHover={{ scale: 1.05 }}
transition={{ duration: 0.4, ease: "easeOut" }}
```

### Page Transitions
```javascript
// Page enter
const pageVariants = {
  initial: { opacity: 0 },
  enter: {
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3, ease: "easeIn" }
  }
};
```

### Connecting Lines (SVG Draw)
```css
.connecting-line {
  stroke: var(--color-orange);
  stroke-width: 2;
  stroke-linecap: round;
  fill: none;
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  opacity: 0.4;
}

.connecting-line.animate {
  animation: draw-line 1.5s ease-out forwards;
}

@keyframes draw-line {
  to {
    stroke-dashoffset: 0;
  }
}
```

### Floating Decorations
```javascript
// Gentle float animation
const floatVariants = {
  animate: {
    y: [0, -10, 0],
    rotate: [0, 2, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    }
  }
};

// Watercolor blob pulse
const blobVariants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.5, 0.7, 0.5],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut",
    }
  }
};
```

### Hero-Specific Animations
```javascript
// Main headline - dramatic entrance from right
const heroHeadline = {
  hidden: { opacity: 0, x: 100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 100,
      duration: 1,
    }
  }
};

// Subtitle - follow headline
const heroSubtitle = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.2,
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    }
  }
};

// CTA button - slide up with bounce
const heroCTA = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.4,
      type: "spring",
      damping: 15,
      stiffness: 200,
    }
  }
};
```

### Loading States
```css
/* Skeleton shimmer */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-cream-dark) 0%,
    var(--color-cream) 50%,
    var(--color-cream-dark) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

---

## 6. ADDITIONAL DESIGN NOTES

### RTL Considerations
- All text alignment defaults to `right`
- Use `margin-inline-start` / `margin-inline-end` instead of left/right
- Animations enter from **right** (positive X values)
- Navigation and logo positioned on **right**
- Decorative lines curve right-to-left reading flow

### Illustration Style
- Watercolor washes with soft, bleeding edges
- Warm color palette (oranges, terracotta, cream)
- Hand-drawn feel - slightly imperfect, organic shapes
- Abstract blobs and flowing shapes
- Avoid sharp geometric precision
- Reference: microsoft.ai/about location illustrations

### Visual Texture
- Subtle paper grain overlay on backgrounds (5-10% opacity)
- Watercolor splotches as decorative elements
- Curved, organic lines connecting sections
- No hard edges or stark contrasts

### Mobile Adaptations
- Touch targets minimum 44x44px
- Larger tap areas for interactive elements
- Simplified animations (reduce parallax)
- Full-width cards on mobile
- Hamburger menu with smooth slide-in from right

---

## 7. RESPONSIVE BREAKPOINTS

```css
--breakpoint-sm:        640px;      /* Small tablets, large phones */
--breakpoint-md:        768px;      /* Tablets */
--breakpoint-lg:        1024px;     /* Small laptops */
--breakpoint-xl:        1280px;     /* Desktops */
--breakpoint-2xl:       1536px;     /* Large screens */
```

### Media Query Usage
```css
/* Mobile-first approach */
/* Base styles = mobile */

@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

---

## Quick Reference - Design Principles

1. **Warm, not cold** - Every element should feel inviting
2. **Organic, not geometric** - Soft curves, watercolor textures
3. **Hand-crafted, not templated** - Each section feels unique
4. **Generous spacing** - Let content breathe
5. **Meaningful motion** - Animations enhance, never distract
6. **RTL-native** - Hebrew flows naturally from right to left
7. **Bold typography** - Headlines make a statement
8. **Subtle depth** - Soft shadows, layered elements

---

*This design system creates a distinctive, memorable experience that stands apart from generic templates while maintaining warmth and professionalism.*
