import type { Metadata } from "next";
import { getAgenda } from "@/lib/agenda";
import { ListaAgenda } from "@/components/agenda/ListaAgenda";

export const metadata: Metadata = {
  title: "Agenda Laboral Internacional",
  description: "Congresos, seminarios, conferencias y encuentros académicos internacionales sobre Derecho del Trabajo y Seguridad Social.",
  alternates: { canonical: "/agenda-laboral-internacional" },
};

export default function Agenda() {
  const hoyBuild = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota" }).format(new Date());
  return (
    <>
      <section aria-labelledby="agenda-titulo" className="graticula border-b border-rule bg-card">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 pt-14 pb-12 sm:pt-20 lg:grid-cols-12 lg:items-end lg:gap-10 lg:px-8 lg:pt-24 lg:pb-16">
          <h1 id="agenda-titulo" className="font-display text-[clamp(2.6rem,6.4vw,6rem)] leading-[0.95] tracking-[-0.02em] text-balance text-navy lg:col-span-8">
            Agenda Laboral Internacional
          </h1>
          <p className="max-w-sm text-lg leading-relaxed text-muted lg:col-span-4 lg:border-l lg:border-rule lg:pl-8">
            Congresos, seminarios, conferencias y encuentros académicos sobre Derecho del Trabajo y Seguridad Social, en la región y en el mundo.
          </p>
        </div>
      </section>
      <div className="bg-paper">
        <ListaAgenda eventos={getAgenda()} hoyBuild={hoyBuild} />
      </div>
    </>
  );
}
