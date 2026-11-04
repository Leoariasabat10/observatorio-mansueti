import Link from "next/link";
import { indicators, observatorio } from "@/config/observatorio";
import { ejes } from "@/lib/ejes";
import { Mark } from "@/components/brand/Mark";

export function Hero() {
  return (
    <>
      <section aria-labelledby="hero-title" className="bg-card">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 pt-12 pb-14 sm:pt-16 lg:grid-cols-12 lg:items-center lg:gap-12 lg:px-8 lg:py-20">
          <div className="rise lg:col-span-7">
            <p className="flex items-center gap-3 text-sm font-semibold text-blue">
              <span aria-hidden className="h-0.5 w-10 bg-gold" />
              {observatorio.shortName}
            </p>
            <h1
              id="hero-title"
              className="mt-6 font-serif text-[clamp(2.4rem,5.2vw,4.4rem)] leading-[1.04] font-medium tracking-[-0.02em] text-balance text-navy"
            >
              Derecho del Trabajo y de la Seguridad Social, estudiado desde Sudamérica.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              {observatorio.mission} Webinars, publicaciones y análisis con la memoria de {observatorio.honoree}.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/programa-academico"
                className="inline-flex items-center justify-center rounded-sm bg-navy px-6 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue"
              >
                Ver programa académico
              </Link>
              <Link
                href="/publicaciones"
                className="inline-flex items-center justify-center rounded-sm border border-navy/25 px-6 py-3.5 text-sm font-semibold text-navy transition-colors duration-200 hover:border-navy"
              >
                Publicaciones y boletines
              </Link>
            </div>
          </div>

          <div className="rise order-first mx-auto w-full max-w-[19rem] [animation-delay:120ms] sm:max-w-sm lg:order-none lg:col-span-5 lg:max-w-none">
            <Mark className="h-auto w-full" priority large />
          </div>
        </div>
      </section>

      <section aria-label="Indicadores del Observatorio" className="bg-navy text-paper">
        <dl className="mx-auto grid max-w-7xl divide-y divide-paper/10 px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:px-8">
          {indicators.map((d) => (
            <div key={d.label} className="flex flex-col-reverse gap-2 py-7 sm:px-6 sm:first:pl-0">
              <dt className="text-sm text-paper/75">{d.label}</dt>
              <dd>
                {d.value ? (
                  <>
                    <span className="font-serif text-5xl text-gold tabular-nums">{d.value}</span>
                    <span className="ml-3 text-xs text-paper/60">Fuente: {d.source}</span>
                  </>
                ) : (
                  <span className="inline-block border border-gold/60 px-2 py-1 text-xs font-semibold text-gold">Dato pendiente</span>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="lineas-title" className="bg-card">
        <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
          <h2 id="lineas-title" className="eyebrow text-muted">
            Ejes temáticos
          </h2>
          <ol className="mt-6 grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
            {ejes.map((l) => (
              <li key={l.slug} className="bg-card">
                <Link href={`/programa-academico?eje=${l.slug}`} className="group flex h-full flex-col gap-8 p-6 transition-colors hover:bg-paper">
                  <span aria-hidden className="size-2.5 rounded-full" style={{ background: l.color }} />
                  <span className="flex items-end justify-between gap-4">
                    <span className="font-serif text-2xl leading-tight text-navy">{l.nombre}</span>
                    <span aria-hidden className="text-blue transition-transform duration-200 group-hover:translate-x-1">→</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
