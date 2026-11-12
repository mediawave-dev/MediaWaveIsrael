// The lead form, end to end, without sending anything anywhere.
//
//   node design/audit/sun/qa/lead-check.mjs [base URL] [--no-browser]
//
// Part 1 runs the Pages Functions' own handlers (functions/api/lead.ts, event.ts, stats.ts) with a faked
// environment and a faked fetch: ready and not ready, good input, bad input, spam, an oversized or streamed
// body, the mail service failing (once, and three times in a row), the hourly ceiling, links with no
// scheme, invisible characters, labels that are names of built-ins. No request leaves this machine.
// Part 2 opens the site (default http://localhost:5188, the dev server) in a browser with /api/lead
// intercepted, and uses the form as a visitor would: mail not set up, mail set up, mail failing, by
// keyboard alone, with double presses, and with no script alive at all.
// Pictures of the contact circle go to ./qa/ under the folder you run it from. Exit code 1 on any failure.
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import fs from 'fs'
import path from 'path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..')
const require = createRequire(path.join(root, 'package.json'))
const args = process.argv.slice(2)
const base = (args.find((a) => !a.startsWith('--')) || 'http://localhost:5188').replace(/\/$/, '')
const withBrowser = !args.includes('--no-browser')
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

let failed = 0
const check = (name, ok, detail = '') => {
  if (!ok) failed++
  console.log(`${ok ? '  ok  ' : '  FAIL'}  ${name}${!ok && detail !== '' ? `\n          got: ${typeof detail === 'string' ? detail : JSON.stringify(detail)}` : ''}`)
}

/* ---------- part 1: the handlers ---------- */

const ts = require('typescript')
const load = async (file, tag = '') => {
  const src = fs.readFileSync(path.join(root, file), 'utf8')
  const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
  // a tag makes a fresh copy of the module (its in-memory counters start empty)
  return import('data:text/javascript;base64,' + Buffer.from(`${js}\n//${tag}`).toString('base64'))
}

const SITE = 'https://mediawave.co.il'
const OWNER = 'owner@example.com'
const points = []
const READY = () => ({
  CF_ACCOUNT_ID: '0123456789abcdef0123456789abcdef', LEAD_TOKEN: 'test-token', LEAD_TO: OWNER,
  EVENTS: { writeDataPoint: (p) => points.push(p) },
})
const GOOD = { name: 'דנה כהן', phone: '052-123 4567', ask: 'אשמח לשמוע על דף נחיתה או אתר.', t: 4200, mw_hp7: '', page: '/services/landing-pages/' }

// the faked mail service: records every call, answers what the test set
const calls = []
let answer
const delivered = () => new Response(JSON.stringify({ success: true, errors: [], messages: [], result: { delivered: [OWNER], permanent_bounces: [], queued: [] } }), { status: 200 })
const realFetch = globalThis.fetch
globalThis.fetch = async (url, init) => {
  calls.push({ url: String(url), init, body: init?.body && String(init.body).startsWith('{') ? JSON.parse(init.body) : init?.body })
  const a = answer()
  if (a instanceof Error) throw a
  return a
}

let ip = 0
const post = (handler, body, { env = READY(), headers = {}, raw, from } = {}) =>
  handler({
    env,
    request: new Request(`${SITE}/api/lead`, {
      method: 'POST',
      headers: { origin: SITE, 'content-type': 'application/json', 'cf-connecting-ip': from ?? `203.0.113.${++ip % 250}`, ...headers },
      body: raw ?? JSON.stringify(body),
    }),
  })
const read = async (res) => ({ status: res.status, ...(await res.json().catch(() => ({}))) })

console.log('\nThe function /api/lead (faked environment, faked mail service)')
{
  const lead = await load('functions/api/lead.ts')
  const get = async (env) => read(await lead.onRequestGet({ env, request: new Request(`${SITE}/api/lead`) }))
  const logs = []
  const realLog = console.log
  const quiet = async (fn) => { console.log = (l) => logs.push(String(l)); try { return await fn() } finally { console.log = realLog } }

  // ready and not ready
  check('GET says not ready when nothing is set', (await get({})).ready === false)
  check('GET says not ready while the recipient is missing', (await quiet(() => get({ ...READY(), LEAD_TO: undefined }))).ready === false)
  check('GET says not ready while the token is missing', (await quiet(() => get({ ...READY(), LEAD_TOKEN: '' }))).ready === false)
  check('GET says not ready for a malformed account id', (await quiet(() => get({ ...READY(), CF_ACCOUNT_ID: 'my-account' }))).ready === false)
  check('half a setup leaves a line in the logs with names only', logs.some((l) => l.includes('lead_not_ready') && l.includes('LEAD_TO')) && !logs.some((l) => l.includes('test-token')), logs)
  check('GET says ready once account, token and recipient are set', (await get(READY())).ready === true)
  answer = delivered
  let r = await read(await post(lead.onRequestPost, GOOD, { env: {} }))
  check('POST before the setup answers 503 and sends nothing', r.status === 503 && r.ok === false && calls.length === 0, r)

  // good input
  points.length = 0
  r = await read(await post(lead.onRequestPost, GOOD))
  const sent = calls[0]
  check('a good enquiry is mailed and answered ok', r.status === 200 && r.ok === true && calls.length === 1, r)
  check('it goes to Cloudflare Email Sending of the configured account', sent?.url === 'https://api.cloudflare.com/client/v4/accounts/0123456789abcdef0123456789abcdef/email/sending/send' && sent.init.method === 'POST', sent?.url)
  check('with the token as a Bearer header', sent?.init.headers.authorization === 'Bearer test-token')
  check('to the address from the environment', sent?.body.to === OWNER, sent?.body.to)
  check('from the default sender on the site\'s domain', sent?.body.from?.address === 'leads@mediawave.co.il', sent?.body.from)
  check('the subject carries the name and the phone', sent?.body.subject === 'דנה כהן, 0521234567', sent?.body.subject)
  const text = sent?.body.text ?? ''
  check('the mail holds the sentence, the name, the phone, the page and the time',
    text.includes(GOOD.ask) && text.includes('דנה כהן') && text.includes('0521234567') && text.includes(`${SITE}/services/landing-pages/`) && /יום \S+, \d{1,2}\.\d{1,2}\.\d{4}, \d{2}:\d{2}$/.test(text), text)
  check('the HTML mail links the phone and WhatsApp', (sent?.body.html ?? '').includes('href="tel:0521234567"') && sent.body.html.includes('href="https://wa.me/972521234567"'), sent?.body.html)
  check('the outcome is counted without the name or the phone', points.length === 1 && points[0].blobs[3] === 'sent' && !JSON.stringify(points).match(/דנה|052/), points)
  console.log('\n      the mail as the owner reads it\n      subject: ' + sent.body.subject + '\n      ' + text.split('\n').join('\n      ') + '\n')

  calls.length = 0
  r = await read(await post(lead.onRequestPost, { ...GOOD, to: 'thief@example.net', LEAD_TO: 'thief@example.net', email: 'thief@example.net', from: 'x@example.net' }))
  check('a recipient in the request is ignored', r.ok === true && calls[0].body.to === OWNER && !JSON.stringify(calls[0].body).includes('thief'), calls[0]?.body)
  calls.length = 0
  r = await read(await post(lead.onRequestPost, { ...GOOD, name: 'ד"ר רון & שות\'', phone: '+972 52-123 4567' }))
  check('+972 is read as the same number, and the name is escaped in the HTML',
    r.ok === true && calls[0].body.subject.endsWith('0521234567') && calls[0].body.html.includes('ד&quot;ר רון &amp; שות&#39;'), calls[0]?.body.html)
  calls.length = 0
  for (const page of ['//evil.example/x', 'https://evil.example/x', '/a?utm=1', 12]) await post(lead.onRequestPost, { ...GOOD, page })
  check('a page that is not a plain path of this site is left out', calls.length === 4 && calls.every((c) => !c.body.text.includes('נשלח מהעמוד') && !c.body.html.includes('evil')), calls.map((c) => c.body.text))
  calls.length = 0
  answer = () => new Response(JSON.stringify({ success: true, errors: [], result: { delivered: [], permanent_bounces: [], queued: [OWNER] } }), { status: 200 })
  r = await read(await post(lead.onRequestPost, GOOD))
  check('a mail the service queued counts as sent', r.status === 200 && r.ok === true, r)

  // bad input
  answer = delivered
  calls.length = 0
  const bad = [
    ['a one-letter name', { ...GOOD, name: 'ד' }, 'name'],
    ['a name with digits', { ...GOOD, name: 'דנה 123' }, 'name'],
    ['a name with a link', { ...GOOD, name: 'visit www.spam.example' }, 'name'],
    ['a name of 61 characters', { ...GOOD, name: 'א'.repeat(61) }, 'name'],
    ['a name that is not text', { ...GOOD, name: { a: 1 } }, 'name'],
    ['a phone that is not a number', { ...GOOD, phone: '12345' }, 'phone'],
    ['a missing phone', { ...GOOD, phone: undefined }, 'phone'],
    ['a sentence with a link', { ...GOOD, ask: 'buy now https://spam.example' }, 'ask'],
    ['a sentence of 201 characters', { ...GOOD, ask: 'א'.repeat(201) }, 'ask'],
  ]
  for (const [what, body, error] of bad) {
    r = await read(await post(lead.onRequestPost, body))
    check(`${what} is refused (${error})`, r.status === 400 && r.ok === false && r.error === error, r)
  }
  r = await read(await post(lead.onRequestPost, null, { raw: '{"name":' }))
  check('broken JSON is refused', r.status === 400 && r.error === 'bad_json', r)
  r = await read(await post(lead.onRequestPost, [GOOD]))
  check('a JSON list is refused', r.status === 400 && r.error === 'bad_json', r)
  r = await read(await post(lead.onRequestPost, GOOD, { headers: { 'content-type': 'application/x-www-form-urlencoded' } }))
  check('a body that is not JSON by its type is refused', r.status === 415, r)

  // spam
  points.length = 0
  r = await read(await post(lead.onRequestPost, { ...GOOD, mw_hp7: 'https://spam.example' }))
  check('the hidden field filled in is refused, and never answered as sent', r.status === 400 && r.ok === false && points[0]?.blobs[3] === 'trap', r)
  r = await read(await post(lead.onRequestPost, { ...GOOD, t: 300 }))
  check('a send 0.3 s after the form was seen is refused', r.status === 400 && r.error === 'too_fast', r)
  r = await read(await post(lead.onRequestPost, { ...GOOD, t: undefined }))
  check('a send with no time on the form is refused', r.status === 400 && r.error === 'too_fast', r)
  r = await read(await post(lead.onRequestPost, GOOD, { headers: { origin: 'https://evil.example' } }))
  check('another site\'s page is refused', r.status === 403 && r.error === 'origin', r)
  r = await read(await lead.onRequestPost({ env: READY(), request: new Request(`${SITE}/api/lead`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(GOOD) }) }))
  check('a request with no Origin is refused', r.status === 403, r)
  r = await read(await post(lead.onRequestPost, GOOD, { headers: { 'sec-fetch-site': 'cross-site' } }))
  check('a cross-site fetch is refused', r.status === 403, r)

  // an oversized body
  r = await read(await post(lead.onRequestPost, GOOD, { headers: { 'content-length': '999999' } }))
  check('a body declared larger than 2 KB is refused unread', r.status === 413 && r.error === 'too_big', r)
  r = await read(await post(lead.onRequestPost, { ...GOOD, pad: 'x'.repeat(3000) }))
  check('a body of 3 KB is refused', r.status === 413, r)
  r = await read(await post(lead.onRequestPost, { ...GOOD, pad: 'א'.repeat(1100) }))
  check('1,100 Hebrew letters (2.2 KB) are measured in bytes and refused', r.status === 413, r)
  check('none of the refused requests reached the mail service', calls.length === 0, calls.length)

  // the mail service failing
  const upstream = [
    ['answers 500', () => new Response(JSON.stringify({ success: false, errors: [{ code: 10002, message: 'internal_server' }], result: null }), { status: 500 })],
    ['refuses the token (403, code 10102)', () => new Response(JSON.stringify({ success: false, errors: [{ code: 10102 }], result: null }), { status: 403 })],
    ['accepts nothing (a bounce)', () => new Response(JSON.stringify({ success: true, errors: [], result: { delivered: [], permanent_bounces: [OWNER], queued: [] } }), { status: 200 })],
    ['answers with something that is not JSON', () => new Response('<html>bad gateway</html>', { status: 502 })],
    ['cannot be reached', () => new Error('network down')],
  ]
  for (const [what, a] of upstream) {
    answer = a
    points.length = 0
    logs.length = 0
    r = await quiet(async () => read(await post(lead.onRequestPost, GOOD)))
    check(`when the mail service ${what}, the answer is "not sent"`, r.status === 502 && r.ok === false && r.error === 'send' && points[0]?.blobs[3] === 'failed', r)
    if (what.includes('10102')) check('the reason is logged, the enquiry is not', logs.some((l) => l.includes('lead_failed') && l.includes('10102')) && !logs.join('').match(/דנה|052/), logs)
  }

  // From here on every block takes its own copy of the module: the function counts, in memory, five
  // enquiries per address in ten minutes, twenty an hour from everybody, and failed sends in a row.

  // five from one address in ten minutes
  answer = delivered
  calls.length = 0
  const perAddress = await load('functions/api/lead.ts', 'per-address')
  const many = []
  for (let i = 0; i < 6; i++) many.push((await read(await post(perAddress.onRequestPost, GOOD, { from: '198.51.100.7' }))).status)
  check('the sixth enquiry from one address in ten minutes is refused', many.join() === '200,200,200,200,200,429' && calls.length === 5, many)

  // twenty an hour from all addresses together (a script that changes its address for every enquiry)
  {
    const flood = await load('functions/api/lead.ts', 'flood')
    calls.length = 0
    points.length = 0
    const st = []
    for (let i = 0; i < 25; i++) st.push((await read(await post(flood.onRequestPost, GOOD, { from: `198.51.101.${i}` }))).status)
    check('25 enquiries from 25 addresses: twenty are mailed, the rest are refused (429)',
      st.slice(0, 20).every((x) => x === 200) && st.slice(20).every((x) => x === 429) && calls.length === 20, st)
    check('the refused ones are counted apart from the per-address limit', points.filter((p) => p.blobs[3] === 'flood').length === 5, points.map((p) => p.blobs[3]))
    check('while the hour is full GET says not ready, so the form offers WhatsApp at once', (await read(await flood.onRequestGet({ env: READY(), request: new Request(`${SITE}/api/lead`) }))).ready === false)
    const realNow = Date.now
    Date.now = () => realNow() + 61 * 60_000
    try {
      const later = await read(await post(flood.onRequestPost, GOOD, { from: '198.51.101.200' }))
      check('an hour later the form mails again', later.status === 200 && (await read(await flood.onRequestGet({ env: READY(), request: new Request(`${SITE}/api/lead`) }))).ready === true, later)
    } finally { Date.now = realNow }
  }

  // the mail service refuses every send (a revoked token): after three in a row the form rests on WhatsApp
  {
    const rest = await load('functions/api/lead.ts', 'rest')
    const ready = async () => (await read(await rest.onRequestGet({ env: READY(), request: new Request(`${SITE}/api/lead`) }))).ready
    const send = () => quiet(async () => read(await post(rest.onRequestPost, GOOD)))
    answer = () => new Response(JSON.stringify({ success: false, errors: [{ code: 10101 }], result: null }), { status: 401 })
    await send(); await send()
    check('two failed sends in a row: GET still says ready', (await ready()) === true)
    r = await send()
    check('three failed sends in a row: GET says not ready, new visitors get the WhatsApp button', (await ready()) === false)
    check('a visitor whose form already said mail is still answered "not sent", never "sent"', r.status === 502 && r.ok === false && r.error === 'send', r)
    const realNow = Date.now
    Date.now = () => realNow() + 10 * 60_000 + 1000
    try { check('ten minutes later the form tries mail again', (await ready()) === true) } finally { Date.now = realNow }
    answer = delivered
    r = await send()
    check('one send that goes out ends the rest', r.status === 200 && (await ready()) === true, r)
    answer = () => new Response(JSON.stringify({ success: false, errors: [{ code: 10004 }], result: null }), { status: 429 })
    await send(); await send()
    check('and the count of failures starts again from zero', (await ready()) === true)
    answer = delivered
  }

  // links without a scheme, which a mail reader turns into links
  {
    const links = await load('functions/api/lead.ts', 'links')
    calls.length = 0
    const spam = [
      ['a short link in the sentence', { ask: 'זכיתם בפרס! היכנסו עכשיו bit.ly/3xFreeGift וקבלו 500 שקל' }, 'ask'],
      ['a bare domain in the sentence', { ask: 'cheap-seo-links.example.com best price' }, 'ask'],
      ['a slash in the sentence', { ask: 'כתבו לנו בוואטסאפ 15550001111/now' }, 'ask'],
      ['a bare domain as the name', { name: 'spam-casino.example.com' }, 'name'],
      ['a chat link in the name', { name: 'בקרו ב t.me/crypto_pump' }, 'name'],
      ['an address behind a line break in the name', { name: 'דנה\u0085Bcc: thief@x.example' }, 'name'],
    ]
    for (const [what, patch, error] of spam) {
      r = await read(await post(links.onRequestPost, { ...GOOD, ...patch }))
      check(`${what} is refused (${error})`, r.status === 400 && r.error === error, r)
    }
    check('none of them reached the mail service', calls.length === 0, calls.length)

    // the rule must never refuse what the site itself sends: every sentence a page of the site hands to the form
    const src = (f) => fs.readFileSync(path.join(root, f), 'utf8')
    const sentences = [...new Set([
      ...[...src('src/data/services.ts').matchAll(/waText: '([^']+)'/g)].map((m) => m[1]),
      ...[...src('src/sun/pages.tsx').matchAll(/'(היי, [^']+)'/g)].map((m) => m[1]),
      ...[...src('src/sun/Home.tsx').matchAll(/const ASK = '([^']+)'/g)].map((m) => m[1]),
    ].map((s) => s.replace(/^היי,\s*/, '')))]
    const asks = await load('functions/api/lead.ts', 'asks')
    const refusedAsk = []
    for (const ask of sentences) if ((await read(await post(asks.onRequestPost, { ...GOOD, ask }))).status !== 200) refusedAsk.push(ask)
    check(`the site's own ${sentences.length} sentences are all accepted`, sentences.length >= 8 && sentences.length <= 20 && refusedAsk.length === 0, refusedAsk.length ? refusedAsk : sentences.length)
    const names = await load('functions/api/lead.ts', 'names')
    const refusedName = []
    for (const name of ['דנה כהן', "ז'אן-פייר לוי", 'י.כהן', 'רון ש.', 'בן-דוד', 'צ׳רלי', 'ד״ר רות', 'אבי/רונית', 'A.B. Levi', 'Dr. Smith', "O'Brien", 'Anne-Marie']) {
      if ((await read(await post(names.onRequestPost, { ...GOOD, name }))).status !== 200) refusedName.push(name)
    }
    check('ordinary names, with a dot, a dash, a slash or an apostrophe, are accepted', refusedName.length === 0, refusedName)
  }

  // what cannot be seen: control characters, zero-width and bidi marks; and what is stored of the page
  {
    const clean = await load('functions/api/lead.ts', 'clean')
    calls.length = 0
    r = await read(await post(clean.onRequestPost, { ...GOOD, name: 'דנה\u0085\u009bכהן\u200b\u061c\u2066', ask: 'שלום\u0085\u200dעולם\ufeff' }))
    check('line breaks of every kind, zero-width and bidi marks become one space', r.ok === true && calls[0]?.body.subject === 'דנה כהן, 0521234567' && calls[0].body.text.startsWith('שלום עולם\n'), calls[0]?.body)
    const invisible = /[\u0080-\u009f\u00ad\u061c\u200b-\u200f\u202a-\u202e\u2060-\u2069\ufeff]/
    const dirty = ['functions/api/lead.ts', 'functions/api/event.ts', 'functions/api/stats.ts', 'src/utils/lead.ts', 'src/utils/analytics.ts', 'design/audit/sun/qa/lead-check.mjs']
      .filter((f) => invisible.test(fs.readFileSync(path.join(root, f), 'utf8')))
    check('the sources hold no raw invisible character (the classes are written with escapes)', dirty.length === 0, dirty)
    points.length = 0
    calls.length = 0
    for (const page of ['/0547654321', '/dana/054-765-4321', '/%D7%93%D7%A0%D7%94-%D7%9B%D7%94%D7%9F']) await post(clean.onRequestPost, { ...GOOD, page })
    check('a phone or an encoded name passed as the page is neither stored nor mailed',
      points.length === 3 && points.every((p) => p.blobs[2] === '') && calls.every((c) => !c.body.text.includes('נשלח מהעמוד')), points.map((p) => p.blobs[2]))
  }

  // a body that is streamed declares no length: it is dropped as soon as it passes the cap, not read to its end
  {
    const streamed = await load('functions/api/lead.ts', 'streamed')
    let pulled = 0
    const chunk = new Uint8Array(64 * 1024).fill(120)
    const body = new ReadableStream({ pull(c) { if (pulled >= 50 * 1024 * 1024) return c.close(); pulled += chunk.length; c.enqueue(chunk) } })
    const headers = { origin: SITE, 'content-type': 'application/json', 'cf-connecting-ip': '203.0.113.240' }
    r = await read(await streamed.onRequestPost({ env: READY(), request: new Request(`${SITE}/api/lead`, { method: 'POST', headers, body, duplex: 'half' }) }))
    check('50 MB streamed with no declared length is refused after the first pieces', r.status === 413 && r.error === 'too_big' && pulled < 1024 * 1024, [r.status, `${(pulled / 1024).toFixed(0)} KB read`])
    // a small body that arrives in two pieces with no declared length is an ordinary enquiry
    const parts = [JSON.stringify(GOOD).slice(0, 40), JSON.stringify(GOOD).slice(40)].map((s) => new TextEncoder().encode(s))
    const small = new ReadableStream({ pull(c) { const next = parts.shift(); return next ? c.enqueue(next) : c.close() } })
    calls.length = 0
    r = await read(await streamed.onRequestPost({ env: READY(), request: new Request(`${SITE}/api/lead`, { method: 'POST', headers, body: small, duplex: 'half' }) }))
    check('a small enquiry that arrives in two pieces is mailed whole', r.status === 200 && calls[0]?.body.subject === 'דנה כהן, 0521234567', r)
  }
}

console.log('\nThe function /api/event (what an event can hold)')
{
  const ev = await load('functions/api/event.ts')
  const stored = []
  const send = (data, { env = { EVENTS: { writeDataPoint: (p) => stored.push(p) } }, headers = {} } = {}) => {
    const realLog = console.log
    console.log = () => {}
    return Promise.resolve(ev.onRequestPost({ env, request: new Request(`${SITE}/api/event`, { method: 'POST', headers: { origin: SITE, ...headers }, body: typeof data === 'string' ? data : JSON.stringify(data) }) })).finally(() => { console.log = realLog })
  }
  let res = await send({ event: 'form_submit', props: { placement: 'contact_form', mode: 'mail', src: 'facebook' }, path: '/services/landing-pages/', ts: 1 })
  check('a form event is stored with its spot, page, mode and campaign tag', res.status === 204 && stored[0]?.blobs.slice(0, 5).join('|') === 'form_submit|contact_form|/services/landing-pages/|mail|facebook', stored[0])
  for (const event of ['form_view', 'form_start', 'page_view', 'whatsapp_click', 'tel_click', 'mailto_click']) res = await send({ event, props: { placement: 'contact' }, path: '/' })
  check('the form, page and click events are all accepted', stored.length === 7 && res.status === 204, stored.length)
  stored.length = 0
  res = await send({ event: 'form_submit', props: { placement: '0521234567', mode: 'דנה כהן', src: 'dana@example.com', name: 'דנה כהן', phone: '0521234567' }, path: '/?name=dana' })
  check('a phone, a name or an address in an event is dropped, not stored', res.status === 204 && stored[0]?.blobs.join('|') === 'form_submit||/|||', stored[0])
  res = await send({ event: 'cta_click', props: { placement: 'Dana Cohen', mode: 'dana@example.com' }, path: '/' })
  check('so is a value with a space or an @', res.status === 204 && stored[1]?.blobs.join('|') === 'cta_click||/|||', stored[1])
  check('an unknown event is refused', (await send({ event: 'anything', props: {} })).status === 400)
  check('an oversized event is refused', (await send({ event: 'cta_click', props: { placement: 'x'.repeat(2000) } })).status === 413)
  check('an event from another site is refused', (await send({ event: 'cta_click' }, { headers: { origin: 'https://evil.example' } })).status === 403)
  check('without the storage binding the event is still accepted', (await send({ event: 'cta_click', props: { placement: 'hero' }, path: '/' }, { env: {} })).status === 204)
  stored.length = 0
  await send({ event: 'cta_click', props: { placement: '052-123-4567', mode: '052.123.4567', src: 'tel_052_123_4567', ref: '05-21-23-45-67' }, path: '/dana/052-123-4567' })
  check('a phone written with dashes or dots is dropped from every label and from the path', stored[0]?.blobs.join('|') === 'cta_click|||||', stored[0])
  await send({ event: 'cta_click', props: { src: 'fb_2026_11' }, path: '/%D7%93%D7%A0%D7%94-%D7%9B%D7%94%D7%9F' })
  check('a percent-encoded name is not a path, and a campaign tag with six digits is still a tag', stored[1]?.blobs.join('|') === 'cta_click||||fb_2026_11|', stored[1])
  let pulled = 0
  const chunk = new Uint8Array(64 * 1024).fill(120)
  const body = new ReadableStream({ pull(c) { if (pulled >= 20 * 1024 * 1024) return c.close(); pulled += chunk.length; c.enqueue(chunk) } })
  res = await ev.onRequestPost({ env: {}, request: new Request(`${SITE}/api/event`, { method: 'POST', body, duplex: 'half' }) })
  check('20 MB streamed with no declared length is refused after the first pieces', res.status === 413 && pulled < 1024 * 1024, [res.status, `${(pulled / 1024).toFixed(0)} KB read`])
}

console.log('\nThe function /api/stats (the private page of numbers)')
{
  const stats = await load('functions/api/stats.ts')
  const env = { STATS_KEY: 'a-long-test-password-123', CF_ACCOUNT_ID: '0123456789abcdef0123456789abcdef', STATS_TOKEN: 'stats-token' }
  const get = (e, auth) => stats.onRequestGet({ env: e, request: new Request(`${SITE}/api/stats?days=7`, { headers: auth ? { authorization: 'Basic ' + btoa('nati:' + auth) } : {} }) })
  calls.length = 0
  check('it answers 503 until its password is set', (await get({})).status === 503)
  check('it asks for a password', (await get(env)).status === 401)
  check('a wrong password is refused and nothing is read', (await get(env, 'wrong')).status === 401 && calls.length === 0)
  answer = () => new Response(JSON.stringify({ data: [
    { event: 'form_view', placement: 'contact_form', path: '/', mode: '', src: '', ref: '', n: '40' },
    { event: 'form_start', placement: 'contact_form', path: '/', mode: '', src: '', ref: '', n: '12' },
    { event: 'form_submit', placement: 'contact_form', path: '/', mode: 'mail', src: 'facebook', ref: '', n: '5' },
    { event: 'lead_mail', placement: '', path: '/', mode: 'sent', src: '', ref: '', n: '5' },
    { event: 'whatsapp_click', placement: 'corner', path: '/services/landing-pages/', mode: '', src: '', ref: 'instagram.com', n: '9' },
    { event: 'page_view', placement: '', path: '/', mode: 'landing', src: '', ref: 'google.com', n: '70' },
  ] }), { status: 200 })
  const res = await get(env, env.STATS_KEY)
  const html = await res.text()
  check('the right password shows the form, the mails, the spots and the referring sites',
    res.status === 200 && calls.length === 1 && calls[0].url.endsWith('/analytics_engine/sql') && calls[0].init.headers.authorization === 'Bearer stats-token'
    && ['ראו את הטופס', 'נשלח במייל', 'הפינה הקבועה', 'instagram.com', 'google.com', 'facebook'].every((s) => html.includes(s)) && html.includes('>40<') && !html.includes('stats-token'), html.slice(0, 300))

  // anyone can post an event whose label is the name of something every object carries
  const row = (r) => ({ event: 'whatsapp_click', placement: '', path: '/', mode: '', src: '', ref: '', n: '1', ...r })
  answer = () => new Response(JSON.stringify({ data: [
    row({ placement: 'constructor' }), row({ placement: '__proto__' }), row({ placement: 'hasOwnProperty' }),
    row({ event: 'form_submit', mode: 'toString' }), row({ event: 'tel_click', placement: 'valueOf' }), row({ event: 'lead_mail', mode: 'flood' }),
  ] }), { status: 200 })
  const odd = await get(env, env.STATS_KEY)
  const oddHtml = await odd.text()
  check('a stored label named constructor, __proto__, toString or valueOf is shown as plain text, and the page still renders',
    odd.status === 200 && ['<td>constructor<', '<td>__proto__<', '<td>hasOwnProperty<', '<td>toString<', '<td>טלפון, valueOf<'].every((s) => oddHtml.includes(s)) && !oddHtml.includes('native code'),
    odd.status === 200 ? oddHtml.match(/<td>[^<]*(?:constructor|proto|toString|valueOf|native)[^<]*</g) : oddHtml.match(/<code>([^<]*)<\/code>/)?.[1])
  check('enquiries stopped by the hourly ceiling have their own row', oddHtml.includes('יותר מ-20 פניות בשעה'))
}
globalThis.fetch = realFetch

/* ---------- part 2: the form in the browser ---------- */

if (withBrowser) {
  console.log(`\nThe form in the browser (${base}, /api/lead intercepted)`)
  const puppeteer = require('puppeteer')
  const content = fs.readFileSync(path.join(root, 'src/sun/content.ts'), 'utf8')
  const copy = (key) => content.match(new RegExp(`\\b${key}: '([^']+)'`))?.[1]
  const C = { whatsapp: copy('submitWhatsApp'), mail: copy('submit'), via: copy('viaWhatsApp'), sent: copy('sent'), failed: copy('failed') }
  check('the form\'s lines were found in src/sun/content.ts', Object.values(C).every(Boolean), C)
  fs.mkdirSync('qa', { recursive: true })
  const browser = await puppeteer.launch({ headless: 'new' })
  const NAME = 'דנה כהן'
  const PHONE = '0521234567'
  const BTN = '.form button[type=submit]'

  /** a page with /api/lead answered as the scenario says: get = undefined lets the server itself answer */
  const open = async ({ route = '/', get, postAnswer, postDelay = 0, width = 390, height = 844, referer } = {}) => {
    const p = await browser.newPage()
    await p.setViewport({ width, height, isMobile: width < 600, hasTouch: width < 600 })
    await p.evaluateOnNewDocument(() => {
      window.__opened = []
      window.open = (u) => { window.__opened.push(String(u)); return null }
      window.__events = []
      navigator.sendBeacon = (_url, blob) => { blob.text().then((t) => window.__events.push(JSON.parse(t))); return true }
      try { localStorage.setItem('mw_cookie_consent', 'accepted') } catch { /* private mode */ }
    })
    const posts = []
    let gets = 0
    await p.setRequestInterception(true)
    p.on('request', async (req) => {
      if (new URL(req.url()).pathname !== '/api/lead') return req.continue()
      if (req.method() === 'GET') {
        gets++
        return get === undefined ? req.continue() : req.respond({ status: 200, contentType: 'application/json', body: JSON.stringify(get) })
      }
      posts.push(JSON.parse(req.postData() || '{}'))
      if (postDelay) await wait(postDelay)
      if (postAnswer === 'offline') return req.abort('internetdisconnected')
      return req.respond({ status: postAnswer.status, contentType: 'application/json', body: JSON.stringify(postAnswer.body) })
    })
    const errors = []
    p.on('pageerror', (e) => errors.push(e.message))
    await p.goto(`${base}${route}${route.includes('?') ? '&' : '?'}reduce=1`, { waitUntil: 'networkidle2', referer })
    await p.waitForSelector('#contact .form')
    const early = gets
    await p.evaluate(() => document.querySelector('#contact .form').scrollIntoView({ block: 'center' }))
    await p.evaluate(() => document.fonts.ready)
    await wait(700)
    const state = () => p.evaluate((sel) => ({
      button: document.querySelector(sel).textContent.trim(),
      status: document.querySelector('.form__status').textContent,
      name: document.getElementById('lead-name').value,
      phone: document.getElementById('lead-phone').value,
      opened: window.__opened.map((u) => decodeURIComponent(u)),
      events: window.__events.map((e) => `${e.event}${e.props.mode ? ':' + e.props.mode : ''}`),
      rawEvents: JSON.stringify(window.__events),
      fieldErrors: [...document.querySelectorAll('.field__err')].map((e) => e.textContent),
    }), BTN)
    const fill = async () => { await p.type('#lead-name', NAME); await p.type('#lead-phone', PHONE) }
    return { p, posts, errors, state, fill, early }
  }
  const settled = (p, text) => p.waitForFunction((t) => document.querySelector('.form__status').textContent === t, { timeout: 8000 }, text).then(() => true, () => false)
  const noPersonal = (s) => !s.rawEvents.includes(NAME) && !s.rawEvents.includes(PHONE) && !s.rawEvents.includes('דנה')

  // 1. mail not set up (the answer every deployment gives until the keys exist)
  for (const [label, get] of [['the server has no /api/lead at all (today)', undefined], ['/api/lead says it is not ready', { ready: false }]]) {
    const { p, posts, errors, state, fill } = await open({ get })
    let s = await state()
    check(`${label}: the button says "${C.whatsapp}"`, s.button === C.whatsapp, s.button)
    await p.click(BTN)
    s = await state()
    check(`${label}: an empty form shows its two errors and opens nothing`, s.fieldErrors.length === 2 && s.opened.length === 0, s)
    await fill()
    await p.click(BTN)
    await wait(300)
    s = await state()
    check(`${label}: WhatsApp opens with the name, the phone and the sentence`,
      s.opened.length === 1 && s.opened[0].startsWith('https://wa.me/') && s.opened[0].includes(NAME) && s.opened[0].includes(PHONE) && s.opened[0].includes('אשמח לשמוע'), s.opened)
    check(`${label}: the form says the message waits in WhatsApp, and posts nothing`, s.status === C.via && posts.length === 0, s.status)
    check(`${label}: seen, first keystroke and the send are counted, with no personal data`, s.events.join() === 'form_view,form_start,form_submit:whatsapp' && noPersonal(s), s.events)
    check(`${label}: no script error`, errors.length === 0, errors)
    await p.close()
  }

  // 1b. mail not set up: a double click is one message, and a later press is a new one
  {
    const { p, state, fill } = await open({ get: { ready: false } })
    await fill()
    await p.evaluate((sel) => { const b = document.querySelector(sel); b.click(); b.click() }, BTN)
    await wait(300)
    let s = await state()
    check('not ready: a double click opens WhatsApp once and counts one send', s.opened.length === 1 && s.events.join() === 'form_view,form_start,form_submit:whatsapp', [s.opened.length, s.events])
    await wait(1100)
    await p.click(BTN)
    await wait(300)
    s = await state()
    check('not ready: a press more than a second later opens WhatsApp again', s.opened.length === 2, s.opened.length)
    await p.close()
  }

  // 2. mail set up and working
  {
    const { p, posts, errors, state, fill, early } = await open({ get: { ready: true }, postAnswer: { status: 200, body: { ok: true } } })
    check('ready: /api/lead is asked only once the form is near, not when the page loads', early === 0, early)
    let s = await state()
    check(`ready: the button says "${C.mail}"`, s.button === C.mail, s.button)
    await fill()
    await p.click(BTN)
    await p.click(BTN).catch(() => {})
    const ok = await settled(p, C.sent)
    s = await state()
    check(`ready: the form says "${C.sent}"`, ok, s.status)
    check('ready: two presses are one enquiry', posts.length === 1, posts.length)
    const b = posts[0] ?? {}
    check('ready: the post holds the name, the phone, the sentence, the page and the time on the form',
      b.name === NAME && b.phone === PHONE && /אשמח לשמוע/.test(b.ask) && b.page === '/' && b.t >= 1500 && b.mw_hp7 === '' && Object.keys(b).length === 6, b)
    check('ready: the fields are emptied and WhatsApp is not opened', s.name === '' && s.phone === '' && s.opened.length === 0, s)
    check('ready: the send is counted as mail, with no personal data', s.events.join() === 'form_view,form_start,form_submit:mail' && noPersonal(s), s.events)
    // an impatient extra tap that lands after the answer: no red errors over "received", no second enquiry
    await p.click(BTN)
    await wait(400)
    s = await state()
    check('ready: one more press after the answer leaves the answer alone', s.fieldErrors.length === 0 && s.status === C.sent && posts.length === 1 && s.opened.length === 0, s)
    check('ready: no script error', errors.length === 0, errors)
    await p.screenshot({ path: 'qa/lead-390-sent.png' })
    await p.close()
  }

  // 2b. keyboard only, a send that fails: the focus stays on the button from the press to the answer, so
  //     the way out ("send through WhatsApp") is under the finger and not behind the focus point
  {
    const { p, posts, state } = await open({ get: { ready: true }, postAnswer: { status: 502, body: { ok: false, error: 'send' } }, postDelay: 900 })
    const button = () => p.evaluate((sel) => {
      const b = document.querySelector(sel)
      return { focused: document.activeElement === b, disabled: b.disabled, aria: b.getAttribute('aria-disabled'), text: b.textContent.trim(), dim: getComputedStyle(b).opacity }
    }, BTN)
    await p.focus('#lead-name')
    await p.keyboard.type(NAME); await p.keyboard.press('Tab'); await p.keyboard.type(PHONE); await p.keyboard.press('Tab')
    await p.keyboard.press('Space')
    await wait(400)
    const during = await button()
    check('keyboard: while the mail is on its way the focus stays on the button, which reads as busy and is dimmed',
      during.focused && !during.disabled && during.aria === 'true' && Number(during.dim) < 1, during)
    await p.keyboard.press('Space')
    const said = await settled(p, C.failed)
    const after = await button()
    check('keyboard: after the failure the focus is on the same button, which now says WhatsApp', said && after.focused && after.aria === null && after.text === C.whatsapp, after)
    check('keyboard: a second press during the send was not a second enquiry', posts.length === 1, posts.length)
    await p.keyboard.press('Space')
    await wait(300)
    const s = await state()
    check('keyboard: one more press, with no Tab in between, opens WhatsApp with the message', s.opened.length === 1 && s.opened[0].includes(NAME) && s.opened[0].includes(PHONE), s.opened)
    await p.close()
  }

  // 3. mail set up and failing: by an error answer, and by no answer at all
  for (const [label, postAnswer] of [['the server answers 502', { status: 502, body: { ok: false, error: 'send' } }], ['the request never arrives', 'offline']]) {
    const { p, posts, errors, state, fill } = await open({ get: { ready: true }, postAnswer })
    await fill()
    await p.click(BTN)
    const said = await settled(p, C.failed)
    let s = await state()
    check(`failure (${label}): the form says "${C.failed}"`, said && s.status !== C.sent, s.status)
    check(`failure (${label}): what was typed stays, and the button now says "${C.whatsapp}"`, s.name === NAME && s.phone === PHONE && s.button === C.whatsapp && s.opened.length === 0, s)
    if (label.includes('502')) await p.screenshot({ path: 'qa/lead-390-failed.png' })
    await p.click(BTN)
    await wait(300)
    s = await state()
    check(`failure (${label}): the next press opens WhatsApp with the same message`,
      s.opened.length === 1 && s.opened[0].includes(NAME) && s.opened[0].includes(PHONE) && s.opened[0].includes('אשמח לשמוע') && s.status === C.via, s.opened)
    check(`failure (${label}): one post only, counted as failed and then as WhatsApp`, posts.length === 1 && s.events.join() === 'form_view,form_start,form_submit:mail_failed,form_submit:whatsapp_after_fail', [posts.length, s.events])
    check(`failure (${label}): no script error`, errors.length === 0, errors)
    await p.close()
  }

  // 4. the server's own check refuses a field
  {
    const { p, state, fill } = await open({ get: { ready: true }, postAnswer: { status: 400, body: { ok: false, error: 'phone' } } })
    await fill()
    await p.click(BTN)
    await p.waitForSelector('#lead-phone-err', { timeout: 8000 }).catch(() => {})
    const s = await state()
    check('a field the server refuses is marked on the field, and nothing is called sent', s.fieldErrors.length === 1 && s.status === '' && s.button === C.mail && s.opened.length === 0, s)
    await p.close()
  }

  // 5. a service page sends its own sentence and its own path
  {
    const { p, posts, fill } = await open({ route: '/services/landing-pages/', get: { ready: true }, postAnswer: { status: 200, body: { ok: true } } })
    await fill()
    await p.click(BTN)
    await settled(p, C.sent)
    check('a service page posts its own sentence and path', posts.length === 1 && posts[0].page === '/services/landing-pages/' && posts[0].ask.length > 5, posts[0])
    console.log(`      its sentence: ${posts[0]?.ask}`)
    await p.close()
  }

  // 6. where the visit came from rides on every event: the referring site's host and the link's campaign tag
  {
    // an http referrer on purpose: a browser hands none from an https page to an http one (the dev server)
    const { p, state, fill } = await open({ route: '/?utm_source=Facebook&utm_campaign=x', get: { ready: false }, referer: 'http://www.google.com/search?q=private' })
    await fill()
    await p.click(BTN)
    await wait(300)
    const s = await state()
    const events = JSON.parse(s.rawEvents)
    check('every event says the visit came from google.com through the link tagged facebook, and no more than that',
      events.length === 3 && events.every((e) => e.props.ref === 'google.com' && e.props.src === 'facebook' && e.path === '/') && !s.rawEvents.includes('private') && !s.rawEvents.includes('utm_campaign'), events)
    await p.close()
  }

  // 7. the look: the contact circle with mail not set up, at phone and desktop width, and proof that the
  //    hidden field draws nothing (the same picture with the field removed from the page)
  for (const [width, height] of [[390, 844], [1440, 900]]) {
    const { p } = await open({ get: { ready: false }, width, height })
    // the section is brought up and left to settle first, so both pictures are taken of a still page
    await p.evaluate(() => { document.activeElement?.blur?.(); document.getElementById('contact').scrollIntoView() })
    await wait(1200)
    const el = await p.$('#contact')
    const withField = await el.screenshot({ path: `qa/lead-${width}.png` })
    const box = await p.$eval('.form__trap', (e) => { const r = e.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height), getComputedStyle(e).position] })
    await p.$eval('.form__trap', (e) => e.remove())
    const without = await el.screenshot()
    check(`${width} px: the contact circle is pixel for pixel the same with and without the hidden field`, Buffer.compare(withField, without) === 0, box)
    await p.close()
  }

  // 8. the hidden field is out of reach of a keyboard and of a screen reader
  {
    const { p } = await open({ get: { ready: false } })
    await p.focus('#lead-name')
    const stops = []
    for (let i = 0; i < 3; i++) { await p.keyboard.press('Tab'); stops.push(await p.evaluate(() => document.activeElement.id || document.activeElement.name || document.activeElement.tagName)) }
    check('Tab goes name, phone, button: never into the hidden field', stops[0] === 'lead-phone' && stops[1] === 'BUTTON' && !stops.includes('mw_hp7'), stops)
    await p.addScriptTag({ content: fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8') })
    const violations = await p.evaluate(async () => (await window.axe.run(document.getElementById('contact'))).violations.map((v) => `${v.id} (${v.nodes.length})`))
    check('axe finds nothing in the contact section', violations.length === 0, violations)
    await p.close()
  }

  // 9. a press before the script is alive (the prerendered page on a slow phone). The form's own markup,
  //    as the prerender saves it, is served with scripts switched off: nothing may leave the page, and the
  //    name and the phone must not land in the address.
  {
    const live = await open({ get: { ready: false } })
    const markup = await live.p.$eval('#contact .form', (f) => f.outerHTML)
    await live.p.close()
    check('the form is rendered with method="dialog"', /^<form[^>]*\smethod="dialog"/.test(markup), markup.slice(0, 120))
    const p = await browser.newPage()
    await p.setViewport({ width: 390, height: 844 })
    await p.setJavaScriptEnabled(false)
    const navigations = []
    await p.setRequestInterception(true)
    p.on('request', (req) => {
      if (req.isNavigationRequest()) navigations.push(`${req.method()} ${decodeURIComponent(req.url())}`)
      return req.respond({ status: 200, contentType: 'text/html; charset=utf-8', body: `<!doctype html><html lang="he" dir="rtl"><meta charset="utf-8"><body><div style="height:900px"></div>${markup}</body></html>` })
    })
    const address = `${base}/form-without-script`
    await p.goto(address)
    await p.type('#lead-name', NAME)
    await p.type('#lead-phone', PHONE)
    await p.click(BTN)
    await wait(500)
    await p.focus('#lead-phone').then(() => p.keyboard.press('Enter')).catch(() => {})
    await wait(500)
    const kept = await p.$eval('#lead-name', (e) => e.value).catch(() => '(the page is gone)')
    check('with no script alive a press and an Enter go nowhere: no request, the same address, the fields keep what was typed',
      navigations.length === 1 && p.url() === address && kept === NAME, { navigations, kept })
    await p.close()
  }
  await browser.close()
}

console.log(failed ? `\n${failed} check${failed > 1 ? 's' : ''} FAILED\n` : '\nAll checks passed.\n')
process.exit(failed ? 1 : 0)
