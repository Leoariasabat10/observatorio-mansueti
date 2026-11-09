import { CAPITALES, GLOBO, globo } from "@/lib/globo";
import { GloboBase } from "./GloboBase";

// The home page's one signature moment: routes drawn from Bogotá to every South American capital.
// Base layer (sphere + ~2,000 dots) is /globo-base.svg, injected inline after load (see GloboBase);
// the routes and labels on top are a light inline SVG, animated once with CSS (off under reduced motion).
export function Globo({ className = "" }: { className?: string }) {
  const g = globo();
  const [ox, oy] = g.origen;

  return (
    <figure className={`relative aspect-square ${className}`}>
      <GloboBase />
      <svg viewBox={`0 0 ${GLOBO} ${GLOBO}`} className="relative size-full" role="img" aria-labelledby="globo-desc">
        <desc id="globo-desc">
          Sudamérica vista desde el Observatorio: globo con el continente dibujado en puntos y líneas que parten de Colombia hacia{" "}
          {CAPITALES.map((k) => k.ciudad).join(", ")}.
        </desc>
        <g fill="none" stroke="#FCC833" strokeWidth="1.1" strokeLinecap="round">
          {g.rutas.map((r, i) => (
            <path key={r.pais} d={r.d} pathLength={1} className="rumbo" style={{ "--i": i } as React.CSSProperties} strokeOpacity="0.8" />
          ))}
        </g>
        {g.rutas.map((r, i) => (
          <circle key={r.pais} cx={r.xy[0]} cy={r.xy[1]} r="2.4" fill="#ffffff" className="rumbo-fin" style={{ "--i": i } as React.CSSProperties} />
        ))}
        <circle cx={ox} cy={oy} r="12" fill="none" stroke="#FCC833" strokeOpacity="0.6" />
        <circle cx={ox} cy={oy} r="4" fill="#FCC833" />
        <text x={ox - 18} y={oy - 16} textAnchor="end" className="fill-paper text-[13px] font-semibold">
          Colombia
        </text>
      </svg>
    </figure>
  );
}
