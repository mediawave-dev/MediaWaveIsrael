import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import yaelevyScreenshot from '../../assets/yaelevy-screenshot.png'

export default function Portfolio() {
  const containerRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  // Parallax effects
  const bgY1 = useTransform(scrollYProgress, [0, 1], [0, -60])
  const bgY2 = useTransform(scrollYProgress, [0, 1], [0, 80])
  const imageScale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1])
  const imageY = useTransform(scrollYProgress, [0, 0.5], [40, 0])

  return (
    <section
      ref={containerRef}
      id="portfolio"
      className="relative py-24 md:py-32 bg-cream overflow-hidden"
    >
      {/* Background decorations */}
      <motion.div
        className="absolute top-20 left-[10%] w-80 h-80 pointer-events-none"
        style={{ y: bgY1 }}
      >
        <div className="w-full h-full rounded-full bg-orange/6 blur-3xl" />
      </motion.div>
      <motion.div
        className="absolute bottom-32 right-[5%] w-64 h-64 pointer-events-none"
        style={{ y: bgY2 }}
      >
        <div className="w-full h-full rounded-full bg-terracotta/6 blur-3xl" />
      </motion.div>

      {/* Decorative geometric shapes */}
      <motion.div
        className="absolute top-40 right-[15%] w-4 h-4 rounded-full bg-orange/30 hidden lg:block"
        animate={{
          y: [0, -15, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-60 left-[12%] w-3 h-3 rounded-full bg-terracotta/40 hidden lg:block"
        animate={{
          y: [0, 20, 0],
          x: [0, -10, 0],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      <div className="container relative">
        {/* Section Header */}
        <div className="max-w-2xl mb-16 md:mb-24">
          {/* Badge */}
          <motion.span
            className="inline-flex items-center gap-2 bg-terracotta/10 text-terracotta text-sm font-semibold px-5 py-2.5 rounded-full mb-6 backdrop-blur-sm"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="w-2 h-2 bg-terracotta rounded-full animate-pulse" />
            העבודות שלנו
          </motion.span>

          {/* Title */}
          <div className="relative">
            <motion.h2
              className="text-h2 mb-6"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              פרויקט לדוגמה
            </motion.h2>

            {/* Hand-drawn underline */}
            <motion.svg
              className="absolute -bottom-2 right-0 w-48 h-4"
              viewBox="0 0 200 12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <motion.path
                d="M2 8 Q50 2 100 6 T198 4"
                fill="none"
                stroke="var(--color-terracotta)"
                strokeWidth="3"
                strokeLinecap="round"
                className="opacity-50"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
            </motion.svg>
          </div>

          {/* Description */}
          <motion.p
            className="text-lg text-brown-light leading-relaxed mt-10"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            דוגמה לפרויקט שמציג את הגישה שלנו לפיתוח ועיצוב אתרים מקצועיים.
            כל פרויקט נבנה בהתאמה אישית עם דגש על עיצוב ייחודי וחוויית משתמש מעולה.
          </motion.p>
        </div>

        {/* Featured Project - Creative asymmetric layout */}
        <motion.div
          ref={cardRef}
          className="relative"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Main card container */}
          <div className="relative grid lg:grid-cols-12 gap-8 lg:gap-0 items-center">
            {/* Screenshot side - takes 7 columns on desktop */}
            <motion.div
              className="lg:col-span-7 relative z-10"
              style={{ scale: imageScale, y: imageY }}
            >
              {/* Browser window frame */}
              <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden group">
                {/* Browser header */}
                <div className="bg-cream-dark px-4 py-3 flex items-center gap-3 border-b border-cream-darker">
                  {/* Traffic lights */}
                  <div className="flex gap-2">
                    <span className="w-3 h-3 rounded-full bg-coral/60" />
                    <span className="w-3 h-3 rounded-full bg-orange/60" />
                    <span className="w-3 h-3 rounded-full bg-sage/60" />
                  </div>
                  {/* URL bar */}
                  <div className="flex-1 bg-cream rounded-md px-3 py-1.5 text-sm text-brown-muted text-center font-english" dir="ltr">
                    yaelevy.co.il
                  </div>
                </div>

                {/* Screenshot with hover effects */}
                <div className="relative overflow-hidden">
                  <motion.img
                    src={yaelevyScreenshot}
                    alt="yaelevy.co.il - אתר תדמית אישי לעיצוב ואלבומים דיגיטליים"
                    className="w-full h-auto block transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Overlay gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brown-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* View site button on hover */}
                  <motion.a
                    href="https://yaelevy.co.il"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white font-semibold px-6 py-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-orange hover:text-white flex items-center gap-2"
                    style={{ color: '#2A2A2A' }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>צפה באתר</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" x2="21" y1="14" y2="3" />
                    </svg>
                  </motion.a>
                </div>
              </div>

              {/* Decorative elements around the card */}
              <motion.div
                className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-terracotta/10 blur-2xl -z-10"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-orange/10 blur-2xl -z-10"
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              />
            </motion.div>

            {/* Info side - takes 5 columns, overlaps slightly */}
            <motion.div
              className="lg:col-span-5 lg:-mr-12 relative z-20"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 lg:p-10 shadow-xl border border-cream-darker/50">
                {/* Project type badge */}
                <span className="inline-block bg-sage/20 text-brown-dark text-sm font-semibold px-4 py-2 rounded-full mb-6">
                  אתר תדמית אישי
                </span>

                {/* Project title */}
                <h3 className="text-2xl md:text-3xl font-english-display font-semibold text-brown-dark mb-4">
                  yaelevy.co.il
                </h3>

                {/* Description */}
                <p className="text-brown-light leading-relaxed mb-6">
                  אתר תדמית מקצועי מאפשר ללקוחות לגלות את העסק בכל שעה, לצפות בעבודות ולהתרשם מהשירותים - 24/7.
                  הנוכחות הדיגיטלית בונה אמון, יוצרת רושם ראשוני מקצועי, ומקלה על בעל העסק לעדכן תוכן ולנהל פניות בקלות.
                </p>

                {/* Technologies used */}
                <div className="mb-8">
                  <span className="text-sm font-semibold text-brown-dark block mb-3">טכנולוגיות:</span>
                  <div className="flex flex-wrap gap-2">
                    {['React', 'Tailwind CSS', 'Framer Motion', 'Vite'].map((tech) => (
                      <span
                        key={tech}
                        className="bg-cream-dark text-brown text-sm px-3 py-1.5 rounded-lg font-english"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key features */}
                <div className="space-y-3 mb-8">
                  <span className="text-sm font-semibold text-brown-dark block mb-3">מאפיינים עיקריים:</span>
                  {[
                    'עיצוב רספונסיבי מלא',
                    'אנימציות חלקות ומרשימות',
                    'גלריית תמונות אינטראקטיבית',
                    'טופס יצירת קשר מובנה',
                  ].map((feature, index) => (
                    <motion.div
                      key={feature}
                      className="flex items-center gap-3 text-brown-light"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <span className="w-1.5 h-1.5 bg-orange rounded-full flex-shrink-0" />
                      <span>{feature}</span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.a
                  href="https://yaelevy.co.il"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-orange font-semibold px-6 py-3 rounded-full shadow-sm hover:shadow-glow transition-all duration-300 group"
                  style={{ color: '#2A2A2A' }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>בקר באתר</span>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform duration-300 group-hover:-translate-x-1"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" x2="21" y1="14" y2="3" />
                  </svg>
                </motion.a>
              </div>
            </motion.div>
          </div>

          {/* Connecting decorative line - only visible on large screens */}
          <svg
            className="absolute top-1/2 left-0 w-full h-40 pointer-events-none opacity-20 hidden xl:block -translate-y-1/2"
            viewBox="0 0 1000 160"
            preserveAspectRatio="none"
          >
            <motion.path
              d="M0,80 Q250,20 500,80 T1000,60"
              fill="none"
              stroke="var(--color-terracotta)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="8 12"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.5 }}
            />
          </svg>
        </motion.div>

        {/* Bottom CTA - subtle call to action */}
        <motion.div
          className="mt-20 md:mt-28 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-brown-light mb-6 text-lg">
            רוצים אתר כזה לעסק שלכם?
          </p>
          <motion.a
            href="#contact"
            className="inline-flex items-center gap-3 text-orange font-semibold hover:text-orange-dark transition-colors group"
            whileHover={{ x: -4 }}
          >
            <span>בואו נדבר על הפרויקט שלכם</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="rotate-180 transition-transform duration-300 group-hover:-translate-x-1"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </motion.a>
        </motion.div>
      </div>

      {/* Bottom wave transition */}
      <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none">
        <svg
          className="absolute bottom-0 w-full h-full"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0,30 C480,70 960,10 1440,40 L1440,80 L0,80 Z"
            fill="var(--color-cream-dark)"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          />
        </svg>
      </div>
    </section>
  )
}
