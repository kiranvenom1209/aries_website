/**
 * Audit `sizes` hints against what each image slot really needs.
 *
 * A `fill` image with object-fit: cover in a box that is taller than the image's aspect is
 * scaled by HEIGHT, so it needs more pixels than the box width — but the browser picks the
 * srcset candidate from `sizes`, which usually describes the width. This script loads every
 * route, walks it so lazy images load, and for each /media/ image compares the width the
 * browser actually chose (parsed from the `-<width>.webp` variant name in currentSrc —
 * `naturalWidth` is density-corrected for w-descriptor srcsets and only echoes `sizes`)
 * with the width the slot needs (box width, or box height × image aspect for cover).
 * Anything under 0.95× is reported with the `sizes` hint it carries and the vw the hint
 * should declare instead.
 *
 *   node scripts/media/audit-image-sizes.mjs [baseUrl=http://localhost:3000] [width=1920] [dpr=2]
 */
import { chromium } from 'playwright'

const base = process.argv[2] || 'http://localhost:3000'
const width = Number(process.argv[3] || 1920)
const dpr = Number(process.argv[4] || 2)
const routes = ['/', '/leap-one', '/leap-2', '/about', '/team', '/news', '/news/mission-complete-hsm-aries-space-finishes-17th-of-25-at-the-erc-2026-finals-in-krakow', '/gallery', '/partner', '/contact', '/join']

const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width, height: 1080 }, deviceScaleFactor: dpr })
const page = await context.newPage()
let total = 0
for (const route of routes) {
  await page.goto(base + route, { waitUntil: 'networkidle' }).catch(() => {})
  await page.evaluate(async () => {
    for (const img of document.images) img.loading = 'eager'
    const h = document.body.scrollHeight
    for (let y = 0; y < h; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)) }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(2500)
  const rows = await page.evaluate((vw) => {
    const out = []
    for (const img of document.images) {
      const src = img.currentSrc || ''
      if (!src.includes('/media/') || !img.naturalWidth) continue
      const b = img.getBoundingClientRect()
      if (b.width < 150) continue
      const cover = getComputedStyle(img).objectFit === 'cover'
      const aspect = img.naturalWidth / img.naturalHeight
      const needCss = cover ? Math.max(b.width, b.height * aspect) : b.width
      const m = src.match(/-(\d+)\.webp$/)
      const served = m ? Number(m[1]) : img.naturalWidth
      const ratio = served / (needCss * devicePixelRatio)
      if (ratio < 0.95) out.push({ file: src.split('/').pop(), box: `${Math.round(b.width)}x${Math.round(b.height)}`, cover, needCss: Math.round(needCss), needVw: Math.round((needCss / vw) * 100), sizes: img.sizes, served, ratio: +ratio.toFixed(2) })
    }
    return out
  }, width)
  total += rows.length
  console.log(`\n${route}  (${rows.length} under-served at ${width}px @${dpr}x)`)
  for (const r of rows) console.log(`  ${r.ratio.toFixed(2)}x  served ${String(r.served).padStart(4)}  need ${String(r.needCss).padStart(4)}css (${r.needVw}vw)  box ${r.box.padEnd(9)} sizes="${r.sizes}"  ${r.file}`)
}
await browser.close()
console.log(`\n${total} under-served image slots`)
