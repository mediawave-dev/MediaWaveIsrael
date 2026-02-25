import 'dotenv/config'

const DIRECTUS_URL = process.env.VITE_DIRECTUS_URL || 'http://localhost:8055'
const ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN || 'directus-admin-token'

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${ADMIN_TOKEN}`,
}

async function api(method: string, path: string, body?: unknown) {
  const res = await fetch(`${DIRECTUS_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok && res.status !== 409) {
    const text = await res.text()
    throw new Error(`${method} ${path} -> ${res.status}: ${text}`)
  }
  return res.json().catch(() => ({}))
}

async function collectionExists(name: string): Promise<boolean> {
  try {
    const res = await fetch(`${DIRECTUS_URL}/collections/${name}`, { headers })
    return res.ok
  } catch {
    return false
  }
}

async function createCollection(name: string, meta: Record<string, unknown>, fields: Array<Record<string, unknown>>) {
  if (await collectionExists(name)) {
    console.log(`  [skip] ${name} already exists`)
    return
  }
  await api('POST', '/collections', {
    collection: name,
    schema: {},
    meta: { ...meta, icon: 'box' },
    fields: [
      { field: 'id', type: 'integer', meta: { hidden: true, interface: 'input', readonly: true }, schema: { is_primary_key: true, has_auto_increment: true } },
      ...fields,
    ],
  })
  console.log(`  [created] ${name}`)
}

function stringField(field: string, meta?: Record<string, unknown>) {
  return { field, type: 'string', meta: { interface: 'input', ...meta }, schema: {} }
}
function textField(field: string, meta?: Record<string, unknown>) {
  return { field, type: 'text', meta: { interface: 'input-multiline', ...meta }, schema: {} }
}
function richTextField(field: string) {
  return { field, type: 'text', meta: { interface: 'input-rich-text-html' }, schema: {} }
}
function intField(field: string, meta?: Record<string, unknown>) {
  return { field, type: 'integer', meta: { interface: 'input', ...meta }, schema: {} }
}
function boolField(field: string) {
  return { field, type: 'boolean', meta: { interface: 'boolean' }, schema: { default_value: false } }
}
function jsonField(field: string) {
  return { field, type: 'json', meta: { interface: 'input-code', options: { language: 'json' } }, schema: {} }
}
function fileField(field: string) {
  return { field, type: 'uuid', meta: { interface: 'file-image', special: ['file'] }, schema: {} }
}
function datetimeField(field: string) {
  return { field, type: 'timestamp', meta: { interface: 'datetime' }, schema: {} }
}
function sortField() {
  return { field: 'sort', type: 'integer', meta: { interface: 'input', hidden: true }, schema: {} }
}

// ============ COLLECTIONS ============

async function createCollections() {
  console.log('\nCreating collections...')

  await createCollection('services', { sort_field: 'sort' }, [
    stringField('title'), textField('description'),
    stringField('lottie_animation'), intField('lottie_size'),
    jsonField('tags'), sortField(),
  ])

  await createCollection('packages', { sort_field: 'sort' }, [
    stringField('name'), stringField('price'), textField('description'),
    jsonField('features'), stringField('ideal_for'),
    stringField('cta'), stringField('cta_link'),
    boolField('popular'), sortField(),
  ])

  await createCollection('why_us', { sort_field: 'sort' }, [
    stringField('title'), textField('description'),
    stringField('lottie_animation'), stringField('color'),
    sortField(),
  ])

  await createCollection('how_we_work', { sort_field: 'sort' }, [
    stringField('step_number'), stringField('title'), textField('description'),
    stringField('animation_path'), sortField(),
  ])

  await createCollection('faqs', { sort_field: 'sort' }, [
    stringField('question'), richTextField('answer'), sortField(),
  ])

  await createCollection('blog_posts', {}, [
    stringField('title'), stringField('slug'), textField('excerpt'),
    richTextField('content'), fileField('featured_image'),
    stringField('author'), jsonField('tags'),
    datetimeField('published_at'), stringField('status', { interface: 'select-dropdown', options: { choices: [{ text: 'Draft', value: 'draft' }, { text: 'Published', value: 'published' }] } }),
  ])

  await createCollection('projects', { sort_field: 'sort' }, [
    stringField('title'), stringField('type'), textField('description'),
    stringField('url'), fileField('image'), fileField('image_mobile'),
    jsonField('tags'), jsonField('features'),
    boolField('featured'), boolField('self_link'), sortField(),
  ])

  await createCollection('testimonials', { sort_field: 'sort' }, [
    stringField('name'), stringField('business'), textField('quote'),
    fileField('image'), intField('rating'), stringField('url'),
    sortField(),
  ])

  // site_settings (singleton)
  await createCollection('site_settings', { singleton: true }, [
    stringField('site_name'), textField('site_description'),
    fileField('logo'), stringField('phone'), stringField('email'),
    stringField('whatsapp_number'), stringField('instagram_url'),
    stringField('facebook_url'), textField('address'),
    stringField('response_time'),
  ])
}

// ============ SEED DATA ============

async function seedItems(collection: string, items: Array<Record<string, unknown>>) {
  const res = await fetch(`${DIRECTUS_URL}/items/${collection}`, { headers })
  const existing = await res.json()
  if (existing.data && existing.data.length > 0) {
    console.log(`  [skip] ${collection}: ${existing.data.length} items exist`)
    return
  }
  for (const item of items) {
    await api('POST', `/items/${collection}`, item)
  }
  console.log(`  [seeded] ${collection}: ${items.length} items`)
}

async function seedSingleton(collection: string, data: Record<string, unknown>) {
  try {
    const res = await fetch(`${DIRECTUS_URL}/items/${collection}`, { headers })
    const existing = await res.json()
    if (existing.data && Object.keys(existing.data).length > 1) {
      console.log(`  [skip] ${collection}: already has data`)
      return
    }
  } catch { /* empty */ }
  await api('PATCH', `/items/${collection}`, data)
  console.log(`  [seeded] ${collection}`)
}

async function seedData() {
  console.log('\nSeeding data...')

  await seedItems('services', [
    { title: 'בניית אתרים', description: 'כל אתר נבנה מאפס בקוד, עם הטכנולוגיות המתקדמות בשוק. מהיר, מאובטח, וללא תלות בשום פלטפורמה.', lottie_animation: '/animations/1/web-design.json', lottie_size: 128, tags: ['React', 'Next.js', 'Tailwind CSS'], sort: 1 },
    { title: 'דפי נחיתה', description: 'דף ממוקד המרה עם WhatsApp וטפסים חכמים.', lottie_animation: '/animations/3%20landing%20page/Contact%20us.json', lottie_size: 128, tags: [], sort: 2 },
    { title: 'קידום אורגני', description: 'קידום אורגני שבאמת עובד, עם מחקר מילות מפתח, תוכן ממוקד ומבנה טכני נכון.', lottie_animation: '/animations/4%20SEO/Website%20SEO%20Audit.json', lottie_size: 128, tags: [], sort: 3 },
    { title: 'צ׳אטבוטים חכמים', description: 'צ׳אטבוטים מבוססי AI מהדור האחרון. אוטומציה של שירות לקוחות, תמיכה 24/7, ואיסוף לידים – הכל בלי להוסיף כוח אדם.', lottie_animation: '/animations/14%20chatbot/Live%20chatbot.json', lottie_size: 160, tags: [], sort: 4 },
  ])

  await seedItems('packages', [
    { name: 'דף נחיתה', price: 'החל מ-₪1,500', description: 'נוכחות דיגיטלית מהירה ואפקטיבית', features: ['עמוד אחד רספונסיבי', 'עיצוב מותאם אישית', 'טופס יצירת קשר', 'אופטימיזציית מהירות', 'SEO בסיסי'], ideal_for: 'לעסקים שרוצים נוכחות דיגיטלית מהירה', cta: 'בואו נדבר', cta_link: '#contact', popular: false, sort: 1 },
    { name: 'אתר תדמית', price: 'החל מ-₪3,500', description: 'אתר מקצועי ומרשים לעסק שלך', features: ['עד 5 עמודים', 'עיצוב מותאם אישית', 'רספונסיבי מלא', 'SEO מובנה', 'אינטגרציית Google Analytics', 'טופס יצירת קשר מתקדם', 'ליווי עד להשקה'], ideal_for: 'לעסקים שרוצים אתר מקצועי ומרשים', cta: 'בואו נדבר', cta_link: '#contact', popular: true, sort: 2 },
    { name: 'פרויקט מותאם', price: 'לפי הצעת מחיר', description: 'פתרון מותאם לצרכים ייחודיים', features: ['אתר מורכב / חנות / אפליקציה', 'פיצ׳רים מתקדמים (צ׳אטבוט AI, אינטגרציות, CMS)', 'עיצוב פרימיום', 'תמיכה שוטפת'], ideal_for: 'לעסקים עם צרכים ייחודיים ושאפתניים', cta: 'בואו נדבר', cta_link: '#contact', popular: false, sort: 3 },
  ])

  await seedItems('why_us', [
    { title: 'טכנולוגיה מתקדמת', description: 'עובדים עם React, Next.js ו-Astro לביצועים מעולים ותחזוקה קלה.', lottie_animation: '/animations/2/computer%20technician.json', color: 'orange', sort: 1 },
    { title: 'מותאם לבינה מלאכותית', description: 'האתר שלכם מותאם גם למנועי AI כמו ChatGPT ו-Perplexity, לא רק לגוגל. כך לקוחות חדשים מוצאים אתכם בכל מקום.', lottie_animation: '/animations/AI/AI%20animation.json', color: 'terracotta', sort: 2 },
    { title: 'ליווי אישי', description: 'מדברים ישירות עם המפתח, בלי middlemen.', lottie_animation: '/animations/6%20personal/contact%20us.json', color: 'sage', sort: 3 },
  ])

  await seedItems('how_we_work', [
    { step_number: '01', title: 'שיחת היכרות', description: 'מבינים את העסק, היעדים והקהל שלכם', animation_path: '/animations/8 call/Call Center Support Lottie Animation.json', sort: 1 },
    { step_number: '02', title: 'אפיון ועיצוב', description: 'מתכננים מבנה, עיצוב ו-UX מותאם אישית', animation_path: '/animations/10 design/Web Design Illustration.json', sort: 2 },
    { step_number: '03', title: 'פיתוח ובנייה', description: 'בונים עם הטכנולוגיה המתאימה, מהיר ומאובטח', animation_path: '/animations/9 build/website build.json', sort: 3 },
    { step_number: '04', title: 'השקה וליווי', description: 'משיקים, עוקבים אחרי ביצועים ומלווים לאורך זמן', animation_path: '/animations/11 launch/web deployment - Isometric Concept Lottie Animations.json', sort: 4 },
  ])

  await seedItems('faqs', [
    { question: 'מה כוללת חבילת הפיתוח ובמה היא שונה מהשוק?', answer: '<p>אנחנו בונים עבורך תשתית עבודה מלאה, לא רק "דף באינטרנט". כל פרויקט מותאם אישית לצרכים שלכם, מדף נחיתה ועד אתר מורכב. כל פרויקט כולל עיצוב מותאם אישית, רספונסיביות מלאה, וחיבור ל-WhatsApp וטופסי לידים חכמים.</p>', sort: 1 },
    { question: 'האם יש דמי מנוי חודשיים?', answer: '<p>בניגוד להרבה חברות בשוק, אצלנו האתר בבעלותכם המלאה. אין "שכירות" חודשית ואין אותיות קטנות. אתם משלמים פעם אחת על הפיתוח, וזהו. למי שרוצה ראש שקט באמת, אנחנו מציעים תחזוקה אופציונלית לעדכונים וגיבויים, אבל זו בחירה שלכם, לא חובה.</p>', sort: 2 },
    { question: 'כמה זמן לוקח עד שהאתר באוויר?', answer: '<p>אנחנו לא מאמינים ב"למרוח" זמן. אתר בסיסי מוכן תוך 2-3 שבועות, ואתרים מורכבים יותר תוך 4-6 שבועות. אם כל החומרים מוכנים אצלכם, אנחנו יודעים לרוץ אפילו מהר יותר.</p>', sort: 3 },
    { question: 'איך אני יכול להיות בטוח שאוהב את התוצאה?', answer: '<p>בדיוק בשביל זה אנחנו עובדים בשקיפות מלאה. לפני שנכנסים לפיתוח הקוד, אתם מקבלים סקיצה עיצובית לאישור. אהבתם? ממשיכים. יש הערות? מתקנים. אתם חלק מהתהליך כדי שלא יהיו הפתעות בסוף.</p>', sort: 4 },
    { question: 'האם האתר יופיע בגוגל ובבינה מלאכותית?', answer: '<p>חד משמעית כן. כל אתר עובר אופטימיזציה למנועי חיפוש (SEO) וגם מותאם למנועי התשובות החדשים (GEO) כמו ChatGPT ו-Perplexity. אנחנו דואגים לסריקה תקינה של גוגל ומפת אתר, כדי שלא רק תהיו קיימים – אלא גם ימצאו אתכם.</p>', sort: 5 },
    { question: 'אצטרך לשלם לכם על כל שינוי טקסט קטן בעתיד?', answer: '<p>ממש לא. אנחנו בונים את האתר על מערכת ניהול נוחה וידידותית. בסוף התהליך תקבלו הדרכה קצרה שתאפשר לכם לעדכן טקסטים, תמונות ובלוגים בעצמכם תוך שניות, בלי להיות תלויים באף מתכנת.</p>', sort: 6 },
    { question: 'אתם כותבים עבורי את התוכן או שאני צריך להביא הכל?', answer: '<p>מה שנוח לכם. יש לכם טקסטים? נטמיע אותם בצורה חכמה. אין לכם? אנחנו מציעים שירותי כתיבת תוכן שיווקי וקריאייטיב שיודע למכור. אנחנו גם מסייעים בבחירת תמונות מקצועיות מבנקי תמונות כדי שהאתר ייראה ברמה הגבוהה ביותר.</p>', sort: 7 },
    { question: 'האם האתר ייראה טוב בטלפון?', answer: '<p>היום בונים קודם כל למובייל. האתר שלכם יהיה רספונסיבי ב-100%, מה שאומר שהוא ייראה מדהים ויעבוד מושלם בכל מכשיר – מאייפון ועד מסכי 4K.</p>', sort: 8 },
    { question: 'מה לגבי אבטחה ופרטיות?', answer: '<p>אנחנו לא מתפשרים על זה. כל אתר מגיע עם תעודת SSL (המנעול הירוק), הגנות בסיסיות נגד פריצות ועמידה בתקני פרטיות, כדי שהגולשים שלכם ירגישו בטוחים להשאיר פרטים.</p>', sort: 9 },
    { question: 'אתם עושים גם לוגו ומיתוג?', answer: '<p>כן, אנחנו מציעים מעטפת 360. אם אין לכם זהות ויזואלית, נוכל לעצב עבורכם לוגו, לבחור שפה גרפית ולבנות מותג שלם שמתכתב עם האתר החדש שלכם.</p>', sort: 10 },
    { question: 'איך מתחילים? מה השלב הראשון?', answer: '<p>זה פשוט: קובעים שיחת אפיון קצרה (ללא התחייבות). נבין מה המטרות שלכם, נתאים את הפתרון המדויק עבורכם, וברגע שיוצאים לדרך אנחנו לוקחים את המושכות ומובילים אתכם עד להשקה.</p>', sort: 11 },
  ])

  await seedSingleton('site_settings', {
    site_name: 'MediaWave',
    site_description: 'שירותי פיתוח ועיצוב אתרים מקצועיים לעסקים קטנים ובינוניים',
    phone: '052-8731808',
    email: 'mediawaveisrael@gmail.com',
    whatsapp_number: '052-8731808',
    instagram_url: 'https://www.instagram.com/mediawaveisrael',
    address: '',
    response_time: 'אנחנו מגיבים לפניות תוך 24 שעות בימי עסקים',
  })
}

// ============ MAIN ============

async function main() {
  console.log(`Directus seed script — ${DIRECTUS_URL}`)

  // Health check
  try {
    const res = await fetch(`${DIRECTUS_URL}/server/health`)
    if (!res.ok) throw new Error(`Health check failed: ${res.status}`)
    console.log('Directus is reachable.')
  } catch (err) {
    console.error('Cannot reach Directus. Is it running? (npm run directus:up)')
    process.exit(1)
  }

  await createCollections()
  await seedData()

  console.log('\nSeed complete! Visit http://localhost:8055 to see the data.')
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
