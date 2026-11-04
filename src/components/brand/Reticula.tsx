// Telescope sight: the observatory "looking at" the next event. Built from the emblem's ellipse
// (gold arc over a blue arc) and a graduated crosshair. Purely decorative.
export function Reticula({ className = "" }: { className?: string }) {
  const ticks = Array.from({ length: 72 }, (_, i) => i * 5);
  return (
    <svg viewBox="-300 -300 600 600" className={className} aria-hidden fill="none">
      <circle r="292" stroke="rgb(255 255 255 / .08)" />
      <circle r="220" stroke="rgb(255 255 255 / .1)" />
      <circle r="140" stroke="rgb(255 255 255 / .12)" strokeDasharray="2 6" />
      <circle r="60" stroke="rgb(252 200 51 / .35)" />
      <g className="reticula-giro">
      {ticks.map((a) => (
        <line
          key={a}
          x1="0"
          y1={-292}
          x2="0"
          y2={a % 30 === 0 ? -272 : -284}
          stroke={a % 30 === 0 ? "rgb(252 200 51 / .55)" : "rgb(255 255 255 / .18)"}
          transform={`rotate(${a})`}
        />
      ))}
      </g>
      <path d="M-300 0H-72M72 0H300M0 -300V-72M0 72V300" stroke="rgb(255 255 255 / .14)" />
      {/* Arcs of the logo ellipse */}
      <path d="M-250 -60 A260 150 -12 0 1 240 -110" stroke="#FCC833" strokeOpacity=".7" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M-240 90 A270 150 -12 0 0 260 40" stroke="#1870C7" strokeOpacity=".8" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
