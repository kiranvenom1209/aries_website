'use client'

import manifest from './responsive-manifest.json'

/**
 * Custom `next/image` loader for the static photo library.
 *
 * `scripts/build-responsive-media.mjs` writes WebP variants of every referenced
 * `/media/<file>.(jpg|jpeg|png)` to `/media/r/<stem>-<width>.webp` and records
 * the available widths in `responsive-manifest.json`. For those files this
 * loader picks the smallest variant at least as wide as the requested width
 * (or the largest one when nothing is wide enough), so `next/image` emits a
 * real srcset while everything stays a plain static file on the CDN.
 *
 * Anything else — CMS uploads under `/api/media/file/…`, SVGs, external URLs,
 * files in sub-folders — is returned unchanged.
 */
const MEDIA_PREFIX = '/media/'
const variants: Record<string, number[] | undefined> = manifest

export default function imageLoader({ src, width }: { src: string; width: number }): string {
  if (!src.startsWith(MEDIA_PREFIX)) return src

  const [file] = src.slice(MEDIA_PREFIX.length).split(/[?#]/, 1)
  if (!file || file.includes('/')) return src

  const widths = variants[file]
  if (!widths || widths.length === 0) return src

  const chosen = widths.find((candidate) => candidate >= width) ?? widths[widths.length - 1]
  const stem = file.replace(/\.[^.]+$/, '')
  return `${MEDIA_PREFIX}r/${stem}-${chosen}.webp`
}
