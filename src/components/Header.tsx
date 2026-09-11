'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { BrandLogo } from './BrandLogo'

type NavItem = {
  children?: Array<{ detail: string; href: string; label: string }>
  href: string
  label: string
}

const navigation: NavItem[] = [
  { href: '/about', label: 'About us' },
  {
    children: [
      { detail: 'Project 01 · ERC 2026 finalist', href: '/leap-one', label: 'LEAP-One' },
      { detail: 'Project 02 · in development', href: '/leap-2', label: 'Leap-2' },
    ],
    href: '/leap-one',
    label: 'LEAP Rovers',
  },
  { href: '/team', label: 'Team' },
  { href: '/news', label: 'News' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
]

const SCROLLED_AT = 72

export function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [groupOpen, setGroupOpen] = useState(false)
  // Keyboard disclosure: focus reveals the menu via :focus-within; Escape dismisses it until focus leaves.
  const [groupFocus, setGroupFocus] = useState(false)
  const [groupDismissed, setGroupDismissed] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [readout, setReadout] = useState('')
  const groupRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const progressRef = useRef<HTMLSpanElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setOpen(false)
    setGroupOpen(false)
    setGroupDismissed(false)
  }, [pathname])

  // Open drawer: lock the viewport (html class, since body overflow no longer propagates once the
  // base sheet clips html on phones) and make the page behind it inert so Tab cannot leave the menu.
  useEffect(() => {
    document.body.classList.toggle('nav-open', open)
    document.documentElement.classList.toggle('nav-open', open)
    const behind = document.querySelectorAll<HTMLElement>('main#main, .site-shell > footer')
    behind.forEach((element) => element.toggleAttribute('inert', open))
    return () => {
      document.body.classList.remove('nav-open')
      document.documentElement.classList.remove('nav-open')
      behind.forEach((element) => element.removeAttribute('inert'))
    }
  }, [open])

  // Fixed "mission bar": scrolled state + 2px scroll-progress line, one passive listener.
  useEffect(() => {
    let frame = 0

    const measure = () => {
      frame = 0
      const y = window.scrollY
      // No local mirror: React bails out on unchanged values, and the state survives navigations.
      setScrolled(y > SCROLLED_AT)
      const range = document.documentElement.scrollHeight - window.innerHeight
      const progress = range > 0 ? Math.min(1, Math.max(0, y / range)) : 0
      progressRef.current?.style.setProperty('--scroll-progress', progress.toFixed(4))
    }

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [pathname])

  // Section readout: mirrors the current numbered eyebrow ("PROOF IN THE FIELD / 04") in the scrolled bar.
  useEffect(() => {
    setReadout('')
    if (typeof IntersectionObserver === 'undefined') return

    const labels = Array.from(
      document.querySelectorAll<HTMLElement>('main [data-section-label], main .section-label'),
    )
    if (labels.length === 0) return

    const labelText = (element: HTMLElement) =>
      (element.dataset.sectionLabel ?? element.textContent ?? '').replace(/\s+/g, ' ').trim()

    let frame = 0
    const update = () => {
      frame = 0
      const line = window.innerHeight * 0.42
      let current = ''
      for (const label of labels) {
        if (label.getBoundingClientRect().top <= line) current = labelText(label)
      }
      // No section applies over the closing footer.
      const footer = document.querySelector('.site-footer')
      if (footer && footer.getBoundingClientRect().top <= line) current = ''
      setReadout(current)
    }
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    // The observer alone misses jumps that skip its band (PageDown, scrollbar drags, anchors,
    // scroll restoration), so a rAF-throttled scroll listener keeps the readout honest.
    const observer = new IntersectionObserver(schedule, { rootMargin: '0px 0px -58% 0px', threshold: 0 })
    labels.forEach((label) => observer.observe(label))
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    update()
    return () => {
      window.cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [pathname])

  // Escape closes the mobile drawer and the disclosure; pointerdown outside closes the disclosure.
  useEffect(() => {
    if (!open && !groupOpen) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (open) {
        setOpen(false)
        toggleRef.current?.focus()
      }
      setGroupOpen(false)
    }
    const onPointerDown = (event: PointerEvent) => {
      if (groupOpen && !groupRef.current?.contains(event.target as Node)) setGroupOpen(false)
    }

    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onPointerDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onPointerDown)
    }
  }, [groupOpen, open])

  // Opening the drawer moves focus to the first nav link so the keyboard follows the menu.
  useEffect(() => {
    if (!open) return
    const frame = window.requestAnimationFrame(() => {
      navRef.current?.querySelector<HTMLElement>('a')?.focus()
    })
    return () => window.cancelAnimationFrame(frame)
  }, [open])

  const headerClass = ['site-header', scrolled ? 'is-scrolled' : '', open ? 'is-nav-open' : '']
    .filter(Boolean)
    .join(' ')

  return (
    <header className={headerClass}>
      <span aria-hidden="true" className="scroll-progress" ref={progressRef} />
      <BrandLogo priority />
      <span aria-hidden="true" className="site-header__readout" data-empty={readout ? undefined : ''}>
        {readout}
      </span>
      <button
        aria-controls="site-navigation"
        aria-expanded={open}
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        className="menu-toggle"
        onClick={() => setOpen((current) => !current)}
        ref={toggleRef}
        type="button"
      >
        <span />
        <span />
      </button>
      <nav aria-label="Primary" className={open ? 'site-nav is-open' : 'site-nav'} id="site-navigation" ref={navRef}>
        {navigation.map((item) => {
          const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)
          if (item.children) {
            const groupActive = item.children.some((child) => isActive(child.href))
            return (
              <div
                className={['site-nav__group', groupOpen ? 'is-open' : '', groupDismissed ? 'is-dismissed' : '']
                  .filter(Boolean)
                  .join(' ')}
                key={item.href}
                onBlur={(event) => {
                  if (groupRef.current?.contains(event.relatedTarget as Node)) return
                  setGroupFocus(false)
                  setGroupDismissed(false)
                }}
                onFocus={() => setGroupFocus(true)}
                onKeyDown={(event) => {
                  // Escape hides the keyboard-revealed menu and returns focus to the trigger; the
                  // drawer path is handled by the window listener above.
                  if (event.key !== 'Escape' || open) return
                  setGroupOpen(false)
                  setGroupDismissed(true)
                  groupRef.current?.querySelector<HTMLElement>('a')?.focus()
                }}
                ref={groupRef}
              >
                <Link
                  aria-expanded={open ? undefined : groupOpen || (groupFocus && !groupDismissed)}
                  data-active={groupActive || undefined}
                  href={item.href}
                  onClick={(event) => {
                    // Pointers without hover (touch laptops, tablets) get a tap-to-open disclosure.
                    if (!groupOpen && window.matchMedia('(hover: none)').matches && !open) {
                      event.preventDefault()
                      setGroupOpen(true)
                    }
                  }}
                >
                  {item.label}
                  <span aria-hidden="true" className="site-nav__caret" />
                </Link>
                <div aria-label={`${item.label} pages`} className="site-nav__menu" role="group">
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
          Join the crew
        </Link>
      </nav>
    </header>
  )
}
