import { forwardRef, useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { useAmbientMotion } from '../../hooks/useReducedMotion'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  loadingText?: string
  icon?: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  className?: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      loadingText,
      icon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const [isPressed, setIsPressed] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    // Ambient micro-loops (shine sweep, icon nudge) stop only via the a11y widget
    const ambient = useAmbientMotion()

    // Size styles
    const sizeStyles = {
      sm: 'py-3 px-6 text-base',
      md: 'py-4 px-10 text-xl',
      lg: 'py-5 px-12 text-xl',
    }

    // Variant styles - dark text on light blue for better visibility
    const variantStyles = {
      primary: 'bg-orange hover:bg-orange-dark',
      secondary: 'bg-white text-brown-dark border-2 border-cream-darker hover:border-orange hover:text-orange',
      ghost: 'bg-transparent text-brown hover:bg-cream-dark hover:text-orange',
    }

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled && !isLoading) {
        setIsPressed(true)
        setTimeout(() => setIsPressed(false), 150)

        // Show success animation for submit buttons
        if (props.type === 'submit') {
          setShowSuccess(true)
          setTimeout(() => setShowSuccess(false), 1000)
        }

        props.onClick?.(e)
      }
    }

    // Text color styles for variants (inline to override any CSS)
    const textColorStyles = {
      primary: { color: '#1e3a5f' },
      secondary: {},
      ghost: {},
    }

    return (
      <m.button
        ref={ref}
        {...props}
        className={`
          relative overflow-hidden font-semibold rounded-full
          transition-[transform,background-color,box-shadow,opacity] duration-300
          disabled:opacity-50 disabled:cursor-not-allowed
          active:scale-[0.97] active:opacity-90
          ${sizeStyles[size]}
          ${variantStyles[variant]}
          ${className}
        `}
        style={textColorStyles[variant]}
        disabled={disabled || isLoading}
        onClick={handleClick}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        {/* Ripple effect on click */}
        <AnimatePresence>
          {isPressed && variant === 'primary' && (
            <m.span
              className="absolute inset-0 bg-white/30 rounded-full"
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{ transformOrigin: 'center' }}
            />
          )}
        </AnimatePresence>

        {/* Shine effect */}
        {variant === 'primary' && (
          <m.span
            className="absolute inset-0 bg-linear-to-l from-transparent via-white/20 to-transparent -translate-x-full"
            animate={ambient ? { x: ['calc(-100%)', 'calc(200%)'] } : undefined}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: 'easeInOut',
            }}
          />
        )}

        {/* Glow effect for primary */}
        {variant === 'primary' && !disabled && (
          <m.div
            className="absolute inset-0 rounded-full pointer-events-none opacity-0 group-hover:opacity-100"
            whileHover={{ opacity: 1 }}
            style={{
              boxShadow: '0 0 30px rgba(125, 211, 252, 0.45)',
            }}
          />
        )}

        {/* Content */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {/* Loading spinner */}
          <AnimatePresence mode="wait">
            {isLoading ? (
              <m.span
                key="loading"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2"
              >
                <m.svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="opacity-25"
                  />
                  <path
                    d="M12 2a10 10 0 0 1 10 10"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </m.svg>
                {loadingText || children}
              </m.span>
            ) : showSuccess ? (
              <m.span
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2"
              >
                <m.svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <m.path
                    d="M5 12l5 5L20 7"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </m.svg>
                נשלח בהצלחה!
              </m.span>
            ) : (
              <m.span
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                {children}
                {icon && (
                  <m.span
                    animate={ambient ? { x: [0, -4, 0] } : undefined}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    {icon}
                  </m.span>
                )}
              </m.span>
            )}
          </AnimatePresence>
        </span>

        {/* Bottom line accent */}
        <m.span
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/30 origin-right"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
        />
      </m.button>
    )
  }
)

Button.displayName = 'Button'
