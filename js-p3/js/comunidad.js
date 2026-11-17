// Comunidad: preguntas (bm_preguntas_comunidad), respuestas, me gusta, buscador y tendencias.
// Páginas: estudiante/comunidad y lider/comunidad (perfil.js es opcional, para los nombres de usuario).
// Responsable: P3 (Feed y lecciones).

// ===== Elementos =====
const feedComunidad = document.querySelector(".cmu__feed");
const formComunidad = document.querySelector(".cmu__compositor");
const campoPreguntaComunidad = document.querySelector("#cmu-publicacion");
const botonPublicarComunidad = document.querySelector(".cmu__publicar");
const avatarCompositorComunidad = document.querySelector(".cmu__compositor .cmu__avatar");
const etiquetasComunidad = document.querySelector(".cmu__etiquetas");
const listaTendenciasComunidad = document.querySelector(".cmu__tend-lista");


// ===== Datos =====
const CLAVE_PREGUNTAS_COMUNIDAD = "bm_preguntas_comunidad";
const LIMITE_PREGUNTA_COMUNIDAD = 280;
const LIMITE_RESPUESTA_COMUNIDAD = 200;
const etiquetasPreguntaComunidad = ["Pregunta", "Grafos", "DP", "Strings", "Logro"];
const coloresAvatarComunidad = ["rosa", "menta"];

// { id, correoAutor, titulo, texto, etiqueta, fecha, vistas, megusta: [correo], respuestas: [{ id, correoAutor, texto, fecha }] }
const preguntasComunidadIniciales = [
  {
    id: 1, correoAutor: "estudiante1@branchmatch.test", titulo: "Caminos mínimos con Dijkstra",
    texto: "¿Alguien más se trabó con el problema de caminos mínimos de ayer? Comparto mi solución con Dijkstra y una cola de prioridad. Feedback bienvenido.",
    etiqueta: "Grafos", fecha: "2026-11-16T14:00:00.000Z", vistas: 120, megusta: ["estudiante2@branchmatch.test", "lider1@branchmatch.test"],
    respuestas: [
      { id: 1, correoAutor: "lider1@branchmatch.test", texto: "Bien ahí. Ojo: si hay pesos negativos usa Bellman-Ford.", fecha: "2026-11-16T14:30:00.000Z" },
      { id: 2, correoAutor: "estudiante2@branchmatch.test", texto: "¡Me sirvió mucho, gracias!", fecha: "2026-11-16T15:10:00.000Z" },
    ],
  },
  {
    id: 2, correoAutor: "estudiante2@branchmatch.test", titulo: "Top 10 en el concurso interno",
    texto: "¡Llegamos al top 10 del concurso interno con Los Insanos! Gracias party por las sesiones de los jueves.",
    etiqueta: "Logro", fecha: "2026-11-16T11:00:00.000Z", vistas: 300, megusta: ["estudiante1@branchmatch.test"],
    respuestas: [{ id: 1, correoAutor: "estudiante1@branchmatch.test", texto: "¡Vamos Insanos! 🔥", fecha: "2026-11-16T11:20:00.000Z" }],
  },
  {
    id: 3, correoAutor: "lider2@branchmatch.test", titulo: "Dijkstra vs Floyd-Warshall",
    texto: "Solución explicada: ¿cuándo conviene Dijkstra y cuándo Floyd-Warshall? Dejo un resumen con la complejidad de cada uno.",
    etiqueta: "Grafos", fecha: "2026-11-15T20:00:00.000Z", vistas: 280, megusta: [],
    respuestas: [
      { id: 1, correoAutor: "estudiante1@branchmatch.test", texto: "Floyd para n pequeño, Dijkstra para grafos grandes y dispersos, ¿no?", fecha: "2026-11-15T20:40:00.000Z" },
      { id: 2, correoAutor: "lider2@branchmatch.test", texto: "¡Exacto!", fecha: "2026-11-15T21:00:00.000Z" },
      { id: 3, correoAutor: "estudiante2@branchmatch.test", texto: "Gracias por el resumen.", fecha: "2026-11-15T21:30:00.000Z" },
    ],
  },
];

const obtenerPreguntasComunidad = () => leerDatos(CLAVE_PREGUNTAS_COMUNIDAD, preguntasComunidadIniciales);

const obtenerPreguntaComunidad = (id) => obtenerPreguntasComunidad().find((p) => p.id === id) || null;

const crearPreguntaComunidad = (pregunta) => {
  const preguntas = obtenerPreguntasComunidad();
  const ids = preguntas.map((p) => p.id);
  pregunta.id = Math.max(0, ...ids) + 1;
  preguntas.push({ etiqueta: "Pregunta", vistas: 0, megusta: [], respuestas: [], ...pregunta });
  guardarDatos(CLAVE_PREGUNTAS_COMUNIDAD, preguntas);
  return pregunta;
};

const editarPreguntaComunidad = (id, cambios) => {
  const preguntas = obtenerPreguntasComunidad();
  const posicion = preguntas.findIndex((p) => p.id === id);
  if (posicion === -1) return;
  preguntas[posicion] = { ...preguntas[posicion], ...cambios, id };
  guardarDatos(CLAVE_PREGUNTAS_COMUNIDAD, preguntas);
};

const borrarPreguntaComunidad = (id) => {
  guardarDatos(CLAVE_PREGUNTAS_COMUNIDAD, obtenerPreguntasComunidad().filter((p) => p.id !== id));
};

const crearRespuestaComunidad = (idPregunta, respuesta) => {
  const pregunta = obtenerPreguntaComunidad(idPregunta);
  if (!pregunta) return;
  const ids = pregunta.respuestas.map((r) => r.id);
  respuesta.id = Math.max(0, ...ids) + 1;
  editarPreguntaComunidad(idPregunta, { respuestas: [...pregunta.respuestas, respuesta] });
};


// ===== Funciones =====
// Preguntas con las respuestas abiertas y etiqueta elegida para la próxima pregunta
const respuestasAbiertasComunidad = new Set();
let etiquetaElegidaComunidad = "Pregunta";
let campoBuscarComunidad = null;
let resultadosComunidad = null;

const obtenerNombreComunidad = (correo) => {
  if (typeof obtenerNombrePerfil === "function") return obtenerNombrePerfil(correo);
  const usuario = obtenerUsuarios().find((u) => u.correo === correo);
  return usuario ? usuario.nombre : correo;
};

// «@usuario» del perfil (P2) o, si no hay, el nombre
const obtenerArrobaComunidad = (correo) => {
  const usuario = typeof obtenerPerfil === "function" ? obtenerPerfil(correo).usuario : "";
  return usuario ? `@${String(usuario).replace(/^@/, "")}` : obtenerNombreComunidad(correo);
};

const obtenerColorAvatarComunidad = (correo) => {
  const suma = [...correo].reduce((total, letra) => total + letra.charCodeAt(0), 0);
  return coloresAvatarComunidad[suma % coloresAvatarComunidad.length];
};

const formatearHaceComunidad = (iso) => {
  const minutos = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (minutos < 1) return "ahora";
  if (minutos < 60) return `hace ${minutos} min`;
  const horas = Math.round(minutos / 60);
  if (horas < 24) return `hace ${horas} h`;
  const dias = Math.round(horas / 24);
  return `hace ${dias} ${dias === 1 ? "día" : "días"}`;
};

// Busca en el texto, el título, la etiqueta y el nombre del autor (sin importar mayúsculas ni tildes)
const normalizarBusquedaComunidad = (texto) => String(texto).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

const filtrarPreguntasComunidad = (texto) => {
  const buscado = normalizarBusquedaComunidad(texto.trim());
  const preguntas = obtenerPreguntasComunidad().sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id - a.id);
  if (!buscado) return preguntas;
  return preguntas.filter((p) =>
    normalizarBusquedaComunidad(`${p.titulo} ${p.texto} ${p.etiqueta} ${obtenerNombreComunidad(p.correoAutor)}`).includes(buscado)
  );
};

const crearHtmlRespuestaComunidad = (respuesta) => `
  <li class="pcom__item">
    <p class="pcom__meta"><span class="pcom__autor">${escaparHtml(obtenerNombreComunidad(respuesta.correoAutor))}</span> · ${formatearHaceComunidad(respuesta.fecha)}</p>
    <p class="pcom__texto">${escaparHtml(respuesta.texto)}</p>
  </li>`;

const crearHtmlRespuestasComunidad = (pregunta) => {
  const abierta = respuestasAbiertasComunidad.has(pregunta.id);
  const lista = pregunta.respuestas.length
    ? `<ul class="pcom__lista">${pregunta.respuestas.map(crearHtmlRespuestaComunidad).join("")}</ul>`
    : '<p class="pcom__vacio">Nadie respondió todavía. ¡Ayuda con tu respuesta!</p>';
  return `
    <section class="pcom" id="respuestas-${pregunta.id}" aria-label="Respuestas"${abierta ? "" : " hidden"}>
      ${lista}
      <form class="pcom__form" data-id="${pregunta.id}" novalidate>
        <div class="campo pcom__campo">
          <label class="campo__label visualmente-oculto" for="respuesta-${pregunta.id}">Escribe tu respuesta</label>
          <input class="campo__input pcom__input" id="respuesta-${pregunta.id}" name="respuesta" type="text" placeholder="Escribe tu respuesta…" required maxlength="${LIMITE_RESPUESTA_COMUNIDAD}">
          <p class="campo__error">Escribe algo para responder.</p>
        </div>
        <a class="boton pcom__enviar" href="#" data-accion="responder" data-id="${pregunta.id}">Responder</a>
      </form>
    </section>`;
};

const crearHtmlPreguntaComunidad = (pregunta, correo) => {
  const nombre = obtenerNombreComunidad(pregunta.correoAutor);
  const pulsado = pregunta.megusta.includes(correo);
  const abierta = respuestasAbiertasComunidad.has(pregunta.id);
  const cantidad = pregunta.respuestas.length;
  return `
    <article class="cmu__pub">
      <header class="cmu__pub-cab">
        <span class="cmu__avatar cmu__avatar--${obtenerColorAvatarComunidad(pregunta.correoAutor)}" aria-hidden="true">${escaparHtml(obtenerIniciales(nombre))}</span>
        <div class="cmu__pub-info">
          <h3 class="cmu__pub-nombre">${escaparHtml(nombre)}</h3>
          <p class="cmu__pub-hace">${formatearHaceComunidad(pregunta.fecha)}</p>
        </div>
        <span class="chip chip--celeste cmu__tag">${escaparHtml(pregunta.etiqueta)}</span>
      </header>
      <p class="cmu__pub-texto">${escaparHtml(pregunta.texto)}</p>
      <p class="cmu__pub-stats">
        <a class="cmu__likes${pulsado ? " p3-gusta--activo" : ""}" href="#" data-accion="me-gusta" data-id="${pregunta.id}" aria-pressed="${pulsado}">♥ ${pregunta.megusta.length} Me gusta</a>
        <a class="cmu__coments" href="#respuestas-${pregunta.id}" data-accion="ver-respuestas" data-id="${pregunta.id}" aria-expanded="${abierta}" aria-controls="respuestas-${pregunta.id}">${cantidad} ${cantidad === 1 ? "respuesta" : "respuestas"}</a>
      </p>
      ${crearHtmlRespuestasComunidad(pregunta)}
    </article>`;
};

const mostrarPreguntasComunidad = () => {
  const sesion = obtenerSesion();
  if (!sesion) return;
  const buscado = campoBuscarComunidad ? campoBuscarComunidad.value : "";
  const preguntas = filtrarPreguntasComunidad(buscado);
  const html = preguntas.length
    ? preguntas.map((p) => crearHtmlPreguntaComunidad(p, sesion.correo)).join("")
    : `<p class="tarjeta p3pub__vacio">${buscado.trim() ? "No hay publicaciones que coincidan con tu búsqueda." : "Aún no hay publicaciones. ¡Haz la primera pregunta!"}</p>`;
  resultadosComunidad.innerHTML = html;
  mostrarTendenciasComunidad();
};

// Las 3 preguntas con más respuestas (y, a igualdad, más vistas)
const crearHtmlTendenciaComunidad = (pregunta) => `
  <article class="cmu__tend">
    <p class="cmu__tend-usuario"><img class="cmu__tend-foto" src="../../assets/icons/comunidad-usuario.svg" alt="">${escaparHtml(obtenerArrobaComunidad(pregunta.correoAutor))}</p>
    <p class="cmu__tend-contenido"><img class="cmu__tend-pagina" src="../../assets/icons/comunidad-pagina.svg" alt=""><a href="#respuestas-${pregunta.id}" data-accion="ver-respuestas" data-id="${pregunta.id}">${escaparHtml(pregunta.titulo)}</a></p>
    <p class="cmu__tend-datos">
      <span class="cmu__tend-dato"><img class="cmu__tend-icono" src="../../assets/icons/comunidad-ojo.svg" alt="">${pregunta.vistas} vistas</span>
      <span class="cmu__tend-dato"><img class="cmu__tend-icono" src="../../assets/icons/comunidad-respuestas.svg" alt="">${pregunta.respuestas.length} respuestas</span>
    </p>
  </article>`;

const mostrarTendenciasComunidad = () => {
  const tendencias = obtenerPreguntasComunidad()
    .sort((a, b) => b.respuestas.length - a.respuestas.length || b.vistas - a.vistas)
    .slice(0, 3);
  listaTendenciasComunidad.innerHTML = tendencias.map(crearHtmlTendenciaComunidad).join("");
};

// Campo de búsqueda: no está en el diseño, así que se inserta (con las clases de formulario que ya existen)
// dentro de la sección del feed, encima del contenedor donde se pintan las preguntas
const insertarBuscadorComunidad = () => {
  feedComunidad.innerHTML = `
    <h2 class="visualmente-oculto" id="cmu-feed">Publicaciones</h2>
    <div class="campo p3cmu__buscar">
      <label class="campo__label" for="cmu-buscar">Buscar en Comunidad</label>
      <input class="campo__input" id="cmu-buscar" name="buscar" type="search" placeholder="Busca por tema, texto o persona…" autocomplete="off">
    </div>
    <div class="p3cmu__resultados"></div>`;
  campoBuscarComunidad = document.querySelector("#cmu-buscar");
  resultadosComunidad = document.querySelector(".p3cmu__resultados");
};

const publicarPreguntaComunidad = (e) => {
  e.preventDefault();
  const sesion = obtenerSesion();
  if (!sesion || !validarPreguntaComunidad(campoPreguntaComunidad, LIMITE_PREGUNTA_COMUNIDAD)) return;
  const texto = campoPreguntaComunidad.value.trim();
  crearPreguntaComunidad({
    correoAutor: sesion.correo,
    titulo: texto.length > 60 ? `${texto.slice(0, 57)}…` : texto,
    texto,
    etiqueta: etiquetaElegidaComunidad,
    fecha: new Date().toISOString(),
  });
  formComunidad.reset();
  if (campoBuscarComunidad) campoBuscarComunidad.value = "";
  mostrarPreguntasComunidad();
  campoPreguntaComunidad.focus();
};

// «+ Etiqueta» va cambiando el tema de la próxima pregunta
const cambiarEtiquetaComunidad = (enlace) => {
  const posicion = etiquetasPreguntaComunidad.indexOf(etiquetaElegidaComunidad);
  etiquetaElegidaComunidad = etiquetasPreguntaComunidad[(posicion + 1) % etiquetasPreguntaComunidad.length];
  enlace.textContent = `Etiqueta: ${etiquetaElegidaComunidad}`;
};

const accionarComunidad = (e) => {
  const enlace = e.target.closest("[data-accion]");
  if (!enlace) return;
  const sesion = obtenerSesion();
  const id = Number(enlace.dataset.id);
  if (!sesion || !id) return;
  e.preventDefault();
  const accion = enlace.dataset.accion;

  if (accion === "me-gusta") {
    const pregunta = obtenerPreguntaComunidad(id);
    const megusta = pregunta.megusta.includes(sesion.correo)
      ? pregunta.megusta.filter((c) => c !== sesion.correo)
      : [...pregunta.megusta, sesion.correo];
    editarPreguntaComunidad(id, { megusta });
    mostrarPreguntasComunidad();
    document.querySelector(`.cmu__feed [data-accion="me-gusta"][data-id="${id}"]`)?.focus();
  } else if (accion === "ver-respuestas") {
    const abrir = !respuestasAbiertasComunidad.has(id) || enlace.closest(".cmu__tend");
    if (abrir) {
      if (!respuestasAbiertasComunidad.has(id)) editarPreguntaComunidad(id, { vistas: obtenerPreguntaComunidad(id).vistas + 1 });
      respuestasAbiertasComunidad.add(id);
    } else {
      respuestasAbiertasComunidad.delete(id);
    }
    // Si se abre desde Tendencias y hay una búsqueda que la oculta, se limpia la búsqueda
    if (campoBuscarComunidad && !document.querySelector(`#respuestas-${id}`)) campoBuscarComunidad.value = "";
    mostrarPreguntasComunidad();
    const destino = abrir ? `#respuesta-${id}` : `.cmu__feed [data-accion="ver-respuestas"][data-id="${id}"]`;
    document.querySelector(destino)?.focus();
  } else if (accion === "responder") {
    responderPreguntaComunidad(id, sesion);
  }
};

const responderPreguntaComunidad = (id, sesion) => {
  const campo = document.querySelector(`#respuesta-${id}`);
  if (!campo || !validarPreguntaComunidad(campo, LIMITE_RESPUESTA_COMUNIDAD)) return;
  crearRespuestaComunidad(id, { correoAutor: sesion.correo, texto: campo.value.trim(), fecha: new Date().toISOString() });
  respuestasAbiertasComunidad.add(id);
  mostrarPreguntasComunidad();
  document.querySelector(`#respuesta-${id}`)?.focus();
};

const responderConEnterComunidad = (e) => {
  const form = e.target.closest(".pcom__form");
  if (!form) return;
  e.preventDefault();
  const sesion = obtenerSesion();
  if (sesion) responderPreguntaComunidad(Number(form.dataset.id), sesion);
};


// ===== Validaciones =====
const validarPreguntaComunidad = (campo, limite) => {
  const texto = campo.value.trim();
  const valido = texto.length > 0 && texto.length <= limite;
  campo.closest(".campo")?.classList.toggle("campo--error", !valido);
  campo.setAttribute("aria-invalid", String(!valido));
  if (!valido) campo.focus();
  return valido;
};

const limpiarErrorComunidad = (e) => {
  const campo = e.target.closest(".campo__input");
  if (!campo) return;
  campo.closest(".campo")?.classList.remove("campo--error");
  campo.removeAttribute("aria-invalid");
};


// ===== Registro de eventos =====
if (feedComunidad) {
  document.addEventListener("DOMContentLoaded", () => {
    const sesion = obtenerSesion();
    if (!sesion) return;
    if (avatarCompositorComunidad) avatarCompositorComunidad.textContent = obtenerIniciales(obtenerNombreComunidad(sesion.correo));
    insertarBuscadorComunidad();
    mostrarPreguntasComunidad();

    campoBuscarComunidad.addEventListener("input", mostrarPreguntasComunidad);
    feedComunidad.addEventListener("click", accionarComunidad);
    feedComunidad.addEventListener("submit", responderConEnterComunidad);
    feedComunidad.addEventListener("input", limpiarErrorComunidad);
    listaTendenciasComunidad.addEventListener("click", accionarComunidad);
  });
}

if (formComunidad) {
  formComunidad.addEventListener("submit", publicarPreguntaComunidad);
  botonPublicarComunidad.addEventListener("click", publicarPreguntaComunidad);
  campoPreguntaComunidad.addEventListener("input", limpiarErrorComunidad);
  etiquetasComunidad.addEventListener("click", (e) => {
    const enlace = e.target.closest(".cmu__etiqueta");
    if (!enlace) return;
    e.preventDefault();
    // Solo «+ Etiqueta» tiene comportamiento; «+ Código» e «+ Imagen» quedan sin acción por ahora
    if (enlace.closest("li") === etiquetasComunidad.lastElementChild) cambiarEtiquetaComunidad(enlace);
  });
}
