import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEdiciones } from "@/lib/latitud";
import { EdicionVista, Masthead } from "@/components/latitud/Edicion";

export function generateStaticParams() {
  const todas = getEdiciones();
  // Static export needs at least one param; with no editions the placeholder renders a 404.
  return todas.length ? todas.map((e) => ({ edicion: e.slug })) : [{ edicion: "_vacio" }];
}

export async function generateMetadata({ params }: PageProps<"/latitud-sudamericana/[edicion]">): Promise<Metadata> {
  const slug = (await params).edicion;
  const e = getEdiciones().find((x) => x.slug === slug);
  if (!e) return {};
  return { title: `${e.etiqueta} · Latitud Sudamericana`, description: e.titulo, alternates: { canonical: `/latitud-sudamericana/${e.slug}` } };
}

export default async function Edicion({ params }: PageProps<"/latitud-sudamericana/[edicion]">) {
  const slug = (await params).edicion;
  const todas = getEdiciones();
  const e = todas.find((x) => x.slug === slug);
  if (!e) notFound();
  return (
    <>
      <Masthead nombre={e.etiqueta} />
      <EdicionVista e={e} otras={todas.filter((x) => x !== e)} />
    </>
  );
}
