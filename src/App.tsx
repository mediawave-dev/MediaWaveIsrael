import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout'
import { Hero, Services, About, Testimonials, FAQ, Contact } from './components/sections'
import { Terms, Privacy, NotFound } from './components/pages'
import LeadModal from './components/LeadModal'

// Home page with all sections
function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Services Section */}
      <Services />

      {/* About Section */}
      <About />

      {/* Testimonials Section */}
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
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}

export default App
