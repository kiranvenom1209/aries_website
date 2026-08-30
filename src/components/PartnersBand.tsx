import Image from 'next/image'

import { getSponsors } from '@/lib/sponsors'

export async function PartnersBand() {
  const partners = await getSponsors()

  return (
    <section className="partners-band" style={{ padding: '92px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: '1540px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '46px' }}>
          Backed by industry leaders and academic pioneers
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(34px, 4vw, 70px)', flexWrap: 'wrap' }}>
          {partners.map((partner) => (
            <a className={partner.name === 'Hochschule Schmalkalden' ? 'partner-logo-frame partner-logo-frame--university' : 'partner-logo-frame'} href={partner.website || undefined} key={partner.name} rel={partner.website ? 'noreferrer' : undefined} target={partner.website ? '_blank' : undefined} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '92px', opacity: 0.78, transition: 'opacity 0.2s', filter: 'brightness(1.1)' }}>
              <Image
                alt={partner.name}
                className={partner.name === 'Hochschule Schmalkalden' ? 'partner-logo partner-logo--university' : partner.name.includes('Boehm') ? 'partner-logo partner-logo--preserve-light' : 'partner-logo'}
                height={83}
                src={partner.logo}
                style={{ objectFit: 'contain' }}
                width={250}
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
