import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout'
import { Hero, Services, WhyUs, ROICalculator, Portfolio, Packages, Testimonials, FAQ, Contact } from './components/sections'
import { Terms, Privacy, NotFound, Blog, BlogPost } from './components/pages'
import LeadModal from './components/LeadModal'

// Home page with all sections
function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Why Us Section - show differentiators first */}
      <WhyUs />

      {/* ROI Calculator - show what they're losing */}
      <ROICalculator />

      {/* Services Section - what we offer to fix it */}
      <Services />

      {/* Portfolio Section */}
      <Portfolio />

      {/* Packages / Pricing Section */}
      <Packages />

      {/* Testimonials — renders only when real data exists in data/testimonials.ts */}
      <Testimonials />

      {/* FAQ Section - after testimonials, before contact */}
      <FAQ />

      {/* Contact Section */}
      <Contact />
    </>
  )
}

function App() {
  return (
    <Layout>
      <LeadModal />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}

export default App
