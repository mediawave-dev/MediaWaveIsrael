import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './src/sanity/schemas'

export default defineConfig({
  name: 'mediawave-studio',
  title: 'MediaWave Studio',
  projectId: import.meta.env.SANITY_STUDIO_PROJECT_ID || 'PLACEHOLDER',
  dataset: import.meta.env.SANITY_STUDIO_DATASET || 'production',
  basePath: '/studio',
  plugins: [
    structureTool(),
    visionTool({ defaultApiVersion: '2025-01-01' }),
  ],
  schema: {
    types: schemaTypes,
  },
})
