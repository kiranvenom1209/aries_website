'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useCallback, useEffect, useState, type CSSProperties } from 'react'

import { CAD_MODEL_BYTES, type CadRenderMode, type CadStats, type CadView } from './cadTypes'

const CadCanvas = dynamic(() => import('./CadCanvas'), { ssr: false })

const VIEWS: Array<{ id: CadView; label: string }> = [
  { id: 'iso', label: 'Iso' },
  { id: 'front', label: 'Front' },
  { id: 'side', label: 'Side' },
  { id: 'top', label: 'Top' },
]

const MODES: Array<{ id: CadRenderMode; label: string }> = [
  { id: 'solid', label: 'Solid' },
  { id: 'xray', label: 'X-ray' },
  { id: 'blueprint', label: 'Blueprint' },
]

const hasWebGL = () => {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'))
  } catch {
    return false
  }
}

const megabytes = (bytes: number) => `${(bytes / 1_000_000).toFixed(1)} MB`

/** Interactive LEAP-One CAD assembly: orbit, exploded view, render modes and part names on hover. */
export function CadViewer() {
  const [supported, setSupported] = useState<boolean | null>(null)
  const [view, setView] = useState<CadView>('iso')
  const [viewNonce, setViewNonce] = useState(0)
  const [mode, setMode] = useState<CadRenderMode>('solid')
  const [explode, setExplode] = useState(0)
  const [autoRotate, setAutoRotate] = useState(true)
  const [progress, setProgress] = useState(0)
  const [stats, setStats] = useState<CadStats | null>(null)
  const [part, setPart] = useState<string | null>(null)
  const [camera, setCamera] = useState({ azimuth: 0, elevation: 0 })

  useEffect(() => {
    setSupported(hasWebGL())
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setAutoRotate(false)
  }, [])

  const onCamera = useCallback((azimuth: number, elevation: number) => setCamera({ azimuth, elevation }), [])
  const onInteract = useCallback(() => setAutoRotate(false), [])
  const onReady = useCallback((next: CadStats) => setStats(next), [])

  const goTo = (next: CadView) => {
    setView(next)
    setViewNonce((value) => value + 1)
    setAutoRotate(false)
  }

  const reset = () => {
    setExplode(0)
    setMode('solid')
    goTo('iso')
  }

  const ready = Boolean(stats)

  return (
    <div className="cad-viewer" data-mode={mode} data-ready={ready || undefined}>
      <div className="cad-viewer__stage" role="img" aria-label="Interactive 3D model of the LEAP-One rover. Drag to orbit, scroll or pinch to zoom.">
        {supported ? (
          <CadCanvas
            autoRotate={autoRotate}
            explode={explode}
            mode={mode}
            onCamera={onCamera}
            onHover={setPart}
            onInteract={onInteract}
            onProgress={setProgress}
            onReady={onReady}
            view={view}
            viewNonce={viewNonce}
          />
        ) : null}

        <span aria-hidden="true" className="cad-viewer__bracket cad-viewer__bracket--tl" />
        <span aria-hidden="true" className="cad-viewer__bracket cad-viewer__bracket--tr" />
        <span aria-hidden="true" className="cad-viewer__bracket cad-viewer__bracket--bl" />
        <span aria-hidden="true" className="cad-viewer__bracket cad-viewer__bracket--br" />
        <span aria-hidden="true" className="cad-viewer__crosshair" />

        {supported === false ? (
          <div className="cad-viewer__fallback">
            <strong>3D view unavailable</strong>
            <p>This browser has WebGL switched off. The rendered 360° turntable shows the same rover.</p>
            <Link className="button button--outline" href="/leap-one#vehicle-architecture">
              Open the turntable
            </Link>
          </div>
        ) : !ready ? (
          <div aria-live="polite" className="cad-viewer__loader" role="status">
            <span>Downloading geometry · {megabytes(CAD_MODEL_BYTES)}</span>
            <strong>
              {String(Math.round(progress)).padStart(2, '0')}
              <small>%</small>
            </strong>
            <i style={{ '--progress': `${progress}%` } as CSSProperties} />
            <p>{progress >= 100 ? 'Indexing 500+ parts for inspection' : 'Meshopt-compressed CAD assembly'}</p>
          </div>
        ) : null}

        <div className="cad-viewer__readout cad-viewer__readout--top" aria-hidden="true">
          <span>
            <i className="cad-viewer__live" /> Live 3D
          </span>
          <span>{stats ? `${stats.parts} parts · ${(stats.triangles / 1e6).toFixed(2)} M triangles` : 'Loading'}</span>
        </div>

        <div className="cad-viewer__readout cad-viewer__readout--bottom">
          <p aria-live="polite" className="cad-viewer__part">
            <span>Part //</span> {part ?? (ready ? 'Hover or tap a component' : '—')}
          </p>
          <span aria-hidden="true" className="cad-viewer__camera">
            AZ {String(camera.azimuth).padStart(3, '0')}° · EL {String(camera.elevation).padStart(2, '0')}° · EXP{' '}
            {String(Math.round(explode * 100)).padStart(3, '0')}%
          </span>
        </div>
      </div>

      <div aria-label="Model controls" className="cad-viewer__controls" role="toolbar">
        <fieldset className="cad-control">
          <legend>View</legend>
          <div className="cad-segment">
            {VIEWS.map((item) => (
              <button aria-pressed={view === item.id} disabled={!ready} key={item.id} onClick={() => goTo(item.id)} type="button">
                {item.label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="cad-control">
          <legend>Render</legend>
          <div className="cad-segment">
            {MODES.map((item) => (
              <button aria-pressed={mode === item.id} disabled={!ready} key={item.id} onClick={() => setMode(item.id)} type="button">
                {item.label}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="cad-control cad-control--range">
          <label htmlFor="cad-explode">
            Exploded view <output htmlFor="cad-explode">{Math.round(explode * 100)}%</output>
          </label>
          <input
            disabled={!ready}
            id="cad-explode"
            max={100}
            min={0}
            onChange={(event) => setExplode(Number(event.target.value) / 100)}
            step={1}
            style={{ '--fill': `${explode * 100}%` } as CSSProperties}
            type="range"
            value={Math.round(explode * 100)}
          />
        </div>

        <div className="cad-control cad-control--actions">
          <button
            aria-pressed={autoRotate}
            className="cad-toggle"
            disabled={!ready}
            onClick={() => setAutoRotate((value) => !value)}
            type="button"
          >
            <span aria-hidden="true" />
            Auto-rotate
          </button>
          <button className="cad-reset" disabled={!ready} onClick={reset} type="button">
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}
