import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout'
import { ErrorBoundary } from './components/ErrorBoundary'
import LeadModal from './components/LeadModal'
import { MotionProvider } from './components/MotionProvider'

// Above-fold: load immediately
import { Hero } from './components/sections'

// Below-fold: lazy load for better initial performance
const WhyUs = lazy(() => import('./components/sections/WhyUs'))
const Services = lazy(() => import('./components/sections/Services'))
const Portfolio = lazy(() => import('./components/sections/Portfolio'))
const HowWeWork = lazy(() => import('./components/sections/HowWeWork'))
const Testimonials = lazy(() => import('./components/sections/Testimonials'))
const ROICalculator = lazy(() => import('./components/sections/ROICalculator'))
const FAQ = lazy(() => import('./components/sections/FAQ'))
const Contact = lazy(() => import('./components/sections/Contact'))

// Pages: lazy load (rarely accessed)
const Terms = lazy(() => import('./components/pages/Terms'))
const Privacy = lazy(() => import('./components/pages/Privacy'))
const Blog = lazy(() => import('./components/pages/Blog'))
const BlogPost = lazy(() => import('./components/pages/BlogPost'))
const NotFound = lazy(() => import('./components/pages/NotFound'))

// Minimal fallback - just reserves space, specific heights for CLS prevention
const SectionFallback = ({ height = '50vh' }: { height?: string }) => (
  <div style={{ minHeight: height }} aria-hidden="true" />
)

// Home page with all sections - each in separate Suspense for progressive rendering
function HomePage() {
  return (
    <>
      {/* Hero Section - loads immediately (above fold, LCP critical) */}
      <Hero />

      {/* Below-fold sections - each in separate Suspense for progressive rendering */}
      <Suspense fallback={<SectionFallback height="400px" />}>
        <WhyUs />
      </Suspense>

      <Suspense fallback={<SectionFallback height="600px" />}>
        <Services />
      </Suspense>

      <Suspense fallback={<SectionFallback height="500px" />}>
        <Portfolio />
      </Suspense>

      <Suspense fallback={<SectionFallback height="500px" />}>
        <HowWeWork />
      </Suspense>

      <Suspense fallback={<SectionFallback height="400px" />}>
        <Testimonials />
      </Suspense>

      <Suspense fallback={<SectionFallback height="450px" />}>
        <ROICalculator />
      </Suspense>

      <Suspense fallback={<SectionFallback height="400px" />}>
        <FAQ />
      </Suspense>

      <Suspense fallback={<SectionFallback height="500px" />}>
        <Contact />
      </Suspense>
    </>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <MotionProvider>
        <Layout>
          <LeadModal />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/blog" element={<Suspense fallback={<SectionFallback />}><Blog /></Suspense>} />
            <Route path="/blog/:slug" element={<Suspense fallback={<SectionFallback />}><BlogPost /></Suspense>} />
            <Route path="/terms" element={<Suspense fallback={<SectionFallback />}><Terms /></Suspense>} />
            <Route path="/privacy" element={<Suspense fallback={<SectionFallback />}><Privacy /></Suspense>} />
            <Route path="*" element={<Suspense fallback={<SectionFallback />}><NotFound /></Suspense>} />
          </Routes>
        </Layout>
      </MotionProvider>
    </ErrorBoundary>
  )
}

export default App
