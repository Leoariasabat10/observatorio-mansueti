// "Latitud Sudamericana: Pensamiento Jurídico": one object per edition in src/content/latitud.json. Server only.
// To add an edition: add an object at the top of "ediciones" (newest first) and put its images in public/latitud/<aaaa-mm[-dd]>/.
import fs from "node:fs";
import path from "node:path";
import { paises } from "@/lib/paises";

export type Articulo = {
  pais: string; // ISO code, see paises.ts
  titulo: string;
  imagen: string; // /latitud/..., the published piece
  autor?: string; // only if the source provides it
  resumen?: string;
  enlace?: string; // https link to the full article, if it exists elsewhere
};

export type Edicion = {
  slug: string;
  etiqueta: string; // "Edición noviembre 2026"
  titulo: string;
  fecha?: string; // YYYY-MM-DD, only if the issue has an exact publication date
  portada: string;
  portadaW: number;
  portadaH: number;
  articulos: Articulo[];
};

const texto = (v: unknown, campo: string, ctx: string) => {
  if (typeof v !== "string" || !v.trim()) throw new Error(`latitud.json, ${ctx}: falta «${campo}»`);
  return v.trim();
};

export function getEdiciones(): Edicion[] {
  const raw = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src/content/latitud.json"), "utf8")) as { ediciones?: Record<string, unknown>[] };
  return (raw.ediciones ?? []).map((e, i) => {
    const ctx = `edición ${i + 1}`;
    const portada = texto(e.portada, "portada", ctx);
    if (!fs.existsSync(path.join(process.cwd(), "public", portada))) throw new Error(`latitud.json, ${ctx}: no existe la portada ${portada}`);
    const articulos = ((e.articulos as Record<string, unknown>[]) ?? []).map((a, j) => {
      const c = `${ctx}, artículo ${j + 1}`;
      const pais = texto(a.pais, "pais", c);
      if (!paises[pais]) throw new Error(`latitud.json, ${c}: país «${pais}» no válido`);
      const imagen = texto(a.imagen, "imagen", c);
      if (!fs.existsSync(path.join(process.cwd(), "public", imagen))) throw new Error(`latitud.json, ${c}: no existe la imagen ${imagen}`);
      const enlace = typeof a.enlace === "string" && a.enlace ? a.enlace : undefined;
      if (enlace && !/^https:\/\//.test(enlace)) throw new Error(`latitud.json, ${c}: el enlace debe ser https://`);
      return {
        pais,
        titulo: texto(a.titulo, "titulo", c),
        imagen,
        autor: typeof a.autor === "string" && a.autor ? a.autor : undefined,
        resumen: typeof a.resumen === "string" && a.resumen ? a.resumen : undefined,
        enlace,
      };
    });
    return {
      slug: texto(e.slug, "slug", ctx),
      etiqueta: texto(e.etiqueta, "etiqueta", ctx),
      titulo: texto(e.titulo, "titulo", ctx),
      fecha: typeof e.fecha === "string" && e.fecha ? e.fecha : undefined,
      portada,
      portadaW: Number(e.portadaW) || 1200,
      portadaH: Number(e.portadaH) || 800,
      articulos,
    };
  });
}
