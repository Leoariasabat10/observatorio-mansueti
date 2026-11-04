# Observatorio ASDTSS "Hugo Roberto Mansueti"

Sitio web del Observatorio de la Asociación Sudamericana de Derecho del Trabajo y de la Seguridad Social (ASDTSS).

Sitio **estático**: no tiene servidor ni base de datos. El contenido vive en archivos de texto dentro de `src/content/`, y cada cambio se publica al volver a generar el sitio.

## Requisitos

- Node.js 20 o superior
- npm

## Correr el sitio en local

```bash
npm install
npm run dev          # http://localhost:3000, con recarga automática
```

Para revisar la versión final, exactamente como se publica:

```bash
npm run build        # genera la carpeta out/
npx serve out        # sirve out/ en http://localhost:3000
```

Verificaciones antes de publicar:

```bash
npm run lint
npm run check        # pruebas de las reglas de hora de Bogotá
npm run build
```

## Configuración: un solo archivo

`site.config.ts` contiene el dominio final, la zona horaria y los datos de la agencia (`AGENCIA_NOMBRE`, `AGENCIA_URL`). Para pasar el sitio al dominio de la clienta, solo se cambia `url` ahí.

Los datos institucionales (nombre, contacto, redes, entidad matriz, menú) están en `src/config/observatorio.ts`.

## Editor visual (para la clienta)

En `/admin` (por ejemplo `https://dominio/admin`; página `public/admin.html`, configuración `public/admin/config.yml`) hay un editor visual, Sveltia CMS (licencia MIT, gratuito). Permite crear y editar webinars, subir afiches y actualizar las cifras del Inicio con formularios, sin tocar código. Cada cambio queda guardado como un commit en el repositorio y Vercel publica el sitio en uno o dos minutos.

Configuración inicial (una sola vez):

1. En `public/admin/config.yml`, cambiar `repo: ORGANIZACION/observatorio-asdtss` por el repositorio real.
2. Entrar con **Iniciar sesión con un token de acceso**: en GitHub, Settings → Developer settings → Fine-grained tokens → nuevo token con acceso solo a este repositorio y permiso *Contents: Read and write*. Copiarlo en el editor. El token queda guardado en ese navegador.
3. Opcional: para entrar con el botón de GitHub sin token, desplegar el conector gratuito [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth) en Cloudflare Workers y añadir `base_url` en `backend`.

Los campos del editor son los mismos de la tabla de abajo. Las listas de ejes y países del editor repiten `src/content/ejes.json` y `src/lib/paises.ts`: al cambiar una, cambiar la otra.

## Cómo agregar un webinar

Crear un archivo nuevo en `src/content/webinars/` con el nombre `AAAA-MM-DD-tema-corto.md`. Ese nombre es también la dirección de la página (`/programa-academico/AAAA-MM-DD-tema-corto`). Plantilla:

```md
---
titulo: "Título del webinar"
fecha: 2026-11-20
hora: "18:00"
duracionMin: 90
ejes: [seguridad-social]
modalidad: virtual
plataforma: Zoom
resumen: "Una o dos frases. Se usa en la lista y al compartir el enlace."
ponentes:
  - { nombre: "Nombre Apellido", rol: "Ponente", institucion: "Universidad", pais: AR }
afiche: /afiches/2026-11-20-tema-corto.webp
aficheAlt: "Afiche del webinar con el título y las fotos de los ponentes"
inscripcion: "https://..."
---
Descripción completa. Admite **negrita**, enlaces y listas.
```

El estado (próximo, en vivo o realizado) se calcula solo, según la fecha y la hora. No hace falta editar el archivo cuando el webinar termina: basta con agregar `grabacion:` cuando exista el enlace.

### Campos

| Campo | Obligatorio | Formato |
|---|---|---|
| `titulo` | sí | Texto |
| `fecha` | sí | `AAAA-MM-DD`, en hora de Bogotá |
| `hora` | sí | `HH:MM` en 24 horas, hora de Bogotá |
| `duracionMin` | no (90) | Minutos; define cuándo deja de estar "en vivo" |
| `ejes` | sí | Lista de ejes de `src/content/ejes.json` (uno o más) |
| `modalidad` | no (virtual) | `virtual`, `presencial` o `hibrida` |
| `plataforma` | no | Por ejemplo `Zoom` o `YouTube` |
| `lugar` | no | Dirección, para modalidad presencial o híbrida |
| `resumen` | sí | Una o dos frases |
| `ponentes` | sí | Lista con `nombre`, `pais` (código de 2 letras: CO, AR, BR…) y, opcionales, `rol`, `cargo`, `institucion`, `foto` |
| `afiche` | no | Ruta de la imagen en `public/afiches/`. Sin afiche se muestra uno compuesto con los datos del webinar |
| `aficheAlt` | si hay afiche | Descripción de la imagen para lectores de pantalla |
| `inscripcion` | no | Enlace de inscripción o de la transmisión |
| `grabacion` | no | Enlace de la grabación |
| `ejemplo` | no | `true` marca contenido de prueba: etiqueta visible, fuera del sitemap y sin indexar |

Si falta un campo obligatorio o tiene un formato inválido, `npm run build` se detiene y dice qué archivo y qué campo corregir.

### Imágenes

Afiches en `public/afiches/`, en WebP, de unos 800×1000 px (proporción 4:5). Un afiche descargado de Facebook se puede convertir y recortar en https://squoosh.app (formato WebP, calidad 85). Nunca agrandar una imagen pequeña: se verá pixelada.

### Ejes temáticos

`src/content/ejes.json`. Son provisionales: se reemplazan por las matrices de ejes de la clienta sin tocar código. Si se cambia el `slug` de un eje, hay que actualizarlo en los webinars que lo usan (la compilación avisa).

### Probar el estado "en vivo"

Agregar `?ahora=2026-11-12T18:30` a cualquier dirección del programa simula ese momento (en hora de Bogotá).

## Cómo agregar una publicación

Crear un archivo en `src/content/publicaciones/` con el nombre `AAAA-MM-DD-tema-corto.md` (o usar el editor, sección *Publicaciones*):

```md
---
titulo: "Título de la publicación"
fecha: 2026-11-20
categoria: documentos
ejes: [seguridad-social]
autores:
  - { nombre: "Nombre Apellido", institucion: "Universidad" }
resumen: "Dos o tres frases."
pdf: /publicaciones/2026-11-20-tema-corto.pdf
---
Texto o presentación de la publicación (opcional).
```

| Campo | Obligatorio | Formato |
|---|---|---|
| `titulo` | sí | Texto |
| `fecha` | sí | `AAAA-MM-DD` |
| `categoria` | sí | `boletines`, `documentos`, `intervenciones` o `datos` (lista en `src/content/categorias.json`) |
| `numero` | no | Número del boletín |
| `ejes` | sí | Uno o más ejes de `src/content/ejes.json` |
| `autores` | sí | Lista con `nombre` y, opcional, `institucion` |
| `resumen` | sí | Dos o tres frases |
| `pdf` | no | Ruta del PDF en `public/publicaciones/`. El tamaño se calcula solo; si el archivo no existe, la compilación avisa |
| `enlace` | no | Fuente original externa |
| `portada` / `portadaAlt` | no | Imagen de portada y su descripción (obligatoria si hay portada) |
| `ejemplo` | no | `true` marca contenido de prueba |

Las intervenciones judiciales deben citar el tribunal, el número de expediente y la fecha tal como constan en el proceso.

## Cifras pendientes (pedir a la clienta, cada una con fuente y fecha)

1. Webinars realizados desde el inicio del programa
2. Ponentes invitados
3. Países representados (ponentes y asistentes)
4. Personas inscritas o asistentes acumulados
5. Horas académicas impartidas
6. Publicaciones y boletines editados
7. Año de fundación del Observatorio y de la ASDTSS

Las cifras del programa académico (webinars, ponentes, países de los ponentes y horas) se calculan solas a partir de los archivos de webinars. Las demás están en `src/content/cifras.json` (o en el editor, sección *Cifras del Inicio*): mientras `valor` esté vacío se muestra "Dato pendiente". Una cifra con valor necesita `fuente`; si falta, la compilación se detiene.

## Despliegue (Vercel)

El repositorio vive en la organización de GitHub de la agencia, y el proyecto en el equipo de Vercel de la agencia.

```bash
# Primera vez: crear el repositorio en la organización y subirlo
git remote add origin git@github.com:ORGANIZACION/observatorio-asdtss.git
git push -u origin main

# En Vercel: New Project → importar el repositorio (equipo de la agencia).
# Framework: Next.js. No requiere variables de entorno.
```

Después, cada `git push` a `main` publica una nueva versión. Las redirecciones de direcciones antiguas están en `vercel.json`.

### Dominio de la clienta

1. Cambiar `url` en `site.config.ts` y publicar.
2. En Vercel: Settings → Domains → agregar el dominio, y configurar en el proveedor del dominio los registros DNS que Vercel indique.

### Transferir a la clienta

El código no depende de cuentas personales. Para entregarlo: transferir el repositorio de GitHub (Settings → Transfer) y el proyecto de Vercel (Settings → Transfer Project) a las cuentas de la clienta.

## Estructura

```
site.config.ts             dominio, zona horaria, agencia
src/content/               contenido editable (webinars, publicaciones, ejes, categorías, cifras)
src/config/observatorio.ts datos institucionales y menú
src/lib/                   lectura y validación del contenido, reglas de hora
src/components/webinar/    piezas del programa académico
src/components/mapa/       mapa de ponentes (SVG generado al compilar)
src/app/                   páginas
scripts/                   verificación y post-compilación
assets-cliente/            originales de la clienta (no se publican)
```

Licencias de terceros: Next.js y React (MIT), Lucide (ISC), d3-geo y topojson (ISC), datos del mapa Natural Earth (dominio público), tipografías Libre Caslon y Archivo (OFL).
