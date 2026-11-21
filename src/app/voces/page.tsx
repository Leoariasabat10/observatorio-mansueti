import type { Metadata } from "next";
import { getVoces, paisesVoces } from "@/lib/voces";
import { ListaVoces } from "@/components/voces/ListaVoces";

export const metadata: Metadata = {
  title: "Voces del Derecho del Trabajo Sudamérica",
  description: "Exposiciones, entrevistas y aportes en video de especialistas de Sudamérica en Derecho del Trabajo y de la Seguridad Social, organizados por país.",
  alternates: { canonical: "/voces" },
};

export default function Voces() {
  const videos = getVoces();
  return (
    <>
      <section aria-labelledby="voces-titulo" className="noche text-paper">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 pt-14 pb-12 sm:pt-20 lg:grid-cols-12 lg:items-end lg:gap-10 lg:px-8 lg:pt-24 lg:pb-16">
          <h1 id="voces-titulo" className="font-display text-[clamp(2.6rem,6.4vw,6rem)] leading-[0.95] tracking-[-0.02em] text-balance text-white lg:col-span-8">
            Voces del Derecho del Trabajo Sudamérica
          </h1>
          <p className="max-w-sm text-lg leading-relaxed text-paper/85 lg:col-span-4 lg:border-l lg:border-white/20 lg:pl-8">
            Exposiciones, entrevistas y aportes de especialistas de la región, en video y organizados por país.
          </p>
        </div>
      </section>
      <div className="bg-paper">
        <ListaVoces videos={videos} paisesLista={paisesVoces} />
      </div>
    </>
  );
}
