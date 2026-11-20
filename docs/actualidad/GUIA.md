# Guía: Actualidad desde Facebook

## Qué hace
Lee, desde Chrome y como lo haría una persona, las publicaciones del Observatorio y de la ASDTSS, elige las relevantes, guarda su foto y deja **borradores** revisables. Nada se publica solo.

## Qué debe estar activo
- Chrome abierto, con la extensión Claude in Chrome y la sesión de Facebook iniciada. Recomendado: un perfil de Chrome dedicado que solo tenga Facebook.
- Claude Code abierto en `projects/observatorio-mansueti`, rama `feat/actualidad-chrome`.
- Si Facebook pide contraseña, código o CAPTCHA, el agente se detiene: complétalo tú en Chrome.

## Ejecutar
En Claude Code: *"Usa el skill actualidad-facebook: revisa las novedades de las dos páginas"*. Primero hace **dry-run** (muestra qué elegiría y por qué, sin escribir nada).

## Revisar
1. Aprueba la tanda → el agente corre con `--escribir`: crea borradores en `src/content/actualidad/`, imágenes en `public/actualidad/` (originales en `data/actualidad/originales/`) y la bandeja `docs/actualidad/revision/index.html` (ábrela en el navegador).
2. En cada borrador cambia `estado` a `publicado` (o usa el editor `/admin` cuando exista) para que salga en el sitio. `revision` = hay una duda anotada en `motivo_decision`.
3. Vista previa local de los borradores en el sitio: en PowerShell, `$env:ACTUALIDAD_VISTA_PREVIA="1"; npm run build`, y sirve la carpeta `out` (python -m http.server 4173 --bind 127.0.0.1). Muestra una franja de aviso y la etiqueta de estado. No lo uses para desplegar.
4. `npm run build` (sin esa variable) valida todo: un archivo mal formado detiene el build.

## Imágenes
Solo con permiso: fotos propias del Observatorio, o de la ASDTSS que la Asociación pueda reutilizar. Si es de un tercero o no está claro, la entrada queda en revisión sin imagen. Cada imagen lleva crédito y texto alternativo factual.

## Llegar a producción
Los cambios aprobados se hacen commit en la rama y se despliegan con el comando habitual de Vercel (`npx vercel deploy --prod --yes --scope sabatcompany`) que ejecutas tú. No hay despliegue automático.

## Modo automático
Bloqueado. Solo tras aprobar la primera tanda: pon `"modo": "automatico"` y `"aprobado_automatico": true` en `actualidad.config.json`. Aun así, dudosos, imágenes sin permiso claro y datos incompletos siguen en revisión.

## Ejecución periódica
No se promete: el acceso depende de Chrome abierto y sesión viva, y un Programador de tareas de Windows no lo garantiza sin `--dangerously-skip-permissions`, que no se usa. Se ejecuta a mano con el comando de arriba.

## Riesgo de cuenta (en claro)
Los Términos de Meta limitan el acceso automatizado, aunque haya sesión iniciada. Meta podría pedir verificación o restringir la cuenta. Por eso el agente lee poco (máx. 15 publicaciones por página y vez), solo lee, va despacio y se detiene ante cualquier aviso. Úsalo con una cuenta que puedas arriesgar.
