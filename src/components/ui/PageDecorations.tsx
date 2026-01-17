import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FloatingBlob, FloatingDot, GrainOverlay } from './ConnectingLine'

/**
 * PageDecorations - Global decorative elements that span the entire page
 * Adds connecting lines between sections and floating watercolor elements
 */
export default function PageDecorations() {
  const pageRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()

  // Transform scroll progress for different line animations
  const line1Progress = useTransform(scrollYProgress, [0, 0.2], [0, 1])
  const line2Progress = useTransform(scrollYProgress, [0.15, 0.4], [0, 1])
  const line3Progress = useTransform(scrollYProgress, [0.35, 0.6], [0, 1])
  const line4Progress = useTransform(scrollYProgress, [0.55, 0.8], [0, 1])

  return (
    <>
      {/* Grain texture overlay - very subtle */}
      <GrainOverlay opacity={0.025} />

      {/* Fixed position container for all decorations */}
      <div
        ref={pageRef}
        className="fixed inset-0 pointer-events-none overflow-hidden z-0"
        aria-hidden="true"
      >
        {/* Large watercolor blobs in background */}
        <FloatingBlob
          color="var(--color-orange)"
          size={400}
          blur={100}
          opacity={0.04}
          top="10%"
          right="-5%"
        />
        <FloatingBlob
          color="var(--color-terracotta)"
          size={350}
          blur={80}
          opacity={0.035}
          top="40%"
          left="-8%"
        />
        <FloatingBlob
          color="var(--color-sage)"
          size={300}
          blur={90}
          opacity={0.03}
          top="70%"
          right="5%"
        />
        <FloatingBlob
          color="var(--color-coral)"
          size={250}
          blur={70}
          opacity={0.025}
          bottom="10%"
          left="10%"
        />

        {/* Floating dots scattered across the page */}
        <FloatingDot color="var(--color-orange)" size={8} top="15%" left="8%" delay={0} />
        <FloatingDot color="var(--color-terracotta)" size={6} top="25%" right="12%" delay={0.5} />
        <FloatingDot color="var(--color-sage)" size={10} top="45%" left="5%" delay={1} />
        <FloatingDot color="var(--color-orange)" size={5} top="55%" right="8%" delay={1.5} />
        <FloatingDot color="var(--color-coral)" size={7} top="65%" left="15%" delay={2} />
        <FloatingDot color="var(--color-terracotta)" size={8} top="80%" right="10%" delay={2.5} />
        <FloatingDot color="var(--color-orange)" size={6} top="90%" left="20%" delay={3} />

        {/* Main flowing SVG that spans the viewport */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
        >
          {/* Hero → Services connecting line */}
          <motion.path
            d="M100,8 Q70,12 50,10 Q30,8 0,15"
            stroke="var(--color-orange)"
            strokeWidth="0.15"
            strokeLinecap="round"
            strokeDasharray="0.5 0.8"
            style={{ pathLength: line1Progress, opacity: 0.3 }}
          />

          {/* Services → About connecting line */}
          <motion.path
            d="M0,28 Q30,25 50,30 Q70,35 100,32"
            stroke="var(--color-terracotta)"
            strokeWidth="0.12"
            strokeLinecap="round"
            strokeDasharray="0.4 0.6"
            style={{ pathLength: line2Progress, opacity: 0.25 }}
          />

          {/* About → Portfolio connecting line */}
          <motion.path
            d="M100,50 Q75,48 50,52 Q25,56 0,53"
            stroke="var(--color-sage)"
            strokeWidth="0.1"
            strokeLinecap="round"
            strokeDasharray="0.3 0.5"
            style={{ pathLength: line3Progress, opacity: 0.2 }}
          />

          {/* Portfolio → Contact connecting line */}
          <motion.path
            d="M0,72 Q25,68 50,70 Q75,72 100,68"
            stroke="var(--color-orange)"
            strokeWidth="0.12"
            strokeLinecap="round"
            strokeDasharray="0.4 0.7"
            style={{ pathLength: line4Progress, opacity: 0.25 }}
          />

          {/* Extra decorative swooping line */}
          <motion.path
            d="M0,90 C20,85 40,92 60,88 S80,94 100,90"
            stroke="var(--color-coral)"
            strokeWidth="0.08"
            strokeLinecap="round"
            strokeDasharray="0.3 0.4"
            style={{
              pathLength: useTransform(scrollYProgress, [0.7, 1], [0, 1]),
              opacity: 0.2,
            }}
          />
        </svg>

        {/* Animated geometric shapes */}
        <motion.div
          className="absolute w-16 h-16 border border-orange/10 rounded-lg"
          style={{ top: '20%', left: '5%' }}
          animate={{
            rotate: [0, 90, 180, 270, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 30, repeat: Infinity, ease: 'linear' },
            scale: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
          }}
        />
        <motion.div
          className="absolute w-12 h-12 border border-terracotta/10 rounded-full"
          style={{ top: '50%', right: '8%' }}
          animate={{
            rotate: [360, 270, 180, 90, 0],
            y: [0, -20, 0],
          }}
          transition={{
            rotate: { duration: 25, repeat: Infinity, ease: 'linear' },
            y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
          }}
        />
        <motion.div
          className="absolute w-8 h-8 border border-sage/15"
          style={{ top: '75%', left: '12%', borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }}
          animate={{
            rotate: [0, 180, 360],
            borderRadius: [
              '30% 70% 70% 30% / 30% 30% 70% 70%',
              '70% 30% 30% 70% / 70% 70% 30% 30%',
              '30% 70% 70% 30% / 30% 30% 70% 70%',
            ],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
    </>
  )
}
