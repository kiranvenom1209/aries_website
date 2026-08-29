import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import http from 'node:http'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const outDir = path.resolve(rootDir, 'netlify-deploy')

const routes = [
  '/',
  '/about',
  '/leap-one',
  '/team',
  '/news',
  '/gallery',
  '/join',
  '/partner',
  '/contact',
  '/login',
]

// Extract fallback news slugs
const fallbackNewsContent = fs.readFileSync(
  path.join(rootDir, 'src/lib/fallbackNews.ts'),
  'utf-8'
)
const slugMatches = [...fallbackNewsContent.matchAll(/"slug":\s*"([^"]+)"/g)].map(
  (m) => m[1]
)
const uniqueSlugs = Array.from(new Set(slugMatches))
for (const slug of uniqueSlugs) {
  routes.push(`/news/${slug}`)
}

console.log(`[Netlify Packager] Found ${routes.length} total routes to bundle.`)

function copyDirRecursive(src, dest, ignoreFilter = () => false) {
  if (!fs.existsSync(src)) return
  fs.mkdirSync(dest, { recursive: true })
  const entries = fs.readdirSync(src, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (ignoreFilter(entry.name, srcPath)) continue

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath, ignoreFilter)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

// Ignore giant unreferenced raw backups/videos to keep deploy folder light and avoid browser OOM
const ignoredMediaFiles = new Set([
  'c0576.mp4',
  'arm.glb',
  'leapone.glb',
  'leapone-rover1.png',
  'rover-isometric-1.png',
  'rover-isometric-1-1.png',
  'dsc01556.jpg',
  'dsc01541.jpg',
  'dsc01502.jpg',
  'dsc01503.jpg',
  'dsc01524.jpg',
  'dsc01546.jpg',
  'dsc01422.jpg',
  'rover-4.jpg',
  'websitebg.png',
])

function isIgnoredMedia(fileName, _fullPath) {
  if (fileName.endsWith('.mov')) return true
  if (ignoredMediaFiles.has(fileName.toLowerCase())) return true
  return false
}

function cleanHtmlImageUrls(html) {
  // 1. Remove Next.js dynamic image srcSet attributes that route to /_next/image
  let cleaned = html.replace(/srcSet="\/_next\/image\?[^"]*"/g, '')
  cleaned = cleaned.replace(/imageSrcSet="\/_next\/image\?[^"]*"/g, '')

  // 2. Rewrite any remaining /_next/image?url=... to direct static URLs
  cleaned = cleaned.replace(/src="\/_next\/image\?url=([^&"]+)[^"]*"/g, (match, encodedUrl) => {
    const directUrl = decodeURIComponent(encodedUrl)
    return `src="${directUrl}"`
  })

  // 3. Map Payload CMS dynamic API media endpoint /api/media/file/ to static /media/
  cleaned = cleaned.replace(/\/api\/media\/file\//g, '/media/')

  return cleaned
}

async function waitForServer(port) {
  for (let i = 0; i < 40; i++) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(`http://127.0.0.1:${port}/`, (res) => {
          if (res.statusCode && res.statusCode < 500) resolve(true)
          else reject(new Error(`Status ${res.statusCode}`))
        })
        req.on('error', reject)
        req.setTimeout(1000, () => {
          req.destroy()
          reject(new Error('timeout'))
        })
      })
      return true
    } catch {
      await new Promise((r) => setTimeout(r, 500))
    }
  }
  throw new Error('Server did not start in time')
}

async function fetchRoute(port, routePath) {
  return new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${port}${routePath}`, (res) => {
      let data = ''
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', () => {
        resolve(data)
      })
      res.on('error', reject)
    })
  })
}

async function main() {
  if (fs.existsSync(outDir)) {
    fs.rmSync(outDir, { recursive: true, force: true })
  }
  fs.mkdirSync(outDir, { recursive: true })

  // 1. Copy public directory assets (excluding giant unreferenced files)
  console.log('[Netlify Packager] Copying media assets...')
  copyDirRecursive(path.join(rootDir, 'public'), outDir, isIgnoredMedia)

  // 2. Also alias /api/media/file to /media for any API calls
  const apiMediaDir = path.join(outDir, 'api/media/file')
  fs.mkdirSync(path.dirname(apiMediaDir), { recursive: true })
  copyDirRecursive(path.join(rootDir, 'public/media'), apiMediaDir, isIgnoredMedia)

  // 3. Copy .next/static to _next/static
  console.log('[Netlify Packager] Copying .next/static to _next/static...')
  copyDirRecursive(
    path.join(rootDir, '.next/static'),
    path.join(outDir, '_next/static')
  )

  // 4. Start production Next.js server on an ephemeral port
  const port = 3894
  console.log(`[Netlify Packager] Starting Next.js instance on port ${port}...`)
  const server = spawn(
    'node',
    ['node_modules/next/dist/bin/next', 'start', '-p', String(port)],
    {
      cwd: rootDir,
      env: { ...process.env, PORT: String(port) },
      stdio: 'pipe',
    }
  )

  try {
    await waitForServer(port)
    console.log('[Netlify Packager] Next.js server ready. Crawling pages...')

    for (const r of routes) {
      const rawHtml = await fetchRoute(port, r)
      const html = cleanHtmlImageUrls(rawHtml)
      let targetFile
      if (r === '/') {
        targetFile = path.join(outDir, 'index.html')
      } else {
        const subDir = path.join(outDir, r.replace(/^\//, ''))
        fs.mkdirSync(subDir, { recursive: true })
        targetFile = path.join(subDir, 'index.html')
      }
      fs.writeFileSync(targetFile, html, 'utf-8')
    }

    // 5. Create Netlify redirects & headers
    const redirectsContent = `
# Netlify API media alias
/api/media/file/*   /media/:splat   200

# Netlify SPA and clean URL redirects
/news/*             /news/:splat/index.html   200
/*                  /index.html               200
`
    fs.writeFileSync(
      path.join(outDir, '_redirects'),
      redirectsContent.trim() + '\n',
      'utf-8'
    )

    console.log('[Netlify Packager] Static folder creation complete!')
    console.log(`[Netlify Packager] Deployable folder ready at: ${outDir}`)
  } finally {
    server.kill()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
