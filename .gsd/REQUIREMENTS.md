# Requirements

## V1 (Critical — Must Ship)

### R1: Remove Fabricated Testimonials
- Comment out Testimonials.tsx (don't delete)
- Remove from App.tsx render flow
- Create data-driven testimonial infrastructure for future use
- Update CONTENT.md to reflect reality

### R2: Upgrade Portfolio Section
- Enhance existing Portfolio.tsx with better project cards
- Add data-driven project structure (JSON/config)
- yaelevy.co.il as primary showcase with proper details
- Responsive grid: 1 project=centered, 2+=2-col, 4+=3-col
- Infrastructure ready for adding more projects easily

## V1.5 (High Priority)

### R3: AI Chatbot (Claude API)
- Backend: API endpoint proxying to Claude Haiku
- Frontend: Floating chat widget with RTL support
- System prompt with full business context
- Rate limiting, error handling, conversation management
- Rearrange floating buttons (chatbot, WhatsApp, scroll-to-top)

### R4: Pricing/Packages Section
- 3 pricing cards (Landing Page, Branding Site, Custom)
- "Starting from" pricing (Nati must approve numbers)
- Styled consistently with existing design system
- Update FAQ to reference packages

## V2 (Medium Priority)

### R5: Content & Copy Improvements
- Rewrite generic tagline (propose alternatives)
- Add differentiator points
- Fix repetitive service descriptions

### R6: Technical SEO
- Meta tags, OG tags on all pages
- JSON-LD structured data
- Sitemap & robots.txt verification
- Performance optimization (Lighthouse 90+)

## V3 (Low Priority)

### R7: Blog Infrastructure
- Content collection for posts
- Blog list page + single post page
- 2 initial draft posts

### R8: QA & Final Deploy
- Cross-browser testing
- Content verification
- Final Lighthouse check
