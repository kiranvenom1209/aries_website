'use client'

import {
  Bvh,
  ContactShadows,
  Environment,
  Grid,
  Lightformer,
  OrbitControls,
  useGLTF,
  useProgress,
} from '@react-three/drei'
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import {
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from 'react'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

import {
  CAD_MODEL_URL,
  cleanPartName,
  type CadRenderMode,
  type CadStats,
  type CadView,
} from './cadTypes'
import { MarsTerrain } from './MarsTerrain'

export type CadCanvasProps = {
  autoRotate: boolean
  explode: number
  mode: CadRenderMode
  onCamera: (azimuth: number, elevation: number) => void
  onHover: (part: string | null) => void
  onInteract: () => void
  onProgress: (percent: number) => void
  onReady: (stats: CadStats) => void
  view: CadView
  viewNonce: number
}

/** Current lift of the exploded view, shared so the camera can rise with the rover. */
type LiftState = { fraction: number; height: number }

type Part = {
  base: THREE.Vector3
  direction: THREE.Vector3
  meshes: THREE.Mesh[]
  name: string
  node: THREE.Object3D
}

const ACCENT = new THREE.Color('#ff5a1f')

/** Shared override materials; the model's own PBR materials stay on `userData.original`. */
const OVERRIDES: Record<Exclude<CadRenderMode, 'solid'>, THREE.Material> = {
  blueprint: new THREE.MeshBasicMaterial({
    blending: THREE.AdditiveBlending,
    color: '#ff7a45',
    depthWrite: false,
    opacity: 0.07,
    transparent: true,
    wireframe: true,
  }),
  xray: new THREE.MeshBasicMaterial({
    blending: THREE.AdditiveBlending,
    color: '#7cc8ff',
    depthWrite: false,
    opacity: 0.075,
    side: THREE.DoubleSide,
    transparent: true,
  }),
}
const HIGHLIGHT: Record<CadRenderMode, THREE.Material> = {
  blueprint: new THREE.MeshBasicMaterial({
    color: '#ffffff',
    opacity: 0.85,
    transparent: true,
    wireframe: true,
  }),
  solid: new THREE.MeshStandardMaterial({
    color: '#ff5a1f',
    emissive: ACCENT,
    emissiveIntensity: 0.55,
    metalness: 0.2,
    roughness: 0.45,
  }),
  xray: new THREE.MeshBasicMaterial({
    blending: THREE.AdditiveBlending,
    color: '#ff7a45',
    depthWrite: false,
    opacity: 0.6,
    transparent: true,
  }),
}

/** GLTFLoader sanitises node names (drops dots, spaces become underscores); it keeps the CAD name here. */
const originalName = (node: THREE.Object3D) =>
  (node.userData.name as string | undefined) ?? node.name

/** Least-squares plane y = a·x + b·z + c through the contact points; returns its unit normal. */
function fitGroundPlane(points: Array<{ x: number; y: number; z: number }>) {
  let sxx = 0,
    sxz = 0,
    sx = 0,
    szz = 0,
    sz = 0,
    sxy = 0,
    szy = 0,
    sy = 0
  for (const { x, y, z } of points) {
    sxx += x * x
    sxz += x * z
    sx += x
    szz += z * z
    sz += z
    sxy += x * y
    szy += z * y
    sy += y
  }
  const normalMatrix = new THREE.Matrix3().set(sxx, sxz, sx, sxz, szz, sz, sx, sz, points.length)
  if (Math.abs(normalMatrix.determinant()) < 1e-12) return new THREE.Vector3(0, 1, 0)
  const [a, b] = new THREE.Vector3(sxy, szy, sy).applyMatrix3(normalMatrix.invert()).toArray()
  return new THREE.Vector3(-a, 1, -b).normalize()
}

function ProgressReporter({ onProgress }: { onProgress: (percent: number) => void }) {
  const { progress } = useProgress()
  useEffect(() => onProgress(progress), [onProgress, progress])
  return null
}

type RoverModelProps = Pick<CadCanvasProps, 'explode' | 'mode' | 'onHover' | 'onReady'> & {
  lift: MutableRefObject<LiftState>
  /** True while the rover stands assembled on the ground, false from lift-off until it lands. */
  onLanded: (landed: boolean) => void
}

function RoverModel({
  explode,
  lift: liftState,
  mode,
  onHover,
  onLanded,
  onReady,
}: RoverModelProps) {
  const { scene } = useGLTF(CAD_MODEL_URL, false, true)
  const hovered = useRef<Part | null>(null)
  const lifter = useRef<THREE.Group>(null)
  const explodeNow = useRef(0)
  const liftNow = useRef(0)
  const landed = useRef(true)

  // Stand the rover on its tyres and index its parts for the exploded view.
  const { hover, parts, offset } = useMemo(() => {
    // useGLTF caches the scene: undo any levelling from an earlier mount before measuring.
    scene.userData.baseQuaternion ??= scene.quaternion.clone()
    scene.quaternion.copy(scene.userData.baseQuaternion as THREE.Quaternion)
    scene.updateMatrixWorld(true)
    const assembly =
      scene.children.length === 1 && scene.children[0].children.length > 1
        ? scene.children[0]
        : scene

    // The CAD assembly leaves the suspension slightly articulated and the gripper hangs below the
    // wheels, so the lowest vertex is not the ground. As in the turntable render, fit a plane
    // through the tyre contact points, level the body onto it and put the floor at the tyres.
    const tyreContacts = () => {
      const found = assembly.children
        .filter((node) => /tire|tyre/i.test(originalName(node)))
        .map((node) => {
          // Exact vertex bounds: a wheel spun about its axle has a rotated bounding box whose corner
          // dips well below the tread, which would make that tyre look grounded when it is not.
          const box = new THREE.Box3().setFromObject(node, true)
          const centre = box.getCenter(new THREE.Vector3())
          return { x: centre.x, y: box.min.y, z: centre.z }
        })
      if (found.length === 0) return []
      const lowest = Math.min(...found.map((contact) => contact.y))
      return found.filter((contact) => contact.y < lowest + 0.2)
    }
    let contacts = tyreContacts()
    if (contacts.length >= 3) {
      const plane = fitGroundPlane(contacts)
      const up = new THREE.Vector3(0, 1, 0)
      if (plane.angleTo(up) < THREE.MathUtils.degToRad(6)) {
        scene.quaternion.premultiply(new THREE.Quaternion().setFromUnitVectors(plane, up))
        scene.updateMatrixWorld(true)
        contacts = tyreContacts()
      }
    }

    const bounds = new THREE.Box3().setFromObject(scene)
    const centre = bounds.getCenter(new THREE.Vector3())
    // Ground above the highest contact, so all six tyres sink into the regolith by 1.5–4 cm (after
    // levelling the contacts sit within ~2 cm of each other). A tyre resting tangent on a flat
    // plane reads as hovering from low angles; bedded into the sand it reads as standing.
    const floor = contacts.length
      ? Math.max(...contacts.map((contact) => contact.y)) + 0.015
      : bounds.min.y
    const size = bounds.getSize(new THREE.Vector3())
    const reach = Math.max(size.x, size.z)
    // Explode directions are designed in world space (y is up) and converted into the assembly's
    // own frame, which the CAD export may rotate or scale, before they move the part nodes.
    const toAssembly = new THREE.Matrix3().setFromMatrix4(assembly.matrixWorld.clone().invert())
    let lowestExploded = 0

    const list: Part[] = assembly.children.map((node) => {
      const box = new THREE.Box3().setFromObject(node)
      const outward = box.getCenter(new THREE.Vector3()).sub(centre)
      // Mostly outward, a little upward, so stacked parts separate without flying off.
      outward.y = outward.y * 0.6 + Math.abs(outward.y) * 0.25
      outward.multiplyScalar(0.95 + reach * 0.2)
      lowestExploded = Math.min(lowestExploded, box.min.y - floor + Math.min(0, outward.y))
      const direction = outward.applyMatrix3(toAssembly)
      const meshes: THREE.Mesh[] = []
      node.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh
          // useGLTF caches the scene: keep the first original across remounts.
          mesh.userData.original ??= mesh.material
          mesh.castShadow = true
          mesh.receiveShadow = true
          meshes.push(mesh)
        }
      })
      node.userData.base ??= node.position.clone()
      return {
        base: node.userData.base as THREE.Vector3,
        direction,
        meshes,
        name: cleanPartName(originalName(node)),
        node,
      }
    })
    // Lift the flat CAD colours: stronger reflections on metals, a touch of clearcoat-like
    // sheen on plastics, so edges and fasteners catch the studio lights.
    const tuned = new Set<THREE.Material>()
    for (const part of list) {
      for (const mesh of part.meshes) {
        const material = mesh.userData.original as THREE.MeshStandardMaterial
        if (!material?.isMeshStandardMaterial || tuned.has(material)) continue
        tuned.add(material)
        material.envMapIntensity = material.metalness > 0.5 ? 1.6 : 1.15
        if (material.metalness < 0.5) material.roughness = Math.min(material.roughness, 0.5)
      }
    }
    // Hover height for the exploded view: enough that the lowest part, at full spread, still
    // clears the regolith.
    return {
      hover: -lowestExploded + 0.12,
      offset: new THREE.Vector3(-centre.x, -floor, -centre.z),
      parts: list,
    }
  }, [scene])

  // The key light never moves, so its shadow map is redrawn only when geometry or mode changes.
  const gl = useThree((state) => state.gl)
  useEffect(() => {
    gl.shadowMap.autoUpdate = false
    gl.shadowMap.needsUpdate = true
  }, [gl, mode, parts])

  useEffect(() => {
    let triangles = 0
    scene.traverse((child) => {
      const geometry = (child as THREE.Mesh).isMesh ? (child as THREE.Mesh).geometry : null
      if (geometry)
        triangles +=
          (geometry.index ? geometry.index.count : geometry.attributes.position.count) / 3
    })
    onReady({ parts: parts.length, triangles: Math.round(triangles) })
  }, [onReady, parts.length, scene])

  // Render mode: swap every mesh between its own material and the shared override.
  useLayoutEffect(() => {
    for (const part of parts) {
      for (const mesh of part.meshes) {
        mesh.material =
          mode === 'solid' ? (mesh.userData.original as THREE.Material) : OVERRIDES[mode]
        mesh.castShadow = mode === 'solid'
      }
    }
    if (hovered.current) for (const mesh of hovered.current.meshes) mesh.material = HIGHLIGHT[mode]
  }, [mode, parts])

  // Exploding lifts the rover off the ground first and only then spreads the parts; collapsing
  // reassembles in the air and then sets it down, so nothing is pushed into the terrain.
  useFrame((_, delta) => {
    let lift = liftNow.current
    let spread = explodeNow.current
    if (explode > 0) {
      lift = THREE.MathUtils.damp(lift, 1, 4.5, delta)
      spread = THREE.MathUtils.damp(spread, lift > 0.9 ? explode : 0, 5, delta)
    } else {
      spread = THREE.MathUtils.damp(spread, 0, 6, delta)
      if (spread < 0.02) lift = THREE.MathUtils.damp(lift, 0, 4.5, delta)
    }
    if (lift < 1e-3 && explode === 0) lift = 0
    if (spread < 1e-4 && explode === 0) spread = 0

    const isLanded = lift === 0 && spread === 0
    if (isLanded !== landed.current) {
      landed.current = isLanded
      onLanded(isLanded)
    }
    if (Math.abs(lift - liftNow.current) < 1e-5 && Math.abs(spread - explodeNow.current) < 1e-5)
      return
    liftNow.current = lift
    explodeNow.current = spread
    if (lifter.current) lifter.current.position.y = lift * hover
    liftState.current.fraction = lift
    liftState.current.height = lift * hover
    for (const part of parts)
      part.node.position.copy(part.base).addScaledVector(part.direction, spread)
    gl.shadowMap.needsUpdate = true
  })

  const partOf = (object: THREE.Object3D) =>
    parts.find((part) => part.meshes.includes(object as THREE.Mesh)) ?? null

  const setHovered = (part: Part | null) => {
    if (hovered.current === part) return
    if (hovered.current) {
      for (const mesh of hovered.current.meshes) {
        mesh.material =
          mode === 'solid' ? (mesh.userData.original as THREE.Material) : OVERRIDES[mode]
      }
    }
    hovered.current = part
    if (part) for (const mesh of part.meshes) mesh.material = HIGHLIGHT[mode]
    onHover(part ? part.name : null)
    document.body.style.cursor = part ? 'crosshair' : ''
  }

  // Leave the cached scene as loaded: assembled, own materials, default cursor.
  useEffect(
    () => () => {
      document.body.style.cursor = ''
      for (const part of parts) {
        part.node.position.copy(part.base)
        for (const mesh of part.meshes) mesh.material = mesh.userData.original as THREE.Material
      }
    },
    [parts],
  )

  return (
    <group position={offset}>
      <group ref={lifter}>
        <Bvh firstHitOnly>
          <primitive
            object={scene}
            onPointerMove={(event: ThreeEvent<PointerEvent>) => {
              event.stopPropagation()
              setHovered(partOf(event.object))
            }}
            onPointerOut={() => setHovered(null)}
            onClick={(event: ThreeEvent<MouseEvent>) => {
              event.stopPropagation()
              setHovered(partOf(event.object))
            }}
          />
        </Bvh>
      </group>
    </group>
  )
}

// The assembly's long axis is X, with the arm and gripper at −X.
const VIEW_POSITIONS: Record<CadView, [number, number, number]> = {
  front: [-3.6, 1.05, 0],
  iso: [2.7, 1.7, 2.8],
  side: [0, 1.05, 3.6],
  top: [0.0001, 4, 0.0001],
}
const TARGET = new THREE.Vector3(0, 0.42, 0)
const FOLLOW_RISE = 0.65
const FOLLOW_DOLLY = 0.35

function CameraRig({
  autoRotate,
  lift,
  onCamera,
  onInteract,
  view,
  viewNonce,
}: Pick<CadCanvasProps, 'autoRotate' | 'onCamera' | 'onInteract' | 'view' | 'viewNonce'> & {
  lift: MutableRefObject<LiftState>
}) {
  const controls = useRef<OrbitControlsImpl>(null)
  const { camera } = useThree()
  const flight = useRef<THREE.Vector3 | null>(null)
  const followed = useRef<LiftState>({ fraction: 0, height: 0 })
  const lastReport = useRef('')

  useEffect(() => {
    flight.current = new THREE.Vector3(...VIEW_POSITIONS[view])
  }, [view, viewNonce])

  useFrame((_, delta) => {
    const orbit = controls.current
    if (!orbit) return
    const { fraction, height } = lift.current
    // Follow the exploded view: rise with the rover and ease back so the spread parts stay framed.
    const rise = FOLLOW_RISE * height
    const dolly = 1 + FOLLOW_DOLLY * fraction
    if (flight.current) {
      const goal = flight.current.clone().sub(TARGET).multiplyScalar(dolly).add(TARGET)
      goal.y += rise
      camera.position.lerp(goal, 1 - Math.exp(-delta * 4.5))
      orbit.target.lerp(
        new THREE.Vector3(TARGET.x, TARGET.y + rise, TARGET.z),
        1 - Math.exp(-delta * 4.5),
      )
      if (camera.position.distanceTo(goal) < 0.01) flight.current = null
    } else if (fraction !== followed.current.fraction || height !== followed.current.height) {
      const lastRise = FOLLOW_RISE * followed.current.height
      const lastDolly = 1 + FOLLOW_DOLLY * followed.current.fraction
      const offset = camera.position
        .clone()
        .sub(orbit.target)
        .multiplyScalar(dolly / lastDolly)
      orbit.target.y += rise - lastRise
      camera.position.copy(orbit.target).add(offset)
    }
    followed.current = { fraction, height }
    orbit.update()
    const offset = camera.position.clone().sub(orbit.target)
    const azimuth = Math.round(THREE.MathUtils.radToDeg(Math.atan2(offset.x, offset.z)) + 360) % 360
    const elevation = Math.round(THREE.MathUtils.radToDeg(Math.asin(offset.y / offset.length())))
    const report = `${azimuth}:${elevation}`
    if (report !== lastReport.current) {
      lastReport.current = report
      onCamera(azimuth, elevation)
    }
  })

  return (
    <OrbitControls
      autoRotate={autoRotate}
      autoRotateSpeed={0.55}
      dampingFactor={0.08}
      enableDamping
      makeDefault
      maxDistance={7}
      // Stop short of grazing angles, where any object on a plane starts to look like it floats.
      maxPolarAngle={Math.PI * 0.46}
      minDistance={0.9}
      onStart={() => {
        flight.current = null
        onInteract()
      }}
      ref={controls}
      target={TARGET}
    />
  )
}

/** Low dusk sun over the Mars yard: long, raking shadows bring out every bracket and bolt. */
const SUN = new THREE.Vector3(-4.2, 2.5, 2.6)

/** The sun is the only shadow caster; its map covers the rover and the rocks around it. */
function SunLight({ mode }: { mode: CadRenderMode }) {
  const light = useRef<THREE.DirectionalLight>(null)
  useLayoutEffect(() => {
    const sun = light.current
    if (!sun) return
    const camera = sun.shadow.camera
    camera.left = -2.4
    camera.right = 2.4
    camera.top = 2.4
    camera.bottom = -2.4
    camera.near = 0.5
    camera.far = 14
    camera.updateProjectionMatrix()
    sun.shadow.mapSize.set(2048, 2048)
    sun.shadow.bias = -0.0004
    sun.shadow.normalBias = 0.015
    sun.shadow.radius = 2.5
    sun.target.position.set(0, 0.3, 0)
    sun.target.updateMatrixWorld()
  }, [])
  return (
    <directionalLight
      castShadow={mode === 'solid'}
      color="#ffc896"
      intensity={3.6}
      position={SUN.toArray()}
      ref={light}
    />
  )
}

/**
 * Reflections for the metal parts: a dusk sky with the sun's glow, rust ground bounce and a cool
 * strip behind for edge highlights. Built from primitives — no HDR files, no third-party request.
 */
function MarsReflections() {
  const sunPanel = SUN.clone().normalize().multiplyScalar(8)
  return (
    <Environment environmentIntensity={0.9} frames={1} resolution={256}>
      <color args={['#1a0d08']} attach="background" />
      <Lightformer
        color="#8a5a40"
        form="rect"
        intensity={1.2}
        position={[0, 7, 0]}
        rotation-x={Math.PI / 2}
        scale={[14, 14, 1]}
      />
      <Lightformer
        color="#ffcf9e"
        form="rect"
        intensity={7}
        position={sunPanel.toArray()}
        scale={[3.5, 2.5, 1]}
        target={[0, 0, 0]}
      />
      <Lightformer
        color="#6d2c16"
        form="rect"
        intensity={1.4}
        position={[0, -3, 0]}
        rotation-x={-Math.PI / 2}
        scale={[14, 14, 1]}
      />
      <Lightformer
        color="#b9d1ff"
        form="rect"
        intensity={2.6}
        position={[5, 2, -5]}
        scale={[0.6, 6, 1]}
        target={[0, 0, 0]}
      />
    </Environment>
  )
}

export default function CadCanvas(props: CadCanvasProps) {
  const {
    autoRotate,
    explode,
    mode,
    onCamera,
    onHover,
    onInteract,
    onProgress,
    onReady,
    view,
    viewNonce,
  } = props
  const field = mode === 'solid'
  const [landed, setLanded] = useState(true)
  const lift = useRef<LiftState>({ fraction: 0, height: 0 })
  return (
    <Canvas
      camera={{ far: 120, fov: 30, near: 0.05, position: VIEW_POSITIONS.iso }}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}
      shadows="percentage"
    >
      <color args={['#050607']} attach="background" />
      {/* Field (solid): dust haze matching the horizon. Lab (x-ray, blueprint): dark stage. */}
      <fog
        args={field ? ['#3d1c10', 7, 30] : ['#050607', 5.5, 13]}
        attach="fog"
        key={field ? 'field' : 'lab'}
      />
      <hemisphereLight args={['#e2a47c', '#3a160b', field ? 0.55 : 0.3]} />
      <SunLight mode={mode} />
      {/* Cool sky rim from behind separates the silhouette from the dusk. */}
      <directionalLight color="#9db8ff" intensity={1.5} position={[3, 2.4, -3.4]} />
      {/* Warm bounce off the regolith keeps the shadow side readable. */}
      <directionalLight color="#d98a5c" intensity={0.45} position={[2.5, 0.4, 2.8]} />
      <MarsReflections />
      <ProgressReporter onProgress={onProgress} />
      <Suspense fallback={null}>
        <RoverModel
          explode={explode}
          lift={lift}
          mode={mode}
          onHover={onHover}
          onLanded={setLanded}
          onReady={onReady}
        />
        {field ? <MarsTerrain sun={SUN} /> : null}
        {/* Contact passes under the assembled rover: a tight, dark one where the tyres meet the
            sand (only geometry within 12 cm of the ground) and a broad, soft one for the body. */}
        {field && landed && explode === 0 ? (
          <>
            <ContactShadows
              blur={0.9}
              far={0.12}
              frames={1}
              opacity={0.95}
              position={[0, 0.003, 0]}
              resolution={1024}
              scale={2.6}
            />
            <ContactShadows
              blur={2.6}
              far={1.2}
              frames={1}
              opacity={0.5}
              position={[0, 0.002, 0]}
              resolution={512}
              scale={3.4}
            />
          </>
        ) : null}
      </Suspense>
      {field ? null : (
        <Grid
          cellColor="#1a2227"
          cellSize={0.1}
          cellThickness={0.6}
          fadeDistance={9}
          fadeStrength={1.6}
          infiniteGrid
          position={[0, -0.001, 0]}
          sectionColor={mode === 'blueprint' ? '#ff5a1f' : '#3b2a22'}
          sectionSize={0.5}
          sectionThickness={1}
        />
      )}
      <CameraRig
        autoRotate={autoRotate}
        lift={lift}
        onCamera={onCamera}
        onInteract={onInteract}
        view={view}
        viewNonce={viewNonce}
      />
    </Canvas>
  )
}
