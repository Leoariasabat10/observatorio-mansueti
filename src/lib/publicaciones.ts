// Publications: one Markdown file per item in src/content/publicaciones/. Server only.
import fs from "node:fs";
import path from "node:path";
import { categoriaPorSlug, categorias } from "@/lib/categorias";
import { leerMarkdown } from "@/lib/content";

export type Autor = { nombre: string; institucion?: string };

export type Publicacion = {
  slug: string;
  titulo: string;
  fecha: string; // YYYY-MM-DD
  anio: number;
  categoria: string;
  numero?: number;
  ejes: string[];
  autores: Autor[];
  resumen: string;
  pdf?: string;
  pdfKB?: number;
  enlace?: string;
  portada?: string;
  portadaAlt?: string;
  ejemplo: boolean;
  html: string;
};

const DIR = "src/content/publicaciones";

function parse(file: string): Publicacion {
  const { slug, d, fail, str, fecha: leerFecha, ejesDe, html } = leerMarkdown(DIR, file);
  const fecha = leerFecha();

  const categoria = str("categoria", true)!;
  if (!categoriaPorSlug(categoria)) fail(`categoría desconocida "${categoria}". Válidas: ${categorias.map((c) => c.slug).join(", ")}`);

  const autores: Autor[] = Array.isArray(d.autores) ? d.autores : [];
  if (!autores.length || autores.some((a) => !a.nombre)) fail(`"autores" necesita al menos un nombre`);

  // PDF lives in public/; its size is read at build so the download button can show it.
  const pdf = str("pdf");
  let pdfKB: number | undefined;
  if (pdf) {
    const file = path.join(process.cwd(), "public", pdf);
    if (!fs.existsSync(file)) fail(`no se encuentra el PDF "${pdf}" en public/`);
    pdfKB = Math.round(fs.statSync(file).size / 1024);
  }

  const portada = str("portada");
  if (portada && !str("portadaAlt")) fail(`"portada" necesita "portadaAlt" (descripción de la imagen)`);

  return {
    slug,
    titulo: str("titulo", true)!,
    fecha,
    anio: Number(fecha.slice(0, 4)),
    categoria,
    numero: d.numero != null && d.numero !== "" ? Number(d.numero) : undefined,
    ejes: ejesDe(),
    autores,
    resumen: str("resumen", true)!,
    pdf,
    pdfKB,
    enlace: str("enlace"),
    portada,
    portadaAlt: str("portadaAlt"),
    ejemplo: d.ejemplo === true,
    html: html(),
  };
}

let cache: Publicacion[] | undefined;

/** All publications, newest first. */
export function getPublicaciones(): Publicacion[] {
  cache ??= fs
    .readdirSync(path.join(process.cwd(), DIR))
    .filter((f) => f.endsWith(".md"))
    .map(parse)
    .sort((a, b) => b.fecha.localeCompare(a.fecha));
  return cache;
}

export const getPublicacion = (slug: string) => getPublicaciones().find((p) => p.slug === slug);

export type PublicacionResumen = Omit<Publicacion, "html">;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const resumenesPublicaciones = (): PublicacionResumen[] => getPublicaciones().map(({ html, ...p }) => p);

