import Image from 'next/image'

const partners = [
  { name: 'SICK Sensor Intelligence', logo: '/media/sick-logo-1.png', width: 230, height: 58 },
  { name: 'Boehm Group GmbH', logo: '/media/boehm-logo-2.png', width: 240, height: 60 },
  { name: 'Skyforce Drone Solutions', logo: '/media/skyforce-logo.png', width: 240, height: 60 },
  { name: 'Eviotech', logo: '/media/eviotech-logo.jpg', width: 215, height: 52 },
  { name: 'Hochschule Schmalkalden', logo: '/media/hsm-powered-by.png', width: 250, height: 83, cropPoweredBy: true },
]

export function PartnersBand() {
  return (
    <section className="partners-band" style={{ padding: '92px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: '1540px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '46px' }}>
          Backed by industry leaders and academic pioneers
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(34px, 4vw, 70px)', flexWrap: 'wrap' }}>
          {partners.map((partner) => (
            <div className={partner.cropPoweredBy ? 'partner-logo-frame partner-logo-frame--university' : 'partner-logo-frame'} key={partner.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '92px', opacity: 0.78, transition: 'opacity 0.2s', filter: 'brightness(1.1)' }}>
              <Image
                alt={partner.name}
                className={partner.cropPoweredBy ? 'partner-logo partner-logo--university' : partner.logo.includes('boehm') ? 'partner-logo partner-logo--preserve-light' : 'partner-logo'}
                height={partner.height}
                src={partner.logo}
                style={{ objectFit: 'contain' }}
                width={partner.width}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
