import { createServer } from 'node:http'
import { existsSync } from 'node:fs'
import { mkdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import sharp from 'sharp'

const frames = 720
const preview = process.argv.includes('--preview')
const version = process.argv.find(argument => argument.startsWith('--version='))?.split('=')[1] ?? 'v4'
if (!/^[a-z0-9-]+$/.test(version)) throw new Error('Use a simple alphanumeric render version.')
const renderWidth = 2400
const renderHeight = 1800
const rootDirectory = path.resolve(fileURLToPath(new URL('..', import.meta.url)))
const modelArgument = process.argv.find(argument => argument.startsWith('--model='))?.slice('--model='.length)
const modelPath = modelArgument
  ? path.resolve(modelArgument)
  : path.join(rootDirectory, 'public', 'media', 'models', 'leap-one.glb')
if (!existsSync(modelPath)) throw new Error(`Model not found: ${modelPath}`)
const outputDirectory = preview ? path.join(os.tmpdir(), 'aries-turntable-preview') : path.join(rootDirectory, 'public', 'media', `leap-one-studio-${version}`)
if (!preview && existsSync(outputDirectory)) {
  throw new Error('This render version already exists. Choose a new --version to avoid mixing camera settings in the live sequence.')
}

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

      import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
      import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js'
      import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
      import { SSAOPass } from 'three/addons/postprocessing/SSAOPass.js'
      import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
      import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'

      const frames = ${frames}
      const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('canvas'), antialias: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' })
      renderer.setPixelRatio(1)
      renderer.setSize(${renderWidth}, ${renderHeight}, false)
      renderer.setClearColor(0x050809, 1)
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 0.85
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.VSMShadowMap
      const scene = new THREE.Scene()
      scene.background = new THREE.Color(0x050809)
      scene.fog = new THREE.FogExp2(0x050809, .065)
      const pmrem = new THREE.PMREMGenerator(renderer)
      const room = new RoomEnvironment()
      scene.environment = pmrem.fromScene(room, .06).texture
      scene.environmentIntensity = .7
      room.dispose()
      pmrem.dispose()
      const camera = new THREE.OrthographicCamera(-2.5, 2.5, 1.875, -1.875, .1, 45)
      const turntable = new THREE.Group()
      scene.add(turntable)
      const loader = new GLTFLoader()
      loader.setMeshoptDecoder(MeshoptDecoder)
      const { scene: model } = await loader.loadAsync('/media/leap-one.glb')
      let bounds = new THREE.Box3().setFromObject(model)
      let size = bounds.getSize(new THREE.Vector3())
      model.scale.multiplyScalar(3.1 / Math.max(size.x, size.y, size.z))
      model.updateMatrixWorld(true)
      bounds = new THREE.Box3().setFromObject(model)
      size = bounds.getSize(new THREE.Vector3())
      const center = bounds.getCenter(new THREE.Vector3())
      model.position.sub(new THREE.Vector3(center.x, bounds.min.y, center.z))
      model.traverse(object => {
        if (!object.isMesh) return
        object.castShadow = true
        object.receiveShadow = true
        for (const material of (Array.isArray(object.material) ? object.material : [object.material])) {
          if (!material?.isMeshStandardMaterial) continue
          // Preserve the CAD's material colours; remove the unrealistically polished default.
          material.roughness = Math.max(material.roughness, .32)
          material.envMapIntensity = .9
          const hsl = material.color.getHSL({})
          if (hsl.l > .28 && hsl.s < .2 && !material.map) {
            material.metalness = Math.max(material.metalness, .72)
            material.roughness = .3
          }
        }
      })
      turntable.add(model)
      RectAreaLightUniformsLib.init()
      const softbox = (color, power, width, height, position) => {
        const light = new THREE.RectAreaLight(color, power, width, height)
        light.position.set(...position)
        light.lookAt(0, size.y * .45, 0)
        scene.add(light)
      }
      softbox(0xeaf3ff, 5, 5, 4, [1, 6, 4])
      softbox(0xaccce3, 2.5, 3, 5, [-5, 2.5, 1])
      softbox(0xff6428, 6, 2, 4, [2, 3, -4])
      const key = new THREE.DirectionalLight(0xf5f4f0, 1.6)
      key.position.set(-3, 7, 5)
      key.target.position.set(0, 1, 0)
      key.castShadow = true
      key.shadow.mapSize.set(4096, 4096)
      Object.assign(key.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4, near: .1, far: 20 })
      key.shadow.normalBias = .025
      key.shadow.bias = -.0001
      key.shadow.radius = 5
      key.shadow.blurSamples = 12
      scene.add(key, key.target)
      const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshStandardMaterial({ color: 0x070a0c, roughness: .84, metalness: .2 }))
      ground.rotation.x = -Math.PI / 2
      ground.position.y = -.008
      ground.receiveShadow = true
      scene.add(ground)
      // A restrained recessed orange ring grounds the model in the Aries visual language.
      const ring = new THREE.Mesh(new THREE.RingGeometry(2.05, 2.055, 160), new THREE.MeshBasicMaterial({color: 0x8c361a, side: THREE.DoubleSide}))
      ring.rotation.x = -Math.PI / 2
      ring.position.y = -.005
      scene.add(ring)
      const target = new THREE.Vector3(0, size.y * .48, 0)
      camera.position.set(4.4, 3.05, 5.35)
      camera.lookAt(target)
      const composer = new EffectComposer(renderer)
      const ao = new SSAOPass(scene, camera, ${renderWidth}, ${renderHeight}, 32)
      ao.kernelRadius = .055
      ao.minDistance = .0001
      ao.maxDistance = .045
      composer.addPass(new RenderPass(scene, camera))
      composer.addPass(ao)
      composer.addPass(new OutputPass())
      window.renderTurntableFrame = frame => {
        turntable.rotation.y = -(frame / frames) * Math.PI * 2 + Math.PI * .13
        composer.render()
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

await mkdir(path.join(outputDirectory, 'mobile'), { recursive: true })

await new Promise((resolve) => server.listen(3417, '127.0.0.1', resolve))

const browser = await chromium.launch({
  headless: true,
  args: ['--enable-webgl', '--ignore-gpu-blocklist', '--use-angle=d3d11'],
})

try {
  const page = await browser.newPage({ viewport: { width: renderWidth, height: renderHeight } })
  page.on('console', message => { if (message.type() === 'error') process.stderr.write(message.text() + '\n') })
  page.on('pageerror', error => process.stderr.write(error.message + '\n'))
  await page.goto('http://127.0.0.1:3417/turntable.html', { waitUntil: 'networkidle' })
  await page.waitForFunction(() => window.captureReady === true)

  const selectedFrames = preview ? [0, 180, 270, 360, 540] : Array.from({length: frames}, (_, i) => i)
  for (const frame of selectedFrames) {
    const dataURL = await page.evaluate((nextFrame) => {
      window.renderTurntableFrame(nextFrame)
      return document.querySelector('canvas').toDataURL('image/png')
    }, frame)
    const screenshot = Buffer.from(dataURL.split(',')[1], 'base64')
    const outputPath = path.join(outputDirectory, `frame_${String(frame).padStart(3, '0')}.webp`)

    await Promise.all([
      sharp(screenshot).resize(1600, 1200).webp({ quality: 90, smartSubsample: true }).toFile(outputPath),
      sharp(screenshot).resize(900, 900, { fit: 'cover' }).webp({ quality: 85, smartSubsample: true }).toFile(path.join(outputDirectory, 'mobile', path.basename(outputPath))),
    ])
    if (frame % 15 === 0) process.stdout.write('Rendered frame ' + frame + '/' + frames + '\n')
  }

  process.stdout.write(`Rendered ${selectedFrames.length} LEAP-One turntable frames to ${outputDirectory}\n`)
} finally {
  await browser.close()
  await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())))
}
