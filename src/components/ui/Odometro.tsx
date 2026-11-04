// Rolling digits: each digit is a 0–9 column moved with a CSS transform, so a change rolls into place.
// Pure CSS (no library); the transition is off under reduced motion. Only for real values.
export function Odometro({ valor, minimo = 1, className = "" }: { valor: number; minimo?: number; className?: string }) {
  const digitos = String(Math.max(0, Math.floor(valor))).padStart(minimo, "0").split("");
  return (
    <span className={`odometro inline-flex tnum ${className}`} aria-label={String(valor)} role="img">
      {digitos.map((d, i) => (
        <span key={digitos.length - i} className="odometro-ventana" aria-hidden>
          <span className="odometro-columna" style={{ transform: `translateY(-${Number(d) * 10}%)` }}>
            {"0123456789".split("").map((n) => (
              <span key={n}>{n}</span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}
