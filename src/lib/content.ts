// Reads the editable content in src/content/ at build time. Server only.
// A missing or malformed field stops the build with the file name, so a broken file never reaches the site.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { ejePorSlug, ejes } from "@/lib/ejes";
import { paises } from "@/lib/paises";
import { startMs } from "@/lib/webinar-time";

export type Ponente = { nombre: string; rol?: string; cargo?: string; institucion?: string; pais: string; foto?: string };
export type Modalidad = "virtual" | "presencial" | "hibrida";

export type Webinar = {
  slug: string;
  titulo: string;
  fecha: string; // YYYY-MM-DD, Bogotá
  hora: string; // HH:MM, Bogotá
  start: number;
  end: number;
  duracionMin: number;
  ejes: string[];
  modalidad: Modalidad;
  plataforma?: string;
  lugar?: string;
  resumen: string;
  ponentes: Ponente[];
  afiche?: string;
  aficheAlt?: string;
  inscripcion?: string;
  grabacion?: string;
  ejemplo: boolean;
  html: string;
};

const DIR = path.join(process.cwd(), "src/content/webinars");

function parse(file: string): Webinar {
  const slug = file.replace(/\.md$/, "");
  const { data: d, content } = matter(fs.readFileSync(path.join(DIR, file), "utf8"));
  const fail = (msg: string): never => {
    throw new Error(`src/content/webinars/${file}: ${msg}`);
  };
  const str = (k: string, required = false) => {
    const v = d[k];
    if (v == null || v === "") return required ? fail(`falta el campo "${k}"`) : undefined;
    return String(v).trim();
  };

  const fecha = d.fecha instanceof Date ? d.fecha.toISOString().slice(0, 10) : str("fecha", true)!;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) fail(`"fecha" debe ser AAAA-MM-DD, llegó "${fecha}"`);
  const hora = str("hora", true)!;
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(hora)) fail(`"hora" debe ser HH:MM en 24 h, llegó "${hora}"`);
  const duracionMin = Number(d.duracionMin ?? 90);
  if (!(duracionMin > 0)) fail(`"duracionMin" debe ser un número de minutos`);

  const ejesW: string[] = Array.isArray(d.ejes) ? d.ejes : [];
  if (!ejesW.length) fail(`"ejes" necesita al menos un eje`);
  for (const e of ejesW) if (!ejePorSlug(e)) fail(`eje desconocido "${e}". Válidos: ${ejes.map((x) => x.slug).join(", ")}`);

  const modalidad = (str("modalidad") ?? "virtual") as Modalidad;
  if (!["virtual", "presencial", "hibrida"].includes(modalidad)) fail(`"modalidad" debe ser virtual, presencial o hibrida`);

  const ponentes: Ponente[] = Array.isArray(d.ponentes) ? d.ponentes : [];
  if (!ponentes.length) fail(`"ponentes" necesita al menos una persona`);
  for (const p of ponentes) {
    if (!p.nombre) fail("cada ponente necesita \"nombre\"");
    if (!paises[p.pais]) fail(`país "${p.pais}" de ${p.nombre} no está en src/lib/paises.ts (usa el código de 2 letras, p. ej. CO)`);
  }

  const afiche = str("afiche");
  if (afiche && !str("aficheAlt")) fail(`"afiche" necesita "aficheAlt" (descripción de la imagen)`);

  const start = startMs(fecha, hora);
  return {
    slug,
    titulo: str("titulo", true)!,
    fecha,
    hora,
    start,
    end: start + duracionMin * 60_000,
    duracionMin,
    ejes: ejesW,
    modalidad,
    plataforma: str("plataforma"),
    lugar: str("lugar"),
    resumen: str("resumen", true)!,
    ponentes,
    afiche,
    aficheAlt: str("aficheAlt"),
    inscripcion: str("inscripcion"),
    grabacion: str("grabacion"),
    ejemplo: d.ejemplo === true,
    html: marked.parse(content, { async: false }),
  };
}

let cache: Webinar[] | undefined;

/** All webinars, oldest first. */
export function getWebinars(): Webinar[] {
  cache ??= fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map(parse)
    .sort((a, b) => a.start - b.start);
  return cache;
}

export const getWebinar = (slug: string) => getWebinars().find((w) => w.slug === slug);

/** Client-safe subset (no HTML body) for the interactive explorer. */
export type WebinarResumen = Omit<Webinar, "html">;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const resumenes = (): WebinarResumen[] => getWebinars().map(({ html, ...w }) => w);

/** Build moment: first render of the time-dependent parts (the browser clock replaces it). */
export const BUILD_NOW = Date.now();
