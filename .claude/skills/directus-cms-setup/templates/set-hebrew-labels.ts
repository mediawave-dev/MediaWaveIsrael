/**
 * Directus Hebrew Labels Script Template
 *
 * Sets Hebrew translations for collection names and field labels.
 * Run with: npx tsx scripts/set-hebrew-labels.ts
 *
 * CRITICAL: Always run via Node.js (npx tsx), NEVER via PowerShell.
 * PowerShell on Windows mangles Hebrew UTF-8 characters (shows as ?????).
 */

const BASE = process.env.VITE_DIRECTUS_URL || 'http://localhost:8055'
const TOKEN = process.env.DIRECTUS_ADMIN_TOKEN || 'directus-admin-token'

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
  // 1. Set admin user language to Hebrew
  await patch(`${BASE}/users/me`, { language: 'he-IL' })
  console.log('Admin language set to he-IL')

  // 2. Translate collection names
  // Customize based on the project's collections
  const collections: [string, string][] = [
    // ['collection_name', 'שם בעברית'],
    // Common examples:
    // ['services', 'שירותים'],
    // ['packages', 'חבילות'],
    // ['why_us', 'למה אנחנו'],
    // ['how_we_work', 'איך אנחנו עובדים'],
    // ['faqs', 'שאלות נפוצות'],
    // ['blog_posts', 'פוסטים בבלוג'],
    // ['projects', 'פרויקטים'],
    // ['testimonials', 'המלצות'],
    // ['site_settings', 'הגדרות האתר'],
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

  // 3. Translate field names
  // See references/hebrew-labels.md for the complete translation catalog
  const fields: [string, string, string][] = [
    // ['collection', 'field_name', 'תווית בעברית'],
    // Common examples:
    // ['services', 'title', 'כותרת'],
    // ['services', 'description', 'תיאור'],
    // ['services', 'tags', 'תגיות'],
    // ['services', 'sort', 'סדר'],
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

  console.log('\nDone! Refresh the Directus admin panel.')
}

main().catch(console.error)
