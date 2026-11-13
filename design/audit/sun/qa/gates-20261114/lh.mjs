// G3 / G4: Lighthouse mobile, 3 runs per route, median, against a deployed preview.
//   node lh.mjs <base> [runs]
import { execFileSync } from 'child_process'
import fs from 'fs'
const BASE = process.argv[2], RUNS = +(process.argv[3] || 3)
const routes = ['/', '/services/landing-pages/', '/services/building-websites/', '/services/program-sites/', '/services/video-editing/', '/services/memory-videos/', '/services/seo-promotion/', '/services/chatbots/', '/portfolio/memory-videos/', '/privacy/', '/terms/', '/accessibility/']
const med = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)] }
const rows = []
for (const r of routes) {
  const runs = []
  for (let i = 0; i < RUNS; i++) {
    const out = `C:/tmp/night/gates/lh-${r.replace(/\//g, '_')}-${i}.json`
    try {
      execFileSync('npx', ['-y', 'lighthouse@12', BASE + r, '--quiet', '--output=json', `--output-path=${out}`, '--only-categories=performance,accessibility,best-practices,seo', '--chrome-flags=--headless=new'], { stdio: 'ignore', shell: true, timeout: 180000 })
      const j = JSON.parse(fs.readFileSync(out, 'utf8')), a = j.audits, c = j.categories
      runs.push({ p: Math.round(c.performance.score * 100), a: Math.round(c.accessibility.score * 100), bp: Math.round(c['best-practices'].score * 100), seo: Math.round(c.seo.score * 100), lcp: a['largest-contentful-paint'].numericValue, cls: a['cumulative-layout-shift'].numericValue, tbt: a['total-blocking-time'].numericValue, fcp: a['first-contentful-paint'].numericValue, lcpEl: (a['largest-contentful-paint-element']?.details?.items?.[0]?.items?.[0]?.node?.snippet || '').slice(0, 80) })
      fs.rmSync(out)
    } catch (e) { runs.push({ error: String(e.message).slice(0, 120) }) }
  }
  const ok = runs.filter((x) => !x.error)
  const row = { route: r, n: ok.length, perf: med(ok.map((x) => x.p)), a11y: med(ok.map((x) => x.a)), bp: med(ok.map((x) => x.bp)), seo: med(ok.map((x) => x.seo)), lcp: Math.round(med(ok.map((x) => x.lcp))), fcp: Math.round(med(ok.map((x) => x.fcp))), cls: +med(ok.map((x) => x.cls)).toFixed(3), tbt: Math.round(med(ok.map((x) => x.tbt))), perfAll: ok.map((x) => x.p).join('/'), lcpEl: ok[0]?.lcpEl, errors: runs.filter((x) => x.error).map((x) => x.error) }
  rows.push(row); fs.writeFileSync('C:/tmp/night/gates/lh.json', JSON.stringify(rows, null, 1))
  console.log(`${r.padEnd(30)} perf ${row.perf} (${row.perfAll}) a11y ${row.a11y} bp ${row.bp} seo ${row.seo} LCP ${row.lcp} FCP ${row.fcp} CLS ${row.cls} TBT ${row.tbt}`)
}
