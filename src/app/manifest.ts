import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: '#050809',
    description: 'HSM Aries space robotics at Hochschule Schmalkalden.',
    display: 'standalone',
    icons: [
      {
        src: '/media/cropped-falcon-1.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    name: 'HSM Aries',
    short_name: 'HSM Aries',
    start_url: '/',
    theme_color: '#ff4f1f',
  }
}
