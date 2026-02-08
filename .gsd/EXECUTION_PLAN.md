# MediaWave — Execution Plan (GSD)

> **19 atomic tasks** across **8 phases**. Each task = one Claude Code session.
> Copy-paste a task block into a new session to execute it.

---

## Quick Reference

| # | Phase | Task | Time | Approval? | Dependencies |
|---|-------|------|------|-----------|--------------|
| 1 | 1 | Remove testimonials from render | ~15m | No | None |
| 2 | 1 | Data-driven testimonials infra | ~30m | No | Task 1 |
| 3 | 2 | Data-driven portfolio infra | ~45m | No | None |
| 4 | 2 | Polish portfolio cards (design) | ~45m | No | Task 3 |
| 5 | 5 | Chatbot backend API | ~45m | Yes (API key) | None |
| 6 | 5 | Chatbot widget UI | ~60m | No | None |
| 7 | 5 | Chatbot state + integration | ~30m | No | Tasks 5+6 |
| 8 | 5 | Floating buttons rearrange | ~20m | No | Task 7 |
| 9 | 3 | Pricing section (3 cards) | ~45m | Yes (prices) | None |
| 10 | 3 | FAQ update for packages | ~15m | No | Task 9 |
| 11 | 4 | Hero tagline rewrite | ~15m | Yes (copy) | None |
| 12 | 4 | Differentiator points | ~30m | No | None |
| 13 | 4 | Fix service descriptions | ~20m | Yes (copy) | None |
| 14 | 6 | Blog infrastructure | ~45m | No | None |
| 15 | 6 | 2 draft blog posts | ~30m | Yes (content) | Task 14 |
| 16 | 7 | Meta/OG/JSON-LD | ~30m | No | None |
| 17 | 7 | Lighthouse + performance | ~45m | No | All content done |
| 18 | 8 | Cross-browser QA | ~30m | No | All phases |
| 19 | 8 | Deploy to production | ~20m | Yes (deploy) | Task 18 |

**Total estimated: ~9.5 hours of execution**

---

## Tech Stack Context (load with every task)

```
Framework: React 18.3.1 + Vite 6.0.5
Styling: Tailwind CSS v4.1.18
Animation: Framer Motion 12.26.2
Language: TypeScript 5.6.2
Icons: Lucide React
Fonts: Noa Shalev (headlines), Yarden (body), Heebo (fallback)
Hosting: Cloudflare Pages
Direction: RTL (Hebrew)
```

---

## Key Files Map

```
src/App.tsx                              ← Main render flow (section order)
src/components/sections/Testimonials.tsx ← FAKE testimonials (to remove)
src/components/sections/Portfolio.tsx    ← Exists, basic (to upgrade)
src/components/sections/Hero.tsx         ← Hero with tagline
src/components/sections/Services.tsx     ← 6 service cards
src/components/sections/About.tsx        ← Company story
src/components/sections/FAQ.tsx          ← 13 Q&A accordion
src/components/sections/Contact.tsx      ← Form + info
src/components/layout/Header.tsx         ← Nav + mobile menu
src/components/layout/Footer.tsx         ← Footer + WhatsApp button
src/components/layout/Layout.tsx         ← Wrapper + scroll-to-top
src/assets/yaelevy-screenshot.png        ← Portfolio screenshot
CONTENT.md                              ← ALL Hebrew text source
```

---

# PHASE 1: Remove Fabricated Testimonials [CRITICAL]

---

## Task 1 — Remove Testimonials from Render Flow

### Prompt for Claude Code:

```
Read the project at c:\Users\MoriaLevy\OneDrive\Desktop\WebDevelopment\MediaWaveIsrael

TASK: Remove fabricated testimonials section from the live site.

CONTEXT:
- src/components/sections/Testimonials.tsx has 4 fake testimonials (Ron M., Dani L., Yael K., Michal A.)
- They use colored initial avatars instead of real photos — obviously fabricated
- Component is rendered in src/App.tsx
- Tech: React 18 + Vite + Tailwind CSS v4 + Framer Motion + TypeScript

STEPS:
1. Open src/App.tsx
2. Comment out the Testimonials import AND the <Testimonials /> usage
3. Add comment: "// Testimonials: commented out until real testimonials available"
4. Update CONTENT.md testimonials section to note it's disabled
5. Run `npm run build` — verify no TypeScript errors
6. Run `npm run dev` — verify clean transition from About → FAQ

ACCEPTANCE CRITERIA:
- [ ] Testimonials section does NOT render on site
- [ ] Testimonials.tsx file still exists (NOT deleted)
- [ ] No TypeScript/build errors
- [ ] Smooth visual transition between About and FAQ
- [ ] CONTENT.md updated

DO NOT delete Testimonials.tsx. Only comment out its usage.
Commit: "fix(testimonials): comment out fabricated testimonials section"
```

---

## Task 2 — Data-Driven Testimonials Infrastructure

### Prompt for Claude Code:

```
Read the project at c:\Users\MoriaLevy\OneDrive\Desktop\WebDevelopment\MediaWaveIsrael

TASK: Rebuild testimonials as data-driven component that renders only when real data exists.

CONTEXT:
- Testimonials.tsx was commented out in App.tsx (previous task)
- Old component has hardcoded fake data
- Need: data file + refactored component that returns null when empty
- Tech: React 18 + Vite + Tailwind CSS v4 + Framer Motion + TypeScript

STEPS:
1. Create src/data/testimonials.ts with:
   ```typescript
   export interface Testimonial {
     id: string;
     name: string;          // Full name (not initials)
     business: string;      // Business name
     url?: string;          // Link to their site
     quote: string;         // Testimonial text
     image?: string;        // Real photo path
     rating?: number;       // 1-5 stars
   }

   // Empty — add real testimonials here when collected
   export const testimonials: Testimonial[] = [];
   ```

2. Refactor src/components/sections/Testimonials.tsx:
   - Import data from src/data/testimonials.ts
   - Add early return: if (testimonials.length === 0) return null
   - Remove ALL hardcoded fake testimonial data
   - Keep visual design/animations for when data exists
   - No more colored initial circles — require real image field

3. Uncomment Testimonials in App.tsx (it returns null when data is empty)

4. Verify:
   - npm run dev → no testimonials visible (empty data)
   - npm run build → clean build
   - Temporarily add test data → verify renders
   - Revert to empty array

ACCEPTANCE CRITERIA:
- [ ] src/data/testimonials.ts exists with interface + empty array
- [ ] Testimonials.tsx imports from data file
- [ ] Empty data → returns null
- [ ] Component back in App.tsx (renders nothing)
- [ ] Clean build

Commit: "refactor(testimonials): convert to data-driven component"
```

---

# PHASE 2: Upgrade Portfolio Section [CRITICAL]

---

## Task 3 — Data-Driven Portfolio Infrastructure

### Prompt for Claude Code:

```
Read the project at c:\Users\MoriaLevy\OneDrive\Desktop\WebDevelopment\MediaWaveIsrael

TASK: Create data file for portfolio projects and refactor Portfolio.tsx to be data-driven.

CONTEXT:
- Portfolio.tsx exists with basic implementation showing yaelevy.co.il
- Need structured data file for easy addition of future projects
- Screenshot exists: src/assets/yaelevy-screenshot.png
- Tech: React 18 + Vite + Tailwind CSS v4 + Framer Motion + TypeScript
- RTL Hebrew site

STEPS:
1. Create src/data/projects.ts:
   ```typescript
   export interface Project {
     id: string;
     title: string;           // "יעל לוי — טיפול רגשי ואישי"
     type: string;             // "אתר תדמית"
     description: string;      // 2-3 lines
     url: string;              // "https://www.yaelevy.co.il"
     image: string;            // Desktop screenshot path
     imageMobile?: string;
     tags: string[];           // ["WordPress", "עיצוב מותאם", "רספונסיבי", "SEO"]
     featured: boolean;
     selfLink?: boolean;       // Scrolls to top instead of external link
   }
   ```
   Populate with yaelevy.co.il:
   - title: "יעל לוי — טיפול רגשי ואישי"
   - type: "אתר תדמית"
   - description: "אתר תדמית מקצועי למטפלת רגשית. עיצוב מותאם אישית עם דגש על אווירה חמה ומזמינה, ביצועים מהירים, והתאמה מלאה למובייל."
   - url: "https://www.yaelevy.co.il"
   - image: yaelevy-screenshot.png
   - tags: ["WordPress", "עיצוב מותאם", "רספונסיבי", "SEO"]

2. Refactor Portfolio.tsx:
   - Import from data file
   - Replace hardcoded content with data-driven rendering
   - Keep existing animations
   - Responsive grid: 1 project→centered, 2-3→2-col desktop, 4+→3-col
   - Each card: browser mockup image, title, type badge, description, tags, CTA button
   - CTA "צפה באתר ←" opens external link in new tab

3. Verify:
   - npm run dev → portfolio renders yaelevy.co.il
   - Desktop: centered single card
   - Mobile: full-width
   - npm run build → clean

ACCEPTANCE CRITERIA:
- [ ] src/data/projects.ts with typed interface + yaelevy data
- [ ] Portfolio.tsx reads from data file
- [ ] All fields render (image, title, type, description, tags, button)
- [ ] External link opens in new tab
- [ ] Responsive grid logic works
- [ ] Clean build

Commit: "refactor(portfolio): convert to data-driven component"
```

---

## Task 4 — Polish Portfolio Cards (Design)

### Prompt for Claude Code:

```
Read the project at c:\Users\MoriaLevy\OneDrive\Desktop\WebDevelopment\MediaWaveIsrael

TASK: Use the frontend-super skill to make portfolio cards visually impressive.
This section IS the proof of MediaWave's capability — it must look portfolio-worthy.

IMPORTANT: Activate the frontend-super skill first for all visual decisions.

CONTEXT:
- Portfolio is now data-driven (previous task)
- Site aesthetic: warm, watercolor-inspired, professional but friendly
- Design system: cream backgrounds, orange/terracotta accents, sage green
- Fonts: Noa Shalev (headlines), Yarden (body)
- Tech: React 18 + Tailwind CSS v4 + Framer Motion
- RTL Hebrew

DESIGN REQUIREMENTS:
1. Browser mockup frame: Chrome-style dots + address bar around screenshot
2. Hover effect: subtle scale + shadow lift (60fps smooth)
3. Tech tag badges: pill-shaped, site color palette
4. Type badge: small colored label ("אתר תדמית")
5. CTA button: "צפה באתר ←" with hover animation
6. Section decorations: subtle floating organic shapes
7. Scroll-triggered entrance animations (staggered)
8. All RTL-correct

VERIFY:
- Desktop: centered card, ample whitespace
- Mobile: full-width, touch-friendly
- Hover effects smooth (60fps)
- RTL correct
- npm run build → clean

Commit: "feat(portfolio): enhance card design with animations"
```

---

# PHASE 3: Pricing / Packages [HIGH]

---

## Task 9 — Create Pricing Section

### Prompt for Claude Code:

```
Read the project at c:\Users\MoriaLevy\OneDrive\Desktop\WebDevelopment\MediaWaveIsrael

TASK: Create a 3-tier pricing section with package cards.

IMPORTANT: Activate the frontend-super skill for visual design.

CONTEXT:
- No pricing section exists yet
- Placement: Between About/Portfolio section and FAQ in App.tsx
- Must match existing warm design (cream bg, orange accents, subtle borders)
- PRICES ARE SUGGESTIONS — mark with comment that Nati must approve
- Tech: React 18 + Tailwind CSS v4 + Framer Motion + TypeScript
- RTL Hebrew

STEPS:
1. Create src/data/packages.ts:
   ```typescript
   export interface Package {
     id: string;
     name: string;
     price: string;
     description: string;
     features: string[];
     idealFor: string;
     cta: string;
     ctaLink: string;
     popular?: boolean;
   }
   ```

   3 packages:

   Package 1 — דף נחיתה:
   - price: "החל מ-₪1,500"
   - features: ["עמוד אחד רספונסיבי", "עיצוב מותאם אישית", "טופס יצירת קשר", "אופטימיזציית מהירות", "SEO בסיסי"]
   - idealFor: "לעסקים שרוצים נוכחות דיגיטלית מהירה"

   Package 2 — אתר תדמית (popular: true):
   - price: "החל מ-₪3,500"
   - features: ["עד 5 עמודים", "עיצוב מותאם אישית", "רספונסיבי מלא", "SEO מובנה", "אינטגרציית Google Analytics", "טופס יצירת קשר מתקדם", "ליווי עד להשקה"]
   - idealFor: "לעסקים שרוצים אתר מקצועי ומרשים"

   Package 3 — פרויקט מותאם:
   - price: "לפי הצעת מחיר"
   - features: ["אתר מורכב / חנות / אפליקציה", "פיצ'רים מתקדמים (צ'אטבוט AI, אינטגרציות, CMS)", "עיצוב פרימיום", "תמיכה שוטפת"]
   - idealFor: "לעסקים עם צרכים ייחודיים ושאפתניים"

2. Create src/components/sections/Packages.tsx:
   - Section heading: "החבילות שלנו"
   - 3 cards in a row (desktop), stacked (mobile)
   - Middle card elevated + "הכי פופולרי" badge
   - Each card: name, price, features with checkmarks, ideal-for, CTA button
   - CTA "בואו נדבר" scrolls to #contact
   - Staggered entrance animations
   - RTL throughout

3. Integrate into App.tsx — place between About/Portfolio and FAQ

4. Verify: responsive, RTL correct, CTA scrolls, build clean

ACCEPTANCE CRITERIA:
- [ ] 3 pricing cards render correctly
- [ ] Middle card highlighted
- [ ] Responsive (3-col → stacked)
- [ ] CTAs scroll to contact
- [ ] RTL correct
- [ ] Clean build

Commit: "feat(packages): add pricing section with 3 tiers"
```

---

## Task 10 — Update FAQ to Reference Packages

### Prompt for Claude Code:

```
Read the project at c:\Users\MoriaLevy\OneDrive\Desktop\WebDevelopment\MediaWaveIsrael

TASK: Update FAQ answers that discuss pricing to reference the new packages section.

CONTEXT:
- FAQ at src/components/sections/FAQ.tsx has 13 Q&A items
- Packages section now exists above the FAQ
- Pricing-related FAQ answers should point to packages instead of repeating info
- Do NOT change FAQ structure/design — only update text content

STEPS:
1. Read FAQ.tsx — identify pricing-related questions
2. Look for: "מה כולל חבילת הפיתוח?", "יש תשלומים חודשיים?" and similar
3. Update answers to reference packages: "לפירוט מלא, ראו את החבילות שלנו למעלה"
4. Keep same tone, don't remove questions — just update answers
5. Verify: accordion works, RTL correct, build clean

ACCEPTANCE CRITERIA:
- [ ] Pricing FAQ answers reference packages section
- [ ] No duplicate pricing info
- [ ] FAQ structure unchanged
- [ ] RTL accordion works
- [ ] Clean build

Commit: "fix(faq): update pricing answers to reference packages section"
```

---

# PHASE 4: Content & Copy Improvements [MEDIUM]

---

## Task 11 — Rewrite Hero Tagline

### Prompt for Claude Code:

```
Read the project at c:\Users\MoriaLevy\OneDrive\Desktop\WebDevelopment\MediaWaveIsrael

TASK: Propose 2-3 tagline alternatives for the hero section. DO NOT implement without approval.

CONTEXT:
- Hero at src/components/sections/Hero.tsx
- Current tagline is likely generic
- Need compelling, specific Hebrew copy
- Check CONTENT.md for current hero text

STEPS:
1. Read Hero.tsx and CONTENT.md hero section
2. Present 3 tagline options via AskUserQuestion:
   Option 1: "נוכחות דיגיטלית שעובדת בשבילכם"
   Option 2: "האתר שלכם, בדיוק כמו שדמיינתם — רק טוב יותר"
   Option 3: [Based on current site tone — propose your own]
3. For each, propose matching subtitle
4. WAIT for user to select
5. Implement selected option in Hero.tsx
6. Update CONTENT.md
7. Verify: no overflow on mobile, RTL correct, build clean

IMPORTANT: This requires user approval before any changes.

Commit: "feat(hero): update tagline to [selected option]"
```

---

## Task 12 — Add Differentiator Points

### Prompt for Claude Code:

```
Read the project at c:\Users\MoriaLevy\OneDrive\Desktop\WebDevelopment\MediaWaveIsrael

TASK: Add 3 differentiating points section. Use the frontend-super skill.

CONTEXT:
- Placement: In About section or as small separate section near it
- 3 points that set MediaWave apart
- Design: 3 icons in a row, similar to service cards style
- Tech: React 18 + Tailwind CSS v4 + Framer Motion
- RTL Hebrew

CONTENT (from workplan):
1. **טכנולוגיה מתקדמת** — "אנחנו לא משתמשים בתבניות מוכנות. כל אתר נבנה מאפס עם הטכנולוגיות המתקדמות ביותר."
2. **ציון PageSpeed מושלם** — "האתרים שלנו משיגים ציוני ביצועים של 95-100 — כי מהירות זה לא רק חוויית משתמש, זה גם SEO."
3. **ליווי אישי** — "אנחנו operation קטן ובכוונה. אתם מדברים ישירות עם המפתח, בלי middlemen."

STEPS:
1. Read About.tsx — determine if differentiators fit as subsection or need separate component
2. Create the 3-point section with Lucide icons, headings, descriptions
3. Responsive: 3-col desktop, stacked mobile
4. Subtle entrance animations
5. Consistent with site's warm design

ACCEPTANCE CRITERIA:
- [ ] 3 differentiator points visible with icons
- [ ] Responsive layout
- [ ] Consistent design language
- [ ] RTL correct
- [ ] Clean build

Commit: "feat(about): add differentiator points section"
```

---

## Task 13 — Fix Repetitive Service Descriptions

### Prompt for Claude Code:

```
Read the project at c:\Users\MoriaLevy\OneDrive\Desktop\WebDevelopment\MediaWaveIsrael

TASK: Propose unique descriptions for all 6 service cards. DO NOT implement without approval.

CONTEXT:
- Services at src/components/sections/Services.tsx
- Current descriptions repeat "unique design, clean code..." patterns
- Each service needs distinct, specific copy
- Check CONTENT.md for current service descriptions

STEPS:
1. Read Services.tsx and CONTENT.md — list all 6 current descriptions
2. Identify repetitive patterns
3. Write unique description for each service
4. Present ALL 6 via AskUserQuestion for approval
5. WAIT for user selection
6. Implement approved changes
7. Update CONTENT.md
8. Verify: same card layout, RTL correct, build clean

IMPORTANT: Requires user approval. Present all 6 at once. Do NOT change card design/structure.

Commit: "fix(services): replace repetitive descriptions with unique copy"
```

---

# PHASE 5: AI Chatbot [HIGH]

---

## Task 5 — Chatbot Backend API

### Prompt for Claude Code:

```
Read the project at c:\Users\MoriaLevy\OneDrive\Desktop\WebDevelopment\MediaWaveIsrael

TASK: Create API endpoint that proxies chat messages to Claude Haiku API.

CONTEXT:
- Site on Cloudflare Pages — use Pages Functions (functions/ directory)
- Model: Claude Haiku 4.5 (claude-haiku-4-5-20251001)
- API key as environment variable — NEVER in code
- Rate limiting: 20 msgs/conversation, 5 conversations/min/IP
- Max tokens per response: 500
- Expected cost: ~100 conversations/day → less than $2/month

STEPS:
1. Create src/config/chatbot-prompt.ts — system prompt:
   ```
   אתה הנציג הדיגיטלי של MediaWave — חברה ישראלית לפיתוח אתרים.

   ## About MediaWave
   - Custom websites with modern tech (Astro, Next.js, React, WordPress)
   - PageSpeed scores 95-100
   - Close support from concept to launch
   - Personal approach — client talks directly to developer

   ## Services
   - Custom website development, Landing pages, Branding sites
   - Organic SEO, Support & maintenance, Mobile optimization
   - Chatbots and AI solutions

   ## Packages
   - Landing page: Starting from ₪1,500
   - Branding site: Starting from ₪3,500
   - Custom project: By quote

   ## Contact
   - Phone/WhatsApp: 052-8731808
   - Email: mediawaveisrael@gmail.com

   ## Behavior
   - Respond in Hebrew unless client writes in English
   - Friendly, professional, concise (2-4 sentences max)
   - Try to collect: name, business type, what they need, budget
   - End with: "רוצים שנדבר? שלחו הודעה ב-WhatsApp 052-8731808"
   - If asked who built you: "אני נבניתי על ידי MediaWave עם טכנולוגיית AI של Claude"
   - Don't fabricate info not provided here
   ```

2. Create functions/api/chat.ts (Cloudflare Pages Function):
   - POST endpoint
   - Validate request body: { messages: [{role, content}] }
   - Max 10 messages in context
   - Prepend system prompt
   - Call Anthropic Messages API
   - Return response
   - Error handling + CORS headers
   - Input sanitization (XSS)

3. Create .env.example with ANTHROPIC_API_KEY=your-key-here
4. Verify .env in .gitignore

ACCEPTANCE CRITERIA:
- [ ] POST /api/chat responds
- [ ] Uses claude-haiku-4-5-20251001
- [ ] System prompt in config file
- [ ] API key from env var
- [ ] Rate limiting
- [ ] Input validation
- [ ] Hebrew error responses
- [ ] No secrets in code

ASK USER: "Do you have an Anthropic API key ready? I need it set as ANTHROPIC_API_KEY env var."

Commit: "feat(chatbot): add API endpoint with Claude Haiku integration"
```

---

## Task 6 — Chatbot Widget UI

### Prompt for Claude Code:

```
Read the project at c:\Users\MoriaLevy\OneDrive\Desktop\WebDevelopment\MediaWaveIsrael

TASK: Build floating chat widget UI. Use the frontend-super skill.

CONTEXT:
- Position: Bottom-left corner (RTL site)
- Must match site's warm aesthetic
- Tech: React 18 + Tailwind CSS v4 + Framer Motion + Lucide React
- RTL Hebrew throughout

STEPS:
1. Create src/components/ui/ChatWidget.tsx

2. Closed state:
   - Circular button with MessageCircle icon (Lucide)
   - Site's primary orange/warm color
   - Tooltip "שאלו אותי" on hover
   - Subtle pulse animation

3. Open state (Framer Motion slide-up):
   - Panel ~350px wide × ~500px tall
   - Header: dark gradient bg, small MediaWave text, close X button
   - Messages area: scrollable, RTL direction
   - Bot messages: light warm bubble, right-aligned (RTL)
   - User messages: darker bubble, left-aligned (RTL)
   - Typing indicator: 3 animated dots
   - Input: text field placeholder "הקלידו הודעה..." + send button
   - Auto welcome: "שלום! 👋 אני הנציג הדיגיטלי של MediaWave. איך אפשר לעזור?"

4. Interactions:
   - Enter = send, Shift+Enter = new line
   - Empty = send disabled
   - Auto-scroll to latest message
   - Focus trap when open (accessibility)

5. Mobile: near-fullscreen panel, 44px tap targets

6. Integrate into Layout.tsx, z-index above all

ACCEPTANCE CRITERIA:
- [ ] Floating button visible on all pages
- [ ] Open/close animation smooth
- [ ] Bubbles RTL-correct
- [ ] Typing indicator works
- [ ] Keyboard shortcuts work
- [ ] Mobile fullscreen
- [ ] Accessible (ARIA, focus trap)
- [ ] Clean build

Commit: "feat(chatbot): add floating chat widget UI"
```

---

## Task 7 — Chat State Management & API Integration

### Prompt for Claude Code:

```
Read the project at c:\Users\MoriaLevy\OneDrive\Desktop\WebDevelopment\MediaWaveIsrael

TASK: Connect ChatWidget to the API endpoint with state management.

CONTEXT:
- ChatWidget.tsx exists (previous task)
- API at /api/chat exists (task 5)
- Need useChat hook to wire them together
- Tech: React 18 + TypeScript

STEPS:
1. Create src/hooks/useChat.ts:
   ```typescript
   // State: messages[], isLoading, error, messageCount
   // sendMessage(content) → add user msg, call API, add bot response
   // resetConversation() → clear all
   // Keep in memory only (not localStorage)
   // Send last 10 messages as context (cost control)
   ```

2. Wire into ChatWidget:
   - Connect send button to sendMessage
   - Show typing indicator during loading
   - Show errors inline in Hebrew
   - After 20 messages: "תודה על השיחה! לשיחה מעמיקה יותר, צרו קשר בוואטסאפ 052-8731808"
   - Disable input after limit

3. Error handling:
   - API down: "אופס, משהו השתבש. נסו שוב בעוד רגע, או צרו קשר ישירות בוואטסאפ."
   - Network error: retry suggestion
   - Rate limited: "אנא המתינו רגע ונסו שוב"
   - XSS: strip HTML tags before sending

4. Session: close+reopen widget → conversation preserved. Page refresh → cleared.

ACCEPTANCE CRITERIA:
- [ ] Messages send and receive correctly
- [ ] Loading = typing indicator
- [ ] 20-message limit enforced
- [ ] Hebrew error messages
- [ ] XSS prevention
- [ ] Session persistence (close/reopen)
- [ ] Clean build

Commit: "feat(chatbot): add state management and API integration"
```

---

## Task 8 — Rearrange Floating Buttons

### Prompt for Claude Code:

```
Read the project at c:\Users\MoriaLevy\OneDrive\Desktop\WebDevelopment\MediaWaveIsrael

TASK: Organize floating buttons (chatbot, WhatsApp, scroll-to-top) without overlap.

CONTEXT:
- ChatWidget in Layout.tsx (bottom-left)
- WhatsApp button in Footer.tsx
- Scroll-to-top in Layout.tsx
- Need clean arrangement on all screen sizes

LAYOUT:
- Bottom-left (RTL primary): Chatbot (lowest), WhatsApp (above, 16px gap)
- Bottom-right: Scroll-to-top
- When chatbot OPEN: WhatsApp fades out or slides up
- Mobile fullscreen chatbot: hide WhatsApp + scroll-to-top

Z-INDEX ORDER:
- Chatbot panel: highest
- Chatbot button: below panel
- WhatsApp: below chatbot
- Scroll-to-top: lowest floating
- All above page content

STEPS:
1. Read Footer.tsx — find WhatsApp button position
2. Read Layout.tsx — find scroll-to-top position
3. Rearrange per layout above
4. Add chatbot-open state logic to hide/move other buttons
5. Verify: no overlap desktop + mobile, all clickable

ACCEPTANCE CRITERIA:
- [ ] No overlap on any screen size
- [ ] Chatbot most prominent (bottom-left)
- [ ] WhatsApp above chatbot
- [ ] Scroll-to-top bottom-right
- [ ] Mobile fullscreen hides others
- [ ] Clean build

Commit: "fix(layout): rearrange floating buttons for chatbot"
```

---

# PHASE 6: Blog Infrastructure [LOW]

---

## Task 14 — Blog Infrastructure

### Prompt for Claude Code:

```
Read the project at c:\Users\MoriaLevy\OneDrive\Desktop\WebDevelopment\MediaWaveIsrael

TASK: Set up blog system with list page and post page.

CONTEXT:
- React + Vite + React Router (not Astro)
- App.tsx has routes defined with React Router
- Design must match existing warm aesthetic
- RTL Hebrew

STEPS:
1. Create src/data/blog-posts.ts:
   ```typescript
   export interface BlogPost {
     slug: string;
     title: string;
     excerpt: string;
     content: string;
     date: string;        // ISO
     author: string;
     image?: string;
     tags: string[];
     published: boolean;
   }
   export const blogPosts: BlogPost[] = [];
   ```

2. Create src/components/pages/Blog.tsx:
   - Blog list page
   - Card layout: title, date, excerpt, "קראו עוד" link
   - Empty state: "בקרוב — תכנים חדשים בדרך!"
   - RTL, matching typography

3. Create src/components/pages/BlogPost.tsx:
   - Single post page, max-width ~700px
   - Hebrew typography (line-height 1.75)
   - Back button to /blog

4. Add routes in App.tsx: /blog, /blog/:slug
5. Add "הבלוג" link in Header.tsx nav and Footer.tsx

ACCEPTANCE CRITERIA:
- [ ] /blog renders list page (empty state)
- [ ] /blog/:slug renders post page
- [ ] Nav links in header + footer
- [ ] RTL + mobile responsive
- [ ] Clean build

Commit: "feat(blog): add blog infrastructure with routing"
```

---

## Task 15 — Write 2 Draft Blog Posts

### Prompt for Claude Code:

```
Read the project at c:\Users\MoriaLevy\OneDrive\Desktop\WebDevelopment\MediaWaveIsrael

TASK: Write 2 Hebrew blog post drafts and add to data file. These are DRAFTS for review.

CONTEXT:
- Blog infrastructure exists at src/data/blog-posts.ts
- Tone: natural Hebrew, like a tech-savvy friend explaining
- NOT marketing-speak. Conversational, helpful.

POST 1: "למה לעסק שלכם חייב להיות אתר ב-2026"
- Target: Small business owners without a site
- ~600 words Hebrew
- Points: Digital presence, credibility, Google search behavior, WhatsApp isn't enough
- CTA: link to contact section

POST 2: "מה זה PageSpeed ולמה זה קריטי לאתר שלכם"
- Target: Existing site owners
- ~600 words Hebrew
- Points: What scores mean, SEO impact, what MediaWave does differently
- CTA: "רוצים לבדוק את הציון של האתר שלכם? דברו איתנו"

Add both with published: false

Present content to user for review before finalizing.

Commit: "feat(blog): add 2 draft blog posts"
```

---

# PHASE 7: Technical SEO [MEDIUM]

---

## Task 16 — Meta Tags, OG & Structured Data

### Prompt for Claude Code:

```
Read the project at c:\Users\MoriaLevy\OneDrive\Desktop\WebDevelopment\MediaWaveIsrael

TASK: Add comprehensive SEO metadata to all pages.

STEPS:
1. Audit index.html for existing meta/OG tags
2. Add/update for homepage:
   - title: "MediaWave — פיתוח אתרים מותאם אישית | בנו את הנוכחות הדיגיטלית שלכם"
   - meta description, og:title, og:description, og:image
3. Create OG image (1200x630 SVG → reference in public/)
4. Add JSON-LD structured data:
   - LocalBusiness: MediaWave, 052-8731808, mediawaveisrael@gmail.com
   - WebSite: name, URL
   - FAQPage: convert FAQ data to structured format
5. Verify: no duplicate tags, build clean

Commit: "feat(seo): add meta tags, OG tags, and JSON-LD structured data"
```

---

## Task 17 — Performance & Lighthouse Audit

### Prompt for Claude Code:

```
Read the project at c:\Users\MoriaLevy\OneDrive\Desktop\WebDevelopment\MediaWaveIsrael

TASK: Optimize for Lighthouse 90+ in all categories.

STEPS:
1. npm run build → check bundle sizes
2. Verify font-display: swap on all @font-face (src/styles/fonts.css)
3. Verify image lazy loading (except header logo)
4. Check for CLS issues (floating buttons, font loading)
5. Verify ARIA labels on all interactive elements
6. Check color contrast ratios
7. Verify heading hierarchy (h1 → h2 → h3)
8. Check 44px touch targets
9. Add sitemap generation (vite-plugin-sitemap if needed)
10. Verify robots.txt exists
11. Fix all issues found
12. npm run build → verify clean

TARGET: 90+ Performance, Accessibility, Best Practices, SEO

Commit: "perf: optimize for Lighthouse 90+ scores"
```

---

# PHASE 8: QA & Deploy [LOW]

---

## Task 18 — Cross-Browser & Content QA

### Prompt for Claude Code:

```
Read the project at c:\Users\MoriaLevy\OneDrive\Desktop\WebDevelopment\MediaWaveIsrael

TASK: Verify site works across browsers and all content is accurate.

STEPS:
1. npm run build && npm run preview
2. Verify all links: yaelevy.co.il, WhatsApp (052-8731808), email
3. Verify phone: 052-8731808, email: mediawaveisrael@gmail.com
4. Check RTL throughout all sections
5. Check responsive: mobile, tablet, desktop
6. Verify chatbot responds correctly
7. Verify pricing shows correct numbers
8. Check no console.log statements in production code
9. Check no hardcoded secrets
10. Document any issues found, fix critical ones

Commit: "fix: address QA findings"
```

---

## Task 19 — Final Deploy

### Prompt for Claude Code:

```
Read the project at c:\Users\MoriaLevy\OneDrive\Desktop\WebDevelopment\MediaWaveIsrael

TASK: Final quality gate and production deployment.

STEPS:
1. npm run build → verify clean
2. Run final check:
   - No console.log in code
   - No hardcoded secrets
   - .env configured
   - CONTENT.md up to date
   - All git changes committed
3. Verify Cloudflare Pages deployment config
4. If chatbot: verify Worker is configured
5. Post-deploy: browse live site, test contact form, test chatbot, verify OG tags

ASK USER: "Ready to deploy to production? This will merge to main and trigger Cloudflare Pages build."

Commit: "chore: prepare for production deploy"
```

---

## Dependency Graph

```
Phase 1: Task 1 → Task 2
Phase 2: Task 3 → Task 4
Phase 3: Task 9 → Task 10
Phase 4: Task 11, Task 12, Task 13 (independent)
Phase 5: Task 5 ─┐
                  ├→ Task 7 → Task 8
         Task 6 ─┘
Phase 6: Task 14 → Task 15
Phase 7: Task 16, Task 17 (independent, after content phases)
Phase 8: Task 18 → Task 19 (after everything)
```

## Parallelization Opportunities

These can run in **parallel** (no dependencies between them):
- Phase 1 (Tasks 1-2) || Phase 2 (Tasks 3-4)
- Task 5 (backend) || Task 6 (frontend UI)
- Task 11, Task 12, Task 13 (all independent)
- Task 16 || Task 17

---

## Approval Gates

| Task | What Needs Approval | From |
|------|---------------------|------|
| Task 9 | Pricing numbers | Nati |
| Task 11 | Hero tagline selection | Nati |
| Task 13 | Service descriptions | Nati |
| Task 15 | Blog post content | Nati |
| Task 19 | Deploy to production | Nati |
| Task 5 | Anthropic API key | Nati |

---

*Generated 2026-02-08 by GSD Orchestration. Each task is self-contained for fresh-context execution.*
