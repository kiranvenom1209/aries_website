import { RoverTurntable } from './RoverTurntable'

export function RoverViewer() {
  return (
    <section className="rover-explorer" id="vehicle-architecture" aria-labelledby="vehicle-architecture-title">
      <div className="rover-explorer__header">
        <div>
          <p>Vehicle architecture // LEAP-One</p>
          <h2 id="vehicle-architecture-title">
            Six wheels, one&nbsp;arm,<br />
            <em>one drill.</em>
          </h2>
        </div>
        <p>
          LEAP-One integrates six-wheel mobility, autonomous navigation, precision manipulation
          and deep-sampling science on one research platform.
        </p>
      </div>

      <div className="rover-explorer__deck">
        <div className="rover-explorer__stage">
          <div className="rover-explorer__stage-rail" aria-hidden="true">
            <span>LEAP-ONE // COMPLETE VEHICLE</span>
            <i />
            <span>FULL 360° ORBIT</span>
          </div>
          <RoverTurntable />
        </div>

        <aside className="rover-explorer__console" aria-label="LEAP-One vehicle architecture">
          <div className="rover-explorer__readout">
            <p>System overview</p>
            <h3>Driven on the terrain.</h3>
            <p>
              The configuration that ran in Kraków: six BLDC hub wheels, a 6-DoF ReBeL arm and a
              530 mm auger, all on one 25.6 V bus.
            </p>
            <strong>ERC 2026 competition build</strong>
          </div>

          <dl className="rover-explorer__spec-list">
            <div>
              <dt>Mobility</dt>
              <dd>6× Botwheel BLDC + ODrive S1</dd>
            </div>
            <div>
              <dt>Energy</dt>
              <dd>1.5 kWh LiFePO₄</dd>
            </div>
            <div>
              <dt>Manipulation</dt>
              <dd>Igus ReBeL 6-DoF arm</dd>
            </div>
            <div>
              <dt>Science</dt>
              <dd>≥300 mm auger sampling</dd>
            </div>
          </dl>
        </aside>
      </div>

      <div className="rover-explorer__footer" aria-hidden="true">
        <span>LEAP ROVERS // PROJECT 01</span>
        <i />
        <span>COMPETED AT ERC 2026</span>
      </div>
    </section>
  )
}
