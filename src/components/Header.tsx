'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { BrandLogo } from './BrandLogo'

const navigation = [
  { href: '/about', label: 'HSM Aries' },
  { href: '/leap-one', label: 'Leap Rovers' },
  { href: '/team', label: 'Team' },
  { href: '/news', label: 'News' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
]

export function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.body.classList.toggle('nav-open', open)
    return () => document.body.classList.remove('nav-open')
  }, [open])

  return (
    <header className="site-header">
      <BrandLogo priority />
      <button
        aria-controls="site-navigation"
        aria-expanded={open}
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        className="menu-toggle"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span />
        <span />
      </button>
      <nav aria-label="Primary navigation" className={open ? 'site-nav is-open' : 'site-nav'} id="site-navigation">
        {navigation.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link aria-current={active ? 'page' : undefined} href={item.href} key={item.href}>
              {item.label}
            </Link>
          )
        })}
        <Link className="header-cta" href="/join">
          Join Aries
        </Link>
      </nav>
    </header>
  )
}
