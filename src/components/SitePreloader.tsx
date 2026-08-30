'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

const PHASES = [
  { at: 0, label: 'INITIALISING DRIVE SYSTEMS' },
  { at: 34, label: 'NAVIGATION LOCK' },
  { at: 68, label: 'TERRAIN LINKED' },
  { at: 94, label: 'MISSION READY' },
]

export function SitePreloader() {
  const loaderRef = useRef<HTMLDivElement>(null)
  const phaseRef = useRef<HTMLSpanElement>(null)
  const progressRef = useRef<HTMLSpanElement>(null)
  const [exiting, setExiting] = useState(false)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const loader = loaderRef.current
    const progressLabel = progressRef.current
    const phaseLabel = phaseRef.current

    if (!loader || !progressLabel || !phaseLabel) return

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.body.style.setProperty('--preloader-scrollbar-width', `${scrollbarWidth}px`)
    document.body.classList.add('preloader-active')
    document.documentElement.classList.add('preloader-active')

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

    const finish = () => {
      if (hasFinished) return
      hasFinished = true
      loader.style.setProperty('--preloader-progress', '100%')
      loader.setAttribute('aria-valuenow', '100')
      progressLabel.textContent = '100'
      phaseLabel.textContent = PHASES.at(-1)?.label ?? 'MISSION READY'
      setExiting(true)
      exitTimer = window.setTimeout(() => {
        document.body.classList.remove('preloader-active')
        document.body.style.removeProperty('--preloader-scrollbar-width')
        document.documentElement.classList.remove('preloader-active')
        setHidden(true)
      }, reducedMotion ? 160 : 1080)
    }

    const draw = (now: number) => {
      const elapsed = now - startedAt
      const initialProgress = Math.min(92, 92 * (1 - Math.exp(-elapsed / 640)))
      const canComplete = loadedAt > 0 && elapsed >= (reducedMotion ? 100 : 1050)
      const completionProgress = canComplete
        ? Math.min(100, 92 + ((now - Math.max(loadedAt, startedAt + 1050)) / 320) * 8)
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
    forcedFinishTimer = window.setTimeout(markLoaded, 3200)
    animationFrame = window.requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('load', markLoaded)
      window.cancelAnimationFrame(animationFrame)
      window.clearTimeout(exitTimer)
      window.clearTimeout(forcedFinishTimer)
      document.body.classList.remove('preloader-active')
      document.body.style.removeProperty('--preloader-scrollbar-width')
      document.documentElement.classList.remove('preloader-active')
    }
  }, [])

  if (hidden) return null

  return (
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
        <span>HSM ARIES / LEAP-ONE</span>
        <span>FIELD TRAVERSE · 01</span>
      </div>

      <div className="site-preloader__identity">
        <Image
          alt="HSM Aries"
          className="site-preloader__logo"
          height={51}
          priority
          src="/media/aries-logo-white.png"
          width={195}
        />
        <p>DRIVE · AUTOMATION · ROBOTICS</p>
      </div>

      <div aria-hidden="true" className="site-preloader__rover-stage">
        <svg className="site-preloader__rover" viewBox="0 0 720 280">
          <g className="site-preloader__track-marks">
            <path d="M35 233H685" />
            <path d="M55 248H160M190 248H295M325 248H430M460 248H565M595 248H665" />
          </g>

          <g className="site-preloader__vehicle">
            <g className="site-preloader__suspension">
              <path d="M190 187L253 205L327 177L401 205L474 182" />
              <path d="M253 205L327 205M401 205L474 205" />
            </g>

            <path className="site-preloader__chassis" d="M164 137H479L518 170L496 192H190L152 169Z" />
            <path className="site-preloader__deck" d="M206 112H440L468 137H184Z" />
            <path className="site-preloader__panel" d="M254 122H382M397 122H433" />

            <g className="site-preloader__mast">
              <path d="M305 111V60M319 111V60" />
              <path d="M290 61H334L327 47H297Z" />
              <circle cx="305" cy="54" r="3" />
              <circle cx="320" cy="54" r="3" />
            </g>

            <g className="site-preloader__arm">
              <path d="M410 112L448 77L486 91L530 55" />
              <circle cx="410" cy="112" r="7" />
              <circle cx="448" cy="77" r="7" />
              <circle cx="486" cy="91" r="7" />
              <path d="M529 54L548 43M529 54L548 65" />
            </g>

            <path className="site-preloader__antenna" d="M243 111V77M234 77H252M238 70H248" />
            <path className="site-preloader__accent-line" d="M160 170H508" />

            <g className="site-preloader__wheel site-preloader__wheel--one">
              <circle cx="225" cy="205" r="35" />
              <circle cx="225" cy="205" r="17" />
              <path d="M225 170V240M190 205H260M200 180L250 230M250 180L200 230" />
            </g>
            <g className="site-preloader__wheel site-preloader__wheel--two">
              <circle cx="345" cy="205" r="35" />
              <circle cx="345" cy="205" r="17" />
              <path d="M345 170V240M310 205H380M320 180L370 230M370 180L320 230" />
            </g>
            <g className="site-preloader__wheel site-preloader__wheel--three">
              <circle cx="465" cy="205" r="35" />
              <circle cx="465" cy="205" r="17" />
              <path d="M465 170V240M430 205H500M440 180L490 230M490 180L440 230" />
            </g>

            <circle className="site-preloader__signal" cx="171" cy="154" r="5" />
          </g>

          <g className="site-preloader__vector-dust">
            <circle cx="144" cy="218" r="3" />
            <circle cx="121" cy="224" r="2" />
            <circle cx="98" cy="216" r="1.5" />
          </g>
        </svg>
      </div>

      <div className="site-preloader__status">
        <div className="site-preloader__status-copy">
          <span ref={phaseRef}>INITIALISING MISSION SYSTEMS</span>
          <strong><span ref={progressRef}>00</span><small>%</small></strong>
        </div>
        <div aria-hidden="true" className="site-preloader__track">
          <span />
        </div>
      </div>

      <div className="site-preloader__chrome site-preloader__chrome--bottom" aria-hidden="true">
        <span>06 WHEELS / 04 MISSION SYSTEMS</span>
        <span>THE FIRST LEAP</span>
      </div>
    </div>
  )
}
