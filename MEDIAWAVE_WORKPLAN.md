# MediaWave Website — Comprehensive Work Plan

## Goal

Upgrade MediaWave site (mediawaveisrael.pages.dev) from a generic brochure into a credible business site that proves capability, builds trust, and generates leads — including a custom AI chatbot powered by Claude API.

## Technical Context

- **Current stack**: Astro/static site → Cloudflare Pages
- **Site language**: Hebrew (RTL)
- **Current design**: Light gradient background (white→light cyan), service cards with cyan borders, outline icons in cyan, dark typography on light background, dark footer (near-black), floating WhatsApp and scroll-to-top buttons
- **Fonts**: Likely Heebo or Assistant (Google Hebrew fonts)
- **Existing portfolio**: One site only — www.yaelevy.co.il (branding site for emotional therapy, built on WordPress)

---

## Phase 0: Preparation & Asset Collection

### 0.1 — Audit Current State
- `git pull` the current site repo
- Map file structure: pages, components, styles, assets
- Identify all CSS variables / Tailwind config defining the color palette (primary is `#00BCD4` or similar cyan)
- Document the exact font stack from code
- Check for `tailwind.config` or CSS custom properties defining the design system

### 0.2 — Screenshots of yaelevy.co.il
- Capture screenshots (desktop + mobile) from www.yaelevy.co.il using puppeteer or playwright
- Save to `public/portfolio/yaelevy/` — needed for portfolio section
- If no puppeteer access: ask user to provide screenshots (he already has them)

### 0.3 — Workspace Setup
- Verify all dependencies installed (Astro, Tailwind, everything the project needs)
- Create new branch: `feature/website-upgrade-v2`
- Create `docs/` directory if missing, place this plan file there

---

## Phase 1: Remove Fabricated Testimonials (Critical First Fix)

### Why This Comes First
Current testimonials (Ron M., Dani L., Yael K., Michal A.) with colored initials instead of photos — look fabricated. Any experienced business owner will spot this. No testimonials is better than fake ones that damage credibility.

### Task 1.1 — Remove Testimonials Section
- Find the testimonials component (likely includes carousel with dots at bottom)
- **Don't delete the component** — comment it out so we can restore it when real testimonials exist
- Remove the "What they say about us" heading and the name cards with stars

### Task 1.2 — Prepare Infrastructure for Future Testimonials
- Create new testimonials component that reads data from JSON/config file
- Structure per testimonial: `name` (full name), `business` (business name), `url` (link to built site), `quote`, `image` (real photo)
- Component renders only when data exists — meaning it won't show at all right now

---

## Phase 2: Add Portfolio Section

### Design Context
Section must integrate with existing design: light gradient background, cards with subtle cyan border, gentle hover effects. RTL direction.

### Task 2.1 — Create "Our Work" Section
- **Placement**: Right after services section, before FAQ (where testimonials were)
- Main heading: "העבודות שלנו" (styled same as "השירותים שלנו" — cyan/blue heading with dark subtitle)
- Subtitle: "כל פרויקט מותאם אישית לצרכי הלקוח"

### Task 2.2 — Project Card: yaelevy.co.il
- First and primary project card for yaelevy.co.il
- Card design:
  - **Image**: Site screenshot (desktop mockup) with subtle border-radius
  - **Project name**: "יעל לוי — טיפול רגשי ואישי"
  - **Type**: "אתר תדמית"
  - **Short description** (2-3 lines): "אתר תדמית מקצועי למטפלת רגשית. עיצוב מותאם אישית עם דגש על אווירה חמה ומזמינה, ביצועים מהירים, והתאמה מלאה למובייל."
  - **Tech tags** (badges styled like existing "React / WordPress" etc.): `WordPress` · `עיצוב מותאם` · `רספונסיבי` · `SEO`
  - **Button**: "צפה באתר ←" (external link to www.yaelevy.co.il, target="_blank")
- Card styled like existing service cards — white/very light background, subtle cyan border, generous padding

### Task 2.3 — Infrastructure for Future Projects
- Portfolio should read from data file (JSON or Astro content collection)
- Structure per project:
```json
{
  "id": "yaelevy",
  "title": "יעל לוי — טיפול רגשי ואישי",
  "type": "אתר תדמית",
  "description": "אתר תדמית מקצועי למטפלת רגשית...",
  "url": "https://www.yaelevy.co.il",
  "image": "/portfolio/yaelevy/desktop.webp",
  "imageMobile": "/portfolio/yaelevy/mobile.webp",
  "tags": ["WordPress", "עיצוב מותאם", "רספונסיבי", "SEO"],
  "featured": true
}
```
- 1 project → single centered card
- 2+ projects → 2-column grid (desktop), 1-column mobile
- 4+ projects → 3-column grid (desktop)

### Task 2.4 — Add MediaWave Site Itself as Second Project
- The MediaWave site itself is a project worth showcasing!
- Add as second project:
  - **Name**: "MediaWave — אתר עסקי"
  - **Type**: "אתר עסקי + צ'אטבוט AI"
  - **Description**: "האתר שאתם גולשים בו עכשיו. בנוי עם טכנולוגיות מודרניות, ציון PageSpeed מושלם, וצ'אטבוט AI חכם."
  - **Tags**: `Astro` · `Tailwind` · `Claude AI` · `PageSpeed 100`
  - **Button**: "אתם כבר כאן 😊" (link scrolls to top)
- **Note**: Only add this card after Phase 5 (chatbot) is complete

---

## Phase 3: Add Pricing / Packages

### Context
Current FAQ asks "What does the development package include?" and "Are there monthly fees?" but answers aren't visible and no pricing is shown. Potential clients need ballpark numbers.

### Task 3.1 — Create "Our Packages" Section
- **Placement**: Between "About Us" section and FAQ
- **Design**: 3 pricing cards in a row (desktop), stacked on mobile
- Each card in existing style (light background, cyan border, hover)

### Task 3.2 — Package Content
**Important**: Prices below are suggestions — Nati must approve/update them. Display as "Starting from" to maintain flexibility.

**Package 1: Landing Page**
- Price: "Starting from ₪1,500"
- Includes: Single responsive page, custom design, contact form, speed optimization, basic SEO
- Ideal for: "Businesses wanting quick digital presence"
- Button: "בואו נדבר" (scroll to contact section)

**Package 2: Branding Site (Recommended)**
- Price: "Starting from ₪3,500"
- Mark as "Most Popular" (prominent cyan badge)
- Includes: Up to 5 pages, custom design, fully responsive, built-in SEO, Google Analytics integration, advanced contact form, support through launch
- Ideal for: "Businesses wanting a professional, impressive site"
- Button: "בואו נדבר"

**Package 3: Custom Project**
- Price: "By quote"
- Includes: Complex site / e-commerce / web app, advanced features (AI chatbot, integrations, CMS), premium design, ongoing support
- Ideal for: "Businesses with unique, ambitious needs"
- Button: "בואו נדבר"

### Task 3.3 — Update FAQ Accordingly
- Ensure FAQ answers reference packages (don't repeat prices, but point to: "See our packages above")
- If FAQ uses accordion — verify proper RTL display

---

## Phase 4: Content & Copy Improvements

### Task 4.1 — Rewrite Main Tagline
- Current text "We build digital experiences" is too generic
- **Suggested alternatives**: "נוכחות דיגיטלית שעובדת בשבילכם" or "האתר שלכם, בדיוק כמו שדמיינתם — רק טוב יותר"
- Subtitle: "פיתוח אתרים מותאם אישית עם טכנולוגיה מתקדמת, עיצוב מרשים, וליווי צמוד מהרעיון ועד ההשקה."
- **Note for Claude Code**: Propose 2-3 alternatives for Nati to choose. Don't change without approval.

### Task 4.2 — Add Differentiators
- In "About Us" section or as small separate section, add 3 differentiating points:
  1. **Advanced Technology**: "אנחנו לא משתמשים בתבניות מוכנות. כל אתר נבנה מאפס עם הטכנולוגיות המתקדמות ביותר."
  2. **Perfect PageSpeed Score**: "האתרים שלנו משיגים ציוני ביצועים של 95-100 — כי מהירות זה לא רק חוויית משתמש, זה גם SEO."
  3. **Personal Support**: "אנחנו operation קטן ובכוונה. אתם מדברים ישירות עם המפתח, בלי middlemen."
- Design: 3 icons in a row with short text below (styled like existing services section)

### Task 4.3 — Fix Repetitive Service Descriptions
- Current services section repeats the pattern "We'll build you... unique design, clean code..." over and over
- Each service needs a unique, specific description — no copy-paste messaging
- **Note**: Change content carefully, keep similar length, don't modify structure or design

---

## Phase 5: Custom AI Chatbot

### Strategy
Build a custom Claude API-powered chatbot on the site. This achieves three things: (1) proves technical capability, (2) generates leads, (3) becomes a live demo to offer clients.

### Architecture
```
[Floating widget on site — frontend]
        ↓ fetch
[API Route / Serverless Function — backend]
        ↓ Claude Messages API
[Anthropic Claude Haiku 4.5 — $1/$5 per MTok]
```

### Task 5.1 — Backend: API Endpoint
- Create Cloudflare Worker (or Astro API route, depending on project structure) serving as proxy to Claude API
- **Model**: Claude Haiku 4.5 (`claude-haiku-4-5-20251001`) — fastest and cheapest, excellent for chat
- **Expected cost**: ~100 conversations/day × ~10 messages each → less than $2/month
- Anthropic API key **must** be stored as environment variable (Cloudflare Worker secret / .env), never in code
- **Rate limiting**: 20 messages per conversation max, 5 conversations per minute per IP
- **Max tokens per response**: 500 (short, focused answers)

### Task 5.2 — Chatbot System Prompt
Prepare detailed system prompt containing:

```
אתה הנציג הדיגיטלי של MediaWave — חברה ישראלית לפיתוח אתרים.

## About MediaWave
- Specializes in custom websites with modern tech (Astro, Next.js, React, WordPress)
- Achieves PageSpeed scores of 95-100
- Close support from concept to launch and beyond
- Personal approach — client talks directly to the developer

## Services
- Custom website development
- Landing page design
- Branding sites for businesses
- Organic SEO
- Ongoing support & maintenance
- Mobile optimization
- Chatbots and AI solutions for businesses

## Packages & Pricing
- Landing page: Starting from ₪1,500
- Branding site (most popular): Starting from ₪3,500
- Custom project: By quote

## Contact Details
- Phone: 052-8731808
- WhatsApp: 052-8731808
- Email: mediawaveisrael@gmail.com

## Behavior Guidelines
- Always respond in Hebrew, unless client writes in English
- Be friendly, professional, and concise — 2-4 sentences max per response
- If client asks deep technical questions — refer them to direct contact
- Don't fabricate information not provided here
- Try to collect: name, business type, what they need (new site / improve existing), estimated budget
- At end of conversation, suggest WhatsApp contact: "רוצים שנדבר? שלחו הודעה ב-WhatsApp 052-8731808"
- If asked who built the chatbot — answer: "אני נבניתי על ידי MediaWave עם טכנולוגיית AI של Claude. גם לעסק שלכם אפשר לבנות צ'אטבוט כזה!"
```

**Note for Claude Code**: Store system prompt in separate file (e.g. `src/config/chatbot-prompt.ts`) for easy updates without touching code.

### Task 5.3 — Frontend: Floating Widget
- **Position**: Bottom-left corner (because RTL — current WhatsApp button location needs to move)
- **Closed state**: Circle/button with chat icon in site's primary cyan (`#00BCD4` approx) + small tooltip "שאלו אותי 💬"
- **Open state**: Chat panel ~350px wide × ~500px tall (mobile: fullscreen)
- **Panel design**:
  - Header: Dark gradient background (similar to footer), small MediaWave logo, close button
  - Body: White background, messages in bubbles (bot messages — light cyan bubble right side, user messages — gray bubble left side)
  - Input: Text field with placeholder "הקלידו הודעה..." and send button in cyan
  - **Auto welcome message**: "שלום! 👋 אני הנציג הדיגיטלי של MediaWave. איך אפשר לעזור?"
- **Animation**: Smooth slide-up on open, fade-out on close
- **RTL**: All text in dir="rtl", bubbles aligned accordingly
- **z-index**: Must be above all other elements (including WhatsApp button and scroll-to-top)

### Task 5.4 — Conversation State Management
- Store history in memory (state — not localStorage, not cookies)
- Send last 10 messages as context to API (to keep costs low)
- After 20 messages, show: "תודה על השיחה! לשיחה מעמיקה יותר, צרו קשר בוואטסאפ 052-8731808"
- When user closes and reopens in same session — restore conversation

### Task 5.5 — Error Handling & Edge Cases
- If API unavailable: "אופס, משהו השתבש. נסו שוב בעוד רגע, או צרו קשר ישירות בוואטסאפ."
- Loading state: "typing" animation (3 blinking dots) while bot responds
- Empty message: disable send button
- Enter = send, Shift+Enter = new line
- Sanitize all input (XSS prevention)

### Task 5.6 — Floating Buttons Arrangement
- With chatbot addition, rearrange floating buttons:
  - **Chatbot**: Bottom-left corner (most prominent)
  - **WhatsApp**: Above chatbot, 16px gap
  - **Scroll to top**: Bottom-right corner (stays in place)
- Verify no overlap between buttons on mobile

---

## Phase 6: Blog — Basic Infrastructure

### Why
Anyone offering SEO as a service must have a blog. Without content, the claim of SEO expertise is empty.

### Task 6.1 — Set Up Blog Infrastructure
- Create Astro content collection for posts (`src/content/blog/`)
- Main page `/blog` — post list with cards (image, title, date, excerpt)
- Single post page `/blog/[slug]` — reading-optimized layout (max-width ~700px, comfortable typography)
- Add "הבלוג שלנו" link in main nav and footer

### Task 6.2 — 2 Initial Posts (Drafts)
Prepare 2 initial posts for Nati to edit and approve:

**Post 1**: "למה לעסק שלכם חייב להיות אתר ב-2026" (Why your business needs a website in 2026)
- Target audience: Small business owners without a site yet
- Points: Digital presence, credibility, customers search Google, WhatsApp isn't enough
- Length: ~600 words in Hebrew
- CTA at end: Link to contact section

**Post 2**: "מה זה PageSpeed ולמה זה קריטי לאתר שלכם" (What is PageSpeed and why it's critical for your site)
- Target audience: Existing site owners
- Points: What the numbers mean, how it affects SEO, what we do differently
- Length: ~600 words in Hebrew
- CTA: "רוצים לבדוק את הציון של האתר שלכם? דברו איתנו"

**Note**: Write in natural Hebrew, not inflated marketing language. Like a tech-savvy friend explaining.

---

## Phase 7: Technical Improvements & SEO

### Task 7.1 — Meta Tags & OG
- Ensure every page includes: `<title>`, `<meta description>`, `og:title`, `og:description`, `og:image`
- Homepage: "MediaWave — פיתוח אתרים מותאם אישית | בנו את הנוכחות הדיגיטלית שלכם"
- Create dedicated og:image (1200x630) with MediaWave logo on site's gradient background

### Task 7.2 — Schema Markup
- Add JSON-LD structured data:
  - `LocalBusiness` — name, phone, email, service type
  - `WebSite` — name, URL
  - `FAQPage` — convert existing FAQ to structured data

### Task 7.3 — Sitemap & robots.txt
- Verify sitemap.xml auto-generated (Astro supports this)
- Verify robots.txt allows crawling
- Submit to Google Search Console (instruction for Nati)

### Task 7.4 — Performance
- Run Lighthouse on every page, fix all warnings
- Ensure all images in WebP/AVIF with lazy loading
- Ensure font loading doesn't block render (font-display: swap)
- Check for CLS (Cumulative Layout Shift) — especially with new floating buttons

---

## Phase 8: QA, Testing & Deploy

### Task 8.1 — Cross-Browser Testing
- Chrome, Safari, Firefox — desktop
- Chrome Android, Safari iOS — mobile
- Pay special attention to: RTL, chatbot, responsive behavior of new cards

### Task 8.2 — Content Verification
- Verify no Hebrew spelling errors
- Verify all links work (especially yaelevy.co.il, WhatsApp, email)
- Verify chatbot answers common questions correctly

### Task 8.3 — Lighthouse Final Check
- Target: 90+ in all categories (Performance, Accessibility, Best Practices, SEO)
- If pagespeed-100 skill is available — use it here

### Task 8.4 — Deploy
- Merge to main
- Verify Cloudflare Pages build succeeds
- Verify chatbot Cloudflare Worker is active and responding
- Final check on live site

---

## Priority Order

| Priority | Phase | Reason |
|----------|-------|--------|
| 🔴 Critical | Phase 1: Remove testimonials | Currently damaging credibility |
| 🔴 Critical | Phase 2: Portfolio | No proof of capability |
| 🟠 High | Phase 5: Chatbot | Main differentiator + live demo |
| 🟠 High | Phase 3: Pricing | Clients need ballpark numbers |
| 🟡 Medium | Phase 4: Content improvements | Better messaging |
| 🟡 Medium | Phase 7: Technical SEO | Important foundations |
| 🟢 Low | Phase 6: Blog | Long-term investment |
| 🟢 Low | Phase 8: QA | Runs throughout process |

---

## General Guidelines for Claude Code

1. **Design**: Every new addition must use the same CSS variables / Tailwind classes as existing site. Don't invent new colors. The primary cyan, light background, subtle border, shadow — all already defined.

2. **RTL**: All new text in `dir="rtl"`. Every new layout must be tested in RTL. Pay attention to arrow direction, padding, margin.

3. **Mobile first**: Mobile-first design. Every new section must look excellent on mobile before desktop.

4. **Hebrew**: Use natural Hebrew, not translated-sounding text. "בואו נדבר" not "צרו קשר עכשיו!". "העבודות שלנו" not "הפורטפוליו שלנו".

5. **Nati's approval**: Any substantial content change (text, prices, taglines) — present 2-3 alternatives and ask for approval before implementing.

6. **Git**: Commit after each completed task, with clear message in Hebrew.

7. **gsd-orchestration**: Take this document and break each phase into atomic subtasks. Each subtask should be completable in a single Claude Code session. Mark dependencies between tasks.

---

## Important Note on Pricing

**All prices in this document are suggestions only.** Before publishing any price on the site — Nati's approval is mandatory. Nati should define:
- Minimum price per package
- What the base price includes
- What counts as an add-on

---

*Document created 2026-02-08. Intended for execution by Claude Code with gsd-orchestration skill.*