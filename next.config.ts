import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

import { newsSeed } from './src/seed/news'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

/** Old attachment pages, their uploaded HTML files and friendly aliases → the rebuilt pages. */
const legacyResourceRedirects = () => {
  const pages: Array<[string, string[]]> = [
    [
      '/brand',
      [
        '/brand-assets',
        '/brand_assets',
        ...Array.from({ length: 6 }, (_, index) => `/brand_assets-${index + 1}`),
        '/wp-content/uploads/2026/01/Brand_Assets-5.html',
        '/media/Brand_Assets-5.html',
      ],
    ],
    [
      '/press',
      [
        '/press-kit',
        '/media-kit',
        '/media_kit',
        ...Array.from({ length: 10 }, (_, index) => `/media_kit-${index + 1}`),
        '/wp-content/uploads/2026/01/Media_Kit-9.html',
        '/media/Media_Kit-9.html',
      ],
    ],
    ['/leap-one/cad', ['/cad', '/cad-viewer', '/cad_view', '/wp-content/uploads/2026/01/CAD_View.html', '/media/CAD_View.html']],
  ]
  return pages.flatMap(([destination, sources]) => sources.map((source) => ({ destination, permanent: true, source })))
}

const nextConfig: NextConfig = {
  // Keeps the dev badge clear of the consent panel, which sits bottom-left.
  devIndicators: { position: 'bottom-right' },
  experimental: {
    globalNotFound: true,
  },
  outputFileTracingExcludes: {
    '*': [
      'public/**',
      './public/**',
      'media/**',
      './media/**',
      'wordpress-source/**',
      'output/**',
      'tmp/**',
      '**/*.glb',
      '**/*.mp4',
      '**/*.mov',
      '**/*.png',
      '**/*.jpg',
      '**/*.jpeg',
      '**/*.webp',
    ],
  },
  async headers() {
    return [
      // Turntable frames are content-addressed by their version directory: a new render gets a new
      // path, so every frame can be cached for a year and repeat visits never refetch the sequence.
      {
        source: '/media/leap-one-studio-:version/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ]
  },
  async redirects() {
    return [
      // WordPress author archives were retired; keep the submitted sitemap URL reachable.
      { source: '/author-sitemap.xml', destination: '/page-sitemap.xml', permanent: true },
      // Common spellings of the legal pages, and the WordPress feed address.
      ...['/privacy', '/privacy-policy', '/datenschutzerklaerung', '/datenschutzerklarung'].map((source) => ({
        destination: '/datenschutz',
        permanent: true,
        source,
      })),
      ...['/imprint', '/legal-notice', '/legal'].map((source) => ({ destination: '/impressum', permanent: true, source })),
      { source: '/feed', destination: '/feed.xml', permanent: true },
      // The WordPress site's standalone resource pages (footer "Downloads"), rebuilt as site pages.
      ...legacyResourceRedirects(),
      ...newsSeed.map((article) => ({
        destination: `/news/${article.slug}`,
        permanent: true,
        source: `/${article.slug}`,
      })),
    ]
  },
  images: {
    // Static photos are served as pre-built WebP variants (scripts/build-responsive-media.mjs)
    // through a custom loader, so no image CDN or /_next/image function is involved.
    loader: 'custom',
    loaderFile: './src/lib/imageLoader.ts',
    deviceSizes: [640, 960, 1280, 1920, 2560, 3840],
    imageSizes: [144, 384],
    localPatterns: [
      {
        pathname: '/media/**',
      },
      {
        pathname: '/api/media/file/**',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
