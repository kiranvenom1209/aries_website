import Image from 'next/image'
import Link from 'next/link'

export function BrandLogo({
  className = '',
  priority = false,
}: {
  className?: string
  priority?: boolean
}) {
  return (
    <Link aria-label="HSM Aries home" className={`brand-logo ${className}`} href="/">
      <Image
        alt="HSM Aries"
        className="brand-logo__image"
        height={38}
        priority={priority}
        src="/media/aries-logo-white.png"
        width={145}
      />
    </Link>
  )
}
