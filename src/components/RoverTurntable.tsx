'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

const frameCount = 720
const degreesPerFrame = 360 / frameCount
// A full drag across the stage turns the rover once.
const turnsPerDrag = 1
// One idle revolution takes 16 s. After a drag or flick the velocity eases back to the idle speed from
// wherever the rover was left, so the turntable simply continues from that angle.
const idleSpeed = frameCount / 16_000
const resumeDelay = 350
const velocityDamping = 280
const restSpeed = 0.002
const frameTime = 1000 / 60
const keyboardStep = 4
const maxPending = 8
const maxDecoding = 4
const blobLimit = 320
const wrap = (frame: number) => ((frame % frameCount) + frameCount) % frameCount
const distance = (a: number, b: number) => {
  const gap = Math.abs(wrap(a) - wrap(b))
  return Math.min(gap, frameCount - gap)
}
// Signed offset of `index` from `origin` along `direction`, in (-360, 360].
const offsetAlong = (origin: number, index: number, direction: 1 | -1) => {
  const forward = wrap(index - origin)
  return direction * (forward > frameCount / 2 ? forward - frameCount : forward)
}
const frameURL = (frame: number, mobile = false) =>
  `/media/leap-one-studio-v5/${mobile ? 'mobile/' : ''}frame_${String(frame).padStart(3, '0')}.webp`

type Motion = { position: number; velocity: number; lastInteraction: number; autoplay: boolean; coast: boolean }
type Drag = {
  id: number
  startX: number
  startPosition: number
  lastX: number
  direction: 1 | -1
  speed: number
  samples: { time: number; position: number }[]
}

export function RoverTurntable() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const readoutRef = useRef<HTMLSpanElement>(null)
  const motionRef = useRef<Motion>({ position: 0, velocity: 0, lastInteraction: 0, autoplay: false, coast: true })
  const dragRef = useRef<Drag | null>(null)
  const [visible, setVisible] = useState(false)
  const [mobile, setMobile] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    const size = matchMedia('(max-width: 700px)')
    const updateMotion = () => {
      motionRef.current.autoplay = !motion.matches
      motionRef.current.coast = !motion.matches
      if (motion.matches) motionRef.current.velocity = 0
    }
    const updateSize = () => setMobile(size.matches)
    updateMotion()
    updateSize()
    motion.addEventListener('change', updateMotion)
    size.addEventListener('change', updateSize)
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '160px 0px' })
    if (containerRef.current) observer.observe(containerRef.current)
    return () => {
      observer.disconnect()
      motion.removeEventListener('change', updateMotion)
      size.removeEventListener('change', updateSize)
    }
  }, [])

  useEffect(() => {
    if (!visible) return
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d', { alpha: false })
    if (!canvas || !context) return
    canvas.width = mobile ? 900 : 1600
    canvas.height = mobile ? 900 : 1200
    // Compressed frames are cheap to keep, so a wide window of them stays resident; only a small
    // window around the current angle is decoded into bitmaps at any time.
    const blobs = new Map<number, Blob>()
    const bitmaps = new Map<number, ImageBitmap>()
    const pending = new Map<number, AbortController>()
    const decoding = new Set<number>()
    const failed = new Set<number>()
    let disposed = false
    let animation = 0
    let displayed = -1
    let lastTime = 0
    let pageVisible = !document.hidden
    const visibility = () => {
      pageVisible = !document.hidden
      lastTime = 0
    }
    document.addEventListener('visibilitychange', visibility)
    setReady(false)

    const decode = (index: number, blob: Blob) => {
      decoding.add(index)
      createImageBitmap(blob)
        .then(bitmap => {
          if (disposed) bitmap.close()
          else bitmaps.set(index, bitmap)
        })
        .catch(() => failed.add(index))
        .finally(() => decoding.delete(index))
    }

    const load = (index: number, priority: RequestPriority) => {
      const controller = new AbortController()
      pending.set(index, controller)
      fetch(frameURL(index, mobile), { signal: controller.signal, priority })
        .then(response => {
          if (!response.ok) throw new Error('Frame unavailable')
          return response.blob()
        })
        .then(blob => {
          if (disposed) return
          blobs.set(index, blob)
          if (blobs.size > blobLimit) blobs.delete(blobs.keys().next().value as number)
        })
        .catch(error => {
          if (error.name !== 'AbortError') failed.add(index)
        })
        .finally(() => {
          if (pending.get(index) === controller) pending.delete(index)
        })
    }

    const tick = (time: number) => {
      if (disposed) return
      animation = requestAnimationFrame(tick)
      if (!pageVisible) return
      const step = lastTime ? Math.min(time - lastTime, 64) : 0
      lastTime = time
      const state = motionRef.current
      const drag = dragRef.current
      if (!drag) {
        const target = state.autoplay && time - state.lastInteraction > resumeDelay ? idleSpeed : 0
        state.velocity = target + (state.velocity - target) * Math.exp(-step / velocityDamping)
        if (target === 0 && Math.abs(state.velocity) < restSpeed) state.velocity = 0
        state.position = wrap(state.position + state.velocity * step)
      }

      const desired = wrap(Math.round(state.position))
      const direction: 1 | -1 = drag ? drag.direction : state.velocity < 0 ? -1 : 1
      const speed = drag ? drag.speed : Math.abs(state.velocity)
      // At speed the angle advances several frames per tick, so requests are spaced to land on frames
      // that will actually be shown instead of chasing every intermediate one.
      const stride = Math.max(1, Math.round(speed * frameTime))
      const ahead = Math.min(28, Math.max(10, Math.ceil((speed * 260) / stride)))
      const span = ahead * stride
      const wanted = [desired]
      for (let offset = 1; offset <= ahead; offset++) wanted.push(wrap(desired + direction * offset * stride))
      for (let offset = 1; offset <= 3; offset++) wanted.push(wrap(desired - direction * offset))
      const relevant = (index: number) => {
        const offset = offsetAlong(desired, index, direction)
        return offset >= -3 && offset <= span
      }

      for (const [index, bitmap] of bitmaps) {
        if (!relevant(index) && index !== displayed) {
          bitmap.close()
          bitmaps.delete(index)
        }
      }
      for (const [index, controller] of pending) {
        if (!relevant(index)) {
          controller.abort()
          pending.delete(index)
        }
      }
      for (const index of wanted) {
        if (bitmaps.has(index) || decoding.has(index) || failed.has(index)) continue
        const blob = blobs.get(index)
        if (blob) {
          if (decoding.size < maxDecoding) {
            // Re-insert so the least recently used blob is the first to go.
            blobs.delete(index)
            blobs.set(index, blob)
            decode(index, blob)
          }
        } else if (!pending.has(index) && pending.size < maxPending) {
          load(index, index === desired ? 'high' : 'low')
        }
      }

      // Show the exact frame when it is decoded; otherwise the nearest decoded frame that is closer
      // to the target than the one on screen, so fast drags keep moving instead of waiting for the network.
      let shown = desired
      let bitmap = bitmaps.get(desired)
      if (!bitmap && displayed >= 0) {
        let best = distance(displayed, desired)
        for (const [index, candidate] of bitmaps) {
          const gap = distance(index, desired)
          if (gap < best) {
            best = gap
            bitmap = candidate
            shown = index
          }
        }
      }
      if (bitmap && displayed !== shown) {
        context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
        displayed = shown
        if (readoutRef.current) readoutRef.current.textContent = `${(shown * degreesPerFrame).toFixed(1).padStart(5, '0')}°`
        setReady(true)
      }
      if (failed.size > 12) state.autoplay = false
    }
    animation = requestAnimationFrame(tick)
    return () => {
      disposed = true
      cancelAnimationFrame(animation)
      document.removeEventListener('visibilitychange', visibility)
      for (const controller of pending.values()) controller.abort()
      for (const bitmap of bitmaps.values()) bitmap.close()
    }
  }, [visible, mobile])

  const interact = () => {
    motionRef.current.lastInteraction = performance.now()
    motionRef.current.velocity = 0
  }

  const release = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag || drag.id !== event.pointerId) return
    dragRef.current = null
    const state = motionRef.current
    const now = performance.now()
    state.lastInteraction = now
    const recent = drag.samples.filter(sample => now - sample.time <= 120)
    const first = recent[0]
    const last = recent[recent.length - 1]
    // A flick keeps the rover turning; a drag that paused before release stops where it is.
    state.velocity =
      state.coast && first && last && last.time > first.time && now - last.time < 80
        ? (last.position - first.position) / (last.time - first.time)
        : 0
  }

  return (
    <div className="rover-turntable" ref={containerRef}>
      <div
        className="rover-explorer__media"
        tabIndex={0}
        role="group"
        aria-label="LEAP-One 360° view. Drag, or use the left and right arrow keys, to rotate the rover."
        onDragStart={event => event.preventDefault()}
        onPointerDown={event => {
          if (event.button !== 0 || dragRef.current) return
          interact()
          try {
            event.currentTarget.setPointerCapture(event.pointerId)
          } catch {
            // Synthetic pointers cannot be captured; the drag still works while the pointer stays over the stage.
          }
          dragRef.current = {
            id: event.pointerId,
            startX: event.clientX,
            startPosition: motionRef.current.position,
            lastX: event.clientX,
            direction: 1,
            speed: 0,
            samples: [],
          }
        }}
        onPointerMove={event => {
          const drag = dragRef.current
          if (!drag || drag.id !== event.pointerId) return
          const time = performance.now()
          const travel = (event.clientX - drag.startX) / event.currentTarget.clientWidth
          const position = drag.startPosition - travel * frameCount * turnsPerDrag
          if (event.clientX !== drag.lastX) drag.direction = event.clientX < drag.lastX ? 1 : -1
          drag.lastX = event.clientX
          drag.samples.push({ time, position })
          while (drag.samples.length > 1 && time - drag.samples[0].time > 120) drag.samples.shift()
          const first = drag.samples[0]
          drag.speed = time > first.time ? Math.abs(position - first.position) / (time - first.time) : 0
          motionRef.current.position = wrap(position)
          motionRef.current.lastInteraction = time
        }}
        onPointerUp={release}
        onPointerCancel={release}
        onLostPointerCapture={release}
        onKeyDown={event => {
          if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' && event.key !== 'Home') return
          event.preventDefault()
          interact()
          const state = motionRef.current
          if (event.key === 'Home') state.position = 0
          else state.position = wrap(state.position + (event.key === 'ArrowRight' ? -keyboardStep : keyboardStep))
        }}
      >
        <picture>
          <source media="(max-width: 700px)" srcSet={frameURL(0, true)} />
          <Image
            className="rover-explorer__sequence-image"
            src={frameURL(0)}
            alt="LEAP-One rover with its six wheels, robotic arm and orange drill assembly"
            fill
            unoptimized
            draggable={false}
          />
        </picture>
        <canvas className={ready ? 'is-ready' : ''} ref={canvasRef} aria-hidden="true" />
      </div>
      <p className="rover-explorer__interaction" aria-hidden="true">
        DRAG TO ROTATE
      </p>
      <p className="rover-explorer__view-index" aria-hidden="true">
        <span ref={readoutRef}>000.0°</span> / 360°
      </p>
    </div>
  )
}
