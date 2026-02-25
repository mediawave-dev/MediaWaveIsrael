interface ImageTransformOptions {
  width?: number
  height?: number
  format?: 'webp' | 'jpg' | 'png' | 'avif'
  fit?: 'cover' | 'contain' | 'inside' | 'outside'
  quality?: number
}

const baseUrl = import.meta.env.VITE_DIRECTUS_URL || 'http://localhost:8055'

export function assetUrl(
  fileId: string | null | undefined,
  options?: ImageTransformOptions
): string {
  if (!fileId) return ''
  const params = new URLSearchParams()
  if (options?.width) params.set('width', String(options.width))
  if (options?.height) params.set('height', String(options.height))
  if (options?.format) params.set('format', options.format)
  if (options?.fit) params.set('fit', options.fit)
  if (options?.quality) params.set('quality', String(options.quality))
  const qs = params.toString()
  return `${baseUrl}/assets/${fileId}${qs ? '?' + qs : ''}`
}
