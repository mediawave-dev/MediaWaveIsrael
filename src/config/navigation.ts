// Navigation configuration - single source of truth

export interface NavLink {
  label: string
  href: string
  showInHeader?: boolean
  /** the menu sheet (phones and tablets): every chapter of the home page, in page order */
  showInMenu?: boolean
  showInFooter?: boolean
}

// Labels are the chapters' own headings ("למה לעבוד איתנו?", "איך אנחנו עובדים") or the labels the
// footer already used. Two items in the menu read as an empty sheet (Nati, 16.10).
export const navigation: NavLink[] = [
  { label: 'דף הבית', href: '#top', showInFooter: true },
  { label: 'למה לעבוד איתנו', href: '#why-us', showInHeader: true, showInMenu: true },
  { label: 'מה אנחנו עושים', href: '#services', showInHeader: true, showInMenu: true, showInFooter: true },
  { label: 'איך אנחנו עובדים', href: '#how-we-work-title', showInHeader: true, showInMenu: true },
  { label: 'שאלות נפוצות', href: '#faq', showInHeader: true, showInMenu: true, showInFooter: true },
  { label: 'דברו איתנו', href: '#contact', showInMenu: true, showInFooter: true },
  // the style studio: the same site in four styles [קופי: נתי]
  { label: 'סטודיו הסגנונות', href: '/styles/', showInMenu: true, showInFooter: true },
  // (D217) the visitor's own site in the five styles [קופי: נתי]
  { label: 'האתר שלכם ב-60 שניות', href: '/your-site/', showInMenu: true, showInFooter: true },
]

export const headerLinks = navigation.filter((n) => n.showInHeader)
export const menuLinks = navigation.filter((n) => n.showInMenu)
export const footerLinks = navigation.filter((n) => n.showInFooter)
