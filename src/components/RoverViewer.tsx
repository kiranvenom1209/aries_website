'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

// Every third frame of the 360-frame render: 120 frames at 3° steps, ~2.6 MB instead of 7.8 MB.
const sequenceFrames = Array.from(
  { length: 120 },
  (_, index) => `/media/leap-one-turntable/frame_${String(index * 3).padStart(3, '0')}.webp`,
)
const fullOrbitDuration = 8_000

/**
 * A pre-rendered orbit replaces the interactive WebGL scene while preserving
 * a complete, smooth view of the rover.
 */
export function RoverViewer() {
  const sectionRef = useRef<HTMLElement>(null)
  const preloadedFramesRef = useRef<HTMLImageElement[]>([])
  const [isNearViewport, setIsNearViewport] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [isSequenceReady, setIsSequenceReady] = useState(false)
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotionPreference = () => setReducedMotion(mediaQuery.matches)

    updateMotionPreference()
    mediaQuery.addEventListener('change', updateMotionPreference)

    return () => mediaQuery.removeEventListener('change', updateMotionPreference)
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsNearViewport(entry.isIntersecting),
      { rootMargin: '240px 0px' },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isNearViewport || reducedMotion || isSequenceReady) return

    let cancelled = false
    const images = sequenceFrames.map((source) => {
      const image = new window.Image()
      // Let the hero and the Mission Control photos win the bandwidth race.
      image.fetchPriority = 'low'
      image.src = source
      return image
    })
    preloadedFramesRef.current = images

    Promise.all(images.map((image) => image.decode().catch(() => undefined))).then(() => {
      if (!cancelled) setIsSequenceReady(true)
    })

    return () => {
      cancelled = true
    }
  }, [isNearViewport, isSequenceReady, reducedMotion])

  useEffect(() => {
    if (!isNearViewport || reducedMotion || !isSequenceReady) return

    let animationFrame: number
    let startedAt: number | undefined

    const advanceSequence = (timestamp: number) => {
      startedAt ??= timestamp
      const nextFrame =
        Math.floor(((timestamp - startedAt) / fullOrbitDuration) * sequenceFrames.length) %
        sequenceFrames.length

      setFrame((currentFrame) => (currentFrame === nextFrame ? currentFrame : nextFrame))
      animationFrame = window.requestAnimationFrame(advanceSequence)
    }

    animationFrame = window.requestAnimationFrame(advanceSequence)

    return () => window.cancelAnimationFrame(animationFrame)
  }, [isNearViewport, isSequenceReady, reducedMotion])

  return (
    <section className="rover-explorer" ref={sectionRef} aria-labelledby="vehicle-architecture-title">
      <div className="rover-explorer__header">
        <div>
          <p>Vehicle architecture // LEAP-One</p>
          <h2 id="vehicle-architecture-title">
            Six wheels, one&nbsp;arm,<br />
            <em>one drill.</em>
          </h2>
        </div>
        <p>
          LEAP-One integrates six-wheel mobility, autonomous navigation, precision manipulation
          and deep-sampling science on one research platform.
        </p>
      </div>

      <div className="rover-explorer__deck">
        <div className="rover-explorer__stage">
          <div className="rover-explorer__stage-rail" aria-hidden="true">
            <span>LEAP-ONE // COMPLETE VEHICLE</span>
            <i />
            <span>FULL 360° ORBIT</span>
          </div>
          <div className="rover-explorer__media">
            <Image
              className="rover-explorer__sequence-image"
              src={sequenceFrames[frame]}
              alt="LEAP-One rover in a complete vehicle view"
              fill
              sizes="(max-width: 980px) 100vw, 68vw"
              unoptimized
            />
          </div>
          <p className="rover-explorer__view-index" aria-hidden="true">
            ORBIT VIEW {String(frame + 1).padStart(3, '0')} / {String(sequenceFrames.length).padStart(3, '0')}
          </p>
        </div>

        <aside className="rover-explorer__console" aria-label="LEAP-One vehicle architecture">
          <div className="rover-explorer__readout">
            <p>System overview</p>
            <h3>Driven on the terrain.</h3>
            <p>
              The configuration that ran in Kraków: six BLDC hub wheels, a 6-DoF ReBeL arm and a
              530 mm auger, all on one 25.6 V bus.
            </p>
            <strong>ERC 2026 competition build</strong>
          </div>

          <dl className="rover-explorer__spec-list">
            <div>
              <dt>Mobility</dt>
              <dd>6× Botwheel BLDC + ODrive S1</dd>
            </div>
            <div>
              <dt>Energy</dt>
              <dd>1.5 kWh LiFePO₄</dd>
            </div>
            <div>
              <dt>Manipulation</dt>
              <dd>Igus ReBeL 6-DoF arm</dd>
            </div>
            <div>
              <dt>Science</dt>
              <dd>≥300 mm auger sampling</dd>
            </div>
          </dl>
        </aside>
      </div>

      <div className="rover-explorer__footer" aria-hidden="true">
        <span>LEAP ROVERS // PROJECT 01</span>
        <i />
        <span>COMPETED AT ERC 2026</span>
      </div>
    </section>
  )
}
