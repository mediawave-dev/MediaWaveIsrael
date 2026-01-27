import { Layout } from './components/layout'
import { Hero, Services, About, Portfolio, Testimonials, FAQ, Contact } from './components/sections'

function App() {
  return (
    <Layout>
      {/* Hero Section */}
      <Hero />

      {/* Services Section */}
      <Services />

      {/* About Section */}
      <About />

      {/* Portfolio Section */}
      <Portfolio />

      {/* Testimonials Section */}
      <Testimonials />

      {/* FAQ Section - after testimonials, before contact */}
      <FAQ />

      {/* Contact Section */}
      <Contact />
    </Layout>
  )
}

export default App
