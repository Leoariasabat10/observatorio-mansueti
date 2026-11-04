import { CAPITALES, GLOBO, globo } from "@/lib/globo";

// The home page's one signature moment: routes drawn from Bogotá to every South American capital.
// Static SVG generated at build; the only motion is the one-time route drawing (CSS, off under reduced motion).
export function Globo({ className = "" }: { className?: string }) {
  const g = globo();
  const c = GLOBO / 2;
  const ticks = Array.from({ length: 120 }, (_, i) => i * 3);

  return (
    <svg viewBox={`0 0 ${GLOBO} ${GLOBO}`} className={className} role="img" aria-labelledby="globo-titulo globo-desc">
      <title id="globo-titulo">Sudamérica vista desde el Observatorio</title>
      <desc id="globo-desc">
        Globo terrestre con Sudamérica dibujada en puntos. Desde Bogotá (4°36′ N, 74°04′ O), sede del Observatorio, parten líneas hacia{" "}
        {CAPITALES.map((k) => k.ciudad).join(", ")}.
      </desc>
      <defs>
        <radialGradient id="globo-luz" cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#123a9c" stopOpacity="0.55" />
          <stop offset="0.6" stopColor="#062265" stopOpacity="0.25" />
          <stop offset="1" stopColor="#03174a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Graduated ring: the telescope's field of view */}
      <g stroke="#ffffff" strokeOpacity="0.16">
        {ticks.map((a) => (
          <line key={a} x1={c} y1={c - 318} x2={c} y2={c - (a % 30 === 0 ? 306 : 312)} transform={`rotate(${a} ${c} ${c})`} strokeOpacity={a % 30 === 0 ? 0.4 : 0.16} />
        ))}
      </g>

      <path d={g.esfera} fill="url(#globo-luz)" stroke="#9cc9f5" strokeOpacity="0.35" />
      <path d={g.graticula} fill="none" stroke="#9cc9f5" strokeOpacity="0.1" />
      <path d={g.resto} fill="#9cc9f5" fillOpacity="0.16" />
      <path d={g.sud} fill="#9cc9f5" fillOpacity="0.62" />

      <g fill="none" stroke="#FCC833" strokeWidth="1.1" strokeLinecap="round">
        {g.rutas.map((r, i) => (
          <path key={r.pais} d={r.d} pathLength={1} className="rumbo" style={{ "--i": i } as React.CSSProperties} strokeOpacity="0.8" />
        ))}
      </g>
      {g.rutas.map((r, i) => (
        <circle key={r.pais} cx={r.xy[0]} cy={r.xy[1]} r="2.4" fill="#ffffff" className="rumbo-fin" style={{ "--i": i } as React.CSSProperties} />
      ))}

      <circle cx={g.origen[0]} cy={g.origen[1]} r="12" fill="none" stroke="#FCC833" strokeOpacity="0.6" />
      <circle cx={g.origen[0]} cy={g.origen[1]} r="4" fill="#FCC833" />
      <text x={g.origen[0] - 18} y={g.origen[1] - 16} textAnchor="end" className="fill-paper text-[13px] font-semibold">
        Bogotá
      </text>
      <text x={g.origen[0] - 18} y={g.origen[1] - 2} textAnchor="end" className="fill-paper/60 text-[10.5px]" style={{ fontVariantNumeric: "tabular-nums" }}>
        4°36′ N, 74°04′ O
      </text>
    </svg>
  );
}
