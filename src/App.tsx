import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout'
import { ErrorBoundary } from './components/ErrorBoundary'
import { MotionProvider } from './components/MotionProvider'
import { ScrollEngineProvider } from './motion/ScrollEngineProvider'
import SEO from './components/SEO'
import { testimonials } from './data/testimonials'

// The look (DECISIONS #50): vite.config aliases @look/registry to this build's look, so the
// page ships one look's hero and held scenes (dev: all three, ?look= picks one at boot).
import look from '@look/registry'

// Below-fold: lazy load for better initial performance. The sections are built on the look
// tokens (src/look/sections), so one set serves K, M and KM.
const WhyUs = lazy(() => import('./look/sections/WhyUs'))
const BeforeAfter = lazy(() => import('./look/sections/BeforeAfter'))
const Testimonials = lazy(() => import('./components/sections/Testimonials'))
const Faq = lazy(() => import('./look/sections/Faq'))
const BigWord = lazy(() => import('./look/sections/BigWord'))
const Contact = lazy(() => import('./look/sections/Contact'))

// Pages: lazy load (rarely accessed)
const Terms = lazy(() => import('./components/pages/Terms'))
const Privacy = lazy(() => import('./components/pages/Privacy'))
const Accessibility = lazy(() => import('./components/pages/Accessibility'))
const ServicePage = lazy(() => import('./components/pages/ServicePage'))
const PortfolioExample = lazy(() => import('./components/pages/PortfolioExample'))
const NotFound = lazy(() => import('./components/pages/NotFound'))

// Style board (dev only): the redesign directions for Gate 1. Never built:
// import.meta.env.DEV is a literal false in production, so Rollup drops the import.
const Board = import.meta.env.DEV ? lazy(() => import('./board/Board')) : null
// The button families' seven states, for screenshots (dev only, same reason)
const States = import.meta.env.DEV ? lazy(() => import('./look/dev/States')) : null

// Sanity Studio: lazy-loaded, rendered WITHOUT Layout wrapper
const StudioPage = lazy(() => import('./pages/StudioPage'))

// Lead modal appears only after 35s — no reason for it (and lottie-react)
// to sit in the critical bundle
const LeadModal = lazy(() => import('./components/LeadModal'))

/** A section not yet rebuilt for the looks: painted on its old cream ground (looks.css). */
const Legacy = ({ theme, children }: { theme: 'light' | 'dark'; children: React.ReactNode }) => (
  <div className="legacy" data-theme={theme}>{children}</div>
)

// Minimal fallback - reserves space with CSS containment for CLS prevention
const SectionFallback = ({ height = '50vh' }: { height?: string }) => (
  <div style={{ minHeight: height, contain: 'layout' }} aria-hidden="true" />
)

// Fallback for whole lazy PAGES: taller than any viewport, so the footer sits
// BELOW the fold while the route chunk loads. The 50vh default put the footer
// at mid-screen and the arriving content pushed it 4000px+ down — a measured
// CLS of exactly 0.50 on cold route loads (footer impact 0.5 x distance 1.0).
const PageFallback = () => <SectionFallback height="120vh" />

// Home page with all sections - each in separate Suspense for progressive rendering
function HomePage() {
  return (
    <>
      <SEO
        title="פיתוח אתרים ודפי נחיתה מותאמים לעסקים"
        description="שירותי פיתוח ועיצוב אתרים מקצועיים לעסקים. אתרי תדמית, דפי נחיתה ממירים, אופטימיזציה למובייל ו-SEO. יותר פניות, יותר מכירות, יותר הצלחה."
        canonical="/"
      />
      {/* Hero: the look's stage or void, loads immediately (the H1 is the LCP) */}
      <look.Hero />

      {/* KM: still on the stage, the screens switch on */}
      <Suspense fallback={<SectionFallback height="900px" />}>
        <WhyUs />
      </Suspense>

      {/* The look's signature hold (KM: the lights come up, the flight) */}
      <Suspense fallback={<SectionFallback height="600px" />}>
        <look.Services />
      </Suspense>

      {/* Back on the stage: the free stretch between the two holds */}
      <Suspense fallback={<SectionFallback height="800px" />}>
        <BeforeAfter />
      </Suspense>

      {/* KM: the launch hold; K and M: the line through four screens */}
      <Suspense fallback={<SectionFallback height="800px" />}>
        <look.Process />
      </Suspense>

      {/* Only real, owner-confirmed testimonials ever render (honesty rule).
          While the list is empty the section is not mounted at all: no empty
          400px fallback, no chunk download. */}
      {testimonials.length > 0 && (
        <Legacy theme="light">
          <Suspense fallback={<SectionFallback height="400px" />}>
            <Testimonials />
          </Suspense>
        </Legacy>
      )}

      {/* The rest beat, in the void */}
      <Suspense fallback={<SectionFallback height="1200px" />}>
        <Faq />
      </Suspense>

      {/* Back on the stage for the ask: the giant word [קופי: נתי, approved #54], the form */}
      <Suspense fallback={<SectionFallback height="300px" />}>
        <BigWord />
      </Suspense>
      <Suspense fallback={<SectionFallback height="900px" />}>
        <Contact />
      </Suspense>
    </>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <MotionProvider>
        <ScrollEngineProvider>
        <Routes>
          {/* Sanity Studio — full viewport, NO Layout wrapper */}
          <Route path="/studio/*" element={
            <Suspense fallback={<div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>טוען Studio...</div>}>
              <StudioPage />
            </Suspense>
          } />

          {Board && (
            <Route path="/board/*" element={<Suspense fallback={<PageFallback />}><Board /></Suspense>} />
          )}
          {States && (
            <Route path="/states" element={<Suspense fallback={<PageFallback />}><States /></Suspense>} />
          )}

          {/* All other routes — wrapped in Layout */}
          <Route path="*" element={
            <Layout>
              <Suspense fallback={null}>
                <LeadModal />
              </Suspense>
              <Routes>
                <Route path="/" element={<HomePage />} />
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
        </ScrollEngineProvider>
      </MotionProvider>
    </ErrorBoundary>
  )
}

export default App
