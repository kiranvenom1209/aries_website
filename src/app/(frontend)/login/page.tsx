import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { BrandLogo } from '@/components/BrandLogo'
import { LoginForm } from '@/components/LoginForm'

export const metadata: Metadata = {
  robots: { follow: false, index: false },
  title: 'Mission Control login',
}

export default function LoginPage() {
  return (
    <main className="login-page" id="main" tabIndex={-1}>
      <a className="skip-link" href="#login-form">Skip to sign-in form</a>
      {/* Wrapper is wider than the viewport so the far-right spectator in the 3:2 frame is cropped out. */}
      <div aria-hidden="true" className="login-page__photo">
        <Image alt="" fill priority sizes="100vw" src="/media/erc-2026-finals-hero-home.jpg" />
      </div>
      <div aria-hidden="true" className="login-page__shade" />
      <div aria-hidden="true" className="login-coordinates">
        <span>SMK 50.7147° N 10.4657° E</span><span>ERC 2026 // KRAKÓW</span><span>KRK 50.0647° N 19.9450° E</span><span>LEAP-ONE // MISSION CONTROL</span>
      </div>
      <section className="login-panel">
        <BrandLogo priority />
        <div>
          <span className="hero__eyebrow">Mission control // Team access</span>
          <h1>Welcome back.</h1>
          <p>Sign in to manage HSM Aries news, media and mission updates.</p>
        </div>
        <LoginForm />
        <Link className="login-back" href="/">←&nbsp;&nbsp; Back to hsmaries.space</Link>
      </section>
    </main>
  )
}
