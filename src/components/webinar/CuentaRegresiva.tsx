import { restante } from "@/lib/webinar-time";
import { Odometro } from "@/components/ui/Odometro";

// Minutes resolution on purpose: a ticking seconds counter is motion nobody asked for.
// Digits roll when the minute changes (and once when the browser clock replaces the build time).
export function CuentaRegresiva({ start, now }: { start: number; now: number }) {
  const r = restante(start, now);
  const partes = [
    { v: r.dias, l: r.dias === 1 ? "día" : "días", min: 1 },
    { v: r.horas, l: r.horas === 1 ? "hora" : "horas", min: 2 },
    { v: r.minutos, l: r.minutos === 1 ? "minuto" : "minutos", min: 2 },
  ];
  return (
    <div role="timer" aria-label={`Faltan ${partes.map((p) => `${p.v} ${p.l}`).join(", ")}`}>
      <dl className="flex items-end gap-7 sm:gap-10" aria-hidden>
        {partes.map((p) => (
          <div key={p.l} className="flex flex-col-reverse">
            <dt className="mt-3 text-xs font-medium tracking-wide text-paper/70">{p.l}</dt>
            <dd className="font-display text-[clamp(3.25rem,7.5vw,5.5rem)] leading-[0.8] font-medium text-gold">
              <Odometro valor={p.v} minimo={p.min} />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
