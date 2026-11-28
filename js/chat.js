// Chat de la party: guarda los mensajes, los muestra agrupados por día y envía los nuevos.
// Páginas: estudiante/chat y lider/chat (necesita perfil.js y party.js cargados antes).
// Responsable: P2 (Perfiles y party).

// ===== Elementos =====
const contenedorMensajes = document.querySelector(".chat__mensajes");
const formChat = document.querySelector(".chat__redactar");
const campoMensajeChat = document.querySelector(".chat__input");
const botonEnviarChat = document.querySelector(".chat__enviar");
const tituloChat = document.querySelector(".chat__titulo a");
const subtituloChat = document.querySelector(".chat__subtitulo");


// ===== Datos =====
const CLAVE_MENSAJES = "bm_mensajes";
const LIMITE_MENSAJE_CHAT = 500;

// { id, idParty, correoAutor, texto, fecha }
const mensajesIniciales = [
  { id: 1, idParty: 1, correoAutor: "lider1@branchmatch.test", texto: "¡Bienvenido al grupo, Tomás!", fecha: "2026-11-15T17:01:00.000Z" },
  { id: 2, idParty: 1, correoAutor: "estudiante1@branchmatch.test", texto: "¡Gracias! Ya estoy practicando grafos.", fecha: "2026-11-15T17:02:00.000Z" },
  { id: 3, idParty: 1, correoAutor: "lider1@branchmatch.test", texto: "¡Oka, nos vemos en la sesión!", fecha: "2026-11-15T18:01:00.000Z" },
];

const obtenerMensajes = () => leerDatos(CLAVE_MENSAJES, mensajesIniciales);

// Los mensajes de una party, del más antiguo al más nuevo
const obtenerMensajesDeParty = (idParty) =>
  obtenerMensajes()
    .filter((m) => m.idParty === idParty)
    .sort((a, b) => a.fecha.localeCompare(b.fecha) || a.id - b.id);

const crearMensaje = (mensaje) => {
  const mensajes = obtenerMensajes();
  const ids = mensajes.map((m) => m.id);
  mensaje.id = Math.max(0, ...ids) + 1;
  mensajes.push(mensaje);
  guardarDatos(CLAVE_MENSAJES, mensajes);
  return mensaje;
};

const editarMensaje = (id, cambios) => {
  const mensajes = obtenerMensajes();
  const posicion = mensajes.findIndex((m) => m.id === id);
  if (posicion === -1) return;
  mensajes[posicion] = { ...mensajes[posicion], ...cambios, id };
  guardarDatos(CLAVE_MENSAJES, mensajes);
};

const borrarMensaje = (id) => {
  guardarDatos(CLAVE_MENSAJES, obtenerMensajes().filter((m) => m.id !== id));
};


// ===== Funciones =====
const formatearHoraChat = (iso) => new Date(iso).toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit", hour12: false });

const obtenerDiaChat = (iso) => {
  const fecha = new Date(iso);
  return fecha.toDateString() === new Date().toDateString() ? "Hoy" : fecha.toLocaleDateString("es-PE");
};

const crearHtmlMensajeChat = (mensaje, correoActual) => {
  const propio = mensaje.correoAutor === correoActual;
  return `
    <li class="chat__item${propio ? " chat__item--propio" : ""}">
      <article class="chat__msg${propio ? " chat__msg--propio" : ""}">
        <p class="chat__meta"><span class="chat__autor">${escaparHtml(obtenerPrimerNombre(mensaje.correoAutor))}</span><time class="chat__hora" datetime="${escaparHtml(mensaje.fecha)}">${formatearHoraChat(mensaje.fecha)}</time></p>
        <p class="chat__texto">${escaparHtml(mensaje.texto)}</p>
      </article>
    </li>`;
};

const mostrarMensajesChat = (party, correoActual) => {
  const mensajes = obtenerMensajesDeParty(party.id);
  if (!mensajes.length) {
    contenedorMensajes.innerHTML = '<p class="chat__dia">Aún no hay mensajes. ¡Sé el primero en saludar!</p>';
    return;
  }
  // Un bloque por día, con su título ("Hoy" o la fecha)
  const dias = [];
  mensajes.forEach((m) => {
    const dia = obtenerDiaChat(m.fecha);
    const grupo = dias.find((d) => d.dia === dia);
    if (grupo) grupo.mensajes.push(m);
    else dias.push({ dia, mensajes: [m] });
  });
  contenedorMensajes.innerHTML = dias
    .map((d) => `<p class="chat__dia">${d.dia}</p><ul class="chat__lista">${d.mensajes.map((m) => crearHtmlMensajeChat(m, correoActual)).join("")}</ul>`)
    .join("");
  contenedorMensajes.scrollTop = contenedorMensajes.scrollHeight;
};

const mostrarCabeceraChat = (party) => {
  const cantidad = party.integrantes.length;
  tituloChat.textContent = party.nombre;
  subtituloChat.textContent = `${cantidad} ${cantidad === 1 ? "integrante" : "integrantes"}`;
};

const enviarMensajeChat = (e, party, sesion) => {
  e.preventDefault();
  const texto = campoMensajeChat.value.trim();
  if (!validarMensajeChat(texto)) return;
  crearMensaje({ idParty: party.id, correoAutor: sesion.correo, texto, fecha: new Date().toISOString() });
  campoMensajeChat.value = "";
  mostrarMensajesChat(party, sesion.correo);
  campoMensajeChat.focus();
};


// ===== Validaciones =====
// Un mensaje vacío no se envía; uno muy largo se corta con el aviso del navegador (maxlength)
const validarMensajeChat = (texto) => {
  const valido = texto.length > 0 && texto.length <= LIMITE_MENSAJE_CHAT;
  campoMensajeChat.setAttribute("aria-invalid", String(!valido));
  if (!valido) campoMensajeChat.focus();
  return valido;
};


// ===== Registro de eventos =====
document.addEventListener("DOMContentLoaded", () => {
  const sesion = obtenerSesion();
  if (!contenedorMensajes || !sesion) return;
  const party = obtenerPartyDe(sesion.correo);

  if (!party) {
    tituloChat.textContent = "Sin party";
    subtituloChat.textContent = sesion.rol === "lider" ? "Crea tu party para chatear" : "Únete a una party para chatear";
    contenedorMensajes.innerHTML = `<p class="chat__dia">Aún no estás en una party.</p>`;
    campoMensajeChat.disabled = true;
    return;
  }

  campoMensajeChat.maxLength = LIMITE_MENSAJE_CHAT;
  mostrarCabeceraChat(party);
  mostrarMensajesChat(party, sesion.correo);

  formChat.addEventListener("submit", (e) => enviarMensajeChat(e, party, sesion));
  botonEnviarChat.addEventListener("click", (e) => enviarMensajeChat(e, party, sesion));
  campoMensajeChat.addEventListener("input", () => campoMensajeChat.removeAttribute("aria-invalid"));

  // Si el mensaje llega desde otra pestaña, el chat se actualiza solo
  window.addEventListener("storage", (e) => {
    if (e.key === CLAVE_MENSAJES) mostrarMensajesChat(party, sesion.correo);
  });
});
