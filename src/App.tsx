import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout'
import { ErrorBoundary } from './components/ErrorBoundary'
import { MotionProvider } from './components/MotionProvider'
import ScrollToTop from './components/ScrollToTop'
import SEO from './components/SEO'

// Above-fold: load immediately
import { Hero } from './components/sections'

// Below-fold: lazy load for better initial performance
const WhyUs = lazy(() => import('./components/sections/WhyUs'))
const Services = lazy(() => import('./components/sections/Services'))
const HowWeWork = lazy(() => import('./components/sections/HowWeWork'))
const Testimonials = lazy(() => import('./components/sections/Testimonials'))
const FAQ = lazy(() => import('./components/sections/FAQ'))
const Contact = lazy(() => import('./components/sections/Contact'))

// Pages: lazy load (rarely accessed)
const Terms = lazy(() => import('./components/pages/Terms'))
const Privacy = lazy(() => import('./components/pages/Privacy'))
const Accessibility = lazy(() => import('./components/pages/Accessibility'))
const Blog = lazy(() => import('./components/pages/Blog'))
const BlogPost = lazy(() => import('./components/pages/BlogPost'))
const NotFound = lazy(() => import('./components/pages/NotFound'))

// Sanity Studio: lazy-loaded, rendered WITHOUT Layout wrapper
const StudioPage = lazy(() => import('./pages/StudioPage'))

// Lead modal appears only after 35s — no reason for it (and lottie-react)
// to sit in the critical bundle
const LeadModal = lazy(() => import('./components/LeadModal'))

// Minimal fallback - reserves space with CSS containment for CLS prevention
const SectionFallback = ({ height = '50vh' }: { height?: string }) => (
  <div style={{ minHeight: height, contain: 'layout' }} aria-hidden="true" />
)

// Home page with all sections - each in separate Suspense for progressive rendering
function HomePage() {
  return (
    <>
      <SEO
        title="MediaWave — פיתוח אתרים מותאם אישית | בנו את הנוכחות הדיגיטלית שלכם"
        description="שירותי פיתוח ועיצוב אתרים מקצועיים לעסקים קטנים ובינוניים. אתרי תדמית, דפי נחיתה ממירים, אופטימיזציה למובייל ו-SEO. יותר פניות, יותר מכירות, יותר הצלחה."
        canonical="/"
      />
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
        <HowWeWork />
      </Suspense>

      <Suspense fallback={<SectionFallback height="400px" />}>
        <Testimonials />
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
        <ScrollToTop />
        <Routes>
          {/* Sanity Studio — full viewport, NO Layout wrapper */}
          <Route path="/studio/*" element={
            <Suspense fallback={<div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>טוען Studio...</div>}>
              <StudioPage />
            </Suspense>
          } />

          {/* All other routes — wrapped in Layout */}
          <Route path="*" element={
            <Layout>
              <Suspense fallback={null}>
                <LeadModal />
              </Suspense>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/blog" element={<Suspense fallback={<SectionFallback />}><Blog /></Suspense>} />
                <Route path="/blog/:slug" element={<Suspense fallback={<SectionFallback />}><BlogPost /></Suspense>} />
                <Route path="/terms" element={<Suspense fallback={<SectionFallback />}><Terms /></Suspense>} />
                <Route path="/privacy" element={<Suspense fallback={<SectionFallback />}><Privacy /></Suspense>} />
                <Route path="/accessibility" element={<Suspense fallback={<SectionFallback />}><Accessibility /></Suspense>} />
                <Route path="*" element={<Suspense fallback={<SectionFallback />}><NotFound /></Suspense>} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </MotionProvider>
    </ErrorBoundary>
  )
}

export default App
