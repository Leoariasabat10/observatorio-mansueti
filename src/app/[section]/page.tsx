import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sections } from "@/config/observatorio";

type Slug = keyof typeof sections;

export function generateStaticParams() {
  return Object.keys(sections).map((section) => ({ section }));
}

export async function generateMetadata({ params }: PageProps<"/[section]">): Promise<Metadata> {
  const { section } = await params;
  return { title: sections[section as Slug]?.title };
}

// Phase 1 shell: each inner page gets its own route once content exists.
export default async function SectionPage({ params }: PageProps<"/[section]">) {
  const { section } = await params;
  const page = sections[section as Slug];
  if (!page) notFound();

  return (
    <>
      <section className="border-b border-rule bg-card">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
          <p className="eyebrow text-blue">Observatorio</p>
          <h1 className="mt-4 font-serif text-[clamp(2.25rem,4.5vw,3.75rem)] leading-tight font-medium text-navy">{page.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">{page.lead}</p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="max-w-xl border-l-2 border-gold pl-6">
          <p className="font-serif text-2xl text-navy">Contenido en preparación.</p>
          <p className="mt-3 text-muted">Esta sección se publicará con documentos y datos verificados, con fuente y fecha.</p>
          <Link href="/" className="mt-6 inline-block text-sm font-semibold text-blue underline-offset-4 hover:underline">
            Volver al inicio
          </Link>
        </div>
      </section>
    </>
  );
}
