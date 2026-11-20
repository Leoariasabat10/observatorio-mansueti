// "Actualidad": one Markdown file per news item in src/content/actualidad/. Server only.
// Only entries with estado "publicado" reach the site; the rest stay as drafts for review. A malformed file stops the build.
import fs from "node:fs";
import path from "node:path";
import { leerMarkdown } from "@/lib/content";
import { paises } from "@/lib/paises";
import { ejePorSlug } from "@/lib/ejes";

export const ESTADOS = ["borrador", "revision", "publicado"] as const;
export const PAGINAS = { observatorio: "Facebook del Observatorio", asdtss: "Facebook de la ASDTSS" } as const;
export type Estado = (typeof ESTADOS)[number];

export type Actualidad = {
  slug: string;
  titulo: string;
  fecha: string; // fecha_publicacion, YYYY-MM-DD
  resumen: string;
  autor?: string; // ponente_o_autor
  pais?: string; // ISO code, see paises.ts
  institucion?: string;
  cargo?: string;
  eje?: string;
  imagen?: string;
  imagenAlt?: string;
  credito?: string;
  pagina: keyof typeof PAGINAS;
  urlOriginal: string;
  idPublicacion: string;
  estado: Estado;
  ejemplo: boolean;
  eventoRealizado: boolean;
  html: string;
};

const DIR = "src/content/actualidad";

function parse(file: string): Actualidad {
  const { slug, d, fail, str, html } = leerMarkdown(DIR, file);
  const f = d.fecha_publicacion instanceof Date ? d.fecha_publicacion.toISOString().slice(0, 10) : str("fecha_publicacion", true)!;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(f)) fail(`"fecha_publicacion" debe ser AAAA-MM-DD, llegó "${f}"`);

  const estado = str("estado", true) as Estado;
  if (!ESTADOS.includes(estado)) fail(`"estado" debe ser ${ESTADOS.join(", ")}`);
  const pagina = str("pagina_fuente", true) as keyof typeof PAGINAS;
  if (!(pagina in PAGINAS)) fail(`"pagina_fuente" debe ser ${Object.keys(PAGINAS).join(" o ")}`);
  const urlOriginal = str("url_original", true)!;
  if (!/^https:\/\/(www\.|m\.)?facebook\.com\//.test(urlOriginal)) fail(`"url_original" debe ser un enlace de facebook.com`);

  const pais = str("pais");
  if (pais && !paises[pais]) fail(`país "${pais}" no está en src/lib/paises.ts (código de 2 letras)`);
  const eje = str("eje_tematico");
  if (eje && !ejePorSlug(eje)) fail(`eje desconocido "${eje}"`);

  const imagen = str("imagen");
  if (imagen) {
    if (!str("texto_alternativo") || !str("credito")) fail(`"imagen" necesita "texto_alternativo" y "credito"`);
    if (!fs.existsSync(path.join(process.cwd(), "public", imagen))) fail(`no se encuentra la imagen "${imagen}" en public/`);
  }
  const punt = d.puntuacion;
  if (punt != null && !(Number(punt) >= 0 && Number(punt) <= 10)) fail(`"puntuacion" debe estar entre 0 y 10`);

  return {
    slug,
    titulo: str("titulo", true)!,
    fecha: f,
    resumen: str("resumen", true)!,
    autor: str("ponente_o_autor"),
    pais,
    institucion: str("institucion"),
    cargo: str("cargo"),
    eje,
    imagen,
    imagenAlt: str("texto_alternativo"),
    credito: str("credito"),
    pagina,
    urlOriginal,
    idPublicacion: str("id_publicacion", true)!,
    estado,
    ejemplo: d.ejemplo === true,
    eventoRealizado: d.evento_realizado === true,
    html: html(),
  };
}

let cache: Actualidad[] | undefined;

/** Every entry in any state (the build validates all of them), newest first. */
function todas(): Actualidad[] {
  cache ??= fs
    .readdirSync(path.join(process.cwd(), DIR))
    .filter((f) => f.endsWith(".md"))
    .map(parse)
    .sort((a, b) => b.fecha.localeCompare(a.fecha));
  return cache;
}

/** Local review build only (ACTUALIDAD_VISTA_PREVIA=1): drafts and entries in review are shown too. Never set it for a deploy. */
export const VISTA_PREVIA = process.env.ACTUALIDAD_VISTA_PREVIA === "1";

/** Only what is public (or everything, in the local preview build). */
export const getActualidad = (): Actualidad[] => todas().filter((a) => VISTA_PREVIA || a.estado === "publicado");
export const getNovedad = (slug: string) => getActualidad().find((a) => a.slug === slug);
