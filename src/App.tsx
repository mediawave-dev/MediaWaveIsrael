import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout'
import { ErrorBoundary } from './components/ErrorBoundary'
import { MotionProvider } from './components/MotionProvider'
import ScrollToTop from './components/ScrollToTop'
import SEO from './components/SEO'

// Above-fold: load immediately
import { Hero } from './components/sections'
import Marquee from './components/ui/Marquee'
import { WaveDivider } from './components/ui/WaveDivider'
import { GiantWord } from './components/ui/GiantWord'

// Below-fold: lazy load for better initial performance
const WhyUs = lazy(() => import('./components/sections/WhyUs'))
const Services = lazy(() => import('./components/sections/Services'))
const BeforeAfterShowcase = lazy(() => import('./components/sections/BeforeAfterShowcase'))
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
const ServicePage = lazy(() => import('./components/pages/ServicePage'))
const PortfolioExample = lazy(() => import('./components/pages/PortfolioExample'))
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

// Fallback for whole lazy PAGES: taller than any viewport, so the footer sits
// BELOW the fold while the route chunk loads. The 50vh default put the footer
// at mid-screen and the arriving content pushed it 4000px+ down — a measured
// CLS of exactly 0.50 on cold blog loads (footer impact 0.5 x distance 1.0).
const PageFallback = () => <SectionFallback height="120vh" />

// Home page with all sections - each in separate Suspense for progressive rendering
function HomePage() {
  return (
    <>
      <SEO
        title="MediaWave | פיתוח אתרים מותאם אישית | בנו את הנוכחות הדיגיטלית שלכם"
        description="שירותי פיתוח ועיצוב אתרים מקצועיים לעסקים. אתרי תדמית, דפי נחיתה ממירים, אופטימיזציה למובייל ו-SEO. יותר פניות, יותר מכירות, יותר הצלחה."
        canonical="/"
      />
      {/* Hero Section - loads immediately (above fold, LCP critical) */}
      <Hero />

      {/* Technology marquee strip (DESIGN-UPGRADE §4.2) */}
      <Marquee />

      {/* Below-fold sections - each in separate Suspense for progressive rendering */}
      <Suspense fallback={<SectionFallback height="400px" />}>
        <WhyUs />
      </Suspense>

      <Suspense fallback={<SectionFallback height="600px" />}>
        <Services />
      </Suspense>

      {/* Interactive before/after on the single dark band */}
      <Suspense fallback={<SectionFallback height="400px" />}>
        <BeforeAfterShowcase />
      </Suspense>

      <Suspense fallback={<SectionFallback height="500px" />}>
        <HowWeWork />
      </Suspense>

      <Suspense fallback={<SectionFallback height="400px" />}>
        <Testimonials />
      </Suspense>

      {/* Wave hand-off: HowWeWork (cream) → FAQ (cream-dark) */}
      <WaveDivider variant="c" fill="#F1F5F9" />

      <Suspense fallback={<SectionFallback height="400px" />}>
        <FAQ />
      </Suspense>

      {/* Wave hand-off: FAQ (cream-dark) → Contact (cream) */}
      <WaveDivider variant="a" fill="#F8FAFC" bg="#F1F5F9" />

      {/* Typographic confidence statement (DESIGN-UPGRADE §4.9)
          [קופי: נתי — מילת הענק] */}
      <GiantWord word="מתחילים?" />

      <Suspense fallback={<SectionFallback height="500px" />}>
        <Contact />
      </Suspense>

      {/* Wave hand-off: Contact (cream) → Footer (dark) */}
      <WaveDivider variant="b" fill="#1a1a1a" bg="#F8FAFC" layers={3} />
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
                <Route path="/blog" element={<Suspense fallback={<PageFallback />}><Blog /></Suspense>} />
                <Route path="/blog/:slug" element={<Suspense fallback={<PageFallback />}><BlogPost /></Suspense>} />
                <Route path="/services/:slug" element={<Suspense fallback={<PageFallback />}><ServicePage /></Suspense>} />
                <Route path="/portfolio/:slug" element={<Suspense fallback={<PageFallback />}><PortfolioExample /></Suspense>} />
                <Route path="/terms" element={<Suspense fallback={<PageFallback />}><Terms /></Suspense>} />
                <Route path="/privacy" element={<Suspense fallback={<PageFallback />}><Privacy /></Suspense>} />
                <Route path="/accessibility" element={<Suspense fallback={<PageFallback />}><Accessibility /></Suspense>} />
                <Route path="*" element={<Suspense fallback={<PageFallback />}><NotFound /></Suspense>} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </MotionProvider>
    </ErrorBoundary>
  )
}

export default App
