'use client'

import { useState, type FormEvent, type ReactNode } from 'react'

type NetlifyFormProps = {
  children: ReactNode
  className?: string
  name: 'general-contact' | 'join-aries' | 'partnership-enquiry'
  successContext: 'contact' | 'join' | 'partner'
}

export function NetlifyForm({ children, className, name, successContext }: NetlifyFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
        throw new Error(`Submission failed with status ${response.status}`)
      }

      window.location.assign(`/thank-you?form=${successContext}`)
    } catch {
      setError('The signal could not be transmitted. Please try again or contact us by email.')
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
      {error ? <p className="form-status form-status--error" role="alert">{error}</p> : null}
    </form>
  )
}
