import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* Animated 404 */}
        <motion.div
          className="relative mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Watercolor blob background */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 rounded-full bg-orange/10 blur-3xl" />
          </div>

          {/* 404 number */}
          <h1 className="relative text-[120px] md:text-[180px] font-headline text-orange/20 leading-none select-none">
            404
          </h1>

          {/* Decorative curved line */}
          <motion.svg
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-8"
            viewBox="0 0 160 32"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <motion.path
              d="M10 16 Q40 4 80 16 T150 16"
              fill="none"
              stroke="var(--color-orange)"
              strokeWidth="3"
              strokeLinecap="round"
              className="opacity-50"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </motion.svg>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-3xl md:text-4xl font-headline text-brown-dark mb-4">
            העמוד לא נמצא
          </h2>
          <p className="text-lg text-brown-light mb-8 leading-relaxed">
            מצטערים, העמוד שחיפשתם לא קיים או שהוסר.
            <br />
            אולי תרצו לחזור לדף הבית?
          </p>

          {/* CTA Button */}
          <motion.a
            href="/"
            className="inline-flex items-center gap-2 bg-orange font-semibold py-4 px-8 rounded-full shadow-md hover:shadow-glow hover:bg-orange-dark transition-all duration-300"
            style={{ color: '#FFFFFF' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>חזרה לדף הבית</span>
            <motion.span
              animate={{ x: [0, -4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              ←
            </motion.span>
          </motion.a>
        </motion.div>

        {/* Floating decorative dots */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[
            { top: '20%', left: '10%', size: 8, delay: 0 },
            { top: '30%', right: '15%', size: 6, delay: 0.5 },
            { top: '60%', left: '20%', size: 10, delay: 1 },
            { top: '70%', right: '25%', size: 5, delay: 1.5 },
          ].map((dot, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-orange/30"
              style={{
                width: dot.size,
                height: dot.size,
                top: dot.top,
                left: dot.left,
                right: dot.right,
              }}
              animate={{
                y: [0, -15, 0],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: dot.delay,
              }}
            />
          ))}
        </div>

        {/* Contact info */}
        <motion.p
          className="mt-12 text-sm text-brown-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          צריכים עזרה? התקשרו אלינו:{' '}
          <a href="tel:052-8731808" className="text-orange hover:underline" dir="ltr">
            052-8731808
          </a>
        </motion.p>
      </div>
    </div>
  )
}
