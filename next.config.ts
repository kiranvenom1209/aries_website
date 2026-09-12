import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

import { newsSeed } from './src/seed/news'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
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
  async redirects() {
    return newsSeed.map((article) => ({
      destination: `/news/${article.slug}`,
      permanent: true,
      source: `/${article.slug}`,
    }))
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
