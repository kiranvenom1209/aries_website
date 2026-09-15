'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

const frameCount = 720
const degreesPerFrame = 360 / frameCount
// A full drag across the stage turns the rover once.
const turnsPerDrag = 1
// The crisp full-resolution opening frame holds for a moment before the idle turn begins. One idle
// revolution takes 16 s. After a drag or flick the velocity eases back to the idle speed from
// wherever the rover was left, so the turntable simply continues from that angle.
const initialHold = 2_200
const idleSpeed = frameCount / 16_000
const resumeDelay = 350
const velocityDamping = 280
const restSpeed = 0.002
const frameTime = 1000 / 60
const keyboardStep = 4
// Two tiers of frames. The light tier (1200x900, ~35 KB) drives every moment of motion and, once a
// lap has been seen, lives entirely in memory; the full tier (2400x1800) is fetched one frame at a
// time only while the rover is at rest, so a live connection never has to stream full frames.
const maxPending = 10
const maxDecoding = 4
const decodeAhead = 12
const liteBlobLimit = frameCount
const fullBlobLimit = 24
const version = 'leap-one-studio-v6'
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
const frameName = (frame: number) => `frame_${String(frame).padStart(3, '0')}.webp`
const fullURL = (frame: number, mobile = false) => `/media/${version}/${mobile ? 'mobile/' : ''}${frameName(frame)}`
const liteURL = (frame: number, mobile = false) => `/media/${version}/lite/${mobile ? 'mobile/' : ''}${frameName(frame)}`

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
    motionRef.current.lastInteraction = performance.now() + initialHold
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
    canvas.width = mobile ? 1200 : 2400
    canvas.height = mobile ? 1200 : 1800
    const liteBlobs = new Map<number, Blob>()
    const liteBitmaps = new Map<number, ImageBitmap>()
    const pending = new Map<number, AbortController>()
    const decoding = new Set<number>()
    const failed = new Set<number>()
    const fullBlobs = new Map<number, Blob>()
    let fullBitmap: { index: number; bitmap: ImageBitmap } | null = null
    let fullPending: { index: number; controller: AbortController } | null = null
    let fullDecoding = -1
    let disposed = false
    let animation = 0
    let displayed = -1
    let displayedFull = false
    let lastTime = 0
    let pageVisible = !document.hidden
    const visibility = () => {
      pageVisible = !document.hidden
      lastTime = 0
    }
    document.addEventListener('visibilitychange', visibility)
    setReady(false)

    const fetchBlob = (url: string, controller: AbortController, priority: RequestPriority) =>
      fetch(url, { signal: controller.signal, priority }).then(response => {
        if (!response.ok) throw new Error('Frame unavailable')
        return response.blob()
      })

    const decodeLite = (index: number, blob: Blob) => {
      decoding.add(index)
      createImageBitmap(blob)
        .then(bitmap => {
          if (disposed) bitmap.close()
          else liteBitmaps.set(index, bitmap)
        })
        .catch(() => failed.add(index))
        .finally(() => decoding.delete(index))
    }

    const loadLite = (index: number, priority: RequestPriority) => {
      const controller = new AbortController()
      pending.set(index, controller)
      fetchBlob(liteURL(index, mobile), controller, priority)
        .then(blob => {
          if (disposed) return
          liteBlobs.set(index, blob)
          if (liteBlobs.size > liteBlobLimit) liteBlobs.delete(liteBlobs.keys().next().value as number)
        })
        .catch(error => {
          if (error.name !== 'AbortError') failed.add(index)
        })
        .finally(() => {
          if (pending.get(index) === controller) pending.delete(index)
        })
    }

    const decodeFull = (index: number, blob: Blob) => {
      fullDecoding = index
      createImageBitmap(blob)
        .then(bitmap => {
          if (disposed) {
            bitmap.close()
            return
          }
          fullBitmap?.bitmap.close()
          fullBitmap = { index, bitmap }
        })
        .catch(() => undefined)
        .finally(() => {
          if (fullDecoding === index) fullDecoding = -1
        })
    }

    const loadFull = (index: number) => {
      const controller = new AbortController()
      fullPending = { index, controller }
      fetchBlob(fullURL(index, mobile), controller, 'high')
        .then(blob => {
          if (disposed) return
          fullBlobs.set(index, blob)
          if (fullBlobs.size > fullBlobLimit) fullBlobs.delete(fullBlobs.keys().next().value as number)
        })
        .catch(() => undefined)
        .finally(() => {
          if (fullPending?.controller === controller) fullPending = null
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
      const atRest = !drag && state.velocity === 0
      // The idle turn only needs every second frame (1° steps at ~22 fps), which halves what a first
      // lap costs on a live connection; drags and flicks use every frame they can get.
      const idling = !drag && Math.abs(state.velocity - idleSpeed) < idleSpeed * 0.2
      // At speed the angle advances several frames per tick, so requests are spaced to land on frames
      // that will actually be shown instead of chasing every intermediate one.
      const stride = Math.max(idling ? 2 : 1, Math.round(speed * frameTime))
      const ahead = Math.min(32, Math.max(14, Math.ceil((speed * 400) / stride)))
      const span = ahead * stride
      // Anchor the strided requests on a multiple of the stride, otherwise the alternating parity of
      // successive ticks would end up requesting every frame anyway.
      const anchor = stride > 1 ? desired - (desired % stride) : desired
      const wanted = [anchor]
      for (let offset = 1; offset <= ahead; offset++) wanted.push(wrap(anchor + direction * offset * stride))
      for (let offset = 1; offset <= 2; offset++) wanted.push(wrap(anchor - direction * offset * stride))
      const relevant = (index: number) => {
        const offset = offsetAlong(desired, index, direction)
        return offset >= -2 * stride && offset <= span
      }
      const decodable = (index: number) => {
        const offset = offsetAlong(desired, index, direction)
        return offset >= -2 * stride && offset <= decodeAhead * stride
      }

      for (const [index, bitmap] of liteBitmaps) {
        if (!decodable(index) && index !== displayed) {
          bitmap.close()
          liteBitmaps.delete(index)
        }
      }
      for (const [index, controller] of pending) {
        if (!relevant(index)) {
          controller.abort()
          pending.delete(index)
        }
      }
      for (const index of wanted) {
        if (liteBitmaps.has(index) || decoding.has(index) || failed.has(index)) continue
        const blob = liteBlobs.get(index)
        if (blob) {
          if (decoding.size < maxDecoding && decodable(index)) decodeLite(index, blob)
        } else if (!pending.has(index) && pending.size < maxPending) {
          loadLite(index, index === desired ? 'high' : 'low')
        }
      }

      // Show the exact light frame when it is decoded; otherwise the nearest decoded frame that is
      // closer to the target than the one on screen, so fast drags keep moving instead of waiting.
      let shown = desired
      let bitmap = liteBitmaps.get(desired)
      if (!bitmap && displayed >= 0) {
        let best = distance(displayed, desired)
        for (const [index, candidate] of liteBitmaps) {
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
        displayedFull = false
        if (readoutRef.current) readoutRef.current.textContent = `${(shown * degreesPerFrame).toFixed(1).padStart(5, '0')}°`
        setReady(true)
      }

      // At rest, replace the light frame on screen with the full-resolution one.
      if (atRest) {
        if (fullBitmap?.index === desired) {
          if (!displayedFull && (displayed === desired || displayed < 0)) {
            context.drawImage(fullBitmap.bitmap, 0, 0, canvas.width, canvas.height)
            displayed = desired
            displayedFull = true
            if (readoutRef.current) readoutRef.current.textContent = `${(desired * degreesPerFrame).toFixed(1).padStart(5, '0')}°`
            setReady(true)
          }
        } else if (fullDecoding !== desired) {
          const blob = fullBlobs.get(desired)
          if (blob) {
            fullBlobs.delete(desired)
            fullBlobs.set(desired, blob)
            decodeFull(desired, blob)
          } else if (fullPending?.index !== desired) {
            fullPending?.controller.abort()
            loadFull(desired)
          }
        }
      } else if (fullPending) {
        fullPending.controller.abort()
        fullPending = null
      }
      if (failed.size > 12) state.autoplay = false
    }
    animation = requestAnimationFrame(tick)
    return () => {
      disposed = true
      cancelAnimationFrame(animation)
      document.removeEventListener('visibilitychange', visibility)
      for (const controller of pending.values()) controller.abort()
      fullPending?.controller.abort()
      for (const bitmap of liteBitmaps.values()) bitmap.close()
      fullBitmap?.bitmap.close()
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
          <source media="(max-width: 700px)" srcSet={fullURL(0, true)} />
          <Image
            className="rover-explorer__sequence-image"
            src={fullURL(0)}
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
