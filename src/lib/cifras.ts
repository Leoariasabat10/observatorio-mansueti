// Home figures. Figures that come from outside the site (sign-ups, attendance) live in src/content/cifras.json
// and stay "Dato pendiente" until they have a value AND a source. Program figures are computed from the webinar files.
import data from "@/content/cifras.json";
import type { WebinarResumen } from "@/lib/content";

export type Cifra = { label: string; valor: number | null; fuente: string | null; fecha: string | null; ejemplo?: boolean };

export function cifrasInicio(webinars: WebinarResumen[], ahora: number): Cifra[] {
  for (const c of data.cifras as Cifra[])
    if (c.valor != null && !c.fuente) throw new Error(`src/content/cifras.json: "${c.label}" tiene valor pero no fuente`);

  const realizados = webinars.filter((w) => w.end <= ahora);
  const ponentes = new Map(webinars.flatMap((w) => w.ponentes).map((p) => [p.nombre, p.pais]));
  const ejemplo = webinars.some((w) => w.ejemplo);
  const fuente = "Programa académico de este sitio";
  const fecha = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota" }).format(ahora); // YYYY-MM-DD in Bogotá

  return [
    { label: "Webinars realizados", valor: realizados.length, fuente, fecha, ejemplo },
    { label: "Ponentes invitados", valor: ponentes.size, fuente, fecha, ejemplo },
    { label: "Países de los ponentes", valor: new Set(ponentes.values()).size, fuente, fecha, ejemplo },
    ...(data.cifras as Cifra[]),
  ];
}
