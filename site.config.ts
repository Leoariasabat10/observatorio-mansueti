// Deployment settings. The only file to edit when the site moves to the client's domain or changes hands.
export const siteConfig = {
  // Final domain of the client, without trailing slash.
  url: "https://observatorio-mansueti.vercel.app",
  // Every date and time in the content is read as Bogotá time.
  timeZone: "America/Bogota",
  locale: "es-CO",
  // Credit in the footer. Leave name empty to hide it.
  agency: { name: "AGENCIA_NOMBRE", url: "AGENCIA_URL" },
} as const;
