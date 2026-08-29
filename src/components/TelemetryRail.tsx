export function TelemetryRail() {
  return (
    <div aria-hidden="true" className="telemetry-rail">
      <div className="telemetry-rail__left">
        <span>60</span>
        <span>40</span>
        <span className="active">20</span>
        <span>00</span>
      </div>
      <div className="telemetry-rail__right">
        <span>50° 34′ N</span>
        <span>10° 21′ E</span>
        <span>428 M</span>
        <span className="active">0.998 AU</span>
      </div>
    </div>
  )
}

