import { useState, useEffect } from 'react'

/**
 * Reactive media-query hook.
 * Returns false on the server / first render (prerender-safe): heavy resources
 * gated by this hook are only mounted after hydration on matching viewports.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    setMatches(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => setMatches(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [query])

  return matches
}
