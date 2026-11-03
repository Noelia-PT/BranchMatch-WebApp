# BranchMatch 

Plataforma web responsiva orientada a la formación y emparejamiento (matching) de equipos de práctica en 
programación competitiva.

## Datos
- Figma: https://www.figma.com/design/i9UTNn3TEpbD6kSEtZVvRw/TRABAJO-OFICIAL-IHC?node-id=2936-4514&t=Aijn1LCPpBB5nrlq-1 
- UI: HTML y CSS puro 

## Cómo trabajar 
Haz solo la pantalla que te pida. Léela en el Figma, impleméntala y verifica que se vea bien al abrirla en el navegador.
Al terminar, lista los archivos creados y qué quedó pendiente.
No cambies las variables ni los estilos de otras pantallas.

## Estructura
Sigue la siguiente estructura:

```
├── index.html                # 01 Landing
├── css/styles.css            # Único CSS: variables, reset, componentes y una sección por persona
├── js/                       # Vacía
├── assets/
│   ├── fonts/                # Pixelify Sans y Poppins (locales)
│   ├── icons/                # Íconos pixel de la guía de estilos (SVG)
│   └── img/                  # Logo, fondo de estrellas, Popa…
└── pages/
    ├── auth/                 # 02-03
    ├── prueba/               # 04-08
    ├── estudiante/           # 09-34
    └── lider/                # 35-61
```
Un grupo es un conjunto de pantallas que comparten el mismo aspecto (cabecera y pie).

## Alcance
Solo dibuja cada pantalla y conéctala: formularios con sus campos, listas con datos de ejemplo
y enlaces entre pantallas. La lógica no existe en este proyecto.

- **Sí:** HTML semántico, CSS, `<form>` con atributos de validación (`required`, `type="email"`, `minlength`), listas con datos de ejemplo fijos, navegación con `<a href>`.
- **No:** JavaScript (la carpeta `js/` queda vacía; ni `<script>` ni `onclick`), frameworks, librerías, CDNs ni preprocesadores. No calcules, filtres ni busques. Usa los valores del Figma, tal cual.
- Contadores, chips y buscadores: déjalos dibujados, sin comportamiento.
- Si dudas, déjalo fijo.


## Reglas
- **Archivos:** un `.html` por pantalla dentro de la carpeta de su grupo en `pages/`, y un solo `css/styles.css` para todo el sitio. Nombres en minúsculas y guiones.
- **HTML:** semántico (`header`, `nav`, `main`, `section`, `footer`), un solo `<h1>` por página, `alt` en todas las imágenes y `<label>` en cada campo.
- **CSS:** clases con nombres claros (estilo BEM), sin estilos inline ni `!important`. Colores, fuentes y espacios van como variables al inicio de `css/styles.css`, y los estilos de cada pantalla van en su propia sección con un comentario.
- **Formularios:** cada campo con su `<label>`, `name` y validación HTML. El mensaje de error va debajo del campo, en el idioma del Figma.
- **Navegación:** todos los botones y enlaces usan `<a href>`, también el que envía un formulario.
- **Rutas:** son relativas. `index.html` usa `css/styles.css` e `assets/...`. Las páginas de `pages/<grupo>/` usan `../../css/styles.css` e `../../assets/...`. Para ir a otra página de otro grupo: `../estudiante/events.html`; para volver al inicio: `../../index.html`.
- **Landing (index.html):** es una sola página en la raíz, fuera de `pages/`. Lleva su propia cabecera y pie, y sus botones salen hacia los demás grupos.
- **Responsive:** el Figma trae dos diseños por pantalla, escritorio y móvil. Impleméntalos en el mismo `.html` con `@media` en `css/styles.css`: empieza por el móvil y usa `@media (min-width: 768px)` para el escritorio. Usa Flexbox o Grid, sin archivos ni páginas aparte para móvil.
- **Diseño:** respeta el Figma en ambos tamaños y usa las variables de `css/styles.css`.
- **Pantallas alternativas** (error, vacío, rechazo): son estados de la misma pantalla, no páginas nuevas. Por ahora solo los errores de formulario.
- Si dudas, pregunta. No inventes pantallas.


