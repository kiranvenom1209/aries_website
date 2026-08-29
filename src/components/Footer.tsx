import Image from 'next/image'
import Link from 'next/link'

import { BrandLogo } from './BrandLogo'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__grid">
          {/* Column 1: Brand & Mission */}
          <div className="site-footer__col site-footer__col--brand">
            <BrandLogo />
            <p className="site-footer__mission">
              HSM Aries is the space robotics initiative of the Chair of Drive, Automation, and Robotics Technologies at Hochschule Schmalkalden.
            </p>
            <div className="site-footer__status">
              <span className="status-dot" />
              <span>ERC 2026 QUALIFIED · #1 WORLDWIDE</span>
            </div>
          </div>

          {/* Column 2: University Partner */}
          <div className="site-footer__col site-footer__col--partner">
            <span className="site-footer__heading">INSTITUTIONAL PARTNER</span>
            <div className="site-footer__university">
              <Image
                alt="Hochschule Schmalkalden University of Applied Sciences"
                height={70}
                src="/media/hsm-powered-by.png"
                width={220}
              />
            </div>
            <p className="site-footer__subtext">
              Chair of Drive, Automation, and Robotics Technologies · Hochschule Schmalkalden
            </p>
          </div>

          {/* Column 3: Mission Directory */}
          <div className="site-footer__col">
            <span className="site-footer__heading">MISSION DIRECTORY</span>
            <nav aria-label="Footer primary navigation" className="site-footer__nav">
              <Link href="/about">About HSM Aries</Link>
              <Link href="/leap-one">LEAP-One / LEAP Series</Link>
              <Link href="/team">Engineering Crew</Link>
              <Link href="/news">Mission Dispatches</Link>
              <Link href="/gallery">Field Gallery</Link>
            </nav>
          </div>

          {/* Column 4: Connect & Portal */}
          <div className="site-footer__col">
            <span className="site-footer__heading">CONNECT &amp; PORTAL</span>
            <nav aria-label="Footer portal navigation" className="site-footer__nav">
              <Link href="/join">Join the Crew</Link>
              <Link href="/partner">Partner / Sponsor</Link>
              <Link href="/contact">General Contact</Link>
              <Link href="/login">Mission Control Login</Link>
            </nav>
            <div className="site-footer__social-links">
              <a
                aria-label="HSM Aries on LinkedIn"
                className="site-footer__social-btn"
                href="https://www.linkedin.com/company/aries-space"
                rel="noreferrer"
                target="_blank"
              >
                <svg fill="currentColor" height="16" viewBox="0 0 24 24" width="16">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.65 1.65 0 0 0-1.66 1.66 1.66 1.66 0 0 0 1.66 1.66 1.66 1.66 0 0 0 1.66-1.66Z" />
                </svg>
              </a>
              <a
                aria-label="HSM Aries on YouTube"
                className="site-footer__social-btn"
                href="https://www.youtube.com/watch?v=FoB0QA2CAig"
                rel="noreferrer"
                target="_blank"
              >
                <svg fill="currentColor" height="16" viewBox="0 0 24 24" width="16">
                  <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73Z" />
                </svg>
              </a>
              <a
                aria-label="HSM Aries on GitHub"
                className="site-footer__social-btn"
                href="https://github.com/kiranvenom1209/LeapOne_rover"
                rel="noreferrer"
                target="_blank"
              >
                <svg fill="currentColor" height="16" viewBox="0 0 24 24" width="16">
                  <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Metadata Rail */}
        <div className="site-footer__bottom">
          <p>© {new Date().getFullYear()} HSM ARIES SPACE INITIATIVE · HOCHSCHULE SCHMALKALDEN</p>
          <p className="site-footer__tagline">SPACE ROBOTICS // LEAP SERIES</p>
        </div>
      </div>
    </footer>
  )
}
