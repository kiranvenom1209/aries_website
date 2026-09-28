'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useId, useState } from 'react'

import { NO_CONSENT, readConsent, writeConsent } from '@/lib/consent'
import { embedProvider, privacyEnhancedEmbedUrl } from '@/lib/embeds'
import { useConsent } from '@/lib/useConsent'

type ExternalMediaEmbedProps = {
  poster?: string
  src: string
  title: string
}

/**
 * Two-click embed: a third-party player loads only after the visitor presses play here or has
 * allowed external media in the consent panel. Until then no request leaves for the provider.
 */
export function ExternalMediaEmbed({ poster, src, title }: ExternalMediaEmbedProps) {
  const consent = useConsent()
  const [playRequested, setPlayRequested] = useState(false)
  const [remember, setRemember] = useState(false)
  const provider = embedProvider(src)
  const rememberId = useId()

  if (playRequested || consent?.media) {
    return (
      <iframe
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading={playRequested ? 'eager' : 'lazy'}
        referrerPolicy="strict-origin-when-cross-origin"
        src={privacyEnhancedEmbedUrl(src, { autoplay: playRequested })}
        title={title}
      />
    )
  }

  const play = () => {
    if (remember) writeConsent({ ...(readConsent() ?? NO_CONSENT), media: true })
    setPlayRequested(true)
  }

  return (
    <div className="media-gate">
      {poster ? <Image alt="" className="media-gate__poster" fill sizes="(max-width: 900px) 100vw, 740px" src={poster} /> : null}
      <span aria-hidden="true" className="media-gate__veil" />
      <div className="media-gate__panel">
        <span className="media-gate__eyebrow">
          <i aria-hidden="true" />
          External signal · {provider.name}
        </span>
        <button className="media-gate__play" onClick={play} type="button">
          <span aria-hidden="true" className="media-gate__play-icon" />
          <span>
            Play video
            <small>{title}</small>
          </span>
        </button>
        <p className="media-gate__copy">
          Playing connects to {provider.name} ({provider.company}), which receives your IP address and may store
          cookies. <Link href="/datenschutz#external-media">Privacy policy</Link>
        </p>
        <label className="media-gate__remember" htmlFor={rememberId}>
          <input checked={remember} id={rememberId} onChange={(event) => setRemember(event.target.checked)} type="checkbox" />
          <span aria-hidden="true" className="media-gate__check" />
          Always load external media
        </label>
      </div>
    </div>
  )
}
