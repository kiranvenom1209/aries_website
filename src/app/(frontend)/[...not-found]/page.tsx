import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Off the map',
}

// Any URL that matches no frontend route renders the branded not-found page inside the frontend layout.
export default function NotFoundCatchAll() {
  notFound()
}
