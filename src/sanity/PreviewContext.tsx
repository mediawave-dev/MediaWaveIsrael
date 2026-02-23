import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface PreviewContextType {
  isPreview: boolean
  exitPreview: () => void
}

const PreviewContext = createContext<PreviewContextType>({
  isPreview: false,
  exitPreview: () => {},
})

export function PreviewProvider({ children }: { children: ReactNode }) {
  const [isPreview, setIsPreview] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('preview') === 'true'
  })

  const exitPreview = useCallback(() => {
    setIsPreview(false)
    // Remove ?preview=true from URL without reload
    const url = new URL(window.location.href)
    url.searchParams.delete('preview')
    window.history.replaceState({}, '', url.toString())
  }, [])

  return (
    <PreviewContext.Provider value={{ isPreview, exitPreview }}>
      {children}
    </PreviewContext.Provider>
  )
}

export const usePreview = () => useContext(PreviewContext)
