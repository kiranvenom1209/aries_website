'use client'

import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { mergeVertices } from 'three-stdlib'

/**
 * A procedural Mars-yard: rust regolith with dunes that rise toward the horizon, a flat pad
 * where the rover stands, half-buried rocks and a dusty dusk sky. Everything is generated in
 * the browser from a fixed seed, so the scene is identical on every visit and needs no files.
 */

const SIZE = 40
const SEGMENTS = 280
const PAD_RADIUS = 1.05
const PAD_BLEND = 2.2

function mulberry32(seed: number) {
  let state = seed
  return () => {
    state |= 0
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const hash = (x: number, y: number) => {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return s - Math.floor(s)
}

function valueNoise(x: number, y: number) {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const xf = x - xi
  const yf = y - yi
  const u = xf * xf * (3 - 2 * xf)
  const v = yf * yf * (3 - 2 * yf)
  const a = hash(xi, yi)
  const b = hash(xi + 1, yi)
  const c = hash(xi, yi + 1)
  const d = hash(xi + 1, yi + 1)
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
}

function fbm(x: number, y: number, octaves = 5) {
  let amplitude = 0.5
  let frequency = 1
  let sum = 0
  for (let octave = 0; octave < octaves; octave += 1) {
    sum += amplitude * valueNoise(x * frequency, y * frequency)
    frequency *= 2.03
    amplitude *= 0.5
  }
  return sum
}

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

/** Ground height at a world position; zero on the rover pad. */
export function terrainHeight(x: number, z: number) {
  const radius = Math.hypot(x, z)
  const dunes = (fbm(x * 0.18 + 11, z * 0.18 - 7, 4) - 0.5) * 1.6
  const ripples = (fbm(x * 1.6, z * 1.6, 3) - 0.5) * 0.05
  const horizon = smoothstep(4, 18, radius) * (0.4 + fbm(x * 0.07, z * 0.07, 3) * 1.6)
  return smoothstep(PAD_RADIUS, PAD_BLEND, radius) * (dunes * smoothstep(1.2, 7, radius) + ripples + horizon)
}

const REGOLITH = [new THREE.Color('#62301b'), new THREE.Color('#7d4226'), new THREE.Color('#955732'), new THREE.Color('#3f1d0f')]

function useTerrainGeometry() {
  return useMemo(() => {
    const geometry = new THREE.PlaneGeometry(SIZE, SIZE, SEGMENTS, SEGMENTS)
    geometry.rotateX(-Math.PI / 2)
    const position = geometry.attributes.position
    const colors = new Float32Array(position.count * 3)
    const color = new THREE.Color()
    for (let index = 0; index < position.count; index += 1) {
      const x = position.getX(index)
      const z = position.getZ(index)
      const height = terrainHeight(x, z)
      position.setY(index, height)
      // Colour: large patches of lighter dust and darker grit, darker in hollows.
      const patch = fbm(x * 0.35 + 40, z * 0.35 + 40, 4)
      const grit = fbm(x * 4, z * 4, 2)
      const base = patch < 0.45 ? REGOLITH[0] : patch < 0.55 ? REGOLITH[1] : REGOLITH[2]
      color.copy(base).lerp(REGOLITH[3], THREE.MathUtils.clamp(0.35 - height * 0.8, 0, 0.5) + (grit - 0.5) * 0.25)
      colors.set([color.r, color.g, color.b], index * 3)
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.computeVertexNormals()
    return geometry
  }, [])
}

function Rocks() {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const count = 260

  const geometry = useMemo(() => {
    // Indexed, so displaced vertices stay shared and the rock shades smooth instead of faceted.
    const base = new THREE.IcosahedronGeometry(1, 4)
    base.deleteAttribute('normal')
    base.deleteAttribute('uv')
    const rock = mergeVertices(base)
    const position = rock.attributes.position
    const random = mulberry32(7)
    const vertex = new THREE.Vector3()
    // Lumpy, flattened basalt shapes rather than spheres.
    for (let index = 0; index < position.count; index += 1) {
      vertex.fromBufferAttribute(position, index)
      const bump =
        0.7 + fbm(vertex.x * 1.4 + 3, vertex.y * 1.4 + vertex.z * 1.1, 3) * 0.62 + fbm(vertex.x * 6, vertex.z * 6 + vertex.y * 4, 2) * 0.08 + random() * 0.015
      vertex.multiplyScalar(bump)
      vertex.y *= 0.62
      position.setXYZ(index, vertex.x, vertex.y, vertex.z)
    }
    rock.computeVertexNormals()
    return rock
  }, [])

  useLayoutEffect(() => {
    const instances = mesh.current
    if (!instances) return
    const random = mulberry32(2026)
    const matrix = new THREE.Matrix4()
    const quaternion = new THREE.Quaternion()
    const euler = new THREE.Euler()
    const scale = new THREE.Vector3()
    const place = new THREE.Vector3()
    const tint = new THREE.Color()
    for (let index = 0; index < count; index += 1) {
      // Denser near the pad, sparse towards the horizon; never on the pad itself.
      const radius = PAD_RADIUS + 0.35 + Math.pow(random(), 1.7) * 13
      const angle = random() * Math.PI * 2
      const size = (0.015 + Math.pow(random(), 3) * 0.2) * (radius < 3 ? 0.8 : 1.2)
      place.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius)
      place.y = terrainHeight(place.x, place.z) - size * 0.25
      euler.set(random() * 0.6, random() * Math.PI * 2, random() * 0.6)
      quaternion.setFromEuler(euler)
      scale.set(size * (0.8 + random() * 0.6), size, size * (0.8 + random() * 0.6))
      matrix.compose(place, quaternion, scale)
      instances.setMatrixAt(index, matrix)
      tint.setHSL(0.03 + random() * 0.03, 0.28 + random() * 0.22, 0.06 + random() * 0.1)
      instances.setColorAt(index, tint)
    }
    instances.instanceMatrix.needsUpdate = true
    if (instances.instanceColor) instances.instanceColor.needsUpdate = true
  }, [])

  return (
    <instancedMesh args={[geometry, undefined, count]} castShadow receiveShadow ref={mesh}>
      <meshStandardMaterial roughness={0.92} />
    </instancedMesh>
  )
}

/** Dusk sky: space-dark overhead, a butterscotch dust glow at the horizon, brightest toward the sun. */
function Sky({ sun }: { sun: THREE.Vector3 }) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        depthWrite: false,
        fog: false,
        side: THREE.BackSide,
        uniforms: {
          glow: { value: new THREE.Color('#c0703e') },
          horizon: { value: new THREE.Color('#4a2112') },
          sunDirection: { value: sun.clone().normalize() },
          zenith: { value: new THREE.Color('#050607') },
        },
        vertexShader: /* glsl */ `
          varying vec3 vDirection;
          void main() {
            vDirection = normalize(position);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 zenith;
          uniform vec3 horizon;
          uniform vec3 glow;
          uniform vec3 sunDirection;
          varying vec3 vDirection;
          void main() {
            float h = clamp(vDirection.y, -0.2, 1.0);
            vec3 colour = mix(horizon, zenith, smoothstep(0.0, 0.42, h));
            float toward = max(dot(normalize(vDirection), sunDirection), 0.0);
            colour += glow * pow(toward, 6.0) * (1.0 - smoothstep(0.0, 0.5, h)) * 0.8;
            colour = mix(colour, horizon * 0.8, smoothstep(0.0, -0.2, h));
            gl_FragColor = vec4(colour, 1.0);
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
          }
        `,
      }),
    [sun],
  )
  return (
    <mesh material={material} renderOrder={-1} scale={60}>
      <sphereGeometry args={[1, 32, 16]} />
    </mesh>
  )
}

export function MarsTerrain({ sun }: { sun: THREE.Vector3 }) {
  const geometry = useTerrainGeometry()
  return (
    <group>
      <Sky sun={sun} />
      <mesh geometry={geometry} receiveShadow>
        <meshStandardMaterial roughness={0.97} vertexColors />
      </mesh>
      <Rocks />
    </group>
  )
}
