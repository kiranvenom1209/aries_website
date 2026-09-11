// Capture viewport-sized slices of every route at desktop and mobile widths for visual auditing.
// usage: node scripts/capture-route-slices.mjs [outDir] [routeKey,routeKey] — needs the dev server on :3000
import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const out = process.argv[2] || 'C:/Users/IBN/AppData/Local/Temp/audit'
const only = process.argv[3] ? process.argv[3].split(',') : null
const routes = {
  home: '/',
  about: '/about',
  'leap-one': '/leap-one',
  'leap-2': '/leap-2',
  team: '/team',
  news: '/news',
  'news-story': '/news/mission-complete-hsm-aries-space-finishes-17th-of-25-at-the-erc-2026-finals-in-krakow',
  'news-story-old': '/news/hardware-milestone-hsm-aries-space-successfully-assembles-latest-high-performance-flight-unit',
  gallery: '/gallery',
  join: '/join',
  partner: '/partner',
  contact: '/contact',
  login: '/login',
  'thank-you': '/thank-you',
  'not-found': '/this-page-does-not-exist',
}
const viewports = { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844 } }

const browser = await chromium.launch()
for (const [name, route] of Object.entries(routes)) {
  if (only && !only.includes(name)) continue
  for (const [vp, size] of Object.entries(viewports)) {
    const dir = path.join(out, name)
    await mkdir(dir, { recursive: true })
    const context = await browser.newContext({ viewport: size, deviceScaleFactor: 1, isMobile: vp === 'mobile', hasTouch: vp === 'mobile' })
    const page = await context.newPage()
    const errors = []
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)) })
    page.on('pageerror', (e) => errors.push('pageerror: ' + String(e).slice(0, 200)))
    await page.goto('http://localhost:3000' + route, { waitUntil: 'networkidle' }).catch(() => {})
    await page.waitForTimeout(3200) // preloader
    // walk the page so scroll-reveal animations fire, then capture each viewport slice
    let total = await page.evaluate(() => document.documentElement.scrollHeight)
    let i = 0
    for (let y = 0; y < total; y += size.height) {
      total = await page.evaluate(() => document.documentElement.scrollHeight) // lazy sections grow the page as we walk
      await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y)
      await page.waitForTimeout(650)
      i += 1
      await page.screenshot({ path: path.join(dir, `${vp}-${String(i).padStart(2, '0')}.jpg`), type: 'jpeg', quality: 72 })
      if (i >= 30) break
    }
    console.log(`${name} ${vp}: ${i} slices, height ${total}px, console errors: ${errors.length}${errors.length ? ' -> ' + errors.slice(0, 3).join(' | ') : ''}`)
    await context.close()
  }
}
await browser.close()
