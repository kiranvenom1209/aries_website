import type { SVGProps } from 'react'

export function ArrowIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 28 18" {...props}>
      <path d="M1 9h24M18 2l7 7-7 7" stroke="currentColor" strokeLinecap="square" />
    </svg>
  )
}

export function ExpandIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
      <path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5" stroke="currentColor" />
      <path d="m4 9 6-6M20 9l-6-6M4 15l6 6M20 15l-6 6" stroke="currentColor" />
    </svg>
  )
}

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
      <path d="m5 5 14 14M19 5 5 19" stroke="currentColor" />
    </svg>
  )
}

export function EyeIcon({ crossed = false, ...props }: SVGProps<SVGSVGElement> & { crossed?: boolean }) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
      <path d="M2.5 12s3.5-5 9.5-5 9.5 5 9.5 5-3.5 5-9.5 5-9.5-5-9.5-5Z" stroke="currentColor" />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" />
      {crossed ? <path d="m4 4 16 16" stroke="currentColor" /> : null}
    </svg>
  )
}

