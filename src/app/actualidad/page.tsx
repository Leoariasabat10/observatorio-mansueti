import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { resumenesActualidad, VISTA_PREVIA } from "@/lib/actualidad";
import { fechaPublicacion } from "@/lib/categorias";
import { ListaActualidad } from "@/components/actualidad/ListaActualidad";

export const metadata: Metadata = {
  title: "Actualidad",
  description: "Novedades, eventos y aportes académicos que el Observatorio ASDTSS difunde sobre Derecho del Trabajo y de la Seguridad Social en Sudamérica.",
  alternates: { canonical: "/actualidad" },
};

export default function Actualidad() {
  const novedades = resumenesActualidad();
  const desde = novedades.at(-1)?.fecha;
  return (
    <>
      <section aria-labelledby="actualidad-titulo" className="graticula border-b border-rule bg-card">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 pt-14 pb-12 sm:pt-20 lg:grid-cols-12 lg:items-end lg:gap-10 lg:px-8 lg:pt-24 lg:pb-16">
          <h1 id="actualidad-titulo" className="font-display text-[clamp(3rem,8.6vw,6rem)] leading-[0.9] tracking-[-0.025em] text-balance text-navy lg:col-span-8">
            Lo que ocurre en la región
          </h1>
          <div className="lg:col-span-4 lg:border-l lg:border-rule lg:pl-8">
            <p className="max-w-sm text-lg leading-relaxed text-muted">
              Aportes académicos, eventos y noticias institucionales seleccionadas por el Observatorio, cada una con su fuente original.
            </p>
            {desde && (
              <p className="tnum mt-5 text-sm text-muted">
                {novedades.length} entradas desde el <time dateTime={desde}>{fechaPublicacion(desde)}</time>
              </p>
            )}
          </div>
        </div>
        {VISTA_PREVIA && (
          <p className="border-t border-dashed border-heritage/40 bg-heritage/[0.04] px-5 py-3 text-center text-sm font-semibold text-heritage">
            Vista previa local: se muestran borradores y entradas en revisión. No es lo que verá el público.
          </p>
        )}
      </section>

      <div className="bg-paper">
        <ListaActualidad novedades={novedades} />
        <p className="mx-auto flex max-w-7xl items-center gap-1.5 px-5 pb-16 text-sm text-muted lg:px-8">
          <ArrowUpRight className="size-4" aria-hidden />
          Cada nota enlaza a la publicación original en Facebook.
        </p>
      </div>
    </>
  );
}
