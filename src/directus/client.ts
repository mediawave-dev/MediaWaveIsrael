import { createDirectus, rest } from '@directus/sdk'
import type { DirectusSchema } from './types'

const directusUrl = import.meta.env.VITE_DIRECTUS_URL || 'http://localhost:8055'

export const directus = createDirectus<DirectusSchema>(directusUrl).with(rest())
