// Lecciones (bm_lecciones) y progreso (bm_progreso_lecciones): ver la clase de un subtema, marcarla como vista y el avance.
// Páginas: estudiante/leccion (necesita temas.js cargado antes; party.js y perfil.js son opcionales, para el nombre del líder).
// Responsable: P3 (Feed y lecciones).

// ===== Elementos =====
const tarjetaLeccion = document.querySelector(".lcn__leccion");
const enlaceVolverLeccion = document.querySelector(".lcn__volver");
const tituloLeccion = document.querySelector(".lcn__titulo");
const metaLeccion = document.querySelector(".lcn__meta");
const botonVistaLeccion = document.querySelector(".lcn__vista");
const descripcionLeccion = document.querySelector(".lcn__descripcion");
const materialLeccion = document.querySelector(".lcn__material");
const botonPlayLeccion = document.querySelector(".lcn__play");
const tiempoLeccion = document.querySelector(".lcn__tiempo");
const enlaceAnteriorLeccion = document.querySelector(".lcn__anterior");
const enlaceSiguienteLeccion = document.querySelector(".lcn__siguiente");
const tituloLateralLeccion = document.querySelector(".lcn__lateral-titulo");
const chipPosicionLeccion = document.querySelector(".lcn__chip");
const listaSubtemasLeccion = document.querySelector(".lcn__lista");
const rellenoAvanceLeccion = document.querySelector(".lcn__avance-relleno");
const cuentaAvanceLeccion = document.querySelector(".lcn__avance-cuenta");

// ?subtema=3 en la dirección: el subtema cuya lección se ve
const idSubtemaLeccion = Number(new URLSearchParams(location.search).get("subtema"));


// ===== Datos =====
const CLAVE_LECCIONES = "bm_lecciones";
const CLAVE_PROGRESO_LECCIONES = "bm_progreso_lecciones";
const mesesLeccion = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

// { id, idSubtema, titulo, contenido } · una lección por subtema (si falta, se crea al abrirla)
const leccionesIniciales = [
  { id: 1, idSubtema: 1, titulo: "Tipos de grafos", contenido: "Conoce los grafos dirigidos, no dirigidos y ponderados, y cómo se representan con listas y matrices de adyacencia." },
  { id: 2, idSubtema: 2, titulo: "Representación: lista y matriz", contenido: "Compara la lista y la matriz de adyacencia: memoria, tiempo para recorrer vecinos y cuándo usar cada una." },
  { id: 3, idSubtema: 3, titulo: "BFS: recorrido en anchura", contenido: "BFS visita el grafo por niveles con una cola. Sirve para caminos mínimos cuando todas las aristas pesan lo mismo." },
];

// { correo, idLeccion } · lecciones vistas por cada estudiante
const progresoLeccionesIniciales = [
  { correo: "estudiante1@branchmatch.test", idLeccion: 1 },
];

const obtenerLecciones = () => leerDatos(CLAVE_LECCIONES, leccionesIniciales);

const crearLeccion = (leccion) => {
  const lecciones = obtenerLecciones();
  const ids = lecciones.map((l) => l.id);
  leccion.id = Math.max(0, ...ids) + 1;
  lecciones.push(leccion);
  guardarDatos(CLAVE_LECCIONES, lecciones);
  return leccion;
};

const editarLeccion = (id, cambios) => {
  const lecciones = obtenerLecciones();
  const posicion = lecciones.findIndex((l) => l.id === id);
  if (posicion === -1) return;
  lecciones[posicion] = { ...lecciones[posicion], ...cambios, id };
  guardarDatos(CLAVE_LECCIONES, lecciones);
};

const borrarLeccion = (id) => {
  guardarDatos(CLAVE_LECCIONES, obtenerLecciones().filter((l) => l.id !== id));
};

// La lección de un subtema; si todavía no existe, se crea con su título y su descripción
const obtenerLeccionDeSubtema = (subtema) =>
  obtenerLecciones().find((l) => l.idSubtema === subtema.id) ||
  crearLeccion({ idSubtema: subtema.id, titulo: subtema.titulo, contenido: subtema.descripcion || "" });

const obtenerProgresoLecciones = () => leerDatos(CLAVE_PROGRESO_LECCIONES, progresoLeccionesIniciales);

const estaLeccionVista = (correo, idLeccion) => obtenerProgresoLecciones().some((p) => p.correo === correo && p.idLeccion === idLeccion);

// Marca o desmarca una lección como vista
const alternarLeccionVista = (correo, idLeccion) => {
  const progreso = obtenerProgresoLecciones();
  const nuevo = estaLeccionVista(correo, idLeccion)
    ? progreso.filter((p) => !(p.correo === correo && p.idLeccion === idLeccion))
    : [...progreso, { correo, idLeccion }];
  guardarDatos(CLAVE_PROGRESO_LECCIONES, nuevo);
};

// Cuántos subtemas de un tema vio una persona
const contarVistasDeTema = (correo, idTema) =>
  obtenerSubtemasDeTema(idTema).filter((s) => {
    const leccion = obtenerLecciones().find((l) => l.idSubtema === s.id);
    return leccion && estaLeccionVista(correo, leccion.id);
  }).length;


// ===== Funciones =====
// «15 de octubre»
const formatearFechaLeccion = (iso) => {
  const [, mes, dia] = iso.split("-").map(Number);
  return `${dia} de ${mesesLeccion[mes - 1]}`;
};

// Nombre del líder de la party del estudiante (si party.js está cargado)
const obtenerLiderLeccion = (correo) => {
  if (typeof obtenerPartyDe !== "function") return "";
  const party = obtenerPartyDe(correo);
  if (!party) return "";
  if (typeof obtenerNombrePerfil === "function") return obtenerNombrePerfil(party.correoLider);
  const lider = obtenerUsuarios().find((u) => u.correo === party.correoLider);
  return lider ? lider.nombre : "";
};

// Ancho de la barra de avance en pasos de 10 % (clases p3lec-ancho--0 … --100)
const claseAnchoAvance = (vistas, total) => `p3lec-ancho--${total ? Math.round((vistas / total) * 10) * 10 : 0}`;

const crearHtmlFilaSubtema = (subtema, posicion, actual, correo) => {
  const leccion = obtenerLecciones().find((l) => l.idSubtema === subtema.id);
  const vista = leccion && estaLeccionVista(correo, leccion.id);
  const esActual = subtema.id === actual.id;
  const marca = esActual ? "►&nbsp; " : `${posicion}. `;
  const tiempo = subtema.linkGrabacion ? subtema.duracion || "Grabación" : "Sin grabación";
  return `
    <li><a class="lcn__fila${esActual ? " lcn__fila--actual" : ""}" href="leccion.html?subtema=${subtema.id}"${esActual ? ' aria-current="page"' : ""}>
      <span class="lcn__fila-nombre">${marca}${escaparHtml(subtema.titulo)}${vista ? '<span class="p3lec__visto"> ✓<span class="visualmente-oculto"> vista</span></span>' : ""}</span>
      <span class="lcn__fila-tiempo">${escaparHtml(tiempo)}</span>
    </a></li>`;
};

const crearHtmlMaterial = (pdf) => `
  <div class="lcn__material p3lec__material">
    <span class="lcn__pdf">PDF</span>
    <div class="lcn__material-info">
      <p class="lcn__material-nombre">${escaparHtml(pdf.nombre)}</p>
      <p class="lcn__material-dato">Material de la clase · ${escaparHtml(pdf.tamano || "")}</p>
    </div>
    <a class="lcn__descargar" href="${pdf.url ? escaparHtml(pdf.url) : "#"}" data-accion="descargar-pdf"${pdf.url ? ' target="_blank" rel="noopener"' : ""}><img class="lcn__descargar-icono" src="../../assets/icons/leccion-descargar.svg" alt="">Descargar<span class="visualmente-oculto"> ${escaparHtml(pdf.nombre)}</span></a>
  </div>`;

const mostrarLeccion = (subtema, sesion) => {
  const tema = obtenerTema(subtema.idTema);
  const subtemas = obtenerSubtemasDeTema(subtema.idTema);
  const posicion = subtemas.findIndex((s) => s.id === subtema.id);
  const leccion = obtenerLeccionDeSubtema(subtema);
  const vista = estaLeccionVista(sesion.correo, leccion.id);
  const lider = obtenerLiderLeccion(sesion.correo);

  document.title = `${leccion.titulo} · BranchMatch`;
  enlaceVolverLeccion.href = `tema.html?id=${tema.id}`;
  enlaceVolverLeccion.lastChild.textContent = ` Volver a ${tema.titulo}`;
  tituloLeccion.textContent = leccion.titulo;
  metaLeccion.textContent = [subtema.linkGrabacion ? "Clase grabada" : "Sin grabación todavía", lider, formatearFechaLeccion(subtema.fecha)].filter(Boolean).join(" · ");
  descripcionLeccion.textContent = leccion.contenido || subtema.descripcion || "Tu líder aún no escribió el contenido de esta lección.";

  // Botón de vista: pulsado o no
  botonVistaLeccion.textContent = vista ? "✓ Vista" : "✓ Marcar como vista";
  botonVistaLeccion.setAttribute("aria-pressed", String(vista));
  botonVistaLeccion.classList.toggle("boton--secundario", vista);

  // Video: abre la grabación en otra pestaña; si no hay, se oculta el botón de reproducir
  botonPlayLeccion.hidden = !subtema.linkGrabacion;
  if (subtema.linkGrabacion) {
    botonPlayLeccion.href = subtema.linkGrabacion;
    botonPlayLeccion.target = "_blank";
    botonPlayLeccion.rel = "noopener";
    botonPlayLeccion.setAttribute("aria-label", `Ver la grabación de ${leccion.titulo} (se abre en otra pestaña)`);
  }
  tiempoLeccion.textContent = subtema.linkGrabacion ? `00:00 / ${subtema.duracion || "--:--"}` : "Sin grabación";

  // Material: uno por PDF (el diseño trae un bloque de ejemplo que se reemplaza)
  document.querySelectorAll(".p3lec__material").forEach((n) => n.remove());
  materialLeccion.hidden = true;
  const material = subtema.pdfs.length
    ? subtema.pdfs.map(crearHtmlMaterial).join("")
    : '<p class="lcn__material-dato p3lec__material">Esta clase no tiene material en PDF.</p>';
  materialLeccion.insertAdjacentHTML("afterend", material);

  // Anterior y siguiente dentro del tema
  const anterior = subtemas[posicion - 1];
  const siguiente = subtemas[posicion + 1];
  enlaceAnteriorLeccion.hidden = !anterior;
  enlaceSiguienteLeccion.hidden = !siguiente;
  if (anterior) enlaceAnteriorLeccion.href = `leccion.html?subtema=${anterior.id}`;
  if (siguiente) {
    enlaceSiguienteLeccion.href = `leccion.html?subtema=${siguiente.id}`;
    enlaceSiguienteLeccion.textContent = `Siguiente: ${siguiente.titulo} →`;
  }

  // Lateral: subtemas del tema y avance
  tituloLateralLeccion.textContent = `Subtemas de ${tema.titulo}`;
  chipPosicionLeccion.textContent = `${posicion + 1} de ${subtemas.length}`;
  listaSubtemasLeccion.innerHTML = subtemas.map((s, i) => crearHtmlFilaSubtema(s, i + 1, subtema, sesion.correo)).join("");
  const vistas = contarVistasDeTema(sesion.correo, tema.id);
  rellenoAvanceLeccion.className = `lcn__avance-relleno ${claseAnchoAvance(vistas, subtemas.length)}`;
  cuentaAvanceLeccion.textContent = `${vistas} / ${subtemas.length}`;
};

const marcarLeccionVista = (e, subtema, sesion) => {
  e.preventDefault();
  alternarLeccionVista(sesion.correo, obtenerLeccionDeSubtema(subtema).id);
  mostrarLeccion(subtema, sesion);
  botonVistaLeccion.focus();
};

// Los PDFs de ejemplo no tienen archivo real: se avisa en vez de navegar a «#»
const descargarPdfLeccion = (e) => {
  const enlace = e.target.closest('[data-accion="descargar-pdf"]');
  if (!enlace || enlace.getAttribute("href") !== "#") return;
  e.preventDefault();
  alert("Este PDF es de ejemplo: el archivo no está disponible para descargar.");
};


// ===== Registro de eventos =====
if (tarjetaLeccion) {
  document.addEventListener("DOMContentLoaded", () => {
    const sesion = obtenerSesion();
    if (!sesion) return;
    // Sin ?subtema= (o si no existe) se abre el primer subtema del primer tema
    const primerTema = obtenerTemasLecciones()[0];
    const subtema = obtenerSubtema(idSubtemaLeccion) || (primerTema && obtenerSubtemasDeTema(primerTema.id)[0]);
    if (!subtema) {
      location.href = "lecciones.html";
      return;
    }
    mostrarLeccion(subtema, sesion);
    botonVistaLeccion.addEventListener("click", (e) => marcarLeccionVista(e, subtema, sesion));
    tarjetaLeccion.addEventListener("click", descargarPdfLeccion);
  });
}
