import Link from 'next/link'

export const DashboardIntro = () => (
  <section className="aries-command-intro" aria-labelledby="aries-command-title">
    <div className="aries-command-intro__main">
      <div className="aries-command-intro__eyebrow">
        <span className="live-pulse" aria-hidden="true" />
        <span>MISSION CONTROL // CHAIR OF DRIVE, AUTOMATION, AND ROBOTICS TECHNOLOGIES</span>
        <span className="erc-badge">ERC 2026 QUALIFIED #1 (239.75 PTS)</span>
      </div>

      <h1 id="aries-command-title">Content Command Center</h1>
      
      <p className="aries-command-intro__desc">
        Operational hub for HSM Aries Space Robotics. Publish planetary mission dispatches, manage LEAP-One field imagery, maintain the 25-member engineering crew roster, and supervise technical qualification dossiers.
      </p>

      {/* Quick Mission Actions Rail */}
      <div className="aries-command-quick-actions">
        <a href="/" target="_blank" rel="noopener noreferrer" className="aries-quick-btn aries-quick-btn--live">
          <span>🌐</span> View Live Website ↗
        </a>
        <Link href="/admin/collections/news/create" className="aries-quick-btn">
          <span>📰</span> + New Mission Dispatch
        </Link>
        <Link href="/admin/collections/media/create" className="aries-quick-btn">
          <span>📷</span> + Upload Media Asset
        </Link>
        <Link href="/admin/collections/team/create" className="aries-quick-btn">
          <span>🧑‍🚀</span> + Add Crew Member
        </Link>
        <Link href="/admin/collections/gallery/create" className="aries-quick-btn">
          <span>🖼️</span> + New Field Gallery
        </Link>
      </div>
    </div>

    {/* Right Telemetry Telemetry Block */}
    <div className="aries-command-intro__sidebar">
      <div className="aries-command-intro__telemetry" aria-label="System status: online">
        <span className="telemetry-dot" aria-hidden="true" />
        <div>
          <strong>CMS OPERATIONAL</strong>
          <small>LATENCY: 12ms · SSR READY</small>
        </div>
      </div>

      <div className="aries-command-metrics-grid">
        <div className="aries-metric-pill">
          <span className="metric-label">ENGINEERING CREW</span>
          <strong className="metric-val">25 ACTIVE</strong>
          <span className="metric-sub">8 Technical Divisions</span>
        </div>
        <div className="aries-metric-pill">
          <span className="metric-label">MISSION PLATFORM</span>
          <strong className="metric-val">LEAP-ONE</strong>
          <span className="metric-sub">Project 01 · 6WD Rover</span>
        </div>
      </div>
    </div>
  </section>
)
