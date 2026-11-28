// Notificaciones: crearlas, listarlas, marcarlas como leídas y mostrar el contador de la campana en la cabecera.
// Páginas: estudiante/notificaciones, lider/notificaciones y toda página con cabecera (el contador de la campana).
// Responsable: P1 (Entrada).

// ===== Elementos =====
const listaNotificaciones = document.querySelector(".notificaciones__lista");
const encabezadoNotificaciones = document.querySelector(".notificaciones__encabezado");
const imagenCampana = document.querySelector(".header__campana");


// ===== Datos =====
const CLAVE_NOTIFICACIONES = "bm_notificaciones";

// Cómo se ve cada tipo de notificación (etiqueta y color del chip)
const tiposNotificacion = {
  aceptada: { etiqueta: "Solicitud aceptada", clase: "chip--menta" },
  rechazada: { etiqueta: "Solicitud rechazada", clase: "chip--rosa" },
  expirada: { etiqueta: "Solicitud expirada", clase: "" },
  nueva: { etiqueta: "Nueva solicitud", clase: "chip--menta" },
  reto: { etiqueta: "Reto", clase: "chip--celeste" },
  correccion: { etiqueta: "Corrección", clase: "chip--rosa" },
  aviso: { etiqueta: "Aviso", clase: "chip--celeste" },
};

// { id, correo, tipo, titulo, texto, datos: [{ nombre, valor }], enlace (desde pages/), textoEnlace, leida, fecha }
const notificacionesIniciales = [
  { id: 1, correo: "estudiante1@branchmatch.test", tipo: "aceptada", titulo: "¡Bienvenido/a al equipo!", texto: "Ya puedes entrar al espacio del grupo y conocer a tus compañeros.", datos: [{ nombre: "Grupo", valor: "Los Chacales" }, { nombre: "Líder", valor: "Jack Lima" }], enlace: "estudiante/party-completa.html", textoEnlace: "Ir al espacio del grupo", leida: false, fecha: "2026-11-15T10:00:00.000Z" },
  { id: 2, correo: "estudiante1@branchmatch.test", tipo: "rechazada", titulo: "Esta vez no hubo match", texto: "No eres tú: el grupo no tiene cupo por ahora. ¡Hay más grupos esperándote!", datos: [{ nombre: "Grupo", valor: "Bit Busters" }, { nombre: "Líder", valor: "Valeria Ríos" }], enlace: "estudiante/unete-party.html", textoEnlace: "Explorar grupos", leida: false, fecha: "2026-11-14T10:00:00.000Z" },
  { id: 3, correo: "estudiante1@branchmatch.test", tipo: "expirada", titulo: "Tu solicitud expiró", texto: "Otro equipo ya te aceptó, así que esta solicitud se cerró automáticamente.", datos: [{ nombre: "Grupo", valor: "Merge Masters" }, { nombre: "Líder", valor: "Camila Torres" }], enlace: "", textoEnlace: "", leida: false, fecha: "2026-11-13T10:00:00.000Z" },
  { id: 4, correo: "lider1@branchmatch.test", tipo: "nueva", titulo: "Un estudiante quiere unirse", texto: "Revisa su perfil y decide si se une a tu party.", datos: [{ nombre: "Estudiante", valor: "Ana Gutiérrez" }, { nombre: "Party", valor: "Los Insanos" }], enlace: "lider/solicitudes.html", textoEnlace: "Ver solicitudes", leida: false, fecha: "2026-11-15T09:00:00.000Z" },
  { id: 5, correo: "lider1@branchmatch.test", tipo: "rechazada", titulo: "Rechazaste una solicitud", texto: "El estudiante ya fue avisado y puede explorar otras parties.", datos: [{ nombre: "Estudiante", valor: "Valeria Ríos" }, { nombre: "Party", valor: "Los Insanos" }], enlace: "lider/solicitudes.html", textoEnlace: "Ver solicitudes", leida: false, fecha: "2026-11-14T09:00:00.000Z" },
  { id: 6, correo: "lider1@branchmatch.test", tipo: "expirada", titulo: "Una solicitud expiró", texto: "Otro equipo ya aceptó al estudiante, así que esta solicitud se cerró automáticamente.", datos: [{ nombre: "Estudiante", valor: "Camila Torres" }, { nombre: "Party", valor: "Los Insanos" }], enlace: "", textoEnlace: "", leida: false, fecha: "2026-11-13T09:00:00.000Z" },
];

const obtenerNotificaciones = () => leerDatos(CLAVE_NOTIFICACIONES, notificacionesIniciales);

// Las notificaciones de un usuario, de la más nueva a la más antigua
const obtenerNotificacionesDe = (correo) =>
  obtenerNotificaciones()
    .filter((n) => n.correo === correo)
    .sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id - a.id);

const contarNoLeidas = (correo) => obtenerNotificacionesDe(correo).filter((n) => !n.leida).length;

// Crea una notificación para un usuario. Los demás archivos la llaman así:
// crearNotificacion(correo, "Texto", { tipo: "aceptada", titulo: "...", datos: [{ nombre: "Party", valor: "..." }], enlace: "estudiante/mi-party.html", textoEnlace: "Ir a mi party" })
const crearNotificacion = (correo, texto, opciones = {}) => {
  const notificaciones = obtenerNotificaciones();
  const ids = notificaciones.map((n) => n.id);
  notificaciones.push({
    id: Math.max(0, ...ids) + 1,
    correo: String(correo).trim().toLowerCase(),
    tipo: opciones.tipo || "aviso",
    titulo: opciones.titulo || "Tienes una novedad",
    texto,
    datos: opciones.datos || [],
    enlace: opciones.enlace || "",
    textoEnlace: opciones.textoEnlace || "",
    leida: false,
    fecha: new Date().toISOString(),
  });
  guardarDatos(CLAVE_NOTIFICACIONES, notificaciones);
};

const editarNotificacion = (id, cambios) => {
  const notificaciones = obtenerNotificaciones();
  const posicion = notificaciones.findIndex((n) => n.id === id);
  if (posicion === -1) return;
  notificaciones[posicion] = { ...notificaciones[posicion], ...cambios, id };
  guardarDatos(CLAVE_NOTIFICACIONES, notificaciones);
};

const borrarNotificacion = (id) => {
  const notificaciones = obtenerNotificaciones().filter((n) => n.id !== id);
  guardarDatos(CLAVE_NOTIFICACIONES, notificaciones);
};

const marcarTodasLeidas = (correo) => {
  const notificaciones = obtenerNotificaciones().map((n) => (n.correo === correo ? { ...n, leida: true } : n));
  guardarDatos(CLAVE_NOTIFICACIONES, notificaciones);
};


// ===== Funciones =====
// Solo se aceptan enlaces internos del tipo "grupo/pagina.html"
const esEnlaceInterno = (enlace) => /^[a-z]+\/[a-z0-9-]+\.html(#[a-z0-9-]*)?$/i.test(enlace);

const crearHtmlNotificacion = (notificacion) => {
  const tipo = tiposNotificacion[notificacion.tipo] || tiposNotificacion.aviso;
  const datos = (notificacion.datos || [])
    .map((dato) => `<div><dt>${escaparHtml(dato.nombre)}:</dt> <dd>${escaparHtml(dato.valor)}</dd></div>`)
    .join("");
  const tieneEnlace = esEnlaceInterno(notificacion.enlace);

  let acciones = "";
  if (tieneEnlace) {
    acciones += `<a class="boton notif__boton" href="../${escaparHtml(notificacion.enlace)}" data-accion="abrir" data-id="${notificacion.id}">${escaparHtml(notificacion.textoEnlace || "Abrir")}</a>`;
    if (!notificacion.leida) {
      acciones += `<a class="boton boton--secundario notif__boton" href="#" data-accion="marcar-leida" data-id="${notificacion.id}">Marcar como leída</a>`;
    }
  } else if (!notificacion.leida) {
    acciones += `<a class="boton boton--secundario notif__boton" href="#" data-accion="marcar-leida" data-id="${notificacion.id}">Aceptar</a>`;
  }

  return `
    <li class="tarjeta notificacion${notificacion.leida ? "" : " notificacion--nueva"}">
      <article class="notificacion__contenido">
        <p class="chip ${tipo.clase}">${escaparHtml(notificacion.etiqueta || tipo.etiqueta)}${notificacion.leida ? "" : '<span class="visualmente-oculto"> (sin leer)</span>'}</p>
        <h2 class="titulo-3">${escaparHtml(notificacion.titulo)}</h2>
        ${datos ? `<dl class="notificacion__datos">${datos}</dl>` : ""}
        <p class="texto-secundario">${escaparHtml(notificacion.texto)}</p>
      </article>
      ${acciones ? `<div class="notif__acciones">${acciones}</div>` : ""}
    </li>`;
};

const mostrarNotificaciones = () => {
  const sesion = obtenerSesion();
  const notificaciones = obtenerNotificacionesDe(sesion.correo);
  listaNotificaciones.innerHTML = notificaciones.length
    ? notificaciones.map(crearHtmlNotificacion).join("")
    : '<li class="tarjeta notif__vacio"><p class="texto-secundario">No tienes notificaciones por ahora.</p></li>';

  const botonTodas = document.querySelector("#boton-marcar-todas");
  if (botonTodas) botonTodas.hidden = contarNoLeidas(sesion.correo) === 0;
  mostrarContadorCampana();
};

// Botón "Marcar todas como leídas" (se crea aquí para no tocar el HTML)
const crearBotonMarcarTodas = () => {
  const boton = document.createElement("a");
  boton.className = "boton boton--secundario notif__marcar-todas";
  boton.id = "boton-marcar-todas";
  boton.href = "#";
  boton.dataset.accion = "marcar-todas";
  boton.textContent = "Marcar todas como leídas";
  encabezadoNotificaciones.appendChild(boton);
};

const accionarNotificacion = (e) => {
  const enlace = e.target.closest("a[data-accion]");
  if (!enlace) return;
  const sesion = obtenerSesion();

  if (enlace.dataset.accion === "marcar-todas") {
    e.preventDefault();
    marcarTodasLeidas(sesion.correo);
    mostrarNotificaciones();
  } else if (enlace.dataset.accion === "marcar-leida") {
    e.preventDefault();
    editarNotificacion(Number(enlace.dataset.id), { leida: true });
    mostrarNotificaciones();
  } else if (enlace.dataset.accion === "abrir") {
    // Se marca como leída y el enlace sigue su camino
    editarNotificacion(Number(enlace.dataset.id), { leida: true });
  }
};

// Número de notificaciones sin leer sobre la campana de la cabecera
const mostrarContadorCampana = () => {
  const sesion = obtenerSesion();
  if (!imagenCampana || !sesion) return;
  const enlaceCampana = imagenCampana.closest("a");
  const cantidad = contarNoLeidas(sesion.correo);

  enlaceCampana.classList.add("campana__enlace");
  let contador = enlaceCampana.querySelector(".campana__contador");
  if (!contador) {
    contador = document.createElement("span");
    contador.className = "campana__contador";
    contador.setAttribute("aria-hidden", "true");
    enlaceCampana.appendChild(contador);
  }
  contador.textContent = cantidad > 99 ? "99+" : cantidad;
  contador.hidden = cantidad === 0;
  imagenCampana.alt = cantidad ? `Notificaciones (${cantidad} sin leer)` : "Notificaciones";
};


// ===== Registro de eventos =====
if (listaNotificaciones && obtenerSesion()) {
  crearBotonMarcarTodas();
  listaNotificaciones.addEventListener("click", accionarNotificacion);
  encabezadoNotificaciones.addEventListener("click", accionarNotificacion);
  mostrarNotificaciones();
} else if (imagenCampana) {
  mostrarContadorCampana();
}
