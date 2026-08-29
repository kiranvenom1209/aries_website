'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const BackIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
)

const ExternalIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
)

const LogoutIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)

export const HeaderActions = () => {
  const pathname = usePathname()
  const [loggingOut, setLoggingOut] = useState(false)
  const isRootDashboard = pathname === '/admin' || pathname === '/admin/'

  const handleLogout = async () => {
    if (loggingOut) return
    setLoggingOut(true)
    try {
      await fetch('/api/users/logout', {
        credentials: 'include',
        method: 'POST',
      })
    } catch {
      // Proceed on error
    }
    window.location.assign('/login')
  }

  return (
    <div className="aries-header-actions">
      {!isRootDashboard && (
        <Link
          href="/admin"
          className="aries-topbar-btn aries-topbar-btn--back"
          title="Return to Mission Control Dashboard"
        >
          <BackIcon />
          <span>DASHBOARD</span>
        </Link>
      )}

      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="aries-topbar-btn"
        title="Open live website in a new tab"
      >
        <ExternalIcon />
        <span>LIVE SITE ↗</span>
      </a>

      <button
        onClick={handleLogout}
        disabled={loggingOut}
        type="button"
        className="aries-topbar-btn aries-topbar-btn--logout"
        title="Sign out of Mission Control"
      >
        <LogoutIcon />
        <span>{loggingOut ? 'EXITING…' : 'SIGN OUT'}</span>
      </button>
    </div>
  )
}

export const SidebarControls = () => {
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (loggingOut) return
    setLoggingOut(true)
    try {
      await fetch('/api/users/logout', {
        credentials: 'include',
        method: 'POST',
      })
    } catch {
      // Proceed on error
    }
    window.location.assign('/login')
  }

  return (
    <div className="aries-sidebar-controls">
      <div className="aries-sidebar-controls__divider" />
      <Link href="/admin" className="aries-sidebar-link">
        <BackIcon />
        <span>Mission Dashboard</span>
      </Link>
      <Link href="/" className="aries-sidebar-link">
        <ExternalIcon />
        <span>View Live Website</span>
      </Link>
      <button onClick={handleLogout} disabled={loggingOut} className="aries-sidebar-link aries-sidebar-link--logout" type="button">
        <LogoutIcon />
        <span>{loggingOut ? 'Signing out…' : 'Sign out'}</span>
      </button>
    </div>
  )
}
