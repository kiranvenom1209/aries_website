import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import '@fontsource-variable/space-grotesk'
import '@fontsource-variable/inter'
import './styles.css'

import { SitePreloader } from '@/components/SitePreloader'
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_SOCIAL_IMAGE,
  serializeJsonLd,
  SITE_NAME,
  SITE_URL,
} from '@/lib/seo'

export const metadata: Metadata = {
  applicationName: SITE_NAME,
  authors: [{ name: 'HSM Aries', url: SITE_URL }],
  category: 'space robotics',
  creator: 'HSM Aries',
  description: DEFAULT_DESCRIPTION,
  formatDetection: {
    address: false,
    email: false,
    telephone: false,
  },
  icons: {
    apple: '/media/cropped-falcon-1.png',
    icon: '/media/cropped-falcon-1.png',
    shortcut: '/media/cropped-falcon-1.png',
  },
  keywords: [
    'HSM Aries',
    'Hochschule Schmalkalden',
    'space robotics',
    'planetary rover',
    'LEAP-One',
    'LEAP Rovers',
    'European Rover Challenge',
    'student engineering team',
    'robotics Germany',
    'autonomous systems',
  ],
  manifest: '/manifest.webmanifest',
  metadataBase: new URL(SITE_URL),
  openGraph: {
    description: DEFAULT_DESCRIPTION,
    images: [{ alt: 'LEAP-One rover by HSM Aries', url: DEFAULT_SOCIAL_IMAGE }],
    locale: 'en_GB',
    siteName: SITE_NAME,
    title: 'HSM Aries — Space Robotics at Hochschule Schmalkalden',
    type: 'website',
    url: '/',
  },
  publisher: 'HSM Aries',
  robots: {
    follow: true,
    googleBot: {
      follow: true,
      index: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
    index: true,
  },
  title: {
    default: 'HSM Aries — Space Robotics at Hochschule Schmalkalden',
    template: '%s — HSM Aries',
  },
  twitter: {
    card: 'summary_large_image',
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_SOCIAL_IMAGE],
    title: 'HSM Aries — Space Robotics at Hochschule Schmalkalden',
  },
}

export default function FrontendLayout({ children }: { children: ReactNode }) {
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@id': `${SITE_URL}/#organization`,
        '@type': 'Organization',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'DE',
          addressLocality: 'Schmalkalden',
        },
        description: DEFAULT_DESCRIPTION,
        logo: {
          '@type': 'ImageObject',
          contentUrl: `${SITE_URL}/media/cropped-falcon-1.png`,
        },
        name: SITE_NAME,
        parentOrganization: {
          '@type': 'CollegeOrUniversity',
          name: 'Hochschule Schmalkalden',
          url: 'https://www.hs-schmalkalden.de/',
        },
        sameAs: [
          'https://www.linkedin.com/company/aries-space',
          'https://github.com/kiranvenom1209/LeapOne_rover',
        ],
        url: SITE_URL,
      },
      {
        '@id': `${SITE_URL}/#website`,
        '@type': 'WebSite',
        inLanguage: 'en',
        name: SITE_NAME,
        publisher: { '@id': `${SITE_URL}/#organization` },
        url: SITE_URL,
      },
    ],
  }

  return (
    <html data-scroll-behavior="smooth" lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <SitePreloader />
        <script
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(organizationJsonLd) }}
          type="application/ld+json"
        />
        {children}
      </body>
    </html>
  )
}
