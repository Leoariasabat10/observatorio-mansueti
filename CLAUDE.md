@AGENTS.md

# Observatorio "Hugo Mansueti" — project rules

All unconfirmed names, spellings, links, researchers and data live in `src/config/observatorio.ts`. Components read from it; never hardcode them.

Project 3 of 3 in this workspace (see `../../PROJECTS_MANIFEST.md`). This is NOT the Montenegro & Asociados law firm site, and NOT the Asociación site. It is a separate codebase with its own identity.

## What this is

Website of the Observatorio del Derecho del Trabajo y la Seguridad Social "Hugo Mansueti": an analytical labor observatory for data, case-law analysis and public policy interventions.

- Structural benchmark: Observatorio Laboral, Pontificia Universidad Javeriana, https://www.observatoriolaboral.org/. Follow its research-portal architecture, not its visuals verbatim.
- Content source: the Facebook page "Observatorio del Derecho del Trabajo y la Seguridad Social Hugo Mansueti". Until posts are extracted, use labeled placeholders: `[CONTENIDO FACEBOOK: …]`.
- Stakeholder: Dra. Juana Montenegro.

## Audience and tone

- Audience: legislators, policy makers, researchers, journalists and labor law practitioners.
- Tone: analytical, research-driven, data-dense, modern academic. Spanish (es).
- Every figure needs a cited source and date. No invented statistics, ever. Charts without real data show an explicit "Datos pendientes" state.

## Visual system

Palette sampled from the official logo (`assets-cliente/logo-observatorio-original.png`). Tokens in `src/app/globals.css`.

| Token | Hex | Use |
|---|---|---|
| `navy` | `#062265` | Wordmark color. Text, header, dark surfaces |
| `navy-deep` | `#03174A` | Footer |
| `blue` | `#1870C7` | Links, accents (4.9:1 on white, AA) |
| `sky` | `#9CC9F5` | Blue text on navy |
| `gold` | `#FCC833` | Rules, highlights on navy. Never text on white |
| `heritage` | `#8E2B14` | Honoree name only (logo script color) |

- Logo: emblem crop in `public/brand/emblema-{320,960}.webp` via `Mark`; wordmark is HTML. Emblem has a white background: place it on white only (or a white plate on navy).
- Type: `Libre Caslon Display` (40px+ titles, big figures), `Libre Caslon Text` (smaller headings), `Archivo` (text, UI). All OFL, Argentine foundries. Option 2 shown to the client: Alegreya + Alegreya Sans. Tabular numerals (`.tnum`) for figures.
- Eje colors (from the logo map, CVD-validated): see `src/content/ejes.json`. Always with the axis name next to the dot. Red `danger` is reserved for "en vivo".
- Concept: the Observatorio is a telescope, a "bitácora" of regional events. Visual system: coordinate grid (`.graticula`), reticle (`Reticula`), map of speakers with courses from Bogotá. One bold element per page.
- Feel: research portal, clear data hierarchy, tables and charts first-class.

## Pages

1. `/programa-academico` (priority): featured webinar with countdown, filters in the URL (`?estado=&eje=`), logbook list, figures + map. `/programa-academico/[slug]`: detail with Event JSON-LD.
2. `/` Inicio: hero, figures (`src/lib/cifras.ts` + `src/content/cifras.json`), timeline, mission + ejes, agenda, publications teaser, contact, Organization JSON-LD.
3. `/publicaciones` Publicaciones y Boletines (Phase 4, same one-file-per-item system).

Old sections (líneas, documentos, intervenciones, datos) became ejes and publication categories; `vercel.json` redirects the old URLs.

## Content rules

- Never invent researchers, papers, court cases, docket numbers or data. Unknown items: `[PENDIENTE CONFIRMACIÓN]`.
- Contacts confirmed in the 2026-11-03 brief (`contact` in config). Official name: ASDTSS (confirmed 2026-11-03). The ASDTSS is the parent entity; mention it as such.
- All copy and datasets live in `src/content/` and `src/data/`, with source and date per dataset.

## Stack

Next.js 16 App Router with `output: "export"` (static, no server, no DB), React 19, Tailwind v4 (`@theme` tokens), TypeScript. Content: Markdown + YAML front matter in `src/content/`, read and validated at build by `src/lib/content.ts`. Time-dependent UI (status, countdown) uses `useSyncExternalStore` clocks, never setState in effects (lint rule). Deploy settings only in `site.config.ts` (`@site` alias). Checks: `npm run lint`, `npm run check`, `npm run build` (postbuild flattens segment prefetch files, see `scripts/flatten-segments.mjs`).

CMS: Sveltia CMS at `/admin` (`public/admin/config.yml`, approved 2026-11-03). Keystatic was rejected: not compatible with static export (needs a server API route for GitHub OAuth). Keep config.yml fields in sync with the validator in `src/lib/content.ts`.
