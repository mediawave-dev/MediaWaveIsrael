export interface Testimonial {
  id: string
  name: string
  business: string
  url?: string
  quote: string
  image?: string
  rating?: number
}

// Empty — add real testimonials here when collected
// Each testimonial requires a real name, business, and quote
// Optional: image (real photo), url (link to their site), rating (1-5)
export const testimonials: Testimonial[] = []
