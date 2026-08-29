'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'

import { EyeIcon } from './Icons'

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    const form = new FormData(event.currentTarget)
    const rawIdentifier = String(form.get('email') ?? '').trim().toLowerCase()
    const password = String(form.get('password') ?? '').trim()

    if (!rawIdentifier || !password) {
      setError('Please enter your username or email and password.')
      return
    }

    // Support both username (e.g. 'admin') and full email (e.g. 'admin@hsmaries.space')
    const email = rawIdentifier.includes('@')
      ? rawIdentifier
      : `${rawIdentifier}@hsmaries.space`

    setSubmitting(true)
    try {
      const response = await fetch('/api/users/login', {
        body: JSON.stringify({ email, password }),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })

      const contentType = response.headers.get('content-type') || ''
      const isJsonResponse = contentType.includes('application/json')

      if (response.ok && isJsonResponse) {
        window.location.assign('/admin')
        return
      }

      if (!isJsonResponse) {
        throw new Error(
          'Online CMS backend is not connected. Connect a cloud database (DATABASE_URL) in your Netlify/Vercel settings to enable online editing.'
        )
      }

      const result = (await response.json().catch(() => null)) as { message?: string } | null
      throw new Error(result?.message ?? 'The username/email or password is incorrect.')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to sign in. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <form className="login-form" noValidate onSubmit={submit}>
      <label htmlFor="email">Username or Email</label>
      <input
        autoComplete="username email"
        id="email"
        name="email"
        placeholder="admin or you@hsmaries.space"
        type="text"
      />
      <label htmlFor="password">Password</label>
      <div className="password-field">
        <input
          autoComplete="current-password"
          id="password"
          name="password"
          placeholder="Enter your password"
          type={showPassword ? 'text' : 'password'}
        />
        <button
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          onClick={() => setShowPassword((current) => !current)}
          type="button"
        >
          <EyeIcon crossed={showPassword} />
        </button>
      </div>

      {error ? <p aria-live="polite" className="form-error">{error}</p> : null}

      <label className="remember-field">
        <input name="remember" type="checkbox" />
        <span>Remember me</span>
      </label>

      <button className="login-submit" disabled={submitting} type="submit">
        {submitting ? 'Establishing link…' : 'Sign in'}
      </button>

      <div className="login-form__links">
        <Link href="/admin/forgot">Forgot password?</Link>
        <Link href="/admin">Mission Control Panel</Link>
      </div>
    </form>
  )
}
