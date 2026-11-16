# Contrato de datos (localStorage)

Todas las claves llevan el prefijo `bm_`. **Cada dato lo escribe solo su dueño**, con sus funciones
`obtenerX` / `crearX` / `editarX` / `borrarX`. Los demás lo leen con esas funciones: para eso cargan el archivo del
dueño antes del suyo. Si necesitas cambiar un dato ajeno, anótalo como «pedido» en tu informe.

Un dueño puede **añadir** campos a su dato, pero no quitar ni renombrar los que están aquí.

## Orden de carga de scripts

Siempre con `<script src="..." defer>` (sin `type="module"`):

```html
<script src="../../js/localstorage.js" defer></script>
<script src="../../js/auth.js" defer></script>
<script src="../../js/notificaciones.js" defer></script>  <!-- en toda página con cabecera -->
<!-- archivos de otras personas que necesites -->
<script src="../../js/tu-archivo.js" defer></script>      <!-- el tuyo, al final -->
```

- `<body data-rol="estudiante">`, `"lider"` o `"publico"`: `auth.js` redirige a `auth/iniciar-sesion.html` si no hay sesión o el rol no coincide.
- `notificaciones.js` va en **toda página con cabecera** (así la campana muestra el contador). Si una página no lo carga, no falla: solo no hay contador.
- La cabecera (`.header__usuario`) se rellena sola: iniciales en `.avatar`, `LV n` en `.header__chip` del estudiante.
- Cualquier `<a>` con `data-accion="cerrar-sesion"` (o con el texto «Cerrar sesión») borra la sesión y sigue su `href`.
- No repitas nombres de `const` o `function` entre archivos de la misma página.

## Funciones de P1 que pueden usar los demás

| Función | Archivo | Qué hace |
|---|---|---|
| `obtenerSesion()` | auth.js | `{ nombre, correo, rol }` del usuario en sesión, o `null` |
| `obtenerUsuarioActual()` | auth.js | el usuario completo de la sesión, o `null` |
| `obtenerUsuarios()` / `editarUsuario(correo, cambios)` | auth.js | lista de usuarios / cambia nombre o contraseña (no correo ni rol) |
| `obtenerIniciales(nombre)` | auth.js | «Tomás Campos» → «TC» |
| `sumarXp(correo, puntos)` | auth.js | suma XP y devuelve el total nuevo |
| `obtenerXp(correo)` | auth.js | XP total (número) |
| `calcularNivelNumero(xp)` | auth.js | número de nivel para el chip «LV n» (100 XP por nivel) |
| `crearNotificacion(correo, texto, opciones)` | notificaciones.js | ver «Notificaciones» |
| `contarNoLeidas(correo)` | notificaciones.js | notificaciones sin leer |
| `obtenerNivel(correo)` | prueba.js | `"Principiante"`, `"Intermedio"`, `"Avanzado"` o `null` si no hizo la prueba |
| `obtenerResultadoPrueba(correo)` | prueba.js | resultado completo de la prueba |
| `escaparHtml(texto)` | localstorage.js | obligatoria para todo texto del usuario que se pinte con `innerHTML` |
| `reiniciarDatos()` | localstorage.js | borra todas las claves `bm_` (menos `bm_clave_api`) |

## Cuentas de ejemplo

Contraseñas de demostración, sin seguridad real. Están en `usuariosIniciales` (`js/auth.js`).

| Correo | Contraseña | Rol | Nombre |
|---|---|---|---|
| estudiante1@branchmatch.test | estudiante123 | estudiante | Tomás Campos |
| estudiante2@branchmatch.test | estudiante123 | estudiante | Ana Gutiérrez |
| lider1@branchmatch.test | lider1234 | lider | Edson Mendiolaza |
| lider2@branchmatch.test | lider1234 | lider | Jack Lima |
| lider3@branchmatch.test | lider1234 | lider | Valeria Ríos |
| lider4@branchmatch.test | lider1234 | lider | Camila Torres |
| lider5@branchmatch.test | lider1234 | lider | Marco Peña |

Cada party de ejemplo debería tener su propio líder (`lider1` … `lider5`). `correo` es la **llave** que une todos los datos
de una persona: los demás archivos guardan el `correo`, nunca el nombre.

## Claves

Las formas de P2, P3 y P4 son una **propuesta de P1** para que nadie se bloquee; su dueño puede ajustarla
(añadiendo campos) y avisar en su informe. Los ids son números: `Math.max(0, ...ids) + 1`.

### P1 · Entrada (ya implementado)

| Clave | Dueño | Forma |
|---|---|---|
| `bm_lista_usuarios` | P1 · auth.js | `[{ nombre, correo, contrasena, rol }]`, `rol`: `"estudiante"` o `"lider"`. Crear cuenta siempre crea `"estudiante"` |
| `bm_sesion_actual` | P1 · auth.js | `{ nombre, correo, rol }` o no existe si no hay sesión |
| `bm_xp` | P1 · auth.js (solo `sumarXp`) | `[{ correo, puntos }]` |
| `bm_notificaciones` | P1 · notificaciones.js | `[{ id, correo, tipo, titulo, texto, datos: [{ nombre, valor }], enlace, textoEnlace, leida, fecha }]` |
| `bm_resultados_prueba` | P1 · prueba.js | `[{ id, correo, correctas, total, puntaje, nivel, segundos, xpGanado, temasFuertes: [], temasDebiles: [], fecha }]`, uno por estudiante |
| `bm_prueba_en_curso` | P1 · prueba.js | `{ correo, inicio, respuestas: { "1": "C" } }`, temporal |

**Notificaciones.** `crearNotificacion(correo, texto, opciones)`; `opciones` es opcional:

```js
crearNotificacion("estudiante1@branchmatch.test", "El líder aceptó tu solicitud.", {
  tipo: "aceptada",                     // aceptada | rechazada | expirada | nueva | reto | correccion | aviso (por defecto)
  titulo: "¡Bienvenido/a al equipo!",
  datos: [{ nombre: "Grupo", valor: "Los Chacales" }, { nombre: "Líder", valor: "Jack Lima" }],
  enlace: "estudiante/party-completa.html",   // ruta desde pages/, nunca desde tu carpeta
  textoEnlace: "Ir al espacio del grupo",
});
```

`xp` y rendimiento: P1 solo guarda los puntos (`sumarXp`); **P4 decide cuántos puntos da cada reto** y calcula el rendimiento.

### P2 · Perfiles y party

| Clave | Dueño | Forma propuesta |
|---|---|---|
| `bm_perfiles` | P2 · perfil.js | `[{ correo, usuario, descripcion, lenguajes: [], disponibilidad, avatar, logros: [] }]`, uno por usuario (estudiante o líder) |
| `bm_lista_parties` | P2 · party.js | `[{ id, correoLider, nombre, descripcion, nivel, cupo, horarios: [{ dia, desde, hasta }], integrantes: [correo] }]` |
| `bm_solicitudes` | P2 · party.js | `[{ id, idParty, correoEstudiante, estado, fecha }]`, `estado`: `"pendiente"`, `"aceptada"`, `"rechazada"` o `"expirada"` |
| `bm_mensajes` | P2 · chat.js | `[{ id, idParty, correoAutor, texto, fecha }]` |
| `bm_clave_api` | P2 · agent.js (opcional) | texto; lo escribe el usuario en la consola. **Nunca** en el código ni en el repositorio |

El nivel de un estudiante **no** se guarda en el perfil: se lee con `obtenerNivel(correo)` (prueba.js).

### P3 · Feed y lecciones

| Clave | Dueño | Forma propuesta |
|---|---|---|
| `bm_publicaciones` | P3 · publicaciones.js | `[{ id, correoAutor, texto, fecha, megusta: [correo], comentarios: [{ id, correoAutor, texto, fecha }] }]` |
| `bm_preguntas_comunidad` | P3 · comunidad.js | `[{ id, correoAutor, titulo, texto, fecha, respuestas: [{ id, correoAutor, texto, fecha }] }]` |
| `bm_clases` | P3 · calendario.js | `[{ id, correoLider, titulo, fecha, hora, link }]` (`fecha` `"2026-11-20"`, `hora` `"18:00"`) |
| `bm_temas` | P3 · temas.js | `[{ id, titulo, descripcion }]` |
| `bm_subtemas` | P3 · temas.js | `[{ id, idTema, titulo, orden, linkGrabacion, pdfs: [{ nombre, url }] }]` |
| `bm_lecciones` | P3 · lecciones.js | `[{ id, idSubtema, titulo, contenido }]` |
| `bm_progreso_lecciones` | P3 · lecciones.js | `[{ correo, idLeccion }]` (lecciones vistas) |

### P4 · Retos y rendimiento

| Clave | Dueño | Forma propuesta |
|---|---|---|
| `bm_retos` | P4 · retos.js | `[{ id, correoLider, tipo, titulo, descripcion, dificultad, xp, estado, opciones: [{ texto, correcta }] }]`, `tipo`: `"codigo"` o `"opcion-multiple"`; `estado`: `"borrador"` o `"publicado"` |
| `bm_entregas` | P4 · entregas.js | `[{ id, idReto, correoEstudiante, respuesta, estado, comentario, fecha }]`, `estado`: `"pendiente"`, `"aprobada"` o `"correccion"` |

Para aprobar una entrega, `revisar-entrega` llama a `sumarXp(correoEstudiante, reto.xp)` y a `crearNotificacion(correoEstudiante, ...)`.

## Reiniciar los datos

- Abrir `pages/auth/iniciar-sesion.html?reiniciar=1`: borra las claves `bm_` y deja los datos de ejemplo.
- O, en la consola del navegador: `reiniciarDatos()`.
- Si cambias los datos de ejemplo (`xxxIniciales`) de un archivo, reinicia: lo ya guardado en localStorage tiene prioridad.
