import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import '@fontsource-variable/space-grotesk'
import '@fontsource-variable/inter'
import './styles.css'

export const metadata: Metadata = {
  description:
    'HSM Aries is a student-led team at Hochschule Schmalkalden developing planetary rovers, scientific payloads and autonomous systems.',
  icons: {
    apple: '/media/cropped-falcon-1.png',
    icon: '/media/cropped-falcon-1.png',
    shortcut: '/media/cropped-falcon-1.png',
  },
  metadataBase: new URL('https://hsmaries.space'),
  openGraph: {
    description:
      'Student-built planetary rovers, scientific payloads and autonomous systems from Hochschule Schmalkalden.',
    images: ['/media/rover-hero-mars-v3.jpg'],
    siteName: 'HSM Aries',
    title: 'HSM Aries — Space Robotics at Hochschule Schmalkalden',
    type: 'website',
  },
  title: {
    default: 'HSM Aries — Space Robotics at Hochschule Schmalkalden',
    template: '%s — HSM Aries',
  },
}

export default function FrontendLayout({ children }: { children: ReactNode }) {
  return (
    <html data-scroll-behavior="smooth" lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
