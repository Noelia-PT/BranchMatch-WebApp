// Feed de Inicio: crear publicaciones, me gusta, comentar y la tarjeta del perfil con los datos de la sesión.
// Páginas: estudiante/inicio (necesita publicaciones.js cargado antes; perfil.js y party.js son opcionales).
// Responsable: P3 (Feed y lecciones).

// ===== Elementos =====
const seccionFeed = document.querySelector(".ifd__feed");
const formFeed = document.querySelector(".ifd__compositor");
const campoPublicacionFeed = document.querySelector("#ifd-publicacion");
const botonPublicarFeed = document.querySelector(".ifd__publicar");
const avisoNuevasFeed = document.querySelector(".ifd__nuevas");
const nombrePerfilFeed = document.querySelector(".ifd__perfil-nombre a");
const fotoPerfilFeed = document.querySelector(".ifd__perfil-img");
const usuarioPerfilFeed = document.querySelector(".ifd__perfil-usuario");
const chipNivelFeed = document.querySelector(".ifd__perfil-chips .chip--amarillo");
const partyPerfilFeed = document.querySelector(".ifd__perfil-party");
const nivelBarraFeed = document.querySelector(".ifd__perfil-xp .barra-xp__nivel");


// ===== Funciones =====
const crearHtmlPublicacionFeed = (publicacion, correo) => {
  const nombre = obtenerNombreAutor(publicacion.correoAutor);
  const party = obtenerPartyAutor(publicacion.correoAutor);
  const imagen = publicacion.imagen
    ? `<img class="ifd__foto" src="../../${escaparHtml(publicacion.imagen)}" alt="Imagen de la publicación de ${escaparHtml(nombre)}">`
    : "";
  const pulsado = publicacion.megusta.includes(correo);
  const abierta = comentariosAbiertos.has(publicacion.id);
  return `
    <article class="ifd__pub">
      <header class="ifd__pub-cab">
        <span class="ifd__pub-avatar" aria-hidden="true">${escaparHtml(obtenerIniciales(nombre))}</span>
        <div class="ifd__pub-info">
          <div class="ifd__pub-titulo">
            <h3 class="ifd__autor">${escaparHtml(nombre)}</h3>
            <span class="chip chip--amarillo ifd__chip">${obtenerChipAutor(publicacion.correoAutor)}</span>
          </div>
          <p class="ifd__meta">${party ? `${escaparHtml(party)} · ` : ""}${formatearHaceTiempo(publicacion.fecha)}</p>
        </div>
      </header>
      <p class="ifd__texto">${escaparHtml(publicacion.texto)}</p>
      ${imagen}
      <div class="ifd__pub-pie">
        <p class="ifd__conteo">${textoConteoPublicacion(publicacion)}</p>
        <ul class="ifd__acciones">
          <li><a class="ifd__accion ifd__accion--like${pulsado ? " p3-gusta--activo" : ""}" href="#" ${crearAtributosMeGusta(publicacion, correo)}><img class="ifd__me-gusta" src="../../assets/icons/inicio-me-gusta.svg" alt="">${pulsado ? "Te gusta" : "Me gusta"}</a></li>
          <li><a class="ifd__accion" href="#comentarios-${publicacion.id}" data-accion="comentar" data-id="${publicacion.id}" aria-expanded="${abierta}" aria-controls="comentarios-${publicacion.id}"><img class="ifd__accion-icono" src="../../assets/icons/inicio-mensaje.svg" alt="">Comentar</a></li>
        </ul>
      </div>
      ${crearHtmlComentarios(publicacion)}
    </article>`;
};

const mostrarFeed = () => {
  const sesion = obtenerSesion();
  if (!sesion) return;
  const publicaciones = obtenerPublicacionesOrdenadas();
  const html = publicaciones.length
    ? publicaciones.map((p) => crearHtmlPublicacionFeed(p, sesion.correo)).join("")
    : '<p class="tarjeta p3pub__vacio">Todavía no hay publicaciones. ¡Escribe la primera!</p>';
  // Se conserva el título oculto de la sección y se reemplazan las tarjetas
  seccionFeed.innerHTML = `<h2 class="visualmente-oculto" id="ifd-feed">Publicaciones</h2>${html}`;
};

// Tarjeta de la izquierda con los datos del usuario en sesión
const mostrarPerfilFeed = () => {
  const sesion = obtenerSesion();
  if (!sesion || !nombrePerfilFeed) return;
  const nombre = obtenerNombreAutor(sesion.correo);
  const chip = obtenerChipAutor(sesion.correo);
  const party = obtenerPartyAutor(sesion.correo);
  nombrePerfilFeed.textContent = nombre;
  fotoPerfilFeed.alt = `Foto de ${nombre}`;
  if (typeof obtenerPerfil === "function") {
    const usuario = obtenerPerfil(sesion.correo).usuario;
    usuarioPerfilFeed.textContent = usuario ? `@${String(usuario).replace(/^@/, "")}` : "";
  }
  chipNivelFeed.textContent = chip;
  nivelBarraFeed.textContent = chip;
  partyPerfilFeed.textContent = party ? `· ${party}` : "· Sin party";
};

const publicarEnFeed = (e) => {
  e.preventDefault();
  const sesion = obtenerSesion();
  if (!sesion || !validarTextoPublicacion(campoPublicacionFeed, LIMITE_PUBLICACION)) return;
  crearPublicacion({ correoAutor: sesion.correo, texto: campoPublicacionFeed.value.trim(), origen: "Inicio", fecha: new Date().toISOString() });
  // reset() vacía el campo y además le quita la marca de «inválido» del navegador
  formFeed.reset();
  mostrarFeed();
  campoPublicacionFeed.focus();
};


// ===== Registro de eventos =====
if (seccionFeed) {
  document.addEventListener("DOMContentLoaded", () => {
    if (!obtenerSesion()) return;
    // El aviso de «publicaciones nuevas» del diseño no aplica: el feed siempre está al día
    if (avisoNuevasFeed) avisoNuevasFeed.hidden = true;
    mostrarPerfilFeed();
    mostrarFeed();
    seccionFeed.addEventListener("click", (e) => accionarPublicacion(e, mostrarFeed));
    seccionFeed.addEventListener("submit", (e) => enviarComentarioConEnter(e, mostrarFeed));
    seccionFeed.addEventListener("input", limpiarErrorPublicacion);
  });
}

if (formFeed) {
  formFeed.addEventListener("submit", publicarEnFeed);
  botonPublicarFeed.addEventListener("click", publicarEnFeed);
  campoPublicacionFeed.addEventListener("input", limpiarErrorPublicacion);
}
