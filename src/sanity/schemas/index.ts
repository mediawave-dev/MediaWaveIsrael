import blockContent from './blockContent'
import service from './service'
import packageType from './package'
import faq from './faq'
import blogPost from './blogPost'
import project from './project'
import testimonial from './testimonial'
import siteSettings from './siteSettings'
import whyUs from './whyUs'
import howWeWork from './howWeWork'

export const schemaTypes = [
  // Portable Text
  blockContent,

  // Content types
  service,
  packageType,
  faq,
  blogPost,
  project,
  testimonial,

  // Singletons
  siteSettings,

  // Sections
  whyUs,
  howWeWork,
]
