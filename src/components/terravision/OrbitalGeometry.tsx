/** Fine dotted/dashed orbital circles with measurement ticks; drawn in by GSAP. */
export function OrbitalGeometry() {
  const ticks = Array.from({ length: 72 }, (_, i) => i * 5);
  return (
    <svg className="tv-orbits" viewBox="-600 -600 1200 1200" aria-hidden>
      <circle className="tv-orbit" r="250" strokeDasharray="1 7" />
      <circle className="tv-orbit" r="330" strokeDasharray="14 10" />
      <circle className="tv-orbit tv-orbit-faint" r="420" />
      <circle className="tv-orbit" r="520" strokeDasharray="1 11" />
      <circle className="tv-orbit tv-orbit-faint" r="590" strokeDasharray="40 18" />
      <g className="tv-orbit-ticks">
        {ticks.map((a) => <line key={a} x1="0" y1={-420} x2="0" y2={a % 30 === 0 ? -436 : -427} transform={`rotate(${a})`} />)}
      </g>
      <g className="tv-orbit-marks">
        <circle cx="0" cy="-330" r="4" /><circle cx="368" cy="368" r="2.5" /><rect x="-524" y="-4" width="8" height="8" transform="rotate(45 -520 0)" />
        <line x1="-600" y1="0" x2="-540" y2="0" /><line x1="540" y1="0" x2="600" y2="0" />
        <text x="12" y="-338">R—330</text><text x="378" y="380">00°42′</text>
      </g>
    </svg>
  );
}
