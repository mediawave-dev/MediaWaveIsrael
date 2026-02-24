# Hebrew Translation Catalog for Directus

Complete Hebrew label translations for common content collections and fields.
Use this catalog when running `scripts/set-hebrew-labels.ts`.

**CRITICAL**: Always run Hebrew labels via Node.js/tsx, NEVER via PowerShell.
PowerShell on Windows mangles Hebrew UTF-8 characters (shows as ?????).

---

## Collection Name Translations

Common business website collections with Hebrew names:

| Collection (snake_case) | Hebrew Name | Icon |
|------------------------|------------|------|
| `services` | שירותים | box |
| `packages` | חבילות | shopping_bag |
| `pricing` | תמחור | payments |
| `why_us` | למה אנחנו | star |
| `how_we_work` | איך אנחנו עובדים | timeline |
| `faqs` | שאלות נפוצות | help |
| `blog_posts` | פוסטים בבלוג | article |
| `projects` | פרויקטים | work |
| `portfolio` | תיק עבודות | photo_library |
| `testimonials` | המלצות | format_quote |
| `team_members` | צוות | group |
| `site_settings` | הגדרות האתר | settings |
| `contact_messages` | הודעות | mail |
| `events` | אירועים | event |
| `gallery` | גלריה | collections |
| `categories` | קטגוריות | category |
| `products` | מוצרים | inventory |
| `orders` | הזמנות | receipt |
| `pages` | עמודים | description |
| `menu_items` | תפריט | menu |
| `slides` | שקופיות | slideshow |
| `banners` | באנרים | campaign |
| `partners` | שותפים | handshake |
| `features` | תכונות | bolt |
| `stats` | נתונים | analytics |
| `certifications` | הסמכות | verified |
| `locations` | מיקומים | location_on |

---

## Field Name Translations

### Universal Fields (appear in most collections)

| Field (snake_case) | Hebrew Label |
|-------------------|-------------|
| `title` | כותרת |
| `name` | שם |
| `description` | תיאור |
| `content` | תוכן |
| `excerpt` | תקציר |
| `slug` | סלאג |
| `image` | תמונה |
| `icon` | אייקון |
| `url` | קישור |
| `sort` | סדר |
| `status` | סטטוס |
| `featured` | מודגש |
| `published` | פורסם |
| `tags` | תגיות |
| `date` | תאריך |
| `created_at` | נוצר בתאריך |
| `updated_at` | עודכן בתאריך |

### Services / Features Fields

| Field | Hebrew |
|-------|--------|
| `lottie_animation` | אנימציית Lottie |
| `lottie_size` | גודל אנימציה |
| `animation_path` | נתיב אנימציה |
| `color` | צבע |
| `icon_name` | שם אייקון |

### Pricing / Packages Fields

| Field | Hebrew |
|-------|--------|
| `price` | מחיר |
| `features` | תכונות |
| `ideal_for` | מתאים ל |
| `cta` | כפתור פעולה |
| `cta_link` | קישור כפתור |
| `popular` | פופולרי |
| `currency` | מטבע |
| `period` | תקופה |
| `discount` | הנחה |

### Blog / Articles Fields

| Field | Hebrew |
|-------|--------|
| `author` | כותב |
| `featured_image` | תמונה ראשית |
| `published_at` | תאריך פרסום |
| `reading_time` | זמן קריאה |
| `category` | קטגוריה |
| `body` | גוף |

### How We Work / Process Fields

| Field | Hebrew |
|-------|--------|
| `step_number` | מספר שלב |
| `step_title` | כותרת שלב |
| `step_description` | תיאור שלב |

### Projects / Portfolio Fields

| Field | Hebrew |
|-------|--------|
| `type` | סוג |
| `image_mobile` | תמונה מובייל |
| `self_link` | קישור עצמי |
| `client_name` | שם לקוח |
| `completion_date` | תאריך סיום |
| `technologies` | טכנולוגיות |
| `live_url` | קישור לאתר |
| `github_url` | קישור GitHub |

### Testimonials / Reviews Fields

| Field | Hebrew |
|-------|--------|
| `business` | עסק |
| `quote` | ציטוט |
| `rating` | דירוג |
| `role` | תפקיד |
| `company` | חברה |
| `avatar` | תמונת פרופיל |

### Team Members Fields

| Field | Hebrew |
|-------|--------|
| `first_name` | שם פרטי |
| `last_name` | שם משפחה |
| `role` | תפקיד |
| `bio` | אודות |
| `email` | אימייל |
| `phone` | טלפון |
| `linkedin_url` | קישור לינקדאין |
| `photo` | תמונה |

### Site Settings Fields

| Field | Hebrew |
|-------|--------|
| `site_name` | שם האתר |
| `site_description` | תיאור האתר |
| `logo` | לוגו |
| `favicon` | אייקון אתר |
| `phone` | טלפון |
| `email` | אימייל |
| `whatsapp_number` | מספר וואטסאפ |
| `instagram_url` | קישור אינסטגרם |
| `facebook_url` | קישור פייסבוק |
| `twitter_url` | קישור טוויטר |
| `linkedin_url` | קישור לינקדאין |
| `youtube_url` | קישור יוטיוב |
| `tiktok_url` | קישור טיקטוק |
| `address` | כתובת |
| `city` | עיר |
| `response_time` | זמן תגובה |
| `working_hours` | שעות פעילות |
| `google_analytics` | Google Analytics |
| `meta_title` | כותרת SEO |
| `meta_description` | תיאור SEO |
| `og_image` | תמונת שיתוף |

### Contact / Forms Fields

| Field | Hebrew |
|-------|--------|
| `full_name` | שם מלא |
| `message` | הודעה |
| `subject` | נושא |
| `source` | מקור |
| `is_read` | נקרא |
| `replied` | הגיב |

### E-commerce Fields

| Field | Hebrew |
|-------|--------|
| `product_name` | שם מוצר |
| `sku` | מק״ט |
| `stock` | מלאי |
| `weight` | משקל |
| `dimensions` | מידות |
| `sale_price` | מחיר מבצע |
| `regular_price` | מחיר רגיל |
| `in_stock` | במלאי |

### Events Fields

| Field | Hebrew |
|-------|--------|
| `event_date` | תאריך אירוע |
| `start_time` | שעת התחלה |
| `end_time` | שעת סיום |
| `location` | מיקום |
| `capacity` | קיבולת |
| `registration_url` | קישור הרשמה |
| `is_online` | אירוע מקוון |

---

## Script Template: `set-hebrew-labels.ts`

```typescript
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
  // 1. Set admin user language to Hebrew
  await patch(`${BASE}/users/me`, { language: 'he-IL' })
  console.log('Admin language set to he-IL')

  // 2. Translate collection names
  const collections: [string, string][] = [
    // Add your collections here:
    // ['collection_name', 'שם בעברית'],
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
  const fields: [string, string, string][] = [
    // Add your fields here:
    // ['collection', 'field_name', 'תווית בעברית'],
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
```

### Running the Script

```bash
npx tsx scripts/set-hebrew-labels.ts
```

**NEVER** use PowerShell for Hebrew translations. Always use `npx tsx` which runs in Node.js with proper UTF-8 support.

---

## Known Limitations

### Directus Built-in UI Strings
The following sidebar/UI elements remain in English even with `he-IL` locale:
- "Layout Options"
- "Auto Refresh"
- "Import / Export"
- Some filter labels

These are managed by Directus via their [Crowdin translation project](https://locales.directus.io/).
Hebrew coverage is incomplete. This is NOT something we can fix from the CMS setup side.

### What IS Translated
- Collection names in sidebar (our translations)
- Field labels in edit forms (our translations)
- Most Directus UI chrome (buttons, dialogs) via Directus built-in i18n
- RTL layout direction
