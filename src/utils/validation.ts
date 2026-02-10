// Form validation utilities

/** Validate email format */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

/** Validate Israeli phone number (with or without dashes/spaces) */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s-]/g, '')
  // Israeli mobile: 05X-XXXXXXX (10 digits starting with 05)
  // Israeli landline: 0X-XXXXXXX (9 digits) or 1-XXX-XXXXXX
  return /^0[0-9]{8,9}$/.test(cleaned) || /^1[0-9]{9}$/.test(cleaned)
}

/** Validate name (minimum length, no numbers) */
export function isValidName(name: string): boolean {
  const trimmed = name.trim()
  return trimmed.length >= 2 && !/\d/.test(trimmed)
}

/** Validate message length */
export function isValidMessage(message: string, min = 10, max = 2000): boolean {
  const trimmed = message.trim()
  return trimmed.length >= min && trimmed.length <= max
}

// Error messages in Hebrew
export const validationErrors = {
  name: 'נא להזין שם מלא (לפחות 2 תווים)',
  email: 'נא להזין כתובת אימייל תקינה',
  phone: 'נא להזין מספר טלפון תקין (לדוגמה: 052-8731808)',
  message: 'ההודעה חייבת להיות בין 10 ל-2000 תווים',
} as const
