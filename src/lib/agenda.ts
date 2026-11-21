// "Agenda Laboral Internacional": external events in src/content/agenda.json. Server only.
// To add an event: add an object to "eventos" (fields in public/admin/config.yml). A malformed entry stops the build.
import fs from "node:fs";
import path from "node:path";
import { paises } from "@/lib/paises";
import { MODALIDADES, type EventoAgenda, type ModalidadAgenda } from "@/lib/agenda-tipos";

export { MODALIDADES };
export type { EventoAgenda };

const opt = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : undefined);
const fechaOk = (f: string | undefined) => !f || (/^\d{4}-\d{2}-\d{2}$/.test(f) && !Number.isNaN(Date.parse(f)));

export function getAgenda(): EventoAgenda[] {
  const raw = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src/content/agenda.json"), "utf8")) as { eventos?: Record<string, unknown>[] };
  return (raw.eventos ?? []).map((e, i) => {
    const fail = (m: string): never => {
      throw new Error(`agenda.json, evento ${i + 1}: ${m}`);
    };
    const req = (campo: string) => opt(e[campo]) ?? fail(`falta «${campo}»`);
    const modalidad = req("modalidad") as ModalidadAgenda;
    if (!(modalidad in MODALIDADES)) fail(`modalidad «${modalidad}» no válida (${Object.keys(MODALIDADES).join(", ")})`);
    const fecha = req("fecha");
    const fechaFin = opt(e.fechaFin);
    if (!fechaOk(fecha) || !fechaOk(fechaFin)) fail("las fechas deben ser AAAA-MM-DD");
    if (fechaFin && fechaFin < fecha) fail("fechaFin no puede ser anterior a fecha");
    const hora = opt(e.hora);
    if (hora && !/^([01]\d|2[0-3]):[0-5]\d$/.test(hora)) fail("hora debe ser HH:MM (24 h)");
    const zona = opt(e.zona);
    if (hora && !zona) fail("si hay hora, indique la zona horaria en «zona»");
    const pais = opt(e.pais);
    if (pais && !paises[pais]) fail(`país «${pais}» no válido`);
    const ciudad = opt(e.ciudad);
    if (modalidad !== "virtual" && !(pais && ciudad)) fail("los eventos presenciales e híbridos necesitan país y ciudad");
    const enlace = req("enlace");
    if (!/^https:\/\//.test(enlace)) fail("el enlace debe ser https://");
    const imagen = opt(e.imagen);
    if (imagen && !fs.existsSync(path.join(process.cwd(), "public", imagen))) fail(`no existe la imagen ${imagen}`);
    const imagenAlt = opt(e.imagenAlt);
    if (imagen && !imagenAlt) fail("falta «imagenAlt» (texto alternativo de la imagen)");
    return { nombre: req("nombre"), fecha, fechaFin, hora, zona, modalidad, pais, ciudad, organizador: req("organizador"), descripcion: req("descripcion"), enlace, imagen, imagenAlt };
  });
}
