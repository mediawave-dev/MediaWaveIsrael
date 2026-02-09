import { useState, useEffect, useCallback } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import { Calculator, MessageCircle, TrendingUp, Users, CreditCard, HelpCircle } from 'lucide-react'
import { LottieIcon } from '../ui'

// Format number with Hebrew locale
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('he-IL', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(value)
}

// Animated counter component using Framer Motion spring
function AnimatedNumber({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const spring = useSpring(0, { stiffness: 50, damping: 20 })
  const display = useTransform(spring, (current) => formatCurrency(Math.round(current)))

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  return (
    <motion.span>
      {prefix}
      <motion.span>{display}</motion.span>
      {suffix}
    </motion.span>
  )
}

// Input field component with label, helper text, and tooltip
function InputField({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  icon: Icon,
  suffix,
  helperText,
  example,
}: {
  id: string
  label: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step?: number
  icon: React.ElementType
  suffix?: string
  helperText: string
  example: string
}) {
  const [showTooltip, setShowTooltip] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value) || 0
    const clamped = Math.min(Math.max(newValue, min), max)
    onChange(clamped)
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Label with tooltip */}
      <div className="flex items-center gap-2">
        <Icon size={18} className="text-orange-dark shrink-0" strokeWidth={1.5} />
        <label htmlFor={id} className="text-brown font-medium">
          {label}
        </label>
        <div className="relative">
          <button
            type="button"
            className="text-brown-muted hover:text-orange-dark transition-colors"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={() => setShowTooltip(!showTooltip)}
            aria-label="מידע נוסף"
          >
            <HelpCircle size={16} />
          </button>
          {/* Tooltip */}
          {showTooltip && (
            <div className="fixed md:absolute z-50 md:z-20 left-4 right-4 md:left-auto md:right-0 bottom-auto md:bottom-full top-auto md:top-auto mb-0 md:mb-2 w-auto md:w-56 p-3 bg-brown-dark text-white text-sm rounded-lg shadow-lg">
              <p className="mb-1">{helperText}</p>
              <p className="text-orange-light text-xs">{example}</p>
              <div className="hidden md:block absolute bottom-0 right-3 translate-y-1/2 rotate-45 w-2 h-2 bg-brown-dark" />
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="relative">
        <input
          type="number"
          id={id}
          value={value}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          className="w-full px-4 py-3 rounded-xl border-2 border-cream-darker bg-white text-brown-dark text-lg font-medium
                     focus:border-orange focus:ring-2 focus:ring-orange/20 focus:outline-none
                     transition-all duration-200 [direction:ltr] text-left"
          style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
        />
        {suffix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-muted text-sm pointer-events-none">
            {suffix}
          </span>
        )}
      </div>

      {/* Helper text - always visible on mobile */}
      <p className="text-xs text-brown-muted md:hidden">{helperText}</p>
    </div>
  )
}

export default function ROICalculator() {
  // Input state
  const [traffic, setTraffic] = useState(1000)
  const [conversionRate, setConversionRate] = useState(2)
  const [customerValue, setCustomerValue] = useState(500)

  // Calculated values
  const [yearlyLoss, setYearlyLoss] = useState(0)
  const [hasCalculated, setHasCalculated] = useState(false)

  // Calculate ROI whenever inputs change
  const calculateROI = useCallback(() => {
    // Current revenue: traffic × conversion% × customer value
    const currentRevenue = traffic * (conversionRate / 100) * customerValue

    // Improved revenue: 20% boost in conversion (based on Google research)
    const improvedConversion = conversionRate * 1.2
    const improvedRevenue = traffic * (improvedConversion / 100) * customerValue

    // Monthly loss = what they're missing out on
    const monthlyLoss = improvedRevenue - currentRevenue

    // Yearly loss
    const calculated = monthlyLoss * 12

    setYearlyLoss(Math.round(calculated))
    setHasCalculated(true)
  }, [traffic, conversionRate, customerValue])

  // Auto-calculate on input changes
  useEffect(() => {
    calculateROI()
  }, [calculateROI])

  // Generate WhatsApp message
  const getWhatsAppUrl = () => {
    const message = encodeURIComponent(
      `היי, חישבתי במחשבון שלכם שאני מפסיד ₪${formatCurrency(yearlyLoss)} בשנה.\nאשמח לשמוע איך אפשר לשפר את האתר שלי!`
    )
    return `https://wa.me/972528731808?text=${message}`
  }

  // Check if inputs are valid
  const isValidInput = traffic > 0 && conversionRate > 0 && customerValue > 0

  // Calculate intermediate values for display
  const currentCustomers = Math.round(traffic * (conversionRate / 100))
  const potentialCustomers = Math.round(traffic * (conversionRate * 1.2 / 100))
  const missedCustomers = potentialCustomers - currentCustomers

  return (
    <section
      id="roi-calculator"
      aria-label="מחשבון ROI"
      className="relative py-16 md:py-24 bg-gradient-to-b from-cream to-cream-dark overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-orange/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-sage/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />

      <div className="relative z-10 container max-w-4xl">
        {/* Header */}
        <motion.div
          className="text-center mb-10 md:mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Badge */}
          <motion.span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange/10 text-orange-dark text-sm font-medium mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Calculator size={16} />
            מחשבון הפסדים
          </motion.span>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-headline font-bold text-brown-dark mb-4">
            כמה לקוחות אתה מפסיד בגלל האתר?
          </h2>
          <p className="text-lg text-brown-light max-w-2xl mx-auto">
            אתר איטי או לא מותאם גורם לגולשים לעזוב. בואו נחשב כמה כסף זה עולה לך.
          </p>
        </motion.div>

        {/* Calculator Card */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg border border-cream-darker p-6 md:p-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Explanation Box */}
          <div className="bg-cream/50 rounded-xl p-4 mb-8 border border-cream-darker">
            <p className="text-sm text-brown leading-relaxed">
              <strong className="text-brown-dark">איך זה עובד?</strong> מחקרים של Google מראים שאתר מהיר ומקצועי
              מעלה את אחוז ההמרה ב-20%. המחשבון מראה כמה כסף אתה מפסיד כי האתר שלך לא מנצל את הפוטנציאל המלא.
            </p>
          </div>

          {/* Input Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <InputField
              id="traffic"
              label="גולשים בחודש"
              value={traffic}
              onChange={setTraffic}
              min={1}
              max={1000000}
              icon={Users}
              helperText="כמה אנשים נכנסים לאתר שלך בחודש ממוצע?"
              example="דוגמה: 1,000 מבקרים"
            />
            <InputField
              id="conversion"
              label="כמה קונים? (%)"
              value={conversionRate}
              onChange={setConversionRate}
              min={0.1}
              max={100}
              step={0.1}
              icon={TrendingUp}
              suffix="%"
              helperText="מתוך 100 גולשים, כמה באמת קונים או משאירים פרטים?"
              example="דוגמה: 2% = 2 לקוחות מכל 100 גולשים"
            />
            <InputField
              id="customerValue"
              label="רווח מלקוח"
              value={customerValue}
              onChange={setCustomerValue}
              min={1}
              max={100000}
              icon={CreditCard}
              suffix="₪"
              helperText="כמה כסף בממוצע מכניס לך לקוח אחד?"
              example="דוגמה: ₪500 לעסקה"
            />
          </div>

          {/* Divider */}
          <div className="border-t border-cream-darker my-8" />

          {/* Results Section */}
          <div className="text-center">
            {isValidInput ? (
              <motion.div
                key={yearlyLoss}
                initial={{ opacity: 0.8, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {yearlyLoss > 0 ? (
                  <>
                    {/* Breakdown */}
                    <div className="bg-cream/30 rounded-xl p-4 mb-6 max-w-lg mx-auto">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="text-right text-brown-muted">לקוחות נוכחיים בחודש:</div>
                        <div className="text-right font-medium text-brown-dark">{currentCustomers}</div>

                        <div className="text-right text-brown-muted">לקוחות פוטנציאליים:</div>
                        <div className="text-right font-medium text-sage-dark">{potentialCustomers}</div>

                        <div className="text-right text-brown-muted">לקוחות שנאבדים בחודש:</div>
                        <div className="text-right font-bold text-terracotta">{missedCustomers}</div>
                      </div>
                    </div>

                    <p className="text-brown-light text-lg mb-2">סה״כ אתה מפסיד בשנה:</p>
                    <div className="text-5xl md:text-6xl lg:text-7xl font-headline font-bold text-terracotta mb-2">
                      <AnimatedNumber value={yearlyLoss} prefix="₪" />
                    </div>
                    <p className="text-sm text-brown-muted max-w-md mx-auto mb-8">
                      ({missedCustomers} לקוחות × ₪{formatCurrency(customerValue)} × 12 חודשים)
                    </p>
                  </>
                ) : (
                  <div className="py-4">
                    <p className="text-2xl font-headline text-sage-dark font-bold mb-2">
                      🎉 כל הכבוד!
                    </p>
                    <p className="text-brown-light">
                      נראה שהאתר שלך כבר עובד מצוין. אבל תמיד אפשר לשפר!
                    </p>
                  </div>
                )}

                {/* CTA Button */}
                <motion.a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-[#38BDF8] hover:bg-[#0EA5E9] text-[#0c2d4a] rounded-xl
                             font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MessageCircle size={22} />
                  רוצה לשנות את זה? דבר איתנו
                </motion.a>
              </motion.div>
            ) : (
              <div className="py-6">
                <p className="text-brown-muted">
                  הזינו את הנתונים למעלה כדי לראות את החישוב
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Trust Signal */}
        {hasCalculated && yearlyLoss > 0 && (
          <motion.p
            className="text-center text-sm text-brown-muted mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="inline-flex items-center gap-1">
              <LottieIcon animationPath="/animations/lightbulb.json" size={24} loop={true} playOnHover={false} className="inline-block" />
              בשיחה קצרה נראה לך בדיוק מה לשפר באתר
            </span>
          </motion.p>
        )}
      </div>
    </section>
  )
}
