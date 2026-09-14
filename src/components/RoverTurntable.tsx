'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

const frameCount = 720
const degreesPerFrame = 360 / frameCount
const frameTime = 1000 / 60
const lookAhead = 16
const wrap = (frame: number) => ((frame % frameCount) + frameCount) % frameCount
const frameURL = (frame: number, mobile = false) =>
  `/media/leap-one-studio-v4/${mobile ? 'mobile/' : ''}frame_${String(frame).padStart(3, '0')}.webp`

export function RoverTurntable() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestedRef = useRef(0)
  const playingRef = useRef(false)
  const dragRef = useRef<{ x: number; frame: number } | null>(null)
  const [visible, setVisible] = useState(false)
  const [mobile, setMobile] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [ready, setReady] = useState(false)
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    const size = matchMedia('(max-width: 700px)')
    const updateMotion = () => setPlaying(!motion.matches)
    const updateSize = () => setMobile(size.matches)
    updateMotion()
    updateSize()
    motion.addEventListener('change', updateMotion)
    size.addEventListener('change', updateSize)
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting))
    if (containerRef.current) observer.observe(containerRef.current)
    return () => {
      observer.disconnect()
      motion.removeEventListener('change', updateMotion)
      size.removeEventListener('change', updateSize)
    }
  }, [])

  useEffect(() => { playingRef.current = playing }, [playing])

  useEffect(() => {
    if (!visible) return
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d', { alpha: false })
    if (!canvas || !context) return
    canvas.width = mobile ? 900 : 1600
    canvas.height = mobile ? 900 : 1200
    // A small rolling window avoids decoding the entire high-resolution orbit into memory.
    const cache = new Map<number, ImageBitmap>()
    const pending = new Map<number, AbortController>()
    const failed = new Set<number>()
    let disposed = false
    let animation = 0
    let displayed = -1
    let lastAdvance = 0
    let pageVisible = !document.hidden
    const visibility = () => { pageVisible = !document.hidden; lastAdvance = 0 }
    document.addEventListener('visibilitychange', visibility)
    setReady(false)

    const load = (index: number) => {
      if (cache.has(index) || pending.has(index) || failed.has(index) || pending.size >= 6) return
      const controller = new AbortController()
      pending.set(index, controller)
      fetch(frameURL(index, mobile), { signal: controller.signal, priority: 'low' })
        .then(response => {
          if (!response.ok) throw new Error('Frame unavailable')
          return response.blob()
        })
        .then(blob => createImageBitmap(blob))
        .then(bitmap => {
          if (disposed) bitmap.close()
          else cache.set(index, bitmap)
        })
        .catch(error => { if (error.name !== 'AbortError') failed.add(index) })
        .finally(() => { if (pending.get(index) === controller) pending.delete(index) })
    }

    const tick = (time: number) => {
      if (disposed) return
      if (pageVisible) {
        let desired = wrap(requestedRef.current)
        let advanced = false
        if (playingRef.current && displayed === desired && time - lastAdvance >= frameTime) {
          const next = wrap(desired + 1)
          if (cache.has(next)) { requestedRef.current = desired = next; advanced = true }
        }
        const keep = new Set([displayed, desired, wrap(desired - 1)])
        if (playingRef.current) for (let offset = 1; offset <= lookAhead; offset++) keep.add(wrap(desired + offset))
        for (const [index, bitmap] of cache) {
          if (!keep.has(index)) { bitmap.close(); cache.delete(index) }
        }
        for (const [index, controller] of pending) {
          if (!keep.has(index)) { controller.abort(); pending.delete(index) }
        }
        load(desired)
        if (playingRef.current) for (let offset = 1; offset <= lookAhead; offset++) load(wrap(desired + offset))
        const bitmap = cache.get(desired)
        if (bitmap && displayed !== desired) {
          context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
          displayed = desired
          // Carry fractional timing forward instead of losing a refresh interval each step.
          lastAdvance = advanced ? Math.max(lastAdvance + frameTime, time - frameTime) : time
          setFrame(desired)
          setReady(true)
        }
        if (failed.has(desired) || (playingRef.current && failed.has(wrap(desired + 1)))) {
          playingRef.current = false
          setPlaying(false)
        }
      }
      animation = requestAnimationFrame(tick)
    }
    animation = requestAnimationFrame(tick)
    return () => {
      disposed = true
      cancelAnimationFrame(animation)
      document.removeEventListener('visibilitychange', visibility)
      for (const controller of pending.values()) controller.abort()
      for (const bitmap of cache.values()) bitmap.close()
    }
  }, [visible, mobile])

  const seek = (next: number) => {
    playingRef.current = false
    setPlaying(false)
    requestedRef.current = wrap(next)
  }

  const angle = frame * degreesPerFrame

  return (
    <div className="rover-turntable" ref={containerRef}>
      <div
        className="rover-explorer__media"
        onPointerDown={event => {
          if (event.button !== 0) return
          seek(frame)
          dragRef.current = { x: event.clientX, frame }
          event.currentTarget.setPointerCapture(event.pointerId)
        }}
        onPointerMove={event => {
          if (!dragRef.current) return
          const travel = (event.clientX - dragRef.current.x) / event.currentTarget.clientWidth
          seek(dragRef.current.frame - Math.round(travel * frameCount))
        }}
        onPointerUp={() => { dragRef.current = null }}
        onPointerCancel={() => { dragRef.current = null }}
      >
        <picture>
          <source media="(max-width: 700px)" srcSet={frameURL(0, true)} />
          <Image className="rover-explorer__sequence-image" src={frameURL(0)} alt="LEAP-One rover with its six wheels, robotic arm and orange drill assembly" fill unoptimized draggable={false} />
        </picture>
        <canvas className={ready ? 'is-ready' : ''} ref={canvasRef} aria-hidden="true" />
      </div>
      <div className="rover-turntable__controls">
        <div className="rover-turntable__control-heading">
          <span>Drag to explore</span>
          <output aria-hidden="true">{angle.toFixed(1).padStart(5, '0')}° / 360°</output>
        </div>
        <div className="rover-turntable__control-row">
          <button type="button" onClick={() => setPlaying(value => !value)} aria-label={playing ? 'Pause rover rotation' : 'Play rover rotation'}>
            <span aria-hidden="true">{playing ? 'Ⅱ' : '▷'}</span>{playing ? 'Pause' : 'Rotate'}
          </button>
          <input aria-label="Rover viewing angle" type="range" min={0} max={360 - degreesPerFrame} step={degreesPerFrame} value={angle} onChange={event => seek(Math.round(Number(event.target.value) / degreesPerFrame))} aria-valuetext={`${angle} degrees`} />
          <button type="button" className="rover-turntable__reset" onClick={() => seek(0)} aria-label="Reset rover view">↺</button>
        </div>
      </div>
    </div>
  )
}
