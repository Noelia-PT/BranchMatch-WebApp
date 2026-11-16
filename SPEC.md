# BranchMatch

Plataforma web responsiva orientada a la formación y emparejamiento (matching) de equipos de práctica en
programación competitiva.

## Datos
- Figma: https://www.figma.com/design/i9UTNn3TEpbD6kSEtZVvRw/TRABAJO-OFICIAL-IHC?node-id=2936-4514
  (archivo `TRABAJO-OFICIAL-IHC`, clave `i9UTNn3TEpbD6kSEtZVvRw`).
- Páginas del archivo: **Mockups** (escritorio, 1440 px), **mockups celular** (móvil, 412 px),
  **diagramas de flujo**, **Guía de estilos**.
- UI: HTML y CSS, más JavaScript vanilla para la lógica (ver «Alcance» y «JavaScript»).

## Cómo trabajar
Haz solo la pantalla que te pida. Léela en el Figma (escritorio y móvil), impleméntala y verifica que se vea bien
al abrirla en el navegador a 1440 px y a 412 px.
Al terminar, lista los archivos creados y qué quedó pendiente.
No cambies las variables ni los estilos de otras pantallas.

## Estructura
Estructura real del proyecto (52 páginas HTML):

```
├── index.html                # 01 Landing (la única página fuera de pages/)
├── README.md                 # Guía del proyecto y del trabajo en equipo
├── SPEC.md                   # Este documento: alcance y reglas
├── css/
│   └── styles.css            # Único CSS: fuentes, variables, reset, base, componentes y una sección por persona
├── js/                       # JavaScript vanilla: un archivo por tema (ver «JavaScript») y CONTRATO-DATOS.md
├── assets/
│   ├── fonts/                # Pixelify Sans y Poppins (archivos locales) + OFL.txt
│   ├── icons/                # Íconos SVG de la guía de estilos y de cada pantalla
│   └── img/                  # Logo, fondo de estrellas, Popa (PNG y GIF animados), fondos y fotos de ejemplo
└── pages/
    ├── auth/                 #  2 páginas · pantallas 02-03
    ├── prueba/               #  4 páginas · pantallas 04-08
    ├── estudiante/           # 19 páginas · pantallas 09-34
    └── lider/                # 26 páginas · pantallas 35-61 (+ comunidad, chat, notificaciones, personaliza perfil y publicaciones del líder)
```
Un grupo es un conjunto de pantallas que comparten el mismo aspecto (cabecera y pie).
`estudiante` y `lider` usan la cabecera común (`.header`) con su menú; `prueba` usa la misma cabecera (sin menú en las preguntas);
el landing usa una variante (`.landing-header`) y `auth` lleva su propia cabecera (`.auth-header`).

Las páginas están nombradas en minúsculas y con guiones (`crear-reto-codigo.html`).
La lista pantalla por pantalla, con su número del Figma y su responsable, está en el `README.md`.

### Numeración de pantallas
El Figma numera 61 pantallas. Hay 52 páginas porque algunas pantallas son **estados de otra página**
(7, 15, 16, 28, 30, 46, 49 y 54; ver «Pantallas alternativas»). Los números **25, 31, 32, 47, 50 y 53**
no tienen página ni estado en el proyecto (pendiente confirmar con el Figma si existen).

## Alcance
El HTML y el CSS dibujan cada pantalla (52 páginas) y el JavaScript les da vida **en el navegador**: no hay servidor ni
base de datos. Todo funciona con datos de ejemplo y `localStorage`.

- **Sí:** HTML semántico, CSS, `<form>` con atributos de validación (`required`, `type="email"`, `minlength`), navegación con `<a href>` y JavaScript vanilla según las reglas de la sección «JavaScript».
- **No:** frameworks, librerías, CDNs, preprocesadores ni peticiones a internet (solo `js/agent.js`, opcional, llama a una API; su clave nunca va en el código).
- Los datos de ejemplo viven dentro de cada archivo `.js` (`xxxIniciales`) y lo que crea el usuario se guarda en `localStorage`.
- Si dudas, pregunta.

## JavaScript
Mismo estilo que el proyecto demo del curso: un archivo por tema, con `const` y funciones globales, sin frameworks ni espacio de nombres.

- **Archivos** (`js/`): `localstorage.js`, `auth.js`, `prueba.js`, `notificaciones.js` (P1) · `perfil.js`, `party.js`, `chat.js`, `agent.js` opcional (P2) · `feed.js`, `publicaciones.js`, `comunidad.js`, `calendario.js`, `lecciones.js`, `temas.js` (P3) · `retos.js`, `resolver.js`, `entregas.js`, `rendimiento.js` (P4). Un mismo archivo sirve a varias páginas: cada evento se enlaza solo si el elemento existe (`if (elemento) { ... }`).
- **Secciones** de cada archivo, en este orden y con estos encabezados exactos (solo las que apliquen): `// ===== Elementos =====`, `// ===== Datos =====`, `// ===== Funciones =====`, `// ===== Validaciones =====`, `// ===== Registro de eventos =====`. Arriba, un comentario de 3 líneas: qué hace, qué páginas lo usan y quién es el responsable.
- **Estilo:** `const` y funciones flecha, comillas dobles, punto y coma, 2 espacios de sangría, nombres en español y en camelCase, comentarios breves en español.
- **Scripts clásicos** con `<script src="..." defer>`, nunca `type="module"` (así funciona con `file://` y en GitHub Pages). Orden: `localstorage.js`, `auth.js`, `notificaciones.js` (si la página tiene cabecera), los archivos de otras personas que necesites y, al final, el propio.
- **Sin** atributos `onclick` ni `style=""`: los eventos se enlazan con `addEventListener` (con delegación en las listas) y los estilos se cambian con clases o con el atributo `hidden`.
- Los archivos comparten el ámbito global: no repitas nombres de `const` o `function` entre archivos de la misma página; usa nombres específicos (`formEvento`, `listaRetos`).
- Todo texto escrito por el usuario que se pinte con `innerHTML` pasa antes por `escaparHtml()`.
- **Datos:** claves con prefijo `bm_`, cada una escrita solo por su dueño con `obtenerX` / `crearX` / `editarX` / `borrarX`. El detalle está en [`js/CONTRATO-DATOS.md`](js/CONTRATO-DATOS.md).
- **Roles:** cada página lleva `<body data-rol="estudiante">`, `"lider"` o `"publico"`. `auth.js` redirige a `auth/iniciar-sesion.html` si no hay sesión o el rol no coincide.
- **Errores de formulario:** se reutilizan `.campo`, `.campo__error` y `.campo--error`; antes de borrar algo se pide `confirm()`.


## Reglas
- **Archivos:** un `.html` por pantalla dentro de la carpeta de su grupo en `pages/`, y un solo `css/styles.css` para todo el sitio. Nombres en minúsculas y guiones.
- **HTML:** semántico (`header`, `nav`, `main`, `section`, `footer`), un solo `<h1>` por página (si el Figma no lo muestra, va oculto con `.visualmente-oculto`), `alt` en todas las imágenes (`alt=""` si es decorativa) y `<label>` en cada campo.
- **CSS:** clases con nombres claros (estilo BEM), sin estilos inline ni `!important`. Colores, fuentes y espacios van como variables al inicio de `css/styles.css`, y los estilos de cada pantalla van en su propia sección con un comentario.
  - Cada pantalla usa un **prefijo de clases propio** (por ejemplo `ent__`, `lsub__`) y su CSS es autocontenido.
  - Un color del Figma que no esté en `:root` se declara como variable local al inicio de la pantalla (`--prefijo-nombre`); no se toca `:root`.
  - No se cambian los componentes comunes (`.boton`, `.tarjeta`, `.chip`, `.campo`, `.header`, `.footer`, `.modal`, `.barra-xp`, `.avatar`, `.visualmente-oculto`…); se reutilizan.
- **Orden del CSS:** al final de `css/styles.css` hay un bloque por persona, separado por estos marcadores, que no se tocan ni se duplican:
  `P1 · Entrada`, `P2 · Perfiles y Party`, `P3 · Feed y Lecciones`, `P4 · Retos y Rendimiento`.
  Cada pantalla abre con un comentario único, por ejemplo `/* --- 60 · Entregas del reto (lider/entregas.html) --- */`.
- **Formularios:** cada campo con su `<label>`, `name` y validación HTML. El mensaje de error va debajo del campo, en el idioma del Figma, con `.campo__error` (con JavaScript, `.campo--error`).
- **Navegación:** todos los botones y enlaces usan `<a href>`, también el que envía un formulario. Lo que no tiene destino va a `href="#"`.
- **Rutas:** son relativas. `index.html` usa `css/styles.css` e `assets/...`. Las páginas de `pages/<grupo>/` usan `../../css/styles.css` e `../../assets/...`. Para ir a otra página de otro grupo: `../estudiante/comunidad.html`; para volver al inicio: `../../index.html`.
- **Landing (index.html):** es una sola página en la raíz, fuera de `pages/`. Lleva su propia cabecera y pie, y sus botones salen hacia los demás grupos.
- **Responsive:** el Figma trae dos diseños por pantalla, escritorio (1440 px) y móvil (412 px). Impleméntalos en el mismo `.html` con `@media` en `css/styles.css`: empieza por el móvil y usa `@media (min-width: 768px)` para el escritorio. Si el escritorio necesita 3 columnas o 2 columnas anchas, añade un tercer corte a `1100px`; entre 768 y 1099 px la pantalla se apila en una columna centrada (`max-width: 636px`). Usa Flexbox o Grid, sin archivos ni páginas aparte para móvil.
- **Diseño:** respeta el Figma en ambos tamaños y usa las variables de `css/styles.css`. Los botones son siempre de esquinas rectas (lo dice el componente del Figma), aunque algún frame los dibuje redondeados.
- **Pantallas alternativas** (error, vacío, resultado, confirmación, modal, acordeón abierto): son estados de la misma pantalla, no páginas nuevas.
  - Se activan con `:target` (`href="#estado"`) y `:has()`, con radios ocultos y `:checked`, o con JavaScript (atributo `hidden`).
  - Los errores de formulario se muestran con `.campo__error`, con `.campo--error` o con `:user-invalid`.
  - Ejemplos reales: `crear-modulo.html#creado`, `editar-tema.html#guardado`, `reto-codigo.html#entregado`, `reto-opcion-multiple.html#resultado`, `pregunta-2.html#salir`.
- **Assets:** los íconos e imágenes nuevos llevan el prefijo de su pantalla (`leccion-volver.svg`, `crear-modulo-popa.gif`) para que dos personas no creen el mismo nombre con contenido distinto.
- **Navegadores:** se usan `:has()`, `:target` y `:user-invalid`, por lo que se necesita un navegador reciente (Chrome, Edge, Safari o Firefox actuales).
- Si dudas, pregunta. No inventes pantallas.

## Trabajo en equipo (resumen)
- Ramas: `main` (entrega final), `develop` (integración) y una rama por pantalla con el prefijo de su persona (`p3-subtemas`).
- Los PR van contra `develop`. Cuando varias ramas añaden CSS en el mismo bloque de `styles.css` chocan entre sí:
  se mergean **en orden** y con **«Create a merge commit»** (nunca Squash ni Rebase). El detalle está en el `README.md`.
