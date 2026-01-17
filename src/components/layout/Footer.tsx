import { motion } from 'framer-motion'
import { Logo } from '../ui'

const navLinks = [
  { label: 'שירותים', href: '#services' },
  { label: 'תיק עבודות', href: '#portfolio' },
  { label: 'צור קשר', href: '#contact' },
]

const currentYear = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="relative bg-cream-dark overflow-hidden">
      {/* Decorative top border - organic wave shape */}
      <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-l from-transparent via-cream-darker to-transparent" />

      {/* Watercolor decorations */}
      <div className="absolute -top-20 right-1/4 w-64 h-64 watercolor-blob watercolor-orange opacity-20" />
      <div className="absolute -bottom-20 left-1/4 w-48 h-48 watercolor-blob watercolor-terracotta opacity-15" />

      <div className="container relative py-16 md:py-20">
        <div className="grid md:grid-cols-3 gap-12 md:gap-8">

          {/* Logo & Description Column */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <Logo variant="footer" />
            </div>
            <p className="text-brown-light leading-relaxed max-w-xs">
              בניית אתרים ודפי נחיתה מקצועיים לעסקים קטנים ובינוניים
            </p>

            {/* Social proof badges */}
            <div className="flex gap-4 mt-6">
              <div className="flex items-center gap-2 text-sm text-brown-muted">
                <span className="w-2 h-2 bg-orange rounded-full" />
                <span>50+ פרויקטים</span>
              </div>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="md:col-span-1">
            <h4 className="font-headline text-lg text-brown-dark mb-6">ניווט</h4>
            <nav className="flex flex-col gap-3">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className="text-brown hover:text-orange transition-colors duration-300 w-fit group relative"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: -4 }}
                >
                  <span className="relative">
                    {link.label}
                    <motion.span
                      className="absolute -bottom-0.5 right-0 h-px bg-orange rounded-full"
                      initial={{ width: 0 }}
                      whileHover={{ width: '100%' }}
                      transition={{ duration: 0.3 }}
                    />
                  </span>
                </motion.a>
              ))}
            </nav>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-1">
            <h4 className="font-headline text-lg text-brown-dark mb-6">צור קשר</h4>
            <div className="space-y-4">
              {/* Phone */}
              <a
                href="tel:052-8731808"
                className="flex items-center gap-3 text-brown hover:text-orange transition-colors duration-300 group"
              >
                <span className="w-10 h-10 flex items-center justify-center rounded-full bg-cream group-hover:bg-orange/10 transition-colors duration-300">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </span>
                <span dir="ltr">052-8731808</span>
              </a>

              {/* Email */}
              <a
                href="mailto:mediawaveisrael@gmail.com"
                className="flex items-center gap-3 text-brown hover:text-orange transition-colors duration-300 group"
              >
                <span className="w-10 h-10 flex items-center justify-center rounded-full bg-cream group-hover:bg-orange/10 transition-colors duration-300">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </span>
                <span className="text-sm break-all">mediawaveisrael@gmail.com</span>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/972528731808"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-brown hover:text-orange transition-colors duration-300 group"
              >
                <span className="w-10 h-10 flex items-center justify-center rounded-full bg-cream group-hover:bg-orange/10 transition-colors duration-300">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </span>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-cream-darker">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-brown-muted">
            <p>© {currentYear} כל הזכויות שמורות</p>
            <p>
              עוצב ופותח על ידי{' '}
              <a
                href="https://www.mediawave.co.il"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange hover:text-orange-dark transition-colors"
              >
                MediaWave
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button with glow pulse */}
      <motion.a
        href="https://wa.me/972528731808"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-40 w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg flex items-center justify-center"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="צור קשר בוואטסאפ"
      >
        {/* Pulsing ring effect */}
        <motion.span
          className="absolute inset-0 rounded-full bg-[#25D366]"
          animate={{
            scale: [1, 1.4, 1.4],
            opacity: [0.4, 0, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
        <motion.span
          className="absolute inset-0 rounded-full bg-[#25D366]"
          animate={{
            scale: [1, 1.3, 1.3],
            opacity: [0.3, 0, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeOut',
            delay: 0.3,
          }}
        />
        <svg className="relative z-10" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </motion.a>
    </footer>
  )
}
