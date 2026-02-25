import imageUrlBuilder from '@sanity/image-url'
import { sanityClient } from './client'
import type { SanityImageSource } from '@sanity/image-url'

const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}
