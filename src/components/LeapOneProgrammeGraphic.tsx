// A compact version of LEAP-One's side elevation for the programme-map icon set.
// The card shares its stroke, fill and accent tokens with the other programme diagrams.
export function LeapOneProgrammeGraphic() {
  return (
    <>
      <path className="programme-line programme-line--muted" d="M28 161H292" />
      <path className="programme-scan" d="M154 35H278" />
      <g className="programme-leap-rover" transform="translate(35 3) scale(.25)">
        <g transform="translate(1000 0) scale(-1 1)">
          <path className="programme-line programme-leap-rover__panel" d="M324 384H625V478H324ZM329 454H625M372 485H625V500H372Z" />
          <path className="programme-line programme-line--muted" d="M337 396H614M336 467H615" />
          <path className="programme-line programme-leap-rover__panel" d="M326 328H425V382H326ZM335 317H386V328M431 310H510V382H431ZM529 336H600L607 378H525Z" />
          <path className="programme-line" d="M299 338H326M302 349H322" />

          {/* Rear drill gantry, its motor, and the new bottom support. */}
          <path className="programme-line programme-leap-rover__panel" d="M736 101H859V514H736ZM773 22H806V101H773Z" />
          <path className="programme-line programme-line--accent" d="M744 107V505H852V107M607 377H736M627 512H859" />
          <path className="programme-line programme-line--muted" d="M785 113V457M799 113V457M764 469H819V493H764Z" />

          {/* Sensor mast and stack light. */}
          <path className="programme-line programme-leap-rover__panel" d="M532 65H570V372H532ZM609 40H635V149H609Z" />
          <path className="programme-line" d="M566 240H582L604 159H635M611 77H633M611 111H633" />
          <path className="programme-line programme-line--accent" d="M615 133H629" />

          {/* Rounded ReBeL joints, orange collars, and downward-facing gripper. */}
          <path className="programme-line programme-leap-rover__panel" d="M417 310V274Q406 262 407 241L412 207Q414 190 433 182L398 173L373 168L320 165L282 190L240 217L198 241V302H151V248Q138 230 156 216L194 196L224 165L263 139L298 120Q298 107 319 109L365 112Q393 115 414 140L442 179Q471 180 478 210L480 242Q479 262 470 274V310Z" />
          <path className="programme-line programme-line--muted" d="M419 229Q417 199 442 196Q467 197 469 224M307 128Q307 153 329 155M359 117L356 163" />
          <path className="programme-line programme-line--accent" d="M419 298H475M261 145L282 183M394 175L427 164M154 270H195M154 293H195" />
          <path className="programme-line" d="M146 307H199V319H146ZM170 320H184V385L193 407L184 431H167L177 407L166 385M183 334H203" />
          <path className="programme-line programme-leap-rover__panel" d="M414 312H481V328H414Z" />

          {/* Rocker-bogie links connect to the three visible wheel hubs. */}
          <path className="programme-line" d="M339 564L408 485L476 466L516 565L592 466L668 565M454 452L476 406L498 452M482 406H660" />
          <circle className="programme-wheel" cx="476" cy="406" r="9" />
        </g>
        {[332, 484, 661].map((x) => (
          <g key={x} transform={`translate(${x} 565)`}>
            <circle className="programme-wheel" r="65" />
            <circle className="programme-line programme-line--muted" r="48" />
            {[0, 60, 120, 180, 240, 300].map((angle) => (
              <path key={angle} className="programme-line programme-line--muted" transform={`rotate(${angle})`} d="M0-44V-23M-7-63L0-57L7-63" />
            ))}
            <circle className="programme-leap-rover__hub" r="13" />
          </g>
        ))}
      </g>
    </>
  )
}
