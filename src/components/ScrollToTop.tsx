import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Scrolls to the top on every route (pathname) change.
 * Hash-only changes (#services) are left to the in-page scroll handlers.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()
  const prevPathname = useRef(pathname)

  useEffect(() => {
    if (prevPathname.current !== pathname && !hash) {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    }
    prevPathname.current = pathname
  }, [pathname, hash])

  return null
}
