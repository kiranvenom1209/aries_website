'use client'

import Link from 'next/link'
import type { MouseEvent, ReactNode } from 'react'
import { useRef } from 'react'

import { ArrowIcon } from './Icons'

type MagneticLinkProps = {
  children: ReactNode
  className?: string
  href: string
}

export function MagneticLink({ children, className = '', href }: MagneticLinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null)

  const move = (event: MouseEvent<HTMLAnchorElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left - rect.width / 2) * 0.12
    const y = (event.clientY - rect.top - rect.height / 2) * 0.18
    event.currentTarget.style.setProperty('--magnetic-x', `${x}px`)
    event.currentTarget.style.setProperty('--magnetic-y', `${y}px`)
  }

  const reset = () => {
    linkRef.current?.style.setProperty('--magnetic-x', '0px')
    linkRef.current?.style.setProperty('--magnetic-y', '0px')
  }

  return (
    <Link
      className={`magnetic-link ${className}`}
      href={href}
      onMouseLeave={reset}
      onMouseMove={move}
      ref={linkRef}
    >
      <span>{children}</span>
      <ArrowIcon />
    </Link>
  )
}

