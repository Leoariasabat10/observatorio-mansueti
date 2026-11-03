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
- Type: `Newsreader` (headlines) + `Plus Jakarta Sans` (UI), via `next/font/google`. Tabular numerals for figures.
- Feel: research portal, clear data hierarchy, tables and charts first-class.

## Key sections

Working papers and labor-reform analysis; research lines (collective bargaining, social security, digital platforms, gender and work); court interventions (Corte Constitucional, Corte Suprema de Justicia); labor data dashboards.

## Content rules

- Never invent researchers, papers, court cases, docket numbers or data. Unknown items: `[PENDIENTE CONFIRMACIÓN]`.
- Contacts confirmed in the 2026-11-03 brief (`contact` in config). Official name from the logo: ASDTSS; brief says ASUDETS, pending confirmation.
- All copy and datasets live in `src/content/` and `src/data/`, with source and date per dataset.

## Stack

Next.js 16 App Router, React 19, Tailwind v4 (`@theme` tokens), TypeScript. Its own git repo and its own Vercel project. Charts library is decided in its own plan, when real data exists. Checks: `npm run lint`, `npm run build`.
