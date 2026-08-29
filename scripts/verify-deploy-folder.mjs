import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const deployDir = path.join(rootDir, 'netlify-deploy')

function checkHtmlFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  let totalFound = 0
  let totalMissing = 0
  const missingList = []

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      const sub = checkHtmlFiles(fullPath)
      totalFound += sub.totalFound
      totalMissing += sub.totalMissing
      missingList.push(...sub.missingList)
    } else if (entry.name === 'index.html') {
      const html = fs.readFileSync(fullPath, 'utf-8')
      const matches = [...html.matchAll(/<img[^>]+src=["']([^"']+)["']/g)]
      for (const m of matches) {
        const src = m[1]
        if (src.startsWith('/')) {
          const localPath = path.join(deployDir, src.replace(/^\//, ''))
          if (fs.existsSync(localPath)) {
            totalFound++
          } else {
            totalMissing++
            missingList.push({ file: path.relative(deployDir, fullPath), src })
          }
        }
      }
    }
  }

  return { totalFound, totalMissing, missingList }
}

const result = checkHtmlFiles(deployDir)
console.log('Static Deploy Verification Results:')
console.log(`✓ Verified Images Found: ${result.totalFound}`)
console.log(`✗ Missing Images: ${result.totalMissing}`)
if (result.missingList.length > 0) {
  console.log('Missing items:', result.missingList.slice(0, 10))
} else {
  console.log('🎉 100% of all image references in all pages exist in netlify-deploy!')
}
