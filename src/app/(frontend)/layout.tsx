import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import '@fontsource-variable/space-grotesk'
import '@fontsource-variable/inter'
import './styles.css'
import './styles/shell.css'
import './styles/home.css'
import './styles/programme-polish.css'
import './styles/about.css'
import './styles/leap-one.css'
import './styles/leap-2.css'
import './styles/rover-projects.css'
import './styles/team.css'
import './styles/member-profile.css'
import './styles/news.css'
import './styles/gallery.css'
import './styles/forms.css'
import './styles/login.css'
import './styles/not-found.css'

import { SitePreloader } from '@/components/SitePreloader'
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_SOCIAL_IMAGE,
  DEFAULT_SOCIAL_IMAGE_ALT,
  serializeJsonLd,
  SITE_EMAIL,
  SITE_NAME,
  SITE_URL,
  socialImage,
} from '@/lib/seo'

const SITE_TITLE = 'HSM Aries — Space Robotics at Hochschule Schmalkalden'
const defaultShareImage = socialImage({ alt: DEFAULT_SOCIAL_IMAGE_ALT, url: DEFAULT_SOCIAL_IMAGE })

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#050809',
}

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
    apple: '/apple-touch-icon-180.png',
    icon: '/icon-32.png',
    shortcut: '/icon-32.png',
  },
  keywords: [
    'HSM Aries',
    'Hochschule Schmalkalden',
    'space robotics',
    'planetary rover',
    'LEAP-One',
    'Leap-2',
    'LEAP Rovers',
    'European Rover Challenge',
    'ERC 2026',
    'student engineering team',
    'robotics Germany',
    'autonomous systems',
  ],
  manifest: '/manifest.webmanifest',
  metadataBase: new URL(SITE_URL),
  openGraph: {
    description: DEFAULT_DESCRIPTION,
    images: [defaultShareImage],
    locale: 'en_GB',
    siteName: SITE_NAME,
    title: SITE_TITLE,
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
    default: SITE_TITLE,
    template: '%s — HSM Aries',
  },
  twitter: {
    card: 'summary_large_image',
    description: DEFAULT_DESCRIPTION,
    images: [defaultShareImage],
    title: SITE_TITLE,
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
        alternateName: ['HSM Aries.space', 'Aries.space'],
        description: DEFAULT_DESCRIPTION,
        email: SITE_EMAIL,
        logo: {
          '@type': 'ImageObject',
          height: 512,
          url: `${SITE_URL}/media/cropped-falcon-1.png`,
          width: 512,
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
