// Single source for names, contacts and anything the client still has to confirm.
// Change values here; no component edits needed.

const PENDING = "[PENDIENTE CONFIRMACIÓN]";

// Final domain of the client. Change here only (metadata, sitemap, Open Graph read it).
// Domain lives in site.config.ts.

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

// Parent entity. The Observatorio belongs to the ASDTSS (confirmed 2026-11-03).
export const asociacion = {
  name: "Asociación Sudamericana de Derecho del Trabajo y de la Seguridad Social",
  acronym: "ASDTSS",
  url: "https://asociacion-mansueti.vercel.app", // ASDTSS website (Project 2)
  facebook: "https://www.facebook.com/ASDTSS",
};

// Only confirmed profiles. Add Instagram here when the client sends the link.
export const social = [
  { id: "facebook", label: "Facebook del Observatorio", href: "https://www.facebook.com/profile.php?id=61595918491051" },
] as const;

// PENDIENTE — research team.
export const team = [
  { name: "Dra. Juana Montenegro", role: PENDING },
  { name: PENDING, role: PENDING },
];

export const nav = [
  { label: "Programa académico", href: "/programa-academico" },
  { label: "Observatorio", href: "/" },
  { label: "Publicaciones y Boletines", href: "/publicaciones" },
  { label: "Contacto", href: "#contacto" },
] as const;

export const legal = {
  disclaimer:
    "El Observatorio es una iniciativa académica. Sus análisis tienen fines de investigación y difusión y no constituyen asesoría jurídica.",
  // Ley 1581 de 2012 applies if domiciled in Colombia. PENDIENTE: confirm.
  habeasData:
    "Los datos personales suministrados se tratan conforme a la Ley 1581 de 2012 y solo para fines institucionales.",
};
