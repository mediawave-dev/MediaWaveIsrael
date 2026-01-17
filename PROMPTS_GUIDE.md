# MediaWave Website Development - Prompt Guide
## סדרת פרומפטים לפיתוח האתר מ-0

---

## ⚠️ חשוב מאוד - שימוש ב-SKILLS

**בכל פרומפט שקשור לעיצוב או UI - חובה להשתמש ב-Skills!**

| סוג עבודה | Skill לשימוש |
|-----------|--------------|
| עיצוב ו-UI | `frontend-design` |
| אנימציות | `animation-designer` |
| ביצועים | `pagespeed-100` |
| SEO | `seo-specialist` |

**זכור: האתר הזה הוא הפורטפוליו שלנו!**
כל אנימציה צריכה להראות ללקוחות פוטנציאליים מה אנחנו יודעים לעשות.

---

## 🚀 שלב 0: הכנת הפרויקט (הרץ פעם אחת)

```
Create a new React + Vite + TypeScript project for MediaWaveIsrael.com

Setup:
1. Initialize with: npm create vite@latest . -- --template react-ts
2. Install dependencies:
   - tailwindcss, postcss, autoprefixer
   - framer-motion
   - @fontsource/heebo (fallback font)
3. Configure Tailwind with RTL support
4. Create the folder structure as defined in CLAUDE.md
5. Setup the custom fonts from G:\Nati\Web-Dev\FONTS\ - copy both font folders to src/fonts/

DO NOT create any components yet. Only setup and configuration.
```

---

## 📝 שלב 1: הגדרת עיצוב (Design Spec)

```
Read CONTENT.md and create a detailed design specification.

Use the frontend-design skill to guide the design decisions.

Create docs/DESIGN_SPEC.md with:

1. COLOR PALETTE
   - Define exact colors with CSS variables
   - Primary, secondary, accent, background, text colors
   - Based on warm, inviting feel (cream, orange, brown)

2. TYPOGRAPHY SCALE
   - Font sizes for h1-h6, body, small text
   - Line heights for Hebrew readability (1.7-1.8)
   - Font weights to use
   - "Noa Shalev" for headlines, "Yarden" for body

3. SPACING SYSTEM
   - Define spacing scale (4, 8, 12, 16, 24, 32, 48, 64, 96)
   - Section padding
   - Component gaps

4. COMPONENT STYLES
   - Buttons (primary, secondary, ghost)
   - Cards (service cards, portfolio cards)
   - Form inputs

5. ANIMATION PATTERNS
   - Scroll reveal timing
   - Hover effects
   - Page transitions
   - Staggered animations

Design inspiration: microsoft.ai/about
- Watercolor illustrations
- Curved connecting lines
- Warm, hand-crafted feel

Follow the frontend-design skill guidelines for BOLD, DISTINCTIVE choices.
DO NOT write any code yet. Only the design specification document.
```

---

## 🎨 שלב 2: הגדרת פונטים וסטיילים בסיסיים

```
Setup fonts and base styles.

1. Create src/styles/fonts.css:
   - @font-face for "Noa Shalev" (from src/fonts/noa-shalev/)
   - @font-face for "Yarden" (from src/fonts/yarden/)
   - Check actual filenames in the folders and use correct paths

2. Create src/styles/globals.css:
   - Import fonts.css
   - CSS variables from DESIGN_SPEC.md
   - Base HTML/body styles with RTL
   - Tailwind directives

3. Update tailwind.config.js:
   - Add custom fonts to fontFamily
   - Add custom colors
   - Add RTL-aware utilities

4. Update index.html:
   - Add dir="rtl" and lang="he"
   - Add Heebo from Google Fonts as fallback

Test that fonts load correctly with a simple test component.
```

---

## 🧩 שלב 3: Layout Components

```
Use the frontend-design skill to create the layout structure.

Read CONTENT.md for navigation items and footer content.

1. src/components/layout/Header.tsx
   - Logo on RIGHT side (RTL)
   - Navigation menu (aligned RIGHT)
   - Mobile hamburger menu with smooth animation
   - Sticky header with blur effect on scroll
   - Use "Noa Shalev" for logo text
   - Make it DISTINCTIVE - not a generic navbar!

2. src/components/layout/Footer.tsx
   - Contact info from CONTENT.md
   - Social links with hover effects
   - Copyright text
   - Warm, inviting design - not cold/corporate

3. src/components/layout/Layout.tsx
   - Wrapper component
   - Includes Header and Footer
   - Main content area

4. Update App.tsx to use Layout

Use exact text from CONTENT.md. DO NOT invent any text.
Apply the frontend-design skill for unique, memorable components.
```

---

## 🦸 שלב 4: Hero Section

```
Use the frontend-design skill AND the animation-designer skill to create a STUNNING Hero section.

This is the most important section - make it UNFORGETTABLE!
Remember: This website IS our portfolio. The Hero must make visitors think "I want MY site to look like this!"

Read CONTENT.md for hero content (headline, subtitle, CTA).

src/components/sections/Hero.tsx:

1. CONTENT (exact text from CONTENT.md):
   - Main headline with emphasis styling (use color/weight, NOT italic)
   - Subtitle text
   - CTA button

2. DESIGN (follow frontend-design skill):
   - Full viewport height (100vh)
   - Warm gradient or watercolor-style background
   - Large, dramatic typography using "Noa Shalev"
   - Text aligned RIGHT (RTL)
   - Create atmosphere and depth - NO flat solid colors!

3. ANIMATIONS (use animation-designer skill + Framer Motion):
   - Headline: dramatic entrance from right with spring physics
   - Subtitle: follows with staggered delay
   - CTA button: bouncy entrance, magnetic hover effect
   - Background: parallax layers, floating elements
   - Scroll indicator: pulsing or bouncing arrow
   
   SHOW OFF! This is where we prove we know animations:
   - Use different easing for different elements
   - Add micro-interactions on hover
   - Create depth with layered parallax
   - Consider: morphing shapes, particle effects, or animated gradients

4. DECORATIVE ELEMENTS:
   - Watercolor-style SVG blobs with subtle animation
   - Curved line flowing down to next section (animated draw)
   - Grain texture overlay
   - Floating geometric shapes

Make visitors say "WOW" within 2 seconds of landing!
Reference: microsoft.ai/about hero section energy and flow.
```

---

## 💼 שלב 5: Services Section

```
Use the frontend-design skill AND the animation-designer skill to create the Services section.

This section demonstrates what we can build for clients - make each service card a mini portfolio piece!

Read CONTENT.md for all service names and descriptions.

src/components/sections/Services.tsx:

1. CONTENT (exact text from CONTENT.md):
   - Section title
   - Each service: name, description

2. LAYOUT:
   - Section title with decorative curved line
   - 3 service cards in creative grid (NOT boring equal columns)
   - Cards aligned for RTL
   - Asymmetric layout - show we can break conventions

3. CARD DESIGN (use frontend-design skill):
   - Unique shapes - NOT just rounded rectangles!
   - Custom illustration for each service (watercolor style)
   - Service name in "Noa Shalev"
   - Description in "Yarden"
   - Depth with layered shadows

4. CARD ANIMATIONS (use animation-designer skill):
   EACH CARD should have DIFFERENT animation to show variety:
   
   Card 1 (Web Development):
   - Entrance: slide + rotate from right
   - Hover: 3D tilt effect (perspective transform)
   - Icon: code brackets animate typing
   
   Card 2 (Video Editing):
   - Entrance: scale up with blur-to-sharp
   - Hover: film strip / timeline reveal
   - Icon: play button pulses
   
   Card 3 (Tape Conversion):
   - Entrance: "rewind" effect (reverse motion)
   - Hover: VHS glitch effect
   - Icon: tape spins

5. SCROLL ANIMATIONS:
   - Cards stagger in on scroll (from right for RTL)
   - Connecting line draws as user scrolls
   - Background elements parallax
   - Use Intersection Observer for performance

Show potential clients: "We can make YOUR services look this good!"
```

---

## 👥 שלב 6: About Section

```
Use the frontend-design skill to create the About section.

Read CONTENT.md for about content.

src/components/sections/About.tsx:

1. CONTENT (exact text from CONTENT.md):
   - Section title
   - Company description paragraphs
   - Values or unique points (if any)

2. LAYOUT:
   - Two columns on desktop: text RIGHT + illustration LEFT (RTL)
   - Single column on mobile (text first)
   - Creative overlap between elements
   - Break the grid - avoid boring 50/50 split

3. ILLUSTRATION (create with frontend-design skill):
   - Watercolor-style SVG illustration
   - Warm colors from palette
   - Abstract shapes or scene representing creativity/media
   - Animated elements: floating, pulsing, morphing
   - Should feel hand-painted, organic

4. TYPOGRAPHY:
   - Title in "Noa Shalev" with decorative element
   - Body in "Yarden"
   - Pull quote or highlight with special styling
   - Good paragraph spacing for Hebrew

5. ANIMATIONS:
   - Text paragraphs stagger in from right
   - Illustration draws/fades in from left
   - Elements have parallax depth
   - Decorative shapes float in background

Add connecting curved line to next section.
Make it feel warm and personal - show the human side!
```

---

## 🖼️ שלב 7: Portfolio Section (if exists in CONTENT.md)

```
Use the frontend-design skill to create Portfolio/Work section.

Check CONTENT.md - if portfolio content exists, create this section.
If no portfolio content, skip to step 8.

src/components/sections/Portfolio.tsx:

1. CONTENT (from CONTENT.md):
   - Section title
   - Project names and descriptions

2. LAYOUT (creative, not boring grid):
   - Masonry or overlapping layout
   - Different card sizes for variety
   - Responsive (3→2→1 columns)

3. CARD DESIGN:
   - Image placeholder with gradient/pattern
   - Project name with reveal animation
   - Description appears on hover/tap
   - Frame or border with character

4. ANIMATIONS:
   - Staggered reveal with random delays
   - Hover: image zoom + color shift
   - Click: expand for details
   - Cursor interaction effects

Create src/components/ui/PortfolioCard.tsx
Each project should feel like a featured piece!
```

---

## 📞 שלב 8: Contact Section

```
Use the frontend-design skill to create the Contact section.

Read CONTENT.md for contact information and form fields.

src/components/sections/Contact.tsx:

1. CONTENT (exact text from CONTENT.md):
   - Section title
   - Contact info (phone, email, address)
   - Form field labels

2. LAYOUT:
   - Two columns: form RIGHT + contact info LEFT (RTL)
   - Creative division - not just a line
   - Background with subtle pattern or gradient

3. FORM DESIGN (distinctive, not generic):
   - Styled inputs with character
   - Floating labels or unique placeholder style
   - Custom focus states with color
   - Submit button with micro-interaction
   - All Hebrew text from CONTENT.md

4. CONTACT INFO:
   - Icons with watercolor/hand-drawn style
   - Phone, email, location
   - Social media links with hover effects
   - Warm, inviting layout

5. ANIMATIONS:
   - Form fields animate in sequence from right
   - Contact info from left
   - Input focus: glow or expand effect
   - Submit button: satisfying click feedback

Create src/components/ui/Input.tsx and src/components/ui/Button.tsx
Make filling out the form feel delightful!
```

---

## ✨ שלב 9: Connecting Lines & Decorations

```
Use the frontend-design skill AND the animation-designer skill.

Inspiration: microsoft.ai/about curved lines between sections

src/components/ui/ConnectingLine.tsx:

1. DESIGN:
   - Reusable curved SVG path component
   - Bezier curves that flow organically
   - Hand-drawn, slightly imperfect feel
   - Color from accent palette (subtle)

2. ANIMATION:
   - Draws itself on scroll (stroke-dashoffset)
   - Smooth easing
   - Triggers at right scroll position

3. PLACEMENT - Add lines between:
   - Hero → Services (swooping curve)
   - Services → About (flowing S-curve)
   - About → Portfolio/Contact (gentle arc)

4. ADDITIONAL DECORATIONS:
   - Floating watercolor blobs in background
   - Subtle grain/noise texture
   - Small decorative shapes near sections

Lines should guide the eye down the page naturally.
Feel like an artist drew them, not a computer!
```

---

## 🎬 שלב 9.5: Animation Polish & Review

```
Use the animation-designer skill to review and enhance ALL animations.

This is a CRITICAL step - our animations are our proof of skill!

REVIEW CHECKLIST:

1. VARIETY CHECK:
   □ Does each section have DIFFERENT animation style?
   □ Are we showing range of techniques?
   □ No two elements animate the same way?

2. TIMING & EASING:
   □ Entrances feel natural (ease-out)
   □ Exits are quick (ease-in)
   □ Springs have appropriate stiffness
   □ Stagger delays create rhythm

3. MICRO-INTERACTIONS:
   □ Every button has hover + active state
   □ Links have subtle feedback
   □ Form inputs respond to focus
   □ Cards react to hover
   
4. SCROLL EXPERIENCE:
   □ Smooth reveal animations
   □ Parallax adds depth
   □ Nothing jumps or jitters
   □ Works on mobile (60fps)

5. PERFORMANCE:
   □ Animations use transform/opacity only
   □ No layout thrashing
   □ Reduced motion respected
   □ Mobile performance tested

6. THE "WOW" TEST:
   □ Hero makes instant impression
   □ At least 3 "delightful moments"
   □ Animations support content, don't distract
   □ Visitor remembers the experience

ENHANCE weak areas. Add missing micro-interactions.
Remember: This site is our portfolio - every animation matters!
```

---

## 📱 שלב 10: Responsive & Polish

```
Final responsive adjustments and polish.

1. RESPONSIVE CHECK:
   - Mobile: 375px - full experience, not stripped down
   - Tablet: 768px - elegant adaptation
   - Desktop: 1024px+ - full visual impact
   - Fix any RTL issues on all sizes
   - Touch-friendly targets (min 44px)
   - Test hamburger menu

2. PERFORMANCE (use pagespeed-100 skill):
   - Run Lighthouse audit
   - Lazy load images and heavy components
   - Optimize animations for mobile
   - Font loading optimization (font-display: swap)
   - Code splitting if needed

3. SEO (use seo-specialist skill):
   - Meta tags (title, description)
   - Open Graph tags
   - Structured data (JSON-LD)
   - Semantic HTML
   - Alt text for images

4. ACCESSIBILITY:
   - Heading hierarchy (h1→h2→h3)
   - Focus visible states
   - Color contrast (test with tool)
   - Screen reader friendly

5. FINAL POLISH:
   - Smooth scroll behavior
   - Page load animation
   - 404 page (simple but styled)
   - Favicon
   - Loading states

6. TEST:
   - npm run build (no errors)
   - Preview production
   - Test Chrome, Firefox, Safari
   - Test on real mobile device
```

---

## 🔧 פקודות עזר

### שיפור עיצוב:
```
Use the frontend-design skill to improve [component].
Current issue: [describe what looks generic/boring]
Make it more distinctive and memorable.
```

### תיקון RTL:
```
Fix RTL issues in [component]. 
Remember: text-align RIGHT, use inline-start/end, animations from RIGHT.
```

### אופטימיזציית ביצועים:
```
Use the pagespeed-100 skill to optimize performance.
Run Lighthouse audit and fix all issues to reach 100/100.
```

### אופטימיזציית SEO:
```
Use the seo-specialist skill to add SEO.
Add meta tags, Open Graph, structured data, and sitemap.
```

---

## ✅ Checklist לפני Deploy

- [ ] כל הטקסט בעברית מ-CONTENT.md
- [ ] פונטים Noa Shalev + Yarden נטענים
- [ ] RTL עובד בכל המקומות
- [ ] אנימציות חלקות ומשמעותיות
- [ ] עיצוב ייחודי (לא גנרי!)
- [ ] קווים מחברים בין סקשנים
- [ ] Hover effects על כל אלמנט אינטראקטיבי
- [ ] רספונסיבי ומותאם למובייל
- [ ] PageSpeed 90+ בכל הקטגוריות
- [ ] SEO מלא (meta, OG, structured data)
- [ ] נבדק בדפדפנים שונים
- [ ] נבדק במכשיר מובייל אמיתי
