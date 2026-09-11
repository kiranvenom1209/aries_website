import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: '#050809',
    description: 'HSM Aries space robotics at Hochschule Schmalkalden.',
    display: 'standalone',
    icons: [
      {
        src: '/apple-touch-icon-180.png',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/media/cropped-falcon-1.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    name: 'HSM Aries',
    short_name: 'HSM Aries',
    start_url: '/',
    theme_color: '#ff5a1f',
  }
}
