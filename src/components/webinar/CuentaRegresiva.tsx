import { restante } from "@/lib/webinar-time";

// Minutes resolution on purpose: a ticking seconds counter is motion nobody asked for.
// Rendered by client parents that own the clock (useAhora).
export function CuentaRegresiva({ start, now }: { start: number; now: number }) {
  const r = restante(start, now);
  const partes = [
    { v: r.dias, l: r.dias === 1 ? "día" : "días" },
    { v: r.horas, l: r.horas === 1 ? "hora" : "horas" },
    { v: r.minutos, l: r.minutos === 1 ? "minuto" : "minutos" },
  ];
  return (
    <div role="timer" aria-label={`Faltan ${partes.map((p) => `${p.v} ${p.l}`).join(", ")}`}>
      <dl className="flex items-end gap-6 sm:gap-9" aria-hidden>
        {partes.map((p, i) => (
          <div key={p.l} className="flex flex-col-reverse">
            <dt className="mt-2 text-xs font-medium text-paper/70">{p.l}</dt>
            <dd className="tnum font-display text-[clamp(3rem,7vw,4.75rem)] leading-[0.82] text-gold">
              {i === 0 ? p.v : String(p.v).padStart(2, "0")}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
