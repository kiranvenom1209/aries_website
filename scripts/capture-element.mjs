// usage: node scripts/capture-element.mjs <url> <selector> <out.jpg> [width]
import { chromium } from '@playwright/test'
const [url, selector, out, w] = process.argv.slice(2)
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: Number(w) || 1440, height: 900 } })
await page.goto(url, { waitUntil: 'networkidle' }); await page.waitForTimeout(3200)
const el = page.locator(selector).first(); await el.scrollIntoViewIfNeeded(); await page.waitForTimeout(900)
await el.screenshot({ path: out, type: 'jpeg', quality: 72 }); await browser.close(); console.log('saved', out)
