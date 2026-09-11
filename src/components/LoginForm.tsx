'use client'

import Link from 'next/link'
import { FormEvent, useEffect, useState } from 'react'

import { EyeIcon } from './Icons'

// Visitor-facing copy only; developer detail goes to console.error.
const INCORRECT_CREDENTIALS = 'Incorrect username or password.'
const UNAVAILABLE = 'Sign-in is temporarily unavailable. Please try again in a few minutes.'
const REMEMBERED_ID_KEY = 'hsm-aries-login-id'

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [identifier, setIdentifier] = useState('')
  const [remember, setRemember] = useState(false)

  // Prefill a remembered username after hydration so server and client markup match.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(REMEMBERED_ID_KEY)
      if (stored) {
        setIdentifier(stored)
        setRemember(true)
      }
    } catch {
      // Storage unavailable (private mode, blocked site data): nothing to prefill.
    }
  }, [])

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

    // A bare username is completed to the team domain; a full email is used as typed.
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
        try {
          if (remember) window.localStorage.setItem(REMEMBERED_ID_KEY, rawIdentifier)
          else window.localStorage.removeItem(REMEMBERED_ID_KEY)
        } catch {
          // Storage unavailable: the sign-in still succeeds.
        }
        window.location.assign('/admin')
        return
      }

      if (!isJsonResponse) {
        console.error(
          `Login API returned a non-JSON response (HTTP ${response.status}); check DATABASE_URL on the host.`
        )
        throw new Error(UNAVAILABLE)
      }

      const result = (await response.json().catch(() => null)) as { message?: string } | null
      if (response.status === 401) throw new Error(INCORRECT_CREDENTIALS)

      console.error(`Login API responded with HTTP ${response.status}: ${result?.message ?? 'no message'}`)
      throw new Error(response.status >= 500 ? UNAVAILABLE : result?.message ?? INCORRECT_CREDENTIALS)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to sign in. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <form className="login-form" noValidate onSubmit={submit} id="login-form">
      <label htmlFor="email">Username or email</label>
      <input
        aria-describedby="login-error"
        aria-invalid={Boolean(error)}
        autoComplete="username"
        id="email"
        name="email"
        onChange={(event) => setIdentifier(event.target.value)}
        placeholder="you@hsmaries.space"
        required
        type="text"
        value={identifier}
      />
      <label htmlFor="password">Password</label>
      <div className="password-field">
        <input
          aria-describedby="login-error"
          aria-invalid={Boolean(error)}
          autoComplete="current-password"
          id="password"
          name="password"
          placeholder="Enter your password"
          required
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

      {/* Always mounted so the live region exists before an error lands and the layout stays put. */}
      <p aria-live="polite" className="form-error" id="login-error" role="status">{error}</p>

      <label className="remember-field">
        <input
          checked={remember}
          name="remember"
          onChange={(event) => setRemember(event.target.checked)}
          type="checkbox"
        />
        <span>Remember my username</span>
      </label>

      <button className="login-submit" disabled={submitting} type="submit">
        {submitting ? 'Establishing link…' : 'Sign in'}
      </button>

      <div className="login-form__links">
        <Link href="/admin/forgot">Forgot password?</Link>
      </div>
    </form>
  )
}
