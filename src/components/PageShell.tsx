'use client'

import type { ReactNode } from 'react'

import { Footer } from './Footer'
import { Header } from './Header'

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </div>
  )
}

