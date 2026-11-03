// Single source for names, contacts and anything the client still has to confirm.
// Change values here; no component edits needed.

const PENDING = "[PENDIENTE CONFIRMACIÓN]";

// Final domain of the client. Change here only (metadata, sitemap, Open Graph read it).
export const siteUrl = "https://observatorio-mansueti.vercel.app";

// Name and honoree as written in the official logo (assets-cliente/logo-observatorio-original.png).
// PENDIENTE: the logo reads "ASDTSS"; the brief says "ASUDETS". Logo spelling kept until confirmed.
export const observatorio = {
  name: "Observatorio de la Asociación Sudamericana de Derecho del Trabajo y la Seguridad Social",
  acronym: "ASDTSS",
  honoree: "Hugo Roberto Mansueti",
  shortName: "Observatorio ASDTSS",
  mission: "Análisis, investigación y formación en Derecho del Trabajo y de la Seguridad Social en Sudamérica.",
  copyrightYear: 2026,
};

export const contact = {
  email: "hugorobertomansueti@gmail.com",
  phoneDisplay: "314 407 5302",
  phoneHref: "tel:+573144075302",
  whatsapp: "https://wa.me/573144075302",
  address: ["Carrera 7 # 17-57, oficina 705", "Bogotá, Colombia, 111221"],
};

// PENDIENTE 3 — link with the Asociación (Project 2).
export const asociacion = {
  label: "Asociación Hugo Mansueti",
  url: "https://asociacion-mansueti.vercel.app",
};

// Only confirmed profiles. Add Instagram/LinkedIn here when the client confirms them.
export const social = [
  { id: "facebook", label: "Facebook", href: "https://www.facebook.com/profile.php?id=61595918491051" },
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
