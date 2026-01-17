import { useState, forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

// Reusable Input with floating label and focus effects
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false)
    const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue)

    const isFloating = isFocused || hasValue

    return (
      <motion.div
        className="relative"
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {/* Glow effect on focus */}
        <AnimatePresence>
          {isFocused && (
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                boxShadow: '0 0 20px rgba(245, 166, 35, 0.15), 0 0 40px rgba(245, 166, 35, 0.08)',
              }}
            />
          )}
        </AnimatePresence>

        {/* Input field */}
        <input
          ref={ref}
          {...props}
          className={`
            peer w-full px-5 py-4 pt-6 bg-white border-2 rounded-2xl
            outline-none transition-all duration-300
            text-brown-dark placeholder-transparent
            ${error
              ? 'border-red-400 focus:border-red-500'
              : 'border-cream-darker focus:border-orange hover:border-orange/50'
            }
            ${className}
          `}
          placeholder={label}
          onFocus={(e) => {
            setIsFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            setHasValue(!!e.target.value)
            props.onBlur?.(e)
          }}
          onChange={(e) => {
            setHasValue(!!e.target.value)
            props.onChange?.(e)
          }}
        />

        {/* Floating label */}
        <motion.label
          className={`
            absolute right-5 pointer-events-none
            transition-colors duration-200
            ${error ? 'text-red-500' : isFocused ? 'text-orange' : 'text-brown-muted'}
          `}
          animate={{
            top: isFloating ? '0.5rem' : '1.1rem',
            fontSize: isFloating ? '0.75rem' : '1rem',
            fontWeight: isFloating ? 600 : 400,
          }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {label}
        </motion.label>

        {/* Decorative corner accent */}
        <motion.div
          className="absolute bottom-2 left-2 w-4 h-4 pointer-events-none"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: isFocused ? 0.3 : 0,
            scale: isFocused ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          <svg viewBox="0 0 16 16" fill="none">
            <path
              d="M2 14 Q2 8 8 8 Q14 8 14 2"
              stroke="var(--color-orange)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.p
              className="text-red-500 text-sm mt-1 mr-2"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }
)

Input.displayName = 'Input'

// Reusable Textarea with floating label
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false)
    const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue)

    const isFloating = isFocused || hasValue

    return (
      <motion.div
        className="relative"
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {/* Glow effect on focus */}
        <AnimatePresence>
          {isFocused && (
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                boxShadow: '0 0 20px rgba(245, 166, 35, 0.15), 0 0 40px rgba(245, 166, 35, 0.08)',
              }}
            />
          )}
        </AnimatePresence>

        {/* Textarea field */}
        <textarea
          ref={ref}
          {...props}
          className={`
            peer w-full px-5 py-4 pt-6 bg-white border-2 rounded-2xl
            outline-none transition-all duration-300 resize-none
            text-brown-dark placeholder-transparent
            ${error
              ? 'border-red-400 focus:border-red-500'
              : 'border-cream-darker focus:border-orange hover:border-orange/50'
            }
            ${className}
          `}
          placeholder={label}
          onFocus={(e) => {
            setIsFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            setHasValue(!!e.target.value)
            props.onBlur?.(e)
          }}
          onChange={(e) => {
            setHasValue(!!e.target.value)
            props.onChange?.(e)
          }}
        />

        {/* Floating label */}
        <motion.label
          className={`
            absolute right-5 pointer-events-none
            transition-colors duration-200
            ${error ? 'text-red-500' : isFocused ? 'text-orange' : 'text-brown-muted'}
          `}
          animate={{
            top: isFloating ? '0.5rem' : '1.1rem',
            fontSize: isFloating ? '0.75rem' : '1rem',
            fontWeight: isFloating ? 600 : 400,
          }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {label}
        </motion.label>

        {/* Decorative corner accent */}
        <motion.div
          className="absolute bottom-2 left-2 w-4 h-4 pointer-events-none"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: isFocused ? 0.3 : 0,
            scale: isFocused ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          <svg viewBox="0 0 16 16" fill="none">
            <path
              d="M2 14 Q2 8 8 8 Q14 8 14 2"
              stroke="var(--color-orange)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.p
              className="text-red-500 text-sm mt-1 mr-2"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }
)

Textarea.displayName = 'Textarea'
