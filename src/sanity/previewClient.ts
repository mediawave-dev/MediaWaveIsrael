import { createClient } from '@sanity/client'

// Preview client for reading draft documents.
// Token should only be set in dev/staging environments, never production.
export const previewClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || '',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2025-01-01',
  useCdn: false,
  token: import.meta.env.VITE_SANITY_PREVIEW_TOKEN || '',
  perspective: 'previewDrafts',
})
