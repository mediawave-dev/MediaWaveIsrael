import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ReactNode, useRef } from 'react'

interface ServiceCardProps {
  title: string
  description: string
  icon: ReactNode
  index: number
  accentColor?: 'orange' | 'terracotta' | 'coral' | 'sage'
  animationType?: 'tilt3d' | 'glitch' | 'reveal' | 'float' | 'pulse' | 'wave'
}

const accentColors = {
  orange: {
    bg: 'rgba(245, 166, 35, 0.08)',
    blob: 'rgba(245, 166, 35, 0.15)',
    hover: 'rgba(245, 166, 35, 0.12)',
    icon: '#F5A623',
    glow: 'rgba(245, 166, 35, 0.4)',
  },
  terracotta: {
    bg: 'rgba(224, 123, 84, 0.08)',
    blob: 'rgba(224, 123, 84, 0.15)',
    hover: 'rgba(224, 123, 84, 0.12)',
    icon: '#E07B54',
    glow: 'rgba(224, 123, 84, 0.4)',
  },
  coral: {
    bg: 'rgba(242, 139, 130, 0.08)',
    blob: 'rgba(242, 139, 130, 0.15)',
    hover: 'rgba(242, 139, 130, 0.12)',
    icon: '#F28B82',
    glow: 'rgba(242, 139, 130, 0.4)',
  },
  sage: {
    bg: 'rgba(139, 180, 160, 0.08)',
    blob: 'rgba(139, 180, 160, 0.15)',
    hover: 'rgba(139, 180, 160, 0.12)',
    icon: '#8BB4A0',
    glow: 'rgba(139, 180, 160, 0.4)',
  },
}

// Different card shapes for variety
const shapeVariants = [
  'rounded-[32px] rounded-tl-[8px]',
  'rounded-[32px] rounded-tr-[8px]',
  'rounded-[32px] rounded-br-[8px]',
  'rounded-[32px] rounded-bl-[8px]',
  'rounded-[32px] rounded-tl-[48px]',
  'rounded-[32px] rounded-br-[48px]',
]

// Different entrance animations per card
const entranceVariants = {
  // Card 1: Slide + rotate from right
  slideRotate: {
    initial: { opacity: 0, x: 100, rotate: 5 },
    animate: { opacity: 1, x: 0, rotate: 0 },
    transition: { type: 'spring' as const, damping: 20, stiffness: 90 },
  },
  // Card 2: Scale up with blur-to-sharp
  scaleBlur: {
    initial: { opacity: 0, scale: 0.8, filter: 'blur(10px)' },
    animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
  // Card 3: "Rewind" effect - reverse motion
  rewind: {
    initial: { opacity: 0, x: -80, scaleX: -1 },
    animate: { opacity: 1, x: 0, scaleX: 1 },
    transition: { type: 'spring' as const, damping: 15, stiffness: 100 },
  },
  // Card 4: Drop from top with bounce
  dropBounce: {
    initial: { opacity: 0, y: -60 },
    animate: { opacity: 1, y: 0 },
    transition: { type: 'spring' as const, damping: 10, stiffness: 100 },
  },
  // Card 5: Fade + scale from center
  fadeScale: {
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, ease: 'backOut' as const },
  },
  // Card 6: Slide from bottom + rotate
  slideUp: {
    initial: { opacity: 0, y: 80, rotate: -3 },
    animate: { opacity: 1, y: 0, rotate: 0 },
    transition: { type: 'spring' as const, damping: 18, stiffness: 80 },
  },
}

const entranceKeys = Object.keys(entranceVariants) as Array<keyof typeof entranceVariants>

export default function ServiceCard({
  title,
  description,
  icon,
  index,
  accentColor = 'orange',
  animationType = 'tilt3d',
}: ServiceCardProps) {
  const colors = accentColors[accentColor]
  const shape = shapeVariants[index % shapeVariants.length]
  const entrance = entranceVariants[entranceKeys[index % entranceKeys.length]]
  const cardRef = useRef<HTMLElement>(null)

  // 3D Tilt effect values
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const springConfig = { damping: 20, stiffness: 300 }
  const rotateXSpring = useSpring(rotateX, springConfig)
  const rotateYSpring = useSpring(rotateY, springConfig)

  // Glitch offset for VHS effect
  const glitchX = useMotionValue(0)
  const glitchOpacity = useMotionValue(1)

  // Background glow
  const glowOpacity = useTransform(rotateX, [-15, 0, 15], [0.6, 0.3, 0.6])

  const handle3DTilt = (e: React.MouseEvent) => {
    if (!cardRef.current || animationType !== 'tilt3d') return
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY

    // Rotate opposite to mouse direction for natural feel
    rotateY.set(mouseX / 15)
    rotateX.set(-mouseY / 15)
  }

  const handleGlitch = () => {
    if (animationType !== 'glitch') return
    // VHS glitch effect
    const glitchInterval = setInterval(() => {
      glitchX.set((Math.random() - 0.5) * 6)
      glitchOpacity.set(0.8 + Math.random() * 0.2)
    }, 50)

    setTimeout(() => {
      clearInterval(glitchInterval)
      glitchX.set(0)
      glitchOpacity.set(1)
    }, 300)
  }

  const resetTilt = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <motion.article
      ref={cardRef}
      className={`relative group bg-white ${shape} p-8 shadow-card overflow-hidden`}
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
        rotateX: animationType === 'tilt3d' ? rotateXSpring : 0,
        rotateY: animationType === 'tilt3d' ? rotateYSpring : 0,
        x: animationType === 'glitch' ? glitchX : 0,
      }}
      initial={entrance.initial}
      whileInView={entrance.animate}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        ...entrance.transition,
        delay: index * 0.12,
      }}
      onMouseMove={handle3DTilt}
      onMouseEnter={handleGlitch}
      onMouseLeave={resetTilt}
      whileHover={{
        y: animationType !== 'tilt3d' ? -8 : 0,
        boxShadow: `0 20px 40px -12px ${colors.glow}`,
      }}
    >
      {/* Dynamic glow background on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-[inherit]"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${colors.glow}, transparent 70%)`,
          opacity: glowOpacity,
        }}
      />

      {/* Watercolor blob background */}
      <motion.div
        className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
        style={{ background: colors.blob, filter: 'blur(30px)' }}
        initial={{ scale: 0.8, opacity: 0.5 }}
        whileHover={{ scale: 1.3, opacity: 0.9, rotate: 45 }}
        transition={{ duration: 0.5 }}
      />

      {/* Secondary blob with different animation */}
      <motion.div
        className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full pointer-events-none"
        style={{ background: colors.blob, filter: 'blur(25px)' }}
        initial={{ opacity: 0, scale: 0.5 }}
        whileHover={{ opacity: 0.7, scale: 1.2 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      />

      {/* Glitch RGB split overlay for VHS effect */}
      {animationType === 'glitch' && (
        <>
          <motion.div
            className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-0 group-hover:opacity-30"
            style={{
              background: 'linear-gradient(90deg, cyan, transparent, magenta)',
              x: glitchX,
            }}
          />
          {/* Scan lines */}
          <div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
            }}
          />
        </>
      )}

      {/* Icon container with unique animations per type */}
      <motion.div
        className="relative z-10 w-16 h-16 mb-6 flex items-center justify-center"
        whileHover={
          animationType === 'pulse'
            ? { scale: [1, 1.15, 1], transition: { duration: 0.4, repeat: Infinity } }
            : animationType === 'wave'
            ? { rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }
            : { rotate: [0, -5, 5, 0], scale: 1.1, transition: { duration: 0.4 } }
        }
      >
        {/* Layered icon backgrounds */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{ background: colors.bg }}
          animate={{ rotate: 3 }}
          whileHover={{ rotate: 8, scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{ background: colors.bg }}
          animate={{ rotate: -3 }}
          whileHover={{ rotate: -8, scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />

        {/* Icon */}
        <motion.div
          className="relative z-10"
          style={{ color: colors.icon }}
        >
          {icon}
        </motion.div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10">
        <motion.h3
          className="text-xl font-headline text-brown-dark mb-3 transition-colors duration-300 group-hover:text-orange"
        >
          {title}
        </motion.h3>
        <p className="text-brown-light leading-relaxed font-body">
          {description}
        </p>
      </div>

      {/* Animated bottom line reveal */}
      <motion.div
        className="absolute bottom-0 right-0 left-0 h-1 origin-right"
        style={{ background: `linear-gradient(to left, ${colors.icon}, transparent)` }}
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />

      {/* Corner SVG decoration with draw animation */}
      <svg
        className="absolute bottom-4 left-4 w-8 h-8 opacity-0 group-hover:opacity-40 transition-opacity duration-300"
        viewBox="0 0 32 32"
        fill="none"
      >
        <motion.path
          d="M2 30 Q2 16 16 16 Q30 16 30 2"
          stroke={colors.icon}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
        />
      </svg>

      {/* Floating particles on hover */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-60"
            style={{
              background: colors.icon,
              right: `${20 + i * 15}%`,
              bottom: '20%',
            }}
            initial={{ y: 0, opacity: 0 }}
            whileHover={{
              y: [-10, -30, -50],
              opacity: [0, 0.8, 0],
              transition: {
                duration: 1.5,
                delay: i * 0.1,
                repeat: Infinity,
              },
            }}
          />
        ))}
      </div>
    </motion.article>
  )
}
