const BASE = 'http://localhost:8055'
const TOKEN = 'directus-admin-token'

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  'Content-Type': 'application/json; charset=utf-8',
}

async function patch(url: string, body: object) {
  const res = await fetch(url, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(body),
  })
  return res.ok
}

async function main() {
  // Set admin user language
  await patch(`${BASE}/users/me`, { language: 'he-IL' })
  console.log('Admin language set to he-IL')

  // Collection translations
  const collections: [string, string][] = [
    ['blog_posts', 'פוסטים בבלוג'],
    ['faqs', 'שאלות נפוצות'],
    ['how_we_work', 'איך אנחנו עובדים'],
    ['packages', 'חבילות'],
    ['projects', 'פרויקטים'],
    ['services', 'שירותים'],
    ['site_settings', 'הגדרות האתר'],
    ['testimonials', 'המלצות'],
    ['why_us', 'למה אנחנו'],
  ]

  console.log('\nCollection translations:')
  for (const [name, he] of collections) {
    const ok = await patch(`${BASE}/collections/${name}`, {
      meta: {
        translations: [
          { language: 'he-IL', translation: he, singular: he, plural: he },
        ],
      },
    })
    console.log(`  ${ok ? '[OK]' : '[FAIL]'} ${name} → ${he}`)
  }

  // Field translations
  const fields: [string, string, string][] = [
    ['services', 'title', 'כותרת'],
    ['services', 'description', 'תיאור'],
    ['services', 'tags', 'תגיות'],
    ['services', 'sort', 'סדר'],
    ['services', 'lottie_animation', 'אנימציית Lottie'],
    ['services', 'lottie_size', 'גודל אנימציה'],
    ['packages', 'name', 'שם'],
    ['packages', 'price', 'מחיר'],
    ['packages', 'description', 'תיאור'],
    ['packages', 'features', 'תכונות'],
    ['packages', 'ideal_for', 'מתאים ל'],
    ['packages', 'cta', 'כפתור פעולה'],
    ['packages', 'cta_link', 'קישור כפתור'],
    ['packages', 'popular', 'פופולרי'],
    ['packages', 'sort', 'סדר'],
    ['why_us', 'title', 'כותרת'],
    ['why_us', 'description', 'תיאור'],
    ['why_us', 'color', 'צבע'],
    ['why_us', 'lottie_animation', 'אנימציית Lottie'],
    ['why_us', 'sort', 'סדר'],
    ['how_we_work', 'step_number', 'מספר שלב'],
    ['how_we_work', 'title', 'כותרת'],
    ['how_we_work', 'description', 'תיאור'],
    ['how_we_work', 'animation_path', 'נתיב אנימציה'],
    ['how_we_work', 'sort', 'סדר'],
    ['faqs', 'question', 'שאלה'],
    ['faqs', 'answer', 'תשובה'],
    ['faqs', 'sort', 'סדר'],
    ['blog_posts', 'title', 'כותרת'],
    ['blog_posts', 'slug', 'סלאג'],
    ['blog_posts', 'excerpt', 'תקציר'],
    ['blog_posts', 'content', 'תוכן'],
    ['blog_posts', 'featured_image', 'תמונה ראשית'],
    ['blog_posts', 'author', 'כותב'],
    ['blog_posts', 'tags', 'תגיות'],
    ['blog_posts', 'published_at', 'תאריך פרסום'],
    ['blog_posts', 'status', 'סטטוס'],
    ['projects', 'title', 'כותרת'],
    ['projects', 'type', 'סוג'],
    ['projects', 'description', 'תיאור'],
    ['projects', 'url', 'קישור'],
    ['projects', 'image', 'תמונה'],
    ['projects', 'image_mobile', 'תמונה מובייל'],
    ['projects', 'tags', 'תגיות'],
    ['projects', 'features', 'תכונות'],
    ['projects', 'featured', 'מודגש'],
    ['projects', 'self_link', 'קישור עצמי'],
    ['projects', 'sort', 'סדר'],
    ['testimonials', 'name', 'שם'],
    ['testimonials', 'business', 'עסק'],
    ['testimonials', 'quote', 'ציטוט'],
    ['testimonials', 'image', 'תמונה'],
    ['testimonials', 'rating', 'דירוג'],
    ['testimonials', 'url', 'קישור'],
    ['testimonials', 'sort', 'סדר'],
    ['site_settings', 'site_name', 'שם האתר'],
    ['site_settings', 'site_description', 'תיאור האתר'],
    ['site_settings', 'phone', 'טלפון'],
    ['site_settings', 'email', 'אימייל'],
    ['site_settings', 'whatsapp_number', 'מספר וואטסאפ'],
    ['site_settings', 'instagram_url', 'קישור אינסטגרם'],
    ['site_settings', 'facebook_url', 'קישור פייסבוק'],
    ['site_settings', 'address', 'כתובת'],
    ['site_settings', 'response_time', 'זמן תגובה'],
    ['site_settings', 'logo', 'לוגו'],
  ]

  console.log('\nField translations:')
  for (const [col, field, he] of fields) {
    const ok = await patch(`${BASE}/fields/${col}/${field}`, {
      meta: {
        translations: [{ language: 'he-IL', translation: he }],
      },
    })
    console.log(`  ${ok ? '[OK]' : '[SKIP]'} ${col}.${field} → ${he}`)
  }

  console.log('\nDone! Refresh http://localhost:8055')
}

main().catch(console.error)
