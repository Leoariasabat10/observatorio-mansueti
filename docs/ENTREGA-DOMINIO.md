# Entrega y conexión del dominio

Guía para conectar el dominio definitivo del Observatorio cuando se compre. No contiene credenciales: las cuentas (registrador, Vercel, GitHub) las maneja quien sea su titular.

Hoy el sitio vive en `https://observatorio-mansueti.vercel.app` (proyecto Vercel `observatorio-mansueti`, equipo `sabatcompany`).

## 1. El único archivo que se cambia

`site.config.ts`, en la raíz del proyecto:

```ts
url: "https://observatorio-mansueti.vercel.app",  // ← reemplazar por https://DOMINIO-FINAL (sin barra al final)
```

De ese valor salen la URL canónica de cada página, las etiquetas Open Graph, los datos estructurados (Organization, Event, ScholarlyArticle), `sitemap.xml` y `robots.txt`. No hay otra referencia al dominio en el código (comprobado con una búsqueda de `vercel.app` en `src/` y `public/`; la única coincidencia es el enlace al sitio de la Asociación, que es otro proyecto).

Después del cambio: `npm run lint && npm run check && npm run build`, y desplegar.

## 2. Agregar el dominio en Vercel

1. Vercel → proyecto `observatorio-mansueti` → **Settings → Domains → Add**.
2. Agregar los dos: `DOMINIO-FINAL` y `www.DOMINIO-FINAL`.
3. Elegir cuál es el principal (recomendado: sin `www`) y marcar el otro como **Redirect to** el principal (308).

## 3. Registros DNS (en el registrador donde se compró el dominio)

Vercel muestra los valores exactos al agregar el dominio; usar esos si difieren de estos, que son los generales de Vercel:

| Tipo | Nombre / host | Valor |
|---|---|---|
| A | `@` (dominio raíz) | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

- Borrar cualquier otro registro A o AAAA de `@` y cualquier CNAME previo de `www` (los de "parking" del registrador).
- No tocar los registros MX ni TXT si el dominio tendrá correo.
- Si Vercel pide un registro TXT `_vercel` de verificación (pasa cuando el dominio ya estuvo en otra cuenta de Vercel), agregarlo tal como lo muestra.
- Alternativa: delegar el dominio completo a Vercel cambiando los nameservers a `ns1.vercel-dns.com` y `ns2.vercel-dns.com`. Solo si nadie más administra ese DNS (por ejemplo, el correo).

La propagación suele tardar minutos; puede llegar a 48 horas.

## 4. Verificar HTTPS

- En **Settings → Domains**, ambos dominios deben quedar en "Valid Configuration". Vercel emite el certificado SSL solo.
- Abrir `https://DOMINIO-FINAL`: candado sin advertencias.
- Desde una terminal: `curl -I https://DOMINIO-FINAL` → `HTTP/2 200`.
- `curl -I http://DOMINIO-FINAL` → redirección `308` a `https://`.

## 5. Verificar la redirección de `www`

- `curl -I https://www.DOMINIO-FINAL` → `308` con `location: https://DOMINIO-FINAL/`.
- Probar también una ruta interna: `https://www.DOMINIO-FINAL/actualidad` debe terminar en `https://DOMINIO-FINAL/actualidad`.
- Las URL anteriores (`/investigacion`, `/documentos`, `/intervenciones`, `/datos`) siguen redirigiendo por `vercel.json`.

## 6. Sitemap, robots y Search Console

1. `https://DOMINIO-FINAL/robots.txt` debe terminar en `Sitemap: https://DOMINIO-FINAL/sitemap.xml` y bloquear `/admin`.
2. `https://DOMINIO-FINAL/sitemap.xml`: todas las URL deben empezar por el dominio final (si aparece `vercel.app`, falta el paso 1).
3. Google Search Console → **Agregar propiedad → Dominio** → verificar con el registro TXT que indica Google (se agrega en el registrador, igual que en el paso 3).
4. **Sitemaps** → enviar `sitemap.xml`.
5. Inspeccionar `https://DOMINIO-FINAL/` y pedir indexación.
6. Opcional: en Vercel, **Settings → Deployment Protection**, confirmar que el dominio de producción es público.

## 7. Comprobar Open Graph (vista previa al compartir)

- Pegar la URL en <https://www.opengraph.xyz/> o en el depurador de Facebook (<https://developers.facebook.com/tools/debug/>), y pulsar "Scrape Again" para refrescar la caché.
- Revisar Inicio, `/programa-academico/2026-12-04-vision-laboral-multipais` (debe mostrar el afiche) y una entrada de Actualidad.
- WhatsApp guarda caché de vistas previas: probar con una URL nueva o con `?v=1` al final.

## 8. Después de conectar

- El dominio `observatorio-mansueti.vercel.app` sigue funcionando; Vercel lo mantiene. Las canónicas ya apuntan al dominio final, así que no compite en buscadores.
- Editor `/admin`: cuando exista el repositorio en GitHub, actualizar `repo:` en `public/admin/config.yml` (hoy `ORGANIZACION/observatorio-asdtss`).
- Transferencia: el proyecto de Vercel y el repositorio pueden pasarse a la cuenta de la clienta desde **Settings → Transfer** (Vercel) y **Settings → Transfer ownership** (GitHub).

## Lo que no va en el repositorio

Códigos de recuperación, tokens, contraseñas y archivos `.env` nunca se suben. `.gitignore` y `.vercelignore` excluyen los archivos privados de la raíz (`*.txt`, `*.xlsx`, `*.docx`, `*.zip`, `*.jfif`, `*recovery-codes*`) y las carpetas de trabajo.
