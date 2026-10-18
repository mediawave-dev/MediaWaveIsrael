import { Component, ErrorInfo, ReactNode } from 'react'
import { isStaleChunkError, reloadOnStaleChunk } from '../utils/stale-chunk'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  /** a chunk of the previous build is gone: the page is reloading, so nothing is drawn */
  stale?: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, stale: isStaleChunkError(error) }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // after a deploy: reload once onto the new build; if that did not help, show the page below
    if (isStaleChunkError(error) && !reloadOnStaleChunk()) this.setState({ stale: false })
    // Log error only in development
    if (import.meta.env.DEV) {
      console.error('Error caught by boundary:', error, errorInfo)
    }
    // In production, you could send to a logging service like Sentry here
  }

  render() {
    if (this.state.hasError && this.state.stale) return null
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-cream" dir="rtl">
          <div className="text-center p-8 max-w-md">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-orange/10 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-orange"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-brown-dark mb-4">
              אופס, משהו השתבש
            </h1>
            <p className="text-brown-light mb-6">
              אנחנו מתנצלים על אי הנוחות. נסו לרענן את הדף.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-orange hover:bg-orange-dark text-white px-6 py-3 rounded-full font-medium transition-colors"
            >
              רענן דף
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
