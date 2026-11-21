// Temas y subtemas (bm_temas, bm_subtemas): listas con buscador, acordeón, crear módulo, editar tema, subtemas y grabaciones.
// Páginas: estudiante/lecciones y tema; lider/lecciones, editar-tema, crear-modulo, subtemas y subtema (estudiante/leccion lo lee).
// Responsable: P3 (Feed y lecciones).

// ===== Elementos =====
// Estudiante: lecciones y tema
const listaTemasEstudiante = document.querySelector(".lec__temas");
const buscadorTemasEstudiante = document.querySelector("#lec-buscar");
const listaSubtemasEstudiante = document.querySelector(".tem__lista");
const buscadorSubtemasEstudiante = document.querySelector("#tem-buscar");
const chipTemaEstudiante = document.querySelector(".tem__chip");
const tituloTemaEstudiante = document.querySelector(".tem__titulo");
const descripcionTemaEstudiante = document.querySelector(".tem__descripcion");

// Líder: lecciones, editar tema y crear módulo
const listaTemasLider = document.querySelector(".lml__lista");
const buscadorTemasLider = document.querySelector("#lml-buscar");
const formEditarTema = document.querySelector(".lcet__formulario");
const avisoTemaGuardado = document.querySelector(".lcet__aviso-texto");
const formCrearModulo = document.querySelector(".lcmo__formulario");
const grupoSubtemasModulo = document.querySelector(".lcmo__subtemas");
const botonAnadirSubtemaModulo = document.querySelector(".lcmo__anadir");
const textoModuloCreado = document.querySelector(".lcmo__modal-texto");
const botonSubtemasModuloCreado = document.querySelector(".lcmo__modal .modal__acciones .boton:not(.boton--secundario)");

// Líder: subtemas y subtema (misma lista con prefijos lsub / lsut)
const listaSubtemasLider = document.querySelector(".lsub__lista, .lsut__lista");
const prefijoSubtemas = document.querySelector(".lsut__lista") ? "lsut" : "lsub";
const modalGrabacion = document.querySelector(".lsut__modal");
const formGrabacion = document.querySelector(".lsut__caja");
const campoLinkGrabacion = document.querySelector("#lsut-link");
const campoPdfGrabacion = document.querySelector("#lsut-pdf");
const zonaMaterialGrabacion = document.querySelector(".lsut__material");
const avisoGrabacion = document.querySelector(".lsut__aviso");

// Parámetros de la dirección: ?id= del tema (o del subtema en subtema.html)
const parametrosTemas = new URLSearchParams(location.search);
const idTemaDireccion = Number(parametrosTemas.get("id"));
// En subtema.html, ?tema=3 abre el modal para crear un subtema nuevo en ese tema
const idTemaNuevoSubtema = Number(parametrosTemas.get("tema"));


// ===== Datos =====
const CLAVE_TEMAS = "bm_temas";
const CLAVE_SUBTEMAS = "bm_subtemas";
const LIMITE_PDFS = 5;
const MAXIMO_MB_PDF = 10;
const MAXIMO_MB_IMAGEN = 2;
const plataformasGrabacion = [
  { nombre: "YouTube", dominios: ["youtu.be", "youtube.com", "www.youtube.com", "m.youtube.com"] },
  { nombre: "Google Drive", dominios: ["drive.google.com"] },
  { nombre: "Zoom", dominios: ["zoom.us"] },
];

// { id, titulo, descripcion }
const temasIniciales = [
  { id: 1, titulo: "Grafos", descripcion: "Recorridos, caminos mínimos y árboles de expansión: la base de muchos problemas de concurso." },
  { id: 2, titulo: "Programación dinámica", descripcion: "Subproblemas, memoización y tabulación para optimizar soluciones." },
  { id: 3, titulo: "Strings", descripcion: "Búsqueda de patrones, hashing y estructuras como el trie para trabajar con texto." },
  { id: 4, titulo: "Matemática", descripcion: "Divisibilidad, primos, aritmética modular y combinatoria para concursos." },
];

// { id, idTema, titulo, descripcion, orden, fecha, linkGrabacion, duracion, pdfs: [{ nombre, tamano, url }] }
const subtemasIniciales = [
  { id: 1, idTema: 1, titulo: "Tipos de grafos", descripcion: "Conoce los grafos dirigidos, no dirigidos y ponderados, y cómo se representan.", orden: 1, fecha: "2026-10-15", linkGrabacion: "https://youtu.be/8x2GqLk3Tqs", duracion: "24:58", pdfs: [{ nombre: "grafos-tipos-teoria.pdf", tamano: "2,4 MB", url: "" }] },
  { id: 2, idTema: 1, titulo: "Representación: lista y matriz", descripcion: "Listas y matrices de adyacencia: cuándo conviene cada una y cuánta memoria usan.", orden: 2, fecha: "2026-10-22", linkGrabacion: "https://youtu.be/representacion", duracion: "18:12", pdfs: [] },
  { id: 3, idTema: 1, titulo: "BFS: recorrido en anchura", descripcion: "Recorre un grafo por niveles y encuentra caminos mínimos sin pesos.", orden: 3, fecha: "2026-10-29", linkGrabacion: "https://youtu.be/bfs-anchura", duracion: "20:40", pdfs: [] },
  { id: 4, idTema: 1, titulo: "DFS: recorrido en profundidad", descripcion: "Recorre un grafo en profundidad para detectar ciclos y componentes.", orden: 4, fecha: "2026-11-05", linkGrabacion: "", duracion: "", pdfs: [] },
  { id: 5, idTema: 1, titulo: "Dijkstra: caminos mínimos", descripcion: "Caminos mínimos con pesos positivos usando una cola de prioridad.", orden: 5, fecha: "2026-11-12", linkGrabacion: "", duracion: "", pdfs: [] },
  { id: 6, idTema: 1, titulo: "Bellman-Ford", descripcion: "Caminos mínimos con pesos negativos y detección de ciclos negativos.", orden: 6, fecha: "2026-11-16", linkGrabacion: "", duracion: "", pdfs: [] },
  { id: 7, idTema: 2, titulo: "Introducción a DP", descripcion: "Qué es un subproblema y cómo reconocer un problema de programación dinámica.", orden: 1, fecha: "2026-11-02", linkGrabacion: "", duracion: "", pdfs: [] },
  { id: 8, idTema: 2, titulo: "Mochila 0/1", descripcion: "El problema clásico de la mochila con tabulación en una y dos dimensiones.", orden: 2, fecha: "2026-11-09", linkGrabacion: "", duracion: "", pdfs: [] },
  { id: 9, idTema: 3, titulo: "Búsqueda de patrones (KMP)", descripcion: "Encuentra un patrón dentro de un texto en tiempo lineal.", orden: 1, fecha: "2026-11-10", linkGrabacion: "", duracion: "", pdfs: [] },
];

const obtenerTemasLecciones = () => leerDatos(CLAVE_TEMAS, temasIniciales);

const obtenerTema = (id) => obtenerTemasLecciones().find((t) => t.id === id) || null;

const crearTema = (tema) => {
  const temas = obtenerTemasLecciones();
  const ids = temas.map((t) => t.id);
  tema.id = Math.max(0, ...ids) + 1;
  temas.push(tema);
  guardarDatos(CLAVE_TEMAS, temas);
  return tema;
};

const editarTema = (id, cambios) => {
  const temas = obtenerTemasLecciones();
  const posicion = temas.findIndex((t) => t.id === id);
  if (posicion === -1) return;
  temas[posicion] = { ...temas[posicion], ...cambios, id };
  guardarDatos(CLAVE_TEMAS, temas);
};

// Borrar un tema también borra sus subtemas
const borrarTema = (id) => {
  guardarDatos(CLAVE_TEMAS, obtenerTemasLecciones().filter((t) => t.id !== id));
  guardarDatos(CLAVE_SUBTEMAS, obtenerSubtemas().filter((s) => s.idTema !== id));
};

const obtenerSubtemas = () => leerDatos(CLAVE_SUBTEMAS, subtemasIniciales);

// Subtemas de un tema en su orden de clase
const obtenerSubtemasDeTema = (idTema) =>
  obtenerSubtemas()
    .filter((s) => s.idTema === idTema)
    .sort((a, b) => a.orden - b.orden || a.id - b.id);

const obtenerSubtema = (id) => obtenerSubtemas().find((s) => s.id === id) || null;

const crearSubtema = (subtema) => {
  const subtemas = obtenerSubtemas();
  const ids = subtemas.map((s) => s.id);
  const ordenes = subtemas.filter((s) => s.idTema === subtema.idTema).map((s) => s.orden);
  subtema.id = Math.max(0, ...ids) + 1;
  subtemas.push({ descripcion: "", orden: Math.max(0, ...ordenes) + 1, fecha: formatearFechaTema(new Date()), linkGrabacion: "", duracion: "", pdfs: [], ...subtema });
  guardarDatos(CLAVE_SUBTEMAS, subtemas);
  return subtema;
};

const editarSubtema = (id, cambios) => {
  const subtemas = obtenerSubtemas();
  const posicion = subtemas.findIndex((s) => s.id === id);
  if (posicion === -1) return;
  subtemas[posicion] = { ...subtemas[posicion], ...cambios, id };
  guardarDatos(CLAVE_SUBTEMAS, subtemas);
};

const borrarSubtema = (id) => {
  guardarDatos(CLAVE_SUBTEMAS, obtenerSubtemas().filter((s) => s.id !== id));
};


// ===== Funciones =====
// "2026-11-17" con la fecha local
const formatearFechaTema = (fecha) =>
  `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`;

// Para buscar sin importar mayúsculas ni tildes
const normalizarTextoTema = (texto) => String(texto).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();

const coincideBusquedaTema = (texto, buscado) => normalizarTextoTema(texto).includes(normalizarTextoTema(buscado));

// Número del tema según su posición («Tema 1», «Tema 2», …)
const obtenerNumeroTema = (id) => obtenerTemasLecciones().findIndex((t) => t.id === id) + 1;

const textoCantidadSubtemas = (cantidad) => `${cantidad} ${cantidad === 1 ? "subtema" : "subtemas"}`;

// Tema de la dirección (?id=) o, si no hay o no existe, el primero
const obtenerTemaDeDireccion = () => obtenerTema(idTemaDireccion) || obtenerTemasLecciones()[0] || null;

// --- Estudiante: lista de temas ---
const crearHtmlTemaEstudiante = (tema) => `
  <article class="lec__tema">
    <div class="lec__imagen" aria-hidden="true"></div>
    <div class="lec__tema-cuerpo">
      <div class="lec__tema-texto">
        <span class="chip chip--celeste lec__chip">Tema ${obtenerNumeroTema(tema.id)} · ${textoCantidadSubtemas(obtenerSubtemasDeTema(tema.id).length)}</span>
        <h3 class="lec__tema-titulo">${escaparHtml(tema.titulo)}</h3>
        <p class="lec__tema-descripcion">${escaparHtml(tema.descripcion)}</p>
      </div>
      <a class="boton lec__ingresar" href="tema.html?id=${tema.id}">Ingresar al tema</a>
    </div>
  </article>`;

const mostrarTemasEstudiante = () => {
  const temas = obtenerTemasLecciones().filter((t) => coincideBusquedaTema(`${t.titulo} ${t.descripcion}`, buscadorTemasEstudiante.value));
  const html = temas.length
    ? temas.map(crearHtmlTemaEstudiante).join("")
    : `<p class="tarjeta p3tem__vacio">${buscadorTemasEstudiante.value.trim() ? "No hay temas con ese nombre." : "Tu líder aún no publicó temas."}</p>`;
  listaTemasEstudiante.innerHTML = `<h2 class="visualmente-oculto" id="lec-temas">Temas disponibles</h2>${html}`;
};

// --- Estudiante: tema con acordeón ---
// Subtema abierto en el acordeón (el primero al entrar). Las tarjetas usan .p3tem__sub y no .tem__sub,
// porque las reglas de :target del diseño abrirían siempre la primera
let subtemaAbiertoEstudiante = 0;

const crearHtmlSubtemaEstudiante = (subtema, posicion) => {
  const abierto = subtema.id === subtemaAbiertoEstudiante;
  return `
    <article class="p3tem__sub${abierto ? " p3tem__sub--abierto" : ""}" id="subtema-${subtema.id}">
      <a class="tem__sub-cab" href="#subtema-${subtema.id}" data-id="${subtema.id}" aria-expanded="${abierto}" aria-controls="cuerpo-subtema-${subtema.id}">
        <span class="tem__num">${posicion}</span>
        <span class="tem__sub-titulo">${escaparHtml(subtema.titulo)}</span>
        <img class="tem__flecha" src="../../assets/icons/tema-flecha.svg" alt="">
      </a>
      <div class="tem__sub-cuerpo" id="cuerpo-subtema-${subtema.id}"${abierto ? "" : " hidden"}>
        <p class="tem__sub-texto">${escaparHtml(subtema.descripcion || "Sin descripción todavía.")}</p>
        <a class="boton tem__ver" href="leccion.html?subtema=${subtema.id}">Ver lección</a>
      </div>
    </article>`;
};

const mostrarSubtemasEstudiante = (tema) => {
  const todos = obtenerSubtemasDeTema(tema.id);
  const subtemas = todos.filter((s) => coincideBusquedaTema(`${s.titulo} ${s.descripcion}`, buscadorSubtemasEstudiante.value));
  const html = subtemas.length
    ? subtemas.map((s) => crearHtmlSubtemaEstudiante(s, todos.indexOf(s) + 1)).join("")
    : `<p class="tarjeta p3tem__vacio">${buscadorSubtemasEstudiante.value.trim() ? "No hay subtemas con ese nombre." : "Este tema aún no tiene subtemas."}</p>`;
  listaSubtemasEstudiante.innerHTML = `<h2 class="visualmente-oculto" id="tem-subtemas">Subtemas</h2>${html}`;
};

const mostrarTemaEstudiante = (tema) => {
  document.title = `${tema.titulo} · BranchMatch`;
  chipTemaEstudiante.textContent = `Tema ${obtenerNumeroTema(tema.id)} · ${textoCantidadSubtemas(obtenerSubtemasDeTema(tema.id).length)}`;
  tituloTemaEstudiante.textContent = tema.titulo;
  descripcionTemaEstudiante.textContent = tema.descripcion;
};

const alternarSubtemaEstudiante = (e, tema) => {
  const cabecera = e.target.closest(".tem__sub-cab");
  if (!cabecera) return;
  e.preventDefault();
  const id = Number(cabecera.dataset.id);
  subtemaAbiertoEstudiante = subtemaAbiertoEstudiante === id ? 0 : id;
  mostrarSubtemasEstudiante(tema);
  listaSubtemasEstudiante.querySelector(`.tem__sub-cab[data-id="${id}"]`)?.focus();
};

// --- Líder: lista de temas ---
const crearHtmlTemaLider = (tema) => `
  <li class="lml__item">
    <article class="lml__tema" aria-labelledby="lml-tema-${tema.id}">
      <div class="lml__imagen" aria-hidden="true"></div>
      <div class="lml__contenido">
        <div class="lml__texto">
          <p class="chip chip--celeste lml__chip">Tema ${obtenerNumeroTema(tema.id)} · ${textoCantidadSubtemas(obtenerSubtemasDeTema(tema.id).length)}</p>
          <h2 class="lml__tema-titulo" id="lml-tema-${tema.id}">${escaparHtml(tema.titulo)}</h2>
          <p class="lml__descripcion">${escaparHtml(tema.descripcion)}</p>
        </div>
        <a class="boton lml__ingresar" href="subtemas.html?id=${tema.id}">Ingresar al tema</a>
      </div>
      <div class="lml__acciones">
        <a class="lml__accion" href="editar-tema.html?id=${tema.id}" aria-label="Editar el tema ${escaparHtml(tema.titulo)}">
          <picture>
            <source media="(min-width: 768px)" srcset="../../assets/icons/lecciones-editar.svg">
            <img class="lml__icono lml__icono--editar" src="../../assets/icons/lecciones-editar-movil.svg" alt="">
          </picture>
        </a>
        <a class="lml__accion" href="#" data-accion="borrar-tema" data-id="${tema.id}" aria-label="Eliminar el tema ${escaparHtml(tema.titulo)}"><img class="lml__icono lml__icono--borrar" src="../../assets/icons/lecciones-borrar.svg" alt=""></a>
      </div>
    </article>
  </li>`;

const mostrarTemasLider = () => {
  const temas = obtenerTemasLecciones().filter((t) => coincideBusquedaTema(`${t.titulo} ${t.descripcion}`, buscadorTemasLider.value));
  listaTemasLider.innerHTML = temas.length
    ? temas.map(crearHtmlTemaLider).join("")
    : `<li class="lml__item"><p class="tarjeta p3tem__vacio">${buscadorTemasLider.value.trim() ? "No hay temas con ese nombre." : "Aún no hay temas. Crea el primer módulo."}</p></li>`;
};

const borrarTemaDeLista = (e) => {
  const enlace = e.target.closest('[data-accion="borrar-tema"]');
  if (!enlace) return;
  e.preventDefault();
  const tema = obtenerTema(Number(enlace.dataset.id));
  if (!tema || !confirm(`¿Eliminar el tema «${tema.titulo}» y todos sus subtemas?`)) return;
  borrarTema(tema.id);
  mostrarTemasLider();
  buscadorTemasLider.focus();
};

// --- Líder: editar tema ---
const llenarFormularioTema = (tema) => {
  formEditarTema.querySelector("#lcet-nombre").value = tema.titulo;
  formEditarTema.querySelector("#lcet-descripcion").value = tema.descripcion;
};

const guardarTemaEditado = (e, tema) => {
  e.preventDefault();
  const campoNombre = formEditarTema.querySelector("#lcet-nombre");
  const campoDescripcion = formEditarTema.querySelector("#lcet-descripcion");
  if (!validarDatosTema(campoNombre, campoDescripcion, formEditarTema.querySelector("#lcet-imagen"))) return;
  const titulo = campoNombre.value.trim();
  editarTema(tema.id, { titulo, descripcion: campoDescripcion.value.trim() });
  avisoTemaGuardado.textContent = `Cambios guardados en «${titulo}»`;
  // Se muestra el aviso del diseño (pantalla 46) con :target
  location.hash = "guardado";
};

// --- Líder: crear módulo ---
// «+ Añadir subtema» muestra (una sola vez) un campo para escribir el nombre dentro del formulario
const mostrarCampoSubtemaModulo = (e) => {
  e.preventDefault();
  let campo = grupoSubtemasModulo.querySelector("#lcmo-nuevo-subtema");
  if (!campo) {
    botonAnadirSubtemaModulo.insertAdjacentHTML("beforebegin", `
      <div class="campo p3tem__nuevo">
        <label class="campo__label lcmo__label" for="lcmo-nuevo-subtema">Nombre del nuevo subtema</label>
        <div class="p3tem__nuevo-fila">
          <input class="campo__input lcmo__input" id="lcmo-nuevo-subtema" type="text" maxlength="60" placeholder="Ej. Mochila 0/1">
          <a class="boton boton--secundario p3tem__nuevo-boton" href="#" data-accion="confirmar-subtema">Añadir</a>
        </div>
        <p class="campo__error">Escribe un nombre de al menos 3 caracteres.</p>
      </div>`);
    campo = grupoSubtemasModulo.querySelector("#lcmo-nuevo-subtema");
  }
  campo.focus();
};

const anadirSubtemaModulo = () => {
  const campo = grupoSubtemasModulo.querySelector("#lcmo-nuevo-subtema");
  const nombre = campo.value.trim();
  if (nombre.length < 3) {
    marcarErrorTema(campo);
    campo.focus();
    return;
  }
  const numero = grupoSubtemasModulo.querySelectorAll(".lcmo__check").length + 1;
  campo.closest(".p3tem__nuevo").insertAdjacentHTML("beforebegin", `
    <label class="lcmo__opcion" for="lcmo-subtema-${numero}">
      <input class="lcmo__check" id="lcmo-subtema-${numero}" name="subtemas" type="checkbox" value="${escaparHtml(nombre)}" checked>
      <span class="lcmo__opcion-texto">${escaparHtml(nombre)}</span>
    </label>`);
  campo.value = "";
  campo.focus();
};

// Clic en «Añadir» o Enter dentro del campo (sin enviar el formulario del módulo)
const accionarSubtemaModulo = (e) => {
  if (e.type === "click" && !e.target.closest('[data-accion="confirmar-subtema"]')) return;
  if (e.type === "keydown" && (e.key !== "Enter" || e.target.id !== "lcmo-nuevo-subtema")) return;
  e.preventDefault();
  anadirSubtemaModulo();
};

const crearModulo = (e) => {
  e.preventDefault();
  const campoNombre = formCrearModulo.querySelector("#lcmo-nombre");
  const campoDescripcion = formCrearModulo.querySelector("#lcmo-descripcion");
  if (!validarDatosTema(campoNombre, campoDescripcion, formCrearModulo.querySelector("#lcmo-imagen"))) return;
  const titulo = campoNombre.value.trim();
  if (obtenerTemasLecciones().some((t) => normalizarTextoTema(t.titulo) === normalizarTextoTema(titulo))) {
    marcarErrorTema(campoNombre, "Ya existe un tema con ese nombre.");
    campoNombre.focus();
    return;
  }
  const tema = crearTema({ titulo, descripcion: campoDescripcion.value.trim() });
  // Los subtemas marcados se crean dentro del nuevo tema (el texto visible es su nombre)
  formCrearModulo.querySelectorAll(".lcmo__check:checked").forEach((casilla) => {
    const nombre = casilla.closest(".lcmo__opcion").querySelector(".lcmo__opcion-texto").textContent.trim();
    crearSubtema({ idTema: tema.id, titulo: nombre });
  });
  textoModuloCreado.textContent = `«${titulo}» ya aparece en Lecciones. Ahora añade sus subtemas y grabaciones.`;
  botonSubtemasModuloCreado.href = `subtemas.html?id=${tema.id}`;
  // Se muestra el modal del diseño (pantalla 49) con :target
  location.hash = "creado";
};

// --- Líder: subtemas (y la lista detrás del modal de subtema.html) ---
// Filtro de fecha: hoy, últimos 7 días o últimos 30 días
const pasaFiltroFecha = (subtema, filtro) => {
  if (filtro === "todos") return true;
  const dias = { hoy: 0, semana: 7, mes: 30 }[filtro];
  const limite = new Date();
  limite.setDate(limite.getDate() - dias);
  return subtema.fecha >= formatearFechaTema(limite);
};

const ordenarSubtemas = (subtemas, orden) => {
  const copia = [...subtemas];
  if (orden === "antiguos") return copia.sort((a, b) => a.fecha.localeCompare(b.fecha) || a.id - b.id);
  if (orden === "nombre") return copia.sort((a, b) => a.titulo.localeCompare(b.titulo, "es"));
  return copia.sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id - a.id);
};

const crearHtmlSubtemaLider = (subtema, idActual) => {
  const p = prefijoSubtemas;
  const titulo = escaparHtml(subtema.titulo);
  const grabacion = subtema.linkGrabacion
    ? `<a class="${p}__grabacion ${p}__grabacion--si" href="subtema.html?id=${subtema.id}">► Grabación<span class="visualmente-oculto"> de ${titulo}</span></a>`
    : `<a class="${p}__grabacion" href="subtema.html?id=${subtema.id}">Sin grabación<span class="visualmente-oculto"> en ${titulo}, añadir</span></a>`;
  return `
    <li class="${p}__fila${subtema.id === idActual ? " p3tem__fila--actual" : ""}">
      <p class="${p}__nombre"><span class="${p}__asa" aria-hidden="true">⋮⋮</span>${titulo}</p>
      <div class="${p}__acciones">
        ${grabacion}
        <a class="${p}__accion ${p}__accion--editar" href="subtema.html?id=${subtema.id}"><img class="${p}__accion-icono" src="../../assets/icons/${p === "lsut" ? "subtema" : "subtemas"}-editar.svg" alt="">Editar<span class="visualmente-oculto"> ${titulo}</span></a>
        <a class="${p}__accion ${p}__accion--eliminar" href="#" data-accion="quitar-subtema" data-id="${subtema.id}"><img class="${p}__accion-icono" src="../../assets/icons/${p === "lsut" ? "subtema" : "subtemas"}-eliminar.svg" alt="">Eliminar<span class="visualmente-oculto"> ${titulo}</span></a>
      </div>
    </li>`;
};

const mostrarSubtemasLider = (tema, idActual = 0) => {
  const p = prefijoSubtemas;
  const buscador = document.querySelector(`#${p}-buscar`);
  const filtro = document.querySelector(`#${p}-fecha`).value;
  const orden = document.querySelector(`#${p}-orden`).value;
  const todos = obtenerSubtemasDeTema(tema.id);
  const subtemas = ordenarSubtemas(todos.filter((s) => coincideBusquedaTema(s.titulo, buscador.value) && pasaFiltroFecha(s, filtro)), orden);
  document.querySelector(`.${p}__titulo`).textContent = `Tema: ${tema.titulo}`;
  document.querySelector(`.${p}__contador`).textContent = subtemas.length === todos.length
    ? textoCantidadSubtemas(todos.length)
    : `${subtemas.length} de ${textoCantidadSubtemas(todos.length)}`;
  listaSubtemasLider.innerHTML = subtemas.length
    ? subtemas.map((s) => crearHtmlSubtemaLider(s, idActual)).join("")
    : `<li class="${p}__fila"><p class="${p}__nombre">${todos.length ? "Ningún subtema coincide con la búsqueda o el filtro." : "Este tema aún no tiene subtemas. Añade el primero."}</p></li>`;
};

const accionarSubtemasLider = (e, tema, idActual) => {
  const enlace = e.target.closest("[data-accion]");
  if (!enlace) return;
  e.preventDefault();
  const subtema = obtenerSubtema(Number(enlace.dataset.id));
  if (!subtema) return;

  if (enlace.dataset.accion === "quitar-subtema") {
    if (!confirm(`¿Eliminar el subtema «${subtema.titulo}»? Se perderán su grabación y sus PDFs.`)) return;
    borrarSubtema(subtema.id);
    if (subtema.id === idActual) {
      location.href = `subtemas.html?id=${tema.id}`;
      return;
    }
  }
  mostrarSubtemasLider(tema, idActual);
};

// --- Líder: crear o editar un subtema (modal de subtema.html) ---
// PDFs del formulario mientras se edita; se guardan al pulsar «Guardar»
let pdfsEnEdicion = [];
// Copia de lo que había antes de guardar, para «Deshacer» (null si el subtema se acaba de crear)
let subtemaAntesDeGuardar = null;
let subtemaRecienCreado = false;

const detectarPlataforma = (link) => {
  try {
    const url = new URL(link);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    const plataforma = plataformasGrabacion.find((pl) => pl.dominios.includes(url.hostname));
    return plataforma && url.pathname.length > 1 ? plataforma.nombre : null;
  } catch (error) {
    return null;
  }
};

const mostrarDetectado = () => {
  const detectado = formGrabacion.querySelector(".lsut__detectado");
  const plataforma = detectarPlataforma(campoLinkGrabacion.value.trim());
  detectado.hidden = !plataforma;
  if (plataforma) formGrabacion.querySelector(".lsut__detectado-detalle").textContent = `${plataforma} · link válido`;
};

const crearHtmlPdf = (pdf, posicion) => `
  <div class="lsut__archivo">
    <span class="lsut__archivo-tipo">PDF</span>
    <p class="lsut__archivo-info"><span class="lsut__archivo-nombre">${escaparHtml(pdf.nombre)}</span><span class="lsut__archivo-estado">${escaparHtml(pdf.tamano)} · ✓ Listo</span></p>
    <a class="lsut__quitar" href="#" data-accion="quitar-pdf" data-posicion="${posicion}"><img class="lsut__quitar-icono" src="../../assets/icons/subtema-eliminar.svg" alt="">Quitar<span class="visualmente-oculto"> ${escaparHtml(pdf.nombre)}</span></a>
  </div>`;

const mostrarPdfsEnEdicion = () => {
  zonaMaterialGrabacion.querySelectorAll(".lsut__archivo, .p3tem__error-pdf").forEach((n) => n.remove());
  zonaMaterialGrabacion.insertAdjacentHTML("beforeend", pdfsEnEdicion.map(crearHtmlPdf).join(""));
};

const formatearTamano = (bytes) => `${(bytes / 1024 / 1024).toFixed(1).replace(".", ",")} MB`;

// Se guardan el nombre y el tamaño: no hay servidor donde subir el archivo
const anadirPdfs = () => {
  const archivos = [...campoPdfGrabacion.files];
  const error = validarPdfs(archivos);
  campoPdfGrabacion.value = "";
  if (error) {
    zonaMaterialGrabacion.querySelector(".p3tem__error-pdf")?.remove();
    zonaMaterialGrabacion.insertAdjacentHTML("beforeend", `<p class="campo__error p3tem__error-pdf" role="alert">${error}</p>`);
    return;
  }
  pdfsEnEdicion = [...pdfsEnEdicion, ...archivos.map((a) => ({ nombre: a.name, tamano: formatearTamano(a.size), url: "" }))];
  mostrarPdfsEnEdicion();
};

const quitarPdf = (e) => {
  const enlace = e.target.closest('[data-accion="quitar-pdf"]');
  if (!enlace) return;
  e.preventDefault();
  pdfsEnEdicion = pdfsEnEdicion.filter((_, i) => i !== Number(enlace.dataset.posicion));
  mostrarPdfsEnEdicion();
  campoPdfGrabacion.focus();
};

// El diseño no trae campos para el nombre y la descripción: se insertan con las clases del propio modal
const insertarCamposSubtema = () => {
  if (formGrabacion.querySelector("#lsut-nombre")) return;
  formGrabacion.querySelector(".lsut__modal-texto").insertAdjacentHTML("afterend", `
    <div class="campo lsut__campo">
      <label class="campo__label lsut__label" for="lsut-nombre">Nombre del subtema</label>
      <input class="campo__input lsut__input" id="lsut-nombre" name="nombre" type="text" required minlength="3" maxlength="60" placeholder="Ej. Tipos de grafos">
      <p class="campo__error">Escribe un nombre de al menos 3 caracteres.</p>
    </div>
    <div class="campo lsut__campo">
      <label class="campo__label lsut__label" for="lsut-descripcion">Descripción <span class="lsut__opcional">Opcional</span></label>
      <textarea class="campo__input lsut__input p3tem__descripcion" id="lsut-descripcion" name="descripcion" maxlength="200" placeholder="¿Qué aprenderá tu party en este subtema?"></textarea>
    </div>`);
};

// Abre el modal con los datos del subtema (o vacío, si es nuevo)
const abrirSubtemaEnModal = (subtema, tema) => {
  const esNuevo = !subtema.id;
  insertarCamposSubtema();
  formGrabacion.querySelector(".lsut__modal-titulo").lastChild.textContent = esNuevo ? `Nuevo subtema · ${tema.titulo}` : `Editar subtema · ${subtema.titulo}`;
  formGrabacion.querySelector(".lsut__modal-texto").textContent = esNuevo
    ? "Ponle un nombre al subtema. Si ya tienes la clase grabada, pega su link y sube los PDFs para que tu party los vea en «Ver lección»."
    : "Cambia el nombre o la descripción, pega el link de la clase grabada y, si quieres, sube los PDFs para que tu party los vea en «Ver lección».";
  formGrabacion.querySelector('.lsut__botones a[href="#guardado"]').textContent = esNuevo ? "Crear subtema" : "Guardar";
  formGrabacion.querySelector("#lsut-nombre").value = subtema.titulo;
  formGrabacion.querySelector("#lsut-descripcion").value = subtema.descripcion || "";
  campoLinkGrabacion.value = subtema.linkGrabacion;
  campoLinkGrabacion.required = false;
  pdfsEnEdicion = [...subtema.pdfs];
  mostrarPdfsEnEdicion();
  mostrarDetectado();
  // «Cancelar» y la X vuelven a la lista de subtemas de su tema
  formGrabacion.querySelectorAll('a[href^="subtemas.html"]').forEach((a) => {
    a.href = `subtemas.html?id=${tema.id}`;
  });
  document.querySelector(".lsut__volver").href = `subtemas.html?id=${tema.id}`;
};

const guardarSubtemaDesdeModal = (e, estado) => {
  e.preventDefault();
  const campoNombre = formGrabacion.querySelector("#lsut-nombre");
  if (!validarNombreSubtema(campoNombre, estado.subtema) || !validarLinkGrabacion()) return;
  const datos = {
    titulo: campoNombre.value.trim(),
    descripcion: formGrabacion.querySelector("#lsut-descripcion").value.trim(),
    linkGrabacion: campoLinkGrabacion.value.trim(),
    pdfs: pdfsEnEdicion,
  };
  if (!estado.subtema.id) {
    // Nuevo: se crea y la dirección pasa a ?id= para que los siguientes cambios lo editen
    estado.subtema = crearSubtema({ idTema: estado.tema.id, ...datos });
    subtemaAntesDeGuardar = null;
    subtemaRecienCreado = true;
    history.replaceState(null, "", `subtema.html?id=${estado.subtema.id}`);
    avisoGrabacion.querySelector(".lsut__aviso-texto").textContent = `Subtema «${datos.titulo}» creado`;
  } else {
    const { titulo, descripcion, linkGrabacion, pdfs } = estado.subtema;
    subtemaAntesDeGuardar = { titulo, descripcion, linkGrabacion, pdfs };
    subtemaRecienCreado = false;
    editarSubtema(estado.subtema.id, datos);
    Object.assign(estado.subtema, datos);
    avisoGrabacion.querySelector(".lsut__aviso-texto").textContent = datos.linkGrabacion
      ? `Grabación guardada en «${datos.titulo}»`
      : `Cambios guardados en «${datos.titulo}»`;
  }
  mostrarSubtemasLider(estado.tema, estado.subtema.id);
  abrirSubtemaEnModal(estado.subtema, estado.tema);
  // Se muestra el aviso del diseño (pantalla 54) y se oculta el modal, con :target
  location.hash = "guardado";
};

// «Deshacer»: si el subtema se acaba de crear, se borra; si se editó, vuelve a lo de antes
const deshacerSubtema = (e, estado) => {
  e.preventDefault();
  if (subtemaRecienCreado) {
    borrarSubtema(estado.subtema.id);
    location.href = `subtema.html?tema=${estado.tema.id}`;
    return;
  }
  if (!subtemaAntesDeGuardar) return;
  editarSubtema(estado.subtema.id, subtemaAntesDeGuardar);
  Object.assign(estado.subtema, subtemaAntesDeGuardar);
  subtemaAntesDeGuardar = null;
  abrirSubtemaEnModal(estado.subtema, estado.tema);
  mostrarSubtemasLider(estado.tema, estado.subtema.id);
  // Vuelve a abrir el modal: :target pasa de #guardado al propio modal
  location.hash = "grabacion";
  formGrabacion.querySelector("#lsut-nombre").focus();
};


// ===== Validaciones =====
// Muestra el error del campo; sin texto, vuelve al mensaje original del diseño
const marcarErrorTema = (campo, texto) => {
  const contenedor = campo.closest(".campo");
  const error = contenedor.querySelector(".campo__error");
  if (!error.dataset.original) error.dataset.original = error.textContent;
  error.textContent = texto || error.dataset.original;
  contenedor.classList.add("campo--error");
  campo.setAttribute("aria-invalid", "true");
};

const limpiarErrorTema = (e) => {
  const campo = e.target.closest(".campo__input");
  if (!campo) return;
  campo.closest(".campo")?.classList.remove("campo--error");
  campo.removeAttribute("aria-invalid");
};

// Nombre (3 a 60), descripción (20 a 200) e imagen opcional (PNG o JPG de hasta 2 MB)
const validarDatosTema = (campoNombre, campoDescripcion, campoImagen) => {
  const errores = [];
  const nombre = campoNombre.value.trim();
  const descripcion = campoDescripcion.value.trim();
  [campoNombre, campoDescripcion].forEach((c) => {
    c.closest(".campo").classList.remove("campo--error");
    c.removeAttribute("aria-invalid");
  });
  if (nombre.length < 3) {
    marcarErrorTema(campoNombre, nombre ? "El nombre debe tener al menos 3 caracteres." : "");
    errores.push(campoNombre);
  }
  if (descripcion.length < 20) {
    marcarErrorTema(campoDescripcion);
    errores.push(campoDescripcion);
  }
  const imagen = campoImagen && campoImagen.files[0];
  const ayudaImagen = campoImagen && campoImagen.closest("section").querySelector("[class$='__zona-ayuda']");
  ayudaImagen?.classList.remove("p3tem__ayuda--error");
  if (imagen && (!["image/png", "image/jpeg"].includes(imagen.type) || imagen.size > MAXIMO_MB_IMAGEN * 1024 * 1024)) {
    if (ayudaImagen) {
      ayudaImagen.textContent = `La imagen debe ser PNG o JPG y pesar como máximo ${MAXIMO_MB_IMAGEN} MB.`;
      ayudaImagen.classList.add("p3tem__ayuda--error");
    }
    campoImagen.value = "";
    errores.push(campoImagen);
  }
  if (errores.length) errores[0].focus();
  return errores.length === 0;
};

// Nombre obligatorio (3 a 60) y sin repetirse dentro del mismo tema
const validarNombreSubtema = (campo, subtema) => {
  const nombre = campo.value.trim();
  campo.closest(".campo").classList.remove("campo--error");
  campo.removeAttribute("aria-invalid");
  if (nombre.length < 3) {
    marcarErrorTema(campo, nombre ? "El nombre debe tener al menos 3 caracteres." : "");
    campo.focus();
    return false;
  }
  const repetido = obtenerSubtemasDeTema(subtema.idTema).some((s) => s.id !== subtema.id && normalizarTextoTema(s.titulo) === normalizarTextoTema(nombre));
  if (repetido) {
    marcarErrorTema(campo, "Ya hay un subtema con ese nombre en este tema.");
    campo.focus();
    return false;
  }
  return true;
};

// El link es opcional (puede quedar «Sin grabación»), pero si se escribe debe ser de YouTube, Google Drive o Zoom
const validarLinkGrabacion = () => {
  const link = campoLinkGrabacion.value.trim();
  const valido = !link || Boolean(detectarPlataforma(link));
  campoLinkGrabacion.closest(".campo").classList.toggle("campo--error", !valido);
  campoLinkGrabacion.setAttribute("aria-invalid", String(!valido));
  if (!valido) campoLinkGrabacion.focus();
  return valido;
};

// Solo PDF, hasta 10 MB cada uno y como máximo 5 en total
const validarPdfs = (archivos) => {
  if (archivos.some((a) => a.type !== "application/pdf" && !a.name.toLowerCase().endsWith(".pdf"))) return "Solo se aceptan archivos .pdf.";
  if (archivos.some((a) => a.size > MAXIMO_MB_PDF * 1024 * 1024)) return `Cada PDF puede pesar como máximo ${MAXIMO_MB_PDF} MB.`;
  if (pdfsEnEdicion.length + archivos.length > LIMITE_PDFS) return `Puedes subir hasta ${LIMITE_PDFS} PDFs por subtema.`;
  return "";
};


// ===== Registro de eventos =====
document.addEventListener("DOMContentLoaded", () => {
  if (!obtenerSesion()) return;

  // Estudiante: lista de temas
  if (listaTemasEstudiante) {
    mostrarTemasEstudiante();
    buscadorTemasEstudiante.addEventListener("input", mostrarTemasEstudiante);
    buscadorTemasEstudiante.closest("form").addEventListener("submit", (e) => e.preventDefault());
  }

  // Estudiante: tema con acordeón
  if (listaSubtemasEstudiante) {
    const tema = obtenerTemaDeDireccion();
    if (!tema) {
      location.href = "lecciones.html";
      return;
    }
    subtemaAbiertoEstudiante = obtenerSubtemasDeTema(tema.id)[0]?.id || 0;
    mostrarTemaEstudiante(tema);
    mostrarSubtemasEstudiante(tema);
    listaSubtemasEstudiante.addEventListener("click", (e) => alternarSubtemaEstudiante(e, tema));
    buscadorSubtemasEstudiante.addEventListener("input", () => mostrarSubtemasEstudiante(tema));
    buscadorSubtemasEstudiante.closest("form").addEventListener("submit", (e) => e.preventDefault());
  }

  // Líder: lista de temas
  if (listaTemasLider) {
    // El formulario del diseño envía ?q=: se usa como búsqueda inicial
    buscadorTemasLider.value = parametrosTemas.get("q") || "";
    mostrarTemasLider();
    buscadorTemasLider.addEventListener("input", mostrarTemasLider);
    buscadorTemasLider.closest("form").addEventListener("submit", (e) => e.preventDefault());
    listaTemasLider.addEventListener("click", borrarTemaDeLista);
  }

  // Líder: editar tema (?id=)
  if (formEditarTema) {
    const tema = obtenerTemaDeDireccion();
    if (!tema) {
      location.href = "lecciones.html";
      return;
    }
    llenarFormularioTema(tema);
    formEditarTema.addEventListener("submit", (e) => guardarTemaEditado(e, tema));
    formEditarTema.querySelector('.lcet__acciones a[href="#guardado"]').addEventListener("click", (e) => guardarTemaEditado(e, tema));
    formEditarTema.addEventListener("input", limpiarErrorTema);
    // Si se recarga con #guardado, el aviso viejo no se muestra
    if (location.hash === "#guardado") location.hash = "";
  }

  // Líder: crear módulo
  if (formCrearModulo) {
    if (location.hash === "#creado") location.hash = "";
    formCrearModulo.addEventListener("submit", crearModulo);
    formCrearModulo.querySelector('.lcmo__acciones a[href="#creado"]').addEventListener("click", crearModulo);
    botonAnadirSubtemaModulo.addEventListener("click", mostrarCampoSubtemaModulo);
    grupoSubtemasModulo.addEventListener("click", accionarSubtemaModulo);
    grupoSubtemasModulo.addEventListener("keydown", accionarSubtemaModulo);
    formCrearModulo.addEventListener("input", limpiarErrorTema);
  }

  // Líder: subtemas (?id= del tema) y subtema (?id= para editar o ?tema= para crear)
  if (listaSubtemasLider) {
    let subtema = null;
    if (modalGrabacion) {
      const temaNuevo = idTemaNuevoSubtema ? obtenerTema(idTemaNuevoSubtema) : null;
      subtema = temaNuevo
        ? { id: 0, idTema: temaNuevo.id, titulo: "", descripcion: "", linkGrabacion: "", pdfs: [] }
        : obtenerSubtema(idTemaDireccion);
      if (!subtema) {
        location.href = "subtemas.html";
        return;
      }
    }
    const tema = subtema ? obtenerTema(subtema.idTema) : obtenerTemaDeDireccion();
    if (!tema) {
      location.href = "lecciones.html";
      return;
    }
    const idActual = subtema ? subtema.id : 0;
    const p = prefijoSubtemas;
    mostrarSubtemasLider(tema, idActual);
    // «+ Añadir subtema» abre el modal de subtema.html en modo «nuevo»
    document.querySelector(`.${p}__anadir`).href = `subtema.html?tema=${tema.id}`;
    document.querySelector(`#${p}-buscar`).addEventListener("input", () => mostrarSubtemasLider(tema, idActual));
    document.querySelector(`#${p}-fecha`).addEventListener("change", () => mostrarSubtemasLider(tema, idActual));
    document.querySelector(`#${p}-orden`).addEventListener("change", () => mostrarSubtemasLider(tema, idActual));
    document.querySelector(`.${p}__filtros`).addEventListener("submit", (e) => e.preventDefault());
    listaSubtemasLider.addEventListener("click", (e) => accionarSubtemasLider(e, tema, idActual));

    if (subtema) {
      const estado = { subtema, tema };
      if (location.hash === "#guardado") location.hash = "grabacion";
      abrirSubtemaEnModal(subtema, tema);
      formGrabacion.addEventListener("submit", (e) => guardarSubtemaDesdeModal(e, estado));
      formGrabacion.querySelector('.lsut__botones a[href="#guardado"]').addEventListener("click", (e) => guardarSubtemaDesdeModal(e, estado));
      // El formulario no tiene botón submit: Enter en un campo de texto también guarda
      formGrabacion.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && e.target.matches("input.lsut__input")) guardarSubtemaDesdeModal(e, estado);
      });
      formGrabacion.addEventListener("input", limpiarErrorTema);
      campoLinkGrabacion.addEventListener("input", mostrarDetectado);
      campoPdfGrabacion.addEventListener("change", anadirPdfs);
      zonaMaterialGrabacion.addEventListener("click", quitarPdf);
      avisoGrabacion.querySelector(".lsut__aviso-enlace").addEventListener("click", (e) => deshacerSubtema(e, estado));
      if (!subtema.id) formGrabacion.querySelector("#lsut-nombre").focus();
    }
  }
});
