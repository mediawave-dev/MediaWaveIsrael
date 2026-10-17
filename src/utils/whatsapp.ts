// WhatsApp URL helper utilities

export const WHATSAPP_NUMBER = '972528731808'

export const WHATSAPP_MESSAGES = {
  general: 'היי, אשמח לשמוע על אתר לעסק שלי.',
  contact: 'היי, אשמח לשמוע על אתר לעסק שלי.',
  footer: 'היי, יש לי שאלה על אתר לעסק.',
} as const

/** Generate WhatsApp URL with encoded message */
export function getWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

/** Generate WhatsApp URL for ROI calculator results */
export function getWhatsAppUrlWithROI(yearlyLoss: number): string {
  const formattedLoss = yearlyLoss.toLocaleString('he-IL')
  const message = `היי, חישבתי במחשבון שלכם שאני מפסיד ₪${formattedLoss} בשנה.\nאשמח לשמוע איך אפשר לשפר את האתר שלי!`
  return getWhatsAppUrl(message)
}

/** Pre-built WhatsApp URLs for common use cases */
export const WHATSAPP_URLS = {
  general: getWhatsAppUrl(WHATSAPP_MESSAGES.general),
  contact: getWhatsAppUrl(WHATSAPP_MESSAGES.contact),
  footer: getWhatsAppUrl(WHATSAPP_MESSAGES.footer),
} as const
