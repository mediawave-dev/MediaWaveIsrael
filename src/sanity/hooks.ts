import { useEffect, useState } from 'react'
import { sanityClient } from './client'
import { previewClient } from './previewClient'
import { usePreview } from './PreviewContext'

export function useSanityQuery<T>(query: string, params?: Record<string, unknown>) {
  const { isPreview } = usePreview()
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const client = isPreview ? previewClient : sanityClient

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    client
      .fetch<T>(query, params ?? {}, { signal: controller.signal })
      .then((result) => {
        setData(result)
        setLoading(false)
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err)
          setLoading(false)
        }
      })

    return () => controller.abort()
  }, [query, JSON.stringify(params), isPreview])

  return { data, loading, error }
}
