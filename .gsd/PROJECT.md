# MediaWave Israel - Website Upgrade

## Vision
Upgrade MediaWave site (mediawaveisrael.pages.dev) from a generic brochure into a credible business site that proves capability, builds trust, and generates leads.

## Core Problem
The current site has fabricated testimonials damaging credibility, a basic portfolio section, no pricing info, and generic copy. It needs to become a site that serves as its own portfolio piece.

## Target User
Israeli small business owners looking for web development services. Hebrew-speaking, mobile-first browsing.

## Tech Stack
- **Framework**: React 18.3.1 + Vite 6.0.5
- **Styling**: Tailwind CSS v4.1.18
- **Animation**: Framer Motion 12.26.2
- **Language**: TypeScript 5.6.2
- **Icons**: Lucide React
- **Fonts**: Noa Shalev (headlines), Yarden (body), Heebo (fallback)
- **Hosting**: Cloudflare Pages
- **Direction**: RTL (Hebrew)

## Key Constraints
- ALL text from CONTENT.md — never invent Hebrew content
- RTL-first: CSS logical properties, right-aligned layouts
- Mobile-first responsive design
- No italic for Hebrew text
- Must use frontend-design skill for all visual work
- Content changes require Nati's approval (present 2-3 options)
- Prices are suggestions only — Nati must approve before publishing

## Success Criteria
- Fabricated testimonials removed
- Real portfolio showcased convincingly
- Pricing section gives visitors ballpark numbers
- AI chatbot demonstrates technical capability
- Lighthouse 90+ in all categories
- Site serves as its own portfolio piece

## Current State (as of init)
- Testimonials section EXISTS with 4 fake testimonials (carousel)
- Portfolio section EXISTS but basic (yaelevy.co.il only)
- No pricing section
- No chatbot
- No blog
- CONTENT.md is outdated (says no testimonials but they exist)
