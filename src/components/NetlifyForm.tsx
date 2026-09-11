'use client'

import { useState, type FormEvent, type ReactNode } from 'react'

const TEAM_EMAIL = 'hsmariesleapone@gmail.com'

type NetlifyFormProps = {
  children: ReactNode
  className?: string
  name: 'general-contact' | 'join-aries' | 'partnership-enquiry'
  submitLabel: string
  successContext: 'contact' | 'join' | 'partner'
}

export function NetlifyForm({ children, className, name, submitLabel, successContext }: NetlifyFormProps) {
  const [error, setError] = useState<ReactNode>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const noteId = `${name}-note`

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const body = new URLSearchParams()

    for (const [key, value] of formData.entries()) {
      body.append(key, String(value))
    }

    try {
      const response = await fetch('/__forms.html', {
        body: body.toString(),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        method: 'POST',
      })

      if (!response.ok) {
        if (
          typeof window !== 'undefined' &&
          (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ) {
          console.info(`[Dev Form Submission: ${name}]`, Object.fromEntries(formData.entries()))
          window.location.assign(`/thank-you?form=${successContext}`)
          return
        }
        throw new Error(`Submission failed with status ${response.status}`)
      }

      window.location.assign(`/thank-you?form=${successContext}`)
    } catch {
      if (
        typeof window !== 'undefined' &&
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ) {
        window.location.assign(`/thank-you?form=${successContext}`)
        return
      }
      setError(
        <>
          The message could not be sent. Try again, or write to{' '}
          <a href={`mailto:${TEAM_EMAIL}`}>{TEAM_EMAIL}</a>.
        </>,
      )
      setIsSubmitting(false)
    }
  }

  return (
    <form
      action="/__forms.html"
      aria-busy={isSubmitting}
      className={className}
      method="post"
      name={name}
      onSubmit={submit}
    >
      <input name="form-name" type="hidden" value={name} />
      <p hidden>
        <label>Do not fill this out: <input name="bot-field" /></label>
      </p>
      {children}
      <p className="form-note" id={noteId}>All fields are required.</p>
      <button
        aria-describedby={noteId}
        className="button button--solid"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? 'Sending…' : submitLabel} <span aria-hidden="true">→</span>
      </button>
      {error ? <p className="form-status form-status--error" role="alert">{error}</p> : null}
    </form>
  )
}
