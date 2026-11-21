// Client-safe types and labels for "Agenda Laboral Internacional" (agenda.ts reads files and is server only).
export const MODALIDADES = { presencial: "Presencial", virtual: "Virtual", hibrida: "Híbrida" } as const;
export type ModalidadAgenda = keyof typeof MODALIDADES;

export type EventoAgenda = {
  nombre: string;
  fecha: string; // YYYY-MM-DD, first day
  fechaFin?: string; // YYYY-MM-DD, last day for multi-day events
  hora?: string; // HH:MM, 24 h
  zona?: string; // required with hora, e.g. "hora de Colombia (UTC−5)"
  modalidad: ModalidadAgenda;
  pais?: string; // ISO code, see paises.ts (required for presencial and híbrida)
  ciudad?: string;
  organizador: string;
  descripcion: string;
  enlace: string; // official https link: more information or registration
  imagen?: string; // /agenda/<file>
  imagenAlt?: string;
};
