'use client'

import type { ReactNode } from 'react'

import { Footer } from './Footer'
import { Header } from './Header'

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="site-shell">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  )
}

