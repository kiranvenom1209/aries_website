import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { BrandLogo } from '@/components/BrandLogo'
import { LoginForm } from '@/components/LoginForm'

export const metadata: Metadata = {
  robots: { follow: false, index: false },
  title: 'Team Login',
}

export default function LoginPage() {
  return (
    <main className="login-page">
      <Image alt="HSM Aries LEAP-One rover exploring a Mars-like landscape" fill priority sizes="100vw" src="/media/rover-hero-mars-v3.jpg" />
      <div aria-hidden="true" className="login-page__shade" />
      <div aria-hidden="true" className="login-coordinates">
        <span>53.5511° N</span><span>6.3553° E</span><span>42.3601° N</span><span>71.0589° W</span>
      </div>
      <section className="login-panel">
        <BrandLogo priority />
        <div>
          <h1>Welcome back.</h1>
          <p>Sign in to manage HSM Aries news, media<br />and mission updates.</p>
        </div>
        <LoginForm />
        <Link className="login-back" href="/">←&nbsp;&nbsp; Back to hsmaries.space</Link>
      </section>
    </main>
  )
}
