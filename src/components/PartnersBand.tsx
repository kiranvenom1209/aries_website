import Image from 'next/image'

import { getSponsors } from '@/lib/sponsors'

type PartnersBandProps = {
  /** Mono eyebrow above the logo row; the home page passes its numbered section label. */
  label?: string
}

export async function PartnersBand({ label = 'PARTNERS / INDUSTRY AND ACADEMIC' }: PartnersBandProps = {}) {
  const partners = await getSponsors()

  return (
    <section className="partners-band">
      <div className="partners-band__inner">
        <span className="section-label partners-band__label">{label}</span>
        <div className="partners-band__row">
          {partners.map((partner) => (
            <a className={partner.name === 'Hochschule Schmalkalden' ? 'partner-logo-frame partner-logo-frame--university' : 'partner-logo-frame'} href={partner.website || undefined} key={partner.name} rel={partner.website ? 'noreferrer' : undefined} target={partner.website ? '_blank' : undefined}>
              <Image
                alt={partner.name}
                className={partner.name === 'Hochschule Schmalkalden' ? 'partner-logo partner-logo--university' : partner.name.includes('Boehm') ? 'partner-logo partner-logo--preserve-light' : 'partner-logo'}
                height={83}
                src={partner.logo}
                width={250}
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
