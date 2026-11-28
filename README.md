# BranchMatch · WebApp

**Encuentra tu coding party.** BranchMatch es una plataforma web que conecta a estudiantes que quieren entrenar
programación competitiva con equipos (*parties*) de su mismo nivel y horario, y convierte el entrenamiento en un juego.

> Proyecto académico de estudiantes de la UPC, de los cursos **Interacción Humano-Computador (IHC)** y **Programación Web**.
> Es un prototipo navegable en **HTML, CSS y JavaScript vanilla**: no hay servidor; todo funciona en el navegador con datos de ejemplo y `localStorage`.

## ¿Cómo funciona?

1. **Haces la prueba diagnóstica** y conoces tu nivel: Principiante, Intermedio o Avanzado.
2. **Haces match con una party.** Revisas parties de tu nivel y envías tu solicitud; el líder decide si te une.
3. **Entrenas y subes de nivel.** Asistes a sesiones, resuelves retos y ganas XP junto a tu party.

## Qué incluye

**Para estudiantes**
- Crear cuenta, iniciar sesión y completar y personalizar el perfil (Player Card con nivel, stats, lenguajes y logros).
- Prueba diagnóstica de opción múltiple, con un resultado que muestra tu nivel, tu puntaje, tus fortalezas y los temas por reforzar.
- Buscar parties, enviar solicitudes y ver notificaciones.
- Mi party: integrantes, chat y calendario de clases.
- Lecciones por tema, con subtemas y video de la clase.
- Retos de código y de opción múltiple, con estado de entrega y resultado.
- Resumen de rendimiento, comunidad e inicio con feed de publicaciones.

**Para líderes**
- Perfil de líder, creación y edición de la party, y revisión de solicitudes.
- Player Card de cada integrante.
- Calendario de clases y gestión de lecciones: crear módulos, editar temas y añadir grabaciones y PDFs a cada subtema.
- Retos: crear (de código o de opción múltiple), publicar, ver entregas y revisarlas.
- Panel principal y resumen de rendimiento grupal.

En total son **52 páginas**, cada una con su versión de escritorio y de móvil.

## Ver el proyecto

No hace falta instalar nada: abre **`index.html`** en un navegador reciente (Chrome, Edge, Safari o Firefox).

Para probar bien las rutas, sirve la carpeta con un servidor local:

```bash
python -m http.server 8765
```

y entra a `http://127.0.0.1:8765/`. También funciona la extensión **Live Server** de VS Code.

### Cómo entrar

Entra desde `pages/auth/iniciar-sesion.html` con el correo (o el nombre de usuario) y la contraseña. **El rol sale de la cuenta**:
un estudiante va a `pages/estudiante/inicio.html` y un líder a `pages/lider/panel.html`. Cada rol solo ve sus páginas: si abres
una del otro rol, te devuelve al inicio de sesión. Para cambiar de cuenta, usa «Cerrar sesión» en el perfil.

Cuentas de ejemplo (demostración, sin seguridad real):

| Rol | Correo | Contraseña |
|---|---|---|
| Estudiante | `estudiante1@branchmatch.test` | `estudiante123` |
| Líder | `lider1@branchmatch.test` | `lider1234` |

Hay otro estudiante (`estudiante2@...`) y cuatro líderes más (`lider2@...` a `lider5@...`); la lista completa está en
[`js/CONTRATO-DATOS.md`](js/CONTRATO-DATOS.md). «Crear cuenta» siempre crea un **estudiante** y lo lleva a la prueba diagnóstica.

### Reiniciar los datos

Los datos que creas (cuentas, notificaciones, resultados…) se guardan en el `localStorage` de tu navegador. Para volver a los datos
de ejemplo, abre `pages/auth/iniciar-sesion.html?reiniciar=1` o escribe `reiniciarDatos()` en la consola del navegador.

Los estados de una pantalla (resultados, confirmaciones, ventanas emergentes) se activan con enlaces,
por ejemplo `pages/lider/crear-modulo.html#creado`.

## Estructura

```
├── index.html          # Landing
├── css/styles.css      # Estilos de todo el sitio
├── js/                 # JavaScript vanilla (un archivo por tema) y CONTRATO-DATOS.md
├── assets/
│   ├── fonts/          # Pixelify Sans y Poppins
│   ├── icons/          # Íconos SVG
│   └── img/            # Logo, fondos y la mascota Popa
└── pages/
    ├── auth/           # Crear cuenta e iniciar sesión (2)
    ├── prueba/         # Prueba diagnóstica (4)
    ├── estudiante/     # Pantallas del estudiante (19)
    └── lider/          # Pantallas del líder (26)
```

## Diseño

- **Figma:** [TRABAJO-OFICIAL-IHC](https://www.figma.com/design/i9UTNn3TEpbD6kSEtZVvRw/TRABAJO-OFICIAL-IHC), con escritorio a 1440 px y móvil a 412 px.
- **Estilo:** pixel art con aire de videojuego arcade, sobre fondo azul noche con un fondo de estrellas.
- **Paleta:** fondo `#12163A`, superficies `#232A63`, amarillo `#FFD230`, celeste `#90D3FA`, menta `#B9E8C8` y rosa `#F994AB`.
- **Tipografías:** [Pixelify Sans](https://fonts.google.com/specimen/Pixelify+Sans) para títulos y botones y [Poppins](https://fonts.google.com/specimen/Poppins) para el texto. Ambas se incluyen en `assets/fonts/` (licencia SIL OFL).
- **Mascota:** Popa, la líder de la party.
- **Responsive:** se diseña primero para móvil y se adapta a escritorio.

Las reglas del proyecto y la numeración de pantallas están en [`SPEC.md`](SPEC.md).

## Tecnologías

HTML5 semántico, CSS3 (Flexbox y Grid) y JavaScript vanilla con `localStorage`. Sin frameworks, librerías ni CDNs.

## Equipo

Estudiantes de la UPC, cursos IHC y Programación Web:

- Jack Lima
- Noelia Paquiñauri
- Edson Ramos
- Addy Pinedo