import { readItems, readSingleton } from '@directus/sdk'

// Cast SDK functions to bypass strict schema generics.
// Type safety is enforced at the hooks+mappers layer instead.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const items = readItems as any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const singleton = readSingleton as any

export const getServices = () => items('services', {
  sort: ['sort'],
  fields: ['id', 'title', 'description', 'lottie_animation', 'lottie_size', 'tags'],
})

export const getPackages = () => items('packages', {
  sort: ['sort'],
  fields: ['id', 'name', 'price', 'description', 'features', 'ideal_for', 'cta', 'cta_link', 'popular'],
})

export const getWhyUs = () => items('why_us', {
  sort: ['sort'],
  fields: ['id', 'title', 'description', 'lottie_animation', 'color'],
})

export const getHowWeWork = () => items('how_we_work', {
  sort: ['sort'],
  fields: ['id', 'step_number', 'title', 'description', 'animation_path'],
})

export const getFaqs = () => items('faqs', {
  sort: ['sort'],
  fields: ['id', 'question', 'answer'],
})

export const getBlogPosts = () => items('blog_posts', {
  sort: ['-published_at'],
  filter: { status: { _eq: 'published' } },
  fields: ['id', 'title', 'slug', 'excerpt', 'featured_image', 'author', 'tags', 'published_at'],
})

export const getBlogPostBySlug = (slug: string) => items('blog_posts', {
  filter: { slug: { _eq: slug } },
  fields: ['id', 'title', 'slug', 'excerpt', 'content', 'featured_image', 'author', 'tags', 'published_at'],
  limit: 1,
})

export const getProjects = () => items('projects', {
  sort: ['sort'],
  fields: ['id', 'title', 'type', 'description', 'url', 'image', 'image_mobile', 'tags', 'features', 'featured', 'self_link'],
})

export const getTestimonials = () => items('testimonials', {
  sort: ['sort'],
  fields: ['id', 'name', 'business', 'quote', 'image', 'rating', 'url'],
})

export const getSiteSettings = () => singleton('site_settings', {
  fields: ['site_name', 'site_description', 'phone', 'email', 'whatsapp_number', 'instagram_url', 'facebook_url', 'address', 'response_time', 'logo'],
})
