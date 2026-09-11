import Image from 'next/image'
import Link from 'next/link'

export function BrandLogo({
  className = '',
  priority = false,
}: {
  className?: string
  /** Load the wordmark eagerly (header, login). It never gets a preload hint: the hero must win that race. */
  priority?: boolean
}) {
  return (
    <Link aria-label="HSM Aries home" className={`brand-logo ${className}`} href="/">
      <Image
        alt="HSM Aries"
        className="brand-logo__image"
        height={38}
        loading={priority ? 'eager' : undefined}
        src="/media/aries-logo-white.png"
        width={145}
      />
    </Link>
  )
}
