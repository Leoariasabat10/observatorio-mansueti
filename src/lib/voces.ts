// "Voces del Derecho del Trabajo Sudamérica": videos in src/content/voces.json. Server only.
// To add a video: add an object to "videos" (see public/admin/config.yml for the fields). A malformed entry stops the build.
import fs from "node:fs";
import path from "node:path";
import { paises } from "@/lib/paises";

import { TIPOS, type Tipo, type Voz } from "@/lib/voces-tipos";

export { TIPOS };
export type { Tipo, Voz };

export const paisesVoces = Object.entries(paises)
  .filter(([, p]) => p.sudamerica)
  .map(([codigo, p]) => ({ codigo, nombre: p.nombre }));

const texto = (v: unknown, campo: string, i: number) => {
  if (typeof v !== "string" || !v.trim()) throw new Error(`voces.json, video ${i + 1}: falta «${campo}»`);
  return v.trim();
};

export function getVoces(): Voz[] {
  const raw = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src/content/voces.json"), "utf8")) as { videos?: Record<string, unknown>[] };
  return (raw.videos ?? []).map((v, i) => {
    const pais = texto(v.pais, "pais", i);
    if (!paisesVoces.some((p) => p.codigo === pais)) throw new Error(`voces.json, video ${i + 1}: país «${pais}» no válido (use el código ISO, p. ej. CO)`);
    const tipo = texto(v.tipo, "tipo", i) as Tipo;
    if (!(tipo in TIPOS)) throw new Error(`voces.json, video ${i + 1}: tipo «${tipo}» no válido (${Object.keys(TIPOS).join(", ")})`);
    const url = texto(v.url, "url", i);
    if (!/^https:\/\//.test(url) && !/^\/voces\/[\w.-]+\.(mp4|webm)$/.test(url)) throw new Error(`voces.json, video ${i + 1}: la url debe ser https:// o /voces/archivo.mp4`);
    const fecha = typeof v.fecha === "string" && v.fecha ? v.fecha : undefined;
    if (fecha && !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) throw new Error(`voces.json, video ${i + 1}: la fecha debe ser AAAA-MM-DD`);
    return {
      titulo: texto(v.titulo, "titulo", i),
      persona: texto(v.persona, "persona", i),
      pais,
      tipo,
      descripcion: texto(v.descripcion, "descripcion", i),
      url,
      miniatura: typeof v.miniatura === "string" && v.miniatura ? v.miniatura : undefined,
      fecha,
      destacado: v.destacado === true,
    };
  });
}
