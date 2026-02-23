import type {
  DirectusService, DirectusPackage, DirectusWhyUs, DirectusHowWeWork,
  DirectusFaq, DirectusBlogPost, DirectusProject, DirectusTestimonial,
  DirectusSiteSettings,
} from './types'

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
