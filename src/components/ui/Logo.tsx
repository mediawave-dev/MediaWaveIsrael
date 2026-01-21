import { motion } from 'framer-motion'
import logoImage from '../../assets/mediawave-logo.png'

interface LogoProps {
  /** Size variant */
  variant?: 'header' | 'footer' | 'mobile'
  /** Show text below logo icon */
  showText?: boolean
  /** Custom className */
  className?: string
  /** Whether header is scrolled (for size reduction) */
  isScrolled?: boolean
}

/**
 * MediaWave Logo Component
 * Responsive logo with animations for different placements
 */
export default function Logo({
  variant = 'header',
  showText: _showText = false,
  className = '',
  isScrolled = false,
}: LogoProps) {
  // Note: showText is kept for API compatibility but the new logo includes text
  // Size configurations - Increased by ~35% for better visibility
  const sizes = {
    header: {
      container: isScrolled ? 'h-20' : 'h-32 md:h-44',
    },
    footer: {
      container: 'h-28',
    },
    mobile: {
      container: 'h-20',
    },
  }

  const sizeConfig = sizes[variant]

  return (
    <motion.a
      href="#"
      className={`group flex items-center relative ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Logo image with glow effect on hover */}
      <motion.div
        className={`relative ${sizeConfig.container} transition-all duration-300`}
      >
        {/* Glow effect behind logo */}
        <motion.div
          className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'radial-gradient(circle, rgba(245, 166, 35, 0.3) 0%, transparent 70%)',
            filter: 'blur(8px)',
            transform: 'scale(1.5)',
          }}
        />

        {/* Logo image with transparent background */}
        <motion.img
          src={logoImage}
          alt="MediaWave Israel - בניית אתרים מקצועית"
          className={`${sizeConfig.container} w-auto object-contain relative z-10`}
          loading={variant === 'header' ? 'eager' : 'lazy'}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        />
      </motion.div>

      {/* Decorative blob behind on hover */}
      <motion.div
        className="absolute -z-10 w-16 h-16 bg-orange/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ left: '-8px', top: '-8px' }}
      />
    </motion.a>
  )
}

/**
 * Logo Icon Only - for favicon and small displays
 * Uses SVG recreation of the M wave mark
 */
export function LogoIcon({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2BB8B0" />
          <stop offset="100%" stopColor="#1A8A84" />
        </linearGradient>
        <linearGradient id="logoGradientLight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3DD4CC" />
          <stop offset="100%" stopColor="#2BB8B0" />
        </linearGradient>
      </defs>

      {/* Rounded square background */}
      <rect x="4" y="4" width="56" height="56" rx="12" fill="url(#logoGradient)" />

      {/* M shape with wave styling */}
      <path
        d="M16 44 L16 24 L24 36 L32 24 L40 36 L48 24 L48 44"
        fill="none"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Top accent line */}
      <path
        d="M16 20 L48 20"
        fill="none"
        stroke="url(#logoGradientLight)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  )
}

/**
 * Text-only logo for minimal displays
 */
export function LogoText({
  size = 'md',
  className = '',
}: {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl md:text-3xl',
    lg: 'text-3xl md:text-4xl',
  }

  return (
    <motion.a
      href="#"
      className={`font-english-display ${sizeClasses[size]} text-brown-dark hover:text-orange transition-colors duration-300 ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      MediaWave
    </motion.a>
  )
}
