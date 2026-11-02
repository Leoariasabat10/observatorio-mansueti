import Link from "next/link";
import { indicators, observatorio, researchLines } from "@/config/observatorio";

export function Hero() {
  return (
    <>
      <section aria-labelledby="hero-title" className="border-b border-rule">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 sm:py-20 lg:grid-cols-12 lg:items-end lg:gap-10 lg:px-8 lg:py-24">
          <div className="rise lg:col-span-7">
            <p className="eyebrow flex items-center gap-3 text-teal-ink">
              <span aria-hidden className="size-2 bg-amber" />
              {observatorio.shortName}
            </p>
            <h1
              id="hero-title"
              className="mt-6 font-serif text-[clamp(2.4rem,5.4vw,4.6rem)] leading-[1.02] font-medium tracking-[-0.02em] text-balance text-slate"
            >
              Investigación y datos para el debate laboral.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              {observatorio.mission} Documentos de trabajo, análisis de jurisprudencia e intervenciones en política pública.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/documentos"
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-teal-ink px-6 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-slate"
              >
                Documentos de trabajo <span aria-hidden>→</span>
              </Link>
              <Link
                href="/datos"
                className="inline-flex items-center justify-center rounded-sm border border-slate/25 px-6 py-3.5 text-sm font-semibold text-slate transition-colors duration-200 hover:border-slate"
              >
                Explorar datos laborales
              </Link>
            </div>
          </div>

          <aside aria-label="Indicadores del Observatorio" className="rise bg-slate p-6 text-paper [animation-delay:120ms] sm:p-8 lg:col-span-5">
            <div className="flex items-baseline justify-between gap-4 border-b border-paper/15 pb-4">
              <h2 className="eyebrow text-paper">Indicadores</h2>
              <span className="eyebrow text-[0.625rem] text-paper/55">Fuente y fecha por dato</span>
            </div>
            <dl className="divide-y divide-paper/10">
              {indicators.map((d) => (
                <div key={d.label} className="flex items-end justify-between gap-6 py-5">
                  <dt className="max-w-[14rem] text-sm text-paper/75">{d.label}</dt>
                  <dd className="text-right">
                    {d.value ? (
                      <>
                        <span className="block font-serif text-4xl tabular-nums">{d.value}</span>
                        <span className="text-[0.7rem] text-paper/50">{d.source}</span>
                      </>
                    ) : (
                      <span className="inline-block border border-amber/60 px-2 py-1 text-[0.7rem] font-semibold tracking-wide text-amber">
                        Datos pendientes
                      </span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      <section aria-labelledby="lineas-title" className="bg-card">
        <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
          <h2 id="lineas-title" className="eyebrow text-muted">
            Líneas de investigación
          </h2>
          <ol className="mt-6 grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
            {researchLines.map((l, i) => (
              <li key={l.slug} className="bg-card">
                <Link href={`/investigacion#${l.slug}`} className="group flex h-full flex-col gap-8 p-6 transition-colors hover:bg-paper">
                  <span className="text-xs font-semibold tabular-nums text-amber-ink">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex items-end justify-between gap-4">
                    <span className="font-serif text-2xl leading-tight text-slate">{l.title}</span>
                    <span aria-hidden className="text-teal-ink transition-transform duration-200 group-hover:translate-x-1">→</span>
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
