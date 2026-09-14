import type { Metadata } from 'next'

import FrontendLayout from './(frontend)/layout'
import NotFound from './(frontend)/not-found'

export { viewport } from './(frontend)/layout'

export const metadata: Metadata = {
  title: 'Connection lost — HSM Aries',
  description: 'This address is off the map. Return to base with HSM Aries.',
  robots: { index: false, follow: false },
}

// Multiple root layouts need an explicit global fallback. Reuse the full public
// document and design so the production /404 artifact matches missing routes.
export default function GlobalNotFound() {
  return (
    <FrontendLayout>
      <NotFound />
    </FrontendLayout>
  )
}
