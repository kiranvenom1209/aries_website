import { createServer } from 'node:http'
import { mkdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import sharp from 'sharp'

const frames = 360
const renderWidth = 1120
const renderHeight = 840
const rootDirectory = path.resolve(fileURLToPath(new URL('..', import.meta.url)))
const modelPath = path.join(rootDirectory, 'public', 'media', 'models', 'leap-one.glb')
const outputDirectory = path.join(rootDirectory, 'public', 'media', 'leap-one-turntable')

const mimeTypes = {
  '.glb': 'model/gltf-binary',
  '.js': 'text/javascript; charset=utf-8',
}

const rendererPage = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <style>html,body,canvas{height:100%;margin:0;width:100%;background:#000}</style>
    <script type="importmap">
      {"imports":{"three":"/three/build/three.module.js","three/addons/":"/three/addons/"}}
    </script>
  </head>
  <body>
    <canvas></canvas>
    <script type="module">
      import * as THREE from 'three'
      import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
      import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js'

      const frames = ${frames}
      const canvas = document.querySelector('canvas')
      const renderer = new THREE.WebGLRenderer({ antialias: true, canvas, preserveDrawingBuffer: true })
      renderer.setClearColor(0x000000, 1)
      renderer.setPixelRatio(1)
      renderer.setSize(${renderWidth}, ${renderHeight}, false)
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.32
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(30, ${renderWidth} / ${renderHeight}, 0.01, 1000)
      const turntable = new THREE.Group()
      scene.add(turntable)

      const key = new THREE.DirectionalLight(0xffeee0, 4.8)
      key.position.set(7, 9, 10)
      key.castShadow = true
      scene.add(key)
      const fill = new THREE.DirectionalLight(0x8ec5e8, 2.1)
      fill.position.set(-8, 4, 3)
      scene.add(fill)
      const rim = new THREE.DirectionalLight(0xff5a1f, 2.6)
      rim.position.set(-3, 8, -9)
      scene.add(rim)
      scene.add(new THREE.HemisphereLight(0x77b5db, 0x101316, 1.6))

      const loader = new GLTFLoader()
      loader.setMeshoptDecoder(MeshoptDecoder)
      const gltf = await loader.loadAsync('/media/leap-one.glb')
      const model = gltf.scene
      const bounds = new THREE.Box3().setFromObject(model)
      const size = bounds.getSize(new THREE.Vector3())
      const center = bounds.getCenter(new THREE.Vector3())
      const largestDimension = Math.max(size.x, size.y, size.z)

      model.position.set(-center.x, -bounds.min.y, -center.z)
      model.traverse((object) => {
        if (!object.isMesh) return
        object.castShadow = true
        object.receiveShadow = true
        const materials = Array.isArray(object.material) ? object.material : [object.material]
        materials.forEach((material) => {
          if (!material?.isMeshStandardMaterial) return
          material.envMapIntensity = 1.18
          material.roughness = Math.min(Math.max(material.roughness, 0.25), 0.56)
        })
      })
      turntable.add(model)

      const random = (() => {
        let seed = 318299
        return () => {
          seed = (seed * 16807) % 2147483647
          return (seed - 1) / 2147483646
        }
      })()
      const textureCanvas = document.createElement('canvas')
      textureCanvas.width = 512
      textureCanvas.height = 512
      const textureContext = textureCanvas.getContext('2d')
      textureContext.fillStyle = '#210e09'
      textureContext.fillRect(0, 0, 512, 512)
      for (let particle = 0; particle < 4200; particle += 1) {
        const brightness = 18 + Math.floor(random() * 45)
        const radius = 0.3 + random() * 2.2
        textureContext.fillStyle = 'rgb(' + (brightness + 24) + ', ' + brightness + ', ' + Math.max(4, brightness - 10) + ')'
        textureContext.beginPath()
        textureContext.arc(random() * 512, random() * 512, radius, 0, Math.PI * 2)
        textureContext.fill()
      }
      const marsTexture = new THREE.CanvasTexture(textureCanvas)
      marsTexture.colorSpace = THREE.SRGBColorSpace
      marsTexture.wrapS = THREE.RepeatWrapping
      marsTexture.wrapT = THREE.RepeatWrapping
      marsTexture.repeat.set(5, 5)
      marsTexture.anisotropy = renderer.capabilities.getMaxAnisotropy()

      const surface = new THREE.Mesh(
        new THREE.PlaneGeometry(largestDimension * 14, largestDimension * 14),
        new THREE.MeshStandardMaterial({ color: 0x552215, map: marsTexture, metalness: 0, roughness: 1 }),
      )
      surface.rotation.x = -Math.PI / 2
      surface.position.y = -0.015
      surface.receiveShadow = true
      scene.add(surface)

      const shadowExtent = largestDimension * 2.4
      key.shadow.mapSize.set(1024, 1024)
      key.shadow.camera.left = -shadowExtent
      key.shadow.camera.right = shadowExtent
      key.shadow.camera.top = shadowExtent
      key.shadow.camera.bottom = -shadowExtent
      key.shadow.camera.near = 0.1
      key.shadow.camera.far = largestDimension * 7

      const target = new THREE.Vector3(0, size.y * 0.36, 0)
      const cameraDistance = largestDimension * 2.3
      camera.position.set(cameraDistance, largestDimension * 1.08, cameraDistance * 1.18)
      camera.lookAt(target)

      window.renderTurntableFrame = (frame) => {
        turntable.rotation.y = -(frame / frames) * Math.PI * 2 + Math.PI * 0.13
        renderer.render(scene, camera)
      }
      window.renderTurntableFrame(0)
      window.captureReady = true
    </script>
  </body>
</html>`

function respond(response, statusCode, body, contentType) {
  response.writeHead(statusCode, { 'Content-Type': contentType })
  response.end(body)
}

const server = createServer(async (request, response) => {
  const pathname = new URL(request.url ?? '/', 'http://127.0.0.1').pathname

  if (pathname === '/turntable.html') {
    respond(response, 200, rendererPage, 'text/html; charset=utf-8')
    return
  }

  const filePath =
    pathname === '/media/leap-one.glb'
      ? modelPath
      : pathname.startsWith('/three/build/')
        ? path.join(rootDirectory, 'node_modules', 'three', pathname.replace('/three/', ''))
        : pathname.startsWith('/three/addons/')
          ? path.join(rootDirectory, 'node_modules', 'three', 'examples', 'jsm', pathname.replace('/three/addons/', ''))
          : null

  if (!filePath) {
    respond(response, 404, 'Not found', 'text/plain; charset=utf-8')
    return
  }

  try {
    const body = await readFile(filePath)
    respond(response, 200, body, mimeTypes[path.extname(filePath)] ?? 'application/octet-stream')
  } catch {
    respond(response, 404, 'Not found', 'text/plain; charset=utf-8')
  }
})

await mkdir(outputDirectory, { recursive: true })

await new Promise((resolve) => server.listen(3417, '127.0.0.1', resolve))

const browser = await chromium.launch({
  headless: true,
  args: ['--enable-webgl', '--ignore-gpu-blocklist', '--use-angle=swiftshader'],
})

try {
  const page = await browser.newPage({ viewport: { width: renderWidth, height: renderHeight } })
  await page.goto('http://127.0.0.1:3417/turntable.html', { waitUntil: 'networkidle' })
  await page.waitForFunction(() => window.captureReady === true)
  const canvas = page.locator('canvas')

  for (let frame = 0; frame < frames; frame += 1) {
    await page.evaluate((nextFrame) => window.renderTurntableFrame(nextFrame), frame)
    const screenshot = await canvas.screenshot()
    const outputPath = path.join(outputDirectory, `frame_${String(frame).padStart(3, '0')}.webp`)

    await sharp(screenshot)
      .webp({ alphaQuality: 100, quality: 82, smartSubsample: true })
      .toFile(outputPath)
  }

  process.stdout.write(`Rendered ${frames} LEAP-One turntable frames to ${outputDirectory}\n`)
} finally {
  await browser.close()
  await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())))
}
