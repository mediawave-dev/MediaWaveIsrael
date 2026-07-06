/**
 * Prerender script — generates static HTML for each route after Vite build.
 *
 * 1. Spins up a local static server from `dist/`
 * 2. Navigates Puppeteer to each route
 * 3. Waits for React to render
 * 4. Saves the full HTML (with content) back to disk
 *
 * Result: Google sees real content instead of an empty <div id="root"></div>.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createServer } from 'http'
import puppeteer from 'puppeteer'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const DIST = resolve('dist')
const PORT = 4173

/** Parse blog post slugs from blog-posts.ts (same pattern as generate-seo.mjs) */
function parseBlogSlugs() {
  const source = readFileSync(resolve(ROOT, 'src/data/blog-posts.ts'), 'utf-8')
  const slugs = []
  const regex = /slug:\s*'([^']+)'[\s\S]*?published:\s*(true|false)/g
  let match
  while ((match = regex.exec(source)) !== null) {
    if (match[2] === 'true') {
      slugs.push(match[1])
    }
  }
  return slugs
}

/** Parse slug values from a simple data file (services / portfolio examples) */
function parseDataSlugs(relPath) {
  const source = readFileSync(resolve(ROOT, relPath), 'utf-8')
  return [...source.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1])
}

// Static routes
const STATIC_ROUTES = ['/', '/blog', '/terms', '/privacy', '/accessibility']

// Dynamic routes from data files
const blogSlugs = parseBlogSlugs().map(s => `/blog/${s}`)
const serviceRoutes = parseDataSlugs('src/data/services.ts').map(s => `/services/${s}`)
const portfolioRoutes = parseDataSlugs('src/data/portfolio-examples.ts').map(s => `/portfolio/${s}`)

const ROUTES = [...STATIC_ROUTES, ...serviceRoutes, ...portfolioRoutes, ...blogSlugs]

/** Serve dist/ as a static file server */
function startServer() {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      let filePath = `${DIST}${req.url}`

      // SPA fallback — serve index.html for routes without extensions
      if (!filePath.includes('.')) filePath = `${DIST}/index.html`

      try {
        const content = readFileSync(filePath)
        const ext = filePath.split('.').pop()
        const mimeTypes = {
          html: 'text/html',
          js: 'application/javascript',
          css: 'text/css',
          svg: 'image/svg+xml',
          png: 'image/png',
          webp: 'image/webp',
          json: 'application/json',
          woff2: 'font/woff2',
          woff: 'font/woff',
          mp4: 'video/mp4',
        }
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' })
        res.end(content)
      } catch {
        // Fallback to index.html for SPA routes
        try {
          const html = readFileSync(`${DIST}/index.html`)
          res.writeHead(200, { 'Content-Type': 'text/html' })
          res.end(html)
        } catch {
          res.writeHead(404)
          res.end('Not found')
        }
      }
    })
    server.listen(PORT, () => resolve(server))
  })
}

async function prerender() {
  console.log('Starting prerender...')

  const server = await startServer()
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })

  for (const route of ROUTES) {
    console.log(`  Prerendering ${route}`)

    const page = await browser.newPage()

    // Block heavy assets that aren't needed for HTML content
    await page.setRequestInterception(true)
    page.on('request', (req) => {
      const type = req.resourceType()
      if (['image', 'media', 'font'].includes(type)) {
        req.abort()
      } else {
        req.continue()
      }
    })

    await page.goto(`http://localhost:${PORT}${route}`, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    })

    // Wait for React to mount and render content
    await page.waitForSelector('#root > *', { timeout: 10000 })

    // Small extra wait for animations/lazy components to settle
    await new Promise((r) => setTimeout(r, 1500))

    // Get the full rendered HTML
    let html = await page.content()

    // Remove the page loader (already rendered, not needed in static HTML)
    html = html.replace(/<div id="page-loader"[\s\S]*?<\/div>\s*/, '')

    // Remove modulepreload links Vite injected at RUNTIME while prerendering
    // (as="script"). Baking them into the HTML forces every visitor to
    // download all lazy section chunks at high priority before first paint.
    html = html.replace(/<link rel="modulepreload" as="script"[^>]*>\s*/g, '')

    // Remove the static header placeholder (React header is now in the HTML)
    html = html.replace(/<header id="static-header"[\s\S]*?<\/header>\s*/, '')

    // Write the prerendered HTML
    const outPath = route === '/'
      ? resolve(DIST, 'index.html')
      : resolve(DIST, route.slice(1), 'index.html')

    const outDir = dirname(outPath)
    if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })

    writeFileSync(outPath, html, 'utf-8')
    console.log(`    → ${outPath.replace(resolve('.'), '')}`)

    await page.close()
  }

  await browser.close()
  server.close()
  console.log(`\nPrerendered ${ROUTES.length} pages!`)
}

prerender().catch((err) => {
  console.error('Prerender failed:', err)
  process.exit(1)
})
