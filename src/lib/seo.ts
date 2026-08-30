import type { Metadata } from 'next'

export const SITE_NAME = 'HSM Aries'
export const SITE_URL = 'https://hsmaries.space'
export const DEFAULT_DESCRIPTION =
  'HSM Aries is the student-led space robotics initiative of the Chair of Drive, Automation, and Robotics Technologies at Hochschule Schmalkalden.'
export const DEFAULT_SOCIAL_IMAGE = '/media/rover-hero-mars-v3.jpg'

export const absoluteUrl = (path = '/') => new URL(path, SITE_URL).toString()

export const metadataDescription = (value: string, maxLength = 160) => {
  const plain = value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&hellip;/gi, '…')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/&(?:#\d+|#x[\da-f]+|[a-z]+);/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (plain.length <= maxLength) return plain
  const clipped = plain.slice(0, maxLength - 1)
  const lastSpace = clipped.lastIndexOf(' ')
  return `${clipped.slice(0, lastSpace > maxLength * 0.7 ? lastSpace : undefined).trim()}…`
}

type PageMetadataOptions = {
  description: string
  image?: string
  path: string
  title: string
}

export function pageMetadata({
  description,
  image = DEFAULT_SOCIAL_IMAGE,
  path,
  title,
}: PageMetadataOptions): Metadata {
  return {
    alternates: {
      canonical: path,
    },
    description,
    openGraph: {
      description,
      images: [
        {
          alt: `${title} — ${SITE_NAME}`,
          url: image,
        },
      ],
      locale: 'en_GB',
      siteName: SITE_NAME,
      title,
      type: 'website',
      url: path,
    },
    title,
    twitter: {
      card: 'summary_large_image',
      description,
      images: [image],
      title,
    },
  }
}

export const serializeJsonLd = (value: unknown) =>
  JSON.stringify(value).replace(/</g, '\\u003c')
