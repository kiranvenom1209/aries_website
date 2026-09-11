import type { Metadata } from 'next'

export const SITE_NAME = 'HSM Aries'
export const SITE_URL = 'https://hsmaries.space'
/** Public contact address shown on /contact; reused by the Organization JSON-LD. */
export const SITE_EMAIL = 'hsmariesleapone@gmail.com'
/** Last content change to the static routes — bump it when a static page changes (sitemap lastmod). */
export const SITE_UPDATED = '2026-09-11'
export const DEFAULT_DESCRIPTION =
  'Student planetary-rover team at Hochschule Schmalkalden. LEAP-One competed at the ERC 2026 finals in Kraków; Leap-2, the next rover, is in development.'
export const DEFAULT_SOCIAL_IMAGE = '/media/og/home.jpg'
export const DEFAULT_SOCIAL_IMAGE_ALT = 'LEAP-One on the Mars yard at the ERC 2026 finals in Kraków'

/** Share-card size every `public/media/og/*.jpg` crop is rendered at. */
export const SOCIAL_IMAGE_WIDTH = 1200
export const SOCIAL_IMAGE_HEIGHT = 630

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

export type SocialImage = {
  alt: string
  height?: number
  type?: string
  url: string
  width?: number
}

const MIME_BY_EXTENSION: Record<string, string> = {
  avif: 'image/avif',
  gif: 'image/gif',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
}

const imageMimeType = (src: string) => {
  const extension = src.split(/[?#]/)[0].split('.').pop()?.toLowerCase() ?? ''
  return MIME_BY_EXTENSION[extension]
}

const dimensionCache = new Map<string, Promise<{ height: number; width: number } | undefined>>()

/**
 * Pixel size of a site-hosted image (`/media/...`). The 1200×630 crops under
 * `/media/og/` are known without touching the disk; anything else is probed once
 * with sharp and cached. Resolves to `undefined` when the file cannot be read
 * (CMS uploads, externals, serverless hosts without `public/` on disk).
 */
export const socialImageDimensions = (src: string) => {
  if (src.startsWith('/media/og/')) {
    return Promise.resolve({ height: SOCIAL_IMAGE_HEIGHT, width: SOCIAL_IMAGE_WIDTH })
  }
  if (!src.startsWith('/media/') || src.includes('..')) return Promise.resolve(undefined)
  let pending = dimensionCache.get(src)
  if (!pending) {
    pending = (async () => {
      try {
        const [{ default: sharp }, path] = await Promise.all([import('sharp'), import('node:path')])
        const file = path.join(process.cwd(), 'public', ...src.split('/').filter(Boolean))
        const { height, orientation, width } = await sharp(file).metadata()
        if (!width || !height) return undefined
        // EXIF orientations 5–8 swap the axes once the image is displayed upright.
        return (orientation ?? 1) >= 5 ? { height: width, width: height } : { height, width }
      } catch {
        return undefined
      }
    })()
    dimensionCache.set(src, pending)
  }
  return pending
}

/** One `og:image` / `twitter:image` entry with the size and type crawlers ask for. */
export const socialImage = ({
  alt,
  height,
  url,
  width,
}: {
  alt: string
  height?: number
  url: string
  width?: number
}): SocialImage => {
  const isCrop = url.startsWith('/media/og/')
  return {
    alt,
    height: height ?? (isCrop ? SOCIAL_IMAGE_HEIGHT : undefined),
    type: imageMimeType(url),
    url,
    width: width ?? (isCrop ? SOCIAL_IMAGE_WIDTH : undefined),
  }
}

type PageMetadataOptions = {
  description: string
  image?: string
  /** Describes the photo itself; defaults to "<title> — HSM Aries". */
  imageAlt?: string
  path: string
  title: string
}

export function pageMetadata({
  description,
  image = DEFAULT_SOCIAL_IMAGE,
  imageAlt,
  path,
  title,
}: PageMetadataOptions): Metadata {
  const shareImage = socialImage({
    alt:
      imageAlt ??
      (image === DEFAULT_SOCIAL_IMAGE ? DEFAULT_SOCIAL_IMAGE_ALT : `${title} — ${SITE_NAME}`),
    url: image,
  })
  return {
    alternates: {
      canonical: path,
    },
    description,
    openGraph: {
      description,
      images: [shareImage],
      locale: 'en_GB',
      siteName: SITE_NAME,
      title,
      type: 'website',
      url: path,
    },
    // The root page shares the layout's segment, so `title.template` never applies to it:
    // the home title is already the full brand string and must not get the suffix.
    title: path === '/' ? { absolute: title } : title,
    twitter: {
      card: 'summary_large_image',
      description,
      images: [shareImage],
      title,
    },
  }
}

type Breadcrumb = { name: string; path?: string }

/** `BreadcrumbList` node for a page's JSON-LD; the last crumb is the current page and carries no URL. */
export const breadcrumbJsonLd = (crumbs: Breadcrumb[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map(({ name, path }, index) => ({
    '@type': 'ListItem',
    ...(path ? { item: absoluteUrl(path) } : {}),
    name,
    position: index + 1,
  })),
})

export const serializeJsonLd = (value: unknown) =>
  JSON.stringify(value).replace(/</g, '\\u003c')
