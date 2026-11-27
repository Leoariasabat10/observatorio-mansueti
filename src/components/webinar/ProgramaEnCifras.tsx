import type { WebinarResumen } from "@/lib/content";
import { esModeracion } from "@/lib/webinar-time";
import { paises } from "@/lib/paises";
import { MapaPonentes } from "@/components/mapa/MapaPonentes";
import { Contador } from "@/components/ui/Contador";
import { EjemploTag } from "./Etiquetas";

// Figures computed from the webinar files themselves, so they are exact by construction.
// Moderators are not counted as speakers.
export function ProgramaEnCifras({ webinars }: { webinars: WebinarResumen[] }) {
  const ponentes = new Map(webinars.flatMap((w) => w.ponentes.filter((p) => !esModeracion(p))).map((p) => [p.nombre, p.pais]));
  const porPais = new Map<string, number>();
  for (const pais of ponentes.values()) porPais.set(pais, (porPais.get(pais) ?? 0) + 1);
  const conteo = [...porPais].map(([codigo, n]) => ({ codigo, ponentes: n })).sort((a, b) => b.ponentes - a.ponentes);
  const horas = Math.round(webinars.reduce((s, w) => s + w.duracionMin, 0) / 60);
  const ejemplo = webinars.some((w) => w.ejemplo);

  // With a single session, "1 sesión" undersells the program: the regional reach leads instead.
  const cifras = [
    ...(webinars.length > 1 ? [{ label: "Sesiones en el programa", valor: webinars.length }] : []),
    { label: "Ponentes", valor: ponentes.size },
    { label: "Países de los ponentes", valor: porPais.size },
    { label: "Horas programadas", valor: horas },
  ];
  const unoPorPais = conteo.every((c) => c.ponentes === 1);

  return (
    <section aria-labelledby="cifras-titulo" className="diferido graticula border-y border-rule bg-paper">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 py-16 sm:py-20 lg:grid-cols-12 lg:gap-12 lg:px-8">
        <div className="lg:col-span-6">
          <p className="eyebrow text-blue">El programa en cifras</p>
          <h2 id="cifras-titulo" className="titular mt-4 max-w-md font-display text-[clamp(2rem,3.6vw,2.9rem)] leading-[1.05] text-navy">
            Ponentes de toda la región, una cita desde Colombia
          </h2>
          <p className="mt-5 max-w-md text-muted">
            Cifras calculadas con las sesiones publicadas en este sitio. Las moderadoras no se cuentan como ponentes.
          </p>
          {ejemplo && <EjemploTag className="mt-4" />}

          <dl className={`revelar-hijos mt-10 grid border-t border-rule ${cifras.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
            {cifras.map((c, i) => (
              <div key={c.label} className={`flex flex-col-reverse gap-2 border-b border-rule py-6 ${i % (cifras.length === 3 ? 3 : 2) ? "pl-5" : "pr-5"}`}>
                <dt className="text-sm text-muted">{c.label}</dt>
                <dd className="font-display text-[clamp(2.75rem,5vw,4rem)] leading-[0.85] text-navy">
                  {c.valor == null ? (
                    <span className="inline-block rounded-sm border border-dashed border-muted/50 px-2 py-1 font-sans text-xs font-semibold text-muted">
                      Dato pendiente
                    </span>
                  ) : (
                    <Contador valor={c.valor} />
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <figure className="revelar lg:col-span-6">
          <div className="rounded-sm border border-rule bg-card p-4 sm:p-6">
            <MapaPonentes conteo={conteo} />
          </div>
          <figcaption className="mt-5">
            <p className="text-sm font-semibold text-navy">Desde dónde participan los ponentes</p>
            {unoPorPais ? (
              <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted">
                Un ponente por país: {conteo.map((c) => paises[c.codigo]?.nombre).sort((a, b) => (a ?? "").localeCompare(b ?? "", "es")).join(", ")}.
              </p>
            ) : (
              <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm text-muted sm:grid-cols-3">
                {conteo.map((c) => (
                  <li key={c.codigo} className="flex justify-between gap-3 border-b border-rule/70 py-1">
                    <span>{paises[c.codigo]?.nombre}</span>
                    <span className="tnum font-semibold text-navy">{c.ponentes}</span>
                  </li>
                ))}
              </ul>
            )}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
