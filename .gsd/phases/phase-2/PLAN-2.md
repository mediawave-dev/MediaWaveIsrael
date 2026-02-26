# Phase 2 / Task 2 — Queries + ImageUrl + HtmlContent + Mappers + Index

## Goal
Create the remaining 5 files of the SDK integration layer.

## Context
Project: `G:/Web-Dev/MediaWaveIsrael`. Task 1 created client.ts, types.ts, hooks.ts in `src/directus/`.

## Steps

### 1. Create `src/directus/queries.ts`
```typescript
import { readItems, readSingleton } from '@directus/sdk'

export const getServices = () =>
  readItems('services', {
    sort: ['sort'],
    fields: ['id', 'title', 'description', 'lottie_animation', 'lottie_size', 'tags'],
  })

export const getPackages = () =>
  readItems('packages', {
    sort: ['sort'],
    fields: ['id', 'name', 'price', 'description', 'features', 'ideal_for', 'cta', 'cta_link', 'popular'],
  })

export const getWhyUs = () =>
  readItems('why_us', {
    sort: ['sort'],
    fields: ['id', 'title', 'description', 'lottie_animation', 'color'],
  })

export const getHowWeWork = () =>
  readItems('how_we_work', {
    sort: ['sort'],
    fields: ['id', 'step_number', 'title', 'description', 'animation_path'],
  })

export const getFaqs = () =>
  readItems('faqs', {
    sort: ['sort'],
    fields: ['id', 'question', 'answer'],
  })

export const getBlogPosts = () =>
  readItems('blog_posts', {
    sort: ['-published_at'],
    filter: { status: { _eq: 'published' } },
    fields: ['id', 'title', 'slug', 'excerpt', 'featured_image', 'author', 'tags', 'published_at'],
  })

export const getBlogPostBySlug = (slug: string) =>
  readItems('blog_posts', {
    filter: { slug: { _eq: slug } },
    fields: ['id', 'title', 'slug', 'excerpt', 'content', 'featured_image', 'author', 'tags', 'published_at'],
    limit: 1,
  })

export const getProjects = () =>
  readItems('projects', {
    sort: ['sort'],
    fields: ['id', 'title', 'type', 'description', 'url', 'image', 'image_mobile', 'tags', 'features', 'featured', 'self_link'],
  })

export const getTestimonials = () =>
  readItems('testimonials', {
    sort: ['sort'],
    fields: ['id', 'name', 'business', 'quote', 'image', 'rating', 'url'],
  })

export const getSiteSettings = () =>
  readSingleton('site_settings', {
    fields: ['site_name', 'site_description', 'phone', 'email', 'whatsapp_number', 'instagram_url', 'facebook_url', 'address', 'response_time', 'logo'],
  })
```

### 2. Create `src/directus/imageUrl.ts`
```typescript
interface ImageTransformOptions {
  width?: number
  height?: number
  format?: 'webp' | 'jpg' | 'png' | 'avif'
  fit?: 'cover' | 'contain' | 'inside' | 'outside'
  quality?: number
}

const baseUrl = import.meta.env.VITE_DIRECTUS_URL || 'http://localhost:8055'

export function assetUrl(
  fileId: string | null | undefined,
  options?: ImageTransformOptions
): string {
  if (!fileId) return ''
  const params = new URLSearchParams()
  if (options?.width) params.set('width', String(options.width))
  if (options?.height) params.set('height', String(options.height))
  if (options?.format) params.set('format', options.format)
  if (options?.fit) params.set('fit', options.fit)
  if (options?.quality) params.set('quality', String(options.quality))
  const qs = params.toString()
  return `${baseUrl}/assets/${fileId}${qs ? '?' + qs : ''}`
}
```

### 3. Create `src/directus/HtmlContent.tsx`
```typescript
import DOMPurify from 'dompurify'

interface HtmlContentProps {
  html: string | null | undefined
  className?: string
}

const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li',
  'h2', 'h3', 'h4', 'blockquote', 'img', 'figure', 'figcaption',
  'span', 'div', 'code', 'pre',
]

const ALLOWED_ATTR = [
  'href', 'target', 'rel', 'src', 'alt', 'width', 'height',
  'class', 'style', 'dir',
]

export function HtmlContent({ html, className }: HtmlContentProps) {
  if (!html) return null
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ADD_ATTR: ['target'],
  })
  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: clean }} />
  )
}
```

### 4. Create `src/directus/mappers.ts`
One mapper function per collection — converts Directus snake_case to component camelCase:

```typescript
import type { DirectusService, DirectusPackage, DirectusWhyUs, DirectusHowWeWork,
  DirectusFaq, DirectusBlogPost, DirectusProject, DirectusTestimonial,
  DirectusSiteSettings } from './types'

export function mapService(d: DirectusService) {
  return {
    _id: String(d.id), title: d.title, description: d.description,
    lottieAnimation: d.lottie_animation ?? undefined,
    lottieSize: d.lottie_size ?? 128, tags: d.tags ?? [],
  }
}

export function mapPackage(d: DirectusPackage) {
  return {
    _id: String(d.id), name: d.name, price: d.price,
    description: d.description ?? '', features: d.features ?? [],
    idealFor: d.ideal_for ?? '', cta: d.cta ?? 'בואו נדבר',
    ctaLink: d.cta_link ?? '#contact', popular: d.popular ?? false,
  }
}

export function mapWhyUs(d: DirectusWhyUs) {
  return {
    _id: String(d.id), title: d.title, description: d.description,
    lottieAnimation: d.lottie_animation ?? undefined,
    color: d.color ?? 'orange',
  }
}

export function mapHowWeWork(d: DirectusHowWeWork) {
  return {
    _id: String(d.id), stepNumber: d.step_number, title: d.title,
    description: d.description, animationPath: d.animation_path ?? undefined,
  }
}

export function mapFaq(d: DirectusFaq) {
  return { _id: String(d.id), question: d.question, answer: d.answer }
}

export function mapBlogPost(d: DirectusBlogPost) {
  return {
    _id: String(d.id), title: d.title, slug: d.slug,
    excerpt: d.excerpt ?? '', content: d.content ?? '',
    featuredImage: d.featured_image, author: d.author ?? 'MediaWave',
    tags: d.tags ?? [], publishedAt: d.published_at ?? '',
  }
}

export function mapProject(d: DirectusProject) {
  return {
    _id: String(d.id), title: d.title, type: d.type ?? '',
    description: d.description ?? '', url: d.url ?? '',
    image: d.image, imageMobile: d.image_mobile,
    tags: d.tags ?? [], features: d.features ?? [],
    featured: d.featured ?? false, selfLink: d.self_link ?? false,
  }
}

export function mapTestimonial(d: DirectusTestimonial) {
  return {
    _id: String(d.id), name: d.name, business: d.business ?? '',
    quote: d.quote, image: d.image, rating: d.rating ?? 5,
    url: d.url ?? '',
  }
}

export function mapSiteSettings(d: DirectusSiteSettings) {
  return {
    siteName: d.site_name ?? 'MediaWave',
    siteDescription: d.site_description ?? '',
    phone: d.phone ?? '052-8731808',
    email: d.email ?? 'mediawaveisrael@gmail.com',
    whatsappNumber: d.whatsapp_number ?? '052-8731808',
    instagramUrl: d.instagram_url ?? '',
    facebookUrl: d.facebook_url ?? '',
    address: d.address ?? '',
    responseTime: d.response_time ?? '',
    logo: d.logo,
  }
}
```

### 5. Create `src/directus/index.ts`
```typescript
export { directus } from './client'
export { useDirectusQuery } from './hooks'
export { assetUrl } from './imageUrl'
export { HtmlContent } from './HtmlContent'
export * from './queries'
export * from './mappers'
export type * from './types'
```

## Acceptance Criteria
- [ ] `queries.ts` has 10 query functions matching all Sanity GROQ queries
- [ ] `imageUrl.ts` exports `assetUrl()` that builds transform URLs
- [ ] `HtmlContent.tsx` sanitizes HTML with DOMPurify and renders safely
- [ ] `mappers.ts` has 9 mapper functions (one per collection type)
- [ ] Mappers convert snake_case to camelCase matching existing component interfaces
- [ ] `index.ts` barrel exports everything
- [ ] All files have proper TypeScript types
- [ ] `npm run build` succeeds
