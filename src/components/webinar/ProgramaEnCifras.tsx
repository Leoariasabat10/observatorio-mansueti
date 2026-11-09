import type { WebinarResumen } from "@/lib/content";
import { paises } from "@/lib/paises";
import { MapaPonentes } from "@/components/mapa/MapaPonentes";
import { Contador } from "@/components/ui/Contador";
import { EjemploTag } from "./Etiquetas";

// Figures computed from the webinar files themselves, so they are exact by construction.
// Figures that need an outside source (sign-ups, attendance) stay "Dato pendiente" until the client provides them.
export function ProgramaEnCifras({ webinars }: { webinars: WebinarResumen[] }) {
  const ponentes = new Map(webinars.flatMap((w) => w.ponentes).map((p) => [p.nombre, p.pais]));
  const porPais = new Map<string, number>();
  for (const pais of ponentes.values()) porPais.set(pais, (porPais.get(pais) ?? 0) + 1);
  const conteo = [...porPais].map(([codigo, n]) => ({ codigo, ponentes: n })).sort((a, b) => b.ponentes - a.ponentes);
  const horas = Math.round(webinars.reduce((s, w) => s + w.duracionMin, 0) / 60);
  const ejemplo = webinars.some((w) => w.ejemplo);

  const cifras = [
    { label: "Webinars en el programa", valor: webinars.length },
    { label: "Ponentes", valor: ponentes.size },
    { label: "Países de los ponentes", valor: porPais.size },
    { label: "Horas académicas", valor: horas },
    { label: "Personas inscritas", valor: null },
    { label: "Países de los asistentes", valor: null },
  ];

  return (
    <section aria-labelledby="cifras-titulo" className="diferido graticula border-y border-rule bg-paper">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 py-16 sm:py-20 lg:grid-cols-12 lg:gap-12 lg:px-8">
        <div className="lg:col-span-6">
          <p className="eyebrow text-blue">El programa en cifras</p>
          <h2 id="cifras-titulo" className="titular mt-4 max-w-md font-display text-[clamp(2rem,3.6vw,2.9rem)] leading-[1.05] text-navy">
            Ponentes de toda la región, una cita desde Colombia
          </h2>
          <p className="mt-5 max-w-md text-muted">
            Las cuatro primeras cifras se calculan con los webinars publicados en este sitio. Las otras dos llegarán con los registros de inscripción.
          </p>
          {ejemplo && <EjemploTag className="mt-4" />}

          <dl className="revelar-hijos mt-10 grid grid-cols-2 border-t border-rule">
            {cifras.map((c, i) => (
              <div key={c.label} className={`flex flex-col-reverse gap-2 border-b border-rule py-6 ${i % 2 ? "pl-6" : "pr-6"}`}>
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
            <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm text-muted sm:grid-cols-3">
              {conteo.map((c) => (
                <li key={c.codigo} className="flex justify-between gap-3 border-b border-rule/70 py-1">
                  <span>{paises[c.codigo]?.nombre}</span>
                  <span className="tnum font-semibold text-navy">{c.ponentes}</span>
                </li>
              ))}
            </ul>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
