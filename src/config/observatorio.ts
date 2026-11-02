// Single source for everything the client still has to confirm (meeting 2026-11-02).
// See docs/cliente/2026-11-01-audios-juana.md. Change values here; no component edits needed.

const PENDING = "[PENDIENTE CONFIRMACIÓN]";

// PENDIENTE 1 — official spelling: "Mansueti" or "Mansuetti" (client's chat).
const surname: "Mansueti" | "Mansuetti" = "Mansueti";

// PENDIENTE 2 — exact name. The chat says "Observatorio del Derecho del Trabajo y la Seguridad Social";
// the voice note says "Observatorio de la Asociación Suramericana…".
export const observatorio = {
  name: "Observatorio del Derecho del Trabajo y la Seguridad Social",
  honoree: `Hugo ${surname}`,
  shortName: `Observatorio ${`Hugo ${surname}`}`,
  mission: "Análisis, datos e investigación sobre el Derecho del Trabajo y la Seguridad Social.",
  email: null as string | null, // PENDIENTE: official contact
  copyrightYear: 2026,
};

// PENDIENTE 3 — link with the Asociación (Project 2).
export const asociacion = {
  label: "Asociación Hugo Mansueti",
  url: "https://asociacion-mansueti.vercel.app",
};

// PENDIENTE 4 — official social profiles.
export const social = [
  { id: "facebook", label: "Facebook", href: "#" },
  { id: "instagram", label: "Instagram", href: "#" },
  { id: "linkedin", label: "LinkedIn", href: "#" },
] as const;

// PENDIENTE 5 — research team.
export const team = [
  { name: "Dra. Juana Montenegro", role: PENDING },
  { name: PENDING, role: PENDING },
];

export const researchLines = [
  { slug: "negociacion-colectiva", title: "Negociación colectiva" },
  { slug: "seguridad-social", title: "Seguridad social" },
  { slug: "plataformas-digitales", title: "Trabajo en plataformas digitales" },
  { slug: "genero-y-trabajo", title: "Género y trabajo" },
];

export const nav = [
  {
    label: "Líneas de investigación",
    href: "/investigacion",
    children: researchLines.map((l) => ({ label: l.title, href: `/investigacion#${l.slug}` })),
  },
  { label: "Documentos de trabajo", href: "/documentos" },
  { label: "Intervenciones judiciales", href: "/intervenciones" },
  { label: "Datos laborales", href: "/datos" },
  { label: asociacion.label, href: asociacion.url, external: true },
] as const;

export const primaryCta = { label: "Ver documentos", href: "/documentos" };

// Hero indicators. No figures until a real, cited dataset exists.
export const indicators = [
  { label: "Documentos de trabajo publicados", value: null as string | null, source: null as string | null },
  { label: "Intervenciones ante altas cortes", value: null as string | null, source: null as string | null },
  { label: "Líneas de investigación activas", value: String(researchLines.length), source: "Observatorio" },
];

export const sections = {
  investigacion: { title: "Líneas de investigación", lead: "Negociación colectiva, seguridad social, plataformas digitales, género y trabajo." },
  documentos: { title: "Documentos de trabajo", lead: "Análisis de la reforma laboral, working papers y notas técnicas." },
  intervenciones: { title: "Intervenciones judiciales", lead: "Conceptos e intervenciones ante la Corte Constitucional y la Corte Suprema de Justicia." },
  datos: { title: "Datos laborales", lead: "Tableros e indicadores del mercado laboral, con fuente y fecha." },
} as const;

export const legal = {
  disclaimer:
    "El Observatorio es una iniciativa académica. Sus análisis tienen fines de investigación y difusión y no constituyen asesoría jurídica.",
  // Ley 1581 de 2012 applies if domiciled in Colombia. PENDIENTE: confirm.
  habeasData:
    "Los datos personales suministrados se tratan conforme a la Ley 1581 de 2012 y solo para fines institucionales.",
};
