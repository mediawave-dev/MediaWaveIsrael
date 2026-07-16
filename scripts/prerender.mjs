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

// Any path that matches no route renders the NotFound page. Prerendering it to
// 404.html lets Cloudflare Pages serve a real HTTP 404 for unknown URLs instead
// of the soft-404 (200 + homepage shell) it served with the /* catch-all.
const NOT_FOUND_ROUTE = '/__not-found__'

// Above-the-fold body fonts (hashed @fontsource assets) get preloads so they
// arrive BEFORE first paint — a late font swap both re-layouts the text
// (measured CLS 0.127 from "Web font loaded") and re-emits a later LCP entry.
// Hashes change per build, so the links are resolved from dist/assets here.
import { readdirSync } from 'fs'
function fontPreloadLinks() {
  const wanted = [
    /^heebo-hebrew-400-normal-.*\.woff2$/,
    /^heebo-hebrew-700-normal-.*\.woff2$/,
    /^outfit-latin-400-normal-.*\.woff2$/,
    /^outfit-latin-700-normal-.*\.woff2$/,
  ]
  const assets = readdirSync(resolve(DIST, 'assets'))
  return wanted
    .map((re) => assets.find((f) => re.test(f)))
    .filter(Boolean)
    .map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin>`)
    .join('')
}

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

  for (const route of [...ROUTES, NOT_FOUND_ROUTE]) {
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

    // Remove the BUILD-emitted modulepreload links too (react-vendor, framer,
    // router). They pull ~100KB of JS into the pre-paint bandwidth window at
    // 1.6Mbps; the entry module discovers and fetches them itself right after
    // first paint (see the paint-first loader below).
    html = html.replace(/<link rel="modulepreload"[^>]*>\s*/g, '')

    // PAINT-FIRST MOUNT: the page is fully prerendered, so the visitor gets
    // pixels before React. With the module script in <head>, the first frame
    // races script execution — in every trace React won (createRoot tears down
    // and rebuilds the DOM), so FCP/LCP were chained to the whole JS graph
    // (Lighthouse mobile LCP 4.3-4.8s). Loading the entry only AFTER the first
    // paint makes the static HTML the recorded FCP AND LCP.
    const entryMatch = html.match(/<script type="module" crossorigin(?:="")? src="(\/assets\/index-[^"]+)"><\/script>/)
    if (entryMatch) {
      const loader = `<script>(function(){var d=false;function m(){if(d)return;d=true;var s=document.createElement('script');s.type='module';s.crossOrigin='';s.src='${entryMatch[1]}';document.head.appendChild(s)}if(document.readyState==='complete'){setTimeout(m,150)}else{window.addEventListener('load',function(){setTimeout(m,150)})}setTimeout(m,3500)})()</script>`
      html = html.replace(entryMatch[0], loader)
    } else {
      console.warn(`    ! entry module script not found on ${route} — paint-first loader NOT applied`)
    }

    // Remove the static header placeholder (React header is now in the HTML)
    html = html.replace(/<header id="static-header"[\s\S]*?<\/header>\s*/, '')

    // Inject hashed body-font preloads next to the existing EFT preloads
    html = html.replace('<link rel="preload" href="/fonts/EFT_Betaamango.woff2"', `${fontPreloadLinks()}<link rel="preload" href="/fonts/EFT_Betaamango.woff2"`)

    // Write the prerendered HTML
    const outPath = route === '/'
      ? resolve(DIST, 'index.html')
      : route === NOT_FOUND_ROUTE
        ? resolve(DIST, '404.html')
        : resolve(DIST, route.slice(1), 'index.html')

    const outDir = dirname(outPath)
    if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })

    writeFileSync(outPath, html, 'utf-8')
    console.log(`    → ${outPath.replace(resolve('.'), '')}`)

    await page.close()
  }

  // /studio needs a REAL asset: Cloudflare Pages turns exact-path _redirects
  // rewrites to /index.html into a 308 redirect to / (verified on preview),
  // so the SPA shell is copied to studio/index.html — /studio and /studio/
  // then serve natively and React Router takes over client-side.
  const studioDir = resolve(DIST, 'studio')
  if (!existsSync(studioDir)) mkdirSync(studioDir, { recursive: true })
  writeFileSync(resolve(studioDir, 'index.html'), readFileSync(resolve(DIST, 'index.html')))
  console.log('  Copied SPA shell to /studio/index.html')

  await browser.close()
  server.close()
  console.log(`\nPrerendered ${ROUTES.length} pages!`)
}

prerender().catch((err) => {
  console.error('Prerender failed:', err)
  process.exit(1)
})
