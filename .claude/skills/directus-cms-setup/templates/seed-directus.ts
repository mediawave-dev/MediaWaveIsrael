/**
 * Directus CMS Seed Script Template
 *
 * Creates collections, fields, and seeds initial data.
 * Run with: npx tsx scripts/seed-directus.ts
 *
 * CRITICAL NOTES:
 * - Collections MUST include `schema: {}` to create actual DB tables
 * - Without schema: {}, you get 403 errors on all item operations
 * - The script is idempotent (safe to run multiple times)
 */

import 'dotenv/config'

const DIRECTUS_URL = process.env.VITE_DIRECTUS_URL || 'http://localhost:8055'
const ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN || 'directus-admin-token'

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${ADMIN_TOKEN}`,
}

// ============ API HELPERS ============

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

async function createCollection(
  name: string,
  meta: Record<string, unknown>,
  fields: Array<Record<string, unknown>>
) {
  if (await collectionExists(name)) {
    console.log(`  [skip] ${name} already exists`)
    return
  }
  await api('POST', '/collections', {
    collection: name,
    schema: {},  // CRITICAL: creates actual DB table
    meta: { ...meta, icon: 'box' },
    fields: [
      {
        field: 'id',
        type: 'integer',
        meta: { hidden: true, interface: 'input', readonly: true },
        schema: { is_primary_key: true, has_auto_increment: true },
      },
      ...fields,
    ],
  })
  console.log(`  [created] ${name}`)
}

// ============ FIELD HELPERS ============

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

function selectField(field: string, choices: Array<{ text: string; value: string }>) {
  return { field, type: 'string', meta: { interface: 'select-dropdown', options: { choices } }, schema: {} }
}

// ============ COLLECTIONS ============
// Customize this section based on the project's content types

async function createCollections() {
  console.log('\nCreating collections...')

  // Example: Services (list collection with sort)
  // await createCollection('services', { sort_field: 'sort' }, [
  //   stringField('title'),
  //   textField('description'),
  //   jsonField('tags'),
  //   sortField(),
  // ])

  // Example: Site Settings (singleton)
  // await createCollection('site_settings', { singleton: true }, [
  //   stringField('site_name'),
  //   stringField('phone'),
  //   stringField('email'),
  //   fileField('logo'),
  // ])
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

  // Add your seed data here:
  // await seedItems('services', [
  //   { title: 'Service 1', description: 'Description', sort: 1 },
  // ])
  //
  // await seedSingleton('site_settings', {
  //   site_name: 'My Site',
  //   phone: '052-1234567',
  // })
}

// ============ MAIN ============

async function main() {
  console.log(`Directus seed script — ${DIRECTUS_URL}`)

  // Health check
  try {
    const res = await fetch(`${DIRECTUS_URL}/server/health`)
    if (!res.ok) throw new Error(`Health check failed: ${res.status}`)
    console.log('Directus is reachable.')
  } catch {
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
