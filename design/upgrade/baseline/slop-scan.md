# slop-scan — G:\Web-Dev\mw-baseline\src

**Slop Index 96/100 — AI-default template** · 92 file(s) scanned
Second-order signals: marquee-strip, grain-overlay

| rule | hits | points | what it means |
|---|---|---|---|
| blur-blob | 5 | 14 | Blurred colour blob behind the hero. |
| default-sans-he | 3 | 12 | Default Hebrew web font as the brand voice (Heebo/Assistant/Rubik — the Hebrew Inter). |
| three-icon-cards | 2 | 12 | Three-up feature grid (check whether each card is the same icon+title+blurb). |
| default-sans-2026 | 4 | 12 | 2026 "designer default" sans (Geist, Satoshi, Clash Display, Manrope, Space Grotesk…). |
| soft-card-stack | 7 | 10 | Rounded-2xl card with a big soft shadow — the default card. |
| fade-up-everywhere | 40 | 10 | The same fade-up on every block (≥6 occurrences) — motion with no hierarchy. |
| copy-triad-fragments | 1 | 10 | Triad of fragments ("Fast. Simple. Secure." / "מהיר. פשוט. אמין."). |
| template-section-headings | 7 | 10 | Template section headings (Why Choose Us / What Our Clients Say / למה לבחור בנו / מוכנים להתחיל?) — 3+. |
| copy-cliche-he-smb | 8 | 10 | Israeli SMB marketing cliché (מעטפת מלאה, ליווי צמוד, מהשורה הראשונה, שקט נפשי…). |
| hover-lift-everywhere | 19 | 10 | Hover-lift/scale on every card (4+). |
| copy-ai-washing | 2 | 6 | AI-washing ("AI-powered", "מבוסס AI", "פתרונות חכמים") — legitimate when AI is the product; waive with slop-ok. |
| always-on-claim | 8 | 5 | "24/7" as a selling point (fine when literally true and specific). |
| copy-default-form-microcopy | 1 | 5 | Default form microcopy ("Your message has been sent", "הודעתך נשלחה בהצלחה"). |
| copy-faq-vendor-voice | 11 | 5 | FAQ in the seller's written register (3+ questions opening with "האם" / "Do you offer…") — write them as the customer says them. |
| copy-slash-gender-he | 4 | 5 | Slash-gender forms (את/ה, לקוח/ה, מוזמן/ת) — 2+. |
| copy-jargon-he | 34 | 5 | Vendor jargon to the client (SEO, UX/UI, רספונסיבי, ממיר, לידים) — 3+. |
| scroll-progress-bar | 1 | 5 | Copy-pasted scroll progress bar. |
| lucide-everywhere | 8 | 5 | lucide-react imported in 8+ files (default icon voice). |
| transition-all-everywhere | 26 | 5 | transition-all as the only motion token (10+; also a perf smell). |

## Evidence
### blur-blob
- components/pages/Blog.tsx:194 — absolute inset-0 rounded-full bg-orange/10 blur-2xl
- components/sections/HowWeWork.tsx:106 — absolute -bottom-16 -left-16 w-32 h-32 bg-gradient-to-tr from-sky-200/30 to-cyan-100/20 ro
- components/sections/HowWeWork.tsx:195 — absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-sky-100/40 to-cyan-50/30 rounded
- components/sections/HowWeWork.tsx:196 — absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-tr from-teal-100/30 to-sky-50/20 round
- components/sections/Testimonials.tsx:145 — absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl
### default-sans-he
- styles/index.css:12 — @fontsource/heebo
- styles/index.css:13 — @fontsource/heebo
- styles/index.css:14 — @fontsource/heebo
### three-icon-cards
- components/layout/Footer.tsx:46 — grid-cols-1 md:grid-cols-3
- components/sections/WhyUs.tsx:151 — grid-cols-1 md:grid-cols-3
### default-sans-2026
- styles/index.css:18 — @fontsource/outfit
- styles/index.css:19 — @fontsource/outfit
- styles/index.css:20 — @fontsource/outfit
- styles/index.css:21 — @fontsource/outfit
### soft-card-stack
- components/LeadModal.tsx:194 — rounded-2xl shadow-2xl
- components/pages/PortfolioExample.tsx:144 — rounded-2xl shadow-lg
- components/pages/PortfolioExample.tsx:151 — rounded-2xl overflow-hidden shadow-lg
- components/sections/Contact.tsx:150 — rounded-2xl p-8 shadow-lg
- components/sections/Testimonials.tsx:140 — rounded-3xl p-8 md:p-12 shadow-xl
- components/ui/AccessibilityWidget.tsx:161 — shadow-2xl border border-cream-darker rounded-2xl
### fade-up-everywhere
- components/pages/Accessibility.tsx:56 — initial={{ opacity: 0, y: 20 }}
- components/pages/Accessibility.tsx:71 — initial={{ opacity: 0, y: 30 }}
- components/pages/Blog.tsx:63 — initial={{ opacity: 0, y: 20 }}
- components/pages/Blog.tsx:88 — initial={{ opacity: 0, y: 30 }}
- components/pages/Blog.tsx:188 — initial={{ opacity: 0, y: 20 }}
- components/pages/BlogPost.tsx:134 — initial={{ opacity: 0, y: 20 }}
### copy-triad-fragments
- data/blog-posts.ts:410 — . מילאתם טופס. חיכיתם. זה מתיש.
### template-section-headings
- components/pages/NotFound.tsx:117 —  השירותים שלנו
- components/sections/HowWeWork.tsx:236 —  מוכנים להתחיל?
- data/blog-posts.ts:69 —  צרו איתנו קשר
- data/blog-posts.ts:268 —  צרו איתנו קשר
- data/blog-posts.ts:393 —  צרו איתנו קשר
- data/blog-posts.ts:501 —  צרו איתנו קשר
### copy-cliche-he-smb
- components/pages/Blog.tsx:48 — נוכחות דיגיטלית
- components/sections/Hero.tsx:242 — גישה אישית
- components/sections/Hero.tsx:242 — וליווי צמוד
- components/sections/HowWeWork.tsx:207 — מהרעיון ועד ההשקה
- components/sections/WhyUs.tsx:34 — ליווי אישי
- data/blog-posts.ts:22 — נוכחות דיגיטלית
### hover-lift-everywhere
- components/layout/Layout.tsx:101 — whileHover={{ scale: 1.03
- components/pages/Blog.tsx:107 — group-hover:scale-105
- components/pages/NotFound.tsx:100 — whileHover={{ scale: 1.02
- components/pages/ServicePage.tsx:273 — hover:-translate-y-0.5
- components/sections/Hero.tsx:256 — whileHover={{ scale: 1.02
- components/sections/Hero.tsx:280 — whileHover={{ scale: 1.02
### copy-ai-washing
- data/services.ts:206 — מבוססי בינה מלאכותית
- data/services.ts:217 — מבוסס בינה מלאכותית
### always-on-claim
- data/blog-posts.ts:61 — 24/7
- data/blog-posts.ts:211 — 24/7
- data/blog-posts.ts:217 — 24/7
- data/blog-posts.ts:343 — 24/7
- data/blog-posts.ts:387 — 24/7
- data/services.ts:206 — 24/7
### copy-default-form-microcopy
- components/sections/Contact.tsx:85 — ההודעה נשלחה בהצלחה
### copy-faq-vendor-voice
- components/sections/FAQ.tsx:14 —  האם תומכים בתחזוקה שוטפת?
- components/sections/FAQ.tsx:16 —  האם האתר יהיה ידידותי למובייל?
- components/sections/FAQ.tsx:18 —  האם אוכל לעדכן תכנים בעצמי?
- components/sections/FAQ.tsx:19 —  האם אפשר לשלב חנות מקוונת?
- components/sections/FAQ.tsx:21 —  האם אני צריך לספק תכנים ותמונות?
- components/sections/FAQ.tsx:22 —  האם האתר יופיע בגוגל?
### copy-slash-gender-he
- components/LeadModal.tsx:283 — מאשר/ת
- utils/whatsapp.ts:6 — מתעניין/ת
- utils/whatsapp.ts:7 — מתעניין/ת
- utils/whatsapp.ts:8 — מתעניין/ת
### copy-jargon-he
- App.tsx:58 — ממירים
- App.tsx:58 — אופטימיזציה
- App.tsx:58 — SEO
- data/services.ts:36 — SEO
- data/services.ts:49 — ואופטימיזציה
- data/services.ts:49 — SEO
### scroll-progress-bar
- components/ui/ReadingProgress.tsx:24 — style={{ scaleX: scrollYProgress
### lucide-everywhere
- components/LeadModal.tsx:6 — from 'lucide-react'
- components/pages/Blog.tsx:3 — from 'lucide-react'
- components/pages/BlogPost.tsx:4 — from 'lucide-react'
- components/pages/PortfolioExample.tsx:3 — from 'lucide-react'
- components/pages/ServicePage.tsx:3 — from 'lucide-react'
- components/sections/Services.tsx:4 — from 'lucide-react'
### transition-all-everywhere
- components/layout/Header.tsx:136 — transition-all
- components/pages/Blog.tsx:150 — transition-all
- components/pages/BlogPost.tsx:273 — transition-all
- components/pages/NotFound.tsx:98 — transition-all
- components/pages/PortfolioExample.tsx:230 — transition-all
- components/pages/PortfolioExample.tsx:240 — transition-all

## Second-order signals
- marquee-strip (Infinite marquee strip): `Marquee`
- grain-overlay (Film-grain / noise overlay): `grain`