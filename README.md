# BranchMatch · WebApp

Plataforma web responsiva para formar equipos (parties) de práctica en programación competitiva.
Solo HTML y CSS: sin JavaScript, frameworks ni CDNs.

## Estructura

```
├── index.html              # 01 Landing
├── css/styles.css          # Único CSS: variables, reset, componentes y una sección por persona
├── js/                     # Vacía
├── assets/
│   ├── fonts/              # Pixelify Sans y Poppins (locales)
│   ├── icons/              # Íconos pixel de la guía de estilos (SVG)
│   └── img/                # Logo, fondo de estrellas, Popa…
└── pages/
    ├── auth/               # 02–03
    ├── prueba/             # 04–08
    ├── estudiante/         # 09–34
    └── lider/              # 35–61
```

Cada página ya tiene su `<head>`, cabecera, pie, el `<h1>` y la lista «Lleva a →» con los enlaces que pide el Figma.
Al empezar una pantalla, usa esos enlaces en los botones y borra la lista.

## Cómo trabajar

1. `git pull origin develop` antes de empezar.
2. Trabaja en tu rama: `p1-entrada`, `p2-party`, `p3-lecciones`, `p4-retos`.
3. En `css/styles.css` escribe **solo dentro de tu bloque** (sección 6) y pon un comentario por pantalla.
   No cambies las variables ni los componentes comunes; si falta algo, pídeselo a P1.
4. Mobile first: estilos de móvil primero y `@media (min-width: 768px)` para escritorio.
5. Abre la página en el navegador a 375 px y a 1440 px y prueba sus enlaces antes del pull request.

## Componentes listos (styles.css, sección 5)

| Clase | Uso |
|---|---|
| `.contenedor` | Ancho máx. 1200 px centrado |
| `.titulo-display`, `.titulo-1`, `.titulo-2`, `.titulo-3` | Display 64, H1 44, H2 32, H3 22 |
| `.boton`, `--secundario`, `--peligro`, `--deshabilitado`, `--bloque` | Botones (siempre `<a href>`) |
| `.tarjeta` | Superficie con borde 4 px y sombra pixel celeste |
| `.chip`, `--amarillo`, `--celeste`, `--menta`, `--rosa`, `--logro`, `--opcional`, `--pdf` | Chips y etiquetas |
| `.etiqueta-seccion` | Rótulos verdes tipo «ESPECIALIDAD» |
| `.barra-xp` (+ `__relleno--25/50/60/75/100`) | Barra de XP |
| `.avatar`, `.avatar--grande` | Iniciales con borde celeste |
| `.formulario`, `.campo`, `__label`, `__input`, `__ayuda`, `__error`, `.campo--error` | Formularios |
| `.toast`, `.banner-error` | Mensajes |
| `.modal` | Pop-up sin JS: `<a href="#id">` lo abre y `<a href="#">` lo cierra |
| `.popa` | Imagen pixel de la mascota |

### Formulario con error

```html
<div class="campo">
  <label class="campo__label" for="nombre">Nombre del tema</label>
  <input class="campo__input" id="nombre" name="nombre" type="text" required minlength="3">
  <p class="campo__error">Escribe un nombre para el tema.</p>
</div>
```

El mensaje aparece solo cuando el campo es inválido, y siempre con `.campo--error`.

## Pendiente

- Imágenes de cada pantalla (Popa en sus estados, fondo del landing y de auth): expórtalas del Figma a `assets/img/`
  con nombres en minúsculas y guiones (`popa-exito.png`, `popa-buscando.png`…).
- `fondo-estrellas.png` es provisional; se puede reemplazar por el del Figma con el mismo nombre.
