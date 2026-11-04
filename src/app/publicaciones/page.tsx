import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Publicaciones y Boletines",
  description: "Documentos de trabajo, boletines, intervenciones judiciales y análisis de datos del Observatorio ASDTSS.",
  robots: { index: false, follow: true }, // until Phase 4 publishes real content
};

// Phase 4 builds this page with the same one-file-per-item system as the webinars.
export default function Publicaciones() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
      <p className="eyebrow text-blue">Publicaciones y Boletines</p>
      <h1 className="mt-6 max-w-3xl font-display text-[clamp(2.6rem,6vw,4.75rem)] leading-[0.98] text-navy">Esta sección se está preparando</h1>
      <p className="mt-6 max-w-xl text-lg text-muted">
        Aquí estarán los boletines, los documentos de trabajo, las intervenciones judiciales y los análisis de datos laborales del Observatorio.
      </p>
      <Link href="/programa-academico" className="mt-9 inline-flex rounded-sm bg-navy px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blue">
        Ver el programa académico
      </Link>
    </section>
  );
}
