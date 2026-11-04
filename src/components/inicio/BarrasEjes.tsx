import { ejes } from "@/lib/ejes";

// Activity per axis: webinars + publications that carry each axis. A single series per row,
// labeled directly with its value, so color is never the only cue. Bars grow once as they scroll in.
export function BarrasEjes({ items }: { items: { ejes: string[] }[] }) {
  const filas = ejes.map((e) => ({ ...e, n: items.filter((i) => i.ejes.includes(e.slug)).length }));
  const max = Math.max(1, ...filas.map((f) => f.n));

  return (
    <dl className="space-y-5">
      {filas.map((f) => (
        <div key={f.slug} className="grid grid-cols-[1fr_auto] items-baseline gap-x-4 gap-y-2">
          <dt className="text-sm text-navy">{f.nombre}</dt>
          <dd className="tnum font-display text-2xl leading-none text-navy">{f.n}</dd>
          <dd className="col-span-2 h-1.5 overflow-hidden rounded-full bg-rule/70" aria-hidden>
            <span className="barra-eje block h-full origin-left rounded-full" style={{ width: `${(f.n / max) * 100}%`, background: f.color }} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
