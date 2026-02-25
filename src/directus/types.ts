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
  answer: string
  sort?: number | null
}

export interface DirectusBlogPost {
  id: number
  title: string
  slug: string
  excerpt?: string | null
  content?: string | null
  featured_image?: string | null
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
  image?: string | null
  image_mobile?: string | null
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
  image?: string | null
  rating?: number | null
  url?: string | null
  sort?: number | null
}

export interface DirectusSiteSettings {
  id: number
  site_name?: string | null
  site_description?: string | null
  logo?: string | null
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
