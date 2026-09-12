'use client'

import Image from 'next/image'
import { LeapOnePreloaderRover } from './LeapOnePreloaderRover'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

const PHASES = [
  { at: 0, label: 'INITIALISING DRIVE SYSTEMS' },
  { at: 34, label: 'NAVIGATION LOCK' },
  { at: 68, label: 'TERRAIN LINKED' },
  { at: 94, label: 'MISSION READY' },
]

const MIN_FILL_MS = 3800
const EXIT_MS = 700
const FILL_TAIL_MS = 450

// The mission-ready sequence plays on every full page load (first visit, reload, external link),
// never on client-side navigations between pages.
export function SitePreloader() {
  const loaderRef = useRef<HTMLDivElement>(null)
  const phaseRef = useRef<HTMLSpanElement>(null)
  const progressRef = useRef<HTMLSpanElement>(null)
  const [exiting, setExiting] = useState(false)
  const [hidden, setHidden] = useState(false)

  useLayoutEffect(() => {
    const isEditorialPreview =
      window.self !== window.top || new URLSearchParams(window.location.search).has('preview')

    if (isEditorialPreview) setHidden(true)
  }, [])

  useEffect(() => {
    if (hidden) return

    const loader = loaderRef.current
    const progressLabel = progressRef.current
    const phaseLabel = phaseRef.current

    if (!loader || !progressLabel || !phaseLabel) return

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.body.style.setProperty('--preloader-scrollbar-width', `${scrollbarWidth}px`)
    document.body.classList.add('preloader-active')
    document.documentElement.classList.add('preloader-active')

    // The page under the overlay is neither readable nor tabbable until the loader leaves.
    const app = document.querySelector<HTMLElement>('.site-shell')
    app?.setAttribute('inert', '')

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const startedAt = performance.now()
    let loadedAt = document.readyState === 'complete' ? startedAt : 0
    let animationFrame = 0
    let exitTimer = 0
    let forcedFinishTimer = 0
    let lastPhase = -1
    let hasFinished = false

    const markLoaded = () => {
      if (!loadedAt) loadedAt = performance.now()
    }

    const release = () => {
      document.body.classList.remove('preloader-active')
      document.body.style.removeProperty('--preloader-scrollbar-width')
      document.documentElement.classList.remove('preloader-active')
      app?.removeAttribute('inert')
    }

    const finish = () => {
      if (hasFinished) return
      hasFinished = true
      loader.style.setProperty('--preloader-progress', '100%')
      loader.setAttribute('aria-valuenow', '100')
      progressLabel.textContent = '100'
      phaseLabel.textContent = PHASES.at(-1)?.label ?? 'MISSION READY'
      setExiting(true)
      exitTimer = window.setTimeout(() => {
        release()
        setHidden(true)
      }, reducedMotion ? 40 : EXIT_MS)
    }

    const draw = (now: number) => {
      const elapsed = now - startedAt
      const initialProgress = 92 * (1 - Math.pow(1 - Math.min(elapsed / MIN_FILL_MS, 1), 1.3))
      const canComplete = loadedAt > 0 && elapsed >= MIN_FILL_MS
      const completionProgress = canComplete
        ? Math.min(100, 92 + ((now - Math.max(loadedAt, startedAt + MIN_FILL_MS)) / FILL_TAIL_MS) * 8)
        : initialProgress
      const progress = Math.max(0, Math.min(100, completionProgress))
      const roundedProgress = Math.round(progress)

      loader.style.setProperty('--preloader-progress', `${progress}%`)
      loader.setAttribute('aria-valuenow', String(roundedProgress))
      progressLabel.textContent = String(roundedProgress).padStart(2, '0')

      let phaseIndex = 0
      for (let index = 0; index < PHASES.length; index += 1) {
        if (progress >= PHASES[index].at) phaseIndex = index
      }
      if (phaseIndex !== lastPhase) {
        phaseLabel.textContent = PHASES[phaseIndex].label
        lastPhase = phaseIndex
      }

      if (progress >= 100 || reducedMotion) {
        finish()
        return
      }

      animationFrame = window.requestAnimationFrame(draw)
    }

    window.addEventListener('load', markLoaded, { once: true })
    forcedFinishTimer = window.setTimeout(markLoaded, 2400)
    animationFrame = window.requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('load', markLoaded)
      window.cancelAnimationFrame(animationFrame)
      window.clearTimeout(exitTimer)
      window.clearTimeout(forcedFinishTimer)
      release()
    }
  }, [hidden])

  if (hidden) return null

  return (
    <>
      <div
        aria-label="Loading HSM Aries"
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={0}
        className={`site-preloader${exiting ? ' is-exiting' : ''}`}
        ref={loaderRef}
        role="progressbar"
      >
        <div className="site-preloader__chrome site-preloader__chrome--top" aria-hidden="true">
          <span>HSM ARIES / LEAP ROVERS</span>
          <span>ERC 2026 · KRAKÓW</span>
        </div>

        <div className="site-preloader__identity">
          <Image
            alt="HSM Aries"
            className="site-preloader__logo"
            height={51}
            loading="eager"
            src="/media/aries-logo-white.png"
            width={195}
          />
          <p>DRIVE · AUTOMATION · ROBOTICS</p>
        </div>

        <div aria-hidden="true" className="site-preloader__rover-stage">
          <LeapOnePreloaderRover />
        </div>

        <div className="site-preloader__status">
          <div className="site-preloader__status-copy">
            <span ref={phaseRef}>{PHASES[0].label}</span>
            <strong><span ref={progressRef}>00</span><small>%</small></strong>
          </div>
          <div aria-hidden="true" className="site-preloader__track">
            <span />
          </div>
        </div>

        <div className="site-preloader__chrome site-preloader__chrome--bottom" aria-hidden="true">
          <span>LEAP-ONE / ERC 2026 FINALIST</span>
          <span>THE NEXT LEAP</span>
        </div>
      </div>
    </>
  )
}
