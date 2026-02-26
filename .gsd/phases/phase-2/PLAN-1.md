# Phase 2 / Task 1 — Directus Client + Types + Hooks

## Goal
Create the first 3 files of the SDK integration layer: client, types, and hooks.

## Context
Project: `G:/Web-Dev/MediaWaveIsrael`. Phase 1 installed `@directus/sdk` and `dompurify`. Create `src/directus/` directory with files mirroring `src/sanity/`.

## Steps

### 1. Create `src/directus/client.ts`
```typescript
import { createDirectus, rest } from '@directus/sdk'

const directusUrl = import.meta.env.VITE_DIRECTUS_URL || 'http://localhost:8055'

export const directus = createDirectus(directusUrl).with(rest())
```

### 2. Create `src/directus/types.ts`
TypeScript interfaces for ALL 10 collections (snake_case matching Directus):

```typescript
export interface DirectusService {
  id: number
  title: string
  description: string
  lottie_animation?: string | null
  lottie_size?: number | null
  tags?: string[] | null
  sort?: number | null
}

export interface DirectusPackage {
  id: number
  name: string
  price: string
  description?: string | null
  features?: string[] | null
  ideal_for?: string | null
  cta?: string | null
  cta_link?: string | null
  popular?: boolean
  sort?: number | null
}

export interface DirectusWhyUs {
  id: number
  title: string
  description: string
  lottie_animation?: string | null
  color?: string | null
  sort?: number | null
}

export interface DirectusHowWeWork {
  id: number
  step_number: string
  title: string
  description: string
  animation_path?: string | null
  sort?: number | null
}

export interface DirectusFaq {
  id: number
  question: string
  answer: string  // HTML string (WYSIWYG)
  sort?: number | null
}

export interface DirectusBlogPost {
  id: number
  title: string
  slug: string
  excerpt?: string | null
  content?: string | null  // HTML string (WYSIWYG)
  featured_image?: string | null  // file UUID
  author?: string | null
  tags?: string[] | null
  published_at?: string | null
  status?: string
}

export interface DirectusProject {
  id: number
  title: string
  type?: string | null
  description?: string | null
  url?: string | null
  image?: string | null  // file UUID
  image_mobile?: string | null  // file UUID
  tags?: string[] | null
  features?: string[] | null
  featured?: boolean
  self_link?: boolean
  sort?: number | null
}

export interface DirectusTestimonial {
  id: number
  name: string
  business?: string | null
  quote: string
  image?: string | null  // file UUID
  rating?: number | null
  url?: string | null
  sort?: number | null
}

export interface DirectusSiteSettings {
  id: number
  site_name?: string | null
  site_description?: string | null
  logo?: string | null  // file UUID
  phone?: string | null
  email?: string | null
  whatsapp_number?: string | null
  instagram_url?: string | null
  facebook_url?: string | null
  address?: string | null
  response_time?: string | null
}

export interface DirectusSchema {
  services: DirectusService[]
  packages: DirectusPackage[]
  why_us: DirectusWhyUs[]
  how_we_work: DirectusHowWeWork[]
  faqs: DirectusFaq[]
  blog_posts: DirectusBlogPost[]
  projects: DirectusProject[]
  testimonials: DirectusTestimonial[]
  site_settings: DirectusSiteSettings
}
```

### 3. Create `src/directus/hooks.ts`
```typescript
import { useEffect, useState, useRef } from 'react'
import { directus } from './client'

export function useDirectusQuery<T>(queryFn: () => any, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const queryFnRef = useRef(queryFn)
  queryFnRef.current = queryFn

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    directus
      .request(queryFnRef.current())
      .then((result: T) => {
        if (!controller.signal.aborted) {
          setData(result)
          setLoading(false)
        }
      })
      .catch((err: Error) => {
        if (!controller.signal.aborted) {
          setError(err)
          setLoading(false)
        }
      })

    return () => controller.abort()
  }, deps)

  return { data, loading, error }
}
```

Hook uses `useRef` for queryFn to avoid stale closures. Optional `deps` array for re-fetching (needed by BlogPost slug changes).

## Acceptance Criteria
- [ ] `src/directus/client.ts` creates a Directus REST client
- [ ] `src/directus/types.ts` has interfaces for all 10 collections + DirectusSchema
- [ ] `src/directus/hooks.ts` exports `useDirectusQuery<T>` returning `{ data, loading, error }`
- [ ] Hook uses AbortController for cleanup
- [ ] Hook accepts optional deps array for re-fetching
- [ ] All types use snake_case matching Directus conventions
- [ ] Optional fields allow null
- [ ] `npm run build` succeeds
