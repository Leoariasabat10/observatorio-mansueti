// Time rules for webinars. Pure functions: used on the server (build) and in the browser.
// Content stores date + time as Bogotá wall clock. Bogotá is UTC−5 all year (no DST since 1993).

export type Estado = "proximo" | "en-vivo" | "pasado";

export const TZ = "America/Bogota";

export function startMs(fecha: string, hora: string): number {
  return Date.parse(`${fecha}T${hora}:00-05:00`);
}

export function estadoDe(start: number, duracionMin: number, now: number): Estado {
  if (now < start) return "proximo";
  if (now < start + duracionMin * 60_000) return "en-vivo";
  return "pasado";
}

export const estadoLabel: Record<Estado, string> = {
  proximo: "Próximo",
  "en-vivo": "En vivo",
  pasado: "Realizado",
};

const fmt = (opts: Intl.DateTimeFormatOptions, tz = TZ) => new Intl.DateTimeFormat("es-CO", { timeZone: tz, ...opts });
const largo = fmt({ weekday: "long", day: "numeric", month: "long", year: "numeric" });
const mesAnio = fmt({ month: "long", year: "numeric" });
const mesCorto = fmt({ month: "short" });
const dia = fmt({ day: "2-digit" });
// 12-hour clock, as in the official posters ("7:00 p. m.").
const opcHora: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "2-digit", hour12: true };
const hora = fmt(opcHora);

export const fechaLarga = (ms: number) => largo.format(ms);
export const fechaMesAnio = (ms: number) => mesAnio.format(ms);
export const fechaDia = (ms: number) => dia.format(ms);
export const fechaMes = (ms: number) => mesCorto.format(ms).replace(".", "");
export const horaBogota = (ms: number) => hora.format(ms);
export const horaEn = (ms: number, tz: string) => fmt(opcHora, tz).format(ms);
export const diaEn = (ms: number, tz: string) => fmt({ weekday: "long", day: "numeric" }, tz).format(ms);

// Remaining time split for the countdown. Minutes resolution: no ticking seconds.
export function restante(start: number, now: number) {
  const min = Math.max(0, Math.floor((start - now) / 60_000));
  return { dias: Math.floor(min / 1440), horas: Math.floor((min % 1440) / 60), minutos: min % 60 };
}

// iCalendar file so the visitor can add the webinar to their calendar. Times in UTC.
export function ics(w: { slug: string; titulo: string; start: number; end: number; url: string; lugar?: string; descripcion?: string }) {
  const t = (ms: number) => new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const esc = (s: string) => s.replace(/[\\,;]/g, (c) => "\\" + c).replace(/\n/g, "\\n"); // RFC 5545 text escaping
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Observatorio ASDTSS//Programa academico//ES",
    "BEGIN:VEVENT",
    `UID:${w.slug}@observatorio-asdtss`,
    `DTSTAMP:${t(w.start)}`,
    `DTSTART:${t(w.start)}`,
    `DTEND:${t(w.end)}`,
    `SUMMARY:${esc(w.titulo)}`,
    `URL:${w.url}`,
    ...(w.descripcion ? [`DESCRIPTION:${esc(w.descripcion)}`] : []),
    `LOCATION:${esc(w.lugar ?? w.url)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export const modalidadTexto = (w: { modalidad: "virtual" | "presencial" | "hibrida"; plataforma?: string; lugar?: string }) =>
  ({
    virtual: `Virtual${w.plataforma ? ` por ${w.plataforma}` : ""}`,
    presencial: `Presencial${w.lugar ? `: ${w.lugar}` : ""}`,
    hibrida: `Híbrido${w.plataforma ? `: ${w.plataforma}` : ""}${w.lugar ? ` y ${w.lugar}` : ""}`,
  })[w.modalidad];

/** The one action that fits the moment: join or sign up before/while it runs, the recording after. */
export function accionPrincipal(
  w: { reunion?: string; inscripcion?: string; grabacion?: string; plataforma?: string },
  estado: Estado,
): { href: string; label: string } | null {
  if (estado === "pasado") return w.grabacion ? { href: w.grabacion, label: "Ver grabación" } : null;
  if (w.reunion) return { href: w.reunion, label: estado === "en-vivo" ? "Entrar ahora" : `Unirse en ${w.plataforma ?? "la reunión"}` };
  if (w.inscripcion) return { href: w.inscripcion, label: estado === "en-vivo" ? "Entrar a la transmisión" : "Inscribirme" };
  return null;
}

/** Moderators are listed with the speakers in the content file but are not speakers: figures and maps leave them out. */
export const esModeracion = (p: { rol?: string }) => /moderaci/i.test(p.rol ?? "");
