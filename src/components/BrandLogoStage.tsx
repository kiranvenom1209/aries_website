'use client'

import Image from 'next/image'
import { useState } from 'react'

export type BrandLogo = {
  alt: string
  dimensions: string
  download: string
  file: string
  height: number
  id: 'wordmark-white' | 'wordmark-gradient' | 'falcon' | 'badge'
  name: string
  use: string
  width: number
}

type Surface = { id: 'void' | 'starlight' | 'ignition' | 'nebula'; label: string }

const SURFACES: Surface[] = [
  { id: 'void', label: 'Void' },
  { id: 'starlight', label: 'Starlight' },
  { id: 'ignition', label: 'Ignition' },
  { id: 'nebula', label: 'Nebula' },
]

/** Usage advice for a logo on a surface, from the brand's own rules. */
function verdict(logo: BrandLogo['id'], surface: Surface['id']): { ok: boolean; note: string } {
  if (logo === 'falcon' || logo === 'badge') return { ok: true, note: 'Self-contained mark — works on any surface.' }
  if (logo === 'wordmark-white') {
    return surface === 'starlight'
      ? { ok: false, note: 'Too little contrast. Use the gradient wordmark on light backgrounds.' }
      : { ok: true, note: 'Correct: the white wordmark belongs on dark or colour.' }
  }
  return surface === 'starlight'
    ? { ok: true, note: 'Correct: the gradient wordmark is made for light pages and documents.' }
    : { ok: false, note: 'The gradient sinks into dark and coloured surfaces. Use the white wordmark.' }
}

/** Logo preview on the brand surfaces with a live do / don’t readout and per-file downloads. */
export function BrandLogoStage({ logos }: { logos: BrandLogo[] }) {
  const [logoId, setLogoId] = useState<BrandLogo['id']>(logos[0].id)
  const [surface, setSurface] = useState<Surface['id']>('void')
  const logo = logos.find((item) => item.id === logoId) ?? logos[0]
  const advice = verdict(logo.id, surface)

  return (
    <div className="brand-stage">
      <div className="brand-stage__preview" data-surface={surface}>
        <span aria-hidden="true" className="brand-stage__clearspace">
          <Image
            alt={logo.alt}
            className={`brand-stage__logo brand-stage__logo--${logo.id}`}
            height={logo.height}
            sizes="(max-width: 900px) 80vw, 520px"
            src={logo.file}
            width={logo.width}
          />
        </span>
        <p className="brand-stage__verdict" data-ok={advice.ok || undefined} role="status">
          <b>{advice.ok ? 'Do' : 'Don’t'}</b> {advice.note}
        </p>
      </div>

      <div className="brand-stage__controls">
        <div aria-label="Background" className="brand-stage__surfaces" role="group">
          <span>Surface</span>
          {SURFACES.map((item) => (
            <button
              aria-pressed={surface === item.id}
              className={`brand-swatch-button brand-swatch-button--${item.id}`}
              key={item.id}
              onClick={() => setSurface(item.id)}
              type="button"
            >
              <i aria-hidden="true" />
              {item.label}
            </button>
          ))}
        </div>

        <ul className="brand-stage__list">
          {logos.map((item) => (
            <li data-active={item.id === logoId || undefined} key={item.id}>
              <button aria-pressed={item.id === logoId} className="brand-stage__pick" onClick={() => setLogoId(item.id)} type="button">
                <strong>{item.name}</strong>
                <small>{item.use}</small>
              </button>
              <a className="resource-download" download={item.download} href={item.file}>
                PNG <small>{item.dimensions}</small>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
