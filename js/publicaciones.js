// Publicaciones: datos (bm_publicaciones), me gusta, comentarios y la lista «Mis publicaciones».
// Páginas: estudiante/publicaciones, lider/publicaciones y estudiante/inicio (el feed lo usa a través de feed.js).
// Responsable: P3 (Feed y lecciones).

// ===== Elementos =====
const listaMisPublicaciones = document.querySelector(".pub__lista");
const subtituloMisPublicaciones = document.querySelector(".pub__subtitulo");
const pestanaMisPublicaciones = document.querySelector(".pub__pestana");


// ===== Datos =====
const CLAVE_PUBLICACIONES = "bm_publicaciones";
const LIMITE_PUBLICACION = 280;
const LIMITE_COMENTARIO = 200;

// { id, correoAutor, texto, imagen, origen, fecha, megusta: [correo], comentarios: [{ id, correoAutor, texto, fecha }] }
// imagen: ruta desde la raíz del proyecto (o "" si no hay); origen: "Inicio" o "Comunidad"
const publicacionesIniciales = [
  {
    id: 1, correoAutor: "estudiante2@branchmatch.test", texto: "¡Top 10 en el concurso interno! 🏆 Gracias Los Insanos por las sesiones de los jueves.",
    imagen: "assets/img/inicio-publicacion-concurso.png", origen: "Inicio", fecha: "2026-11-16T15:00:00.000Z",
    megusta: ["estudiante1@branchmatch.test", "lider1@branchmatch.test"],
    comentarios: [{ id: 1, correoAutor: "lider1@branchmatch.test", texto: "¡Orgulloso de ustedes! 🔥", fecha: "2026-11-16T15:20:00.000Z" }],
  },
  {
    id: 2, correoAutor: "estudiante1@branchmatch.test", texto: "¿Alguien más se trabó con el problema de caminos mínimos de ayer? Comparto mi solución con Dijkstra y una cola de prioridad.",
    imagen: "", origen: "Comunidad", fecha: "2026-11-16T13:00:00.000Z", megusta: ["estudiante2@branchmatch.test"], comentarios: [],
  },
  {
    id: 3, correoAutor: "lider1@branchmatch.test", texto: "Hackatón el 18/09. ¡Están todos invitados!",
    imagen: "", origen: "Inicio", fecha: "2026-11-15T22:00:00.000Z", megusta: [], comentarios: [],
  },
  {
    id: 4, correoAutor: "estudiante1@branchmatch.test", texto: "Ya pero... python>>>",
    imagen: "", origen: "Inicio", fecha: "2026-11-15T18:30:00.000Z", megusta: ["lider2@branchmatch.test"],
    comentarios: [{ id: 1, correoAutor: "estudiante2@branchmatch.test", texto: "C++ forever 😤", fecha: "2026-11-15T18:45:00.000Z" }],
  },
  {
    id: 5, correoAutor: "lider2@branchmatch.test", texto: "¡Gracias por el apoyo en la última sesión!",
    imagen: "assets/img/inicio-publicacion-codigo.png", origen: "Inicio", fecha: "2026-11-14T20:00:00.000Z", megusta: [], comentarios: [],
  },
];

const obtenerPublicaciones = () => leerDatos(CLAVE_PUBLICACIONES, publicacionesIniciales);

// De la más nueva a la más antigua
const obtenerPublicacionesOrdenadas = () =>
  obtenerPublicaciones().sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id - a.id);

const obtenerPublicacion = (id) => obtenerPublicaciones().find((p) => p.id === id) || null;

const crearPublicacion = (publicacion) => {
  const publicaciones = obtenerPublicaciones();
  const ids = publicaciones.map((p) => p.id);
  publicacion.id = Math.max(0, ...ids) + 1;
  publicaciones.push({ imagen: "", origen: "Inicio", megusta: [], comentarios: [], ...publicacion });
  guardarDatos(CLAVE_PUBLICACIONES, publicaciones);
  return publicacion;
};

const editarPublicacion = (id, cambios) => {
  const publicaciones = obtenerPublicaciones();
  const posicion = publicaciones.findIndex((p) => p.id === id);
  if (posicion === -1) return;
  publicaciones[posicion] = { ...publicaciones[posicion], ...cambios, id };
  guardarDatos(CLAVE_PUBLICACIONES, publicaciones);
};

const borrarPublicacion = (id) => {
  guardarDatos(CLAVE_PUBLICACIONES, obtenerPublicaciones().filter((p) => p.id !== id));
};

// Pone o quita el «me gusta» de una persona
const alternarMeGusta = (id, correo) => {
  const publicacion = obtenerPublicacion(id);
  if (!publicacion) return;
  const megusta = publicacion.megusta.includes(correo)
    ? publicacion.megusta.filter((c) => c !== correo)
    : [...publicacion.megusta, correo];
  editarPublicacion(id, { megusta });
};

const crearComentario = (idPublicacion, comentario) => {
  const publicacion = obtenerPublicacion(idPublicacion);
  if (!publicacion) return;
  const ids = publicacion.comentarios.map((c) => c.id);
  comentario.id = Math.max(0, ...ids) + 1;
  editarPublicacion(idPublicacion, { comentarios: [...publicacion.comentarios, comentario] });
};


// ===== Funciones =====
// Publicaciones con la caja de comentarios abierta (se recuerda mientras la página está abierta)
const comentariosAbiertos = new Set();

// Nombre del autor: del perfil (P2) si está cargado; si no, de la lista de usuarios (P1)
const obtenerNombreAutor = (correo) => {
  if (typeof obtenerNombrePerfil === "function") return obtenerNombrePerfil(correo);
  const usuario = obtenerUsuarios().find((u) => u.correo === correo);
  return usuario ? usuario.nombre : correo;
};

const esLiderAutor = (correo) => obtenerUsuarios().some((u) => u.correo === correo && u.rol === "lider");

// «Líder» o «LV n» para el chip junto al nombre
const obtenerChipAutor = (correo) => {
  if (esLiderAutor(correo)) return "Líder";
  const nivel = typeof obtenerNivelJugador === "function" ? obtenerNivelJugador(correo) : calcularNivelNumero(obtenerXp(correo));
  return `LV ${nivel}`;
};

// Nombre de la party del autor, si party.js está cargado y tiene una
const obtenerPartyAutor = (correo) => {
  if (typeof obtenerPartyDe !== "function") return "";
  const party = obtenerPartyDe(correo);
  return party ? party.nombre : "";
};

// «hace 5 min», «hace 2 h», «hace 3 días»
const formatearHaceTiempo = (iso) => {
  const minutos = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (minutos < 1) return "ahora";
  if (minutos < 60) return `hace ${minutos} min`;
  const horas = Math.round(minutos / 60);
  if (horas < 24) return `hace ${horas} h`;
  const dias = Math.round(horas / 24);
  return `hace ${dias} ${dias === 1 ? "día" : "días"}`;
};

const textoConteoPublicacion = (publicacion) => {
  const comentarios = publicacion.comentarios.length;
  return `♥ ${publicacion.megusta.length} · ${comentarios} ${comentarios === 1 ? "comentario" : "comentarios"}`;
};

const crearHtmlComentario = (comentario) => `
  <li class="pcom__item">
    <p class="pcom__meta"><span class="pcom__autor">${escaparHtml(obtenerNombreAutor(comentario.correoAutor))}</span> · ${formatearHaceTiempo(comentario.fecha)}</p>
    <p class="pcom__texto">${escaparHtml(comentario.texto)}</p>
  </li>`;

// Caja de comentarios de una publicación: la lista y el formulario para añadir uno
const crearHtmlComentarios = (publicacion) => {
  const abierta = comentariosAbiertos.has(publicacion.id);
  const lista = publicacion.comentarios.length
    ? `<ul class="pcom__lista">${publicacion.comentarios.map(crearHtmlComentario).join("")}</ul>`
    : '<p class="pcom__vacio">Aún no hay comentarios. ¡Sé el primero!</p>';
  return `
    <section class="pcom" id="comentarios-${publicacion.id}" aria-label="Comentarios"${abierta ? "" : " hidden"}>
      ${lista}
      <form class="pcom__form" data-id="${publicacion.id}" novalidate>
        <div class="campo pcom__campo">
          <label class="campo__label visualmente-oculto" for="comentario-${publicacion.id}">Escribe un comentario</label>
          <input class="campo__input pcom__input" id="comentario-${publicacion.id}" name="comentario" type="text" placeholder="Escribe un comentario…" required maxlength="${LIMITE_COMENTARIO}">
          <p class="campo__error">Escribe algo para comentar.</p>
        </div>
        <a class="boton pcom__enviar" href="#" data-accion="enviar-comentario" data-id="${publicacion.id}">Comentar</a>
      </form>
    </section>`;
};

// Botón «Me gusta» con su estado (pulsado o no)
const crearAtributosMeGusta = (publicacion, correo) => {
  const pulsado = publicacion.megusta.includes(correo);
  return `data-accion="me-gusta" data-id="${publicacion.id}" aria-pressed="${pulsado}"`;
};

// Tarjeta de «Mis publicaciones»
const crearHtmlMiPublicacion = (publicacion, correo) => {
  const imagen = publicacion.imagen
    ? `<img class="pub__imagen p3pub__imagen" src="../../${escaparHtml(publicacion.imagen)}" alt="Imagen de la publicación">`
    : "";
  const pulsado = publicacion.megusta.includes(correo);
  return `
    <li>
      <article class="tarjeta pub__post">
        <header class="pub__autor">
          <img class="pub__foto" src="../../assets/icons/foto-autor-chico.svg" alt="">
          <div class="pub__datos">
            <p class="pub__nombre">${escaparHtml(obtenerNombreAutor(publicacion.correoAutor))}</p>
            <p class="pub__origen texto-secundario">Publicado en ${escaparHtml(publicacion.origen)} · ${formatearHaceTiempo(publicacion.fecha)}</p>
          </div>
          <a class="p3pub__borrar" href="#" data-accion="borrar-publicacion" data-id="${publicacion.id}" aria-label="Borrar esta publicación"><img class="pub__mas" src="../../assets/icons/puntos.svg" alt=""></a>
        </header>
        <p class="pub__texto">${escaparHtml(publicacion.texto)}</p>
        ${imagen}
        <p class="p3pub__conteo texto-secundario">${textoConteoPublicacion(publicacion)}</p>
        <div class="pub__acciones">
          <a class="pub__accion pub__accion--gusta${pulsado ? " p3-gusta--activo" : ""}" href="#" ${crearAtributosMeGusta(publicacion, correo)}><img class="pub__accion-icono pub__accion-icono--gusta" src="../../assets/icons/me-gusta-grande.svg" alt="">${pulsado ? "Te gusta" : "Me gusta"}</a>
          <a class="pub__accion pub__accion--comentarios" href="#comentarios-${publicacion.id}" data-accion="comentar" data-id="${publicacion.id}" aria-expanded="${comentariosAbiertos.has(publicacion.id)}" aria-controls="comentarios-${publicacion.id}"><img class="pub__accion-icono" src="../../assets/icons/comentarios.svg" alt="">Comentarios (${publicacion.comentarios.length})</a>
        </div>
        ${crearHtmlComentarios(publicacion)}
      </article>
    </li>`;
};

const mostrarMisPublicaciones = () => {
  const sesion = obtenerSesion();
  if (!sesion) return;
  const mias = obtenerPublicacionesOrdenadas().filter((p) => p.correoAutor === sesion.correo);
  const total = mias.length;
  subtituloMisPublicaciones.textContent = `Todas tus publicaciones · ${total} en total`;
  pestanaMisPublicaciones.textContent = `Publicaciones (${total})`;
  listaMisPublicaciones.innerHTML = total
    ? mias.map((p) => crearHtmlMiPublicacion(p, sesion.correo)).join("")
    : '<li><p class="tarjeta p3pub__vacio">Aún no publicaste nada. Comparte algo desde Inicio o en Comunidad.</p></li>';
};

// Acciones de una lista de publicaciones (me gusta, abrir comentarios, comentar y borrar).
// alActualizar vuelve a pintar la lista que llamó (Mis publicaciones o el feed)
const accionarPublicacion = (e, alActualizar) => {
  const enlace = e.target.closest("[data-accion]");
  if (!enlace) return;
  const sesion = obtenerSesion();
  const id = Number(enlace.dataset.id);
  const accion = enlace.dataset.accion;
  if (!sesion || !id) return;
  e.preventDefault();

  if (accion === "me-gusta") {
    alternarMeGusta(id, sesion.correo);
    alActualizar();
    document.querySelector(`[data-accion="me-gusta"][data-id="${id}"]`)?.focus();
  } else if (accion === "comentar") {
    if (comentariosAbiertos.has(id)) comentariosAbiertos.delete(id);
    else comentariosAbiertos.add(id);
    alActualizar();
    if (comentariosAbiertos.has(id)) document.querySelector(`#comentario-${id}`)?.focus();
    else document.querySelector(`[data-accion="comentar"][data-id="${id}"]`)?.focus();
  } else if (accion === "enviar-comentario") {
    enviarComentario(id, sesion, alActualizar);
  } else if (accion === "borrar-publicacion") {
    if (!confirm("¿Borrar esta publicación? No se puede deshacer.")) return;
    borrarPublicacion(id);
    alActualizar();
  }
};

const enviarComentario = (idPublicacion, sesion, alActualizar) => {
  const campo = document.querySelector(`#comentario-${idPublicacion}`);
  if (!campo || !validarTextoPublicacion(campo, LIMITE_COMENTARIO)) return;
  crearComentario(idPublicacion, { correoAutor: sesion.correo, texto: campo.value.trim(), fecha: new Date().toISOString() });
  comentariosAbiertos.add(idPublicacion);
  alActualizar();
  document.querySelector(`#comentario-${idPublicacion}`)?.focus();
};

// Enter en la caja de comentario también comenta
const enviarComentarioConEnter = (e, alActualizar) => {
  const form = e.target.closest(".pcom__form");
  if (!form) return;
  e.preventDefault();
  const sesion = obtenerSesion();
  if (sesion) enviarComentario(Number(form.dataset.id), sesion, alActualizar);
};


// ===== Validaciones =====
// Texto obligatorio y con límite; marca el campo con .campo--error y lo deja enfocado si falla
const validarTextoPublicacion = (campo, limite) => {
  const texto = campo.value.trim();
  const valido = texto.length > 0 && texto.length <= limite;
  const contenedor = campo.closest(".campo");
  if (contenedor) contenedor.classList.toggle("campo--error", !valido);
  campo.setAttribute("aria-invalid", String(!valido));
  if (!valido) campo.focus();
  return valido;
};

// Al escribir se quita el error
const limpiarErrorPublicacion = (e) => {
  const campo = e.target.closest(".campo__input");
  if (!campo) return;
  campo.closest(".campo")?.classList.remove("campo--error");
  campo.removeAttribute("aria-invalid");
};


// ===== Registro de eventos =====
if (listaMisPublicaciones) {
  document.addEventListener("DOMContentLoaded", () => {
    if (!obtenerSesion()) return;
    mostrarMisPublicaciones();
    listaMisPublicaciones.addEventListener("click", (e) => accionarPublicacion(e, mostrarMisPublicaciones));
    listaMisPublicaciones.addEventListener("submit", (e) => enviarComentarioConEnter(e, mostrarMisPublicaciones));
    listaMisPublicaciones.addEventListener("input", limpiarErrorPublicacion);
  });
}
