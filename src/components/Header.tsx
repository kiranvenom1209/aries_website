'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { BrandLogo } from './BrandLogo'

type NavItem = {
  children?: Array<{ detail: string; href: string; label: string }>
  href: string
  label: string
}

const navigation: NavItem[] = [
  { href: '/about', label: 'About Us' },
  {
    children: [
      { detail: 'Project 01 · ERC 2026 finalist', href: '/leap-one', label: 'LEAP-One' },
      { detail: 'Project 02 · in development', href: '/leap-2', label: 'Leap-2' },
    ],
    href: '/leap-one',
    label: 'Leap Rovers',
  },
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
          const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)
          if (item.children) {
            const groupActive = item.children.some((child) => isActive(child.href))
            return (
              <div className="site-nav__group" key={item.href}>
                <Link aria-current={groupActive ? 'page' : undefined} href={item.href}>
                  {item.label}
                  <span aria-hidden="true" className="site-nav__caret" />
                </Link>
                <div aria-label={`${item.label} pages`} className="site-nav__menu">
                  {item.children.map((child) => (
                    <Link aria-current={isActive(child.href) ? 'page' : undefined} href={child.href} key={child.href}>
                      <strong>{child.label}</strong>
                      <small>{child.detail}</small>
                    </Link>
                  ))}
                </div>
              </div>
            )
          }
          return (
            <Link aria-current={isActive(item.href) ? 'page' : undefined} href={item.href} key={item.href}>
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
