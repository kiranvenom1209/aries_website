'use client'

import type { ReactNode } from 'react'

import { openConsentSettings } from '@/lib/consent'

/** Reopens the consent panel — withdrawing consent must be as easy as giving it (Art. 7 (3) GDPR). */
export function ConsentSettingsButton({ children = 'Cookie settings', className }: { children?: ReactNode; className?: string }) {
  return (
    <button aria-haspopup="dialog" className={className} onClick={openConsentSettings} type="button">
      {children}
    </button>
  )
}
