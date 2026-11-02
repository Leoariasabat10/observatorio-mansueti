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

| Token | Hex | Use |
|---|---|---|
| `slate` | `#0F172A` | Text, header, dark surfaces |
| `teal` | `#0284C7` | Charts, large headings, accents. As body text on paper it is 3.9:1 (fails AA): use `teal-ink` `#0369A1` (5.7:1) for links and small text. |
| `paper` | `#F8FAFC` | Page background |
| `amber` | `#D97706` | Alerts, highlights, chart emphasis. As small text on paper it is 3.0:1: use `amber-ink` `#B45309` for text. |

- Type: `Newsreader` (headlines, papers, long reading) + `Plus Jakarta Sans` (UI, data labels, tables), via `next/font/google`. Use tabular numerals for figures.
- Feel: research portal, clear data hierarchy, tables and charts first-class.

## Key sections

Working papers and labor-reform analysis; research lines (collective bargaining, social security, digital platforms, gender and work); court interventions (Corte Constitucional, Corte Suprema de Justicia); labor data dashboards.

## Content rules

- Never invent researchers, papers, court cases, docket numbers or data. Unknown items: `[PENDIENTE CONFIRMACIÓN]`.
- Contacts: none confirmed yet. Do not reuse Montenegro & Asociados' contacts unless the client confirms them.
- All copy and datasets live in `src/content/` and `src/data/`, with source and date per dataset.

## Stack

Next.js 16 App Router, React 19, Tailwind v4 (`@theme` tokens), TypeScript. Its own git repo and its own Vercel project. Charts library is decided in its own plan, when real data exists. Checks: `npm run lint`, `npm run build`.
