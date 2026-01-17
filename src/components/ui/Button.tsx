import { forwardRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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

    // Size styles
    const sizeStyles = {
      sm: 'py-2.5 px-5 text-sm',
      md: 'py-4 px-8',
      lg: 'py-5 px-10 text-lg',
    }

    // Variant styles
    const variantStyles = {
      primary: 'bg-orange text-white hover:bg-orange-light',
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

    return (
      <motion.button
        ref={ref}
        {...props}
        className={`
          relative overflow-hidden font-semibold rounded-full
          transition-all duration-300 outline-none
          focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          ${sizeStyles[size]}
          ${variantStyles[variant]}
          ${className}
        `}
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
            <motion.span
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
          <motion.span
            className="absolute inset-0 bg-linear-to-l from-transparent via-white/20 to-transparent -translate-x-full"
            animate={{ x: ['calc(-100%)', 'calc(200%)'] }}
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
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none opacity-0 group-hover:opacity-100"
            whileHover={{ opacity: 1 }}
            style={{
              boxShadow: '0 0 30px rgba(245, 166, 35, 0.4)',
            }}
          />
        )}

        {/* Content */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {/* Loading spinner */}
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.span
                key="loading"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2"
              >
                <motion.svg
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
                </motion.svg>
                {loadingText || children}
              </motion.span>
            ) : showSuccess ? (
              <motion.span
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2"
              >
                <motion.svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.path
                    d="M5 12l5 5L20 7"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.svg>
                נשלח בהצלחה!
              </motion.span>
            ) : (
              <motion.span
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                {children}
                {icon && (
                  <motion.span
                    animate={{ x: [0, -4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    {icon}
                  </motion.span>
                )}
              </motion.span>
            )}
          </AnimatePresence>
        </span>

        {/* Bottom line accent */}
        <motion.span
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/30 origin-right"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
        />
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
