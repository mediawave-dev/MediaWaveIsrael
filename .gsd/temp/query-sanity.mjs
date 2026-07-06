import 'dotenv/config'
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: '2025-01-01',
  token: process.env.SANITY_WRITE_TOKEN || process.env.VITE_SANITY_PREVIEW_TOKEN,
  useCdn: false,
})

const types = await client.fetch(`array::unique(*[]._type)`)
console.log('DOC TYPES:', JSON.stringify(types))

const services = await client.fetch(`*[_type == "service"] | order(coalesce(order, 99)) {title, "slug": slug.current, shortDescription, tags, "hasBody": defined(body) || defined(sections) || defined(content)}`)
console.log('\nSERVICES (' + services.length + '):')
for (const s of services) console.log(JSON.stringify(s))

const posts = await client.fetch(`*[_type in ["post", "blogPost", "article"]] {_type, title, "slug": slug.current, publishedAt, "bodyLen": length(coalesce(body, content, []))}`)
console.log('\nPOSTS (' + posts.length + '):')
for (const p of posts) console.log(JSON.stringify(p))
