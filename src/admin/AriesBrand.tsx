export const AriesIcon = () => (
  <span
    className="aries-brand__icon"
    aria-label="HSM Aries"
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      height: '26px',
      overflow: 'visible',
      paddingRight: '6px',
    }}
  >
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src="/media/aries-logo-white.png"
      alt="HSM Aries"
      width={120}
      height={26}
      style={{
        height: '26px',
        width: 'auto',
        maxWidth: '140px',
        objectFit: 'contain',
        display: 'block',
      }}
    />
  </span>
)

export const AriesLogo = () => (
  <span
    className="aries-brand"
    aria-label="HSM Aries Mission Control"
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      height: '32px',
      overflow: 'visible',
    }}
  >
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src="/media/aries-logo-white.png"
      alt="HSM Aries Mission Control"
      width={140}
      height={32}
      style={{
        height: '32px',
        width: 'auto',
        maxWidth: '160px',
        objectFit: 'contain',
        display: 'block',
      }}
    />
  </span>
)
