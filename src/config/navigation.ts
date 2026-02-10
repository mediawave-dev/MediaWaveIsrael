// Navigation configuration - single source of truth

export interface NavLink {
  label: string
  href: string
  showInHeader?: boolean
  showInFooter?: boolean
}

export const navigation: NavLink[] = [
  { label: 'דף הבית', href: '#top', showInFooter: true },
  { label: 'מחשבון הפסדים', href: '#roi-calculator', showInFooter: true },
  { label: 'שירותים', href: '#services', showInHeader: true, showInFooter: true },
  { label: 'שאלות נפוצות', href: '#faq', showInHeader: true, showInFooter: true },
  { label: 'הבלוג', href: '/blog', showInHeader: true, showInFooter: true },
  { label: 'צור קשר', href: '#contact', showInFooter: true },
]

export const headerLinks = navigation.filter((n) => n.showInHeader)
export const footerLinks = navigation.filter((n) => n.showInFooter)
