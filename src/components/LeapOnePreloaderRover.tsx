'use client'

import { useEffect, useRef } from 'react'
import { preload } from 'react-dom'

const BODY_HREF = '/media/leap-one-preloader-body.svg'

// Wheel contact, body pitch, suspension links and rotation share one terrain model.
const wheelCentres = [332, 484, 661]
const treadAngles = Array.from({ length: 20 }, (_, index) => index * 18)
const spokeAngles = Array.from({ length: 8 }, (_, index) => index * 45)
const wheelRadius = 65
const travelSpeed = 180
// The server-rendered terrain spans this range (viewBox units) so it already reaches the
// screen edges on common desktop widths; the first client frame measures the real extent.
const initialTerrainStart = -1200
const initialTerrainEnd = 2200

function terrainHeight(position: number) {
  const phase = ((position % 1500) + 1500) % 1500
  return 635 - 38 * Math.exp(-(((phase - 860) / 105) ** 2))
    - 24 * Math.exp(-(((phase - 1270) / 80) ** 2))
    + 3 * Math.sin(position * Math.PI / 75)
}

function wheelHeight(x: number, distance: number) {
  // Sample the bottom half of the tyre so it rides over rises instead of sinking into them.
  let height = Infinity
  for (let offset = -60; offset <= 60; offset += 6) {
    height = Math.min(height, terrainHeight(x + offset + distance) - Math.sqrt(wheelRadius ** 2 - offset ** 2))
  }
  return height
}

type Point = { x: number; y: number }
const point = ({ x, y }: Point) => `${x.toFixed(2)} ${y.toFixed(2)}`

function springPath(start: Point, end: Point) {
  const dx = end.x - start.x
  const dy = end.y - start.y
  const length = Math.hypot(dx, dy)
  let path = `M${point(start)}`
  for (let index = 1; index < 10; index += 1) {
    const t = index / 10
    const width = index === 1 || index === 9 ? 0 : (index % 2 ? 4 : -4)
    path += `L${point({ x: start.x + dx * t - dy / length * width, y: start.y + dy * t + dx / length * width })}`
  }
  return `${path}L${point(end)}`
}

function terrainPath(start: number, end: number, distance: number) {
  let path = ''
  for (let x = start; x <= end; x += 8) path += `${x === start ? 'M' : 'L'}${x} ${terrainHeight(x + distance).toFixed(2)}`
  return path
}

// Every attribute the animation writes, so the server-rendered markup and frame 0 are identical
// and nothing snaps when the client takes over.
function pose(distance: number, terrainStart: number, terrainEnd: number) {
  const wheels = wheelCentres.map((x) => ({ x, y: wheelHeight(x, distance) }))
  const pitch = Math.atan2(wheels[2].y - wheels[0].y, wheels[2].x - wheels[0].x) * 0.7
  const heave = (wheels[0].y + wheels[1].y * 2 + wheels[2].y) / 4 - 565
  const bodyPoint = (x: number, y: number): Point => ({
    x: 500 + (x - 500) * Math.cos(pitch) - (y - 460) * Math.sin(pitch),
    y: 460 + heave + (x - 500) * Math.sin(pitch) + (y - 460) * Math.cos(pitch),
  })

  const rearPivot = bodyPoint(408, 466)
  const frontPivot = bodyPoint(524, 466)
  const rearLink = { x: (wheels[0].x + rearPivot.x) / 2, y: (wheels[0].y + rearPivot.y) / 2 }
  const frontLink = { x: (wheels[2].x + frontPivot.x) / 2, y: (wheels[2].y + frontPivot.y) / 2 }
  const terrain = terrainPath(terrainStart, terrainEnd, distance)

  return {
    body: `translate(0 ${heave.toFixed(2)}) rotate(${(pitch * 180 / Math.PI).toFixed(3)} 500 460)`,
    wheels: wheels.map((wheel) => `translate(${point(wheel)})`),
    spin: `rotate(${(distance / wheelRadius * 180 / Math.PI).toFixed(2)})`,
    links: `M${point(wheels[0])}L${point(rearPivot)}L${point(wheels[1])}L${point(frontPivot)}L${point(wheels[2])}`,
    springs: springPath(bodyPoint(452, 473), rearLink) + springPath(bodyPoint(574, 473), frontLink),
    pivots: [rearPivot, frontPivot].map((pivot) => `translate(${point(pivot)})`),
    terrain,
    terrainFill: `${terrain}L${terrainEnd} 705H${terrainStart}Z`,
  }
}

const initialPose = pose(0, initialTerrainStart, initialTerrainEnd)

export function LeapOnePreloaderRover() {
  // The body artwork is the only fetched part of the rover; hint it before the stylesheets.
  preload(BODY_HREF, { as: 'image', fetchPriority: 'high' })

  const svgRef = useRef<SVGSVGElement>(null)
  const bodyRef = useRef<SVGGElement>(null)
  const wheelRefs = useRef<(SVGGElement | null)[]>([])
  const spinRefs = useRef<(SVGGElement | null)[]>([])
  const linksRef = useRef<SVGPathElement>(null)
  const springsRef = useRef<SVGPathElement>(null)
  const pivotRefs = useRef<(SVGGElement | null)[]>([])
  const terrainRef = useRef<SVGPathElement>(null)
  const terrainFillRef = useRef<SVGPathElement>(null)
  const terrainDetailRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let startedAt = performance.now()
    let terrainStart = initialTerrainStart
    let terrainEnd = initialTerrainEnd
    let pixelsPerUnit = 1
    let lastElapsed = 0

    const draw = (elapsed: number) => {
      lastElapsed = elapsed
      const distance = elapsed / 1000 * travelSpeed
      const current = pose(distance, terrainStart, terrainEnd)

      bodyRef.current?.setAttribute('transform', current.body)
      current.wheels.forEach((transform, index) => {
        wheelRefs.current[index]?.setAttribute('transform', transform)
        spinRefs.current[index]?.setAttribute('transform', current.spin)
      })
      linksRef.current?.setAttribute('d', current.links)
      springsRef.current?.setAttribute('d', current.springs)
      current.pivots.forEach((transform, index) => pivotRefs.current[index]?.setAttribute('transform', transform))
      terrainRef.current?.setAttribute('d', current.terrain)
      terrainFillRef.current?.setAttribute('d', current.terrainFill)
      terrainDetailRef.current?.setAttribute('d', current.terrain)
      // The strokes are non-scaling, so the dash pattern lives in screen pixels: scale the
      // offset the same way or the texture slides faster than the ground it sits on.
      terrainDetailRef.current?.setAttribute('stroke-dashoffset', (distance * pixelsPerUnit).toFixed(2))
    }
    // The rover stays centred at its own scale; the terrain extends beyond its SVG
    // viewport to both screen edges, in the same coordinates as the wheel contacts.
    const updateTerrainBounds = () => {
      const bounds = svgRef.current?.getBoundingClientRect()
      if (!bounds?.width) return
      const unitsPerPixel = 1000 / bounds.width
      pixelsPerUnit = bounds.width / 1000
      terrainStart = Math.floor(-bounds.left * unitsPerPixel / 8) * 8 - 16
      terrainEnd = Math.ceil((window.innerWidth - bounds.left) * unitsPerPixel / 8) * 8 + 16
      draw(lastElapsed)
    }

    const animate = (now: number) => {
      draw(now - startedAt)
      frame = requestAnimationFrame(animate)
    }
    const updateMotion = () => {
      cancelAnimationFrame(frame)
      startedAt = performance.now()
      draw(0)
      if (!motion.matches) frame = requestAnimationFrame(animate)
    }
    updateTerrainBounds()
    updateMotion()
    const resizeObserver = new ResizeObserver(updateTerrainBounds)
    if (svgRef.current) resizeObserver.observe(svgRef.current)
    window.addEventListener('resize', updateTerrainBounds)
    motion.addEventListener('change', updateMotion)
    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateTerrainBounds)
      motion.removeEventListener('change', updateMotion)
    }
  }, [])

  return (
    <svg ref={svgRef} className="site-preloader__rover" viewBox="0 0 1000 720">
      <defs>
        <linearGradient id="preloader-terrain-fill" gradientUnits="userSpaceOnUse" x1="0" y1="590" x2="0" y2="705">
          <stop offset="0" stopColor="#ff6d24" stopOpacity=".045" />
          <stop offset="1" stopColor="#ff6d24" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g className="site-preloader__terrain">
        <path ref={terrainFillRef} className="site-preloader__terrain-fill" d={initialPose.terrainFill} />
        <path ref={terrainRef} className="site-preloader__terrain-edge" d={initialPose.terrain} />
        <path ref={terrainDetailRef} className="site-preloader__terrain-detail" d={initialPose.terrain} transform="translate(0 15)" />
      </g>
      <g className="site-preloader__articulated-rover">
        <g ref={bodyRef} className="site-preloader__body" transform={initialPose.body}>
          <image href={BODY_HREF} width="1000" height="680" />
          <rect className="site-preloader__green-beacon" x="369" y="96" width="19" height="17" rx="1" />
        </g>
        <g className="site-preloader__moving-suspension">
          <path ref={linksRef} className="site-preloader__suspension-links" d={initialPose.links} />
          <path ref={springsRef} className="site-preloader__suspension-springs" d={initialPose.springs} />
          {initialPose.pivots.map((transform, index) => (
            <g key={index} ref={(element) => { pivotRefs.current[index] = element }} transform={transform}>
              <circle r="10" /><circle r="4" />
            </g>
          ))}
        </g>
        {wheelCentres.map((x, index) => (
          <g key={x} ref={(element) => { wheelRefs.current[index] = element }} className="site-preloader__wheel-carrier" transform={initialPose.wheels[index]}>
            <g ref={(element) => { spinRefs.current[index] = element }} className="site-preloader__wheel site-preloader__wheel--side" transform={initialPose.spin}>
              <circle r="65" className="site-preloader__tyre" />
              <circle r="50" className="site-preloader__rim" />
              <circle r="43" className="site-preloader__rim-inner" />
              {treadAngles.map((angle) => (
                <path key={angle} transform={`rotate(${angle})`} d="M-7-63L0-57L7-63" className="site-preloader__tread" />
              ))}
              {spokeAngles.map((angle) => (
                <g key={angle} transform={`rotate(${angle})`}>
                  <path d="M-2-39L-4-18H4L2-39Z" className="site-preloader__spoke" />
                  <circle cy="46" r="1.5" className="site-preloader__wheel-bolt" />
                </g>
              ))}
              <circle r="12" className="site-preloader__hub" />
              <circle r="5" className="site-preloader__hub-centre" />
              <path d="M-5-49H5" className="site-preloader__wheel-marker" />
            </g>
          </g>
        ))}
      </g>
      <g className="site-preloader__vector-dust">
        <circle cx="235" cy="621" r="3" />
        <circle cx="205" cy="627" r="2" />
        <circle cx="175" cy="620" r="1.5" />
      </g>
    </svg>
  )
}
