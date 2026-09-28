'use client'

import { useEffect, useState, type ReactNode } from 'react'

type CopyButtonProps = {
  children?: ReactNode
  className?: string
  /** Accessible name, e.g. "Copy short description". */
  label: string
  text: string
}

/** Copies `text` to the clipboard and confirms in place for two seconds. */
export function CopyButton({ children = 'Copy', className = 'copy-button', label, text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(timer)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // Clipboard API unavailable (insecure context, old browser): fall back to a hidden textarea.
      const area = document.createElement('textarea')
      area.value = text
      area.setAttribute('readonly', '')
      area.style.position = 'fixed'
      area.style.opacity = '0'
      document.body.appendChild(area)
      area.select()
      document.execCommand('copy')
      area.remove()
    }
    setCopied(true)
  }

  return (
    <button aria-label={label} className={className} data-copied={copied || undefined} onClick={copy} type="button">
      <span aria-live="polite">{copied ? 'Copied' : children}</span>
    </button>
  )
}
