// Client-safe types and labels for "Voces" (voces.ts reads files and is server only).
export const TIPOS = { exposicion: "Exposición", entrevista: "Entrevista", aporte: "Aporte" } as const;
export type Tipo = keyof typeof TIPOS;

export type Voz = {
  titulo: string;
  persona: string;
  pais: string; // ISO code, one of the 12 South American countries in paises.ts
  tipo: Tipo;
  descripcion: string;
  url: string; // https link to the video, or /voces/<file>.mp4 for a file in public/voces/
  miniatura?: string; // /voces/<image>, optional
  fecha?: string; // YYYY-MM-DD, optional
  destacado?: boolean;
};
