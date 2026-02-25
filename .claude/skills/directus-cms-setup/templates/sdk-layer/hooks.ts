import { useEffect, useState, useRef } from 'react'
import { directus } from './client'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDirectusQuery<T>(queryFn: () => any, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const queryFnRef = useRef(queryFn)
  queryFnRef.current = queryFn

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    directus
      .request(queryFnRef.current())
      .then((result) => {
        if (!controller.signal.aborted) {
          setData(result as T)
          setLoading(false)
        }
      })
      .catch((err: Error) => {
        if (!controller.signal.aborted) {
          setError(err)
          setLoading(false)
        }
      })

    return () => controller.abort()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, loading, error }
}
