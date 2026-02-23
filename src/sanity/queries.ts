export const SERVICES_QUERY = `*[_type == "service"] | order(orderRank) {
  _id, title, description, lottieAnimation, lottieSize, tags
}`

export const PACKAGES_QUERY = `*[_type == "package"] | order(orderRank) {
  _id, name, price, description, features, idealFor, cta, ctaLink, popular
}`

export const FAQ_QUERY = `*[_type == "faq"] | order(orderRank) {
  _id, question, answer
}`

export const BLOG_POSTS_QUERY = `*[_type == "blogPost" && published == true] | order(publishedAt desc) {
  _id, title, slug, excerpt, featuredImage, author, tags, publishedAt
}`

export const BLOG_POST_BY_SLUG_QUERY = `*[_type == "blogPost" && slug.current == $slug][0] {
  _id, title, slug, excerpt, content, featuredImage, author, tags, publishedAt
}`

export const PROJECTS_QUERY = `*[_type == "project"] | order(orderRank) {
  _id, title, type, description, url, image, imageMobile, tags, features, featured, selfLink
}`

export const TESTIMONIALS_QUERY = `*[_type == "testimonial"] | order(orderRank) {
  _id, name, business, quote, image, rating, url
}`

export const WHY_US_QUERY = `*[_type == "whyUs"] | order(orderRank) {
  _id, title, description, lottieAnimation, color
}`

export const HOW_WE_WORK_QUERY = `*[_type == "howWeWork"] | order(orderRank) {
  _id, stepNumber, title, description, animationPath
}`

export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0] {
  siteName, siteDescription, phone, email, whatsappNumber,
  instagramUrl, facebookUrl, address, responseTime, logo
}`
