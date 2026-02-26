# Phase 5 / Task 1 — Migrate Testimonials + FAQ

## Goal
Switch Testimonials and FAQ from Sanity to Directus. Medium complexity: Testimonials uses urlFor() for images, FAQ uses PortableText for answers.

## Context
Project: `G:/Web-Dev/MediaWaveIsrael`. Simple sections migrated (Phase 4). These components need image URL and rich text changes.

## Important
- Testimonials: Replace `urlFor(image)` with `assetUrl(fileId)`
- FAQ: Replace `<PortableText value={answer} />` with `<HtmlContent html={answer} />`
- Create prose-hebrew.css with styles from PortableTextComponents.tsx

## Steps

### 1. Update `src/components/sections/Testimonials.tsx`
Read file first. Replace:
```diff
- import { useSanityQuery } from '../../sanity/hooks'
- import { TESTIMONIALS_QUERY } from '../../sanity/queries'
- import { urlFor } from '../../sanity/imageUrl'
+ import { useDirectusQuery } from '../../directus/hooks'
+ import { getTestimonials } from '../../directus/queries'
+ import { mapTestimonial } from '../../directus/mappers'
+ import { assetUrl } from '../../directus/imageUrl'
+ import type { DirectusTestimonial } from '../../directus/types'
```

Image in template:
```diff
- src={urlFor(testimonial.image).width(80).height(80).url()}
+ src={assetUrl(testimonial.image, { width: 80, height: 80, format: 'webp' })}
```

### 2. Update `src/components/sections/FAQ.tsx`
Read file first. Replace:
```diff
- import { useSanityQuery } from '../../sanity/hooks'
- import { FAQ_QUERY } from '../../sanity/queries'
- import { PortableText } from '@portabletext/react'
- import { portableTextComponents } from '../../sanity/PortableTextComponents'
+ import { useDirectusQuery } from '../../directus/hooks'
+ import { getFaqs } from '../../directus/queries'
+ import { mapFaq } from '../../directus/mappers'
+ import { HtmlContent } from '../../directus/HtmlContent'
+ import type { DirectusFaq } from '../../directus/types'
```

Answer rendering:
```diff
- <PortableText value={item.answer} components={portableTextComponents} />
+ <HtmlContent html={item.answer} className="prose-hebrew" />
```

### 3. Create `src/styles/prose-hebrew.css`
Styles matching PortableTextComponents.tsx:
```css
.prose-hebrew h2 { @apply text-2xl md:text-3xl font-headline text-brown-dark mt-8 mb-4; }
.prose-hebrew h3 { @apply text-xl md:text-2xl font-headline text-brown-dark mt-6 mb-3; }
.prose-hebrew h4 { @apply text-lg md:text-xl font-headline text-brown-dark mt-5 mb-2; }
.prose-hebrew p { @apply text-brown-light leading-relaxed mb-4; }
.prose-hebrew blockquote { @apply border-r-4 border-orange pr-4 my-6 text-brown-light italic; }
.prose-hebrew ul { @apply list-disc list-inside space-y-2 mb-4 text-brown-light mr-4; }
.prose-hebrew ol { @apply list-decimal list-inside space-y-2 mb-4 text-brown-light mr-4; }
.prose-hebrew li { @apply leading-relaxed; }
.prose-hebrew strong { @apply font-bold text-brown-dark; }
.prose-hebrew em { @apply text-orange not-italic; }
.prose-hebrew a { @apply text-orange hover:text-orange-dark underline underline-offset-2 transition-colors; }
.prose-hebrew img { @apply rounded-lg w-full; }
.prose-hebrew figcaption { @apply text-sm text-brown-muted mt-2 text-center; }
```

### 4. Import prose-hebrew.css in main styles
Read `src/styles/index.css`, add:
```css
@import './prose-hebrew.css';
```

### 5. Verify build
```bash
npm run build
```

## Acceptance Criteria
- [ ] Testimonials.tsx uses useDirectusQuery + assetUrl (no urlFor)
- [ ] FAQ.tsx uses useDirectusQuery + HtmlContent (no PortableText)
- [ ] prose-hebrew.css created with all styles from PortableTextComponents.tsx
- [ ] prose-hebrew.css imported in main styles
- [ ] Both keep fallback data
- [ ] No Sanity imports in these 2 files
- [ ] `npm run build` succeeds
